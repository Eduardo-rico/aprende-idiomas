// scripts/barrido-clases-b.ts — las clases que destapó la calibración.
//
// La calibración de la familia B falló con 3 errores en 120 (2,5 %), pero
// los tres son de CLASE, no de instancia — y una clase se barre con un
// script sobre el corpus entero en vez de con nueve colas humanas.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';

const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[]);
const txt = (x: any) => JSON.stringify(x.data ?? {});

// ── 1 · Mesóclisis tras un atractor de próclisis ─────────────────────
// La mesóclisis sólo cabe cuando NADA atrae el clítico. «que», la
// negación, «só», «também», los interrogativos y los indefinidos
// negativos lo atraen, y entonces la forma es «que SE encerrarão».
const MESO = /\b(que|quem|onde|quando|não|nunca|jamais|só|também|ninguém|nada|nenhum[ao]?)\s+(?:\w+\s+){0,2}?([a-zà-ÿ]+)-(se|me|te|lhe|lhes|nos|vos|o|a|os|as)-(á|ão|ás|ei|emos|eis|ia|ias|íamos|iam)\b/gi;
const meso: string[] = [];
for (const x of items) {
  for (const m of txt(x).matchAll(MESO)) meso.push(`${x.id} [${x.type}]: «${m[0].slice(0, 70)}»`);
}

// ── 2 · Glosas de acentuación que nombran una clase ──────────────────
// El nido de E2#3: «mãe esdrújula», «décimo circunflejo», «corazón
// llana». Se listan para cotejo humano — decidir la clase de una palabra
// pide separar sílabas, y una regla que lo intente a ojo repetiría el
// error que persigue.
const CLASE = /\b(esdrújula|sobresdrújula|llana|grave|aguda|paroxítona|oxítona|proparoxítona)\b/i;
const glosas: string[] = [];
for (const x of items) {
  const d = x.data ?? {};
  for (const k of ['hintEs', 'explanationEs', 'back', 'instructionEs']) {
    const v = d[k];
    if (typeof v === 'string' && CLASE.test(v)) glosas.push(`${x.id} [${k}]: «${v.slice(0, 90)}»`);
  }
}

// ── 3 · Corrección cuya clave cambia MÁS de lo que el error obliga ───
// Si la frase mala y la buena difieren en dos tramos independientes, hay
// más de una corrección válida y `alternatives` vacío suspende a quien
// arregla sólo el punto.
// Las CONTRACCIONES funden dos palabras en una: «de isto» → «disto» es
// UNA operación, no dos, y sin esta tabla el barrido daba 18 hallazgos de
// los que 15 eran contracciones. Un barrido que marca cuatro de cada cinco
// veces sin razón no se lee.
const CONTRACCIONES: Record<string, string[]> = {
  de: ['o', 'a', 'os', 'as', 'um', 'uma', 'isto', 'isso', 'aquilo', 'este', 'esta', 'esse', 'essa', 'aquele', 'aquela', 'eles', 'elas', 'ele', 'ela'],
  em: ['o', 'a', 'os', 'as', 'um', 'uma', 'isto', 'isso', 'aquilo', 'este', 'esta', 'esse', 'essa', 'aquele', 'aquela'],
  a: ['a', 'as', 'aquele', 'aquela', 'aquilo', 'aqueles', 'aquelas'],
  por: ['o', 'a', 'os', 'as'],
};
const esContraccion = (a2: string[], b2: string[]) => {
  const enB = new Set(b2);
  for (let i = 0; i < a2.length - 1; i++) {
    const [p1, p2] = [a2[i]!, a2[i + 1]!];
    if (!CONTRACCIONES[p1]?.includes(p2)) continue;
    // La fundida tiene que estar en la buena y las dos sueltas no.
    if (!enB.has(p1) || !enB.has(p2)) return true;
  }
  return false;
};
const corr = items.filter((x) => x.type === 'error_correction' && !(x.data?.alternatives ?? []).length);
const pal = (s: string) => String(s).toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean);
const sospechosas: string[] = [];
for (const x of corr) {
  const a = pal(x.data.sentence), b = pal(x.data.correct);
  const bolsa = new Map<string, number>();
  for (const w of b) bolsa.set(w, (bolsa.get(w) ?? 0) + 1);
  let iguales = 0;
  for (const w of a) { const c = bolsa.get(w) ?? 0; if (c > 0) { iguales++; bolsa.set(w, c - 1); } }
  const cambian = a.length - iguales, quitan = a.length - b.length;
  // Dos o más palabras cambiadas Y además cambia la longitud: son dos
  // operaciones distintas (sustituir y quitar), no una.
  if (cambian >= 2 && quitan >= 1 && !esContraccion(a, b)) sospechosas.push(`${x.id}: «${x.data.sentence}» → «${x.data.correct}»`);
}

const bloque = (t: string, xs: string[]) => {
  console.log(`\n## ${t} — ${xs.length}\n`);
  for (const s of xs.slice(0, 25)) console.log(`- ${s}`);
  if (xs.length > 25) console.log(`- …y ${xs.length - 25} más`);
};
bloque('Mesóclisis tras atractor de próclisis', meso);
bloque('Glosas que nombran una clase de acentuación', glosas);
bloque('Corrección con dos operaciones y sin alternativas declaradas', sospechosas);
