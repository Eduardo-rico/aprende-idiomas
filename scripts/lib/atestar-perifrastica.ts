// scripts/lib/atestar-perifrastica.ts
//
// CONGELA LO QUE EL CORPUS DICE DEL AGENTE DE LA PERIFRÁSTICA PASIVA.
// Genera `lib/data/languages/la/atestacion-perifrastica.json`.
//
//   npx tsx scripts/lib/atestar-perifrastica.ts
//
// ── LA PREGUNTA, Y POR QUÉ NINGUNA MÁQUINA DEL PROYECTO LA CONTESTA ──
//
// `l8-perifrastica-pasiva` afirma: «gerundivo + sum, con el agente en
// DATIVO y no en ablativo». `participios.ts` sabe formar `laudandus`;
// `paradigma-la.ts` sabe declinar `patrī`. Ninguna de las dos sabe en qué
// caso va el agente de qué construcción. El segundo camino tiene que ser de
// otra naturaleza: la anotación de dependencias del treebank, que marca el
// agente como `obl:agent` y no la escribió nadie de aquí.
//
// ── QUÉ SE CUENTA ────────────────────────────────────────────────────
//
// Todo `obl:agent`, por la FORMA DE SU CABEZA, y en cada una si el agente
// va en dativo sin preposición o con `ā/ab/abs`:
//
//   · `gerundivo`         — la cabeza es gerundivo (PROIEL `VerbForm=Gdv`;
//                           Perseus `VerbForm=Part|Aspect=Prosp|Voice=Pass`)
//   · `gerundivoConSum`   — lo mismo, y además con `sum` como `cop`/`aux`:
//                           la perifrástica en sentido estricto
//   · `infectumPasivo`    — forma personal pasiva de presente, imperfecto o
//                           futuro: la otra mitad del lote
//   · `participioPerfecto`— la pasiva de perfecto, que admite dativo de
//                           agente (A&G §375) y por eso el lote no usa
//
// Y los ejemplos de la casilla MINORITARIA de cada una, enteros, para que
// se lean: un recuento sin sus frases es la mitad de una atestación (§D9).
import fs from 'node:fs';
import { leerFrases } from './atestar-ut';

const SALIDA = 'lib/data/languages/la/atestacion-perifrastica.json';

type Tok = ReturnType<typeof leerFrases>[number][number];

export type Cabeza = 'gerundivo' | 'gerundivoConSum' | 'infectumPasivo' | 'participioPerfecto';

export interface Casilla {
  dativo: number;
  conAb: number;
  /** El dativo, partido por categoría: los pronombres (`mihi`, `nōbīs`)
   *  son la mayoría y el lote usa NOMBRES, así que la cifra que lo
   *  respalda es la de `dativoNombre`. */
  dativoNombre: number;
  /** Esos dativos NOMBRE, con su frase: son los que respaldan el lote. */
  ejemplosDativoNombre: string[];
  /** La casilla minoritaria de esta cabeza, con su frase. */
  minoritarios: string[];
  /** `ā/ab` + ablativo colgado de la cabeza con `deprel` `obl` (no
   *  `obl:agent`). El anotador etiqueta así parte de los agentes: «ā
   *  nātūrā petundum est» (Cicerón). Contarlos sólo como `obl:agent`
   *  SUBCONTABA la excepción — lo cazó el latinista el 2026-09-23. Van
   *  aparte y con su frase, porque aquí también entran separativos y de
   *  origen, que hay que leer: son CANDIDATOS, no agentes. Leídos los del
   *  gerundivo general (5): «ab opere revocandī» es separativo y
   *  «Arginūsīs removendam» es lugar; los 2 de `gerundivoConSum` («ā
   *  nātūrā petundum est», «servandae sunt ā pecore») sí son agentes, y
   *  son los que el gate suma. Que nadie cite «5». */
  conAbObl: string[];
}

export interface SelloPerifrastica {
  generado: string;
  corpus: string;
  frases: number;
  agentesAnotados: number;
  porCabeza: Record<Cabeza, Casilla>;
  /** `ā` o `ab` según la letra con que empieza la palabra siguiente. Es el
   *  segundo camino del §D8 de la clave «ā patre»: si el corpus escribe
   *  `ab` ante esa letra, «ab patre» sería correcta y la clave la
   *  suspendería. Ante vocal y `h` va `ab` (clave «V/h»); ante `l`, `n`,
   *  `r`, `s` también sale. */
  aAbPorInicial: Record<string, { a: number; ab: number }>;
}

export const esGerundivo = (t: Tok) =>
  /VerbForm=Gdv/.test(t.feats) || (/VerbForm=Part/.test(t.feats) && /Aspect=Prosp/.test(t.feats) && /Voice=Pass/.test(t.feats));

