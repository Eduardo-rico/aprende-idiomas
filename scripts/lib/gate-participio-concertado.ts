// scripts/lib/gate-participio-concertado.ts — CON QUÉ CONCUERDA.
//
// Punto `l8-participio-concertado`. «`mīlitēs victī fūgērunt`. Concuerda con
// un elemento de la oración y equivale a una relativa o a una
// circunstancial.» `varia`: «con qué elemento concuerda el participio
// (sujeto, objeto, un ablativo)». `clase: sin-equivalente`, `via: produccion`.
//
// ══ LA DIFICULTAD ES DE PRODUCCIÓN, Y ESO FIJA EL FORMATO ════════════
//
// El `motivo` lo dice: «el español lo tiene pero mucho menos: la dificultad
// es de PRODUCCIÓN, no de lectura». Un hispanohablante entiende «los
// soldados vencidos huyeron» sin pestañear y no lo escribe nunca. Así que el
// ítem da la frase latina con el hueco y la glosa española con el giro, y lo
// que se pide es la forma CONCERTADA: el caso, el género y el número salen
// del elemento con el que concuerda, no del participio.
//
// ══ LA CIEGA ES LA MAYORÍA, Y AQUÍ NO PODÍA SER OTRA COSA ════════════
//
// «Concordar siempre con el sujeto» es el error natural —el sujeto es lo
// primero que se busca— y sólo puede medirse como MAYORÍA sobre el lote
// entero. Restringirla a «los ítems que no concuerdan con el sujeto» daría
// 0 % por construcción, porque ahí la forma del sujeto nunca es la buena:
// es el mismo pozo en el que caí en `gate-pasiva-perfectum`. Con tres
// destinos el azar es un tercio.
//
// ══ EL GÉNERO NO SIEMPRE SE PUEDE EXAMINAR, Y VA MEDIDO ══════════════
//
// El participio de presente es un adjetivo de UNA terminación: `dīcentem`
// es masculino y femenino a la vez. Un ítem que concuerde con un femenino
// ahí no examina el género —la respuesta es la misma que con un masculino—
// y contarlo como si lo examinara infla la cobertura. La comprobación
// «el género se distingue» sólo decide sobre los ítems donde las dos formas
// se escriben distinto, y lleva su denominador.
import porAnalisis from '../../lib/data/languages/la/atestacion-por-analisis.json';
import { participioPresente, participioPerfecto } from '../../lib/data/languages/la/participios';
import { declinarAdjetivo3a } from '../../lib/data/languages/la/adjetivos-3a';
import { declinarAdjetivo, type Caso, type EntradaVerbal, type Numero } from '../../lib/data/languages/la/paradigma-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const TABLA = (porAnalisis as { tabla: Record<string, Record<string, number>> }).tabla;

export type CualPart = 'presente' | 'perfecto';
export type Destino = 'sujeto' | 'objeto' | 'ablativo';
export type GeneroAdj = 'm' | 'f' | 'n';

/** El caso que le toca a cada destino. Un ítem que diga «concuerda con el
 *  objeto» y declare nominativo no está midiendo lo que dice. */
export const CASO_DEL_DESTINO: Record<Destino, Caso> = { sujeto: 'nom', objeto: 'ac', ablativo: 'abl' };

export interface ItemConcertado {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  cual: CualPart;
  concuerdaCon: Destino;
  /** El elemento con el que concuerda, tal y como sale en la frase. */
  elemento: { forma: string; genero: GeneroAdj; numero: Numero };
  /** El participio concertado, que es la respuesta. */
  respuesta: string;
  marco: string;
  glosa: string;
  ejes: { concuerdaCon: Destino; cual: CualPart };
  porQueSinAtestiguar?: string;
}

export type ClaseFalloConcertado =
  | 'respuesta-no-derivable' | 'eje-mal-declarado' | 'sin-atestiguar'
  | 'elemento-no-esta-en-el-marco' | 'marco-sin-hueco' | 'marco-regala-la-forma'
  | 'marco-fuera-de-l1' | 'glosa-sin-giro' | 'varia-incompleto'
  | 'cobertura-cero' | 'cobertura-sin-motivo' | 'estrategia-ciega' | 'orden-publicado';

