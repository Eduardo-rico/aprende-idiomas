// Texto RUSO: normalización, gate de cirílico, medición de la grafía
// (pre-1918 / post-1918) y cuenta de palabras. Un solo sitio, importado
// por la ingesta (`ingesta-wikisource.mjs --lang ru`), por `anclas-ru.mjs`
// y por los tests (una regla copiada se desincroniza: ya pasó dos veces).
//
// Hermano de `texto-ro.mjs` y `texto-cs.mjs`, con lo que cambia de lengua:
// - normalización: NFC (la «й» y la «ё» descompuestas —и + U+0306, е +
//   U+0308— se recomponen) y FUERA el acento de intensidad editorial
//   (U+0301, «на́ пол», «по́ полу»: ru.wikisource lo pone en los cuentos
//   populares y en las ediciones «с ударениями»). No es ortografía: es
//   un apoyo de lectura que el corpus no lleva en el 99 % de las piezas,
//   y un mismo lema con y sin tilde serían dos cadenas. Se cuenta.
// - la grafía de época es la ANTERIOR a la reforma de 1918: ѣ (yat), і
//   (i decimal), ѳ (fita), ѵ (ízhitsa) y el «ъ» final tras consonante
//   («императоръ», «совѣтъ»). Se MIDE por pieza y se declara; jamás se
//   convierte (ѣ→е falla en silencio en los homógrafos: «ѣсть» comer /
//   «есть» hay; «мѣлъ» tiza / «мелъ» barrió).
// - la «ё» es opcional en la ortografía actual: no se «corrige» en
//   ningún sentido; se informa cuántas formas la llevan.
// - el diccionario hunspell de la auditoría OCR es el ru_RU de
//   A. I. Lebedev (BSD, vía LibreOffice), vendorizado en tools/hunspell.

/** NFC, fuera el acento de intensidad (U+0301) y fuera las marcas
 *  invisibles de dirección (U+200E/U+200F, que Afanásiev trae al
 *  principio de párrafo) y el BOM. */
export function normalizarDiacriticos(s) {
  return String(s ?? '').normalize('NFC').replace(/[\u0301\u200E\u200F\uFEFF]/g, '')
    // La llamada de nota «<71>» va ANTES que la regla del guion: «Sauvée!
    // -<71> патетически» tapaba el espacio y el guion se quedaba.
    .replace(/<\d{1,3}>/g, '')
    // Guion ASCII con espacio a los dos lados («- Представьте себе! - сказал
    // Версилов»): en ruso un guion entre espacios no existe, siempre es la
    // raya de diálogo o de inciso. MEDIDO antes de aplicarlo: 13.542 casos
    // en 98 piezas (Обрыв, Подросток, Ushinski), doce muestras al azar y
    // todas eran rayas. La raya pegada («в 17..году-») no se toca.
    // (también al final del nodo: «карай лукавых -</dd>», el verso corta ahí)
    .replace(/(^|\s)-(?=\s|$)/gu, '$1—')
    .normalize('NFC');
}

/** PALABRA = algo con una LETRA cirílica dentro (regla de la fase F-RU:
 *  el francés de Tolstói y el latín de Chéjov no cuentan como lectura
 *  en ruso). */
const esPalabra = (t) => /\p{Script=Cyrillic}/u.test(t);
export function contarPalabras(parrafos) {
  return parrafos.reduce((a, p) => a + String(p.texto ?? '').split(/\s+/).filter(esPalabra).length, 0);
}

