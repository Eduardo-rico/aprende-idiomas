// scripts/lotes/trans-ro-l23.ts — LOTE 23: el ESTRENO de la máquina de
// transformación en rumano, con UN solo punto: `r3-imperativo-afirmativo`.
//
//   npx tsx scripts/lotes/trans-ro-l23.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-ro-l23.ts --asigna   # a qué punto cuenta cada ítem
//
// Se estrena con un punto y no con tres a propósito: estrenar formato y
// repartir cobertura a la vez es como se quema un lote entero. Si el
// formato no deja examinar, hay que saberlo con un punto.
//
// ══ LO QUE EL LINGÜISTA DIO LA VUELTA, Y ES EL HALLAZGO DEL LOTE ═════
//
// El diseño en seco pesaba hacia las formas irregulares (`vino`, `fă`) y
// hacia las de clase (`citește`, `vorbește`), y trataba los ítems donde la
// respuesta correcta es NO TOCAR NADA (`Stai!`, `Mergi!`, `Dormi!`) como
// una concesión defensiva contra la estrategia de copiar. **Es al revés:
// esos tres son el punto.**
//
// La razón es que el imperativo español de 2.ª sg **es** formalmente la
// 3.ª sg del presente: *lee* = «él lee», *canta* = «él canta», *habla* =
// «él habla». O sea que la regla del piso (B) del rumano —1.ª conjugación
// y verbos en `-esc` toman la 3.ª sg— **es la regla del español**, y el
// hispanohablante la acierta por transferencia sin haber aprendido nada
// del imperativo rumano: sólo necesita el presente, que es
// `r3-presente-4-conjugaciones`. Y el espejo: el español **nunca** forma
// el imperativo con la 2.ª sg de presente (*«¡lees!» es imposible), así
// que el piso (C) —`mergi!`, `dormi!`, `stai!`— es exactamente donde la
// transferencia castellana falla y produce `*merge!`, `*doarme!`, `*stă!`.
//
// Por eso el lote pesa hacia (C). Y la estrategia `poner-la-3ª-singular`
// —que ES la regla que el alumno trae de casa— va escrita como función y
// se corre sobre los ocho: acierta 2. Eso no se razona, se ejecuta.
//
// ══ LA REGLA QUE ESTUVO A PUNTO DE PUBLICARSE, Y ERA FALSA ═══════════
//
// «Transitivos → 3.ª sg, intransitivos → 2.ª sg» es falsa, y la refutan
// cinco verbos del propio `lexicon-a1.ts`: `a vorbi`, `a lucra`, `a pleca`,
// `a intra`, `a cânta` son intransitivos y toman la 3.ª sg; `a vedea` y
// `a auzi` son transitivos y toman la 2.ª sg. La regla tiene TRES pisos y
// el orden de evaluación importa — evaluar la transitividad primero da
// `*vorbi!` y `*lucra!` (GALR I, cap. *Imperativul*; GBLR 2010, *Verbul ·
// imperativul*; formas en DOOM3 2021 y en las tablas de dexonline):
//
//   (A) LISTA CERRADA SUPLETIVA, no derivable de nada: `fă` (a face),
//       `du-te` (a duce), `adu` (a aduce), `zi` (a zice), `vino` (a veni),
//       `fii` (a fi). Y las DEFECTIVAS, que no tienen imperativo:
//       `a putea`, `a vrea`, `a trebui`, `a ști`.
//   (B) CLASE, ANTES QUE SINTAXIS: 1.ª conjugación (-a) y todo verbo con
//       sufijo `-esc`/`-ăsc` toman la 3.ª sg, transitivo o no.
//   (C) SÓLO EN EL RESTO (II en -ea, III en -e, IV en -i sin sufijo)
//       opera el reparto: intransitivo → 2.ª sg (`mergi`, `dormi`,
//       `taci`); transitivo → 3.ª sg (`spune`, `pune`, `scrie`). Y aun
//       aquí gotea: `a vedea` → `vezi!` y `a auzi` → `auzi!` son
//       transitivos con forma de 2.ª sg, y van como excepción listada.
//
// ══ LA RESTRICCIÓN DE LA FUENTE, Y LA MITAD QUE LE FALTABA ═══════════
//
// La v0 decía: **la fuente va SIEMPRE en 2.ª persona de presente
// indicativo**, porque en 3.ª el piso (B) regala la respuesta —el
// imperativo de ~22 de los ~40 verbos del lexicón es IDÉNTICO a la 3.ª
// sg, así que «Maria citește cartea» → «Citește cartea!» se contesta
// copiando—. Es cierto **para los pisos A y B**, y **falso para el (C)**,
// que se define exactamente por «imperativo = 2.ª sg»: aplicada en
// bloque, la restricción creaba la fuga espejo **justo en los tres ítems
// que el lote considera su núcleo**. Es §4.13 otra vez, una regla que
// acierta en los casos que tenía delante y le falta una mitad.
//
// **La regla entera es una línea: la fuente va en la persona que NO
// coincide con el imperativo.** Pisos A y B → 2.ª sg. Piso C → 3.ª sg.
//
// Y el daño no era teórico, era sobre el FSRS: con la fuente en 2.ª, el
// ítem del piso (C) **no puede distinguir** al que sabe que `a sta` no da
// `*stă!` del que copió sin leer el verbo. Los dos aciertan, los dos
// marcan «fácil», y el intervalo se dispara en la cabeza del que no sabe.
// Un ítem que sólo informa cuando falla es medio ítem.
//
// **2 · Prohibido `să` + conjuntivo en la fuente.** El marco obvio
// —«Trebuie să vii mâine»— contiene LITERALMENTE la respuesta calcada:
// borrando una palabra sale `Să vii mâine!`, que es rumano correcto. El
// ítem se resolvería BORRANDO.
//
// ══ Y LA FORMA QUE ESTE PUNTO NO ACEPTA AUNQUE SEA CORRECTA ══════════
//
// `Să vii!` es rumano vivo y normativo: `să` + conjuntivo con valor
// directivo de 2.ª sg está registrado en GBLR 2010 (*conjunctiv cu valoare
// de imperativ*) y en GALR I como forma supletiva y concurrente, y está
// ATESTADO EN AISLAMIENTO en el corpus del proyecto, en el mismo diálogo y
// del mismo hablante que `Vino!`: «— Vino tu pe la mine. […] — Să vii!».
// La consigna lo excluye nombrando la casilla («en imperativo»), no
// prohibiendo una cadena; y queda escrito aquí y en el inventario porque
// rechazarlo en silencio sería marcar como mala una forma atestada sin
// fuente, que es la regla §0 incumplida por omisión.
import { verificar, informe, type ItemTransRo, type Opciones, type Estrategia, norm } from '../lib/transformacion-ro';
import { informeAsigna } from '../lib/asigna-ro';
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { presente } from '../lib/paradigma-ro';

