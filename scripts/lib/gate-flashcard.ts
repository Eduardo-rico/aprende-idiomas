// scripts/lib/gate-flashcard.ts
//
// EL GATE DE LA FLASHCARD DE FALSO REGALO, antes del primer ítem y de lote.
//
// Punto: `l11-falsos-regalos` — «la forma se reconoce y el sentido no».
// La tarjeta enfrenta el sentido latino con el de su descendiente español.
//
// ── EL EJE BINARIO, POR CUARTA VEZ ────────────────────────────────────
//
// Si todas las tarjetas son falsos regalos, «desconfía siempre» las
// acierta todas. Y eso además **enseña algo falso**: la mayoría del léxico
// latino sí transfiere, y un alumno que desconfíe de todo lee peor y más
// despacio. Las dos estrategias son complementarias —exactamente una
// acierta en cada tarjeta— así que sus tasas suman 1 y la única mezcla que
// las deja a las dos en el azar es mitad y mitad.
//
// Es la misma identidad de los tres formatos anteriores, en el cuarto eje.
//
// ── LAS DOS COSAS PROPIAS DE ESTE FORMATO ─────────────────────────────
//
// **1. La pregunta del hispanohablante.** Casi todo el material de latín es
// anglosajón y cataloga los falsos amigos del INGLÉS. El propio punto lo
// dice de su ejemplo más citado: «hostis = huésped» es una trampa inglesa
// (host < hospes), y para nosotros «hueste» y «hostil» ya apuntan a
// enemigo. Un falso amigo que sólo lo es en inglés es una tarjeta que
// enseña una dificultad que nuestro alumno no tiene — y la comprobación
// contra fuentes la aprueba igual, porque el sentido latino sí es ése.
// Por eso `porQueUnHispanohablante` es obligatorio y no decorativo: si no
// se puede escribir, la tarjeta no es para este curso.
//
// **2. La frecuencia, contra el corpus y con su ambigüedad.** Una trampa
// que el alumno no se encuentra no merece una tarjeta. Y el número tiene
// que venir de `frecuencias-la.json`, que marca los lemas cuya cuenta NO
// es de una sola palabra: `liber` son 82 «libro» + 42 «libre», y sin
// mácrons nada los separa. Citar 124 sería citar una suma de dos palabras.
import frecuencias from '../../lib/data/languages/la/frecuencias-la.json';
import { revisarCobertura, type Cobertura } from './cobertura';

const LEMAS = frecuencias.lemas as Record<string, { total: number; vulgata: number; ambiguo?: string }>;

// ── EL PISO SE MIDE SOBRE LA LECTURA DEL NIVEL, NO SOBRE EL LATÍN ─────
//
// El experto optimiza por verdad; el curso optimiza por lo que el alumno
// se va a encontrar. Cuando chocan manda lo segundo, porque una trampa que
// no aparece nunca no es una trampa: es una curiosidad.
//
// L1 declara 12.000 palabras de lectura y entra por la VULGATA, que en el
// corpus son 109.198 tokens. Un lema con 10 apariciones ahí sale
// 10 × 12.000 / 109.198 ≈ 1,1 veces en todo lo que el alumno lee en el
// nivel. Por debajo de eso la tarjeta enseña algo que no se va a usar, y
// en L1 hay sesenta plazas.
//
// Lo que este piso tumba, medido: `hostis` (194 en el corpus, CERO en la
// Vulgata: sus apariciones son todas de César y Cicerón), `fortuna` (64 y
// cero), `ingenium` (24 y cero), `sententia` (62 y dos) y `hospes` (19 y
// ocho). De los 1.311 lemas citables, 134 no salen NI UNA VEZ en la
// lectura del nivel.
export const MIN_VULGATA = 10;

