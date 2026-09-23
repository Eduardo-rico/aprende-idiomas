// scripts/lib/atestar-in-caso.ts
//
// CONGELA LO QUE EL CORPUS DICE DE `in`/`sub`/`super` CON ACUSATIVO Y CON
// ABLATIVO. Genera `lib/data/languages/la/atestacion-in-caso.json`.
//
//   npx tsx scripts/lib/atestar-in-caso.ts
//
// ── PARA QUÉ ─────────────────────────────────────────────────────────
//
// `l11-preposiciones-caso` enseña «con acusativo, dirección; con
// ablativo, situación», y su `varia` pide «la preposición y el caso». Tres
// preguntas que ninguna máquina del proyecto contesta y el treebank sí:
//
//   1. ¿Cuánto pesa cada preposición en lo que el alumno va a leer? Si
//      `sub` + acusativo sale diez veces en 227.301 tokens, un ítem de
//      `sub` enseña una rareza (§1.quater del relevo).
//   2. ¿La regla VALE en la Vulgata, que es la puerta del curso? Se sabe
//      que el latín tardío usa `super` + acusativo sin movimiento. Si el
//      corpus lo confirma, la biblioteca DESENSEÑA el punto para `super`
//      (§E5) y el lote no puede examinarlo como si la regla fuera limpia.
//   3. ¿Aparece cada verbo del lote con los DOS casos? Si un verbo sólo
//      sale con uno, el par que lo usa es latín posible pero no el que el
//      alumno leerá.
//
// ── LO QUE ESTE SELLO NO ES ──────────────────────────────────────────
//
// ⚠ **Un recuento por verbo no dice que el sentido sea LOCAL.** `vocō` sale
// 11 veces con `in` + ablativo y las que se miraron son «in rēgnō
// caelōrum», «in spīritū», «in pāce»: ninguna es «llamar en un sitio». El
// sello CORROBORA que la combinación existe; el sentido del ítem lo
// declara el ítem y lo juzga el lingüista (la lección del lote retirado de
// `l3-ablativo-agente`: un recuento por lema no es un rasgo semántico).
import fs from 'node:fs';

const DIR = 'scripts/.cache/treebanks';
const SALIDA = 'lib/data/languages/la/atestacion-in-caso.json';
const PREPS = ['in', 'sub', 'super'] as const;
type Prep = typeof PREPS[number];

interface Tok { id: number; forma: string; lema: string; upos: string; feats: string; head: number; deprel: string }
interface Frase { vulgata: boolean; toks: Tok[] }

/** Las frases con su FUENTE. `leerFrases` de `atestar-ut` descarta los
 *  comentarios y con ellos la fuente; aquí hace falta, porque la pregunta 2
 *  es precisamente si la Vulgata se comporta distinto. PROIEL la declara en
 *  `# source = Jerome's Vulgate, …`; Perseus no trae Vulgata. */
export function leerFrasesConFuente(dir = DIR): Frase[] {
  const out: Frase[] = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.startsWith('la_') && x.endsWith('.conllu'))) {
    let fuente = '';
    let cur: Tok[] = [];
    for (const l of fs.readFileSync(`${dir}/${f}`, 'utf8').split('\n')) {
      if (!l.trim()) { if (cur.length) out.push({ vulgata: /Vulgate/i.test(fuente), toks: cur }); cur = []; continue; }
      if (l.startsWith('# source')) { fuente = l; continue; }
      if (l.startsWith('#')) continue;
      const c = l.split('\t');
      if (c.length < 8 || c[0]!.includes('-') || c[0]!.includes('.')) continue;
      cur.push({ id: +c[0]!, forma: c[1]!, lema: (c[2] ?? '').toLowerCase(), upos: c[3]!, feats: c[5] ?? '', head: +(c[6] ?? 0), deprel: c[7] ?? '' });
    }
    if (cur.length) out.push({ vulgata: /Vulgate/i.test(fuente), toks: cur });
  }
  return out;
}

type Cuenta = { ac: number; abl: number };
export interface SelloInCaso {
  generado: string;
  corpus: string;
  frases: number;
  /** Por preposición, en la Vulgata y en el resto. */
  porPreposicion: Record<Prep, { vulgata: Cuenta; resto: Cuenta }>;
  /** `in` por lema del VERBO del que cuelga el sintagma. */
  inPorVerbo: Record<string, Cuenta>;
  /** `in` por lema del NOMBRE regido. */
  inPorNombre: Record<string, Cuenta>;
}

export function medir(dir?: string): SelloInCaso {
  const frases = leerFrasesConFuente(dir);
  const vacia = (): Cuenta => ({ ac: 0, abl: 0 });
  const porPreposicion = Object.fromEntries(PREPS.map((p) => [p, { vulgata: vacia(), resto: vacia() }])) as SelloInCaso['porPreposicion'];
  const inPorVerbo: Record<string, Cuenta> = {};
  const inPorNombre: Record<string, Cuenta> = {};
  for (const fr of frases) {
    for (const c of fr.toks) {
      if (c.deprel !== 'case' || !(PREPS as readonly string[]).includes(c.lema)) continue;
      const n = fr.toks.find((x) => x.id === c.head);
      if (!n) continue;
      const caso = n.feats.match(/Case=(\w+)/)?.[1];
      const k = caso === 'Acc' ? 'ac' : caso === 'Abl' ? 'abl' : null;
      if (!k) continue;
      porPreposicion[c.lema as Prep][fr.vulgata ? 'vulgata' : 'resto'][k]++;
      if (c.lema !== 'in') continue;
      (inPorNombre[n.lema] ??= vacia())[k]++;
      const h = fr.toks.find((x) => x.id === n.head);
      if (h && h.upos === 'VERB') (inPorVerbo[h.lema] ??= vacia())[k]++;
    }
  }
  const orden = (r: Record<string, Cuenta>) =>
    Object.fromEntries(Object.entries(r).sort((a, b) => (b[1].ac + b[1].abl) - (a[1].ac + a[1].abl)));
  return {
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'la_perseus + la_proiel (UD); «vulgata» = frases de PROIEL con `# source = Jerome\'s Vulgate`',
    frases: frases.length,
    porPreposicion,
    inPorVerbo: orden(inPorVerbo),
    inPorNombre: orden(inPorNombre),
  };
}

if (process.argv[1]?.endsWith('atestar-in-caso.ts')) {
  const s = medir();
  fs.writeFileSync(SALIDA, `${JSON.stringify(s, null, 1)}\n`);
  console.log(`  ${SALIDA}  ${s.frases} frases`);
  for (const p of PREPS) {
    const x = s.porPreposicion[p];
    console.log(`  ${p.padEnd(6)} Vulgata ac ${x.vulgata.ac} · abl ${x.vulgata.abl}   resto ac ${x.resto.ac} · abl ${x.resto.abl}`);
  }
}
