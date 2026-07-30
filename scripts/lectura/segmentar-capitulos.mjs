// Segmenta una novela de Gutenberg en capítulos, por marcador de línea.
//
// uso: node segmentar-capitulos.mjs <txt> <dir-salida> <patronMarcador> <esperados> [patronCorte]
//   patronMarcador — regex (línea completa, ya recortada) que abre capítulo,
//                    p. ej. '^[IVXLC]+\.?$' o '^CAPITULO [IVXLC]+\.?$'
//   esperados      — número EXACTO de capítulos; otro número = gate rojo.
//   patronCorte    — regex opcional: línea que TERMINA un capítulo antes del
//                    siguiente marcador (p. ej. '^NOTAS$|^FIM\.?$'). Lo que
//                    quede fuera por un corte se cuenta y se REPORTA.
//
// El contenido va del primer marcador al «*** END OF» de Gutenberg (o al
// primer corte que aparezca tras el último capítulo). Todo lo previo al
// primer marcador (portada, prefacios) queda fuera y se reporta su tamaño.
// Ortografía de la edición TAL CUAL. Los capítulos salen numerados en
// arábigo corrido (c01, c02, …) aunque la edición reinicie romanos por
// volumen; la línea del marcador no entra al cuerpo (el título del
// capítulo la sustituye) y queda registrada en el manifiesto.
import fs from 'node:fs';
import path from 'node:path';

const [, , entrada, salidaDir, patronStr, esperadosStr, corteStr] = process.argv;
if (!entrada || !salidaDir || !patronStr || !esperadosStr) {
  console.error('uso: node segmentar-capitulos.mjs <txt> <dir> <patron> <esperados> [patronCorte]');
  process.exit(1);
}
const patron = new RegExp(patronStr);
const corte = corteStr ? new RegExp(corteStr) : null;
const esperados = Number(esperadosStr);

const lineas = fs.readFileSync(entrada, 'utf8').replace(/\r\n/g, '\n').split('\n');
const finGutenberg = lineas.findIndex((l) => l.startsWith('*** END OF'));
if (finGutenberg < 0) { console.error('sin marcador *** END OF — no es un TXT de Gutenberg'); process.exit(1); }

const marcas = [];
for (let i = 0; i < finGutenberg; i++) {
  if (patron.test(lineas[i].trim())) marcas.push(i);
}
if (marcas.length !== esperados) {
  console.error(`esperaba ${esperados} capítulos y encontré ${marcas.length} — me niego a seguir.`);
  process.exit(1);
}

fs.mkdirSync(salidaDir, { recursive: true });
const preambulo = lineas.slice(0, marcas[0]).join('\n').split(/\s+/).filter(Boolean).length;
let totalPalabras = 0, cortadas = 0;
const manifiesto = [];
for (const [i, ini] of marcas.entries()) {
  let hasta = i + 1 < marcas.length ? marcas[i + 1] : finGutenberg;
  if (corte) {
    for (let j = ini + 1; j < hasta; j++) {
      if (corte.test(lineas[j].trim())) {
        cortadas += lineas.slice(j, hasta).join('\n').split(/\s+/).filter(Boolean).length;
        hasta = j;
        break;
      }
    }
  }
  const marcador = lineas[ini].trim();
  const cuerpo = lineas.slice(ini + 1, hasta).join('\n');
  const parrafos = cuerpo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const palabras = parrafos.join(' ').split(/\s+/).filter(Boolean).length;
  if (palabras < 200) { console.error(`capítulo ${i + 1} («${marcador}») con ${palabras} palabras — segmentación sospechosa, me niego.`); process.exit(1); }
  totalPalabras += palabras;
  const nombre = `c${String(i + 1).padStart(2, '0')}.txt`;
  fs.writeFileSync(path.join(salidaDir, nombre), parrafos.join('\n\n') + '\n');
  manifiesto.push({ archivo: nombre, marcador, parrafos: parrafos.length, palabras });
}
fs.writeFileSync(path.join(salidaDir, 'manifiesto.json'), JSON.stringify(manifiesto, null, 1));
console.log(`${marcas.length} capítulos · ${totalPalabras} palabras`);
console.log(`fuera: preámbulo ${preambulo} palabras${corte ? ` · cortadas por patronCorte ${cortadas} palabras` : ''}`);
