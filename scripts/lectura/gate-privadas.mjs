// Gate de lengua sobre el ESTANTE PRIVADO (fase F, 2026-09-02).
//
//   node scripts/lectura/gate-privadas.mjs <ro|cs|ru> [dir]
//
// Lo llaman `ingesta-privada-pdf.py` y `ingesta-privada-epub.mjs` al
// terminar, para que la regla de cada lengua (rumano: diacríticos
// presentes, cero cedillas, grafía medida; checo: diacríticos y letras
// propias; ruso: cirílico, sin bloques ucranianos, grafía pre/post-1918
// medida) sea LA MISMA que la de la biblioteca pública: vive en
// `texto-<lang>.mjs` y no se copia. Sale con código 1 si alguna pieza
// no pasa. Nunca escribe: sólo lee y reporta.
import fs from 'node:fs';
import path from 'node:path';

const [, , lang = 'ro', dirArg] = process.argv;
if (!['ro', 'cs', 'ru'].includes(lang)) { console.log(`gate-privadas: sin gate propio para «${lang}» — nada que verificar`); process.exit(0); }
const { gateDiacriticos, tieneCedilla, medirGrafia, contarPalabras } = await import(`./texto-${lang}.mjs`);
const dir = dirArg ?? path.join(process.cwd(), 'lib/data/languages', lang, 'lecturas-privadas');
const archivos = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
let rojas = 0, palabras = 0;
for (const f of archivos) {
  const l = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const texto = l.parrafos.map((p) => p.texto).join('\n');
  const gd = gateDiacriticos(texto);
  // cedilla: sólo el rumano la tiene como fallo (ş/ţ por ș/ț)
  const ced = lang === 'ro' && (tieneCedilla(l.titulo) || l.parrafos.some((p) => tieneCedilla(p.texto)));
  const g = medirGrafia(texto);
  palabras += contarPalabras(l.parrafos);
  // Una MEZCLA de grafías (ru: entre 0,3 % y 5 % de marcas pre-1918) es
  // incoherente y se rechaza, como en la ingesta pública
  const mezcla = lang === 'ru' && Boolean(g.mezcla);
  const ok = gd.ok && !ced && !mezcla;
  if (!ok) rojas += 1;
  console.log(`${ok ? '✔' : '✗'} ${f.padEnd(60)} ${gd.detalle}${ced ? ' · CEDILLA' : ''}${mezcla ? ' · MEZCLA' : ''} · ${g.etiqueta}`);
}
console.log(`gate-privadas ${lang}: ${archivos.length} piezas · ${palabras.toLocaleString('es-MX')} palabras · ${rojas} en rojo`);
process.exit(rojas ? 1 : 0);
