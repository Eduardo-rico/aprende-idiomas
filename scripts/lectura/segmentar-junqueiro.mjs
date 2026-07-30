// Segmenta «Contos para a infância» (Guerra Junqueiro, 1877 — Gutenberg
// #16429) en sus 43 cuentos. Los títulos vienen como líneas *asteriscadas*.
//
// GATE: se exigen exactamente 43 títulos y la presencia de tres de
// control (primero, medio, último). Menos que eso = el fichero no es el
// que creemos, y no se escribe nada.
//
// Transformaciones declaradas: fuera el paratexto Gutenberg (antes del
// primer título, después de FIM); asteriscos de título quitados; los
// separadores decorativos «* * * *» se convierten en línea en blanco
// (son pausa tipográfica, no texto); ortografía de 1877 TAL CUAL.
import fs from 'node:fs';
import path from 'node:path';

const [, , entrada, salidaDir] = process.argv;
if (!entrada || !salidaDir) {
  console.error('uso: node segmentar-junqueiro.mjs pg16429.txt <dir-salida>');
  process.exit(1);
}

const CUENTA_ESPERADA = 43;
const CONTROL = ['A mãe', 'Boa sentença', 'O linho'];

const slug = (t) => t.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const lineas = fs.readFileSync(entrada, 'utf8').replace(/\r\n/g, '\n').split('\n');
const fin = lineas.findIndex((l) => l.trim() === 'FIM.');
if (fin < 0) { console.error('no encontré el FIM. que cierra el volumen'); process.exit(1); }

// Los _guiones bajos_ de itálica Gutenberg son marcado, no texto — se
// quitan y se reportan (la primera corrida NO lo hacía y publicó
// «_cá dentro_» literal; cazado en la Ola B2C2 al citar «A alma»).
let italicasQuitadas = 0;
for (const [i, l] of lineas.entries()) {
  const n = (l.match(/_/g) ?? []).length;
  if (n > 0) { italicasQuitadas += n; lineas[i] = l.replace(/_/g, ''); }
}

const marcas = [];
for (const [i, l] of lineas.entries()) {
  const m = l.trim().match(/^\*([^*]+)\*$/);
  if (m && i < fin) marcas.push({ titulo: m[1].trim(), linea: i });
}
if (marcas.length !== CUENTA_ESPERADA) {
  console.error(`esperaba ${CUENTA_ESPERADA} títulos y encontré ${marcas.length} — me niego a seguir.`);
  process.exit(1);
}
for (const t of CONTROL) {
  if (!marcas.some((m) => m.titulo === t)) {
    console.error(`título de control ausente: «${t}» — me niego a seguir.`);
    process.exit(1);
  }
}

fs.mkdirSync(salidaDir, { recursive: true });
let totalPalabras = 0;
const manifiesto = [];
for (const [i, m] of marcas.entries()) {
  const hasta = i + 1 < marcas.length ? marcas[i + 1].linea : fin;
  const cuerpo = lineas.slice(m.linea + 1, hasta).join('\n')
    .replace(/^[ \t]*\*(?:[ \t*]+)\*[ \t]*$/gm, ''); // separadores decorativos
  const parrafos = cuerpo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const texto = parrafos.join('\n\n') + '\n';
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  totalPalabras += palabras;
  const nombre = `${slug(m.titulo)}.txt`;
  fs.writeFileSync(path.join(salidaDir, nombre), texto);
  manifiesto.push({ archivo: nombre, titulo: m.titulo, parrafos: parrafos.length, palabras });
  console.log(`${nombre.padEnd(52)} ${String(parrafos.length).padStart(4)} párrafos ${String(palabras).padStart(6)} palabras`);
}
fs.writeFileSync(path.join(salidaDir, 'manifiesto.json'), JSON.stringify(manifiesto, null, 1));
console.log(`\n${marcas.length} cuentos · ${totalPalabras} palabras en total · itálicas quitadas: ${italicasQuitadas}`);
