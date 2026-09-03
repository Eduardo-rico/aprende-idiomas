// Amplía un ancla de la escalera antigua con texto de Wikisource.
//
//   node scripts/lectura/traer-anclas-antiguas.mjs --lang la
//
// POR QUÉ EXISTE. La medición de la escalera (§1.6 del Paso 0) dejó dos
// saltos «no separables», y el de Virgilio→Tácito lo era por una razón
// concreta y arreglable: los treebanks UD sólo traen **68 y 64 frases**
// de esas dos obras (645 y 745 palabras), y con esa muestra los IC se
// solapan. El coordinador decidió darle más texto y, si aun así no
// separa, fundir L4 y L5.
//
// LO QUE SE TRAE, Y POR QUÉ ESAS OBRAS. Las MISMAS obras que el treebank
// ya tiene —la Eneida de Virgilio y las Historiae de Tácito—, no otras
// del mismo autor. Ampliar con otra obra cambiaría el registro y el
// resultado no sería sobre la escalera: es la lección de las «Epistulae
// ad Atticum», que al sustituir a «In Catilinam» convirtieron el salto
// César→Cicerón en correspondencia privada contra historiografía.
//
// LA NORMALIZACIÓN NO ES UN DETALLE. Wikisource macroniza algunas piezas
// (la Eneida, al 26 % de las vocales) y los treebanks no traen un solo
// mácrón en 227.301 tokens. Sin `canonicalLa`, `Rōma` y `Roma` serían dos
// formas y la cuenta léxica saldría inflada JUSTO en la obra que se
// quiere ampliar — o sea, el sesgo caería exactamente donde más daño
// hace. Es el primer uso real de la decisión del Paso 0 §3.1.
//
// Cero créditos: es texto, no audio.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const valor = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const LANG = valor('--lang', 'la');
const SALIDA = path.join(process.cwd(), 'scripts/.cache/treebanks', `extra-${LANG}.json`);
const CACHE = path.join(process.cwd(), 'scripts/.cache/lectura', `ws-${LANG}-anclas`);

const OBRAS = {
  grc: [
    // Los TRES representantes que G5 declara. Ninguno está entero en un
    // treebank UD (Píndaro y Aristófanes no están en absoluto), así que
    // los tres salen de `el.wikisource` y se miden con la misma regla —
    // incluido Homero, que en el treebank sí está: comparar una obra
    // ampliada contra una del treebank sería comparar dos instrumentos.
    // HOMERO NO ENTRA POR AQUÍ, y es un hallazgo: `el.wikisource` **no
    // tiene la Ilíada como texto seguido**. `Ιλιάδα` es un redirect de 20
    // caracteres, `Ιλιάς` un índice de 816, y lo que cuelga del autor son
    // la Batracomiomaquia (una parodia, no Homero), los Himnos homéricos
    // (tampoco) y traducciones modernas. Homero se mide desde el
    // TREEBANK, donde hay 6.003 frases de la Ilíada — y por eso hace
    // falta un puente entre treebank y Wikisource, que lo da SÓFOCLES,
    // presente en los dos.
    { obra: 'Tragedias', autor: 'Sófocles', peldano: 'PUENTE', autorPagina: 'Συγγραφέας:Σοφοκλής' },
    { obra: 'Odas', autor: 'Píndaro', peldano: 'G5', autorPagina: 'Συγγραφέας:Πίνδαρος' },
    { obra: 'Comedias', autor: 'Aristófanes', peldano: 'G5', autorPagina: 'Συγγραφέας:Αριστοφάνης' },
  ],
  la: [
    { obra: 'Eneida', autor: 'Virgilio', peldano: 'L4',
      paginas: ['Aeneis/Liber I', 'Aeneis/Liber II', 'Aeneis/Liber III', 'Aeneis/Liber IV', 'Aeneis/Liber V', 'Aeneis/Liber VI'] },
    { obra: 'Historiae', autor: 'Tácito', peldano: 'L5',
      paginas: ['Historiae (Tacitus)/Liber I', 'Historiae (Tacitus)/Liber II', 'Historiae (Tacitus)/Liber III', 'Historiae (Tacitus)/Liber IV', 'Historiae (Tacitus)/Liber V'] },
    // Los otros DOS representantes que el peldaño L5 declara y que nunca
    // se habían medido, porque no están en ningún treebank UD. El
    // criterio con el que se leerá este resultado lo fijó el coordinador
    // ANTES de correrlo (ver §1.8 del Paso 0), y no se toca después.
    //
    // Horacio viene poema a poema —`Carmina (Horatius)` es un índice de
    // 150 palabras—, así que se expande por prefijo en UNA petición de
    // listado en vez de adivinar 103 títulos.
    { obra: 'Carmina', autor: 'Horacio', peldano: 'L5', prefijo: 'Carmina (Horatius)/' },
    { obra: 'Comedias', autor: 'Plauto', peldano: 'L5',
      paginas: ['Aulularia', 'Miles gloriosus', 'Mostellaria', 'Pseudolus', 'Menaechmi', 'Captivi', 'Rudens'] },
  ],
};

