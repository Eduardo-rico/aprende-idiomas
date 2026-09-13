// lib/data/languages/ru/pronombres-ru.ts — LOS PRONOMBRES Y DETERMINANTES.
//
// ══ POR QUÉ ESTO ES UNA TABLA Y EL ADJETIVO ES UNA REGLA ══════════════
//
// El inventario pronominal del ruso es una lista CERRADA que cualquier
// gramática imprime como tal, y ahí es donde se separa de todo lo demás de
// esta carpeta: el sustantivo y el adjetivo son reglas con excepciones
// guardadas, y esto son datos sin regla que derivar. La lección de la que
// sale está escrita en el relevo rumano (§4.46): un razonamiento que dice
// «esto no va en el paradigma porque depende del contexto» confunde el
// INVENTARIO con la DISTRIBUCIÓN. La lista de formas casi nunca depende del
// contexto; la elección entre dos de ellas, sí. Aquí están las dos cosas
// separadas, y la que depende del contexto es una FUNCIÓN que exige el
// contexto.
//
// ══ LA н- PROTÉTICA, Y ES LA MISMA JUGADA QUE `prepositivoSg()` ═══════
//
// Medido sobre las 2.180 lecturas (~7,7 M de palabras):
//
//     у него  5404 · у его    94       к нему 3855 · к ему 2
//     с ним   4268 · с им      2       с ней  1459 · с ей  3
//     у неё   1306 · у её     68       у них  1507 · у их 10
//     для него 989 · для его  71       о нём   775 · о ём  0
//
// O sea que **no existe «el genitivo de он» a secas**: `его книга` y
// `у него книги` son las dos correctas y lo decide si hay preposición
// delante. `pronombre()` EXIGE saberlo, exactamente como `prepositivoSg()`
// exige el regente. Una firma que no se puede llamar mal vale más que un
// comentario, y este proyecto ha visto seis veces erosionarse un comentario.
//
// ⚠ Y LOS RIVALES DE ESA MEDICIÓN NO DAN CERO: HAY QUE LEERLOS, Y SE
// LEYERON. `у его` 94, `для его` 71 y `у их` 10 no son la forma sin prótesis:
// son el POSESIVO `его/их` seguido de su sustantivo —«у его невесток»,
// «у его дяди», «для его пользы», «у их отца»—, que es otra construcción
// entera. Es el homógrafo de otro lema en su forma más limpia: la cadena
// coincide letra por letra y la estructura no tiene nada que ver. De las 10
// de `у их`, una o dos SÍ son el pronombre sin prótesis y en boca de
// campesino («У их экого стулья-то по баням много»), o sea lengua real de
// registro, no norma. Contar no separaba nada de esto; sólo leer con `--ctx`.
//
// ══ LO QUE ESTE FICHERO **NO** TIENE, ESCRITO EN VEZ DE OMITIDO ═══════
//
// · el relativo `который` (`u11-kotoryj`, B1): declina como un adjetivo duro
//   y entraría con dos líneas, pero su punto es de SINTAXIS —el caso lo fija
//   la subordinada y el género el antecedente— y darle la forma no adelanta
//   ni un ítem. Cuando su lote se escriba, se declina con `paradigma-adj-ru`.
// · los indefinidos y negativos (`никто`, `ничего`, `кто-то`): son `кто`/`что`
//   con prefijo o sufijo, y su punto —la doble negación— no está en el
//   inventario. Es uno de los nueve huecos del currículo ya declarados.
// · los numerales declinados (`u10-numerales-declinados`, B2).
import { ortografiar } from './paradigma-ru';
import type { CasoRu } from './paradigma-ru';
import { revisarOrtografiaRu, quitarAcento } from '../../../lang/ortografia-ru';
import type { Aviso } from './paradigma-ru';
import {
  casillaAdj, type EntradaAdjetival, type FormaAdjetival,
} from './paradigma-adj-ru';

// ══════════════════════════════════════════════════════════════════════
// 1 · LOS PERSONALES
// ══════════════════════════════════════════════════════════════════════

export type PersonaPron = '1sg' | '2sg' | '3sgM' | '3sgF' | '3sgN' | '1pl' | '2pl' | '3pl' | 'refl';

