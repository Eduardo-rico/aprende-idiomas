// Texto CHECO: normalización, gate de diacríticos, medición de la grafía
// de época y cuenta de palabras. Un solo sitio, importado por la ingesta
// (`ingesta-wikisource.mjs --lang cs`), por `anclas-cs.mjs` y por los
// tests (una regla copiada se desincroniza: ya pasó dos veces en PT).
//
// Es el hermano de `texto-ro.mjs`, con lo que cambia de lengua:
// - el checo NO tiene el problema cedilla/coma del rumano: la
//   normalización es sólo NFC (háček y kroužek descompuestos —«c» +
//   U+030C— se recomponen a «č», «u» + U+030A a «ů»);
// - la grafía de época no es î/â sino la ortografía ANTERIOR a 1849
//   (la «bratrská»: «w» por «v», «au» por «ou», «j» por «í», «g» por
//   «j») y la anterior a 1957 (infinitivo en «-ti», «poesie», «president»
//   con «s»). Se MIDE por pieza y se declara; nunca se corrige.

/** Sólo NFC. Wikisource cs es consistente en precompuestos, pero un
 *  háček descompuesto pasaría el gate sin ser la misma cadena. */
export function normalizarDiacriticos(s) {
  return String(s ?? '').normalize('NFC');
}

/** PALABRA = algo con una LETRA dentro (regla pagada en PT). */
const esPalabra = (t) => /\p{L}/u.test(t);
export function contarPalabras(parrafos) {
  return parrafos.reduce((a, p) => a + String(p.texto ?? '').split(/\s+/).filter(esPalabra).length, 0);
}

