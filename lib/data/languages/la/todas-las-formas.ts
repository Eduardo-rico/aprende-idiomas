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
import { todasLasFormas as formasBase, declinacionDe, type EntradaNominal } from './paradigma-la';
import { PLURALIA_TANTUM, paradigmaPluralTantum } from './plural-tantum';
import { ADJETIVOS_3A, paradigmaAdjetivo3a, ablativoEnE } from './adjetivos-3a';
import { IRREGULARES_L1 } from './irregulares';
import { COMPUESTOS_DE_SUM, paradigmaCompuesto } from './compuestos-de-sum';
import { PRONOMBRES_L1, paradigmaPronombre } from './pronombres-la';
import { participioPresente } from './participios';

export interface FormaDeL1 { clave: string; forma: string; tabla: string }

/** Las diez tablas que producen formas. La lista está aquí y no repartida:
 *  si alguien añade una décima y no la mete, hay un test que lo dice. */
export const TABLAS_QUE_PRODUCEN_FORMAS = [
  'NOMBRES_L1', 'VERBOS_L1', 'ADJETIVOS_L1', 'INDECLINABLES_L1', 'PLURALIA_TANTUM',
  'ADJETIVOS_3A', 'IRREGULARES_L1', 'COMPUESTOS_DE_SUM', 'PRONOMBRES_L1', 'PARTICIPIOS',
] as const;

export function todasLasFormasDeL1(): FormaDeL1[] {
  const out: FormaDeL1[] = [];
  const nombresSanos = NOMBRES_L1.filter((n: EntradaNominal) => {
    try { declinacionDe(n); return true; } catch { return false; }
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
  // Del participio se enumera el de PRESENTE, que es el que declina como
  // adjetivo de 3.ª y el que el inventario examina en `l4-adjetivo-3a`.
  for (const v of VERBOS_L1) {
    const pp = participioPresente(v);
    for (const [c, f] of Object.entries(paradigmaAdjetivo3a(pp)))
      out.push({ clave: `${v.lema}.part-pres.${c}`, forma: f, tabla: 'PARTICIPIOS' });
  }
  return out;
}

/** Las formas a secas, sin repetir. Es lo que quieren casi todos los
 *  consumidores, y lo que hasta hoy cada uno enumeraba por su cuenta. */
export function formasUnicasDeL1(): string[] {
  return [...new Set(todasLasFormasDeL1().map((f) => f.forma))];
}
