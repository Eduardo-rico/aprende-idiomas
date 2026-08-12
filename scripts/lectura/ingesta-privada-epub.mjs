// scripts/lectura/ingesta-privada-epub.mjs — ingesta del ESTANTE PRIVADO
// desde EPUB (2026-08-12).
//
// Obras con derechos que Edu posee como copia personal. El OUTPUT va a
// `lib/data/languages/pt/lecturas-privadas/` — gitignorado, con test de
// línea roja que revienta si git lo trackea. El script sí se commitea:
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
// Gates (probados en rojo con un EPUB sin <p>):
//   · cada capítulo necesita título (h1/h2) y ≥ minPalabras
//   · cero tags HTML ni entidades sin resolver en el texto final
//   · cero párrafos vacíos
//   · el id no puede existir en el catálogo PÚBLICO (colisión = abortar)
// Ningún descarte silencioso: lo que se salta, se reporta.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const cfgPath = process.argv[2];
if (!cfgPath) { console.error('uso: node ingesta-privada-epub.mjs <config.json>'); process.exit(1); }
const cfg = JSON.parse(await fs.readFile(cfgPath, 'utf8'));

const OUT = path.join(process.cwd(), 'lib/data/languages/pt/lecturas-privadas');
const PUB = path.join(process.cwd(), 'lib/data/languages/pt/lecturas');

// ── extraer los xhtml del epub (unzip -p; el epub es un zip) ──
const lista = execSync(`unzip -Z1 "${cfg.epub}"`, { encoding: 'utf8' })
  .split('\n').filter((n) => n.startsWith(cfg.capitulos) && /\.x?html$/.test(n)).sort();
if (lista.length === 0) { console.error(`GATE: ningún capítulo casa con «${cfg.capitulos}»`); process.exit(1); }

function limpiar(htmlTexto) {
  return htmlTexto
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/[ \t]+/g, ' ')
    .trim();
}

const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);

const publicos = new Set((await fs.readdir(PUB)).map((f) => f.replace(/\.json$/, '')));
await fs.mkdir(OUT, { recursive: true });

let orden = 0, totalPalabras = 0;
const errores = [], escritos = [];
for (const cap of lista) {
  const raw = execSync(`unzip -p "${cfg.epub}" "${cap}"`, { encoding: 'utf8' });
  const t = raw.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/);
  const titulo = t ? limpiar(t[1]).replace(/\s*\n\s*/g, ' ') : null;
  if (!titulo) { errores.push(`${cap}: sin título h1/h2`); continue; }
  const parrafos = [...raw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
    .map((m) => limpiar(m[1]).replace(/\s*\n\s*/g, ' ').trim())
    .filter((x) => x.length > 0);
  const palabras = parrafos.join(' ').split(/\s+/).filter(Boolean).length;
  if (palabras < (cfg.minPalabras ?? 30)) { errores.push(`${cap} («${titulo}»): ${palabras} palabras < mínimo`); continue; }
  // gates de limpieza
  const sucio = parrafos.find((p) => /<|>|&[a-z#]+;/.test(p));
  if (sucio) { errores.push(`${cap}: HTML/entidad residual: «${sucio.slice(0, 60)}»`); continue; }

  orden += 1;
  const id = `${cfg.serieId}-${String(orden).padStart(2, '0')}-${slug(titulo)}`;
  if (publicos.has(id)) { console.error(`GATE: colisión de id con el catálogo público: ${id}`); process.exit(1); }
  totalPalabras += palabras;
  const lectura = {
    id, titulo, autor: cfg.autor,
    fuente: `copia personal de Edu (${path.basename(cfg.epub).slice(0, 60)})`,
    licencia: 'copia personal — NO redistribuir; estante privado gitignorado',
    nivel: cfg.nivel, modo: 'texto', privada: true, variante: cfg.variante,
    serie: { id: cfg.serieId, titulo: cfg.serieTitulo, orden },
    parrafos: parrafos.map((texto) => ({ texto })),
  };
  await fs.writeFile(path.join(OUT, `${id}.json`), JSON.stringify(lectura, null, 1) + '\n');
  escritos.push(`${id} · ${palabras} palabras · ${parrafos.length} párrafos`);
}

console.log(`\n${cfg.serieTitulo}: ${escritos.length} lecturas escritas, ${totalPalabras} palabras (medidas)`);
for (const e of escritos) console.log('  ✓ ' + e);
if (errores.length) {
  console.log(`\ndescartes REPORTADOS (${errores.length}):`);
  for (const e of errores) console.log('  ✗ ' + e);
}