const RE_PAL = /[\p{L}'’-]+/gu;
const RE_DIACR = /[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/;

/** Gate: un texto checo SIN diacríticos no es checo correcto y no entra.
 *  Medido 2026-09-02 sobre las anclas de `anclas-cs.mjs` (Němcová,
 *  Erben, Neruda, Hašek, Zeyer, Arbes…): entre el 39 % y el 52 % de las
 *  palabras llevan al menos un diacrítico; una transcripción «bez
 *  diakritiky» da 0 %. El corte va en 15 %: lejos de lo real y lejos de
 *  lo roto. Se exige además que aparezcan al menos TRES de las letras
 *  propias (ě ř ů č š ž): hay transcripciones con á/é/í y sin háčky.
 *  El test lo prueba EN ROJO con el mismo texto despojado. */
export function gateDiacriticos(texto, umbral = 0.15) {
  const palabras = (texto.match(RE_PAL) ?? []).filter((p) => /\p{L}/u.test(p));
  const con = palabras.filter((p) => RE_DIACR.test(p)).length;
  const ratio = palabras.length ? con / palabras.length : 0;
  const propias = ['ě', 'ř', 'ů', 'č', 'š', 'ž'].filter((l) => texto.toLowerCase().includes(l)).length;
  const ok = palabras.length > 0 && ratio >= umbral && propias >= 3;
  return { ok, ratio, palabras: palabras.length, detalle: `${(100 * ratio).toFixed(1)} % de palabras con diacrítico${propias < 3 ? `, y sólo ${propias}/6 letras propias (ě ř ů č š ž)` : ''}` };
}

// Infinitivos frecuentes: forma en «-ti» (norma hasta 1957, y la única
// en el XIX) frente a la forma actual en «-t». Lista CERRADA de pares
// para no confundir «děti», «kosti», «části» con infinitivos.
const INF_TI = new Set(['býti', 'míti', 'jíti', 'dáti', 'vzíti', 'chtíti', 'věděti', 'viděti', 'slyšeti', 'dělati', 'mluviti', 'znáti', 'státi', 'jeti', 'žíti', 'věřiti', 'hledati', 'čekati', 'zůstati', 'učiniti', 'prositi', 'mysliti', 'říkati', 'psáti', 'čísti', 'seděti', 'ležeti', 'spáti', 'jísti', 'píti', 'koupiti', 'prodati', 'nechati', 'pomoci', 'přijíti', 'odejíti', 'vrátiti', 'držeti', 'nositi', 'zpívati', 'hráti', 'pracovati', 'milovati', 'ukázati', 'poslouchati', 'dívati', 'bráti', 'žádati', 'platiti', 'volati', 'vésti', 'nésti', 'vzpomínati', 'ptáti', 'odpověděti', 'zemříti', 'umříti', 'vstáti', 'zůstávati', 'dostati', 'choditi']);
const INF_T = new Set([...INF_TI].map((v) => v.replace(/ti$/, 't')));
// «s» intervocálica de la norma anterior a 1957 en cultismos (poesie,
// filosofie, president, gymnasium, universita, krise, these, musea) frente
// a la «z» actual. Pares cerrados; la raíz basta.
const CULTO_S = /^(?:poesi|filosof|president|gymnasi|universit|krise|these|muse[au]|fantasi|realis|idealis|socialis|organis|civilisa|episod|fysi|fysik)/;
const CULTO_Z = /^(?:poezi|filozof|prezident|gymnázi|univerzit|krize|teze|muze[au]|fantazi|realiz|idealiz|socializ|organiz|civiliza|epizod|fyzi|fyzik)/;

/** Grafía de época, MEDIDA y declarada (no corregida). Tres normas
 *  conviven en cs.wikisource:
 *  - pre-1849 («bratrská»): «w» por «v» (wšak, swé), «au» por «ou»
 *    (saud, mauka), «j» por «í» (gegj), «g» por «j». Se mide por la
 *    proporción de palabras con «w» y con «au» no inicial (el «au»
 *    inicial es «auto», «August»; el interior en checo actual es raro).
 *  - 1849-1957: infinitivo en «-ti» (býti, míti), «s» en cultismos
 *    (poesie, president). Se mide por la razón «-ti» / («-ti» + «-t»)
 *    sobre una lista cerrada de infinitivos frecuentes, y por los
 *    cultismos con «s».
 *  - actual (1957→). */
export function medirGrafia(texto) {
  const palabras = texto.toLowerCase().match(RE_PAL) ?? [];
  let conW = 0, conAu = 0, ti = 0, t = 0, cultoS = 0, cultoZ = 0;
  const ejemplosW = [], ejemplosTi = [], ejemplosS = [];
  const ej = (arr, p) => { if (arr.length < 4 && !arr.includes(p)) arr.push(p); };
  for (const p of palabras) {
    if (/w/.test(p) && /^[\p{L}]+$/u.test(p)) { conW += 1; ej(ejemplosW, p); }
    if (/\p{L}au/u.test(p)) conAu += 1;
    if (INF_TI.has(p)) { ti += 1; ej(ejemplosTi, p); } else if (INF_T.has(p)) t += 1;
    if (CULTO_S.test(p)) { cultoS += 1; ej(ejemplosS, p); } else if (CULTO_Z.test(p)) cultoZ += 1;
  }
  const n = Math.max(1, palabras.length);
  // Umbrales medidos 2026-09-02 sobre las anclas: un texto actual tiene
  // 0-2 «w» por diez mil palabras (nombres alemanes) y «au» interior en
  // 0-3 por mil (Augustin, pauza, restaurace); la «Národní Báchorky a
  // Powěsti» de 1845 tiene «w» en el 6 % de las palabras y «au» en el
  // 2 %. El corte, en 0,5 %, cae entre familias.
  const bratrska = conW / n >= 0.005 || conAu / n >= 0.005;
  const infTi = ti >= 3 && ti / Math.max(1, ti + t) >= 0.5;
  const cultismoS = cultoS >= 2 && cultoS > cultoZ;
  const base = 'Texto en NFC con los diacríticos checos de la fuente (háček, čárka, kroužek).';
  let etiqueta, nota;
  if (bratrska) {
    etiqueta = 'grafía pre-1849 (w, au)';
    nota = `${base} El texto conserva la ortografía anterior a la reforma de 1849 (${ejemplosW.length ? `«w» por «v»: ${ejemplosW.join(', ')}` : '«au» por «ou»'}; ${conW} formas con w y ${conAu} con «au» interior). Es la grafía real de la edición, no un error, y no se corrige.`;
  } else if (infTi || cultismoS) {
    etiqueta = 'grafía pre-1957 (-ti, poesie)';
    const partes = [];
    if (infTi) partes.push(`infinitivo en «-ti» (${ejemplosTi.join(', ')}: ${ti} formas frente a ${t} en «-t»)`);
    if (cultismoS) partes.push(`cultismos con «s» (${ejemplosS.join(', ')})`);
    nota = `${base} La transcripción sigue la norma anterior a 1957: ${partes.join('; ')}. Se conserva tal cual: es la grafía de la edición, no un error.`;
  } else if (ti > 0 && t > 0) {
    etiqueta = 'grafía mixta (-ti/-t)';
    nota = `${base} La transcripción mezcla el infinitivo antiguo en «-ti» (${ti} formas) con el actual en «-t» (${t}). Se conserva tal cual: es la grafía de la edición, no un error.`;
  } else {
    etiqueta = 'grafía actual';
    nota = `${base} La transcripción sigue la ortografía actual (infinitivo en «-t», «z» en cultismos).`;
  }
  return { etiqueta, nota, conW, conAu, ti, t, cultoS, cultoZ, bratrska, infTi, cultismoS };
}

/** Quita los diacríticos: sólo para probar el gate EN ROJO. */
export function sinDiacriticos(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Perfil de lengua para `ingesta-wikisource.mjs`: lo que cambia entre
 *  Wikisources y no es regla de texto. */
export const PERFIL = {
  nombre: 'checo',
  // Secciones de aparato que se cortan con lo que cuelga de ellas.
  notas: /^(poznámky|poznámka|reference|obsah|vysvětlivky|literatura|prameny|rejstřík|redakční poznámky)\b/i,
  // Una entrada de la página Autor: que es TRADUCCIÓN (regla de Edu:
  // sólo literatura nativa). «překlad», «přeložil», «z němčiny/ruštiny…».
  traduccion: /překlad|přelož|\bz\s+(?:něm|fran|rus|angl|pol|lat|ital|špan|maď|srb|chorv|bulh|slov)\p{L}*\b|podle\s+\[\[/iu,
  // Enlaces rojos a páginas del escaneo sin transcribir.
  paginaRoja: /Stránka:[^\n]*?\.(?:djvu|pdf)\/\d+/g,
  etiquetaPieza: 'Kapitola',
  tituloPreambulo: 'Úvod',
  minusculas: new Set(['a', 'i', 'v', 've', 'na', 'o', 'u', 'z', 'ze', 's', 'se', 'k', 'ke', 'do', 'od', 'po', 'pro', 'za', 'při', 'před', 'nad', 'pod', 'mezi', 'bez', 'ale', 'či', 'že', 'jak', 'co', 'to', 'ten', 'ta', 'aneb', 'čili', 'neb', 'nebo', 'jeho', 'její', 'jejich', 'svůj', 'své', 'the']),
  // Aparato propio de cs.wikisource que la ingesta quita además del común.
  // `.interwiki-extra`: los enlaces a las traducciones («English»,
  // «polski») van en un <span style="display:none"> que el DOM sí lee:
  // aparecían como primer párrafo en 10 de las 109 piezas de la T1.
  quitar: ['.ws-summary', '.mw-references-wrap', '.hlavicka', '.navigace', 'div.textinfo', 'table.textinfo', '.forma-navigace', '.interwiki-extra', '.interwiki', 'span[style*="display:none"]', 'div[style*="display:none"]'],
  espaciadoDescargas: 400,
};
