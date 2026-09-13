// lib/data/languages/ru/inventario-puntos.ts
//
// EL INVENTARIO DE PUNTOS DEL RUSO — paso 1 de la fase F, 2026-09-11.
//
// Es la pieza de la que cuelga todo lo demás. Hereda entero el contrato del
// inventario rumano (`../ro/inventario-puntos.ts`) —formato asignado al
// declarar, prueba del calco, cita verbatim del currículo, pisoCero y
// pisoDeclarado con motivo escrito, juicio de varianza— y le añade DOS
// campos que el rumano no necesitaba y el ruso no puede no tener.
//
// ══ POR QUÉ EL RUSO CAMBIA EL INSTRUMENTO ════════════════════════════
//
// Las cuarenta trampas que el rumano y el latín acumularon se cazaron casi
// todas preguntando **qué es GRATIS por transferencia**: el alumno ya lo
// sabe y el ítem no mide nada. En ruso esa pregunta se invierte y aparece
// su gemela, que es igual de cara y menos visible:
//
//   · **Declarar dificultad donde no la hay.** Como casi nada transfiere,
//     la tentación es marcar todo el idioma como difícil. Un punto que
//     declara una dificultad inexistente le hace perder el tiempo al
//     alumno exactamente igual que uno que le cobra un regalo, y no lo caza
//     ningún gate: los ítems salen impecables.
//   · **Atribuir mal la dificultad.** Si un ítem de caso sale mal, ¿falló
//     el caso, la declinación, el aspecto del verbo, o que el alumno no
//     leyó bien el cirílico? Con cuatro capas nuevas encima a la vez, **un
//     ítem que mide “ruso” no mide nada**, y el FSRS programa el repaso de
//     una tarjeta cuyo fallo no dice qué reforzar.
//
// Los dos campos nuevos existen para que esas dos preguntas se contesten
// ANTES de escribir un ítem y no después de publicarlo, que es lo que en
// rumano costó cinco lotes recompuestos:
//
//   `capas`  — una sola capa EXAMINADA y la lista de las que el ítem
//              carga encima y tienen que ir DADAS en el estímulo. Es la
//              forma estructural de «este ítem mide su punto»: no una
//              norma en un comentario, sino un invariante computable
//              (`tests/unit/inventario-ru.test.ts` comprueba que toda capa
//              dada tenga dueño en un punto de nivel igual o anterior).
//   `gratis` — OBLIGATORIO Y EN PROSA: qué parte de este punto trae ya
//              hecha el alumno, **del español mexicano Y DEL PORTUGUÉS
//              C2**. En rumano se descubrió en el lote 28, o sea con el
//              curso medio escrito, que media transferencia la pagaba el
//              portugués y nadie la contaba. Aquí el campo no admite
//              vacío: si la respuesta honesta es «nada», se escribe
//              «nada» y se dice por qué, y eso también es un dato.
//
// ══ LA PRUEBA DEL CALCO, EN TRES COLUMNAS ════════════════════════════
//
//   · `castellano`: ¿el ERROR DIANA, calcado palabra por palabra, da
//     español mexicano bien formado? Si sí, el ítem debe PRODUCIR, nunca
//     juzgar: la glosa contendría la respuesta. **Sin `vosotros`**: un
//     punto que se apoyara en la 2.ª plural española mediría un dialecto
//     que este alumno no tiene.
//   · `portugues`: la misma pregunta contra el portugués C2. Casi siempre
//     coincide con la española, y por eso importan los casos en que NO:
//     el reflexivo `-ся` frente a un `-se` que en portugués es CLÍTICO con
//     guion y colocación, la ausencia de artículo, el infinitivo personal.
//   · `internacional`: ¿el estrato grecolatino e internacional deja
//     acertar sin saber ruso? Es el análogo ruso del `latinComun` rumano y
//     se comporta igual de mal: `революция`, `университет`, `информация`
//     se reconocen enteros justo donde la morfología diverge
//     (`в университете`, `об информации`). Un punto `transparente` mide
//     reconocimiento si el ítem no obliga a producir la forma; uno
//     `engañoso` es el mejor material de corrección.
//
// ══ LAS REGLAS QUE SE HEREDAN Y NO SE NEGOCIAN ═══════════════════════
//
// **§0 · Ninguna forma se marca como mala sin FUENTE EXTERNA CITADA.** Un
// asterisco propio parece un dato y es una afirmación, y se hereda de lote
// en lote sin que nadie lo vuelva a mirar. En rumano costó dos puntos con
// ocho ítems ya publicados cada uno. CONVENCIÓN: `*` marca SÓLO formas
// agramaticales; una forma vieja, regional o de otro registro va entre «».
//
// **§0.1 · ¿lo produce ESTE alumno?** El error de anglófono marca BIEN lo
// que el alumno nunca hará, y la verificación contra fuentes lo APRUEBA.
// En rumano se cazó cuatro veces y venía de material escrito para
// angloparlantes. En ruso el riesgo es el mismo y mayor: casi todo el
// material de RKI del mundo está escrito para anglohablantes.
//
// **§0.6 · Un punto cuya regla admite excepción necesita un ítem cuyo
// error sea la SOBREAPLICACIÓN.** Sin él el alumno aprende la
// sobregeneralización, saca 8/8 y el número certifica que sabe algo que no
// sabe. No se ve en ningún ítem: se ve en el CONJUNTO.
//
// **§0.7 · El corpus es el segundo camino.** 2.180 lecturas, ~7,7 M de
// palabras (`scripts/corpus-ru.ts`). La PRESENCIA prueba; la AUSENCIA no
// prohíbe; y el corpus TIENE FECHA — es prosa del XIX en ortografía
// post-1918, así que `ея`, `оне` y el vocativo `отче` salen y no son ruso
// de hoy. Aquí esa tercera asimetría muerde mucho más que en rumano.
//
// ══ LO QUE ESTE INVENTARIO CUBRE, DICHO ══════════════════════════════
//
// Los descriptores de SISTEMA del currículo, más las destrezas de
// ESCRITURA de grafo y teclado, que en ruso son puntos de verdad y en las
// otras tres lenguas no existían. Lectura, escucha, mediación y producción
// escrita larga los cubren la biblioteca (2.180 lecturas · 7,7 M de
// palabras · el único pilar del ruso que ya está sobrado), la máquina de
// mediación, las tareas con rúbrica y la escucha —que aquí, a diferencia
// del portugués, tiene condición escrita: no se produce un solo ítem hasta
// que haya voz validada—. Todo eso está en
// `DESCRIPTORES_FUERA_DEL_INVENTARIO` y un test exige que ningún
// descriptor en alcance quede ni ahí ni en `cubre`.
//
// ⚠ Y EL DATO QUE CAMBIA LA FORMA DEL FICHERO respecto al rumano: de los
// 59 descriptores en alcance de §Ruso, **sólo 10 son de sistema**. El
// currículo ruso escribe su gramática en la prosa de «Contenido
// lingüístico», no en descriptores. Así que aquí `sinDescriptor` no es una
// rareza de seis puntos como en rumano: es la mayoría, y va DENUNCIADO
// punto por punto en vez de tapado con la etiqueta de al lado.
//
// Los ids llevan prefijo `u<bloque>-`: son de OTRA lengua y ninguna
// herramienta de PT, RO, CS o LA debe casarlos por accidente. (`r` es del
// rumano; `u` de «русский», que es lo que queda libre.)
import type { Concept } from '@/lib/data/curriculum-types';

export type NivelRu = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

/** Las clases de formato, heredadas del rumano. `grafico` es nueva y sólo
 *  del ruso: el trazo de la cursiva y el teclado ЙЦУКЕН no son
 *  conocimiento del sistema sino destreza motora, y no hay ningún tipo de
 *  ejercicio que los exprese hoy (`zod-schemas.ts` tiene 13 tipos y los 13
 *  operan sobre texto). Declararlos con un formato que no existe es lo
 *  honesto: la deuda se cuenta, no se tiñe de verde. */
export type ClaseRu =
  | 'fonologico' | 'ortografico' | 'grafico' | 'trampa' | 'coincide'
  | 'sin-equivalente' | 'pragmatico' | 'lexico' | 'paradigma';

export type FormatoRu =
  | 'escucha' | 'correccion' | 'cloze-con-pista' | 'transformacion'
  | 'mediacion' | 'flashcard' | 'juicio' | 'preferencia-registro'
  | 'grafico' | 'posicion';

/** `grafico` y `posicion` NO TIENEN MÁQUINA, y por eso se declaran:
 *  · `grafico` — trazo de cursiva y pulsaciones de teclado.
 *  · `posicion` — la respuesta es una POSICIÓN dentro de una palabra (el
 *    acento), no una cadena. Ningún campo del modelo lo admite hoy, y
 *    prometer cobertura ahí sería el gate declarado y ausente.
 *  Se unen a `preferencia-registro` en el grupo de los bloqueados por
 *  formato: su deuda es REAL y el piso NO se les reduce. Construir esas
 *  máquinas no es decisión del agente que escribe este fichero. */

export const FORMATO_DE_CLASE_RU: Record<ClaseRu, FormatoRu> = {
  fonologico: 'escucha',
  ortografico: 'cloze-con-pista',
  grafico: 'grafico',
  trampa: 'correccion',
  coincide: 'cloze-con-pista',
  'sin-equivalente': 'transformacion',
  pragmatico: 'mediacion',
  lexico: 'flashcard',
  paradigma: 'cloze-con-pista',
};

/** LAS CAPAS. Un ítem ruso carga varias a la vez y por eso hay que
 *  declarar cuál mide. No son «temas»: son las fuentes independientes por
 *  las que un ítem puede fallar. */
export type CapaRu =
  | 'grafia'        // leer y escribir cirílico
  // ⚠ `puntuacion` SE SEPARÓ DE `grafia` EL 2026-09-12, y es uno de los 20
  // DISCUTIBLE del dictamen del 11 aplicado. El argumento del lingüista:
  // «la capa `grafia` está sobrecargada —nueve puntos, de descodificar
  // cirílico a la coma de обособление— y POR ESO NO ATRIBUYE».
  //
  // Y es exacto: las capas no son temas, son las fuentes INDEPENDIENTES por
  // las que un ítem puede fallar, y un alumno que descodifica cirílico sin
  // un error puede fallar `обособление` entero. Metidas en la misma capa,
  // el FSRS programa el repaso de una tarjeta cuyo fallo no dice qué
  // reforzar, que es justo lo que el sistema de capas existe para impedir.
  //
  // No mueve ningún piso: es una reasignación de atribución, no producción.
  | 'puntuacion'    // la coma dura, la raya, el guion — reglas, no pausas
  | 'acento'        // dónde cae, y que no se escribe
  | 'fonologia'     // palatalización, reducción átona, ensordecimiento
  | 'genero'        // los tres géneros y su marca formal
  | 'caso'          // qué caso pide el contexto
  | 'declinacion'   // cuál es la FORMA de ese caso para este lema
  | 'aspecto'       // qué miembro del par
  | 'conjugacion'   // la forma personal del verbo
  | 'movimiento'    // uni/multidireccional y el prefijo
  | 'derivacion'    // raíz + prefijo + sufijo
  | 'orden'         // tema-rema
  | 'registro'      // los cinco estilos funcionales
  | 'lexico';       // saber la palabra

export interface Capas {
  /** La ÚNICA capa que el ítem mide. Si son dos, el punto está mal
   *  acotado y hay que partirlo: no es una restricción de estilo, es la
   *  condición para que el fallo del alumno signifique algo. */
  examina: CapaRu;
  /** Las que el ítem carga encima y tienen que ir RESUELTAS en el
   *  estímulo — escritas, glosadas o ya cubiertas por un punto anterior.
   *  Un test exige que cada una tenga dueño en un punto de nivel igual o
   *  anterior: si no lo tiene, el ítem mide algo que nadie ha enseñado. */
  dadas: CapaRu[];
}

export interface CalcoRu {
  /** ¿El error diana, calcado, es español mexicano bien formado? */
  castellano: 'bien' | 'mal' | 'no-aplica';
  /** La misma pregunta contra el portugués C2 del alumno. */
  portugues: 'bien' | 'mal' | 'no-aplica';
  /** ¿El estrato internacional deja acertar sin saber ruso? */
  internacional: 'transparente' | 'opaco' | 'engañoso' | 'no-aplica';
}

export interface PuntoRu {
  id: string;
  nombre: string;
  bloque: number;
  nivel: NivelRu;
  descripcion: string;
  prereqs: string[];
  clase: ClaseRu;
  /** Sólo cuando difiere de `FORMATO_DE_CLASE_RU[clase]`; `motivo` dice por qué. */
  formato?: FormatoRu;
  calco: CalcoRu;
  capas: Capas;
  /** OBLIGATORIO. Qué trae ya hecho el alumno, del español Y del
   *  portugués. «nada» es una respuesta válida y hay que argumentarla. */
  gratis: string;
  motivo: string;
  /** Descriptores que cubre: `<nivel>/<etiqueta>`. Vacío SÓLO con
   *  `sinDescriptor`. */
  cubre: string[];
  sinDescriptor?: string;
  pisoCero?: string;
  pisoDeclarado?: { piso: number; motivo: string };
  varianza?: string;
  /** Fragmento TEXTUAL de §Ruso del currículo. Un test lo busca ahí. */
  cita: string;
  /** Lo que queda por comprobar contra fuente viva y BLOQUEA la producción. */
  abierto?: string;
  /** ⚠ EL JUICIO SOBRE UN CHOQUE ENTRE LA NORMA QUE EL PUNTO ENSEÑA Y LA
   *  FORMA QUE LA BIBLIOTECA TRAE, con sus cifras y su fecha.
   *
   *  **Este campo lo prometía `scripts/check-norma-vs-corpus-ru.ts` —dos
   *  veces, en su cabecera y en su salida— y NO EXISTÍA en el tipo.** Es el
   *  gate declarado y ausente (§4.21 rumano): el script le decía a quien lo
   *  corriera «escribe el juicio en `contradiceElCorpus` del punto», el
   *  campo no estaba, y lo escrito habría acabado donde acaba todo lo que no
   *  tiene campo — en la prosa, donde ningún gate lo ve. Encontrado el
   *  2026-09-12, un día después de escribir el script.
   *
   *  Lo que va aquí NO es «el punto está mal»: la norma gana porque es
   *  citable. Va lo que el alumno se va a encontrar leyendo, para que la
   *  lección lo avise — o la inmersión desenseña el punto. */
  contradiceElCorpus?: string;
}

export function formatoDeRu(p: PuntoRu): FormatoRu {
  return p.formato ?? FORMATO_DE_CLASE_RU[p.clase];
}

export const PISO_RU = (nivel: NivelRu) => (nivel === 'C2' ? 6 : 8);

export const pisoDePuntoRu = (p: PuntoRu) =>
  p.pisoCero ? 0 : p.pisoDeclarado ? p.pisoDeclarado.piso : PISO_RU(p.nivel);

export const BLOQUES_RU: { id: number; slug: string; nombre: string }[] = [
  { id: 1, slug: 'alfabeto-escritura', nombre: 'Alfabeto y escritura' },
  { id: 2, slug: 'fonologia', nombre: 'Fonología: palatalización, reducción, acento' },
  { id: 3, slug: 'sustantivo', nombre: 'Sustantivo: género, número, plural' },
  { id: 4, slug: 'caso-i', nombre: 'Caso I: los cuatro productivos' },
  { id: 5, slug: 'caso-ii', nombre: 'Caso II: dativo, instrumental, plural, animacidad' },
  { id: 6, slug: 'adjetivo-pronombre', nombre: 'Adjetivo, pronombre y determinante' },
  { id: 7, slug: 'verbo', nombre: 'Verbo: conjugación, pasado, futuro, imperativo, -ся' },
  { id: 8, slug: 'aspecto', nombre: 'Aspecto' },
  { id: 9, slug: 'movimiento', nombre: 'Verbos de movimiento' },
  { id: 10, slug: 'reccion-numerales', nombre: 'Rección y numerales que rigen caso' },
  { id: 11, slug: 'sintaxis', nombre: 'Sintaxis compleja' },
  { id: 12, slug: 'no-personales', nombre: 'Formas no personales y voz' },
  { id: 13, slug: 'derivacion-lexico', nombre: 'Derivación y léxico' },
  { id: 14, slug: 'pragmatica', nombre: 'Pragmática, registro y partículas' },
  { id: 15, slug: 'estilo-c2', nombre: 'Estilo, puntuación y lengua literaria' },
];

/** Descriptores EN ALCANCE que este inventario no cubre por puntos, con el
 *  mecanismo que los cubre. El test exige que ningún descriptor quede ni
 *  aquí ni en `cubre`. La lección son las 32 unidades de escucha que en
 *  portugués se quedaron fuera sin que nadie lo dijera. */
export const DESCRIPTORES_FUERA_DEL_INVENTARIO: Record<string, string> = {
  // ⚠ LA CLAVE LLEVA ORDINAL, Y ES LA CORRECCIÓN MÁS IMPORTANTE DE ESTA
  // TABLA (lingüista adversarial, 2026-09-11). La v0 usaba
  // `<nivel>/<etiqueta>`, y §Ruso tiene VARIOS descriptores con el mismo
  // nivel y la misma etiqueta: dos COMPRENSIÓN ORAL en A1, tres
  // COMPRENSIÓN LECTORA en C2. Con esa clave, 11 descriptores estaban
  // declarados a la vez CUBIERTOS por un punto y FUERA del inventario, y
  // el test no podía verlo porque sólo cazaba el caso «en ninguno de los
  // dos». La doble declaración es peor que el hueco: el hueco se ve y esto
  // parece cobertura de sobra.
  //
  // El daño concreto que ocultaba, y es literalmente la lección de las 32
  // unidades de escucha del portugués repetida con el mecanismo construido
  // para evitarla: el descriptor **A1/COMPRENSIÓN ORAL #1** pide dos cosas
  // —los pares mínimos de palatalización Y «anota correctamente números,
  // precios, horas y fechas dichos a 100-110 ppm»—. `u2-palatalizacion`
  // cubre la primera; la segunda **no la cubre ningún punto** y la tabla
  // juraba que sí. Va declarada abajo como lo que es.
  'A1/COMPRENSIÓN LECTORA #1': 'biblioteca (2.180 lecturas) + preguntas de comprensión por texto; no es un punto',
  'A1/COMPRENSIÓN ORAL #1 · dictado de números, precios, horas y fechas': 'DESCUBIERTO: la segunda mitad de ese descriptor no la cubre ningún punto. Es destreza de transcripción bajo presión temporal, no de sistema, y necesita voz validada más un tipo `dictation` que no existe. Se declara para que el hueco sea visible en vez de quedar tapado por el punto que cubre la otra mitad',
  'A2/COMPRENSIÓN LECTORA #1': 'biblioteca + preguntas por texto',
  'B1/COMPRENSIÓN LECTORA #1': 'biblioteca + preguntas por texto y resumen con rúbrica',
  'B2/COMPRENSIÓN LECTORA #1': 'biblioteca + preguntas de inferencia y atribución',
  'B2/COMPRENSIÓN LECTORA #2': 'biblioteca: lectura extensiva de novela completa con contador',
  'C1/COMPRENSIÓN LECTORA #1': 'biblioteca + resumen crítico con rúbrica',
  'C2/COMPRENSIÓN LECTORA #1 · volumen': 'biblioteca: el canon del XIX ya está ingerido; la lectura extensiva se cuenta, no se enseña por puntos',
  'B1/COMPRENSIÓN ORAL #1': 'ESCUCHA: bloqueada hasta voz validada',
  'B2/COMPRENSIÓN ORAL #1': 'ESCUCHA: bloqueada hasta voz validada',
  'C1/COMPRENSIÓN ORAL #1': 'ESCUCHA: bloqueada hasta voz validada',
  'C1/COMPRENSIÓN ORAL #2': 'ESCUCHA: seguir una discusión de cuatro participantes exige habla espontánea multivoz, que no hay',
  'C2/COMPRENSIÓN ORAL #1': 'ESCUCHA: bloqueada hasta voz validada; y el мат atenuado lo cubre u14-mat, que a su vez está bloqueado por falta de campo de advertencia',
  'A1/PRODUCCIÓN ESCRITA #1': 'tarea de producción con rúbrica (formulario, presentación), no punto',
  'A2/PRODUCCIÓN ESCRITA #1': 'tarea con rúbrica (carta personal), no punto',
  'A2/PRODUCCIÓN ESCRITA #2': 'tarea con rúbrica (descripción con adjetivos declinados); la morfología la cubre u6-adjetivo-declinado, la tarea no es un punto',
  'B1/PRODUCCIÓN ESCRITA #1': 'tarea con rúbrica (texto argumentativo)',
  'B1/PRODUCCIÓN ESCRITA #2': 'tarea con rúbrica (carta formal); sus fórmulas son u14-registro-oficial, que es B2 — el currículo las pide antes de enseñarlas y queda denunciado aquí',
  'C1/PRODUCCIÓN ESCRITA #2': 'tarea con rúbrica: adaptar el mismo contenido a tres registros. La competencia es u14-cinco-estilos; la tarea no es un punto',
  'C2/PRODUCCIÓN ESCRITA #1': 'tarea con evaluación a ciegas contra textos nativos; el currículo declara que ningún LLM puede juzgarla y aquí no se finge lo contrario',
  'A1/MEDIACIÓN #1': 'máquina de mediación (relay RU→ES) cuando haya material A1 del que partir',
  'A2/MEDIACIÓN #1': 'máquina de mediación (resumen RU→RU, explicación RU→ES)',
  'B1/MEDIACIÓN DE UN TEXTO #1': 'máquina de mediación (resumen RU→RU)',
  'B1/MEDIACIÓN DE CONCEPTOS #1': 'máquina de mediación-explicar',
  'B1/MEDIACIÓN DE LA COMUNICACIÓN #1': 'fuera de alcance: exige interacción turno a turno (decisión de Edu, 2026-08-11)',
  'B2/MEDIACIÓN #1': 'máquina de mediación (síntesis de fuentes con atribución)',
  'B2/MEDIACIÓN #2': 'máquina de mediación (transferencia ES↔RU evaluada por naturalidad)',
  'C1/MEDIACIÓN DE TEXTOS #1': 'máquina de mediación (académico→llano)',
  'C1/MEDIACIÓN DE LA COMUNICACIÓN #1': 'fuera de alcance: mediar un desacuerdo exige interlocutor',
  'C1/MEDIACIÓN INTERLINGÜÍSTICA #1': 'fuera de alcance: interpretación consecutiva es producción oral',
  'C2/MEDIACIÓN #1': 'máquina de mediación (traducción cultural con comentario de la renuncia)',
  'C2/MEDIACIÓN #2': 'máquina de mediación (resumen de discusión multipartita) — y con el aviso de que en tiempo real no es alcanzable sin interlocutor',
  'C2/MEDIACIÓN INTERCULTURAL #1': 'fuera de alcance: anticipar el malentendido exige interlocutor',
  'A1/CURSIVA #1': 'la cubre u1-cursiva-trazo, bloqueado por falta de tipo de ejercicio gráfico',
  'A1/TECLADO #1': 'la cubre u1-teclado-jcuken, bloqueado por falta de tipo `typing`',
  'A1/ALFABETO #1': 'la cubre u1-falsos-amigos-graficos; la mitad de VELOCIDAD (≥60 ppm cronometrado) no es un punto: es una métrica de lectura que el modelo no tiene',
  'A1/ASPECTO #1': 'lo cubren u8-par-aspectual y u8-pasado-proceso-resultado',
  'A1/GRAMÁTICA #1': 'lo cubren los puntos de u4 (caso)',
  'A1/GRAMÁTICA #2': 'lo cubren u9-uni-multidireccional y u9-ir-a-pie-o-en-vehiculo',
  'A2/GRAMÁTICA #1': 'lo cubren u5-declinacion-plural, u5-animacidad-acusativo y u6-svoj',
  'A2/GRAMÁTICA #2': 'lo cubre u10-reccion-verbal',
  'B1/GRAMÁTICA #1': 'lo cubren u11-kotoryj, u11-chtoby y u11-estilo-indirecto',
  'B2/GRAMÁTICA #1': 'lo cubren u6-adjetivo-corto y u12-pasiva-sya-vs-participio',
  'B2/LÉXICO #1': 'lo cubren u13-sufijos-nominales y u13-familias-derivativas',
  'C1/GRAMÁTICA Y ESTILO #1': 'lo cubre u11-orden-tema-rema',
};


