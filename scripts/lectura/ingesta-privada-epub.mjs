// scripts/lectura/ingesta-privada-epub.mjs — ingesta del ESTANTE PRIVADO
// desde EPUB (2026-08-12).
//
// Obras con derechos que Edu posee como copia personal. El OUTPUT va a
// `lib/data/languages/<lang>/lecturas-privadas/` — gitignorado, con test
// de línea roja que revienta si git lo trackea. El script sí se commitea:
// el código es nuestro, el contenido no.
//
// Uso:
//   node scripts/lectura/ingesta-privada-epub.mjs <config.json>
//
// config.json (el de cada libro NO se commitea si cita el archivo):
//   { "epub": "ingesta-privada/….epub",
//     "serieId": "o-senhor-calvino",
//     "serieTitulo": "O Senhor Calvino e o Passeio",
//     "autor": "Gonçalo M. Tavares",
//     "variante": "pt", "nivel": "B1",
//     "capitulos": "OEBPS/Text/SENHOR_CALVINO_",   // prefijo de los xhtml con contenido
//     "minPalabras": 30 }
//
// Estante cs/ru (2026-09-02): `lang` (default pt) y `raizSalida` (el
// checkout principal, no el worktree) como en el ingestor PDF; y el modo
// «viñetas» para una NOVELA que viene en UN solo xhtml sin títulos
// (Šabach, Opilé banány: 30 viñetas marcadas «• »): `capitulos` puede
// ser un array de ficheros y `marcador` parte cada fichero en piezas
// por el párrafo que empieza con la marca; el título es el íncipit.
//
// Gates (probados en rojo con un EPUB sin <p>):
//   · cada capítulo necesita título (h1/h2) y ≥ minPalabras
//   · cero tags HTML ni entidades sin resolver en el texto final
//   · cero párrafos vacíos
//   · el id no puede existir en el catálogo PÚBLICO (colisión = abortar)
// Ningún descarte silencioso: lo que se salta, se reporta.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cfgPath = process.argv[2];
if (!cfgPath) { console.error('uso: node ingesta-privada-epub.mjs <config.json>'); process.exit(1); }
const cfg = JSON.parse(await fs.readFile(cfgPath, 'utf8'));

const LANG = cfg.lang ?? 'pt';
const RAIZ = cfg.raizSalida ?? process.cwd();
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(RAIZ, `lib/data/languages/${LANG}/lecturas-privadas`);
const PUB = path.join(RAIZ, `lib/data/languages/${LANG}/lecturas`);

// ── extraer los xhtml del epub (unzip -p; el epub es un zip) ──
const todos = execSync(`unzip -Z1 "${cfg.epub}"`, { encoding: 'utf8' }).split('\n');
const lista = Array.isArray(cfg.capitulos)
  ? cfg.capitulos.filter((n) => todos.includes(n))
  : todos.filter((n) => n.startsWith(cfg.capitulos) && /\.x?html$/.test(n)).sort();
if (lista.length === 0) { console.error(`GATE: ningún capítulo casa con «${cfg.capitulos}»`); process.exit(1); }

function limpiar(htmlTexto) {
  return htmlTexto
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/ /g, ' ')   // el nbsp de «v&#160;pusách» (Palmknihy) es un espacio
    .replace(/[ \t]+/g, ' ')
    .trim();
}

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

const publicos = new Set((await fs.readdir(PUB)).map((f) => f.replace(/\.json$/, '')));
await fs.mkdir(OUT, { recursive: true });

/** Piezas de un xhtml: [{titulo, parrafos}]. Con `marcador`, se parte por
 *  el párrafo que empieza con la marca (que se quita); lo anterior a la
 *  primera marca (epígrafes) se descarta Y SE REPORTA. */
