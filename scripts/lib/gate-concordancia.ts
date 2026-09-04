// scripts/lib/gate-concordancia.ts
//
// EL GATE DE CONCORDANCIA, escrito antes del primer ítem y de LOTE.
//
// Punto: `l4-concordancia` — «el adjetivo concuerda en género, número y
// caso, NO en declinación». Su propio `varia` ya nombra el eje:
//
//     «si las terminaciones coinciden (bonus dominus) o no (magnum opus),
//      y hay que traer las dos: SÓLO LA SEGUNDA MIDE ALGO»
//
// ── LAS DOS ESTRATEGIAS, Y POR QUÉ SE MIDEN DISTINTO ──────────────────
//
// **1. RIMAR** — darle al adjetivo la terminación que lleva el sustantivo.
// Es una estrategia COMPLETA: produce una forma entera sin saber nada. Y
// acierta en `bonus dominus`, `bona puella`, `bonum bellum`, o sea en la
// mayoría del latín; falla en `bonus nauta` y `bonus puer`. Es el mismo
// eje binario de los dos formatos anteriores, así que le vale la misma
// aritmética: mitad y mitad, o el lote se resuelve rimando.
//
// Cuidado con medirla mal: rimar es copiar la DESINENCIA, no los dos
// últimos caracteres. `bona`/`puella` riman («-a»); `bonus`/`nauta` no.
// Compararlas por caracteres daba `bona puella` como no-rimante y habría
// contado como discriminante un ítem que no discrimina nada.
//
// **2. EL GÉNERO DE LA GLOSA ESPAÑOLA** — `templum` es «el templo», que en
// español es masculino, así que el alumno escribe `bonus` por `bonum`; y
// `bella` es «las guerras», femenino plural, así que escribe `bonae` por
// `bona`. Es el error diana propio de un HISPANOHABLANTE, no de un
// anglófono: nace de que el español no tiene neutro.
//
// Pero **no es una estrategia completa**: decide el género y no da ni el
// caso ni el número, así que medirle una «tasa de acierto» sería inventar
// un número. Se vigila por el DENOMINADOR: el lote tiene que traer un
// mínimo de ítems donde el género español ENGAÑE, o la trampa no se
// examina por muy bien escrito que esté todo.
import { declinar, declinarAdjetivo, concuerda,
         type EntradaNominal, type EntradaAdjetivo, type Caso, type Numero } from '../../lib/data/languages/la/paradigma-la';

export type Celda = `${Caso}.${Numero}`;

export interface ItemConcordancia {
  id: string;
  punto: string;
  sustantivo: EntradaNominal;
  adjetivo: EntradaAdjetivo;
  celda: Celda;
  /** La forma del ADJETIVO, escrita a mano y contrastada con la máquina. */
  respuesta: string;
  /** Género y número de la GLOSA ESPAÑOLA del sustantivo. El español no
   *  tiene neutro, así que aquí sólo hay `m` y `f` — y eso es la trampa. */
  generoEs: 'm' | 'f';
  marco: string;
  pista: string;
  ejes: {
    /** ¿Coinciden las desinencias del sustantivo y del adjetivo? Se
     *  comprueba contra los datos: es una etiqueta a mano. */
    rima: boolean;
    /** ¿El género español discrepa del latino? Idem. */
    generoEnganya: boolean;
    celda: Celda;
  };
}

import { revisarCobertura, type Cobertura } from './cobertura';

