// scripts/lotes/cloze-ru-a1d.ts — EL CUARTO LOTE RUSO: cloze derivado, A1.
//
//   npx tsx scripts/lotes/cloze-ru-a1d.ts          # gates + tabla + rutas
//   npx tsx scripts/lotes/cloze-ru-a1d.ts --json   # ítems para publicar
//
// DOCE ítems de `u3-plural-nominativo` (A1, `paradigma` → cloze con pista,
// piso 8). La respuesta NO se escribe: la deriva `casillaNominal(e,'nom','pl')`
// desde `lexicon-a1.ts`. El molde es `cloze-ru-a1c.ts` y lo que cambia son los
// pares, los gates propios y las rutas predichas.
//
// ══ LO QUE ESTE LOTE EXAMINA, Y LO QUE DA POR DADO ═══════════════════
//
// `capas: { examina: 'declinacion', dadas: ['genero', 'grafia'] }`.
//
//   · **LA CASILLA ES INVARIANTE EN LOS DOCE, Y ESO NO ES §D5.** El punto ES
//     una casilla —el nominativo plural—, así que exigirle que varíe sería
//     pedirle que midiera otro punto. Lo que tiene que variar, y varía, es la
//     CLASE del lema: seis ejes y CINCO colas distintas (-ы, -и, -а, -ья y un
//     supletivo; la sexta, `-я`, no es escribible con este lexicón y su
//     evidencia negativa está más abajo). Escrito antes de escribir un ítem, porque la lectura
//     contraria —«doce ítems en la misma casilla son uno»— es la que un gate
//     heredado haría.
//   · **EL NÚMERO VA DADO DOS VECES: en la pista, en español, y EN LA LENGUA**,
//     por el verbo en plural que precede al hueco (`стояли`, `лежали`,
//     `виднелись`, `были`, `пришли`, `собрались`, los seis atestados). Ése es
//     el ANCLA y el gate lo comprueba delante del hueco.
//
//     ⚠ CORRECCIÓN DEL LINGÜISTA ADVERSARIAL (E10), escrita en vez de
//     arreglada en silencio porque es una afirmación mía que era FALSA. La v0
//     decía: «Sin él, el nominativo SINGULAR es el lema y el ítem se
//     contestaría copiando el paréntesis». La pista es obligatoria y canónica
//     y escribe literalmente «nominativo plural» en los doce (G3 lo exige),
//     así que quitar el verbo no hace que el lema conteste: hace que el número
//     siga dado, sólo que **en español y no en ruso**. Lo que G4 protege de
//     verdad es (a) que el estímulo sea ruso natural y (b) que el número esté
//     dado las DOS veces — no que sin él el ítem se rompa. Y el mensaje del
//     propio gate llevaba la misma frase falsa dentro.
//
//     ⚠ Y LA CONSECUENCIA MEDIBLE QUE ESTE LOTE NO AÍSLA, dicha en vez de
//     disimulada: **diez de las doce respuestas se obtienen sin leer una sola
//     palabra del marco** — `la-regla-de-dos-pasos` saca 9/12 y
//     `el-paradigma-entero` 12/12 usando sólo `lema` y `genero`. Ninguna ruta
//     mide qué aporta el marco, porque el marco no aporta nada que la pista no
//     dé. El arreglo de fondo —quitar «plural» de la pista y dejar
//     «nominativo · género»— cambiaría los doce ítems ya publicados y no lo
//     decide un parche: queda escrito para el siguiente.
//   · **EL GÉNERO VA DADO EN LA PISTA Y EN NINGÚN OTRO SITIO, y eso es un
//     hecho de la lengua, no un descuido**: el plural ruso NO marca género en
//     ninguna de sus doce casillas (§21.8 del relevo, calculado por
//     `casillasQueDiscriminanGenero`: 0 de 6 en plural). Un adjetivo, un verbo
//     en pasado o un determinante en plural darían exactamente cero
//     información de género. Así que aquí «dado en la lengua» es imposible y
//     la etiqueta es lo único que hay. Va dicho porque el lote 3 pudo darlo en
//     el ancla y éste no puede.
//   · **LA GRAFÍA VA DADA** por `u1-ortografia-sibilantes` (la `и` tras
//     к г х ж ш щ ч), y eso tiene la misma consecuencia medida que el par 5
//     del lote 3: **el par 2 (`книги`/`карты`) no discrimina a nadie que haya
//     hecho el bloque 1**. Está en el lote por la otra razón, escrita en su
//     `motivo`: es el ítem que PRESENTA la evidencia de que una `-и` puede
//     salir de un tema DURO, que es lo que hace creíble —y refutable— la regla
//     falsa «-и ⇒ tema blando».
//
// ══ LO QUE LA MEDICIÓN CAMBIÓ DEL DISEÑO, ANTES DE ESCRIBIR UN ÍTEM ══
//
// ⚠ **LA REGLA DEL SIGNIFICANTE AQUÍ ACIERTA 9 DE 12, Y NO SE ARREGLA
// ELIGIENDO LEMAS PEORES.** Volcado el nominativo plural de los 40 nombres del
// lexicón y comparado contra la regla de la última letra del lema
// (о→а, е→я, ь/й→и, а→ы, я→и, consonante→ы, más la regla velar de u1), la
// regla acierta **30 de 40**. En ruso el tema se LEE en la letra final del
// lema casi siempre, y eso no es una debilidad del lote: es el motivo por el
// que el punto declara `grafia` DADA y por el que su contenido discriminante
// son las CLASES LÉXICAS. Los diez lemas del lexicón donde la regla falla:
// `город`, `учитель`, `лес`, `берег`, `друг`, `человек` (clases léxicas),
// `день` (vocal fugaz), `край`, `сестра` (tema de plural) y `сердце` (donde
// falla mi regla ingenua y no la lengua: el tema es DURO y la `е` del lema no
// lo dice). La consecuencia de diseño **no es subir ningún tope** (§4.35: eso
// falsea el termómetro) sino que las tres fronteras sean las tres clases
// léxicas, y que la tabla de rutas imprima ese 9 en voz alta.
//
// ⚠ **Y EL LEMA QUE NO ENTRA, CON SU MEDIDA:** `лес` → `леса` sería la cuarta
// clase léxica y su forma falsa es `*лесы`… que sale **6 veces** y es OTRO
// LEMA (`леса́` femenino, «sedal»; §35 del relevo). Un ítem cuyo error diana es
// homógrafo de una palabra real no se puede autocorregir por corpus, así que
// la clase entra con `город`, donde `городы` da **0** y `города` **793**.
//
// ══ ★ EL ERROR SIMÉTRICO, Y AQUÍ NO SE CIERRA CON UNA EXCLUSIÓN ══════
//
// Es la clase E5 (la biblioteca DESENSEÑA el punto) y en este punto no es un
// riesgo teórico: **las tres formas que las tres fronteras inducen están las
// tres ATESTADAS**, y ninguna es un error de imprenta.
//
//     друзья 261  ·  други   30   ← vocativo folclórico: «Извольте, други,
//                                    садитесь», «сердечные други» (Afanásiev)
//     люди  3973  ·  человеки 20   ← eslavo eclesiástico e irónico: «не
//                                    человеки судят, а бог», «все мы человеки»
//     города 793  ·  городы   0   ← ésta sí es cero
//
// Leídas una a una con `--ctx`. Las dos primeras son formas VIEJAS y
// ESTILÍSTICAS del mismo lema, no agramaticales, y de eso salen tres
// consecuencias operativas que NO son intercambiables:
//
//   1. **no pueden entrar en `FALSAS_DEL_LOTE`**, porque el veredicto por
//      frecuencia las «rechazaría» (30 < 261) acertando por la razón
//      equivocada — que es el `*лесы` del §35 con el signo cambiado;
//   2. **la norma gana igual** (§0): el plural neutro moderno de `друг` es
//      `друзья` y el de `человек` es `люди`, y eso es citable;
//   3. **y por eso la LECCIÓN tiene que avisar**, o la inmersión deshace lo
//      enseñado. `b3-l1` ya avisaba de `домы` (47) y no de éstas; el aviso se
//      añade en esta misma tanda. ⚠ Y la asimetría que enseña: la lección
//      avisaba del arcaísmo de 47 apariciones y callaba el de 30 y el de 20
//      **que son justo los que este lote convierte en respuesta**.
//
// ⚠ Y UNA CUARTA, MEDIDA Y NO USADA: `учитель` → `учителя` 250 frente a
// `учители` **25**, o sea la MISMA asimetría en la clase léxica de tema
// blando. No entra en el lote porque su frontera repetiría la regla de
// `город`, y queda escrita para que nadie la reproponga como «el par que
// falta».
//
// ══ LO QUE NO ESTÁ AQUÍ, CON SU MOTIVO ══════════════════════════════
//
//   · **Ningún caso que no sea el nominativo.** El plural oblicuo es
//     `u5-declinacion-plural` (A2), y su propio campo `varianza` avisa de que
//     un lote repartido por caso mide una sola regla tres veces.
//   · **Ningún adjetivo, demostrativo ni posesivo en el marco.** Son
//     `u6-adjetivo-declinado` (que YA tiene lote: sus doce respuestas están
//     publicadas y G21 las mira), `u6-demostrativos` y `u6-svoj`.
//   · **Ningún numeral.** `два/три` + sustantivo es `u5-numerales-rigen-caso`
//     y además el sintagma no lleva nominativo plural.
//   · **Ningún lema con vocal fugaz** (`день` → `дни`): el cambio de tema es
//     `u13-alternancias-raiz` y el ítem mediría dos capas.
//   · **`сестра` → `сёстры`**, porque su tema de plural mete una `ё` y el
//     comparador del producto NO pliega la ё (§32 del relevo): el ítem
//     dependería de `variantesSinYo` para no suspender a quien escribe lo que
//     ha leído (`сёстры` 24 · `сестры` 415, y las segundas incluyen el
//     genitivo singular, o sea que el denominador ni siquiera es limpio).
//   · **★ NINGÚN NEUTRO DE TEMA BLANDO, y por tanto ninguna cola `-я`.** El
//     título del punto dice «-ы/-и/-а/-я» y este lote cubre tres de las cuatro:
//     la cuarta no es escribible con este lexicón y la evidencia va guardada en
//     vez de perdida. `море` es el ÚNICO neutro blando de `NOMBRES_A1`, y sus
//     dos problemas se midieron antes de retirarlo: (1) `моря` **240** es un
//     total AMBIGUO —leídas las 16 de «моря и», casi todas son el GENITIVO
//     SINGULAR («на берегу синего моря», «шум моря»), y el nominativo plural
//     aparece en dos— así que citar 240 para esta casilla sería un número
//     verdadero que mide otra cosa; y (2) no hay marco natural donde `моря`
//     sea sujeto plural y su pareja de par también lo sea. El primer marco que
//     escribí (`В сказках упоминались…`) además tenía el verbo a **0**
//     apariciones en 7,7 M. **Lo que hace falta para escribir la cola `-я` es
//     un segundo neutro blando en el lexicón** (`поле` → `поля`, `здание` →
//     `здания`), y eso no lo decide un lote.
//   · **Ningún lema con `locativo2`** bajo в/на: aquí no hay preposición
//     ninguna, así que el gate G5 del lote 1 no tiene nada que hacer y no se
//     hereda. Se dice en vez de copiarse: un gate heredado que no puede
//     disparar es un gate visto sólo en verde.
import fs from 'node:fs';
import path from 'node:path';
import { NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import {
  casillaNominal, type EntradaNominal, type GeneroRu, type TemaRu,
} from '../../lib/data/languages/ru/paradigma-ru';
import { revisarOrtografiaRu, quitarAcento, variantesSinYo } from '../../lib/lang/ortografia-ru';
import { buscar, corpus, INI, FIN } from '../corpus-ru';
import { candidatasConYo } from '../check-paradigma-ru';

/** De qué regla es la sobreaplicación un ítem de frontera. Tipo CERRADO, y
 *  las tres NO son tres redacciones de una: cada una deja intacto lo que la
 *  anterior rompe, y el gate lo RECALCULA sobre el par (lema, respuesta) en
 *  vez de creerse la etiqueta.
 *
 *   · `la-desinencia-la-decide-el-tema` — el tema del plural es el del
 *     singular y la COLA es la que la clase léxica manda (`город` → `города`:
 *     la regla acierta el tema y falla la desinencia).
 *   · `las-desinencias-son-las-cuatro` — la cola no está en {ы, и, а, я}
 *     (`друг` → `друзья`: existe una clase en `-ья` que la regla no tiene).
 *   · `el-plural-se-forma-sobre-el-lema` — la respuesta no comparte ni una
 *     letra inicial con el lema (`человек` → `люди`: no es una desinencia,
 *     es otra palabra).
 */
export type ReglaSobreaplicadaPl =
  | 'la-desinencia-la-decide-el-tema'
  | 'las-desinencias-son-las-cuatro'
  | 'el-plural-se-forma-sobre-el-lema';

/** El eje que el PAR contrasta. Se declara y **el gate lo RECALCULA** contra
 *  las dos entradas nominales: qué propiedad de los dos lemas hace que las
 *  colas difieran. */
export type EjePlRu =
  | 'tema-consonante'   // -ы / -и, el reparto duro/blando del m y del f
  | 'grafia'            // la и tras velar o sibilante, que es capa DADA
  | 'genero-neutro'     // el neutro no entra en el reparto -ы/-и NUNCA: hace -а
  | 'clase-lexica'      // la clase masculina en -а́ tónica
  | 'supletivo-tema'    // el tema del plural no es el del singular
  | 'supletivo-lexema'; // el plural es otro lexema

export interface ClozePlRu {
  p: string;
  /** El lema nominal, tal como está en `NOMBRES_A1`. La respuesta NO se
   *  escribe: la deriva `casillaNominal`. */
  lema: string;
  /** El marco, con `___` para el hueco y `{L}` para el lema entre paréntesis
   *  justo detrás. */
  marco: string;
  /** La pista: NOMBRA lo dado (la casilla y el género) y no dice nada del
   *  tema, de la clase ni de la desinencia. */
  pista: string;
  par: string;
  eje: EjePlRu;
  frontera?: { regla: ReglaSobreaplicadaPl; motivo: string };
}

export const ITEMS: ClozePlRu[] = [
  // ── PAR 1 · EL REPARTO -ы/-и: DURO CONTRA BLANDO, sin velar de por medio ──
  // `столы` 94 · `кони` 120 · `столи` 0 · `коны` 0. Los dos son masculinos
  // inanimados/animados del patio de una casa del XIX y caben en el mismo
  // marco sin forzarlo.
  {
    p: 'u3-plural-nominativo', lema: 'стол', par: 'dvor', eje: 'tema-consonante',
    marco: 'Во дворе стояли ___ ({L}).',
    pista: 'mesa — nominativo plural · masculino',
  },
  {
    p: 'u3-plural-nominativo', lema: 'конь', par: 'dvor', eje: 'tema-consonante',
    marco: 'Во дворе стояли ___ ({L}).',
    pista: 'caballo — nominativo plural · masculino',
  },

  // ── PAR 2 · LA `и` QUE SALE DE UN TEMA DURO — el par que NO discrimina ──
  // `книги` 597 · `карты` 531. Los dos son femeninos de tema DURO y de la 1.ª
  // declinación; lo único que los separa es que `книг-` acaba en velar. Su
  // contraste lo resuelve entero `u1-ortografia-sibilantes`, que es capa
  // DADA, y por eso su valor discriminante es CERO para quien haya hecho el
  // bloque 1 — la tabla de rutas lo imprime. Está en el lote porque es la
  // EVIDENCIA que hace creíble la regla falsa «-и ⇒ tema blando»: aquí un
  // tema duro produce `-и`. Sin ella, el contraste del par 1 se leería como
  // si la letra final del plural fuera el tema.
  {
    p: 'u3-plural-nominativo', lema: 'книга', par: 'sunduk', eje: 'grafia',
    marco: 'В сундуке лежали ___ ({L}).',
    pista: 'libro — nominativo plural · femenino',
  },
  {
    p: 'u3-plural-nominativo', lema: 'карта', par: 'sunduk', eje: 'grafia',
    marco: 'В сундуке лежали ___ ({L}).',
    pista: 'mapa, carta — nominativo plural · femenino',
  },

  // ── PAR 3 · EL NEUTRO NO ENTRA EN EL REPARTO -ы/-и NUNCA ────────────
  // `лица` · `головы` · `лиця` 0 · `голови` 2 (LEÍDAS: las dos son UCRANIANO
  // dentro de diálogo citado —«клепки в голови», «та пыха у тебя взялась в
  // голови»—, o sea que el corpus contiene OTRA LENGUA y no una variante rusa;
  // es el homógrafo del §35 en su versión más incómoda). Los dos lemas son de
  // tema DURO y no velar, así que lo único que separa `-а` de `-ы` es el
  // GÉNERO, y ésa es la mitad del punto que la lección `b3-l1` subraya: el
  // neutro no hace el plural en -ы/-и nunca.
  //
  // ⚠ Y ES EL ÚNICO PAR DEL LOTE CON DOS GÉNEROS, lo cual desactiva para él el
  // teorema del §48 (ver `el-genero-de-la-pista`): va declarado y medido, no
  // disimulado.
  //
  // ⚠ Y LAS DOS CIFRAS QUE NO SE CITAN: `лица` 2126 y `головы` 1166 son
  // totales AMBIGUOS —las dos formas son también el genitivo singular de su
  // lema—, así que un número correcto sobre una forma ambigua mediría otra
  // cosa. Van sin contador, que es lo honesto, y la colocación con el verbo se
  // imprime en la tabla.
  {
    p: 'u3-plural-nominativo', lema: 'лицо', par: 'tolpa', eje: 'genero-neutro',
    marco: 'Над толпой виднелись ___ ({L}).',
    pista: 'cara, persona — nominativo plural · neutro',
  },
  {
    p: 'u3-plural-nominativo', lema: 'голова', par: 'tolpa', eje: 'genero-neutro',
    marco: 'Над толпой виднелись ___ ({L}).',
    pista: 'cabeza — nominativo plural · femenino',
  },

  // ── PAR 4 · LA CLASE EN -а́ TÓNICA — y la frontera 1 ─────────────────
  // `сады` 63 · `города` 793 · `сади` 0 · `городы` 0. Los dos son masculinos
  // de tema duro, inanimados y del mismo campo semántico, así que lo único
  // que los separa es que uno pertenece a una clase léxica que no se predice.
  {
    p: 'u3-plural-nominativo', lema: 'сад', par: 'za-rekoj', eje: 'clase-lexica',
    marco: 'За рекой были ___ ({L}).',
    pista: 'jardín — nominativo plural · masculino',
  },
  {
    p: 'u3-plural-nominativo', lema: 'город', par: 'za-rekoj', eje: 'clase-lexica',
    marco: 'За рекой были ___ ({L}).',
    pista: 'ciudad — nominativo plural · masculino',
    frontera: {
      regla: 'la-desinencia-la-decide-el-tema',
      motivo: 'LA SOBREAPLICACIÓN DE LA REGLA DE DOS PASOS (§0.6), que es la que el propio punto declara como su ítem de sobreaplicación: «la regla ortográfica acierta la letra y falla la casilla». `город` es masculino, de tema duro y su tema no acaba en velar ni en sibilante, así que los dos pasos —tema duro ⇒ -ы, y la regla de u1 no se dispara— dan *городы, que sale CERO veces en 7,7 M de palabras frente a 793 de города. Su distractor está escrito AL LADO, en el otro ítem del mismo par (сады), que es un masculino de tema duro donde la misma regla SÍ acierta: el alumno no tiene que inventarse la analogía, la tiene en la misma frase con la misma preposición y el mismo verbo. ⚠ Y LO QUE ESTA FRONTERA NO ES: no es transferencia. Ni el español de México ni el portugués europeo tienen nada que empuje hacia -ы o hacia -а; el error es intralingüístico y lo produce igual un anglófono. Lo que sí es de este alumno, y va dicho porque es la mitad que se olvida, es que sus DOS lenguas tienen plurales con alternancia de raíz (ovo/ovos, pão/pães) y por tanto NO se sorprenderá de que un plural cambie la palabra: lo que le falta no es la idea, es saber en qué lemas pasa. ⚠ Y EL AVISO DE ÉPOCA, que aquí sí es limpio y en los otros dos frontera no lo es: городы 0, o sea que la biblioteca del XIX no contradice esta casilla. La que sí contradice la clase entera es дом → домы 47, que la lección b3-l1 ya avisa.',
    },
  },

  // ── PAR 5 · EL TEMA DEL PLURAL NO ES EL DEL SINGULAR — frontera 2 ────
  // `товарищи` 309 · `друзья` 261 · `товарищы` 0 · `други` 30 (LEÍDAS: ver la
  // cabecera — son vocativos folclóricos de Afanásiev, o sea una forma vieja
  // del mismo lema y no un error). Los dos son masculinos animados y de
  // significado vecino, así que el marco vale para los dos sin retocarlo.
  {
    p: 'u3-plural-nominativo', lema: 'товарищ', par: 'vecherom', eje: 'supletivo-tema',
    marco: 'Вечером пришли ___ ({L}).',
    pista: 'compañero, camarada — nominativo plural · masculino',
  },
  {
    p: 'u3-plural-nominativo', lema: 'друг', par: 'vecherom', eje: 'supletivo-tema',
    marco: 'Вечером пришли ___ ({L}).',
    pista: 'amigo — nominativo plural · masculino',
    frontera: {
      regla: 'las-desinencias-son-las-cuatro',
      motivo: 'LA SOBREAPLICACIÓN DE «EL PLURAL SE HACE CON -ы/-и/-а/-я», que es literalmente el título del punto: la clase corta en -ья (друзья, братья, сыновья) es una QUINTA cola y no está en el título. El tema además se ablanda (друг → друзь-), así que quien aplique los dos pasos escribe *други —velar ⇒ и— y no *другы. Su distractor es su pareja de par, товарищи, que es un masculino animado donde el tema del plural SÍ es el del singular y la cola SÍ es una de las cuatro. ⚠ Y LO QUE HACE CARA A ESTA FRONTERA, que va dicho en vez de disimulado: **la forma que el error produce NO es agramatical**. `други` sale 30 veces, leídas una a una con --ctx, y son vocativos de cuento popular —«Извольте, други, садитесь», «сердечные други», «Ай вы, други мои милые»—, o sea una forma VIEJA del mismo lema y no una equivocación. Por eso NO está en FALSAS_DEL_LOTE: el veredicto por frecuencia la rechazaría (30 < 261) acertando por la razón equivocada, que es el *лесы del §35 con el signo cambiado. La norma de hoy gana y es citable (друзья es el único plural neutro), pero el alumno va a LEER други en la biblioteca, así que el aviso va a la lección b3-l1 y no a un comentario.',
    },
  },

  // ── PAR 6 · EL SUPLETIVO — frontera 3 ───────────────────────────────
  // `студенты` 53 · `люди` 3973 · `студенти` 0 · `человеки` 20 (LEÍDAS: ver
  // la cabecera — eslavo eclesiástico e irónico, «все мы человеки»). Los dos
  // son masculinos animados de persona.
  {
    p: 'u3-plural-nominativo', lema: 'студент', par: 'ploshchad', eje: 'supletivo-lexema',
    marco: 'На площади собрались ___ ({L}).',
    pista: 'estudiante — nominativo plural · masculino',
  },
  {
    p: 'u3-plural-nominativo', lema: 'человек', par: 'ploshchad', eje: 'supletivo-lexema',
    marco: 'На площади собрались ___ ({L}).',
    pista: 'persona — nominativo plural · masculino',
    frontera: {
      regla: 'el-plural-se-forma-sobre-el-lema',
      motivo: 'LA SOBREAPLICACIÓN MÁS RADICAL DE LAS TRES, y es la única que no deja NADA del lema en pie: `люди` no comparte ni una letra inicial con `человек`. Las dos anteriores conservan algo —`города` conserva el tema entero y `друзья` conserva la raíz reconocible— y por eso el gate las distingue calculando el prefijo común y no leyendo la etiqueta. Quien aplique los dos pasos sobre el lema escribe *человеки (velar ⇒ и), y su distractor está en el mismo marco: `студенты`, un masculino animado de persona cuyo plural SÍ se forma sobre el lema. ⚠ Y ES EL ÍTEM MÁS FRECUENTE DEL LOTE POR UN ORDEN DE MAGNITUD: люди 3973 apariciones, frente a 793 de города y 261 de друзья; el alumno se va a topar con él en la primera página que lea. ⚠ Y LA MISMA ADVERTENCIA QUE EL PAR 5, con su cifra propia: `человеки` sale 20 veces y NO es un error —«не человеки судят, а бог» (Dostoievski), «все мы человеки», «мы, подземные человеки»—, es eslavo eclesiástico y uso irónico del mismo lema, vivo en la prosa del XIX. Tampoco entra en FALSAS_DEL_LOTE, por el mismo motivo, y el aviso va a la lección. ⚠ Y UNA TERCERA COSA QUE NO SE PUEDE PROMETER: este ítem no mide `u3-genero-por-terminacion` ni la animacidad. La pista dice «masculino» y el alumno no puede deducirlo de `люди`, que no marca género ninguno — como no lo marca ningún plural ruso.',
    },
  },
];

// ══════════════════════════════════════════════════════════════════════
// LA DERIVACIÓN, Y NO SE TECLEA
// ══════════════════════════════════════════════════════════════════════
const NOM = new Map(NOMBRES_A1.map((n) => [n.lema, n]));
export function entradaNom(x: ClozePlRu): EntradaNominal | undefined { return NOM.get(x.lema); }

/** LA RESPUESTA, derivada. Si la máquina no sabe, `null` — no se inventa una
 *  forma plausible. */
export function respuestaDe(x: ClozePlRu): string | null {
  const n = entradaNom(x);
  return n ? casillaNominal(n, 'nom', 'pl') : null;
}

/** Las respuestas correctas ALTERNATIVAS, CALCULADAS y nunca declaradas a
 *  mano. Hoy sale vacía en los doce y es comprobable, no un descuido:
 *  ninguno de los doce plurales lleva ё —`сестра` → `сёстры`, que sí la
 *  lleva, está fuera del lote y su motivo va en la cabecera—. */
export function alternativasDe(x: ClozePlRu): string[] {
  const r = respuestaDe(x);
  return r ? variantesSinYo(r) : [];
}

/** La frase que ve el alumno. `{L}` es el lema entre paréntesis: escribirlo a
 *  mano sería la segunda copia de un dato que el ítem ya tiene. */
export function frase(x: ClozePlRu): string { return x.marco.replace('{L}', x.lema); }

/** El ANCLA: el verbo en PLURAL que precede al hueco. Es lo único que fija el
 *  número en la lengua, y sin él el nominativo singular ES el lema. */
export function ancla(x: ClozePlRu): string | null {
  const antes = frase(x).split('___')[0] ?? '';
  const toks = antes.split(/[^\p{L}]+/u).filter(Boolean);
  return toks.length ? toks[toks.length - 1]!.toLowerCase() : null;
}

/** LA COLA: lo que el alumno AÑADE, calculado como el resto de la respuesta
 *  tras el prefijo común con el lema. No es «la desinencia» y por eso no se
 *  llama así: en `друзья` la cola es `зья` y en `люди` es la palabra entera,
 *  que es exactamente lo que las tres fronteras miden. */
export function prefijoComun(a: string, b: string): number {
  const x = quitarAcento(a), y = quitarAcento(b);
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  return i;
}
export function colaDe(x: ClozePlRu): string | null {
  const r = respuestaDe(x);
  return r === null ? null : quitarAcento(r).slice(prefijoComun(x.lema, r));
}

/** ⚠ LOS DOS DATOS QUE NINGUNA REGLA DA, escritos a mano DESDE LA GRAMÁTICA y
 *  no copiados del lexicón: es media parte del segundo camino. Son las
 *  alternancias de tema que un manual lista lema a lema — la vocal fugaz de
 *  `день`, el tema de plural de `сестра`—. Viven arriba porque tanto
 *  `reglaDeManual` como `claseIrregular` las necesitan. */
const TEMAS_DE_MANUAL: Record<string, string> = { 'день': 'дн', 'сестра': 'сёстр' };

/** El TEMA como lo extrae quien lee el lema: quitarle la vocal o el signo
 *  final. Se usa en las rutas y en el control del aparato, nunca en la
 *  respuesta. */
export const temaDelLema = (lema: string) => quitarAcento(lema).replace(/[аяоеьй]$/, '');
const VELAR_O_SIBILANTE = (t: string) => /[кгхжшщч]$/.test(t);

const sinParentesis = (s: string) => s.replace(/\([^)]*\)/g, ' ');
const PALABRA = (w: string) => new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'iu');
const GENERO_ES: Record<GeneroRu, string> = { m: 'masculino', f: 'femenino', n: 'neutro' };

