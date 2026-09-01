// lib/exercises/normalize.ts
// Shared answer normalizer for text-input exercise cards. Accents are
// significant (PT minimal pairs like estão/estao differ); we only trim,
// lowercase, and NFC-normalize so composed vs decomposed accents match.
export function normalizeAnswer(s: string): string {
  return s.trim().toLowerCase().normalize('NFC');
}
export function answersMatch(a: string, b: string): boolean {
  return normalizeAnswer(a) === normalizeAnswer(b);
}

/** Igual que `answersMatch`, pero el SIGNO FINAL de la clave es opcional.
 *
 *  Existe porque en un ejercicio cuya respuesta es una frase entera, el
 *  punto final no es lengua: quien escribe «Comprei-a na estação» sin
 *  punto ha hecho la transformación perfecta, y suspenderlo mete un fallo
 *  falso en el FSRS — la misma familia que el cloze sin pista y el
 *  multi-hueco. Lo destapó una auditoría sobre el primer lote de
 *  transformación: 7 de 24 respuestas eran frases terminadas en punto.
 *
 *  **Sólo se hace opcional el signo QUE LA CLAVE LLEVA**, no cualquiera.
 *  Si se ignorara todo signo terminal, «Comprei-a na estação?» pasaría
 *  como equivalente de la afirmativa — y en una transformación de
 *  afirmativa a interrogativa el signo ES la respuesta. */
export function answersMatchFinal(a: string, b: string): boolean {
  const A = normalizeAnswer(a), B = normalizeAnswer(b);
  if (A === B) return true;
  const signo = B.match(/[.!?…]$/)?.[0];
  if (!signo) return false;
  const quita = (s: string) => (s.endsWith(signo) ? s.slice(0, -signo.length).trimEnd() : s);
  return quita(A) === quita(B);
}
