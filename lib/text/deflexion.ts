// Des-flexión nominal conservadora para el lookup del diccionario.
//
// El problema medido (2026-07-29): el lector de texto puro manda formas
// flexionadas («gatos», «flores») y el catálogo/fallback indexan por
// forma base, así que el popover decía «no está» aunque la base sí
// estuviera. Esto NO inventa traducciones: solo propone candidatos a
// singular para reintentar contra entradas ya verificadas — un candidato
// que no existe simplemente no pega.
//
// Reglas del plural portugués, de la más específica a la más general.
// Deliberadamente nominal: nada de conjugación verbal (demasiada
// ambigüedad para un lookup silencioso).
const REGLAS: Array<[RegExp, string]> = [
  [/ões$/, "ão"], // corações → coração
  [/ães$/, "ão"], // cães → cão
  [/ãos$/, "ão"], // mãos → mão
  [/ais$/, "al"], // animais → animal
  [/éis$/, "el"], // papéis → papel
  [/eis$/, "el"], // pastéis sin tilde, hotéis mal tecleado
  [/óis$/, "ol"], // lençóis → lençol
  [/is$/, "il"],  // barris → barril, civis → civil
  [/ns$/, "m"],   // jardins → jardim, bens → bem
  [/es$/, ""],    // flores → flor, rapazes → rapaz
  [/s$/, ""],     // gatos → gato, janelas → janela
];

export function candidatosSingular(palabra: string): string[] {
  const w = palabra.toLowerCase().trim();
  if (w.length < 3 || !w.endsWith("s")) return [];
  const out: string[] = [];
  for (const [patron, reemplazo] of REGLAS) {
    if (!patron.test(w)) continue;
    const cand = w.replace(patron, reemplazo);
    if (cand.length >= 2 && cand !== w && !out.includes(cand)) out.push(cand);
  }
  return out;
}
