// Texto rumano: normalización de diacríticos, gate de diacríticos,
// medición de la grafía de época y cuenta de palabras. Un solo sitio,
// importado por la ingesta y por los tests (una regla copiada se
// desincroniza — ya pasó dos veces en PT).

/** ș/ț con COMA debajo (U+0219/U+021B, la norma de la Academia), nunca
 *  con cedilla (U+015F/U+0163, herencia de las fuentes de los 90). La
 *  web y media Wikisource mezclan las dos; aquí sale UNA sola. También
 *  se recompone a NFC: «ş» descompuesto (s + U+0327) es la misma
 *  cedilla con otro disfraz, y la descomposición pasaba el gate. */
export function normalizarDiacriticos(s) {
  return String(s ?? '')
    .normalize('NFC')
    .replace(/ş/g, 'ș').replace(/Ş/g, 'Ș')
    .replace(/ţ/g, 'ț').replace(/Ţ/g, 'Ț')
    .replace(/ş/g, 'ș').replace(/Ş/g, 'Ș')
    .replace(/ţ/g, 'ț').replace(/Ţ/g, 'Ț');
}

// Sin flag global para `.test()`: un regex /g es stateful y alterna
// true/false llamada a llamada (bug ya pagado en medir-nivel.mjs).
export const CEDILLAS = /[şŞţŢ]|[sStT]̧/g;
export const tieneCedilla = (s) => /[şŞţŢ]|[sStT]̧/.test(String(s ?? ''));

/** PALABRA = algo con una LETRA dentro (regla pagada en PT: contar por
 *  espacios sumaba las rayas y movió la cifra de portada un 2 %). */
const esPalabra = (t) => /\p{L}/u.test(t);
export function contarPalabras(parrafos) {
  return parrafos.reduce((a, p) => a + String(p.texto ?? '').split(/\s+/).filter(esPalabra).length, 0);
}