/** El HOST no es `${LANG}.wikisource.org` para el griego antiguo:
 *  **`grc.wikisource.org` NO EXISTE** (medido al escribir el Paso 0: HTTP
 *  000). Los textos griegos antiguos viven en `el.wikisource.org`, junto
 *  a los modernos y a sus traducciones — que es justamente por lo que
 *  hace falta el gate politónico. El primer intento se fue a `grc.` y
 *  murió con un error de red ruidoso; si hubiera devuelto una lista
 *  vacía en silencio, habría medido «Píndaro: 0 páginas» y nadie lo
 *  habría mirado dos veces. */
const HOST = { la: 'la.wikisource.org', grc: 'el.wikisource.org' };

const UA = 'aprende-idiomas-fase-g/1.0 (research; contacto proyecto local)';

/** `fetch` con reintento. La primera corrida del griego murió con un
 *  escueto «fetch failed» en la primera llamada, y la MISMA petición
 *  funcionó a mano medio minuto después: era la red, no la petición. Un
 *  script de ingesta que se cae por eso obliga a rehacer el juicio sobre
 *  si el dato existe, que es peor que esperar tres segundos. */
async function pedir(url, intentos = 4) {
  let ultimo;
  for (let i = 0; i < intentos; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA } });
      if (r.status === 429) { await new Promise((ok) => setTimeout(ok, 6000 * (i + 1))); continue; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r;
    } catch (e) {
      ultimo = e;
      await new Promise((ok) => setTimeout(ok, 2000 * (i + 1)));
    }
  }
  throw new Error(`red: ${ultimo?.message ?? 'agotados los reintentos'} — ${url.slice(0, 110)}`);
}

// ── EL GATE POLITÓNICO (Paso 0 §3.2), y aquí es imprescindible ────────
//
// `el.wikisource` archiva la TRADUCCIÓN AL GRIEGO MODERNO bajo la misma
// página de autor que el original: `Αγαμέμνων` y `Αγαμέμνων (μετάφραση
// Γρυπάρη)` cuelgan las dos de Esquilo. Sin este gate se mediría griego
// moderno creyendo que se mide a Píndaro, y nada fallaría.
//
// Se cuenta en NFD, JAMÁS en NFC: NFC funde el agudo politónico (U+1F71)
// con el monotónico (U+03AC), así que un recuento sobre NFC pierde todos
// los agudos y puede leer un texto politónico como medio moderno.
//
// Y con DENOMINADOR MÍNIMO, porque tres de los seis ceros que se midieron
// al escribir el Paso 0 eran páginas ÍNDICE de 46 a 1.369 caracteres, no
// traducciones: un gate sin mínimo retiraría la Anábasis.
const GRIEGO_RE = /[Ͱ-Ͽἀ-῿]/gu;
const MARCAS_RE = /[̓̔͂̀ͅ]/gu;
const MIN_GRIEGO = 2000;
const MIN_MARCAS_PCT = 2;

function juzgarPolitonico(texto) {
  const nfd = texto.normalize('NFD');
  const griegas = (texto.match(GRIEGO_RE) ?? []).length;
  const marcas = (nfd.match(MARCAS_RE) ?? []).length;
  const pct = griegas ? (100 * marcas) / griegas : 0;
  if (griegas < MIN_GRIEGO) return { ok: false, clase: 'sin-texto', griegas, pct };
  if (pct < MIN_MARCAS_PCT) return { ok: false, clase: 'monotónico (traducción moderna)', griegas, pct };
  return { ok: true, clase: 'politónico', griegas, pct };
}

