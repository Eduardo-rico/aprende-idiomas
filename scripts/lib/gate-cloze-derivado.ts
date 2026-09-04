// scripts/lib/gate-cloze-derivado.ts
//
// EL GATE DEL «CLOZE DERIVADO», escrito ANTES del primer ítem y de LOTE,
// que es la lección del formato anterior: un gate por ítem que fuerza una
// propiedad la vuelve constante en el lote, y una constante es una
// estrategia gratis.
//
// ── QUÉ EXAMINA ESTE FORMATO ──────────────────────────────────────────
//
// Se le da al alumno la entrada del lexicón —lema + GENITIVO— y una celda
// del paradigma, y produce la forma. El punto que estrena es `l2-segunda`,
// cuyo contenido real es una sola cosa:
//
//     el tema sale del GENITIVO, no del nominativo
//
// `puer/puerī` conserva la vocal y `ager/agrī` la pierde, y **eso no se
// deduce del nominativo**. Por eso la entrada del lexicón lleva el
// genitivo (el punto `l2-genitivo-clave`), y por eso un ítem que use un
// nombre regular en `-us` no examina nada: ahí las dos derivaciones dan lo
// mismo.
//
// ── LAS CUATRO ESTRATEGIAS CIEGAS ─────────────────────────────────────
//
//   1. **copiar el lema** — gana en nominativo y vocativo de los `-er`.
//   2. **copiar el genitivo** — gana si se pregunta el genitivo.
//   3. **tema del nominativo** — la que el punto existe para derrotar:
//      acierta en todos los regulares y en `puer`, y falla en `ager`
//      (`*agerum` por `agrum`). Su complementaria es «sincopar siempre»,
//      que acierta en `ager` y falla en `puer`: **las dos suman uno sobre
//      los `-er`**, así que la única mezcla que deja a las dos en el azar
//      es mitad y mitad. Es la misma aritmética del lote anterior.
//   4. **vocativo en -e** — acierta en `domine` y falla en `fīlī`, que es
//      la excepción declarada (A&G §49.c; treebank: `fili` 13, `filie` 0).
//      Sin ítems de `-ius` en el lote, el alumno saca 8/8 sobregeneralizando.
//
// Y una comprobación que este formato permite y el anterior no: **la
// respuesta se verifica contra la máquina de paradigmas**, o sea que hay
// un segundo camino DENTRO del ítem. Una respuesta escrita a mano que no
// coincida con lo que la máquina deriva es un fallo del ítem, no del gate.
import { declinar, conjugar, type EntradaNominal, type EntradaVerbal, type Caso, type Numero, type Persona } from '../../lib/data/languages/la/paradigma-la';

export type CeldaNominal = `${Caso}.${Numero}`;

export interface ItemClozeDerivado {
  id: string;
  punto: string;
  /** Lo que se le enseña al alumno: lema + genitivo. */
  entrada: EntradaNominal;
  celda: CeldaNominal;
  /** Escrita a mano y contrastada contra la máquina. */
  respuesta: string;
  /** La frase latina con `___` donde va la forma. Va en su propio campo
   *  —y no dentro de la pista— para que el gate de cantidad pueda
   *  comprobarle los mácrons: mezclada con el español no se puede. */
  marco: string;
  /** El contexto español que fija la celda sin regalar la forma. */
  pista: string;
  ejes: {
    /** `regular` = `-us`/`-a`, donde las dos derivaciones coinciden y el
     *  ítem no discrimina; `conserva` = `puer/puerī`; `sincopa` =
     *  `ager/agrī`; `voc-ius` = la excepción. */
    clase: 'regular' | 'conserva' | 'sincopa' | 'voc-ius';
    celda: CeldaNominal;
  };
}

import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';

export type ClaseFalloD =
  | 'orden-separable'
  | 'respuesta-no-derivable'
  | 'eje-mal-declarado'
  | 'pista-regala-la-forma'
  | 'celdas-repetidas'
  | 'estrategia-ciega'
  | 'sin-excepcion'
  | 'celda-gratis'
  | 'marco-mal'
  | 'cobertura-cero'
  | 'cobertura-sin-motivo';

export interface FalloD { item: string; clase: ClaseFalloD; detalle: string }

const norm = (s: string) => s.normalize('NFC').toLowerCase();
const parte = (c: CeldaNominal) => c.split('.') as [Caso, Numero];

/** El tema tal como lo saca quien mira el NOMINATIVO y no el genitivo:
 *  quita `-us`/`-um`/`-a` y, si no hay desinencia que quitar, se queda con
 *  el lema entero. Es la estrategia, ejecutada. */
