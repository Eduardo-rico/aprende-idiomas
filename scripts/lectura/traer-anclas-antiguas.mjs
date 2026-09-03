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
  la: [
    { obra: 'Eneida', autor: 'Virgilio', peldano: 'L4',
      paginas: ['Aeneis/Liber I', 'Aeneis/Liber II', 'Aeneis/Liber III', 'Aeneis/Liber IV', 'Aeneis/Liber V', 'Aeneis/Liber VI'] },
    { obra: 'Historiae', autor: 'Tácito', peldano: 'L5',
      paginas: ['Historiae (Tacitus)/Liber I', 'Historiae (Tacitus)/Liber II', 'Historiae (Tacitus)/Liber III', 'Historiae (Tacitus)/Liber IV', 'Historiae (Tacitus)/Liber V'] },
  ],
};

const UA = 'aprende-idiomas-fase-g/1.0 (research; contacto proyecto local)';

/** La canonicalización del latín del Paso 0 §3.1. Duplicada a propósito
 *  en el runtime .mjs, igual que `texto-ro.mjs` duplica la del rumano; el
 *  script de medición tiene la suya y las dos se comprueban contra los
 *  mismos casos abajo. */
function canonicalLa(s) {
  return s.normalize('NFD').replace(/̄/g, '').normalize('NFC').toLowerCase();
}

async function bajar(pagina) {
  fs.mkdirSync(CACHE, { recursive: true });
  const f = path.join(CACHE, `${pagina.replace(/[/\s]/g, '_')}.html`);
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const url = `https://${LANG}.wikisource.org/w/api.php?` +
    new URLSearchParams({ action: 'parse', page: pagina, prop: 'text', format: 'json' });
  for (let i = 0; i < 5; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (r.status === 429) { await new Promise((ok) => setTimeout(ok, 6000 * (i + 1))); continue; }
    if (!r.ok) throw new Error(`${pagina}: HTTP ${r.status}`);
    const j = await r.json();
    if (j.error) throw new Error(`${pagina}: ${j.error.code}`);
    const html = j.parse.text['*'];
    fs.writeFileSync(f, html);
    await new Promise((ok) => setTimeout(ok, 1500));   // cortesía con Wikimedia
    return html;
  }
  throw new Error(`${pagina}: 429 persistente`);
}

/** Del HTML a formas canónicas. Se quita el aparato de Wikisource igual
 *  que hace `ingesta-wikisource.mjs`: notas al pie, navegación y números
 *  de página del escaneo, que es donde vive el aparato del editor moderno
 *  (y por tanto lo que tiene derechos). */
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
  const casos = [['Rōma', 'roma'], ['Roma', 'roma'], ['dīvīsa', 'divisa'], ['partēs', 'partes'], ['VENIT', 'venit']];
  for (const [dentro, fuera] of casos) {
    if (canonicalLa(dentro) !== fuera) throw new Error(`canonicalLa("${dentro}") = "${canonicalLa(dentro)}", esperaba "${fuera}"`);
  }
  if (canonicalLa('Rōma') !== canonicalLa('Roma')) throw new Error('el mácrón no se está quitando: Rōma ≠ Roma');
  console.log(`normalización comprobada sobre ${casos.length} casos (mácrón fuera, minúsculas, NFC).`);

  const salida = [];
  for (const o of OBRAS[LANG]) {
    const formas = [];
    for (const pagina of o.paginas) {
      const html = await bajar(pagina);
      const f = formasDe(html);
      console.log(`  ${pagina.padEnd(34)} ${f.length.toLocaleString('es').padStart(8)} formas`);
      formas.push(...f);
    }
    // Se guarda el RECUENTO por forma, no la lista: es lo que consume la
    // métrica y ocupa 30 veces menos.
    const cuenta = {};
    for (const w of formas) cuenta[w] = (cuenta[w] ?? 0) + 1;
    salida.push({ obra: o.obra, autor: o.autor, peldano: o.peldano, paginas: o.paginas, total: formas.length, cuenta });
    console.log(`${o.obra} (${o.autor}): ${formas.length.toLocaleString('es')} formas · ${Object.keys(cuenta).length.toLocaleString('es')} distintas\n`);
  }
  fs.writeFileSync(SALIDA, JSON.stringify(salida));
  console.log(`escrito ${SALIDA} (${(fs.statSync(SALIDA).size / 1e3).toFixed(0)} kB)`);
}

main().catch((e) => { console.error(String(e.message ?? e)); process.exit(1); });
