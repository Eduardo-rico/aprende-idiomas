// scripts/lib/gate-pasiva-perfectum.ts — «amātus est» NO ES «es amado».
//
// Punto `l6-pasiva-perifrastica`. «El participio concuerda con el sujeto en
// género y número, cosa que el español también hace, pero **`est` aquí no es
// `es` sino `fue`**.» `varia`: «el tiempo del auxiliar (est/erat/erit), que
// corre un tiempo respecto al valor».
//
// ══ POR QUÉ ES `trampa` Y NO `paradigma` ═════════════════════════════
//
// El punto declara `via: recepcion` y `motivo`: «el error diana es leer
// `amātus est` como presente». Eso no es una forma que el alumno no sepa
// construir: es una que sabe leer **mal**, y la sabe leer mal porque el
// español le regala media respuesta —`est` es `es`, y el participio
// concuerda igual que en español—. La forma es de presente y el valor de
// pasado, y no hay ni una marca que lo avise.
//
//     amātus est      fue amado          y NO «es amado»
//     amātus erat     había sido amado   y NO «era amado»
//     amātus erit     habrá sido amado   y NO «será amado»
//
// Cada auxiliar corre un tiempo.
//
// ══ LA PRIMERA VERSIÓN MEDÍA DOS CEROS QUE NO PODÍAN SER OTRA COSA ═══
//
// Medí «leer el auxiliar al pie de la letra» y «poner siempre el masculino
// singular». Las dos dieron 0 % a la primera, y las dos son IMPOSIBLES:
//
//   · la literal produce «es / son / era / eran / será / serán» y las
//     admisibles son «fue / ha sido / había sido / habrá sido». Medido:
//     coinciden en 0 de los 6 auxiliares. El español no tiene una sola
//     casilla donde las dos lecturas se escriban igual.
//   · el masculino singular de un participio acaba en `-us` y las demás
//     casillas en `-a`, `-um`, `-ī`, `-ae`. Nunca coinciden.
//
// Un 0 % que no puede dar otra cosa no es una medición: es un adorno que
// se lee como una garantía. Las dos que van ahora sí pueden fallar, y una
// de ellas acierta más de la mitad del lote.
//
// ══ LAS DOS QUE SÍ PUEDEN FALLAR ═════════════════════════════════════
//
//   1. **siempre el perfecto** — contestar «fue/fueron» sin mirar el
//      auxiliar. Y aquí hay una trampa de denominador que ya me comí una
//      vez en este mismo fichero: medirla «sobre los ítems que no son
//      perfecto» da 0 % SIEMPRE, porque contra un pluscuamperfecto la
//      respuesta en perfecto nunca puede ser la buena. Una estrategia que
//      contesta la DIMENSIÓN EXAMINADA no puede acertar fuera de ella:
//      lo que se mide es la MAYORÍA sobre el lote entero —cuántas veces
//      contestar siempre lo mismo sale bien—, que con tres tiempos tiene
//      el azar en un tercio.
//   2. **copiar el género latino** — darle al participio español el género
//      que tiene en latín. El neutro no existe en español y quien lo copia
//      pone el masculino. `Signum ... factum est` es neutro en latín y «la
//      señal» es femenino en español: quien copia escribe «fue hecho».
//      Ésta es la que de verdad muerde, y es la que obliga a que el lote
//      lleve ítems donde los dos géneros no coinciden.
//
// ══ LA CONCORDANCIA ES UN REGALO, Y HAY QUE EXAMINARLA IGUAL ═════════
//
// El español concuerda el participio en las pasivas perifrásticas («fue
// escrita»), así que la concordancia latina se acierta por herencia. Por
// eso NO puede ser lo único que varíe: la segunda ciega —«poner siempre el
// masculino singular»— sólo es distinguible cuando el sujeto no es
// masculino singular, y su denominador viaja con ella.
//
// ══ LA ATESTACIÓN AQUÍ ES UN BIGRAMA ═════════════════════════════════
//
// `amātus` y `est` por separado están atestiguados siempre y eso no dice
// nada: la construcción es el par. `atestacion-perfectum.json` lo cuenta
// con el RASGO del participio, no con la cadena, porque `facta` es a la vez
// femenino singular y neutro plural. Medido: 1.424 pares en el corpus, 45
// de ellos con participio de un verbo de L1.
import atestacion from '../../lib/data/languages/la/atestacion-perfectum.json';
import { participioPerfecto } from '../../lib/data/languages/la/participios';
import { declinarAdjetivo, type EntradaVerbal } from '../../lib/data/languages/la/paradigma-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