const P = (p: PuntoRu) => p;

export const PUNTOS_RU: PuntoRu[] = [
  // ── u1 · Alfabeto y escritura ──────────────────────────────────────
  P({ id: 'u1-falsos-amigos-graficos', nombre: 'Los siete falsos amigos gráficos latín↔cirílico', bloque: 1, nivel: 'A1',
    descripcion: 'В=[v], Н=[n], Р=[r], С=[s], У=[u], Х=[x], Е=[je]: siete glifos que el alumno YA sabe leer, y mal. No es aprender un signo nuevo: es desaprender uno viejo, que es más caro y más lento.',
    prereqs: [], clase: 'ortografico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'opaco' },
    capas: { examina: 'grafia', dadas: [] },
    gratis: 'las otras 26 letras, a medias, y los números van contados y no a ojo: **5** son idénticas al latín en forma y valor (А К М О Т) y **21** son enteramente nuevas (Б Г Д Ё Ж З И Й Л П Ф Ц Ч Ш Щ Ъ Ы Ь Э Ю Я) y por eso BARATAS — no hay hábito que las contradiga. 5 + 21 + los 7 falsos amigos = 33. (La v0 decía «~10» y «~11», que ni son correctos ni suman su propio total; corregido el 2026-09-11.) Lo que NO es gratis es exactamente este subconjunto de siete, y el punto vale porque está acotado a él. Ni el español ni el portugués aportan nada más allá del alfabeto latino compartido, que aquí es el problema y no la ayuda.',
    motivo: 'se examina leyendo en voz alta o eligiendo la transcripción: el error es de DESCODIFICACIÓN, no de lengua, y no hay calco que suene bien ni mal. El ítem da la palabra escrita y pide el valor, nunca al revés',
    cubre: ['A1/ALFABETO'],
    cita: 'sin caer en los siete falsos amigos gráficos (В=[v], Н=[n], Р=[r], С=[s], У=[u], Х=[x], Е=[je])' }),

  P({ id: 'u1-signos-sin-sonido', nombre: 'ь y ъ: dos letras que no suenan y no son la misma cosa', bloque: 1, nivel: 'A1',
    descripcion: 'ь marca blandura de la consonante anterior (мат/мать, брат/брать) y a la vez es marca morfológica (тетрадь f., пишешь 2.ª sg); ъ es separador y aparece tras prefijo (объявление, съесть), tras componente numeral (двухъярусный, трёхъязычный) y en préstamos sin prefijo analizable (адъютант, конъюнктура, инъекция). El alumno los lee como «nada» y se le caen al escribir.',
    prereqs: ['u1-falsos-amigos-graficos'], clase: 'ortografico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'opaco' },
    capas: { examina: 'grafia', dadas: ['fonologia'] },
    gratis: 'MÁS DE LO QUE LA v0 DECÍA, y la v0 se contradecía con su propio punto hermano dos entradas más abajo. Decía «ni el español ni el portugués tienen ninguna letra muda con valor distintivo» — y la ⟨u⟩ de gue/gui es exactamente eso: una letra muda cuya única función es fijar el valor de la consonante anterior, que es la definición estructural de ь. El portugués hace lo mismo con la ⟨h⟩ de nh/lh/ch. Así que el MECANISMO transfiere de las dos lenguas y el alumno no lo trata como decoración. Lo que no transfiere es (a) que ь sea además marca morfológica (тетрадь f., пишешь 2.ª sg), que es donde de verdad se le cae, y (b) ъ, que no tiene ningún análogo. Lo cazó el lingüista adversarial el 2026-09-11 leyendo los dos puntos del mismo bloque en paralelo, que es el único método que ve una contradicción entre dos declaraciones.',
    motivo: 'cloze del grafema en contexto donde la ausencia cambia la palabra o el paradigma. NO se puede examinar de oído en A1: la distinción dura/blanda es u2-palatalizacion y este punto la da por resuelta',
    cubre: [], sinDescriptor: 'el currículo lo pide en «GRAFÍA Y ORTOGRAFÍA» y no tiene descriptor propio: el de ALFABETO sólo habla de leer en voz alta',
    cita: 'ь y ъ como signos sin sonido propio' }),

  P({ id: 'u1-ortografia-sibilantes', nombre: 'жи/ши, ча/ща, чу/щу y la и tras к/г/х', bloque: 1, nivel: 'A1',
    descripcion: 'Reglas de grafía que CONTRADICEN la fonética: жи y ши se escriben con и y se pronuncian con [ɨ]. Son la primera vez que el alumno tiene que escribir contra lo que oye. Y la regla жу/шу, que es la que tiene las tres excepciones nombradas (жюри, брошюра, парашют).',
    prereqs: ['u1-falsos-amigos-graficos'], clase: 'ortografico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'grafia', dadas: ['fonologia'] },
    gratis: 'el HÁBITO de escribir contra el oído sí transfiere, y de las dos lenguas: el español escribe «gue/gui» con una u que no suena y «que/qui» igual; el portugués hace lo mismo y además tiene «ç» y la «h» inicial. El alumno no se sorprende de que la grafía mienta. Lo que no transfiere es CUÁL es la regla.',
    motivo: 'cloze del grafema con regla cerrada, y es además el gate de escritura de lib/lang/ortografia-ru.ts: un generador por paradigma produce *книгы solo si nadie se la enseña. §0.6: el ítem de frontera es una de las tres excepciones. ⚠ Y LA v0 LO DEJABA INCONSTRUIBLE SIN QUE NADA FALLARA (lingüista adversarial, 2026-09-11): enunciaba жи/ши, ча/ща, чу/щу e и tras velar, y declaraba como excepciones жюри, брошюра y парашют — que NO son excepciones de ninguna de esas cuatro, sino de жу/шу, regla que el punto no enunciaba. O sea que el ítem de frontera que el §0.6 exige no se podía escribir, y el hueco no lo detectaba nada. Añadida жу/шу a la descripción',
    cubre: [], sinDescriptor: 'contenido de «GRAFÍA Y ORTOGRAFÍA» sin descriptor propio',
    cita: 'reglas ortográficas dependientes de la palatalización (жи/ши, ча/ща, чу/щу, и tras к/г/х)' }),

  P({ id: 'u1-yo-doble-ortografia', nombre: 'La ё, que el texto real escribe е', bloque: 1, nivel: 'A1',
    descripcion: 'El alumno tiene que almacenar DOS ortografías de la misma palabra y saber que la de los libros es la incompleta. Es el único punto del curso cuyo contenido es que la escritura no es fiable.',
    prereqs: ['u1-falsos-amigos-graficos'], clase: 'ortografico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'grafia', dadas: ['acento'] },
    gratis: 'nada, y ninguna de las dos lenguas tiene análogo. Lo más cercano es la tilde española, y apunta al revés: la tilde se omite por descuido y se considera error, mientras que omitir la ё es la norma tipográfica.',
    motivo: 'MEDIDO sobre las 2.180 lecturas (scripts/corpus-ru.ts): 9,5 % de ё-grafía en 64.996 apariciones de 16 pares inequívocos. Y la distribución es BIMODAL POR EDICIÓN —1.295 lecturas no la escriben nunca, 159 siempre, 34 en medio—, o sea que la ё no es una tendencia de la lengua sino una decisión del editor. De ahí las dos mitades: producir con ё es legítimo, EXIGIR RECONOCER POR LA Ё NO LO ES. El punto examina la dirección segura —dada la forma con ё, reconocer la palabra en un texto que la escribe е— y nunca la contraria',
    abierto: '⚠ CARGA LA CAPA «acento» Y ESA CAPA NO TIENE DUEÑO PRODUCIBLE. Sus tres dueños (u2-acento-fonemico, u2-acento-movil, u15-metrica-poetica) están a pisoCero por falta del formato `posicion`, así que el estímulo de este punto tiene que traer el acento PINTADO —capa de presentación— y el ítem no puede pedirlo nunca. Va declarado y no razonado en un comentario porque el invariante de capas salía en VERDE sobre una capa con cero ítems detrás: comprobaba que el dueño EXISTIERA, no que enseñara. Existir no es enseñar, y lo destapó el lingüista adversarial el 2026-09-11',
    varianza: 'el rasgo diana (la ё ausente) es INVARIANTE por construcción: lo que varía es la palabra, y la palabra es u13-lexico. Por eso el punto vale 2 y no 8',
    pisoDeclarado: { piso: 2, motivo: 'dos ítems: uno donde la е-grafía es ambigua con otra palabra real (все/всё) y uno donde no lo es (пришел/пришёл). Del tercero en adelante lo único que varía es el lema, que pertenece a u13. Es la pregunta del §4.25 —¿qué VARÍA entre los ítems?— hecha antes de escribir' },
    cubre: [], sinDescriptor: 'el currículo lo pide en «GRAFÍA Y ORTOGRAFÍA» y en los retos específicos; ningún descriptor lo nombra',
    cita: 'ё escrito como е en texto real (doble ortografía almacenada)' }),

  P({ id: 'u1-cursiva-trazo', nombre: 'La cursiva manuscrita: 132 unidades gráficas con orden de trazo', bloque: 1, nivel: 'A1',
    descripcion: 'Es lo que los rusos escriben a mano y es ilegible sin aprenderlo: ш/т, и/й, л/м se distinguen sólo por trazo; д cursiva parece una g y т una m; «лишишься» es una fila de dientes idénticos.',
    prereqs: ['u1-falsos-amigos-graficos'], clase: 'grafico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'grafia', dadas: [] },
    gratis: 'el gesto de escribir ligado sí: el español y el portugués se enseñan en cursiva en la escuela mexicana y brasileña. Lo que no transfiere es que aquí la cursiva sea OTRO alfabeto y no una variante del de imprenta.',
    motivo: 'NO HAY MÁQUINA: pide datos de trazo (SVG path por glifo, orden y dirección) y captura en canvas, y ninguno de los 13 tipos de zod-schemas.ts los expresa. Se declara con su formato inexistente en vez de asignarle uno que sí existe: prometer cobertura que no hay es el gate declarado y ausente',
    abierto: 'sin tipo de ejercicio gráfico no hay ítems. Y la salida fácil —examinar la cursiva con una pregunta de opción múltiple sobre glifos— mediría u1-falsos-amigos-graficos, no el trazo',
    cubre: ['A1/CURSIVA'],
    cita: 'escribe a mano las 33 letras en mayúscula y minúscula cursiva con el orden de trazo correcto' }),

  P({ id: 'u1-teclado-jcuken', nombre: 'La distribución ЙЦУКЕН', bloque: 1, nivel: 'A1',
    descripcion: 'Destreza motora con su propia curva, y la única defensa real contra el homóglifo: quien teclea con distribución latina produce «cлово» con с latina, que es invisible a la vista y siempre falla.',
    prereqs: ['u1-falsos-amigos-graficos'], clase: 'grafico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'grafia', dadas: [] },
    gratis: 'nada de la distribución. Lo que sí trae es la mecanografía en sí, y eso es lo que lo hace CARO: un tecleador rápido en QWERTY tiene un hábito motor que le estorba, exactamente como los siete falsos amigos gráficos le estorban al leer.',
    motivo: 'NO HAY MÁQUINA: la métrica es pulsaciones por minuto, no una cadena correcta. Se declara. Y va con el detector de homóglifos de lib/lang/ortografia-ru.ts, que da el mensaje concreto («escribiste una a latina») en vez de un ✗ mudo',
    abierto: 'sin tipo `typing` con métrica de velocidad no hay ítems. Un cloze de la palabra rusa NO mide el teclado: mide si la sabe escribir, que es otra cosa y ya la miden los puntos de paradigma',
    cubre: ['A1/TECLADO'],
    cita: 'escribe 60 palabras conocidas con la distribución ЙЦУКЕН en ≤6 minutos' }),

  // ── u2 · Fonología ─────────────────────────────────────────────────
  P({ id: 'u2-palatalizacion', nombre: 'Dura frente a blanda: мат/мать, был/бил, брат/брать', bloque: 2, nivel: 'A1',
    descripcion: '~15 pares consonánticos con valor fonemático. El alumno NO OYE la diferencia, así que no puede autocorregirse — y eso inutiliza el shadowing con autoevaluación que la app ya tiene construido.',
    prereqs: [], clase: 'fonologico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'fonologia', dadas: [] },
    gratis: 'un asidero PARCIAL y hay que decir de qué tamaño: el español tiene /ɲ/ (ñ) y en algunas variedades /ʎ/, y el portugués tiene los dos (nh, lh) de forma estable, así que el alumno de portugués C2 llega con DOS consonantes palatales productivas y no una. Eso le da н/нь y л/ль casi gratis. No le da nada para т/ть, д/дь, с/сь, з/зь, р/рь, que son el resto del sistema. El punto se acota a los pares SIN asidero, y eso es lo que lo hace medir.',
    motivo: 'percepción pura: par mínimo A/B con audio, y sólo con voz validada. NO se produce un solo ítem hasta la sonda (§ voz). El portugués paga aquí más de lo que nadie contaba, y por eso el reparto de pares del lote tiene que excluir н/нь y л/ль o el ítem mide portugués',
    cubre: ['A1/COMPRENSIÓN ORAL #1'],
    cita: 'distingue en pares mínimos la consonante dura de la palatalizada (мат/мать, был/бил, брат/брать, ров/рёв)' }),

  P({ id: 'u2-palatalizacion-escrita', nombre: 'La blandura se escribe en la VOCAL siguiente, no en la consonante', bloque: 2, nivel: 'A1',
    descripcion: 'а/я, о/ё, у/ю, э/е, ы/и, o ь. La ortografía obliga a razonar hacia atrás: para escribir [tʲ] hay que mirar lo que viene después. Y ж, ш, ц son siempre duras y ч, щ, й siempre blandas, aunque la vocal diga otra cosa.',
    prereqs: ['u2-palatalizacion', 'u1-ortografia-sibilantes'], clase: 'ortografico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'grafia', dadas: ['fonologia'] },
    gratis: 'nada, y la interferencia va en contra: el español y el portugués marcan la palatal EN LA CONSONANTE (ñ, nh, lh). El alumno llega con el hábito exactamente inverso al que necesita, que es peor que llegar sin hábito.',
    motivo: 'cloze del grafema: dada la transcripción o la palabra oída, elegir la vocal. Es la mitad ESCRIBIBLE de u2-palatalizacion, y existe separada porque aquélla está bloqueada por voz y ésta no: un punto bloqueado no puede llevarse la mitad que sí se puede producir',
    cubre: [], sinDescriptor: 'la sección FONOLOGÍA del currículo lo declara; el descriptor de COMPRENSIÓN ORAL sólo cubre la mitad auditiva',
    cita: 'expresada por vocal siguiente (а/я, о/ё, у/ю, э/е, ы/и) o por ь' }),

  P({ id: 'u2-reduccion-atona', nombre: 'Аканье e иканье: молоко no se dice como se escribe', bloque: 2, nivel: 'A1',
    descripcion: '/o/ átona → [ɐ]/[ə], /e,a/ tras blanda → [ɪ]. El hispanohablante lee молоко y dice [molóko], y sobre todo NO RECONOCE la palabra cuando la oye, porque busca las vocales que él pronunciaría.',
    prereqs: ['u2-palatalizacion'], clase: 'fonologico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'fonologia', dadas: ['acento'] },
    gratis: 'AQUÍ EL PORTUGUÉS PAGA, Y PAGA MUCHO, y es el hallazgo que más cambia el diseño de este bloque. El currículo dice que la reducción es «específicamente PEOR para un hispanohablante» porque el español no reduce — y eso es cierto de un hispanohablante a secas. Este alumno tiene portugués C2, y el portugués EUROPEO reduce las átonas hasta hacerlas caer (/e/→[ɨ], /o/→[u], síncopa entera en «telefone»). O sea que llega con la intuición de que la vocal átona se desdibuja, que es justo lo que el currículo da por ausente. Lo que NO transfiere es la DIRECCIÓN: el portugués cierra (o→u) y el ruso abre (о→[ɐ]), así que el alumno oye молоко y espera [mulu-], no [məlɐ-]. El punto mide esa dirección, no la existencia de la reducción.',
    abierto: '⚠ CARGA LA CAPA «acento» Y ESA CAPA NO TIENE DUEÑO PRODUCIBLE. Sus tres dueños (u2-acento-fonemico, u2-acento-movil, u15-metrica-poetica) están a pisoCero por falta del formato `posicion`, así que el estímulo de este punto tiene que traer el acento PINTADO —capa de presentación— y el ítem no puede pedirlo nunca. Va declarado y no razonado en un comentario porque el invariante de capas salía en VERDE sobre una capa con cero ítems detrás: comprobaba que el dueño EXISTIERA, no que enseñara. Existir no es enseñar, y lo destapó el lingüista adversarial el 2026-09-11',
    motivo: 'percepción: reconocer la palabra escrita a partir del audio reducido. Bloqueado por voz. Y el lote tiene que excluir los ítems donde la reducción portuguesa acierta por casualidad, o mide portugués',
    cubre: ['A1/COMPRENSIÓN ORAL #2'],
    cita: 'reconoce oralmente palabras con reducción átona plena (молоко, хорошо, язык, сегодня) tras una sola escucha' }),

  P({ id: 'u2-acento-fonemico', nombre: 'El acento es fonemático y no se escribe: за́мок / замо́к', bloque: 2, nivel: 'A1',
    descripcion: 'за́мок (castillo) ≠ замо́к (candado), пи́сать ≠ писа́ть, му́ка ≠ мука́. Y determina la reducción, así que un acento mal puesto destruye la palabra entera.',
    prereqs: ['u2-reduccion-atona'], clase: 'fonologico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'acento', dadas: ['fonologia', 'lexico'] },
    gratis: 'el CONCEPTO de acento contrastivo, y de las dos lenguas: «ánimo/animo/animó» y «público/publico/publicó» son exactamente за́мок/замо́к. Eso es más de lo que el currículo le concede al alumno. Lo que no transfiere es que la posición NO SE ESCRIBA ni se derive de ninguna regla: el español la marca con tilde cuando rompe la regla, así que el alumno nunca ha tenido que memorizarla lema a lema.',
    motivo: 'MEDIDO: CERO apariciones de U+0301 en 7,7 M de palabras del corpus, con su control (la misma familia de consulta devuelve 43.048 «ё») y con su señuelo (la consulta ingenua da 325, todas U+0300 grave sobre «что̀», que es otra cosa). O sea que el alumno leerá SIEMPRE sin acento marcado. La consecuencia es la misma que la ё: producir y pronunciar con acento es legítimo, EXIGIR LEER POR EL ACENTO no lo es. Y el formato natural —señalar la sílaba— es `posicion`, que NO TIENE MÁQUINA',
    pisoCero: 'la respuesta de este punto es una POSICIÓN dentro de una palabra, no una cadena, y ningún campo del modelo lo admite (declarado en los retos específicos del currículo). Escribirlo como cloze de la palabra entera mediría u13-lexico. Piso cero hasta que exista el formato `posicion`; la deuda es REAL y queda contada aquí, no disuelta',
    cubre: [], sinDescriptor: 'la sección FONOLOGÍA lo exige desde la semana 3 y ningún descriptor «Sabrá hacer» lo nombra: el de ALFABETO dice «con el acento marcado», que es la capa de presentación',
    cita: 'pares mínimos de acento (за́мок/замо́к, пи́сать/писа́ть, му́ка/мука́) desde la semana 3' }),

  P({ id: 'u2-acento-movil', nombre: 'El acento se mueve dentro del paradigma: голова́ → го́лову → голо́в', bloque: 2, nivel: 'B1',
    descripcion: 'Los esquemas de Zaliznyak (a, b, c, d, e, f) aplicados al léxico frecuente. No es una excepción de unos cuantos lemas: es una propiedad del paradigma que hay que almacenar por FORMA, no por palabra.',
    prereqs: ['u2-acento-fonemico', 'u5-declinacion-plural'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'acento', dadas: ['caso', 'declinacion', 'lexico'] },
    gratis: 'el acento móvil EXISTE en las dos lenguas del alumno y nadie lo ha contado: «cánto/cantó», «régimen/regímenes», «carácter/caracteres» mueven el acento dentro del paradigma, y el portugués igual. Así que el alumno no tiene que aprender que eso PASE. Lo que no trae es que pase sin marca y sin regla.',
    motivo: 'deriva por regla desde el esquema acentual del lexicón, y el gate lo recalcula. Comparte el bloqueo de formato de u2-acento-fonemico: hasta que haya `posicion`, lo único producible es la ELECCIÓN entre dos formas escritas con acento pintado, y eso convierte el punto en reconocimiento',
    pisoCero: 'mismo bloqueo de formato que u2-acento-fonemico, y por la misma razón. No se le reduce a piso normal para no contar como cubierto lo que no lo está',
    cubre: [], sinDescriptor: 'la sección FONOLOGÍA de B1 lo declara con los 500 sustantivos y 300 verbos más frecuentes; no hay descriptor',
    cita: 'acento móvil en los paradigmas — los esquemas de Zaliznyak' }),

  P({ id: 'u2-ensordecimiento', nombre: 'Ensordecimiento final y asimilación regresiva: друг [druk], вокзал [vɐɡzal]', bloque: 2, nivel: 'A2',
    descripcion: 'La consonante sonora final se ensordece y el grupo asimila hacia atrás. Afecta al RECONOCIMIENTO: el alumno oye [druk] y busca «крук».',
    prereqs: ['u2-reduccion-atona'], clase: 'fonologico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'fonologia', dadas: ['lexico'] },
    gratis: 'LAS DOS MITADES, y la v0 negaba las dos — es el caso más claro del inventario del riesgo de declarar cara la mitad que el alumno trae hecha. (a) El ESPAÑOL tiene asimilación regresiva de sonoridad obligatoria y productiva: mismo [ˈmizmo], desde [ˈdezðe], rasgo [ˈrazɣo], que es literalmente вокзал [vɐɡzal]; y la de punto en las nasales (un beso [um], un gato [uŋ]) es del mismo tipo. El portugués añade la sonorización de /s/ final ante sonora («as casas» [ʒ]). (b) El español MEXICANO sí ensordece la obstruyente final: usted, verdad, Madrid se realizan con [t]. Lo que queda de verdad es el INVENTARIO —qué consonantes rusas entran en el juego y con qué output— y el hecho de que la grafía no lo refleje nunca, no el mecanismo. Lo cazó el lingüista adversarial el 2026-09-11.',
    motivo: 'percepción y transcripción; bloqueado por voz. La mitad que no lo está —predecir la pronunciación desde la grafía— es cloze y se declara aparte si algún lote la necesita',
    cubre: ['A2/COMPRENSIÓN ORAL #2'],
    cita: 'ensordecimiento final (друг→[druk], город→[gorət]) y asimilación regresiva de sonoridad' }),

  P({ id: 'u2-grupos-iniciales', nombre: 'Grupos consonánticos iniciales que el español prohíbe: встреча, взгляд, мгновение', bloque: 2, nivel: 'A2',
    descripcion: 'вст-, взгл-, вздр-, пск-, мгн-. El español necesita una /e/ protética y el alumno la inserta sin darse cuenta: *эвстреча.',
    prereqs: ['u2-ensordecimiento'], clase: 'fonologico', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'fonologia', dadas: ['lexico'] },
    gratis: 'nada, y las dos lenguas empujan igual: el portugués inserta protética ante /s/+consonante («estrutura», «Espanha») exactamente como el español. Es de los pocos sitios donde tener portugués C2 no ayuda NI un poco, porque las dos comparten la misma restricción silábica heredada del latín vulgar.',
    motivo: 'producción articulatoria: el error es ORAL y no deja rastro escrito. Sin evaluación fonémica por proveedor no se puede medir, y la autoevaluación no sirve porque el alumno no se oye la protética',
    pisoCero: 'el error diana no es escribible: *эвстреча es lo que el alumno DICE, no lo que teclea. Un ítem escrito mediría u13-lexico. Requiere assessment fonémico, que el currículo declara como dependencia dura y el proyecto no tiene',
    cubre: [], sinDescriptor: 'FONOLOGÍA de A2 lo pide con drill explícito; el descriptor correspondiente es de PRODUCCIÓN ORAL y está excluido por decisión de Edu',
    cita: 'grupos consonánticos iniciales imposibles en español (вст-, взгл-, вздр-, пск-, мгн-)' }),

  P({ id: 'u2-entonacion-ik', nombre: 'Las construcciones entonativas ИК-1 a ИК-5, y sobre todo la ИК-3', bloque: 2, nivel: 'A2',
    descripcion: 'La interrogativa SIN palabra interrogativa se marca sólo por entonación, y el hispanohablante la produce mal — con la curva española, que el ruso lee como otra cosa.',
    prereqs: ['u2-reduccion-atona'], clase: 'fonologico', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'fonologia', dadas: [] },
    gratis: 'el concepto de interrogativa sin marca segmental sí, de las dos: «¿Vienes?» y «Vens?» son exactamente Ты идёшь? sin nada más que la curva. El alumno no tiene que aprender que eso se pueda hacer. Lo que no trae es la FORMA de la curva rusa, que sube brusco en la sílaba tónica y cae, frente al ascenso sostenido español.',
    motivo: 'discriminación auditiva de la curva: el ítem oye dos versiones y pide cuál es pregunta. Bloqueado por voz, y con una condición extra que ninguna otra escucha tiene: el TTS tiene que REALIZAR la ИК-3, y un TTS que lee la frase como declarativa fabricaría un ítem cuya clave es falsa',
    cubre: ['A2/COMPRENSIÓN ORAL #1'],
    cita: 'las construcciones ИК-1 a ИК-5 (Bryzgunova), especialmente ИК-3' }),

  P({ id: 'u2-habla-conectada', nombre: 'Lo que el habla real hace con las palabras: щас, чё, здрасьте, сёдня', bloque: 2, nivel: 'B1',
    descripcion: 'что [ʂto], сегодня [sʲɪˈvodʲnʲə], конечно [kɐˈnʲeʂnə] no son excepciones: son el habla normal. Y la elisión coloquial (щас, тыща, тока) hace irreconocibles palabras que el alumno sabe.',
    prereqs: ['u2-reduccion-atona', 'u2-ensordecimiento'], clase: 'fonologico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'fonologia', dadas: ['lexico'] },
    gratis: 'el hábito, y otra vez del portugués: un C2 de portugués europeo ya sobrevivió a «tá», «pra», «num» y a la síncopa que hace irreconocible «está a». Sabe que la forma de diccionario y la forma oral son dos. El español de México elide mucho menos. Lo que no transfiere es cuáles.',
    motivo: 'transcripción de lo oído; bloqueado por voz. Y con la trampa propia de este punto: un TTS NO produce elisión coloquial, así que este punto NO SE PUEDE PRODUCIR con voz sintética por bien validada que esté — necesita habla real grabada. Queda declarado en vez de prometido',
    abierto: 'sin material de habla espontánea real no hay ítems. Un clip de TTS leyendo «щас» es una falsificación: la elisión es del hablante, no de la ortografía',
    cubre: ['B1/COMPRENSIÓN ORAL #2'],
    cita: 'entiende habla informal con elisión coloquial real (щас, чё, тыща, здрасьте, сёдня, тока)' }),

  // ── u3 · Sustantivo: género, número, plural ────────────────────────
  P({ id: 'u3-genero-por-terminacion', nombre: 'Tres géneros con marca formal: -Ø / -а,-я / -о,-е', bloque: 3, nivel: 'A1',
    descripcion: 'El género se lee en la terminación con muy pocas excepciones. Es el punto más barato del idioma y hay que declararlo como tal en vez de cobrarlo.',
    prereqs: ['u1-falsos-amigos-graficos'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'transparente' },
    capas: { examina: 'genero', dadas: ['grafia'] },
    gratis: 'CASI TODO, y de las dos lenguas. El alumno ya concuerda, ya sabe que el género es arbitrario y ya lee el género en la terminación: -o/-a español y portugués mapean sobre -Ø/-а casi sin fricción. Añadir un tercer valor con marca propia (-о/-е) es barato precisamente porque el mecanismo ya está.',
    motivo: 'el punto NO puede ser «di el género de этот стол»: eso se contesta leyendo. Lo único que mide es el RESIDUO — los masculinos en -ь (день, словарь) frente a los femeninos en -ь (ночь, дверь), donde la terminación NO decide y la clase se almacena por lema; más папа/дядя/дедушка, masculinos con forma femenina. Es §4.35 aplicado antes de escribir: si la cláusula principal es gratis, el contenido del punto es la EXCEPCIÓN',
    varianza: 'la operación «leer la terminación» sería invariante y gratis en los ocho. Lo que varía —y es el punto— es cuál de los dos géneros toma un lema en -ь, que no es derivable',
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1 lo declara; el descriptor de COMPRENSIÓN ORAL pide identificar género de oído, que es otra capa',
    cita: 'tres géneros por terminación' }),

  P({ id: 'u3-plural-nominativo', nombre: 'Plural -ы/-и/-а/-я y los irregulares frecuentes', bloque: 3, nivel: 'A1',
    descripcion: 'Decide PRIMERO el tema: blando (конь, музей, деревня, дверь) → -и; duro → -ы, y sólo entonces la regla ortográfica convierte esa -ы en -и tras к г х ж ш щ ч. Más una clase masculina en -а́ tónica (дома́, города́) que no se predice; y друзья, дети, люди.',
    prereqs: ['u3-genero-por-terminacion', 'u1-ortografia-sibilantes'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'engañoso' },
    capas: { examina: 'declinacion', dadas: ['genero', 'grafia'] },
    gratis: 'la idea de plural sufijal, entera, de las dos lenguas. Y algo más que nadie contaría: el portugués tiene plurales con alternancia de raíz (ovo/ovos con timbre, pão/pães, cidadão/cidadãos/cidadães) que el español no tiene, así que el alumno no se sorprende de que el plural cambie la palabra. Lo que NO transfiere es el reparto ortográfico ы/и, que es regla de grafía y no de morfología.',
    motivo: 'deriva por regla desde el lexicón; el gate lo recalcula. §0.6: el ítem de sobreaplicación es la clase en -а́ (дом→дома́ y no «до́мы»), donde la regla ortográfica acierta la letra y falla la casilla. ⚠ EL ASTERISCO DE «до́мы» SE RETIRÓ EL 2026-09-13 y es §0 en estado puro: un asterisco propio parece un dato y era una afirmación. `домы` sale 47 veces en la biblioteca («Домы и домики, которые издали можно принять за копны сена», Gógol), o sea que es VIEJA y no MALA, y la convención del §0 reserva el `*` para lo agramatical. Lo cazó contar la forma antes de citarla, no leer el motivo. ⚠ LA v0 DE LA DESCRIPCIÓN ESTABA MAL Y ERA EL SITIO DE MÁXIMO DAÑO (lingüista adversarial, 2026-09-11): decía que el reparto -ы/-и es ORTOGRÁFICO, y es primero de TEMA. Una regla así produce *коны, *музеы, *деревны, *дверы — y el gate las aprueba, porque recalcula la misma regla. Medido en el corpus: кони 120, музеи 3, деревни 395, двери 1834, y ninguno tiene velar ni sibilante. Un gate que compara lo declarado con lo derivado hereda todos los fallos del derivador y los convierte en APROBACIONES',
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1; sin descriptor propio',
    contradiceElCorpus: 'LA NORMA GANA Y LA BIBLIOTECA DICE OTRA COSA, medido el 2026-09-13. El punto enseña дом→дома́ como el único plural, y la biblioteca —prosa del XIX— trae домы 47 veces, repartidas entre varios autores (Gógol: «Домы и домики…»; «прочие все домы в Миргороде просто выбелены»). Es la clase del §11 del relevo: el corpus es de dominio público y puede DESENSEÑAR el punto. Consecuencias operativas, las tres: (1) ningún ítem de este punto se justifica con el corpus para la casilla -а́, porque el corpus la contradice; (2) la lección b3-l1 lo AVISA con la cifra, o la inmersión deshace lo enseñado; (3) домы no lleva asterisco: es vieja, no mala. Control de que el instrumento no está roto: городы 0, деревны 0, коны 0, o sea que el contador sabe devolver cero.',
    cita: 'plural -ы/-и/-а/-я y los plurales irregulares frecuentes (дом→дома́, друг→друзья́, ребёнок→де́ти)' }),

  P({ id: 'u3-sin-articulo', nombre: 'El ruso no tiene artículos, y eso no es una ausencia inofensiva', bloque: 3, nivel: 'A1',
    descripcion: 'La definitud, que el español y el portugués marcan con una palabra, en ruso la marcan el ORDEN y el contexto. Quitar el artículo es gratis; saber qué lo sustituye no lo es.',
    prereqs: ['u3-genero-por-terminacion'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'orden', dadas: ['caso', 'declinacion'] },
    gratis: 'OMITIR el artículo es gratis y el currículo lo dice («una cosa menos, y sin coste de desaprendizaje»). Eso es cierto y es media verdad: el alumno omite sin esfuerzo Y NO PONE NADA EN SU LUGAR, así que escribe ruso con orden español y pierde la distinción entera. La transferencia no falla por exceso aquí: falla por SUBPRODUCCIÓN, y la subproducción no la mide un formato de corrección.',
    motivo: 'el punto es realmente u11-orden-tema-rema en A1, y se declara aquí sólo para que la nota conste: NO se le escriben ítems en A1. Formato de transformación (misma frase, definido↔indefinido, cambiando el orden) y sólo cuando el alumno tenga caso suficiente para que el orden sea libre de verdad',
    pisoCero: 'la dificultad de este punto es SUBPRODUCCIÓN (el alumno no pone nada donde debería reordenar) y en A1 no hay ni caso ni léxico para construir el par mínimo de orden. Su contenido vive entero en u11-orden-tema-rema (C1). Se declara aquí, con piso cero, para que nadie lo redescubra como punto nuevo — que es lo que en rumano hizo que tres cuartas partes de r4-cel-proforma estuvieran ya cobradas',
    cubre: [], sinDescriptor: 'el currículo lo lista como VENTAJA, no como contenido, y ahí está el defecto que este punto denuncia',
    cita: 'Sin artículos: una cosa menos, y sin coste de desaprendizaje' }),

  // ── u4 · Caso I: los cuatro productivos ────────────────────────────
  P({ id: 'u4-que-es-el-caso', nombre: 'La idea de caso: la función se marca en la PALABRA, no en la posición', bloque: 4, nivel: 'A1',
    descripcion: 'Ni el español ni el portugués marcan caso nominal. Es la mayor carga memorística del idioma y el cambio conceptual que hace que todo lo demás sea posible.',
    prereqs: ['u3-genero-por-terminacion'], clase: 'sin-equivalente', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['genero', 'declinacion', 'lexico'] },
    gratis: 'el VESTIGIO pronominal, y hay que contarlo porque es lo único: «yo/me/mí», «él/lo/le» en español y «eu/me/mim» en portugués SON caso, y el alumno los usa sin error. Eso le da el concepto —la misma persona tiene formas distintas según su papel— aunque no lo sepa nombrar. Lo que no trae es que eso pase con los SUSTANTIVOS, y menos con seis valores.',
    motivo: 'punto conceptual que se examina eligiendo el caso con la forma DADA: el ítem da las formas y pide cuál pide el contexto, para que el fallo sea de `caso` y no de `declinacion`. Es la separación de capas en su forma más pura, y si no se hace este punto y u4-declinacion-singular miden lo mismo',
    cubre: ['A1/GRAMÁTICA · caso'],
    cita: 'usa productivamente nominativo, acusativo (objeto directo y dirección con в/на), prepositivo (localización y tema con о) y genitivo' }),

  P({ id: 'u4-declinacion-singular', nombre: 'Las tres declinaciones en singular: la FORMA de cada casilla', bloque: 4, nivel: 'A1',
    descripcion: 'Dado el caso, producir la forma. Temas duros, blandos y sibilantes con sus reglas ortográficas asociadas.',
    prereqs: ['u4-que-es-el-caso', 'u1-ortografia-sibilantes'], clase: 'paradigma', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'engañoso' },
    capas: { examina: 'declinacion', dadas: ['caso', 'genero', 'grafia'] },
    gratis: 'nada de las desinencias. Y el estrato internacional ENGAÑA justo aquí: el alumno reconoce «университет» entero y por eso cree que la palabra está resuelta, cuando lo que le falta es «в университете». Es el `latinComun` rumano con otra piel.',
    motivo: 'deriva por regla desde el lexicón anotado y el gate la recalcula — es la única forma de producir las ~900 unidades de morfología nominal que el currículo pide sin que un LLM invente casillas que el alumno no puede detectar',
    abierto: '⚠ EL SEGUNDO LOCATIVO NO ESTÁ EN NINGÚN PUNTO, y no es sólo un hueco: envenena este generador. Una clase de masculinos toma -у́ tónica tras в/на con valor locativo (в лесу́, на берегу́, в саду́, на полу́) y la regla de prepositivo escrita aquí produce *в лесе. Medido: в лесу 381 frente a в лесе 3. Hasta que el lexicón guarde la casilla por lema, ningún lote de este punto puede usar un sustantivo de esa clase, y eso NO se puede dejar al criterio de quien escriba el lote: va en gate. Lo destapó el lingüista adversarial el 2026-09-11 buscando lo que el currículo pide y el inventario no declara',
    contradiceElCorpus: '⚠ EL INSTRUMENTAL SINGULAR DE LA 1.ª DECLINACIÓN TIENE DOS FORMAS EN LA BIBLIOTECA, y la que este punto enseña es sólo una de ellas. Medido el 2026-09-12 con `check-paradigma-ru.ts`, y la cifra va CORREGIDA dos veces el mismo día: la primera pasada dio «22 % sobre 15 lemas» y ese 22 % estaba SESGADO A LA BAJA, porque la mitad de los denominadores mide varias casillas a la vez — `новой` son CUATRO casillas del adjetivo, `большой` SEIS, `ей` dos, `дядей` tres, y sólo una de cada grupo tiene variante en -ою. Contando cuántas casillas del propio paradigma comparten cada forma —el instrumento lo cuenta, no se supone— quedan **13 lemas de denominador LIMPIO: norma 9.402 · variante 5.092, el 35 %**, y el reparto va del 15 % (деревнею) al 50 % (страною). Los otros 13 lemas tienen la variante atestada (своею 1.088, моею 186, большою 109, новою 61) y su porcentaje NO se puede dar: se imprime el hueco en vez de un número que mide otra cosa. Fuera del lexicón hay un caso donde la variante GANA: землею 91 frente a землёй 16, 5,7 a 1. Tres consecuencias, y ninguna es «el punto está mal»: (a) la máquina produce -ой, que es la norma de hoy y la citable; (b) `-ою` es una respuesta CORRECTA y todo ítem de esta casilla tiene que aceptarla —exigir sólo -ой suspende a quien escribe el ruso que la biblioteca le ha enseñado, que es el error simétrico—; y (c) la LECCIÓN tiene que avisar de que va a leer la otra forma a todas horas. La proporción NO es propiedad de la desinencia sino de cada palabra, así que no se puede declarar marginal sin medirla lema a lema. El generador vive en `variantesInstrSgFem`, con la casilla en el nombre porque en el adjetivo esa misma desinencia ocupa cuatro casillas y la variante larga existe sólo en el instrumental',
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1 declara «las tres declinaciones nominales en singular con los seis casos»; el descriptor de GRAMÁTICA · caso habla de USO, no de forma',
    cita: 'las tres declinaciones nominales en singular con los seis casos' }),

  P({ id: 'u4-acusativo-direccion', nombre: 'в/на + acusativo es DIRECCIÓN; + prepositivo es LUGAR', bloque: 4, nivel: 'A1',
    descripcion: 'La misma preposición cambia de significado con el caso: в школу (a la escuela) / в школе (en la escuela). El caso hace el trabajo que el español hace con dos preposiciones distintas.',
    prereqs: ['u4-declinacion-singular'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'lexico'] },
    gratis: 'la DISTINCIÓN semántica, entera y de las dos lenguas: «voy a la escuela»/«estoy en la escuela», «vou à escola»/«estou na escola». El alumno nunca confunde el concepto. Lo que le falta es que en ruso lo lleve la desinencia y no la preposición, y eso hace que OMITA la marca, no que la equivoque.',
    motivo: 'el error diana es de OMISIÓN (poner siempre la forma de prepositivo, o siempre la de acusativo), no de elección, así que el formato de corrección mide la mitad. Se examina con cloze de la desinencia sobre pares mínimos de la MISMA preposición y el MISMO lema, donde lo único que varía es el verbo rector — que es lo que hay que aprender a leer',
    varianza: '⚠ CORREGIDO el 2026-09-11: la v0 decía que «+в es invariante por construcción y eso es propiedad de la LENGUA, porque no hay otra preposición que haga este contraste». ES FALSO, y la propia cita del punto dice «в/на». Medido: на стол 547 / на столе 551, за стол 296 / за столом 321, под стол 68 / под столом 48 — CUATRO preposiciones hacen el contraste. Luego la invariancia no es de la lengua sino de una decisión mía, que es exactamente la diferencia entre r3-negacion-antepuesta (legítimo) y r2-numerales-de (defecto). El lote se reparte entre в/на/за/под y entonces la cobertura es real; si alguien lo deja todo en в, la cobertura es 1 y no 8',
    cubre: ['A1/GRAMÁTICA · caso'],
    cita: 'acusativo (objeto directo y dirección con в/на), prepositivo (localización y tema con о)' }),

  P({ id: 'u4-genitivo-existencial', nombre: 'у меня есть / нет + genitivo: el ruso dice la posesión y la ausencia al revés', bloque: 4, nivel: 'A1',
    descripcion: 'No hay verbo «tener»: «en mí hay un libro». Y la negación de la existencia cambia el caso del sujeto: книга есть → книги нет.',
    prereqs: ['u4-declinacion-singular'], clase: 'sin-equivalente', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'lexico'] },
    gratis: 'menos de lo que parece, y más de lo que el currículo dice. El español tiene «no hay libro» sin sujeto nominativo, que es la misma jugada impersonal; el portugués tiene «não há». O sea que la ESTRUCTURA impersonal existe en las dos. Lo que no existe es que la negación cambie el CASO, porque no hay caso. El error diana real no es calcar «tengo» —el alumno aprende у меня есть en la primera semana— sino no cambiar книга por книги al negar.',
    motivo: 'transformación afirmativa→negativa, que es el único formato que hace visible el cambio de casilla. Corrección no sirve: *у меня нет книга es un error que el alumno comete por OMISIÓN del cambio, y una tarjeta que se lo enseña ya escrito le regala la mitad',
    cubre: ['A1/GRAMÁTICA · caso'],
    cita: 'genitivo (у меня есть, нет + genitivo, posesión, tras 2-4)' }),

  P({ id: 'u4-sujeto-dativo', nombre: 'мне нравится, мне нужно, мне холодно: el regalo que hay que enseñar como regalo', bloque: 4, nivel: 'A1',
    descripcion: 'El experimentante en dativo. Estructuralmente idéntico a «me gusta / me hace falta / tengo frío».',
    prereqs: ['u4-declinacion-singular'], clase: 'coincide', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'conjugacion'] },
    gratis: 'LA MITAD, no todo, y el reparto importa porque decide el piso. `мне нравится` transfiere al 100 % («me gusta el libro», y el portugués añade «faz-me falta», «dói-me» con clítico dativo explícito) y `мне нужно` casi. Pero `мне холодно` y `мне 30 лет` NO TRANSFIEREN EN ABSOLUTO: el español y el portugués los dicen con SUJETO NOMINATIVO y el verbo «tener» —tengo frío, tengo 30 años; tenho frio, tenho 30 anos—, o sea una construcción de tipo distinto, no una variante de «me gusta». La v0 decía «TODO» y el currículo dice «enseñadas como calco directo del español»: los dos se equivocan en la mitad, y lo cazó el lingüista adversarial el 2026-09-11 enumerando los cuatro exponentes de la cita en vez de leerlos como un bloque.',
    motivo: 'el punto NO puede examinar la construcción, que es gratis. Lo único que mide es la CONCORDANCIA del verbo con el estímulo (мне нравится книга / мне нравятся книги), que es donde el español no da ninguna pista porque «me gustan» también concuerda — o sea que coincide y por eso tampoco mide. §4.35 aplicado: si las dos rutas aciertan, el punto es la excepción o no hay punto',
    pisoDeclarado: { piso: 4, motivo: 'CUATRO, subido de 2 el 2026-09-11 por el dictamen del lingüista y contra mi propio cálculo, que era el que estaba mal. Dos casillas que ya estaban contadas: el DATIVO DE PERSONA con lema flexionado (мне/тебе/ему/Ивану, donde el español da un clítico invariable y el ruso una forma de caso) y el нужен/нужна/нужно concordado con la COSA. Y dos que la v0 daba por transferencia y no lo son: мне холодно y мне 30 лет, que en las dos lenguas del alumno llevan SUJETO y «tener». Sigue sin llegar a 8 porque мне нравится es transferencia pura y ocho ítems de ella medirían español' },
    cubre: [], sinDescriptor: 'el currículo lo lista en MORFOSINTAXIS y entre las ventajas; ningún descriptor lo nombra',
    cita: 'construcciones de sujeto dativo (мне нравится, мне нужно, мне холодно, мне 30 лет) enseñadas como calco directo del español' }),

  // ── u5 · Caso II ───────────────────────────────────────────────────
  P({ id: 'u5-declinacion-plural', nombre: 'Los seis casos en plural', bloque: 5, nivel: 'A2',
    descripcion: 'Dativo -ам, instrumental -ами, prepositivo -ах son casi uniformes para los tres géneros: el plural es la parte FÁCIL del sistema de casos, y hay que decirlo.',
    prereqs: ['u4-declinacion-singular', 'u3-plural-nominativo'], clase: 'paradigma', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'engañoso' },
    capas: { examina: 'declinacion', dadas: ['caso', 'genero', 'grafia'] },
    gratis: 'nada de las desinencias, pero el punto es barato por otra razón que hay que declarar para no inflarlo: tres de los seis casos del plural (dat, instr, prep) tienen UNA desinencia para los tres géneros. Un lote de ocho ítems repartido por casos mediría una sola regla ocho veces.',
    varianza: 'si el lote reparte por caso, «añadir -ам/-ами/-ах» es una operación única disfrazada de tres. Lo que varía de verdad es el genitivo plural, y ése es u5-genitivo-plural: un punto aparte a propósito',
    motivo: 'deriva por regla; el gate lo recalcula. El lote se reparte por TEMA (duro/blando/sibilante), no por caso',
    cubre: ['A2/GRAMÁTICA · caso'],
    cita: 'declina correctamente sustantivos y adjetivos en los seis casos, singular y plural, incluidos los temas blandos y los sibilantes' }),

  P({ id: 'u5-genitivo-plural', nombre: 'El genitivo plural: -ов/-ев, -ей o CERO, con vocal de apoyo', bloque: 5, nivel: 'A2',
    descripcion: 'Tres desinencias sin regla única, la desinencia CERO que hace aparecer una vocal (окно→окон, сестра→сестёр) y los irregulares de altísima frecuencia (людей, детей, друзей, рублей).',
    prereqs: ['u5-declinacion-plural'], clase: 'paradigma', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'engañoso' },
    capas: { examina: 'declinacion', dadas: ['caso', 'genero', 'lexico'] },
    gratis: 'nada, y es probablemente la casilla más cara del idioma. La desinencia CERO no tiene análogo concebible: en las dos lenguas del alumno el plural AÑADE y aquí QUITA, y encima hace aparecer una vocal que no estaba.',
    motivo: 'deriva por regla con el reparto almacenado por lema; el gate la recalcula y Hunspell o un analizador morfológico la comprueba por el segundo camino. §0.6: el ítem de sobreaplicación es la vocal de apoyo donde NO va (карт, not *карот)',
    cubre: [], sinDescriptor: 'MORFOLOGÍA NOMINAL COMPLETA de A2 lo declara en detalle; ningún descriptor separa esta casilla de las otras cinco',
    cita: 'el genitivo plural en toda su irregularidad (tres desinencias: -ов/-ев (студентов, музеев), -ей (рублей, друзей, людей) y CERO (книг, окон, мест)' }),

  P({ id: 'u5-animacidad-acusativo', nombre: 'La animacidad decide el acusativo: вижу студента / вижу столы', bloque: 5, nivel: 'A2',
    descripcion: 'En masculino singular y en TODOS los plurales, el acusativo de lo animado es igual al genitivo y el de lo inanimado igual al nominativo. Es un rasgo semántico que entra en la morfología.',
    prereqs: ['u5-declinacion-plural'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'declinacion', dadas: ['caso', 'genero', 'lexico'] },
    gratis: 'MÁS DE LO QUE PARECE, Y ES EL ESPAÑOL MEXICANO EL QUE PAGA: «veo a Juan» frente a «veo la mesa» es exactamente la misma distinción, con marca distinta. El español tiene «a» personal y la aplica por animacidad, así que el alumno YA SABE cuándo el objeto directo se marca. El portugués NO la tiene («vejo o João»), o sea que aquí las dos lenguas del alumno discrepan y la que ayuda es el español. Es el primer punto del inventario donde separar las dos columnas cambia el diseño: si se contara «el alumno es hispanohablante» a secas, se declararía dificultad donde hay transferencia.',
    motivo: 'lo que NO es gratis es (a) que el ruso lo aplique también en PLURAL y a los animales, donde el español mexicano duda («veo los perros»/«veo a los perros»), y (b) que la forma resultante sea la de GENITIVO y no una marca añadida. El lote se acota a esas dos y no a la distinción, que se contesta traduciendo',
    varianza: 'la operación «usar la forma de genitivo» sería invariante si todos los ítems fueran animados. El reparto tiene que ser mitad y mitad, porque el punto es la ELECCIÓN binaria y con reparto desigual una sola ruta ciega acierta por encima del suelo',
    cubre: ['A2/GRAMÁTICA · caso'],
    cita: 'animacidad en acusativo (masculino singular y todos los plurales: вижу студента / вижу студентов vs вижу столы)' }),

  P({ id: 'u5-lematizacion', nombre: 'De la forma oblicua al nominativo: o cómo usar un diccionario ruso', bloque: 5, nivel: 'A2',
    descripcion: 'Dada о студентах, к врачу, с друзьями, identificar el nominativo singular y el caso. Es la destreza que hace usable el diccionario y el paso de descifrar a leer.',
    prereqs: ['u5-declinacion-plural', 'u5-genitivo-plural'], clase: 'paradigma', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'transparente' },
    capas: { examina: 'declinacion', dadas: ['caso', 'grafia'] },
    gratis: 'nada. Y hay que decir por qué NO es «lo mismo al revés»: derivar la forma desde el lema es una función; volver desde la forma es una RELACIÓN, con sincretismo abundante —студента es genitivo Y acusativo, книги es genitivo sg Y nominativo pl—, así que la respuesta a veces no es única y el ítem tiene que admitir las dos. Es el error simétrico: un alumno impecable que dé la segunda lectura correcta no puede suspender.',
    motivo: 'es el único punto del bloque cuya dirección es RECEPTIVA, y por eso tiene descriptor propio cuando los demás no. Cloze del lema, con las alternativas de sincretismo DECLARADAS: contar los ejes de ambigüedad y multiplicar, o falta la esquina que combina dos',
    cubre: ['A2/COMPRENSIÓN LECTORA #2'],
    cita: 'dada una forma oblicua en un texto (о студентах, к врачу, с друзьями), identifica el nominativo singular y el caso' }),

  P({ id: 'u5-genitivo-negacion', nombre: 'Genitivo de negación: книги нет frente a книгу не читал', bloque: 5, nivel: 'B1',
    descripcion: 'Bajo negación el objeto puede ir en genitivo o en acusativo, y no hay regla mecánica: depende del tipo de predicado y de si se niega la existencia o el hecho.',
    prereqs: ['u4-genitivo-existencial', 'u5-declinacion-plural'], clase: 'trampa', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'aspecto', 'lexico'] },
    gratis: 'nada, y es uno de los pocos puntos donde eso es literal.',
    motivo: 'el currículo dice expresamente que «no tiene regla mecánica y hay que enseñar por tipo de predicado». Bajo §0 eso significa que NINGUNA de las dos opciones puede marcarse mala sin cita normativa, y las dos suelen ser aceptables con distinto matiz',
    abierto: 'antes de escribir un solo ítem hay que contar en el corpus cuántos contextos aguantan UNA sola respuesta. Si la respuesta es «casi ninguno», el punto no da para ocho ítems determinados y hay que declarar piso reducido con el número, no inflarlo. Es exactamente lo que mató r8-discurso-indirecto en rumano: lengua bien descrita, formato equivocado',
    cubre: [], sinDescriptor: 'CASO — usos difíciles de B1; sin descriptor',
    cita: 'genitivo de negación y su alternancia con acusativo (книги нет vs книгу не читал)' }),

  P({ id: 'u5-instrumental-predicativo', nombre: 'он был врачом frente a он врач: el instrumental como ser/estar ruso', bloque: 5, nivel: 'B1',
    descripcion: 'Quien decide es el TIEMPO VERBAL, no la permanencia: en pasado el instrumental es la opción por defecto aunque la cualidad sea permanentísima (Пушкин был великим поэтом), y en presente con cópula cero es imposible, sea temporal o permanente.',
    prereqs: ['u5-declinacion-plural', 'u7-pasado-genero'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'conjugacion'] },
    gratis: 'MENOS DE LO QUE LA v0 DECÍA, y la corrección es el caso más limpio del inventario del riesgo contrario — declarar INEXISTENTE una dificultad que existe. La v0 decía «el corte semántico entero es ser/estar, y lo que el alumno no sabe no es cuándo sino con qué marca». Es falso: el corte ruso lo hace el TIEMPO VERBAL y el tiempo verbal no es ser/estar. Medido en el corpus: был + …ом sale 392 veces, y 5 de ellas con adjetivo de cualidad permanente (великим, известным, русским, хорошим). Así que el alumno TAMPOCO sabe el cuándo, porque el cuándo ruso no es el suyo. De las dos lenguas trae sólo que el predicado nominal pueda llevar marca, que es poco. Lo cazó el lingüista adversarial el 2026-09-11.',
    motivo: 'el punto se acota a la FORMA (la desinencia de instrumental sobre el predicado) y NO al reparto, que se contesta traduciendo. Si un lote reparte sus ocho ítems entre «permanente» y «temporal», mide español mexicano con una fidelidad del 100 %',
    cubre: [], sinDescriptor: 'CASO — usos difíciles de B1; sin descriptor',
    cita: 'instrumental predicativo (он был врачом vs он врач) y su restricción temporal' }),

  P({ id: 'u5-numerales-rigen-caso', nombre: 'El numeral gobierna el sintagma: 1→nom sg, 2-4→gen sg, 5+→gen pl', bloque: 5, nivel: 'A2',
    descripcion: 'La respuesta correcta depende de OTRO token de la frase: el numeral decide el caso y el número del SUSTANTIVO. Lo que varía entre ítems son las cuatro clases de numeral (1 / 2-4 / 5+ / 21), y ésa es la cobertura.',
    prereqs: ['u5-genitivo-plural', 'u6-adjetivo-declinado'], clase: 'sin-equivalente', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'genero', 'lexico'] },
    gratis: 'nada, y la interferencia es activa: en las dos lenguas del alumno el numeral ≥2 pide plural y punto. «Dos casas», «duas casas». Que «dos» pida un SINGULAR es contraintuitivo por las dos vías a la vez.',
    motivo: 'no existe ningún tipo de ejercicio donde la respuesta dependa de otro token: el currículo lo declara como reto específico y pide un tipo `government` con trigger explícito. Con `fill_blank` + `concepts` se puede aproximar, pero el gate no puede comprobar que el disparador esté presente, así que el ítem puede quedar indeterminado sin que nada falle. §0.6: el ítem de frontera es el 21, que vuelve a nominativo singular (двадцать одна новая книга) y desmiente «a partir de 2, genitivo»',
    varianza: '⚠ SOLAPABA CON u10-sintagma-numeral-adjetivo Y SE SEPARÓ EL 2026-09-12 (DISCUTIBLE nº1 del dictamen del 11, aplicado). Los dos puntos tenían las MISMAS `capas` y los MISMOS tres ejemplos en el mismo orden —два новых дома / пять новых домов / двадцать одна новая книга—, o sea 16 ítems para un conjunto que da para menos. El corte que el lingüista proponía («sin adjetivo» / «con adjetivo») no se sostiene, porque `пять новых домов` no añade ninguna decisión: el adjetivo va en genitivo plural igual que el sustantivo. El corte que sí se sostiene sale de preguntar qué VARÍA: aquí varía la CLASE DE NUMERAL sobre el sustantivo (cuatro casillas); allí varía el caso del ADJETIVO tras 2-4, que es la única configuración donde el adjetivo NO sigue al sustantivo. Este punto deja de nombrar el adjetivo',
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1 y CASO de B1 lo declaran; el descriptor de PRODUCCIÓN ORAL de A1 («dice su edad con la concordancia numeral correcta») está excluido por ser oral',
    cita: 'numerales 1-1000 con su rección (1→nom sg, 2-4→gen sg, 5+→gen pl)' }),

  // ── u6 · Adjetivo, pronombre y determinante ────────────────────────
  P({ id: 'u6-adjetivo-declinado', nombre: 'El adjetivo concuerda en género, número Y CASO', bloque: 6, nivel: 'A1',
    descripcion: 'Declinación dura, blanda y mixta (новый/синий/русский/хороший). Multiplica cada sintagma: el alumno no puede decir un sintagma nominal sin resolver dos paradigmas a la vez.',
    prereqs: ['u4-declinacion-singular'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'engañoso' },
    capas: { examina: 'declinacion', dadas: ['caso', 'genero'] },
    gratis: 'CONCORDAR, entero y de las dos lenguas — el currículo lo dice bien: «no tiene que aprender qué es concordar». Lo que no trae es el tercer eje (caso) ni que la clase dura/blanda dependa de la consonante final del tema, que es información de grafía.',
    motivo: 'deriva por regla, y desde el 2026-09-12 la regla existe: `lib/data/languages/ru/paradigma-adj-ru.ts`, DOS filas para las cuatro declinaciones que la gramática escolar lista (las «mixtas» son la dura pasada por la ortografía) y 144 formas medidas contra el corpus. ⚠ Y EL GATE NO RECALCULA LA REGLA: lo que la valida es el corpus y `ortografia-ru.ts`, importado y no copiado.',
    varianza: '⚠ EL AVISO DE ESTE PUNTO ERA MEDIA REGLA, Y LO CORRIGIÓ LA MÁQUINA EL 2026-09-12. La v0 decía: «el instrumental y el prepositivo de masculino y neutro COINCIDEN (-ым, -ом), así que un ítem de concordancia de género escrito en instrumental aprueba sin distinguir el género». Es cierto y es la MITAD: `casillasQueDiscriminanGenero()` lo calcula sobre las formas generadas en vez de creérselo, y son **DOS de los seis casos** los que distinguen los tres géneros —el nominativo y el acusativo, que lo copia en el inanimado—. Coinciden también el GENITIVO (нового = m y n) y el DATIVO (новому = m y n): cuatro casos sincréticos de seis, no dos. Quien leyera la prosa vieja habría dado por buenos para un ítem de concordancia justo los dos que faltaban en la lista. Del PLURAL no discrimina ninguna casilla, seis de seis, y eso la v0 sí lo decía bien. Y un tercer sincretismo que ninguna prosa nombraba, sólo en los lemas de desinencia tónica: en большой y молодой el nominativo masculino es homógrafo de las CUATRO casillas oblicuas del femenino — seis casillas con una forma. Consecuencia de diseño: un lote de concordancia de género vive en el nominativo o no mide género, y el número lo da la máquina, no una lista escrita a mano',
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1 y de A2; el descriptor de A2 GRAMÁTICA · caso lo nombra junto con el sustantivo',
    cita: 'declinación adjetival completa dura, blanda y mixta (большой/синий/русский/хороший)' }),

  P({ id: 'u6-svoj', nombre: 'свой frente a его/её/их: el error que el «su» español garantiza', bloque: 6, nivel: 'A2',
    descripcion: 'свой remite al sujeto de la oración; его/её/их a otro. Он взял свою книгу ≠ Он взял его книгу.',
    prereqs: ['u6-adjetivo-declinado'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'lexico', dadas: ['declinacion', 'caso', 'genero'] },
    gratis: 'nada, y las dos lenguas empujan en la misma dirección equivocada: «su» y «seu» son ambiguos exactamente igual, así que el alumno no tiene NI SIQUIERA la intuición de que haya algo que distinguir. El currículo lo dice con precisión («el error que el español su garantiza») y es correcto también para el portugués, que además usa «seu» para la 2.ª persona de cortesía y lo deja aún más borroso.',
    motivo: 'error diana atestado y corregible: *Он взял его книгу leído como reflexivo es lo que produce el calco. Es de los pocos puntos donde el formato de corrección es el correcto sin discusión, porque el alumno pone algo de más (его) y no deja de poner nada. §0.6: el ítem de sobreaplicación es el caso donde свой SERÍA un error — sujeto de 1.ª/2.ª persona, donde мой/твой compiten, y el contexto donde el poseedor NO es el sujeto',
    cubre: ['A2/GRAMÁTICA · caso'],
    cita: 'distingue свой de его/её/их sin error sistemático — el error que el español \'su\' garantiza' }),

  P({ id: 'u6-demostrativos', nombre: 'этот/тот declinados, y что/кто/какой/чей como paradigma', bloque: 6, nivel: 'A2',
    descripcion: 'Los determinantes también declinan, y los interrogativos son la puerta de entrada al relativo который.',
    prereqs: ['u6-adjetivo-declinado'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'declinacion', dadas: ['caso', 'genero'] },
    gratis: 'MENOS QUE NADA, y la v0 declaraba transferencia que no existe. Decía que «este/ese mapea sobre этот/тот sin fricción» y que el alumno «colapsa tres en dos, que es más fácil que expandir». Falso: **этот cubre a la vez «este» Y «ese»**, y `тот` no es «ese» sino «aquel / el otro / el ya mencionado». No es un colapso: es un RE-REPARTO de la frontera, y quien traduzca «ese libro» por *та книга comete justo el error que la v0 declaraba imposible. Ese re-reparto es contenido real y la v0 lo regalaba. Lo que sí trae de las dos lenguas es que el determinante concuerde y tenga forma propia, que es poco.',
    motivo: 'deriva por regla. El punto NO puede examinar la elección этот/тот, que es transferencia; examina la forma',
    varianza: 'si todos los ítems piden la misma casilla con distinto lema, la cobertura real es 1',
    cubre: [], sinDescriptor: 'MORFOLOGÍA NOMINAL COMPLETA de A2; sin descriptor',
    cita: 'pronombres demostrativos (этот/тот) e interrogativos declinados' }),

  P({ id: 'u6-adjetivo-corto', nombre: 'Forma corta y forma larga: он больной / он болен', bloque: 6, nivel: 'B2',
    descripcion: 'La forma corta expresa estado temporal y sólo es predicativa; la larga, cualidad. Con su gradiente de registro.',
    prereqs: ['u6-adjetivo-declinado', 'u5-instrumental-predicativo'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'lexico', dadas: ['declinacion', 'genero'] },
    gratis: 'EL CORTE ENTERO POR SER/ESTAR, y el currículo ya lo dice: «se enseña por el atajo español y se corrige donde no aplica». Eso es §4.35 escrito en el propio currículo, y significa que el contenido del punto es la FRONTERA, no la regla. El portugués da lo mismo con «é doente»/«está doente».',
    motivo: 'el lote NO puede repartirse entre permanente y temporal: esa mitad la resuelve el atajo ser/estar al 100 %. Lo que mide es dónde el atajo FALLA — свободен/свободный fuera del eje temporal, la forma corta obligatoria con complemento (он способен на всё), y las formas cortas lexicalizadas sin larga viva',
    pisoDeclarado: { piso: 4, motivo: 'contado antes de escribir: cuatro casillas donde el atajo ser/estar da la respuesta EQUIVOCADA. Los otros cuatro que un lote de ocho necesitaría serían ítems que el alumno resuelve traduciendo, y ocho de ésos certificarían español' },
    cubre: ['B2/GRAMÁTICA'],
    cita: 'distingue y usa la forma corta y la larga del adjetivo con su diferencia semántica (он больной / он болен, она свободная / она свободна)' }),

  P({ id: 'u6-comparativo', nombre: 'Comparativo y superlativo: больше/лучше/самый/наиболее', bloque: 6, nivel: 'A2',
    descripcion: 'Formas sintéticas y analíticas, con supletivos de alta frecuencia y el reparto de registro entre самый y наиболее.',
    prereqs: ['u6-adjetivo-declinado'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'lexico', dadas: ['declinacion'] },
    gratis: 'la existencia de supletivos, de las dos lenguas: bueno/mejor, bom/melhor son exactamente хороший/лучше. El alumno no se sorprende. Y el superlativo analítico con «самый» es «el más» literal.',
    motivo: 'flashcard de contraste; la parte derivable (-ее) va con el paradigma. El comparativo con GENITIVO (лучше меня, sin «que») sí es dificultad real y va con u10-reccion, no aquí',
    cubre: [], sinDescriptor: 'VERBO de A2 lo lista; sin descriptor',
    cita: 'comparativo y superlativo (больше/лучше/самый/наиболее)' }),

  // ── u7 · Verbo ─────────────────────────────────────────────────────
  P({ id: 'u7-conjugacion-i-ii', nombre: 'Conjugación I (-ешь) y II (-ишь) y sus alternancias', bloque: 7, nivel: 'A1',
    descripcion: 'Con las alternancias frecuentes писать→пишу, любить→люблю, que no se predicen desde el infinitivo.',
    prereqs: ['u1-ortografia-sibilantes'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'engañoso' },
    capas: { examina: 'conjugacion', dadas: ['grafia'] },
    gratis: 'MUCHO, y hay que declararlo para no cobrarlo: el alumno viene de dos lenguas con tres conjugaciones cada una, desinencia personal obligatoria, sujeto nulo y alternancias de raíz productivas (pido/pedimos, durmió; peço/pedimos). Dos clases con alternancia es MENOS de lo que ya maneja. Lo único nuevo es cuáles.',
    motivo: 'deriva por regla desde el lexicón con la alternancia guardada por lema; el gate la recalcula. §4.2 rumano en versión rusa: si alguien quita el record de un lema con alternancia, la regla sola producirá *писаю sin que nada falle. El invariante tiene que OBLIGAR a guardarla, no confiar en que esté',
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1; sin descriptor de sistema',
    cita: 'conjugación I (-ешь) y II (-ишь) con las alternancias frecuentes (писать→пишу, любить→люблю)' }),

  P({ id: 'u7-sin-copula', nombre: 'Sin cópula en presente: Я студент', bloque: 7, nivel: 'A1',
    descripcion: 'El presente de «ser» no se dice. Y en pasado y futuro sí, con lo que el alumno tiene que aprender a ponerlo después de aprender a quitarlo.',
    prereqs: ['u7-conjugacion-i-ii'], clase: 'sin-equivalente', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'conjugacion', dadas: ['caso', 'lexico'] },
    gratis: 'nada, y las dos lenguas obligan a la cópula sin excepción. Pero el error es de EXCESO y por tanto visible: el alumno escribe *Я есть студент, que es lo único que puede hacer.',
    motivo: 'la dificultad es una OMISIÓN que el alumno no hace, o sea que el error es ponerlo de más y eso SÍ cabe en corrección. §0.6: el ítem de sobreaplicación es el pasado (Я был студентом), donde quitarla es el error — y ahí además entra u5-instrumental-predicativo, así que el ítem tiene que darlo resuelto',
    pisoDeclarado: { piso: 2, motivo: 'DOS, bajado de 3 el 2026-09-11: el presente sin cópula y el pasado con cópula. La tercera casilla que la v0 se cobraba —el guion largo del registro escrito (Москва — столица)— es ÍNTEGRAMENTE u15-guion-largo, que además ya había escrito en su propio motivo la condición «que el ítem NO sea el de u7-sin-copula con otra piel». O sea que u15 vio el riesgo y lo declaró, y u7 lo cometió, y encima llamaba a esa casilla «la única con contenido propio». Es la duplicación del §4.20 en su forma más pura —el mismo ítem contado en un punto A1 y en uno B2— y no la ve ningún instrumento: sólo leer las dos entradas seguidas' },
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1; sin descriptor',
    cita: 'ausencia de cópula en presente (Я студент)' }),

  P({ id: 'u7-pasado-genero', nombre: 'El pasado concuerda en GÉNERO y no en persona: -л/-ла/-ло/-ли', bloque: 7, nivel: 'A1',
    descripcion: 'Я читал / я читала dependen de quién habla, no de la persona gramatical. Es un participio, no una conjugación.',
    prereqs: ['u7-conjugacion-i-ii', 'u3-genero-por-terminacion'], clase: 'sin-equivalente', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'conjugacion', dadas: ['genero', 'aspecto'] },
    gratis: 'la CONCORDANCIA DE GÉNERO EN EL PREDICADO existe en las dos lenguas y nadie la cuenta: «estoy cansada», «fui elegida», «ela foi vista» concuerdan con el sujeto. Lo que no transfiere es que la concordancia sustituya a la marca de persona, o sea que «yo» y «ella» compartan forma si las dos son mujeres.',
    motivo: 'deriva por regla. ⚠ Y EL AVISO DE ATRIBUCIÓN: todo ítem de pasado carga `aspecto` encima, porque elegir читал o прочитал es otra decisión. El ítem tiene que DAR el infinitivo del miembro exacto y pedir sólo la forma, o mide u8 y no u7',
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1; sin descriptor',
    cita: 'pasado con concordancia de género y número (-л/-ла/-ло/-ли)' }),

  P({ id: 'u7-futuro-compuesto-simple', nombre: 'Dos futuros, y el que elijas declara el aspecto: буду читать / прочитаю', bloque: 7, nivel: 'A1',
    descripcion: 'буду + infinitivo imperfectivo, o el presente de un perfectivo. No hay un futuro neutro: la forma OBLIGA a decidir el aspecto.',
    prereqs: ['u7-conjugacion-i-ii', 'u8-par-aspectual'], clase: 'sin-equivalente', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'aspecto', dadas: ['conjugacion', 'lexico'] },
    gratis: 'la perífrasis con auxiliar + infinitivo, de las dos lenguas («voy a leer», «vou ler»), y eso hace que буду читать se aprenda solo. Lo caro es lo contrario: que el PRESENTE de un perfectivo signifique futuro no tiene análogo, y produce el error de leer прочитаю como presente.',
    motivo: 'la capa examinada es `aspecto` y no `conjugacion`, y por eso este punto vive aquí y no en u8: lo que mide es que la elección de forma YA ES la elección de aspecto. El ítem da las dos formas y pide el contexto',
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1 y ASPECTO de A2; el descriptor de ASPECTO de A1 lo nombra junto al pasado',
    cita: 'futuro compuesto (буду + inf impf) y simple (presente de perfectivo)' }),

  P({ id: 'u7-reflexivo-sya', nombre: '-ся: el reflexivo que es un sufijo y no un pronombre', bloque: 7, nivel: 'A1',
    descripcion: 'умываться, одеваться, называться. Solapamiento semántico alto con el «se» español, y una diferencia formal que ninguna de las dos lenguas del alumno tiene: -ся va SIEMPRE pegado y detrás, sin colocación que decidir.',
    prereqs: ['u7-conjugacion-i-ii'], clase: 'coincide', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'conjugacion', dadas: ['lexico'] },
    gratis: 'la FUNCIÓN entera, del español; y del portugués, ADEMÁS, el hábito de escribirlo pegado con guion (chamar-se, lavou-se) y de moverlo. Aquí las dos lenguas ayudan de forma distinta y el portugués ayuda MÁS. Pero el portugués trae también lo único que estorba: la colocación. Un C2 de portugués espera que el clítico se mueva (não se lava / lava-se) y en ruso NUNCA se mueve. Es un hábito que hay que apagar, no una regla que aprender.',
    motivo: 'el punto NO puede examinar «cuándo lleva -ся», que es transferencia pura. Examina la FORMA: la alternancia -ся/-сь según vocal o consonante precedente (умываюсь / умываться), que es ortografía y no significado, y los verbos que sólo existen con -ся (смеяться, бояться, нравиться) sin contraparte',
    pisoDeclarado: { piso: 4, motivo: 'cuatro casillas con contenido: la alternancia -ся/-сь ×2, un verbo inherentemente reflexivo sin contraparte, y el pasivo con -ся (дом строится), que el español expresa igual («la casa se construye») pero que el alumno no asocia al mismo sufijo. El resto se contesta traduciendo' },
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1 y la lista de ventajas; sin descriptor',
    cita: 'verbos reflexivos en -ся (aprovechando el \'se\' español)' }),

  P({ id: 'u7-imperativo-forma', nombre: 'El imperativo: -и/-й/-ь desde el tema del presente', bloque: 7, nivel: 'A1',
    descripcion: 'La forma se deriva del tema de presente y del acento, no del infinitivo: читай, говори, будь.',
    prereqs: ['u7-conjugacion-i-ii'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'conjugacion', dadas: ['acento', 'aspecto'] },
    gratis: 'la existencia de una forma imperativa dedicada, y de las dos lenguas. Y un aviso: el español forma el imperativo negativo y el de usted con SUBJUNTIVO, así que el alumno ya sabe que el imperativo puede tener dos caras — lo que le falta es que en ruso la segunda cara sea el ASPECTO y no el modo.',
    abierto: '⚠ CARGA LA CAPA «acento» Y ESA CAPA NO TIENE DUEÑO PRODUCIBLE. Sus tres dueños (u2-acento-fonemico, u2-acento-movil, u15-metrica-poetica) están a pisoCero por falta del formato `posicion`, así que el estímulo de este punto tiene que traer el acento PINTADO —capa de presentación— y el ítem no puede pedirlo nunca. Va declarado y no razonado en un comentario porque el invariante de capas salía en VERDE sobre una capa con cero ítems detrás: comprobaba que el dueño EXISTIERA, no que enseñara. Existir no es enseñar, y lo destapó el lingüista adversarial el 2026-09-11',
    motivo: 'deriva por regla; ⚠ la regla depende del ACENTO del presente (пиши́ frente a бу́дь), o sea que carga la capa que el proyecto no puede examinar. El ítem tiene que dar el presente acentuado en el estímulo, y eso es capa de presentación, no respuesta',
    cubre: [], sinDescriptor: 'MORFOSINTAXIS de A1; sin descriptor',
    cita: 'imperativo; verbos reflexivos en -ся' }),

  P({ id: 'u7-irregulares-frecuentes', nombre: 'хотеть, есть, дать, бежать, мочь: los que no siguen ninguna clase', bloque: 7, nivel: 'A2',
    descripcion: 'хотеть cambia de conjugación a mitad del paradigma (хочу/хочешь/хочет pero хотим/хотите/хотят). Son pocos y de máxima frecuencia.',
    prereqs: ['u7-conjugacion-i-ii'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'conjugacion', dadas: ['lexico'] },
    gratis: 'que los verbos más frecuentes sean los más irregulares, de las dos lenguas (ser, ir, haber; ser, ir, pôr). El alumno no espera regularidad ahí.',
    motivo: 'se guarda entero, no se deriva. El invariante tiene que rechazar un lema marcado irregular sin sus formas guardadas, y devolver null en vez de derivar algo plausible — que es el fallo que en rumano produjo *daăm sin que nada explotara',
    cubre: [], sinDescriptor: 'VERBO de A2; sin descriptor',
    cita: 'verbos de conjugación irregular frecuentes (хотеть, есть, дать, бежать, мочь)' }),

  P({ id: 'u7-condicional-by', nombre: 'бы: un condicional que es una partícula y no un tiempo', bloque: 7, nivel: 'A2',
    descripcion: 'Pasado + бы sirve para lo real y lo irreal, sin distinguir tiempo. Я бы пошёл = «iría» y «habría ido».',
    prereqs: ['u7-pasado-genero'], clase: 'sin-equivalente', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'conjugacion', dadas: ['aspecto', 'orden'] },
    gratis: 'nada, y la interferencia es fuerte por partida doble: el español tiene condicional simple y compuesto Y subjuntivo, y el portugués igual, así que el alumno llega con CUATRO distinciones que el ruso funde en una. El error no es que le falte una forma: es que le sobran tres y buscará dónde meterlas.',
    abierto: '⚠ CARGA LA CAPA «orden» Y SU ÚNICO DUEÑO ≤A2 (u3-sin-articulo) ESTÁ A pisoCero: el primer punto producible que la examina es u11-orden-tema-rema, en C1. Así que el ítem tiene que fijar el orden en el estímulo y no puede examinarlo. Mismo hallazgo que la capa «acento» y mismo motivo: el invariante comprobaba existencia, no piso',
    motivo: 'la dificultad es de SIMPLIFICACIÓN, y una simplificación no produce una frase mala que corregir: produce una traducción correcta hecha con esfuerzo inútil. Transformación desde la paráfrasis española es el único formato que la ve',
    cubre: [], sinDescriptor: 'VERBO de A2; sin descriptor',
    cita: 'condicional con бы' }),

  // ── u8 · Aspecto ───────────────────────────────────────────────────
  P({ id: 'u8-par-aspectual', nombre: 'El par aspectual es la unidad léxica, no la palabra', bloque: 8, nivel: 'A1',
    descripcion: 'делать/сделать, читать/прочитать, говорить/сказать, брать/взять. Cada verbo del idioma son DOS lexemas emparejados por prefijación, sufijación o supleción, sin regla general.',
    prereqs: ['u7-conjugacion-i-ii'], clase: 'lexico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'opaco' },
    capas: { examina: 'lexico', dadas: ['conjugacion'] },
    gratis: 'nada de la FORMA. Y el aviso que decide el diseño del bloque entero: lo que el alumno trae —la intuición aspectual de imperfecto/indefinido, en dos lenguas— no ayuda aquí, porque aquí no hay que elegir un valor sino memorizar un PAR. Confundir las dos cosas es lo que hace que el aspecto se enseñe mal.',
    motivo: 'flashcard, y con una condición de modelo: el catálogo no puede guardarlos como dos entradas. Si entran como dos tarjetas independientes, el FSRS las programa por separado y el alumno acaba conociendo un miembro y no el otro — que es exactamente el modo en que se falla el aspecto. El currículo lo declara como reto específico y pide una entidad Lexeme',
    abierto: 'el modelo no tiene `Lexeme`. Hasta que lo tenga, este punto NO se puede producir sin fabricar la avería que su propio motivo describe',
    cubre: ['A1/ASPECTO'],
    cita: 'introducción como pares léxicos, no como flexión' }),

  P({ id: 'u8-pasado-proceso-resultado', nombre: 'Aspecto en pasado: proceso frente a resultado', bloque: 8, nivel: 'A2',
    descripcion: 'вчера я читал книгу frente a вчера я прочитал книгу. Es la cara del aspecto donde la intuición española SÍ funciona, y hay que decirlo.',
    prereqs: ['u8-par-aspectual', 'u7-pasado-genero'], clase: 'coincide', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'aspecto', dadas: ['conjugacion', 'lexico'] },
    gratis: 'ESTA MITAD ENTERA, y de las dos lenguas. «Leía»/«leí», «lia»/«li» mapean sobre читал/прочитал con una fidelidad muy alta en el caso central. El currículo lo llama «la mayor ventaja que tiene sobre un anglohablante», y eso significa que un lote de ocho ítems de proceso/resultado le mide el español.',
    motivo: 'el punto NO puede ser el reparto central. Lo que mide es dónde el mapeo se rompe, y eso está declarado en un punto aparte (u8-general-factico, u8-resultado-anulado) precisamente para que este no se lo lleve. Aquí quedan las casillas donde el imperfecto español y el imperfectivo ruso DISCREPAN dentro del caso central: la repetición (каждый день читал, donde el español admite los dos) y el verbo de fase',
    pisoDeclarado: { piso: 3, motivo: 'contado antes de escribir: el caso central es transferencia y las dos caras genuinamente rusas tienen punto propio. Quedan tres casillas de discrepancia dentro del centro. Inflar esto a ocho sería certificar español con ítems impecables' },
    cubre: ['A1/ASPECTO'],
    cita: 'explica en español por qué \'leí\' puede traducirse читал o прочитал según lo que se quiera decir' }),

  P({ id: 'u8-general-factico', nombre: 'El imperfectivo general-fáctico: Вы читали «Войну и мир»?', bloque: 8, nivel: 'B1',
    descripcion: 'Preguntar si el hecho ocurrió alguna vez, sin mirar el resultado, pide imperfectivo. El español usa ahí su perfecto y empuja al perfectivo ruso.',
    prereqs: ['u8-pasado-proceso-resultado'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'aspecto', dadas: ['conjugacion', 'lexico'] },
    gratis: 'nada, y es peor que nada: las dos lenguas apuntan activamente al miembro equivocado. «¿Has leído Guerra y paz?» / «Já leste?» son perfectos de resultado, y el calco da *Вы прочитали.',
    motivo: 'EL PUNTO DIAGNÓSTICO DEL IDIOMA, y el currículo lo convierte en puerta de salida de A2, B1 y B2. Y la trampa de formato que hay que decir: *Вы прочитали «Войну и мир»? es gramatical y significa otra cosa, así que NO ES UNA MALA y el formato de corrección no sirve. Bajo §0 no se le puede poner asterisco. Necesita elección obligada CON CONTEXTO que desambigüe, y el contexto tiene que hacer el trabajo entero',
    abierto: 'antes de escribir, contar en el corpus cuántos contextos fuerzan UNA lectura. Si el contexto que desambigua es tan largo que el ítem se contesta leyéndolo, el ítem mide comprensión lectora y no aspecto',
    cubre: [], sinDescriptor: 'ASPECTO de B1 lo declara como uno de «los dos valores que el español no tiene»; el descriptor correspondiente es de PRODUCCIÓN ORAL y está excluido',
    cita: 'el general-fáctico (Вы смотрели этот фильм?) — los dos valores que el español no tiene' }),

  P({ id: 'u8-resultado-anulado', nombre: 'El imperfectivo de resultado anulado: он приходил', bloque: 8, nivel: 'B1',
    descripcion: 'он приходил = vino y ya se fue; он пришёл = vino y está aquí. El imperfectivo CANCELA el resultado.',
    prereqs: ['u8-general-factico'], clase: 'sin-equivalente', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'aspecto', dadas: ['conjugacion', 'movimiento', 'lexico'] },
    gratis: 'nada. Y ninguna de las dos lenguas puede ni expresarlo sin añadir palabras («vino y se fue»), así que el alumno no tiene dónde colgarlo.',
    motivo: 'MEDIDO en el corpus: он приходил 63, он пришёл 16 + он пришел 130 (146). O sea que las dos están vivas y la construcción no es marginal, lo que hace el punto producible. Elección obligada con contexto que fije si el sujeto sigue presente. ⚠ Y CARGA `movimiento`: приходить es un verbo de movimiento prefijado, así que un ítem con приходил mide dos capas. Los ítems tienen que usar verbos NO de movimiento (брал/взял, давал/дал) o el fallo no dice qué reforzar',
    cubre: [], sinDescriptor: 'ASPECTO de B1; el descriptor que lo nombra es de PRODUCCIÓN ORAL y está excluido',
    cita: 'el imperfectivo de resultado anulado (он приходил)' }),

  P({ id: 'u8-imperativo-aspecto', nombre: 'Aspecto en imperativo: не открывай frente a не забудь', bloque: 8, nivel: 'A2',
    descripcion: 'Imperfectivo para PROHIBIR (не открывай!), perfectivo para ADVERTIR de algo involuntario (Не забудь ключи!, Смотри, не упади!). Y Садитесь ≠ Сядьте en cortesía.',
    prereqs: ['u8-par-aspectual', 'u7-imperativo-forma'], clase: 'trampa', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'aspecto', dadas: ['conjugacion', 'registro'] },
    gratis: 'nada: el español y el portugués no marcan nada de esto, y el alumno no tiene ni la sospecha de que haya una elección. Aquí sí es legítimo declarar dificultad y el campo lo dice sin adorno.',
    motivo: 'el currículo avisa de que «no es una regla dura: son dos valores distintos», y eso bajo §0 significa que NINGUNA de las dos opciones puede llevar asterisco. El formato es elección con contexto, no corrección. Y la cara de cortesía (Садитесь/Сядьте) es pragmática, va con u14',
    cubre: [], sinDescriptor: 'ASPECTO de A2; sin descriptor',
    cita: 'imperfectivo para PROHIBIR (не открывай!), perfectivo para ADVERTIR de algo involuntario' }),

  P({ id: 'u8-fase-modal', nombre: 'Verbos de FASE: начать/кончить + imperfectivo obligatorio', bloque: 8, nivel: 'A2',
    descripcion: 'Tras empezar, terminar, continuar el aspecto no se elige: es imperfectivo siempre. Es la única casilla del aspecto con regla dura.',
    prereqs: ['u8-par-aspectual'], clase: 'paradigma', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'aspecto', dadas: ['conjugacion', 'lexico'] },
    gratis: 'nada, pero es el punto MÁS BARATO del bloque precisamente porque es una regla y no un valor: se aprende en un ítem.',
    varianza: '+imperfectivo es invariante en los ocho por definición del punto, y eso NO es legítimo aquí (a diferencia de una invariancia de la lengua): lo único que varía es el verbo de fase, que es u13-lexico. Cobertura real 1',
    abierto: '⚠ EL NOMBRE DE LA v0 DECÍA «Verbos de fase Y MODALES» y era falso, y el nombre es lo primero que lee el siguiente (misma avería que r7-supin en rumano, que hubo que renombrar por eso). Los modales NO imponen imperfectivo: могу читать / могу прочитать, хочу писать / хочу написать, должен делать / должен сделать son los dos posibles con diferencia de sentido. Peor: la varianza declaraba que el ítem de frontera es «un verbo de fase que NO impone imperfectivo», y no existe ninguno — LA FRONTERA ES PRECISAMENTE EL MODAL, y el punto se había quedado sin ella justo al afirmar que el modal se comporta como la fase. El número 2 del piso sigue valiendo; la segunda casilla hay que reescribirla como modal y no como fase, y eso no se hace sin dictamen',
    motivo: 'cloze del aspecto tras verbo de fase, con el par DADO en el estímulo para que el fallo sea de regla y no de léxico',
    pisoDeclarado: { piso: 2, motivo: 'la regla se aprende en el primer ítem. El segundo es el de frontera: un verbo de fase que NO impone imperfectivo o un contexto donde el perfectivo entra por otra vía. Del tercero en adelante sólo varía el léxico' },
    cubre: [], sinDescriptor: 'ASPECTO de A2; sin descriptor',
    cita: 'aspecto tras verbos modales y de fase (начать/кончить + imperfectivo obligatorio)' }),

  P({ id: 'u8-formacion-pares', nombre: 'Los tres mecanismos de formación del par, como sistema derivativo', bloque: 8, nivel: 'A2',
    descripcion: 'Prefijal (делать/сделать), sufijal (решить/решать) y supletivo (говорить/сказать). Y el hecho incómodo: el prefijo casi siempre añade significado además de aspecto, y sólo unos pocos son «vacíos».',
    prereqs: ['u8-par-aspectual'], clase: 'lexico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'derivacion', dadas: ['aspecto', 'lexico'] },
    gratis: 'la derivación por prefijo en sí, de las dos lenguas (hacer/deshacer, poner/componer). Lo que no transfiere es que un prefijo pueda cambiar sólo el ASPECTO sin tocar el significado, que es una función que ni el español ni el portugués tienen.',
    motivo: 'derivación como sistema, no lista. Es el punto que convierte el aspecto de memoria en regla parcial',
    cubre: [], sinDescriptor: 'ASPECTO de A2 y B1; sin descriptor',
    cita: 'los tres mecanismos de formación de pares (prefijal, sufijal, supletivo) enseñados como sistema derivativo, no como lista' }),

  P({ id: 'u8-biaspectuales-tripletes', nombre: 'Biaspectuales (использовать) y tripletes (есть/съесть/съедать)', bloque: 8, nivel: 'B2',
    descripcion: 'Verbos que son los dos aspectos a la vez, y pares que son tres. Rompen el supuesto de que el par es binario.',
    prereqs: ['u8-formacion-pares'], clase: 'lexico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'transparente' },
    capas: { examina: 'lexico', dadas: ['aspecto'] },
    gratis: 'nada. Y el estrato internacional aquí ayuda a reconocer el lema (использовать, организовать, информировать son casi todos biaspectuales y casi todos internacionalismos) justo donde la morfología no da ninguna pista, que es el engaño de siempre con otra piel.',
    motivo: 'es el ítem de frontera del bloque 8 entero: sin él, el alumno aprende «todo verbo tiene exactamente un compañero» y sobregeneraliza. §0.6 en su forma de bloque y no de punto',
    pisoDeclarado: { piso: 4, motivo: 'cuatro casillas: dos biaspectuales y dos tripletes. Más sería el mismo hecho con distinto lema' },
    cubre: [], sinDescriptor: 'ASPECTO de B2; sin descriptor',
    cita: 'los verbos biaspectuales (использовать, организовать)' }),

  // ── u9 · Verbos de movimiento ──────────────────────────────────────
  P({ id: 'u9-uni-multidireccional', nombre: 'идти/ходить: trayecto en curso frente a desplazamiento habitual', bloque: 9, nivel: 'A1',
    descripcion: 'Una oposición que hay que resolver ANTES de abrir la boca para decir «voy a la escuela». No existe en ninguna de las lenguas del alumno.',
    prereqs: ['u7-conjugacion-i-ii'], clase: 'sin-equivalente', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'movimiento', dadas: ['conjugacion', 'aspecto'] },
    gratis: 'el contraste puntual/habitual EXISTE en las dos lenguas y nadie lo ha contado: «voy a la escuela» / «suelo ir a la escuela», «estoy yendo» / «voy». El español distingue lo mismo con perífrasis, y el portugués con «estar a + inf» o el gerundio. Así que el alumno tiene el CONCEPTO. Lo que no tiene es que la distinción sea LÉXICA y obligatoria: no puede callarse.',
    motivo: 'el punto no es el concepto, que transfiere: es que la elección sea forzosa y se haga con dos verbos distintos. Elección obligada con contexto',
    cubre: ['A1/GRAMÁTICA · movimiento'],
    cita: 'elige entre идти/ходить y ехать/ездить sin prefijo según sea trayecto único en curso o desplazamiento habitual' }),

  P({ id: 'u9-ir-a-pie-o-en-vehiculo', nombre: 'идти frente a ехать: la distinción que el español no hace', bloque: 9, nivel: 'A1',
    descripcion: 'A pie o en vehículo. Es léxica, obligatoria y sin equivalente.',
    prereqs: ['u9-uni-multidireccional'], clase: 'sin-equivalente', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'movimiento', dadas: ['conjugacion'] },
    gratis: 'nada del corte. Pero el punto es BARATO por otra razón que hay que declarar para no cobrarlo: el rasgo es semánticamente transparente y se aprende en un ítem. Lo caro no es saberlo, es acordarse a tiempo, y eso no lo mide una tarjeta.',
    varianza: 'si los ocho ítems reparten a pie/en vehículo, la operación es una y lo que varía es el destino, que es u13-lexico',
    motivo: 'elección obligada con contexto que fije el medio sin nombrarlo (si la frase dice «en autobús», el ítem se contesta leyendo)',
    pisoDeclarado: { piso: 2, motivo: 'dos: el caso central y el de frontera (идти con vehículo como sujeto — поезд идёт, autobuses y trenes «van» con идти, que desmiente la regla que el primer ítem enseña)' },
    cubre: ['A1/GRAMÁTICA · movimiento'],
    cita: 'идти vs ехать (a pie vs en vehículo, distinción que el español no hace)' }),

  P({ id: 'u9-prefijos-direccionales', nombre: 'Los prefijos direccionales, y que además cambian el aspecto', bloque: 9, nivel: 'A2',
    descripcion: 'при-, у-, вы-, в-, под-, от-, до-, пере-, про-, за- sobre los pares base, con la interacción prefijo↔aspecto explicitada (прийти perfectivo / приходить imperfectivo), que es donde el alumno se pierde.',
    prereqs: ['u9-uni-multidireccional', 'u8-formacion-pares'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'movimiento', dadas: ['derivacion', 'aspecto', 'conjugacion'] },
    gratis: 'la semántica de varios prefijos, de las dos lenguas, por vía latina: при-/ad-, от-/ab-, пере-/trans-, в-/in-, вы-/ex-, до-/ad-usque. Un alumno que reconozca «aducir», «abstraer», «transferir», «excluir» tiene la mitad del mapa semántico ya hecha. Es transferencia REAL y este es el punto del inventario donde más se subestima.',
    motivo: 'deriva por regla. Y con el aviso de atribución más caro del inventario: un ítem de prefijo carga a la vez `movimiento`, `derivacion`, `aspecto` y `conjugacion`. Tres de las cuatro tienen que ir dadas en el estímulo o el fallo no dice nada',
    cubre: ['A2/GRAMÁTICA · caso'],
    cita: 'con la interacción prefijo-aspecto (прийти perfectivo / приходить imperfectivo) explicitada, porque es donde el alumno se pierde' }),

  P({ id: 'u9-catorce-pares', nombre: 'Los 14 pares base y la diferencia transitivo/intransitivo', bloque: 9, nivel: 'B1',
    descripcion: 'нести/носить, вести/водить, везти/возить, лететь/летать, плыть/плавать… y нести frente a идти: llevar algo o ir.',
    prereqs: ['u9-prefijos-direccionales'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'lexico', dadas: ['movimiento', 'conjugacion'] },
    gratis: 'el corte transitivo/intransitivo, de las dos lenguas («ir»/«llevar», «ir»/«levar»). Lo que no transfiere es que cada uno tenga su propia pareja uni/multidireccional, o sea que el sistema sea 14×2 y no 14.',
    motivo: 'flashcard con la pareja como unidad, no como dos entradas — misma condición de modelo que u8-par-aspectual',
    cubre: [], sinDescriptor: 'VERBOS DE MOVIMIENTO de B1; sin descriptor',
    cita: 'los 14 pares base (идти/ходить, ехать/ездить, нести/носить, вести/водить' }),

  P({ id: 'u9-usos-figurados', nombre: 'Los usos figurados: время идёт, дождь идёт, речь идёт о', bloque: 9, nivel: 'B1',
    descripcion: 'Sobre la combinatoria literal se monta un uso figurado masivo, y en él las reglas uni/multidireccional dejan de valer.',
    prereqs: ['u9-catorce-pares'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'lexico', dadas: ['movimiento'] },
    gratis: 'MÁS DE LO QUE PARECE: «el tiempo va/pasa», «la cosa va de», «te va bien esa camisa» — el español mexicano y el portugués usan el verbo de movimiento en los mismos huecos metafóricos, y varios coinciden literalmente con el ruso. Un lote que no compruebe cuáles coinciden cobrará como difícil lo que es traducción directa.',
    motivo: 'flashcard de colocación. ANTES DE ESCRIBIR: traducir cada expresión a español mexicano y a portugués y descartar las que salen bien en las dos. Es la pasada en seco que en rumano ahorró cuatro lotes',
    abierto: 'sin esa pasada no se escribe: es previsible que la mitad de la lista del currículo sea transferencia',
    cubre: [], sinDescriptor: 'VERBOS DE MOVIMIENTO de B1; sin descriptor',
    cita: 'los usos figurados de alta frecuencia (время идёт, дождь идёт, речь идёт о, ему идёт эта рубашка, идти на компромисс)' }),

  // ── u10 · Rección ──────────────────────────────────────────────────
  P({ id: 'u10-reccion-verbal', nombre: 'El régimen: заниматься+instr, помогать+dat, звонить+dat', bloque: 10, nivel: 'A2',
    descripcion: '60 verbos frecuentes que exigen un caso, una preposición o las dos. El eje de interferencia ES→RU número uno.',
    prereqs: ['u5-declinacion-plural'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'lexico', 'conjugacion'] },
    gratis: 'la EXISTENCIA del régimen, de las dos lenguas y con fuerza: «depender DE», «insistir EN», «soñar CON» son rección arbitraria, y el alumno ya sabe que se memoriza con el verbo. El portugués añade que el régimen DISCREPE entre dos lenguas parecidas («gostar de» / «gustar Ø»), que es el hábito exacto que necesita. Lo que no trae es que la marca sea un CASO y no una preposición, así que su error no será poner la preposición equivocada: será no poner NINGUNA marca.',
    motivo: 'el error diana es la OMISIÓN del caso, y eso no cabe en corrección tal cual: *я занимаюсь русский язык es lo que produce el calco, y es corregible porque el alumno pone la forma de nominativo donde va el instrumental — o sea que pone algo de más, no de menos. Sí cabe. Pero el tipo de ejercicio actual (VerbPrepositionData con opciones de preposición) no puede expresar «preposición + caso», y eso está declarado como reto',
    cubre: ['A2/GRAMÁTICA · rección'],
    cita: 'usa correctamente el régimen de 60 verbos frecuentes de alta interferencia (заниматься+instr, помогать+dat, ждать+gen/ac, интересоваться+instr' }),

  P({ id: 'u10-reccion-con-cambio', nombre: 'ждать + genitivo o acusativo, con cambio de sentido', bloque: 10, nivel: 'B1',
    descripcion: 'Los verbos donde el caso no es arbitrario sino significativo: esperar algo indefinido o alguien concreto.',
    prereqs: ['u10-reccion-verbal'], clase: 'trampa', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'lexico'] },
    gratis: 'nada: ninguna de las dos lenguas tiene un contraste equivalente, y el español no marca nada aquí («espero el tren»/«espero a Juan» es animacidad, no definitud).',
    motivo: 'las dos opciones son gramaticales y significan cosas distintas, así que NO hay mala: elección con contexto, nunca corrección. Es la misma estructura que u8-general-factico',
    pisoDeclarado: { piso: 4, motivo: 'contado: los verbos con este comportamiento y frecuencia suficiente son pocos (ждать, просить, хотеть, искать). Ocho ítems serían los mismos cuatro repetidos' },
    cubre: ['A2/GRAMÁTICA · rección'],
    cita: 'ждать + genitivo o acusativo con cambio de sentido' }),

  P({ id: 'u10-reccion-adjetival-nominal', nombre: 'Rección del adjetivo y del nombre: уверен в + prep, интерес к + dat', bloque: 10, nivel: 'B1',
    descripcion: 'No sólo los verbos rigen. Y la nominalización de B2 hereda el régimen del verbo del que sale.',
    prereqs: ['u10-reccion-verbal'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'derivacion', 'lexico'] },
    gratis: 'que el adjetivo y el nombre rijan, de las dos lenguas: «seguro DE», «interés POR», «capaz DE». Y que el nombre herede el régimen del verbo («interesarse por» → «interés por»). Eso es un mecanismo entero regalado y hay que contarlo.',
    motivo: 'flashcard de contraste con el par ES/PT declarado por ítem. El punto mide CUÁL caso, no que haya caso',
    cubre: [], sinDescriptor: 'RECCIÓN VERBAL Y ADJETIVAL de A2 lo declara; el descriptor sólo nombra los verbos',
    cita: 'debe extenderse a la rección adjetival (уверен в + prep) y nominal (интерес к + dat)' }),

  P({ id: 'u10-sintagma-numeral-adjetivo', nombre: 'Dos reglas superpuestas: два новых дома / пять новых домов', bloque: 10, nivel: 'B1',
    descripcion: 'Con adjetivo, el numeral rige el sustantivo y el adjetivo va por su cuenta. Tres reglas en un solo sintagma.',
    prereqs: ['u5-numerales-rigen-caso', 'u6-adjetivo-declinado'], clase: 'paradigma', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'genero', 'lexico'] },
    gratis: 'nada, y es donde el alumno se rompe. Ni el español ni el portugués superponen dos regímenes en un sintagma nominal.',
    motivo: 'lo único suyo, una vez separado de u5-numerales-rigen-caso (2026-09-12), es el caso del ADJETIVO tras 2-4: la única configuración del ruso donde el adjetivo NO concuerda con el caso del sustantivo. `пять новых домов` NO pertenece aquí —ahí el adjetivo va en genitivo plural igual que el sustantivo, o sea ninguna decisión nueva— y este punto deja de reclamarlo',
    abierto: '⚠ EL CORPUS DE LECTURA DEL PROYECTO CONTRADICE LA REGLA DE ESTE PUNTO, y es una clase nueva. La norma moderna (Розенталь; АГ-80) reparte: masculino y neutro → adjetivo en genitivo plural (два больших дома), femenino → nominativo plural (две большие книги). Medido en las 2.180 lecturas y LEÍDO acierto por acierto, no contado: `два большие` 7 frente a `два больших` 10, `два молодые` 6 frente a `два молодых` 8, `три большие` 5 frente a `три больших` 1. ⚠ CORREGIDO EL 2026-09-13: la v0 de esta medida escribía `два молодых` **0** y son **8**, leídas una a una y las ocho masculinos genitivos de verdad («жили в одной деревне два молодых парня», «лежали на траве два молодых человека», «два молодых офицера»). O sea que la lectura de la v0 —«el masculino toma el NOMINATIVO plural al menos tan a menudo como el genitivo»— se sostiene con 7/10 y 5/1 pero NO con el par de `молодой`, que va 6 frente a 8 y va al revés. La conclusión de fondo no cambia (las dos formas conviven en el XIX y la norma de hoy es una estandarización posterior); lo que cambia es que un cero citado como prueba de que la forma normativa no aparece era falso, y el cero era del recuento, no de la lengua. Las apariciones son masculinos de verdad y de prosa buena — «два большие портрета» (Dostoievski), «два молодые сослуживца», «два большие стога», «три большие дерева» —, con un solo falso positivo de 12 leídos («через два года, молодые…»). O sea que en el XIX el masculino toma el NOMINATIVO plural al menos tan a menudo como el genitivo, y la norma de hoy es una estandarización posterior. El punto NO muere: la norma moderna es citable y bajo §0 eso basta para marcar la otra forma como no normativa HOY. Pero (a) ningún ítem puede justificarse con el corpus, que es el segundo camino de todo lo demás; (b) el femenino NO está determinado ni siquiera hoy —`две новых канарейки` (Mamin-Sibiriak), `две маленьких`, 2 apariciones frente a 23— así que un ítem que exija sólo -ые suspende a un alumno que escribe ruso atestado; y (c) la LECCIÓN tiene que decirle al alumno que va a leer la otra forma en la biblioteca, o el material de inmersión desenseña el punto. Antes de escribir un lote hay que decidir eso, y no es decisión del agente',
    varianza: 'si el lote reparte entre masculino y femenino, la mitad femenina no discrimina: las dos respuestas están atestadas. La cobertura real de un lote de ocho sería 3 o 4, no 8 — el piso habría que declararlo a la baja con este dictamen, y un cambio de piso va en su propia línea y no lo decide quien escribe el lote',
    cubre: [], sinDescriptor: 'CASO — usos difíciles de B1; el descriptor de PRODUCCIÓN ORAL de B2 lo nombra y está excluido',
    cita: 'el sintagma numeral completo, con adjetivo: два новых дома / пять новых домов / двадцать одна новая книга' }),

  P({ id: 'u10-numerales-colectivos', nombre: 'двое, трое, четверо y su restricción de uso', bloque: 10, nivel: 'B1',
    descripcion: 'Numerales colectivos con distribución restringida: personas masculinas, niños, pares de objetos, y los plurales sin singular.',
    prereqs: ['u10-sintagma-numeral-adjetivo'], clase: 'lexico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'lexico', dadas: ['caso', 'declinacion'] },
    gratis: 'nada. Lo más cercano es «ambos»/«ambos», que es un colectivo de dos, y no se generaliza.',
    motivo: 'flashcard de distribución. ⚠ §0: la alternativa con numeral cardinal suele ser CORRECTA (два друга y двое друзей coexisten), así que no hay mala y el formato de corrección no sirve',
    pisoDeclarado: { piso: 3, motivo: 'las casillas donde el colectivo es obligatorio y el cardinal agramatical son pocas: plurales sin singular (двое суток, трое ножниц) y poco más. Fuera de ahí es preferencia' },
    cubre: [], sinDescriptor: 'CASO — usos difíciles de B1; sin descriptor',
    cita: 'numerales colectivos (двое, трое, четверо) y su restricción de uso' }),

  P({ id: 'u10-numerales-declinados', nombre: 'Declinar el numeral compuesto: с тремястами пятьюдесятью шестью', bloque: 10, nivel: 'B2',
    descripcion: 'Cada parte del numeral compuesto declina por su cuenta. Es el punto donde hasta los nativos dudan.',
    prereqs: ['u10-sintagma-numeral-adjetivo'], clase: 'paradigma', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'declinacion', dadas: ['caso', 'lexico'] },
    gratis: 'nada. Y un aviso de registro: el ruso hablado real evita declinar los numerales largos, así que un punto que lo exija enseña la norma escrita. Va declarado, no disimulado.',
    motivo: 'deriva por regla; el gate lo recalcula. Y con la nota de registro escrita en el propio punto: lo que se enseña es la norma, y el alumno tiene que saber que la oirá incumplida',
    cubre: [], sinDescriptor: 'NUMERALES de B2; el descriptor de PRODUCCIÓN ORAL que lo nombra está excluido',
    cita: 'declinación completa de los numerales compuestos, fracciones y porcentajes' }),

  // ── u11 · Sintaxis compleja ────────────────────────────────────────
  P({ id: 'u11-kotoryj', nombre: 'который: el caso lo fija la subordinada, el género y el número el antecedente', bloque: 11, nivel: 'B1',
    descripcion: 'Una regla de DOS fuentes, que se falla sistemáticamente porque el alumno toma las tres cosas del antecedente.',
    prereqs: ['u6-demostrativos', 'u5-declinacion-plural'], clase: 'trampa', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'genero'] },
    gratis: 'el relativo con antecedente, de las dos lenguas, y con una pieza que ayuda de verdad: «el cual / la cual / los cuales» y «o qual» CONCUERDAN con el antecedente, así que la mitad de género y número del ruso ya la hace el alumno. Lo que no trae es la otra fuente. Su error, por tanto, es predecible y uniforme: concordará el caso también con el antecedente.',
    motivo: 'error diana atestado y corregible, y el mejor ítem de corrección del inventario: el alumno pone una forma DE MÁS (la concordada) donde va otra. §0.6: el ítem de sobreaplicación es aquel donde las dos fuentes coinciden por casualidad y el alumno no puede notar la diferencia — hay que EXCLUIRLO del lote, no incluirlo, porque no discrimina',
    cubre: ['B1/GRAMÁTICA'],
    cita: 'usa который declinado y concordado correctamente' }),

  P({ id: 'u11-chtoby', nombre: 'чтобы + pasado frente a чтобы + infinitivo', bloque: 11, nivel: 'B1',
    descripcion: 'Si el sujeto coincide, infinitivo; si no, pasado. Y ese «pasado» no significa pasado.',
    prereqs: ['u7-condicional-by'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'conjugacion', dadas: ['aspecto', 'lexico'] },
    gratis: 'LA REGLA ENTERA, del español: «quiero ir» / «quiero que vayas» es exactamente la misma condición de coincidencia de sujeto, y el alumno la aplica sin pensar. Es transferencia al 100 % y significa que el punto NO puede examinar la elección. Y AQUÍ EL PORTUGUÉS DISCREPA, que es lo interesante: el portugués tiene INFINITIVO PERSONAL («para eu ir», «para tu ires»), o sea una tercera salida que el ruso no tiene, y un C2 de portugués puede intentar flexionar el infinitivo ruso. Es el único punto del inventario donde el portugués mete un error que el español no mete.',
    motivo: 'la elección es gratis; lo que queda es la FORMA (que la subordinada vaya en pasado sin valor temporal) y el error de infinitivo personal que trae el portugués. Corrección, con el error diana declarado como PORTUGUÉS y no como castellano',
    pisoDeclarado: { piso: 3, motivo: 'tres casillas: el pasado sin valor temporal ×2 y el infinitivo personal calcado del portugués ×1. La elección de formato la resuelve el español al 100 % y ocho ítems de eso medirían español' },
    cubre: ['B1/GRAMÁTICA'],
    cita: 'distingue чтобы + pasado de чтобы + infinitivo' }),

  P({ id: 'u11-estilo-indirecto', nombre: 'El estilo indirecto ruso NO retrasa el tiempo', bloque: 11, nivel: 'B1',
    descripcion: 'Он сказал, что он придёт = «Dijo que vendría». El ruso conserva el tiempo del original y contradice la consecutio temporum española.',
    prereqs: ['u11-chtoby'], clase: 'trampa', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'conjugacion', dadas: ['aspecto', 'lexico'] },
    gratis: 'LO CONTRARIO DE LO QUE DECÍA LA v0, y el punto cambia de SIGNO. La v0 decía «el español y el portugués retrasan obligatoriamente» y que las dos empujan al error. Falso: el español mexicano hablado y escrito NO retrasa cuando el contenido sigue vigente —«Dijo que viene mañana», «Me dijo que llega el lunes» son normales y no marcados—, y el portugués igual. La consecutio es regla de gramática escolar, no obligación productiva. O sea que las dos lenguas OFRECEN YA la construcción rusa y lo único que el alumno tiene que hacer es dejar de autocorregirse hacia la norma escolar. Eso no es una dificultad: es una inhibición, y una inhibición no produce una frase mala que corregir.',
    motivo: 'transformación directa→indirecta, que es el único formato donde el retraso se vería. ⚠ AVISO HEREDADO DEL RUMANO, donde este mismo punto MURIÓ: allí la alternancia era subproducción y las dos opciones eran correctas. Aquí hay que comprobarlo ANTES de escribir: si el pasado ruso también es aceptable en la subordinada, no hay mala y el punto muere igual',
    abierto: 'contar en el corpus cuántas subordinadas de verbo de decir en pasado llevan futuro y cuántas pasado. Si las dos salen con frecuencia alta, no hay mala bajo §0 y el punto pasa a preferencia-registro. ⚠ Y DESDE EL 2026-09-11 EL PUNTO ESTÁ AMENAZADO POR LAS DOS VÍAS A LA VEZ: además de eso, la transferencia que se le suponía al alumno no existe (ver `gratis`), así que aunque hubiera mala puede que no haya nadie que la produzca. Es la forma exacta en que murió r8-discurso-indirecto en rumano —lengua bien descrita, formato equivocado— y allí costó ocho ítems escritos y retirados. Aquí no se escribe ni uno hasta tener las dos respuestas',
    cubre: ['B1/GRAMÁTICA'],
    cita: 'reproduce el estilo indirecto ruso, que conserva el tiempo original y por tanto contradice la concordancia de tiempos española' }),

  P({ id: 'u11-impersonales', nombre: 'можно, нужно, нельзя, стоит + infinitivo', bloque: 11, nivel: 'B1',
    descripcion: 'Oraciones sin sujeto nominativo, con el experimentante en dativo.',
    prereqs: ['u4-sujeto-dativo'], clase: 'coincide', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'caso', dadas: ['declinacion', 'aspecto'] },
    gratis: 'TODO lo estructural, de las dos lenguas: «se puede», «hay que», «no se debe», «vale la pena» + infinitivo son idénticos. Lo único que no es gratis es el DATIVO del experimentante (мне нельзя), y eso ya lo cobra u4-sujeto-dativo.',
    motivo: 'PISO CERO: no hay ítem que escribir. Ver el campo pisoCero',
    pisoCero: 'su mitad útil ya vive en u4-sujeto-dativo (el dativo del experimentante) y en u8-imperativo-aspecto (нельзя + imperfectivo prohíbe, + perfectivo dice «no se puede»). Lo que queda —la construcción impersonal— es transferencia al 100 % desde las dos lenguas. Es la pregunta del §3.1 rumano hecha antes de escribir un ítem: antes de re-encuadrar un punto, preguntar si su mitad útil ya vive en otro sitio. Aquí vive',
    cubre: [], sinDescriptor: 'SINTAXIS COMPLEJA de B1; sin descriptor',
    cita: 'oraciones impersonales (можно, нужно, нельзя, стоит + inf)' }),

  P({ id: 'u11-orden-tema-rema', nombre: 'El orden de palabras como recurso informativo', bloque: 11, nivel: 'C1',
    descripcion: 'Актуальное членение: lo conocido delante, lo nuevo al final. En ruso hace además el trabajo del artículo.',
    prereqs: ['u3-sin-articulo', 'u5-declinacion-plural'], clase: 'coincide', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'orden', dadas: ['caso', 'declinacion'] },
    gratis: 'MUCHO, y el currículo lo declara como ventaja específica del hispanohablante: «El libro lo compré yo» es tema-rema deliberado. El portugués hace lo mismo. Pero hay una mitad que NO es gratis y el currículo no la separa: en español el orden marcado necesita un CLÍTICO de recuperación («el libro LO compré») y en ruso no necesita nada porque el caso ya marca la función. O sea que el alumno sabe mover y no sabe soltar la muleta.',
    motivo: 'transformación: misma frase, distinta articulación. Y el punto se acota a la mitad sin muleta, que es lo único que no transfiere. Aquí se paga además la deuda de u3-sin-articulo, que es donde este contenido debería haber empezado y no pudo',
    cubre: ['C1/GRAMÁTICA Y ESTILO'],
    cita: 'usa el orden de palabras como recurso informativo (tema-rema) de forma deliberada — ventaja específica del hispanohablante' }),

  // ── u12 · Formas no personales y voz ───────────────────────────────
  P({ id: 'u12-participios-reconocimiento', nombre: 'Participios activos y pasivos: reconocerlos en texto', bloque: 12, nivel: 'B1',
    descripcion: 'читающий, читавший, читаемый, прочитанный. Aparecen en todo texto escrito y sin ellos no se lee prensa. En B1 son de RECONOCIMIENTO.',
    prereqs: ['u8-formacion-pares', 'u6-adjetivo-declinado'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'derivacion', dadas: ['aspecto', 'declinacion', 'conjugacion'] },
    gratis: 'el participio adjetival, de las dos lenguas: «el libro leído», «o livro lido». Y el portugués aporta algo extra que el español no tiene: participios dobles (aceite/aceitado, entregue/entregado) y el hábito de que el participio sea una forma con vida propia. Lo que no transfiere es el participio ACTIVO (читающий = «el que lee»), que ninguna de las dos tiene y que el alumno leerá como adjetivo.',
    motivo: 'reconocimiento: dada la forma, dar el verbo y la relación (activo/pasivo, presente/pasado). El punto se acota al ACTIVO, que es lo que no transfiere; los pasivos se contestan traduciendo',
    cubre: [], sinDescriptor: 'FORMAS NO PERSONALES de B1; el descriptor de COMPRENSIÓN LECTORA lo cubre indirectamente',
    cita: 'participios activos y pasivos, presente y pasado (читающий, читавший, читаемый, прочитанный)' }),

  P({ id: 'u12-participios-produccion', nombre: 'Formar participios, con sus restricciones aspectuales', bloque: 12, nivel: 'B2',
    descripcion: 'El participio pasivo presente sólo de imperfectivos transitivos; el pasivo pasado sólo de perfectivos. La restricción es aspectual y no léxica.',
    prereqs: ['u12-participios-reconocimiento'], clase: 'paradigma', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'derivacion', dadas: ['aspecto', 'conjugacion'] },
    gratis: 'nada de las restricciones: ni el español ni el portugués condicionan la formación del participio al aspecto, porque no tienen aspecto morfológico.',
    motivo: 'deriva por regla y el gate lo recalcula. §0.6: el ítem de sobreaplicación es un perfectivo al que se le pide participio pasivo PRESENTE, que no existe',
    cubre: ['B2/PRODUCCIÓN ESCRITA #1'],
    cita: 'formación completa de participios activos y pasivos, presente y pasado, con sus restricciones aspectuales' }),

  P({ id: 'u12-gerundios', nombre: 'Gerundios читая / прочитав y la restricción de sujeto compartido', bloque: 12, nivel: 'B2',
    descripcion: 'El gerundio ruso EXIGE que su sujeto sea el de la principal. El español no lo exige y el alumno produce gerundios colgados que en ruso son agramaticales.',
    prereqs: ['u12-participios-produccion'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'derivacion', dadas: ['aspecto', 'conjugacion'] },
    gratis: 'la forma y la función, de las dos lenguas: «leyendo», «lendo» + el perfectivo «habiendo leído». Lo que NO transfiere es la restricción de sujeto, y es el mejor error diana del bloque porque el español lo permite y lo estigmatiza a la vez (el «gerundio de posterioridad» que las gramáticas condenan y todo el mundo usa).',
    motivo: 'corrección con error diana atestado: el gerundio colgado es agramatical en ruso con cita normativa. Y el ítem tiene que dar la forma del gerundio ya hecha, o mide u12-participios-produccion',
    cubre: ['B2/PRODUCCIÓN ESCRITA #1'],
    cita: 'gerundios imperfectivo (-я) y perfectivo (-в/-вши) con la restricción de sujeto compartido' }),

  P({ id: 'u12-pasiva-sya-vs-participio', nombre: 'дом строится frente a дом построен', bloque: 12, nivel: 'B2',
    descripcion: 'La pasiva con -ся es imperfectiva; el participio pasivo corto, perfectiva. La elección la decide el aspecto, no el estilo.',
    prereqs: ['u12-participios-produccion', 'u7-reflexivo-sya'], clase: 'trampa', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'aspecto', dadas: ['derivacion', 'conjugacion'] },
    gratis: 'LAS DOS CONSTRUCCIONES, y de las dos lenguas: «la casa se construye» / «la casa está construida», «a casa constrói-se» / «a casa está construída». El alumno tiene las dos formas y el reparto casi correcto. Lo que no tiene es que el reparto lo decida el ASPECTO y no ser/estar.',
    motivo: 'el punto se acota a los casos donde ser/estar da la respuesta equivocada. Si el lote reparte proceso/resultado, mide español',
    pisoDeclarado: { piso: 4, motivo: 'cuatro casillas donde el atajo ser/estar falla. Es el mismo dictamen que u6-adjetivo-corto y por la misma razón' },
    cubre: ['B2/GRAMÁTICA'],
    cita: 'elige entre pasiva con -ся y participio pasivo corto (дом строится / дом построен)' }),

  P({ id: 'u12-nominalizacion', nombre: 'Nominalización como marca de registro escrito', bloque: 12, nivel: 'B2',
    descripcion: 'строительство дома en vez de то, что строят дом. No es una opción de estilo: es lo que distingue el ruso escrito del hablado.',
    prereqs: ['u13-sufijos-nominales'], clase: 'pragmatico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'transparente' },
    capas: { examina: 'registro', dadas: ['derivacion', 'caso'] },
    gratis: 'la nominalización en sí y su valor de registro, de las dos lenguas: «la construcción del edificio» es prosa administrativa en español igual que en ruso, y el portugués administrativo aún más. El estrato internacional además regala los sufijos (-ция/-ción, -ство/-dad). Es transferencia alta y hay que declararla.',
    motivo: 'mediación de registro: reescribir subiendo o bajando. El punto NO mide que exista la nominalización sino qué sufijo toma cada verbo, y eso es u13',
    cubre: ['B2/PRODUCCIÓN ESCRITA #2'],
    cita: 'nominalización (строительство дома вместо того, что строят дом) como marca de registro escrito' }),

  // ── u13 · Derivación y léxico ──────────────────────────────────────
  P({ id: 'u13-prefijos-verbales', nombre: 'Los prefijos verbales con su semántica: по-, за-, пере-, раз-, вы-, до-', bloque: 13, nivel: 'B1',
    descripcion: 'по- incoativo/atenuativo, за- incoativo, пере- iterativo/excesivo, раз- distributivo, вы- extractivo, до- terminativo. Es la palanca que lleva de 2.300 a 5.000 lemas sin memorizar 2.700 palabras.',
    prereqs: ['u8-formacion-pares'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'transparente' },
    capas: { examina: 'derivacion', dadas: ['aspecto', 'lexico'] },
    gratis: 'BASTANTE, por vía latina y de las dos lenguas: пере-/trans-, вы-/ex-, раз-/dis-, до-/ad-. Un alumno que sepa qué hace «dis-» en «dispersar» tiene раз- casi hecho. Lo que no transfiere son по- y за-, que no tienen correlato latino claro y son los dos más frecuentes.',
    motivo: 'el lote se acota a по- y за-, que es donde no hay transferencia. Un lote que reparta los seis prefijos mediría latín en cuatro de seis',
    cubre: ['B1/COMPRENSIÓN LECTORA #2'],
    cita: 'los prefijos verbales con su semántica (по- incoativo/atenuativo, за- incoativo, пере- iterativo/excesivo, раз- distributivo, вы- extractivo, до- terminativo' }),

  P({ id: 'u13-sufijos-nominales', nombre: 'Sufijos nominales productivos: -тель, -ник, -ость, -ство, -ение, -ация, -ка', bloque: 13, nivel: 'B1',
    descripcion: 'El que hace, el lugar, la cualidad, la acción. Con su género predecible desde el sufijo.',
    prereqs: ['u3-genero-por-terminacion'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'transparente' },
    capas: { examina: 'derivacion', dadas: ['genero', 'lexico'] },
    gratis: 'el sistema entero y buena parte de los sufijos concretos: -тель/-dor, -ость/-dad, -ство/-ismo·-azgo, -ация/-ación, -ение/-miento. El alumno de portugués C2 tiene además -dade, -mento, -agem productivos. Es transferencia MUY alta y declararla como dificultad sería falsear el termómetro.',
    motivo: 'el punto se acota a lo que el sufijo predice y el español no: el GÉNERO, que es información gramatical gratis para quien conozca el sufijo y que ningún punto de u3 enseña. ⚠ Y LA REGLA VA CON SU CONDICIÓN, que la v0 no tenía: -ость femenino y -ение neutro son sin excepción, pero «-тель masculino» SÓLO vale para el AGENTIVO DEVERBAL. Medido: метель 88 y постель 591 son femeninos en -тель y de alta frecuencia (y капель, шинель). O sea que el ítem de sobreaplicación del §0.6 estaba servido y sin declarar: es un -тель no agentivo, donde la regla que el propio punto acaba de enseñar da la respuesta contraria',
    varianza: 'si el lote pide «forma el nombre desde el verbo», la operación es una y lo que varía es el lema. El lote pide el GÉNERO de un derivado no visto, que es la casilla con contenido',
    cubre: ['B2/LÉXICO'],
    cita: 'los sufijos nominales productivos (-тель, -ник, -ость, -ство, -ение, -ация, -ка)' }),

  P({ id: 'u13-familias-derivativas', nombre: 'Familias completas: учить → учитель, учебник, учёба, изучать, переучиться', bloque: 13, nivel: 'B2',
    descripcion: 'Derivar la familia entera y usar cada miembro con su régimen correcto.',
    prereqs: ['u13-prefijos-verbales', 'u13-sufijos-nominales', 'u10-reccion-adjetival-nominal'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'transparente' },
    capas: { examina: 'derivacion', dadas: ['lexico', 'caso'] },
    gratis: 'el mecanismo derivativo, de las dos lenguas y con fuerza (enseñar→enseñante, enseñanza, enseñado; ensinar→ensino, ensinamento). Lo que no es gratis, y es lo que el punto mide, es que cada miembro tenga RÉGIMEN PROPIO (учить кого чему frente a изучать что), que es donde el alumno derivará bien la palabra y la usará mal — y ahí ni el español ni el portugués le dan nada, porque su régimen no es el ruso.',
    motivo: 'la cara derivativa transfiere; la cara de régimen no. El punto es la segunda, y por eso su prereq es u10',
    cubre: ['B2/LÉXICO'],
    cita: 'deriva activamente familias completas (учить → учитель, учебник, учёба, изучать, выучить, переучиться, обучение) y usa cada miembro con el régimen correcto' }),

  P({ id: 'u13-alternancias-raiz', nombre: 'Alternancias de raíz: бер-/бир-, ход-/хожд-, мог-/мож-', bloque: 13, nivel: 'B2',
    descripcion: 'La raíz cambia de forma dentro de la familia, y sin saberlo la familia parece un montón de palabras sueltas.',
    prereqs: ['u13-familias-derivativas'], clase: 'paradigma', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'derivacion', dadas: ['lexico'] },
    gratis: 'el fenómeno, de las dos lenguas: «poder/puedo/pude/podré», «caber/quepo», «poder/posso/pude». El alumno sabe que la raíz alterna. Lo que no trae es el reparto ruso, y no hay regla que se lo dé.',
    motivo: 'deriva por regla con el reparto guardado por familia; el gate lo recalcula',
    cubre: [], sinDescriptor: 'DERIVACIÓN de B2; sin descriptor',
    cita: 'alternancias de raíz (бер-/бир-, ход-/хожд-, мог-/мож-)' }),

  P({ id: 'u13-dobletes-eslavo-eclesiasticos', nombre: 'Полногласие / неполногласие: город/град, голова/глава, берег/брег', bloque: 13, nivel: 'C2',
    descripcion: 'La llave de una porción enorme del léxico abstracto: convierte cientos de «palabras nuevas» en variantes de registro de palabras conocidas.',
    prereqs: ['u13-alternancias-raiz'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'derivacion', dadas: ['registro', 'lexico'] },
    gratis: 'EL MECANISMO ENTERO, y es una transferencia que nadie habría contado: el español tiene sus propios dobletes culto/patrimonial por la misma razón histórica (ojo/óculo, llama/flama, hoja/folio, llave/clave) y el portugués igual (cheio/pleno, chave/clave). El alumno ya sabe que la forma culta y la popular son la misma palabra por dos caminos, y que la culta marca registro elevado. Es exactamente la relación город/град.',
    motivo: 'el punto NO puede enseñar que el doblete exista: eso lo trae hecho. Mide el REPARTO —cuál de los dos es el neutro hoy— que en ruso no coincide con la intuición romance: город es el neutro y град el marcado, pero страна (forma «culta») es el neutro y сторона tiene otro significado. El ítem es de elección de registro, no de reconocimiento',
    cubre: ['C2/COMPRENSIÓN LECTORA #3'],
    cita: 'reconoce los dobletes eslavo-eclesiásticos (город/град, голова/глава, молодой/младой, берег/брег)' }),

  P({ id: 'u13-arcaismos-realia', nombre: 'Arcaísmos, historicismos y realia: аршин, барин, коммуналка, оттепель', bloque: 13, nivel: 'C2',
    descripcion: 'Sin esto un texto del XIX o del XX es opaco aunque se conozcan todas las palabras. Y va con la biblioteca, que ya está.',
    prereqs: ['u13-dobletes-eslavo-eclesiasticos'], clase: 'lexico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'opaco' },
    capas: { examina: 'lexico', dadas: ['registro'] },
    gratis: 'nada del contenido, y el hábito de leer con realia ajena sí: un lector de literatura hispanoamericana del XIX ya sabe que hay palabras que sólo existen en ese mundo. Es metodología, no léxico.',
    motivo: 'flashcard con glosa cultural, anclada a las lecturas donde aparece. Es el punto con mejor relación coste/valor del inventario, porque el corpus ya está ingerido: 2.180 lecturas del canon',
    cubre: ['C2/COMPRENSIÓN LECTORA #1'],
    cita: 'arcaísmos y historicismos (аршин, барин, губерния, ямщик)' }),

  P({ id: 'u13-realia-b1', nombre: 'Realia imprescindible de B1: прописка, дача, отчество, 9 мая', bloque: 13, nivel: 'B1',
    descripcion: 'Sin esto, un texto de nivel B1 es opaco aunque se conozcan todas las palabras. Es la mitad cultural del muro.',
    prereqs: [], clase: 'lexico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'opaco' },
    capas: { examina: 'lexico', dadas: [] },
    gratis: 'nada del contenido, y ninguna de las dos lenguas del alumno aporta aquí. Lo único que trae es el hábito metodológico: un lector de literatura hispanoamericana del XIX ya sabe que hay palabras que sólo existen en ese mundo y que el diccionario no basta. Eso acelera el aprendizaje, no lo sustituye.',
    motivo: 'flashcard con glosa cultural. ⚠ Y LA POLÍTICA EDITORIAL QUE HAY QUE FIJAR ANTES: el currículo avisa de que el contenido cultural ruso envejece y es polémico. Un punto que enseñe realia contemporánea necesita decidido de antemano qué fuentes y qué periodo, y qué se etiqueta como histórico',
    abierto: 'la política editorial de C1-C2 no está fijada, y este punto es donde empieza a morder',
    cubre: [], sinDescriptor: 'PRAGMÁTICA de B1 lo declara; sin descriptor',
    cita: 'realia imprescindible para entender una conversación adulta (система образования, прописка/регистрация, дача, отчество, 8 марта, 9 мая, Новый год)' }),

  // ── u14 · Pragmática, registro y partículas ────────────────────────
  P({ id: 'u14-ty-vy', nombre: 'ты / вы como regla operativa, no descriptiva', bloque: 14, nivel: 'A1',
    descripcion: 'Con desconocido, mayor o en contexto de servicio: вы, siempre. El paso a ты se negocia, no se supone.',
    prereqs: [], clase: 'pragmatico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'registro', dadas: ['conjugacion'] },
    gratis: 'EL SISTEMA ENTERO, y del PORTUGUÉS más que del español. El español de México tiene tú/usted con un reparto más estrecho que el ruso; el portugués europeo tiene tu/você/o senhor y la negociación explícita del tratamiento, que es exactamente «Давайте на ты». Un C2 de portugués europeo llega con este punto hecho y con una sensibilidad MAYOR que la que el ruso pide.',
    motivo: 'mediación de registro. Y con el dictamen escrito: lo único no-gratis es que el ruso NO tiene una tercera forma (no hay o senhor), o sea que el alumno de portugués tiene una distinción DE MÁS y su error será usar el patronímico como si fuera «o senhor»',
    pisoDeclarado: { piso: 2, motivo: 'contado: dos casillas, y ninguna es la elección ты/вы. Una, que вы cubra lo que el portugués reparte en dos; otra, el patronímico, que no es una forma de tratamiento sino un nombre' },
    cubre: [], sinDescriptor: 'PRAGMÁTICA de A1; el descriptor que lo nombra es de INTERACCIÓN y está excluido',
    cita: 'ты/вы — regla operativa explícita, no descriptiva' }),

  P({ id: 'u14-nombres-patronimico', nombre: 'Ф.И.О., patronímico y los diminutivos que desconciertan', bloque: 14, nivel: 'A1',
    descripcion: 'Александр→Саша→Сашенька, Мария→Маша, Дмитрий→Дима: un amigo se llama con una palabra que no se parece a su nombre.',
    prereqs: ['u14-ty-vy'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'lexico', dadas: ['registro'] },
    gratis: 'el hipocorístico irregular, de las dos lenguas y con fuerza: Francisco→Paco, José→Pepe, Guadalupe→Lupita; Francisco→Chico, José→Zé. El alumno NO se desconcierta de que el diminutivo no se parezca al nombre: su propia lengua hace exactamente eso. El currículo dice «desconciertan al hispanohablante» y eso es falso para este alumno; queda corregido aquí.',
    motivo: 'flashcard de correspondencia. El punto vale por el PATRONÍMICO, que no tiene análogo ninguno, y no por los diminutivos, que son transferencia',
    pisoDeclarado: { piso: 3, motivo: 'el patronímico (formación -ович/-овна desde el nombre del padre) es lo único sin análogo: tres casillas (masculino, femenino, y el uso con вы). Los diminutivos son transferencia y no se cobran' },
    cubre: [], sinDescriptor: 'PRAGMÁTICA de A1; el descriptor que lo nombra es de INTERACCIÓN y está excluido',
    cita: 'los diminutivos que desconciertan al hispanohablante (Александр→Саша→Сашенька, Мария→Маша, Дмитрий→Дима)' }),

  P({ id: 'u14-peticion-directa', nombre: 'La petición rusa directa no es grosera, y la atenuación mexicana suena servil', bloque: 14, nivel: 'A2',
    descripcion: 'Дай / Дайте / Не могли бы вы / Будьте добры, graduados por fuerza. Y la nota de contraste cultural de primer orden.',
    prereqs: ['u14-ty-vy', 'u8-imperativo-aspecto'], clase: 'pragmatico', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'registro', dadas: ['conjugacion', 'aspecto'] },
    gratis: 'la ESCALA de fuerza sí, de las dos lenguas. Lo que no transfiere es dónde está el punto neutro, y aquí las dos lenguas del alumno empujan en la MISMA dirección equivocada: el español mexicano y el portugués europeo son los dos extremadamente atenuadores («¿no me haría usted el favor de…?», «será que podia…?»). Este alumno tiene la atenuación DOBLEMENTE reforzada, y es el punto del inventario donde su perfil le perjudica más.',
    motivo: 'mediación de registro: dada una petición mexicana, producir la rusa de fuerza equivalente. El error es de EXCESO de atenuación, o sea visible',
    cubre: [], sinDescriptor: 'PRAGMÁTICA de A2; el descriptor es de INTERACCIÓN y está excluido',
    cita: 'la petición rusa directa no es grosera y la atenuación mexicana traducida literalmente al ruso suena evasiva o servil' }),

  P({ id: 'u14-particulas', nombre: 'же, ведь, -то, вот, ну: el trabajo que el español hace con entonación', bloque: 14, nivel: 'C1',
    descripcion: 'Prácticamente intraducibles: la partícula rusa hace lo que el español hace con entonación, orden y perífrasis. Contenido C1-definitorio.',
    prereqs: ['u11-orden-tema-rema'], clase: 'pragmatico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'registro', dadas: ['orden', 'lexico'] },
    gratis: 'menos de lo que el currículo concede y más de cero. El español mexicano tiene partículas discursivas propias (pues, pues sí, ¿no?, órale, ya, si es que) y el portugués tiene «lá», «cá», «é que», «pois». O sea que el alumno SÍ tiene el concepto de una palabrita que no significa nada y cambia todo — el currículo dice «prácticamente intraducible al español» y eso es cierto palabra a palabra y falso como mecanismo. Lo que no trae es el mapa.',
    motivo: 'requiere corpus con contexto, no listas, y el currículo lo dice. El corpus está: 7,7 M de palabras. Elección con contexto largo, y con la trampa declarada: si el contexto es largo, el ítem puede contestarse leyendo',
    abierto: 'antes de escribir, medir en el corpus la frecuencia de cada partícula y los contextos donde sólo una encaja. Sin eso el punto es una lista de glosas',
    cubre: [], sinDescriptor: 'PARTÍCULAS de C1; el descriptor que las nombra es de PRODUCCIÓN ORAL y está excluido',
    cita: 'el sistema completo (же, ведь, -то, вот, ну, разве, неужели, ли, бы, уж, лишь, ведь, мол, дескать, якобы) con su valor pragmático' }),

  P({ id: 'u14-registro-oficial', nombre: 'Официально-деловой: в связи с + instr, согласно + dat, прошу вас + inf', bloque: 14, nivel: 'B2',
    descripcion: 'El канцелярит, que un B2 tiene que poder leer sin ayuda porque es el ruso de cualquier documento.',
    prereqs: ['u10-reccion-verbal', 'u12-nominalizacion'], clase: 'pragmatico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'transparente' },
    capas: { examina: 'registro', dadas: ['caso', 'declinacion', 'lexico'] },
    gratis: 'el REGISTRO administrativo entero, y el portugués paga la mayor parte: «venho por este meio solicitar», «nos termos do disposto» es exactamente el канцелярит, con la misma nominalización y la misma distancia. Un C2 de portugués reconoce el género sin que se lo expliquen.',
    motivo: 'mediación de registro. El punto mide las FÓRMULAS concretas y su régimen (согласно pide dativo, que es contraintuitivo incluso para un ruso), no el registro, que transfiere',
    cubre: ['B2/PRODUCCIÓN ESCRITA #2'],
    cita: 'escribe un correo oficial y un informe breve en registro официально-деловой (в связи с + instr, согласно + dat, в целях + gen, прошу вас + inf)' }),

  P({ id: 'u14-cinco-estilos', nombre: 'Los cinco estilos funcionales como sistema', bloque: 14, nivel: 'B2',
    descripcion: 'научный, официально-деловой, публицистический, художественный, разговорный, con sus marcas léxicas y sintácticas.',
    prereqs: ['u14-registro-oficial'], clase: 'pragmatico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'registro', dadas: ['lexico'] },
    gratis: 'la existencia de registros y la capacidad de identificarlos, de las dos lenguas. Lo que no transfiere es que el ruso los tenga CODIFICADOS como cinco categorías escolares con nombre, y que un ruso culto los nombre igual que se nombran los tiempos verbales.',
    motivo: 'clasificación y conmutación; el corpus de la biblioteca da художественный de sobra y nada de los otros cuatro. Eso es un hueco de material, no de diseño',
    abierto: 'el corpus de 2.180 lecturas es literatura del XIX: cubre художественный y nada más. Los otros cuatro estilos necesitan material que no existe, y prometer cobertura aquí sería contar como cubierto lo que no lo está',
    cubre: ['B2/COMPRENSIÓN ORAL #2'],
    cita: 'los cinco estilos funcionales rusos presentados como sistema — научный, официально-деловой, публицистический, художественный, разговорный' }),

  P({ id: 'u14-mat', nombre: 'El мат: comprensión con advertencia, nunca producción', bloque: 14, nivel: 'C1',
    descripcion: 'Su estatus, su gramática y por qué NO hay que producirlo. Tratado como contenido de comprensión con advertencia explícita en la interfaz.',
    prereqs: ['u14-cinco-estilos'], clase: 'pragmatico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'registro', dadas: ['lexico', 'derivacion'] },
    gratis: 'nada del contenido, y el riesgo social sí transfiere: el alumno sabe que hay palabras que queman. Lo que no sabe es que el мат quema MUCHO más que su equivalente mexicano.',
    motivo: 'flashcard receptiva con campo de advertencia que la interfaz pinta SIEMPRE antes de la glosa. La lección es el caso «bicha» del portugués: una palabra con carga social servida con glosa neutra y el aviso guardado en una clave del manifest, invisible para la app',
    abierto: 'el campo de advertencia no existe en el modelo. Sin él este punto NO se produce: sería repetir un daño ya documentado',
    cubre: [], sinDescriptor: 'VARIEDAD Y NO ESTÁNDAR de C1; sin descriptor',
    cita: 'conciencia del мат — su estatus, su gramática y por qué NO hay que producirlo' }),

  // ── u15 · Estilo, puntuación y lengua literaria ────────────────────
  P({ id: 'u15-puntuacion-obosoblenie', nombre: 'La coma rusa es una regla dura, no una pausa', bloque: 15, nivel: 'B2',
    descripcion: 'Обособление: subordinadas, aposiciones, incisos, participios y gerundios se separan por regla. Y NO coincide con el español.',
    prereqs: ['u12-gerundios', 'u11-kotoryj'], clase: 'ortografico', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'puntuacion', dadas: ['derivacion', 'caso'] },
    gratis: 'nada, y las dos lenguas estorban igual: el español y el portugués puntúan por PAUSA y por criterio del autor, con la coma ante subordinada como opción. El ruso la exige. El alumno no omitirá la coma por ignorancia sino por convicción, que es más difícil de corregir.',
    motivo: 'corrección con error diana atestado y regla citable (Правила 1956; Лопатин 2006). Y es de los pocos puntos donde el error del alumno es una OMISIÓN que sí deja rastro escrito y sí cabe en corrección: la frase sin coma es visible',
    cubre: ['C1/PRODUCCIÓN ESCRITA #1'],
    cita: 'обособление y la puntuación asociada — las comas rusas son reglas duras, no pausas, y NO coinciden con las españolas' }),

  P({ id: 'u15-guion-largo', nombre: 'El guion largo por cópula omitida: Москва — столица России', bloque: 15, nivel: 'B2',
    descripcion: 'Donde el presente no lleva cópula, el registro escrito pone raya. Es la contrapartida gráfica de u7-sin-copula.',
    prereqs: ['u7-sin-copula', 'u15-puntuacion-obosoblenie'], clase: 'ortografico', calco: { castellano: 'mal', portugues: 'mal', internacional: 'no-aplica' },
    capas: { examina: 'puntuacion', dadas: ['registro'] },
    gratis: 'nada: ninguna de las dos lenguas omite la cópula, así que no tienen nada que marcar.',
    motivo: 'cloze del signo, con la condición de que el ítem NO sea el de u7-sin-copula con otra piel: aquí la cópula ya está ausente en el estímulo y lo que se pide es la raya',
    pisoDeclarado: { piso: 4, motivo: 'CUATRO: tres configuraciones (nombre—nombre, numeral—numeral, infinitivo—infinitivo) más la frontera negativa, que NO va con pronombre sujeto (Он студент). La v0 escribía «piso: 3» y su propio motivo terminaba diciendo «cuatro casillas»: un piso a la baja con dictamen escrito es un buen resultado, uno que contradice a su propio dictamen es un número sin respaldo. Cazado por el lingüista adversarial el 2026-09-11 leyendo el motivo hasta el final' },
    cubre: ['C1/PRODUCCIÓN ESCRITA #1'],
    cita: 'guion largo por cópula omitida' }),

  P({ id: 'u15-metrica-poetica', nombre: 'Los metros silabotónicos y el acento con función métrica', bloque: 15, nivel: 'C2',
    descripcion: 'ямб, хорей, дактиль, амфибрахий, анапест. Es la prueba final del dominio del acento: quien no lo tenga interiorizado no puede leer un verso ruso.',
    prereqs: ['u2-acento-movil'], clase: 'fonologico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'acento', dadas: ['lexico'] },
    gratis: 'EL SISTEMA MÉTRICO, y más de lo que parece: el español y el portugués tienen verso acentual (el endecasílabo con sus acentos obligatorios en 6.ª o en 4.ª y 8.ª) y el alumno culto ha escandido en la escuela. Lo que no transfiere es que el metro ruso sea de PIES regulares —sílaba tónica cada dos o cada tres— frente al conteo silábico romance, que cuenta sílabas y fija sólo algunos acentos.',
    pisoCero: 'la respuesta es una POSICIÓN de acento dentro del verso: mismo bloqueo de formato que u2-acento-fonemico y u2-acento-movil, y por la misma razón. Tres puntos comparten el mismo bloqueo y los tres lo declaran por separado en vez de disolverlo, porque la deuda es de tres puntos y no de uno',
    motivo: 'requiere el formato `posicion`, que no existe. Y requiere corpus poético anotado métricamente, que tampoco',
    cubre: ['C2/COMPRENSIÓN LECTORA #2'],
    cita: 'los metros silabotónicos rusos (ямб, хорей, дактиль, амфибрахий, анапест)' }),

  P({ id: 'u15-ironia-subtexto', nombre: 'Ironía, subtexto y alusión sobre corpus etiquetado', bloque: 15, nivel: 'C2',
    descripcion: 'Textos donde el sentido literal y el comunicado difieren, con la marca que lo señala anotada. Es el contenido definitorio de C2.',
    prereqs: ['u14-particulas', 'u13-arcaismos-realia'], clase: 'pragmatico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'registro', dadas: ['lexico', 'orden'] },
    gratis: 'la capacidad de leer ironía, entera y de las dos lenguas: un lector culto de español y portugués detecta el sarcasmo sin que nadie se lo enseñe. Lo que no transfiere son las MARCAS rusas concretas (las partículas разве/неужели, el diminutivo peyorativo, el orden marcado), y eso es lo único que el punto puede medir.',
    motivo: 'requiere corpus ETIQUETADO, y el etiquetado es trabajo humano especializado que no escala con presupuesto de tokens — el currículo lo declara. El corpus en bruto está (2.180 lecturas del canon); la capa didáctica no',
    abierto: 'sin corpus etiquetado no hay ítems. Y la tentación aquí es generar la anotación con un LLM, que es exactamente lo que el currículo prohíbe para C1-C2',
    cubre: ['C2/COMPRENSIÓN LECTORA #1'],
    cita: 'textos donde el sentido literal y el sentido comunicado difieren, con la marca que lo señala anotada' }),

  P({ id: 'u15-diminutivos-expresivos', nombre: 'Los diminutivos como actitud: супчик, домик, книжонка, ручища', bloque: 15, nivel: 'C1',
    descripcion: 'Cada sufijo lleva una actitud, no un tamaño. Y los peyorativos y aumentativos con su carga.',
    prereqs: ['u13-sufijos-nominales'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'bien', internacional: 'no-aplica' },
    capas: { examina: 'derivacion', dadas: ['registro', 'genero'] },
    gratis: 'LA FUNCIÓN ENTERA, y es el caso que el rumano ya pagó: el español mexicano tiene «cafecito», «ahorita», «un ratito», «casita» con exactamente la misma jugada pragmática, y el portugués tiene -inho/-zinho productivísimo y -ão aumentativo. Este alumno tiene DOS sistemas diminutivos pragmáticos vivos. Declarar la función atenuadora como contenido sería certificar español.',
    motivo: 'la lección de r10-diminutivo-atenuador rumano, aplicada ANTES y no después de publicar ocho ítems: lo que diverge es la ELECCIÓN DEL SUFIJO, que no se predice desde el lema (суп→супчик pero дом→домик y книга→книжонка con cambio de raíz), no la función. Cloze derivado con el lema dado y la forma exigida, no mediación de registro',
    cubre: [], sinDescriptor: 'MORFOLOGÍA EXPRESIVA de C1; sin descriptor',
    cita: 'los diminutivos y aumentativos como herramienta pragmática, no como \'cosa pequeña\' (супчик, домик, Машенька, книжонка, ручища)' }),

  P({ id: 'u15-fraseologia-alusion', nombre: 'Фразеологизмы y крылатые выражения, incluido el cine soviético', bloque: 15, nivel: 'C1',
    descripcion: 'Los rusos citan películas en la conversación corriente y sin ese repertorio se pierde la mitad del subtexto.',
    prereqs: ['u13-realia-b1'], clase: 'lexico', calco: { castellano: 'bien', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'lexico', dadas: ['registro'] },
    gratis: 'el MECANISMO, y de las dos lenguas — del español mexicano muy en concreto: citar cine y televisión en la conversación («¿Y ahora quién podrá defenderme?», Cantinflas, los refranes truncados) es una práctica idéntica, y el portugués tiene su propio repertorio de provérbios truncados. El alumno sabe cómo funciona un texto precedente. Lo que no tiene es el repertorio, y eso no se enseña con una lista.',
    motivo: 'flashcard con contexto de uso, anclada a la fuente. El corpus de la biblioteca da Griboyédov, Krylov y Pushkin —las tres fuentes clásicas— y nada del cine soviético, que es la mitad viva',
    abierto: 'las крылатые выражения del cine soviético no están en el corpus y no se pueden inventar. Requiere corpus de guiones, que el currículo pide y no existe',
    cubre: ['C1/COMPRENSIÓN LECTORA #2'],
    cita: 'крылатые выражения de Griboyedov, Krylov, Pushkin y del cine soviético y postsoviético' }),

  P({ id: 'u15-edicion-de-texto', nombre: 'Editar un texto de un nativo y distinguir error de opción de estilo', bloque: 15, nivel: 'C2',
    descripcion: 'Corregir justificando cada cambio con la norma, y no «corregir» lo que es una elección.',
    prereqs: ['u15-puntuacion-obosoblenie', 'u14-cinco-estilos'], clase: 'pragmatico', calco: { castellano: 'no-aplica', portugues: 'no-aplica', internacional: 'no-aplica' },
    capas: { examina: 'registro', dadas: ['grafia', 'lexico'] },
    gratis: 'nada del ruso. Y el criterio metodológico —distinguir error de opción— es exactamente la regla §0 de este proyecto, así que quien lo escriba ya la tiene interiorizada. Conviene decirlo porque el punto se puede diseñar mal con mucha facilidad: un ítem que marque como error una opción de estilo es el asterisco propio, en su versión más cara',
    motivo: 'tarea con rúbrica evaluada por nativo; el currículo dice expresamente que ningún LLM puede juzgarlo de forma fiable',
    pisoCero: 'el criterio de aprobación exige un editor profesional humano («≥80 % de coincidencia con la corrección de un editor profesional»). Ningún formato de la app lo expresa, y presentar un veredicto automático como si lo fuera sería el falso verde que el propio currículo denuncia',
    cubre: ['C2/PRODUCCIÓN ESCRITA #2'],
    cita: 'edita y corrige un texto escrito por un nativo, justificando cada cambio con la norma' }),
];

/** Los puntos como `Concept` del contrato común, para `ALL_CONCEPTS`. */
export const CONCEPTOS_RU: Concept[] = PUNTOS_RU.map((p) => ({
  id: p.id, name: p.nombre, blockId: p.bloque, description: p.descripcion, prereqs: p.prereqs,
}));
