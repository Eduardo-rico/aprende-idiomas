// Cuenta formas NUEVAS de una pieza contra el corpus narrado ya publicado.
//
// El corpus previo = la columna «Portugués» de las tablas de pista de los
// documentos de contenido, más el ep. 1 narrado. Se extrae de la tercera
// celda de las filas cuya primera celda es una capa (0 · N · 1 · 2), que
// es lo que distingue una fila de diálogo de una fila de tabla cualquiera.
//
// Se cuentan FORMAS, no lemas: `para` y `parou` son dos, porque para el
// alumno lo son. Se descartan las réplicas de Capa 0, que van en español.
import fs from 'node:fs';

const DOCS = [
  '/Users/lalo/idiomas/portugues-app/docs/contenido/2026-07-29-episodios-nuevos.md',
  '/Users/lalo/idiomas/portugues-app/docs/contenido/2026-07-28-ep1-narrado.md',
];

const FILA = /^\|\s*(0|N|1|2)\s*\|([^|]*)\|([^|]*)\|/;

function formasDe(texto) {
  return new Set(
    (texto.toLowerCase().match(/[\p{L}\p{M}]+/gu) ?? []).filter((w) => w.length > 0),
  );
}

function corpusPrevio() {
  const previo = new Set();
  for (const f of DOCS) {
    if (!fs.existsSync(f)) continue;
    for (const linea of fs.readFileSync(f, 'utf8').split('\n')) {
      const m = linea.match(FILA);
      if (!m) continue;
      if (m[1] === '0') continue; // Capa 0 va en español
      for (const w of formasDe(m[3])) previo.add(w);
    }
  }
  return previo;
}

const previo = corpusPrevio();
const draft = fs.readFileSync(process.argv[2], 'utf8');
const nuevas = [...formasDe(draft)].filter((w) => !previo.has(w)).sort();

console.log(`corpus previo: ${previo.size} formas`);
console.log(`pieza:         ${formasDe(draft).size} formas distintas`);
console.log(`NUEVAS:        ${nuevas.length}`);
console.log('\n' + nuevas.join(' · '));
