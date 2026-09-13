// scripts/lib/atestar-ut.ts
//
// CONGELA LO QUE EL CORPUS DICE DE `ut` Y `nē`. Genera
// `lib/data/languages/la/atestacion-ut.json`.
//
//   npx tsx scripts/lib/atestar-ut.ts
//
// ── POR QUÉ ESTE SELLO Y NO LA MÁQUINA DE CONJUGAR ───────────────────
//
// Los cinco puntos de subjuntivo SINTÁCTICO no se pueden verificar con
// `subjuntivo.ts`: esa máquina sabe si `videat` es un subjuntivo, no si esa
// oración es final, completiva o consecutiva. El segundo camino tiene que
// ser de otra naturaleza, y aquí lo es: **la anotación de dependencias del
// treebank**, que no la escribió nadie de este proyecto.
//
//   · el `ut`/`nē` con `deprel=mark`
//   · la cabeza de ese `mark`, y si lleva `Mood=Sub`
//   · el `deprel` de la cabeza: `advcl` (adverbial → final o consecutiva),
//     `ccomp`/`csubj` (completiva), `acl` (de relativo)
//   · si hay un anticipador —`tam`, `tantus`, `ita`, `sīc`, `adeō`,
//     `tālis`, `tot`— colgando de la principal
//   · si hay un `nōn` dentro de la subordinada
//
// ── LO QUE LA MEDICIÓN DICE DE LA DOCTRINA DEL MATERIAL ──────────────
//
// `l7-ut-final` declara que la final negativa es `nē` y NO `ut nōn`.
// `l7-ut-consecutiva` declara lo contrario para la consecutiva, y añade que
// «quien aplique la regla de la final se equivocará SIEMPRE». Medido sobre
// 2.006 subordinadas:
//
//                                    nē    ut nōn
//     adverbial CON anticipador       3        26     (≈ consecutiva)
//     adverbial SIN anticipador     189        32     (≈ final)
//
// La regla se sostiene —90 % y 86 %— pero **no es una ley**, y «siempre» es
// falso. Un lote no puede marcar `ut nōn` como agramatical en una final:
// hay 32 en el corpus. Lo que se enseña es la tendencia y su fuerza.
import fs from 'node:fs';

const DIR = 'scripts/.cache/treebanks';
const SALIDA = 'lib/data/languages/la/atestacion-ut.json';

export const ANTICIPADORES = new Set(['tam', 'tantus', 'ita', 'sic', 'sīc', 'adeo', 'adeō', 'talis', 'tālis', 'tot']);

export interface Tok { id: number; forma: string; lema: string; upos: string; feats: string; head: number; deprel: string }

export function leerFrases(dir = DIR): Tok[][] {
  const frases: Tok[][] = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.startsWith('la_') && x.endsWith('.conllu'))) {
    let cur: Tok[] = [];
    for (const l of fs.readFileSync(`${dir}/${f}`, 'utf8').split('\n')) {
      if (!l.trim()) { if (cur.length) frases.push(cur); cur = []; continue; }
      if (l.startsWith('#')) continue;
      const c = l.split('\t');
      if (c.length < 8 || c[0]!.includes('-') || c[0]!.includes('.')) continue;
      cur.push({ id: +c[0]!, forma: c[1]!, lema: (c[2] ?? '').toLowerCase(), upos: c[3]!, feats: c[5] ?? '', head: +(c[6] ?? 0), deprel: c[7] ?? '' });
    }
    if (cur.length) frases.push(cur);
  }
  return frases;
}

export interface Subordinada {
  conjuncion: 'ut' | 'nē';
  negada: boolean;
  deprel: string;
  conAnticipador: boolean;
  /** El lema del verbo regente, para las completivas. */
  regente: string | null;
  /** El tiempo del verbo regente y el del subjuntivo, para la concordancia
   *  de tiempos. `null` si el regente no es una forma personal. */
  tiempoRegente: string | null;
  tiempoSubordinada: string;
}