function piezasDe(cap, raw) {
  const parrafos = [...raw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((m) => limpiar(m[1]).replace(/\s*\n\s*/g, ' ').trim())
    .filter((x) => x.length > 0);
  if (!cfg.marcador) {
    const t = raw.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/);
    const titulo = t ? limpiar(t[1]).replace(/\s*\n\s*/g, ' ') : null;
    return titulo ? [{ titulo, parrafos }] : [{ titulo: null, parrafos }];
  }
  const piezas = [];
  let actual = null, previas = 0;
  for (const p of parrafos) {
    if (p.startsWith(cfg.marcador)) {
      actual = { titulo: null, parrafos: [p.slice(cfg.marcador.length).trim()] };
      piezas.push(actual);
    } else if (actual) actual.parrafos.push(p);
    else previas += 1;
  }
  if (previas) console.log(`  (${cap}: ${previas} párrafos antes de la primera marca «${cfg.marcador}», descartados: epígrafes)`);
  for (const pz of piezas) {
    // título = íncipit (primeras ~6 palabras), con el número de viñeta
    const inc = pz.parrafos[0].split(/\s+/).slice(0, 6).join(' ').replace(/[,;:.!?…„“"]+$/, '');
    pz.titulo = `${inc}…`;
  }
  return piezas;
}

let orden = 0, totalPalabras = 0;
const errores = [], escritos = [];
for (const cap of lista) {
  const raw = execSync(`unzip -p "${cfg.epub}" "${cap}"`, { encoding: 'utf8', maxBuffer: 64 << 20 });
  for (const { titulo, parrafos } of piezasDe(cap, raw)) {
    if (!titulo) { errores.push(`${cap}: sin título h1/h2`); continue; }
    const palabras = parrafos.join(' ').split(/\s+/).filter((t) => /\p{L}/u.test(t)).length;
    if (palabras < (cfg.minPalabras ?? 30)) { errores.push(`${cap} («${titulo}»): ${palabras} palabras < mínimo`); continue; }
    // gates de limpieza
    const sucio = parrafos.find((p) => /<|>|&[a-z#]+;/.test(p));
    if (sucio) { errores.push(`${cap}: HTML/entidad residual: «${sucio.slice(0, 60)}»`); continue; }

    orden += 1;
    const num = String(orden).padStart(2, '0');
    const tituloFinal = cfg.marcador ? `${orden}. ${titulo}` : titulo;
    const id = `${cfg.serieId}-${num}-${slug(titulo)}`;
    if (publicos.has(id)) { console.error(`GATE: colisión de id con el catálogo público: ${id}`); process.exit(1); }
    totalPalabras += palabras;
    const lectura = {
      id, titulo: tituloFinal, autor: cfg.autor,
      fuente: `copia personal de Edu (${path.basename(cfg.epub).slice(0, 60)})`,
      licencia: 'copia personal — NO redistribuir; estante privado gitignorado',
      nivel: cfg.nivel, modo: 'texto', privada: true, variante: cfg.variante,
      ...(cfg.notaOrtografia ? { notaOrtografia: cfg.notaOrtografia } : {}),
      serie: { id: cfg.serieId, titulo: cfg.serieTitulo, orden },
      parrafos: parrafos.map((texto) => ({ texto })),
    };
    await fs.writeFile(path.join(OUT, `${id}.json`), JSON.stringify(lectura, null, 1) + '\n');
    escritos.push({ id, linea: `${id} · ${palabras} palabras · ${parrafos.length} párrafos` });
  }
}

console.log(`\n${cfg.serieTitulo}: ${escritos.length} lecturas escritas, ${totalPalabras} palabras (medidas)`);
for (const e of escritos) console.log('  ✓ ' + e.linea);
if (errores.length) {
  console.log(`\ndescartes REPORTADOS (${errores.length}):`);
  for (const e of errores) console.log('  ✗ ' + e);
}

// Normalización con el módulo de la lengua y gate, como el ingestor PDF.
// Si el gate falla, se borra lo escrito.
if (LANG !== 'pt' && escritos.length) {
  const ids = escritos.map((e) => e.id);
  const n = spawnSync('node', [path.join(AQUI, 'normalizar-privadas.mjs'), LANG, OUT, ...ids], { encoding: 'utf8' });
  process.stdout.write(n.stdout);
  if (n.status !== 0) { console.error(`normalizar-privadas.mjs falló: ${n.stderr}`); process.exit(1); }
  const g = spawnSync('node', [path.join(AQUI, 'gate-privadas.mjs'), LANG, OUT], { encoding: 'utf8' });
  process.stdout.write(g.stdout);
  if (g.status !== 0) {
    for (const id of ids) await fs.rm(path.join(OUT, `${id}.json`), { force: true });
    console.error(`GATE de ${LANG} en rojo — nada queda escrito`); process.exit(1);
  }
}
