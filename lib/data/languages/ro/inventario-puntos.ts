// lib/data/languages/ro/inventario-puntos.ts
//
// EL INVENTARIO DE PUNTOS DEL RUMANO — paso 1 de la fase F (E2#30).
//
// Es la pieza de la que cuelga todo lo demás: sin puntos no hay cobertura,
// y sin cobertura el «7.100 ejercicios» del currículo es una cota, no un
// plan. Cada punto nace con TRES cosas que en portugués llegaron tarde y
// costaron sesiones:
//
//   1. Su FORMATO, asignado al declararlo y no después (en PT el mapa
//      formato↔punto llegó en E2#17 y reclasificó 222 unidades).
//   2. La PRUEBA DEL CALCO, en DOS columnas:
//      · `castellano`: ¿el ERROR DIANA del punto, traducido palabra por
//        palabra, da español bien formado? Si sí, el ítem debe PRODUCIR
//        (corrección o derivación), nunca juzgar: la glosa contendría la
//        respuesta. La primera versión de este fichero ponía la casilla
//        MECÁNICAMENTE desde la clase y el lingüista lo cazó en 17 puntos:
//        «*Văd pe Ion» → «veo a Ion» es español perfecto, y decía «mal».
//        Ahora la casilla se contesta mirando el error, y la clase se
//        deriva de ella, no al revés. Con el rumano casi siempre es
//        «bien»: el español no tiene la morfología y el calco desnudo
//        suena impecable. Por eso `coincide` es rarísimo aquí.
//      · `latinComun`: ¿la raíz común deja acertar sin saber rumano?
//        `casă` se reconoce y el genitivo `casei` no; `a cânta` da `cânt`
//        por instinto, pero `a lucra` da `*lucr` donde va `lucrez`. Un
//        punto `transparente` mide reconocimiento si el ítem no obliga a
//        producir la forma que diverge; uno `engañoso` es el mejor
//        material de corrección: el calco es lo que el instinto produce.
//   3. La CITA del currículo de la que sale (`cita`: un fragmento textual
//      de §Rumano que un test comprueba que existe) y los DESCRIPTORES
//      que cubre (`cubre`). La primera versión llevaba un número de línea
//      y 85 de 103 apuntaban a otra cosa; un sello que no se comprueba no
//      responde a ninguna pregunta.
//
// LO QUE ESTE INVENTARIO CUBRE, DICHO: los descriptores de SISTEMA del
// currículo (gramática, léxico, fonología, pragmática, cultura). Los de
// lectura, escucha, escritura y mediación no se enseñan por puntos: los
// cubren la biblioteca (817 lecturas), la máquina de mediación (cuando
// haya lecturas de las que partir), las tareas con rúbrica, y la escucha
// —que en PT quedó fuera de alcance por falta de voz validada y aquí
// tiene la misma condición—. Están enumerados con su motivo en
// `DESCRIPTORES_FUERA_DEL_INVENTARIO`, y el test exige que TODO
// descriptor en alcance esté o cubierto o declarado ahí. En PT, 32
// unidades de escucha se quedaron fuera sin que nadie lo dijera.
//
// El JUICIO BINARIO no se asigna por defecto a nada: murió en PT (E2#20)
// por una causa estructural —la glosa siempre contiene la respuesta— y
// con el latín común es aún más probable que muera. Sólo entra con un
// motivo escrito que empiece por «MEDIDO».
//
// CONVENCIÓN: el asterisco `*` marca SÓLO formas agramaticales. Una forma
// citada como grafía antigua o rechazada por la norma va entre «».
//
// Los ids llevan prefijo `r<bloque>-`, no `b<bloque>-`: son de OTRA lengua
// y ninguna herramienta de PT debe casarlos por accidente. El nivel se
// declara EN el punto; los comentarios de sección no dicen nivel, porque
// la primera versión los puso y mentían en cinco de doce bloques.
//
// Revisado por el lingüista adversarial (agente, sin oído nativo ni red)
// el 2026-09-01: 21 errores, 20 discutibles, 11 faltas/sobras, aplicados
// aquí. Lo que el propio lingüista pidió comprobar contra fuente viva
// queda marcado en `abierto` y bloquea la producción de ese punto.
import type { Concept } from '@/lib/data/curriculum-types';

export type NivelRo = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

/** Las clases de `scripts/lib/formato-punto.ts` de PT, más dos:
 *  `paradigma` (la respuesta se DERIVA por regla desde el lexicón y el
 *  gate la recalcula: declinación, conjugación) y `ortografico` (una regla
 *  de grafía no pasa por el español: no hay calco que suene bien ni mal). */
export type ClaseRo = 'fonologico' | 'ortografico' | 'trampa' | 'coincide' | 'sin-equivalente' | 'pragmatico' | 'lexico' | 'paradigma';

export type FormatoRo = 'escucha' | 'correccion' | 'cloze-con-pista' | 'transformacion' | 'mediacion' | 'flashcard' | 'juicio';

export const FORMATO_DE_CLASE_RO: Record<ClaseRo, FormatoRo> = {
  fonologico: 'escucha',
  ortografico: 'cloze-con-pista',
  trampa: 'correccion',
  coincide: 'cloze-con-pista',
  'sin-equivalente': 'transformacion',
  pragmatico: 'mediacion',
  lexico: 'flashcard',
  paradigma: 'cloze-con-pista',
};

export interface Calco {
  /** ¿El error diana, calcado palabra por palabra, es español bien formado? */
  castellano: 'bien' | 'mal' | 'no-aplica';
  /** ¿La raíz latina común deja acertar sin saber la morfología? */
  latinComun: 'transparente' | 'opaco' | 'engañoso' | 'no-aplica';
}

export interface PuntoRo {
  id: string;
  nombre: string;
  bloque: number;
  nivel: NivelRo;
  descripcion: string;
  prereqs: string[];
  clase: ClaseRo;
  /** Sólo cuando difiere de `FORMATO_DE_CLASE_RO[clase]`; `motivo` dice por qué. */
  formato?: FormatoRo;
  calco: Calco;
  motivo: string;
  /** Descriptores del currículo que cubre: `<nivel>/<etiqueta>`. Puede ir
   *  vacío SÓLO con `sinDescriptor`: el currículo pide el contenido pero
   *  no tiene descriptor para él, y eso se denuncia, no se tapa. */
  cubre: string[];
  sinDescriptor?: string;
  /** Fragmento TEXTUAL de §Rumano del currículo del que sale el punto. */
  cita: string;
  /** Lo que queda por comprobar contra fuente viva y bloquea la producción. */
  abierto?: string;
}

export function formatoDeRo(p: PuntoRo): FormatoRo {
  return p.formato ?? FORMATO_DE_CLASE_RO[p.clase];
}

export const PISO_RO = (nivel: NivelRo) => (nivel === 'C2' ? 6 : 8);

export const BLOQUES_RO: { id: number; slug: string; nombre: string }[] = [
  { id: 1, slug: 'fonologia-ortografia', nombre: 'Fonología y ortografía' },
  { id: 2, slug: 'sustantivo-i', nombre: 'Sustantivo I: género, neutro, artículo, plural' },
  { id: 3, slug: 'verbo-i', nombre: 'Verbo I: presente, să, negación, imperativo' },
  { id: 4, slug: 'caso-determinacion', nombre: 'Caso y determinación' },
  { id: 5, slug: 'verbo-ii', nombre: 'Verbo II: pasados, futuros, condicional' },
  { id: 6, slug: 'cliticos-pe', nombre: 'Clíticos y «pe»' },
  { id: 7, slug: 'modo-formas-no-personales', nombre: 'Modo y formas no personales' },
  { id: 8, slug: 'sintaxis', nombre: 'Sintaxis y subordinación' },
  { id: 9, slug: 'lexico', nombre: 'Léxico: derivación, falsos amigos, estratos' },
  { id: 10, slug: 'pragmatica-registro', nombre: 'Pragmática y registro' },
  { id: 11, slug: 'morfosintaxis-avanzada', nombre: 'Morfosintaxis avanzada' },
  { id: 12, slug: 'precision-y-estilo', nombre: 'Precisión, estilo y variación' },
];

/** Descriptores EN ALCANCE que este inventario no cubre por puntos, con
 *  el mecanismo que los cubre. El test exige que ningún descriptor quede
 *  ni aquí ni en `cubre`. */
export const DESCRIPTORES_FUERA_DEL_INVENTARIO: Record<string, string> = {
  'A1/COMPRENSIÓN LECTORA': 'biblioteca (817 lecturas) + preguntas de comprensión por texto; no es un punto',
  'A2/COMPRENSIÓN LECTORA': 'biblioteca + preguntas por texto',
  'B1/COMPRENSIÓN LECTORA': 'biblioteca + preguntas por texto',
  'B1/COMPRENSIÓN LECTORA · EXTENSIVA': 'contador de lectura extensiva sobre la biblioteca',
  'B2/COMPRENSIÓN LECTORA': 'biblioteca + preguntas por texto',
  'B2/COMPRENSIÓN LECTORA · EXTENSIVA': 'contador de lectura extensiva',
  'C1/COMPRENSIÓN LECTORA': 'biblioteca + resumen crítico con rúbrica',
  'C1/COMPRENSIÓN LECTORA · EXTENSIVA': 'contador de lectura extensiva',
  'C2/COMPRENSIÓN LECTORA': 'biblioteca + explicación de pasajes con rúbrica',
  'C2/COMPRENSIÓN LECTORA · VOLUMEN': 'contador de lectura extensiva',
  // A1 y B1 de COMPRENSIÓN ORAL los cubren r1-palatalizacion-final y r1-habla-conectada
  // (puntos de escucha: existen, y no se producen hasta que haya voz validada).
  'A2/COMPRENSIÓN ORAL': 'ESCUCHA: bloqueada hasta voz validada',
  'B2/COMPRENSIÓN ORAL': 'ESCUCHA: bloqueada hasta voz validada',
  // PRODUCCIÓN ESCRITA A2-C2: la cubren los puntos de registro y género
  // (r10-*, r12-generos-discursivos, r12-argumentacion-b2) más la tarea con rúbrica.
  'B2/COMPRENSIÓN AUDIOVISUAL': 'fuera de alcance: no hay material audiovisual propio',
  'C1/COMPRENSIÓN ORAL': 'ESCUCHA: bloqueada hasta voz validada',
  'C2/COMPRENSIÓN ORAL': 'ESCUCHA: bloqueada hasta voz validada',
  'A1/PRODUCCIÓN ESCRITA': 'tarea de producción con rúbrica, no punto',
  'A1/MEDIACIÓN · relayo simple': 'máquina de mediación (relay) cuando haya lecturas A1 de las que partir',
  'A2/MEDIACIÓN': 'máquina de mediación (resumen RO→ES, relay ES→RO)',
  'B1/MEDIACIÓN · TEXTO': 'máquina de mediación (resumen RO→RO)',
  'B1/MEDIACIÓN · CONCEPTO': 'máquina de mediación-explicar',
  'B2/MEDIACIÓN · SÍNTESIS': 'máquina de mediación (síntesis multifuente)',
  'C1/MEDIACIÓN · ESPECIALIZADA': 'máquina de mediación (especializado→llano)',
  'C1/MEDIACIÓN · INTERPRETACIÓN': 'fuera de alcance: interpretación consecutiva es producción oral (decisión de Edu, 2026-08-11)',
  'C2/MEDIACIÓN · LITERARIA': 'máquina de mediación (traducción literaria con comentario)',
  'C2/MEDIACIÓN · PLURILINGÜE': 'fuera de alcance: exige interacción turno a turno (decisión de Edu, 2026-08-11)',
};

const P = (p: PuntoRo) => p;