export interface FalloConcertado { item: string; clase: ClaseFalloConcertado; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().trim();

/** SEGUNDO CAMINO: dos declinadores que no se escribieron para este lote —el
 *  de la 3.ª para el participio de presente y el de 1.ª/2.ª para el de
 *  perfecto—. */
export function concertar(e: EntradaVerbal, cual: CualPart, g: GeneroAdj, caso: Caso, num: Numero): string | null {
  if (cual === 'presente') return declinarAdjetivo3a(participioPresente(e), g, caso, num);
  const p = participioPerfecto(e);
  if (!p) return null;
  return declinarAdjetivo({ lema: p.lema, tema: p.lema.normalize('NFC').slice(0, -2), glosa: p.glosa }, g, caso, num);
}

/** CIEGA · concordar siempre con el sujeto: nominativo, con el género y el
 *  número del sujeto de la frase. */
export function comoSiFueraElSujeto(i: ItemConcertado): string | null {
  return concertar(i.verbo, i.cual, i.elemento.genero, 'nom', i.elemento.numero);
}

/** ¿Se puede distinguir el género en esta casilla? En el participio de
 *  presente, masculino y femenino se escriben igual. */
export function elGeneroSeDistingue(i: ItemConcertado): boolean {
  const caso = CASO_DEL_DESTINO[i.concuerdaCon];
  const m = concertar(i.verbo, i.cual, 'm', caso, i.elemento.numero);
  const f = concertar(i.verbo, i.cual, 'f', caso, i.elemento.numero);
  return m !== null && f !== null && norm(m) !== norm(f);
}

export function atestiguadoComo(forma: string, cual: CualPart): number {
  return TABLA[forma]?.[cual === 'presente' ? 'partPres' : 'partPast'] ?? 0;
}

export function revisarItemConcertado(item: ItemConcertado): FalloConcertado[] {
  const out: FalloConcertado[] = [];
  const push = (clase: ClaseFalloConcertado, detalle: string) => out.push({ item: item.id, clase, detalle });

  const caso = CASO_DEL_DESTINO[item.concuerdaCon];
  const dela = concertar(item.verbo, item.cual, item.elemento.genero, caso, item.elemento.numero);
  if (dela === null) { push('respuesta-no-derivable', `«${item.verbo.lema}» no da participio de ${item.cual}`); return out; }
  if (norm(dela) !== norm(item.respuesta))
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${dela}» para ${item.elemento.genero}.${item.elemento.numero}.${caso}`);
  if (item.ejes.concuerdaCon !== item.concuerdaCon || item.ejes.cual !== item.cual)
    push('eje-mal-declarado', `los ejes dicen ${item.ejes.concuerdaCon}/${item.ejes.cual} y el ítem es ${item.concuerdaCon}/${item.cual}`);

  if (atestiguadoComo(item.respuesta, item.cual) === 0 && (item.porQueSinAtestiguar ?? '').trim().length < 20)
    push('sin-atestiguar', `«${item.respuesta}» no aparece como participio de ${item.cual} en el corpus`);

  // El elemento con el que concuerda tiene que ESTAR en la frase: si no, el
  // alumno no tiene de dónde sacar el caso.
  if (!item.marco.includes(item.elemento.forma))
    push('elemento-no-esta-en-el-marco', `el marco no contiene «${item.elemento.forma}», que es con lo que concuerda`);

  if (!item.marco.includes('___')) push('marco-sin-hueco', 'el marco latino no tiene hueco `___`');
  if (norm(item.marco.replace('___', '')).includes(norm(item.respuesta)))
    push('marco-regala-la-forma', `el marco contiene «${item.respuesta}»`);
  const d = palabrasDesconocidas(item.marco);
  if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  if (item.glosa.trim().length < 10) push('glosa-sin-giro', 'la glosa no trae el giro español');
  return out;
}

export function tasasCiegasConcertado(items: ItemConcertado[]) {
  const acierta = items.filter((i) => norm(comoSiFueraElSujeto(i) ?? '') === norm(i.respuesta)).length;
  return {
    comoSiFueraElSujeto: { tasa: items.length === 0 ? 0 : acierta / items.length, decididos: items.length, total: items.length },
  };
}

export function coberturaConcertado(items: ItemConcertado[]): Cobertura[] {
  const n = items.length;
  const distinguen = items.filter(elGeneroSeDistingue).length;
  return [
    { comprobacion: 'la respuesta contra la máquina',
      decididos: items.filter((i) => norm(concertar(i.verbo, i.cual, i.elemento.genero, CASO_DEL_DESTINO[i.concuerdaCon], i.elemento.numero) ?? ' ') === norm(i.respuesta)).length, total: n },
    { comprobacion: 'la forma aparece en el corpus COMO ESE participio',
      decididos: items.filter((i) => atestiguadoComo(i.respuesta, i.cual) > 0).length, total: n },
    { comprobacion: 'los tres destinos de la concordancia', decididos: new Set(items.map((i) => i.concuerdaCon)).size, total: 3 },
    { comprobacion: 'los dos participios', decididos: new Set(items.map((i) => i.cual)).size, total: 2 },
    { comprobacion: 'el género de la concordancia se puede DISTINGUIR', decididos: distinguen, total: n,
      motivoDeLosQueQuedanFuera: 'el participio de presente es de una terminación y escribe igual el masculino y el femenino (`dīcentem`): en esos ítems el género no se examina, se acompaña' },
  ];
}

export function revisarLoteConcertado(items: ItemConcertado[]): FalloConcertado[] {
  const out: FalloConcertado[] = items.flatMap(revisarItemConcertado);
  for (const c of revisarCobertura(coberturaConcertado(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  const destinos = new Set(items.map((i) => i.concuerdaCon));
  if (destinos.size < 3)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: `el varia es con qué elemento concuerda y el lote toca ${destinos.size} de 3: ${[...destinos].join(', ')}` });

  const t = tasasCiegasConcertado(items);
  if (t.comoSiFueraElSujeto.tasa > 0.5)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«concordar siempre con el sujeto» acierta el ${(100 * t.comoSiFueraElSujeto.tasa).toFixed(0)} % de los ${t.comoSiFueraElSujeto.decididos} ítems` });

  for (const d of ['sujeto', 'objeto', 'ablativo'] as const) {
    const s = separablePorPosicion(patronDe(items, (i) => i.concuerdaCon === d));
    if (s) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `la concordancia con el ${d} se separa por la posición: ${s}` });
  }
  return out;
}
