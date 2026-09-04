#!/usr/bin/env node
// scripts/lectura/pronombres-vs-treebank.mjs
//
// EL SEGUNDO CAMINO PARA LA TABLA PRONOMINAL.
//
// La tabla de `pronombres-la.ts` está escrita a mano. Comprobarla releyéndola
// es darse la razón a uno mismo. El treebank trae en cada token los rasgos
// `Case`, `Number` y `Gender` puestos por quien anotó el corpus, así que aquí
// se contrasta celda contra celda: mi tabla dice que el dativo singular de
// `ille` es «illī», y el corpus tiene tokens de `ille` anotados Dat|Sing.
// ¿Coinciden las formas?
//
// Es un camino de otra naturaleza porque no deriva de mi tabla: si me
// equivoqué, la anotación no se equivoca conmigo.
//
// Salida: scripts/.cache/pronombres-treebank.json
import fs from 'node:fs';
import path from 'node:path';

const DIR = 'scripts/.cache/treebanks';
const LEMAS = { is: 'is', hic: 'hic', ille: 'ille', iste: 'iste', ipse: 'ipse', qui: 'quī' };
const CASO = { Nom: 'nom', Acc: 'ac', Gen: 'gen', Dat: 'dat', Abl: 'abl', Voc: 'voc' };
const NUM = { Sing: 'sg', Plur: 'pl' };
const GEN = { Masc: 'm', Fem: 'f', Neut: 'n' };

const celdas = new Map(); // "lema|g.caso.num" -> Map(forma -> n)
let tokens = 0, conRasgos = 0;

for (const f of fs.readdirSync(DIR).filter((x) => x.startsWith('la_') && x.endsWith('.conllu'))) {
  for (const linea of fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')) {
    if (!linea || linea[0] === '#') continue;
    const t = linea.split('\t');
    if (t.length < 6 || !/^\d+$/.test(t[0])) continue;
    const lema = t[2].toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
    const key = LEMAS[lema];
    if (!key) continue;
    tokens++;
    const r = Object.fromEntries(t[5].split('|').map((x) => x.split('=')));
    const c = CASO[r.Case], n = NUM[r.Number], g = GEN[r.Gender];
    if (!c || !n || !g) continue;               // sin rasgos completos no se puede contrastar
    conRasgos++;
    const forma = t[1].toLowerCase().replace(/j/g, 'i').replace(/v/g, 'u');
    // La clave va SIN macrón: es la ortografía del corpus. Escribirla con el
    // lema de exposición (`quī`) hacía que el comprobador no encontrara nunca
    // las celdas del relativo y las contara como «sin evidencia» — un gate
    // apagado que sólo destapó el control positivo.
    const ck = `${key.normalize('NFD').replace(/[\u0304\u0306]/g, '').normalize('NFC')}|${g}.${c}.${n}`;
    if (!celdas.has(ck)) celdas.set(ck, new Map());
    const m = celdas.get(ck);
    m.set(forma, (m.get(forma) ?? 0) + 1);
  }
}

const salida = {};
for (const [ck, m] of [...celdas].sort()) {
  salida[ck] = Object.fromEntries([...m].sort((a, b) => b[1] - a[1]));
}
fs.writeFileSync('scripts/.cache/pronombres-treebank.json',
  JSON.stringify({ tokens, conRasgos, celdas: salida }, null, 2));

console.log(`  tokens de los seis pronombres      ${tokens.toLocaleString('es')}`);
console.log(`  con Case+Number+Gender completos   ${conRasgos.toLocaleString('es')} (${(100 * conRasgos / tokens).toFixed(1)} %)`);
console.log(`  celdas atestiguadas                ${celdas.size} de ${6 * 3 * 6 * 2} posibles`);