const RE_PAL = /[\p{L}'’-]+/gu;
const RE_CIR = /\p{Script=Cyrillic}/u;
// Letras que sólo existen en ucraniano/bielorruso (ru.wikisource también
// aloja textos en esas lenguas): un texto con ellas no es ruso.
const RE_UK_BY = /[їєґўЇЄҐЎ]/;

/** Gate: un texto que no es ruso no entra. Medido 2026-09-02 sobre las
 *  anclas de `anclas-ru.mjs`: entre el 93 % y el 100 % de las palabras
 *  llevan letra cirílica (Tolstói baja al 90 % en los capítulos con
 *  diálogo francés). El corte va en 60 %: lejos de lo real (una página
 *  de Guerra y paz con MÁS francés que ruso sigue siendo un capítulo de
 *  la novela) y lejos de lo roto (una página de índice, de aparato o en
 *  otra lengua). Se exige además que no haya letras ucranianas o
 *  bielorrusas (ї є ґ ў) en más del 1 % de las palabras (Gógol cita
 *  epígrafes ucranianos: 0,22 %), ni un BLOQUE en esas lenguas (abajo).
 *  El test lo prueba EN ROJO con un texto latino y con uno ucraniano. */
export function gateDiacriticos(texto, umbral = 0.6) {
  const palabras = (texto.match(RE_PAL) ?? []).filter((p) => /\p{L}/u.test(p));
  const con = palabras.filter((p) => RE_CIR.test(p)).length;
  const ratio = palabras.length ? con / palabras.length : 0;
  const ukby = palabras.filter((p) => RE_UK_BY.test(p)).length / Math.max(1, palabras.length);
  // Y un BLOQUE en otra lengua: Afanásiev pega a un cuento ruso sus
  // variantes ucranianas («Морской царь…»: 1.000 palabras en ucraniano
  // tras 14.000 en ruso, y sólo 17 con ї/є, el 0,1 %). Se mira por
  // ventanas de 100 palabras la proporción de formas con ї є ґ ў, o con
  // «і» cuando el texto no es pre-1918 (ahí la «і» es ucraniana). MEDIDO:
  // un pasaje ucraniano tiene «і» en el 25-35 % de sus palabras; el
  // diálogo ucraniano de los campesinos de «Два старика» de Tolstói,
  // salpicado en ruso, no pasa del 10 % en ninguna ventana. Corte: 20 %.
  const esPre = /[ѣѳѵ]/.test(texto) || /[бвгджзклмнпрстфхцчшщ]ъ(?=[\s.,;:!?…»)]|$)/.test(texto);
  const reBloque = esPre ? RE_UK_BY : /[їєґўіЇЄҐЎІ]/;
  let bloque = 0;
  // Ventana de 200 y corte 25 %: los epígrafes ucranianos de Gógol
  // (Сорочинская ярмарка, 20-40 palabras por capítulo) daban 30 % en una
  // ventana de 100 y tiraban seis capítulos; una variante ucraniana de
  // Afanásiev (≥300 palabras seguidas) sigue dando 40-90 %.
  const V = 200;
  const marcas = palabras.map((p) => (reBloque.test(p) ? 1 : 0));
  let suma = 0;
  for (let i = 0; i < marcas.length; i++) {
    suma += marcas[i]; if (i >= V) suma -= marcas[i - V];
    if (i >= V - 1) bloque = Math.max(bloque, suma / V);
  }
  const ok = palabras.length > 0 && ratio >= umbral && ukby <= 0.01 && bloque < 0.25;
  return { ok, ratio, palabras: palabras.length, bloque, detalle: `${(100 * ratio).toFixed(1)} % de palabras en cirílico${ukby > 0.01 ? `, y ${(100 * ukby).toFixed(2)} % con letras ucranianas/bielorrusas (ї є ґ ў)` : ''}${bloque >= 0.25 ? `, con un bloque en ucraniano/bielorruso (${(100 * bloque).toFixed(0)} % de «і ї є ґ ў» en 200 palabras)` : ''}` };
}

/** Grafía de época, MEDIDA y declarada (no corregida).
 *  - pre-1918: ѣ, і, ѳ, ѵ y el «ъ» final tras consonante. Se mide la
 *    proporción de palabras con alguna de esas marcas.
 *  - actual (post-1918).
 *  MEDIDO 2026-09-02: «Левша» en la edición de 1902 (ДО) tiene marca
 *  pre-1918 en el 33,8 % de las palabras (el ъ final está en casi todo
 *  sustantivo masculino y en cada verbo en pasado masculino); la misma
 *  obra en la versión ВТ:Ё tiene 0,00 %. Un texto actual puede traer
 *  alguna ѣ citada o un nombre con «і» (0-0,05 %). El corte pre-1918 va
 *  en 5 %; entre 0,3 % y 5 % es una MEZCLA incoherente (páginas de dos
 *  ediciones pegadas, o una conversión automática a medias) y la
 *  ingesta la rechaza. */
