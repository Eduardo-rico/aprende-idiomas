// scripts/barrido-retroactivo.ts — los gates de la ola, contra el corpus
// que nunca los vio.
//
//   npx tsx scripts/barrido-retroactivo.ts
//   npx tsx scripts/barrido-retroactivo.ts --muestra   # con ejemplos
//
// Todos los gates de esta ola se escribieron para lotes NUEVOS y corren
// antes de publicar. El corpus viejo —el que se está sirviendo— nunca pasó
// por ninguno. Es la operación más rentable que queda: gates ya escritos y
// probados contra exactamente la población que no los vio.
//
// El precedente es el de acentuación: al correrlo hacia atrás sacó tres
// glosas falsas, una sirviéndose.
//
// ── CADA REGLA IMPRIME CUÁNTO EXAMINÓ ────────────────────────────────
//
// Y no sólo cuánto marcó. Dos veces en esta ola un barrido dio 0 hallazgos
// porque no miraba lo que decía mirar —una vez por no ensamblar la frase
// del cloze, otra porque el molde mete el infinitivo entre paréntesis en
// medio—. Un gate que examina 0 ítems y marca 0 parece igual de limpio que
// uno que examina 900. Sin el denominador no se distinguen.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS_DIR } from './config';
import { answersMatchCard } from '@/lib/exercises/normalize';
import { servibleAlAlumno } from './lib/estado-item';

const MUESTRA = process.argv.includes('--muestra');
const items = fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)).sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as any[])
  .filter(servibleAlAlumno);

// El GUION se conserva. Con la normalización de siempre, «vi-o» y «vi o»
// son la misma cadena, y entonces un ejercicio que pide precisamente
// contraer «vi o» en «vi-o» se marca como si diera la respuesta al lado.
// Es la quinta vez en la ola que una normalización se come el rasgo que se
// examina —el guion de la ênclise, el acento de la crase, la coma de la
// adversativa, la tilde de la respuesta— y la primera en un barrido.
const norm = (s: string) => String(s).toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}\- ]/gu, ' ').replace(/\s+/g, ' ').trim();
const palabras = (s: string) => norm(s).split(' ').filter(Boolean);
const contiene = (texto: string, palabra: string) =>
  new RegExp(`(?<![\\p{L}])${palabra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`, 'iu').test(texto);

interface Regla { nombre: string; aplica: (x: any) => boolean; falla: (x: any) => string | null }

