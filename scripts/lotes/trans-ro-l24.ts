// scripts/lotes/trans-ro-l24.ts — LOTE 24: `r5-imperativo-negativo`.
//
//   npx tsx scripts/lotes/trans-ro-l24.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-ro-l24.ts --asigna   # a qué punto cuenta cada ítem
//
// El punto llevaba ocho ítems PUBLICADOS en formato de corrección y se
// retiraron enteros: de los ocho, tres se resolvían traduciendo, dos
// declaraban como mala un error de GENERADOR que ningún alumno comete, y
// sólo tres eran corrección legítima. El diagnóstico que lo mandó aquí es
// el §0.4/3: la dificultad de este punto es lo que el alumno NO pone.
//
// ══ LA REGLA, DERIVADA Y NO ESCRITA A MANO ═══════════════════════════
//
//   2.ª SG:  `nu` + INFINITIVO CORTO, sin excepción léxica
//   2.ª PL:  `nu` + el AFIRMATIVO plural (que NO es el presente: `a fi`)
//
// Las dos casillas salen de `imperativNegativ()` del paradigma, que entró
// en el repo justo antes de este lote. El lote 23 escribió sus nueve
// claves a mano; hacerlo dos veces es «la regla copiada que se
// desincroniza» (§4.10), así que **aquí no hay ni una forma escrita a
// mano en la respuesta**: el lote declara el lema y el número y la clave
// se deriva. (GALR I, *Verbul · Imperativul*; GBLR 2010; DOOM3 2021.)
//
// ══ LO QUE ES GRATIS AQUÍ, Y ES CASI TODO ════════════════════════════
//
// Éste es el hallazgo que recompuso el lote entero, y viene de dos
// dictámenes independientes más una orden del coordinador. **El criterio
// no es «¿esto es la regla del punto?» sino «¿el alumno llega ya
// produciéndolo?». El termómetro mide al alumno, no al temario.** Con ese
// criterio, el hispanohablante tiene DOS rutas de transferencia, y cada
// una resuelve UNA de las dos casillas sin haber aprendido nada:
//
//   · **RUTA DEL INFINITIVO** → resuelve el SINGULAR. El español tiene
//     «no» + infinitivo como prohibitivo productivo («No fumar», «No
//     tocar»); el infinitivo corto rumano **es la forma de cita del
//     diccionario** menos la `a`; y el alumno ya lo produce en
//     `voi merge`, `pot veni`, `până a nu pleca`. Escrita como función:
//     `RUTA_DEL_INFINITIVO`.
//   · **RUTA DEL SUBJUNTIVO** → resuelve el PLURAL. La ruta natural del
//     español para una prohibición dirigida es el subjuntivo («no
//     vengáis»), y su equivalente rumano es el conjuntivo. Medido sobre
//     el lexicón entero: `conjunctiv(v, 'voi')` coincide con el
//     afirmativo plural en **39 de 39 verbos, `a fi` incluido**, o sea
//     que la ruta acierta el plural SIEMPRE. Escrita como función:
//     `RUTA_DEL_SUBJUNTIVO`.
//
// **Ninguna de las dos resuelve las dos casillas, y ésa es la única
// cosa que este punto puede examinar.** La ruta del infinitivo dicha a
// dos personas produce `*Nu veni!`; la del subjuntivo dicha a una
// produce `*Nu vii!`. Por eso el lote es 4 y 4: con el reparto
// equilibrado **cada ruta acierta exactamente la mitad, que es el AZAR
// de una elección binaria**, y lo que separa acertar las ocho de acertar
// cuatro es haber aprendido que la casilla depende del NÚMERO.
//
// Y por eso también el lote se queda en 8 y no crece: cargar más de un
// lado subiría una de las dos rutas por encima del tope. Subir el tope
// sería falsear el termómetro; recomponer el lote es arreglar el examen.
//
// ══ EL CRUCE DE NÚMERO, Y DÓNDE NO SE PUEDE HACER ════════════════════
//
// Los cuatro ítems de PLURAL llevan la fuente en SINGULAR. Sin ese cruce
// —fuente y respuesta en el mismo número— el plural entero se contesta
// copiando, porque el negativo plural ES el afirmativo plural: era el
// defecto de la v0 de este lote, que imprimía `copiar-el-foco` 4 de 9.
//
// **El cruce inverso NO se puede hacer, y está medido**: con la fuente en
// plural, quitarle `-ți` al afirmativo plural da el infinitivo corto en
// **34 de los 39 verbos del lexicón** (falla sólo en `avea`, `bea`,
// `vedea`, `coborî`, `hotărî`), o sea que la respuesta del singular se
// obtendría con una edición mecánica de dos letras. Los cuatro ítems de
// singular llevan por eso la fuente en singular, donde copiar da el
// afirmativo y el afirmativo no es el infinitivo salvo en la 3.ª
// conjugación — que es justo el ítem de copia declarado.
//
// ══ LO QUE ESTE LOTE NO TOCA ═════════════════════════════════════════
//
// **Ni un reflexivo.** `Du-te!` → `Nu te duce!` sería la frontera obvia y
// es el punto de al lado: un fallo ahí es inatribuible entre no saber la
// forma negativa y no saber dónde va el clítico
// (`r6-cliticos-imperativo-gerunziu`). Misma decisión que en el lote 23.
// **El coste, y va para la LECCIÓN, no para un ítem:** el punto nunca
// muestra que la regla SOBREVIVE al clítico, así que la lección tiene que
// decir «también con pronombre la casilla es la misma: `Du-te!` → `Nu te
// duce!`» o el alumno concluirá que la regla es sólo para verbos
// desnudos. Y lo mismo con la TERCERA forma prohibitiva, que este lote
// excluye por la consigna y no puede marcar mal: `să nu` + conjuntivo
// (`Să nu vii!` ×4, `nu cumva să` ×131) está viva en las dos personas y
// es la única disponible para 1.ª pl y 3.ª. Un alumno que sólo vea dos
// casillas concluirá que `Să nu vii!` está mal, que es el asterisco por
// omisión que persigue el §0.
//
// **Ni el SINGULAR de `a fi`.** Y el motivo es de una línea: en este lote
// `fii` aparece SÓLO como fuente —afirmativo, dado, indiscutido— y la
// respuesta es `fiți`, así que **el singular de `a fi` no hay que
// producirlo nunca**. La v0 daba otros dos motivos y los dos eran malos,
// y quedan escritos porque son la clase de error que el §0 persigue:
// (1) decía que exigir `nu fi` contra `nu fii` necesitaría cita normativa
// que el lote no tiene — **la cita existe**: GALR I, *Verbul ·
// Imperativul*, da el negativo de 2.ª sg = infinitivo corto sin excepción
// listada, y el infinitivo corto de `a fi` es `fi`; (2) apoyaba eso en
// «`nu fii` sale 30 veces», y de las 30 **17 son `să nu fii`**
// (conjuntivo, donde `fii` ES la forma correcta), ~13 son imperativos de
// Anton Pann y una es habla no nativa que el propio Caragiale marca —
// mientras `nu fi` da 146 con decenas de imperativos limpios en el mismo
// corpus. **El número con el que se justificó la exclusión decía lo
// contrario de lo que se le hizo decir**: es el §0.7 al revés, no fiarse
// de un positivo sin haber visto qué cazó. Lo que esos ~13 sí impiden es
// llamar `nu fii` AGRAMATICAL: es variante popular decimonónica.
//
// **Ni un par que se distinga sólo por el diacrítico.** `Lasă ușa!` →
// `Nu lăsa ușa!` estaba en el borrador y se cayó al medirlo: `lasă` y
// `lăsa` son la MISMA cadena una vez normalizada, o sea que el ítem se
// contesta copiando y lo único que examina es cuál de las dos vocales
// lleva la breve. Lo cazó la propia máquina.
import { verificar, informe, correr, type ItemTransRo, type Opciones, type Estrategia, type Comprobacion, norm } from '../lib/transformacion-ro';
import { informeAsigna } from '../lib/asigna-ro';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { imperativNegativ, infinitivoCorto, conjunctiv, type LemaVerbal } from '../lib/paradigma-ro';

