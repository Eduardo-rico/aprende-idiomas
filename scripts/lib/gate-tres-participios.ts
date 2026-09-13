// scripts/lib/gate-tres-participios.ts — TRES PARTICIPIOS, TRES GIROS.
//
// Punto `l8-tres-participios`. «amāns (presente activo), amātus (perfecto
// pasivo), amātūrus (futuro activo). El tiempo es RELATIVO al del verbo
// principal, no absoluto.» `varia`: «el participio y el giro español que le
// toca, **sin usar “que” para los tres**».
//
// ══ EL ERROR DIANA ES BORRAR LA DISTINCIÓN ═══════════════════════════
//
// El `motivo` lo dice: «el español sólo tiene dos participios vivos y
// traduce los tres con “que”». Si el lote glosa los tres con «el que…», el
// alumno no ve tres cosas: ve una, y la respuesta latina se convierte en
// adivinar una terminación. Por eso el `varia` prohíbe explícitamente ese
// atajo y aquí se comprueba: los tres participios tienen que llegar con
// giros españoles de CLASES distintas.
//
// ══ LAS DOS CIEGAS, Y POR QUÉ NO SON LAS DE ANTES ════════════════════
//
// En el gate de la perifrástica medí tres estrategias que no podían fallar
// y tardé en verlo. Aquí las dos que van están comprobadas en su test:
//
//   1. **siempre el mismo participio** — con tres salidas el azar es un
//      tercio, y se mide sobre el lote ENTERO. Medirla «sobre los que no
//      son perfecto» daría cero por construcción, que es el error que ya
//      cometí una vez.
//   2. **sacarlo del infinitivo** — quitarle `-re` al infinitivo y pegarle
//      `-tus`/`-tūrus`. Es exactamente lo que enseña a NO hacer el punto
//      prerrequisito `l5-partes-principales`: el supino no se deriva. Y no
//      es un hombre de paja, porque en la 1.ª conjugación **acierta**
//      (`vocāre` → `vocātus`, que es la forma buena), y ahí está la
//      trampa: una regla que funciona en el primer caso que ve el alumno.
//      Su denominador son los ítems de perfecto y futuro, que son los dos
//      que salen del supino.
//
// ══ LA EXCEPCIÓN QUE NO SE PUEDE EXAMINAR AQUÍ ═══════════════════════
//
// `excepcion`: «los deponentes tienen participio de perfecto con sentido
// ACTIVO (“secūtus” = habiendo seguido)». Medido: de los 30 verbos de L1,
// **cero** son deponentes. La excepción no se puede examinar con este
// material y le toca a `l9-deponentes`. La cobertura lo declara con
// `elCeroEsUnResultado` en vez de callarse.
import porAnalisis from '../../lib/data/languages/la/atestacion-por-analisis.json';
import { todosLosParticipios } from '../../lib/data/languages/la/participios';
import type { EntradaVerbal } from '../../lib/data/languages/la/paradigma-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const TABLA = (porAnalisis as { tabla: Record<string, Record<string, number>> }).tabla;

export type CualParticipio = 'presente' | 'perfecto' | 'futuro';
/** La CLASE del giro español, no el giro. El `varia` prohíbe que los tres
 *  lleguen con el mismo, y lo que hay que contar son las clases. */
export type ClaseDeGiro = 'gerundio' | 'participio' | 'perifrasis' | 'relativa';

const CLAVE: Record<CualParticipio, string> = {
  presente: 'partPres', perfecto: 'partPast', futuro: 'partFut',
};

export interface ItemTresPart {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  cual: CualParticipio;
  /** El participio latino, nominativo masculino singular. */
  respuesta: string;
  /** La frase latina con `___`. */
  marco: string;
  /** La glosa española, que identifica el participio por su giro. */
  glosa: string;
  ejes: { cual: CualParticipio; giro: ClaseDeGiro };
  porQueSinAtestiguar?: string;
}

export type ClaseFalloTresPart =
  | 'respuesta-no-derivable' | 'eje-mal-declarado' | 'sin-atestiguar'
  | 'marco-sin-hueco' | 'marco-regala-la-forma' | 'marco-fuera-de-l1'
  | 'glosa-sin-giro' | 'varia-incompleto'
  | 'cobertura-cero' | 'cobertura-sin-motivo' | 'estrategia-ciega' | 'orden-publicado';

