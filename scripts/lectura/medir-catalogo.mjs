// Mide el catálogo de lectura publicado. Las cifras de la biblioteca se
// PEGAN de aquí; jamás se estiman (regla de Edu, Ola L).
//
// uso: node scripts/lectura/medir-catalogo.mjs [lang]   (default: pt)
//
// Cuenta palabras sobre el texto real de los párrafos publicados (mismo
// criterio que generar-texto.mjs: separadores de espacio en blanco), y
// desglosa por nivel, por variante y por serie.
import fs from 'node:fs';
import path from 'node:path';

const lang = process.argv[2] ?? 'pt';
const dir = path.join(process.cwd(), 'lib/data/languages', lang, 'lecturas');

const archivos = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
// PALABRA = algo que tenga una LETRA dentro. Contar por `split(/\s+/)`
// suma la puntuación suelta, y eso importó de verdad: al separar las
// 53.101 rayas del transcriptor —«minguar--quando» → «minguar — quando»—
// la cifra de lectura subió de 3.219.799 a 3.289.461 **sin que se hubiera
// leído una palabra más de portugués**. Un cambio de formato movió el
// número de portada un 2 %.
const esPalabra = (t) => /\p{L}/u.test(t);
const contarPalabras = (s) => String(s ?? '').split(/\s+/).filter(esPalabra).length;

let palabras = 0;
const porNivel = new Map();
const porVariante = new Map();
const series = new Map();
const sinSerie = [];

for (const f of archivos) {
  const l = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const n = l.parrafos.reduce((a, p) => a + contarPalabras(p.texto), 0);
  palabras += n;
  const nivel = l.nivel ?? '??';
  // Sin `?? 'pt'`: desde E2#17 el campo es obligatorio y el gate del
  // catálogo lo exige, así que un undefined aquí es un fallo que hay que
  // ver, no un default que lo tape.
  const variante = l.variante;
  porNivel.set(nivel, { piezas: (porNivel.get(nivel)?.piezas ?? 0) + 1, palabras: (porNivel.get(nivel)?.palabras ?? 0) + n });
  porVariante.set(variante, { piezas: (porVariante.get(variante)?.piezas ?? 0) + 1, palabras: (porVariante.get(variante)?.palabras ?? 0) + n });
  if (l.serie) {
    const s = series.get(l.serie.id) ?? { titulo: l.serie.titulo, piezas: 0, palabras: 0 };
    s.piezas += 1; s.palabras += n;
    series.set(l.serie.id, s);
  } else sinSerie.push(f);
}

const fmt = (n) => n.toLocaleString('es-MX');
console.log(`CATÁLOGO ${lang.toUpperCase()} · ${archivos.length} lecturas · ${series.size} series · ${fmt(palabras)} palabras`);
console.log('\npor nivel:');
for (const nivel of [...porNivel.keys()].sort()) {
  const v = porNivel.get(nivel);
  console.log(`  ${nivel.padEnd(4)} ${String(v.piezas).padStart(4)} piezas ${fmt(v.palabras).padStart(11)} palabras`);
}
console.log('\npor variante:');
for (const v of [...porVariante.keys()].sort()) {
  const x = porVariante.get(v);
  console.log(`  ${v.padEnd(6)} ${String(x.piezas).padStart(4)} piezas ${fmt(x.palabras).padStart(11)} palabras`);
}
console.log(`\nseries: ${series.size} · piezas sueltas: ${sinSerie.length}`);