const NEG = 'r5-imperativo-negativo';

/** LAS CONSIGNAS, escritas UNA vez. **Cierran por la FORMA de la frase
 *  entera, no por una etiqueta ni por una lista de prohibiciones**, y esa
 *  redacción la trajo el lingüista tras tumbar la anterior:
 *
 *   · La v0 decía «empieza la frase por la negación» y **no bastaba**:
 *     `Nu cumva să vii mâine!` empieza por la negación, usa el mismo
 *     verbo, no lleva pronombre — y es rumano vivo y productivo
 *     (`nu cumva să` ×131 en el corpus, `nu care cumva să` ×19; dexonline
 *     s.v. *cumva*, valor prohibitivo). La tarjeta lo habría suspendido.
 *   · La v1 añadía «exactamente una palabra más», que sí lo cierra pero
 *     obliga al alumno a contar y no dice qué hacer con el orden.
 *   · La v2 decía «la MISMA frase con `nu` delante… sin añadir ni quitar
 *     ninguna otra palabra» y **seguía sin cerrar dos**, porque el
 *     recuento no dice nada del ORDEN ni del clítico: `Nu o citi!` y
 *     `Nu îi luați!` son rumano correcto con el mismo verbo y una
 *     palabra más —es lo que un rumano diría de hecho—, y `Mâine nu
 *     veni!` y `Fără mine nu începe!` también, con el complemento
 *     antepuesto, que está **ATESTADO** y es justo como la lengua real
 *     dice el ítem del dinero: «Bani nu lua cu tine, nici merinde»,
 *     «Arme nu lua din cele sclipicioase» (Creangă, Ispirescu).
 *   · **«Las mismas palabras, en el mismo orden, sin añadir ni quitar
 *     ninguna otra»** cierra las seis de una vez —`Să nu vii mâine!`,
 *     `Nu cumva să vii mâine!`, `Nu mai veni mâine!`, `Nu veni tu
 *     mâine!`, `Mâine nu veni!` y `Nu o citi!`— e implica el «+1» sin
 *     enunciarlo, así que el alumno no tiene que contar y desaparece la
 *     duda de si `nu-i` cuenta como una palabra o como dos.
 *   · **«tuteándolo»** en la del singular cierra la última, y es la que
 *     más daño haría: `Nu veniți mâine!` es rumano correcto dirigido a
 *     UNA persona de usted, con el mismo verbo, el mismo orden y una
 *     palabra más — y coincide letra por letra con la clave de la
 *     casilla plural, o sea que le colapsaría al alumno el contraste que
 *     el lote entero existe para enseñar. Un hispanoamericano que tutea
 *     poco habría llegado ahí solo.
 *
 *  **Y una cláusula que se CAYÓ, porque era ambigua justo al revés de lo
 *  que pretendía.** «No pongas pronombre» quería cerrar `Nu veni tu!`;
 *  para un hispanohablante «pronombre» es primero el CLÍTICO de objeto
 *  (le/lo/la), así que leía «no escribas `Nu-i lua!`» — le prohibía la
 *  respuesta natural por una razón que no es la del punto. La forma de la
 *  frase entera cierra las dos sin nombrar ninguna categoría. */