/** `Tense` más el aspecto, que es lo que separa el perfecto del imperfecto
 *  en la anotación de UD: `Past` es el imperfecto y `PastPerf` el perfecto. */
export function tiempoDe(t: Tok): string {
  const ti = t.feats.match(/Tense=(\w+)/)?.[1] ?? '?';
  return `${ti}${/Aspect=Perf/.test(t.feats) ? 'Perf' : ''}`;
}

export function extraerSubordinadas(frases: Tok[][]): Subordinada[] {
  const out: Subordinada[] = [];
  for (const fr of frases) {
    for (const t of fr) {
      const esUt = t.lema === 'ut' || t.lema === 'uti';
      const esNe = t.lema === 'ne' || t.lema === 'nē';
      if ((!esUt && !esNe) || t.deprel !== 'mark') continue;
      const cabeza = fr.find((x) => x.id === t.head);
      if (!cabeza || !/Mood=Sub/.test(cabeza.feats)) continue;
      const abuelo = fr.find((x) => x.id === cabeza.head);
      out.push({
        conjuncion: esUt ? 'ut' : 'nē',
        negada: esNe || fr.some((x) => x.lema === 'non' && x.head === cabeza.id),
        deprel: cabeza.deprel,
        conAnticipador: fr.some((x) => ANTICIPADORES.has(x.lema) && (x.head === cabeza.head || x.id === cabeza.head || (abuelo !== undefined && x.head === abuelo.id))),
        regente: abuelo?.lema ?? null,
        tiempoRegente: abuelo && /VerbForm=Fin/.test(abuelo.feats) ? tiempoDe(abuelo) : null,
        tiempoSubordinada: tiempoDe(cabeza),
      });
    }
  }
  return out;
}

/** Para cada verbo regente: cuántas completivas con `ut`/`nē` rige y
 *  cuántos infinitivos. Es lo que decide si un ítem puede pedir `ut` o
 *  tiene que pedir el infinitivo. */
export function regimenPorVerbo(frases: Tok[][]): Record<string, { conUt: number; conInfinitivo: number }> {
  const out: Record<string, { conUt: number; conInfinitivo: number }> = {};
  const toca = (l: string) => (out[l] ??= { conUt: 0, conInfinitivo: 0 });
  for (const fr of frases) {
    for (const t of fr) {
      if (!['ut', 'uti', 'ne'].includes(t.lema) || t.deprel !== 'mark') continue;
      const sub = fr.find((x) => x.id === t.head);
      if (!sub || !/Mood=Sub/.test(sub.feats)) continue;
      if (!['ccomp', 'csubj', 'csubj:pass', 'xcomp'].includes(sub.deprel)) continue;
      const reg = fr.find((x) => x.id === sub.head);
      if (reg) toca(reg.lema).conUt++;
    }
    for (const t of fr) {
      if (!/VerbForm=Inf/.test(t.feats)) continue;
      if (!['xcomp', 'ccomp', 'csubj'].includes(t.deprel)) continue;
      const reg = fr.find((x) => x.id === t.head);
      if (reg && /VerbForm=Fin/.test(reg.feats)) toca(reg.lema).conInfinitivo++;
    }
  }
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v.conUt + v.conInfinitivo >= 2)
    .sort((a, b) => (b[1].conUt + b[1].conInfinitivo) - (a[1].conUt + a[1].conInfinitivo)));
}

