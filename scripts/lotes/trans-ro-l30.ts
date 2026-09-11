// scripts/lotes/trans-ro-l30.ts — LOTE 30: `r7-pasiva-impersonal`.
//
//   npx tsx scripts/lotes/trans-ro-l30.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-ro-l30.ts --asigna   # a qué punto cuenta cada ítem
//
// Octavo punto de la máquina de transformación, y el TERCERO que se publica
// sabiendo de antemano que no llega al piso. Va con el dictamen de
// `r7-infinitivo-residual`, que se pidió A LA VEZ y salió a CERO: los dos
// puntos de `r7` se dictaminaron juntos y ésa es la razón de que la única
// casilla que los dos reclamaban —el infinitivo impersonal de instrucciones,
// `A nu se atinge`— quedara repartida por escrito en vez de irse al que
// llegara primero.
//
// ══ 1 · LAS TRES CASILLAS QUE EL PUNTO DECLARA, Y NINGUNA SOBREVIVE ══
//
// El punto se llama «Pasiva con a fi, pasiva refleja e impersonal» y su
// `motivo` dice que examina «la concordancia con transformación
// activa→pasiva». Las tres se caen, cada una por una razón distinta:
//
//   | casilla | qué le pasa |
//   |---|---|
//   | `a fi` + participio concordado | **PUBLICADA** en `r2-concordancia-adjetivo`, 8 ítems, y en su versión difícil: `c75000d2` «Au fost timpuri grei» → «timpuri **grele**» (neutro plural), `cd791962` «magazinele erau deschiși» → «**deschise**», cuya `explanationEs` dice literalmente «el participio-adjetivo». Las FORMAS las publica `r5-participios` (8), que es su prereq declarado. |
//   | pasiva refleja `se vinde` | **GRATIS 1:1 por el español**: «se vende», «se hacen», y la concordancia en número con el paciente es la misma operación. La trampa portuguesa que cabía esperar —la enclisis de `vende-se`— no llega: en indicativo rumano el clítico es preverbal y el español del alumno ya le da ese orden. |
//   | impersonal `se spune că` | **GRATIS**: «se dice que». Y `zice lumea` es fraseología, o sea a lo sumo `r9-colocaciones`. |
//
// Y la pasiva refleja ya está DELANTE del alumno sin examinar: `bb3cd062`
// (`r4-preposiciones-gd`) publica «Conform legii, plata **se face** în
// avans.» Por §4.35 nada de eso cuenta aunque coincida con lo que el punto
// declara enseñar.
//
// ══ 2 · LO QUE QUEDA ES UN HECHO, Y NO ES NINGUNA DE LAS TRES ════════
//
// **El clítico de DATIVO va ANTES de `se`, y cambia de forma al hacerlo.**
//
//   · `Elevului **i se** dă cartea` — no `*se îi dă`, no `*îi se dă`.
//   · `Copiilor **li se** spune` — no `*se le spune`, no `*le se spune`.
//
// Y es el caso limpio de punto que NINGUNA de las dos lenguas del alumno le
// da, porque las dos empujan **en la dirección contraria**:
//
//   | lengua | lo que da | adónde lleva |
//   |---|---|---|
//   | español | «**se le** da el libro», «**se les** dijo» | `*se îi dă`, `*se le spune` |
//   | portugués europeo C2 | «**dá-se-lhe**», «**diz-se-lhes**» | el dativo DETRÁS de `se`, y encima enclítico |
//
// Las dos ponen el dativo detrás; ninguna avisa de que `îi → i` y `le → li`
// al pasar delante. Corpus del proyecto, contado con límite de palabra:
// `i se` **1.863**, `li se` **264**, `ni se` 137, `vi se` 21; frente a
// `se îi dă` **0**, `se le spune` **0**, `le se` **0**.
//
// ══ 3 · POR QUÉ DOS ÍTEMS Y NO OCHO: LA 1.ª Y LA 2.ª NO ESTÁN ════════
//
// La reducción parece categórica y NO lo es en todas las personas. Es la
// vocal de legătură del lote 29 otra vez, y en la misma forma: un número
// grande que esconde una excepción.
//
//   · **1.ª plural: `ne se` está ATESTADO.** «de **ne se** păreau minute»
//     (Alecsandri) y «**Ne se** mai spusese că codrii ducatului...» son
//     rumano genuino — los otros dos hits de `ne se` son `în urmă-ne se` y
//     `giuru-ne se`, que son posesivo enclítico y no esta construcción. Un
//     ítem con `ni se` publicaría la mayoritaria como ÚNICA respuesta buena
//     contra lengua atestada.
//   · **2.ª plural: `vi se` sale 21 y `vă se` 0.** Parece seguro, pero 21 es
//     poco para arriesgar el mismo error dos veces.
//
// **Por eso los dos ítems son de TERCERA persona y de ninguna otra, y eso
// está en gate.** Es exactamente el gate del objeto masculino del lote 29.
//
// ══ 4 · EL ÍTEM DE 3.ª SINGULAR SE ESCRIBIÓ Y SE RETIRÓ ═════════════
//
// Este lote tuvo dos ítems. El de 3.ª singular —`Studentului i se dă
// cartea`— está retirado, y el motivo es el más instructivo del lote.
//
// **`îi se` no es cero: sale 2, y las dos son genuinas** («îi se așeză ca
// o mască de argint pe față», «îi se făcu lumină»), no falsos positivos de
// enclítico como el único hit de `le se`. Contra `i se` **1.863**, o sea
// 0,1 %.
//
// La primera versión de este fichero lo publicaba igual, con DOS
// argumentos, y **los dos eran malos**:
//
//   1. **«las dos son del XIX»** — FALSO, y peor que falso: **inventado**.
//      Los dos hits son de Dimitrie Anghel («Din tainele Lunii») y Emil
//      Gârleanu («Fetița mamei»), los dos muertos en **1914**, o sea prosa
//      de principios del XX. Y el dato decisivo: **los ficheros del corpus
//      no llevan año de publicación**, sólo la muerte del autor, así que
//      cuando escribí «del XIX» no tenía ningún dato de fecha delante. El
//      fichero contenía además su propia cláusula de retirada —«si alguien
//      encuentra `îi se` en prosa del XX, este ítem se retira»— y la
//      cláusula se disparó contra su autor.
//   2. **«el listón del proyecto es `văzându-o`, rechazado a 13 %, y esto
//      es 0,1 %»** — el número es honesto y el cálculo correcto, pero el
//      razonamiento no vale: **13 % es un umbral de RECHAZO, no de
//      ACEPTACIÓN**. Que 13 % sea demasiado no dice que 0,1 % esté bien;
//      son dos preguntas y el sello del lote 29 sólo contestó una. Y la
//      prueba de que el criterio no era un criterio es que **el mismo
//      fichero lo aplicaba a una celda y no a la vecina**: con el listón
//      del 13 % también entraría la 1.ª plural (`ne se` 2 frente a `ni se`
//      137 = 1,44 %, nueve veces por debajo), y el fichero la rechazaba
//      sin decir por qué.
//
// Así que la 3.ª singular sale, y sale por el criterio que sí es del
// proyecto y se aplica igual a todas las celdas: **una clave que suspende
// rumano atestado no se publica.** Con ese criterio caen la 3.ª singular
// (`îi se` ×2) y la 1.ª plural (`ne se` ×2 genuinos: «de ne se păreau
// minute», Gane; «Ne se mai spusese», Hasdeu), y queda una sola celda
// limpia.
//
// ══ 4.bis · POR QUÉ LAS OTRAS TRES CELDAS TAMPOCO ENTRAN ════════════
//
//   | celda | reducida | plena | por qué no |
//   |---|---:|---:|---|
//   | 3.ª sg | `i se` 1.863 | `îi se` **2** | la clave suspendería rumano atestado |
//   | 1.ª pl | `ni se` 137 | `ne se` **2** genuinos | igual, y a tasa nueve veces mayor |
//   | 2.ª pl | `vi se` 21 | `vă se` 0 | **el cero no tiene potencia**: si la tasa fuera la de la 1.ª pl (1,44 %), lo esperado en 21 casos es 0,30 y la probabilidad de observar cero es 0,74 — o sea que ese cero es compatible con que la excepción exista |
//   | 1.ª y 2.ª sg | `mi se` 763, `ți se` 194 | 0, 0 | limpias, pero son la MISMA operación que la 3.ª pl sobre otro clítico, y del segundo ítem en adelante lo único que discriminaría es la forma del clítico, publicada 16 veces entre `r6-cliticos-acusativo` y `r6-cliticos-dativo` (§4.25) |
//
// **PISO DECLARADO 1**, en su propia línea de la reconciliación. No se
// rellena a ocho.
//
// ══ 5 · LO QUE ESTE LOTE NO MIDE, Y HAY QUE DECIRLO ══════════════════
//
// **Un 2/2 aquí NO es dominio de la pasiva rumana.** Mide el orden y la
// forma de un grupo clítico. La pasiva perifrástica y la refleja de este
// alumno son gratis, y eso es un RESULTADO, no una carencia del lote.
import {
  verificar, informe, norm, type ItemTransRo, type Opciones, type Estrategia, type Comprobacion,
} from '../lib/transformacion-ro';
import { SUSTANTIVOS_A1, VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import {
  articulado, genitivoDativo, presente, reducida, CLITICOS_DATIV, type LemaVerbal,
} from '../lib/paradigma-ro';
import { informeAsigna } from '../lib/asigna-ro';

const PUNTO = 'r7-pasiva-impersonal';
const verbo = (i: string): LemaVerbal => {
  const v = VERBOS_A1.find((x) => x.inf === i);
  if (!v) throw new Error(`el lote 30 pide «${i}», que no está en el lexicón`);
  return v;
};
const lema = (l: string) => {
  const v = SUSTANTIVOS_A1.find((x) => x.lema === l);
  if (!v) throw new Error(`el lote 30 pide «${l}», que no está en el lexicón`);
  return v;
};
const A_DA = verbo('a da');

/** LA CONSIGNA, y cada cláusula cierra una salida CORRECTA que la clave
 *  suspendería. Ninguna nombra el clítico ni su orden: eso es la respuesta.
 *
 *  · **«sin decir quién lo hace»** es la transformación misma.
 *  · **«empieza la frase por “Copiilor”»** cierra `Se dau cărțile
 *    copiilor`, que es rumano PERFECTO y no necesita ningún clítico
 *    dativo: sin esta cláusula el ítem no está determinado y no mide nada.
 *  · **«deja “cărțile” al final»** cierra la dislocación.
 *  · **«sin usar “a fi” … ni participio»** cierra la pasiva perifrástica,
 *    que es la OTRA pasiva del mismo activo. ⚠ La primera versión decía
 *    «sin “este” ni “a fost”» y **enumeraba dos cadenas en vez de prohibir
 *    el verbo**: en plural la perifrástica no usa ninguna de las dos, usa
 *    `sunt`, así que `Copiilor le sunt date cărțile` pasaba TODAS las
 *    cláusulas y era otra respuesta correcta que la clave suspendía. Y en
 *    singular el agujero se movía a `e` (`îi e` sale 38 veces). Es «una
 *    regla incompleta no se sustituye»: acierta en los dos casos que
 *    enumera y el agujero se desplaza al tercero.
 *  · **«que “cărțile” sea el sujeto de la frase»** cierra DOS salidas que
 *    la versión anterior dejaba abiertas, las dos rumano correcto: el
 *    **impersonal de 3.ª plural** `Copiilor le dau cărțile` —que el propio
 *    punto declara en su descripción («zice lumea») y donde `cărțile` es
 *    objeto— y el **sujeto indefinido** `Copiilor le dă cineva cărțile`,
 *    que «no añadas ningún complemento» no tocaba porque `cineva` es
 *    sujeto.
 *
 *  Que la consigna REGALE la forma de genitivo-dativo («Copiilor») es
 *  deliberado y es lo que aísla la variable: esa forma es
 *  `r4-gd-definido-pl`, publicado con 8 ítems, y si el ítem la pidiera
 *  mediría ese punto y no éste (§4.25). */
const consigna = (dativo: string, objeto: string) =>
  `Di lo mismo sin decir quién lo hace: empieza la frase por «${dativo}» y deja «${objeto}» al final. `
  + `Usa el mismo verbo, en presente, sin usar «a fi» (este, e, sunt, a fost…) ni participio. `
  + `No añadas nada, y que «${objeto}» sea el sujeto de la frase.`;

export interface Decl { persona: '3sg' | '3pl'; nota: string }

export const DECL: Decl[] = [
  {
    persona: '3pl',
    nota: 'EL DATIVO DE 3.ª PLURAL ANTE «se»: «le» se reduce a «li» Y PASA DELANTE. «li se» 264 frente a «le se» 1 aparición y CERO genuinas — el único hit es «în urmă-le se înaintară», posesivo enclítico y no esta construcción. Es la ÚNICA celda limpia del punto: en la 3.ª sg y en la 1.ª pl la forma plena está atestada, y en la 2.ª pl el cero no tiene potencia. Las dos lenguas del alumno dan el orden contrario (es. «se les dice», pt. «diz-se-lhes»), así que el calco produce *se le dau. Y el verbo concuerda con el paciente en plural («se dau»), que es gratis por el español («se dan los libros») y por eso no es lo que el ítem mide.',
  },
];

const may = (s: string) => s[0]!.toUpperCase() + s.slice(1);

export function construir(d: Decl) {
  // ⚠ Ninguna forma se escribe a mano: el genitivo-dativo definido, el
  //   artículo enclítico, el presente y la forma reducida del clítico
  //   salen del paradigma.
  const esSg = d.persona === '3sg';
  const num = esSg ? 'sg' : 'pl';
  const persona = lema('copil');
  const cosa = lema('carte');
  const oi = genitivoDativo(persona, num, true)!;
  const objeto = articulado(cosa, num)!;
  const cl = reducida(CLITICOS_DATIV, d.persona)!;          // `li`
  const v = presente(A_DA, esSg ? 'el' : 'ei')!;            // `dau`
  const sujeto = articulado(lema('profesor'), 'sg')!;
  return {
    p: PUNTO, pasada: 1,
    s: may(`${sujeto} ${presente(A_DA, 'el')} ${objeto} ${oi}.`),
    instruccion: consigna(may(oi), objeto),
    r: `${may(oi)} ${cl} se ${v} ${objeto}.`,
    alt: [] as string[],
    foco: oi, nucleo: `${cl} se ${v}`,
    espejoEs: false, transparenteLatin: false, sobreaplicacion: false, d,
  };
}

export const CONSTRUIDOS = DECL.map(construir);
export const ITEMS: ItemTransRo[] = CONSTRUIDOS.map(({ d: _d, ...x }) => x as ItemTransRo);
export type Construido = ReturnType<typeof construir>;

// ══ LAS ESTRATEGIAS, EJECUTADAS ══════════════════════════════════════

/** EL CALCO ESPAÑOL, que es el error que el ítem mide: «se les dice» — el
 *  dativo DETRÁS de `se` y sin reducir. `se le spune` sale 0 veces. */
export const CALCO_ESPANOL: Estrategia = {
  nombre: 'poner el dativo detrás de «se», como el español (*se le dau)',
  aplicar: (x) => `se ${CLITICOS_DATIV['3pl']!.plena} ${presente(A_DA, 'ei')}`,
};

/** EL CALCO PORTUGUÉS: el dativo detrás de `se` Y enclítico, como
 *  `diz-se-lhes`. Es imposible por estructura, y hay testigo: en rumano el
 *  dativo precede a `se` incluso cuando el grupo entero se enclitiza al
 *  gerundio —`dându-i-se`, nunca `*dându-se-i`. */
export const CALCO_PORTUGUES: Estrategia = {
  nombre: 'enclitizar el dativo detrás de «se», como el portugués (*dau-se-li)',
  aplicar: () => `${presente(A_DA, 'ei')}-se-${reducida(CLITICOS_DATIV, '3pl')}`,
};

/** NO REDUCIR el clítico aunque se ponga delante: `*le se dau`. Es la
 *  media regla —«el dativo va delante»— sin la otra media. */
export const SIN_REDUCIR: Estrategia = {
  nombre: 'poner el dativo delante pero SIN reducirlo (*le se dau)',
  aplicar: () => `${CLITICOS_DATIV['3pl']!.plena} se ${presente(A_DA, 'ei')}`,
};

/** LA PASIVA PERIFRÁSTICA, que es rumano correcto y que la clave
 *  suspende: por eso la consigna tiene que cerrarla. Se ejecuta para que
 *  el cierre quede MEDIDO y no sólo afirmado. */
export const PERIFRASTICA: Estrategia = {
  nombre: 'la otra pasiva del mismo activo: «Copiilor le sunt date cărțile»',
  aplicar: () => 'le sunt date',
};

export function revisar(xs: readonly Construido[]): string[] {
  const v: string[] = [];

  // 1 · EL GATE QUE SOSTIENE EL PISO DE 1: la ÚNICA celda determinada es
  //     la 3.ª PLURAL. En la 3.ª sg («îi se» ×2) y en la 1.ª pl («ne se»
  //     ×2 genuinos) la forma plena está ATESTADA, así que la clave
  //     suspendería rumano real; en la 2.ª pl el cero de «vă se» no tiene
  //     potencia (21 casos). Quien venga a «completar el lote a ocho»
  //     choca aquí.
  for (const x of xs) {
    if (x.d.persona !== '3pl')
      v.push(`${x.s}: el ítem es de persona «${x.d.persona}» y la única celda determinada es la 3.ª PLURAL — en 3.ª sg «îi se» sale 2 y en 1.ª pl «ne se» sale 2 genuinas, así que la clave suspendería rumano atestado`);
  }

  // ⚠ Independiente de la anterior: no comparte bucle ni `continue` (§0.8).

  // 2 · EL CLÍTICO VA REDUCIDO Y DELANTE DE «se».
  for (const x of xs) {
    const esperado = reducida(CLITICOS_DATIV, x.d.persona)!;
    if (!x.nucleo.startsWith(`${esperado} se `))
      v.push(`${x.s}: el núcleo tiene que empezar por «${esperado} se» (dativo reducido y ANTES de «se») y es «${x.nucleo}»`);
    for (const plena of Object.values(CLITICOS_DATIV).map((c) => c.plena))
      if (new RegExp(`(^|\\s)${plena}\\s+se\\b`, 'u').test(x.nucleo))
        v.push(`${x.s}: el núcleo «${x.nucleo}» lleva el dativo SIN reducir ante «se»`);
  }

  // 3 · LAS CLÁUSULAS DE LA CONSIGNA, que son gates: cada una cierra una
  //     salida CORRECTA que la clave suspendería. Las dos últimas las puso
  //     el ataque del lingüista, contra dos respuestas buenas que la
  //     versión anterior dejaba pasar enteras.
  for (const x of xs) {
    const necesita: [string, string][] = [
      ['sin decir quien lo hace', 'conservar el sujeto de la activa'],
      ['empieza la frase por', '«Se dau cărțile copiilor», que es rumano perfecto y NO necesita clítico — sin esta cláusula el ítem no mide nada'],
      ['al final', 'la dislocación del objeto'],
      ['sin usar «a fi»', 'la pasiva perifrástica «Copiilor le sunt date cărțile», que es la otra pasiva del mismo activo. ⚠ Enumerar «este» y «a fost» NO basta: en plural la perifrástica usa «sunt»'],
      ['ni participio', 'la misma perifrástica por la otra mitad'],
      ['el mismo verbo, en presente', 'cambiar de verbo o de tiempo'],
      ['sea el sujeto de la frase', 'el impersonal de 3.ª plural «Copiilor le dau cărțile» y el sujeto indefinido «Copiilor le dă cineva cărțile», los dos rumano correcto'],
    ];
    for (const [clave, que] of necesita)
      if (!norm(x.instruccion).includes(norm(clave)))
        v.push(`${x.s}: la consigna no cierra ${que} — falta la cláusula «${clave}»`);
    // Y ninguna puede nombrar el clítico ni su orden: los regalaría.
    for (const p of ['clitic', 'pronombre', 'delante de se', 'dativo', 'reduc'])
      if (norm(x.instruccion).includes(norm(p)))
        v.push(`${x.s}: la consigna dice «${p}» y regala la respuesta`);
  }

  // 4 · UN SOLO ÍTEM, Y ES EL PISO DECLARADO. El segundo de la misma celda
  //     sólo discriminaría el léxico; los de las otras celdas no están
  //     determinados (gate 1).
  if (xs.length !== 1)
    v.push(`REPARTO: el lote tiene ${xs.length} ítems y el piso declarado del punto es 1 — las otras tres celdas no están determinadas`);

  return v;
}

const gatesPropios = (items: readonly ItemTransRo[]): string[] => [
  ...(items.length === CONSTRUIDOS.length ? [] : ['el lote y la declaración se han desincronizado']),
  ...revisar(CONSTRUIDOS),
];

export const COMPROBACIONES: Comprobacion[] = [
  { afirmacion: 'EL DATIVO REDUCIDO ANTE «se», 3.ª plural: la clave del ítem', patron: 'li se', espera: 'presente' },
  { afirmacion: 'y no es de un verbo suelto: «i se face»', patron: 'i se face', espera: 'presente' },
  { afirmacion: 'EL CALCO ESPAÑOL no existe en rumano: «se les dice» → *se le spune', patron: 'se le spune', espera: 'ausente' },
  { afirmacion: 'ni con este verbo: *se le dau', patron: 'se le dau', espera: 'ausente' },
  { afirmacion: 'el dativo precede a «se» incluso cuando el grupo entero se enclitiza al gerundio: «dându-i-se»', patron: 'dându-i-se', espera: 'presente' },
  // ⚠ LOS TRES QUE SOSTIENEN EL PISO DE 1, publicados con su número para
  // que el siguiente los vea ANTES de «completar el lote a ocho».
  { afirmacion: '⚠ «îi se» ESTÁ ATESTADO (Anghel, Gârleanu; los dos muertos en 1914): por eso NO hay ítem de 3.ª singular, aunque «i se» salga 1.863 veces', patron: 'îi se', espera: 'presente' },
  { afirmacion: '⚠ «ne se» ESTÁ ATESTADO (Gane, «Zile trăite»; Hasdeu, «Ioan Vodă cel Cumplit»): por eso NO hay ítem de 1.ª plural, aunque «ni se» salga 137 veces', patron: 'ne se', espera: 'presente' },
  { afirmacion: '⚠ «vi se» sólo sale 21 veces: el cero de «vă se» NO tiene potencia (con la tasa de la 1.ª pl, lo esperado es 0,30 y P(cero) = 0,74), así que tampoco hay ítem de 2.ª plural', patron: 'vi se', espera: 'presente' },
];

export const OPCIONES: Opciones = {
  comprobaciones: COMPROBACIONES,
  estrategias: [CALCO_ESPANOL, CALCO_PORTUGUES, SIN_REDUCIR, PERIFRASTICA],
  gatesPropios,
  semilla: 30,
  juicios: {
    copia: 'CERO se contesta copiando el foco, y el cero está BUSCADO: el foco es el sintagma de genitivo-dativo de la fuente («copiilor») y la transformación lo mueve al frente AÑADIENDO delante un clítico que la fuente no trae. Medido ejecutando: copiar el foco 0/1, copiar la frase entera 0/1, la edición modal 0/1 —este último es un artefacto de n = 1, porque la modal es leave-one-out y sin «otro» ítem no tiene de dónde copiar—. Lo que protege al lote no es ninguno de esos números, y a n = 1 hay que decirlo más fuerte que nunca: son las CUATRO estrategias ciegas ejecutadas —el calco español, el calco portugués, la media regla sin reducir y la pasiva perifrástica, las cuatro a 0/1— y los gates estructurales, empezando por el que exige que la única celda sea la 3.ª plural. Y LA DECISIÓN DE DISEÑO QUE SALE DE AQUÍ: la fuente NO lleva clítico. Si dijera «Cineva le dă cărțile copiilor», copiar el foco produciría «le se», y el ítem estaría castigando lo que él mismo enseña a copiar.',
    frontera: 'SIN FRONTERA: y es por la razón más incómoda, el contexto donde la regla no se aplica SÍ existe pero NO está determinado en ninguna de las celdas que quedan. (1) La frontera natural sería otra persona, donde la reducción parece igual de categórica: «mi se» 763, «ți se» 194, «ni se» 137, «vi se» 21 —los dos primeros números corregidos el 2026-09-10: la versión anterior decía 664 y 408, y ninguno de los dos se reproduce con límite de palabra—. Pero «ne se» ESTÁ ATESTADO dos veces en rumano genuino («de ne se păreau minute», Gane, «Zile trăite»; «Ne se mai spusese…», Hasdeu, «Ioan Vodă cel Cumplit»), así que un ítem que exigiera «ni se» suspendería lengua real; y en la 2.ª plural el cero de «vă se» no tiene potencia, porque con 21 observaciones y la tasa de la 1.ª plural lo esperado es 0,30 y la probabilidad de observar cero es 0,74. (2) La otra frontera candidata era la pasiva refleja SIN dativo («Se vinde casa»), donde no hay clítico que colocar: no cuenta por §4.35, porque es gratis por el español («se vende la casa») y encima ya está publicada sin examinar en «bb3cd062» (r4-preposiciones-gd): «Conform legii, plata se face în avans». (3) Y la restricción de 3.ª persona de la pasiva refleja rumana —el español admite «se me vio» y el rumano no— es SUBPRODUCCIÓN y no cabe en este formato: el alumno no la produce de más, la evita, y forzarla con la consigna devuelve «Am fost văzut», que se contesta traduciendo «Fui visto».',
    varianza: 'LAS PIEZAS INVARIANTES SON CINCO Y SON TODAS, porque a n = 1 «invariante» es vacuo: con un solo ítem cada pieza de la operación aparece en el 100 % del lote por aritmética, no por diseño. Se nombran igual —«-profesorul», «-dă», «+dau», «+li», «+se»— y la más incómoda se nombra la primera: «+li» ES la respuesta. Decir que la clave es invariante en un lote de uno no es una confesión, es la descripción exacta de por qué a n = 1 NINGÚN número de varianza significa nada y todo el peso cae en las cuatro estrategias ejecutadas y en los gates. Y de las otras: «-dă» y «+dau» son la misma pieza vista dos veces —el verbo pasa de 3.ª sg a 3.ª pl para concordar con el paciente—, y esa concordancia es GRATIS por el español («se dan los libros»), así que no es lo que el ítem mide. (i) «-profesorul»: quitar el sujeto ES la transformación y no puede variar sin que el lote deje de ser de este punto; no regala nada, porque quitarlo y no tocar más da «Dă cărțile copiilor», que no es la respuesta. (ii) «+se»: un alumno que sepa «impersonal = poner se» lo pone y acierta CERO, porque «Copiilor se dau cărțile» no es la respuesta —le falta el clítico de dativo, que es la pieza que el punto examina—. La constante está en la parte gratis de la operación (el español ya da «se») y lo que discrimina está en la otra. Medido: «quitar el sujeto y añadir se» acierta 0/1. Y LO QUE HAY QUE JUSTIFICAR ES POR QUÉ ES UNO Y NO OCHO, que es el grueso de este lote, en dos restas. PRIMERA RESTA, las tres casillas que el punto DECLARA: «a fi» + participio concordado está PUBLICADO en r2-concordancia-adjetivo con 8 ítems y en su versión difícil (el neutro: «Au fost timpuri grele», «magazinele erau deschise»), y las formas de participio las publica r5-participios (8), que es su prereq; la pasiva refleja y la impersonal son GRATIS por el español para el paciente de 3.ª persona («se vende», «se dice que»), que es la única dirección que el alumno produce —NO son 1:1, y la versión anterior de este juicio lo decía y se contradecía con su propio punto (3) de «frontera»: el español admite «se me vio» y el rumano lo prohíbe (GALR II), sólo que esa divergencia es subproducción—. Sobre el portugués, la versión anterior afirmaba que «no estorba PORQUE en indicativo rumano el clítico es preverbal», y eso era un non sequitur: describir la forma correcta no explica que el alumno no produzca la incorrecta —si lo explicara, sobraría la estrategia CALCO_PORTUGUES que este lote ejecuta—. La hipótesis real es que el español le gana al portugués porque ya le da el orden preverbal, y queda declarada como NO MEDIDA. SEGUNDA RESTA, dentro de lo que sobrevive: de las seis celdas del paradigma sólo UNA está determinada, porque en la 3.ª sg y en la 1.ª pl la forma plena está atestada y en la 2.ª pl el cero no tiene potencia; y de las dos limpias que quedan (1.ª y 2.ª singular) no se escribe ítem porque serían la MISMA operación sobre otro clítico, y del segundo en adelante lo único que discriminaría es la forma del clítico, publicada 16 veces entre r6-cliticos-acusativo y r6-cliticos-dativo (§4.25). ⚠ EL LÍMITE DEL LOTE, escrito y más grande que en ningún lote anterior: a n = 1 no hay varianza que medir, así que lo único que protege al ítem son las cuatro estrategias ejecutadas y los gates. Y EL AVISO QUE NO SE PUEDE PERDER: un 1/1 aquí NO es dominio de la pasiva rumana — mide el orden y la forma de un grupo clítico. Que la pasiva perifrástica y la refleja de este alumno sean gratis es un RESULTADO, no una carencia del lote. REPARTO CON r6, declarado porque si no el siguiente lo leerá como una casilla robada: el eje del ALOMORFO del dativo ante otro clítico (le→li) lo dictaminó el lote 28 bajo r6-contracciones-cliticos y lo dejó FUERA porque ninguno de sus dos lados estaba determinado con «-o» de vecino (ni-o 2, vi-o 9). Aquí el vecino es «se» y los datos son otros —li se 264, le se 0 genuinas—, así que la celda SÍ está determinada; se publica bajo r7 porque la construcción sólo surge en la pasiva refleja con complemento indirecto, que es lo que r7-pasiva-impersonal se llama. ⚠ Y EL DESCRIPTOR DEL PUNTO QUEDA SIN ATENDER: su cita es «Pasiva con a fi + participio, con concordancia», y este ítem no hace eso — el contador dirá «cubierto (1)» y ningún ítem toca la cita.',
  },
};

if (/[/\\]trans-ro-l30\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 30 · transformación · ${ITEMS.length} ítems · ${PUNTO}\n`);
  if (process.argv.includes('--asigna')) {
    const a = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s, hintEs: x.hint ?? '', answer: x.r })));
    for (const l of a.lineas) console.log(l);
    process.exit(a.desvio ? 1 : 0);
  }
  for (const x of CONSTRUIDOS) console.log(`- [${x.d.persona}] \`${x.s}\` → \`${x.r}\`  (foco ${x.foco} · núcleo ${x.nucleo})`);
  console.log('');
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}