const PROHIBE_SG = 'Dile a tu amigo, tuteándolo, que NO haga eso: escribe la misma frase con «nu» delante y el verbo en la forma que toque — las mismas palabras, en el mismo orden, sin añadir ni quitar ninguna otra.';
const PROHIBE_PL = 'Diles a tus dos amigos que NO hagan eso: escribe la misma frase con «nu» delante y el verbo en la forma que toque — las mismas palabras, en el mismo orden, sin añadir ni quitar ninguna otra.';

const lema = (inf: string): LemaVerbal => {
  const v = VERBOS_A1.find((l) => l.inf === inf);
  if (!v) throw new Error(`el lote 24 pide «${inf}», que no está en el lexicón`);
  return v;
};

/** El imperativo AFIRMATIVO de 2.ª sg, que es lo ÚNICO que este lote
 *  escribe a mano — el paradigma no lo deriva todavía y es el contenido
 *  del punto prerrequisito (`r3-imperativo-afirmativo`, lote 23), no de
 *  éste. Cada forma con su piso, y el orden de evaluación importa (GALR I
 *  *Imperativul*; DOOM3 2021; tablas de dexonline):
 *    (A) supletivo: vino, fă, ia   (B) clase → 3.ª sg: citește, mănâncă,
 *    așteaptă, începe   (C) resto → 2.ª sg: mergi. Y `fii` (a fi). */
const AFIRMATIVO_SG: Record<string, string> = {
  'a veni': 'vino', 'a face': 'fă', 'a lua': 'ia', 'a citi': 'citește',
  'a mânca': 'mănâncă', 'a aștepta': 'așteaptă', 'a începe': 'începe',
  'a merge': 'mergi', 'a fi': 'fii',
  'a bea': 'bea', 'a avea': 'ai', 'a vedea': 'vezi', 'a coborî': 'coboară',
};

/** Un ítem se declara con LEMA, NÚMERO de destino y el resto de la frase.
 *  **La respuesta no se escribe: se deriva** de `imperativNegativ()`, que
 *  es la única fuente de verdad de las dos casillas. Escribirla a mano
 *  sería la segunda copia de la regla, y una regla copiada se
 *  desincroniza en la copia que nadie actualiza (§4.10). */
const item = (inf: string, numero: 'sg' | 'pl', resto: string, extra: Partial<ItemTransRo> = {}): ItemTransRo => {
  const v = lema(inf);
  const foco = AFIRMATIVO_SG[inf];
  const nucleo = imperativNegativ(v, numero);
  if (!foco || !nucleo) throw new Error(`el lote 24 no puede construir «${inf}» en ${numero}`);
  return {
    p: NEG, pasada: 1, espejoEs: numero === 'pl', transparenteLatin: false,
    s: `${foco[0]!.toUpperCase()}${foco.slice(1)} ${resto}!`,
    instruccion: numero === 'sg' ? PROHIBE_SG : PROHIBE_PL,
    r: `Nu ${nucleo} ${resto}!`,
    foco, nucleo, ...extra,
  };
};