export interface ItemFlashcard {
  id: string;
  punto: string;
  /** El lema latino, macronizado como se muestra. */
  lema: string;
  /** Su forma en el corpus, sin mácrons y con i/u por j/v: la clave con
   *  la que se busca la frecuencia. Va aparte porque el corpus no
   *  macroniza y adivinarlo en el gate sería el mismo error que buscar una
   *  cadena y encontrar otra palabra. */
  claveCorpus: string;
  sentidoLatino: string;
  /** La palabra española que se le parece. */
  descendiente: string;
  sentidoDescendiente: string;
  /** Si el sentido se desplazó. La mitad del lote tiene que decir que NO. */
  esFalsoRegalo: boolean;
  desplazamiento?: 'estrechamiento' | 'ampliación' | 'cambio-de-dominio';
  /** Obligatorio en los falsos regalos: por qué cae un HISPANOHABLANTE, no
   *  un anglófono. */
  porQueUnHispanohablante?: string;
  /** Fuente citada por nombre. Sin ella no es un hallazgo, es una opinión. */
  fuente: string;
  /** En qué latín vale la afirmación. `fidēs` no es fe en Cicerón y sí en
   *  la Vulgata, que es la puerta de entrada declarada del curso. */
  corpus: 'clásico' | 'vulgata' | 'verso' | 'todo';
  /** Ocurrencias en los treebanks, contrastadas contra el JSON congelado. */
  frecuencia: number;
}

export type ClaseFalloF =
  | 'frecuencia-no-cuadra' | 'lema-homografo' | 'sin-fuente' | 'sin-corpus'
  | 'falso-regalo-sin-desplazamiento' | 'trampa-no-hispanohablante'
  | 'la-tarjeta-se-contesta-sola' | 'repetido' | 'corpus-que-el-alumno-no-lee'
  | 'no-esta-en-la-lectura-del-nivel'
  | 'estrategia-ciega' | 'cobertura-cero' | 'cobertura-sin-motivo';

