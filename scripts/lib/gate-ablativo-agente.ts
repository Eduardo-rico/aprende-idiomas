// scripts/lib/gate-ablativo-agente.ts — `ā Caesare` FRENTE A `gladiō`.
//
// Punto `l3-ablativo-agente`. `descripcion`: «"ā Caesare" (por César,
// animado, con preposición) frente a "gladiō" (con la espada, inanimado,
// sin preposición). La regla es del latín y no tiene análogo español».
// `motivo`: «el error es de PRODUCCIÓN y de sobreaplicación en las dos
// direcciones: poner "ā" con instrumento o quitarla con agente. Se corrige
// desde la frase mala». `varia`: «si el ablativo es animado o inanimado, y
// hay que traer los dos errores». `excepcion`: «con cosas personificadas y
// con el ablativo de causa eficiente ("ā nātūrā") la preposición
// reaparece: la regla no es absoluta».
//
// ══ EL SEGUNDO CAMINO ES EL TREEBANK, Y NO PODÍA SER OTRO ════════════
//
// La afirmación del punto es sobre la LENGUA, no sobre una forma: ninguna
// máquina de este proyecto sabe si `dominō` lleva preposición. El sello
// `atestacion-agente.json` cuenta, por lema, los ablativos de verbo pasivo
// con `ā/ab` y sin preposición — anotación que no escribió nadie de aquí.
//
// El gate NO se cree la animacidad declarada: la contrasta.
//
//     animado    ⇒ el lema tiene CON > 0 y SIN = 0 en el corpus
//     inanimado  ⇒ el lema tiene SIN > 0 y CON = 0
//     excepción  ⇒ el lema tiene LAS DOS cosas
//
// Con eso, un ítem que marque agramatical algo que el corpus atestigua se
// pone rojo solo (§F1: la presencia prueba, la ausencia no prohíbe).
//
// ══ LA EXCEPCIÓN NO ES UNA NOTA AL PIE: ESTÁ MEDIDA ══════════════════
//
// `natura` sale **5 CON y 5 SIN**, y el corte es por SENTIDO: los cinco
// con preposición son de Cicerón y son la causa eficiente (`ā nātūrā
// generātī sumus`); los cinco sin ella son de César y son instrumentales
// (`nātūrā locī mūnītum`, «por el emplazamiento»). El lote trae los dos, y
// los trae con el MISMO lema, que es lo único que enseña que la regla no
// la decide la palabra sino el papel.
//
// Sin ese par, el lote enseñaría una regla absoluta — que es la forma
// típica del error nuevo (§E2).
//
// ══ EL VEREDICTO NO ES «¿ES GRAMATICAL?» ═════════════════════════════
//
// `Servus dominō vocātur` puede leerse como dativo («se llama al esclavo
// para el señor»), así que preguntar si la frase es gramatical tendría
// respuesta correcta alternativa y suspendería a un alumno impecable
// (§D8). Lo que se pregunta es si el latín DICE LO QUE DICE LA GLOSA, que
// es una pregunta con una sola respuesta. De ahí que cada ítem traiga su
// glosa española y su corrección.
import { declinar, type Numero } from '../../lib/data/languages/la/paradigma-la';
import { NOMBRES_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { NOMBRES_IMPORTADOS } from '../../lib/data/languages/la/importados';
import selloAgente from '../../lib/data/languages/la/atestacion-agente.json';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';
import { coberturaDeLosPares, distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, techoDeLaSegundaVez } from './coste-del-par';

export { distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, techoDeLaSegundaVez };

const SELLO = selloAgente as { lemas: Record<string, { con: number; sin: number }>; totales: { con: number; sin: number } };

const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC')
    .toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');
const palabras = (s: string) => s.split(/[^\p{L}]+/u).filter((w) => w.length > 0).map(sinM);

/** El lema TAL COMO LO ESCRIBE EL CORPUS: sin cantidad y con la ortografía
 *  del treebank. El sello está keyed así y compararlo con el lema del
 *  lexicón directamente daría cero para todo lo que lleve macrón. */
export function enElCorpus(lema: string): { con: number; sin: number } {
  return SELLO.lemas[sinM(lema)] ?? { con: 0, sin: 0 };
}

export function entradaDe(lema: string) {
  return NOMBRES_L1.find((x) => x.lema === lema) ?? NOMBRES_IMPORTADOS.find((x) => x.lema === lema);
}

export type Papel = 'agente' | 'instrumento' | 'causa-eficiente';

export interface ItemAgente {
  id: string;
  punto: string;
  pareja: string;
  /** La frase latina SIN cantidad. */
  latin: string;
  latinConCantidad: string;
  /** El ablativo, con lo que la máquina necesita para derivarlo. */
  ablativo: { lema: string; forma: string; numero: Numero };
  /** ¿Lleva `a`/`ab` delante? */
  conPreposicion: boolean;
  /** Qué papel hace el ablativo. Lo contrasta el sello, no se cree. */
  papel: Papel;
  /** ¿El latín dice lo que dice la glosa? */
  diceLoQueLaGlosa: boolean;
  /** La traducción que el ítem PIDE expresar. */
  glosa: string;
  /** La frase buena. En los ítems correctos es la misma `latin`. */
  correccion: string;
  /** Los dos ítems de `natura`: la regla no es absoluta y el gate lo
   *  comprueba contra el sello, que da 5 y 5. */
  esLaExcepcion?: string;
}

export type ClaseFalloAgente =
  | 'ablativo-no-esta-en-la-frase' | 'ablativo-mal-derivado'
  | 'preposicion-mal-declarada' | 'papel-sin-apoyo-en-el-corpus'
  | 'marca-agramatical-lo-atestiguado' | 'veredicto-no-sigue-la-regla'
  | 'correccion-igual-a-la-frase-mala' | 'correccion-de-mas'
  | 'glosa-sin-hueco-de-sentido' | 'excepcion-sin-apoyo'
  | 'excepcion-sin-declarar' | 'marco-con-macrones' | 'cantidad-mal-puesta'
  | 'latin-fuera-de-l1'
  | 'pareja-incompleta' | 'pareja-sin-contraste' | 'pareja-no-minima'
  | 'varia-incompleto' | 'cobertura-cero' | 'cobertura-sin-motivo'
  | 'estrategia-ciega' | 'orden-publicado' | 'pareja-adyacente' | 'pareja-demasiado-cerca';

export interface FalloAgente { item: string; clase: ClaseFalloAgente; detalle: string }

export function revisarItemAgente(item: ItemAgente): FalloAgente[] {
  const out: FalloAgente[] = [];
  const push = (clase: ClaseFalloAgente, detalle: string) => out.push({ item: item.id, clase, detalle });
  const ws = palabras(item.latin);

  if (/[āēīōūȳĀĒĪŌŪ]/.test(item.latin))
    push('marco-con-macrones', `el marco lleva macrones: «${item.latin}»`);
  if (sinM(item.latinConCantidad) !== sinM(item.latin))
    push('cantidad-mal-puesta', `«${item.latinConCantidad}» no es la misma frase que «${item.latin}»`);

  // ── EL ABLATIVO, DERIVADO ──
  const e = entradaDe(item.ablativo.lema);
  if (!e) push('ablativo-mal-derivado', `«${item.ablativo.lema}» no está ni en el lexicón de L1 ni en los importados`);
  else {
    const f = declinar(e, 'abl', item.ablativo.numero);
    if (sinM(f) !== sinM(item.ablativo.forma))
      push('ablativo-mal-derivado', `la máquina deriva «${f}» y el ítem escribe «${item.ablativo.forma}»`);
    if (!ws.includes(sinM(f)))
      push('ablativo-no-esta-en-la-frase', `la frase no lleva «${f}»`);
  }

  // ── LA PREPOSICIÓN, LEÍDA DE LA FRASE ──
  const lleva = /(?<!\p{L})(a|ab)(?!\p{L})/iu.test(item.latin.normalize('NFC'));
  if (lleva !== item.conPreposicion)
    push('preposicion-mal-declarada', `declara conPreposicion=${item.conPreposicion} y la frase ${lleva ? 'SÍ' : 'NO'} lleva «a»/«ab»`);

  // ── EL PAPEL, CONTRA EL CORPUS ──
  const c = enElCorpus(item.ablativo.lema);
  if (item.esLaExcepcion !== undefined) {
    if (!(c.con > 0 && c.sin > 0))
      push('excepcion-sin-apoyo', `declara la excepción y «${item.ablativo.lema}» sale ${c.con} con y ${c.sin} sin en el corpus: una excepción tiene que aparecer de las dos maneras`);
  } else if (item.papel === 'agente') {
    if (!(c.con > 0 && c.sin === 0))
      push('papel-sin-apoyo-en-el-corpus', `declara agente y «${item.ablativo.lema}» sale ${c.con} con ā y ${c.sin} sin ella: el corpus no sostiene que sea siempre animado`);
  } else if (item.papel === 'instrumento') {
    if (!(c.sin > 0 && c.con === 0))
      push('papel-sin-apoyo-en-el-corpus', `declara instrumento y «${item.ablativo.lema}» sale ${c.con} con ā y ${c.sin} sin ella`);
  }

  // ── NO SE MARCA AGRAMATICAL LO QUE EL CORPUS ATESTIGUA (§F1) ──
  if (!item.diceLoQueLaGlosa) {
    const atestiguada = item.conPreposicion ? c.con : c.sin;
    if (atestiguada > 0)
      push('marca-agramatical-lo-atestiguado',
        `el ítem da por mala «${item.ablativo.forma}» ${item.conPreposicion ? 'CON' : 'SIN'} preposición y el corpus la trae ${atestiguada} veces`);
  }

  // ── EL VEREDICTO SALE DE LA REGLA, NO SE DECLARA SUELTO ──
  if (item.esLaExcepcion === undefined) {
    const debe = item.papel === 'agente' ? item.conPreposicion : !item.conPreposicion;
    if (item.diceLoQueLaGlosa !== debe)
      push('veredicto-no-sigue-la-regla',
        `${item.papel} ${item.conPreposicion ? 'con' : 'sin'} preposición tendría que ser ${debe ? 'BUENA' : 'MALA'} y el ítem dice ${item.diceLoQueLaGlosa ? 'BUENA' : 'MALA'}`);
  } else if (!item.diceLoQueLaGlosa) {
    push('excepcion-sin-declarar', 'los ítems de la excepción son los dos correctos: es lo que enseña que la regla no es absoluta');
  }

  // ── LA CORRECCIÓN ──
  if (item.diceLoQueLaGlosa) {
    if (sinM(item.correccion) !== sinM(item.latin))
      push('correccion-de-mas', `la frase ya dice lo que la glosa y aun así trae una corrección distinta: «${item.correccion}»`);
  } else if (sinM(item.correccion) === sinM(item.latin))
    push('correccion-igual-a-la-frase-mala', 'la corrección es la misma frase: no corrige nada');

  if (!/\b(por|con|de)\b/i.test(item.glosa))
    push('glosa-sin-hueco-de-sentido', `la glosa no dice cómo entra el ablativo en español: «${item.glosa}»`);

  const desc = palabrasDesconocidas(item.latin);
  if (desc.length > 0) push('latin-fuera-de-l1', `la frase usa palabras que la máquina de L1 no produce: ${desc.join(', ')}`);
  return out;
}

export function revisarParejasAgente(items: ItemAgente[]): FalloAgente[] {
  const out: FalloAgente[] = [];
  const porPar = new Map<string, ItemAgente[]>();
  for (const i of items) porPar.set(i.pareja, [...(porPar.get(i.pareja) ?? []), i]);
  for (const [nombre, xs] of porPar) {
    if (xs.length !== 2) {
      out.push({ item: `(par ${nombre})`, clase: 'pareja-incompleta', detalle: `el par tiene ${xs.length} ítems y tiene que tener 2` });
      continue;
    }
    const [a, b] = xs as [ItemAgente, ItemAgente];
    if (a.conPreposicion === b.conPreposicion)
      out.push({ item: `(par ${nombre})`, clase: 'pareja-sin-contraste',
        detalle: `los dos ítems del par ${a.conPreposicion ? 'llevan' : 'no llevan'} preposición: el par no contrasta nada` });
    // El par de la excepción NO es mínimo y no puede serlo: los dos son
    // correctos y dicen cosas distintas. Va declarado por los dos lados.
    const excepcion = a.esLaExcepcion !== undefined && b.esLaExcepcion !== undefined;
    if (!excepcion) {
      if (a.diceLoQueLaGlosa === b.diceLoQueLaGlosa)
        out.push({ item: `(par ${nombre})`, clase: 'pareja-sin-contraste', detalle: 'los dos ítems del par tienen el mismo veredicto' });
      // LA DIFERENCIA ES EXACTAMENTE LA PREPOSICIÓN: quitarle el `a`/`ab`
      // a la frase que lo lleva tiene que dar la otra, palabra por
      // palabra. Es la comprobación más barata que existe y no admite
      // interpretación.
      const conP = a.conPreposicion ? a : b;
      const sinP = a.conPreposicion ? b : a;
      const pelada = palabras(conP.latin).filter((w) => w !== 'a' && w !== 'ab').join(' ');
      if (pelada !== palabras(sinP.latin).join(' '))
        out.push({ item: `(par ${nombre})`, clase: 'pareja-no-minima',
          detalle: `quitarle la preposición a «${conP.latin}» da «${pelada}» y la otra frase del par es «${palabras(sinP.latin).join(' ')}»` });
    }
  }
  return out;
}

export interface TasaAgente { nombre: string; aciertos: number; n: number; tasa: number }

/** Las tres rutas ciegas. El denominador son los ítems donde la estrategia
 *  puede acertar Y fallar: los de la excepción quedan fuera porque los dos
 *  son correctos y ahí «todo está bien» no puede equivocarse
 *  (§5.teretvicies, forma 1). */
export function tasasCiegasAgente(items: ItemAgente[]) {
  const mide = items.filter((i) => i.esLaExcepcion === undefined);
  const t = (nombre: string, f: (i: ItemAgente) => boolean): TasaAgente => {
    const a = mide.filter((i) => f(i) === i.diceLoQueLaGlosa).length;
    return { nombre, aciertos: a, n: mide.length, tasa: mide.length === 0 ? 0 : a / mide.length };
  };
  return {
    conPreposicionEsBuena: t('«si lleva ā está bien»', (i) => i.conPreposicion),
    sinPreposicionEsBuena: t('«si no lleva ā está bien»', (i) => !i.conPreposicion),
    elAnimadoEsBueno: t('«si el ablativo es animado está bien»', (i) => i.papel === 'agente'),
    todoEstaBien: t('«todo está bien»', () => true),
  };
}

export function coberturaAgente(items: ItemAgente[]): Cobertura[] {
  const n = items.length;
  const mide = items.filter((i) => i.esLaExcepcion === undefined);
  const malas = mide.filter((i) => !i.diceLoQueLaGlosa);
  return [
    { comprobacion: 'el error de PONER ā con un instrumento', decididos: malas.filter((i) => i.conPreposicion).length, total: malas.length,
      motivoDeLosQueQuedanFuera: 'el varia exige los DOS errores; éste es uno' },
    { comprobacion: 'el error de QUITAR ā con un agente', decididos: malas.filter((i) => !i.conPreposicion).length, total: malas.length,
      motivoDeLosQueQuedanFuera: 'el otro, y sin él el lote enseña que la preposición sobra siempre' },
    { comprobacion: 'ablativos ANIMADOS', decididos: mide.filter((i) => i.papel === 'agente').length, total: mide.length,
      motivoDeLosQueQuedanFuera: 'la otra mitad son inanimados: sin los dos, «animado ⇒ bien» decidiría el lote' },
    { comprobacion: 'lemas distintos en el ablativo', decididos: new Set(items.map((i) => i.ablativo.lema)).size, total: items.length,
      motivoDeLosQueQuedanFuera: 'cada lema sale dos veces, con y sin preposición: es el par' },
    { comprobacion: 'la EXCEPCIÓN del punto, con el mismo lema de los dos modos',
      decididos: items.filter((i) => i.esLaExcepcion !== undefined).length, total: n,
      motivoDeLosQueQuedanFuera: 'son dos ítems y no una mitad del lote: sin ellos el lote enseña una regla absoluta, y con más el punto sería otro' },
    coberturaDeLosPares(items),
  ];
}

export function revisarLoteAgente(items: ItemAgente[]): FalloAgente[] {
  const out: FalloAgente[] = items.flatMap(revisarItemAgente);
  out.push(...revisarParejasAgente(items));
  for (const c of revisarCobertura(coberturaAgente(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  const mide = items.filter((i) => i.esLaExcepcion === undefined);
  if (!mide.some((i) => !i.diceLoQueLaGlosa && i.conPreposicion) || !mide.some((i) => !i.diceLoQueLaGlosa && !i.conPreposicion))
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'el varia exige «los dos errores: la preposición de más y la de menos» y falta uno' });
  if (!items.some((i) => i.esLaExcepcion !== undefined))
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'el punto declara una excepción («ā nātūrā») y sin ella el lote enseña una regla absoluta (§E2)' });

  for (const x of Object.values(tasasCiegasAgente(items)))
    if (x.n > 0 && x.tasa > 0.6)
      out.push({ item: '(lote)', clase: 'estrategia-ciega', detalle: `${x.nombre} acierta ${x.aciertos} de ${x.n} (${(100 * x.tasa).toFixed(0)} %)` });

  const p = separablePorPosicion(patronDe(items, (i) => i.diceLoQueLaGlosa));
  if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `el veredicto se separa por la posición: ${p}` });
  for (let k = 1; k < items.length; k++)
    if (items[k]!.pareja === items[k - 1]!.pareja)
      out.push({ item: `(par ${items[k]!.pareja})`, clase: 'pareja-adyacente', detalle: `los dos ítems del par salen seguidos (posiciones ${k} y ${k + 1})` });
  for (const { pareja, distancia } of distanciasEnElPar(items))
    if (distancia < DISTANCIA_MINIMA_EN_EL_PAR)
      out.push({ item: `(par ${pareja})`, clase: 'pareja-demasiado-cerca', detalle: `distancia ${distancia}, el piso es ${DISTANCIA_MINIMA_EN_EL_PAR}` });
  return out;
}