interface FilaPron {
  /** `null` en `refl`: **`себя` no tiene nominativo**, y eso no es un hueco
   *  del fichero sino un hecho del paradigma. Devolverlo como `себя` sería
   *  el fallo que da una forma plausible donde no hay casilla. */
  nom: string | null;
  ac: string;
  gen: string;
  dat: string;
  instr: string;
  /** Ya lleva la н- protética cuando le toca, y no se deriva de una base:
   *  **no existe forma de prepositivo sin preposición**. Guardar `ём` como
   *  base para prefijarle la н- sería meter en el fichero una cadena que no
   *  es una palabra rusa. */
  prep: string | null;
  /** Las tres personas que alternan con н- tras preposición. La regla es
   *  literalmente prefijar `н`, sin una excepción: его→него, ему→нему,
   *  им→ним, её→неё, ей→ней, их→них, ими→ними. */
  alternaN?: boolean;
  /** La variante del XIX, cuando la tiene (мной/мною). Ver
   *  `variantesInstrSgFem` en `paradigma-ru.ts`: misma clase, mismo motivo. */
  nota?: string;
}

export const PERSONALES: Record<PersonaPron, FilaPron> = {
  // Las cuentas son de `buscar()`, con límite de palabra a los dos lados.
  '1sg':  { nom: 'я',   ac: 'меня', gen: 'меня', dat: 'мне',  instr: 'мной',  prep: 'мне',
            nota: 'я 111005 · меня 30813 · мне 30238 · мной 2646. ⚠ мне es dativo Y prepositivo: la casilla no se puede pedir «por la forma». Y мною sale 1863 frente a мной 2646, el 41 % — la variante del XIX aquí es casi la mitad, más que en cualquier sustantivo' },
  '2sg':  { nom: 'ты',  ac: 'тебя', gen: 'тебя', dat: 'тебе', instr: 'тобой', prep: 'тебе',
            nota: 'ты 27330 · тебя 8755 · тебе 8633 · тобой 1501 · тобою 487 (25 %)' },
  '3sgM': { nom: 'он',  ac: 'его',  gen: 'его',  dat: 'ему',  instr: 'им',    prep: 'нём', alternaN: true,
            nota: 'он 97925 · его 54437 · ему 23916 · им 5191. El prepositivo va SIEMPRE con н- (нём 299 con ё · 3620 sin) porque la casilla no existe sin preposición' },
  '3sgF': { nom: 'она', ac: 'её',   gen: 'её',   dat: 'ей',   instr: 'ей',    prep: 'ней', alternaN: true,
            nota: 'она 45614 · её 2591 (+ее 26835: la ё bimodal por edición) · ей 11135 · ею 695. ⚠ ей es dativo Y instrumental, y el instrumental tiene su variante ею: tres lecturas para una cadena' },
  '3sgN': { nom: 'оно', ac: 'его',  gen: 'его',  dat: 'ему',  instr: 'им',    prep: 'нём', alternaN: true,
            nota: 'el neutro comparte TODO el oblicuo con el masculino: un ítem de oblicuo no puede medir el género del antecedente' },
  '1pl':  { nom: 'мы',  ac: 'нас',  gen: 'нас',  dat: 'нам',  instr: 'нами',  prep: 'нас',
            nota: 'мы 13352 · нас 7159 · нам 4390 · нами 1172. ⚠ нас es acusativo, genitivo Y prepositivo, y NO lleva prótesis: la н- es parte del lema' },
  '2pl':  { nom: 'вы',  ac: 'вас',  gen: 'вас',  dat: 'вам',  instr: 'вами',  prep: 'вас',
            nota: 'вы 31261 · вас 12251 · вам 11365 · вами 2441' },
  '3pl':  { nom: 'они', ac: 'их',   gen: 'их',   dat: 'им',   instr: 'ими',   prep: 'них', alternaN: true,
            nota: 'они 14142 · их 12756 · им 5191 · ими 444. ⚠ `им` es a la vez dativo plural y instrumental singular masculino/neutro' },
  'refl': { nom: null,  ac: 'себя', gen: 'себя', dat: 'себе', instr: 'собой', prep: 'себе',
            nota: 'себя 13128 · себе 10824 · собой 2334 · собою 1895 (45 %). SIN NOMINATIVO por construcción, y sin género ni número: es el único pronombre del ruso que no los tiene' },
};