const IMP = 'r3-imperativo-afirmativo';
/** La consigna, escrita UNA vez: si se copia por ítem, se desincroniza en
 *  la copia que nadie actualiza. **Cada cláusula cierra una salida
 *  correcta que la tarjeta suspendería**, y ninguna nombra una palabra
 *  rumana:
 *
 *   · «esa misma orden» ata la ILOCUCIÓN, y no basta — fue el error de la
 *     v0. «usa el mismo verbo» ata el LEXEMA, y sin eso `Du-te la piață!`
 *     y `Hai la piață!` (`hai la` sale 65 veces en el corpus, `hai cu
 *     mine` 13) son las formas NATURALES de esas órdenes: un alumno que
 *     las escribe está escribiendo mejor rumano que la clave.
 *   · «empieza la frase por él» cierra `Să vii cu mine!` **por la forma**,
 *     no por la etiqueta. La v0 decía «en imperativo» y confiaba en que la
 *     etiqueta excluyera el conjuntivo: no lo hace, porque en español el
 *     imperativo es funcional antes que morfológico —el negativo, el de
 *     usted y el de 1.ª pl. SON subjuntivos («no vengas», «venga usted»)—
 *     y la propia gramática rumana trata `să` + conjuntivo como forma
 *     supletiva del paradigma imperativo. Y no es un purismo: `să` +
 *     conjuntivo es REGULAR sobre los nueve verbos (`să stai`, `să
 *     mergi`, `să faci`…), así que aceptarlo abriría una estrategia que
 *     acierta 9 de 9 **sin aprender un solo imperativo**.
 *   · «no pongas pronombre» cierra `Stai tu lângă ușă!` y `Tu vino cu
 *     mine!`, que son rumano correcto y contrastivo (ver `juicios`). */
const ORDEN_SG = 'Dale esa misma orden a tu amigo, tuteándolo: usa el mismo verbo, empieza la frase por él y no pongas pronombre.';
const ORDEN_PL = 'Dales esa misma orden a los dos: usa el mismo verbo, empieza la frase por él y no pongas pronombre.';