export function temaDelNominativo(e: EntradaNominal): string {
  const l = norm(e.lema);
  return l.replace(/(us|um|a)$/, '');
}

/** Lo que respondería esa estrategia en una celda dada. */
export function respuestaIngenua(e: EntradaNominal, celda: CeldaNominal): string {
  const falsa: EntradaNominal = { ...e, genitivo: temaDelNominativo(e) + (norm(e.genitivo).endsWith('ae') ? 'ae' : 'ī') };
  try { const [c, n] = parte(celda); return norm(declinar(falsa, c, n)); } catch { return ''; }
}

/** La complementaria: sincopar siempre, o sea suponer que la vocal cae. */
export function respuestaSincopada(e: EntradaNominal, celda: CeldaNominal): string {
  // Cae la `e` que precede a la `-r` final, sin más condiciones: es una
  // estrategia CIEGA y simularla con una regla fina la haría más lista de
  // lo que es. La primera versión exigía consonante antes de la `e` y por
  // eso NO sincopaba `puer` — o sea que acertaba donde debía fallar, y las
  // dos estrategias dejaban de ser complementarias.
  const t = temaDelNominativo(e).replace(/e(r)$/, '$1');
  const falsa: EntradaNominal = { ...e, genitivo: t + (norm(e.genitivo).endsWith('ae') ? 'ae' : 'ī') };
  try { const [c, n] = parte(celda); return norm(declinar(falsa, c, n)); } catch { return ''; }
}

export function tasasCiegasD(items: ItemClozeDerivado[]) {
  const n = items.length || 1;
  const acierta = (f: (i: ItemClozeDerivado) => string) =>
    items.filter((i) => f(i) === norm(i.respuesta)).length / n;
  // Las dos de tema se miden SÓLO sobre los ítems que discriminan: en un
  // regular las dos derivaciones coinciden, así que incluirlos diluiría la
  // tasa y dejaría pasar un lote que no examina nada. Es el mismo error
  // que contar los ítems donde el rasgo diana es invariante.
  const disc = items.filter((i) => i.ejes.clase === 'conserva' || i.ejes.clase === 'sincopa');
  const sobre = (xs: ItemClozeDerivado[], f: (i: ItemClozeDerivado) => string) =>
    xs.length === 0 ? 0 : xs.filter((i) => f(i) === norm(i.respuesta)).length / xs.length;
  const vocs = items.filter((i) => i.celda === 'voc.sg');
  return {
    copiarLema: acierta((i) => norm(i.entrada.lema)),
    copiarGenitivo: acierta((i) => norm(i.entrada.genitivo)),
    temaDelNominativo: sobre(disc, (i) => respuestaIngenua(i.entrada, i.celda)),
    sincoparSiempre: sobre(disc, (i) => respuestaSincopada(i.entrada, i.celda)),
    vocativoEnE: vocs.length === 0 ? 0 : sobre(vocs, (i) => norm(temaDelNominativo(i.entrada) + 'e')),
    discriminantes: disc.length,
  };
}

export const TECHO_D = 0.5;