const TABLA = (atestacion as {
  tabla: Record<string, { participio: string; auxiliar: string; n: number; genero: string; numero: string; deL1: boolean }>;
}).tabla;

export type Auxiliar = 'est' | 'sunt' | 'erat' | 'erant' | 'erit' | 'erunt';
export type TiempoDelValor = 'perfecto' | 'pluscuamperfecto' | 'futuro-perfecto';
export type Genero = 'm' | 'f' | 'n';
export type Numero = 'sg' | 'pl';

/** El tiempo que el auxiliar le impone al CONJUNTO, que no es el suyo. */
export const VALOR_DEL_AUXILIAR: Record<Auxiliar, { tiempo: TiempoDelValor; numero: Numero }> = {
  est: { tiempo: 'perfecto', numero: 'sg' },
  sunt: { tiempo: 'perfecto', numero: 'pl' },
  erat: { tiempo: 'pluscuamperfecto', numero: 'sg' },
  erant: { tiempo: 'pluscuamperfecto', numero: 'pl' },
  erit: { tiempo: 'futuro-perfecto', numero: 'sg' },
  erunt: { tiempo: 'futuro-perfecto', numero: 'pl' },
};

/** El auxiliar leído AL PIE DE LA LETRA, que es el error diana del punto.
 *  Se guarda porque es lo que hay que enseñar a NO hacer —y es el
 *  distractor natural—, pero NO se mide: ver arriba por qué. */
export const LECTURA_LITERAL: Record<Auxiliar, string> = {
  est: 'es', sunt: 'son', erat: 'era', erant: 'eran', erit: 'será', erunt: 'serán',
};

/** El auxiliar español que de verdad toca. */
export const AUXILIAR_ESPANOL: Record<TiempoDelValor, Record<Numero, string[]>> = {
  perfecto: { sg: ['fue', 'ha sido'], pl: ['fueron', 'han sido'] },
  pluscuamperfecto: { sg: ['había sido'], pl: ['habían sido'] },
  'futuro-perfecto': { sg: ['habrá sido'], pl: ['habrán sido'] },
};

export interface ItemPerfectum {
  id: string;
  punto: string;
  verbo: EntradaVerbal;
  auxiliar: Auxiliar;
  /** El participio concertado, tal y como sale en la frase latina. */
  participio: string;
  /** La frase latina entera. */
  latin: string;
  /** La glosa española con `___` donde va el giro verbal. */
  glosa: string;
  /** El giro verbal español: «fue hecho», «había sido dicho»… */
  respuesta: string;
  /** `genero` y `numero` son los del LATÍN; `generoEspanol` el del sujeto
   *  de la glosa, que es el que manda en la respuesta y no siempre es el
   *  mismo. Ahí vive la estrategia ciega que muerde. */
  ejes: { genero: Genero; numero: Numero; tiempo: TiempoDelValor; generoEspanol: 'm' | 'f' };
  porQueSinAtestiguar?: string;
}

export type ClaseFalloPerfectum =
  | 'participio-no-derivable' | 'concordancia-mal' | 'auxiliar-no-concuerda'
  | 'valor-mal' | 'par-sin-atestiguar' | 'glosa-regala-la-respuesta'
  | 'glosa-sin-hueco' | 'latin-fuera-de-l1' | 'genero-espanol-mal-declarado'
  | 'cobertura-cero' | 'cobertura-sin-motivo' | 'estrategia-ciega' | 'orden-publicado';

export interface FalloPerfectum { item: string; clase: ClaseFalloPerfectum; detalle: string }

const norm = (s: string) => s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().trim();
const sinMacron = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC').toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');

/** SEGUNDO CAMINO: el participio concertado, sacado de la máquina de
 *  participios y declinado por la de adjetivos. Ninguna de las dos se
 *  escribió para este lote. */
export function participioConcertado(e: EntradaVerbal, g: Genero, n: Numero): string | null {
  const p = participioPerfecto(e);
  if (!p) return null;
  const raiz = p.lema.normalize('NFC').slice(0, -2);
  return declinarAdjetivo({ lema: p.lema, tema: raiz, glosa: p.glosa }, g, 'nom', n);
}

