// Segmenta el TXT de «Contos» (Gutenberg #31347) en sus 12 cuentos.
//
// Cada cuento sale como un TXT limpio (párrafos separados por línea en
// blanco, numeración de secciones en romanos conservada como párrafo
// propio) listo para generar-karaoke.mjs o para el build de texto puro.
//
// Transformaciones declaradas (ningún descarte silencioso):
// - fuera todo lo anterior a "*** START" y posterior a "FIM" (paratexto
//   Gutenberg, portada, índice, notas de transcripción);
// - los _guiones bajos_ de itálica Gutenberg se quitan (son marcado, no
//   texto) y se reporta cuántos por cuento;
// - la ortografía pre-Acordo de la edición (~1902) se conserva TAL CUAL.
import fs from 'node:fs';
import path from 'node:path';

const [, , entrada, salidaDir] = process.argv;
if (!entrada || !salidaDir) {
  console.error('uso: node segmentar-contos.mjs pg31347.txt <dir-salida>');
  process.exit(1);
}

const TITULOS = [
  'SINGULARIDADES DE UMA RAPARIGA LOURA',
  'UM POETA LÍRICO',
  'NO MOINHO',
  'CIVILIZAÇÃO',
  'O TESOIRO',
  'FREI GENEBRO',
  'ADÃO E EVA NO PARAÍSO',
  'A AIA',
  'O DEFUNTO',
  'JOSE MATIAS',
  'A PERFEIÇÃO',
  'O SUAVE MILAGRE!',
];

const slug = (t) => t.toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const crudo = fs.readFileSync(entrada, 'utf8').replace(/\r\n/g, '\n');
const desdeStart = crudo.split(/\*\*\* START OF THE PROJECT GUTENBERG EBOOK[^\n]*\n/)[1];
if (!desdeStart) { console.error('no encontré el marcador START de Gutenberg'); process.exit(1); }

const lineas = desdeStart.split('\n');

// Posición de cada título (línea exacta, en mayúsculas) y del FIM.
const marcas = [];
for (const t of TITULOS) {
  const i = lineas.findIndex((l) => l.trim() === t);
  if (i < 0) { console.error(`título no encontrado: «${t}» — me niego a seguir con el volumen incompleto`); process.exit(1); }
  marcas.push({ titulo: t, linea: i });
}
const fin = lineas.findIndex((l) => l.trim() === 'FIM');
if (fin < 0) { console.error('no encontré el FIM que cierra el volumen'); process.exit(1); }
marcas.sort((a, b) => a.linea - b.linea);

fs.mkdirSync(salidaDir, { recursive: true });

let totalPalabras = 0;
for (const [i, m] of marcas.entries()) {
  const hasta = i + 1 < marcas.length ? marcas[i + 1].linea : fin;
  let cuerpo = lineas.slice(m.linea + 1, hasta).join('\n');

  const italicas = (cuerpo.match(/_/g) ?? []).length;
  cuerpo = cuerpo.replace(/_/g, '');

  // Párrafos: bloques separados por línea en blanco. Aquí NO se
  // desenrollan las líneas (eso lo hace cada consumidor); sólo se
  // normaliza a un salto en blanco entre bloques.
  const parrafos = cuerpo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const texto = parrafos.join('\n\n') + '\n';
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  totalPalabras += palabras;

  const nombre = `${slug(m.titulo)}.txt`;
  fs.writeFileSync(path.join(salidaDir, nombre), texto);
  const secciones = parrafos.filter((p) => /^[IVX]+$/.test(p)).length;
  console.log(
    `${nombre.padEnd(42)} ${String(parrafos.length).padStart(4)} párrafos ` +
    `${String(palabras).padStart(6)} palabras  secciones:${secciones}  itálicas quitadas:${italicas}`,
  );
}
console.log(`\n12 cuentos · ${totalPalabras} palabras en total`);
