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
  let conA = 0, conI = 0, sint = 0, sunt = 0;
  for (const p of palabras) {
    if (/\p{L}â\p{L}/u.test(p)) conA += 1;
    if (/\p{L}î\p{L}/u.test(p) && !/^(ne|re|pre|de|dez|des|sub|supra|bine|semi|auto|contra|nemai)î/.test(p)) conI += 1;
    if (/^s[îi]nt(em|eți|eti)?$/.test(p)) sint += 1;
    if (/^sunt(em|eți|eti)?$/.test(p)) sunt += 1;
  }
  const cedillas = (texto.match(CEDILLAS) ?? []).length;
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
  return { etiqueta, nota, conA, conI, sint, sunt, cedillas };
}

/** Quita los diacríticos: sólo para probar el gate EN ROJO. */
export function sinDiacriticos(texto) {
  return texto.replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i').replace(/ș/g, 's').replace(/ț/g, 't')
    .replace(/Ă/g, 'A').replace(/Â/g, 'A').replace(/Î/g, 'I').replace(/Ș/g, 'S').replace(/Ț/g, 'T');
}