export function medirGrafia(texto) {
  const palabras = texto.toLowerCase().match(RE_PAL) ?? [];
  let pre = 0, yo = 0, yat = 0, iDec = 0, fita = 0, izh = 0, hardFinal = 0;
  const ejemplos = [];
  for (const p of palabras) {
    if (!RE_CIR.test(p)) continue;
    let marca = false;
    if (/ѣ/.test(p)) { yat += 1; marca = true; }
    if (/і/.test(p)) { iDec += 1; marca = true; }
    if (/ѳ/.test(p)) { fita += 1; marca = true; }
    if (/ѵ/.test(p)) { izh += 1; marca = true; }
    if (/[бвгджзклмнпрстфхцчшщ]ъ$/.test(p)) { hardFinal += 1; marca = true; }
    if (marca) { pre += 1; if (ejemplos.length < 4 && !ejemplos.includes(p)) ejemplos.push(p); }
    if (/ё/.test(p)) yo += 1;
  }
  const n = Math.max(1, palabras.filter((p) => RE_CIR.test(p)).length);
  // La «і» sola no es marca pre-1918: es ucraniano (los campesinos de
  // «Два старика» de Tolstói hablan ucraniano en el texto ruso). Sólo
  // cuenta como grafía vieja si la acompañan ѣ, ѳ, ѵ o el ъ final.
  if (yat + fita + izh + hardFinal === 0) { pre -= iDec; ejemplos.length = 0; }
  const ratio = pre / n;
  const pre1918 = ratio >= 0.05;
  const mezcla = !pre1918 && ratio > 0.003;
  const base = 'Texto en NFC, sin acentos de intensidad editoriales.';
  let etiqueta, nota;
  if (pre1918) {
    etiqueta = 'grafía pre-1918 (ѣ, і, ъ final)';
    nota = `${base} La edición conserva la ortografía anterior a la reforma de 1918 (${ejemplos.join(', ')}; marca pre-reforma en el ${(100 * ratio).toFixed(1)} % de las palabras: ${yat} con ѣ, ${iDec} con і, ${fita} con ѳ, ${izh} con ѵ, ${hardFinal} con ъ final). Es la grafía real de la edición, no un error, y no se convierte: ѣ→е falla en los homógrafos.`;
  } else if (mezcla) {
    etiqueta = 'grafía MEZCLADA (rechazar)';
    nota = `${base} Mezcla incoherente: marca pre-1918 en el ${(100 * ratio).toFixed(2)} % de las palabras (${ejemplos.join(', ')}).`;
  } else {
    etiqueta = 'grafía actual (post-1918)';
    nota = `${base} La transcripción sigue la ortografía posterior a la reforma de 1918${yo ? ` y escribe la «ё» (${yo} formas)` : ' y no distingue la «ё»'}; la «ё» opcional se deja como está en la fuente.`;
  }
  return { etiqueta, nota, ratio, pre1918, mezcla, yat, iDec, fita, izh, hardFinal, yo };
}

/** Transliteración para ids de fichero (GOST 7.79 simplificado, sin
 *  signos): «Смерть чиновника» → «smert-chinovnika». */
