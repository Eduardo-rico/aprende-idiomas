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
//      · `castellano`: ¿el error, traducido palabra por palabra, da
//        español bien formado? Si sí, el ítem debe PRODUCIR (corrección),
//        nunca juzgar: la glosa contendría la respuesta.
//      · `latinComun`: ¿la raíz común deja acertar sin saber rumano?
//        `casă` se reconoce y el genitivo `casei` no; `a cânta` da `cânt`
//        por instinto, pero `a lucra` da `*lucr` donde va `lucrez`. Un
//        punto `transparente` mide reconocimiento si el ítem no obliga a
//        producir la forma que diverge; uno `engañoso` es el mejor
//        material de corrección: el calco es lo que el instinto produce.
//   3. Los DESCRIPTORES del currículo que cubre (`cubre`), para que un
//      test compruebe que ningún «Sabrá hacer» de sistema queda sin punto
//      y ningún punto se inventa fuera del currículo.
//
// El JUICIO BINARIO no se asigna por defecto a nada: murió en PT (E2#20)
// por una causa estructural —la glosa siempre contiene la respuesta— y
// con el latín común es aún más probable que muera. Sólo entra con un
// motivo escrito que empiece por «MEDIDO».
//
// Los ids llevan prefijo `r<bloque>-`, no `b<bloque>-`: son de OTRA lengua
// y ninguna herramienta de PT debe casarlos por accidente.
//
// El nivel se declara EN el punto, no por un mapa bloque→nivel aparte:
// en PT ese mapa se copió tres veces y las tres se desincronizaron.
import type { Concept } from '@/lib/data/curriculum-types';

export type NivelRo = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

/** Las mismas clases que `scripts/lib/formato-punto.ts` de PT, más
 *  `paradigma`: un punto cuya respuesta se DERIVA por regla (declinación,
 *  conjugación) y que por eso se examina con cloze derivado, donde el
 *  gate recalcula la forma. En PT no hacía falta: el portugués no declina. */
export type ClaseRo = 'fonologico' | 'ortografico' | 'trampa' | 'coincide' | 'sin-equivalente' | 'pragmatico' | 'lexico' | 'paradigma';

export type FormatoRo = 'escucha' | 'correccion' | 'cloze-con-pista' | 'transformacion' | 'mediacion' | 'flashcard' | 'juicio';

/** Cómo se decide el formato desde la clase. Es la tabla de PT con tres
 *  cambios: `lexico` va a flashcard (no a juicio, que está muerto),
 *  `paradigma` va a cloze derivado, y `ortografico` es una clase propia:
 *  una regla de grafía (â/î, ș con coma, che/chi) no pasa por el español
 *  —no hay calco que suene bien ni mal— y se examina eligiendo el grafema
 *  con el contexto decidiendo. Llamarla `coincide` habría sido mentir en
 *  la columna del calco. */
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
  /** ¿El calco del hispanohablante es español bien formado? */
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
  /** Sólo cuando difiere de `FORMATO_DE_CLASE_RO[clase]`; entonces
   *  `motivo` tiene que decir por qué. */
  formato?: FormatoRo;
  calco: Calco;
  /** Por qué esta clase y este formato examinan ESTE punto. */
  motivo: string;
  /** Descriptores del currículo que cubre: `<nivel>/<etiqueta>`. */
  cubre: string[];
  /** Línea del currículo de la que sale. */
  fuente: number;
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
  { id: 11, slug: 'morfosintaxis-avanzada', nombre: 'Morfosintaxis avanzada (B2-C1)' },
  { id: 12, slug: 'precision-y-estilo', nombre: 'Precisión, estilo y variación (C1-C2)' },
];

const P = (p: PuntoRo) => p;