/** La CLASE del irregular, RECALCULADA sobre (lema, respuesta) y no leída de
 *  ningún campo. Es lo que hace que las tres reglas de frontera no sean tres
 *  redacciones de una: cada una deja intacto lo que la siguiente rompe. */
export type ClaseIrregular = 'regular' | 'desinencia' | 'tema' | 'lexema';
/** ⚠ LA v0 DE ESTA FUNCIÓN PREGUNTABA POR LA COLA Y NO POR LA REGLA, y el gate
 *  la cazó en la primera corrida: decía que `город` → `города` es REGULAR,
 *  porque `-а` es una de las cuatro colas del título del punto y el tema queda
 *  intacto. Las dos observaciones son ciertas y la conclusión es falsa: lo que
 *  hace irregular a `города` no es la forma de su cola, es que **no es la cola
 *  que la regla de dos pasos produce para ese lema**. Una clase no se lee en
 *  el resultado: se lee comparándolo contra lo que la regla habría dado.
 *
 *  Por eso la comparación es contra `reglaDeManual` —la regla escrita a mano
 *  en este fichero— y no contra `casillaNominal`, que es de donde sale el
 *  dato: un gate que recomputa la regla del generador se da la razón a sí
 *  mismo (B6). Y que la regla de manual no esté rota lo garantiza
 *  `controlDelAparato()` sobre los cuarenta lemas.
 *
 *  ⚠ SU LÍMITE, AFIRMADO EN UN TEST Y NO SUPUESTO (E7 del lingüista
 *  adversarial). La v0 de esta prosa decía «RECALCULADA y no leída de ningún
 *  campo», y es falso a medias: `reglaDeManual` empieza leyendo
 *  `TEMAS_DE_MANUAL`, así que **la irregularidad de tema que esa tabla absorbe
 *  este clasificador no la ve**. Medido sobre los 40 lemas: `сестра` →
 *  `сёстры` (cambio de tema con ё y acento) y `день` → `дни` (vocal fugaz)
 *  salen los dos «regular», y por tanto **G16b —"ningún irregular sin frontera
 *  declarada"— es CIEGO a esos dos**. Hoy no publica nada malo porque G0 y G0b
 *  los excluyen antes por otra razón; pero si mañana se relaja G0 —por ejemplo
 *  porque el comparador del producto empiece a plegar la ё (§32)— `сестра`
 *  entraría como regular y sin frontera y nadie se enteraría.
 *
 *  Lo que la tabla NO puede fabricar, y por eso la partición de las tres
 *  fronteras no es un artefacto: `друзь`+`ы` no es `друзья` y `люд`+`ы` no es
 *  `люди`. Las dos mitades van en test. */