export const ITEMS: ItemTransRo[] = [
  // ══ CUATRO DE SINGULAR · `nu` + INFINITIVO CORTO ══════════════════
  // La fuente va en singular: copiar da el afirmativo, y el afirmativo no
  // es el infinitivo salvo en la 3.ª conjugación. Poner la fuente en
  // plural regalaría la respuesta quitando `-ți` (34 de 39 verbos).
  item('a citi', 'sg', 'ziarul'),                // sufijo -esc: citește → citi
  item('a mânca', 'sg', 'supa'),                 // alternancia: mănâncă → mânca
  // EL ÚNICO ÍTEM DEL LOTE QUE EL ESPAÑOL REGALA ENTERO, y por eso NO va
  // el primero: `Nu veni luni!` es literalmente «No venir el lunes» menos
  // la `-r`. No es «raíz transparente»: es la cadena completa de la
  // respuesta saliendo de una frase española. Verbo por verbo, el truco
  // sólo funciona aquí (leer→lee≠citi, comer→come≠mânca, beber→bebe≠bea,
  // ver→ve≠vedea, bajar→baja≠coborî), así que uno de ocho y declarado.
  item('a veni', 'sg', 'luni', { transparenteLatin: true }),
  // LA COPIA LEGÍTIMA, y va declarada. En la 3.ª conjugación el
  // afirmativo YA ES el infinitivo corto, así que la regla se aplica
  // entera y no cambia nada. Sin él, el lote enseñaría «al negar, la
  // forma siempre cambia», que en rumano es falso: `spune`, `scrie`,
  // `pune`, `începe`, `zice`, `merge` se comportan igual. Y carga más
  // peso del que parece: con el cruce de número los cuatro plurales SÍ
  // cambian de forma, así que es el ÚNICO ítem donde el alumno ve que
  // negar puede no cambiar nada. Aviso del lingüista: `Nu începe fără
  // noi!` no tiene NI UNA atestación como imperativo en los 2,9 M de
  // palabras — la ausencia no prohíbe (§0.4/2) y la derivación es
  // impecable, pero este ítem se sostiene sólo en la regla.
  item('a începe', 'sg', 'fără noi'),            // începe → începe

  // ══ CUATRO DE PLURAL · `nu` + el AFIRMATIVO plural ════════════════
  // Los cuatro son ítems de SOBREAPLICACIÓN, y ahora contra DOS reglas
  // falsas a la vez (ver `RUTA_COMPUESTA` y la aritmética en `OPCIONES`):
  // la del singular aplicada al plural (`*Nu bea apa!` a dos personas) y
  // la del atajo `infinitivo + -ți`, que produce `*Nu beați`, `*Nu
  // aveați`, `*Nu vedeați`, `*Nu coborîți` — las tres primeras son
  // IMPERFECTOS y la cuarta es grafía antigua.
  //
  // **LOS CUATRO VERBOS ESTÁN ELEGIDOS, y el criterio va escrito.** Son
  // los de 2.ª conjugación y `-î`, que es exactamente el residuo donde el
  // atajo falla: `infinitivoCorto + 'ți'` da el imperativo afirmativo
  // plural en **34 de los 39 verbos del lexicón**, y los cinco que fallan
  // son `avea`, `bea`, `vedea`, `coborî`, `hotărî`. Elegirlos no es
  // esquivar el gate: es que el punto sólo puede enseñarse donde el
  // atajo no lo resuelve, y ese residuo son además verbos de altísima
  // frecuencia.
  item('a bea', 'pl', 'apa', { sobreaplicacion: true }),
  item('a avea', 'pl', 'grijă', { sobreaplicacion: true }),
  item('a vedea', 'pl', 'filmul', { sobreaplicacion: true }),
  item('a coborî', 'pl', 'aici', { sobreaplicacion: true }),
];

/** De la forma que el alumno tiene delante al LEMA. La tabla de
 *  supletivos es la misma del lote 23 y con su fuente: son imperativos
 *  afirmativos que no salen de ninguna casilla del presente, así que sin
 *  ella las dos estrategias devolverían null sobre `vino`, `fă` e `ia` y
 *  saldrían artificialmente bajas — una estrategia que no puede disparar
 *  sobre parte del lote es el §4.18. */
const LEMA_DEL_AFIRMATIVO = new Map(Object.entries(AFIRMATIVO_SG).map(([inf, imp]) => [norm(imp), inf]));
const lemaDelFoco = (foco: string) => {
  const inf = LEMA_DEL_AFIRMATIVO.get(norm(foco));
  return inf ? lema(inf) : null;
};
const esPlural = (x: { instruccion: string }) => x.instruccion === PROHIBE_PL;

