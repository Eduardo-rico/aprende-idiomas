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
//
// **Ni el SINGULAR de `a fi`.** `nu fii` sale **30 veces** en el corpus
// del proyecto con límite de palabra, así que exigir `nu fi` contra `nu
// fii` necesitaría cita normativa que este lote no tiene (§0). El PLURAL
// de `a fi` sí entra, y es el ítem que más trabaja: ver abajo.
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

/** LAS CONSIGNAS, escritas UNA vez. Cada cláusula cierra una salida que
 *  es rumano correcto y que la tarjeta suspendería:
 *
 *   · «usa el mismo verbo» ata el LEXEMA — sin eso, `Nu mai veni!` y
 *     `Stai acasă!` son maneras naturales de dar la misma prohibición.
 *   · **«exactamente una palabra más» cierra por RECUENTO**, y ésa es la
 *     cláusula que hace el trabajo. La v0 decía «empieza la frase por la
 *     negación» y NO bastaba: `Nu care cumva să vii mâine!` empieza por
 *     la negación y pasaría. El recuento cierra de golpe esa, `Să nu vii
 *     mâine!` (+2), `Nu mai veni mâine!` (+2) y `Nu veni tu mâine!`
 *     (+2) — todas correctas, todas suspendidas por la tarjeta. En los
 *     ocho ítems la respuesta es la fuente con `nu` delante y el verbo
 *     cambiado en su sitio: exactamente una palabra más.
 *
 *  Ninguna de las dos nombra una palabra rumana ni deletrea la casilla. */
const PROHIBE_SG = 'Dile a tu amigo que NO haga eso: usa el mismo verbo y escribe exactamente una palabra más que la frase de partida.';
const PROHIBE_PL = 'Diles a tus dos amigos que NO hagan eso: usa el mismo verbo y escribe exactamente una palabra más que la frase de partida.';

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
  item('a veni', 'sg', 'mâine'),                 // supletivo: vino → veni
  item('a citi', 'sg', 'scrisoarea'),            // sufijo -esc: citește → citi
  item('a mânca', 'sg', 'tot'),                  // alternancia: mănâncă → mânca
  // LA COPIA LEGÍTIMA, y va declarada. En la 3.ª conjugación el
  // afirmativo YA ES el infinitivo corto, así que la regla se aplica
  // entera y no cambia nada. Sin él, el lote enseñaría «al negar, la
  // forma siempre cambia», que en rumano es falso: `spune`, `scrie`,
  // `pune`, `începe`, `zice`, `merge` se comportan igual.
  item('a începe', 'sg', 'fără mine'),           // începe → începe

  // ══ CUATRO DE PLURAL · `nu` + el AFIRMATIVO plural ════════════════
  // Los cuatro son ítems de SOBREAPLICACIÓN: es el contexto donde la
  // regla del singular NO se aplica, y aplicarla produce `*Nu veni!`
  // dicho a dos personas, que es el error que la propia `descripcion`
  // del punto declara. La fuente va en SINGULAR —el cruce de número— o
  // el ítem se contestaría copiando.
  //
  // EL DE `a fi` ES EL QUE MÁS TRABAJA, y no por el alumno sino por la
  // regla: es el ÚNICO verbo del lexicón donde el afirmativo plural
  // (`fiți`) no es el presente (`sunteți`), o sea el único que separa la
  // formulación verdadera de la falsa que se oye más. Un alumno que haya
  // aprendido «plural negativo = presente de 2.ª pl» escribe aquí
  // `*Nu sunteți aici!` y en ningún otro ítem del lote.
  //
  // Y el aviso que el gate imprime y no tumba: `fii` → `fiți` es el único
  // contraste de UNA letra del lote (1 de 8). Aquí la letra no es
  // ortografía disfrazada de morfología —es al revés: la `ț` ES el
  // morfema del plural entero—, y el ítem exige además saber que la
  // casilla del plural existe. Queda contado por si alguien añade más.
  item('a fi', 'pl', 'aici la ora nouă', { sobreaplicacion: true }),
  item('a aștepta', 'pl', 'afară', { sobreaplicacion: true }),
  item('a lua', 'pl', 'banii', { sobreaplicacion: true }),
  item('a merge', 'pl', 'pe jos', { sobreaplicacion: true }),
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
  // La casilla del plural, con el `nu` DESNUDO — el lookbehind excluye
  // `să nu veniți`, que sería la otra construcción y no ésta.
  { afirmacion: 'el plural negativo con «nu» desnudo es la forma del afirmativo', patron: '(?<!să )nu veniți', espera: 'presente' },
  { afirmacion: 'y no es un caso aislado: también con a face y a merge', patron: '(?<!să )nu (faceți|mergeți)', espera: 'presente' },
  // Por qué el SINGULAR de `a fi` queda fuera del lote y el plural entra.
  { afirmacion: '«nu fii» está atestado, así que no se puede exigir «nu fi» sin cita', patron: 'nu fii', espera: 'presente' },
  { afirmacion: 'el plural de a fi sólo aparece con să: «nu fiți» desnudo NO está atestado', patron: '(?<!să )nu fiți', espera: 'ausente' },
  // Por qué la consigna cierra `Să nu vii!` por el recuento y no lo marca mal.
  { afirmacion: '«să nu» + conjuntivo es prohibitiva viva de 2.ª sg', patron: 'să nu vii', espera: 'presente' },
  // Por qué la consigna tiene que atar el LEXEMA.
  { afirmacion: '«nu mai» compite como forma natural de la misma prohibición', patron: 'nu mai veni', espera: 'presente' },
];