/** El género del participio ESPAÑOL, leído de su terminación. */
export function generoDeLaRespuesta(respuesta: string): 'm' | 'f' | null {
  const w = norm(respuesta.split(/\s+/).slice(-1)[0] ?? '');
  if (/as?$/.test(w)) return 'f';
  if (/os?$/.test(w)) return 'm';
  return null;
}

/** CIEGA 1 · contestar siempre con el perfecto, sin mirar el auxiliar.
 *  Sólo se distingue donde el auxiliar no es `est`/`sunt`. */
export function siemprePerfecto(item: ItemPerfectum): string {
  const participio = item.respuesta.split(/\s+/).slice(-1)[0] ?? '';
  return `${AUXILIAR_ESPANOL.perfecto[item.ejes.numero][0]} ${participio}`;
}

/** CIEGA 2 · darle al participio español el género del latino. El neutro
 *  no existe en español y quien lo copia pone el masculino. */
export const GENERO_COPIADO: Record<Genero, 'm' | 'f'> = { m: 'm', f: 'f', n: 'm' };
export function copiarElGeneroLatino(item: ItemPerfectum): 'm' | 'f' {
  return GENERO_COPIADO[item.ejes.genero];
}

export function parAtestiguado(participio: string, auxiliar: string): number {
  return TABLA[`${sinMacron(participio)} ${sinMacron(auxiliar)}`]?.n ?? 0;
}

export function revisarItemPerfectum(item: ItemPerfectum): FalloPerfectum[] {
  const out: FalloPerfectum[] = [];
  const push = (clase: ClaseFalloPerfectum, detalle: string) => out.push({ item: item.id, clase, detalle });

  const dela = participioConcertado(item.verbo, item.ejes.genero, item.ejes.numero);
  if (dela === null) { push('participio-no-derivable', `«${item.verbo.lema}» no declara supino: la máquina no da participio de perfecto`); return out; }
  if (norm(dela) !== norm(item.participio))
    push('concordancia-mal', `el ítem pone «${item.participio}» y la máquina da «${dela}» para ${item.ejes.genero}.${item.ejes.numero}`);

  const v = VALOR_DEL_AUXILIAR[item.auxiliar];
  if (v.numero !== item.ejes.numero)
    push('auxiliar-no-concuerda', `«${item.auxiliar}» es ${v.numero} y el sujeto se declara ${item.ejes.numero}`);
  if (v.tiempo !== item.ejes.tiempo)
    push('valor-mal', `«${item.auxiliar}» da ${v.tiempo} y el ítem declara ${item.ejes.tiempo}`);

  const admisibles = AUXILIAR_ESPANOL[v.tiempo][v.numero];
  if (!admisibles.some((a) => norm(item.respuesta).startsWith(norm(a))))
    push('valor-mal', `«${item.respuesta}» no empieza por ninguno de los giros que impone «${item.auxiliar}»: ${admisibles.join(' / ')}`);

  // El género declarado para el español tiene que ser el de la respuesta.
  const g = generoDeLaRespuesta(item.respuesta);
  if (g === null)
    push('genero-espanol-mal-declarado', `no se puede leer el género de «${item.respuesta}»: el participio español no acaba en -o/-a`);
  else if (g !== item.ejes.generoEspanol)
    push('genero-espanol-mal-declarado', `declara ${item.ejes.generoEspanol} y «${item.respuesta}» es ${g}`);

  if (parAtestiguado(item.participio, item.auxiliar) === 0 && (item.porQueSinAtestiguar ?? '').trim().length < 20)
    push('par-sin-atestiguar', `«${item.participio} ${item.auxiliar}» no aparece ni una vez en los 1.424 pares del corpus`);

  if (!item.glosa.includes('___')) push('glosa-sin-hueco', 'la glosa española no tiene hueco `___`');
  if (norm(item.glosa).includes(norm(item.respuesta))) push('glosa-regala-la-respuesta', `la glosa contiene «${item.respuesta}»`);
  const d = palabrasDesconocidas(item.latin);
  if (d.length > 0) push('latin-fuera-de-l1', `la frase usa palabras que la máquina de L1 no produce: ${d.join(', ')}`);
  if (!item.latin.includes(item.participio)) push('participio-no-derivable', `la frase latina no contiene «${item.participio}»`);
  if (!item.latin.includes(item.auxiliar)) push('auxiliar-no-concuerda', `la frase latina no contiene «${item.auxiliar}»`);

  return out;
}

