// scripts/lib/minimax-llm.ts
import Anthropic from '@anthropic-ai/sdk';
import { LLM_BASE_URL, LLM_MODEL, requireApiKey } from '@/scripts/config';

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (!_client) {
    _client = new Anthropic({
      baseURL: LLM_BASE_URL,
      apiKey: requireApiKey(),
      timeout: 60_000, // 60s per request
    });
  }
  return _client;
}

export interface LlmCallParams {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}

export interface LlmCallResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

export class TruncationError extends Error {
  constructor() { super('LLM response truncated (stop_reason=max_tokens). Reduce batch size.'); }
}
export class RefusalError extends Error {
  constructor(msg: string) { super(`LLM refused: ${msg.slice(0, 200)}`); }
}
export class EmptyResponseError extends Error {
  constructor(blocks: unknown[]) { super(`LLM returned no text blocks. Got: ${JSON.stringify(blocks).slice(0, 200)}`); }
}

const REFUSAL_REGEX = /cannot|I'm unable|lo siento|desculpe.*não/i;

export async function callLlm(params: LlmCallParams): Promise<LlmCallResult> {
  const res = await withBackoff(() => client().messages.create({
    model: LLM_MODEL,
    max_tokens: params.maxTokens ?? 4000,
    temperature: params.temperature ?? 0.4,
    system: params.system,
    messages: [{ role: 'user', content: params.user }],
  }));

  if (res.stop_reason === 'max_tokens') {
    throw new TruncationError();
  }

  const parts: string[] = [];
  for (const block of res.content) {
    if (block.type === 'text') parts.push(block.text);
  }
  if (parts.length === 0) {
    throw new EmptyResponseError(res.content);
  }
  const text = parts.join('\n').trim();

  if (REFUSAL_REGEX.test(text)) {
    throw new RefusalError(text);
  }

  return {
    text,
    inputTokens: res.usage.input_tokens,
    outputTokens: res.usage.output_tokens,
  };
}

// Retry con backoff exponencial y jitter. Reintenta 429 (parseando Retry-After),
// 5xx, y timeouts. NO reintenta TruncationError, RefusalError, 4xx con model_not_found.
async function withBackoff<T>(fn: () => Promise<T>, attempts = 5): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastErr = err;
      const status = err?.status ?? err?.statusCode;
      if (status === 400 && /model_not_found|deprecated/i.test(String(err?.error?.type ?? err?.message ?? ''))) {
        throw err; // no retry
      }
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw err; // 4xx (except 429) → fail fast
      }
      if (i === attempts - 1) break;
      const retryAfter = err?.headers?.['retry-after'] ? Number(err.headers['retry-after']) * 1000 : 0;
      const base = 1000 * Math.pow(2, i);
      const jitter = Math.random() * 500;
      const delay = Math.max(retryAfter, base + jitter);
      await new Promise(r => setTimeout(r, Math.min(delay, 30_000)));
    }
  }
  throw lastErr;
}

// Extrae JSON de respuestas que pueden traer fences, prosa circundante, comas
// trailing, etc. Estrategia: strip fences, encontrar el primer [ o {, parsear
// substring, reparar trailing-comma con reintento, fallar con mensaje útil.
export function extractJson(raw: string): unknown {
  const stripped = raw.replace(/^```(?:json)?\s*\n/, '').replace(/\n```\s*$/, '').trim();
  const i = stripped.search(/[\[{]/);
  if (i === -1) {
    throw new Error(`No JSON found in LLM response. Raw start: ${raw.slice(0, 200)}`);
  }
  // Walk brackets to find the matching close instead of relying on lastIndexOf.
  const substr = stripped.slice(i);
  const end = findBalancedEnd(substr);
  if (end === -1) {
    throw new Error(`Unbalanced JSON delimiters. Raw: ${raw.slice(0, 200)}`);
  }
  let candidate = substr.slice(0, end + 1);
  try {
    return JSON.parse(candidate);
  } catch (firstErr) {
    // Intento 1: strip trailing commas (LLMs las emiten constantemente).
    const repaired = candidate.replace(/,(\s*[\]}])/g, '$1');
    try {
      return JSON.parse(repaired);
    } catch (secondErr) {
      // Intento 2: repair literal newlines/tabs inside JSON string values.
      // Walk the candidate char-by-char tracking in-string state; replace bare
      // \n, \r, \t that appear inside a string literal with their escape sequences.
      const inStringRepaired = repairLiteralNewlinesInStrings(repaired);
      try {
        return JSON.parse(inStringRepaired);
      } catch (thirdErr) {
        throw new Error(
          `Failed to parse JSON after all repair attempts (trailing-comma, in-string newlines). ` +
          `Original: ${firstErr instanceof Error ? firstErr.message : firstErr}. ` +
          `After trailing-comma repair: ${secondErr instanceof Error ? secondErr.message : secondErr}. ` +
          `After newline repair: ${thirdErr instanceof Error ? thirdErr.message : thirdErr}. ` +
          `Raw start: ${raw.slice(0, 200)}`
        );
      }
    }
  }
}

function findBalancedEnd(s: string): number {
  const opener = s[0];
  const closer = opener === '[' ? ']' : '}';
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === opener) depth++;
    else if (c === closer) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

// Replace literal newline/carriage-return/tab characters that appear INSIDE
// JSON string literals with their two-character escape equivalents.
// Uses the same in-string state machine as findBalancedEnd (tracks \" escapes).
function repairLiteralNewlinesInStrings(s: string): string {
  const out: string[] = [];
  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i] as string;
    if (escape) {
      escape = false;
      out.push(c);
      continue;
    }
    if (c === '\\') {
      escape = true;
      out.push(c);
      continue;
    }
    if (c === '"') {
      inString = !inString;
      out.push(c);
      continue;
    }
    if (inString) {
      if (c === '\n') { out.push('\\n'); continue; }
      if (c === '\r') { out.push('\\r'); continue; }
      if (c === '\t') { out.push('\\t'); continue; }
    }
    out.push(c);
  }
  return out.join('');
}