const RE_PAL = /[\p{L}'’-]+/gu;

// «î» interior de la norma 1953-1993, con las EXENCIONES medidas sobre
// las 104 lecturas que el gate DOOM3 marcaba sin nota (2026-09-02):
//  - prefijo que abre raíz: neîncetat, reîncepe, preaînalt, nemaiîncăpând,
//    subtîmpărțesc (prea/nemai/subt no estaban en la lista del gate);
//  - interjecciones con î repetida (hîîî, psîîîî, îîh): no son ortografía;
//  - francés en cursiva (maître, entraîne, plaît, fîtes): no es rumano.
// Lo que queda (cînd, hotărît, pămînt, dînsa, întrînsul, Bîrlad) es grafía
// vieja de verdad, y se declara aunque sean dos formas en mil.
const PREFIJOS_I = /^(?:ne|re|pre|prea|de|dez|des|răs|sub|subt|supra|semi|auto|contra|inter|non|bine|rău|ante|post|para|ori|între|nemai)î/;
const FRANCES_I = new Set(['maître', 'maîtresse', 'entraîne', 'plaît', 'fîtes', 'connaît', 'paraît', 'naître', 'dîner', 'île', 'maîtres', 'entraîner']);
export function esIInteriorAntigua(p) {
  if (!/\p{L}î\p{L}/u.test(p)) return false;
  if (/îî/.test(p) || FRANCES_I.has(p)) return false;
  return p.split('-').some((t) => t.length > 2 && /î/.test(t.slice(1, -1)) && !PREFIJOS_I.test(t));
}
// Elisión con apóstrofo de la grafía anterior a 1953: proclisis
// (într'o, dintr'un, s'a, n'am, m'a, ș'apoi, c'un, vr'o, să'l, par'că)
// o enclisis (pus'o, dat'o, să'țĭ). El apóstrofo curvo cuenta igual.
const RE_ELISION = /^(?:într|dintr|printr|s|n|m|l|ș|c|d|vr|să|nu|ce|care|par|făr|te|ne|v|i|ț)['’]\p{L}{1,}$|^\p{L}{2,}['’](?:o|l|i|ĭ|țĭ|ți|mi|și)$/u;
const RE_DIACR = /[ăâîșțĂÂÎȘȚ]/;

/** Gate: un texto rumano SIN diacríticos no es rumano correcto y no
 *  entra. Medido 2026-09-01 sobre las 18 anclas de `anclas-ro.mjs`
 *  (Creangă, Ispirescu, Caragiale, Slavici, Eminescu, Odobescu, Hogaș):
 *  entre el 35 % y el 44 % de las palabras llevan al menos un
 *  diacrítico; una transcripción «sin diacríticos» da 0 %. El corte va
 *  en 15 %: lejos de lo real y lejos de lo roto. Se exige además que
 *  aparezcan ș/ț: son las que más se pierden (hay transcripciones con
 *  ă/â/î y sin ș/ț). El test lo prueba EN ROJO con el mismo texto
 *  despojado de diacríticos. */
export function gateDiacriticos(texto, umbral = 0.15) {
  const palabras = (texto.match(RE_PAL) ?? []).filter((p) => /\p{L}/u.test(p));
  const con = palabras.filter((p) => RE_DIACR.test(p)).length;
  const ratio = palabras.length ? con / palabras.length : 0;
  const st = /[șțȘȚ]/.test(texto);
  const ok = palabras.length > 0 && ratio >= umbral && st;
  return { ok, ratio, palabras: palabras.length, detalle: `${(100 * ratio).toFixed(1)} % de palabras con diacrítico${st ? '' : ', y sin ș/ț'}` };
}

/** Grafía de época, MEDIDA y declarada (no corregida). Dos normas
 *  conviven en las transcripciones:
 *  - 1993 (actual): «â» en interior de palabra, «sunt».
 *  - 1953-1993: «î» en interior («cînd», «romîn») y «sînt».
 *  Se cuenta cuántas palabras llevan â interior y cuántas î interior
 *  (la î inicial o tras prefijo —«în», «neîncetat»— es de las dos
 *  normas y no se cuenta). */
export function medirGrafia(texto) {
  const palabras = texto.toLowerCase().match(RE_PAL) ?? [];
  let conA = 0, conI = 0, sint = 0, sunt = 0, apostrofos = 0;
  const ejemplosI = [];
  for (const p of palabras) {
    if (RE_ELISION.test(p)) apostrofos += 1;
    if (/\p{L}â\p{L}/u.test(p)) conA += 1;
    if (esIInteriorAntigua(p)) { conI += 1; if (ejemplosI.length < 4 && !ejemplosI.includes(p)) ejemplosI.push(p); }
    if (/^s[îi]nt(em|eți|eti)?$/.test(p)) sint += 1;
    if (/^sunt(em|eți|eti)?$/.test(p)) sunt += 1;
  }
  const cedillas = (texto.match(CEDILLAS) ?? []).length;
  // Apóstrofo de elisión (într'o, s'a, n'am): grafía ANTERIOR a 1953, donde
  // hoy va guion. Medido 2026-09-02 sobre las 818: mediana 0 %, p90 0,07 %;
  // las piezas con la grafía vieja de verdad están entre 1 % y 3,6 %
  // (Vlahuță, Slavici, Anghel, Ispirescu «Omul de piatră», Îndreptări).
  // Umbral: ≥3 formas y ≥0,2 % de las palabras. Las elisiones de habla
  // de Caragiale («dom'le», «văz't») no casan con el patrón y no cuentan.
  const elision = apostrofos >= 3 && apostrofos / Math.max(1, palabras.length) >= 0.002;
  let etiqueta, nota;
  const base = 'Diacríticos normalizados a la norma actual de la Academia (ș y ț con coma debajo).';
  if (conI > 0 && conI >= conA * 3) {
    etiqueta = 'grafía 1953-1993 (î interior, sînt)';
    nota = `${base} El texto conserva la grafía de la edición transcrita (norma 1953-1993): «î» en interior de palabra y «sînt» (cînd, romîn). Es la grafía real de la edición, no un error, y no se corrige.`;
  } else if (conA > 0 && conA >= conI * 3) {
    etiqueta = 'grafía actual (â, sunt)';
    nota = `${base} La transcripción sigue la norma ortográfica actual (â en interior de palabra, sunt).`;
  } else if (conA === 0 && conI === 0) {
    etiqueta = 'sin â/î interior';
    nota = `${base} El texto no presenta â ni î en interior de palabra.`;
  } else {
    etiqueta = 'grafía mixta (â/î)';
    nota = `${base} La transcripción mezcla las dos normas (â y î en interior de palabra: ${conA} y ${conI} formas). Se conserva tal cual: es la grafía de la edición, no un error.`;
  }
  if (sint > 0 && sunt > 0) nota += ` Conviven «sînt» (${sint}) y «sunt» (${sunt}).`;
  // «Mixta con pocas formas»: una edición modernizada a la que se le
  // escaparon dos «cînd» en mil palabras. No se corrige (es la fuente);
  // se declara, para que el gate DOOM3 sepa que está visto.
  if (etiqueta.startsWith('grafía actual') && (conI > 0 || sint > 0)) {
    etiqueta += ` (+${conI + sint} formas con î sin modernizar)`;
    nota += ` Quedan ${conI + sint} formas con «î» interior de la norma 1953-1993 sin modernizar (${[...ejemplosI, ...(sint ? ['sînt'] : [])].slice(0, 4).join(', ')}): se conservan tal cual.`;
  }
  if (elision) {
    etiqueta += ' + apóstrofo pre-1953';
    nota += ` Conserva además el apóstrofo de elisión anterior a la reforma de 1953 (într'o, s'a, n'am: ${apostrofos} formas), donde la norma actual escribe guion. Es la grafía de la edición, no un error.`;
  }
  return { etiqueta, nota, conA, conI, sint, sunt, cedillas, apostrofos, elision };
}

/** Quita los diacríticos: sólo para probar el gate EN ROJO. */
export function sinDiacriticos(texto) {
  return texto.replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i').replace(/ș/g, 's').replace(/ț/g, 't')
    .replace(/Ă/g, 'A').replace(/Â/g, 'A').replace(/Î/g, 'I').replace(/Ș/g, 'S').replace(/Ț/g, 'T');
}

/** Perfil de lengua para `ingesta-wikisource.mjs`: lo que cambia entre
 *  Wikisources y no es regla de texto. Son los valores que el motor
 *  llevaba escritos a mano cuando sólo servía al rumano (F-RO-T1..T4):
 *  sacarlos aquí no cambia una coma de la salida. */
export const PERFIL = {
  nombre: 'rumano',
  notas: /^(note|notă|nota|referințe|referinţe|cuprins|surse|bibliografie)\b/i,
  traduccion: /\((?:de|după|dupa|după)\s+\[\[|\bdup[ăa]\s+\[\[|traducere|tradus[ăe]?\b|trad\.\s/i,
  paginaRoja: /Pagină:[^\n]*?\.(?:djvu|pdf)\/\d+/g,
  etiquetaPieza: 'Capitolul',
  tituloPreambulo: 'Prolog',
  minusculas: new Set(['de', 'din', 'la', 'și', 'cu', 'pe', 'în', 'a', 'al', 'ale', 'ai', 'lui', 'cel', 'cea', 'cei', 'cele', 'sau', 'ori', 'ca', 'că', 'nu', 'un', 'o', 'unei', 'unui', 'spre', 'către', 'fără', 'prin', 'după', 'sub', 'peste', 'despre', 'pentru']),
  quitar: [],
  espaciadoDescargas: 250,
};