export interface FalloTresPart { item: string; clase: ClaseFalloTresPart; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().trim();

/** SEGUNDO CAMINO: el participio que da la máquina, que no se escribió
 *  para este lote. */
export function participioDeLaMaquina(e: EntradaVerbal, cual: CualParticipio): string | null {
  const p = todosLosParticipios(e);
  return cual === 'presente' ? p.presente.lema : (p[cual]?.lema ?? null);
}

/** CIEGA 2 · el participio sacado del infinitivo, que es lo que enseña a
 *  NO hacer `l5-partes-principales`. Acierta en la 1.ª conjugación. */
export function desdeElInfinitivo(e: EntradaVerbal, cual: CualParticipio): string | null {
  if (cual === 'presente') return null;   // el de presente SÍ sale del infinitivo
  const base = e.infinitivo.normalize('NFC').replace(/re$/, '');
  return cual === 'perfecto' ? `${base}tus` : `${base}tūrus`;
}

export function atestiguadoComo(forma: string, cual: CualParticipio): number {
  return TABLA[forma]?.[CLAVE[cual]] ?? 0;
}

export function revisarItemTresPart(item: ItemTresPart): FalloTresPart[] {
  const out: FalloTresPart[] = [];
  const push = (clase: ClaseFalloTresPart, detalle: string) => out.push({ item: item.id, clase, detalle });

  const dela = participioDeLaMaquina(item.verbo, item.cual);
  if (dela === null) { push('respuesta-no-derivable', `«${item.verbo.lema}» no da participio de ${item.cual}`); return out; }
  if (norm(dela) !== norm(item.respuesta))
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina da «${dela}»`);
  if (item.ejes.cual !== item.cual)
    push('eje-mal-declarado', `el ítem es de ${item.cual} y el eje declara ${item.ejes.cual}`);

  if (atestiguadoComo(item.respuesta, item.cual) === 0 && (item.porQueSinAtestiguar ?? '').trim().length < 20)
    push('sin-atestiguar', `«${item.respuesta}» no aparece como participio de ${item.cual} en el corpus`);

  if (!item.marco.includes('___')) push('marco-sin-hueco', 'el marco latino no tiene hueco `___`');
  if (norm(item.marco.replace('___', '')).includes(norm(item.respuesta)))
    push('marco-regala-la-forma', `el marco contiene «${item.respuesta}»`);
  const d = palabrasDesconocidas(item.marco);
  if (d.length > 0) push('marco-fuera-de-l1', `el marco usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  if (item.glosa.trim().length < 10) push('glosa-sin-giro', 'la glosa no trae el giro español que identifica el participio');
  return out;
}

export function tasasCiegasTresPart(items: ItemTresPart[]) {
  // 1 · siempre el mismo, sobre el lote ENTERO: con tres salidas el azar
  //     es un tercio. Restringirlo a «los que no son X» da cero solo.
  const porCual: Record<string, number> = {};
  for (const i of items) porCual[i.cual] = (porCual[i.cual] ?? 0) + 1;
  const mayoria = Math.max(0, ...Object.values(porCual));
  // 2 · sacarlo del infinitivo, sólo donde el participio sale del supino.
  const dist = items.filter((i) => i.cual !== 'presente');
  const ingenuo = dist.filter((i) => norm(desdeElInfinitivo(i.verbo, i.cual) ?? '') === norm(i.respuesta)).length;
  return {
    siempreElMismo: { tasa: items.length === 0 ? 0 : mayoria / items.length, decididos: items.length, total: items.length },
    desdeElInfinitivo: { tasa: dist.length === 0 ? 0 : ingenuo / dist.length, decididos: dist.length, total: items.length },
  };
}

export function coberturaTresPart(items: ItemTresPart[]): Cobertura[] {
  const n = items.length;
  return [
    { comprobacion: 'la respuesta contra la máquina',
      decididos: items.filter((i) => norm(participioDeLaMaquina(i.verbo, i.cual) ?? ' ') === norm(i.respuesta)).length, total: n },
    { comprobacion: 'la forma aparece en el corpus COMO ESE participio',
      decididos: items.filter((i) => atestiguadoComo(i.respuesta, i.cual) > 0).length, total: n },
    { comprobacion: 'los tres participios', decididos: new Set(items.map((i) => i.cual)).size, total: 3 },
    { comprobacion: 'las clases de giro español', decididos: new Set(items.map((i) => i.ejes.giro)).size, total: 3 },
    { comprobacion: 'el participio de perfecto de un DEPONENTE, que es activo',
      decididos: 0, total: n,
      elCeroEsUnResultado: 'medido en esta sesión: de los 30 verbos de VERBOS_L1, cero son deponentes. El cero no es que el lote no mire, es que el material no tiene el caso',
      motivoDeLosQueQuedanFuera: 'ninguno de los 30 verbos de L1 es deponente, así que la excepción del punto no se puede examinar aquí: le toca a `l9-deponentes`' },
  ];
}

export function revisarLoteTresPart(items: ItemTresPart[]): FalloTresPart[] {
  const out: FalloTresPart[] = items.flatMap(revisarItemTresPart);
  for (const c of revisarCobertura(coberturaTresPart(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  // EL VARIA, LITERAL: «sin usar “que” para los tres».
  const giroDe = new Map<CualParticipio, Set<ClaseDeGiro>>();
  for (const i of items) (giroDe.get(i.cual) ?? giroDe.set(i.cual, new Set()).get(i.cual)!).add(i.ejes.giro);
  const conRelativa = [...giroDe].filter(([, g]) => g.size === 1 && g.has('relativa')).length;
  if (conRelativa === 3)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'los tres participios llegan glosados con una relativa: el varia prohíbe exactamente eso, porque entonces el alumno ve una sola cosa' });
  const cuales = new Set(items.map((i) => i.cual));
  if (cuales.size < 3)
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: `el varia son los tres participios y el lote toca ${cuales.size}: ${[...cuales].join(', ')}` });

  const t = tasasCiegasTresPart(items);
  if (t.siempreElMismo.tasa > 0.45)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«contestar siempre el mismo participio» acierta el ${(100 * t.siempreElMismo.tasa).toFixed(0)} % de los ${t.siempreElMismo.decididos} ítems` });
  if (t.desdeElInfinitivo.decididos > 0 && t.desdeElInfinitivo.tasa > 0.4)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«sacarlo del infinitivo» acierta el ${(100 * t.desdeElInfinitivo.tasa).toFixed(0)} % de los ${t.desdeElInfinitivo.decididos} ítems que salen del supino` });

  for (const c of ['presente', 'perfecto', 'futuro'] as const) {
    const s = separablePorPosicion(patronDe(items, (i) => i.cual === c));
    if (s) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `el participio de ${c} se separa por la posición: ${s}` });
  }
  return out;
}
