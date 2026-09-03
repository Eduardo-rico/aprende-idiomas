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
    { obra: 'Ilíada', autor: 'Homero', peldano: 'G5', autorPagina: 'Συγγραφέας:Όμηρος' },
    { obra: 'Odas', autor: 'Píndaro', peldano: 'G5', autorPagina: 'Συγγραφέας:Πίνδαρος' },
    { obra: 'Comedias', autor: 'Aristófanes', peldano: 'G5', autorPagina: 'Συγγραφέας:Αριστοφάνης' },
    { obra: 'Tragedias', autor: 'Sófocles', peldano: 'G4', autorPagina: 'Συγγραφέας:Σοφοκλής' },
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
  // Minúsculas PRIMERO, y el mapeo después. Es la misma familia que el
  // guion del rumano: una equivalencia probada sólo contra la forma
  // limpia pasa, y falla contra la forma que lleva el signo.
  return s.normalize('NFC')
    .toLowerCase()
    .replace(/ς/g, 'σ')
    .replace(/[᾽᾿’']/g, "'")
    .replace(/΄/g, '́');
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
  const url = `https://${LANG}.wikisource.org/w/api.php?` + new URLSearchParams({
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
  const url = `https://${LANG}.wikisource.org/w/api.php?` + new URLSearchParams({
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
  const url = `https://${LANG}.wikisource.org/w/api.php?` +
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
    .replace(/<table[\s\S]*?<\/table>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#\d+;|&[a-z]+;/g, ' ');
}

/** Formas griegas canónicas de un HTML ya limpio. */
function formasGrc(plano) {
  const out = [];
  for (const m of plano.matchAll(/[Ͱ-Ͽἀ-῿][Ͱ-Ͽἀ-῿̀-ͯ'’᾽᾿]*/gu)) {
    const w = canonicalGrc(m[0]).replace(/^'+|'+$/g, '');
    if (w.length > 1) out.push(w);
  }
  return out;
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
  }
  console.log(`normalización comprobada sobre ${casos.length} casos (${LANG === 'la' ? 'mácrón fuera' : 'ς→σ, elisión unificada, espíritus y iota INTACTOS'}).`);

  const salida = [];
  for (const o of OBRAS[LANG]) {
    const formas = [];
    const paginas = o.paginas ?? (o.autorPagina ? await obrasDeAutor(o.autorPagina) : await expandir(o.prefijo));
    if (!o.paginas) console.log(`  ${o.autor}: ${paginas.length} páginas candidatas`);
    const retiradas = [];
    for (const pagina of paginas) {
      let html;
      try { html = await bajar(pagina); } catch (e) { retiradas.push(`${pagina} — ${e.message}`); continue; }
      if (LANG === 'grc') {
        // EL GATE, antes de contar una sola forma.
        const plano = textoPlano(html);
        const v = juzgarPolitonico(plano);
        if (!v.ok) { retiradas.push(`${pagina} — ${v.clase} (${v.griegas} griegas, ${v.pct.toFixed(1)} % marcas)`); continue; }
        const f = formasGrc(plano);
        console.log(`  ✔ ${pagina.padEnd(40)} ${f.length.toLocaleString('es').padStart(8)} formas · ${v.pct.toFixed(1)} % marcas`);
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
    console.log(`${o.obra} (${o.autor}): ${formas.length.toLocaleString('es')} formas · ${Object.keys(cuenta).length.toLocaleString('es')} distintas\n`);
  }
  fs.writeFileSync(SALIDA, JSON.stringify(salida));
  console.log(`escrito ${SALIDA} (${(fs.statSync(SALIDA).size / 1e3).toFixed(0)} kB)`);
}

main().catch((e) => { console.error(String(e.message ?? e)); process.exit(1); });