export function revisarClozeDerivado(item: ItemClozeDerivado): FalloD[] {
  const out: FalloD[] = [];
  const push = (clase: ClaseFalloD, detalle: string) => out.push({ item: item.id, clase, detalle });

  // EL SEGUNDO CAMINO DENTRO DEL ÍTEM: la respuesta escrita a mano contra
  // la que deriva la máquina.
  const [c, n] = parte(item.celda);
  let derivada = '';
  try { derivada = declinar(item.entrada, c, n); } catch (e) { push('respuesta-no-derivable', String(e)); }
  if (derivada && norm(derivada) !== norm(item.respuesta)) {
    push('respuesta-no-derivable', `la respuesta es «${item.respuesta}» y la máquina deriva «${derivada}»`);
  }

  if (item.ejes.celda !== item.celda) push('eje-mal-declarado', `declara celda ${item.ejes.celda} y pide ${item.celda}`);

  // La clase declarada, contra los datos.
  const real: ItemClozeDerivado['ejes']['clase'] =
    item.celda === 'voc.sg' && /ius$/.test(norm(item.entrada.lema)) ? 'voc-ius'
    : !/(er|ir)$/.test(norm(item.entrada.lema)) ? 'regular'
    : norm(item.entrada.genitivo).startsWith(norm(item.entrada.lema)) ? 'conserva' : 'sincopa';
  if (real !== item.ejes.clase) push('eje-mal-declarado', `declara clase ${item.ejes.clase} y los datos dicen ${real}`);

  // LA REGLA ES LA PROPIEDAD, NO LA CELDA. La primera versión vetaba
  // `gen.sg` por su nombre, y se le escapaba el caso que la destapó: en la
  // 2.ª declinación el nominativo PLURAL y el genitivo singular son
  // homógrafos (`puerī`), así que pedir el plural es pedir que copien lo
  // que tienen delante — con otro nombre de celda y el mismo regalo.
  // Vetar por nombre es la forma de que la regla falle en la copia N+1
  // que nadie añadió.
  //
  // Y este veto POR ÍTEM es seguro donde el del formato anterior no lo
  // fue: allí prohibía un lado de un eje BINARIO, así que dejaba el otro
  // constante en todo el lote y regalaba la estrategia contraria. Aquí
  // quita las celdas cuya respuesta ya está a la vista, de un eje de doce:
  // las demás siguen libres y ninguna queda fijada.
  for (const [qué, valor] of [['el lema', item.entrada.lema], ['el genitivo', item.entrada.genitivo]] as const) {
    if (norm(valor) === norm(item.respuesta)) {
      push('celda-gratis', `la respuesta «${item.respuesta}» es ${qué}, que va en la entrada del lexicón: se contesta copiando`);
    }
  }

  // Ni la pista ni el marco pueden llevar la forma dentro. Es la fuga que
  // mató al juicio binario en portugués, en su versión más literal.
  for (const [donde, txt] of [['la pista', item.pista], ['el marco', item.marco]] as const) {
    if (norm(txt).includes(norm(item.respuesta))) push('pista-regala-la-forma', `${donde} contiene «${item.respuesta}»`);
  }
  if (!item.marco.includes('___')) push('marco-mal', 'el marco latino no tiene hueco `___`');
  // Y el marco no puede llevar OTRA forma del mismo lema: la tendría a la
  // vista y el ítem mediría copiar, no derivar.
  const raiz = norm(item.entrada.genitivo).replace(/(ae|ī)$/, '');
  if (raiz.length >= 3 && norm(item.marco).replace('___', '').includes(raiz)) {
    push('pista-regala-la-forma', `el marco lleva otra forma del mismo lema (tema «${raiz}»)`);
  }
  return out;
}

/** Sobre cuántos ítems decide de verdad cada comprobación. */
export function coberturaDerivado(items: ItemClozeDerivado[]): Cobertura[] {
  const n = items.length;
  const disc = items.filter((i) => i.ejes.clase === 'conserva' || i.ejes.clase === 'sincopa').length;
  const vocs = items.filter((i) => i.celda === 'voc.sg').length;
  return [
    { comprobacion: 'la respuesta contra la máquina', decididos: n, total: n },
    { comprobacion: 'copiar el lema o el genitivo', decididos: n, total: n },
    { comprobacion: 'las dos derivaciones del tema', decididos: disc, total: n,
      motivoDeLosQueQuedanFuera: 'en un nombre regular las dos derivaciones coinciden, así que el ítem no las distingue' },
    { comprobacion: 'el vocativo en -e', decididos: vocs, total: n,
      motivoDeLosQueQuedanFuera: 'sólo un ítem de vocativo singular puede examinarlo' },
  ];
}

