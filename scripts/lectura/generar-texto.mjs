// Genera una lectura de TEXTO PURO (modo: 'texto') para la biblioteca.
//
// Es la vía barata: cero TTS, cero cuota — así el catálogo completo de
// 1,9M palabras puede entrar sin esperar al karaoke, que queda para la
// escalera graduada (decisión de Edu, 2026-07-29).
//
// GATE DE PROCEDENCIA (plan maestro, Ola L): idéntico al del karaoke —
// el meta.json exige título, autor, año de muerte, URL de fuente y
// nivel. Sin los cinco campos, no se escribe nada.
import fs from 'node:fs';
import path from 'node:path';

const [, , entrada, salidaJson] = process.argv;
if (!entrada || !salidaJson) {
  console.error('uso: node generar-texto.mjs <cuento.txt> <salida.json>  (meta.json junto al TXT)');
  process.exit(1);
}

const META = JSON.parse(fs.readFileSync(path.join(path.dirname(entrada), 'meta.json'), 'utf8'));
for (const campo of ['titulo', 'autor', 'muerteAutor', 'fuenteUrl', 'nivel']) {
  if (!META[campo]) { console.error(`meta.json sin «${campo}» — el gate de procedencia no negocia.`); process.exit(1); }
}

// Igual que el generador karaoke: bloques separados por línea en blanco,
// con los cortes duros de ~70 columnas desenrollados.
const parrafos = fs.readFileSync(entrada, 'utf8')
  .split(/\n\s*\n/)
  .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
  .filter((p) => p.length > 0)
  .map((texto) => ({ texto }));

if (parrafos.length === 0) { console.error('el TXT no tiene párrafos — nada que publicar.'); process.exit(1); }

fs.writeFileSync(salidaJson, JSON.stringify({ ...META, modo: 'texto', parrafos }, null, 1));

const palabras = parrafos.reduce((a, p) => a + p.texto.split(/\s+/).filter(Boolean).length, 0);
const chars = parrafos.reduce((a, p) => a + p.texto.length, 0);
console.log(`${path.basename(salidaJson)}: ${parrafos.length} párrafos · ${palabras} palabras · ${chars} caracteres`);
