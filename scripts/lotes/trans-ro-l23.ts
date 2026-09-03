// scripts/lotes/trans-ro-l23.ts — LOTE 23: el ESTRENO de la máquina de
// transformación en rumano, con UN solo punto: `r3-imperativo-afirmativo`.
//
//   npx tsx scripts/lotes/trans-ro-l23.ts            # preflight + gates
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
// ══ LAS DOS RESTRICCIONES DURAS DE LA FUENTE, Y VAN EN GATE ══════════
//
// **1 · La fuente va SIEMPRE en 2.ª persona de presente indicativo.**
// Nunca en 3.ª: por el piso (B), el imperativo de ~22 de los ~40 verbos
// del lexicón es IDÉNTICO a la 3.ª sg, así que «Maria citește cartea» →
// «Citește cartea!» se contesta copiando, y el lote entero saldría verde
// ítem por ítem. Es el defecto que ningún gate por ítem puede ver.
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
import { VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import { presente } from '../lib/paradigma-ro';

const IMP = 'r3-imperativo-afirmativo';
/** La consigna, escrita UNA vez: si se copia por ítem, se desincroniza en
 *  la copia que nadie actualiza. Nombra la CASILLA («en imperativo»), que
 *  el hispanohablante ya tiene y que en rumano designa el mismo paradigma,
 *  y ata el LEMA («esa misma orden») — sin eso `Mergi!` compite con
 *  `Du-te!`, `Pleacă!` y `Hai!`, que son órdenes correctas del mismo
 *  contenido. Lo que NO hace es nombrar `să`: decirle al alumno que
 *  existe una alternativa con `să` y que la evite es enseñarle el calco
 *  dentro del enunciado. */
const ORDEN_SG = 'Dale esa misma orden a tu amigo, en imperativo, tuteándolo.';
const ORDEN_PL = 'Dales esa misma orden a los dos, en imperativo.';

export const ITEMS: ItemTransRo[] = [
  // ══ PISO (C) · LOS TRES DONDE EL CALCO CASTELLANO FALLA ═══════════
  // La respuesta correcta es no tocar el verbo. No son una concesión: son
  // los únicos ítems del lote que un hispanohablante no puede acertar
  // desde el español, porque el español no forma nunca el imperativo con
  // la 2.ª sg del presente.
  //
  // `a sta` es el diamante: es de 1.ª conjugación —la clase donde TODO lo
  // demás toma la 3.ª sg— y toma `stai!`, no `*stă!`. Es ítem de copia y
  // de sobreaplicación a la vez.
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false, sobreaplicacion: true,
    s: 'Tu stai lângă ușă.', instruccion: ORDEN_SG, r: 'Stai lângă ușă!',
    foco: 'stai', nucleo: 'stai' },
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Tu mergi la piață.', instruccion: ORDEN_SG, r: 'Mergi la piață!',
    foco: 'mergi', nucleo: 'mergi' },
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false,
    s: 'Tu dormi în camera ta.', instruccion: ORDEN_SG, r: 'Dormi în camera ta!',
    foco: 'dormi', nucleo: 'dormi' },

  // ══ LA FRONTERA DEL PISO (C): el intransitivo que SÍ cambia ═══════
  // `a vorbi` es intransitivo y aun así toma la 3.ª sg, porque lleva
  // sufijo `-esc` y la clase manda antes que la sintaxis. Es la
  // sobreaplicación de la regla falsa que estuvo a punto de publicarse.
  { p: IMP, pasada: 1, espejoEs: true, transparenteLatin: true, sobreaplicacion: true,
    s: 'Tu vorbești încet.', instruccion: ORDEN_SG, r: 'Vorbește încet!',
    foco: 'vorbești', nucleo: 'vorbește' },

  // ══ PISO (B) · el ancla de la clase ═══════════════════════════════
  // Flojo a propósito y contado como tal: se acierta traduciendo, porque
  // «lee» español ES la 3.ª sg. Está para que la clase quede representada,
  // no para medir. Uno basta.
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
  // O sea que el plural es donde muere toda la irregularidad, y por eso
  // sólo entra la casilla que NO es copia. Un `veniți` no mediría nada.
  { p: IMP, pasada: 1, espejoEs: false, transparenteLatin: false, sobreaplicacion: true,
    s: 'Voi sunteți atenți.', instruccion: ORDEN_PL, r: 'Fiți atenți!',
    foco: 'sunteți', nucleo: 'fiți' },
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
    const v = VERBOS_A1.find((l) => norm(presente(l, 'tu') ?? '') === norm(x.foco));
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

export const OPCIONES: Opciones = {
  estrategias: [TERCERA_SINGULAR],
  juicios: {
    copia: 'TRES de ocho se contestan copiando el foco (`stai`, `mergi`, `dormi`), y ése es el número correcto por una razón que da la vuelta al diseño: el imperativo español de 2.ª sg ES la 3.ª sg del presente (lee = «él lee»), así que el piso donde la forma cambia se acierta traduciendo y el piso donde NO cambia es exactamente donde la transferencia castellana produce *merge!, *doarme!, *stă!. No son una concesión contra la estrategia de copiar: son los únicos ítems del lote que un hispanohablante no puede acertar desde el español. Con cero, el lote enseñaría «la forma siempre cambia», que es otra estrategia gratis; con ocho, se contestaría copiando. Tres de ocho deja las dos por debajo del azar.',
    frontera: 'La regla tiene contexto negativo en las TRES capas y hay un ítem por capa. (1) `a sta` es de 1.ª conjugación, la clase donde todo toma la 3.ª sg, y toma `stai!` y no *stă!. (2) `a vorbi` es INTRANSITIVO y aun así toma la 3.ª sg, porque el sufijo -esc manda antes que la sintaxis: es la sobreaplicación de la regla «intransitivo → 2.ª sg», que es falsa y la refutan cinco verbos del propio lexicón. (3) `a fi` en plural: `sunteți` da `fiți!`, la única casilla del paradigma donde el plural no es el presente. Los reflexivos (`du-te`) quedan FUERA aunque serían la frontera obvia: un fallo ahí es inatribuible entre no saber la forma y no saber dónde va el clítico, que es `r6-cliticos-imperativo-gerunziu`.',
    varianza: 'La pieza `-tu` es invariante (7 de 8; el octavo quita `-voi`) y la invariancia es de la LENGUA, no del lote: el imperativo rumano no admite pronombre sujeto antepuesto, así que quitarlo no es una decisión que el ítem examine — va DADO en la fuente y su única función es fijar la persona sin nombrar la desinencia. Es la forma de `r3-negacion-antepuesta`, donde `nu` sale en los ocho porque en rumano no hay palabra negativa que no lo exija. Lo que varía en su lugar, y es lo que el punto enseña, es el PISO morfológico del que sale la forma: supletivo (2 ítems), clase → 3.ª sg (2), transitividad → 2.ª sg (3) y plural (1). El sujeto pospuesto —`Vino tu cu mine!`, atestado en el corpus— es contrastivo y no es «esa misma orden», así que no entra como alternativa.',
  },
};

if (/[/\\]trans-ro-l23\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 23 · transformación · ${ITEMS.length} ítems\n`);
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}
