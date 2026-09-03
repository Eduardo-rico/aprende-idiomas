// Normalización del ESTANTE PRIVADO con el módulo de SU lengua
// (estante cs/ru, 2026-09-02).
//
//   node scripts/lectura/normalizar-privadas.mjs <lang> <dir> [id…]
//
// Lo llama `ingesta-privada-pdf.py` (y el ingestor EPUB) sobre lo recién
// escrito: la regla de normalización del ruso (NFC, fuera el acento de
// intensidad, homóglifos latín↔cirílico, «- » ASCII → raya) y la del
// checo (NFC) viven en `texto-<lang>.mjs` y NO se copian a python — una
// regla copiada se desincroniza (ya pasó dos veces en PT). Reescribe
// SÓLO las piezas indicadas (o todas las del directorio si no se indica
// ninguna) y reporta cuántas cambiaron y cuántos homóglifos corrigió.
import fs from 'node:fs';
import path from 'node:path';

const [, , lang, dirArg, ...ids] = process.argv;
if (!lang || !dirArg) { console.error('uso: normalizar-privadas.mjs <lang> <dir> [id…]'); process.exit(1); }
const mod = await import(`./texto-${lang}.mjs`);
const archivos = (ids.length ? ids.map((i) => `${i}.json`) : fs.readdirSync(dirArg).filter((f) => f.endsWith('.json'))).sort();
let cambiadas = 0;
for (const f of archivos) {
  const p = path.join(dirArg, f);
  const l = JSON.parse(fs.readFileSync(p, 'utf8'));
  const antes = JSON.stringify(l);
  l.titulo = mod.normalizarDiacriticos(l.titulo);
  for (const par of l.parrafos) par.texto = mod.normalizarDiacriticos(par.texto);
  if (JSON.stringify(l) !== antes) {
    cambiadas += 1;
    fs.writeFileSync(p, JSON.stringify(l, null, 1) + '\n');
  }
}
const homo = typeof mod.homoglifos === 'function' ? mod.homoglifos() : null;
console.log(`normalizar-privadas ${lang}: ${archivos.length} piezas, ${cambiadas} reescritas${homo != null ? ` · ${homo} homóglifos corregidos` : ''}`);