// ══ ⚠ LA н- NO DEPENDE DE QUE HAYA PREPOSICIÓN: DEPENDE DE CUÁL ══════
//
// **Corrección del lingüista adversarial, 2026-09-12, y es el mismo defecto
// que `locativo2` ya tenía escrito dos ficheros más allá.** La v0 de este
// fichero tomaba `trasPreposicion: boolean` y su comentario afirmaba que la
// regla es «literalmente prefijar `н`, sin una excepción». Es falso, y la
// clase que lo rompe no es marginal:
//
//     навстречу ему  73 · *навстречу нему  0      вслед ему  22 · *вслед нему 0
//     вслед ей        7 · *вслед ней       0      вслед им    2 · *вслед ним  0
//     благодаря ему   6 · *благодаря нему  0      подобно ему 5 · *подобно нему 0
//     навстречу ей   13 · *навстречу ней   0      насчёт его 14 · *насчёт него 0
//
// **129 apariciones contra CERO.** Tras preposición de origen ADVERBIAL que
// rige dativo (навстречу, вслед, благодаря, подобно, вопреки, наперекор,
// согласно) y tras locución prepositiva (насчёт, в отношении, при помощи, за
// исключением) el ruso NO añade la н-. АГ-80 I, «начальное н у местоимений
// 3-го лица»; Розенталь, *Справочник*, «Употребление форм местоимений».
//
// Es exactamente lo que `locativo2` tiene escrito: «LA PREPOSICIÓN VA CON LA
// FORMA, porque es LÉXICA y no libre». Allí se aprendió con `в берегу` 0
// frente a `на берегу` 203; aquí se escribió el boolean igualmente, y encima
// con un comentario que juraba que no había excepciones. **Una afirmación en
// prosa que dice «sin una excepción» es la que nadie vuelve a mirar.**
//
// ══ Y LA LISTA ES ALLOWLIST, NO DENYLIST ═════════════════════════════
//
// La clase que SÍ toma н- es abierta (todas las preposiciones primarias); la
// que no la toma es pequeña y enumerable. Enumerar la pequeña sería la
// denylist disfrazada de allowlist: lo que faltara tomaría н- y saldría
// `*навстречу нему`. Por eso se enumeran **las dos** y una preposición que no
// esté en ninguna devuelve `null`: la máquina no adivina, y el que escriba el
// lote tiene que declararla.

/** Preposiciones primarias: el pronombre de 3.ª toma н-. Con su cuenta. */
export const PREPOSICIONES_CON_N: Record<string, string> = {
  'в': 'в нём 775', 'на': 'на него', 'у': 'у него 5404', 'к': 'к нему 3855',
  'с': 'с ним 4268', 'о': 'о нём 775', 'от': 'от неё 751', 'для': 'для него 989',
  'из': 'из него', 'до': 'до него', 'за': 'за ним', 'под': 'под ним',
  'над': 'над ним', 'при': 'при нём 206', 'без': 'без него', 'про': 'про него',
  'через': 'через него', 'между': 'между ними', 'перед': 'перед ним',
  'по': 'по нему', 'об': 'об нём',
};

/** Preposiciones de origen ADVERBIAL que rigen dativo, y locuciones
 *  prepositivas: **NO** toman н-. Medido, y el número va con cada una. */
export const PREPOSICIONES_SIN_N: Record<string, string> = {
  'навстречу': 'навстречу ему 73 · *навстречу нему 0 · навстречу ей 13',
  'вслед': 'вслед ему 22 · *вслед нему 0 · вслед ей 7 · вслед им 2',
  'благодаря': 'благодаря ему 6 · *благодаря нему 0',
  'подобно': 'подобно ему 5 · *подобно нему 0',
  'вопреки': 'АГ-80 lo pone en la clase; 0 apariciones con pronombre en la biblioteca — la ausencia no prohíbe',
  'наперекор': 'ídem',
  'согласно': 'ídem',
  'насчёт': 'насчёт его 14 (насчет 12 + насчёт 2) · *насчёт него 0 — locución prepositiva lexicalizada',
  'в отношении': 'в отношении его 2 · 0 con н-',
  'при помощи': 'locución prepositiva: АГ-80',
  'за исключением': 'ídem',
};

