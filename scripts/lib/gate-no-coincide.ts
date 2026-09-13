// scripts/lib/gate-no-coincide.ts — EL INSTINTO ROMANCE COMO ESTORBO.
//
// Punto `l7-no-coincide-espanol`. «Aparece donde el español pone indicativo
// (cum histórico, interrogativa indirecta, consecutiva) y **falta donde el
// español lo pone**. El instinto romance es aquí un estorbo, no una ayuda.»
// `motivo`: «es el punto que desmonta la ayuda que el alumno cree tener:
// sabe qué es un subjuntivo y por eso mismo lo aplica mal». `varia`: «la
// construcción, y hay que traer **tanto los casos donde el latín lo pone y
// el español no como los inversos**».
//
// ══ LA TRAMPA DE DISEÑO QUE ESTE PUNTO TIENE DENTRO ══════════════════
//
// Si los catorce ítems fueran desajustes, «invertir el modo» los acertaría
// TODOS. El lote instalaría una regla nueva y falsa —«en latín siempre al
// revés»— en lugar de la que quita. Es el gotcha de «un gate por ítem crea
// una constante», aplicado al diseño del lote en vez de al gate.
//
// Con dos modos, «copiar» e «invertir» son complementarias y sus tasas
// suman uno: la única manera de que ninguna gane es que **la mitad de los
// ítems coincidan y la mitad no**. Siete y siete. Y las coincidencias no
// son relleno: la final (`ut videat` = «para que vea») y la completiva
// (`rogat ut audiant` = «pide que oigan») son subjuntivo en las dos lenguas,
// y son los dos puntos que el alumno acaba de estudiar.
//
// Lo que el lote enseña, entonces, no es «al revés» sino **que el instinto
// no decide y la construcción sí**.
//
// ══ LAS DOS DIRECCIONES, MEDIDAS ═════════════════════════════════════
//
// `cum` como conjunción en el corpus: 731 con subjuntivo —405 pluscuamperfecto
// y 283 imperfecto, que es el `cum` histórico— y 235 con indicativo, **119
// de ellos en FUTURO**. Ese futuro es exactamente el «cuando venga» español,
// que es subjuntivo en español e indicativo en latín.
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

export type Modo = 'indicativo' | 'subjuntivo';
export type Construccion =
  | 'cum-historico' | 'interrogativa-indirecta' | 'consecutiva'
  | 'cum-futuro' | 'relativo-futuro'
  | 'final' | 'completiva' | 'relativo-presente' | 'cum-presente';

export interface ItemNoCoincide {
  id: string;
  punto: string;
  construccion: Construccion;
  modoLatino: Modo;
  modoEspanol: Modo;
  /** La forma latina subordinada, que es la que lleva el modo. */
  formaSubordinada: string;
  latin: string;
  /** La glosa española con `___`. */
  glosa: string;
  respuesta: string;
  /** Lo que sale de copiar el modo latino. Sólo en los que NO coinciden:
   *  en los que coinciden sería la respuesta, y declararlo sería declarar
   *  que el ítem no examina nada. */
  elErrorDiana?: string;
  ejes: { construccion: Construccion; coinciden: boolean };
}

export type ClaseFalloNoCoincide =
  | 'modo-latino-mal' | 'eje-mal-declarado' | 'forma-no-esta-en-la-frase'
  | 'error-diana-donde-coinciden' | 'error-diana-igual-a-la-respuesta'
  | 'error-diana-que-falta' | 'glosa-sin-hueco' | 'glosa-regala-la-respuesta'
  | 'latin-fuera-de-l1' | 'varia-incompleto'
  | 'cobertura-cero' | 'cobertura-sin-motivo' | 'estrategia-ciega' | 'orden-publicado';