export function revisarLoteD(items: ItemClozeDerivado[]): FalloD[] {

  const out: FalloD[] = items.flatMap(revisarClozeDerivado);
  // ── EL ORDEN DE PUBLICACIÓN, QUE NINGÚN GATE DE LATÍN MIRABA ──
  //
  // `separablePorPosicion` está en el repositorio desde portugués y
  // ninguno de los cinco gates nuevos lo llamaba: cuatro de los cinco
  // lotes se resolvían al 100 % contando ejercicios. Un detector que
  // existe y no se llama es peor que no tenerlo, porque da sensación de
  // cobertura.
  {
    const sep = separablePorPosicion(patronDe(items, (i) => i.ejes.clase === 'conserva' || i.ejes.clase === 'regular'));
    if (sep) out.push({ item: '(lote)', clase: 'orden-separable' as ClaseFalloD,
      detalle: `el eje «el tema conserva la vocal» se predice por la POSICIÓN: ${sep}` });
  }
  out.push(...revisarCobertura(coberturaDerivado(items)).map((f) => ({ item: f.item, clase: f.clase as unknown as ClaseFalloD, detalle: f.detalle })));
  const t = tasasCiegasD(items);
  const pct = (x: number) => `${(100 * x).toFixed(0)} %`;
  for (const [nombre, valor, glosa] of [
    ['copiar el lema', t.copiarLema, 'responder con el nominativo'],
    ['copiar el genitivo', t.copiarGenitivo, 'responder con el genitivo que se le enseña'],
    ['tema del nominativo', t.temaDelNominativo, 'sacar el tema del nominativo en vez del genitivo'],
    ['sincopar siempre', t.sincoparSiempre, 'suponer que la vocal del -er cae siempre'],
    ['vocativo en -e', t.vocativoEnE, 'poner -e en todos los vocativos'],
  ] as const) {
    if (valor > TECHO_D) {
      out.push({ item: '(lote)', clase: 'estrategia-ciega',
        detalle: `«${nombre}» —${glosa}— acierta el ${pct(valor)}: por encima del ${pct(TECHO_D)}` });
    }
  }

  // Sin ítems que discriminen, las tasas de tema son 0 por vacío y el gate
  // callaría sobre un lote que no examina el punto. Es «ocho ítems que no
  // varían son uno», visto desde el denominador.
  if (t.discriminantes < 4) {
    out.push({ item: '(lote)', clase: 'estrategia-ciega',
      detalle: `sólo ${t.discriminantes} ítems discriminan el tema (hacen falta ≥4): en los regulares las dos derivaciones coinciden y el ítem no examina el punto` });
  }

  // LA EXCEPCIÓN DECLARADA. Sin un ítem de `-ius`, el alumno saca 8/8
  // sobregeneralizando el vocativo en -e y el corpus lo certifica.
  if (!items.some((i) => i.ejes.clase === 'voc-ius')) {
    out.push({ item: '(lote)', clase: 'sin-excepcion',
      detalle: 'ningún ítem examina el vocativo de los -ius (`fīlī`, no `fīlie`): la regla se puede sobregeneralizar entera' });
  }

  // ── Y EL MARCO TAMPOCO PUEDE ENSEÑAR UN TEMA NO DERIVABLE ──
  //
  // Tres marcos llevaban `Magistrī` y `Puerī` de sujeto, o sea el tema
  // sincopado y el conservado EN PANTALLA, que es justo lo que preguntan
  // otros ítems. El gate no lo veía porque comprobaba la cadena de la
  // RESPUESTA, y esas formas no son respuesta de nadie: son la celda que
  // el lote declara que no se pide «porque ya está a la vista».
  //
  // Y la comprobación va acotada a los temas que NO se deducen del
  // nominativo. Enseñar `dominus` no regala nada —de `dominus` sale
  // `domin-` sin saber latín— y marcarlo habría llenado el informe de
  // ruido sobre los regulares, que son la mitad del lote.
  const noDerivables = new Map<string, string>();
  for (const it of items) {
    const tema = norm(it.entrada.genitivo).replace(/(ae|ī)$/, '');
    if (tema.length >= 4 && temaDelNominativo(it.entrada) !== tema) noDerivables.set(tema, it.entrada.lema);
  }
  for (const a of items) {
    const enMarco = norm(a.marco).replace('___', ' ');
    for (const [tema, lema] of noDerivables) {
      if (norm(a.entrada.lema) !== norm(lema) && enMarco.includes(tema)) {
        out.push({ item: a.id, clase: 'pista-regala-la-forma',
          detalle: `su marco enseña el tema «${tema}» de «${lema}», que NO se deduce del nominativo y que otro ítem examina` });
      }
    }
  }

  // Un marco puede llevar dentro la respuesta de OTRO ítem del lote. Es
  // la misma fuga que la de la pista, pero sólo visible desde el lote: por
  // ítem cada marco está impecable. Salió escribiendo los marcos, no
  // diseñando el gate.
  for (const a of items) for (const b of items) {
    if (a.id === b.id) continue;
    if (norm(a.marco).replace('___', ' ').includes(norm(b.respuesta))) {
      out.push({ item: a.id, clase: 'pista-regala-la-forma', detalle: `su marco contiene «${b.respuesta}», que es la respuesta de «${b.id}»` });
    }
  }

  const vistas = new Map<string, string>();
  for (const it of items) {
    const k = `${norm(it.entrada.lema)}|${it.celda}`;
    const antes = vistas.get(k);
    if (antes) out.push({ item: it.id, clase: 'celdas-repetidas', detalle: `misma palabra y misma celda que «${antes}»` });
    else vistas.set(k, it.id);
  }
  return out;
}