export function claseIrregular(e: EntradaNominal, resp: string): ClaseIrregular {
  const r = quitarAcento(resp);
  if (r === quitarAcento(reglaDeManual(e.lema, e.genero, e.tema))) return 'regular';
  if (prefijoComun(e.lema, r) === 0) return 'lexema';
  return r.startsWith(TEMAS_DE_MANUAL[e.lema] ?? temaDelLema(e.lema)) ? 'desinencia' : 'tema';
}

// ══════════════════════════════════════════════════════════════════════
// LOS GATES
// ══════════════════════════════════════════════════════════════════════
export function verificar(items: ClozePlRu[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const porPunto = new Map<string, Map<string, number>>();

  for (const [i, x] of items.entries()) {
    const id = `CLRUD-${String(i + 1).padStart(3, '0')} (${x.lema})`;
    const n = entradaNom(x);
    if (!n) { v.push(`${id}: el lema «${x.lema}» no está en NOMBRES_A1`); continue; }

    // ⚠ G0 · LA EXCLUSIÓN VA ANTES DE ABANDONAR POR `null` (§0.8 rumano: dos
    //      comprobaciones independientes no pueden compartir un `continue`).
    //      La ё en el tema de plural: `сестра` → `сёстры`. El comparador del
    //      producto no pliega la ё (§32), así que el ítem dependería de
    //      `variantesSinYo` para no suspender a quien escribe lo que ha leído.
    if (n.temaPl && n.temaPl.includes('ё'))
      v.push(`${id}: el tema de plural «${n.temaPl}» lleva ё y el comparador del producto no la pliega (§32) — el ítem suspendería a quien escribe el ruso de la biblioteca`);
    // G0b · la vocal fugaz es `u13-alternancias-raiz`, otro punto y otra capa.
    if (n.temaOblicuo)
      v.push(`${id}: «${x.lema}» tiene tema oblicuo «${n.temaOblicuo}» (vocal fugaz) — el ítem mediría u13-alternancias-raiz encima de este punto`);

    const r = respuestaDe(x);
    if (!r) { v.push(`${id}: casillaNominal devuelve null para nom.pl — no se inventa una forma plausible`); continue; }
    const alt = alternativasDe(x);
    const s = frase(x);
    const a = ancla(x);

    // G1 · un solo hueco y un solo `{L}`.
    for (const [marca, cuantos] of [['___', s.split('___').length - 1], ['{L}', x.marco.split('{L}').length - 1]] as const)
      if (cuantos !== 1) v.push(`${id}: ${cuantos} «${marca}» en el marco, tiene que haber 1`);
    // G2 · el lema, entre paréntesis y DETRÁS del hueco.
    if (!new RegExp(`___\\s*\\(\\s*${x.lema}\\s*\\)`).test(s))
      v.push(`${id}: la frase no nombra el lema «${x.lema}» entre paréntesis justo detrás del hueco`);
    // G3 · LA PISTA nombra lo DADO (la casilla y el género) y no lo examinado.
    if (!x.pista.includes('nominativo plural')) v.push(`${id}: la pista no nombra la casilla «nominativo plural»`);
    if (!x.pista.includes(GENERO_ES[n.genero])) v.push(`${id}: la pista no nombra el género «${GENERO_ES[n.genero]}» — va DADO y se anota en los doce, no sólo donde hace falta`);
    if (/(tema|dur[oa]|bland[oa]|clase|velar|sibilante|desinencia|termina|acento|t[óo]nic|[áa]ton|irregul|supletiv)/i.test(x.pista))
      v.push(`${id}: la pista nombra el TEMA, la CLASE o la DESINENCIA, que es justo lo que el ítem examina`);
    // G3c · forma canónica de la pista. Cualquier variación tipográfica de la
    //       glosa es una pista del significante: el lote 1 la cometió justo
    //       sobre el par que contrastaba.
    if (!new RegExp(`^[^—·]+ — nominativo plural · (${Object.values(GENERO_ES).join('|')})$`).test(x.pista))
      v.push(`${id}: la pista «${x.pista}» no tiene la forma canónica «<glosa> — nominativo plural · <género>»`);
    // G3d · la glosa es la del LEXICÓN y no una redacción propia: una glosa
    //       tecleada se desincroniza del dato y nadie lo nota.
    if (!x.pista.startsWith(`${n.glosa} —`))
      v.push(`${id}: la glosa de la pista no es la de NOMBRES_A1 («${n.glosa}»)`);
    // G4 · EL ANCLA: un verbo en PLURAL delante del hueco. Sin él el
    //      nominativo singular es el lema y el ítem se contesta copiando.
    if (!a || !/(ли|лись)$/.test(a))
      v.push(`${id}: delante del hueco no hay un verbo en pasado PLURAL (-ли/-лись) — el número dejaría de estar dado EN LA LENGUA y quedaría sólo en la pista, en español. Ver E10 en la cabecera: la v0 de este mensaje decía «y el lema contestaría», y era falso`);
    // G5 · la pista no deletrea la respuesta.
    for (const c of [r, ...alt]) if (PALABRA(quitarAcento(c)).test(x.pista)) v.push(`${id}: la pista deletrea la respuesta «${c}»`);
    // G6 · la respuesta no está escrita en la frase fuera del paréntesis.
    if (PALABRA(quitarAcento(r)).test(quitarAcento(sinParentesis(s).replace('___', ' ')))) v.push(`${id}: la respuesta «${r}» ya está escrita en la frase`);
    // G7 · LA RESPUESTA NO PUEDE SER EL LEMA. En este punto no hay excepción
    //      posible —el nominativo plural nunca coincide con el singular en
    //      ninguno de los 40 lemas del lexicón— y por eso el gate no tiene la
    //      escapatoria que sí tiene el del lote 3: aquí «copiar el lema» tiene
    //      que dar CERO, y la tabla de rutas lo comprueba.
    if (quitarAcento(r) === quitarAcento(x.lema))
      v.push(`${id}: la respuesta coincide con el lema — se contesta copiando`);
    // G8 · EL ERROR SIMÉTRICO DE LA Ё: toda respuesta con ё acepta la grafía
    //      sin ella (1.752 de 2.180 lecturas no la escriben nunca).
    if (r.includes('ё') && alt.length === 0)
      v.push(`${id}: la respuesta «${r}» lleva ё y no declara la variante sin ё`);
    // G9 · y la mitad contraria: una `е` donde la lengua escribe `ё` es OTRA
    //      palabra. Los dos gates se corren aunque el lote no tenga ninguna ё:
    //      un gate visto sólo en verde no está probado, y menos si está vacío.
    for (const c of candidatasConYo(r)) v.push(`${id}: la respuesta «${r}» tiene variante con ё atestada («${c.forma}» ${c.n}) — la regla del proyecto es producir con ё siempre`);
    // G10 · ortografía y homóglifos en TODO lo que el alumno ve.
    for (const [campo, t] of [['frase', s], ['pista', x.pista], ['respuesta', r], ['alternativas', alt.join(' ')]] as const)
      for (const h of revisarOrtografiaRu(t)) v.push(`${id}: ortografía en ${campo}: «${h.palabra}» (${h.clase})`);
    // G11 · la respuesta, ATESTADA.
    if (buscar(quitarAcento(r)).n === 0) v.push(`${id}: la respuesta «${r}» no aparece ni una vez en 7,7 M de palabras`);
    // G12 · §4.43 RUMANO · EL ANCLA NO PUEDE ENTREGAR LA COLA. En rumano una
    //       regla acertó 4 de 4 sin una palabra de rumano porque el estímulo
    //       llevaba la respuesta pegada. Aquí el ancla es un verbo en pasado
    //       plural y acaba en `-ли`/`-сь`, así que la pregunta hay que
    //       hacerla: que las dos últimas letras no coincidan.
    if (a && quitarAcento(r).slice(-2) === a.slice(-2))
      v.push(`${id}: la respuesta «${r}» y el ancla «${a}» acaban en las mismas dos letras — el estímulo entrega la cola`);

    const m = porPunto.get(x.p) ?? new Map<string, number>();
    m.set(r, (m.get(r) ?? 0) + 1); porPunto.set(x.p, m);
    const clave = s.replace(/\s+/g, ' ').trim().toLowerCase();
    if (vistas.has(clave)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(clave);
  }
  for (const [p, m] of porPunto) for (const [r, k] of m) if (k > 1) v.push(`${p}: la respuesta «${r}» sale ${k} veces`);
  const lemas = new Set(items.map((x) => x.lema));
  if (lemas.size !== items.length) v.push(`el lote repite algún lema (${lemas.size} lemas para ${items.length} ítems) — en un punto de una sola casilla, repetir lema es repetir el ítem`);

  // G13 · LOS PARES DE MARCO. A n = 12 la nula por permutación no rechaza nada
  //       (medido a n = 8 en rumano con p = 0,076 sobre un atajo PLANTADO al
  //       100 %), así que no se corre: lo que protege al lote es que dentro de
  //       un par toda propiedad salvo el lema sea CONSTANTE.
  //
  //       ⚠ Y AQUÍ SE AÑADE UNA QUE LOS TRES LOTES ANTERIORES NO NECESITABAN:
  //       **el GÉNERO tiene que ser el mismo en los dos ítems del par**. La
  //       pista lo escribe, así que un par con géneros distintos regala una
  //       etiqueta que separa las dos respuestas sin saber nada del punto — y
  //       el teorema del §48 (ninguna ruta ciega pasa de la mitad) deja de
  //       valer justo para la ruta que lee la pista.
  const pares = new Map<string, ClozePlRu[]>();
  for (const x of items) if (x.par) { const a = pares.get(x.par) ?? []; a.push(x); pares.set(x.par, a); }
  for (const x of items) if (!x.par) v.push(`${x.lema}: ítem sin par de marco`);
  for (const [k, xs] of pares) {
    if (xs.length !== 2) { v.push(`par «${k}»: ${xs.length} ítems — un par de marco son DOS`); continue; }
    const [a, b] = xs as [ClozePlRu, ClozePlRu];
    if (a.marco !== b.marco) v.push(`par «${k}»: los dos marcos no son idénticos («${a.marco}» / «${b.marco}»)`);
    if (a.lema === b.lema) v.push(`par «${k}»: el mismo lema en los dos ítems`);
    if (a.eje !== b.eje) v.push(`par «${k}»: los dos ítems declaran ejes distintos («${a.eje}» / «${b.eje}»)`);
    const ea = entradaNom(a), eb = entradaNom(b);
    if (!ea || !eb) continue;
    // ⚠ EL GÉNERO CONSTANTE ES LA CONDICIÓN DEL TEOREMA DEL §48, Y TIENE UNA
    //   EXCEPCIÓN DECLARADA: el eje `genero-neutro` contrasta justamente el
    //   género, así que ahí no se puede exigir. Lo que se exige a cambio es
    //   que sea el ÚNICO par que lo haga —si hubiera dos, la etiqueta de la
    //   pista pasaría a separar cuatro respuestas y la ruta `el-genero-de-la-
    //   pista` dejaría de estar acotada—.
    if (ea.genero !== eb.genero && a.eje !== 'genero-neutro')
      v.push(`par «${k}»: los dos lemas son de géneros distintos (${ea.genero}/${eb.genero}) y el eje no es «genero-neutro» — la pista escribe el género y lo regala como pista del significante`);
    if (ea.genero === eb.genero && a.eje === 'genero-neutro')
      v.push(`par «${k}»: declara eje «genero-neutro» y los dos lemas son ${ea.genero} — no hay contraste de género`);
    const ca = colaDe(a), cb = colaDe(b);
    if (ca !== null && ca === cb)
      v.push(`par «${k}»: las dos colas son «-${ca}» — el par no contrasta nada de lo que el punto enseña`);

    // ⚠ G14 · EL EJE DECLARADO SE RECALCULA CONTRA EL LEXICÓN. Exigir un
    //       motivo escrito garantiza que el motivo EXISTA, nunca que sea
    //       cierto (§4.33 rumano). Aquí el eje no es prosa: es QUÉ propiedad
    //       de las dos entradas hace que las colas difieran.
    const ra = respuestaDe(a), rb = respuestaDe(b);
    if (!ra || !rb) continue;
    const kla = claseIrregular(ea, ra), klb = claseIrregular(eb, rb);
    const ta = temaDelLema(a.lema), tb = temaDelLema(b.lema);
    const regulares = kla === 'regular' && klb === 'regular';
    switch (a.eje) {
      case 'tema-consonante':
        if (!regulares) v.push(`par «${k}»: declara eje «tema-consonante» y alguno de los dos es irregular (${kla}/${klb}) — lo que contrasta es la clase léxica`);
        else if (ea.tema === eb.tema) v.push(`par «${k}»: declara eje «tema-consonante» y los dos temas son ${ea.tema}`);
        else if (ea.genero === 'n' || eb.genero === 'n') v.push(`par «${k}»: declara eje «tema-consonante» y hay un neutro — el neutro no entra en el reparto -ы/-и`);
        else if (![ca, cb].every((c) => c === 'ы' || c === 'и')) v.push(`par «${k}»: declara eje «tema-consonante» y las colas son «-${ca}»/«-${cb}», que no son el reparto -ы/-и`);
        break;
      case 'genero-neutro':
        if (!regulares) v.push(`par «${k}»: declara eje «genero-neutro» y alguno de los dos es irregular (${kla}/${klb})`);
        else if ([ea.genero, eb.genero].filter((g) => g === 'n').length !== 1) v.push(`par «${k}»: declara eje «genero-neutro» y no hay exactamente un neutro (${ea.genero}/${eb.genero})`);
        else if (ea.tema !== eb.tema) v.push(`par «${k}»: declara eje «genero-neutro» y los temas difieren (${ea.tema}/${eb.tema}) — el contraste de género se confundiría con el reparto duro/blando`);
        else if (!(ca === 'а' && cb === 'ы') && !(ca === 'ы' && cb === 'а')) v.push(`par «${k}»: declara eje «genero-neutro» y las colas son «-${ca}»/«-${cb}», que no son el contraste -а (neutro) frente a -ы (no neutro)`);
        break;
      case 'grafia':
        if (!regulares) v.push(`par «${k}»: declara eje «grafia» y alguno de los dos es irregular (${kla}/${klb})`);
        else if (ea.tema !== eb.tema) v.push(`par «${k}»: declara eje «grafia» y los temas difieren — lo que contrasta es el tema, no la ortografía`);
        else if (VELAR_O_SIBILANTE(ta) === VELAR_O_SIBILANTE(tb)) v.push(`par «${k}»: declara eje «grafia» y los dos temas son ${VELAR_O_SIBILANTE(ta) ? '' : 'no '}velares o sibilantes — la regla de u1 no separa nada aquí`);
        break;
      case 'clase-lexica':
        if ([kla, klb].filter((z) => z === 'desinencia').length !== 1)
          v.push(`par «${k}»: declara eje «clase-lexica» y las clases recalculadas son ${kla}/${klb} — hace falta exactamente UNO cuyo tema se conserve y cuya cola no sea del reparto regular`);
        else if (ea.tema !== eb.tema) v.push(`par «${k}»: declara eje «clase-lexica» y los temas difieren — el contraste se confunde con el reparto duro/blando`);
        break;
      case 'supletivo-tema':
        if ([kla, klb].filter((z) => z === 'tema').length !== 1)
          v.push(`par «${k}»: declara eje «supletivo-tema» y las clases recalculadas son ${kla}/${klb} — hace falta exactamente UNO cuyo tema de plural NO sea el del singular`);
        break;
      case 'supletivo-lexema':
        if ([kla, klb].filter((z) => z === 'lexema').length !== 1)
          v.push(`par «${k}»: declara eje «supletivo-lexema» y las clases recalculadas son ${kla}/${klb} — hace falta exactamente UNO que no comparta ni una letra inicial con su lema`);
        break;
    }
  }
  // G15 · TODO EJE DECLARADO EXISTE, y con menos de tres la cobertura real no
  //       llega al piso por muchos ítems que haya (§4.25 rumano).
  const ejes = new Set(items.map((x) => x.eje));
  if (ejes.size < 3) v.push(`el lote declara ${ejes.size} ejes distintos (${[...ejes].join(', ')}) — con menos de tres la cobertura real no llega al piso`);
  // G15b · EL TÍTULO DEL PUNTO TIENE DOS MITADES Y SE CUENTAN APARTE.
  //
  //   ⚠ LA v0 CONTABA UNA SOLA COSA Y NO PODÍA FALLAR POR LA RAZÓN QUE SU
  //   MENSAJE NOMBRABA (E9 del lingüista adversarial). Exigía «al menos cuatro
  //   colas» contra el título «-ы/-и/-а/-я y los irregulares frecuentes», y
  //   salía VERDE con cinco… contando `-зья` y `люди` como si fueran
  //   desinencias del reparto. `люди` ni siquiera es una cola: su prefijo común
  //   con el lema es cero, así que la «cola» es la palabra entera. De las
  //   CUATRO desinencias del título el lote produce TRES, y la cabecera lo
  //   confiesa por escrito — o sea que el gate escrito para impedir que el lote
  //   midiera medio título aprobaba justo el lote que declara que le falta un
  //   cuarto. Un gate que puede fallar por una razón y no por la otra tiene que
  //   decirlo en DOS números.
  const REPARTO = ['ы', 'и', 'а', 'я'];
  const colas = [...new Set(items.map((x) => colaDe(x)).filter((c) => c !== null))] as string[];
  const delReparto = colas.filter((c) => REPARTO.includes(c));
  const irregulares = colas.filter((c) => !REPARTO.includes(c));
  if (delReparto.length + irregulares.length < 4)
    v.push(`el lote produce ${delReparto.length} de las cuatro desinencias del reparto (${delReparto.join(', ') || '—'}) y ${irregulares.length} clases irregulares — con menos de cuatro clases en total mide medio título`);
  if (delReparto.length < 3)
    v.push(`el lote produce sólo ${delReparto.length} de las CUATRO desinencias del título (${delReparto.join(', ') || '—'}) — las que falten van con su motivo escrito en la cabecera`);

  // G16 · LAS FRONTERAS. No se cuentan: se comprueba que cada una declare de
  //       QUÉ regla es la sobreaplicación, que ninguna regla se repita, que la
  //       regla declarada SEA la que la clase recalculada dice, y que su
  //       DISTRACTOR SEA ALCANZABLE (D7: uno al que nadie llegaría es relleno).
  const fronteras = items.filter((x) => x.frontera);
  if (fronteras.length === 0) v.push('el lote no declara ni un ítem de frontera — sin él el alumno sobregeneraliza y saca 12/12 (§0.6)');
  const reglas = new Set<string>();
  const ESPERADA: Record<ReglaSobreaplicadaPl, ClaseIrregular> = {
    'la-desinencia-la-decide-el-tema': 'desinencia',
    'las-desinencias-son-las-cuatro': 'tema',
    'el-plural-se-forma-sobre-el-lema': 'lexema',
  };
  for (const x of fronteras) {
    const f = x.frontera!;
    if (reglas.has(f.regla)) v.push(`${x.lema}: dos fronteras sobreaplican la misma regla «${f.regla}» — la segunda no añade cobertura`);
    reglas.add(f.regla);
    if (f.motivo.length < 120) v.push(`${x.lema}: el motivo de la frontera es demasiado corto para decir qué error produce la regla`);
    const r = respuestaDe(x);
    if (!r) continue;
    // ⚠ LA REGLA DECLARADA SE RECALCULA. Sin esto las tres etiquetas serían
    //   tres redacciones intercambiables de «es irregular», que es justo la
    //   trampa que el tipo cerrado por sí solo NO cierra.
    const n = entradaNom(x);
    if (!n) continue;
    const clase = claseIrregular(n, r);
    if (clase !== ESPERADA[f.regla])
      v.push(`${x.lema}: declara la regla «${f.regla}», que pide una irregularidad de clase «${ESPERADA[f.regla]}», y la recalculada sobre («${x.lema}», «${r}») es «${clase}»`);
    // EL DISTRACTOR ALCANZABLE: la forma que licencia la analogía equivocada
    // tiene que ser la respuesta de OTRO ítem del lote, y además del MISMO
    // par — que es la mejor posición posible, porque comparte el marco entero.
    const pareja = items.find((y) => y !== x && y.par === x.par);
    const rp = pareja ? respuestaDe(pareja) : null;
    const np = pareja ? entradaNom(pareja) : undefined;
    if (!pareja || !rp || !np || claseIrregular(np, rp) !== 'regular')
      v.push(`${x.lema}: frontera «${f.regla}» sin distractor alcanzable en su propio par — la pareja tiene que ser un lema donde la regla de dos pasos SÍ acierte`);
  }
  // G16b · Y NINGUNA CLASE IRREGULAR SIN FRONTERA DECLARADA. Es el simétrico
  //        del anterior y es el que de verdad muerde: un irregular publicado
  //        sin declarar es un ítem que el alumno falla y que nadie ha escrito
  //        por qué. En el lote 3 esto no podía pasar porque todas las formas
  //        salían de dos filas; aquí salen de un campo del lexicón.
  for (const x of items) {
    const r = respuestaDe(x), n = entradaNom(x);
    if (!r || !n) continue;
    if (claseIrregular(n, r) !== 'regular' && !x.frontera)
      v.push(`${x.lema}: la respuesta «${r}» es irregular (clase «${claseIrregular(n, r)}») y el ítem no declara frontera — el alumno la falla y el lote no dice por qué`);
  }

  // G17 · LA FUGA ENTRE ÍTEMS, que ningún gate por ítem puede ver. El lote 1
  //       la pagó: su marco empezaba por `Утром`, que es el instrumental de
  //       `утро`, o sea la respuesta-patrón de otro par escrita dos ítems
  //       antes.
  //
  //       ⚠ Y LO QUE ESTE GATE MIRA Y EL DEL LOTE 3 NO PODÍA: aquí la
  //       respuesta es un SUSTANTIVO, así que una desinencia nominal en el
  //       marco no distingue nada —медио lote lleva sustantivos declinados
  //       dentro (`во дворе`, `в сундуке`, `за рекой`)— y un gate que las
  //       marcara marcaría medio lote por ruido. Lo que sí es inequívoco es la
  //       CADENA: ninguna palabra de un marco puede ser la respuesta de otro
  //       ítem.
  const respuestas = new Map<string, string>();
  for (const x of items) { const r = respuestaDe(x); if (r) respuestas.set(quitarAcento(r).toLowerCase(), x.lema); }
  for (const x of items)
    for (const w of sinParentesis(frase(x)).replace('___', ' ').split(/[^\p{L}]+/u).filter((t) => t.length >= 3)) {
      const due = respuestas.get(quitarAcento(w).toLowerCase());
      if (due) v.push(`${x.lema}: el marco contiene «${w}», que es la RESPUESTA del ítem de «${due}»`);
    }
  return v;
}

// ══════════════════════════════════════════════════════════════════════
// G18 · LA FUGA CONTRA LO YA PUBLICADO
// ══════════════════════════════════════════════════════════════════════
//
// Heredado del lote 3, con su exclusión POR IDENTIDAD intacta: un ejercicio
// publicado cuya frase es una de las doce de este lote ES este lote, y sin esa
// exclusión el gate se denuncia a sí mismo en cuanto se publica (§51).
//
// ⚠ Y AQUÍ TIENE UN OBJETO QUE EN EL LOTE 3 NO TENÍA, y por eso vale la pena
// decir lo que midió: con 34 ítems rusos publicados, DOS de los plurales
// naturales de este punto ya son respuestas de `u4-declinacion-singular` —
// `школы` (de «из школы», genitivo singular) y `деревни` (de «из деревни»)—,
// porque el genitivo singular de la 1.ª declinación y el nominativo plural son
// HOMÓGRAFOS en todos los femeninos de tema duro y blando. El diseño se cambió
// antes de escribir los ítems, no después: el par 1 del reparto -ы/-и pasó del
// femenino (школа/деревня) al masculino (стол/конь). **Un homógrafo entre dos
// puntos distintos no lo ve ningún gate por ítem, y el que lo ve es éste.**
export function fugaContraLoPublicado(items: ClozePlRu[], dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  const propias = new Set(items.map((x) => frase(x).replace(/\s+/g, ' ').trim().toLowerCase()));
  const publicadas = new Map<string, string>();
  for (const f of fs.readdirSync(dir).filter((x: string) => /^b\d+\.json$/.test(x)))
    for (const ex of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Array<Record<string, any>>) {
      const frasePub = String(ex?.data?.sentence ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (propias.has(frasePub)) continue;   // soy yo, ya publicado
      for (const b of (ex?.data?.blanks ?? []) as Array<{ answer?: string; alternatives?: string[] }>)
        for (const c of [b.answer, ...(b.alternatives ?? [])])
          if (typeof c === 'string') publicadas.set(quitarAcento(c).toLowerCase(), String(ex.id));
    }
  for (const x of items) {
    const r = respuestaDe(x);
    if (r && publicadas.has(quitarAcento(r).toLowerCase()))
      out.push(`${x.lema}: la respuesta «${r}» ya está publicada en ${publicadas.get(quitarAcento(r).toLowerCase())}`);
    for (const w of sinParentesis(frase(x)).replace('___', ' ').split(/[^\p{L}]+/u).filter(Boolean)) {
      const id = publicadas.get(quitarAcento(w).toLowerCase());
      if (id) out.push(`${x.lema}: el marco contiene «${w}», que es la RESPUESTA del ejercicio ya publicado ${id}`);
    }
  }
  return out;
}

// ══════════════════════════════════════════════════════════════════════
// LAS RUTAS, CON SU NÚMERO Y SU DENOMINADOR PREDICHOS ANTES DE CORRER
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ LAS CIFRAS PREDICHAS SON DE ESTE CONJUNTO DE ÍTEMS Y NO DEL ANTERIOR, y
// va dicho porque el par 3 se cambió DESPUÉS de una primera corrida: la v0
// llevaba `место`/`море` y salió que (a) `упоминались` no aparece ni una vez
// en la biblioteca —o sea un verbo de marco que el alumno no va a leer nunca,
// y además dejaba la ruta por lectura sin denominador— y (b) `моря` 240 es un
// total AMBIGUO, porque casi todas sus apariciones son el genitivo singular
// («на берегу моря», «шум моря») y el nominativo plural es marginal en esta
// biblioteca. Las predicciones se REHICIERON a mano sobre los ítems nuevos
// antes de volver a correr: una predicción heredada de otro conjunto de ítems
// no es un testigo, es una coincidencia.
//
// ⚠ Tres listas, porque son tres preguntas (§25.1). Y `aplicablesPredicho` va
// en el tipo porque el lote 2 demostró que la predicción NO caza un
// instrumento mal elegido: predijo 2 y observó 1, y las dos cifras eran del
// aparato roto.
//
// ⚠ ★ Y EL TOPE DE LAS CIEGAS NO PUEDE FALLAR PARA LAS QUE NO LEEN EL LEMA, y
// va escrito como TEOREMA y no como medición (§48): dentro de un par el marco,
// el verbo, el género y la pista son IDÉNTICOS, así que toda ruta que no lea
// el lema recibe la misma entrada en los dos ítems y acierta como mucho uno de
// los dos — 6 de 12, exactamente el tope, nunca por encima. Las únicas cifras
// informativas son las de las rutas que SÍ leen el lema.
export interface Vista {
  s: string;
  pista: string;
  /** El lema, que está escrito en el paréntesis. */
  lema: string;
  /** El género, que la PISTA deletrea. La ruta NO recibe la entrada del
   *  lexicón: no puede leer `tema` «ni con un `as`».
   *
   *  ⚠ Y NO HAY CAMPO `caso` NI `num` A PROPÓSITO, y es la respuesta
   *  estructural al §47: el aparato de este lote es la regla de plural, y una
   *  ruta que no puede nombrar otra casilla no puede tocar el resto de
   *  `casillaNominal`. Así el control del aparato cubre el 100 % de lo que
   *  cualquier ruta alcanza, y eso es comprobable leyendo el tipo. */
  genero: GeneroRu;
}
export function vista(x: ClozePlRu): Vista | null {
  const n = entradaNom(x);
  return n ? { s: frase(x), pista: x.pista, lema: x.lema, genero: n.genero } : null;
}

/** La regla de u1 (la `и` tras к г х ж ш щ ч), que es capa DADA. Una ruta que
 *  no la aplicara fallaría por algo que el alumno SÍ sabe y su número saldría
 *  más bajo de lo real, que es el peor sesgo posible en un tope. */
const u1 = (tema: string, cola: string) => (VELAR_O_SIBILANTE(tema) ? cola.replace(/^ы/, 'и') : cola);

/** ⚠ LA REGLA DE MANUAL, ESCRITA A MANO AQUÍ Y NO IMPORTADA DE LA MÁQUINA.
 *  La duplicación es deliberada y tiene dos funciones: (a) una ruta modela lo
 *  que el alumno SABE y para poder estar equivocada necesita su propia regla;
 *  (b) escrita a mano es un SEGUNDO CAMINO sobre `casillaNominal`, y
 *  `controlDelAparato()` comprueba que los dos coinciden en los CUARENTA
 *  lemas del lexicón y no sólo en los doce del lote.
 *
 *  Es la regla de dos pasos tal como la trae la gramática escolar: primero el
 *  TEMA, después la ortografía. El neutro va aparte porque no entra en el
 *  reparto -ы/-и nunca. */
export function reglaDeManual(lema: string, genero: GeneroRu, tema: TemaRu): string {
  const t = TEMAS_DE_MANUAL[lema] ?? temaDelLema(lema);
  const blando = tema !== 'duro';
  if (genero === 'n') return t + (blando ? 'я' : 'а');
  return t + u1(t, blando ? 'и' : 'ы');
}

/** ⚠ LA OTRA MITAD DEL SEGUNDO CAMINO, escrita a mano DESDE LA GRAMÁTICA y no
 *  copiada del lexicón.
 *
 *  `PLURALES_DE_MANUAL` son las dos clases que el propio punto declara como no
 *  predecibles: la masculina en `-а́` tónica (Зализняк: дом, город, лес, берег,
 *  учитель, край…) y los supletivos. Si algún día discrepan del lexicón, el
 *  control del aparato se pone rojo y ninguna cifra de la tabla se puede
 *  leer. */
const PLURALES_DE_MANUAL: Record<string, string> = {
  'город': 'города', 'лес': 'леса', 'берег': 'берега', 'учитель': 'учителя',
  'край': 'края', 'письмо': 'письма', 'друг': 'друзья', 'человек': 'люди',
};
/** El plural COMO LO DARÍA UN MANUAL: la lista primero, la regla después. */
export const plural = (lema: string, genero: GeneroRu, tema: TemaRu) =>
  PLURALES_DE_MANUAL[lema] ?? reglaDeManual(lema, genero, tema);

/** ★ EL CONTROL DEL APARATO, y es el §47 aplicado de entrada en vez de
 *  aprendido al final. El lote 3 escribió un control que daba 12/12 estando
 *  roto porque sólo miraba las 6 casillas que sus ítems usaban, de 144.
 *
 *  Aquí la pregunta «¿cuánto del instrumento queda fuera de los casos sobre
 *  los que corro el control?» tiene una respuesta escribible: el instrumento
 *  que las rutas pueden tocar es la regla de plural sobre los lemas del
 *  lexicón —y `Vista` no tiene campo `caso`, así que ninguna ruta puede
 *  alcanzar otra casilla ni con un error de tecleo—. El control corre sobre
 *  los CUARENTA lemas, o sea el 100 % de esa superficie, y no sobre los doce
 *  del lote. Lo que queda fuera y va dicho: cualquier sustantivo ruso que no
 *  esté en `NOMBRES_A1`.
 *
 *  ⚠ Y RECIBE LA REGLA COMO PARÁMETRO, no la lee de un `const` del módulo: un
 *  control que no se puede MUTAR no se puede ver en rojo, y un gate visto sólo
 *  en verde no está probado (B1). El test le pasa una regla con la mitad velar
 *  quitada y comprueba que lo denuncia; y le pasa la de verdad y comprueba que
 *  los cuarenta salen limpios, que es el control negativo (B2). */
export function controlDelAparato(manualDe: (l: string, g: GeneroRu, t: TemaRu) => string = plural): string[] {
  const out: string[] = [];
  for (const e of NOMBRES_A1) {
    const maquina = casillaNominal(e, 'nom', 'pl');
    if (maquina === null) { out.push(`${e.lema}: la máquina no produce nominativo plural`); continue; }
    const manual = manualDe(e.lema, e.genero, e.tema);
    if (quitarAcento(manual) !== quitarAcento(maquina))
      out.push(`${e.lema}: el manual da «${manual}» y la máquina «${maquina}»`);
  }
  return out;
}

export interface Ruta {
  nombre: string;
  porQue: string;
  predicho: number;
  aplicablesPredicho: number;
  correr: (v: Vista) => string | null;
}

export const ESTRATEGIAS: Ruta[] = [
  {
    nombre: 'copiar-el-lema',
    porQue: 'La única cadena que el estímulo entrega. Tiene que dar CERO y su cero no es un resultado: es el control de que la ruta corre, porque `aplicables` se imprime y un cero de una ruta apagada es idéntico a un cero limpio. Y G7 lo fija por el otro lado: en este punto no hay ninguna casilla donde el plural coincida con el lema, así que la excepción que el lote 3 sí necesitaba aquí sería un error.',
    predicho: 0,
    aplicablesPredicho: 12,
    correr: (v) => v.lema,
  },
  {
    nombre: 'pegar-y-al-lema-entero',
    porQue: 'El plural sufijal de sus DOS lenguas, que es lo que el campo `gratis` del punto declara transferido entero: pegar una marca de plural al final de la palabra sin tocar nada más, con la regla ortográfica de u1 —que es capa DADA— encima. Acierta donde el lema acaba en consonante y no hay clase léxica de por medio. Su número es la línea base de verdad de este lote: dice cuántos ítems se contestan sin saber una sola cosa del sistema ruso.',
    predicho: 4,
    aplicablesPredicho: 12,
    correr: (v) => { const l = quitarAcento(v.lema); return l + u1(l, 'ы'); },
  },
  {
    nombre: 'una-cola-fija-al-tema',
    porQue: 'El alumno que se aprende UNA cola y la pega al tema en los doce huecos. Se enumeran todas las colas que el lote usa y se toma la MEJOR, o sea es un máximo buscado (§4.36) y por eso se imprime el barrido entero y no sólo el ganador. Su número dice si el reparto de colas del lote está equilibrado: con seis pares y las colas repartidas, un máximo alto significaría que el lote repite casilla sin saberlo.',
    predicho: 5,
    aplicablesPredicho: 12,
    correr: (v) => temaDelLema(v.lema) + COLA_FIJA,
  },
  {
    nombre: 'rima-con-el-verbo',
    porQue: 'La ruta del significante que no lee el lema salvo para el tema: mapear la terminación del VERBO del marco a una cola. Es otro máximo buscado. ⚠ Y SU NÚMERO ESTÁ ACOTADO POR EL TEOREMA DEL §48 y no por la lengua: los dos ítems de un par comparten el verbo, luego comparten clase de rima, luego el mapa óptimo acierta como mucho uno de los dos. Lo que sí es informativo es que los seis verbos caen en SÓLO DOS clases de rima (-ли y -сь), o sea que el mapa tiene dos entradas para seis pares y el máximo baja por debajo de seis por una razón que no es el diseño pareado.',
    predicho: 5,
    aplicablesPredicho: 12,
    correr: (v) => { const c = MAPA_RIMA.get(verboDelMarco(v.s).slice(-2)); return c ? temaDelLema(v.lema) + c : null; },
  },
  {
    nombre: 'el-genero-de-la-pista',
    porQue: '⚠ LA RUTA QUE EXISTE PORQUE LA PISTA ESCRIBE EL GÉNERO, y sin ella el gate nuevo de este lote (las dos mitades de un par son del mismo género) sería una precaución sin medida. Mapea el género de la pista a una cola, con el máximo buscado. ★ Y SU TOPE NO ES 6 DE 12: ES 6 DE 7, y la corrección la trajo el lingüista adversarial (E5). El teorema del §48 acota a una ruta que no lee el lema a UN acierto por par… y el género SÍ es propiedad del lema, así que el teorema sólo la acota donde el gate obliga a que el género sea constante — y el par `tolpa` está EXENTO por diseño declarado, porque su eje contrasta justamente el género. Ahí la ruta acierta 2 de 2. El techo real se CALCULA (`techoDeLaRutaDelGenero`) sumando 2 por el par exento y 1 por cada uno de los otros cinco, y se imprime: la ruta saca 6 de 7, o sea el 86 % de lo que puede sacar, y la tabla la enseñaba como «50 %, dentro del tope» contra un denominador que este lote no tiene. ⚠ Y la mitad más incómoda, medida: SIN el par del neutro la ruta sacaría 5 de 12 — el 6 que la deja justo en el límite lo fabrica entero la excepción declarada.',
    predicho: 6,
    aplicablesPredicho: 12,
    correr: (v) => { const c = MAPA_GENERO.get(v.genero); return c ? temaDelLema(v.lema) + c : null; },
  },
];

/** ⚠ LOS TRES MÁXIMOS SE BUSCAN, NO SE DECLARAN, y por eso viven en funciones:
 *  una constante escrita a mano se desincroniza del lote en cuanto cambia un
 *  ítem, y entonces la ruta mide otra cosa sin que nada falle. */
const COLAS_DEL_LOTE = () => [...new Set(ITEMS.map((x) => colaDe(x)).filter(Boolean) as string[])];
const aciertaCon = (x: ClozePlRu, s: string) => {
  const r = respuestaDe(x);
  return r !== null && quitarAcento(r) === s;
};
export function barridoColaFija(): { cola: string; aciertos: number }[] {
  return COLAS_DEL_LOTE().map((c) => ({
    cola: c,
    aciertos: ITEMS.filter((x) => aciertaCon(x, temaDelLema(x.lema) + c)).length,
  })).sort((a, b) => b.aciertos - a.aciertos);
}
/** El verbo del marco: la última palabra antes del hueco. */
export const verboDelMarco = (s: string) => {
  const toks = (s.split('___')[0] ?? '').split(/[^\p{L}]+/u).filter(Boolean);
  return toks.length ? toks[toks.length - 1]!.toLowerCase() : '';
};
export function barridoPorClase(clase: (x: ClozePlRu) => string): { clase: string; cola: string; aciertos: number; n: number }[] {
  const clases = new Map<string, ClozePlRu[]>();
  for (const x of ITEMS) { const k = clase(x); clases.set(k, [...(clases.get(k) ?? []), x]); }
  return [...clases].map(([k, xs]) => {
    const mejor = COLAS_DEL_LOTE().map((c) => ({ c, n: xs.filter((x) => aciertaCon(x, temaDelLema(x.lema) + c)).length }))
      .sort((p, q) => q.n - p.n)[0]!;
    return { clase: k, cola: mejor.c, aciertos: mejor.n, n: xs.length };
  });
}
/** ★ EL TECHO REAL DE UNA RUTA QUE LEE SÓLO EL GÉNERO, calculado y no supuesto
 *  (E5). El teorema del §48 da 1 por par a las rutas que no leen el lema; el
 *  género ES propiedad del lema, así que la cota sólo vale donde el gate obliga
 *  a que sea constante dentro del par. En el par exento (`genero-neutro`) la
 *  cota es 2. Se calcula sobre los pares reales para que no se desincronice. */
export function techoDeLaRutaDelGenero(): number {
  const pares = new Map<string, ClozePlRu[]>();
  for (const x of ITEMS) pares.set(x.par, [...(pares.get(x.par) ?? []), x]);
  let t = 0;
  for (const xs of pares.values())
    t += new Set(xs.map((x) => entradaNom(x)?.genero)).size > 1 ? 2 : 1;
  return t;
}
const COLA_FIJA = barridoColaFija()[0]!.cola;
const MAPA_RIMA = new Map(barridoPorClase((x) => verboDelMarco(frase(x)).slice(-2)).map((r) => [r.clase, r.cola]));
const MAPA_GENERO = new Map(barridoPorClase((x) => entradaNom(x)?.genero ?? '?').map((r) => [r.clase as GeneroRu, r.cola]));

export const PERFILES: Ruta[] = [
  {
    nombre: 'la-ultima-letra-del-lema',
    porQue: '★ LA REGLA DE LA PRIMERA PÁGINA DEL MANUAL, y es la que decide el diseño de este lote: о→а, е→я, ь/й→и, я→и, а→ы, consonante→ы, más la regla velar de u1. NO es una ruta ciega —ninguna de las dos lenguas del alumno mapea la vocal final de un sustantivo a una desinencia de plural— y por eso no va contra ningún tope; lo que mide es cuánto del punto se resuelve leyendo el significante. ⚠ Y SU NÚMERO ESTÁ MEDIDO SOBRE LOS 40 LEMAS DEL LEXICÓN ANTES DE ESCRIBIR UN ÍTEM, que es lo que impide leerlo como una propiedad del lote: acierta 30 de 40, o sea que en ruso el tema se LEE en la letra final casi siempre. Los que falla en el lexicón son las clases léxicas, la vocal fugaz y `сердце` —donde falla la regla y no la lengua, porque el tema de `сердце` es DURO y la `е` del lema no lo dice—.',
    predicho: 9,
    aplicablesPredicho: 12,
    correr: (v) => {
      const l = quitarAcento(v.lema);
      const t = temaDelLema(l);
      if (/о$/.test(l)) return t + 'а';
      if (/е$/.test(l)) return t + 'я';
      if (/[ьйя]$/.test(l)) return t + 'и';
      return t + u1(t, 'ы');
    },
  },
  {
    nombre: 'todo-duro',
    porQue: 'Sabe que el neutro va aparte y que existe la regla de u1, y trata TODOS los temas como DUROS. Su número aísla lo que vale el bit de TEMA en este lote. Tiene que fallar exactamente el único blando que queda —`конь`— más los tres irregulares, y que sea UNO solo es un hueco de cobertura declarado: ver la evidencia negativa de `море` en la cabecera.',
    predicho: 8,
    aplicablesPredicho: 12,
    correr: (v) => {
      const t = temaDelLema(v.lema);
      if (v.genero === 'n') return t + 'а';
      return t + u1(t, 'ы');
    },
  },
  {
    nombre: 'la-regla-de-dos-pasos · SIN LAS CLASES LÉXICAS',
    porQue: '★ EL PERFIL QUE DICE QUÉ PARTE DEL LOTE ES DE VERDAD NUEVA. Sabe el tema de cada lema —o sea la tabla entera del punto salvo las listas— y aplica los dos pasos en el orden correcto. Tiene que acertar los NUEVE regulares y fallar los TRES irregulares, ni uno más ni uno menos: si acertara un irregular, la clase léxica de ese ítem sería derivable y el ítem no mediría lo que dice; si fallara un regular, mi regla de manual estaría rota y el control del aparato lo diría antes.',
    predicho: 9,
    aplicablesPredicho: 12,
    correr: (v) => reglaDeManual(v.lema, v.genero, TEMA_DE_MANUAL[v.lema] ?? 'duro'),
  },
  {
    nombre: 'el-paradigma-entero · CONTROL DEL APARATO',
    porQue: '⚠ NO ES UNA RUTA DEL ALUMNO: ES EL CONTROL DE QUE LA REGLA Y LAS LISTAS DE ESTE FICHERO NO ESTÁN ROTAS. Modela al alumno que lo sabe todo y TIENE QUE ACERTAR 12 DE 12. Pero —y ésta es la lección del §47, aplicada de entrada— **su 12/12 NO autoriza a leer la tabla**: lo que la autoriza es `controlDelAparato()`, que compara la regla de manual contra `casillaNominal` en los CUARENTA lemas del lexicón y no sólo en los doce que el lote toca. Los dos se imprimen y el fichero dice en voz alta cuál de los dos manda.',
    predicho: 12,
    aplicablesPredicho: 12,
    correr: (v) => plural(v.lema, v.genero, TEMA_DE_MANUAL[v.lema] ?? 'duro'),
  },
];

/** El TEMA de cada lema COMO LO TRAERÍA UN MANUAL, escrito a mano y no leído
 *  del lexicón: es la tercera parte del segundo camino. Sólo hace falta para
 *  los lemas del lote; los demás los cubre `controlDelAparato`, que sí lee el
 *  tema del lexicón porque ahí lo que se compara es la REGLA, no el dato. */
const TEMA_DE_MANUAL: Record<string, TemaRu> = {
  'стол': 'duro', 'конь': 'blando', 'книга': 'duro', 'карта': 'duro',
  'лицо': 'duro', 'голова': 'duro', 'сад': 'duro', 'город': 'duro',
  'товарищ': 'duro', 'друг': 'duro', 'студент': 'duro', 'человек': 'duro',
};

// ══════════════════════════════════════════════════════════════════════
// ★ LAS RUTAS POR LECTURA — Y LA PREGUNTA DEL §33.4 EN SU CUARTA POSICIÓN
// ══════════════════════════════════════════════════════════════════════
//
// La escala que llevan los tres lotes anteriores:
//
//   · lote 1 — el vecino es una PREPOSICIÓN. Si rige un solo caso, determina
//     la casilla y el ítem es memorizable como bigrama: 8 de 12.
//   · lote 2 — el vecino es un PRONOMBRE. No selecciona casilla: coocurre con
//     el presente, el pasado y el infinitivo.
//   · lote 3 — el vecino es un SUSTANTIVO DECLINADO. Determinación máxima
//     (caso, género y número a la vez) y densidad mínima: cuando el bigrama
//     existe acierta 4 de 4, y existe en 4 de 12.
//
// Aquí el vecino es un VERBO EN PASADO PLURAL, y es una posición nueva en esa
// escala: **concuerda en número y en nada más**. No dice el caso —un plural
// tras `пришли` podría ser el sujeto o no—, no dice el género —el pasado
// plural ruso no lo marca— y no dice el lexema. O sea determinación BAJA y
// densidad ALTA, que es el cuadrante que ninguno de los tres lotes anteriores
// tocó.
//
// ⚠ Y EL PREFIJO SE ELIGE ANTES DE CORRER, con la lección A-1 del lote 2 y la
// del §52.1 del lote 3 delante. El lote 2 midió que en el VERBO sólo las dos
// primeras letras son seguras porque el tema alterna; el lote 3 midió que en
// el ADJETIVO el tema entero es seguro porque no alterna. En el SUSTANTIVO el
// tema tampoco alterna en el plural regular… **pero en los tres irregulares
// del lote sí**, y de las tres maneras: `города` conserva el tema entero,
// `друзья` sólo las tres primeras letras y `люди` ninguna. O sea que un modelo
// de prefijo EXCLUYE POR CONSTRUCCIÓN al menos uno de los tres, y eso es
// exactamente el A-1 del lote 2. Va escrito ANTES de correr y con su
// consecuencia: `memoria-colocacional-con-el-tema` **no puede acertar `люди`
// jamás**, así que su techo es 11 y no 12, y el número que importa es el
// denominador.
const colocacionDespuesDe = (anterior: string, prefijo: string): string | null => {
  const re = new RegExp(`${INI}${anterior}\\s+(${prefijo}\\p{L}*)${FIN}`, 'giu');
  const cuenta = new Map<string, number>();
  for (const m of corpus().matchAll(re)) {
    const w = m[1]!.toLowerCase();
    cuenta.set(w, (cuenta.get(w) ?? 0) + 1);
  }
  if (!cuenta.size) return null;
  return [...cuenta].sort((a, b) => b[1] - a[1])[0]![0];
};

export const RUTAS_POR_LECTURA: Ruta[] = [
  {
    nombre: 'memoria-colocacional-sin-el-lema',
    porQue: 'La palabra más frecuente DETRÁS del verbo del marco, sin mirar el lema. No lee el lema, así que está acotada por el teorema del §48 —los dos ítems de un par comparten verbo—, y su valor no es el numerador sino saber si el MARCO por sí solo entrega alguna respuesta: si acertara, el ítem no estaría midiendo el lema. ★ OBSERVADO 0 DE 12 CON `aplicables` 12, Y LEÍDO EN VEZ DE CONTADO (§52.1): lo que devuelve en los doce es una PALABRA GRAMATICAL —`в` tras стояли y были, `на` tras лежали y виднелись, `к` tras пришли, `и` tras собрались—, nunca un sustantivo. O sea que el cero no es «la ruta no encuentra nada» sino «lo que sigue a un verbo en pasado plural es una preposición», que es un hecho del orden de palabras ruso y no una propiedad de estos seis marcos. Su `aplicables` 12 es el control de que la ruta no está apagada: un cero de una ruta apagada sería idéntico.',
    predicho: 0,
    aplicablesPredicho: 12,
    correr: (v) => colocacionDespuesDe(verboDelMarco(v.s), ''),
  },
  {
    nombre: 'memoria-colocacional-con-el-tema',
    porQue: '★ LA MEDIDA REAL. La palabra más frecuente detrás del verbo entre las que empiezan por el TEMA del lema. ⚠ SU LÍMITE ESTRUCTURAL VA ESCRITO ANTES DE CORRER, no descubierto después: el prefijo excluye `люди` por construcción, así que su techo es 11 y no 12 — el A-1 del lote 2 aplicado de entrada en vez de pagado. ★ PREDIJE 4 DE 9 Y SALIÓ 5 DE 7: el numerador uno bajo y el denominador dos alto, y la corrección sale de LEER la salida, no de ajustar la prosa. Lo que la lectura dice, y es el resultado de este lote: los cinco aciertos son los cinco lemas donde el bigrama con el verbo EXISTE (стояли столы 3, стояли кони 1, лежали книги 3, лежали карты 2, пришли товарищи 1) y son todos REGULARES; los dos fallos aplicables devuelven la misma RAÍZ en otra palabra —`садовник` tras были y `городские` tras были—, o sea que el prefijo modela la raíz y no el lema; y los cinco NULL son los cinco donde no hay bigrama ninguno, entre ellos los tres de las clases léxicas. La escala del §33.4 en su cuarta posición: un verbo concordado tiene densidad ALTA y determinación BAJA, y el efecto no es que devuelva la casilla equivocada —como el regente del lote 3— sino que devuelve un DERIVADO de la misma raíz o nada. Y lo que protege al lote no es que la ruta sea débil: es que no puede tocar ninguna de las tres fronteras, dos por construcción del prefijo y una porque el bigrama no existe.',
    predicho: 4,
    aplicablesPredicho: 9,
    correr: (v) => colocacionDespuesDe(verboDelMarco(v.s), temaDelLema(v.lema)),
  },
];

// ══════════════════════════════════════════════════════════════════════
// EL CONTROL POSITIVO DEL LOTE: LAS FORMAS QUE NO DEBE PRODUCIR
// ══════════════════════════════════════════════════════════════════════
//
// Son las formas que ESTE lote invita a producir, cada una con su veredicto
// por los DOS caminos —la ortografía, que es un módulo escrito en otra pasada
// para otra pregunta, o el corpus— y con el camino dicho.
//
// ⚠ Y LAS TRES QUE **NO** ESTÁN, con su motivo, porque su ausencia es el
// hallazgo de este lote: `други` (30), `человеки` (20) y `мори` (2) son lo que
// producen dos de las tres fronteras y el par del neutro… y las tres son
// palabras REALES. Las dos primeras son formas viejas y estilísticas del mismo
// lema; la tercera son un prepositivo eslavo eclesiástico («в мори») y un
// imperativo («не мори голодом»), o sea otro lema. Meterlas aquí saldría
// «✓ rechazada por corpus» —30 < 261, 20 < 3973, 2 < 240— y el verde sería
// falso: el veredicto acertaría por frecuencia sobre formas que no son
// errores, que es el `*лесы` del §35 con el signo cambiado. **Un control
// positivo sólo puede llevar formas que no sean palabra de ningún lema.**
export const FALSAS_DEL_LOTE: { mala: string; buena: string; porQue: string }[] = [
  { mala: 'городы', buena: 'города', porQue: 'la regla de dos pasos sobre la clase léxica en -а́, que es el error diana de la frontera del ítem 8. городы 0 · города 793' },
  { mala: 'столи', buena: 'столы', porQue: 'la cola blanda sobre un tema duro, o sea el paso 1 al revés. столи 0 · столы 94' },
  { mala: 'коны', buena: 'кони', porQue: 'y su simétrica: la cola dura sobre un tema blando, que es el error que el inventario tenía escrito como regla hasta el 2026-09-11. коны 0 · кони 120' },
  { mala: 'книгы', buena: 'книги', porQue: 'la ы sin la regla de la и tras velar. Es capa DADA (u1-ortografia-sibilantes) y por eso el par 2 no discrimina: va igualmente en el control, porque un generador que la produjera estaría roto. ⚠ Y ES LA ÚNICA DEL CONTROL CON ATESTACIÓN: книгы sale 1 vez en 7,7 M —«как владельцу оной бесценной книгы», la inscripción de un semianalfabeto entre comillas— y la lectura está en lecturaRival del lexicón. La caza la ORTOGRAFÍA, no el corpus, y por eso vale: el 1 no decide nada' },
  { mala: 'карти', buena: 'карты', porQue: 'la cola blanda sobre el otro femenino del par 2, el que NO lleva velar. карти 0 · карты 531' },
  { mala: 'лицы', buena: 'лица', porQue: 'el neutro metido en el reparto -ы/-и, que es justo lo que el neutro no hace nunca — y es el error que el par 3 invita a cometer, porque su pareja de par (головы) es un femenino de tema duro con el MISMO final de tema. лицы 0' },
  { mala: 'сади', buena: 'сады', porQue: 'la cola blanda sobre el distractor de la frontera 1 — el lema donde la regla SÍ acierta. сади 0 · сады 63' },
  { mala: 'товарищы', buena: 'товарищи', porQue: 'la ы tras sibilante, la otra mitad de la regla de u1. товарищы 0 · товарищи 309' },
  { mala: 'студенти', buena: 'студенты', porQue: 'la cola blanda sobre el distractor de la frontera 3. студенти 0 · студенты 53' },
];

/** El veredicto de UNA forma falsa por los dos caminos, con el que la caza
 *  dicho: la ORTOGRAFÍA (un módulo escrito en otra pasada para otra pregunta)
 *  o el CORPUS. Confundirlos es leer un sello como si fuera dos. */
export function veredictoFalsa(mala: string, buena: string): { rechaza: boolean; via: string; detalle: string } {
  const orto = revisarOrtografiaRu(mala);
  if (orto.length) return { rechaza: true, via: 'ortografia', detalle: `${orto[0]!.clase} en «${orto[0]!.palabra}»` };
  const nm = buscar(quitarAcento(mala)).n, nb = buscar(quitarAcento(buena)).n;
  if (nm < nb) return { rechaza: true, via: 'corpus', detalle: `«${mala}» ${nm} < «${buena}» ${nb}` };
  return { rechaza: false, via: '—', detalle: `«${mala}» ${nm} ≥ «${buena}» ${nb}` };
}

// ══════════════════════════════════════════════════════════════════════
// LOS RIVALES, CON LAS CUATRO SALIDAS DEL §9.1 Y NO CON UN NÚMERO
// ══════════════════════════════════════════════════════════════════════
//
// Comparar dos CADENAS no es comparar dos HIPÓTESIS sobre el mismo lema (D9).
// Para cada ítem, el rival es lo que la regla sobreaplicada de SU clase
// produce, y el veredicto es uno de cuatro: EVIDENCIA (rival a cero),
// NULO VACÍO (los dos a cero), TAREA DE LECTURA (rival vivo, con la lectura
// escrita en un CAMPO y no en un comentario) o ROJO (rival que gana sin
// lectura). **Un rival distinto de cero no es un número: es una tarea.**
export const LECTURA_RIVAL: Record<string, string> = {
  'книгы': 'ATESTADA 1 VEZ Y DELIBERADA: «как владельцу оной бесценной книгы», la inscripción de un semianalfabeto citada entre comillas, frente a книги 597. Es caracterización de personaje, no lengua — y es la prueba de que «la presencia atestigua» se rompe a una aparición. Ya estaba leída en lecturaRival de lexicon-a1.ts y aquí se reusa en vez de volver a decidirla',
  'други': 'ATESTADA 30 VECES Y NO ES UN ERROR: es el VOCATIVO folclórico del mismo lema, leído uno a uno con --ctx — «Извольте, други, садитесь» y «Ай вы, други мои милые» (Afanásiev), «сердечные други», «Давайте, други, выпьем». Dos de las treinta son otra cosa («други снохи», «те-други» = другие dialectal). Forma VIEJA del mismo lema, no agramatical: la norma de hoy gana (друзья) y la lección tiene que avisar (E5)',
  'человеки': 'ATESTADA 20 VECES Y NO ES UN ERROR: eslavo eclesiástico y uso irónico del mismo lema — «не человеки судят, а бог» y «иноки не иные суть человеки» (Dostoievski), «все мы человеки», «мы, подземные человеки», «Равнодушие человеков». Ninguna es un plural neutro de prosa corriente, pero todas son ruso del XIX: mismo trato que други',
  'голови': '⚠ ATESTADA 2 VECES Y NO ES RUSO: las dos son UCRANIANO dentro de diálogo citado —«Що-то вже, як у кого черт ма клепки в голови!» y «та пыха у тебя взялась в голови»—, o sea prepositivo ucraniano de «голова». Es el homógrafo del §35 con una vuelta más: aquí lo que contamina el contador no es otro LEMA sino otra LENGUA, y el corpus la contiene porque Gógol y Leskov transcriben habla ucraniana. Por eso este rival es una tarea de lectura y por eso «голови» NO puede entrar en FALSAS_DEL_LOTE',
};
export function rivalDe(x: ClozePlRu): string | null {
  const n = entradaNom(x), r = respuestaDe(x);
  if (!n || !r) return null;
  const regla = reglaDeManual(x.lema, n.genero, n.tema);
  if (quitarAcento(regla) !== quitarAcento(r)) return regla;
  // Para un ítem REGULAR el rival es la otra rama del paso 1: la cola del tema
  // contrario, que es la hipótesis que de verdad compite sobre el mismo lema.
  const t = TEMAS_DE_MANUAL[x.lema] ?? temaDelLema(x.lema);
  // ⚠ E6 · LA v0 DABA, PARA EL NEUTRO, LA OTRA RAMA DEL TEMA (`лицо` → `лиця`),
  //   y ése NO es el error que el par 3 induce: para producir `лиця` hay que
  //   saber que existe una rama blanda del neutro y aplicarla mal. El error que
  //   el par sí induce está escrito en `FALSAS_DEL_LOTE` con esas palabras:
  //   `лицы`, o sea meter el neutro en el reparto -ы/-и. El instrumento
  //   certificaba «EVIDENCIA» sobre una forma que ningún alumno con este perfil
  //   escribe — un sello contestando la pregunta de otro. Para un NEUTRO la
  //   hipótesis que compite sobre el mismo lema es la del GÉNERO equivocado.
  const otra = n.genero === 'n' ? u1(t, 'ы') : (n.tema === 'duro' ? 'и' : u1(t, 'ы'));
  return t + otra;
}
/** ★ CINCO SALIDAS Y NO CUATRO, y la quinta la encontró este lote viendo su
 *  propio gate EN ROJO en la primera corrida.
 *
 *  El §9.1 del relevo fija cuatro: EVIDENCIA, NULO VACÍO, TAREA DE LECTURA y
 *  ROJO. La primera corrida de este fichero marcó ROJO en `книга` y en
 *  `товарищ` con el mensaje «книги 597 ≥ книги 597», o sea **comparando una
 *  cadena consigo misma**: para un tema DURO acabado en velar o sibilante, la
 *  rama blanda del paso 1 (`книг`+`и`) y la rama dura pasada por la regla de
 *  u1 (`книг`+`ы`→`книги`) producen la MISMA cadena. Las dos hipótesis existen
 *  y son distintas; lo que no existe es un par de formas que las separe.
 *
 *  ⚠ Y LA v0 DE ESTE PÁRRAFO SACABA UNA CONCLUSIÓN DE MÁS (E4 del lingüista
 *  adversarial): decía «eso no es un fallo del rival, es el contenido del par
 *  2», y eso vale para `книга` y **NO** para `товарищ`. Para `книга` sí: las
 *  dos ramas colapsan porque el eje entero de su par es capa DADA
 *  (`u1-ortografia-sibilantes`), y por eso `sunduk` no discrimina. Para
 *  `товарищ` el homógrafo es una propiedad incidental de su tema sibilante y
 *  su par `vecherom` discrimina perfectamente —regular contra tema supletivo,
 *  colas `-и` y `-зья`—. Un lector de la v0 concluía lo contrario de lo que el
 *  lote ha construido: **una propiedad del LEMA leída como propiedad del PAR**.
 *  Y el mensaje que la salida imprimía llevaba «el par 2» escrito a mano, con
 *  lo cual se lo decía también al ítem 9.
 *
 *  Un ROJO habría sido falso y un verde habría sido peor: el veredicto tiene
 *  nombre propio y dice que aquí **el corpus no puede ser el segundo camino**.
 *
 *  ⚠ La lección de método, que es la que se transfiere: las cuatro salidas del
 *  §9.1 suponen DOS cadenas. Antes de leer un veredicto de rival, comprobar
 *  que el rival sea una cadena distinta de la respuesta. */
export type Veredicto = 'EVIDENCIA' | 'NULO VACÍO' | 'TAREA DE LECTURA' | 'HOMÓGRAFO' | 'ROJO';
export function veredictoRival(x: ClozePlRu): { rival: string; nR: number; nB: number; veredicto: Veredicto } | null {
  const rival = rivalDe(x), r = respuestaDe(x);
  if (!rival || !r) return null;
  const nR = buscar(quitarAcento(rival)).n, nB = buscar(quitarAcento(r)).n;
  let veredicto: Veredicto;
  if (quitarAcento(rival) === quitarAcento(r)) veredicto = 'HOMÓGRAFO';
  else if (nR === 0 && nB > 0) veredicto = 'EVIDENCIA';
  else if (nR === 0 && nB === 0) veredicto = 'NULO VACÍO';
  else if (nR >= nB && !LECTURA_RIVAL[quitarAcento(rival)]) veredicto = 'ROJO';
  else if (!LECTURA_RIVAL[quitarAcento(rival)]) veredicto = 'ROJO';
  else veredicto = 'TAREA DE LECTURA';
  return { rival, nR, nB, veredicto };
}

export interface Informe { nombre: string; aciertos: number; n: number; aplicables: number; predicho: number; aplicablesPredicho: number; cuales: number[] }

/** Acierta si y sólo si la TARJETA se la daría por buena: la respuesta o
 *  cualquiera de sus alternativas. Medir con una regla propia mide otra cosa. */
export function correr(items: ClozePlRu[], rutas: Ruta[]): Informe[] {
  return rutas.map((es) => {
    let aplicables = 0;
    const cuales: number[] = [];
    for (const [i, x] of items.entries()) {
      const vx = vista(x);
      const s = vx ? es.correr(vx) : null;
      if (s === null) continue;
      aplicables++;
      const buenas = [respuestaDe(x), ...alternativasDe(x)].filter(Boolean).map((y) => quitarAcento(y!));
      if (buenas.includes(quitarAcento(s))) cuales.push(i + 1);
    }
    return { nombre: es.nombre, aciertos: cuales.length, n: items.length, aplicables, predicho: es.predicho, aplicablesPredicho: es.aplicablesPredicho, cuales };
  });
}

if (/[/\\]cloze-ru-a1d\.ts$/.test(process.argv[1] ?? '')) {
  const v = verificar(ITEMS);
  v.push(...fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks'));
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(ITEMS.map((x) => ({ ...x, s: frase(x), answer: respuestaDe(x), alt: alternativasDe(x) })), null, 2));
    process.exit(v.length ? 1 : 0);
  }
  console.log(`# Cloze derivado RU-A1D — ${ITEMS.length} ítems de u3-plural-nominativo\n`);
  // ⚠ LA COLOCACIÓN SE IMPRIME Y NO SE ESCRIBE (§49): citar el unigrama de la
  // respuesta al lado de la afirmación se lee como si la validara, y es un
  // sello contestando la pregunta de otro. Lo que se publica es el SINTAGMA.
  console.log('| # | lema | g | tema | respuesta | cola | clase | verbo+resp | rival | veredicto | par · eje |');
  console.log('|--:|---|---|---|---|---|---|--:|---|---|---|');
  for (const [i, x] of ITEMS.entries()) {
    const n = entradaNom(x)!, r = respuestaDe(x)!;
    const col = buscar(`${verboDelMarco(frase(x))} ${quitarAcento(r)}`).n;
    const vr = veredictoRival(x);
    console.log(`| ${i + 1} | ${x.lema} | ${n.genero} | ${n.tema} | **${r}** | -${colaDe(x)} | ${claseIrregular(n, r)} | ${col} | ${vr ? `${vr.rival} ${vr.nR}/${vr.nB}` : '—'} | ${vr?.veredicto ?? '—'} | ${x.par} · ${x.eje}${x.frontera ? ` · FRONTERA ${x.frontera.regla}` : ''} |`);
  }
  console.log('\n## Ítems\n');
  for (const [i, x] of ITEMS.entries()) console.log(`${String(i + 1).padStart(2, '0')}. ${frase(x)}  → **${respuestaDe(x)}**  · ${x.pista}`);
  const tabla = (titulo: string, rutas: Ruta[], tope: boolean) => {
    console.log(`\n## ${titulo}\n`);
    console.log('| ruta | predicho | observado | % | aplicables (pred.) | ítems que acierta |');
    console.log('|---|--:|--:|--:|--:|---|');
    for (const r of correr(ITEMS, rutas)) {
      const mal = r.aciertos !== r.predicho ? ' ⚠ NO COINCIDE' : '';
      const malA = r.aplicables !== r.aplicablesPredicho ? ' ⚠' : '';
      const pc = Math.round((100 * r.aciertos) / r.n);
      const sobre = tope && r.aciertos / r.n > 0.5 ? ' ⚠ POR ENCIMA DEL TOPE' : '';
      console.log(`| \`${r.nombre}\` | ${r.predicho} | ${r.aciertos}/${r.n}${mal} | ${pc}%${sobre} | ${r.aplicables} (${r.aplicablesPredicho})${malA} | ${r.cuales.join(' ')} |`);
    }
  };
  tabla('Estrategias CIEGAS (tope: la mitad)', ESTRATEGIAS, true);
  {
    const g = correr(ITEMS, ESTRATEGIAS).find((r) => r.nombre === 'el-genero-de-la-pista')!;
    const techo = techoDeLaRutaDelGenero();
    console.log(`\n⚠ \`el-genero-de-la-pista\` NO va contra el tope de la mitad: su techo es **${g.aciertos}/${techo}**, no ${g.aciertos}/12.`);
    console.log('  El teorema del §48 acota a 1 por par a las rutas que no leen el lema, y el género SÍ lo es:');
    console.log(`  sólo lo acota donde el gate obliga a que sea constante, y el par «tolpa» está EXENTO (eje genero-neutro).`);
    if (g.aciertos > techo) { console.log('⚠ POR ENCIMA DE SU PROPIO TECHO: el teorema no describe este lote.'); process.exit(1); }
  }
  tabla('PERFILES de conocimiento parcial (sin tope — dicen qué ítems discriminan)', PERFILES, false);
  tabla('RUTAS POR LECTURA (no van contra el tope a A1: el alumno ha leído cero palabras de ruso)', RUTAS_POR_LECTURA, false);
  const todas = correr(ITEMS, [...ESTRATEGIAS, ...PERFILES, ...RUTAS_POR_LECTURA]);
  const control = todas.find((r) => r.nombre.startsWith('el-paradigma-entero'))!;
  const disc = controlDelAparato();
  console.log(`\n★ CONTROL DEL APARATO — los ${NOMBRES_A1.length} lemas del lexicón en nom.pl: ${disc.length} discrepancias.`);
  for (const d of disc) console.log(`  ✗ ${d}`);
  console.log(`   y la ruta \`el-paradigma-entero\` sobre los doce ítems: ${control.aciertos}/${ITEMS.length}.`);
  if (disc.length || control.aciertos !== ITEMS.length) {
    console.log('⚠ LA REGLA DE MANUAL DE ESTE FICHERO NO REPRODUCE LA MÁQUINA: todos los demás');
    console.log('  números de la tabla de PERFILES son de un aparato roto y no se pueden leer.');
  } else {
    console.log(`   La regla y las dos listas escritas a mano aquí reproducen la máquina en los ${NOMBRES_A1.length}`);
    console.log('   lemas, no sólo en los doce que el lote usa: el segundo camino coincide y los perfiles se leen.');
  }
  const dosPasos = new Set(todas.find((r) => r.nombre.startsWith('la-regla-de-dos-pasos'))!.cuales);
  const ninguno = ITEMS.map((_, i) => i + 1).filter((k) => !dosPasos.has(k));
  console.log(`\nLos ítems que la regla de dos pasos NO acierta —o sea las tres clases léxicas—: ${ninguno.join(' ') || '—'}.`);
  console.log('\n## Los tres MÁXIMOS BUSCADOS, con su barrido entero (§4.36: a un máximo no se le pone tope)\n');
  console.log(`cola fija: ${barridoColaFija().map((d) => `-${d.cola}:${d.aciertos}`).join(' ')}`);
  for (const [nombre, f] of [['rima con el verbo (2 letras)', (x: ClozePlRu) => verboDelMarco(frase(x)).slice(-2)], ['género de la pista', (x: ClozePlRu) => entradaNom(x)?.genero ?? '?']] as const) {
    const b = barridoPorClase(f);
    console.log(`${nombre}: ${b.map((r) => `${r.clase}→-${r.cola} ${r.aciertos}/${r.n}`).join(' · ')}  = ${b.reduce((a, r) => a + r.aciertos, 0)}/${ITEMS.length}`);
  }
  console.log('\n## Los RIVALES, con las CINCO salidas (las cuatro del §9.1 más HOMÓGRAFO)\n');
  const vers = ITEMS.map((x) => veredictoRival(x)!);
  for (const k of ['EVIDENCIA', 'NULO VACÍO', 'TAREA DE LECTURA', 'HOMÓGRAFO', 'ROJO'] as Veredicto[])
    console.log(`${k}: ${vers.filter((z) => z.veredicto === k).length}`);
  for (const [i, z] of vers.entries()) if (z.veredicto === 'TAREA DE LECTURA')
    console.log(`  · ítem ${i + 1}: «${z.rival}» ${z.nR} — ${LECTURA_RIVAL[quitarAcento(z.rival)]}`);
  for (const [i, z] of vers.entries()) if (z.veredicto === 'HOMÓGRAFO')
    console.log(`  · ítem ${i + 1}: las dos ramas del paso 1 dan la misma cadena «${z.rival}» (par «${ITEMS[i]!.par}») — el corpus no puede separar las dos hipótesis sobre ESTE lema. Que el PAR discrimine o no es otra pregunta: «sunduk» no discrimina porque su eje entero es capa dada; «vecherom» sí`);
  if (vers.some((z) => z.veredicto === 'ROJO')) {
    for (const [i, z] of vers.entries()) if (z.veredicto === 'ROJO') console.log(`⚠ ROJO en el ítem ${i + 1}: «${z.rival}» ${z.nR} ≥ «${respuestaDe(ITEMS[i]!)}» ${z.nB} y sin lectura escrita`);
    process.exit(1);
  }
  console.log('\n## Control positivo: las formas que el lote NO debe producir\n');
  const malas = FALSAS_DEL_LOTE.map((f) => ({ ...f, ...veredictoFalsa(f.mala, f.buena) }));
  for (const m of malas) console.log(`${m.rechaza ? '✓' : '✗'} *${m.mala}  [${m.via}] ${m.detalle}   — ${m.porQue}`);
  const buenasLimpias = FALSAS_DEL_LOTE.filter((f) => revisarOrtografiaRu(f.buena).length === 0).length;
  console.log(`\n${malas.filter((m) => m.rechaza).length}/${malas.length} rechazadas · ${buenasLimpias}/${FALSAS_DEL_LOTE.length} buenas limpias.`);
  if (malas.some((m) => !m.rechaza)) { console.log('⚠ UNA FORMA FALSA NO SE RECHAZA: el control positivo está en rojo.'); process.exit(1); }
  console.log('\n## Gates\n');
  if (v.length) { console.log(`**${v.length} PROBLEMAS:**`); for (const s of v) console.log(`- ${s}`); process.exit(1); }
  console.log('Limpio: un hueco por ítem, la casilla y el género en la pista con su forma canónica y la');
  console.log('glosa leída del lexicón, el tema y la clase NUNCA, un verbo en pasado plural delante del');
  console.log('hueco como ancla, la respuesta derivada por casillaNominal, ningún lema con ё en el tema');
  console.log('de plural ni con vocal fugaz, ortografía y homóglifos, respuesta atestada, seis pares de');
  console.log('marco idéntico y mismo GÉNERO —salvo el par del neutro, que lo contrasta— con COLAS');
  console.log('distintas, el eje de cada par RECALCULADO contra el lexicón, seis ejes y cinco colas,');
  console.log('TRES fronteras de reglas distintas con su clase de');
  console.log('irregularidad recalculada y su distractor en el propio par, ningún irregular sin frontera,');
  console.log('ninguna palabra del marco que sea respuesta de otro ítem ni de un ejercicio ya publicado,');
  console.log('y las nueve formas del control positivo rechazadas.');
}