export interface FalloNoCoincide { item: string; clase: ClaseFalloNoCoincide; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').normalize('NFC').toLowerCase().trim();

/** CIEGA · copiar el modo latino al español. Su complementaria —invertirlo—
 *  tiene por fuerza la tasa contraria, y por eso el listón es el equilibrio
 *  y no un techo: las dos tienen que quedarse cerca de la mitad. */
export function copiarElModo(item: ItemNoCoincide): Modo {
  return item.modoLatino;
}

export function revisarItemNoCoincide(item: ItemNoCoincide, esSubjuntivo: (f: string) => boolean): FalloNoCoincide[] {
  const out: FalloNoCoincide[] = [];
  const push = (clase: ClaseFalloNoCoincide, detalle: string) => out.push({ item: item.id, clase, detalle });

  const palabras = norm(item.latin).replace(/[.,?]/g, '').split(/\s+/);
  if (!palabras.includes(norm(item.formaSubordinada)))
    push('forma-no-esta-en-la-frase', `declara «${item.formaSubordinada}» y la frase no la lleva`);
  // EL MODO LATINO CONTRA EL ENUMERADOR DEL DOMINIO, que no sabe de
  // construcciones: si la forma está en la tabla de subjuntivos, es
  // subjuntivo, y si no lo está, no lo es.
  else {
    const esSub = esSubjuntivo(norm(item.formaSubordinada));
    if (esSub !== (item.modoLatino === 'subjuntivo'))
      push('modo-latino-mal', `declara ${item.modoLatino} y «${item.formaSubordinada}» ${esSub ? 'SÍ' : 'NO'} está en la tabla de subjuntivos`);
  }

  const coinciden = item.modoLatino === item.modoEspanol;
  if (item.ejes.coinciden !== coinciden)
    push('eje-mal-declarado', `el eje dice coinciden=${item.ejes.coinciden} y los modos ${coinciden ? 'coinciden' : 'no coinciden'}`);

  if (coinciden && item.elErrorDiana !== undefined)
    push('error-diana-donde-coinciden', 'declara un error diana en un ítem donde los dos modos coinciden: ahí copiar el modo ES la respuesta');
  if (!coinciden && item.elErrorDiana === undefined)
    push('error-diana-que-falta', 'no coinciden y no declara el error diana: es lo único que hace comprobable la trampa');
  if (item.elErrorDiana !== undefined && norm(item.elErrorDiana) === norm(item.respuesta))
    push('error-diana-igual-a-la-respuesta', `«${item.respuesta}» y el error diana son la misma forma`);

  if (!item.glosa.includes('___')) push('glosa-sin-hueco', 'la glosa española no tiene hueco `___`');
  if (norm(item.glosa).includes(norm(item.respuesta))) push('glosa-regala-la-respuesta', `la glosa contiene «${item.respuesta}»`);
  const d = palabrasDesconocidas(item.latin);
  if (d.length > 0) push('latin-fuera-de-l1', `la frase usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  return out;
}

export function tasasCiegasNoCoincide(items: ItemNoCoincide[]) {
  const copia = items.filter((i) => copiarElModo(i) === i.modoEspanol).length;
  return {
    copiarElModo: { tasa: items.length === 0 ? 0 : copia / items.length, decididos: items.length, total: items.length },
    invertirElModo: { tasa: items.length === 0 ? 0 : (items.length - copia) / items.length, decididos: items.length, total: items.length },
  };
}

export function coberturaNoCoincide(items: ItemNoCoincide[]): Cobertura[] {
  const n = items.length;
  const laPone = items.filter((i) => i.modoLatino === 'subjuntivo' && i.modoEspanol === 'indicativo');
  const laQuita = items.filter((i) => i.modoLatino === 'indicativo' && i.modoEspanol === 'subjuntivo');
  return [
    { comprobacion: 'el latín lo pone y el español no', decididos: laPone.length, total: n,
      motivoDeLosQueQuedanFuera: 'el varia pide las dos direcciones y las coincidencias; ésta es una de las tres' },
    { comprobacion: 'el latín lo quita y el español lo pone', decididos: laQuita.length, total: n,
      motivoDeLosQueQuedanFuera: 'la dirección inversa, que el varia exige explícitamente y que suele faltar en el material de manual' },
    { comprobacion: 'los ítems donde los dos modos COINCIDEN', decididos: items.filter((i) => i.modoLatino === i.modoEspanol).length, total: n,
      motivoDeLosQueQuedanFuera: 'sin ellos «invertir el modo» acierta el lote entero y se instala una regla nueva y falsa; con dos modos, copiar e invertir son complementarias' },
    { comprobacion: 'las construcciones distintas', decididos: new Set(items.map((i) => i.construccion)).size, total: 9,
      motivoDeLosQueQuedanFuera: 'las nueve son las que L1 produce; `antequam`, `dum` y `quīn` no están en el léxico' },
  ];
}

export function revisarLoteNoCoincide(items: ItemNoCoincide[], esSubjuntivo: (f: string) => boolean): FalloNoCoincide[] {
  const out: FalloNoCoincide[] = items.flatMap((i) => revisarItemNoCoincide(i, esSubjuntivo));
  for (const c of revisarCobertura(coberturaNoCoincide(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  const laPone = items.some((i) => i.modoLatino === 'subjuntivo' && i.modoEspanol === 'indicativo');
  const laQuita = items.some((i) => i.modoLatino === 'indicativo' && i.modoEspanol === 'subjuntivo');
  if (!laPone || !laQuita)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: `el varia exige las dos direcciones y falta ${!laPone ? 'la de «el latín lo pone y el español no»' : 'la inversa, «el latín lo quita y el español lo pone»'}` });

  const t = tasasCiegasNoCoincide(items);
  // Las dos son complementarias: el listón es el equilibrio por los dos
  // lados, no un techo por uno solo.
  for (const [nombre, tasa] of [['copiar el modo latino', t.copiarElModo.tasa], ['invertirlo', t.invertirElModo.tasa]] as const)
    if (tasa > 0.6)
      out.push({ item: '(lote)', clase: 'estrategia-ciega',
        detalle: `«${nombre}» acierta el ${(100 * tasa).toFixed(0)} % de los ${items.length} ítems: el lote instala una regla en vez de quitarla` });

  const p = separablePorPosicion(patronDe(items, (i) => i.modoLatino === i.modoEspanol));
  if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `la coincidencia se separa por la posición: ${p}` });
  return out;
}