/** UNA CASILLA DE PRONOMBRE PERSONAL, Y EL REGENTE ES OBLIGATORIO.
 *
 *  `regente` es **la preposición**, no un booleano, y no tiene valor por
 *  omisión: `его`, `него` y `ему` tras `навстречу` son las tres correctas en
 *  su sitio y un valor por omisión elegiría una en silencio.
 *
 *  Devuelve `null` en CUATRO sitios, y los cuatro son o hechos de la lengua o
 *  la máquina diciendo que no sabe:
 *    · el nominativo de `себя` (no existe);
 *    · el prepositivo sin preposición (tampoco — el caso se llama así);
 *    · el nominativo CON preposición (la simétrica);
 *    · una preposición que no está en ninguna de las dos listas. */
export function pronombre(
  p: PersonaPron,
  caso: CasoRu,
  ctx: { regente: string | null },
): string | null {
  const f = PERSONALES[p];
  const reg = ctx.regente;
  if (reg !== null && !(reg in PREPOSICIONES_CON_N) && !(reg in PREPOSICIONES_SIN_N)) return null;
  const conN = reg !== null && reg in PREPOSICIONES_CON_N;
  if (caso === 'prep') return reg === null ? null : f.prep;
  if (caso === 'nom') return reg === null ? f.nom : null;
  const base = f[caso];
  return f.alternaN && conN ? 'н' + base : base;
}

/** La variante en `-ою/-ею` del INSTRUMENTAL del pronombre.
 *
 *  ⚠ EXIGE EL CASO, Y NO PORQUE QUEDE MÁS ORDENADO. La v0 miraba sólo la
 *  FORMA, y `ей` es dativo **e** instrumental —lo dice la nota de `3sgF` dos
 *  líneas más arriba—, así que licenciaba un dativo `*ею` que no existe:
 *  leídas 12 de las 695 apariciones de `ею` con `--ctx`, todas son
 *  instrumentales («махнул ею», «завладели ею совершенно»), cero dativas.
 *
 *  Y el proyecto ya lo tenía escrito: `variantesInstrSgFem` lleva la casilla
 *  en el nombre **con ese motivo exacto**, y un fichero más allá la hermana
 *  nació sin ella. La copia N+1 que se desincroniza, con el aviso delante.
 *  Lo encontró el lingüista adversarial el 2026-09-12, y el test que fijaba
 *  el fallo estaba escrito.
 *
 *  Proporciones, y son MAYORES que en el sustantivo: собою 1895 frente a
 *  собой 2334 (45 %), мною 1863 frente a мной 2646 (41 %), тобою 487 (25 %). */
export function variantePronominalXIX(forma: string, caso: CasoRu): string[] {
  if (caso !== 'instr') return [];
  const f = quitarAcento(forma);
  if (f === 'ей') return ['ею'];
  if (f.endsWith('ой')) return [f.slice(0, -2) + 'ою'];
  return [];
}

// ══════════════════════════════════════════════════════════════════════
// 2 · LOS POSESIVOS
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ Y AQUÍ ESTÁ EL CONTENIDO DE `u6-svoj`, QUE NO ES MORFOLÓGICO. Las tres
// formas de tercera persona —`его`, `её`, `их`— son INVARIABLES: son el
// genitivo del pronombre personal usado como posesivo, no un adjetivo. O sea
// que el alumno no tiene que declinarlas nunca, y toda la dificultad del
// punto es la ELECCIÓN entre `свой` (remite al sujeto) y `его` (remite a
// otro), que es léxica y no de forma. Un lote de ese punto que pida declinar
// está midiendo `u6-adjetivo-declinado`.
//
// Las cinco declinables van por DOS filas, que son la blanda y la dura de
// una declinación pronominal propia —ni la adjetival ni la nominal—:
//
//     мой/твой/свой   мо-  + й/я/ё   →  моего, моему, моим, моём
//     наш/ваш         наш- + Ø/а/е   →  нашего, нашему, нашим, нашем
//
// El sentinela `%` de `ortografiar` resuelve las dos casillas con /o/:
// `моём` (tónica ⇒ ё) frente a `нашем` (átona tras sibilante ⇒ е), y `моё`
// frente a `наше`. Es la misma regla del sustantivo y del adjetivo, en su
// tercer sitio, y sigue viviendo en una sola función.
export interface EntradaPosesiva {
  lema: string;
  /** `mo` = мой/твой/свой · `nash` = наш/ваш. */
  fila: 'mo' | 'nash';
  glosa: string;
  nota?: string;
}