export const ITEMS: ItemTransRo[] = [
  // ══ PISO (C) · DONDE EL CALCO CASTELLANO FALLA, Y LA FUENTE VA EN 3.ª
  // El imperativo español de 2.ª sg ES formalmente la 3.ª sg del presente
  // (*lee* = «él lee»), así que el piso (B) del rumano se acierta
  // traduciendo. El español NUNCA forma el imperativo con la 2.ª sg del
  // presente, luego aquí —y sólo aquí— la transferencia produce `*stă!`,
  // `*merge!`, `*doarme!`. La fuente va en 3.ª persona porque en este
  // piso el imperativo es la 2.ª: puesta en 2.ª, el ítem se contestaría
  // copiando y no distinguiría al que sabe del que no leyó el verbo.
  //
  // `a sta` es el diamante: 1.ª conjugación —la clase donde TODO lo demás
  // toma la 3.ª sg— y toma `stai!`, no `*stă!`.
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false, sobreaplicacion: true,
    s: 'El stă lângă ușă.', instruccion: ORDEN_SG, r: 'Stai lângă ușă!',
    foco: 'stă', nucleo: 'stai' },
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Ea merge la piață.', instruccion: ORDEN_SG, r: 'Mergi la piață!',
    foco: 'merge', nucleo: 'mergi' },
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'El doarme la hotel.', instruccion: ORDEN_SG, r: 'Dormi la hotel!',
    foco: 'doarme', nucleo: 'dormi' },

  // ══ LA FRONTERA DEL PISO (C): el intransitivo que SÍ cambia ═══════
  // `a vorbi` es intransitivo y aun así toma la 3.ª sg, porque lleva
  // sufijo `-esc` y la CLASE manda antes que la sintaxis. Es la
  // sobreaplicación de la regla que estuvo a punto de publicarse.
  // `încet` es aquí «en voz baja» (DEX s.v. *încet*, acepción 2): los 8
  // casos del corpus son todos ésa, acotaciones de Caragiale. Como orden
  // vale en las dos acepciones y produce la misma cadena.
  { p: IMP, pasada: 1, espejoEs: true, transparenteLatin: true, sobreaplicacion: true,
    s: 'Tu vorbești încet.', instruccion: ORDEN_SG, r: 'Vorbește încet!',
    foco: 'vorbești', nucleo: 'vorbește' },

  // ══ PISO (B) · el ancla de la clase ═══════════════════════════════
  // Flojo a propósito y contado como tal: se acierta traduciendo, porque
  // «lee» español ES la 3.ª sg. Está para que la clase quede
  // representada, no para medir. Uno basta.
  { p: IMP, pasada: 1, espejoEs: true, transparenteLatin: true,
    s: 'Tu citești cartea.', instruccion: ORDEN_SG, r: 'Citește cartea!',
    foco: 'citești', nucleo: 'citește' },

  // ══ PISO (A) · DOS supletivas, y ni una más ═══════════════════════
  // Ocho ítems sobre `vino, fă, du-te, zi, ia, dă` medirían memoria de
  // seis formas, que es el contenido de `r3-irregulares-a1`, su propio
  // prerrequisito: sería cobrar dos veces el mismo trabajo y llamar
  // «paradigma» a una tarjeta de vocabulario.
  //
  // `fă` va SIEMPRE con objeto y nunca como respuesta de una sola
  // palabra: es homógrafo de la interjección vocativa dirigida a mujer,
  // atestada en el corpus del proyecto («— Fă, fă, s-a omorât Milogul»;
  // DEX s.v. *fă* interj., pop./fam.).
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Tu vii cu mine.', instruccion: ORDEN_SG, r: 'Vino cu mine!',
    foco: 'vii', nucleo: 'vino' },
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Tu faci cafeaua.', instruccion: ORDEN_SG, r: 'Fă cafeaua!',
    foco: 'faci', nucleo: 'fă' },

  // ══ LA FRONTERA DEL PLURAL ════════════════════════════════════════
  // La 2.ª plural del imperativo es idéntica a la del presente en TODO el
  // paradigma —`veniți`, `faceți`, `aveți`— con UNA excepción en la
  // lengua estándar: `a fi`, donde `sunteți` da `fiți!` (DOOM3 2021 s.v.
  // *a fi*; dexonline, paradigma de *a fi*; corpus: `fiți` 74, `fiiți` 0).
  //
  // El predicativo es `cuminți` y no `atenți`: el marco `fii/fiți` + adj.
  // está vivo (`Fii cuminte` 26 en el corpus) mientras que la declarativa
  // `sunteți atenți` da CERO —`atent` predicativo plural vive en el
  // negativo o en el imperativo—, o sea que la fuente sonaba a ejercicio.
  // El adjetivo se copia de la fuente y eso es bueno aquí: fija el género
  // y hace la respuesta única, sin regalar `fiți`, que es lo que se pide.
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false, sobreaplicacion: true,
    s: 'Voi sunteți cuminți.', instruccion: ORDEN_PL, r: 'Fiți cuminți!',
    foco: 'sunteți', nucleo: 'fiți' },

  // ══ EL ÍTEM DE COPIA LEGÍTIMO, y es el noveno ═════════════════════
  // Con los tres del piso (C) en 3.ª persona, copiar deja de acertar y el
  // lote quedaría enseñando «la forma SIEMPRE cambia», que es la otra
  // estrategia gratis. Éste la cierra sin mentir: en el plural, copiar
  // **ES la regla** —el imperativo plural es el presente en todo el
  // paradigma salvo `a fi`—, así que su acierto por copia no es un falso
  // positivo. Es exactamente el caso negativo que pide la frontera del
  // ítem anterior, y por eso van en pareja.
  { p: IMP, pasada: 1, espejoEs: true, transparenteLatin: false,
    s: 'Voi veniți acum.', instruccion: ORDEN_PL, r: 'Veniți acum!',
    foco: 'veniți', nucleo: 'veniți' },
];

