// scripts/lib/gate-morfologia-subj.ts — LOS CUATRO TIEMPOS DEL SUBJUNTIVO.
//
// Punto `l7-morfologia-subj`. «amem, amārem, amāverim, amāvissem. **El
// imperfecto se forma sobre el infinitivo, que es la regla más útil y la
// que menos se enseña.**» `varia`: «el tiempo y la conjugación».
//
// ══ LA EXCEPCIÓN ES UNA INVERSIÓN, Y ESO LA HACE CARA ════════════════
//
// `excepcion`: «el presente de la 1.ª conjugación va en `-e-` (amem) y el
// de las otras en `-a-` (moneam): **la vocal se invierte respecto al
// indicativo**, y quien sobreaplique dirá *«amam»».
//
// En el indicativo la 1.ª tiene `-a-` (amat) y las demás `-e-`/`-i-`. En el
// subjuntivo presente es al revés. No es una excepción que se memoriza: es
// un cruce, y el error que produce —`*amam`— es la forma que el alumno
// esperaría por analogía con todo lo que ya sabe.
//
// ══ LA ESTRATEGIA CIEGA Y SU DENOMINADOR ═════════════════════════════
//
// «Poner `-a-` a todo» acierta en la 2.ª, la 3.ª, la 4.ª y la mixta, y
// falla sólo en la 1.ª. Y **sólo es distinguible en el PRESENTE**: en el
// imperfecto, el perfecto y el pluscuamperfecto no hay vocal temática que
// elegir. La tasa se lee sobre los presentes y el denominador viaja con
// ella, como en todos los gates de este proyecto desde que uno mintió por
// no llevarlo.
import { subjuntivo, type TiempoSubj } from '../../lib/data/languages/la/subjuntivo';
import { conjugacionDe, esMixta, type EntradaVerbal, type Persona } from '../../lib/data/languages/la/paradigma-la';
import porAnalisis from '../../lib/data/languages/la/atestacion-por-analisis.json';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

// ══ LA CADENA NO ES EL ANÁLISIS ══════════════════════════════════════
//
// La primera versión de este gate leía `atestacion-acento.json`, que cuenta
// CADENAS. Para la pregunta del acento la cadena es la pregunta entera; para
// la de aquí —«¿se encontrará el alumno esta forma?»— miente. Medido:
// `laudem` aparece 15 veces y **ninguna** es un subjuntivo, y `vocem` 81 y
// **una** lo es. Eran los dos ítems que llevaban el punto.
const TABLA = (porAnalisis as { tabla: Record<string, Record<string, number>> }).tabla;
const comoSubjuntivo = (f: string) => TABLA[f]?.sub ?? 0;
const comoNombre = (f: string) => TABLA[f]?.nominal ?? 0;

export interface ItemSubj {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  tiempo: TiempoSubj;
  persona: Persona;
  respuesta: string;
  marco: string;
  pista: string;
  glosa: string;
  ejes: { conjugacion: 1 | 2 | 3 | 4 | 'mixta' };
  porQueSinAtestiguar?: string;
}