export const PUNTOS_RO: PuntoRo[] = [
  // ── r1 · Fonología y ortografía ────────────────────────────────────
  P({ id: 'r1-vocales-centrales', nombre: '/ə/ y /ɨ/ frente a /a/ e /i/, y entre sí', bloque: 1, nivel: 'A1',
    descripcion: 'Las dos vocales centrales que el español no tiene, en oposición fonológica: masa/masă (a~ə), in/în (i~ɨ), rău/râu (ə~ɨ). Se discrimina oyendo.',
    prereqs: [], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'percepción: no hay forma escrita que juzgar; par mínimo con audio A/B, y sólo con voz validada. El currículo escribe «rau/râu» sin diacrítico en dos sitios: es rău', cubre: ['A1/FONOLOGÍA'],
    cita: 'Discrimina auditivamente /a/ vs /ə/ vs /ɨ/ en 20 pares mínimos' }),
  P({ id: 'r1-palatalizacion-final', nombre: 'La -i final palatal como marca de plural y de 2.ª persona', bloque: 1, nivel: 'A1',
    descripcion: '[pomʲ], [lupʲ], [vezʲ]: la -i no es vocal plena, es un rasgo de la consonante anterior. Excepción que el paradigma necesita: tras obstruyente + líquida la -i SÍ es silábica (membru/membri, codru/codri, socru/socri, aflu/afli). Es el fallo #1 de comprensión oral del hispanohablante porque no la oye.',
    prereqs: ['r1-vocales-centrales'], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'percepción de un rasgo secundario: sólo pares de audio pom/pomi decididos de oído', cubre: ['A1/COMPRENSIÓN ORAL'],
    cita: 'apoyándose SÓLO en la palatalización final (pom/pomi, lup/lupi, elev/elevi, vezi/vede)' }),
  P({ id: 'r1-consonantes-ausentes', nombre: 'ț ș j z v y los dígrafos ce/ci ge/gi che/chi ghe/ghi', bloque: 1, nivel: 'A1',
    descripcion: '/ts/ /ʃ/ /ʒ/ /z/ /v/ que el español no tiene o fusiona (b~v, s~z), y la lectura de los dígrafos: che = /ke/, ce = /tʃe/.',
    prereqs: [], clase: 'ortografico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'la correspondencia grafía↔sonido se examina escribiendo la grafía que se oye o eligiendo la lectura; el español no ayuda ni estorba', cubre: ['A1/FONOLOGÍA'],
    cita: 'Consonantes ausentes del español: /ts/ ț, /ʃ/ ș, /tʃ/ ce·ci, /dʒ/ ge·gi, /ʒ/ j, /z/ z, /v/ v' }),
  P({ id: 'r1-ortografia-a-i', nombre: 'Ortografía: â interior, î inicial y final, sunt', bloque: 1, nivel: 'A1',
    descripcion: 'La regla DOOM3: â en interior de palabra (român, cânt), î al inicio y al final y en inicio de raíz de compuestos (început, neîncetat); «sunt», no la grafía antigua con î (s·î·nt).',
    prereqs: ['r1-vocales-centrales'], clase: 'ortografico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'elección ortográfica con regla cerrada: cloze del grafema; es además la norma que el gate de ortografía exige. La forma antigua se cita SIN escribirla entera para que el propio gate no tumbe el punto que la enseña', cubre: ['A1/FONOLOGÍA'],
    cita: 'regla ortográfica â medial vs î inicial/final' }),
  P({ id: 'r1-diacriticos-coma', nombre: 'ș y ț con coma, nunca con cedilla', bloque: 1, nivel: 'A1',
    descripcion: 'U+0219/U+021B frente a U+015F/U+0163: la web rumana los mezcla y el alumno debe escribir y reconocer la forma normativa.',
    prereqs: [], clase: 'ortografico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'norma del proyecto; se enseña una vez y lo vigila el gate de escritura, no un lote entero', cubre: ['A1/FONOLOGÍA'],
    cita: 'Normalización obligatoria ș/ț con COMA (U+0219/U+021B), nunca con cedilla' }),
  P({ id: 'r1-diptongos', nombre: 'Diptongos ea, oa, ia, ie, io, iu', bloque: 1, nivel: 'A1',
    descripcion: 'seară, poartă, iarnă, ieftin: lectura y escritura de los diptongos que luego alternan en la flexión (ea→e, oa→o).',
    prereqs: [], clase: 'ortografico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'grafía que se lee y se escribe; el punto de la ALTERNANCIA va en r2, aquí sólo la forma base', cubre: ['A1/FONOLOGÍA'],
    cita: 'Diptongos ea, oa, ia, ie, io, iu y su alternancia en la flexión' }),
  P({ id: 'r1-acento-lexico', nombre: 'Acento léxico libre no marcado', bloque: 1, nivel: 'A1',
    descripcion: 'La grafía no dice dónde va el acento y hay pares mínimos: cópii (copias) / copíi (niños), véselă (alegre) / vesélă (vajilla), ácele / acéle. Cada lema entra al SRS con su acento anotado desde A1; en A2 se añade el acento en la flexión.',
    prereqs: [], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el instinto castellano hace llana la palabra (vesélă, «vajilla») donde se quería véselă («alegre»): se examina oyendo el par y eligiendo el sentido', cubre: ['A1/FONOLOGÍA', 'A2/FONOLOGÍA'],
    cita: 'cada lema entra al SRS con su acento anotado; pares mínimos cópii/copíi, véselă/vesélă' }),
  P({ id: 'r1-entonacion-pregunta', nombre: 'Entonación de la pregunta total: el contorno', bloque: 1, nivel: 'A2',
    descripcion: 'Ni el rumano ni el español marcan la pregunta sí/no con partícula: lo que diverge es el CONTORNO. Rumano: pico y caída sobre la última tónica; español: ascenso final sostenido. Sin ese rasgo escrito no hay nada que discriminar.',
    prereqs: [], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'sólo se oye: par afirmación/pregunta con la misma cadena, decidido por el contorno', cubre: ['A2/FONOLOGÍA'],
    cita: 'entonación de pregunta total rumana (que no marca con partícula y depende sólo del tono' }),
  P({ id: 'r1-habla-conectada', nombre: 'Habla conectada: elisión de -u, reducción, sinalefa', bloque: 1, nivel: 'B1',
    descripcion: 'Lo que pasa en tempo rápido: la -u final que cae, la î de apoyo, la sinalefa. Diferencia entre entender un podcast y no.',
    prereqs: ['r1-palatalizacion-final'], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'percepción a velocidad nativa; sólo con audio y sólo con voz validada', cubre: ['B1/COMPRENSIÓN ORAL'],
    cita: 'habla conectada — elisión de la -u final, reducción en tempo rápido, sinalefa' }),
  P({ id: 'r1-variedades', nombre: 'Variedades: moldoveneasca, ardeleneasca, olteneasca', bloque: 1, nivel: 'B1',
    descripcion: 'Palatalización moldava de labiales (ghini < bine, chept < piept, h\'er < fier) y el cierre e→i final (bini), entonación ardeleneasca, perfectul simplu oltenesc. Receptivo. Las formas dialectales las rechaza el Hunspell vendorizado: el punto necesita exención declarada en verify-content.',
    prereqs: ['r1-habla-conectada'], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'reconocimiento de variedad por el oído; exige voces con acento regional validadas, que hoy no hay', cubre: ['B1/COMPRENSIÓN ORAL · VARIEDAD', 'C1/COMPRENSIÓN ORAL · VARIEDAD'],
    cita: 'moldava (palatalización de labiales: bini/bine, chept/piept, ghini/bine)' }),

  // ── r2 · Sustantivo I ──────────────────────────────────────────────
  P({ id: 'r2-genero-tres-valores', nombre: 'Género de tres valores: la prueba un…/două…', bloque: 2, nivel: 'A1',
    descripcion: 'Masculino, femenino y NEUTRO (ambigen): masculino en singular, femenino en plural. Se clasifica un sustantivo nuevo con la prueba un tren / două trenuri.',
    prereqs: [], clase: 'sin-equivalente', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'el español no tiene neutro y el instinto lo colapsa en masculino (tren, scaun, oraș «parecen» masculinos; «dos trenes buenos» es español perfecto); se examina PRODUCIENDO las dos concordancias, singular y plural, a la vez', cubre: ['A1/GRAMÁTICA · GÉNERO'],
    cita: 'Aplica la prueba \'un… / două…\' para clasificar 15 sustantivos NUEVOS' }),
  P({ id: 'r2-articulo-indefinido', nombre: 'un / o / niște', bloque: 2, nivel: 'A1',
    descripcion: 'El indefinido antepuesto, con el plural niște que el español no tiene como artículo.',
    prereqs: ['r2-genero-tres-valores'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'un/o se acierta por instinto: el ítem obliga a decidir el género (o casă, un tren) y el plural niște, donde el calco «unos» no da nada', cubre: ['A1/GRAMÁTICA · ARTÍCULO'],
    cita: 'Artículo indefinido un/o/niște' }),
  P({ id: 'r2-articulo-enclitico-sg', nombre: 'Artículo definido enclítico, singular', bloque: 2, nivel: 'A1',
    descripcion: 'om→omul, casă→casa, floare→floarea, tren→trenul, tată→tatăl, zi→ziua. El artículo no es palabra: es flexión. («tata», familiar, es OTRO lema, el que pide «lui tata».)',
    prereqs: ['r2-genero-tres-valores'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'el instinto pone «el/la» delante y deja el sustantivo desnudo (*om, *casă por «el hombre», «la casa», español perfecto); la forma se deriva por regla y el gate la recalcula', cubre: ['A1/GRAMÁTICA · ARTÍCULO'],
    cita: 'Coloca el artículo enclítico definido singular en 20 sustantivos de los tres géneros' }),
  P({ id: 'r2-articulo-enclitico-pl', nombre: 'Artículo definido enclítico, plural', bloque: 2, nivel: 'A1',
    descripcion: 'oamenii, casele, florile, trenurile: -i y -le sobre el plural ya formado.',
    prereqs: ['r2-articulo-enclitico-sg', 'r2-plural-i-e-uri'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'doble flexión (plural + artículo) sin nada equivalente; deriva por regla', cubre: ['A1/GRAMÁTICA · ARTÍCULO'],
    cita: 'Artículo definido ENCLÍTICO en singular para los tres géneros y en plural (-ul, -le, -a, -ua, -i, -le)' }),
  P({ id: 'r2-plural-i-e-uri', nombre: 'Plural: -i, -e, -uri', bloque: 2, nivel: 'A1',
    descripcion: 'Las tres desinencias y su reparto por género: masculino -i, femenino -e/-i, neutro -e/-uri. La elección neutro -e vs -uri NO es predecible (scaun/scaune pero tren/trenuri, oraș/orașe pero birou/birouri): se almacena por lema, como la alternancia a→e.',
    prereqs: ['r2-genero-tres-valores'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'el instinto no sabe la desinencia y la raíz no la da (tren → *treni); la desinencia se deriva del lexicón por clase', cubre: ['A1/GRAMÁTICA · GÉNERO'],
    cita: 'Plural: -i, -e, -uri, con las alternancias morfofonológicas' }),
  P({ id: 'r2-alternancia-vocalica', nombre: 'Alternancias vocálicas en el plural: ea→e, oa→o, a→e, a→ă', bloque: 2, nivel: 'A2',
    descripcion: 'seară/seri, poartă/porți, fată/fete, carte/cărți. La a→e NO es predecible (masă/mese pero casă/case): la clase se almacena por lema.',
    prereqs: ['r2-plural-i-e-uri', 'r1-diptongos'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'la raíz se reconoce (poartă = puerta) y el plural no (*poarte por porți); deriva por regla desde la clase del lexicón', cubre: ['A2/FONOLOGÍA'],
    cita: 'La alternancia a→e NO es predecible desde el singular (masă/mese pero casă/case): la clase se almacena por lema' }),
  P({ id: 'r2-alternancia-consonantica', nombre: 'Alternancias consonánticas ante -i: t→ț, d→z, s→ș, c→ci, g→gi', bloque: 2, nivel: 'A2',
    descripcion: 'frate/frați, student/studenți, brad/brazi, urs/urși, sac/saci, drag/dragi — nunca *draji. Son automáticas y se generan por regla. (băiat/băieți acumula además ia→ie y no sirve para probar la consonántica sola.)',
    prereqs: ['r2-plural-i-e-uri'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'el instinto no muta la consonante (*bradi, *ursi); regla cerrada, gate en rojo con *draji', cubre: ['A2/FONOLOGÍA'],
    cita: 'Las consonánticas, en cambio, sí son automáticas ante -i y se generan por regla' }),
  P({ id: 'r2-concordancia-adjetivo', nombre: 'Concordancia del adjetivo, incluido el neutro', bloque: 2, nivel: 'A1',
    descripcion: 'un tren bun / două trenuri bune; adjetivo pospuesto por defecto, con las 4 formas (bun/bună/buni/bune) y las de 3 y 2 formas. El error diana es *două trenuri buni: el neutro colapsado en masculino.',
    prereqs: ['r2-genero-tres-valores'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«dos trenes buenos» es español perfecto: corrección desde el calco, pidiendo justo la casilla del plural neutro', cubre: ['A1/GRAMÁTICA · GÉNERO'],
    cita: 'concuerda el adjetivo en singular y en plural (un tren bun / două trenuri bune)' }),
  P({ id: 'r2-numerales-de', nombre: 'Numerales y la regla del «de» desde 20', bloque: 2, nivel: 'A1',
    descripcion: 'douăzeci DE ani, o sută DE lei; doi/două concuerda en género; 0-1.000.',
    prereqs: ['r2-genero-tres-valores'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«veinte años» sin «de» es español perfecto: el calco *douăzeci ani suena bien traducido, así que se da la frase calcada y se pide la rumana', cubre: ['A1/GRAMÁTICA · GÉNERO'],
    cita: 'Numerales 0-1.000 con la regla del \'de\' desde 20 (douăzeci DE ani, o sută DE lei)' }),
  P({ id: 'r2-hora-fecha', nombre: 'La hora y la fecha: e ora trei, două și un sfert, pe 3 martie', bloque: 2, nivel: 'A1',
    descripcion: 'Estructuras propias: e ora trei / e trei, la ora cinci, două și jumătate, fără un sfert, pe 3 martie, în martie, luni. El calco «son las tres» produce *sunt trei.',
    prereqs: ['r2-numerales-de'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«son las tres» y «el tres de marzo» son español perfecto y dan rumano malo: corrección desde el calco. Punto que faltaba: el currículo lo pide como campo léxico y es estructura', cubre: ['A1/GRAMÁTICA · GÉNERO'],
    cita: 'identidad, familia, números, hora y fecha, días y meses' }),

  // ── r3 · Verbo I ───────────────────────────────────────────────────
  P({ id: 'r3-presente-4-conjugaciones', nombre: 'Presente de las 4 conjugaciones (-a, -ea, -e, -i/-î)', bloque: 3, nivel: 'A1',
    descripcion: 'a cânta, a vedea, a merge, a dormi, a coborî: las desinencias regulares de persona.',
    prereqs: [], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'cânt/cânți/cântă se acierta casi por instinto: el ítem tiene que pedir las casillas que divergen — 3.ª pl. = 3.ª sg. en -a (ei cântă) y, en -e/-i, 1.ª sg. = 3.ª pl. (eu merg / ei merg, eu dorm / ei dorm)', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'Las 4 conjugaciones (-a, -ea, -e, -i/-î) en presente, regulares e irregulares de alta frecuencia' }),
  P({ id: 'r3-sufijo-ez-esc', nombre: 'Sufijos -ez-/-esc- (a lucra → lucrez, a citi → citesc)', bloque: 3, nivel: 'A1',
    descripcion: 'La subclase productiva con sufijo en las personas 1, 2, 3 y 6; nunca *a lucrez, que junta la partícula de infinitivo con una forma finita. a lucra tiene raíz latina (lucrum, aunque el sentido diverge de «lucrar»); a citi es eslavo y se memoriza sin apoyo.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'donde la raíz se reconoce (lucra) el instinto produce *lucr; la clase se almacena por lema y la forma se deriva', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'el SUFIJO -ez-/-esc- (a lucra → eu lucrez; a citi → eu citesc' }),
  P({ id: 'r3-irregulares-a1', nombre: 'Los 25 irregulares de A1: a fi, a avea, a vrea, a putea, a ști, a da, a lua, a bea, a veni, a sta…', bloque: 3, nivel: 'A1',
    descripcion: 'Presente de los irregulares de alta frecuencia; a fi como único copulativo (no hay ser/estar) y a avea como auxiliar.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: 'formas que se memorizan; el lexicón las lleva enteras y el cloze las pide con la persona en la pista', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'los 25 irregulares del nivel (a fi, a avea, a merge, a face, a vrea, a putea' }),
  P({ id: 'r3-sa-vs-infinitivo', nombre: 'Conjuntivo con «să» donde el español pone infinitivo', bloque: 3, nivel: 'A1',
    descripcion: 'vreau să merg, pot să vin, trebuie să plec, îmi place să citesc: el infinitivo NO es el complemento por defecto. Desde la primera semana.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«quiero ir» es español perfecto, así que *vreau a merge suena bien calcado: se da el calco y se pide la forma con să. Diseñado para inducir el calco', cubre: ['A1/GRAMÁTICA · CONJUNTIVO'],
    cita: 'Produce 15 frases con vreau/pot/trebuie/îmi place + să + presente SIN recurrir ni una vez al infinitivo largo' }),
  P({ id: 'r3-trebuie-invariable', nombre: '«a trebui» invariable: trebuie să merg / trebuie să mergem', bloque: 3, nivel: 'A1',
    descripcion: 'trebuie no concuerda con la persona: el sujeto lo lleva el conjuntivo. Nunca *trebuiesc, *trebuim.',
    prereqs: ['r3-sa-vs-infinitivo'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«debo / debemos ir» flexiona en español y el calco produce *trebuim să mergem: corrección desde el calco. Punto que faltaba', cubre: ['A1/GRAMÁTICA · CONJUNTIVO'],
    cita: 'vreau să, pot să, trebuie să, îmi place să, aș vrea să' }),
  P({ id: 'r3-dativo-experimentante', nombre: 'Dativo experimentante: mi-e foame, îmi place, mă doare capul', bloque: 3, nivel: 'A1',
    descripcion: 'Estados con el experimentante en dativo (mi-e foame/sete/frig/somn) o acusativo (mă doare): «tengo hambre» → *am foame es el calco. îmi place transfiere de «me gusta» y se marca como regalo.',
    prereqs: ['r6-cliticos-dativo'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«tengo hambre» es español impecable y da rumano malo: corrección desde el calco; la parte que transfiere (îmi place) no se examina. Punto que faltaba', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'dativo de 1ª/2ª (îmi, îți) sólo en formulas de alta frecuencia (îmi place, îl văd, îmi dai)' }),
  P({ id: 'r3-interrogativos', nombre: 'Interrogativos: ce, cine, care, unde, când, cum, cât; pe cine', bloque: 3, nivel: 'A1',
    descripcion: 'Las palabras interrogativas y su caso: cine (N) / pe cine (Ac) / cui (D); care concuerda y toma pe en OD; cât/câtă/câți/câte concuerda.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«¿a quién ves?» → *cine vezi es español perfecto calcado sin pe; la forma de caso (pe cine, cui, câte) se deriva por regla y el cloze la pide. Punto que faltaba: los descriptores de A1 exigen responder preguntas formuladas en rumano', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'responde 5 preguntas de comprensión literal formuladas en rumano' }),
  P({ id: 'r3-negacion-nu', nombre: 'Negación nu / n- y sus contracciones; doble negación', bloque: 3, nivel: 'A1',
    descripcion: 'nu văd; n-am / nu am, nu-l / nu îl: la contracción es la forma corriente y la plena es la de registro cuidado — las dos son correctas (DOOM3), y el ítem acepta las dos. Doble negación (nu văd pe nimeni, niciodată nu…): transferencia directa del español, se marca como regalo con dos o tres ítems dentro de este punto, no como punto propio.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'ortografico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'la posición coincide con el español y no se examina; se examina la GRAFÍA del clúster (n-am, nu-l, nu-i) con cloze, aceptando la forma plena como alternativa declarada', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'Negación nu / n- con las contracciones (n-am, nu-i, nu-l)' }),
  P({ id: 'r3-imperativo-afirmativo', nombre: 'Imperativo afirmativo de 20 verbos frecuentes', bloque: 3, nivel: 'A1',
    descripcion: 'vino!, fă!, du-te!, spune!, ia!, dă!, stai!, veniți!: formas de 2.ª sg. y pl.',
    prereqs: ['r3-irregulares-a1'], clase: 'paradigma', formato: 'transformacion', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: 'formas en gran parte irregulares (vino, fă, du); se derivan del lexicón y se piden con transformación desde el presente (tu vii → vino!), no con cloze: el hueco no tiene contexto que las determine', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'Imperativo afirmativo de 20 verbos frecuentes' }),
  P({ id: 'r3-perfect-compus-intro', nombre: 'Perfect compus: am + participio (fin de A1)', bloque: 3, nivel: 'A1',
    descripcion: 'am mâncat, ai văzut, a venit: auxiliar a avea + participio; los 60 participios más frecuentes. La casilla que confunde: am es 1.ª sg. Y 1.ª pl. (am mâncat = «he comido» y «hemos comido»).',
    prereqs: ['r3-irregulares-a1'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '«he venido» calca bien el auxiliar (am venit es correcto) pero no el participio (văzut, venit, no *vedut); deriva por regla y el cloze pide la casilla am = nosotros', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'Perfect compus (am mâncat) al final de A1, con la lista de los 60 participios más frecuentes' }),
  P({ id: 'r3-futuro-o-sa', nombre: 'Futuro coloquial «o să + conjuntivo», con o invariable', bloque: 3, nivel: 'A1',
    descripcion: 'o să merg, o să mergem, o să vin: el futuro que se habla. «voy a ir» transfiere la función; lo que no transfiere es que o sea INVARIABLE (nunca *om să mergem). «voi merge» se presenta en A2.',
    prereqs: ['r3-sa-vs-infinitivo'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«vamos a ir» → *om să mergem calca la flexión de «vamos» y es español perfecto: corrección desde el calco', cubre: ['A1/GRAMÁTICA · CONJUNTIVO'],
    cita: 'Futuro coloquial \'o să + conjuntivo\' (o să merg) — el que se habla, no \'voi merge\'' }),

  // ── r4 · Caso y determinación ──────────────────────────────────────
  P({ id: 'r4-gd-lui-formula', nombre: 'Genitivo con «lui» ante nombre propio masculino', bloque: 4, nivel: 'A1',
    descripcion: 'mașina lui Ion, cartea lui Mihai, casa lui tata: el genitivo analítico, memorizado como fórmula en A1; el paradigma entero va en A2.',
    prereqs: ['r2-articulo-enclitico-sg'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '«el coche de Ion» es español perfecto y lleva al instinto *mașina de Ion: corrección desde el calco', cubre: ['A1/GRAMÁTICA · ARTÍCULO'],
    cita: 'genitivo-dativo masculino con \'lui\' como fórmula memorizada (mașina lui Ion)' }),
  P({ id: 'r4-gd-indefinido', nombre: 'Genitivo-dativo indefinido: unui / unei / unor', bloque: 4, nivel: 'A2',
    descripcion: 'unui băiat, unei fete, unor oameni: el indefinido declinado; el femenino toma la forma del plural (unei case, unei cărți).',
    prereqs: ['r2-articulo-indefinido', 'r2-alternancia-vocalica'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'el español no declina: el instinto produce *de un băiat («de un chico», perfecto); la forma se deriva por regla y se valida contra dexonline', cubre: ['A2/GRAMÁTICA · CASO'],
    cita: 'Paradigma completo del genitivo-dativo: indefinido (unui/unei/unor) y definido (-ului, -ei, -lor)' }),
  P({ id: 'r4-gd-definido-sg', nombre: 'Genitivo-dativo definido singular: -ului, -ei, -ii', bloque: 4, nivel: 'A2',
    descripcion: 'băiatului, fetei, cărții, casei, orașului: el enclítico declinado; el femenino toma la forma del plural (fete → fetei, cărți → cărții).',
    prereqs: ['r4-gd-indefinido', 'r2-articulo-enclitico-sg'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'casa se reconoce y casei no sale de ningún instinto: deriva por regla, y el femenino desde el plural (regla que el generador lleva escrita)', cubre: ['A2/GRAMÁTICA · CASO'],
    cita: 'Declina en genitivo-dativo 25 sintagmas nominales cubriendo definido e indefinido' }),
  P({ id: 'r4-gd-definido-pl', nombre: 'Genitivo-dativo definido plural: -lor', bloque: 4, nivel: 'A2',
    descripcion: 'oamenilor, caselor, copiilor: -lor sobre el plural. La misma maquinaria da el vocativo plural (fraților, doamnelor).',
    prereqs: ['r4-gd-definido-sg', 'r2-articulo-enclitico-pl'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'triple flexión (plural + artículo + caso); deriva por regla', cubre: ['A2/GRAMÁTICA · CASO'],
    cita: 'unui băiat, unei fete, băiatului, fetei, oamenilor, caselor' }),
  P({ id: 'r4-dativo-oi', nombre: 'Dativo como objeto indirecto con doblado', bloque: 4, nivel: 'A2',
    descripcion: 'Îi dau Mariei cartea, le spun copiilor: el OI en GD, doblado por el clítico dativo. El doblado transfiere de «le doy a María»; la FORMA de caso no.',
    prereqs: ['r4-gd-definido-sg'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«le doy el libro a María» → *îi dau cartea la Maria es español perfecto calcado: corrección desde el calco, pidiendo la forma de caso', cubre: ['A2/GRAMÁTICA · CASO'],
    cita: 'Îi dau Mariei cartea' }),
  P({ id: 'r4-articulo-posesivo', nombre: 'Artículo posesivo/genitival al / a / ai / ale', bloque: 4, nivel: 'A2',
    descripcion: 'cartea băiatului vs o carte a băiatului; prietenul meu vs un prieten al meu. Concuerda con lo POSEÍDO y aparece cuando el genitivo no sigue inmediatamente a un sustantivo articulado.',
    prereqs: ['r4-gd-definido-sg'], clase: 'sin-equivalente', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'único en la Romania; el instinto lo omite (*un prieten meu, «un amigo mío», perfecto) o lo concuerda con el poseedor; se produce eligiendo la forma en contextos que contrastan determinado/indeterminado', cubre: ['A2/GRAMÁTICA · POSESIVO'],
    cita: 'Elige al / a / ai / ale correctamente en 20 contextos que contrasten sintagma determinado e indeterminado' }),
  P({ id: 'r4-posesivos', nombre: 'Posesivos meu/mea/mei/mele y său vs lui/ei', bloque: 4, nivel: 'A2',
    descripcion: 'El posesivo concordado con lo poseído, pospuesto al sustantivo articulado (casa mea), y la alternancia său/sa vs lui/ei, trampa constante.',
    prereqs: ['r2-articulo-enclitico-sg'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«mi casa» → *mea casă suena perfecto calcado (posesivo antepuesto, sustantivo sin artículo): corrección desde el calco', cubre: ['A2/GRAMÁTICA · POSESIVO'],
    cita: 'Posesivos meu/mea/mei/mele, tău, său y la alternancia său vs lui/ei — trampa constante' }),
  P({ id: 'r4-demostrativos-caso', nombre: 'Demostrativos con caso y en las dos posiciones', bloque: 4, nivel: 'A2',
    descripcion: 'acest băiat / băiatul acesta; acestui băiat, acestei fete; acel/acela. Antepuesto sin artículo, pospuesto con artículo y forma larga.',
    prereqs: ['r4-gd-definido-sg'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '«este chico» transfiere el antepuesto y nada más; las formas de GD y la pospuesta se derivan por regla', cubre: ['A2/GRAMÁTICA · CASO'],
    cita: 'Demostrativos con caso, en las dos posiciones (acest băiat / băiatul acesta; acestui băiat, acestei fete)' }),
  P({ id: 'r4-cel-proforma', nombre: 'cel / cea / cei / cele como proforma y superlativo', bloque: 4, nivel: 'A2',
    descripcion: 'cel mai bun, cel de acolo, cei doi: el artículo demostrativo, sin equivalente único en español.',
    prereqs: ['r4-demostrativos-caso'], clase: 'sin-equivalente', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: '«el más bueno» transfiere la idea y produce *mai bunul: se produce por transformación (bun → cel mai bun)', cubre: ['A2/GRAMÁTICA · CASO'],
    cita: 'las formas cel/cea/cei/cele como proforma y como marca de superlativo' }),
  P({ id: 'r4-vocativo', nombre: 'Vocativo: -e, -ule, -o, -lor, forma no marcada, y el registro', bloque: 4, nivel: 'A2',
    descripcion: 'Ion!/Ioane! (tradicional), băiete!/băiatule!, domnule!, Mario!, fraților!, domnilor!; la forma no marcada (Maria!, Mihai!, Ion!) es la del diccionario y la segura. Lo ÚNICO derivable por regla: el plural animado = GD plural (-lor); los neutros no tienen vocativo. El singular se almacena POR LEMA (om → omule, nunca *oame; domn → domnule, nunca *domne; Ion → Ioane, nunca *Ioanule) con un campo de REGISTRO obligatorio: -ule sobre un común es brusco (doctorule!) y la forma cortés es nominal (domnule doctor!). En A1 sólo Domnule!/Doamnă! como fórmula.',
    prereqs: ['r2-articulo-enclitico-sg', 'r4-gd-definido-pl'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'el español no flexiona el vocativo: *Ion!, *băiat! («¡Ion!», perfecto). Deriva del lexicón (clase + registro), no del género; Hunspell sólo caza *domne/*oame, no certifica formas ausentes (rechaza doctorule, que es real)', cubre: ['A2/GRAMÁTICA · CASO'],
    cita: 'Vocativo: paradigma productivo (-e masculino: Ioane, băiete, domnule; -o femenino: Mario, fato; plural -lor: fraților, domnilor)',
    // Comprobado en dexonline lema a lema el 2026-09-01 (Paso 0 §12): todo
    // común masculino admite -ule (18/18), -e es segunda forma en 9 y única
    // en prieten; plural -lor siempre; los nombres propios van SIN marca en
    // el diccionario (Ion → Ion; Ioane es tradicional). El registro no lo da
    // el diccionario: lo rellena el lingüista.
  }),
  P({ id: 'r4-preposicion-caida-articulo', nombre: 'Preposición de acusativo y CAÍDA del artículo', bloque: 4, nivel: 'A2',
    descripcion: 'la școală, în oraș, pe stradă, la birou: el sustantivo tras preposición va SIN artículo, salvo con determinante (la școala noastră) y con «cu» instrumental/comitativo determinado (cu trenul, cu creionul, cu mâna).',
    prereqs: ['r2-articulo-enclitico-sg'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«a la escuela», «en la ciudad» → *la școala, *în orașul: el calco con artículo suena perfecto; corrección desde el calco, con el contraejemplo cu trenul dentro del lote', cubre: ['A2/GRAMÁTICA · CASO'],
    cita: 'la mayoría rige acusativo Y provoca la CAÍDA DEL ARTÍCULO (la școală, în oraș, la birou, pe stradă)' }),
  P({ id: 'r4-preposiciones-gd', nombre: 'Preposiciones de genitivo y de dativo', bloque: 4, nivel: 'A2',
    descripcion: 'asupra, contra, deasupra, împotriva, înaintea, în fața (+ G); datorită, grație, mulțumită, conform, potrivit (+ D). Receptivas en A2.',
    prereqs: ['r4-gd-definido-sg'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'la preposición se reconoce (contra, conform) y por eso engaña: *contra guvernul por contra guvernului; cloze de la forma del sustantivo, derivada', cubre: ['A2/GRAMÁTICA · CASO'],
    cita: 'las de genitivo (asupra, contra, deasupra, împotriva, înaintea, în fața) y las de dativo (datorită, grație, mulțumită, conform, potrivit)' }),

  // ── r5 · Verbo II ──────────────────────────────────────────────────
  P({ id: 'r5-participios', nombre: 'Participios: regulares por clase e irregulares', bloque: 5, nivel: 'A2',
    descripcion: 'Regulares: -at (luat, dat, stat), -ut (avut, vrut, putut, știut, văzut), -it (venit, dormit), -ât (coborât). Irregulares de verdad: spus, mers, scris, pus, fost, făcut (alternancia). Sólo éstos se guardan a mano.',
    prereqs: ['r3-perfect-compus-intro'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'la raíz se reconoce (scrie ~ escribir) y el participio no sale del instinto (*scriut por scris); los regulares se derivan, los irregulares viven en el lexicón', cubre: ['A2/GRAMÁTICA · PASADOS'],
    cita: 'Perfect compus con la lista completa de participios irregulares' }),
  P({ id: 'r5-imperfect', nombre: 'Imperfect: eram, făceam, mergeam', bloque: 5, nivel: 'A2',
    descripcion: 'La formación del imperfecto en las 4 conjugaciones. El sincretismo que el español no tiene: 1.ª sg. = 1.ª pl. (eu mergeam / noi mergeam).',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'el USO transfiere (85 %); la FORMA se deriva y es lo que se examina, con la casilla mergeam = nosotros como hueco', cubre: ['A2/GRAMÁTICA · PASADOS'],
    cita: 'Imperfect (eram, făceam, mergeam) con el contraste aspectual presentado explícitamente como TRANSFERENCIA del español' }),
  P({ id: 'r5-perifrasis-pasado', nombre: 'El pasado sin perífrasis: 2:1 y tiempo simple + adverbio', bloque: 5, nivel: 'A2',
    descripcion: 'Hecho de base: el rumano estándar no tiene pasado simple vivo, así que am făcut = «hice» + «he hecho» (2:1). Y las tres perífrasis aspectuales del pasado español no tienen forma rumana: progresivo «estaba comiendo cuando llamó» → mâncam când a sunat (no *eram mâncând); prospectivo «iba a salir cuando sonó» → tocmai plecam când a sunat / eram pe cale să plec (no *mergeam să plec); retrospectivo «acababa de llegar» → tocmai sosise / abia sosise. El reparto imperfecto/indefinido en sí transfiere: NO se examina. «a ști» no admite la coerción incoativa de «supe» (am aflat, no *am știut): va en r9-falsos-amigos.',
    prereqs: ['r5-imperfect', 'r5-participios'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'las tres perífrasis son español perfecto y su calco es rumano malo: corrección desde el calco (dar el español con perífrasis, pedir tiempo simple + adverbio). Es el mismo hecho que r7-anti-progresivo, un nivel antes: r5 lo posee en A2 y r7 lo re-ancla en B1 como umbral duro. Sustituye al «las tres excepciones» del currículo, que nadie enumeraba', cubre: ['A2/GRAMÁTICA · PASADOS'],
    cita: 'señalando las tres excepciones donde diverge' }),
  P({ id: 'r5-mai-mult-ca-perfect', nombre: 'Mai-mult-ca-perfectul sintético: făcusem, mersesem', bloque: 5, nivel: 'A2',
    descripcion: 'Una sola palabra, sin auxiliar: se enseña CONTRA el «había hecho» analítico.',
    prereqs: ['r5-perifrasis-pasado'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '*aveam făcut es el calco exacto de «había hecho» y suena perfecto: corrección desde el calco', cubre: ['A2/GRAMÁTICA · PASADOS'],
    cita: 'Mai-mult-ca-perfectul SINTÉTICO (făcusem, mersesem): una sola palabra, sin auxiliar' }),
  P({ id: 'r5-futuro-cuatro-registros', nombre: 'Los cuatro futuros: voi merge / o să merg / am să merg / oi merge', bloque: 5, nivel: 'A2',
    descripcion: 'Receptivos los cuatro, productivos «o să» y «voi» (voi/vei/va/vom/veți/vor + infinitivo sin partícula). En B2 se vuelven elección de registro.',
    prereqs: ['r3-futuro-o-sa'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: '*voi a merge calca «voy a ir»; deriva por regla', cubre: [], sinDescriptor: 'el contenido A2 pide los cuatro futuros pero ningún «Sabrá hacer» de A2 los menciona: hueco del currículo, se denuncia y no se tapa con PASADOS',
    cita: 'Futuro: los cuatro registros (voi merge formal/escrito, o să merg coloquial estándar, am să merg coloquial, oi merge popular)' }),
  P({ id: 'r5-condicional', nombre: 'Condicional presente y perfecto: aș merge, aș fi mers', bloque: 5, nivel: 'A2',
    descripcion: 'aș/ai/ar/am/ați/ar + infinitivo; perfecto con fi + participio.',
    prereqs: ['r5-futuro-cuatro-registros'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: 'analítico donde el español es sintético (iría): deriva por regla; la elección dacă/de/să y el irreal van en r11', cubre: [], sinDescriptor: 'igual que el futuro: el contenido A2 lo pide y ningún descriptor A2 lo mide',
    cita: 'Condicional presente y perfecto (aș merge, aș fi mers)' }),
  P({ id: 'r5-imperativo-negativo', nombre: 'Imperativo negativo: 2.ª sg. con INFINITIVO (nu veni!), 2.ª pl. como el afirmativo (nu veniți!)', bloque: 5, nivel: 'A2',
    descripcion: 'nu veni!, nu te duce!, nu spune! en singular; nu veniți!, nu faceți! en plural, idénticos al afirmativo. Un generador con «negativo = infinitivo» produce *nu veni! a un plural.',
    prereqs: ['r3-imperativo-afirmativo'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«no vengas» → *nu vii! / *nu să vii! suena bien calcado: corrección desde el calco, con el afirmativo al lado', cubre: ['A2/GRAMÁTICA · IMPERATIVO'],
    cita: 'Distingue imperativo afirmativo (vino!, fă!, du-te!) de negativo con INFINITIVO (nu veni!, nu face!, nu te duce!)' }),
  P({ id: 'r5-reflexivos-ac-dat', nombre: 'Reflexivos acusativo vs dativo: mă spăl / îmi spăl mâinile', bloque: 5, nivel: 'A2',
    descripcion: 'El español distingue igual pero con UN pronombre (me lavo / me lavo las manos); el rumano con dos (mă / îmi).',
    prereqs: ['r6-cliticos-acusativo', 'r6-cliticos-dativo'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«me lavo las manos» → *mă spăl mâinile es español perfecto calcado: corrección desde el calco', cubre: ['A2/GRAMÁTICA · CLÍTICOS'],
    cita: 'Reflexivos con la distinción acusativo/dativo (mă spăl vs îmi spăl mâinile)' }),

  // ── r6 · Clíticos y «pe» ───────────────────────────────────────────
  P({ id: 'r6-cliticos-acusativo', nombre: 'Clíticos de acusativo: mă, te, îl, o, ne, vă, îi, le', bloque: 6, nivel: 'A1',
    descripcion: 'Îl văd, o văd, îi văd, le văd: formas y colocación proclítica con el verbo finito. A1 sólo la 3.ª persona en fórmulas.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'la posición transfiere; las FORMAS no (îl, îi, le con género): cloze derivado por persona/género/número', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'Clíticos: acusativo de 3ª (îl, o, îi, le)' }),
  P({ id: 'r6-cliticos-dativo', nombre: 'Clíticos de dativo: îmi, îți, îi, ne, vă, le', bloque: 6, nivel: 'A1',
    descripcion: 'îmi place, îți dau, îi spun: el dativo, con la homonimia îi (dat. sg.) / îi (ac. pl.).',
    prereqs: ['r6-cliticos-acusativo'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: 'îmi/îți no se parecen a nada; cloze derivado', cubre: ['A1/GRAMÁTICA · VERBO'],
    cita: 'dativo de 1ª/2ª (îmi, îți) sólo en formulas de alta frecuencia' }),
  P({ id: 'r6-contracciones-cliticos', nombre: 'Contracciones ortográficas obligatorias: mi l-a dat, m-am dus, nu ți-l dau', bloque: 6, nivel: 'A2',
    descripcion: 'El orden clítico+auxiliar y la grafía con guion dependen de tiempo, polaridad y auxiliar: l-am văzut, ne-am dus, nu ni le-a spus, într-o, dintr-un.',
    prereqs: ['r6-cliticos-dativo', 'r3-perfect-compus-intro'], clase: 'sin-equivalente', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: '«lo he visto» → *îl am văzut es perfecto calcado; se produce por transformación (Am văzut cartea → Am văzut-o / L-am văzut) y el gate valida por regla', cubre: ['A2/GRAMÁTICA · CLÍTICOS'],
    cita: 'incluida la contracción ortográfica obligatoria, en 25 frases: mi l-a dat, nu ni le-a spus, dă-mi-l, du-te, nu te duce' }),
  P({ id: 'r6-cliticos-imperativo-gerunziu', nombre: 'Enclisis con imperativo afirmativo y gerunziu: dă-mi-l, du-te, văzându-l', bloque: 6, nivel: 'A2',
    descripcion: 'Proclítico con formas finitas, enclítico con imperativo afirmativo y gerundio; proclítico otra vez con imperativo negativo (nu te duce).',
    prereqs: ['r6-contracciones-cliticos', 'r5-imperativo-negativo'], clase: 'coincide', formato: 'transformacion', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'el español coloca igual (dámelo / no te vayas) y el calco de la forma (*dă-îmi-îl) no es español de ninguna clase: se examina la FORMA del clúster con transformación, porque no cabe en un hueco', cubre: ['A2/GRAMÁTICA · CLÍTICOS'],
    cita: 'proclítico con formas finitas, enclítico con imperativo afirmativo y con gerundio' }),
  P({ id: 'r6-doblado-cliticos', nombre: 'Doblado obligatorio del clítico', bloque: 6, nivel: 'A2',
    descripcion: 'Îl văd pe Ion, îi dau Mariei cartea: el objeto humano determinado se dobla siempre; *Văd pe Ion está mal.',
    prereqs: ['r6-pe-regla-operativa', 'r6-cliticos-acusativo'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«veo a Ion» es español perfecto y *Văd pe Ion es su calco: corrección desde el calco. NO a juicio: la glosa contiene la respuesta', cubre: ['A2/GRAMÁTICA · CLÍTICOS'],
    cita: 'Sistema completo de clíticos de OD y OI con doblado obligatorio y sus reglas de posición' }),
  P({ id: 'r6-pe-regla-operativa', nombre: 'Marcador «pe» de objeto directo', bloque: 6, nivel: 'A1',
    descripcion: 'Obligatorio con humano determinado y con pronombres (pe mine, pe cine, pe care); ausente con indefinido genérico (caut un doctor). Es la «a» personal del español casi 1:1: donde coincide no se examina.',
    prereqs: ['r6-cliticos-acusativo'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'el subconjunto divergente: «busco a un médico» → *caut pe un doctor y «¿a quién?» → *cine? son español perfecto calcado: corrección. NO a juicio: «veo a Ion» / *Văd pe Ion tienen la respuesta en la glosa', cubre: ['A1/GRAMÁTICA · VERBO', 'A2/GRAMÁTICA · CLÍTICOS'],
    cita: 'Marcador \'pe\' de objeto directo humano determinado como regla operativa (îl văd pe Ion)' }),

  // ── r7 · Modo y formas no personales ───────────────────────────────
  P({ id: 'r7-conjuntivo-presente', nombre: 'Conjuntivo presente completo y las irregulares de 3.ª', bloque: 7, nivel: 'B1',
    descripcion: 'Donde la 3.ª diverge del indicativo: este→să fie, are→să aibă, dă→să dea, stă→să stea, poate→să poată, merge→să meargă, face→să facă. Donde NO diverge (ia/să ia, vrea/să vrea, știe/să știe) el ítem no mide su punto y no se construye.',
    prereqs: ['r3-sa-vs-infinitivo'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'el instinto repite el indicativo (*să merge por să meargă): la forma se deriva y el gate la recalcula; el lote sólo usa las casillas que divergen', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'],
    cita: 'Conjuntivo presente completo con las irregulares de 3ª persona (să fie, să aibă, să dea, să stea, să ia, să vrea, să poată, să știe, să meargă, să facă)' }),
  P({ id: 'r7-conjuntivo-perfecto', nombre: 'Conjuntivo perfecto: să fi mers', bloque: 7, nivel: 'B1',
    descripcion: 'să fi + participio, invariable; en subordinadas de anterioridad.',
    prereqs: ['r7-conjuntivo-presente', 'r5-participios'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: 'forma invariable que el instinto conjuga (*să fiu mers, «que yo haya ido»); deriva por regla', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'],
    cita: 'conjuntivo perfecto (să fi mers)' }),
  P({ id: 'r7-disparadores-sa', nombre: 'Los ~25 disparadores del conjuntivo, en dos columnas', bloque: 7, nivel: 'B1',
    descripcion: 'Los que coinciden con el español (e posibil să, sper să, înainte să) y los que DIVERGEN: el sujeto idéntico (vreau să merg) y ca … să con sujeto expreso (vreau ca el să vină).',
    prereqs: ['r7-conjuntivo-presente'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'sólo la columna divergente se examina; ahí el calco (*vreau a merge, *vreau el să vină) suena bien: corrección', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'],
    cita: 'Inventario cerrado de ~25 disparadores, presentado en dos columnas' }),
  P({ id: 'r7-anti-progresivo', nombre: 'Anti-calco: *sunt mâncând no existe', bloque: 7, nivel: 'B1',
    descripcion: 'El rumano no tiene progresivo gramaticalizado: «estoy comiendo» es mănânc / tocmai mănânc / stau și mănânc; en registro formal sunt în curs de…. («sunt pe cale să mănânc» es «estoy A PUNTO DE comer», prospectivo: no vale como clave; vive en r5-perifrasis-pasado.) Umbral duro de B1; el mismo hecho en pasado se enseña en A2 (r5-perifrasis-pasado).',
    prereqs: ['r7-gerunziu', 'r5-perifrasis-pasado'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'el calco es español perfecto y lo produce todo hispanohablante; corrección desde el calco en contextos diseñados para inducirlo. Es el único punto donde el JUICIO podría vivir (el calco es lo que suena bien), pero no se asigna sin medirlo', cubre: ['B1/GRAMÁTICA · ANTI-CALCO'],
    cita: 'NO produce ni una vez *sunt mâncând' }),
  P({ id: 'r7-supin', nombre: 'Supin: de făcut, mașină de spălat, e greu de crezut', bloque: 7, nivel: 'B1',
    descripcion: 'Forma no personal exclusiva del rumano: de + participio con valor de infinitivo/finalidad.',
    prereqs: ['r5-participios'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '«máquina de lavar» es español perfecto y lleva a *mașină de spăla (infinitivo): corrección desde el calco', cubre: ['B1/GRAMÁTICA · FORMAS NO PERSONALES'],
    cita: 'SUPIN: de făcut, de citit, mașină de spălat, e greu de crezut, am ceva de spus' }),
  P({ id: 'r7-gerunziu', nombre: 'Gerunziu: mergând, făcând, y su restricción', bloque: 7, nivel: 'B1',
    descripcion: 'La forma en -ând/-ind, sus usos adverbiales, y lo que NO hace: progresivo. La desinencia la decide el FINAL DEL TEMA, no la conjugación: -ind tras i/palatal (fugind, scriind), -ând en el resto (mergând, coborând — no *coborind).',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'la forma se deriva por final de tema; el uso prohibido va en r7-anti-progresivo', cubre: ['B1/GRAMÁTICA · FORMAS NO PERSONALES'],
    cita: 'GERUNZIU: mergând, făcând, y muy especialmente su restricción' }),
  P({ id: 'r7-infinitivo-residual', nombre: 'Infinitivo corto en sus usos residuales; el largo como sustantivo', bloque: 7, nivel: 'B1',
    descripcion: 'Tras preposición (înainte de a pleca, fără a spune), tras a putea sin partícula (pot merge, nunca *pot a merge), y el largo en -re como sustantivo (mâncare, plimbare).',
    prereqs: ['r3-sa-vs-infinitivo'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«puedo ir» → *pot a merge es español perfecto calcado con la partícula: corrección desde el calco; el contraste să/infinitivo por contexto entra en el mismo lote', cubre: ['B1/GRAMÁTICA · FORMAS NO PERSONALES'],
    cita: 'Infinitivo largo en sus usos residuales: tras preposición (înainte de a pleca, fără a spune, în loc de a face), tras a putea (pot merge)' }),
  P({ id: 'r7-pasiva-impersonal', nombre: 'Pasiva con a fi, pasiva refleja e impersonal', bloque: 7, nivel: 'B1',
    descripcion: 'este făcut, a fost construită (concordado); se face, se vinde; zice lumea, se spune că.',
    prereqs: ['r5-participios'], clase: 'coincide', formato: 'transformacion', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'el español tiene las tres y la concordancia rota (*casa este construit → «la casa está construido») también es mala en español: la glosa la caza, así que no se juzga; se examina la concordancia con transformación activa→pasiva', cubre: ['B1/GRAMÁTICA · FORMAS NO PERSONALES'],
    cita: 'Pasiva con a fi + participio (este făcut, a fost construit) con concordancia' }),

  // ── r8 · Sintaxis y subordinación ──────────────────────────────────
  P({ id: 'r8-relativas-pe-care', nombre: 'Relativas con care y «pe care» obligatorio en OD', bloque: 8, nivel: 'B1',
    descripcion: 'omul care vine / omul pe care îl văd: el relativo objeto lleva pe y doblado. Fuente constante de error.',
    prereqs: ['r6-pe-regla-operativa', 'r6-doblado-cliticos'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«el hombre que veo» → *omul care văd es español perfecto calcado: corrección', cubre: [], sinDescriptor: 'el contenido B1 pide «pe care» obligatorio y ningún «Sabrá hacer» de B1 lo mide',
    cita: 'Relativas con \'care\' y con \'pe care\' obligatorio en función de OD (fuente constante de error)' }),
  P({ id: 'r8-completivas-ca-sa', nombre: 'Completivas: că vs să, y ca … să con sujeto expreso', bloque: 8, nivel: 'B1',
    descripcion: 'cred că vine / vreau să vină / vreau ca el să vină: indicativo vs conjuntivo, y la partícula ca cuando el sujeto se interpone.',
    prereqs: ['r7-disparadores-sa'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'el reparto que/que → că/să coincide casi entero y no se examina; «quiero que él venga» → *vreau el să vină es perfecto calcado: corrección sobre ese subconjunto', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'],
    cita: 'Completivas con că vs să (indicativo vs conjuntivo), y la trampa de \'ca … să\' con sujeto expreso (vreau ca el să vină)' }),
  P({ id: 'r8-circunstanciales', nombre: 'Circunstanciales: el español mueve el MODO, el rumano mueve la CONJUNCIÓN', bloque: 8, nivel: 'B1',
    descripcion: 'deși y cu toate că (concesiva factual): SÓLO indicativo — lo hipotético no se dice con deși, se cambia a chiar dacă (indicativo o condicional, nunca să). dacă: indicativo (real) o condicional en las DOS cláusulas (dacă aș avea bani, aș pleca), nunca să. El să de las circunstanciales vive en finales y temporales: ca să, pentru ca … să, fără să, înainte să, în loc să, până să. Causa: pentru că, fiindcă, deoarece, întrucât. Tiempo: când, în timp ce, după ce, până când.',
    prereqs: ['r7-conjuntivo-presente', 'r5-condicional'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«aunque llueva» → *deși să plouă y «si tuviera dinero» → *dacă să am bani calcan el subjuntivo español con la única marca de subjuntivo que el rumano tiene: corrección desde el calco. Los casos factuales, donde el calco acierta, no se examinan. El período condicional entero (potencial/irreal) queda en r11', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'],
    cita: 'concesión (deși, cu toate că, chiar dacă)' }),
  P({ id: 'r8-conectores-argumentativos', nombre: 'Conectores del texto argumentativo', bloque: 8, nivel: 'B1',
    descripcion: 'prin urmare, în schimb, pe de altă parte, cu toate acestea, de altfel, totuși: los 8+ que el descriptor exige.',
    prereqs: ['r8-circunstanciales'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'léxico funcional; se examina en producción escrita con rúbrica y con flashcard de contraste, no con juicio', cubre: ['B1/PRODUCCIÓN ESCRITA', 'B2/PRODUCCIÓN ESCRITA'],
    cita: 'usando al menos 8 conectores distintos (pentru că, deși, în schimb, prin urmare, în timp ce, pe de altă parte, cu toate acestea)' }),
  P({ id: 'r8-comparativo', nombre: 'Comparativo y superlativo: mai … decât / ca, la fel de … ca, cel mai', bloque: 8, nivel: 'A2',
    descripcion: 'mai bun decât (norma DOOM3) y mai bun ca (popular, muy extendido, NO agramatical); la fel de bun ca; cel mai bun. El punto se acota al reparto la fel de … ca / mai … decât y a cel mai, no a la preferencia normativa.',
    prereqs: ['r4-cel-proforma'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'montar corrección sobre «ca» enseñaría prescripción disfrazada; cloze del término de comparación donde el contexto lo decide', cubre: [], sinDescriptor: 'el contenido A2 pide comparativo y superlativo y ningún «Sabrá hacer» de A2 lo mide',
    cita: 'Comparativo y superlativo (mai … decât, cel mai …, foarte, tot atât de)' }),
  P({ id: 'r8-discurso-indirecto', nombre: 'Discurso indirecto sin consecutio temporum obligatoria', bloque: 8, nivel: 'B1',
    descripcion: 'A spus că vine es la forma no marcada; a spus că venea es gramatical (imperfecto durativo/simultáneo). Lo que el rumano no tiene es el retraso OBLIGATORIO del español.',
    prereqs: ['r5-perifrasis-pasado'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'no hay error diana que corregir (las dos formas son correctas): se enseña como simplificación con cloze aceptando ambas como alternativas declaradas; dos o tres ítems, no ocho', cubre: [], sinDescriptor: 'contenido B1 sin descriptor propio; candidato a piso reducido',
    cita: 'Discurso indirecto: el rumano NO tiene consecutio temporum estricta' }),

  // ── r9 · Léxico ────────────────────────────────────────────────────
  P({ id: 'r9-nucleo-a1', nombre: 'Núcleo léxico A1 por frecuencia (600 lemas)', bloque: 9, nivel: 'A1',
    descripcion: 'Identidad, familia, números, hora, días, comida, casa, piață, transporte, cuerpo, tiempo, colores, ropa. Por frecuencia, no por lo que salga en los relatos.',
    prereqs: [], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'flashcard con lema + forma + acento; los transparentes reciben una exposición, los opacos dos', cubre: [], sinDescriptor: 'A1 no tiene descriptor de LÉXICO (el primero es A2/LÉXICO, 1.500 lemas); el contenido A1 pide 600',
    cita: 'LÉXICO: 600 lemas objetivo, seleccionados por frecuencia' }),
  P({ id: 'r9-opacos', nombre: 'Los lemas OPACOS: sin cognado español reconocible', bloque: 9, nivel: 'A1',
    descripcion: 'a vorbi, a citi, a trebui, a plăti, a găti, prieten, nevoie, oraș, ceas, ieftin, gata, murdar, geam, a sosi, zăpadă, poveste, veste, a păstra. CRITERIO: opaco = no existe cognado español reconocible, gane quien gane la etimología (a păstra es de origen disputado, DEX búlgaro / Ciorănescu latín tardío, y es opaco igual: nada lleva de «pasto» a «guardar»). Doble exposición en el SRS.',
    prereqs: ['r9-nucleo-a1'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'flashcard; es el 20-25 % del núcleo donde el hispanohablante no tiene regalo', cubre: ['A2/LÉXICO'],
    cita: 'unos 120-150 se marcan como OPACOS para el hispanohablante' }),
  P({ id: 'r9-falsos-amigos', nombre: 'Falsos amigos ES-RO', bloque: 9, nivel: 'A2',
    descripcion: 'a supăra ≠ superar, cald = caliente, larg = ancho, a merge = ir, prost = tonto, plic = sobre, comod, a pretinde, a realiza, a suporta, a ține ≠ tener, a pleca = irse, masă, a uita vs a se uita; y a ști ≠ «supe» (la coerción incoativa del indefinido no transfiere: am aflat). 30 en A2, 50 en B1, 80 en B2. CRITERIO: falso amigo = existe cognado español reconocible con significado distinto; sin cognado (a păstra) va a los opacos; «a asista la» NO es falso amigo para un hispanohablante. El fichero heredado se revisa entrada por entrada con este filtro.',
    prereqs: ['r9-nucleo-a1'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el activo diferencial del proyecto: aquí la raíz común ENGAÑA por definición; flashcard de contraste con la nota, revisada por el lingüista', cubre: ['A2/LÉXICO', 'B2/LÉXICO'],
    cita: 'Se abre el fichero de FALSOS AMIGOS ES-RO con las 30 primeras entradas de alta frecuencia' }),
  P({ id: 'r9-familias-derivativas', nombre: 'Familias derivativas: a lucra → lucru / lucrător / lucrare / a prelucra', bloque: 9, nivel: 'B1',
    descripcion: 'Sufijos -tor/-toare, -ime, -ie/-ție, -eală, -esc, -uleț/-ică/-uț; prefijos re-, ne-, des-, în-, stră-. 30 familias completas.',
    prereqs: ['r9-nucleo-a1'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'el hispanohablante multiplica aquí; se examina PRODUCIENDO el derivado desde el lema (transformación), no reconociéndolo', cubre: ['B1/LÉXICO'],
    cita: 'El eje del nivel es la MORFOLOGÍA DERIVATIVA productiva' }),
  P({ id: 'r9-colocaciones', nombre: 'Colocaciones y unidades fraseológicas', bloque: 9, nivel: 'C1',
    descripcion: 'a lua o decizie, a-și da seama, a ține cont de, a face față, a pune la punct; a bate câmpii, a-i pica fisa, a o da în bară. 200 + 100.',
    prereqs: ['r9-familias-derivativas'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«tomar una decisión» → a lua o decizie acierta, pero «darse cuenta» → a-și da seama no: flashcard de la unidad entera; la mediación idiomática de B2 las usa', cubre: ['C1/LÉXICO', 'B2/MEDIACIÓN · IDIOMÁTICA'],
    cita: 'con la COLOCACIÓN y la unidad fraseológica como unidad de aprendizaje, no la palabra suelta' }),
  P({ id: 'r9-estratos-dobletes', nombre: 'Dobletes de estrato como elección estilística', bloque: 9, nivel: 'C1',
    descripcion: 'a grăi / a vorbi / a discuta; nevastă / soție; slobod / liber; a sfârși / a termina / a finaliza; a se prăpădi / a muri / a deceda.',
    prereqs: ['r9-colocaciones'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'la rama culta es transparente y la elección es de efecto, no de gramaticalidad: mediación (reescribir en otro registro) y flashcard del triplete. Se enseña en C1 y lo mide el descriptor de C2', cubre: ['C2/LÉXICO', 'C1/PRODUCCIÓN ESCRITA · REGISTRO'],
    cita: 'ESTRATOS ETIMOLÓGICOS COMO RECURSO ESTILÍSTICO' }),
  P({ id: 'r9-vocabulario-comunista', nombre: 'Vocabulario del período comunista y su reutilización irónica', bloque: 9, nivel: 'C1',
    descripcion: 'tovarăș, ședință, plan cincinal, «ca la Comitetul Central»: léxico que circula en la conversación adulta con carga irónica.',
    prereqs: ['r9-colocaciones'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'lo que se examina es leer la carga, no la palabra: mediación-explicar', cubre: ['C1/MEDIACIÓN · CULTURAL'],
    cita: 'Vocabulario del periodo comunista y su reutilización irónica actual' }),
  P({ id: 'r9-referencias-culturales', nombre: 'Referencias culturales compartidas: Caragiale, 1989, mici, Dacia, mitul mioritic', bloque: 9, nivel: 'C2',
    descripcion: '50 referencias que un hablante culto reconoce sin glosa; Dracula como malentendido occidental.',
    prereqs: ['r9-vocabulario-comunista'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'mediación-explicar para un lector hispano; la alusión se explica, no se juzga', cubre: ['C2/CULTURA', 'C1/MEDIACIÓN · CULTURAL'],
    cita: 'Reconoce y usa 50 referencias culturales compartidas' }),

  // ── r10 · Pragmática y registro ────────────────────────────────────
  P({ id: 'r10-tratamiento', nombre: 'tu / dumneavoastră (+ 2.ª pl.) / dumneata (+ 2.ª SG.); dânsul receptivo', bloque: 10, nivel: 'A1',
    descripcion: 'Elección por situación social: panadera, jefe, abuelo, funcionario, camarero, desconocido. La trampa: dumneavoastră rige 2.ª plural y dumneata 2.ª SINGULAR. Tratamiento nominal domnule + cargo, doamna + apellido.',
    prereqs: [], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'lo que se juzga es adecuación, no gramaticalidad: mediación de registro (reescribir un turno para otro interlocutor); la concordancia de dumneata entra como cloze en el mismo lote', cubre: ['A1/PRAGMÁTICA'],
    cita: 'sistema de tratamiento tu / dumneavoastră productivo y dumneata / dânsul / dânsa receptivo' }),
  P({ id: 'r10-saludos-formulas', nombre: 'Saludos por hora y registro, vă rog, mulțumesc, cu plăcere, scuzați, nu-i nimic', bloque: 10, nivel: 'A1',
    descripcion: 'bună dimineața / bună ziua / bună seara / salut / servus / noapte bună y las fórmulas de cortesía.',
    prereqs: [], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'fórmulas que se aprenden como piezas: flashcard con la situación', cubre: ['A1/PRAGMÁTICA'],
    cita: 'Fórmulas de saludo por hora y por registro' }),
  P({ id: 'r10-poftim', nombre: '«Poftim / poftiți» como multiherramienta', bloque: 10, nivel: 'A1',
    descripcion: 'Tenga, ¿cómo dice?, pase, sírvase: sin equivalente español, se enseña como pieza aparte.',
    prereqs: ['r10-saludos-formulas'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'el valor depende de la situación: mediación-explicar (qué hace poftim en este turno)', cubre: ['A1/PRAGMÁTICA'],
    cita: '\'Poftim/poftiți\' como multiherramienta' }),
  P({ id: 'r10-registro-tramite', nombre: 'Registro de la transacción y fórmulas del trámite', bloque: 10, nivel: 'A2',
    descripcion: 'magazin, farmacie, poștă, primărie, medic de familie; cierres de correo por registro (Cu stimă, Cu respect, Toate cele bune, Pupici).',
    prereqs: ['r10-tratamiento'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'adecuación al género: mediación de registro con rúbrica', cubre: ['A2/PRODUCCIÓN ESCRITA'],
    cita: 'fórmulas de cierre de correo por registro (Cu stimă, Cu respect, Toate cele bune, Pupici)' }),
  // RE-ENCUADRADO por el coordinador (2026-09-02), con el motivo escrito
  // para que no se reabra. Se llamaba «el diminutivo como atenuador
  // cortés» y se examinaba por mediación de registro. El lingüista
  // adversarial midió que así NO MEDÍA RUMANO: la función atenuadora es
  // espejo del español de México (ahorita, cafecito, un ratito), y en la
  // dirección atenuado→directo el alumno sólo tiene que BORRAR un sufijo.
  // La divergencia real es otra y es LÉXICA: la elección del sufijo se
  // almacena por lema (cafea→cafeluță -uță, pahar→păhărel -el,
  // minut→minuțel -el, apă→apșoară -șoară, fată→fetiță -iță).
  // MATIZADO por el lingüista el 2026-09-02, porque la v0 de esta nota
  // decía «no se deriva» a secas y era falso a medias: hay DOS tendencias
  // reales (fem. en -e → -icică; fem. en -ă → -uță por defecto) y con
  // ellas se acierta la mitad. Lo léxico de verdad es lo que las
  // desmiente: fată→fetiță (femenino en -ă que no toma -uță),
  // cafea→cafeluță (sobre el alomorfo cafel-, no sobre el lema) y todo el
  // masculino (copil→copilaș frente a om→omuleț, sin nada que los
  // separe). La formulación que vale: el sufijo NO ES PREDECIBLE desde el
  // lema. Es la misma lección que masă/mese frente a casă/case.
  //   · `clase: 'lexico'` porque el reparto se guarda, no se calcula; y
  //     `formato` DECLARADO para saltar el flashcard de esa clase: la
  //     casilla que obliga a ELEGIR el sufijo es el cloze derivado, y la
  //     transformación atenuado→directo se descarta por lo dicho.
  //   · `castellano: 'bien'` porque el error diana calcado («cafecito»,
  //     «un ratito») es español impecable ⇒ el ítem PRODUCE, nunca juzga.
  //   · `latinComun: 'engañoso'`: la raíz se reconoce entera (cafea) justo
  //     donde la morfología diverge (cafeluță). Es la trampa propia del
  //     rumano, no «transparente».
  //   · El `id` NO cambia: lo referencian 8 ítems ya publicados en b10 y
  //     renombrarlo los dejaría contando a un punto inexistente. El id es
  //     un asa; lo que enseña lo dicen `nombre` y `descripcion`.
  //   · `cita` se deja intacta: es la frase literal del currículo y un
  //     test la busca ahí. El currículo dice «atenuador»; el inventario
  //     dice qué se EXAMINA, que es otra pregunta.
  P({ id: 'r10-diminutivo-atenuador', nombre: 'Elección del sufijo diminutivo: cafea → cafeluță, pahar → păhărel, minut → minuțel', bloque: 10, nivel: 'A2',
    descripcion: 'El reparto -uță / -el / -iță / -aș / -uleț / -icică / -șoară no es PREDECIBLE desde el lema: se almacena por palabra, como la alternancia del plural. Hay dos tendencias (fem. en -e → -icică; fem. en -ă → -uță) y lo que el punto enseña es lo que las desmiente — fată→fetiță, cafea→cafeluță y el masculino entero. Con la función atenuadora al lado, que es la que motiva usarlo; pero lo que el ítem mide es la ELECCIÓN, no el efecto cortés (ése lo calca el español de México sin saber rumano).',
    prereqs: ['r10-registro-tramite'], clase: 'lexico', formato: 'cloze-con-pista', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: 'la elección del sufijo es léxica y no derivable ⇒ cloze derivado con el lema dado y la forma diminutiva exigida; cada lema entra al lexicón con su diminutivo ATESTADO y su fuente (supică y ceaiuț se retiraron por no estar en DEX/MDA2/DLR/DOOM3). La función atenuadora sigue enseñándose, pero no es lo que se puntúa: es espejo del castellano', cubre: ['A2/PRODUCCIÓN ESCRITA'],
    cita: 'el uso del diminutivo como atenuador cortés (o cafeluță, un pic, două minute)' }),
  P({ id: 'r10-particulas-modales', nombre: 'Partículas modales: chiar, tocmai, doar, cam, oare, ba, măcar, totuși, tot, parcă, cică', bloque: 10, nivel: 'B1',
    descripcion: 'Sin equivalente 1:1; son la marca acústica del no nativo y su valor es prosódico además de léxico. Se enseñan como sistema, con audio. tocmai y abia se adelantan a A2 porque r5-perifrasis-pasado los necesita.',
    prereqs: ['r10-diminutivo-atenuador'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'efecto, no gramaticalidad: mediación-explicar (qué añade cam/parcă aquí) y cloze con contexto que determina la partícula donde sea determinable', cubre: ['B1/PRAGMÁTICA'],
    cita: 'PARTÍCULAS MODALES, el rasgo más resistente a la transferencia' }),
  P({ id: 'r10-reparacion-turno', nombre: 'Estrategias de reparación: Poftim? Adică? Vreți să spuneți că…? Cum ați zis?', bloque: 10, nivel: 'B1',
    descripcion: 'Pedir aclaración, reformular, ceder e interrumpir: las fórmulas, receptivas y en producción escrita (chat).',
    prereqs: ['r10-poftim'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'fórmulas: flashcard con la situación; la interacción oral queda fuera por decisión', cubre: ['B1/MEDIACIÓN · REGISTRO'],
    cita: 'Gestión del turno: interrumpir, ceder, pedir aclaración, reformular' }),
  P({ id: 'r10-tres-registros', nombre: 'Tres registros: coloquial, estándar escrito, administrativo', bloque: 10, nivel: 'B2',
    descripcion: 'Subsemnatul, Vă rog să binevoiți a, prezenta cerere, în conformitate cu prevederile; los cuatro futuros como elección consciente.',
    prereqs: ['r10-particulas-modales', 'r5-futuro-cuatro-registros'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'mediación de registro (reformular la misma información en otro registro) con rúbrica; el administrativo es opaco incluso para el B2 medio', cubre: ['B2/PRODUCCIÓN ESCRITA · GÉNERO', 'C1/PRODUCCIÓN ESCRITA · REGISTRO'],
    cita: 'Tres registros contrastados sistemáticamente: coloquial (con partículas, elisiones, diminutivos), estándar escrito, y administrativo/burocrático rumano' }),
  P({ id: 'r10-cortesia-negativa', nombre: 'El «nu» cortés, la atenuación y el desacuerdo con preservación de imagen', bloque: 10, nivel: 'B2',
    descripcion: 'parcă, oarecum, într-un fel, cam; formas indirectas del no; interrupción aceptable vs descortés; bășcălie receptiva.',
    prereqs: ['r10-tres-registros'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'mediación intercultural: explicar por qué un «nu» cortés se leyó como sí', cubre: ['B2/MEDIACIÓN · INTERCULTURAL'],
    cita: 'el \'nu\' cortés rumano y sus formas indirectas' }),
  P({ id: 'r10-ironia-bascalie', nombre: 'Ironía, bășcălie, understatement y sus marcas', bloque: 10, nivel: 'C1',
    descripcion: 'cică, chipurile, vezi Doamne, mă rog; entonación; la herencia de Caragiale como código compartido.',
    prereqs: ['r10-cortesia-negativa'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'detectar y justificar la marca: mediación-explicar', cubre: ['C1/PRAGMÁTICA'],
    cita: 'ironía rumana y bășcălie como registro de complicidad social, con sus marcas' }),

  // ── r11 · Morfosintaxis avanzada ───────────────────────────────────
  P({ id: 'r11-relativo-declinado', nombre: 'Relativo declinado: al cărui, a cărei, ai căror, ale căror', bloque: 11, nivel: 'B2',
    descripcion: 'omul al cărui fiu…, femeia a cărei mașină…, copiii ai căror părinți…: donde el caso y el artículo posesivo se cruzan. Separa el B1 fluido del B2 real.',
    prereqs: ['r4-articulo-posesivo', 'r8-relativas-pe-care'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '«cuyo» concuerda con lo poseído; aquí al/a/ai/ale con lo poseído Y cărui/cărei/căror con el antecedente: doble concordancia derivable por regla, cloze derivado con el gate recalculando', cubre: ['B2/GRAMÁTICA · RELATIVO'],
    cita: 'genitivo relativo con artículo posesivo concordado (omul al cărui fiu…, femeia a cărei mașină…, copiii ai căror părinți…)' }),
  P({ id: 'r11-dativo-relativo', nombre: 'Dativo relativo: căruia, căreia, cărora', bloque: 11, nivel: 'B2',
    descripcion: 'omul căruia i-am dat cartea: relativo en dativo con doblado.',
    prereqs: ['r11-relativo-declinado'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: '«el hombre al que le di» → *omul la care i-am dat, perfecto calcado; deriva por regla', cubre: ['B2/GRAMÁTICA · RELATIVO'],
    cita: 'Dativo relativo (căruia, căreia, cărora)' }),
  P({ id: 'r11-prezumtiv-receptivo', nombre: 'Prezumtiv receptivo: o fi plecat, va fi știind, o fi având dreptate', bloque: 11, nivel: 'B2',
    descripcion: 'El modo epistémico de suposición, innovación balcánica (no herencia latina). El hispanohablante SÍ tiene ancla: el futuro y el condicional epistémicos («serán las tres», «habrá salido», «estaría durmiendo») calcan casi exactamente o fi trei, o fi plecat, o fi fiind.',
    prereqs: ['r5-futuro-cuatro-registros', 'r7-gerunziu'], clase: 'sin-equivalente', formato: 'cloze-con-pista', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'en B2 es reconocer el VALOR: cloze de la paráfrasis con el contexto decidiendo, aprovechando el ancla del futuro epistémico español; la producción va en r12', cubre: ['B2/GRAMÁTICA · MODO'],
    cita: 'Reconoce el prezumtiv (o fi plecat, va fi știind, o fi având dreptate) en 15 contextos' }),
  P({ id: 'r11-periodo-condicional', nombre: 'Los tres períodos condicionales, el irreal con imperfecto y dacă / de / să', bloque: 11, nivel: 'B2',
    descripcion: 'La prótasis rumana lleva CONDICIONAL (dacă aș ști, aș veni; dacă aș fi știut, aș fi venit) o IMPERFECTO en el irreal corriente del habla (dacă știam, veneam — hueco de recepción, no de producción), nunca el subjuntivo que calca el español (*dacă să știu). El condicional de distanciamiento periodístico (ar fi vorba despre); dacă/de/să en la prótasis.',
    prereqs: ['r5-condicional', 'r8-circunstanciales'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«si supiera, vendría» es español perfecto y su calco pone subjuntivo en la prótasis: corrección desde el calco; el irreal con imperfecto se enseña receptivo', cubre: ['B2/GRAMÁTICA · PERÍODO CONDICIONAL'],
    cita: 'Construye los tres tipos de período condicional, incluido el irreal de pasado (dacă aș fi știut, aș fi venit)' }),
  P({ id: 'r11-aktionsart', nombre: 'Aspecto y Aktionsart lexicalizados: a se apuca de, a da să, a sta să, a tot face, a mai face', bloque: 11, nivel: 'B2',
    descripcion: 'Perífrasis y prefijos con valor aspectual (a reciti, a străbate, a se îmbolnăvi); sin equivalente sistemático.',
    prereqs: ['r7-disparadores-sa'], clase: 'sin-equivalente', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '«ponerse a» → *a se pune să es perfecto calcado; a se apuca de se produce, no se reconoce: transformación desde la paráfrasis', cubre: ['B2/GRAMÁTICA · MODO'],
    cita: 'ASPECTO Y AKTIONSART LEXICALIZADOS — sin equivalente sistemático en español' }),
  P({ id: 'r11-cel-complejo', nombre: '«cel» en estructuras complejas y sintagmas densos con doble genitivo', bloque: 11, nivel: 'B2',
    descripcion: 'cel de acolo, cel ce, cel mai bun dintre, cei doi; adjetivo antepuesto como marca de registro; genitivos encadenados.',
    prereqs: ['r4-cel-proforma', 'r11-relativo-declinado'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: 'cadena de concordancias derivable; cloze derivado', cubre: ['B2/GRAMÁTICA · RELATIVO'],
    cita: '\'Cel\' como proforma y en estructuras complejas (cel de acolo, cel ce, cel mai bun dintre, cei doi)' }),
  P({ id: 'r11-variedad-moldova', nombre: 'Rumano de la República de Moldova: léxico, calcos rusos, sovietismos; las hermanas de la romanidad oriental', bloque: 11, nivel: 'C1',
    descripcion: 'Mismas normas escritas, léxico diferenciado (a se odihni con valores rusos), ruso como lengua de contacto. Receptivo pleno. Y, como perspectiva (dos o tres ítems dentro de este punto), las otras tres lenguas de la romanidad oriental —aromâna, meglenoromâna, istroromâna—, hermanas de la dacorrumana, que es el rumano mismo.',
    prereqs: ['r1-variedades'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'mediación entre variedades: adaptar un texto de una a otra y explicar la diferencia', cubre: ['C1/COMPRENSIÓN ORAL · VARIEDAD', 'C2/MEDIACIÓN · ENTRE VARIEDADES'],
    cita: 'rumano de la República de Moldova como estándar paralelo' }),

  // ── r12 · Precisión, estilo y variación ────────────────────────────
  P({ id: 'r12-perfectul-simplu', nombre: 'Perfectul simplu: făcui, făcuși, făcurăm', bloque: 12, nivel: 'C1',
    descripcion: 'Narrativo literario y conversacional oltenesc; se elige por su valor, no al azar.',
    prereqs: ['r5-perifrasis-pasado'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '«hice» → făcui se parece al pretérito español y engaña en las demás personas (făcuși, făcurăm); deriva por regla', cubre: ['C1/GRAMÁTICA'],
    cita: 'Perfectul simplu (făcui, făcuși, făcurăm) en su doble valor: narrativo literario y conversacional oltenesc' }),
  P({ id: 'r12-prezumtiv-productivo', nombre: 'Prezumtiv productivo: o fi fiind bolnav, va fi plecat deja', bloque: 12, nivel: 'C1',
    descripcion: 'Presente y perfecto como marcador epistémico que sustituye a «debe de estar».',
    prereqs: ['r11-prezumtiv-receptivo'], clase: 'sin-equivalente', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'se produce desde la paráfrasis («debe de haberse ido» → va fi plecat): transformación; el calco *trebuie să fi plecat es también rumano, y por eso el ítem pide la forma del prezumtiv explícitamente', cubre: ['C1/GRAMÁTICA'],
    cita: 'Prezumtivul PRODUCTIVO, presente y perfecto, como marcador epistémico' }),
  P({ id: 'r12-formas-enfaticas', nombre: 'Formas largas y enfáticas: dânsul, însumi/însuți/însuși…, Domnia Voastră', bloque: 12, nivel: 'C1',
    descripcion: 'însumi/însuți/însuși, însămi/însăți/însăși, pl. înșine/înșivă/înșiși, însene/însevă/înseși: concuerda en género, número Y PERSONA, la única forma del rumano que lo hace. Pronombres de cortesía y formas arcaizantes receptivas.',
    prereqs: ['r10-tratamiento'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: 'un generador con «género y número» daría *eu însuși para una hablante: la persona entra en la regla; deriva por regla', cubre: ['C1/GRAMÁTICA'],
    cita: 'Formas largas y enfáticas: dânsul/dânsa, însuși/însăși/înșiși' }),
  P({ id: 'r12-dislocacion-cliticos', nombre: 'Dislocación a la izquierda con clítico de recuperación: Cartea, am citit-o ieri', bloque: 12, nivel: 'C1',
    descripcion: 'Muy productiva en rumano, transferible del español pero con otra frecuencia; estructuras escindidas (Nu Ion a spus, ci Maria).',
    prereqs: ['r6-contracciones-cliticos'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«el libro, lo he leído» transfiere y produce *Cartea, o am citit: la forma del clítico enclítico al participio (citit-o, văzut-o) se corrige desde el calco', cubre: ['C1/GRAMÁTICA'],
    cita: 'Dislocación a la izquierda con clítico de recuperación (Cartea, am citit-o ieri)' }),
  P({ id: 'r12-anteposicion-adjetivo', nombre: 'Anteposición del adjetivo: el artículo salta al adjetivo', bloque: 12, nivel: 'C1',
    descripcion: 'frumoasa poveste vs povestea frumoasă: el artículo enclítico se mueve al primer elemento del sintagma. Recurso estilístico y marca de registro elevado.',
    prereqs: ['r2-concordancia-adjetivo'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '«la hermosa historia» → *frumoasă povestea; deriva por regla', cubre: ['C1/GRAMÁTICA', 'C2/GRAMÁTICA'],
    cita: 'anteposición del adjetivo como recurso estilístico (frumoasa poveste vs povestea frumoasă)' }),
  P({ id: 'r12-correlativas', nombre: 'Coordinación correlativa: atât… cât și, nu numai… ci și, fie… fie, ori… ori', bloque: 12, nivel: 'C1',
    descripcion: 'Léxico funcional de la coordinación correlativa; nu numai… ci și (no *dar și).',
    prereqs: ['r8-conectores-argumentativos'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'léxico funcional: flashcard de contraste; «no sólo… sino también» → ci și es el par que engaña', cubre: ['C1/GRAMÁTICA'],
    cita: 'Coordinación correlativa (atât… cât și, nu numai… ci și, fie… fie, ori… ori)' }),
  P({ id: 'r12-precision-sintagmas-densos', nombre: 'Precisión en sintagmas de máxima densidad: genitivos encadenados con relativas', bloque: 12, nivel: 'C2',
    descripcion: 'Varios genitivos, al cărui dentro de coordinaciones, prezumtiv + condicional + conjuntivo perfecto; cero errores de caso, posesivo, relativo y neutro.',
    prereqs: ['r11-cel-complejo', 'r12-prezumtiv-productivo'], clase: 'paradigma', calco: { castellano: 'bien', latinComun: 'opaco' },
    motivo: 'cadenas derivables por regla; cloze derivado con varias casillas', cubre: ['C2/GRAMÁTICA'],
    cita: 'control del sistema de caso y del artículo posesivo en sintagmas nominales de máxima densidad' }),
  P({ id: 'r12-generos-discursivos', nombre: 'Géneros: editorial, cronică, eseu, recenzie, cerere, sesizare', bloque: 12, nivel: 'B2',
    descripcion: 'Convenciones rumanas concretas de cada género; la carta formal con sus fórmulas (Subsemnatul…, Cu deosebită considerație).',
    prereqs: ['r10-tres-registros'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'producción escrita con rúbrica y mediación de registro', cubre: ['B2/PRODUCCIÓN ESCRITA · GÉNERO', 'C1/PRODUCCIÓN ESCRITA', 'C2/PRODUCCIÓN ESCRITA', 'C2/PRODUCCIÓN ESCRITA · ESTILO'],
    cita: 'Escribe una carta formal o administrativa rumana (cerere, reclamație, sesizare) con las fórmulas convencionales del género' }),
  P({ id: 'r12-argumentacion-b2', nombre: 'Argumentación con contraargumento, refutación y matización', bloque: 12, nivel: 'B2',
    descripcion: 'aș zice că, mai degrabă, în mare parte, nu neapărat, într-o oarecare măsură; texto de 350-450 palabras con ≤3 errores/100.',
    prereqs: ['r8-conectores-argumentativos'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'producción escrita con rúbrica; los matizadores se enseñan como sistema', cubre: ['B2/PRODUCCIÓN ESCRITA', 'C1/PRODUCCIÓN ESCRITA'],
    cita: 'con matización explícita (aș zice că, mai degrabă, în mare parte, nu neapărat, într-o oarecare măsură)' }),
  P({ id: 'r12-cirilico-receptivo', nombre: 'Rumano en alfabeto cirílico (pre-1860 y RSS Moldovenească), receptivo', bloque: 12, nivel: 'C2',
    descripcion: 'Tabla de correspondencias, suficiente para fuentes primarias. Choca con latin-guard: hay que hacerlo por lengua antes.',
    prereqs: ['r11-variedad-moldova'], clase: 'lexico', formato: 'cloze-con-pista', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'transliteración: flashcard de correspondencia y cloze de la forma latina; bloqueado por el guard hasta que sea por-idioma', cubre: ['C2/ESCRITURA HISTÓRICA · receptivo'],
    cita: 'Lee rumano en alfabeto cirílico (pre-1860 y publicaciones soviéticas de la RSS Moldovenească)' }),
];

/** Los puntos como `Concept` del contrato común, para `ALL_CONCEPTS`. */
export const CONCEPTOS_RO: Concept[] = PUNTOS_RO.map((p) => ({
  id: p.id, name: p.nombre, blockId: p.bloque, description: p.descripcion, prereqs: p.prereqs,
}));
