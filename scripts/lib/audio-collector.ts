// scripts/lib/audio-collector.ts
import type { Exercise, ExerciseType } from './zod-schemas';
import { ExerciseDataByTypeSchema } from './zod-schemas';
import { type VariantKey, DEFAULT_VARIANT } from '@/lib/data/variant';

export interface AudioJob {
  text: string;
  variant: VariantKey;
}

/**
 * Devuelve los strings audio-eligible para un exercise y variante dados.
 * Re-valida el resultado del spread data + variantOverrides[variant]
 * (con fallback a `pt-br` solo para keys legacy/desconocidas) contra el
 * schema del tipo declarado: si el override tenía campos inválidos, throw.
 *
 * Audio NO emitido para: fill_blank (la frase entera tendría audio pero su
 * valor pedagógico es bajo y haría inflar el cache 2x). verb_preposition igual.
 * sentence_construction emite el answer (la oración correcta).
 *
 * Phase 1 (multi-idioma): el switch sobre el tipo `translation` mira la
 * dirección (`sourceLang`/`targetLang`) para decidir si emitir el `source`
 * o el `target`. Para `translation` es→pt emitimos `target` (PT); para
 * pt→es emitimos `source` (PT). Si sourceLang/targetLang no están, fallback
 * al default es→pt.
 */
export function textsFor(ex: Exercise, variant: VariantKey): string[] {
  // Reglas de override (Phase 1 multi-idioma):
  // - Variant canónica (`pt-br` o `pt-pt`): sin override → datos base;
  //   con override propio → ese override. NUNCA cae al DEFAULT_VARIANT
  //   (eso aplicaría semántica PT-BR a un usuario que pidió PT-PT).
  // - Variant legacy `'pt'`: cae al override de `pt-br` (compat con el
  //   contenido pre-Phase-1, donde `ptOverrides` aplicaba a la "variante PT").
  // - Variant legacy `'br'` o cualquier otra desconocida: no aplica override
  //   (preserva el comportamiento original de la app single-target PT-BR).
  let overrides: unknown;
  if (variant === 'pt') {
    overrides = ex.variantOverrides?.['pt'] ?? ex.variantOverrides?.[DEFAULT_VARIANT];
  } else if (variant === 'pt-br' || variant === 'pt-pt') {
    overrides = ex.variantOverrides?.[variant];
  } else {
    // 'br' o desconocido: sin override.
    overrides = undefined;
  }
  if (overrides) {
    const merged = { ...ex.data, ...overrides };
    // re-validar contra el schema del tipo declarado
    ExerciseDataByTypeSchema[ex.type].parse(merged);
  }
  const data: any = overrides ? { ...ex.data, ...overrides } : ex.data;
  const t: ExerciseType = ex.type;
  switch (t) {
    case 'flashcard':
      return data.back ? [data.back] : [];
    case 'listening':
      return data.audioText ? [data.audioText] : [];
    case 'translation': {
      // Dirección: si sourceLang==='es' y targetLang empieza con 'pt',
      // el usuario lee el `source` (es) y produce el `target` (pt) → emitimos target.
      // Para el caso contrario, emitimos source.
      const isEsToPt = data.sourceLang === 'es' && /^pt/.test(data.targetLang ?? '');
      if (isEsToPt) {
        return data.target ? [data.target] : [];
      }
      return data.source ? [data.source] : [];
    }
    case 'sentence_construction':
      return data.answer?.length ? [data.answer.join(' ')] : [];
    case 'chunk':
      return data.chunk ? [data.chunk] : [];
    case 'fill_blank':
    case 'verb_preposition':
    case 'lesson':
      return [];
  }
}

export function collectAudioJobs(exercises: Exercise[]): AudioJob[] {
  // Phase 1: para PT, iteramos las dos variantes activas. Los scaffolds
  // RU/RO/CS (Phase 5) añadirán sus claves aquí.
  const variants: VariantKey[] = ['pt-br', 'pt-pt'];
  const seen = new Set<string>();
  const jobs: AudioJob[] = [];
  for (const ex of exercises) {
    for (const variant of variants) {
      for (const text of textsFor(ex, variant)) {
        const key = `${variant}::${text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        jobs.push({ text, variant });
      }
    }
  }
  return jobs;
}

// ─── L5: Lesson example audio (MDX-derived) ────────────────────────
//
// Lesson audio doesn't live on an Exercise — it lives inside the MDX
// content (each `<Example>` has a PT sentence that needs TTS). This
// helper extracts the PT text from the `<Example>` JSX bodies of a
// lesson's MDX file, in declaration order, so `generate-audio.ts`
// can produce one audio hash per example and append it to
// `audio-refs.json` (next to the lesson JSON).
//
// L5 status: STUB. We parse the MDX with a regex (not a real parser)
// because real audio generation is the next phase — for now the
// function returns `[]` so `generate-audio.ts` doesn't crash and the
// audio-refs sidecar stays empty (the renderer falls back to "no audio"
// gracefully). The parser itself is left in place so a future LLM call
// or hand-authored content drops in without touching the wiring.
//
// Format we look for (see components/lessons/mdx-components.tsx for the
// canonical `<Example>` prop list):
//
//   <Example index={N} audioRef={N}>PT sentence\n\nES translation</Example>
//
// We deliberately use `pt=` syntax in the future; for L5 the simple
// "text inside the tag" assumption is good enough because that's the
// format the renderer + LLM prompt template will produce.

export function lessonExampleTexts(mdxPath: string, mdxBody: string): string[] {
  // STUB: log and return empty. We accept (and discard) the body so
  // the future real parser can pick up the exact same signature
  // without callers changing.
  console.log(
    `lesson audio: skipping (no LLM call yet) — ${mdxPath} has ${countExampleTags(mdxBody)} <Example> tag(s)`,
  );
  return [];
}

/** Quick-and-dirty counter for the stub's log message. Returns the
 *  number of `<Example` opening tags in `body`. We deliberately avoid
 *  pulling a real MDX parser for the stub — a substring count is
 *  sufficient diagnostic output. */
function countExampleTags(body: string): number {
  let count = 0;
  let i = 0;
  while ((i = body.indexOf('<Example', i)) !== -1) {
    count++;
    i += '<Example'.length;
  }
  return count;
}