export const POSESIVOS: EntradaPosesiva[] = [
  { lema: 'мой',  fila: 'mo',   glosa: 'mi',
    nota: 'мой 6961 · моего 2058 · моему 1189 · моим 769 · моём 56 con ё · моем 721 sin · моя 3785 · моей 2777 · моё 252 con ё · мое 2570 sin · мои 2479. ⚠ LAS DOS CIFRAS DE LA Ё SE CORRIGIERON EL 2026-09-12: la v0 escribía «моём 777» y «моё 2822», que son los totales FUNDIDOS —lo que devuelve `contar()`— presentados como si fueran la cuenta con ё. En un fichero cuya lección central es que la fusión de la ё deja pasar los errores que CONSISTEN en la ё, citar el total fundido como si fuera el sensible es la mina exacta. Y `моем` 721 está además contaminado por la 1.ª pl de `мыть`' },
  { lema: 'твой', fila: 'mo',   glosa: 'tu' },
  { lema: 'свой', fila: 'mo',   glosa: 'su (del sujeto)',
    nota: 'свой 3035 · своего 4711 · своим 3321 · свою 6209 · своей 5795 · свои 3975. Es el más frecuente de los cinco en oblicuo, y su punto (u6-svoj) NO es de forma: es la elección frente a его/её/их, que son INVARIABLES' },
  { lema: 'наш',  fila: 'nash', glosa: 'nuestro',
    nota: 'наш 1847 · нашего 1121 · нашим 310 · нашем 458 · наша 717 · нашей 843 · наше 744 · наши 1261' },
  { lema: 'ваш',  fila: 'nash', glosa: 'vuestro, su (de usted)',
    nota: 'ваш 1138 · вашего 969 · вашу 611 · вашим 479' },
];

/** Los posesivos de 3.ª persona, que NO declinan. Están aquí para que el
 *  hecho sea consultable en vez de sabido: es la mitad de `u6-svoj`. */
export const POSESIVOS_INVARIABLES: Record<string, string> = {
  его: 'de él / de ello — genitivo del personal usado como posesivo, invariable',
  её: 'de ella — ídem',
  их: 'de ellos — ídem',
};

const FILA_MO: Record<FormaAdjetival, (string | null)[]> = {
  //   nom  ac    gen    dat     instr  prep
  m:  ['й', null, 'его', 'ему',  'им',  '%м'],
  f:  ['я', 'ю',  'ей',  'ей',   'ей',  'ей'],
  n:  ['%', '%',  'его', 'ему',  'им',  '%м'],
  pl: ['и', null, 'их',  'им',   'ими', 'их'],
};

const FILA_NASH: Record<FormaAdjetival, (string | null)[]> = {
  m:  ['',  null, 'его', 'ему',  'им',  '%м'],
  f:  ['а', 'у',  'ей',  'ей',   'ей',  'ей'],
  n:  ['%', '%',  'его', 'ему',  'им',  '%м'],
  pl: ['и', null, 'их',  'им',   'ими', 'их'],
};

const CASOS: CasoRu[] = ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'];

export function temaPosesivo(e: EntradaPosesiva): string {
  return e.fila === 'mo' ? quitarAcento(e.lema).slice(0, -1) : quitarAcento(e.lema);
}

/** Una casilla de posesivo. El acusativo masculino y plural exigen la
 *  animacidad, igual que en el adjetivo y por la misma razón. */
export function casillaPosesiva(
  e: EntradaPosesiva,
  forma: FormaAdjetival,
  caso: CasoRu,
  opts: { animado?: boolean } = {},
): string | null {
  if (caso === 'ac' && (forma === 'm' || forma === 'pl')) {
    if (opts.animado === undefined) return null;
    return casillaPosesiva(e, forma, opts.animado ? 'gen' : 'nom', opts);
  }
  const fila = e.fila === 'mo' ? FILA_MO : FILA_NASH;
  const des = fila[forma][CASOS.indexOf(caso)] ?? null;
  if (des === null) return null;
  // `мо-` es blando y tónico (моём); `наш-` es sibilante y átono (нашем).
  const ctx = e.fila === 'mo'
    ? { clase: 'blando' as const, tonica: true }
    : { clase: 'duro' as const, tonica: false };
  return ortografiar(temaPosesivo(e), des, ctx);
}