export type ClaseFalloC =
  | 'respuesta-no-derivable' | 'eje-mal-declarado' | 'pista-regala-la-forma'
  | 'marco-mal' | 'repetido' | 'estrategia-ciega' | 'sin-trampa-de-genero'
  | 'ejes-colineales'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloC { item: string; clase: ClaseFalloC; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();
const parte = (c: Celda) => c.split('.') as [Caso, Numero];
const temaNombre = (n: EntradaNominal) => norm(n.genitivo).replace(/(ae|ī)$/, '');

/** La DESINENCIA del sustantivo en esa celda: lo que quedaría al quitarle
 *  el tema. Vacía en los `-er`, que no la tienen en nominativo. */
export function desinenciaDe(n: EntradaNominal, celda: Celda): string {
  const [c, num] = parte(celda);
  const f = norm(declinar(n, c, num));
  const t = temaNombre(n);
  return f.startsWith(t) ? f.slice(t.length) : '';
}

/** Lo que responde quien RIMA: el tema del adjetivo más la desinencia del
 *  sustantivo. Si no hay desinencia que copiar, la estrategia no produce
 *  nada y falla, que es lo que de verdad le pasa al alumno ante `puer`. */
export function respuestaRimada(item: ItemConcordancia): string {
  const d = desinenciaDe(item.sustantivo, item.celda);
  return d ? norm(item.adjetivo.tema) + d : '';
}

/** Si las desinencias del sustantivo y del adjetivo CORRECTO coinciden. */
export function rimaDeVerdad(item: ItemConcordancia): boolean {
  const d = desinenciaDe(item.sustantivo, item.celda);
  if (!d) return false;
  return norm(item.adjetivo.tema) + d === norm(item.respuesta);
}

export function tasasCiegasC(items: ItemConcordancia[]) {
  const n = items.length || 1;
  return {
    rimar: items.filter((i) => respuestaRimada(i) === norm(i.respuesta)).length / n,
    conTrampaDeGenero: items.filter((i) => i.generoEs !== i.sustantivo.genero).length,
    queNoRiman: items.filter((i) => !rimaDeVerdad(i)).length,
  };
}

export const TECHO_C = 0.5;
export const MIN_TRAMPA_GENERO = 4;

export function revisarConcordancia(item: ItemConcordancia): FalloC[] {
  const out: FalloC[] = [];
  const push = (clase: ClaseFalloC, detalle: string) => out.push({ item: item.id, clase, detalle });

  const [c, num] = parte(item.celda);
  const derivada = concuerda(item.adjetivo, item.sustantivo, c, num);
  if (norm(derivada) !== norm(item.respuesta)) {
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina deriva «${derivada}»`);
  }

  if (item.ejes.celda !== item.celda) push('eje-mal-declarado', `declara celda ${item.ejes.celda} y pide ${item.celda}`);
  if (item.ejes.rima !== rimaDeVerdad(item)) {
    push('eje-mal-declarado', `declara rima=${item.ejes.rima} y las desinencias dicen ${rimaDeVerdad(item)}`);
  }
  const enganya = item.generoEs !== item.sustantivo.genero;
  if (item.ejes.generoEnganya !== enganya) {
    push('eje-mal-declarado', `declara generoEnganya=${item.ejes.generoEnganya} y el español es ${item.generoEs} contra el latín ${item.sustantivo.genero}`);
  }

  if (!item.marco.includes('___')) push('marco-mal', 'el marco latino no tiene hueco `___`');
  for (const [donde, txt] of [['la pista', item.pista], ['el marco', item.marco]] as const) {
    if (norm(txt).includes(norm(item.respuesta))) push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  }
  // Ni otra forma del mismo adjetivo, que la tendría a la vista.
  const t = norm(item.adjetivo.tema);
  if (t.length >= 3 && norm(item.marco).replace('___', ' ').includes(t)) {
    push('pista-regala-la-forma', `el marco lleva otra forma del adjetivo (tema «${t}»)`);
  }
  return out;
}

/** Sobre cuántos ítems decide de verdad cada comprobación. */
export function coberturaConcordancia(items: ItemConcordancia[]): Cobertura[] {
  const n = items.length;
  const conDesinencia = items.filter((i) => desinenciaDe(i.sustantivo, i.celda) !== '').length;
  const neutros = items.filter((i) => i.sustantivo.genero === 'n').length;
  return [
    { comprobacion: 'la respuesta contra la máquina', decididos: n, total: n },
    { comprobacion: 'rimar como estrategia', decididos: conDesinencia, total: n,
      motivoDeLosQueQuedanFuera: 'ante un -er de 2.ª o un nominativo de 3.ª no hay desinencia que copiar: la estrategia no produce nada' },
    { comprobacion: 'la trampa del género español', decididos: neutros, total: n,
      motivoDeLosQueQuedanFuera: 'el español no tiene neutro, así que sólo un sustantivo NEUTRO puede hacer discrepar los géneros' },
    { comprobacion: 'la independencia de los dos ejes', decididos: n, total: n },
  ];
}

export function revisarLoteC(items: ItemConcordancia[]): FalloC[] {
  const out: FalloC[] = items.flatMap(revisarConcordancia);
  out.push(...revisarCobertura(coberturaConcordancia(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloC, detalle: f.detalle })));
  const t = tasasCiegasC(items);

  if (t.rimar > TECHO_C) {
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `rimar —copiarle al adjetivo la desinencia del sustantivo— acierta el ${(100 * t.rimar).toFixed(0)} %, por encima del ${(100 * TECHO_C).toFixed(0)} %` });
  }
  if (t.queNoRiman < 4) {
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `sólo ${t.queNoRiman} ítems NO riman (hacen falta ≥4): en los que riman, rimar y concordar dan lo mismo y el ítem no examina el punto` });
  }
  // El género español no da caso ni número, así que no se le mide tasa: se
  // vigila que el lote traiga bastantes casos donde ENGAÑE.
  if (t.conTrampaDeGenero < MIN_TRAMPA_GENERO) {
    out.push({ item: '(lote)', clase: 'sin-trampa-de-genero',
      detalle: `sólo ${t.conTrampaDeGenero} ítems tienen el género español discrepando del latino (hacen falta ≥${MIN_TRAMPA_GENERO}): sin ellos no se examina el error diana del hispanohablante` });
  }

  // ── LOS DOS EJES TIENEN QUE SER INDEPENDIENTES ──
  //
  // Si «rima» y «el género engaña» coinciden ítem a ítem, el lote no puede
  // decir cuál de los dos falló el alumno: son un solo eje con dos
  // nombres, y la cobertura declarada está inflada al doble.
  //
  // Y aquí la colinealidad NO es descuido: un neutro de 2.ª declinación
  // rima SIEMPRE con un adjetivo de 1.ª clase (`-um`/`-um`, `-a`/`-a`,
  // `-ō`/`-ō`…), y sólo los neutros pueden traer la trampa de género
  // porque el español no tiene neutro. Romperla exige un neutro de 3.ª
  // —`magnum opus`, `corpus», `nōmen`— que es exactamente el ejemplo
  // canónico del descriptor. Lo es por esto.
  const cruz = { rr: 0, rn: 0, nr: 0, nn: 0 };
  for (const i of items) {
    const k = (i.ejes.rima ? 'r' : 'n') + (i.ejes.generoEnganya ? 'r' : 'n');
    cruz[k as keyof typeof cruz]++;
  }
  if (items.length > 0 && cruz.rn === 0 && cruz.nr === 0) {
    out.push({ item: '(lote)', clase: 'ejes-colineales',
      detalle: `rima y generoEnganya coinciden en los ${items.length} ítems (rima+trampa ${cruz.rr}, ni-ni ${cruz.nn}): son un eje con dos nombres. Hace falta al menos un neutro que NO rime, o sea de 3.ª declinación` });
  }

  const vistos = new Map<string, string>();
  for (const it of items) {
    const k = `${norm(it.sustantivo.lema)}|${norm(it.adjetivo.lema)}|${it.celda}`;
    const antes = vistos.get(k);
    if (antes) out.push({ item: it.id, clase: 'repetido', detalle: `mismo sustantivo, adjetivo y celda que «${antes}»` });
    else vistos.set(k, it.id);
  }
  for (const a of items) for (const b of items) {
    if (a.id !== b.id && norm(a.marco).replace('___', ' ').includes(norm(b.respuesta))) {
      out.push({ item: a.id, clase: 'pista-regala-la-forma', detalle: `su marco contiene «${b.respuesta}», respuesta de «${b.id}»` });
    }
  }
  return out;
}