/** LA ESTRATEGIA PROPIA DEL PUNTO, Y LA RAZÓN DE SER DEL LOTE.
 *
 *  El hispanohablante trae de casa una regla que funciona: «el imperativo
 *  es la 3.ª singular del presente» (*lee*, *canta*, *habla*). Aquí no se
 *  razona si eso resuelve el lote: se escribe como función, se le pide la
 *  3.ª sg al PARADIGMA —no a una tabla escrita a mano, que se
 *  desincroniza— y se cuenta cuántos acierta. Acierta 2 de 8, y los dos
 *  están declarados `espejoEs`. */
export const TERCERA_SINGULAR: Estrategia = {
  nombre: 'poner-la-3ª-singular-del-presente (la regla del español)',
  aplicar(x) {
    // La búsqueda mira las TRES personas que pueden aparecer en una
    // fuente de este lote (`tu`, `el`, `voi`), no sólo la 2.ª: si mirara
    // sólo `tu`, los tres ítems con fuente en 3.ª devolverían null y la
    // estrategia saldría artificialmente baja — un gate que no puede
    // disparar sobre medio lote es el §4.18.
    const v = VERBOS_A1.find((l) => (['tu', 'el', 'voi'] as const).some((per) => norm(presente(l, per) ?? '') === norm(x.foco)));
    return v ? presente(v, 'el') : null;
  },
};

/** ══ LA REGULARIDAD QUE DEJA EL CIERRE, Y EL FALLO QUE DESTAPÓ ══════
 *
 *  Cerrada la estrategia «copiar», la pregunta obligatoria es qué
 *  regularidad deja el cierre. La respuesta parecía «cambiar siempre la
 *  forma», y se escribió como estrategia para ejecutarla. **Acertaba 5 de
 *  8 y no medía nada: devolvía `x.nucleo`, o sea que leía la respuesta y
 *  se daba la razón a sí misma.** Ni siquiera es una estrategia — un
 *  alumno que decide «esto cambia» no sabe todavía A QUÉ cambia.
 *
 *  El arreglo fue estructural y está en la máquina: `Estrategia.aplicar`
 *  recibe una `Vista` que NO CONTIENE la respuesta, así que la versión
 *  tramposa ya no compila. Y la forma honesta de la pregunta es que la
 *  única regla de «cambiar» que un principiante tiene ES la del español
 *  —poner la 3.ª singular—, que es justo `TERCERA_SINGULAR`: acierta 2 de
 *  8. Cerrar «copiar» no abre nada. */

/** LA ESTRATEGIA QUE EL GATE NO VEÍA, y la encontró el lingüista.
 *
 *  `copiar-el-foco` compara contra el NÚCLEO, o sea una palabra. La
 *  estrategia que un alumno puede ejecutar de punta a punta produce **la
 *  frase entera**: «copio la fuente, le quito el pronombre y cambio el
 *  punto por admiración». Con la comparación del producto —que acepta el
 *  punto donde la clave lleva admiración— la cadena que produce es
 *  literalmente `fuente − pronombre`, y contra el núcleo no se veía.
 *  Sobre la v0 acertaba 3 de 8; sobre ésta, 1 de 9, y ese uno es el ítem
 *  donde copiar ES la regla. */