// ══════════════════════════════════════════════════════════════════════
// 3 · LOS DEMOSTRATIVOS Y LOS INTERROGATIVOS
// ══════════════════════════════════════════════════════════════════════
//
// TABLAS, y no una regla, porque la declinación pronominal no es ninguna de
// las dos que ya existen: `этот` hace `этим` y no `*этым` —т no es velar ni
// sibilante, así que ninguna regla ortográfica lo explica—, y `тот` hace
// `тем/тех/те` con una alternancia de tema que no tiene nadie más. Derivarlos
// sería escribir una tercera declinación para dos lemas, y el lexicón
// entero cabe en veinte líneas.
//
// ⚠ Y EL CONTENIDO DE `u6-demostrativos` NO ES LA FORMA. Su `gratis` lo dice
// medido: `этот` cubre a la vez «este» Y «ese», y `тот` no es «ese» sino
// «aquel / el ya mencionado». El punto examina la forma porque la elección es
// un RE-REPARTO de la frontera, y eso es otro punto.
export type LemaDeterminante = 'этот' | 'тот' | 'кто' | 'что' | 'какой' | 'чей';

type TablaDet = Partial<Record<`${FormaAdjetival}.${CasoRu}`, string>>;

export const DETERMINANTES: Record<
  LemaDeterminante,
  { tabla: TablaDet; glosa: string; nota?: string; lecturaYo?: Record<string, string> }