async function main() {
  const frases = leerFrases();
  const subs = extraerSubordinadas(frases);
  const adv = subs.filter((s) => s.deprel === 'advcl');
  const comp = subs.filter((s) => s.deprel === 'ccomp' || s.deprel === 'csubj' || s.deprel === 'csubj:pass');
  const cuenta = (xs: Subordinada[]) => ({
    total: xs.length,
    ut: xs.filter((s) => s.conjuncion === 'ut' && !s.negada).length,
    utNon: xs.filter((s) => s.conjuncion === 'ut' && s.negada).length,
    ne: xs.filter((s) => s.conjuncion === 'nē').length,
  });
  const regentes: Record<string, number> = {};
  for (const s of comp) if (s.regente) regentes[s.regente] = (regentes[s.regente] ?? 0) + 1;

  const salida = {
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'UD Latin (scripts/.cache/treebanks)',
    comoSeCuenta: '`ut`/`nē` con deprel=mark cuya cabeza lleva Mood=Sub; el anticipador se busca colgando de la principal; la negación, dentro de la subordinada',
    total: subs.length,
    porDeprel: Object.fromEntries(Object.entries(
      subs.reduce<Record<string, number>>((a, s) => { a[s.deprel] = (a[s.deprel] ?? 0) + 1; return a; }, {}),
    ).sort((a, b) => b[1] - a[1])),
    // LA TABLA QUE DECIDE LA DOCTRINA DE `nē` FRENTE A `ut nōn`.
    adverbiales: {
      conAnticipador: cuenta(adv.filter((s) => s.conAnticipador)),
      sinAnticipador: cuenta(adv.filter((s) => !s.conAnticipador)),
    },
    completivas: cuenta(comp),
    // EL RÉGIMEN, POR VERBO. `l7-completivas-ut` declara que «algunos rigen
    // infinitivo y no completiva» y nombra `iubeō` y `vetō`. Quien decide
    // eso no puede ser yo: aquí está contado. `iubeō` rige 0 completivas
    // con `ut` y 133 con infinitivo.
    regimen: regimenPorVerbo(frases),
    // LA CONCORDANCIA DE TIEMPOS, que `l7-ut-final` declara y nadie había
    // medido. `Past` es el imperfecto y `PastPerf` el perfecto.
    concordanciaDeTiempos: subs.filter((s) => s.tiempoRegente !== null)
      .reduce<Record<string, number>>((a, s) => {
        const k = `${s.tiempoRegente} → ${s.tiempoSubordinada}`;
        a[k] = (a[k] ?? 0) + 1; return a;
      }, {}),
    regentesDeCompletiva: Object.fromEntries(Object.entries(regentes).sort((a, b) => b[1] - a[1]).slice(0, 40)),
  };
  fs.writeFileSync(SALIDA, `${JSON.stringify(salida, null, 1)}\n`);
  const a = salida.adverbiales;
  console.log(`${SALIDA}: ${subs.length} subordinadas`);
  console.log(`  adverbial CON anticipador: nē=${a.conAnticipador.ne} ut nōn=${a.conAnticipador.utNon} ut=${a.conAnticipador.ut}`);
  console.log(`  adverbial SIN anticipador: nē=${a.sinAnticipador.ne} ut nōn=${a.sinAnticipador.utNon} ut=${a.sinAnticipador.ut}`);
  console.log(`  completivas: ut=${salida.completivas.ut} ut nōn=${salida.completivas.utNon} nē=${salida.completivas.ne}`);
  console.log(`  regentes más frecuentes: ${Object.entries(regentes).sort((x, y) => y[1] - x[1]).slice(0, 10).map(([l, n]) => `${l}=${n}`).join(' ')}`);
  console.log(`  concordancia: ${Object.entries(salida.concordanciaDeTiempos).sort((x, y) => y[1] - x[1]).slice(0, 5).map(([k, n]) => `${k}=${n}`).join(' · ')}`);
  console.log(`  régimen: ${Object.keys(salida.regimen).length} verbos; iubeo=${JSON.stringify(salida.regimen.iubeo)} rogo=${JSON.stringify(salida.regimen.rogo)}`);
}

// Este fichero se IMPORTA desde el gate —`leerFrases` y `extraerSubordinadas`
// son el segundo camino—, así que el generador no puede correr al importarlo.
if (process.argv[1]?.endsWith('atestar-ut.ts')) void main();