export function medir(dir?: string): SelloPerifrastica {
  const frases = leerFrases(dir);
  const vacia = (): Casilla => ({ dativo: 0, conAb: 0, dativoNombre: 0, ejemplosDativoNombre: [], minoritarios: [], conAbObl: [] });
  const por: Record<Cabeza, Casilla> = {
    gerundivo: vacia(), gerundivoConSum: vacia(), infectumPasivo: vacia(), participioPerfecto: vacia(),
  };
  const ejDat: Record<Cabeza, string[]> = { gerundivo: [], gerundivoConSum: [], infectumPasivo: [], participioPerfecto: [] };
  const ejAb: Record<Cabeza, string[]> = { gerundivo: [], gerundivoConSum: [], infectumPasivo: [], participioPerfecto: [] };
  let agentes = 0;
  for (const f of frases) {
    const txt = f.map((x) => x.forma).join(' ');
    for (const t of f) {
      const esAb = f.some((c) => c.head === t.id && c.deprel === 'case' && /^(a|ab|abs)$/.test(c.lema));
      if (t.deprel === 'obl' && esAb && /Case=Abl/.test(t.feats)) {
        const h0 = f.find((x) => x.id === t.head);
        if (h0 && esGerundivo(h0)) {
          const linea0 = `${t.forma} ← ${h0.forma} :: ${txt.length > 180 ? `${txt.slice(0, 180)}…` : txt}`;
          por.gerundivo.conAbObl.push(linea0);
          if (f.some((c) => c.head === h0.id && /^(cop|aux)/.test(c.deprel) && c.lema === 'sum')) por.gerundivoConSum.conAbObl.push(linea0);
        }
      }
      if (t.deprel !== 'obl:agent') continue;
      agentes++;
      const h = f.find((x) => x.id === t.head);
      if (!h) continue;
      const cabezas: Cabeza[] = [];
      if (esGerundivo(h)) {
        cabezas.push('gerundivo');
        const conSum = f.some((c) => c.head === h.id && /^(cop|aux)/.test(c.deprel) && c.lema === 'sum');
        if (conSum) cabezas.push('gerundivoConSum');
      } else if (/VerbForm=Fin/.test(h.feats) && /Voice=Pass/.test(h.feats) && !/Aspect=Perf/.test(h.feats)
                 && /Tense=(Pres|Past|Fut)/.test(h.feats)) {
        cabezas.push('infectumPasivo');
      } else if (/VerbForm=Part/.test(h.feats) && /Aspect=Perf/.test(h.feats)) {
        cabezas.push('participioPerfecto');
      }
      if (!cabezas.length) continue;
      const ab = f.some((c) => c.head === t.id && c.deprel === 'case' && /^(a|ab|abs)$/.test(c.lema));
      const dat = !ab && /Case=Dat/.test(t.feats);
      if (!ab && !dat) continue;
      const linea = `${t.forma} ← ${h.forma} :: ${txt.length > 180 ? `${txt.slice(0, 180)}…` : txt}`;
      for (const c of cabezas) {
        if (ab) { por[c].conAb++; ejAb[c].push(linea); }
        else {
          por[c].dativo++; ejDat[c].push(linea);
          if (t.upos === 'NOUN' || t.upos === 'PROPN') { por[c].dativoNombre++; por[c].ejemplosDativoNombre.push(linea); }
        }
      }
    }
  }
  const aAb: Record<string, { a: number; ab: number }> = {};
  for (const f of frases) for (let i = 0; i < f.length - 1; i++) {
    const t = f[i]!;
    if (t.upos !== 'ADP' || !/^(a|ab)$/.test(t.lema)) continue;
    const forma = t.forma.toLowerCase();
    if (forma !== 'a' && forma !== 'ab') continue;
    const ini = f[i + 1]!.forma.toLowerCase().normalize('NFD').charAt(0);
    const k = /[aeiouyh]/.test(ini) ? 'V/h' : ini;
    aAb[k] ??= { a: 0, ab: 0 };
    aAb[k][forma as 'a' | 'ab']++;
  }
  for (const c of Object.keys(por) as Cabeza[])
    por[c].minoritarios = por[c].dativo >= por[c].conAb ? ejAb[c] : ejDat[c];
  return {
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'la_perseus + la_proiel (UD)',
    frases: frases.length,
    agentesAnotados: agentes,
    porCabeza: por,
    aAbPorInicial: Object.fromEntries(Object.entries(aAb).sort()),
  };
}

if (process.argv[1]?.endsWith('atestar-perifrastica.ts')) {
  const s = medir();
  fs.writeFileSync(SALIDA, `${JSON.stringify(s, null, 1)}\n`);
  console.log(`  ${SALIDA}  ${s.frases} frases · ${s.agentesAnotados} obl:agent`);
  for (const [k, v] of Object.entries(s.porCabeza))
    console.log(`    ${k.padEnd(20)} dativo ${String(v.dativo).padStart(3)} (nombres ${v.dativoNombre}) · ā/ab ${String(v.conAb).padStart(3)} · ā/ab como obl (candidatos) ${v.conAbObl.length}`);
}
