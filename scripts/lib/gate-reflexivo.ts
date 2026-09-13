// scripts/lib/gate-reflexivo.ts — `sē/suus` FRENTE A `is/eius`.
//
// Punto `l4-reflexivo`: «"Caesar suōs mīlitēs laudat" (los suyos) frente a
// "Caesar eius mīlitēs laudat" (los de otro). El español dice "sus" en los
// dos casos.» `varia`: «si el poseedor es el sujeto o un tercero, y **hay
// que traer los dos o el punto no mide nada**».
//
// ══ LO QUE ESTE GATE VIGILA DE VERDAD, Y NO ES LA TASA CIEGA ═════════
//
// El eje es binario, así que por §1.bis del relevo «contesta siempre el
// sujeto» y «contesta siempre el otro» son complementarias y suman 1. La
// salida conocida es mitad y mitad. Hasta aquí, lo de siempre.
//
// Lo nuevo es que este lote está hecho de PARES MÍNIMOS COMPLETOS: cada
// frase latina aparece DOS veces, idéntica salvo la palabra que decide, y
// con la MISMA glosa española. Y entonces:
//
//   > toda estrategia que lea una propiedad del MARCO —quién se nombra
//   > primero, quién está más cerca, qué dice el sentido común, cuál de
//   > los dos nombres es más largo— queda clavada en el 50 % EXACTO, no
//   > aproximado, porque esa propiedad es constante dentro del par y el
//   > par tiene una respuesta de cada lado.
//
// Eso cambia dónde está el riesgo. Medir esas tasas y verlas en 0,50 no
// prueba nada: **es aritmética del emparejamiento, no una propiedad del
// material**. Lo único que puede romperse es el emparejamiento mismo, y
// por eso la clase de fallo central de este gate es `pareja-incompleta` y
// no `estrategia-ciega`. Las tasas se siguen midiendo —y el test las
// enseña saliéndose del 50 % en cuanto se rompe un par— pero quien lea
// este fichero tiene que saber cuál de las dos comprobaciones lo sostiene.
//
// ══ LA MITAD QUE EL ESPAÑOL REGALA, DECLARADA ════════════════════════
//
// El punto se llama «sē/suus frente a is/eius» y tiene dos mitades que NO
// se comportan igual para nuestro alumno (§D3, el suelo que pone la
// lengua):
//
//   · el POSESIVO — «sus» en español vale para las dos. El español no
//     entrega nada y el ítem mide entero.
//   · el PRONOMBRE — «se alaba» frente a «lo alaba». **El clítico español
//     ya decide.** Un ítem receptivo cuya glosa lleva «se» tiene la
//     respuesta escrita en la glosa.
//
// Los dos ítems de pronombre entran igualmente, porque el punto los
// nombra y el alumno tiene que ver `sē`, pero van marcados
// `elEspanolLoRegala` con su motivo, su glosa NO es idéntica dentro del
// par —no puede serlo— y **no cuentan como cobertura del eje**. El gate
// exige que el motivo esté escrito y, al revés, que nadie marque como
// regalado un par cuya glosa sí es idéntica: sin el control negativo la
// marca sería una excusa que apaga la comprobación (§5.septendecies).
//
// ══ EL SEGUNDO CAMINO ════════════════════════════════════════════════
//
// La palabra que decide no se compara contra sí misma: se DERIVA.
//
//   · `suus` lo declina `declinarAdjetivo` y tiene que concordar con el
//     POSEÍDO — que es el error de producción clásico, concordar con el
//     poseedor;
//   · `eius`/`eōrum` lo declina `declinarPronombre` en genitivo y tiene
//     que llevar el número del POSEEDOR — escribir `eius` con un poseedor
//     plural es la otra mitad del mismo error;
//   · `sē` sale de la tabla de personales.
//
// Y el poseído se comprueba aparte: su forma declinada por la máquina
// tiene que estar en la frase. Sin eso, la celda declarada sería una
// afirmación sobre el ítem que nada contrasta (§5.duodecies: un rasgo que
// no es DIMENSIÓN no tiene gate, tiene silencio).
import { declinar, declinarAdjetivo, type Caso, type Numero } from '../../lib/data/languages/la/paradigma-la';
import { ADJETIVOS_L1, NOMBRES_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { declinarPronombre, PRONOMBRES_L1 } from '../../lib/data/languages/la/pronombres-la';
import { PERSONALES_L1 } from '../../lib/data/languages/la/personales-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';
import { coberturaDeLosPares, distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, techoDeLaSegundaVez } from './coste-del-par';

// Re-exportadas para que quien lea este gate las encuentre donde las usa.
// Viven en `pares-minimos.ts` porque el mismo coste lo paga todo lote de
// pares y una regla copiada se desincroniza (§A3).
export { distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, techoDeLaSegundaVez };

const SUUS = ADJETIVOS_L1.find((a) => a.lema === 'suus')!;
const IS = PRONOMBRES_L1.find((p) => p.lema === 'is')!;
const SUI = PERSONALES_L1.find((p) => p.lema === 'suī')!;

/** Sin cantidad, sin mayúsculas y con `u`/`i` por `v`/`j`, que es como el
 *  corpus escribe y como el marco se publica (§1.terdecies). */
export const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC')
    .toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');

const palabras = (s: string) => s.split(/[^\p{L}]+/u).filter((w) => w.length > 0).map(sinM);

export interface ItemReflexivo {
  id: string;
  punto: string;
  /** El par mínimo. Exactamente DOS ítems por par, uno de cada lado. */
  pareja: string;
  /** La frase latina SIN macrones: es como el alumno la leerá. */
  latin: string;
  /** La misma frase CON cantidad, que es lo que se enseña al corregir. */
  latinConCantidad: string;
  /** La palabra que decide, tal como sale en `latin` (sin macrones). */
  marca: string;
  /** `true` = `suus`/`sē`: el poseedor es el sujeto de la frase. */
  reflexivo: boolean;
  elemento: 'posesivo' | 'pronombre';
  /** El sustantivo POSEÍDO y su celda en la frase. Con `suus` la marca
   *  concuerda con él; con `eius` no, y ésa es la trampa de producción. */
  poseido?: { lema: string; caso: Caso; numero: Numero };
  /** EL POSEEDOR REAL, sea el sujeto (en los reflexivos) o el tercero (en
   *  los de `eius`). Se usa para dos cosas distintas y por eso es un solo
   *  campo: en los de tercero, su género y su número DERIVAN la forma
   *  —`eius` contra `eōrum`, que es la otra mitad del error—; en los
   *  reflexivos sirve para comprobar que `suus` NO concuerda con él. */
  poseedor?: { lema: string; numero: Numero };
  /** El caso del pronombre reflexivo, en los ítems de `sē`. */
  casoDelPronombre?: Caso;
  /** La traducción española. En los pares de POSESIVO es IDÉNTICA en los
   *  dos ítems: es lo que convierte el par en un par mínimo. */
  glosa: string;
  pregunta: string;
  respuesta: string;
  /** La otra lectura. Es el error diana y es ALCANZABLE por construcción:
   *  está nombrada en la propia frase. */
  distractor: string;
  /** LOS DOS PARTICIPANTES, con lo que hace falta para que la máquina los
   *  derive. `forma` no se cree: se comprueba contra `declinar`, y el CASO
   *  va declarado porque sin él el gate no tiene esa dimensión y calla en
   *  verde sobre ella (§C5) — cambiar el sujeto por el objeto era invisible
   *  mientras sólo se comprobaba que la cadena apareciera.
   *  `enGlosa` es cómo se nombra en la traducción española, y sirve para
   *  atar la glosa al latín: la glosa EMPIEZA por el sujeto. */
  sujeto: { lema: string; forma: string; caso: Caso; numero: Numero; es: string; enGlosa: string };
  otro: { lema: string; forma: string; caso: Caso; numero: Numero; es: string; enGlosa: string };
  /** Hacia qué lado empuja el sentido común, declarado antes de medir. */
  esperado: 'reflexivo' | 'otro' | 'neutro';
  /** Sólo los de pronombre: por qué el español ya decide el ítem. */
  elEspanolLoRegala?: string;
}

export type ClaseFalloReflexivo =
  | 'marca-no-esta-en-la-frase' | 'marca-no-la-deriva-la-maquina'
  | 'poseido-no-esta-en-la-frase' | 'concuerda-con-el-poseedor'
  | 'cantidad-mal-puesta' | 'marco-con-macrones'
  | 'participante-no-esta-en-la-frase' | 'participante-mal-derivado'
  | 'sujeto-no-es-nominativo' | 'otro-en-nominativo'
  | 'glosa-no-empieza-por-el-sujeto' | 'glosa-sin-posesivo-espanol'
  | 'respuesta-fuera-de-los-dos'
  | 'distractor-igual-a-la-respuesta' | 'glosa-no-nombra-a-los-dos'
  | 'latin-fuera-de-l1'
  | 'pareja-incompleta' | 'pareja-no-minima' | 'pareja-sin-contraste'
  | 'glosa-difiere-sin-motivo' | 'regalo-sin-serlo' | 'regalo-en-el-posesivo'
  | 'par-sin-respuestas-cruzadas' | 'pragmatica-en-un-solo-sentido'
  | 'varia-incompleto' | 'cobertura-cero' | 'cobertura-sin-motivo'
  | 'estrategia-ciega' | 'orden-publicado' | 'pareja-adyacente' | 'pareja-demasiado-cerca';

export interface FalloReflexivo { item: string; clase: ClaseFalloReflexivo; detalle: string }

/** LA FORMA QUE LA MÁQUINA DERIVA para la celda que el ítem declara. Es el
 *  segundo camino: nada de esto se lee del texto del ítem. */
export function marcaDerivada(item: ItemReflexivo): string | null {
  if (item.elemento === 'pronombre') {
    if (item.reflexivo) return SUI.formas[item.casoDelPronombre ?? 'ac'] ?? null;
    return declinarPronombre(IS, 'm', item.casoDelPronombre ?? 'ac', 'sg');
  }
  if (item.reflexivo) {
    const p = item.poseido;
    if (!p) return null;
    const n = NOMBRES_L1.find((x) => x.lema === p.lema);
    if (!n) return null;
    return declinarAdjetivo(SUUS, n.genero, p.caso, p.numero);
  }
  const q = item.poseedor;
  if (!q) return null;
  const n = NOMBRES_L1.find((x) => x.lema === q.lema);
  if (!n) return null;
  return declinarPronombre(IS, n.genero, 'gen', q.numero);
}

export function revisarItemReflexivo(item: ItemReflexivo): FalloReflexivo[] {
  const out: FalloReflexivo[] = [];
  const push = (clase: ClaseFalloReflexivo, detalle: string) => out.push({ item: item.id, clase, detalle });
  const ws = palabras(item.latin);

  // ── EL MARCO VA SIN CANTIDAD Y LA VERSIÓN CON ELLA VA APARTE ──
  if (/[āēīōūȳĀĒĪŌŪ]/.test(item.latin))
    push('marco-con-macrones', `el marco lleva macrones y el corpus tiene 0 en 227.301 tokens: «${item.latin}»`);
  if (sinM(item.latinConCantidad) !== sinM(item.latin))
    push('cantidad-mal-puesta', `«${item.latinConCantidad}» no es la misma frase que «${item.latin}» al quitarle la cantidad`);

  // ── LA MARCA, CONTRA LA MÁQUINA ──
  if (!ws.includes(sinM(item.marca)))
    push('marca-no-esta-en-la-frase', `declara «${item.marca}» y la frase no la lleva`);
  const d = marcaDerivada(item);
  if (d === null) push('marca-no-la-deriva-la-maquina', 'la celda declarada no basta para derivar la marca: falta `poseido`, `poseedor` o el lema no está en el lexicón');
  else {
    if (sinM(d) !== sinM(item.marca))
      push('marca-no-la-deriva-la-maquina', `la máquina deriva «${d}» y el ítem escribe «${item.marca}»`);
    if (!palabras(item.latinConCantidad).includes(sinM(d)) ||
        !item.latinConCantidad.normalize('NFC').includes(d.normalize('NFC')))
      push('cantidad-mal-puesta', `la versión con cantidad no lleva «${d}»`);
  }

  // ── EL POSEÍDO, Y LA CONCORDANCIA QUE ES EL ERROR DE PRODUCCIÓN ──
  if (item.poseido) {
    const n = NOMBRES_L1.find((x) => x.lema === item.poseido!.lema);
    if (!n) push('poseido-no-esta-en-la-frase', `«${item.poseido.lema}» no está en el lexicón`);
    else {
      const f = declinar(n, item.poseido.caso, item.poseido.numero);
      if (!ws.includes(sinM(f)))
        push('poseido-no-esta-en-la-frase', `declara ${item.poseido.lema} ${item.poseido.caso}.${item.poseido.numero} = «${f}» y la frase no la lleva`);
      // Con `suus`, concordar con el POSEEDOR en vez de con el poseído es
      // el error diana de producción. Se comprueba aquí porque la máquina
      // sabe declinar las dos cosas y el ítem sólo declara una.
      if (item.reflexivo && item.elemento === 'posesivo' && item.poseedor) {
        const q = NOMBRES_L1.find((x) => x.lema === item.poseedor!.lema);
        if (q && sinM(declinarAdjetivo(SUUS, q.genero, 'nom', item.poseedor.numero)) === sinM(item.marca) &&
            sinM(declinarAdjetivo(SUUS, n.genero, item.poseido.caso, item.poseido.numero)) !== sinM(item.marca))
          push('concuerda-con-el-poseedor', `«${item.marca}» concuerda con el poseedor y no con «${item.poseido.lema}»`);
      }
    }
  } else if (item.elemento === 'posesivo') {
    push('poseido-no-esta-en-la-frase', 'un ítem de posesivo sin `poseido` declarado: la concordancia no tiene contra qué comprobarse');
  }

  // ── LOS DOS PARTICIPANTES, DERIVADOS Y CON SU CASO ──
  //
  // Lo que esto cierra: mientras el gate sólo comprobaba que la cadena
  // estuviera en la frase, intercambiar el sujeto por el objeto —y con
  // ellos las dos respuestas— pasaba en verde, y el par mínimo no lo
  // cazaba porque el error era constante dentro del par. El caso tiene
  // que ser una DIMENSIÓN del modelo o el gate sobre él no existe (§C5).
  for (const [q, p] of [['sujeto', item.sujeto], ['otro', item.otro]] as const) {
    const n = NOMBRES_L1.find((x) => x.lema === p.lema);
    if (!n) { push('participante-mal-derivado', `el ${q} declara el lema «${p.lema}», que no está en el lexicón`); continue; }
    const f = declinar(n, p.caso, p.numero);
    if (sinM(f) !== sinM(p.forma))
      push('participante-mal-derivado', `el ${q} declara «${p.forma}» y la máquina deriva «${f}» para ${p.lema} ${p.caso}.${p.numero}`);
    if (!ws.includes(sinM(f)))
      push('participante-no-esta-en-la-frase', `declara el ${q} «${f}» y la frase no lo lleva`);
  }
  if (item.sujeto.caso !== 'nom')
    push('sujeto-no-es-nominativo', `el sujeto va declarado en ${item.sujeto.caso}: el sujeto latino es el nominativo`);
  if (item.otro.caso === 'nom')
    push('otro-en-nominativo', 'el tercero va declarado en nominativo: entonces es el sujeto y el ítem no tiene dos participantes');
  if (item.respuesta !== item.sujeto.es && item.respuesta !== item.otro.es)
    push('respuesta-fuera-de-los-dos', `«${item.respuesta}» no es ninguna de las dos lecturas declaradas`);
  if (item.respuesta === item.distractor)
    push('distractor-igual-a-la-respuesta', `la respuesta y el distractor son «${item.respuesta}»`);
  // LA GLOSA, ATADA AL LATÍN. No basta con que los dos nombres aparezcan:
  // una glosa ESPEJO —la que cambia los papeles— los nombra igual y es
  // falsa. La glosa EMPIEZA por el sujeto, que es lo que la ancla.
  if (!item.glosa.startsWith(item.sujeto.enGlosa))
    push('glosa-no-empieza-por-el-sujeto', `la glosa empieza por «${item.glosa.slice(0, 24)}…» y el sujeto latino es «${item.sujeto.enGlosa}»`);
  // Y EL DISTRACTOR TIENE QUE SER ALCANZABLE (§D7): el tercero está
  // nombrado en la traducción, así que el alumno puede llegar a las dos.
  if (!item.glosa.includes(item.otro.enGlosa))
    push('glosa-no-nombra-a-los-dos', `la glosa no nombra «${item.otro.enGlosa}», así que esa lectura no es alcanzable`);
  // LA PREMISA DEL PUNTO, ESCRITA EN EL CAMPO QUE LA SOSTIENE: el español
  // dice «su» en los dos casos. Una glosa de posesivo sin «su» no tiene
  // ambigüedad que resolver y el ítem no examina nada.
  if (item.elemento === 'posesivo' && !/(?<!\p{L})sus?(?!\p{L})/iu.test(item.glosa))
    push('glosa-sin-posesivo-espanol', `la glosa no dice «su» ni «sus», que es la ambigüedad española de la que vive el punto: «${item.glosa}»`);

  if (item.elemento === 'posesivo' && item.elEspanolLoRegala !== undefined)
    push('regalo-en-el-posesivo', 'declara que el español lo regala en un ítem de posesivo, y «sus» vale para las dos lecturas');

  const desc = palabrasDesconocidas(item.latin);
  if (desc.length > 0) push('latin-fuera-de-l1', `la frase usa palabras que la máquina de L1 no produce: ${desc.join(', ')}`);
  return out;
}

// ══ LOS PARES MÍNIMOS ════════════════════════════════════════════════

export function revisarParejas(items: ItemReflexivo[]): FalloReflexivo[] {
  const out: FalloReflexivo[] = [];
  const porPar = new Map<string, ItemReflexivo[]>();
  for (const i of items) porPar.set(i.pareja, [...(porPar.get(i.pareja) ?? []), i]);

  for (const [nombre, xs] of porPar) {
    if (xs.length !== 2) {
      out.push({ item: `(par ${nombre})`, clase: 'pareja-incompleta',
        detalle: `el par tiene ${xs.length} ítems y tiene que tener 2: sin el otro lado, toda propiedad del marco predice la respuesta` });
      continue;
    }
    const [a, b] = xs as [ItemReflexivo, ItemReflexivo];
    if (a.reflexivo === b.reflexivo) {
      out.push({ item: `(par ${nombre})`, clase: 'pareja-sin-contraste',
        detalle: `los dos ítems del par son ${a.reflexivo ? 'reflexivos' : 'de tercero'}: el par no contrasta nada` });
      continue;
    }
    // MÍNIMO = las dos frases difieren en UNA palabra, y esa palabra es la
    // marca. Si difieren en más, la diferencia sobrante es una pista.
    const wa = palabras(a.latin), wb = palabras(b.latin);
    const distintas = wa.length !== wb.length
      ? -1
      : wa.reduce((n, w, k) => n + (w === wb[k] ? 0 : 1), 0);
    if (distintas !== 1)
      out.push({ item: `(par ${nombre})`, clase: 'pareja-no-minima',
        detalle: distintas < 0
          ? `las dos frases del par no tienen el mismo número de palabras`
          : `las dos frases del par difieren en ${distintas} palabras y sólo pueden diferir en la marca` });
    else if (wa.findIndex((w, k) => w !== wb[k]) !== wa.indexOf(sinM(a.marca)))
      out.push({ item: `(par ${nombre})`, clase: 'pareja-no-minima',
        detalle: `la palabra que cambia dentro del par no es la marca declarada` });
    if (sinM(a.marca) === sinM(b.marca))
      out.push({ item: `(par ${nombre})`, clase: 'pareja-sin-contraste',
        detalle: `los dos ítems llevan la misma marca «${a.marca}»: sin cantidad no se distinguen` });

    // LA GLOSA IDÉNTICA es lo que hace del par un par mínimo TAMBIÉN por
    // el lado español. Sólo puede diferir donde el clítico español obliga,
    // y entonces hay que decirlo — y decirlo tiene control negativo.
    const iguales = a.glosa === b.glosa;
    const regalado = a.elEspanolLoRegala !== undefined && b.elEspanolLoRegala !== undefined;
    if (!iguales && !regalado)
      out.push({ item: `(par ${nombre})`, clase: 'glosa-difiere-sin-motivo',
        detalle: `las glosas del par no son iguales y ninguno declara por qué:\n    «${a.glosa}»\n    «${b.glosa}»` });
    // H5 · LAS DOS RESPUESTAS DEL PAR TIENEN QUE SER LAS DOS LECTURAS,
    // CRUZADAS. `pareja-sin-contraste` mira `reflexivo` y la marca, que es
    // el LATÍN; esto mira el campo con el que se califica al alumno. Sin
    // ello los dos ítems podían llevar la misma respuesta y el gate sólo
    // veía subir la tasa ciega a 0,56, por debajo de su propio umbral.
    if (a.respuesta === b.respuesta)
      out.push({ item: `(par ${nombre})`, clase: 'par-sin-respuestas-cruzadas',
        detalle: `los dos ítems del par se califican con la misma respuesta «${a.respuesta}»` });
    else if (a.respuesta !== b.distractor || b.respuesta !== a.distractor)
      out.push({ item: `(par ${nombre})`, clase: 'par-sin-respuestas-cruzadas',
        detalle: `la respuesta de un lado tiene que ser el distractor del otro: «${a.respuesta}»/«${a.distractor}» contra «${b.respuesta}»/«${b.distractor}»` });

    if (iguales && regalado)
      out.push({ item: `(par ${nombre})`, clase: 'regalo-sin-serlo',
        detalle: `declara que el español decide el ítem y la glosa del par es la misma: si el español decidiera, no podría serlo` });
  }
  return out;
}

// ══ LAS ESTRATEGIAS CIEGAS ═══════════════════════════════════════════
//
// Las cuatro leen el MARCO, no la marca. Con los pares completos las
// cuatro salen en 0,50 exacto — ver la cabecera: eso es aritmética del
// emparejamiento. Se miden igualmente porque si un día el emparejamiento
// se rompe, son ellas las que lo cantan con un número.

export interface Tasa { nombre: string; aciertos: number; n: number; tasa: number }

const tasa = (nombre: string, xs: ItemReflexivo[], f: (i: ItemReflexivo) => string): Tasa => {
  const aciertos = xs.filter((i) => f(i) === i.respuesta).length;
  return { nombre, aciertos, n: xs.length, tasa: xs.length === 0 ? 0 : aciertos / xs.length };
};

/** El nombre que sale ANTES en la frase latina. */
export function elPrimerNombre(i: ItemReflexivo): string {
  const ws = palabras(i.latin);
  return ws.indexOf(sinM(i.sujeto.forma)) < ws.indexOf(sinM(i.otro.forma)) ? i.sujeto.es : i.otro.es;
}

/** El nombre más cercano por la izquierda a la palabra que decide. */
export function elNombreMasCercano(i: ItemReflexivo): string {
  const ws = palabras(i.latin);
  const m = ws.indexOf(sinM(i.marca));
  const ds = ws.indexOf(sinM(i.sujeto.forma)), dd = ws.indexOf(sinM(i.otro.forma));
  return Math.abs(m - ds) <= Math.abs(m - dd) ? i.sujeto.es : i.otro.es;
}

export function tasasCiegasReflexivo(items: ItemReflexivo[]) {
  const conPragmatica = items.filter((i) => i.esperado !== 'neutro');
  return {
    siempreElSujeto: tasa('contestar siempre el sujeto (= siempre reflexivo)', items, (i) => i.sujeto.es),
    siempreElOtro: tasa('contestar siempre el tercero', items, (i) => i.otro.es),
    elPrimerNombre: tasa('contestar el nombre que sale primero', items, elPrimerNombre),
    elNombreMasCercano: tasa('contestar el nombre más cercano a la marca', items, elNombreMasCercano),
    // DENOMINADOR: sólo los ítems cuyo par declara un empujón. En los
    // `neutro` la estrategia no tiene qué contestar, y meterlos la
    // acercaría al azar por dilución (§5.teretvicies, forma 2).
    laPragmatica: tasa('contestar lo que empuja el sentido común', conPragmatica,
      (i) => (i.esperado === 'reflexivo' ? i.sujeto.es : i.otro.es)),
  };
}

export function coberturaReflexivo(items: ItemReflexivo[]): Cobertura[] {
  const n = items.length;
  const miden = items.filter((i) => i.elEspanolLoRegala === undefined);
  const celdas = new Set(items.filter((i) => i.reflexivo && i.poseido)
    .map((i) => `${i.poseido!.caso}.${i.poseido!.numero}`));
  const pares = new Map<string, number>();
  for (const i of items) pares.set(i.pareja, (pares.get(i.pareja) ?? 0) + 1);
  const enParCompleto = items.filter((i) => pares.get(i.pareja) === 2).length;
  return [
    { comprobacion: 'el poseedor ES el sujeto (`suus`, `sē`)', decididos: items.filter((i) => i.reflexivo).length, total: n,
      motivoDeLosQueQuedanFuera: 'el varia exige los dos lados; éste es uno' },
    { comprobacion: 'el poseedor es un TERCERO (`eius`, `eōrum`, `eum`)', decididos: items.filter((i) => !i.reflexivo).length, total: n,
      motivoDeLosQueQuedanFuera: 'el otro lado, y sin él «siempre el sujeto» acierta el lote entero' },
    { comprobacion: 'ítems que el español NO decide', decididos: miden.length, total: n,
      motivoDeLosQueQuedanFuera: 'los de pronombre los decide el clítico español —«se alaba» frente a «lo alaba»—, van declarados y no cuentan como cobertura del eje' },
    { comprobacion: 'ítems dentro de un par mínimo completo', decididos: enParCompleto, total: n,
      motivoDeLosQueQuedanFuera: 'un ítem suelto deja libre toda propiedad de su marco' },
    { comprobacion: 'celdas distintas de `suus` (caso.número)', decididos: celdas.size, total: 6,
      // LAS SEIS son acusativo, dativo y ablativo por singular y plural.
      // Falta el ABLATIVO PLURAL y falta por una razón que se puede
      // escribir: en L1 el ablativo sólo entra con preposición y `cum` +
      // plural pide una frase con dos acompañantes que el marco no
      // sostiene sin traer vocabulario nuevo. No es «las que salieron».
      motivoDeLosQueQuedanFuera: 'falta el ablativo plural: en L1 el ablativo sólo entra con preposición y `cum` + plural pide un marco con dos acompañantes que traería vocabulario fuera de L1' },
    coberturaDeLosPares(items),
    { comprobacion: 'el poseedor PLURAL, que es la celda `eōrum`', decididos: items.filter((i) => !i.reflexivo && i.poseedor?.numero === 'pl').length, total: n,
      motivoDeLosQueQuedanFuera: 'es una celda, no la mitad del lote: el español dice «sus» también aquí y por eso tiene que estar, pero una vez basta para que no sea invariante' },
  ];
}

export function revisarLoteReflexivo(items: ItemReflexivo[]): FalloReflexivo[] {
  const out: FalloReflexivo[] = items.flatMap(revisarItemReflexivo);
  out.push(...revisarParejas(items));
  for (const c of revisarCobertura(coberturaReflexivo(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  if (!items.some((i) => i.reflexivo) || !items.some((i) => !i.reflexivo))
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'el varia dice «hay que traer los dos o el punto no mide nada» y falta un lado' });
  // H3 · `esperado` ERA INERTE: volteado entero en cualquier dirección el
  // gate seguía en verde, porque la tasa pragmática está clavada en 0,50
  // por el emparejamiento y lo único que movía era el denominador. Lo que
  // sí se puede exigir —y falla al voltearlo— es que el empujón del
  // sentido común no vaya SIEMPRE del mismo lado: si todos los pares
  // empujan hacia el reflexivo, el lote alinea la pragmática con una mitad
  // del eje y quien conteste por sentido común acierta todo lo que el
  // sentido común decide.
  const empuja = (l: 'reflexivo' | 'otro') => new Set(items.filter((i) => i.esperado === l).map((i) => i.pareja)).size;
  if (empuja('reflexivo') === 0 || empuja('otro') === 0)
    out.push({ item: '(lote)', clase: 'pragmatica-en-un-solo-sentido',
      detalle: `el sentido común empuja hacia el reflexivo en ${empuja('reflexivo')} pares y hacia el tercero en ${empuja('otro')}: hacen falta los dos sentidos` });

  if (!items.some((i) => i.elemento === 'pronombre'))
    out.push({ item: '(lote)', clase: 'varia-incompleto',
      detalle: 'el punto se llama «sē/suus frente a is/eius» y el lote no trae ningún pronombre' });

  const t = tasasCiegasReflexivo(items);
  for (const x of Object.values(t))
    if (x.n > 0 && x.tasa > 0.6)
      out.push({ item: '(lote)', clase: 'estrategia-ciega',
        detalle: `«${x.nombre}» acierta ${x.aciertos} de ${x.n} (${(100 * x.tasa).toFixed(0)} %)` });

  const p = separablePorPosicion(patronDe(items, (i) => i.reflexivo));
  if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `el lado del eje se separa por la posición: ${p}` });
  // Y los dos miembros de un par, adyacentes, dan la regla «lo contrario
  // del anterior» sin mirar el latín.
  for (let k = 1; k < items.length; k++)
    if (items[k]!.pareja === items[k - 1]!.pareja)
      out.push({ item: `(par ${items[k]!.pareja})`, clase: 'pareja-adyacente',
        detalle: `los dos ítems del par salen seguidos (posiciones ${k} y ${k + 1}): «lo contrario del anterior» los acierta sin latín` });
  for (const { pareja, distancia } of distanciasEnElPar(items))
    if (distancia < DISTANCIA_MINIMA_EN_EL_PAR)
      out.push({ item: `(par ${pareja})`, clase: 'pareja-demasiado-cerca',
        detalle: `los dos ítems del par salen a distancia ${distancia} y el piso es ${DISTANCIA_MINIMA_EN_EL_PAR}: reconocer el marco no cuesta memoria` });
  return out;
}
