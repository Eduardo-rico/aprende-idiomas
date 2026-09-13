// lib/data/languages/la/todas-las-formas.ts
//
// TODO LO QUE LA MÁQUINA DE LATÍN PRODUCE, EN UN SOLO SITIO.
//
// ══ POR QUÉ ESTE FICHERO, SI YA HABÍA UNO ════════════════════════════
//
// `paradigma-la.ts` tiene un `todasLasFormas()` escrito exactamente por
// este motivo, y su comentario dice que el hueco se abrió **tres veces con
// la misma forma**: se añade algo a la máquina y los consumidores se quedan
// atrás EN VERDE, porque nadie los tocó.
//
// **Se abrió una cuarta.** Aquel enumerador recibe nombres, verbos y
// adjetivos por parámetro, y desde entonces la máquina ha crecido con seis
// tablas más —pluralia tantum, adjetivos de 3.ª, irregulares, compuestos de
// `sum`, pronombres y participios— que no pasan por él. No podía: viven en
// módulos que importan `paradigma-la`, así que `paradigma-la` no puede
// importarlos de vuelta. La solución no era otra lista: era un módulo que
// esté *por encima* de todos y al que llamen los consumidores.
//
// ══ LO QUE COSTÓ NO TENERLO ══════════════════════════════════════════
//
// `l1-larga-por-posicion` quedó declarado como bloqueado por falta de
// vocabulario: su `varia` es la muta cum liquida y no había en L1 ni una
// forma donde decidiera el acento. Era falso. **`tenebrae` estaba en el
// repositorio desde el principio**, en `PLURALIA_TANTUM` y con 44 tokens
// medidos — pero esa tabla no producía formas, así que `te-ne-brae`,
// `te-ne-brās` y `te-ne-brīs` no existían para ningún enumerador. El lema
// estaba; lo que faltaba era que la máquina lo declinara.
//
// Y el enumerador con el que yo lo «medí» era, él mismo, una copia más que
// miraba tres tablas de nueve.
import { NOMBRES_L1, VERBOS_L1, ADJETIVOS_L1, INDECLINABLES_L1 } from './lexicon-l1';
import { todasLasFormas as formasBase, paradigmaNominal, type EntradaNominal } from './paradigma-la';
import { PLURALIA_TANTUM, paradigmaPluralTantum } from './plural-tantum';
import { ADJETIVOS_3A, paradigmaAdjetivo3a, ablativoEnE } from './adjetivos-3a';
import { IRREGULARES_L1 } from './irregulares';
import { COMPUESTOS_DE_SUM, paradigmaCompuesto } from './compuestos-de-sum';
import { PRONOMBRES_L1, paradigmaPronombre } from './pronombres-la';
import { PERSONALES_L1, formasDe, GENITIVO_PARTITIVO } from './personales-la';
import { participioPresente } from './participios';
import { pasivaInfectum, imperativo, perfectum } from './paradigma-la';
import { todosLosInfinitivos, SIN_PASIVA } from './infinitivos';
import { paradigmaSubjuntivo, subjuntivoPasivo, subjuntivo, TIEMPOS_SUBJ, PERSONAS_SUBJ } from './subjuntivo';
import { participioPerfecto, participioFuturo } from './participios';
import { declinarAdjetivo, type Caso } from './paradigma-la';
/** El orden canónico de los casos. `paradigma-la` lo tiene privado, así que
 *  se repite aquí —seis literales— en vez de exportar un detalle interno. */
const ORDEN_CASOS: Caso[] = ['nom', 'ac', 'gen', 'dat', 'abl', 'voc'];
import { IRREGULARES_L1 as IRR } from './irregulares';
import { ADJETIVOS_L1 as ADJ } from './lexicon-l1';
import { ADJETIVOS_3A as ADJ3, temaDelAdjetivo } from './adjetivos-3a';
import { gradosDe, declinarComparativo } from './grado';
import {
  DEPONENTES_L1, paradigmaDeponente, participioDelDeponente, subjuntivoDelDeponente,
  participioPresenteDelDeponente, participioFuturoDelDeponente, imperativoDelDeponente,
  gerundioDelDeponente, segundaEnRe,
  TIEMPOS_SUBJ as TIEMPOS_SUBJ_DEP, PERSONAS_SUBJ as PERSONAS_SUBJ_DEP,
} from './deponentes';

export interface FormaDeL1 { clave: string; forma: string; tabla: string }

/** Las diez tablas que producen formas. La lista está aquí y no repartida:
 *  si alguien añade una décima y no la mete, hay un test que lo dice. */