> = {
  'этот': {
    glosa: 'este, ese',
    nota: 'этот 7492 · этого 8912 · этому 1637 · этим 2693 · этом 5957 · эта 3733 · эту 3996 · этой 3948 · это 49469 · эти 5433 · этих 2643 · этими 495. ⚠ `этим` y no *этым: la declinación pronominal no pasa por la regla velar/sibilante, porque no hay velar ni sibilante — es OTRA declinación. Y `это` 49469 no es sólo el neutro: es el demostrativo-sujeto («это книга»), un homógrafo masivo de su propia casilla',
    tabla: {
      'm.nom': 'этот', 'm.gen': 'этого', 'm.dat': 'этому', 'm.instr': 'этим', 'm.prep': 'этом',
      'f.nom': 'эта', 'f.ac': 'эту', 'f.gen': 'этой', 'f.dat': 'этой', 'f.instr': 'этой', 'f.prep': 'этой',
      'n.nom': 'это', 'n.ac': 'это', 'n.gen': 'этого', 'n.dat': 'этому', 'n.instr': 'этим', 'n.prep': 'этом',
      'pl.nom': 'эти', 'pl.gen': 'этих', 'pl.dat': 'этим', 'pl.instr': 'этими', 'pl.prep': 'этих',
    },
  },
  'тот': {
    glosa: 'aquel, el ya mencionado',
    nota: 'тот 5073 · того 10364 · тому 3422 · тем 7635 · том 6620 · та 1901 · ту 1980 · той 1787 · те 2480 · тех 2577 · теми 230. ⚠ CAMBIA DE TEMA en cuatro casillas: тем/тех/те/теми con `те-` y no `то-`, y eso no lo predice nada. Y `то` 63834 es el homógrafo más grande del idioma: la conjunción de «если… то», la partícula `-то` y el neutro del demostrativo comparten cadena',
    tabla: {
      'm.nom': 'тот', 'm.gen': 'того', 'm.dat': 'тому', 'm.instr': 'тем', 'm.prep': 'том',
      'f.nom': 'та', 'f.ac': 'ту', 'f.gen': 'той', 'f.dat': 'той', 'f.instr': 'той', 'f.prep': 'той',
      'n.nom': 'то', 'n.ac': 'то', 'n.gen': 'того', 'n.dat': 'тому', 'n.instr': 'тем', 'n.prep': 'том',
      'pl.nom': 'те', 'pl.gen': 'тех', 'pl.dat': 'тем', 'pl.instr': 'теми', 'pl.prep': 'тех',
    },
  },
  'кто': {
    glosa: 'quién',
    nota: 'кто 8411 · кого 2803 · кому 1404 · кем 866 · ком 232. Sin género ni número: cuatro casillas y ninguna concordancia. Y `кого` es acusativo Y genitivo, porque кто es ANIMADO por definición',
    tabla: { 'm.nom': 'кто', 'm.ac': 'кого', 'm.gen': 'кого', 'm.dat': 'кому', 'm.instr': 'кем', 'm.prep': 'ком' },
  },
  'что': {
    glosa: 'qué',
    nota: 'что 132218 · чего 6689 · чему 1403 · чем 9809 · чём 10110. ⚠ `что` es la palabra más frecuente del corpus y casi nunca es el interrogativo: es la conjunción «que». Contar `что` no mide esta casilla, y por eso el punto no puede justificarse contando. Y `чем` es instrumental Y la conjunción comparativa',
    lecturaYo: { 'n.instr': '⚠ LEÍDO EL 2026-09-12, y lo cazó el barrido de la ё la PRIMERA VEZ que se le enseñaron los pronombres. `чём` está atestado 301 veces contando SIN fundir la ё, y NO es una variante del instrumental: es el PREPOSITIVO del mismo lema («о чём», «в чём», «ни в чём»), que esta misma tabla guarda aparte. Es la lectura (b) del criterio, otra casilla del mismo lema. Y lo que se lleva es más grande que la lectura: **éste es el único sitio del paradigma pronominal donde la ё no es una variante de edición sino la MARCA DEL CASO** — `чем` instrumental frente a `чём` prepositivo se distinguen sólo por ella. Como el corpus es bimodal por edición y 1.295 lecturas no escriben la ё nunca, en la mayoría de los textos que el alumno lee las dos casillas son la MISMA cadena. Consecuencia: ningún ítem puede pedir ese contraste a partir de un texto sin ё, y la ё tampoco puede ser la pista (es propiedad de la edición). El par vive en la LECCIÓN, no en un hueco' },
    tabla: { 'n.nom': 'что', 'n.ac': 'что', 'n.gen': 'чего', 'n.dat': 'чему', 'n.instr': 'чем', 'n.prep': 'чём' },
  },
  'какой': {
    glosa: 'qué, cuál (de qué clase)',
    nota: 'какой 6195 · какого 1497. Declina como un ADJETIVO duro de desinencia tónica (= большой), así que no necesita tabla propia: se declina con `paradigma-adj-ru` y aquí sólo va el nominativo para que el inventario esté completo',
    tabla: { 'm.nom': 'какой' },
  },
  'чей': {
    glosa: 'de quién',
    nota: 'чей 206 · чьего 23 · чья 136 · чьё 12 con ё · чье 67 sin (total fundido 79 — corregido el 2026-09-12, era el fundido citado como sensible). BAJA ATESTACIÓN, y entra por la regla y no por la frecuencia: es el único determinante con vocal fugaz (чей → чь-), la misma clase que `день`',
    tabla: { 'm.nom': 'чей', 'm.gen': 'чьего', 'f.nom': 'чья', 'n.nom': 'чьё' },
  },
};

/** `какой` declina como `большой`: se declara y no se copia. */
export const KAKOJ_COMO_ADJETIVO: EntradaAdjetival = {
  lema: 'какой', tema: 'duro', desinenciaTonica: true, glosa: 'qué, cuál',
  nota: 'el interrogativo adjetival declina como un adjetivo duro de desinencia tónica. Se declara como adjetivo en vez de copiarle una tabla: una tabla suya sería la sexta copia de la fila dura',
};

