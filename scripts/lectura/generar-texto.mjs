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
//
// El gate y la construcción de párrafos viven en `gate-procedencia.mjs`
// desde la Ola E3: la ingesta por tandas usa EXACTAMENTE los mismos, y
// dos copias de un gate son dos gates.
import fs from 'node:fs';
import path from 'node:path';
import { verificarProcedencia, construirParrafos } from './gate-procedencia.mjs';

const [, , entrada, salidaJson] = process.argv;
if (!entrada || !salidaJson) {
  console.error('uso: node generar-texto.mjs <cuento.txt> <salida.json>  (meta.json junto al TXT)');
  process.exit(1);
}

const META = JSON.parse(fs.readFileSync(path.join(path.dirname(entrada), 'meta.json'), 'utf8'));
try { verificarProcedencia(META); }
catch (e) { console.error(e.message.replace('meta sin', 'meta.json sin')); process.exit(1); }

const parrafos = construirParrafos(fs.readFileSync(entrada, 'utf8'), META);

if (parrafos.length === 0) { console.error('el TXT no tiene párrafos — nada que publicar.'); process.exit(1); }

fs.writeFileSync(salidaJson, JSON.stringify({ ...META, modo: 'texto', parrafos }, null, 1));

const palabras = parrafos.reduce((a, p) => a + p.texto.split(/\s+/).filter(Boolean).length, 0);
const chars = parrafos.reduce((a, p) => a + p.texto.length, 0);
console.log(`${path.basename(salidaJson)}: ${parrafos.length} párrafos · ${palabras} palabras · ${chars} caracteres`);