export interface FalloF { item: string; clase: ClaseFalloF; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();
export const MIN_FRECUENCIA = 20;
export const TECHO_F = 0.5;

export function revisarFlashcard(item: ItemFlashcard): FalloF[] {
  const out: FalloF[] = [];
  const push = (clase: ClaseFalloF, detalle: string) => out.push({ item: item.id, clase, detalle });

  const f = LEMAS[item.claveCorpus];
  if (!f) {
    push('frecuencia-no-cuadra', `«${item.claveCorpus}» no llega a ${MIN_FRECUENCIA} ocurrencias en 227.301 tokens: una trampa que el alumno no se encuentra no merece tarjeta`);
  } else {
    if (f.total !== item.frecuencia) push('frecuencia-no-cuadra', `declara ${item.frecuencia} y el corpus da ${f.total}`);
    if (f.ambiguo) push('lema-homografo', `${f.ambiguo} — la tarjeta tendría que decir cómo se desambiguó`);
    if (f.vulgata < MIN_VULGATA) {
      push('no-esta-en-la-lectura-del-nivel',
        `«${item.claveCorpus}» sale ${f.total} veces en el corpus pero ${f.vulgata} en la VULGATA, que es la lectura declarada de L1: el alumno no se la va a encontrar (piso ${MIN_VULGATA})`);
    }
  }

  if (!/Lewis|Short|L&S|Allen|Greenough|Gildersleeve|Ernout|OLD|treebank/i.test(item.fuente)) {
    push('sin-fuente', `la fuente «${item.fuente}» no cita ninguna obra por su nombre`);
  }
  if (!item.corpus) push('sin-corpus', 'toda afirmación léxica dice en qué latín vale');
  // Y la regla que ya vale a nivel de punto, aquí a nivel de tarjeta: el
  // alumno de L1 entra por la VULGATA. Una tarjeta cuya afirmación sólo
  // vale en el latín clásico le enseña algo que su propia lectura
  // contradice — es el caso de `fidēs`, que no es fe en Cicerón y sí lo es
  // en Jerónimo. La salida no es quitar la tarjeta: es que diga las dos
  // cosas, que es el contenido de verdad.
  if (item.corpus === 'clásico') {
    push('corpus-que-el-alumno-no-lee',
      'la afirmación sólo vale en el latín clásico, y L1 entra por la Vulgata: la tarjeta tiene que decir qué pasa en los dos');
  }

  if (item.esFalsoRegalo) {
    if (!item.desplazamiento) push('falso-regalo-sin-desplazamiento', 'un falso regalo dice QUÉ le pasó al sentido');
    if (!item.porQueUnHispanohablante || item.porQueUnHispanohablante.trim().length < 25) {
      push('trampa-no-hispanohablante',
        'sin escribir por qué cae un hispanohablante: casi todo el material de latín cataloga los falsos amigos del INGLÉS, y ésos nuestro alumno no los tiene');
    }
    // ── UNA COMPROBACIÓN QUE HUBO QUE ACOTAR, y la razón vale ──
    //
    // La primera versión marcaba cualquier tarjeta cuyo sentido latino
    // CONTUVIERA la palabra española, y sacó dos falsos positivos de doce:
    // «deber DINERO, estar en deuda» y «en la Vulgata sí es la fe
    // religiosa» usan la palabra con precisión, no la regalan.
    //
    // El error de fondo: importé a este formato una comprobación de los
    // cloze, donde hay un HUECO al que se le puede filtrar la respuesta.
    // Una tarjeta no tiene hueco. Lo que sí puede estar roto es que el
    // sentido latino sea SÓLO la palabra española, y entonces la tarjeta
    // no enseña nada — pero eso es una tarjeta falsa, no una filtrada.
    const soloLaPalabra = norm(item.sentidoLatino)
      .replace(/^(el|la|los|las|un|una)\s+/, '').trim();
    if (soloLaPalabra === norm(item.descendiente)) {
      push('la-tarjeta-se-contesta-sola',
        `el sentido latino es sólo «${item.descendiente}»: la tarjeta declara un falso regalo y no enseña ninguna diferencia`);
    }
  }
  return out;
}

export function tasasCiegasF(items: ItemFlashcard[]) {
  const n = items.length || 1;
  return {
    desconfiarSiempre: items.filter((i) => i.esFalsoRegalo).length / n,
    fiarseSiempre: items.filter((i) => !i.esFalsoRegalo).length / n,
  };
}

export function coberturaFlashcard(items: ItemFlashcard[]): Cobertura[] {
  const n = items.length;
  const falsos = items.filter((i) => i.esFalsoRegalo).length;
  return [
    { comprobacion: 'la frecuencia contra el corpus', decididos: n, total: n },
    { comprobacion: 'el piso sobre la lectura del nivel', decididos: n, total: n },
    { comprobacion: 'la fuente citada', decididos: n, total: n },
    { comprobacion: 'la pregunta del hispanohablante', decididos: falsos, total: n,
      motivoDeLosQueQuedanFuera: 'sólo un falso regalo puede tener una trampa que sea inglesa o española' },
    { comprobacion: 'el desplazamiento del sentido', decididos: falsos, total: n,
      motivoDeLosQueQuedanFuera: 'una palabra que transfiere no ha desplazado nada' },
  ];
}

export function revisarLoteF(items: ItemFlashcard[]): FalloF[] {
  const out: FalloF[] = items.flatMap(revisarFlashcard);
  out.push(...revisarCobertura(coberturaFlashcard(items)).map((f) => ({ item: f.item, clase: f.clase as ClaseFalloF, detalle: f.detalle })));

  const t = tasasCiegasF(items);
  for (const [nombre, valor, glosa] of [
    ['desconfiar siempre', t.desconfiarSiempre, 'responder «el sentido cambió» a todo'],
    ['fiarse siempre', t.fiarseSiempre, 'responder «significa lo mismo» a todo'],
  ] as const) {
    if (valor > TECHO_F) {
      out.push({ item: '(lote)', clase: 'estrategia-ciega',
        detalle: `«${nombre}» —${glosa}— acierta el ${(100 * valor).toFixed(0)} %: por encima del ${(100 * TECHO_F).toFixed(0)} % del azar. Y desconfiar de todo además enseña algo falso, porque la mayoría del léxico latino SÍ transfiere` });
    }
  }

  const vistos = new Map<string, string>();
  for (const it of items) {
    const antes = vistos.get(norm(it.lema));
    if (antes) out.push({ item: it.id, clase: 'repetido', detalle: `mismo lema que «${antes}»` });
    else vistos.set(norm(it.lema), it.id);
  }
  return out;
}
