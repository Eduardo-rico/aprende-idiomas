// scripts/lib/atestar-agente.ts
//
// CONGELA LO QUE EL CORPUS DICE DEL AGENTE Y DEL INSTRUMENTO. Genera
// `lib/data/languages/la/atestacion-agente.json`.
//
//   npx tsx scripts/lib/atestar-agente.ts
//
// ── POR QUÉ HACE FALTA UN SELLO Y NO BASTA LA MÁQUINA ────────────────
//
// `l3-ablativo-agente` afirma una regla sobre la LENGUA: «ā/ab + ablativo
// sólo con seres animados; el instrumental va sin preposición». Ninguna
// máquina de este proyecto puede confirmarla — `paradigma-la.ts` sabe
// declinar `dominō`, no sabe si lleva preposición. El segundo camino tiene
// que ser de otra naturaleza y aquí lo es: **la anotación de dependencias
// del treebank**, que no la escribió nadie de aquí.
//
// Se cuenta, para cada lema:
//
//   · ablativos con `deprel` `obl*`/`nmod*` cuya CABEZA lleva `Voice=Pass`
//   · si les cuelga un `case` con lema `a`/`ab`  → CON
//   · si no les cuelga ningún `case`             → SIN
//   · si les cuelga OTRA preposición (`in`, `cum`, `de`…) se descartan:
//     son locativos y compañías, no agentes ni instrumentos
//
// ── LA CIFRA QUE DE VERDAD DICE ALGO ─────────────────────────────────
//
// No es el reparto por lema: es el reparto sobre lo que la anotación marca
// como AGENTE.
//
//     obl:agent               431 de 2.032 hits   21,2 %
//     de ellos, con `ā/ab`    402 de 431          93,3 %
//
// Ésa es la regla del punto, medida: nueve de cada diez agentes anotados
// llevan preposición.
//
// ── Y LO QUE ESTE SELLO **NO** ES, que es más importante ─────────────
//
// ⚠ **`sin` NO quiere decir «instrumental», y `con` NO quiere decir
// «agente».** Descartar las otras preposiciones evita los locativos y las
// compañías, y nada más. Medido sobre los 1.379 del lado SIN:
//
//     cabeza en PARTICIPIO (ablativo absoluto incluido)  592   42,9 %
//     `obl:arg` — ablativo REGIDO (`ūtor`, `potior`)     241   17,5 %
//     lema de TIEMPO o LUGAR (`diēs`, `tempus`, `locus`)  75    5,4 %
//     `obl:agent` sin preposición                         14    1,0 %
//     resto — los candidatos a instrumental              457   33,1 %
//
// Y del lado CON, **251 de 653 (38,4 %) no son `obl:agent`** sino `ā` de
// separación y de origen.
//
// ⚠⚠ **DE AQUÍ NO SE DERIVA LA ANIMACIDAD DE UN LEMA.** Un recuento por
// lema no es un rasgo semántico, y con este corpus miente en las dos
// direcciones:
//
//     rex         0 CON · 1 SIN   ← y ese único SIN es «praeparārētur via
//                                   rēgibus», un dativo que la anotación
//                                   marca ablativo. Un token basta para
//                                   dar a un REY por instrumento.
//     monumentum  3 CON · 0 SIN   ← y `cōnstitūtiō`, `gemma`, `plaga`:
//                                   196 lemas de los 780 saldrían
//                                   «animados» por este camino.
//     homo        8 CON · 1 SIN   ← el SIN es un ablativo absoluto
//     frater      5 CON · 1 SIN
//
// Quien quiera la animacidad tiene que declararla con su fuente. Este
// sello sirve para CORROBORAR una declaración, no para sustituirla.
//
// ── LA EXCEPCIÓN DEL PUNTO, QUE SÍ SE CONFIRMA ───────────────────────
//
//     natura   5 CON ·  5 SIN
//
// Y el corte no es ruido: los cinco CON son la causa eficiente —`ā nātūrā
// generātī`, `ā nātūrā datam`, `ā nātūrā indūtōs`— y los cinco SIN son
// instrumentales, todos del molde `nātūrā (locī) mūnītum / mūniēbātur /
// continentur`, «por el emplazamiento». El mismo lema, dos sentidos, dos
// tratamientos. El `excepcion` del punto estaba escrito sin gate (§E1) y
// ahora tiene uno.
//
// (Los lemas del lote retirado, por si vuelven: `deus` 18/0, `dominus`
// 10/0, `pater` 7/0, `gladius` 0/3, `manus` 0/9, `bellum` 0/12,
// `aqua` 0/6, **`timor` 1/10**. Ese 1 es `nōn tam explōrātās ā timōre`, y
// es el que cazó un error de quien escribió esto: una sonda del scratchpad
// había dado 0.)
import fs from 'node:fs';
import { leerFrases } from './atestar-ut';

const SALIDA = 'lib/data/languages/la/atestacion-agente.json';

export interface SelloAgente {
  generado: string;
  corpus: string;
  frases: number;
  /** Ablativos de verbo pasivo, con y sin `ā/ab`. */
  totales: { con: number; sin: number };
  /** Por lema: cuántas veces con preposición y cuántas sin ella. */
  lemas: Record<string, { con: number; sin: number }>;
}

export function medir(dir?: string): SelloAgente {
  const frases = leerFrases(dir);
  const lemas: Record<string, { con: number; sin: number }> = {};
  let con = 0, sn = 0;
  for (const f of frases) {
    const porHead = new Map<number, typeof f>();
    for (const t of f) porHead.set(t.head, [...(porHead.get(t.head) ?? []), t]);
    for (const t of f) {
      if (!/Case=Abl/.test(t.feats)) continue;
      if (!/^(obl|nmod)/.test(t.deprel)) continue;
      const h = f.find((x) => x.id === t.head);
      if (!h || !/Voice=Pass/.test(h.feats)) continue;
      const hijos = porHead.get(t.id) ?? [];
      const caseHijos = hijos.filter((c) => c.deprel === 'case');
      const ab = caseHijos.some((c) => /^(a|ab|abs)$/.test(c.lema));
      // OTRA preposición ⇒ ni agente ni instrumento. Se descarta, y se
      // descarta A PROPÓSITO: contarla como «sin ā» metería todos los
      // `in urbe` en el lado del instrumental.
      if (!ab && caseHijos.length > 0) continue;
      lemas[t.lema] ??= { con: 0, sin: 0 };
      if (ab) { lemas[t.lema]!.con++; con++; } else { lemas[t.lema]!.sin++; sn++; }
    }
  }
  return {
    generado: new Date().toISOString().slice(0, 10),
    corpus: 'la_perseus + la_proiel (UD)',
    frases: frases.length,
    totales: { con, sin: sn },
    lemas: Object.fromEntries(Object.entries(lemas).sort((a, b) =>
      (b[1].con + b[1].sin) - (a[1].con + a[1].sin))),
  };
}

if (process.argv[1]?.endsWith('atestar-agente.ts')) {
  const s = medir();
  fs.writeFileSync(SALIDA, `${JSON.stringify(s, null, 1)}\n`);
  console.log(`  ${SALIDA}  ${s.frases} frases · ${s.totales.con} con ā/ab · ${s.totales.sin} sin preposición · ${Object.keys(s.lemas).length} lemas`);
}
