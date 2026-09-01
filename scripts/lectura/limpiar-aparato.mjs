// Quita el aparato del transcriptor de Gutenberg que quedó DENTRO de
// una lectura ya publicada.
//
// Lo estrenó la Ola E3 cuando su propio recorte destapó que el mismo
// defecto estaba desde la Ola L en dos capítulos: el último de Os Maias
// y el último de O Crime do Padre Amaro acababan con «Lista de erros
// corrigidos» y la tabla de erratas en ASCII. No es texto de Eça.
//
// uso: node scripts/lectura/limpiar-aparato.mjs [--escribir]
//      sin --escribir sólo reporta.
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.join(process.cwd(), 'lib/data/languages/pt/lecturas');
const ESCRIBIR = process.argv.includes('--escribir');

// El aparato empieza en el PRIMER párrafo que case, y va hasta el final
// de la pieza: los transcriptores no vuelven al texto después.
const INICIO = [
  /^\s*[*_]*\s*(?:A\s+)?Lista de erros/i,
  /^\s*Aqui encontram-se listados/i,
  /^\s*[*_]*\s*Nota d[eo] (?:editor|transcri)/i,
  /^\s*\+[-+=]{6,}\+/,
  /^\s*End of (?:the )?Project Gutenberg/i,
  /\berros?\b[^.]{0,60}\bcorrigid/i,
];

let tocadas = 0, quitados = 0;
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json')).sort()) {
  const p = path.join(DIR, f);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  const corte = j.parrafos.findIndex((x) => INICIO.some((re) => re.test(x.texto)));
  if (corte < 0) continue;
  const fuera = j.parrafos.length - corte;
  // Freno: si el «aparato» fuera más de un quinto de la pieza, es que
  // el patrón casó con texto de verdad. No se toca y se avisa.
  if (fuera > Math.max(3, j.parrafos.length / 5)) {
    console.log(`⚠ ${f}: casaría ${fuera}/${j.parrafos.length} párrafos — demasiado, NO se toca`);
    continue;
  }
  console.log(`${ESCRIBIR ? '✔' : '·'} ${f}: fuera ${fuera} párrafos desde «${j.parrafos[corte].texto.slice(0, 60)}»`);
  tocadas += 1; quitados += fuera;
  if (ESCRIBIR) {
    j.parrafos = j.parrafos.slice(0, corte);
    fs.writeFileSync(p, JSON.stringify(j, null, 1));
  }
}
console.log(`\n${tocadas} lecturas · ${quitados} párrafos de aparato${ESCRIBIR ? ' quitados' : ' (simulación: nada escrito)'}`);