/** Canonicalización del griego (Paso 0 §3.2): NFC, sigma final a sigma,
 *  los tres signos de elisión a uno, y el agudo a una sola codificación.
 *  Sólo para COMPARAR y CONTAR; el texto que se muestre conserva su ς. */
function canonicalGrc(s) {
  // EL ORDEN IMPORTA, y lo cazó el propio gate de normalización antes de
  // descargar un solo byte: `toLowerCase()` de JavaScript es sensible al
  // contexto y convierte la Σ FINAL en «ς». Con el mapeo ς→σ delante,
  // «ΛΌΓΟΣ» salía «λόγος» —con sigma final— y no casaba con «λόγοσ».
  // Minúsculas PRIMERO, y el mapeo después.
  //
  // ── LA ELISIÓN: el mismo dato en TRES codificaciones ──────────────
  //
  // Medido sobre los dos treebanks, la misma palabra se escribe distinto
  // en cada uno:
  //
  //   PROIEL   «ἀλλ’»  = U+1F00 U+03BB U+03BB **U+2019**   (297 veces)
  //   Perseus  «ἀλλ̓»  = U+1F00 U+03BB U+03BB **U+0313**   (605 veces)
  //
  // Es la cedilla/coma del rumano otra vez, y entre las dos fuentes que
  // este trabajo compara. Y la primera versión hacía algo peor que no
  // unificarlas: **borraba el signo**, dejando «ἀλλ», que no existe en
  // ningún diccionario y no casa con ninguna de las dos. Ese borrado es
  // la mitad del 25 % que movía el puente.
  //
  // La regla: en NFC, una U+0313 SUELTA sólo puede seguir a una
  // consonante —tras vocal el espíritu va precompuesto (ἀ = U+1F00)—, así
  // que ahí es elisión y no espíritu. Se unifica con las demás grafías
  // del apóstrofo y **se conserva**: «ἀλλ'» no es «ἀλλ».
  return s.normalize('NFC')
    .toLowerCase()
    .replace(/ς/g, 'σ')
    .replace(/([βγδεζθκλμνξπρστφχψ])\u0313/gu, "$1'")   // elisión de Perseus
    .replace(/[᾽᾿’ʼ']/g, "'")                            // las demás grafías
    .replace(/΄/g, '́');
}

/** Los NOMBRES DE PERSONAJE del teatro: aparato escénico, no lengua.
 *  Aparecen cientos de veces, caen todos fuera del top-1000 e inflan la
 *  cuenta léxica de las obras dramáticas — la mitad del 26 % que mueve el
 *  puente treebank↔Wikisource.
 *
 *  MI PRIMERA FIRMA ERA DEMASIADO ESTRECHA: supuse mayúsculas
 *  («ΟΙΔΙΠΟΥΣ») y sólo quitó 16 de las ~1.700 de Sófocles. Medido sobre
 *  el HTML crudo, las ediciones no coinciden entre sí:
 *
 *    Sófocles     «χορος» ×407 · «οιδιπους» ×388 · «κρεων» ×185  (MINÚSCULA)
 *    Aristófanes  «ΧΟΡΟΣ» ×195 · «ΔΙΟΝΥΣΟΣ»                      (MAYÚSCULA)
 *
 *  Lo que TODAS comparten, y es la firma buena: **ni un solo diacrítico**.
 *  En un texto politónico cada palabra real lleva acento o espíritu; una
 *  palabra pelada es aparato.
 *
 *  El corte de longitud ≥5 protege a las enclíticas y proclíticas cortas,
 *  que sí pueden ir sin acento (τε, γε, τις, ποτε). No es una regla
 *  perfecta —por eso el filtro INFORMA de lo que quita y falla si se
 *  desmadra—, es una regla auditable. */
// ⚠ Este rango se escribió mal la primera vez y el propio gate lo cazó
// antes de producir un dato: puse `\u03AC-\u03CE` creyendo que eran las
// vocales acentuadas, y **ese rango contiene el alfabeto griego minúsculo
// ENTERO** (U+03B1 es la alfa pelada). Con él, toda palabra parecía
// acentuada y el filtro no reconocía ni «χορος». Ahora van enumeradas una
// a una: acentuadas y con diéresis, minúsculas y mayúsculas, más el
// bloque politónico y los combinantes.
const RE_DIACRITICO = /[\u0300-\u036F\u1F00-\u1FFF\u0384\u0385\u0386\u0388\u0389\u038A\u038C\u038E\u038F\u0390\u03AA\u03AB\u03AC\u03AD\u03AE\u03AF\u03B0\u03CA\u03CB\u03CC\u03CD\u03CE]/u;
function esAcotacion(bruto) {
  const nfc = bruto.normalize('NFC');
  return nfc.length >= 5 && !RE_DIACRITICO.test(nfc) && !/['\u2019]/.test(nfc);
}

/** La canonicalización del latín del Paso 0 §3.1. Duplicada a propósito
 *  en el runtime .mjs, igual que `texto-ro.mjs` duplica la del rumano; el
 *  script de medición tiene la suya y las dos se comprueban contra los
 *  mismos casos abajo. */
function canonicalLa(s) {
  return s.normalize('NFD').replace(/̄/g, '').normalize('NFC').toLowerCase();
}

/** Expande un prefijo a sus páginas reales con UNA petición de listado.
 *  Adivinar 103 títulos de Horacio sería inventar datos; `allpages` los
 *  dice. Se excluye la página raíz, que es un índice sin texto. */
async function expandir(prefijo) {
  const url = `https://${HOST[LANG]}/w/api.php?` + new URLSearchParams({
    action: 'query', list: 'allpages', apprefix: prefijo, apnamespace: '0', aplimit: 'max', format: 'json',
  });
  const r = await pedir(url);
  const j = await r.json();
  await new Promise((ok) => setTimeout(ok, 1500));
  return j.query.allpages.map((x) => x.title).filter((t) => t !== prefijo.replace(/\/$/, ''));
}

/** Las obras de una página de autor, en UNA petición. Adivinar títulos
 *  griegos sería inventar el corpus, y además la página de autor mezcla
 *  obras con traductores («Ιωάννης Γρυπάρης» cuelga de Píndaro y es una
 *  persona, no una oda): el gate politónico es lo que los separa. */
async function obrasDeAutor(pagina) {
  const url = `https://${HOST[LANG]}/w/api.php?` + new URLSearchParams({
    action: 'query', titles: pagina, prop: 'links', pllimit: 'max', plnamespace: '0', format: 'json',
  });
  const r = await pedir(url);
  const j = await r.json();
  const p = Object.values(j.query.pages)[0];
  if (p.missing !== undefined) throw new Error(`${pagina}: no existe`);
  await new Promise((ok) => setTimeout(ok, 1500));
  return (p.links ?? []).map((x) => x.title);
}

async function bajar(pagina) {
  fs.mkdirSync(CACHE, { recursive: true });
  const f = path.join(CACHE, `${pagina.replace(/[/\s]/g, '_')}.html`);
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const url = `https://${HOST[LANG]}/w/api.php?` +
    new URLSearchParams({ action: 'parse', page: pagina, prop: 'text', format: 'json' });
  const r = await pedir(url);
  const j = await r.json();
  if (j.error) throw new Error(`${pagina}: ${j.error.code}`);
  const html = j.parse.text['*'];
  fs.writeFileSync(f, html);
  await new Promise((ok) => setTimeout(ok, 1500));   // cortesía con Wikimedia
  return html;
}

/** Del HTML a formas canónicas. Se quita el aparato de Wikisource igual
 *  que hace `ingesta-wikisource.mjs`: notas al pie, navegación y números
 *  de página del escaneo, que es donde vive el aparato del editor moderno
 *  (y por tanto lo que tiene derechos). */
function textoPlano(html) {
  return html
    .replace(/<sup[^>]*class="[^"]*reference[^"]*"[\s\S]*?<\/sup>/g, ' ')
    .replace(/<ol[^>]*class="[^"]*references[^"]*"[\s\S]*?<\/ol>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<table[\s\S]*?<\/table>/g, (t) => (griegasEn(t) < 200 && latinasEn(t) < 400 ? ' ' : t))
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#\d+;|&[a-z]+;/g, ' ');
}

// ── POR QUÉ LAS TABLAS NO SE BORRAN ENTERAS ───────────────────────────
//
// La primera versión hacía `.replace(/<table…<\/table>/g, ' ')` para
// quitar el aparato de Wikisource. En `el.wikisource` **el texto de las
// tragedias VIVE DENTRO DE TABLAS**: medido sobre la caché, las siete
// obras de Sófocles y las Ranas de Aristófanes tienen el **99,8-99,9 %**
// de sus caracteres griegos dentro de `<table>`. El limpiador las dejaba
// en 36 caracteres y el gate politónico informaba «sin-texto (0
// griegas)» — **un veredicto que parece legítimo y que en realidad
// describía el destrozo del limpiador, no la página.**
//
// Sólo se vio porque seis de siete obras de Sófocles dando cero es
// implausible. Es la lección de siempre: un 0 puede ser «no he mirado».
//
// La regla nueva quita la tabla SÓLO si es pequeña —menos de 200
// caracteres griegos y menos de 400 latinos—, que es el tamaño de una
// caja de navegación, y conserva las que llevan texto. Medido: las
// páginas sanas (Píndaro, ocho comedias) tienen 0-0,1 % en tablas, así
// que la regla no las toca.
const griegasEn = (t) => (t.match(/[Ͱ-Ͽἀ-῿]/gu) ?? []).length;
const latinasEn = (t) => (t.match(/[A-Za-zÀ-ÿ]/g) ?? []).length;

/** Formas griegas canónicas de un HTML ya limpio, con el aparato
 *  escénico fuera y CONTADO.
 *
 *  Que informe de cuánto quita no es adorno: es un borrado que depende
 *  del contenido, y un limpiador silencioso es exactamente lo que dejó
 *  seis obras de Sófocles en cero. Igual que el fichero de erratas de la
 *  biblioteca, la corrección se aplica **y se queja** si deja de casar
 *  con lo esperado. */
function formasGrc(plano) {
  const out = [];
  const vistas = new Map();
  let personajes = 0;
  for (const m of plano.matchAll(/[Ͱ-Ͽἀ-῿][Ͱ-Ͽἀ-῿̀-ͯ'’᾽᾿ʼ]*/gu)) {
    const bruto = m[0].normalize('NFC');
    if (esAcotacion(bruto)) { personajes++; vistas.set(bruto, (vistas.get(bruto) ?? 0) + 1); continue; }
    // El apóstrofo INICIAL sí se quita (es cita o prodelisión); el FINAL
    // se conserva, porque es la elisión y distingue la palabra.
    const w = canonicalGrc(bruto).replace(/^'+/, '');
    if (w.length > 1) out.push(w);
  }
  return { formas: out, personajes, vistas };
}

function formasDe(html) {
  const limpio = html
    .replace(/<sup[^>]*class="[^"]*reference[^"]*"[\s\S]*?<\/sup>/g, ' ')
    .replace(/<ol[^>]*class="[^"]*references[^"]*"[\s\S]*?<\/ol>/g, ' ')
    .replace(/<table[\s\S]*?<\/table>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#\d+;|&[a-z]+;/g, ' ');
  const out = [];
  for (const m of limpio.matchAll(/[A-Za-zĀ-ſ̀-ͯ]+/g)) {
    const w = canonicalLa(m[0]);
    if (w.length > 0) out.push(w);
  }
  return out;
}

async function main() {
  if (!OBRAS[LANG]) throw new Error(`--lang ${LANG}: sólo «la» por ahora`);

  // El gate de la normalización, visto antes de traer nada: si esto no
  // pasa, el texto que se descargue no será comparable con el treebank.
  // El gate de la normalización, visto antes de traer nada. El del griego
  // se prueba contra formas CON los signos que el coordinador avisó que
  // rompen las comparaciones —elisión, iota suscrita, espíritus—, no
  // contra la forma limpia.
  const casos = LANG === 'la'
    ? [['Rōma', 'roma'], ['Roma', 'roma'], ['dīvīsa', 'divisa'], ['partēs', 'partes'], ['VENIT', 'venit']]
    : [['λόγος', 'λόγοσ'], ['ΛΌΓΟΣ', 'λόγοσ'], ['δ᾽', "δ'"], ['δ’', "δ'"], ['ᾳ', 'ᾳ'], ['ἁ', 'ἁ']];
  const canon = LANG === 'la' ? canonicalLa : canonicalGrc;
  for (const [dentro, fuera] of casos) {
    if (canon(dentro) !== fuera) throw new Error(`canon("${dentro}") = "${canon(dentro)}" (U+${[...canon(dentro)].map((c) => c.codePointAt(0).toString(16)).join(' U+')}), esperaba "${fuera}"`);
  }
  if (LANG === 'la' && canonicalLa('Rōma') !== canonicalLa('Roma')) throw new Error('el mácrón no se está quitando');
  if (LANG === 'grc') {
    if (canonicalGrc('λόγος') !== canonicalGrc('λόγοσ')) throw new Error('sigma final y sigma no se funden');
    // Y lo que NO debe fundirse: el politónico es el rasgo examinado.
    if (canonicalGrc('ἁ') === canonicalGrc('ἀ')) throw new Error('la canonicalización está borrando los espíritus: taparía el rasgo que el gate examina');
    if (canonicalGrc('ᾳ') === canonicalGrc('α')) throw new Error('la canonicalización está borrando la iota suscrita');

    // ── EL GUARDIÁN DE LA ELISIÓN ────────────────────────────────────
    //
    // Faltaba, y es justo el rasgo que se rompió: los guardianes cubrían
    // lo que a alguien se le ocurrió, y la elisión no se le ocurrió a
    // nadie. Las formas son REALES y de fuentes distintas — «ἀλλ’» tal
    // como la escribe PROIEL (297 veces) y «ἀλλ̓» tal como la escribe
    // Perseus (605), que es la misma palabra de Sófocles en dos
    // codificaciones.
    const proiel = 'ἀλλ\u2019', perseus = 'ἀλλ\u0313', llano = "ἀλλ'";
    if (canonicalGrc(proiel) !== canonicalGrc(perseus)) {
      throw new Error(`la elisión no se unifica: PROIEL «${proiel}» → «${canonicalGrc(proiel)}» y Perseus «${perseus}» → «${canonicalGrc(perseus)}»`);
    }
    if (canonicalGrc(proiel) !== canonicalGrc(llano)) throw new Error('el apóstrofo llano no se unifica con los tipográficos');
    // Y lo contrario, que es el fallo que se pagó: el signo NO se borra.
    if (canonicalGrc(proiel) === canonicalGrc('ἀλλ')) {
      throw new Error('la elisión se está BORRANDO: «ἀλλ\u2019» y «ἀλλ» no son la misma palabra, y «ἀλλ» no existe');
    }
    // Y la U+0313 tras VOCAL sigue siendo espíritu, no elisión.
    if (canonicalGrc('ἀ').includes("'")) throw new Error('el espíritu suave sobre vocal se está leyendo como elisión');

    // Y el filtro de acotaciones: quita las capitales peladas y NADA más.
    // Las formas REALES de las dos ediciones, no una inventada: Sófocles
    // escribe los nombres en minúscula pelada y Aristófanes en mayúscula.
    for (const acot of ['χορος', 'οιδιπους', 'κρεων', 'αντιγονη', 'ΧΟΡΟΣ', 'ΔΙΟΝΥΣΟΣ']) {
      if (!esAcotacion(acot)) throw new Error(`el filtro de acotaciones no reconoce «${acot}», que es aparato escénico`);
    }
    // Y lo que NO puede comerse: lengua de verdad, incluidas las
    // enclíticas cortas que sí van sin acento.
    for (const real of ['ἀλλά', 'Ἀντιγόνη', 'λόγος', 'μῆνιν', 'τε', 'γε', 'τις', 'ποτε', "ἀλλ\u2019"]) {
      if (esAcotacion(real.normalize('NFC'))) throw new Error(`el filtro de acotaciones se comería «${real}», que es lengua`);
    }
  }
  console.log(`normalización comprobada sobre ${casos.length} casos (${LANG === 'la' ? 'mácrón fuera' : 'ς→σ, elisión unificada, espíritus y iota INTACTOS'}).`);

  const salida = [];
  for (const o of OBRAS[LANG]) {
    const formas = [];
    const paginas = o.paginas ?? (o.autorPagina ? await obrasDeAutor(o.autorPagina) : await expandir(o.prefijo));
    if (!o.paginas) console.log(`  ${o.autor}: ${paginas.length} páginas candidatas`);
    const retiradas = [];
    const acotaciones = new Map();
    let quitados = 0;
    for (const pagina of paginas) {
      let html;
      try { html = await bajar(pagina); } catch (e) { retiradas.push(`${pagina} — ${e.message}`); continue; }
      if (LANG === 'grc') {
        // EL GATE, antes de contar una sola forma.
        const plano = textoPlano(html);
        const v = juzgarPolitonico(plano);
        if (!v.ok) { retiradas.push(`${pagina} — ${v.clase} (${v.griegas} griegas, ${v.pct.toFixed(1)} % marcas)`); continue; }
        const { formas: f, personajes, vistas } = formasGrc(plano);
        for (const [w, n] of vistas) acotaciones.set(w, (acotaciones.get(w) ?? 0) + n);
        const pctPers = (100 * personajes) / (f.length + personajes);
        // Un borrado por contenido que se descontrola en cualquiera de
        // las dos direcciones tiene que sonar. En estos textos el aparato
        // escénico ronda el 1-3 %: por encima del 8 % está mordiendo
        // palabras reales.
        if (pctPers > 8) throw new Error(`${pagina}: el filtro de acotaciones quita el ${pctPers.toFixed(1)} % de las palabras — está mordiendo lengua, no aparato`);
        quitados += personajes;
        console.log(`  ✔ ${pagina.padEnd(40)} ${f.length.toLocaleString('es').padStart(8)} formas · ${v.pct.toFixed(1)} % marcas` +
          (personajes ? ` · −${personajes} acotaciones (${pctPers.toFixed(1)} %)` : ''));
        formas.push(...f);
        continue;
      }
      const f = formasDe(html);
      if (!o.prefijo) console.log(`  ${pagina.padEnd(34)} ${f.length.toLocaleString('es').padStart(8)} formas`);
      formas.push(...f);
    }
    if (retiradas.length) {
      console.log(`  ── retiradas por el gate: ${retiradas.length} de ${paginas.length}`);
      for (const r of retiradas.slice(0, 8)) console.log(`     · ${r}`);
      if (retiradas.length > 8) console.log(`     · … y ${retiradas.length - 8} más`);
    }
    // Se guarda el recuento por forma Y LOS TOKENS EN ORDEN, troceados en
    // bloques de 500. El orden hace falta para el bootstrap por bloques:
    // remuestrear una lista agrupada por forma no remuestrea texto,
    // remuestrea la agrupación con que se construyó la lista — que es el
    // fallo que tuvo la primera versión y daba intervalos absurdos.
    const cuenta = {};
    for (const w of formas) cuenta[w] = (cuenta[w] ?? 0) + 1;
    const bloques = [];
    for (let i = 0; i < formas.length; i += 500) bloques.push(formas.slice(i, i + 500));
    salida.push({ obra: o.obra, autor: o.autor, peldano: o.peldano, paginas, total: formas.length, cuenta, bloques });
    console.log(`${o.obra} (${o.autor}): ${formas.length.toLocaleString('es')} formas · ${Object.keys(cuenta).length.toLocaleString('es')} distintas` +
      (quitados ? ` · ${quitados.toLocaleString('es')} acotaciones fuera` : '') + '\n');
    if (acotaciones.size) {
      // Se IMPRIME lo que se quitó, para que sea auditable: un borrado por
      // contenido que nadie puede revisar es el que dejó seis obras en cero.
      const top = [...acotaciones.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
      console.log(`     acotaciones retiradas (${acotaciones.size} formas distintas): ` + top.map(([w, n]) => `${w}×${n}`).join(' · '));
    }
  }
  fs.writeFileSync(SALIDA, JSON.stringify(salida));
  console.log(`escrito ${SALIDA} (${(fs.statSync(SALIDA).size / 1e3).toFixed(0)} kB)`);
}

main().catch((e) => { console.error(String(e.message ?? e)); process.exit(1); });