export function tasasCiegasPerfectum(items: ItemPerfectum[]) {
  // Sobre el lote ENTERO: cuántas veces sale bien contestar siempre en
  // perfecto. Restringirlo a los que no son perfecto da 0 % por
  // construcción y no mide nada.
  const perf = items.filter((i) => norm(siemprePerfecto(i)) === norm(i.respuesta)).length;
  // Copiar el género se puede hacer siempre: produce una respuesta en cada
  // ítem, y en algunos es la correcta.
  const gen = items.filter((i) => copiarElGeneroLatino(i) === i.ejes.generoEspanol).length;
  return {
    siemprePerfecto: { tasa: items.length === 0 ? 0 : perf / items.length, decididos: items.length, total: items.length },
    copiarElGeneroLatino: { tasa: items.length === 0 ? 0 : gen / items.length, decididos: items.length, total: items.length },
  };
}

export function coberturaPerfectum(items: ItemPerfectum[]): Cobertura[] {
  const n = items.length;
  return [
    { comprobacion: 'el participio contra la máquina',
      decididos: items.filter((i) => norm(participioConcertado(i.verbo, i.ejes.genero, i.ejes.numero) ?? ' ') === norm(i.participio)).length, total: n },
    { comprobacion: 'el par aparece en el corpus',
      decididos: items.filter((i) => parAtestiguado(i.participio, i.auxiliar) > 0).length, total: n },
    { comprobacion: 'los tres tiempos del auxiliar', decididos: new Set(items.map((i) => i.ejes.tiempo)).size, total: 3,
      // SIN `motivoDeLosQueQuedanFuera`: ese campo EXCUSA a los que faltan,
      // y lo que había escrito aquí era «los tres tienen que estar», que no
      // es una excusa sino lo contrario. Escribirlo apagaba justo la
      // comprobación que lo exige: un lote de un solo tiempo pasaba.
      },
    { comprobacion: 'los tres géneros', decididos: new Set(items.map((i) => i.ejes.genero)).size, total: 3 },
    { comprobacion: 'los dos números', decididos: new Set(items.map((i) => i.ejes.numero)).size, total: 2 },
    // La que de verdad examina algo: el formato es RECEPTIVO y la glosa
    // española ya lleva el sujeto, así que la concordancia latina no se
    // produce, se lee. Lo único que el alumno puede equivocar es copiar el
    // género del latín al español, y eso sólo se ve donde no coinciden.
    { comprobacion: 'el género español NO coincide con el latino',
      decididos: items.filter((i) => copiarElGeneroLatino(i) !== i.ejes.generoEspanol).length, total: n,
      motivoDeLosQueQuedanFuera: 'donde los dos géneros coinciden, copiar el latino acierta y el ítem no distingue: esos ítems varían el latín pero no examinan este eje' },
  ];
}

export function revisarLotePerfectum(items: ItemPerfectum[]): FalloPerfectum[] {
  const out: FalloPerfectum[] = items.flatMap(revisarItemPerfectum);
  for (const c of revisarCobertura(coberturaPerfectum(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  const t = tasasCiegasPerfectum(items);
  // Listones ABSOLUTOS, no contra una cifra medida: con dos salidas, el
  // azar es 0,5 y se deja un margen para no exigir el equilibrio exacto.
  // Con tres tiempos el azar es un tercio; se deja margen hasta la mitad.
  if (t.siemprePerfecto.tasa > 0.5)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«contestar siempre en perfecto» acierta el ${(100 * t.siemprePerfecto.tasa).toFixed(0)} % de los ${t.siemprePerfecto.decididos} ítems del lote` });
  if (t.copiarElGeneroLatino.tasa > 0.6)
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `«copiar el género latino» acierta el ${(100 * t.copiarElGeneroLatino.tasa).toFixed(0)} % de los ${t.copiarElGeneroLatino.decididos} ítems: el lote no obliga a mirar el sujeto español` });

  // Si el lote saca primero todos los `est` y luego todos los `erat`, el
  // alumno acierta el tiempo por la posición sin mirar el latín.
  for (const t of ['perfecto', 'pluscuamperfecto', 'futuro-perfecto'] as const) {
    const at = separablePorPosicion(patronDe(items, (i) => i.ejes.tiempo === t));
    if (at) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `el ${t} se separa por la posición: ${at}` });
  }
  const ag = separablePorPosicion(patronDe(items, (i) => i.ejes.genero === 'm'));
  if (ag) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `el género se separa por la posición: ${ag}` });
  return out;
}