export const PUNTOS_RO: PuntoRo[] = [
  // ── r1 · Fonología y ortografía (A1, con dos de A2) ────────────────
  P({ id: 'r1-vocales-centrales', nombre: '/ə/ y /ɨ/ frente a /a/ y /i/', bloque: 1, nivel: 'A1',
    descripcion: 'Las dos vocales centrales que el español no tiene, en oposición fonológica: masa/masă, in/în, rau/râu. Se discrimina oyendo.',
    prereqs: [], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'percepción: no hay forma escrita que juzgar; par mínimo con audio A/B, y sólo con voz validada', cubre: ['A1/FONOLOGÍA'], fuente: 473 }),
  P({ id: 'r1-palatalizacion-final', nombre: 'La -i final palatal como marca de plural y de 2.ª persona', bloque: 1, nivel: 'A1',
    descripcion: '[pomʲ], [lupʲ], [vezʲ]: la -i no es vocal plena, es rasgo del consonante anterior. Es el fallo #1 de comprensión oral del hispanohablante porque no la oye.',
    prereqs: ['r1-vocales-centrales'], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'percepción de un rasgo secundario: sólo pares de audio pom/pomi decididos de oído', cubre: ['A1/COMPRENSIÓN ORAL'], fuente: 474 }),
  P({ id: 'r1-consonantes-ausentes', nombre: 'ț ș j z v y los dígrafos ce/ci ge/gi che/chi ghe/ghi', bloque: 1, nivel: 'A1',
    descripcion: '/ts/ /ʃ/ /ʒ/ /z/ /v/ que el español no tiene o fusiona (b~v, s~z), y la lectura de los dígrafos: che = /ke/, ce = /tʃe/.',
    prereqs: [], clase: 'ortografico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'la correspondencia grafía↔sonido se examina escribiendo la grafía que se oye o eligiendo la lectura; el español no ayuda ni estorba', cubre: ['A1/FONOLOGÍA'], fuente: 488 }),
  P({ id: 'r1-ortografia-a-i', nombre: 'Ortografía: â interior, î inicial y final, sunt', bloque: 1, nivel: 'A1',
    descripcion: 'La regla DOOM3: â en interior de palabra (român, cânt), î al inicio y al final y en inicio de raíz de compuestos (început, neîncetat); «sunt», no «sînt».',
    prereqs: ['r1-vocales-centrales'], clase: 'ortografico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'elección ortográfica con regla cerrada: cloze del grafema; es además la norma que el gate de ortografía exige', cubre: ['A1/FONOLOGÍA'], fuente: 488 }),
  P({ id: 'r1-diacriticos-coma', nombre: 'ș y ț con coma, nunca con cedilla', bloque: 1, nivel: 'A1',
    descripcion: 'U+0219/U+021B frente a U+015F/U+0163: la web rumana los mezcla y el alumno debe escribir y reconocer la forma normativa.',
    prereqs: [], clase: 'ortografico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'norma del proyecto; se enseña una vez y lo vigila el gate de escritura, no un lote entero', cubre: ['A1/FONOLOGÍA'], fuente: 488 }),
  P({ id: 'r1-diptongos', nombre: 'Diptongos ea, oa, ia, ie, io, iu', bloque: 1, nivel: 'A1',
    descripcion: 'seară, poartă, iarnă, ieftin: lectura y escritura de los diptongos que luego alternan en la flexión (ea→e, oa→o).',
    prereqs: [], clase: 'ortografico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'grafía que se lee y se escribe; el punto de la ALTERNANCIA va en r2, aquí sólo la forma base', cubre: ['A1/FONOLOGÍA'], fuente: 488 }),
  P({ id: 'r1-acento-lexico', nombre: 'Acento léxico libre no marcado', bloque: 1, nivel: 'A2',
    descripcion: 'La grafía no dice dónde va el acento y hay pares mínimos: cópii/copíi, véselă/vesélă, ácele/acéle. Cada lema entra con su acento.',
    prereqs: [], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el instinto pone el acento español (véselă como «vesélo»); se examina oyendo el par y eligiendo el sentido', cubre: ['A2/FONOLOGÍA'], fuente: 546 }),
  P({ id: 'r1-entonacion-pregunta', nombre: 'Entonación de la pregunta total', bloque: 1, nivel: 'A2',
    descripcion: 'La pregunta sí/no rumana no lleva partícula ni inversión: sólo el tono la distingue de la afirmación.',
    prereqs: [], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'sólo se oye: par afirmación/pregunta con la misma cadena', cubre: ['A2/FONOLOGÍA'], fuente: 546 }),
  P({ id: 'r1-habla-conectada', nombre: 'Habla conectada: elisión de -u, reducción, sinalefa', bloque: 1, nivel: 'B1',
    descripcion: 'Lo que pasa en tempo rápido: la -u final que cae, la î de apoyo, la sinalefa. Diferencia entre entender un podcast y no.',
    prereqs: ['r1-palatalizacion-final'], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'percepción a velocidad nativa; sólo con audio y sólo con voz validada', cubre: ['B1/COMPRENSIÓN ORAL'], fuente: 596 }),
  P({ id: 'r1-variedades', nombre: 'Variedades: moldava, ardeleana, olteneasca', bloque: 1, nivel: 'B1',
    descripcion: 'Palatalización moldava de labiales (bini, chept), entonación ardeleana, perfectul simplu oltenesc. Receptivo.',
    prereqs: ['r1-habla-conectada'], clase: 'fonologico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'reconocimiento de variedad por el oído; exige voces con acento regional validadas, que hoy no hay', cubre: ['B1/COMPRENSIÓN ORAL · VARIEDAD', 'C1/COMPRENSIÓN ORAL · VARIEDAD'], fuente: 596 }),

  // ── r2 · Sustantivo I (A1) ──────────────────────────────────────────
  P({ id: 'r2-genero-tres-valores', nombre: 'Género de tres valores: la prueba un…/două…', bloque: 2, nivel: 'A1',
    descripcion: 'Masculino, femenino y NEUTRO (ambigen): masculino en singular, femenino en plural. Se clasifica un sustantivo nuevo con la prueba un tren / două trenuri.',
    prereqs: [], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el español no tiene neutro y el instinto lo colapsa en masculino (tren, scaun, oraș «parecen» masculinos); se examina PRODUCIENDO las dos concordancias, singular y plural, a la vez', cubre: ['A1/GRAMÁTICA · GÉNERO'], fuente: 478 }),
  P({ id: 'r2-articulo-indefinido', nombre: 'un / o / niște', bloque: 2, nivel: 'A1',
    descripcion: 'El indefinido antepuesto, con el plural niște que el español no tiene como artículo.',
    prereqs: ['r2-genero-tres-valores'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'un/o se acierta por instinto: el ítem obliga a decidir el género (o casă, un tren) y el plural niște', cubre: ['A1/GRAMÁTICA · ARTÍCULO'], fuente: 477 }),
  P({ id: 'r2-articulo-enclitico-sg', nombre: 'Artículo definido enclítico, singular', bloque: 2, nivel: 'A1',
    descripcion: 'om→omul, casă→casa, floare→floarea, tren→trenul, tată→tata, ziua. El artículo no es palabra: es flexión.',
    prereqs: ['r2-genero-tres-valores'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el instinto pone «el/la» delante y deja el sustantivo desnudo (*om, *casă por «el hombre», «la casa»); la forma se deriva por regla y el gate la recalcula', cubre: ['A1/GRAMÁTICA · ARTÍCULO'], fuente: 490 }),
  P({ id: 'r2-articulo-enclitico-pl', nombre: 'Artículo definido enclítico, plural', bloque: 2, nivel: 'A1',
    descripcion: 'oamenii, casele, florile, trenurile: -i y -le sobre el plural ya formado.',
    prereqs: ['r2-articulo-enclitico-sg', 'r2-plural-i-e-uri'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'doble flexión (plural + artículo) sin nada equivalente; deriva por regla', cubre: ['A1/GRAMÁTICA · ARTÍCULO'], fuente: 490 }),
  P({ id: 'r2-plural-i-e-uri', nombre: 'Plural: -i, -e, -uri', bloque: 2, nivel: 'A1',
    descripcion: 'Las tres desinencias y su reparto por género: masculino -i, femenino -e/-i, neutro -e/-uri.',
    prereqs: ['r2-genero-tres-valores'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el instinto pone -s (*trenuri → *trens no, pero *case → *casas sí): la desinencia se deriva del lexicón por clase', cubre: ['A1/GRAMÁTICA · GÉNERO'], fuente: 490 }),
  P({ id: 'r2-alternancia-vocalica', nombre: 'Alternancias vocálicas en el plural: ea→e, oa→o, a→e, a→ă', bloque: 2, nivel: 'A2',
    descripcion: 'seară/seri, poartă/porți, fată/fete, carte/cărți. La a→e NO es predecible (masă/mese pero casă/case): la clase se almacena por lema.',
    prereqs: ['r2-plural-i-e-uri', 'r1-diptongos'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'la raíz se reconoce (poartă = puerta) y el plural no (*poarte por porți); deriva por regla desde la clase del lexicón', cubre: ['A2/FONOLOGÍA'], fuente: 490 }),
  P({ id: 'r2-alternancia-consonantica', nombre: 'Alternancias consonánticas ante -i: t→ț, d→z, s→ș, c→ci, g→gi', bloque: 2, nivel: 'A2',
    descripcion: 'băiat/băieți, brad/brazi, urs/urși, sac/saci, drag/dragi — nunca *draji. Son automáticas y se generan por regla.',
    prereqs: ['r2-plural-i-e-uri'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el instinto no muta la consonante (*bradi, *ursi); regla cerrada, gate en rojo con *draji', cubre: ['A2/FONOLOGÍA'], fuente: 490 }),
  P({ id: 'r2-concordancia-adjetivo', nombre: 'Concordancia del adjetivo, incluido el neutro', bloque: 2, nivel: 'A1',
    descripcion: 'un tren bun / două trenuri bune; adjetivo pospuesto por defecto, con las 4 formas (bun/bună/buni/bune) y las de 3 y 2 formas.',
    prereqs: ['r2-genero-tres-valores'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'bun/bună se acierta por instinto; lo que diverge es el neutro en plural (trenuri bune, no *buni) y el ítem tiene que pedir justo esa casilla', cubre: ['A1/GRAMÁTICA · GÉNERO'], fuente: 478 }),
  P({ id: 'r2-numerales-de', nombre: 'Numerales y la regla del «de» desde 20', bloque: 2, nivel: 'A1',
    descripcion: 'douăzeci DE ani, o sută DE lei; doi/două concuerda en género; 0-1.000.',
    prereqs: ['r2-genero-tres-valores'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«veinte años» sin «de» es español perfecto: el calco *douăzeci ani suena bien traducido, así que se da la frase calcada y se pide la rumana', cubre: ['A1/GRAMÁTICA · GÉNERO'], fuente: 492 }),

  // ── r3 · Verbo I (A1) ──────────────────────────────────────────────
  P({ id: 'r3-presente-4-conjugaciones', nombre: 'Presente de las 4 conjugaciones (-a, -ea, -e, -i/-î)', bloque: 3, nivel: 'A1',
    descripcion: 'a cânta, a vedea, a merge, a dormi, a coborî: las desinencias regulares de persona.',
    prereqs: [], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'cânt/cânți/cântă se acierta casi por instinto: el ítem tiene que pedir las casillas que divergen (3.ª pl. = 3.ª sg. en -a: ei cântă; -e: merg/mergem)', cubre: ['A1/GRAMÁTICA · VERBO'], fuente: 491 }),
  P({ id: 'r3-sufijo-ez-esc', nombre: 'Sufijos -ez-/-esc- (a lucra → lucrez, a citi → citesc)', bloque: 3, nivel: 'A1',
    descripcion: 'La subclase productiva con sufijo en las personas 1, 2, 3 y 6; nunca *a lucrez, que junta la partícula de infinitivo con una forma finita.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'la raíz se reconoce (lucra ~ «lucrar», citi ~ «citar») y el instinto produce *lucr, *cit; la clase se almacena por lema y la forma se deriva', cubre: ['A1/GRAMÁTICA · VERBO'], fuente: 491 }),
  P({ id: 'r3-irregulares-a1', nombre: 'Los 25 irregulares de A1: a fi, a avea, a vrea, a putea, a ști, a da, a lua, a bea, a veni, a sta…', bloque: 3, nivel: 'A1',
    descripcion: 'Presente de los irregulares de alta frecuencia; a fi como único copulativo (no hay ser/estar) y a avea como auxiliar.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'formas que se memorizan; el lexicón las lleva enteras y el cloze las pide con la persona en la pista', cubre: ['A1/GRAMÁTICA · VERBO'], fuente: 491 }),
  P({ id: 'r3-sa-vs-infinitivo', nombre: 'Conjuntivo con «să» donde el español pone infinitivo', bloque: 3, nivel: 'A1',
    descripcion: 'vreau să merg, pot să vin, trebuie să plec, îmi place să citesc: el infinitivo NO es el complemento por defecto. Desde la primera semana.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«quiero ir» es español perfecto, así que *vreau a merge suena bien calcado: se da el calco y se pide la forma con să. Diseñado para inducir el calco', cubre: ['A1/GRAMÁTICA · CONJUNTIVO'], fuente: 479 }),
  P({ id: 'r3-negacion-nu', nombre: 'Negación nu / n- y sus contracciones', bloque: 3, nivel: 'A1',
    descripcion: 'nu văd, n-am, nu-i, nu-l: negación preverbal con contracción obligatoria ante vocal y clítico.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'la posición coincide con el español; lo que se examina es la CONTRACCIÓN ortográfica (n-am, nu-i), que el calco no da', cubre: ['A1/GRAMÁTICA · VERBO'], fuente: 491 }),
  P({ id: 'r3-doble-negacion', nombre: 'Doble negación: nu văd pe nimeni', bloque: 3, nivel: 'A1',
    descripcion: 'nimeni, nimic, niciodată exigen nu: transferencia directa del español, marcada como regalo.',
    prereqs: ['r3-negacion-nu'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'el español prohíbe lo mismo («veo a nadie» está mal): se enseña como regalo con dos o tres ítems, no ocho; piso cubierto por r3-negacion-nu si sobra', cubre: ['A1/GRAMÁTICA · VERBO'], fuente: 492 }),
  P({ id: 'r3-imperativo-afirmativo', nombre: 'Imperativo afirmativo de 20 verbos frecuentes', bloque: 3, nivel: 'A1',
    descripcion: 'vino!, fă!, du-te!, spune!, ia!, dă!, stai!, veniți!: formas de 2.ª sg. y pl.',
    prereqs: ['r3-irregulares-a1'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'formas en gran parte irregulares (vino, fă, du); se derivan del lexicón y se piden con transformación desde el presente', cubre: ['A1/GRAMÁTICA · VERBO'], fuente: 491 }),
  P({ id: 'r3-perfect-compus-intro', nombre: 'Perfect compus: am + participio (fin de A1)', bloque: 3, nivel: 'A1',
    descripcion: 'am mâncat, ai văzut, a venit: auxiliar a avea + participio; los 60 participios más frecuentes.',
    prereqs: ['r3-irregulares-a1'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«he comido» transfiere la estructura pero no el auxiliar (*sunt venit por «he venido» calcado del italiano/francés que el alumno culto conoce) ni el participio (văzut, venit); deriva por regla', cubre: ['A1/GRAMÁTICA · VERBO'], fuente: 491 }),
  P({ id: 'r3-futuro-o-sa', nombre: 'Futuro coloquial «o să + conjuntivo»', bloque: 3, nivel: 'A1',
    descripcion: 'o să merg, o să vină: el futuro que se habla. «voi merge» se presenta en A2.',
    prereqs: ['r3-sa-vs-infinitivo'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'no hay nada parecido en español; se produce por transformación desde el presente', cubre: ['A1/GRAMÁTICA · CONJUNTIVO'], fuente: 491 }),

  // ── r4 · Caso y determinación (A2) ─────────────────────────────────
  P({ id: 'r4-gd-lui-formula', nombre: 'Genitivo con «lui» ante nombre propio masculino', bloque: 4, nivel: 'A1',
    descripcion: 'mașina lui Ion, cartea lui Mihai: el genitivo analítico, memorizado como fórmula en A1; el paradigma entero va en A2.',
    prereqs: ['r2-articulo-enclitico-sg'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«el coche de Ion» lleva al instinto *mașina de Ion; el ítem pide producir la construcción con lui', cubre: ['A1/GRAMÁTICA · ARTÍCULO'], fuente: 490 }),
  P({ id: 'r4-gd-indefinido', nombre: 'Genitivo-dativo indefinido: unui / unei / unor', bloque: 4, nivel: 'A2',
    descripcion: 'unui băiat, unei fete, unor oameni: el indefinido declinado, con la fete/fete alternancia del femenino (unei case, unei cărți).',
    prereqs: ['r2-articulo-indefinido', 'r2-alternancia-vocalica'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el español no declina nada: el instinto produce «de un băiat» (*de un băiat); la forma se deriva por regla y se valida contra dexonline', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 528 }),
  P({ id: 'r4-gd-definido-sg', nombre: 'Genitivo-dativo definido singular: -ului, -ei, -ii', bloque: 4, nivel: 'A2',
    descripcion: 'băiatului, fetei, cărții, casei, orașului: el enclítico declinado; el femenino toma la forma del plural (fete → fetei, cărți → cărții).',
    prereqs: ['r4-gd-indefinido', 'r2-articulo-enclitico-sg'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'casa se reconoce y casei no sale de ningún instinto: deriva por regla, y el femenino desde el plural (regla que el generador tiene que llevar escrita)', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 528 }),
  P({ id: 'r4-gd-definido-pl', nombre: 'Genitivo-dativo definido plural: -lor', bloque: 4, nivel: 'A2',
    descripcion: 'oamenilor, caselor, copiilor: -lor sobre el plural.',
    prereqs: ['r4-gd-definido-sg', 'r2-articulo-enclitico-pl'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'triple flexión (plural + artículo + caso); deriva por regla', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 528 }),
  P({ id: 'r4-dativo-oi', nombre: 'Dativo como objeto indirecto con doblado', bloque: 4, nivel: 'A2',
    descripcion: 'Îi dau Mariei cartea, le spun copiilor: el OI en GD, doblado por el clítico dativo.',
    prereqs: ['r4-gd-definido-sg'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: '«le doy a María» dobla igual: la estructura transfiere; lo que se examina es la FORMA de caso del sustantivo, con cloze cuyo contexto la determina', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 528 }),
  P({ id: 'r4-articulo-posesivo', nombre: 'Artículo posesivo/genitival al / a / ai / ale', bloque: 4, nivel: 'A2',
    descripcion: 'cartea băiatului vs o carte a băiatului; prietenul meu vs un prieten al meu. Concuerda con lo POSEÍDO y aparece cuando el genitivo no sigue inmediatamente a un sustantivo articulado.',
    prereqs: ['r4-gd-definido-sg'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'único en la Romania; el instinto lo omite (*un prieten meu) o lo concuerda con el poseedor; se produce eligiendo la forma en contextos que contrastan determinado/indeterminado', cubre: ['A2/GRAMÁTICA · POSESIVO'], fuente: 528 }),
  P({ id: 'r4-posesivos', nombre: 'Posesivos meu/mea/mei/mele y său vs lui/ei', bloque: 4, nivel: 'A2',
    descripcion: 'El posesivo concordado con lo poseído, pospuesto al sustantivo articulado (casa mea), y la alternancia său/sa vs lui/ei, trampa constante.',
    prereqs: ['r2-articulo-enclitico-sg'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«mi casa» → *mea casă suena perfecto calcado (posesivo antepuesto, sustantivo sin artículo): corrección desde el calco', cubre: ['A2/GRAMÁTICA · POSESIVO'], fuente: 528 }),
  P({ id: 'r4-demostrativos-caso', nombre: 'Demostrativos con caso y en las dos posiciones', bloque: 4, nivel: 'A2',
    descripcion: 'acest băiat / băiatul acesta; acestui băiat, acestei fete; acel/acela. Antepuesto sin artículo, pospuesto con artículo y forma larga.',
    prereqs: ['r4-gd-definido-sg'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«este chico» transfiere el antepuesto y nada más; las formas de GD y la pospuesta se derivan por regla', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 528 }),
  P({ id: 'r4-cel-proforma', nombre: 'cel / cea / cei / cele como proforma y superlativo', bloque: 4, nivel: 'A2',
    descripcion: 'cel mai bun, cel de acolo, cei doi: el artículo demostrativo, sin equivalente único en español.',
    prereqs: ['r4-demostrativos-caso'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'el superlativo «el más bueno» transfiere la idea pero no la forma; se produce por transformación (bun → cel mai bun)', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 528 }),
  P({ id: 'r4-vocativo', nombre: 'Vocativo: -e, -o, -lor y las fórmulas de cortesía', bloque: 4, nivel: 'A2',
    descripcion: 'Ioane!, băiete!, domnule!, Mario!, fraților!, domnilor!: el paradigma productivo; en A1 sólo Domnule!/Doamnă! como fórmula.',
    prereqs: ['r2-articulo-enclitico-sg'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el español no flexiona el vocativo: el instinto dice *Ion!, *băiat!; deriva por regla desde el género', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 528 }),
  P({ id: 'r4-preposicion-caida-articulo', nombre: 'Preposición de acusativo y CAÍDA del artículo', bloque: 4, nivel: 'A2',
    descripcion: 'la școală, în oraș, pe stradă, la birou: el sustantivo tras preposición va SIN artículo, salvo con determinante o con medio de transporte (cu trenul, cu mașina).',
    prereqs: ['r2-articulo-enclitico-sg'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«a la escuela», «en la ciudad» → *la școala, *în orașul: el calco con artículo suena perfecto; corrección desde el calco, y el contraejemplo cu trenul dentro del lote', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 532 }),
  P({ id: 'r4-preposiciones-gd', nombre: 'Preposiciones de genitivo y de dativo', bloque: 4, nivel: 'A2',
    descripcion: 'asupra, contra, deasupra, împotriva, înaintea, în fața (+ G); datorită, grație, mulțumită, conform, potrivit (+ D). Receptivas en A2.',
    prereqs: ['r4-gd-definido-sg'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'la preposición se reconoce (contra, conform) y el caso que rige no: cloze de la forma del sustantivo, derivada', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 532 }),

  // ── r5 · Verbo II (A2) ─────────────────────────────────────────────
  P({ id: 'r5-participios-irregulares', nombre: 'Participios irregulares del perfect compus', bloque: 5, nivel: 'A2',
    descripcion: 'făcut, spus, mers, văzut, luat, dat, stat, fost, avut, vrut, putut, știut, scris, pus: la lista completa.',
    prereqs: ['r3-perfect-compus-intro'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'la raíz se reconoce (scrie ~ escribir) y el participio no sale del instinto (*scriut por scris); lexicón + derivación', cubre: ['A2/GRAMÁTICA · PASADOS'], fuente: 530 }),
  P({ id: 'r5-imperfect', nombre: 'Imperfect: eram, făceam, mergeam', bloque: 5, nivel: 'A2',
    descripcion: 'La formación del imperfecto en las 4 conjugaciones, con el reparto aspectual presentado como transferencia del español.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'el USO transfiere (85 %); la FORMA se deriva y es lo que se examina, con las casillas que divergen (3.ª pl. -au: ei mergeau)', cubre: ['A2/GRAMÁTICA · PASADOS'], fuente: 530 }),
  P({ id: 'r5-perfect-vs-imperfect', nombre: 'Perfect compus vs imperfect: las tres excepciones', bloque: 5, nivel: 'A2',
    descripcion: 'El contraste aspectual es casi 1:1 con el español; se enseñan los contextos donde diverge, no el sistema entero.',
    prereqs: ['r5-imperfect', 'r5-participios-irregulares'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'donde coincide, el calco acierta y no se examina; el punto son sólo los contextos divergentes (REGLA_DE_CONTENIDO_DIVERGENTE): cloze con el contexto decidiendo', cubre: ['A2/GRAMÁTICA · PASADOS'], fuente: 530 }),
  P({ id: 'r5-mai-mult-ca-perfect', nombre: 'Mai-mult-ca-perfectul sintético: făcusem, mersesem', bloque: 5, nivel: 'A2',
    descripcion: 'Una sola palabra, sin auxiliar: se enseña CONTRA el «había hecho» analítico.',
    prereqs: ['r5-perfect-vs-imperfect'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'engañoso' },
    motivo: '*aveam făcut es el calco exacto de «había hecho» y suena perfecto: corrección desde el calco', cubre: ['A2/GRAMÁTICA · PASADOS'], fuente: 530 }),
  P({ id: 'r5-futuro-cuatro-registros', nombre: 'Los cuatro futuros: voi merge / o să merg / am să merg / oi merge', bloque: 5, nivel: 'A2',
    descripcion: 'Receptivos los cuatro, productivos «o să» y «voi». En B2 se vuelven elección de registro.',
    prereqs: ['r3-futuro-o-sa'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'voi/vei/va/vom/veți/vor + infinitivo sin partícula (voi merge, no *voi a merge): deriva por regla', cubre: ['A2/GRAMÁTICA · PASADOS'], fuente: 530 }),
  P({ id: 'r5-condicional', nombre: 'Condicional presente y perfecto: aș merge, aș fi mers', bloque: 5, nivel: 'A2',
    descripcion: 'aș/ai/ar/am/ați/ar + infinitivo; perfecto con fi + participio.',
    prereqs: ['r5-futuro-cuatro-registros'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'analítico donde el español es sintético (iría): deriva por regla; la elección dacă/de/să va en r11', cubre: ['A2/GRAMÁTICA · PASADOS'], fuente: 530 }),
  P({ id: 'r5-imperativo-negativo', nombre: 'Imperativo negativo con INFINITIVO: nu veni!, nu face!', bloque: 5, nivel: 'A2',
    descripcion: 'nu veni!, nu te duce!, nu spune!: el negativo no usa subjuntivo. Sin análogo español.',
    prereqs: ['r3-imperativo-afirmativo'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«no vengas» → *nu vii!/*nu să vii! suena bien calcado: corrección desde el calco, con el afirmativo al lado', cubre: ['A2/GRAMÁTICA · IMPERATIVO'], fuente: 529 }),
  P({ id: 'r5-reflexivos-ac-dat', nombre: 'Reflexivos acusativo vs dativo: mă spăl / îmi spăl mâinile', bloque: 5, nivel: 'A2',
    descripcion: 'La distinción entre el reflexivo de acusativo y el de dativo; transferencia del español, marcada como regalo.',
    prereqs: ['r6-cliticos-acusativo'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'el español distingue igual (me lavo / me lavo las manos) pero con UN pronombre; aquí hay dos formas (mă/îmi) y el cloze pide la que toca', cubre: ['A2/GRAMÁTICA · CLÍTICOS'], fuente: 530 }),

  // ── r6 · Clíticos y «pe» (A2-B1) ───────────────────────────────────
  P({ id: 'r6-cliticos-acusativo', nombre: 'Clíticos de acusativo: mă, te, îl, o, ne, vă, îi, le', bloque: 6, nivel: 'A1',
    descripcion: 'Îl văd, o văd, îi văd, le văd: formas y colocación proclítica con el verbo finito. A1 sólo la 3.ª persona en fórmulas.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'la posición transfiere; las FORMAS no (îl, îi, le con género): cloze derivado por persona/género/número', cubre: ['A1/GRAMÁTICA · VERBO'], fuente: 492 }),
  P({ id: 'r6-cliticos-dativo', nombre: 'Clíticos de dativo: îmi, îți, îi, ne, vă, le', bloque: 6, nivel: 'A1',
    descripcion: 'îmi place, îți dau, îi spun: el dativo, con la homonimia îi (dat. sg.) / îi (ac. pl.).',
    prereqs: ['r6-cliticos-acusativo'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'îmi/îți no se parecen a nada; cloze derivado', cubre: ['A1/GRAMÁTICA · VERBO'], fuente: 492 }),
  P({ id: 'r6-contracciones-cliticos', nombre: 'Contracciones ortográficas obligatorias: mi l-a dat, m-am dus, nu ți-l dau', bloque: 6, nivel: 'A2',
    descripcion: 'El orden clítico+auxiliar y la grafía con guion dependen de tiempo, polaridad y auxiliar: l-am văzut, ne-am dus, nu ni le-a spus, într-o, dintr-un.',
    prereqs: ['r6-cliticos-dativo', 'r3-perfect-compus-intro'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'no hay nada equivalente; se produce por transformación (Am văzut cartea → Am văzut-o / L-am văzut) y el gate valida por regla', cubre: ['A2/GRAMÁTICA · CLÍTICOS'], fuente: 528 }),
  P({ id: 'r6-cliticos-imperativo-gerunziu', nombre: 'Enclisis con imperativo afirmativo y gerunziu: dă-mi-l, du-te, văzându-l', bloque: 6, nivel: 'A2',
    descripcion: 'Proclítico con formas finitas, enclítico con imperativo afirmativo y gerundio; proclítico otra vez con imperativo negativo (nu te duce).',
    prereqs: ['r6-contracciones-cliticos', 'r5-imperativo-negativo'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'el español coloca igual (dámelo / no te vayas): el calco acierta la posición; se examina la FORMA del clúster (dă-mi-l, no *dă-îmi-îl) con transformación', cubre: ['A2/GRAMÁTICA · CLÍTICOS'], fuente: 532 }),
  P({ id: 'r6-doblado-cliticos', nombre: 'Doblado obligatorio del clítico', bloque: 6, nivel: 'A2',
    descripcion: 'Îl văd pe Ion, îi dau Mariei cartea: el objeto humano determinado se dobla siempre; *Văd pe Ion está mal.',
    prereqs: ['r6-pe-regla-operativa', 'r6-cliticos-acusativo'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'el español dobla el OI siempre y el OD a veces («lo veo a Juan» es dialectal): coincide en gran parte; el punto es el OD humano, donde el calco «veo a Juan» falla y se produce con cloze', cubre: ['A2/GRAMÁTICA · CLÍTICOS'], fuente: 532 }),
  P({ id: 'r6-pe-regla-operativa', nombre: 'Marcador «pe» de objeto directo', bloque: 6, nivel: 'A1',
    descripcion: 'Obligatorio con humano determinado y con pronombres (pe mine, pe cine, pe care); ausente con indefinido genérico (caut un doctor).',
    prereqs: ['r6-cliticos-acusativo'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'es la «a» personal del español casi 1:1: donde coincide no se examina; el subconjunto divergente (pe care obligatorio, pe con indefinidos específicos) va a cloze. NO a juicio: «veo a Ion» / «*Văd pe Ion» tienen la respuesta en la glosa', cubre: ['A1/GRAMÁTICA · VERBO', 'A2/GRAMÁTICA · CLÍTICOS'], fuente: 492 }),

  // ── r7 · Modo y formas no personales (B1) ──────────────────────────
  P({ id: 'r7-conjuntivo-presente', nombre: 'Conjuntivo presente completo y las irregulares de 3.ª', bloque: 7, nivel: 'B1',
    descripcion: 'să fie, să aibă, să dea, să stea, să ia, să vrea, să poată, să știe, să meargă, să facă: la 3.ª persona diverge del indicativo.',
    prereqs: ['r3-sa-vs-infinitivo'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el instinto repite el indicativo (*să merge por să meargă): la forma se deriva y el gate la recalcula', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'], fuente: 584 }),
  P({ id: 'r7-conjuntivo-perfecto', nombre: 'Conjuntivo perfecto: să fi mers', bloque: 7, nivel: 'B1',
    descripcion: 'să fi + participio, invariable; en subordinadas de anterioridad.',
    prereqs: ['r7-conjuntivo-presente', 'r5-participios-irregulares'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'forma invariable que el instinto conjuga (*să fiu mers); deriva por regla', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'], fuente: 584 }),
  P({ id: 'r7-disparadores-sa', nombre: 'Los ~25 disparadores del conjuntivo, en dos columnas', bloque: 7, nivel: 'B1',
    descripcion: 'Los que coinciden con el español (e posibil să, vreau ca…să, sper să, înainte să) y los que DIVERGEN: el sujeto idéntico (vreau să merg) y ca … să con sujeto expreso.',
    prereqs: ['r7-conjuntivo-presente'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'sólo la columna divergente se examina; ahí el calco (*vreau a merge, *vreau el să vină) suena bien: corrección', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'], fuente: 584 }),
  P({ id: 'r7-anti-progresivo', nombre: 'Anti-calco: *sunt mâncând no existe', bloque: 7, nivel: 'B1',
    descripcion: 'El rumano no tiene progresivo gramaticalizado: «estoy comiendo» es mănânc / tocmai mănânc / sunt pe cale să. Umbral duro de B1.',
    prereqs: ['r7-gerunziu'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: 'el calco es español perfecto y lo produce todo hispanohablante; corrección desde el calco en contextos diseñados para inducirlo. Es el único punto donde el JUICIO podría vivir (el calco es lo que suena bien), pero no se asigna sin medirlo', cubre: ['B1/GRAMÁTICA · ANTI-CALCO'], fuente: 585 }),
  P({ id: 'r7-supin', nombre: 'Supin: de făcut, mașină de spălat, e greu de crezut', bloque: 7, nivel: 'B1',
    descripcion: 'Forma no personal exclusiva del rumano: de + participio con valor de infinitivo/finalidad.',
    prereqs: ['r5-participios-irregulares'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«máquina de lavar» lleva al instinto *mașină de spăla (infinitivo): se produce por transformación', cubre: ['B1/GRAMÁTICA · FORMAS NO PERSONALES'], fuente: 586 }),
  P({ id: 'r7-gerunziu', nombre: 'Gerunziu: mergând, făcând, y su restricción', bloque: 7, nivel: 'B1',
    descripcion: 'La forma en -ând/-ind, sus usos adverbiales, y lo que NO hace: progresivo.',
    prereqs: ['r3-presente-4-conjugaciones'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'la forma se deriva (-ând/-ind según conjugación, con -ind tras palatal: fugind); el uso prohibido va en r7-anti-progresivo', cubre: ['B1/GRAMÁTICA · FORMAS NO PERSONALES'], fuente: 586 }),
  P({ id: 'r7-infinitivo-residual', nombre: 'Infinitivo largo y corto en sus usos residuales', bloque: 7, nivel: 'B1',
    descripcion: 'Tras preposición (înainte de a pleca, fără a spune), tras a putea (pot merge), y el largo en -re como sustantivo (mâncare, plimbare).',
    prereqs: ['r3-sa-vs-infinitivo'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'donde el infinitivo sí va, el español también lo usa: coincide; el contraste să/infinitivo por contexto se examina con cloze', cubre: ['B1/GRAMÁTICA · FORMAS NO PERSONALES'], fuente: 586 }),
  P({ id: 'r7-pasiva-impersonal', nombre: 'Pasiva con a fi, pasiva refleja e impersonal', bloque: 7, nivel: 'B1',
    descripcion: 'este făcut, a fost construit (concordado); se face, se vinde; zice lumea, se spune că.',
    prereqs: ['r5-participios-irregulares'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'el español tiene las tres; el calco acierta; se examina la concordancia del participio con transformación activa→pasiva', formato: 'transformacion', cubre: ['B1/GRAMÁTICA · FORMAS NO PERSONALES'], fuente: 588 }),

  // ── r8 · Sintaxis y subordinación (B1) ─────────────────────────────
  P({ id: 'r8-relativas-pe-care', nombre: 'Relativas con care y «pe care» obligatorio en OD', bloque: 8, nivel: 'B1',
    descripcion: 'omul care vine / omul pe care îl văd: el relativo objeto lleva pe y doblado. Fuente constante de error.',
    prereqs: ['r6-pe-regla-operativa', 'r6-doblado-cliticos'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«el hombre que veo» → *omul care văd es español perfecto calcado: corrección', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'], fuente: 590 }),
  P({ id: 'r8-completivas-ca-sa', nombre: 'Completivas: că vs să, y ca … să con sujeto expreso', bloque: 8, nivel: 'B1',
    descripcion: 'cred că vine / vreau să vină / vreau ca el să vină: indicativo vs conjuntivo, y la partícula ca cuando el sujeto se interpone.',
    prereqs: ['r7-disparadores-sa'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: 'que/que → că/să: el reparto indicativo/subjuntivo coincide casi entero; el subconjunto divergente (ca…să) va a cloze', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'], fuente: 590 }),
  P({ id: 'r8-circunstanciales', nombre: 'Circunstanciales: causa, concesión, tiempo, finalidad, condición', bloque: 8, nivel: 'B1',
    descripcion: 'pentru că, fiindcă, deoarece, întrucât; deși, cu toate că, chiar dacă; când, în timp ce, după ce, până când; ca să, pentru a; dacă.',
    prereqs: ['r7-conjuntivo-presente'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'conjunciones: la palabra existe o no; deși/cu toate că/chiar dacă piden indicativo donde el español pide subjuntivo tras «aunque» — ese subconjunto va a cloze', formato: 'cloze-con-pista', cubre: ['B1/PRODUCCIÓN ESCRITA'], fuente: 590 }),
  P({ id: 'r8-conectores-argumentativos', nombre: 'Conectores del texto argumentativo', bloque: 8, nivel: 'B1',
    descripcion: 'prin urmare, în schimb, pe de altă parte, cu toate acestea, de altfel, totuși: los 8+ que el descriptor exige.',
    prereqs: ['r8-circunstanciales'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'léxico funcional; se examina en producción escrita con rúbrica y con flashcard de contraste, no con juicio', cubre: ['B1/PRODUCCIÓN ESCRITA', 'B2/PRODUCCIÓN ESCRITA'], fuente: 577 }),
  P({ id: 'r8-comparativo', nombre: 'Comparativo y superlativo: mai … decât, cel mai, tot atât de', bloque: 8, nivel: 'A2',
    descripcion: 'mai bun decât, la fel de bun ca, cel mai bun: con decât/ca según el término.',
    prereqs: ['r4-cel-proforma'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«más bueno que» → *mai bun ca (ca es «como») suena perfecto: corrección', cubre: ['A2/GRAMÁTICA · CASO'], fuente: 532 }),
  P({ id: 'r8-discurso-indirecto', nombre: 'Discurso indirecto sin consecutio temporum', bloque: 8, nivel: 'B1',
    descripcion: 'A spus că vine (no *că venea): el rumano no retrasa el tiempo. Se enseña como simplificación.',
    prereqs: ['r5-perfect-vs-imperfect'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«dijo que venía» → *a spus că venea es el calco natural y suena bien: corrección', cubre: ['B1/GRAMÁTICA · CONJUNTIVO'], fuente: 590 }),

  // ── r9 · Léxico (A1-C2, ancla B1) ──────────────────────────────────
  P({ id: 'r9-nucleo-a1', nombre: 'Núcleo léxico A1 por frecuencia (600 lemas)', bloque: 9, nivel: 'A1',
    descripcion: 'Identidad, familia, números, hora, días, comida, casa, piață, transporte, cuerpo, tiempo, colores, ropa. Por frecuencia, no por lo que salga en los relatos.',
    prereqs: [], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'flashcard con lema + forma + acento; los transparentes reciben una exposición, los opacos dos', cubre: ['A1/COMPRENSIÓN LECTORA'], fuente: 494 }),
  P({ id: 'r9-opacos', nombre: 'Los lemas OPACOS: estrato eslavo, húngaro, turco, griego', bloque: 9, nivel: 'A1',
    descripcion: 'a vorbi, a citi, a trebui, a plăti, a găti, prieten, nevoie, oraș, ceas, ieftin, gata, murdar, geam, a sosi, zăpadă, poveste, veste: sin apoyo etimológico. Doble exposición en el SRS.',
    prereqs: ['r9-nucleo-a1'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'flashcard; es el 20-25 % del núcleo donde el hispanohablante no tiene regalo', cubre: ['A2/LÉXICO'], fuente: 494 }),
  P({ id: 'r9-falsos-amigos', nombre: 'Falsos amigos ES-RO', bloque: 9, nivel: 'A2',
    descripcion: 'a supăra ≠ superar, cald = caliente, larg = ancho, a merge = ir, a păstra = guardar, prost = tonto, plic = sobre, comod, a pretinde, a realiza, a suporta, a ține ≠ tener, a pleca = irse, masă, a uita vs a se uita. 30 en A2, 50 en B1, 80 en B2. «a asista la» NO es falso amigo para un hispanohablante.',
    prereqs: ['r9-nucleo-a1'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: 'el activo diferencial del proyecto: aquí la raíz común ENGAÑA por definición; flashcard de contraste con la nota, revisada por el lingüista con la sospecha de que el fichero venga del inglés', cubre: ['A2/LÉXICO', 'B2/LÉXICO'], fuente: 542 }),
  P({ id: 'r9-familias-derivativas', nombre: 'Familias derivativas: a lucra → lucru / lucrător / lucrare / a prelucra', bloque: 9, nivel: 'B1',
    descripcion: 'Sufijos -tor/-toare, -ime, -ie/-ție, -eală, -esc, -uleț/-ică/-uț; prefijos re-, ne-, des-, în-, stră-. 30 familias completas.',
    prereqs: ['r9-nucleo-a1'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'el hispanohablante multiplica aquí; se examina PRODUCIENDO el derivado desde el lema (transformación), no reconociéndolo', cubre: ['B1/LÉXICO'], fuente: 592 }),
  P({ id: 'r9-colocaciones', nombre: 'Colocaciones y unidades fraseológicas', bloque: 9, nivel: 'C1',
    descripcion: 'a lua o decizie, a-și da seama, a ține cont de, a face față, a pune la punct; a bate câmpii, a-i pica fisa, a o da în bară. 200 + 100.',
    prereqs: ['r9-familias-derivativas'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«tomar una decisión» → *a lua o decizie acierta, pero «darse cuenta» → a-și da seama no: flashcard de la unidad entera; la mediación idiomática de B2 las usa', cubre: ['C1/LÉXICO', 'B2/MEDIACIÓN · IDIOMÁTICA'], fuente: 684 }),
  P({ id: 'r9-estratos-dobletes', nombre: 'Dobletes de estrato como elección estilística', bloque: 9, nivel: 'C1',
    descripcion: 'a grăi / a vorbi / a discuta; nevastă / soție; slobod / liber; a sfârși / a termina / a finaliza; a se prăpădi / a muri / a deceda.',
    prereqs: ['r9-colocaciones'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'la rama culta es transparente y la elección es de efecto, no de gramaticalidad: mediación (reescribir en otro registro) y flashcard del triplete', cubre: ['C2/LÉXICO', 'C1/PRODUCCIÓN ESCRITA · REGISTRO'], fuente: 691 }),
  P({ id: 'r9-vocabulario-comunista', nombre: 'Vocabulario del período comunista y su reutilización irónica', bloque: 9, nivel: 'C1',
    descripcion: 'tovarăș, ședință, plan cincinal, «ca la Comitetul Central»: léxico que circula en la conversación adulta con carga irónica.',
    prereqs: ['r9-colocaciones'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'lo que se examina es leer la carga, no la palabra: mediación-explicar', cubre: ['C1/MEDIACIÓN · CULTURAL'], fuente: 695 }),
  P({ id: 'r9-referencias-culturales', nombre: 'Referencias culturales compartidas: Caragiale, 1989, mici, Dacia, mitul mioritic', bloque: 9, nivel: 'C2',
    descripcion: '50 referencias que un hablante culto reconoce sin glosa; Dracula como malentendido occidental.',
    prereqs: ['r9-vocabulario-comunista'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'mediación-explicar para un lector hispano; la alusión se explica, no se juzga', cubre: ['C2/CULTURA', 'C1/MEDIACIÓN · CULTURAL'], fuente: 737 }),

  // ── r10 · Pragmática y registro (A1-B2, ancla B1) ──────────────────
  P({ id: 'r10-tratamiento', nombre: 'tu / dumneavoastră (y dumneata, dânsul receptivos)', bloque: 10, nivel: 'A1',
    descripcion: 'Elección por situación social: panadera, jefe, abuelo, funcionario, camarero, desconocido. Tratamiento nominal domnule + cargo, doamna + apellido.',
    prereqs: [], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'lo que se juzga es adecuación, no gramaticalidad: mediación de registro (reescribir un turno para otro interlocutor)', cubre: ['A1/PRAGMÁTICA'], fuente: 496 }),
  P({ id: 'r10-saludos-formulas', nombre: 'Saludos por hora y registro, vă rog, mulțumesc, cu plăcere, scuzați, nu-i nimic', bloque: 10, nivel: 'A1',
    descripcion: 'bună dimineața / bună ziua / bună seara / salut / servus / noapte bună y las fórmulas de cortesía.',
    prereqs: [], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'fórmulas que se aprenden como piezas: flashcard con la situación', cubre: ['A1/PRAGMÁTICA'], fuente: 496 }),
  P({ id: 'r10-poftim', nombre: '«Poftim / poftiți» como multiherramienta', bloque: 10, nivel: 'A1',
    descripcion: 'Tenga, ¿cómo dice?, pase, sírvase: sin equivalente español, se enseña como pieza aparte.',
    prereqs: ['r10-saludos-formulas'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'el valor depende de la situación: mediación-explicar (qué hace poftim en este turno)', cubre: ['A1/PRAGMÁTICA'], fuente: 496 }),
  P({ id: 'r10-registro-tramite', nombre: 'Registro de la transacción y fórmulas del trámite', bloque: 10, nivel: 'A2',
    descripcion: 'magazin, farmacie, poștă, primărie, medic de familie; cierres de correo por registro (Cu stimă, Cu respect, Toate cele bune, Pupici).',
    prereqs: ['r10-tratamiento'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'adecuación al género: mediación de registro con rúbrica', cubre: ['A2/PRODUCCIÓN ESCRITA'], fuente: 548 }),
  P({ id: 'r10-diminutivo-atenuador', nombre: 'El diminutivo como atenuador cortés: o cafeluță, un pic, două minute', bloque: 10, nivel: 'A2',
    descripcion: 'Recurso muy productivo y muy rumano; -uță/-uleț/-ică con valor pragmático, no de tamaño.',
    prereqs: ['r10-registro-tramite'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'el español tiene diminutivo pero no este uso sistemático en la transacción: mediación de registro', cubre: ['A2/PRODUCCIÓN ESCRITA'], fuente: 548 }),
  P({ id: 'r10-particulas-modales', nombre: 'Partículas modales: chiar, tocmai, doar, cam, oare, ba, măcar, totuși, tot, parcă, cică', bloque: 10, nivel: 'B1',
    descripcion: 'Sin equivalente 1:1; son la marca acústica del no nativo y su valor es prosódico además de léxico. Se enseñan como sistema, con audio.',
    prereqs: ['r10-diminutivo-atenuador'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'efecto, no gramaticalidad: mediación-explicar (qué añade cam/parcă aquí) y cloze con contexto que determina la partícula donde sea determinable', cubre: ['B1/PRAGMÁTICA'], fuente: 598 }),
  P({ id: 'r10-reparacion-turno', nombre: 'Estrategias de reparación: Poftim? Adică? Vreți să spuneți că…? Cum ați zis?', bloque: 10, nivel: 'B1',
    descripcion: 'Pedir aclaración, reformular, ceder e interrumpir: las fórmulas, receptivas y en producción escrita (chat).',
    prereqs: ['r10-poftim'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'fórmulas: flashcard con la situación; la interacción oral queda fuera por decisión', cubre: ['B1/MEDIACIÓN · REGISTRO'], fuente: 598 }),
  P({ id: 'r10-tres-registros', nombre: 'Tres registros: coloquial, estándar escrito, administrativo', bloque: 10, nivel: 'B2',
    descripcion: 'Subsemnatul, Vă rog să binevoiți a, prezenta cerere, în conformitate cu prevederile; los cuatro futuros como elección consciente.',
    prereqs: ['r10-particulas-modales', 'r5-futuro-cuatro-registros'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'mediación de registro (reformular la misma información en otro registro) con rúbrica; el administrativo es opaco incluso para el B2 medio', cubre: ['B2/PRODUCCIÓN ESCRITA · GÉNERO', 'C1/PRODUCCIÓN ESCRITA · REGISTRO'], fuente: 642 }),
  P({ id: 'r10-cortesia-negativa', nombre: 'El «nu» cortés, la atenuación y el desacuerdo con preservación de imagen', bloque: 10, nivel: 'B2',
    descripcion: 'parcă, oarecum, într-un fel, cam; formas indirectas del no; interrupción aceptable vs descortés; bășcălie receptiva.',
    prereqs: ['r10-tres-registros'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'mediación intercultural: explicar por qué un «nu» cortés se leyó como sí', cubre: ['B2/MEDIACIÓN · INTERCULTURAL'], fuente: 648 }),
  P({ id: 'r10-ironia-bascalie', nombre: 'Ironía, bășcălie, understatement y sus marcas', bloque: 10, nivel: 'C1',
    descripcion: 'cică, chipurile, vezi Doamne, mă rog; entonación; la herencia de Caragiale como código compartido.',
    prereqs: ['r10-cortesia-negativa'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'detectar y justificar la marca: mediación-explicar', cubre: ['C1/PRAGMÁTICA'], fuente: 697 }),

  // ── r11 · Morfosintaxis avanzada (B2-C1) ───────────────────────────
  P({ id: 'r11-relativo-declinado', nombre: 'Relativo declinado: al cărui, a cărei, ai căror, ale căror', bloque: 11, nivel: 'B2',
    descripcion: 'omul al cărui fiu…, femeia a cărei mașină…, copiii ai căror părinți…: donde el caso y el artículo posesivo se cruzan. Separa el B1 fluido del B2 real.',
    prereqs: ['r4-articulo-posesivo', 'r8-relativas-pe-care'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«cuyo» concuerda con lo poseído; aquí al/a/ai/ale con lo poseído Y cărui/cărei con el poseedor: doble concordancia derivable por regla, cloze derivado con el gate recalculando', cubre: ['B2/GRAMÁTICA · RELATIVO'], fuente: 636 }),
  P({ id: 'r11-dativo-relativo', nombre: 'Dativo relativo: căruia, căreia, cărora', bloque: 11, nivel: 'B2',
    descripcion: 'omul căruia i-am dat cartea: relativo en dativo con doblado.',
    prereqs: ['r11-relativo-declinado'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'forma sin análogo; deriva por regla', cubre: ['B2/GRAMÁTICA · RELATIVO'], fuente: 636 }),
  P({ id: 'r11-prezumtiv-receptivo', nombre: 'Prezumtiv receptivo: o fi plecat, va fi știind, o fi având dreptate', bloque: 11, nivel: 'B2',
    descripcion: 'El modo epistémico que ninguna otra lengua romance conserva; reconocimiento del valor de suposición.',
    prereqs: ['r5-futuro-cuatro-registros', 'r7-gerunziu'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'en B2 es reconocer el VALOR: cloze de la paráfrasis («probablemente») con el contexto decidiendo, no de la forma; la producción va en r12', formato: 'cloze-con-pista', cubre: ['B2/GRAMÁTICA · MODO'], fuente: 637 }),
  P({ id: 'r11-periodo-condicional', nombre: 'Los tres períodos condicionales y dacă / de / să', bloque: 11, nivel: 'B2',
    descripcion: 'dacă aș fi știut, aș fi venit; el condicional de distanciamiento periodístico (ar fi vorba despre); dacă/de/să en la prótasis.',
    prereqs: ['r5-condicional'], clase: 'trampa', calco: { castellano: 'bien', latinComun: 'transparente' },
    motivo: '«si hubiera sabido» → *dacă aș fi știut acierta, pero «si supiera» → *dacă știam/*dacă aș ști con el condicional en las DOS cláusulas (dacă aș ști, aș veni) es donde el calco español (subjuntivo en la prótasis) suena bien y falla: corrección', cubre: ['B2/GRAMÁTICA · PERÍODO CONDICIONAL'], fuente: 638 }),
  P({ id: 'r11-aktionsart', nombre: 'Aspecto y Aktionsart lexicalizados: a se apuca de, a da să, a sta să, a tot face, a mai face', bloque: 11, nivel: 'B2',
    descripcion: 'Perífrasis y prefijos con valor aspectual (a reciti, a străbate, a se îmbolnăvi); sin equivalente sistemático.',
    prereqs: ['r7-disparadores-sa'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«ponerse a» → a se apuca de se produce, no se reconoce: transformación desde la paráfrasis', cubre: ['B2/GRAMÁTICA · MODO'], fuente: 640 }),
  P({ id: 'r11-cel-complejo', nombre: '«cel» en estructuras complejas y sintagmas densos con doble genitivo', bloque: 11, nivel: 'B2',
    descripcion: 'cel de acolo, cel ce, cel mai bun dintre, cei doi; adjetivo antepuesto como marca de registro; genitivos encadenados.',
    prereqs: ['r4-cel-proforma', 'r11-relativo-declinado'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'cadena de concordancias derivable; cloze derivado', cubre: ['B2/GRAMÁTICA · RELATIVO'], fuente: 636 }),
  P({ id: 'r11-variedad-moldova', nombre: 'Rumano de la República de Moldova: léxico, calcos rusos, sovietismos', bloque: 11, nivel: 'C1',
    descripcion: 'Mismas normas escritas, léxico diferenciado (a se odihni con valores rusos), ruso como lengua de contacto. Receptivo pleno.',
    prereqs: ['r1-variedades'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'mediación entre variedades: adaptar un texto de una a otra y explicar la diferencia', cubre: ['C1/COMPRENSIÓN ORAL · VARIEDAD', 'C2/MEDIACIÓN · ENTRE VARIEDADES'], fuente: 699 }),

  // ── r12 · Precisión, estilo y variación (C1-C2) ────────────────────
  P({ id: 'r12-perfectul-simplu', nombre: 'Perfectul simplu: făcui, făcuși, făcurăm', bloque: 12, nivel: 'C1',
    descripcion: 'Narrativo literario y conversacional oltenesc; se elige por su valor, no al azar.',
    prereqs: ['r5-perfect-vs-imperfect'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«hice» → *făcui se parece al pretérito español y engaña en las demás personas (făcuși, făcurăm); deriva por regla', cubre: ['C1/GRAMÁTICA'], fuente: 680 }),
  P({ id: 'r12-prezumtiv-productivo', nombre: 'Prezumtiv productivo: o fi fiind bolnav, va fi plecat deja', bloque: 12, nivel: 'C1',
    descripcion: 'Presente y perfecto como marcador epistémico que sustituye a «debe de estar».',
    prereqs: ['r11-prezumtiv-receptivo'], clase: 'sin-equivalente', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'se produce desde la paráfrasis («debe de haberse ido» → va fi plecat): transformación', cubre: ['C1/GRAMÁTICA'], fuente: 680 }),
  P({ id: 'r12-formas-enfaticas', nombre: 'Formas largas y enfáticas: dânsul, însuși/însăși, Domnia Voastră', bloque: 12, nivel: 'C1',
    descripcion: 'Pronombres de cortesía y de identidad con concordancia propia; formas arcaizantes receptivas.',
    prereqs: ['r10-tratamiento'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'însuși/însăși/înșiși/înseși concuerda por género y número: deriva por regla', cubre: ['C1/GRAMÁTICA'], fuente: 680 }),
  P({ id: 'r12-dislocacion-cliticos', nombre: 'Dislocación a la izquierda con clítico de recuperación: Cartea, am citit-o ieri', bloque: 12, nivel: 'C1',
    descripcion: 'Muy productiva en rumano, transferible del español pero con otra frecuencia; estructuras escindidas (Nu Ion a spus, ci Maria).',
    prereqs: ['r6-contracciones-cliticos'], clase: 'coincide', calco: { castellano: 'mal', latinComun: 'transparente' },
    motivo: '«el libro, lo leí ayer» transfiere; lo examinable es la forma del clítico enclítico al participio (citit-o, văzut-o): transformación', formato: 'transformacion', cubre: ['C1/GRAMÁTICA'], fuente: 682 }),
  P({ id: 'r12-hiperbaton-anteposicion', nombre: 'Anteposición del adjetivo y coordinación correlativa', bloque: 12, nivel: 'C1',
    descripcion: 'frumoasa poveste vs povestea frumoasă (el artículo salta al adjetivo); atât… cât și, nu numai… ci și, fie… fie.',
    prereqs: ['r2-concordancia-adjetivo'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'engañoso' },
    motivo: '«la hermosa historia» → *frumoasă povestea: el artículo enclítico se mueve al primer elemento del sintagma; deriva por regla', cubre: ['C1/GRAMÁTICA', 'C2/GRAMÁTICA'], fuente: 682 }),
  P({ id: 'r12-precision-sintagmas-densos', nombre: 'Precisión en sintagmas de máxima densidad: genitivos encadenados con relativas', bloque: 12, nivel: 'C2',
    descripcion: 'Varios genitivos, al cărui dentro de coordinaciones, prezumtiv + condicional + conjuntivo perfecto; cero errores de caso, posesivo, relativo y neutro.',
    prereqs: ['r11-cel-complejo', 'r12-prezumtiv-productivo'], clase: 'paradigma', calco: { castellano: 'no-aplica', latinComun: 'opaco' },
    motivo: 'cadenas derivables por regla; cloze derivado con varias casillas', cubre: ['C2/GRAMÁTICA'], fuente: 733 }),
  P({ id: 'r12-generos-discursivos', nombre: 'Géneros: editorial, cronică, eseu, recenzie, cerere, sesizare', bloque: 12, nivel: 'B2',
    descripcion: 'Convenciones rumanas concretas de cada género; la carta formal con sus fórmulas (Subsemnatul…, Cu deosebită considerație).',
    prereqs: ['r10-tres-registros'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'producción escrita con rúbrica y mediación de registro', cubre: ['B2/PRODUCCIÓN ESCRITA · GÉNERO', 'C1/PRODUCCIÓN ESCRITA', 'C2/PRODUCCIÓN ESCRITA', 'C2/PRODUCCIÓN ESCRITA · ESTILO'], fuente: 684 }),
  P({ id: 'r12-argumentacion-b2', nombre: 'Argumentación con contraargumento, refutación y matización', bloque: 12, nivel: 'B2',
    descripcion: 'aș zice că, mai degrabă, în mare parte, nu neapărat, într-o oarecare măsură; texto de 350-450 palabras con ≤3 errores/100.',
    prereqs: ['r8-conectores-argumentativos'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'transparente' },
    motivo: 'producción escrita con rúbrica; los matizadores se enseñan como sistema', cubre: ['B2/PRODUCCIÓN ESCRITA', 'C1/PRODUCCIÓN ESCRITA'], fuente: 639 }),
  P({ id: 'r12-cirilico-receptivo', nombre: 'Rumano en alfabeto cirílico (pre-1860 y RSS Moldovenească), receptivo', bloque: 12, nivel: 'C2',
    descripcion: 'Tabla de correspondencias, suficiente para fuentes primarias. Choca con latin-guard: hay que hacerlo por lengua antes.',
    prereqs: ['r11-variedad-moldova'], clase: 'lexico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'transliteración: flashcard de correspondencia y cloze de la forma latina; bloqueado por el guard hasta que sea por-idioma', formato: 'cloze-con-pista', cubre: ['C2/ESCRITURA HISTÓRICA · receptivo'], fuente: 749 }),
  P({ id: 'r12-lenguas-hermanas', nombre: 'Aromâna, meglenoromâna, istroromâna como perspectiva (receptivo)', bloque: 12, nivel: 'C2',
    descripcion: 'Las lenguas del grupo dacorromance, para saber qué es el rumano; sólo reconocimiento.',
    prereqs: ['r11-variedad-moldova'], clase: 'pragmatico', calco: { castellano: 'no-aplica', latinComun: 'no-aplica' },
    motivo: 'mediación-explicar; dos o tres ítems bastan: piso cero candidato si no tiene nada propio', cubre: ['C2/MEDIACIÓN · ENTRE VARIEDADES'], fuente: 759 }),
];

/** Los puntos como `Concept` del contrato común, para `ALL_CONCEPTS`. */
export const CONCEPTOS_RO: Concept[] = PUNTOS_RO.map((p) => ({
  id: p.id, name: p.nombre, blockId: p.bloque, description: p.descripcion, prereqs: p.prereqs,
}));