export const COPIAR_SIN_PRONOMBRE: Estrategia = {
  nombre: 'copiar-la-frase-quitándole-el-pronombre',
  objetivo: 'respuesta',
  aplicar: (x) => x.s.replace(/^\s*(eu|tu|el|ea|noi|voi|ei|ele)\s+/iu, ''),
};

export const OPCIONES: Opciones = {
  estrategias: [TERCERA_SINGULAR, COPIAR_SIN_PRONOMBRE],
  juicios: {
    copia: 'UNO de nueve se contesta copiando el foco, y es el del PLURAL (`Voi veniți acum.` → `Veniți acum!`). Ése es el número correcto, y la v0 tenía tres por una razón equivocada: puso los ítems del piso (C) —stai, mergi, dormi— con la fuente en 2.ª persona, que es justo la persona con la que su imperativo COINCIDE, así que la respuesta estaba escrita en la frase y el ítem no distinguía al que sabe que `a sta` no da *stă! del que copió sin leer el verbo. Con la fuente en 3.ª, esos tres hay que PRODUCIRLOS. Y quitarlos del todo dejaría la regularidad «la forma siempre cambia», que es la otra estrategia gratis: la cierra el ítem del plural, donde copiar ES la regla de la lengua —el imperativo plural es el presente en todo el paradigma salvo `a fi`—, así que su acierto por copia no es un falso positivo. Medido ejecutando: copiar el foco 1/9, copiar la frase entera 0/9, copiar la frase quitándole el pronombre 1/9.',
    frontera: 'La regla tiene contexto negativo en las TRES capas y hay un ítem por capa. (1) `a sta` es de 1.ª conjugación, la clase donde todo toma la 3.ª sg, y toma `stai!` y no *stă!. (2) `a vorbi` es INTRANSITIVO y aun así toma la 3.ª sg, porque el sufijo -esc manda antes que la sintaxis: es la sobreaplicación de la regla «intransitivo → 2.ª sg», que es falsa y la refutan cinco verbos del propio lexicón. (3) `a fi` en plural: `sunteți` da `fiți!`, la única casilla del paradigma donde el plural no es el presente, y va emparejado con `Veniți acum!`, que es la misma frontera vista desde el otro lado. Los reflexivos (`du-te`) quedan FUERA aunque serían la frontera obvia: un fallo ahí es inatribuible entre no saber la forma y no saber dónde va el clítico, que es `r6-cliticos-imperativo-gerunziu`.',
    varianza: 'Ninguna pieza de la operación llega al umbral: las fuentes reparten el pronombre entre `el`/`ea` (3), `tu` (4) y `voi` (2), así que quitarlo no es una constante. LO QUE HAY QUE LEER AQUÍ ES EL JUICIO ANTERIOR, QUE ERA FALSO. La v0 tenía `-tu` invariante en 7 de 8 y lo justificaba diciendo que «el imperativo rumano no admite pronombre sujeto antepuesto». Es FALSO y lo refuta el corpus del propio proyecto con la frase del ítem de `a veni`: «iar TU VINO cu mine prin ninsori de stele» (Eminescu), «și tu vino îndărăpt» — `tu vino` sale 3 veces, y pospuesto `stai tu` 8 y `vino tu` 3. La verdad es otra: el imperativo NO MARCADO no lleva sujeto expreso, y el sujeto expreso es CONTRASTIVO («quédate TÚ, no él»). Con la razón verdadera, quitar el pronombre deja de ser propiedad de la lengua y pasa a ser una decisión del ítem — que es justo lo que el gate de varianza existe para denunciar. Por eso ahora se reparte entre tres pronombres, y por eso la consigna cierra `Stai tu!` diciendo «no pongas pronombre» y no fingiendo que no existe. Lo que varía y ES el punto: el PISO morfológico del que sale la forma —supletivo (2), clase → 3.ª sg (2), transitividad → 2.ª sg (3), plural (2).',
  },
};

if (/[/\\]trans-ro-l23\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 23 · transformación · ${ITEMS.length} ítems\n`);
  if (process.argv.includes('--asigna')) {
    // El contador CANÓNICO, el mismo que la foto del déficit: si el lote
    // llevara el suyo, se desincronizarían. Sólo certifica a qué punto
    // cuenta cada ítem, NO que el ítem mida su punto.
    const a = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s, hintEs: x.hint ?? '', answer: x.r })));
    for (const l of a.lineas) console.log(l);
    process.exit(a.desvio ? 1 : 0);
  }
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}
