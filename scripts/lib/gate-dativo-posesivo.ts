// scripts/lib/gate-dativo-posesivo.ts — «mihi liber est» = «TENGO un libro».
//
// Punto `l3-dativo-posesivo`. `descripcion`: «La posesión se dice con "ser"
// y dativo, no con "tener"». `motivo`: «la lectura literal —"a mí un libro
// es"— NO es español, así que el alumno se da cuenta de que algo falla: la
// dificultad es de traducción y no de parseo». `varia`: «la persona del
// dativo y si el poseído es sujeto singular o plural».
//
// ══ EL LADO QUE FALTA, Y SIN ÉL EL LOTE ENSEÑA UNA REGLA FALSA ═══════
//
// Un lote de sólo dativos posesivos instala «dativo ⇒ tener», que es peor
// que lo que quita: el dativo de este mismo nivel es, la mayoría de las
// veces, un complemento indirecto corriente. Con dos lecturas, «traducir
// siempre con TENER» y «traducir siempre con A/PARA» son complementarias y
// suman 1 (§1.bis del relevo, quinta vez). Seis y seis.
//
// Y las seis de complemento indirecto no son relleno: son el punto
// anterior, `l3-dativo-ci`, que es su prerrequisito declarado. Lo que el
// lote enseña no es «dativo = tener» sino **que lo decide el verbo**.
//
// ══ EL PAR MÍNIMO SÓLO EXISTE CON UN NEUTRO, Y ESO ES LENGUA ═════════
//
// Las dos frases de un par tendrían que diferir SÓLO en el verbo:
//
//     Puero nomen est.      «el niño TIENE un nombre»
//     Puero nomen dicit.    «le DICE el nombre al niño»
//
// Pero eso sólo sale con un poseído NEUTRO. Con `sum` el poseído es el
// SUJETO y va en nominativo; con un verbo transitivo es el OBJETO y va en
// acusativo — y el neutro es la única clase donde esas dos casillas
// coinciden. Con un masculino o un femenino la lengua obliga a cambiar dos
// palabras (`filius`/`filium`, `rosae`/`rosas`).
//
// Eso NO se esconde: se declara por par (`parMinimo`) y el gate comprueba
// las dos formas distintas. Los pares no mínimos son además los únicos que
// enseñan que el poseído de `mihi ... est` es el SUJETO de la frase, que es
// medio punto. Un lote de puros neutros habría salido más limpio y habría
// enseñado menos — la tentación exacta que §D5 describe.
//
// ══ LA CONCORDANCIA CRUZADA, QUE ES EL SEGUNDO ERROR ═════════════════
//
// El verbo LATINO concuerda con el poseído; el verbo ESPAÑOL, con el
// poseedor. Así que las dos lenguas ponen el número en sitios distintos:
//
//     Regi signa SUNT.      →  «el rey TIENE señales»    plural → singular
//     Pueris donum EST.     →  «los niños TIENEN un regalo» singular → plural
//
// El gate lo comprueba en las dos direcciones y la cobertura cuenta
// cuántos ítems lo ejercen. Es un rasgo que la traducción mecánica
// destruye sin que nada proteste.
import { conjugar, declinar, type Caso, type Numero } from '../../lib/data/languages/la/paradigma-la';
import { NOMBRES_L1, VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import { PERSONALES_L1 } from '../../lib/data/languages/la/personales-la';
import { palabrasDesconocidas } from './gate-vocabulario-del-marco';
import { revisarCobertura, type Cobertura } from './cobertura';
import { separablePorPosicion } from './atajos';
import { patronDe } from './orden-publicado';
import { coberturaDeLosPares, distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, techoDeLaSegundaVez } from './coste-del-par';

export { distanciasEnElPar, DISTANCIA_MINIMA_EN_EL_PAR, techoDeLaSegundaVez };

const SUM = VERBOS_L1.find((v) => v.lema === 'sum')!;

const sinM = (s: string) =>
  s.normalize('NFD').replace(/[̄̆]/g, '').normalize('NFC')
    .toLowerCase().replace(/v/g, 'u').replace(/j/g, 'i');
const palabras = (s: string) => s.split(/[^\p{L}]+/u).filter((w) => w.length > 0).map(sinM);

/** Una forma de «tener» en la traducción. El acento va aparte porque
 *  `tenía`/`tendrá` no aparecen en este lote y añadirlos sería escribir
 *  regex para un caso que no existe. */
const TIENE = /(?<!\p{L})(tengo|tienes|tiene|tenemos|tienen)(?!\p{L})/iu;

export interface ItemDativoPosesivo {
  id: string;
  punto: string;
  pareja: string;
  /** `true` = las dos frases del par difieren SÓLO en el verbo. Sólo es
   *  posible con un poseído neutro; con otro género la lengua obliga a
   *  cambiar también el caso del poseído. */
  parMinimo: boolean;
  /** La frase latina SIN cantidad: es como el corpus la escribe. */
  latin: string;
  latinConCantidad: string;
  /** El verbo tal como sale en `latin`. */
  verbo: string;
  lectura: 'posesion' | 'ci';
  /** El dativo. `lema` es el del lexicón o el de un personal (`ego`…).
   *  `enEspanol` es el NÚCLEO del sintagma con el que se le nombra en la
   *  traducción —«niño», «rey»— y ata la respuesta al latín: sin él una
   *  traducción espejo, la que cambia los papeles, pasaba en verde porque
   *  lo único que se comprobaba era que dijera «tener». En primera y
   *  segunda persona va vacío: el clítico lleva la persona y no hay
   *  núcleo que buscar. */
  dativo: { forma: string; lema: string; numero: Numero; persona: 1 | 2 | 3; enEspanol?: string };
  /** El poseído —o el objeto, en los de complemento indirecto—, con la
   *  celda que la máquina tiene que derivar: nominativo con `sum`,
   *  acusativo con el verbo transitivo. */
  poseido: { lema: string; caso: Caso; numero: Numero; enEspanol: string };
  /** La traducción correcta. */
  respuesta: string;
  /** La otra lectura del MISMO dativo. En los de complemento indirecto es
   *  literalmente la respuesta de su pareja: el error diana de un lado es
   *  la verdad del otro, y eso el gate lo comprueba. */
  elErrorDiana: string;
}

export type ClaseFalloDativo =
  | 'verbo-no-esta-en-la-frase' | 'lectura-no-la-decide-el-verbo'
  | 'numero-del-verbo-latino' | 'poseido-no-esta-en-la-frase'
  | 'caso-del-poseido' | 'dativo-no-esta-en-la-frase'
  | 'respuesta-sin-tener' | 'respuesta-con-tener'
  | 'respuesta-no-nombra-al-poseedor' | 'respuesta-no-nombra-al-poseido'
  | 'error-diana-con-tener' | 'error-diana-sin-tener'
  | 'numero-del-verbo-espanol' | 'marco-con-macrones' | 'cantidad-mal-puesta'
  | 'latin-fuera-de-l1'
  | 'pareja-incompleta' | 'pareja-sin-contraste' | 'pareja-no-minima'
  | 'par-minimo-mal-declarado' | 'error-diana-no-es-la-respuesta-del-par'
  | 'par-sin-respuestas-distintas'
  | 'varia-incompleto' | 'cobertura-cero' | 'cobertura-sin-motivo'
  | 'estrategia-ciega' | 'orden-publicado' | 'pareja-adyacente' | 'pareja-demasiado-cerca';

export interface FalloDativo { item: string; clase: ClaseFalloDativo; detalle: string }

/** La forma del dativo que deriva la máquina, del lexicón o de la tabla de
 *  personales. `null` si el lema no está en ninguna de las dos. */
export function dativoDerivado(d: ItemDativoPosesivo['dativo']): string | null {
  const p = PERSONALES_L1.find((x) => x.lema === d.lema);
  if (p) return p.formas.dat ?? null;
  const n = NOMBRES_L1.find((x) => x.lema === d.lema);
  return n ? declinar(n, 'dat', d.numero) : null;
}

export function revisarItemDativo(item: ItemDativoPosesivo): FalloDativo[] {
  const out: FalloDativo[] = [];
  const push = (clase: ClaseFalloDativo, detalle: string) => out.push({ item: item.id, clase, detalle });
  const ws = palabras(item.latin);

  if (/[āēīōūȳĀĒĪŌŪ]/.test(item.latin))
    push('marco-con-macrones', `el marco lleva macrones y el corpus tiene 0 en 227.301 tokens: «${item.latin}»`);
  if (sinM(item.latinConCantidad) !== sinM(item.latin))
    push('cantidad-mal-puesta', `«${item.latinConCantidad}» no es la misma frase que «${item.latin}»`);

  if (!ws.includes(sinM(item.verbo)))
    push('verbo-no-esta-en-la-frase', `declara el verbo «${item.verbo}» y la frase no lo lleva`);

  // ── LA LECTURA LA DECIDE EL VERBO, Y LO DICE LA MÁQUINA ──
  // No se compara contra una lista escrita a mano: se conjuga `sum`.
  const esSum = [conjugar(SUM, '3sg'), conjugar(SUM, '3pl')].some((f) => sinM(f) === sinM(item.verbo));
  if (esSum !== (item.lectura === 'posesion'))
    push('lectura-no-la-decide-el-verbo',
      `declara «${item.lectura}» y «${item.verbo}» ${esSum ? 'SÍ' : 'NO'} es una forma de «sum»`);

  // ── EL NÚMERO DEL VERBO LATINO ES EL DEL POSEÍDO, NO EL DEL POSEEDOR ──
  if (item.lectura === 'posesion') {
    const esperado = conjugar(SUM, item.poseido.numero === 'pl' ? '3pl' : '3sg');
    if (sinM(esperado) !== sinM(item.verbo))
      push('numero-del-verbo-latino',
        `el poseído va en ${item.poseido.numero} y el verbo tendría que ser «${esperado}», no «${item.verbo}»`);
  }

  // ── EL POSEÍDO: SUJETO CON `sum`, OBJETO CON EL TRANSITIVO ──
  const casoEsperado: Caso = item.lectura === 'posesion' ? 'nom' : 'ac';
  if (item.poseido.caso !== casoEsperado)
    push('caso-del-poseido', `con «${item.verbo}» el poseído va en ${casoEsperado} y el ítem declara ${item.poseido.caso}`);
  const n = NOMBRES_L1.find((x) => x.lema === item.poseido.lema);
  if (!n) push('poseido-no-esta-en-la-frase', `«${item.poseido.lema}» no está en el lexicón`);
  else {
    const f = declinar(n, item.poseido.caso, item.poseido.numero);
    if (!ws.includes(sinM(f)))
      push('poseido-no-esta-en-la-frase', `declara ${item.poseido.lema} ${item.poseido.caso}.${item.poseido.numero} = «${f}» y la frase no la lleva`);
    if (!palabras(item.latinConCantidad).includes(sinM(f)) || !item.latinConCantidad.normalize('NFC').includes(f.normalize('NFC')))
      push('cantidad-mal-puesta', `la versión con cantidad no lleva «${f}»`);
  }

  // ── EL DATIVO ──
  const dat = dativoDerivado(item.dativo);
  if (dat === null) push('dativo-no-esta-en-la-frase', `el lema «${item.dativo.lema}» no está ni en el lexicón ni en los personales`);
  else {
    if (sinM(dat) !== sinM(item.dativo.forma))
      push('dativo-no-esta-en-la-frase', `la máquina deriva «${dat}» y el ítem declara «${item.dativo.forma}»`);
    if (!ws.includes(sinM(dat)))
      push('dativo-no-esta-en-la-frase', `la frase no lleva «${dat}»`);
  }

  // ── LAS DOS TRADUCCIONES ──
  const respTiene = TIENE.test(item.respuesta);
  const dianaTiene = TIENE.test(item.elErrorDiana);
  if (item.lectura === 'posesion') {
    if (!respTiene) push('respuesta-sin-tener', `la lectura es posesiva y «${item.respuesta}» no usa «tener»`);
    if (dianaTiene) push('error-diana-con-tener', `el error diana es la lectura de complemento indirecto y usa «tener»: «${item.elErrorDiana}»`);
  } else {
    if (respTiene) push('respuesta-con-tener', `la lectura es de complemento indirecto y «${item.respuesta}» usa «tener»`);
    if (!dianaTiene) push('error-diana-sin-tener', `el error diana es la lectura posesiva y no usa «tener»: «${item.elErrorDiana}»`);
  }

  // ── LA TRADUCCIÓN NOMBRA A LOS DOS, O NO ES LA TRADUCCIÓN DE ESTA FRASE ──
  //
  // Comprobar sólo que use «tener» deja pasar la traducción ESPEJO —la que
  // intercambia el poseedor y el poseído— y cualquier frase con el verbo
  // correcto y los nombres equivocados. Es §C5: sobre lo que el modelo no
  // representa, el gate calla en verde.
  const dice = (t: string, w: string) => t.toLowerCase().includes(w.toLowerCase());
  if (item.dativo.enEspanol !== undefined && !dice(item.respuesta, item.dativo.enEspanol))
    push('respuesta-no-nombra-al-poseedor', `«${item.respuesta}» no nombra a «${item.dativo.enEspanol}», que es quien lleva el dativo`);
  if (!dice(item.respuesta, item.poseido.enEspanol))
    push('respuesta-no-nombra-al-poseido', `«${item.respuesta}» no nombra «${item.poseido.enEspanol}»`);

  // ── LA CONCORDANCIA CRUZADA ──
  // El español pone el número en el POSEEDOR. Sólo se comprueba en tercera
  // persona, que es donde «tiene» y «tienen» se distinguen: en primera y
  // segunda la forma ya lleva la persona y no hay nada que cruzar.
  if (item.lectura === 'posesion' && item.dativo.persona === 3) {
    const debe = item.dativo.numero === 'pl' ? /(?<!\p{L})tienen(?!\p{L})/iu : /(?<!\p{L})tiene(?!\p{L})/iu;
    const noDebe = item.dativo.numero === 'pl' ? /(?<!\p{L})tiene(?!\p{L})/iu : /(?<!\p{L})tienen(?!\p{L})/iu;
    if (!debe.test(item.respuesta) || noDebe.test(item.respuesta))
      push('numero-del-verbo-espanol',
        `el poseedor va en ${item.dativo.numero} y el español tendría que decir «${item.dativo.numero === 'pl' ? 'tienen' : 'tiene'}»: «${item.respuesta}»`);
  }

  const desc = palabrasDesconocidas(item.latin);
  if (desc.length > 0) push('latin-fuera-de-l1', `la frase usa palabras que la máquina de L1 no produce: ${desc.join(', ')}`);
  return out;
}

export function revisarParejasDativo(items: ItemDativoPosesivo[]): FalloDativo[] {
  const out: FalloDativo[] = [];
  const porPar = new Map<string, ItemDativoPosesivo[]>();
  for (const i of items) porPar.set(i.pareja, [...(porPar.get(i.pareja) ?? []), i]);

  for (const [nombre, xs] of porPar) {
    if (xs.length !== 2) {
      out.push({ item: `(par ${nombre})`, clase: 'pareja-incompleta',
        detalle: `el par tiene ${xs.length} ítems y tiene que tener 2` });
      continue;
    }
    const pos = xs.find((x) => x.lectura === 'posesion');
    const ci = xs.find((x) => x.lectura === 'ci');
    if (!pos || !ci) {
      out.push({ item: `(par ${nombre})`, clase: 'pareja-sin-contraste',
        detalle: 'los dos ítems del par tienen la misma lectura: el par no contrasta nada' });
      continue;
    }
    const wa = palabras(pos.latin), wb = palabras(ci.latin);
    const distintas = wa.length !== wb.length ? -1 : wa.reduce((k, w, j) => k + (w === wb[j] ? 0 : 1), 0);

    // EL PAR MÍNIMO SÓLO CON NEUTRO. La declaración no se cree: se deriva
    // del género del poseído, que está en el lexicón.
    const gen = NOMBRES_L1.find((x) => x.lema === pos.poseido.lema)?.genero;
    if (gen !== undefined && pos.parMinimo !== (gen === 'n'))
      out.push({ item: `(par ${nombre})`, clase: 'par-minimo-mal-declarado',
        detalle: `declara parMinimo=${pos.parMinimo} y «${pos.poseido.lema}» es ${gen === 'n' ? 'neutro (nom y ac coinciden: el par SÍ puede ser mínimo)' : 'de género ' + gen + ' (nom y ac difieren: el par NO puede ser mínimo)'}` });

    const esperadas = pos.parMinimo ? 1 : 2;
    if (distintas !== esperadas)
      out.push({ item: `(par ${nombre})`, clase: 'pareja-no-minima',
        detalle: distintas < 0
          ? 'las dos frases del par no tienen el mismo número de palabras'
          : `declara parMinimo=${pos.parMinimo} y las dos frases difieren en ${distintas} palabras (tendrían que diferir en ${esperadas})` });

    // EL ERROR DIANA DE UN LADO ES LA VERDAD DEL OTRO. Es lo que hace del
    // par un par: si no coinciden, uno de los dos está describiendo otra
    // trampa.
    if (pos.respuesta === ci.respuesta)
      out.push({ item: `(par ${nombre})`, clase: 'par-sin-respuestas-distintas',
        detalle: `los dos ítems del par se califican con la misma traducción «${pos.respuesta}»` });
    if (ci.elErrorDiana !== pos.respuesta)
      out.push({ item: `(par ${nombre})`, clase: 'error-diana-no-es-la-respuesta-del-par',
        detalle: `el error diana del lado de complemento indirecto es «${ci.elErrorDiana}» y la respuesta posesiva del par es «${pos.respuesta}»` });
  }
  return out;
}

export interface TasaDativo { nombre: string; aciertos: number; n: number; tasa: number }

export function tasasCiegasDativo(items: ItemDativoPosesivo[]) {
  const con = (nombre: string, l: 'posesion' | 'ci'): TasaDativo => {
    const a = items.filter((i) => i.lectura === l).length;
    return { nombre, aciertos: a, n: items.length, tasa: items.length === 0 ? 0 : a / items.length };
  };
  return {
    siempreConTener: con('traducir siempre con TENER', 'posesion'),
    siempreConAPara: con('traducir siempre con A/PARA', 'ci'),
  };
}

export function coberturaDativo(items: ItemDativoPosesivo[]): Cobertura[] {
  const n = items.length;
  const pos = items.filter((i) => i.lectura === 'posesion');
  const cruzan = pos.filter((i) => i.dativo.numero !== i.poseido.numero);
  return [
    { comprobacion: 'la lectura POSESIVA («tener»)', decididos: pos.length, total: n,
      motivoDeLosQueQuedanFuera: 'la otra mitad es de complemento indirecto, y sin ella el lote instala «dativo ⇒ tener»' },
    { comprobacion: 'la lectura de COMPLEMENTO INDIRECTO', decididos: n - pos.length, total: n,
      motivoDeLosQueQuedanFuera: 'es el punto anterior, `l3-dativo-ci`, que este punto declara como prerrequisito' },
    { comprobacion: 'personas distintas del dativo', decididos: new Set(items.map((i) => `${i.dativo.persona}${i.dativo.numero}`)).size, total: 6,
      // LA QUE FALTA ES LA SEGUNDA DEL PLURAL, y falta por una razón
      // escrita: el alumno es mexicano y no usa `vosotros`, así que
      // «vōbīs … est» se traduciría con «ustedes tienen», que es la misma
      // casilla que la tercera del plural y no añade contraste ninguno.
      motivoDeLosQueQuedanFuera: 'falta la segunda del plural: el alumno es mexicano, `vōbīs … est` se traduce «ustedes tienen» y eso es la misma casilla española que la tercera del plural' },
    { comprobacion: 'el poseído en PLURAL, que pone `sunt`', decididos: pos.filter((i) => i.poseido.numero === 'pl').length, total: pos.length,
      motivoDeLosQueQuedanFuera: 'el varia pide los dos números del poseído' },
    { comprobacion: 'ítems donde el número latino y el español NO coinciden', decididos: cruzan.length, total: pos.length,
      motivoDeLosQueQuedanFuera: 'en los demás el poseído y el poseedor van en el mismo número y el cruce no se ve; hacen falta los dos para que el cruce sea un contraste y no una constante' },
    coberturaDeLosPares(items),
    { comprobacion: 'pares NO mínimos (poseído no neutro)', decididos: items.filter((i) => !i.parMinimo).length, total: n,
      motivoDeLosQueQuedanFuera: 'los mínimos llevan un neutro, donde nominativo y acusativo coinciden; los no mínimos son los únicos que enseñan que el poseído de «mihi … est» es el SUJETO' },
  ];
}

export function revisarLoteDativo(items: ItemDativoPosesivo[]): FalloDativo[] {
  const out: FalloDativo[] = items.flatMap(revisarItemDativo);
  out.push(...revisarParejasDativo(items));
  for (const c of revisarCobertura(coberturaDativo(items)))
    out.push({ item: c.item, clase: c.clase, detalle: c.detalle });

  if (!items.some((i) => i.lectura === 'posesion') || !items.some((i) => i.lectura === 'ci'))
    out.push({ item: '(lote)', clase: 'varia-incompleto', detalle: 'falta una de las dos lecturas y con una sola el lote instala la regla contraria' });
  if (!items.some((i) => i.lectura === 'posesion' && i.poseido.numero === 'pl'))
    out.push({ item: '(lote)', clase: 'varia-incompleto', detalle: 'el varia pide «si el poseído es sujeto singular o plural» y no hay ningún plural: `sunt` no aparece nunca' });
  if (!items.some((i) => !i.parMinimo))
    out.push({ item: '(lote)', clase: 'varia-incompleto', detalle: 'todos los poseídos son neutros: el lote no enseña que con `sum` el poseído va en NOMINATIVO, porque en neutro no se ve' });

  const t = tasasCiegasDativo(items);
  for (const x of Object.values(t))
    if (x.n > 0 && x.tasa > 0.6)
      out.push({ item: '(lote)', clase: 'estrategia-ciega', detalle: `«${x.nombre}» acierta ${x.aciertos} de ${x.n} (${(100 * x.tasa).toFixed(0)} %)` });

  const p = separablePorPosicion(patronDe(items, (i) => i.lectura === 'posesion'));
  if (p) out.push({ item: '(lote)', clase: 'orden-publicado', detalle: `la lectura se separa por la posición: ${p}` });
  for (let k = 1; k < items.length; k++)
    if (items[k]!.pareja === items[k - 1]!.pareja)
      out.push({ item: `(par ${items[k]!.pareja})`, clase: 'pareja-adyacente',
        detalle: `los dos ítems del par salen seguidos (posiciones ${k} y ${k + 1})` });
  // EL COSTE DEL PAR, que este lote paga igual que el del reflexivo: el
  // marco se repite y «lo contrario de la vez anterior» tiene techo 0,75.
  // No se apaga barajando; lo que se exige es el piso de distancia.
  for (const { pareja, distancia } of distanciasEnElPar(items))
    if (distancia < DISTANCIA_MINIMA_EN_EL_PAR)
      out.push({ item: `(par ${pareja})`, clase: 'pareja-demasiado-cerca',
        detalle: `los dos ítems del par salen a distancia ${distancia} y el piso es ${DISTANCIA_MINIMA_EN_EL_PAR}` });
  return out;
}