/** RUTA 1 · EL INFINITIVO. Es la que el coordinador cerró como estrategia
 *  LIBRE, y la razón va escrita porque es la decisión más discutida del
 *  lote: el criterio no es si la ruta coincide con la regla que el punto
 *  declara enseñar, sino si el alumno llega ya produciéndola. Llega, por
 *  tres vías independientes: «No fumar» es prohibitivo productivo en
 *  español, el infinitivo corto ES la forma de cita del diccionario, y ya
 *  lo produce en `voi merge` y `pot veni`. Acierta los cuatro singulares
 *  y falla los cuatro plurales. */
export const RUTA_DEL_INFINITIVO: Estrategia = {
  nombre: 'ruta del infinitivo: «no» + la forma de cita del diccionario',
  aplicar(x) {
    const v = lemaDelFoco(x.foco);
    return v ? infinitivoCorto(v.inf) : null;
  },
};

/** RUTA 2 · EL SUBJUNTIVO. La ruta natural del español para una
 *  prohibición dirigida, cuyo equivalente rumano es el conjuntivo. Se le
 *  pide al PARADIGMA —`conjunctiv()`, no `imperativAfirmativ2pl()`—
 *  porque pedírselo a la casilla que el lote enseña sería leerse la
 *  respuesta. Que coincidan en los 39 verbos del lexicón, `a fi`
 *  incluido, es un HECHO medido de la lengua y es justo lo que hace que
 *  esta ruta acierte el plural entero. */
export const RUTA_DEL_SUBJUNTIVO: Estrategia = {
  nombre: 'ruta del subjuntivo: el conjuntivo de la persona a la que se habla',
  aplicar(x) {
    const v = lemaDelFoco(x.foco);
    return v ? conjunctiv(v, esPlural(x) ? 'voi' : 'tu') : null;
  },
};

/** LA TERCERA RUTA, Y LA QUE TUMBÓ EL LOTE YA PUBLICADO.
 *
 *  No es una ruta nueva: es la del infinitivo MÁS la marca de plural, que
 *  en rumano es `-ți` en todos los tiempos y sin excepción, o sea
 *  morfología de A1 que el alumno ya tiene. La regla falsa completa es
 *  **«negativo = `nu` + infinitivo corto, y si son dos, `+ți`»**, y
 *  resuelve las DOS casillas con una sola idea.
 *
 *  Medido, no razonado: `infinitivoCorto + 'ți'` coincide con el
 *  imperativo afirmativo plural en **34 de los 39 verbos del lexicón**.
 *  Sobre la v2 de este lote —cuyos plurales eran `a fi`, `a aștepta`,
 *  `a lua` y `a merge`— acertaba **8 de 8**: el lote entero se contestaba
 *  sin saber ninguna de las dos casillas, y los ocho ítems llegaron a
 *  publicarse. Se retiraron. **Es §4.25 otra vez y en su forma más cara:
 *  ocho ítems correctos, gates verdes, y una estrategia que nadie había
 *  escrito.** */
export const RUTA_COMPUESTA: Estrategia = {
  nombre: 'ruta compuesta: el infinitivo corto, y «-ți» si son dos',
  aplicar(x) {
    const v = lemaDelFoco(x.foco);
    if (!v) return null;
    return infinitivoCorto(v.inf) + (esPlural(x) ? 'ți' : '');
  },
};

/** LA REGULARIDAD QUE DEJA EL CRUCE DE NÚMERO, y la pregunta obligatoria
 *  al cerrar una estrategia es qué regularidad deja el cierre. Con la
 *  fuente en singular en los ocho, la edición mecánica que resolvería el
 *  plural sería «pégale `-ți` al afirmativo singular». **No se razona,
 *  se ejecuta:** acierta 0 de 8, porque el plural rumano no se forma
 *  sobre el imperativo singular sino sobre el tema (`fii`→`*fiiți` por
 *  `fiți`, `așteaptă`→`*așteaptăți` por `așteptați`, `ia`→`*iați` por
 *  `luați`, `mergi`→`*mergiți` por `mergeți`). El cero es la prueba de
 *  que el cruce no abrió una puerta de tijeras como la que cerró. */
export const PEGARLE_TI: Estrategia = {
  nombre: 'pegarle «-ți» al imperativo afirmativo singular',
  aplicar: (x) => (esPlural(x) ? x.foco + 'ți' : null),
};

/** La estrategia de FRASE ENTERA, que contra el núcleo no se ve: «copio
 *  la fuente y le pongo `nu` delante». Es lo que un alumno hace de punta
 *  a punta sin haber aprendido nada, y cumple además la cláusula del
 *  recuento de la consigna, así que la tarjeta la aceptaría si acertara. */
export const ANTEPONER_NU: Estrategia = {
  nombre: 'ponerle «nu» delante a la fuente y no tocar nada más',
  objetivo: 'respuesta',
  aplicar: (x) => 'Nu ' + x.s.charAt(0).toLowerCase() + x.s.slice(1),
};