const REGLAS: Regla[] = [
  {
    nombre: 'la respuesta está escrita en la propia frase',
    aplica: (x) => x.type === 'fill_blank' && x.data?.blanks?.length === 1 && typeof x.data?.sentence === 'string',
    falla: (x) => {
      const r = String(x.data.blanks[0].answer ?? '');
      if (r.length < 3) return null; // «a», «o», «se»: aparecen por todas partes
      const resto = String(x.data.sentence).replace('___', ' ');
      return contiene(norm(resto), norm(r)) ? `«${r}» aparece en «${x.data.sentence}»` : null;
    },
  },
  {
    nombre: 'la pista deletrea la respuesta',
    aplica: (x) => x.type === 'fill_blank' && x.data?.blanks?.length === 1 && typeof x.data?.hintEs === 'string',
    falla: (x) => {
      const r = String(x.data.blanks[0].answer ?? '');
      if (r.length < 4) return null;
      return contiene(norm(x.data.hintEs), norm(r)) ? `pista «${x.data.hintEs}» → «${r}»` : null;
    },
  },
  {
    // «Sin pista» no es «defectuoso»: un cuarto de ellos está determinado
    // por la propia frase —«O ___ ladra à noite»— y otro tanto se cierra
    // declarando alternativas, porque el punto es gramatical y el
    // sustantivo es decorado. Así que la regla cuenta los que siguen SIN
    // DICTAMINAR, que es el trabajo que queda, y no los que carecen del
    // campo, que es otra cosa.
    // Y el dictamen que cuenta es el de ESTE problema, no el de variante:
    // `neutral` dice que la forma es europea, no que el hueco esté
    // determinado. Filtrar por `variantStatus` mezclaba las dos preguntas
    // y bajaba el número de 178 a 39 sin haber arreglado nada.
    nombre: 'cloze sin pista y sin dictaminar la determinación',
    aplica: (x) => x.type === 'fill_blank' && x.data?.blanks?.length === 1 &&
      !/sin pista y CORRECTO|alternativas declaradas/.test(String(x.variantVerificacion ?? '')),
    falla: (x) => (String(x.data.hintEs ?? '').trim() ? null : `«${x.data.sentence}»`),
  },
  {
    // INFORMATIVA, no un defecto. Se listó como backlog y era falso: desde
    // E2#11 `FillBlankCard` pinta un input POR HUECO y valida con
    // `blanks.every()` contra la respuesta de cada uno, así que un ítem de
    // dos huecos se sirve bien y pide las dos formas. Lo que estaba roto
    // era la v1, que validaba con `blanks.some()` sobre un solo input.
    // Se deja contado para que nadie vuelva a darlo por defectuoso.
    nombre: 'cloze de varios huecos (informativo: la tarjeta los sirve bien)',
    aplica: (x) => x.type === 'fill_blank' && Array.isArray(x.data?.blanks),
    falla: () => null,
  },
  {
    nombre: 'corrección: alternativa que la tarjeta ya acepta',
    aplica: (x) => x.type === 'error_correction' && Array.isArray(x.data?.alternatives) && x.data.alternatives.length > 0,
    falla: (x) => {
      const mala = x.data.alternatives.find((a: string) => answersMatchCard(a, x.data.correct));
      return mala ? `«${mala}» ya la acepta` : null;
    },
  },
  {
    nombre: 'corrección: la explicación repite la respuesta y nada más',
    aplica: (x) => x.type === 'error_correction' && typeof x.data?.explanationEs === 'string',
    falla: (x) => {
      const e = norm(x.data.explanationEs), c = norm(x.data.correct);
      return e.includes(c) && palabras(e).length < palabras(c).length + 6 ? `«${x.data.explanationEs}»` : null;
    },
  },
  {
    nombre: 'corrección: la frase mala y la buena son la misma',
    aplica: (x) => x.type === 'error_correction' && typeof x.data?.sentence === 'string',
    falla: (x) => (norm(x.data.sentence) === norm(x.data.correct) ? `«${x.data.sentence}»` : null),
  },
  {
    nombre: 'opción correcta duplicada entre los distractores',
    aplica: (x) => Array.isArray(x.data?.options) && x.data.options.length > 1,
    falla: (x) => {
      const vistas = new Map<string, number>();
      for (const o of x.data.options) vistas.set(norm(o), (vistas.get(norm(o)) ?? 0) + 1);
      const dup = [...vistas].find(([, n]) => n > 1);
      return dup ? `«${dup[0]}» ×${dup[1]} en [${x.data.options.join(' | ')}]` : null;
    },
  },
  {
    nombre: 'la respuesta declarada no está entre las opciones',
    aplica: (x) => Array.isArray(x.data?.options) && typeof x.data?.answer === 'string',
    falla: (x) => (x.data.options.some((o: string) => norm(o) === norm(x.data.answer)) ? null : `respuesta «${x.data.answer}» ∉ [${x.data.options.join(' | ')}]`),
  },
  {
    nombre: 'derivación rota: undefined/null/NaN en un campo servido',
    aplica: () => true,
    falla: (x) => {
      const t = JSON.stringify(x.data ?? {});
      return /undefined|NaN/.test(t) ? `«${t.slice(0, 90)}»` : null;
    },
  },
];

console.log('# Barrido retroactivo — los gates de la ola contra el corpus servido\n');
console.log(`Ítems servibles examinados: **${items.length}**\n`);
console.log('| regla | examinados | hallazgos |');
console.log('|---|---:|---:|');
const detalle: { regla: string; casos: { id: string; por: string }[] }[] = [];
for (const r of REGLAS) {
  const aplicables = items.filter(r.aplica);
  const casos: { id: string; por: string }[] = [];
  for (const x of aplicables) { const p = r.falla(x); if (p) casos.push({ id: x.id, por: p }); }
  console.log(`| ${r.nombre} | ${aplicables.length} | **${casos.length}** |`);
  detalle.push({ regla: r.nombre, casos });
}
console.log(`\n**El denominador importa**: una regla que examina 0 y marca 0 parece tan limpia`);
console.log(`como una que examina 900. Dos barridos de esta ola dieron 0 por no mirar lo que decían mirar.`);

if (MUESTRA) {
  for (const d of detalle) {
    if (!d.casos.length) continue;
    console.log(`\n## ${d.regla} — ${d.casos.length}\n`);
    for (const c of d.casos.slice(0, 12)) console.log(`- \`${c.id}\`: ${c.por}`);
    if (d.casos.length > 12) console.log(`- …y ${d.casos.length - 12} más`);
  }
}
