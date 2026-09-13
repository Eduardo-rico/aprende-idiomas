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
// ── LO QUE LA MEDICIÓN DICE DEL MATERIAL ─────────────────────────────
//
// La regla se sostiene y **la excepción declarada también**, que es lo
// que no esperaba:
//
//     deus    18 CON ·  0 SIN      gladius  0 CON ·  3 SIN
//     dominus 10 CON ·  0 SIN      manus    0 CON ·  9 SIN
//     pater    7 CON ·  0 SIN      timor    0 CON · 10 SIN
//     homo     8 CON ·  1 SIN      aqua     0 CON ·  6 SIN
//
//     natura   5 CON ·  5 SIN   ← la excepción que el punto declara
//
// Y el corte de `natura` NO es ruido: los cinco CON son de Cicerón y son
// la causa eficiente —`ā nātūrā generātī sumus`, `ā nātūrā datam`—; los
// cinco SIN son de César y son instrumentales —`nātūrā locī mūnītum`, «por
// el emplazamiento»—. El mismo lema, dos sentidos, dos tratamientos. El
// `excepcion` del punto estaba escrito sin gate (§E1) y ahora tiene uno.
//
// El único aparente contraejemplo de los animados se deshace al leerlo:
// `homo` SIN es «armātīs hominibus … expulsī sunt fabrī», un ablativo
// absoluto, no un agente. Y `rēx` SIN es «praeparārētur via rēgibus», un
// dativo de destinatario que la anotación marca ablativo.
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