const TRANSLIT = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya', ѣ: 'e', і: 'i', ѳ: 'f', ѵ: 'i' };
export function slug(t) {
  return String(t).toLowerCase().normalize('NFC')
    .replace(/[а-яёѣіѳѵ]/g, (c) => TRANSLIT[c] ?? '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Sólo para probar el gate EN ROJO: el mismo texto en alfabeto latino. */
export function sinCirilico(texto) {
  return texto.replace(/[а-яёА-ЯЁ]/g, (c) => TRANSLIT[c.toLowerCase()] ?? c);
}

/** Convierte un texto actual a una imitación pre-1918 (ъ final y ѣ en
 *  «е»): SÓLO para ver la medición en rojo y en verde en el test. */
export function fingirPre1918(texto) {
  return texto.replace(/([бвгджзклмнпрстфхцчшщ])(?=[\s.,;:!?…»)]|$)/g, '$1ъ').replace(/е/g, 'ѣ');
}

// ── Redacciones de ru.wikisource ────────────────────────────────
// Muchas páginas «Título (Autor)» no son la obra sino una LISTA DE
// REDACCIONES: cada edición transcrita es una subpágina («/ДО» en
// ortografía anterior a 1918, «/ВТ» modernizada por la Викитека, «/ВТ:Ё»
// modernizada y con ё, «/ПСС 1938 (СО)» edición académica en ortografía
// actual…). Regla de Edu: preferir la ortografía moderna. Se puntúa:
// ВТ:Ё > (СО) > ВТ > ПСС/СС moderno > cualquier otra > ДО. La «с
// ударениями» (con acentos de intensidad) se evita si hay otra.
function puntuarVariante(titulo, texto) {
  const t = `${titulo} ${texto}`;
  if (/ДО\b|дореформенн|дореф\./i.test(t)) return -100;
  let p = 0;
  if (/ВТ:Ё/.test(t)) p += 40;
  else if (/\(СО\)|современн/i.test(t)) p += 30;
  else if (/\bВТ\b/.test(t)) p += 20;
  else if (/ПСС|Собрание сочинений|СС \d{4}|19[3-9]\d|20\d\d/.test(t)) p += 10;
  if (/ударени/i.test(t)) p -= 15;
  return p;
}

/** Hook de la ingesta: dado el HTML parseado de `titulo`, devuelve el
 *  título al que hay que ir en su lugar, `false` si la página no es una
 *  obra (desambiguación), o `null` si es la obra misma. */
export function redirigir(doc, titulo) {
  const txt = doc.body.textContent;
  if (/список произведений со сходными заголовками|список значений|неоднозначност/i.test(txt) && !/список редакций/i.test(txt)) return false;
  if (!/список редакций одного произведения/i.test(txt)) return null;
  const pref = `${titulo}/`;
  const cands = [];
  for (const a of doc.querySelectorAll('a[href^="/wiki/"]')) {
    let dec; try { dec = decodeURIComponent(a.getAttribute('href')); } catch { continue; }
    const t = dec.slice('/wiki/'.length).replace(/_/g, ' ').split('#')[0];
    if (!t.startsWith(pref) || a.classList.contains('new')) continue;
    cands.push({ t, p: puntuarVariante(t, a.textContent + ' ' + (a.parentElement?.textContent ?? '')) });
  }
  if (!cands.length) return false;
  cands.sort((a, b) => b.p - a.p);
  return cands[0].t;
}

/** Hook de la ingesta: si TODAS las subpáginas de una obra son
 *  redacciones de la misma («/ПСС 1902—1903 (ДО)», «… (ВТ)», «… (ВТ:Ё)»,
 *  «/СО», «/ДО»), devuelve la preferida; si no, `null` (son capítulos). */
const RE_VARIANTE = /\((?:ДО|ВТ|ВТ:Ё|СО)\)\s*$|\/(?:ДО|ВТ|ВТ:Ё|СО)$|\/\d{4}\s*\((?:ДО|СО)\)$|дореформенн|современн/i;
export function elegirVariante(hijas) {
  if (!hijas.every((x) => RE_VARIANTE.test(x.titulo) || RE_VARIANTE.test(x.texto ?? ''))) return null;
  return [...hijas].sort((a, b) => puntuarVariante(b.titulo, b.texto ?? '') - puntuarVariante(a.titulo, a.texto ?? ''))[0];
}

/** Perfil de lengua para `ingesta-wikisource.mjs`: lo que cambia entre
 *  Wikisources y no es regla de texto. */
export const PERFIL = {
  nombre: 'ruso',
  // Secciones de aparato que se cortan con lo que cuelga de ellas.
  // OJO: sin «\b» — en JavaScript el límite de palabra es ASCII y tras
  // una letra cirílica no existe: «Примечания» no casaba y el rótulo
  // quedó como último párrafo en 886 piezas. Se usa (?![\p{L}]).
  notas: /^(?:примечания|примечание|комментарии|комментарий|источники|ссылки|см\.\s*также|литература|библиография|оглавление|содержание|варианты|редакции)(?![\p{L}])/iu,
  // Una entrada de la página Автор: que es TRADUCCIÓN (regla de Edu:
  // sólo literatura nativa). «перевод», «перев.», «пер. с…», «из Гейне».
  traduccion: /перевод|перев\.|(?<![\p{L}])пер\.\s|переложени|подражани|(?<![\p{L}])с\s+(?:нем|фр|англ|польск|лат|итал|исп|греч|древнегреч|укр|чеш|швед|дат|норв|перс|араб|санскр)\p{L}*|^\s*[*#]+\s*из\s+\[\[/iu,
  // Enlaces rojos a páginas del escaneo sin transcribir.
  paginaRoja: /Страница:[^\n]*?\.(?:djvu|pdf)\/\d+/g,
  etiquetaPieza: 'Глава',
  tituloPreambulo: 'Вступление',
  minusculas: new Set(['и', 'в', 'во', 'на', 'с', 'со', 'о', 'об', 'у', 'к', 'ко', 'по', 'за', 'из', 'от', 'до', 'не', 'ни', 'а', 'но', 'да', 'или', 'как', 'что', 'же', 'ли', 'бы', 'без', 'для', 'при', 'про', 'под', 'над', 'то', 'ведь', 'the']),
  // Aparato propio de ru.wikisource que la ingesta quita además del común:
  // el aviso «Источник текста не указан» (.ambox), el «См. также
  // одноимённые страницы» (.dablink), la caja de búsqueda de las novelas
  // por tomos (.searchbox), la «Редакции» de cabecera (.notice) y las
  // tablas de contenido punteadas de los escaneos.
  quitar: ['.ambox', '.dablink', '.notice', '.searchbox', '.mw-inputbox-centered', 'form', '[class*="dottedtoc"]', '.ws-summary', '.interwiki', 'span[style*="display:none"]', 'div[style*="display:none"]', '.mw-halign-center'],
  espaciadoDescargas: 500,
  prefijoAutor: 'Автор',
  // Subpáginas que son la MISMA obra en grafía anterior a 1918 («…/ДО»,
  // «…/В дореформенной орфографии») cuando ya se está leyendo la moderna.
  // Y «…/Текст целиком»: la novela entera en una página al lado de sus
  // capítulos (Бедные люди, Двойник, Хозяйка) — duplicaría cada palabra.
  subpaginaExcluida: /\/ДО(?:\/|$)|\(ДО\)(?:\/|$)|дореформенн|\/(?:Текст целиком|Весь текст|Полный текст)$/i,
  elegirVariante,
  // ru.wikisource envuelve libros enteros (las «Русские книги для чтения»
  // de Tolstói) en un <div class="poem">, encabezados incluidos: la
  // ingesta lo leería como UNA estrofa y perdería los capítulos. Un
  // «poema» con encabezados o con tres o más <p> es un contenedor, no
  // un poema: se desenvuelve. El poema de verdad (un <p> con <br>) queda.
  // Y en los libros transcritos del escaneo (la «Третья книга для чтения»
  // del tomo 21 de las obras completas) los títulos de cada relato son un
  // <div class="div-center">ЦАРЬ И СОКОЛ</div> sin encabezado, y el índice
  // de la edición va en <p> «Царь и сокол ... 205»: el título corto en
  // mayúsculas pasa a <h2>; la línea de índice con puntos y página, fuera.
  prepararDoc: (doc) => {
    for (const d of [...doc.querySelectorAll('div.poem')]) {
      if (d.querySelector('h1,h2,h3,h4,h5,h6') || d.querySelectorAll('p').length >= 3) d.replaceWith(...d.childNodes);
    }
    for (const d of [...doc.querySelectorAll('div.div-center')]) {
      const t = d.textContent.trim();
      if (t && t.split(/\s+/).length <= 8 && /[А-ЯЁ]/.test(t) && !/[а-яё]/.test(t) && !d.querySelector('p, div')) {
        const h = doc.createElement('h2'); h.textContent = t; d.replaceWith(h);
      }
    }
    for (const p of [...doc.querySelectorAll('p')]) if (/\.\.\.\s*\d{1,4}\s*$/.test(p.textContent.trim()) && p.textContent.trim().split(/\s+/).length <= 12) p.remove();
    // El índice DENTRO de la página («Оглавление» y luego «Глава I», «I • II
    // • III», «Часть первая» como párrafos con enlaces a anclas): fuera el
    // rótulo y las líneas de índice que le siguen, hasta la primera línea
    // que no lo sea. Pagado: entró como texto en Попрыгунья y В глуши.
    const esIndice = (t) => /^(?:Глав[аы]\s*:?\s*)?[IVXLC\d]+(?:\.|\s*[•·]\s*[IVXLC\d]+)*\.?$/.test(t) || /^(?:Часть|Книга|Том|Действие|Акт|Эпилог|Пролог)\s+[\p{L}\d]+\.?$/u.test(t) || /^Главы\s*:/.test(t);
    // La barra de navegación por anclas de la propia página («I • II • III
    // … • XI • Примечания»): un <div> de enlaces que la ingesta leía como
    // once párrafos de una palabra al principio de la pieza. Fuera entera.
    // Regla: un bloque cuyos enlaces son TODOS anclas de la misma página
    // («#Глава_II», «#Примечания», «#КАРТИНА_ВТОРАЯ») y cuyo texto, quitados
    // los enlaces, son sólo viñetas y espacios.
    for (const el of [...doc.querySelectorAll('div, p, center')]) {
      if (el.querySelector('p, div')) continue;
      const anclas = [...el.querySelectorAll('a')];
      if (anclas.length < 2 || !anclas.every((a) => (a.getAttribute('href') ?? '').startsWith('#'))) continue;
      const resto = anclas.reduce((t, a) => t.replace(a.textContent, ''), el.textContent).replace(/[\s•·|—–-]+/g, '');
      if (resto === '') el.remove();
    }
    for (const el of [...doc.querySelectorAll('p, div, b, h2, h3, h4, span')]) {
      if (!/^(?:Оглавление|Содержание)\s*:?$/.test(el.textContent.trim())) continue;
      let n = el.nextElementSibling;
      while (n && esIndice(n.textContent.trim())) { const m = n.nextElementSibling; n.remove(); n = m; }
      el.remove();
    }
    // El comentario del EDITOR MODERNO al final de la pieza (las ediciones
    // académicas de Leskov, Pushkin y Tolstói en ru.wikisource lo traen
    // como párrafos, sin encabezado que la sección de notas pueda cortar):
    // un párrafo que es sólo «Примечания»/«Комментарии»/«Варианты», o el
    // primer «Стр. 136. …» (nota por página), abre el aparato; desde ahí
    // hasta el final, fuera. El comentario de 1950 no es dominio público,
    // y no es el autor. Pagado: 15 piezas lo traían dentro.
    const abreAparato = (t) => /^(?:Примечания|Комментарии|Комментарий|Варианты|Печатные варианты|Примечание)\s*:?$/i.test(t) || /^Стр\.\s*\d+[.,]/.test(t);
    const primero = [...doc.querySelectorAll('p, div, h2, h3, h4, h5, center, dt, li, b, strong')].find((el) => abreAparato(el.textContent.trim()) && !el.querySelector('p, div'));
    if (primero) {
      let n = primero;
      while (n) { const m = n.nextElementSibling; n.remove(); n = m; }
    }
  },
  slug,
  redirigir,
  // Las páginas Автор: de ru.wikisource enlazan muchas obras con la
  // plantilla {{2О|Título|Texto}} (dos ortografías), no con [[…]].
  preprocesarRaw: (raw) => raw.replace(/\{\{2О\|([^|}]+)(?:\|([^}]*))?\}\}/g, (_, a, b) => `[[${a}${b ? `|${b}` : ''}]]`),
};