export const OPCIONES: Opciones = {
  comprobaciones: COMPROBACIONES,
  // LAS DOS RUTAS DE TRANSFERENCIA VAN LAS DOS EN EL TOPE, por orden del
  // coordinador y contra el argumento que este mismo fichero defendía en
  // su v0. El termómetro mide al alumno, no al temario: si acierta por
  // transferencia, no ha aprendido nada, aunque lo transferido coincida
  // con lo que el punto dice enseñar.
  estrategias: [RUTA_DEL_INFINITIVO, RUTA_DEL_SUBJUNTIVO, ANTEPONER_NU],
  juicios: {
    copia: 'UNO de ocho se contesta copiando el foco, y es la lengua y no un descuido: en `Începe fără mine!` el imperativo afirmativo de la 3.ª conjugación YA ES el infinitivo corto, así que la regla se aplica entera y no cambia nada. Sin ese ítem el lote enseñaría «al negar, la forma siempre cambia», que en rumano es falso y lo desmienten `spune`, `scrie`, `pune`, `zice`, `merge`. Y no puede haber más de uno: los otros tres singulares tienen que separar el afirmativo del infinitivo para examinar algo, y los cuatro plurales llevan la fuente en SINGULAR justo para que copiar no acierte — sin ese cruce de número el plural entero se contestaría copiando, porque el negativo plural ES el afirmativo plural, y ése era el defecto de la v0 de este lote, que imprimía 4 de 9. Medido ejecutando: copiar el foco 1/8, copiar la frase entera 0/8, ponerle «nu» delante a la fuente 1/8, la edición modal del lote 1/8.',
    frontera: 'Los CUATRO PLURALES son los ítems de sobreaplicación. La regla «imperativo negativo = nu + infinitivo corto» tiene su contexto negativo exactamente en la 2.ª plural, donde la forma es la del afirmativo: un alumno que aprenda la mitad singular escribe *Nu veni mâine! a dos personas, que es el error que la propia descripción del punto declara. Y uno de los cuatro, el de `a fi`, es la frontera DENTRO de la frontera: es el único verbo del lexicón donde el afirmativo plural (fiți) no coincide con el presente de 2.ª pl (sunteți), medido sobre los 39, o sea el único ítem que separa la formulación verdadera de la falsa «plural negativo = presente de 2.ª pl». Un alumno que haya aprendido la falsa escribe *Nu sunteți aici la ora nouă! aquí y acierta en todo lo demás.',
    varianza: 'La pieza «+nu» es INVARIANTE en los ocho, y es invariancia de la LENGUA y no del diseño: el rumano no tiene forma prohibitiva de 2.ª persona que omita `nu`, igual que en `r3-negacion-antepuesta`, el caso que la pasada de varianza declaró legítimo por esta misma razón. Lo que varía en su lugar, y ES el punto, es la CASILLA de la que sale la forma verbal: infinitivo corto en los cuatro del singular y afirmativo plural en los cuatro del plural. Y lo que hace que la varianza sea real y no decorativa es que el alumno tiene UNA ruta de transferencia para cada casilla y ninguna para las dos: la ruta del infinitivo acierta 4/8 y la del subjuntivo acierta 4/8, que en una elección binaria es exactamente el azar. Con el reparto cargado a un lado, una de las dos pasaría del tope y el lote estaría certificando transferencia; con el reparto equilibrado, lo único que separa 8 de 4 es haber aprendido que la casilla depende del número. Ésa es también la razón de que el lote se quede en ocho.',
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
