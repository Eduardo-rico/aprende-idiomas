// Gate de lengua sobre el ESTANTE PRIVADO (fase F, 2026-09-02).
//
//   node scripts/lectura/gate-privadas.mjs ro [dir]
//
// Lo llama `ingesta-privada-pdf.py` al terminar, para que la regla del
// rumano (diacríticos presentes, cero cedillas, grafía medida) sea LA
// MISMA que la de la biblioteca pública: vive en `texto-ro.mjs` y no se
// copia a python. Sale con código 1 si alguna pieza no pasa. Nunca
// escribe: sólo lee y reporta.
import fs from 'node:fs';
import path from 'node:path';
import { gateDiacriticos, tieneCedilla, medirGrafia, contarPalabras } from './texto-ro.mjs';

const [, , lang = 'ro', dirArg] = process.argv;
if (lang !== 'ro') { console.log(`gate-privadas: sin gate propio para «${lang}» — nada que verificar`); process.exit(0); }
const dir = dirArg ?? path.join(process.cwd(), 'lib/data/languages', lang, 'lecturas-privadas');
const archivos = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
let rojas = 0, palabras = 0;
for (const f of archivos) {
  const l = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const texto = l.parrafos.map((p) => p.texto).join('\n');
  const gd = gateDiacriticos(texto);
  const ced = tieneCedilla(l.titulo) || l.parrafos.some((p) => tieneCedilla(p.texto));
  const g = medirGrafia(texto);
  palabras += contarPalabras(l.parrafos);
  const ok = gd.ok && !ced;
  if (!ok) rojas += 1;
  console.log(`${ok ? '✔' : '✗'} ${f.padEnd(60)} ${gd.detalle}${ced ? ' · CEDILLA' : ''} · ${g.etiqueta}`);
}
console.log(`gate-privadas ${lang}: ${archivos.length} piezas · ${palabras.toLocaleString('es-MX')} palabras · ${rojas} en rojo`);
process.exit(rojas ? 1 : 0);