export type ClaseFalloSubj =
  | 'respuesta-no-derivable' | 'eje-mal-declarado' | 'sin-atestiguar' | 'homonimo-nominal'
  | 'pista-regala-la-forma' | 'marco-mal' | 'marco-fuera-de-l1'
  | 'varia-incompleto' | 'estrategia-ciega' | 'celdas-repetidas'
  | 'orden-separable' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloSubj { item: string; clase: ClaseFalloSubj; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();

/** «Poner `-a-` a todo», que es la sobreaplicación que el punto nombra.
 *  Sólo se distingue de lo correcto en el PRESENTE de la 1.ª. */
export function siempreConA(v: EntradaVerbal, t: TiempoSubj, p: Persona): string | null {
  if (t !== 'presente') return subjuntivo(v, t, p);   // fuera del presente no hay nada que elegir
  const c = esMixta(v) ? 3 : conjugacionDe(v);
  if (c !== 1) return subjuntivo(v, t, p);
  // En la 1.ª, la sobreaplicación cambia la `ē` del tema por `ā`: `*amam`.
  const bueno = subjuntivo(v, t, p);
  return bueno === null ? null : bueno.replace(/ē/g, 'ā').replace(/e(?=[mstn])/g, 'a');
}

export function revisarItemSubj(item: ItemSubj): FalloSubj[] {
  const out: FalloSubj[] = [];
  const push = (clase: ClaseFalloSubj, detalle: string) => out.push({ item: item.id, clase, detalle });

  const dela = subjuntivo(item.verbo, item.tiempo, item.persona);
  if (dela === null) { push('respuesta-no-derivable', `la máquina no da ${item.tiempo}.${item.persona} de «${item.verbo.lema}»`); return out; }
  if (norm(dela) !== norm(item.respuesta))
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${dela}»`);

  let c: 1 | 2 | 3 | 4 | 'mixta';
  try { c = esMixta(item.verbo) ? 'mixta' : conjugacionDe(item.verbo); }
  catch { push('eje-mal-declarado', `«${item.verbo.lema}» no es de ninguna de las cuatro`); return out; }
  if (c !== item.ejes.conjugacion) push('eje-mal-declarado', `declara conjugación ${item.ejes.conjugacion} y es ${c}`);

  const excusado = (item.porQueSinAtestiguar ?? '').trim().length >= 20;
  if (comoSubjuntivo(item.respuesta) === 0 && !excusado)
    push('sin-atestiguar', `«${item.respuesta}» no aparece NUNCA como subjuntivo en el corpus`
      + ` (la cadena sale ${Object.values(TABLA[item.respuesta] ?? {}).reduce((a, b) => a + b, 0)} vez/veces)`);
  // El homónimo que importa es el de OTRA clase de palabra. `dīcam` comparte
  // cadena con su propio futuro de indicativo —28 apariciones, 14 de cada—,
  // y ése es el cruce que el punto declara y que `homonimoDelIndicativo()`
  // sabe nombrar: no es un defecto, es la materia. El que envenena es el
  // nominal, que no comparte ni lema: quien lee `vocem` ochenta veces como
  // acusativo de `vōx` no tiene por dónde relacionarlo con `vocō`.
  else if (comoNombre(item.respuesta) > comoSubjuntivo(item.respuesta) && !excusado)
    push('homonimo-nominal', `«${item.respuesta}» sale ${comoNombre(item.respuesta)} vez/veces como nombre`
      + ` y sólo ${comoSubjuntivo(item.respuesta)} como subjuntivo`);

  for (const [donde, txt] of [['la pista', item.pista], ['la glosa', item.glosa], ['el marco', item.marco]] as const)
    if (norm(txt).includes(norm(item.respuesta))) push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  if (!item.marco.includes('___')) push('marco-mal', 'el marco latino no tiene hueco `___`');
  const d = palabrasDesconocidas(item.marco);
  if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  return out;
}

export function coberturaSubj(items: ItemSubj[]): Cobertura[] {
  const n = items.length;
  const tiempos = new Set(items.map((i) => i.tiempo));
  const conj = new Set(items.map((i) => i.ejes.conjugacion));
  const presentes = items.filter((i) => i.tiempo === 'presente');
  const refutan = presentes.filter((i) => norm(siempreConA(i.verbo, i.tiempo, i.persona) ?? '') !== norm(i.respuesta)).length;
  const imperf = items.filter((i) => i.tiempo === 'imperfecto').length;
  return [
    // Las dos primeras contaban `n` de `n`, que es decir 100 % sin mirar.
    // Ahora cuentan, y la segunda es la que destapó `laudem`.
    { comprobacion: 'la respuesta contra la máquina',
      decididos: items.filter((i) => norm(subjuntivo(i.verbo, i.tiempo, i.persona) ?? '\u0000') === norm(i.respuesta)).length, total: n },
    { comprobacion: 'la forma aparece en el corpus COMO SUBJUNTIVO',
      decididos: items.filter((i) => comoSubjuntivo(i.respuesta) > 0).length, total: n },
    { comprobacion: 'y sin que el nominal homónimo la tape',
      decididos: items.filter((i) => comoSubjuntivo(i.respuesta) >= comoNombre(i.respuesta)).length, total: n },
    { comprobacion: 'los cuatro tiempos', decididos: tiempos.size, total: 4,
      motivoDeLosQueQuedanFuera: 'el varia son el tiempo y la conjugación: los cuatro tienen que estar' },
    { comprobacion: 'las conjugaciones', decididos: conj.size, total: 5 },
    { comprobacion: 'la INVERSIÓN de la vocal, que sólo refuta la 1.ª en presente', decididos: refutan, total: presentes.length,
      motivoDeLosQueQuedanFuera: 'fuera del presente no hay vocal temática que elegir, y en las otras conjugaciones «poner -a- a todo» ES lo correcto' },
    { comprobacion: 'el imperfecto sobre el infinitivo', decididos: imperf, total: n,
      motivoDeLosQueQuedanFuera: 'es la regla que el punto llama «la más útil y la que menos se enseña», y sólo un ítem de imperfecto la examina' },
  ];
}

export function tasasCiegasSubj(items: ItemSubj[]) {
  const presentes = items.filter((i) => i.tiempo === 'presente');
  return {
    siempreConA: {
      tasa: presentes.length === 0 ? 0
        : presentes.filter((i) => norm(siempreConA(i.verbo, i.tiempo, i.persona) ?? '') === norm(i.respuesta)).length / presentes.length,
      decididos: presentes.length, total: items.length,
    },
  };
}

export function revisarLoteSubj(items: ItemSubj[]): FalloSubj[] {
  const out: FalloSubj[] = items.flatMap(revisarItemSubj);

  const tiempos = new Set(items.map((i) => i.tiempo));
  if (tiempos.size < 4) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: `el varia son el tiempo y la conjugación, y el lote toca ${tiempos.size} tiempo(s): ${[...tiempos].join(', ')}` });
  const conj = new Set(items.map((i) => i.ejes.conjugacion));
  if (conj.size < 4) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: `y ${conj.size} conjugación(es): ${[...conj].join(', ')}` });

  const primeras = items.filter((i) => i.tiempo === 'presente' && i.ejes.conjugacion === 1).length;
  if (primeras < 2) out.push({ item: '(lote)', clase: 'varia-incompleto',
    detalle: `sólo ${primeras} presente(s) de 1.ª conjugación, y hacen falta 2: son los únicos que refutan la sobreaplicación «*amam» que el punto declara` });

  const vistas = new Map<string, string>();
  for (const i of items) {
    const k = `${i.verbo.lema}.${i.tiempo}.${i.persona}`;
    if (vistas.has(k)) out.push({ item: i.id, clase: 'celdas-repetidas', detalle: `misma casilla que ${vistas.get(k)}: ${k}` });
    else vistas.set(k, i.id);
  }

  const sep = separablePorPosicion(patronDe(items, (i) => i.tiempo === 'presente'));
  if (sep) out.push({ item: '(lote)', clase: 'orden-separable', detalle: `el eje «es presente» se predice por la POSICIÓN: ${sep}` });

  out.push(...revisarCobertura(coberturaSubj(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloSubj, detalle: f.detalle })));

  const t = tasasCiegasSubj(items);
  if (t.siempreConA.decididos > 0 && t.siempreConA.tasa > 0.75)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«poner -a- a todo» acierta ${(100 * t.siempreConA.tasa).toFixed(0)} % de los ${t.siempreConA.decididos} presentes: el lote no enseña la inversión` });
  return out;
}

export function informeSubj(items: ItemSubj[]): string {
  const fallos = revisarLoteSubj(items);
  const t = tasasCiegasSubj(items);
  const lineas = [`  ${items.length} ítems · ${fallos.length} fallo(s)`];
  for (const c of coberturaSubj(items)) lineas.push(`    cobertura · ${c.comprobacion}: ${c.decididos}/${c.total}`);
  lineas.push(`    ciega · poner -a- a todo: ${(100 * t.siempreConA.tasa).toFixed(0)} % sobre los ${t.siempreConA.decididos} presentes`);
  for (const f of fallos) lineas.push(`    ✗ ${f.item} [${f.clase}] ${f.detalle}`);
  return lineas.join('\n');
}