/** LAS AFIRMACIONES DEL LOTE, EJECUTABLES CONTRA LOS 2,9 M DE PALABRAS.
 *
 *  ⚠ **LAS DE LA FORMA `nu` + INFINITIVO NO SE PUEDEN COMPROBAR AQUÍ, Y
 *  ESO ES UN DATO DEL PUNTO, NO UNA PEREZA.** `nu veni`, `nu pleca` y
 *  `nu intra` dan 8, 11 y 21 con límite de palabra, y leídas con contexto
 *  son casi todo imperfecto, perfecto simple o `până a nu` + infinitivo:
 *  **no hay un solo verbo del lexicón cuya cadena `nu` + infinitivo sea
 *  inequívoca** —choca con el imperfecto en la 1.ª y 2.ª conjugación, con
 *  el presente en la 3.ª y con el perfecto simple en la 4.ª—. Un recuento
 *  que no distingue homógrafos cuenta de más, así que esas cifras no
 *  entran como comprobación. Da igual en producción, que es este formato;
 *  tumbaría el punto entero si alguien lo heredara a un cloze o a un
 *  juicio, y por eso queda escrito.
 *
 *  Lo que SÍ se comprueba son las afirmaciones de las que cuelgan las
 *  decisiones del lote, y todas son de formas plurales o de `să`, que no
 *  son homógrafas de nada. */
export const COMPROBACIONES: Comprobacion[] = [
  // LA CASILLA DEL SINGULAR. Los patrones son largos A PROPÓSITO: `nu
  // lua` a secas da 14 y `nu mânca` da 5, pero la mayoría son indicativo
  // (`nu lua seama`, `spre a nu lua`). Estas dos cadenas no admiten otra
  // lectura que la imperativa (Creangă, *Povestea lui Harap-Alb* y
  // *Povestea lui Stan Pățitul*).
  { afirmacion: 'la 2.ª sg negativa es «nu» + infinitivo corto (Creangă: «Bani nu lua cu tine, nici merinde»)', patron: 'nu lua cu tine', espera: 'presente' },
  { afirmacion: 'y con verbo de 1.ª conjugación (Creangă: «Măi tartorule, nu mânca haram»)', patron: 'nu mânca haram', espera: 'presente' },
  // LAS DOS CASILLAS A LA VEZ, y es la atestación más fuerte que hay en
  // el corpus: el reflexivo fija la persona, así que ninguno de los dos
  // conteos puede estar contaminado por un homógrafo. `a teme` no está
  // en el lexicón A1 y da igual: esto atesta la REGLA, no un ítem.
  { afirmacion: 'la 2.ª sg negativa, con el clítico fijando la persona: «nu te teme»', patron: 'nu te teme', espera: 'presente' },
  { afirmacion: 'y la 2.ª pl, que es la forma del afirmativo: «nu vă temeți»', patron: 'nu vă temeți', espera: 'presente' },
  // LA CASILLA DEL PLURAL con `nu` desnudo, sin el `să` que sería otra
  // construcción, y con complemento que fija la lectura imperativa.
  { afirmacion: 'el plural negativo con «nu» desnudo (Alecsandri, Ispirescu: «Nu uitați că de la voi așteaptă mult patria»)', patron: '(?<!să )nu uitați (că|niciodată)', espera: 'presente' },
  { afirmacion: 'y con el verbo de un ítem del lote: «nu veniți înlăuntru»', patron: 'nu veniți înlăuntru', espera: 'presente' },
  // POR QUÉ LA CONSIGNA CIERRA POR LA FORMA DE LA FRASE. Las dos
  // construcciones que compiten son lengua viva y no se marcan mal.
  { afirmacion: '«să nu» + conjuntivo es prohibitiva viva de 2.ª sg', patron: 'să nu vii', espera: 'presente' },
  { afirmacion: '«nu cumva să» es prohibitiva viva y EMPIEZA por la negación: por eso «empieza por la negación» no bastaba', patron: 'nu cumva să', espera: 'presente' },
  // LOS VERBOS DEL PLURAL, atestados en su casilla.
  { afirmacion: 'la casilla del plural con a vedea: «nu vedeți»', patron: 'nu vedeți', espera: 'presente' },
  { afirmacion: 'y con a avea, en su forma más corriente: «n-aveți grijă» / «nu aveți grijă»', patron: '(n-|nu )aveți grijă', espera: 'presente' },
];

