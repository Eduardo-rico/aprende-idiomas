// Genera una lectura de TEXTO PURO (modo: 'texto') para la biblioteca.
//
// Es la vía barata: cero TTS, cero cuota — así el catálogo completo de
// 1,9M palabras puede entrar sin esperar al karaoke, que queda para la
// escalera graduada (decisión de Edu, 2026-07-29).
//
// GATE DE PROCEDENCIA (plan maestro, Ola L), con dos vías:
// - dominio público: título, autor, año de muerte, URL de fuente, nivel;
// - original del curso (`original: true`): título, autor, nivel, y la
//   constancia de revisión adversarial (revisadoPor + fechaRevision) —
//   la lección más cara ya pagada: nada original se publica sin pasar
//   por el lingüista adversarial de su lengua.
// Sin los campos de su vía, no se escribe nada.
import fs from 'node:fs';
import path from 'node:path';

const [, , entrada, salidaJson] = process.argv;
if (!entrada || !salidaJson) {
  console.error('uso: node generar-texto.mjs <cuento.txt> <salida.json>  (meta.json junto al TXT)');
  process.exit(1);
}

const META = JSON.parse(fs.readFileSync(path.join(path.dirname(entrada), 'meta.json'), 'utf8'));
const campos = META.original === true
  ? ['titulo', 'autor', 'nivel', 'revisadoPor', 'fechaRevision']
  : ['titulo', 'autor', 'muerteAutor', 'fuenteUrl', 'nivel'];
for (const campo of campos) {
  if (!META[campo]) { console.error(`meta.json sin «${campo}» — el gate de procedencia no negocia.`); process.exit(1); }
}

// Igual que el generador karaoke: bloques separados por línea en blanco,
// con los cortes duros de ~70 columnas desenrollados. EXCEPTO cuando el
// meta declara `versos: true` (poesía): ahí el salto de línea interno es
// forma, no accidente de Gutenberg, y se conserva.
const parrafos = fs.readFileSync(entrada, 'utf8')
  .split(/\n\s*\n/)
  .map((p) => META.versos === true
    ? p.split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
    : p.replace(/\s*\n\s*/g, ' ').trim())
  .filter((p) => p.length > 0)
  .map((texto) => ({ texto }));

if (parrafos.length === 0) { console.error('el TXT no tiene párrafos — nada que publicar.'); process.exit(1); }

fs.writeFileSync(salidaJson, JSON.stringify({ ...META, modo: 'texto', parrafos }, null, 1));

const palabras = parrafos.reduce((a, p) => a + p.texto.split(/\s+/).filter(Boolean).length, 0);
const chars = parrafos.reduce((a, p) => a + p.texto.length, 0);
console.log(`${path.basename(salidaJson)}: ${parrafos.length} párrafos · ${palabras} palabras · ${chars} caracteres`);
