// scripts/lib/latin-guard.ts
// Anti-bleed guard: PT/ES content must use only Latin script (+ the accents,
// IPA symbols, and punctuation our lessons legitimately use). The generation
// LLM occasionally injects characters from other writing systems (CJK,
// Cyrillic, Hangul…); this flags them so the pipeline can reject/repair.

// Code-point ranges of *other writing systems* — the actual "bleed" the
// highspeed model leaks. We block-list these (rather than allow-list Latin)
// so legitimate non-Latin symbols pass: math/linguistic signs (∅ ≠ ≈ ←),
// IPA (ʃ ˈ χ), arrows (→), combining diacritics, Latin Extended Additional
// (ẽ), and the BR/PT flag emojis (🇧🇷 🇵🇹) used as variant markers.
const BLOCKED_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x0400, 0x052f], // Cyrillic + Supplement
  [0x0590, 0x05ff], // Hebrew
  [0x0600, 0x06ff], // Arabic
  [0x3000, 0x303f], // CJK Symbols & Punctuation
  [0x3040, 0x30ff], // Hiragana + Katakana
  [0x3400, 0x4dbf], // CJK Extension A
  [0x4e00, 0x9fff], // CJK Unified Ideographs
  [0xf900, 0xfaff], // CJK Compatibility Ideographs
  [0x1100, 0x11ff], // Hangul Jamo
  [0xac00, 0xd7af], // Hangul Syllables
];

function isBlocked(cp: number): boolean {
  for (const [lo, hi] of BLOCKED_RANGES) if (cp >= lo && cp <= hi) return true;
  return false;
}

// ── Griego (2026-09-03, Paso 0 de latín y griego antiguo) ─────────────
//
// El griego NO está en `BLOCKED_RANGES`, y no por descuido: **el IPA usa
// letras griegas**. Medido sobre el plano de datos generado de las cuatro
// lenguas, hay 5 caracteres griegos y los 5 son IPA — la /χ/ del `r`
// final del manifest de PT y la β de `[bɨˈβidɐ]` en `b3.json`. Meter el
// bloque griego entero en la lista habría marcado esos 5 en la primera
// pasada, y un gate que marca de más se deja de leer.
//
// La regla que sí discrimina, y es barata: **el IPA aparece SUELTO entre
// latinas; la escritura griega aparece en RUNS.** Se marca una carrera de
// DOS O MÁS letras griegas seguidas (los diacríticos combinantes no
// rompen la carrera: en NFD una vocal politónica es letra + marca).
//
// Medido antes de escribirlo: runs de ≥2 en contenido generado de
// pt/ro/cs/ru = **0**. Los 99 runs que existen en el repo están todos en
// `ro/lecturas/` —Odobescu citando a Jenofonte, Filimon con el griego
// fanariota— y `verify-content` no mira `lecturas/`, así que quedan
// fuera por diseño y no por suerte.
const GRIEGO = /[Ͱ-Ͽἀ-῿]/u;
const COMBINANTE = /[̀-ͯ]/u;
/** ≥2 letras griegas seguidas = escritura, no símbolo fonético. */
const PALABRA_GRIEGA = /[Ͱ-Ͽἀ-῿][̀-ͯ]*(?:[Ͱ-Ͽἀ-῿][̀-ͯ]*)+/gu;

export interface GuardOpts {
  /** El contenido ES griego (lang `grc`): la escritura griega es legítima
   *  y sólo se persiguen las demás. Nunca se activa por adivinanza. */
  permitirGriego?: boolean;
}

/** Returns every character (in order, not deduped) from a foreign writing system. */
export function findNonLatin(text: string, opts: GuardOpts = {}): string[] {
  const marcados = new Map<number, string>();
  let i = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp !== undefined && isBlocked(cp)) marcados.set(i, ch);
    i += ch.length;
  }
  if (!opts.permitirGriego) {
    PALABRA_GRIEGA.lastIndex = 0;
    for (const m of text.matchAll(PALABRA_GRIEGA)) {
      const inicio = m.index ?? 0;
      for (let k = 0; k < m[0].length; k++) {
        const c = m[0][k]!;
        // Las marcas combinantes son del alfabeto que acompañan, no una
        // escritura ajena: se dejan fuera del informe para que la lista de
        // ofensores siga siendo legible.
        if (!COMBINANTE.test(c)) marcados.set(inicio + k, c);
      }
    }
  }
  return [...marcados.entries()].sort((a, b) => a[0] - b[0]).map(([, c]) => c);
}

/** ¿Hay escritura griega (sea suelta o en palabra)? Lo usa el guard
 *  positivo del griego, que pregunta lo contrario que éste. */
export function tieneGriego(text: string): boolean {
  return GRIEGO.test(text);
}

/** Throws if `text` contains non-Latin script, naming the label and offenders. */
export function assertLatinScript(text: string, label: string): void {
  const bad = findNonLatin(text);
  if (bad.length > 0) {
    const uniq = [...new Set(bad)].join(' ');
    throw new Error(`Non-Latin script in ${label}: ${uniq} (in "${text.slice(0, 60)}")`);
  }
}

/** Recursively collect every non-Latin char found in any string value of `obj`. */
export function findNonLatinDeep(obj: unknown): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === 'string') out.push(...findNonLatin(v));
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(obj);
  return out;
}