export const OPCIONES: Opciones = {
  // Igual que el 23: publicado en el orden escrito y medido limpio el
  // 2026-09-04. El eje singular/plural va DICHO en la consigna, así que
  // agruparlos no le regala nada a nadie.
  semilla: 'orden-escrito',
  comprobaciones: COMPROBACIONES,
  // LAS DOS RUTAS DE TRANSFERENCIA VAN LAS DOS EN EL TOPE, por orden del
  // coordinador y contra el argumento que este mismo fichero defendía en
  // su v0. El termómetro mide al alumno, no al temario: si acierta por
  // transferencia, no ha aprendido nada, aunque lo transferido coincida
  // con lo que el punto dice enseñar.
  //
  // ══ Y LA ARITMÉTICA QUE DEMUESTRA QUE EL CRUCE DE NÚMERO NO ERA UNA
  //    MEJORA, SINO LA ÚNICA SALIDA ══════════════════════════════════
  // La trajo el lingüista atacando la v0, y es lo más transferible del
  // ataque. Con la fuente en el MISMO número que la respuesta, sean `C`
  // los singulares cuya forma cambia, `I` los de identidad (`începe`) y
  // `P` los plurales, con `n = C+I+P`. Entonces:
  //
  //     copiar-el-foco       acierta  I + P   (el plural copia, y la identidad copia)
  //     ruta-del-infinitivo  acierta  C + I   (todos los singulares)
  //
  // Exigir que las dos pasen el tope obliga a
  //     (I+P)/n ≤ ½  y  (C+I)/n ≤ ½  ⇒  sumando  n + I ≤ n  ⇒  I ≤ 0.
  //
  // O sea: **con la fuente en el mismo número, conservar UN SOLO ítem de
  // identidad hace matemáticamente imposible que las dos estrategias
  // pasen.** No hay reparto que lo salve, y la única salida sería `I = 0`
  // — enseñando «al negar la forma siempre cambia», que es falso en
  // rumano y es justo lo que el juicio `copia` existe para impedir.
  //
  // **El cruce de número rompe la desigualdad**, y por eso está aquí y no
  // por elegancia: con la fuente del plural en singular, copiar deja de
  // acertar los plurales y la primera cuenta pasa de `I+P` a `I`. La
  // condición se relaja a `I ≤ n/2` y `C+I ≤ n/2`, que con 3+1+4 se
  // cumple con 1/8 y 4/8. **Ninguna estrategia queda fuera del tope: no
  // hay exención que auditar.** Que la v0 necesitara una era el síntoma,
  // no el problema.
  //
  // ══ Y LA SEGUNDA DESIGUALDAD, QUE LLEGÓ DESPUÉS DE PUBLICAR ═══════
  // La ruta compuesta obliga a una cuenta más. Sean `S` los singulares,
  // `P` los plurales y `H` los plurales que el atajo `infinitivo + -ți`
  // acierta:
  //
  //     ruta del subjuntivo  acierta  P        ⇒  P ≤ n/2
  //     ruta compuesta       acierta  S + H    ⇒  S + H ≤ n/2
  //
  // Con `S + P = n`, las dos juntas dan `S ≥ n/2` y `P ≥ n/2`, o sea
  // **`S = P = n/2` y `H = 0`**. No es una preferencia: **ningún lote de
  // este punto puede contener un solo plural cuyo atajo funcione.** Y
  // como `a fi` es justamente uno de ésos —`fi` + `ți` = `fiți`, por
  // coincidencia— la elección entre las dos reglas falsas quedaba
  // decidida por aritmética antes que por pedagogía. Está escrita en
  // `juicios.frontera`.
  estrategias: [RUTA_DEL_INFINITIVO, RUTA_DEL_SUBJUNTIVO, RUTA_COMPUESTA, ANTEPONER_NU, PEGARLE_TI],
  juicios: {
    copia: 'UNO de ocho se contesta copiando el foco, y es la lengua y no un descuido: en `Începe fără mine!` el imperativo afirmativo de la 3.ª conjugación YA ES el infinitivo corto, así que la regla se aplica entera y no cambia nada. Sin ese ítem el lote enseñaría «al negar, la forma siempre cambia», que en rumano es falso y lo desmienten `spune`, `scrie`, `pune`, `zice`, `merge`. Y no puede haber más de uno: los otros tres singulares tienen que separar el afirmativo del infinitivo para examinar algo, y los cuatro plurales llevan la fuente en SINGULAR justo para que copiar no acierte — sin ese cruce de número el plural entero se contestaría copiando, porque el negativo plural ES el afirmativo plural, y ése era el defecto de la v0 de este lote, que imprimía 4 de 9. Medido ejecutando: copiar el foco 1/8, copiar la frase entera 0/8, ponerle «nu» delante a la fuente 1/8, la edición modal del lote 1/8.',
    frontera: 'Los CUATRO PLURALES son los ítems de sobreaplicación, y lo son contra DOS reglas falsas a la vez, no una. (1) La del singular aplicada al plural: quien aprenda «negativo = nu + infinitivo corto» y no la restricción de número escribe *Nu bea apa! a dos personas, que es el error que la propia descripción del punto declara. (2) El ATAJO «infinitivo + -ți», que es la primera regla más la marca de plural del rumano —morfología de A1 que el alumno ya tiene— y que resuelve LAS DOS casillas con una sola idea: medido, infinitivoCorto + ti coincide con el imperativo afirmativo plural en 34 de los 39 verbos del lexicón. Los cuatro plurales son exactamente el residuo donde falla (a bea, a avea, a vedea, a coborî: 2.ª conjugación y -î), así que producen *Nu beați, *Nu aveați, *Nu vedeați —los tres son IMPERFECTOS— y *Nu coborîți, que es grafía antigua. Elegir esos cuatro verbos no es esquivar el gate: es que el punto sólo se puede examinar donde el atajo no lo resuelve, y ese residuo son además verbos de altísima frecuencia. LO QUE ESTE LOTE NO DEFIENDE, Y VA ESCRITO PORQUE ES UNA ELECCIÓN: la tercera regla falsa, «plural negativo = PRESENTE de 2.ª pl», que sólo `a fi` desmiente (fiți frente a sunteți) y que es el único verbo del rumano donde las dos formulaciones se separan. No cabe: `a fi` es también el único irregular al que el atajo `infinitivo + -ți` ACIERTA (fi + ti = fiți), así que meterlo aquí sube el atajo por encima del tope. Se defiende donde le toca, en la prosa del punto y en la lección, con la cita de GALR I. La regla falsa que este lote SÍ ataca es incorrecta para 8 verbos del lexicón; la que deja fuera, para uno.',
    varianza: 'La pieza «+nu» es INVARIANTE en los ocho, y es invariancia de la LENGUA y no del diseño: el rumano no tiene forma prohibitiva de 2.ª persona que omita `nu`, igual que en `r3-negacion-antepuesta`, el caso que la pasada de varianza declaró legítimo por esta misma razón. Lo que varía en su lugar, y ES el punto, es la CASILLA de la que sale la forma verbal: infinitivo corto en los cuatro del singular y afirmativo plural en los cuatro del plural. Y lo que hace que la varianza sea real y no decorativa es que el alumno tiene UNA ruta de transferencia para cada casilla y ninguna para las dos: la ruta del infinitivo acierta 4/8 y la del subjuntivo acierta 4/8, que en una elección binaria es exactamente el azar. Con el reparto cargado a un lado, una de las dos pasaría del tope y el lote estaría certificando transferencia; con el reparto equilibrado, lo único que separa 8 de 4 es haber aprendido que la casilla depende del número. Ésa es también la razón de que el lote se quede en ocho. LO QUE ESTE JUICIO NO PUEDE PRESUMIR, y lo dijo el lingüista atacándolo: de lo que varía DENTRO del singular, tres cuartos no son negación sino recuperación del lema (vino→veni es `r3-irregulares-a1` puro) y alternancia radical (mănâncă→mânca es `r2-alternancia-vocalica`), o sea material de otros dos puntos. El punto propio aporta UN bit —de qué casilla sale la forma— y lo repite en los ocho ítems. Se acepta, y no porque la distancia sea una virtud: se acepta porque la fuente da el AFIRMATIVO y no el infinitivo, así que el ítem no se puede contestar sin haber decidido primero la casilla, y porque la confusión de léxico y la de casilla producen respuestas DISTINGUIBLES (*Nu vino mâine! frente a *Nu vii mâine!), o sea que un fallo aquí no es inatribuible — sólo es caro. Y EL CRUCE DE NÚMERO EXTIENDE ESE PRECIO AL PLURAL, que antes no lo tenía: con la fuente en singular, `Așteaptă afară!` → `Nu așteptați afară!` exige deshacer la alternancia ea→e ADEMÁS de poner -ți, y `Ia banii!` → `Nu luați banii!` exige recuperar el lema `a lua` desde `ia`. Siete de los ocho ítems (todos menos `începe`) llevan encima una recuperación de forma que pertenece a otros dos puntos, y NINGÚN ítem del lote las separa. El cruce sigue estando bien decidido —con fuente plural se copia, y el cruce inverso da el infinitivo con unas tijeras en 34 de 39 verbos— pero el precio es real y va escrito aquí en vez de descubrirlo el lote 25.',
  },
};

if (/[/\\]trans-ro-l24\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 24 · transformación · ${ITEMS.length} ítems\n`);
  if (process.argv.includes('--asigna')) {
    const a = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s, hintEs: x.hint ?? '', answer: x.r })));
    for (const l of a.lineas) console.log(l);
    process.exit(a.desvio ? 1 : 0);
  }
  for (const x of ITEMS) console.log(`- \`${x.s}\` → \`${x.r}\`  (${esPlural(x) ? 'PL' : 'SG'}: ${x.foco} → ${x.nucleo})`);
  console.log('');
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}