// ══════════════════════════════════════════════════════════════════════
// LOS INVARIANTES
// ══════════════════════════════════════════════════════════════════════
export function invariantesPronominales(): Aviso[] {
  const out: Aviso[] = [];
  const mira = (lema: string, celda: string, forma: string | null) => {
    if (forma === null || !forma.trim()) {
      out.push({ lema, clase: 'casilla-nula', detalle: celda });
      return;
    }
    for (const h of revisarOrtografiaRu(forma)) {
      out.push({ lema, clase: `ortografia:${h.clase}`, detalle: `${celda} = ${forma}` });
    }
  };

  for (const p of Object.keys(PERSONALES) as PersonaPron[]) {
    for (const c of CASOS) {
      // Las dos casillas que NO existen por construcción se saltan: el
      // nominativo de `себя` y el prepositivo sin preposición. Comprobarlas
      // como huecos sería marcar como defecto un hecho de la lengua, que es
      // el gate ruidoso.
      if (c === 'nom' && p === 'refl') continue;
      const regente = c === 'prep' ? 'о' : null;
      mira(p, `${c}${regente ? ` (tras ${regente})` : ''}`, pronombre(p, c, { regente }));
      if (PERSONALES[p].alternaN && c !== 'prep' && c !== 'nom') {
        mira(p, `${c} (tras к)`, pronombre(p, c, { regente: 'к' }));
        // ⚠ Y LA CLASE SIN н-, que es la que el boolean no podía expresar.
        mira(p, `${c} (tras навстречу)`, pronombre(p, c, { regente: 'навстречу' }));
      }
    }
    // ⚠ EL INVARIANTE QUE NO SE PUEDE ESCRIBIR COMO NORMA: la н- protética
    // tiene que CAMBIAR algo. Si `alternaN` se le pusiera a `1sg`, saldría
    // `*нменя` y nada fallaría; si se le quitara a `3sgM`, saldría `у его`
    // y tampoco. Lo que lo fija es que las tres personas que alternan sean
    // exactamente las que tienen forma distinta tras preposición.
    const alterna = (['ac', 'gen', 'dat', 'instr'] as CasoRu[]).some(
      (c) => pronombre(p, c, { regente: 'к' }) !== pronombre(p, c, { regente: null }),
    );
    if (alterna !== Boolean(PERSONALES[p].alternaN)) {
      out.push({ lema: p, clase: 'protetica-inconsistente', detalle: `alternaN=${PERSONALES[p].alternaN} y la alternancia real es ${alterna}` });
    }
  }

  // ⚠ EL INVARIANTE QUE LA v0 NO PODÍA TENER, porque su firma no expresaba el
  // hecho: **ninguna preposición de la clase sin prótesis puede producir una
  // forma con н-.** Con `trasPreposicion: boolean` la condición ni se podía
  // escribir; con el regente, es una línea. Es el §4.23: para garantizar una
  // intención, busca el invariante que la implica.
  for (const reg of Object.keys(PREPOSICIONES_SIN_N)) {
    for (const p of ['3sgM', '3sgF', '3pl'] as PersonaPron[]) {
      for (const c of ['ac', 'gen', 'dat', 'instr'] as CasoRu[]) {
        const f = pronombre(p, c, { regente: reg });
        const base = PERSONALES[p][c] as string;
        if (f && f.startsWith('н') && !base.startsWith('н')) {
          out.push({ lema: p, clase: 'protetica-donde-no-va', detalle: `«${reg} ${f}» — esa preposición NO toma н- (${PREPOSICIONES_SIN_N[reg]})` });
        }
      }
    }
  }

  for (const e of POSESIVOS) {
    for (const f of ['m', 'f', 'n', 'pl'] as FormaAdjetival[]) {
      for (const c of CASOS) {
        if (c === 'ac' && (f === 'm' || f === 'pl')) continue;   // pide animacidad
        mira(e.lema, `${f}.${c}`, casillaPosesiva(e, f, c));
      }
    }
    // El nominativo generado tiene que ser el lema, igual que en el adjetivo.
    if (casillaPosesiva(e, 'm', 'nom') !== quitarAcento(e.lema)) {
      out.push({ lema: e.lema, clase: 'nominativo-no-es-el-lema', detalle: `la fila da «${casillaPosesiva(e, 'm', 'nom')}»` });
    }
  }

  for (const [lema, d] of Object.entries(DETERMINANTES)) {
    for (const [celda, forma] of Object.entries(d.tabla)) mira(lema, celda, forma);
  }

  // `какой` está en dos sitios y tienen que decir lo mismo: la tabla sólo
  // guarda su nominativo y la entrada adjetival lo deriva. Si alguien
  // cambiara una de las dos, esto lo ve. Es la copia N+1 cerrada por un test
  // en vez de por un comentario.
  if (casillaAdj(KAKOJ_COMO_ADJETIVO, 'm', 'nom') !== DETERMINANTES['какой'].tabla['m.nom']) {
    out.push({ lema: 'какой', clase: 'dos-fuentes-discrepan', detalle: 'la tabla y la entrada adjetival no dan el mismo nominativo' });
  }
  return out;
}