export const TABLAS_QUE_PRODUCEN_FORMAS = [
  'NOMBRES_L1', 'VERBOS_L1', 'ADJETIVOS_L1', 'INDECLINABLES_L1', 'PLURALIA_TANTUM',
  'ADJETIVOS_3A', 'IRREGULARES_L1', 'COMPUESTOS_DE_SUM', 'PRONOMBRES_L1', 'PARTICIPIOS',
  'PASIVA', 'INFINITIVOS', 'IMPERATIVOS', 'PERSONALES_L1', 'SUBJUNTIVOS',
  // Entran el 2026-09-12 con `grado.ts`. La auditoría inversa las pedía a
  // gritos: 126 entradas y 584 tokens, la tercera clase de hueco por tamaño
  // y la primera de las que dependen de una máquina que no existía.
  'COMPARATIVOS', 'SUPERLATIVOS',
  // Los deponentes entran el 2026-09-12 con `deponentes.ts`. No van en
  // `VERBOS_L1` porque no tienen activa: meterlos ahí habría hecho que
  // `conjugar()` produjera `*sequō` y que todos los gates que iteran la
  // lista vieran un verbo que no existe.
  'DEPONENTES_L1',
] as const;

export function todasLasFormasDeL1(): FormaDeL1[] {
  const out: FormaDeL1[] = [];
  // EL FILTRO VA CONTRA `paradigmaNominal`, NO CONTRA `declinacionDe`.
  //
  // `Iēsus` tiene genitivo `Iēsū` y no es de ninguna de las cinco
  // declinaciones, así que `declinacionDe` lo rechaza — con razón. Pero
  // `paradigmaNominal` SÍ lo declina, porque está en `IRREGULARES` con su
  // paradigma entero. Filtrar por `declinacionDe` lo tiraba del dominio, y
  // eso es recortar el mundo con un guardián que contesta otra pregunta.
  // Lo cazó el guardián de la evidencia congelada, en cuanto empezó a
  // mirar el dominio completo.
  const nombresSanos = NOMBRES_L1.filter((n: EntradaNominal) => {
    try { paradigmaNominal(n); return true; } catch { return false; }
  });
  // Los indeclinables entran por el parámetro que el enumerador canónico ya
  // tenía y que mi copia no usaba: son formas de pleno derecho —`et`,
  // `nōn`, `sed`— y ningún consumidor las veía.
  for (const { clave, forma } of formasBase(nombresSanos, VERBOS_L1, ADJETIVOS_L1, [...INDECLINABLES_L1])) {
    const tabla = clave.endsWith('.indecl') ? 'INDECLINABLES_L1'
      : NOMBRES_L1.some((n) => clave.startsWith(`${n.lema}.`)) ? 'NOMBRES_L1'
      : VERBOS_L1.some((v) => clave.startsWith(`${v.lema}.`)) ? 'VERBOS_L1' : 'ADJETIVOS_L1';
    out.push({ clave, forma, tabla });
  }
  for (const p of PLURALIA_TANTUM)
    for (const [c, f] of Object.entries(paradigmaPluralTantum(p)))
      out.push({ clave: `${p.lema}.${c}`, forma: f, tabla: 'PLURALIA_TANTUM' });
  for (const a of ADJETIVOS_3A) {
    for (const [c, f] of Object.entries(paradigmaAdjetivo3a(a)))
      out.push({ clave: `${a.lema}.${c}`, forma: f, tabla: 'ADJETIVOS_3A' });
    out.push({ clave: `${a.lema}.abl-e`, forma: ablativoEnE(a), tabla: 'ADJETIVOS_3A' });
  }
  for (const v of IRREGULARES_L1)
    for (const [t, filas] of Object.entries(v.formas))
      for (const [p, f] of Object.entries(filas))
        if (f) out.push({ clave: `${v.lema}.${t}.${p}`, forma: f, tabla: 'IRREGULARES_L1' });
  for (const c of COMPUESTOS_DE_SUM)
    for (const t of ['presente', 'imperfecto', 'futuro'] as const)
      for (const [p, f] of Object.entries(paradigmaCompuesto(c, t)))
        out.push({ clave: `${c.lema}.${t}.${p}`, forma: f, tabla: 'COMPUESTOS_DE_SUM' });
  for (const e of PRONOMBRES_L1)
    for (const [c, f] of Object.entries(paradigmaPronombre(e)))
      out.push({ clave: `${e.lema}.${c}`, forma: f, tabla: 'PRONOMBRES_L1' });
  // LA VOZ PASIVA, que la máquina tiene (`pasivaInfectum`) y que ningún
  // enumerador llamaba. Lo destapó el gate de vocabulario del marco: `dīcitur`
  // y `vidētur` salían como palabras que el alumno no conoce, y las conoce.
  for (const v of VERBOS_L1) {
    if (SIN_PASIVA[v.lema.normalize('NFC')]) continue;   // declarado, no tragado
    for (const [c, f] of Object.entries(pasivaInfectum(v)))
      out.push({ clave: `${v.lema}.pas.${c}`, forma: f, tabla: 'PASIVA' });
  }
  // Y los cinco infinitivos, que entran con `l8-infinitivo-sustantivo`. El
  // de presente activo ya estaba —es dato del lexicón— y los otros cuatro
  // no existían para nadie.
  for (const v of VERBOS_L1)
    for (const g of ['m', 'f', 'n'] as const)
      for (const i of todosLosInfinitivos(v, g))
        out.push({ clave: `${v.lema}.inf.${i.tiempo}.${i.voz}.${g}`, forma: i.forma, tabla: 'INFINITIVOS' });
  for (const p of PERSONALES_L1) {
    for (const f of formasDe(p)) out.push({ clave: `${p.lema}.${f}`, forma: f, tabla: 'PERSONALES_L1' });
    const part = GENITIVO_PARTITIVO[p.lema];
    if (part) out.push({ clave: `${p.lema}.gen-partitivo`, forma: part, tabla: 'PERSONALES_L1' });
  }
  // EL SUBJUNTIVO, enchufado EN EL MISMO COMMIT en que se construye y no
  // después. Es la pieza más grande del proyecto —dieciocho puntos la
  // nombran— y meterla sin enchufarla habría dejado catorce puntos
  // apoyados en material que ningún guardián mira, con todos los gates en
  // verde y sin que nada avisara. Hoy mismo se ha visto tres veces qué
  // pasa cuando una máquina crece y los invariantes no la siguen.
  for (const v of VERBOS_L1) {
    for (const [c, f] of Object.entries(paradigmaSubjuntivo(v)))
      out.push({ clave: `${v.lema}.subj.${c}`, forma: f, tabla: 'SUBJUNTIVOS' });
    // Y la PASIVA del subjuntivo, que la auditoría pidió en cuanto se le
    // abrieron los filtros: `vidērētur` ×22 y no la producía nadie.
    for (const t of TIEMPOS_SUBJ)
      for (const p of PERSONAS_SUBJ) {
        const f = subjuntivoPasivo(v, t, p);
        if (f) out.push({ clave: `${v.lema}.subj-pas.${t}.${p}`, forma: f, tabla: 'SUBJUNTIVOS' });
      }
  }
  // EL SUBJUNTIVO DE LOS IRREGULARES vive en su propia tabla —`velim`,
  // `possim`, `eam`— y tampoco lo enumeraba nadie, porque `IRREGULARES_L1`
  // no son `EntradaVerbal`. Se les construye la entrada mínima que el
  // módulo necesita.
  for (const v of IRR) {
    const como = { lema: v.lema, infinitivo: v.infinitivo, glosa: v.glosa, perfecto: v.perfecto };
    for (const t of TIEMPOS_SUBJ)
      for (const p of PERSONAS_SUBJ) {
        let f: string | null = null;
        try { f = subjuntivo(como, t, p); } catch { f = null; }
        if (f) out.push({ clave: `${v.lema}.subj.${t}.${p}`, forma: f, tabla: 'SUBJUNTIVOS' });
      }
    // Y su INFINITIVO, su IMPERATIVO y su PERFECTUM, que están en la tabla
    // y no los enumeraba nadie: la auditoría los cazó en cuanto se le
    // abrieron los filtros —`fierī` ×118, `dedit` ×103, `nōlīte` ×87—.
    out.push({ clave: `${v.lema}.inf`, forma: v.infinitivo, tabla: 'IRREGULARES_L1' });
    // El imperativo DECLARADO gana al derivado: `nōlīte` no sale de
    // ninguna regla y es la forma corriente de prohibir en la Vulgata.
    for (const num of ['sg', 'pl'] as const) {
      const dec = v.imperativo?.[num];
      if (dec) { out.push({ clave: `${v.lema}.imp.${num}`, forma: dec, tabla: 'IRREGULARES_L1' }); continue; }
      try { out.push({ clave: `${v.lema}.imp.${num}`, forma: imperativo(como, num), tabla: 'IRREGULARES_L1' }); } catch { /* el que no lo forma, no lo forma */ }
    }
    for (const [c, f] of Object.entries(perfectum(como)))
      out.push({ clave: `${v.lema}.${c}`, forma: f, tabla: 'IRREGULARES_L1' });
  }
  // Los COMPUESTOS DE `sum` sólo tenían indicativo. Su subjuntivo,
  // infinitivo y perfectum salen igual, y `possum` solo vale 468 tokens.
  for (const c of COMPUESTOS_DE_SUM) {
    const como = { lema: c.lema, infinitivo: `${c.anteConsonante}se`, glosa: c.glosa, perfecto: `${c.anteVocal}uī` };
    for (const t of TIEMPOS_SUBJ)
      for (const p of PERSONAS_SUBJ) {
        let f: string | null = null;
        try { f = subjuntivo(como, t, p); } catch { f = null; }
        if (f) out.push({ clave: `${c.lema}.subj.${t}.${p}`, forma: f, tabla: 'COMPUESTOS_DE_SUM' });
      }
    out.push({ clave: `${c.lema}.inf`, forma: `${c.anteConsonante}se`, tabla: 'COMPUESTOS_DE_SUM' });
  }
  // EL IMPERATIVO, que la máquina tiene (`imperativo`) y que tampoco
  // enumeraba nadie. Lo destapó el barrido de vocabulario: `Audīte` salía
  // como palabra de fuera en un lote de la 1.ª declinación, y es el
  // imperativo plural de `audiō`.
  for (const v of VERBOS_L1)
    for (const num of ['sg', 'pl'] as const)
      out.push({ clave: `${v.lema}.imp.${num}`, forma: imperativo(v, num), tabla: 'IMPERATIVOS' });
  // LOS PARTICIPIOS DE PERFECTO Y DE FUTURO, DECLINADOS. Declinan como
  // adjetivos de 1.ª-2.ª, y hasta hoy sólo se enumeraba el de presente: la
  // auditoría cazó `facta` ×119, `factus` ×78, `ventūrus` ×24 como formas
  // que la máquina no producía, y sí las produce — nadie las llamaba.
  for (const v of VERBOS_L1)
    for (const [cual, part] of [['perf', participioPerfecto(v)], ['fut', participioFuturo(v)]] as const) {
      if (!part) continue;
      const tema = part.lema.normalize('NFC').replace(/us$/, '');
      const como = { lema: part.lema, tema, glosa: part.glosa };
      for (const g of ['m', 'f', 'n'] as const)
        for (const num of ['sg', 'pl'] as const)
          for (const c of ORDEN_CASOS)
            out.push({ clave: `${v.lema}.part-${cual}.${g}.${c}.${num}`, forma: declinarAdjetivo(como, g, c, num), tabla: 'PARTICIPIOS' });
    }
  // Del participio se enumera el de PRESENTE, que es el que declina como
  // adjetivo de 3.ª y el que el inventario examina en `l4-adjetivo-3a`.
  for (const v of VERBOS_L1) {
    const pp = participioPresente(v);
    for (const [c, f] of Object.entries(paradigmaAdjetivo3a(pp)))
      out.push({ clave: `${v.lema}.part-pres.${c}`, forma: f, tabla: 'PARTICIPIOS' });
  }

  // ══ LOS DEPONENTES ═════════════════════════════════════════════════
  //
  // Su paradigma ES el pasivo de la activa que nunca existió, así que sale
  // de la máquina que ya estaba. Y su participio de perfecto —`secūtus`,
  // con sentido ACTIVO— es la excepción que `l8-tres-participios` declara y
  // no pudo examinar con material de `VERBOS_L1`.
  for (const d of DEPONENTES_L1) {
    for (const [c, f] of Object.entries(paradigmaDeponente(d))) {
      out.push({ clave: `${d.lema}.dep.${c}`, forma: f, tabla: 'DEPONENTES_L1' });
      // La 2.ª del singular pasiva tiene dos formas y la máquina general
      // sólo daba una: `sequeris` y `sequere`.
      const alt = segundaEnRe(f);
      if (alt) out.push({ clave: `${d.lema}.dep.${c}-alt`, forma: alt, tabla: 'DEPONENTES_L1' });
    }
    for (const [c, f] of Object.entries(gerundioDelDeponente(d)))
      out.push({ clave: `${d.lema}.dep-ger.${c}`, forma: f, tabla: 'DEPONENTES_L1' });
    out.push({ clave: `${d.lema}.dep.inf`, forma: d.infinitivo, tabla: 'DEPONENTES_L1' });
    // El SUBJUNTIVO, el participio de PRESENTE y el de FUTURO, y el
    // imperativo. Los pidió la auditoría inversa en cuanto los deponentes
    // entraron: 89 entradas y 235 tokens —`loquātur`, `loquentēs`,
    // `ūsūrum`, `sequere`— que salen de la misma entrada ficticia.
    for (const t of TIEMPOS_SUBJ_DEP)
      for (const per of PERSONAS_SUBJ_DEP) {
        const f = subjuntivoDelDeponente(d, t, per);
        if (!f) continue;
        out.push({ clave: `${d.lema}.dep-subj.${t}.${per}`, forma: f, tabla: 'DEPONENTES_L1' });
        const alt = segundaEnRe(f);
        if (alt) out.push({ clave: `${d.lema}.dep-subj.${t}.${per}-alt`, forma: alt, tabla: 'DEPONENTES_L1' });
      }
    for (const [c, f] of Object.entries(paradigmaAdjetivo3a(participioPresenteDelDeponente(d))))
      out.push({ clave: `${d.lema}.dep-part-pres.${c}`, forma: f, tabla: 'DEPONENTES_L1' });
    const fut = participioFuturoDelDeponente(d);
    if (fut) {
      const comoFut = { lema: fut, tema: fut.replace(/us$/, ''), glosa: d.glosa };
      for (const g of ['m', 'f', 'n'] as const)
        for (const num of ['sg', 'pl'] as const)
          for (const c of ORDEN_CASOS)
            out.push({ clave: `${d.lema}.dep-part-fut.${g}.${c}.${num}`, forma: declinarAdjetivo(comoFut, g, c, num), tabla: 'DEPONENTES_L1' });
    }
    const imp = imperativoDelDeponente(d);
    out.push({ clave: `${d.lema}.dep-imp.sg`, forma: imp.sg, tabla: 'DEPONENTES_L1' });
    out.push({ clave: `${d.lema}.dep-imp.pl`, forma: imp.pl, tabla: 'DEPONENTES_L1' });

    const part = participioDelDeponente(d);
    if (part) {
      const como = { lema: part, tema: part.replace(/us$/, ''), glosa: d.glosa };
      for (const g of ['m', 'f', 'n'] as const)
        for (const num of ['sg', 'pl'] as const)
          for (const c of ORDEN_CASOS)
            out.push({ clave: `${d.lema}.dep-part.${g}.${c}.${num}`, forma: declinarAdjetivo(como, g, c, num), tabla: 'DEPONENTES_L1' });
    }
  }

  // ══ EL GRADO ═══════════════════════════════════════════════════════
  //
  // El comparativo declina como tema consonántico —ablativo en `-e`,
  // genitivo plural en `-um`— y por eso no lo puede enumerar el declinador
  // de la 3.ª; el superlativo declina como adjetivo de 1.ª/2.ª. Los que no
  // admiten grado —posesivos, ordinales, `omnis`— devuelven `null` y no
  // aparecen: la máquina calla donde no hay forma.
  const CON_GRADO: { lema: string; tema: string }[] = [
    ...ADJ.map((a) => ({ lema: a.lema, tema: (a as unknown as { tema: string }).tema })),
    ...ADJ3.map((a) => ({ lema: a.lema, tema: temaDelAdjetivo(a) })),
  ];
  for (const a of CON_GRADO) {
    const g = gradosDe(a.lema, a.tema);
    if (g.clase === 'sin-grado' || g.clase === 'perifrastico') continue;
    for (const gen of ['m', 'f', 'n'] as const)
      for (const num of ['sg', 'pl'] as const)
        for (const c of ORDEN_CASOS) {
          const f = declinarComparativo(g, gen, c, num);
          if (f) out.push({ clave: `${a.lema}.comp.${gen}.${c}.${num}`, forma: f, tabla: 'COMPARATIVOS' });
        }
    if (g.superlativo) {
      const sup = g.superlativo;
      const como = { lema: sup, tema: sup.replace(/us$/, ''), glosa: `superlativo de ${a.lema}` };
      for (const gen of ['m', 'f', 'n'] as const)
        for (const num of ['sg', 'pl'] as const)
          for (const c of ORDEN_CASOS)
            out.push({ clave: `${a.lema}.sup.${gen}.${c}.${num}`, forma: declinarAdjetivo(como, gen, c, num), tabla: 'SUPERLATIVOS' });
    }
  }
  return out;
}

/** Las formas a secas, sin repetir. Es lo que quieren casi todos los
 *  consumidores, y lo que hasta hoy cada uno enumeraba por su cuenta. */
export function formasUnicasDeL1(): string[] {
  return [...new Set(todasLasFormasDeL1().map((f) => f.forma))];
}
