// lib/data/languages/la/inventario-puntos.ts
//
// EL INVENTARIO DE PUNTOS DEL LATÍN — paso 5 de la fase G.
//
// Sin puntos no hay cobertura, y sin cobertura los «1.240 ejercicios» del
// currículo son una cota y no un plan. Cada punto nace con su FORMATO
// asignado, sus tres columnas de calco, su CITA del currículo, y —esto es
// nuevo respecto al rumano— cuatro campos que existen porque el rumano
// pagó por descubrirlos y no hay que volver a pagarlos.
//
// ── EL EJE PROPIO DEL LATÍN, y por qué las columnas del rumano no valen ─
//
// El rumano traía `castellano` («¿el error diana, calcado palabra por
// palabra, da español bien formado?»). Esa pregunta presupone que el
// alumno PRODUCE la lengua y que hay una frase española que calcar. En
// latín la vía dominante es la RECEPCIÓN: el alumno lee una frase que ya
// está escrita, y la pregunta que corresponde no es qué produce su
// instinto sino **qué LEE**.
//
// Y ahí está la dificultad maestra de esta lengua para un hispanohablante:
//
//   El español asigna la función por POSICIÓN. El latín la asigna por
//   DESINENCIA. Un lector con instinto español no obtiene una lectura
//   confusa: obtiene una **coherente y falsa**, y nada le avisa.
//
//     Fīlium pater amat.   instinto español → «el hijo ama al padre»  ✗
//                          latín            → «el padre ama al hijo»  ✓
//
// Las dos son frases españolas impecables. No hay glosa que salve, no hay
// «suena raro». Es el equivalente —y peor— del juicio binario con una L1
// cercana que mató el formato en portugués.
import type { Concept } from '@/lib/data/curriculum-types';

export type PeldanoLa = 'L1' | 'L2' | 'L3' | 'L4';

export type ClaseLa =
  | 'fonologico'      // se oye o se lee en voz alta; no hay forma escrita que juzgar
  | 'ortografico'     // regla de grafía o de cantidad
  | 'paradigma'       // la respuesta se DERIVA por regla desde el lexicón
  | 'funcion'         // la función va en la desinencia: el eje maestro
  | 'sin-equivalente' // el español no tiene la construcción
  | 'trampa'          // el español permite lo que el latín prohíbe, o al revés
  | 'lexico'
  | 'pragmatico';     // registro, género, efecto

export type FormatoLa =
  | 'cloze-derivado'      // fill_blank cuya respuesta sale del paradigma
  | 'cloze-en-glosa'      // el hueco va en la TRADUCCIÓN: mide `ordenEnganya`
  | 'transformacion'
  | 'correccion'
  | 'mediacion'
  | 'flashcard'
  | 'escucha'
  | 'juicio';

/** El formato por defecto de cada clase. Se puede sobrescribir por punto
 *  con `formato` + `motivo`, nunca en silencio. */
export const FORMATO_DE_CLASE_LA: Record<ClaseLa, FormatoLa> = {
  fonologico: 'escucha',
  ortografico: 'cloze-derivado',
  paradigma: 'cloze-derivado',
  funcion: 'cloze-en-glosa',
  'sin-equivalente': 'transformacion',
  trampa: 'correccion',
  lexico: 'flashcard',
  pragmatico: 'mediacion',
};

export interface CalcoLa {
  /** ¿Leída con el instinto POSICIONAL del español, la frase da una
   *  lectura COHERENTE Y FALSA? Si sí, el ítem tiene que obligar a
   *  PARSEAR: nunca un binario (el 50 % sale con una moneda) y nunca una
   *  glosa que contenga la respuesta. */
  ordenEnganya: 'si' | 'no' | 'no-aplica';
  /** ── LA DEFINICIÓN, en una frase, porque sin ella dos personas pueden
   *  tener razón a la vez ──
   *
   *  **`regalo` = el instinto español, aplicado a la RESPUESTA del ítem,
   *  la produce correcta o tan cerca que el error es trivial.**
   *
   *  De las dos lecturas posibles del campo se elige ésta y no «la
   *  palabra es reconocible», porque **el campo existe para repartir la
   *  enseñanza**: tiene que decir dónde está el esfuerzo, y la
   *  transparencia léxica no dice nada sobre la morfología. Que `rosa` se
   *  reconozca no ayuda a producir `rosārum`.
   *
   *  Consecuencia directa, y es la que cambió ocho casillas cuando el
   *  latinista lo señaló: **el español no tiene caso**, así que ante
   *  `rēs / reī / rem / rē` el instinto no entrega nada. No es un regalo:
   *  es un vacío, y la casilla es `sin-equivalente`. El regalo se reserva
   *  para donde el español SÍ da la forma (`amābam` → «amaba», `amō` →
   *  «amo») o la elección (el modo tras «para que»).
   *
   *  `falso-regalo` es la casilla cara: la forma se reconoce y el
   *  instinto produce lo CONTRARIO. */
  herencia: 'regalo' | 'falso-regalo' | 'opaco' | 'sin-equivalente' | 'no-aplica';
  /** En una lengua que no se habla la mayoría se examina RECIBIENDO.
   *  Declararlo cambia el formato; no declararlo fabrica ejercicios de
   *  producción que nadie va a necesitar. */
  via: 'recepcion' | 'produccion';
}

export interface PuntoLa {
  id: string;
  nombre: string;
  bloque: number;
  peldano: PeldanoLa;
  descripcion: string;
  prereqs: string[];
  clase: ClaseLa;
  formato?: FormatoLa;
  calco: CalcoLa;
  motivo: string;
  /** Descriptores del currículo que cubre: `<peldaño>/<etiqueta>`. */
  cubre: string[];
  sinDescriptor?: string;
  /** Fragmento TEXTUAL de §Latín del currículo. Un test comprueba que
   *  existe **y sólo ahí**: en rumano 85 de 103 `fuente` apuntaban a otra
   *  cosa, y un sello que no se comprueba no responde a ninguna pregunta. */
  cita: string;

  // ── Los cuatro campos que el rumano pagó por descubrir ──────────────

  /** Si la regla del punto ADMITE EXCEPCIÓN, aquí va el caso negativo.
   *  Sin un ítem cuyo error sea la SOBREAPLICACIÓN, el alumno saca 8/8
   *  sobregeneralizando y el corpus certifica que sabe algo que no sabe.
   *  En latín muerde fuerte en concordancia y orden, llenos de
   *  excepciones que el manual escolar presenta como absolutas. */
  excepcion?: string;
  /** `true` si la dificultad real del punto es que el alumno NO PRODUCE
   *  la construcción. El formato `correccion` **no puede medir la
   *  subproducción**: sólo enseña una frase mala y pide arreglarla, o sea
   *  mide lo que se pone de más y nunca lo que se deja de poner. Un punto
   *  así exige formato de producción. En latín es literal para el
   *  ablativo absoluto y el acusativo con infinitivo. */
  dificultadEsOmision?: boolean;
  /** Qué tiene que VARIAR entre los ítems del punto para que ocho no sean
   *  uno repetido ocho veces. Si la operación es invariante, ocho ítems
   *  correctos cubren un solo caso, y ningún gate por ítem lo ve. */
  varia: string;
  /** Cuando la invariancia es propiedad de la LENGUA y no del lote: el
   *  motivo escrito. El gate CUENTA y exige este campo; no bloquea,
   *  porque suspender por la señal sola suspendería lengua bien
   *  enseñada. */
  invarianciaJustificada?: string;
  /** EN QUÉ LATÍN VALE lo que el punto afirma.
   *
   *  Existe porque el ataque del latinista encontró el mejor hallazgo
   *  pedagógico del lote: el punto de falsos regalos cultos decía que
   *  **«fidēs» no es «fe»**, lo cual es cierto en Cicerón y **falso en la
   *  Vulgata** — que es la puerta de entrada declarada del curso. El
   *  alumno habría recibido en L1 el sentido cristiano y en L3 una
   *  tarjeta diciéndole que ese sentido no existe.
   *
   *  Este curso cruza **mil años de lengua**: del latín de Plauto al de
   *  Jerónimo. Una afirmación léxica sin corpus declarado es una
   *  afirmación sobre un latín que el punto no dice cuál es. Obligatorio
   *  en los puntos de clase `lexico`. */
  corpus?: 'clásico' | 'vulgata' | 'verso' | 'todo';
  /** Cuántos valores distintos tiene que cubrir el lote de este punto.
   *  Se declara sólo cuando el número importa, y **no puede pasar del
   *  piso del peldaño**: `l12-licencias` pedía cubrir SIETE licencias con
   *  un piso de SEIS, que es aritméticamente imposible y ningún gate por
   *  ítem lo habría visto.
   *
   *  Es un campo y no una heurística sobre el texto de `varia` a
   *  propósito: la primera versión del gate buscaba palabras de número y
   *  marcaba «hay siete declaradas y se cubren seis», que es correcto.
   *  Un gate que marca de más se deja de leer. */
  valoresQueCubre?: number;
  /** Cuántos ítems pide el descriptor, cuando lo dice con un número.
   *  NO es `valoresQueCubre`, que cuenta valores distintos de un paradigma
   *  y por eso va acotado por el piso; éste es el tamaño del lote y está
   *  POR ENCIMA del piso. Confundirlos hizo saltar el gate del piso con un
   *  20 contra un 8, que es el gate funcionando: son cantidades distintas.
   *  Se comprueba contra el número escrito en `cita`, que es el segundo
   *  camino: la prosa y el campo se desincronizan sin que falle nada. */
  itemsQuePide?: number;
  /** Cuando la `cita` lleva un número que NO es una cuenta de ítems —una
   *  longitud de texto, un tamaño de léxico— dice cuál es. El gate exige
   *  una de las dos: o el número es ítems y va en `itemsQuePide`, o se
   *  explica qué es. Medido antes de imponerlo: hay 6 puntos con número en
   *  la cita, 4 son cuentas y 2 no, así que un gate ciego fallaría en un
   *  tercio de los casos — y un gate que marca un tercio no lo lee nadie. */
  numeroDeLaCitaNoEsItems?: string;
  /** Lo que queda por comprobar contra fuente y bloquea la producción. */
  abierto?: string;
}

export function formatoDeLa(p: PuntoLa): FormatoLa {
  return p.formato ?? FORMATO_DE_CLASE_LA[p.clase];
}

/** Piso de cobertura: 8 ítems por punto, 6 en el peldaño más alto. */
export const PISO_LA = (p: PeldanoLa) => (p === 'L4' ? 6 : 8);

export const BLOQUES_LA: { id: number; slug: string; nombre: string }[] = [
  { id: 1, slug: 'ortografia-cantidad', nombre: 'Ortografía, cantidad vocálica y lectura eclesiástica' },
  { id: 2, slug: 'sustantivo', nombre: 'Sustantivo: las cinco declinaciones y el género' },
  { id: 3, slug: 'caso', nombre: 'El caso: la función va en la desinencia' },
  { id: 4, slug: 'adjetivo-pronombre', nombre: 'Adjetivo, grados y pronombres' },
  { id: 5, slug: 'verbo-infectum', nombre: 'Verbo I: infectum e indicativo' },
  { id: 6, slug: 'verbo-perfectum', nombre: 'Verbo II: perfectum, pasiva y deponentes' },
  { id: 7, slug: 'subjuntivo', nombre: 'Subjuntivo y sus usos' },
  { id: 8, slug: 'formas-nominales', nombre: 'Formas nominales del verbo' },
  { id: 9, slug: 'oracion-compuesta', nombre: 'Oración compuesta y oratio obliqua' },
  { id: 10, slug: 'orden-periodo', nombre: 'Orden de palabras, hipérbaton y período' },
  { id: 11, slug: 'lexico', nombre: 'Léxico: herencia, falsos regalos y estratos' },
  { id: 12, slug: 'metrica', nombre: 'Métrica y lengua poética' },
  { id: 13, slug: 'registro', nombre: 'Registro, género y variedad' },
];

/** Descriptores EN ALCANCE que este inventario no cubre por puntos, con
 *  el mecanismo que los cubre. El test exige que ningún descriptor quede
 *  ni aquí ni en `cubre`: en portugués 32 unidades de escucha se
 *  quedaron fuera sin que nadie lo dijera. */
export const DESCRIPTORES_FUERA_DEL_INVENTARIO: Record<string, string> = {
  'L1/COMPRENSIÓN LECTORA': 'biblioteca + preguntas por texto; no es un punto',
  'L2/COMPRENSIÓN LECTORA': 'biblioteca + preguntas por texto',
  'L2/COMPRENSIÓN LECTORA · EXTENSIVA': 'contador de lectura extensiva',
  'L3/COMPRENSIÓN LECTORA': 'biblioteca + preguntas de estructura argumentativa',
  'L3/COMPRENSIÓN LECTORA · EXTENSIVA': 'contador de lectura extensiva',
  'L4/COMPRENSIÓN LECTORA': 'biblioteca de verso + preguntas',
  'L4/COMPRENSIÓN LECTORA · EXTENSIVA': 'contador de lectura extensiva',
  'L1/PRODUCCIÓN ESCRITA': 'tarea con rúbrica, no punto',
  'L2/PRODUCCIÓN ESCRITA': 'tarea con rúbrica',
  'L3/PRODUCCIÓN ESCRITA': 'tarea con rúbrica',
  'L4/PRODUCCIÓN ESCRITA': 'tarea con rúbrica',
  'L1/MEDIACIÓN': 'máquina de mediación (traducción con justificación de función)',
  'L2/MEDIACIÓN': 'máquina de mediación',
  'L2/MEDIACIÓN · EXPLICAR': 'máquina de mediación-explicar',
  'L3/MEDIACIÓN': 'máquina de mediación',
  'L3/MEDIACIÓN · SÍNTESIS': 'máquina de mediación (síntesis)',
  'L4/MEDIACIÓN': 'máquina de mediación',
  'L4/MEDIACIÓN · LITERARIA': 'máquina de mediación (comentario con rúbrica)',
  // Estos dos ERAN puntos del bloque 13 y salieron del inventario: no son
  // lengua, son comentario sobre por qué el curso está ordenado como
  // está. A piso 6 gastaban DOCE ítems de L4 en metadiscurso, o sea en
  // hablar SOBRE la lengua en vez de usarla. La mediación ya los cubre.
  'L4/CULTURA': 'máquina de mediación: por qué el verso va después de la prosa y por qué lo que sigue a L4 son especializaciones y no peldaños',
};

const P = (p: PuntoLa) => p;

export const PUNTOS_LA: PuntoLa[] = [
  // ── b1 · Ortografía, cantidad y lectura eclesiástica ────────────────
  P({ id: 'l1-uv-ij', nombre: 'Convención u/v e i/j', bloque: 1, peldano: 'L1',
    descripcion: 'El proyecto distingue u de v y usa «i» para i y para j: «venit», no «uenit»; «Iesus», no «Jesus». No es tipografía: escribir «v» es lo que hace que la voz italiana produzca el /v/ eclesiástico y no el /w/ restituido.',
    prereqs: [], clase: 'ortografico', calco: { ordenEnganya: 'no-aplica', herencia: 'regalo', via: 'recepcion' },
    motivo: 'convención de grafía con regla cerrada: se enseña una vez y la vigila el gate, no un lote entero',
    cubre: ['L1/FONOLOGÍA'], cita: '`u`/`v` se distinguen; `i` sirve para `i` y para `j`',
    varia: 'la posición de la letra en la palabra y si es vocálica o consonántica',
    excepcion: 'la conversión automática u→v NO es decidible: «uolo»→«volo» pero «suus» se queda' }),

  P({ id: 'l1-eclesiastica-ce', nombre: 'Lectura eclesiástica: ce/ci, ge/gi, sc+e/i', bloque: 1, peldano: 'L1',
    descripcion: 'Cicerō = «Chíchero», descendit = «deshéndit», regem = «réyem». El italiano lo da gratis y por eso la voz funciona.',
    prereqs: ['l1-uv-ij'], clase: 'fonologico', formato: 'cloze-derivado',
    calco: { ordenEnganya: 'no-aplica', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'ESCUCHA bloqueada hasta que la batería valide la voz; hasta entonces se examina eligiendo la transcripción, que es lo que sí se puede medir por escrito',
    cubre: ['L1/FONOLOGÍA'], cita: 'pronunciación eclesiástica —`ce/ci` = /tʃe, tʃi/',
    varia: 'la vocal que sigue, porque ante a/o/u la regla NO se aplica',
    excepcion: '«ca», «co», «cu» siguen siendo /k/: un alumno que sobreaplique dirá *«chása» por «casa»' }),

  P({ id: 'l1-eclesiastica-ae', nombre: 'ae y oe se leen /e/', bloque: 1, peldano: 'L1',
    descripcion: 'caelum = «chélum», poena = «péna». Es el punto donde la voz italiana NO ayuda: el italiano no tiene la grafía «ae» y leería /ka.e/. Por eso existe la respelización.',
    prereqs: ['l1-eclesiastica-ce'], clase: 'fonologico', formato: 'cloze-derivado',
    calco: { ordenEnganya: 'no-aplica', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el instinto español lee «ae» como dos vocales, igual que el italiano; se examina eligiendo la transcripción',
    cubre: ['L1/FONOLOGÍA'], cita: '`ae`/`oe` = /e/ (*caelum* «chélum»)',
    varia: 'si el dígrafo lleva diéresis (aër, poëta), que lo rompe en dos sílabas',
    excepcion: '«aër», «poëta», «coëmō»: la diéresis marca que NO es dígrafo, y el que sobreaplique leerá *«ér»' }),

  P({ id: 'l1-eclesiastica-ti', nombre: 'ti + vocal se lee /tsi/', bloque: 1, peldano: 'L1',
    descripcion: 'grātia = «grátsia», nātiō = «natsio». El otro agujero del G2P italiano.',
    prereqs: ['l1-eclesiastica-ce'], clase: 'fonologico', formato: 'cloze-derivado',
    calco: { ordenEnganya: 'no-aplica', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el español lee «ti» como /ti/ siempre; se examina eligiendo la transcripción',
    cubre: ['L1/FONOLOGÍA'], cita: '`ti` + vocal = /tsj/ (*grātia* «grátsia»)',
    varia: 'la consonante anterior, que decide si la regla aplica',
    excepcion: 'tras s, t o x NO se aplica: «bestia», «mixtiō» siguen con /ti/. Es el caso negativo obligatorio' }),

  P({ id: 'l1-cantidad-fonemica', nombre: 'La cantidad vocálica distingue palabras', bloque: 1, peldano: 'L1',
    descripcion: 'mălus (malo) frente a mālus (manzano); vĕnit (viene) frente a vēnit (vino) — un presente y un perfecto separados por una vocal larga. El español no distingue cantidad y el alumno no la oye ni la busca.',
    prereqs: [], clase: 'ortografico', calco: { ordenEnganya: 'no-aplica', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'oposición fonémica que sólo existe si la ortografía la marca: por eso el material lleva mácrons SIEMPRE, y este punto se compara en modo sensible a la cantidad',
    cubre: ['L1/FONOLOGÍA'], cita: 'los pares que sólo se separan por cantidad (*mălus*/*mālus*, *vĕnit*/*vēnit*, *lĕvis*/*lēvis*)',
    varia: 'qué vocal lleva la cantidad y en qué sílaba, y si el par es léxico (malus) o morfológico (venit)' }),

  P({ id: 'l1-acento-penultima', nombre: 'El acento sale de la cantidad: la regla de la penúltima', bloque: 1, peldano: 'L1',
    descripcion: 'Penúltima larga → tónica (amīcus); penúltima breve → antepenúltima (dominus). El acento latino no se escribe porque se deduce, y sólo se deduce si hay mácrons.',
    prereqs: ['l1-cantidad-fonemica'], clase: 'ortografico',
    calco: { ordenEnganya: 'no-aplica', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el instinto español acentúa por la grafía y aquí no hay tilde; se deriva por regla desde la cantidad marcada',
    cubre: ['L1/FONOLOGÍA'], cita: 'Aplica la regla de la penúltima sobre 20 palabras macronizadas',
    itemsQuePide: 20,
    varia: 'la longitud de la palabra y si la penúltima es larga por naturaleza o por posición',
    excepcion: 'los bisílabos son siempre llanos, tenga la penúltima la cantidad que tenga: no hay antepenúltima donde caer' }),

  P({ id: 'l1-larga-por-posicion', nombre: 'Larga por naturaleza y larga por posición', bloque: 1, peldano: 'L1',
    descripcion: 'Una vocal breve seguida de dos consonantes cuenta como sílaba larga para el acento y para el verso: «magíster» es llana porque «gis» está cerrada por s, y «ténebrae» es esdrújula porque «br» es muta cum liquida y NO alarga.',
    prereqs: ['l1-acento-penultima'], clase: 'ortografico',
    calco: { ordenEnganya: 'no-aplica', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'regla derivable; el alumno que sólo mira el mácrón se equivoca en la mitad de las palabras',
    cubre: ['L1/FONOLOGÍA'], cita: 'sílaba larga por naturaleza y por posición',
    varia: 'el grupo consonántico, porque muta cum liquida (pa-tris) puede contar como breve',
    excepcion: 'oclusiva + líquida (tr, pr, cl…) puede NO alargar: «tenĕbrae» sigue siendo esdrújula. El manual escolar lo presenta como absoluto y no lo es' }),

  P({ id: 'l1-h-muda', nombre: 'La h es muda y no cuenta', bloque: 1, peldano: 'L1',
    descripcion: 'En la lectura eclesiástica «h» no suena y no impide la elisión ni cierra sílaba: «mihi» = «mí-i».',
    prereqs: ['l1-eclesiastica-ce'], clase: 'fonologico', formato: 'cloze-derivado',
    calco: { ordenEnganya: 'no-aplica', herencia: 'regalo', via: 'recepcion' },
    motivo: 'el español también tiene h muda: es regalo y se enseña en un ítem, no en un lote',
    cubre: ['L1/FONOLOGÍA'], cita: '`h` muda', varia: 'nada: la regla no tiene contexto',
    invarianciaJustificada: 'la operación es la misma en todos los contextos porque la regla no tiene excepción: es propiedad de la lengua, no del lote' }),

  // ── b2 · Sustantivo: las cinco declinaciones y el género ────────────
  P({ id: 'l2-genitivo-clave', nombre: 'El genitivo identifica la declinación, no el nominativo', bloque: 2, peldano: 'L1',
    descripcion: 'De «rēx» no se deduce nada; de «rēgis» sale todo el paradigma. La entrada del lexicón es lema + genitivo, y el alumno tiene que aprender a leerla así.',
    prereqs: [], clase: 'paradigma', calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'se deriva por regla desde el genitivo; el gate recalcula la forma',
    cubre: ['L1/GRAMÁTICA · DECLINACIÓN'], cita: 'Produce cualquiera de las doce formas de las cinco declinaciones a partir del lema y su genitivo',
    varia: 'la declinación y si el tema cambia entre nominativo y genitivo (rēx/rēg-, corpus/corpor-, iter/itiner-)' }),

  P({ id: 'l2-primera', nombre: 'Primera declinación y su sincretismo en -ae', bloque: 2, peldano: 'L1',
    descripcion: 'rosa, rosae. La terminación «-ae» es genitivo singular, dativo singular Y nominativo plural: tres funciones en una forma, y el contexto decide.',
    prereqs: ['l2-genitivo-clave'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el sincretismo hace que la forma sola no baste: el hueco va en la GLOSA para obligar a decidir la función con el contexto',
    cubre: ['L1/GRAMÁTICA · DECLINACIÓN'], cita: 'Las cinco declinaciones completas en singular y plural',
    varia: 'cuál de las tres funciones exige el contexto, y hay que cubrir las tres' }),

  P({ id: 'l2-segunda', nombre: 'Segunda declinación, incluidos los -er y el vocativo en -e', bloque: 2, peldano: 'L1',
    descripcion: 'dominus/dominī, puer/puerī, ager/agrī (con síncopa), vir/virī. Y el vocativo singular en «-e» (domine), una de las tres formas que rompen la igualdad con el nominativo, junto con «fīlī» y «mī».',
    prereqs: ['l2-genitivo-clave'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'deriva por regla desde el genitivo, que es lo único que dice si el tema conserva la vocal',
    cubre: ['L1/GRAMÁTICA · DECLINACIÓN'], cita: 'Las cinco declinaciones completas en singular y plural',
    varia: 'si el tema pierde la vocal (ager/agrī) o la conserva (puer/puerī), que NO se deduce del nominativo',
    excepcion: 'los temas que pierden la vocal (ager/agrī) no se deducen del nominativo, y enunciar la regla sin acotar haría derivar *«agerum». EL VOCATIVO YA NO VIVE AQUÍ: tenía tres formas irregulares metidas en este campo, justificadas con «es una sola forma», y ahora es el punto `l2-vocativo` con sus diez ítems. Es la tercera vez que el contenido real de un punto estaba dentro de la excepción de otro' }),

  P({ id: 'l2-vocativo', nombre: 'El vocativo es el nominativo — salvo en la 2.ª en -us', bloque: 2, peldano: 'L1',
    descripcion: 'MEDIDO sobre los 589 vocativos comparables de la Vulgata: el 63 % son IDÉNTICOS al nominativo, y los 217 que difieren son todos de la 2.ª declinación singular en -us. O sea que la regla es «el vocativo es el nominativo» y toda la dificultad cabe en una excepción con tres ramas: «domine» (121 veces, la forma más frecuente con diferencia), «fīlī» y no *«fīlie» para los -ius (18), y «Iesu» a la griega (9), que además es el nombre propio más frecuente del corpus. Más «mī» de «meus» (3).',
    prereqs: ['l2-segunda'], clase: 'paradigma', formato: 'cloze-derivado',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'NO nace de la frecuencia: nace de que sus tres formas irregulares estaban escondidas dentro del campo `excepcion` de `l2-segunda`, justificadas con «es una sola forma», y el alumno se las encuentra en la primera página del Evangelio. Es el patrón que ya ha mordido tres veces —el contenido real del punto estaba en la excepción—. La frecuencia sólo confirma que el argumento importa: 57,9 vocativos por 10.000 tokens en la Vulgata contra 1,6 en César, o sea 36 veces más, porque los Evangelios son discurso directo y un manual escrito para leer a César lo trata como curiosidad morfológica',
    cubre: ['L1/GRAMÁTICA · DECLINACIÓN'], cita: 'produce el vocativo de cualquier nombre en 10 ítems, con las tres ramas de la excepción cubiertas',
    itemsQuePide: 10,
    corpus: 'todo',
    varia: 'si el vocativo COINCIDE con el nominativo (que es el 63 % del corpus y hay que traerlo, o el alumno aprende que siempre cambia) o si difiere, y en ese caso cuál de las tres ramas: -e regular, -ī de los -ius, o -u de los nombres griegos',
    excepcion: 'la rama de los -ius no vale para los comunes: es de los NOMBRES PROPIOS más «fīlius» y «genius» (Allen & Greenough §49.c). Atestiguado: fīlī 20, Pompōnī 7, Cornēlī 2, Tullī 2, y *fīlie CERO' }),

  P({ id: 'l2-neutro-a', nombre: 'La -a de neutro plural: el falso regalo más caro', bloque: 2, peldano: 'L1',
    descripcion: 'templum/templa, bellum/bella, arma, castra. En español «-a» marca femenino singular; en latín marca TAMBIÉN neutro plural, y el alumno lee «arma» como «un arma» durante meses.',
    prereqs: ['l2-segunda'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'la lectura española es coherente y falsa: «bella» se lee como adjetivo femenino y es «las guerras». El hueco va en la glosa, con el número explícito',
    cubre: ['L1/LÉXICO', 'L1/GRAMÁTICA · CONCORDANCIA'], cita: '**la `-a` de neutro plural** (`arma, templa, bella, castra`)',
    varia: 'si la palabra tiene además homógrafo femenino en español (bella, arma) o no (templa), porque la trampa sólo muerde en las primeras' }),

  P({ id: 'l2-neutro-regla', nombre: 'En el neutro, nominativo y acusativo coinciden SIEMPRE', bloque: 2, peldano: 'L1',
    descripcion: 'Es la regla que salva y la que confunde: salva porque no hay que aprender dos formas, confunde porque la forma sola no dice si es sujeto u objeto.',
    prereqs: ['l2-neutro-a'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'con dos neutros en la misma frase el orden no decide y la desinencia tampoco: sólo el sentido. Es el caso extremo del eje del nivel',
    cubre: ['L1/GRAMÁTICA · CASO'], cita: 'la regla de que nominativo y acusativo coinciden siempre y el plural en `-a`',
    varia: 'si la frase tiene un neutro y un no-neutro (la desinencia del otro resuelve) o dos neutros (no resuelve nada)' }),

  P({ id: 'l2-tercera-consonante', nombre: 'Tercera declinación de tema en consonante', bloque: 2, peldano: 'L1',
    descripcion: 'rēx/rēgis, corpus/corporis, iter/itineris, homō/hominis. El tema sale del genitivo y casi nunca del nominativo.',
    prereqs: ['l2-genitivo-clave'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'opaco', via: 'produccion' },
    motivo: 'deriva por regla desde el genitivo, que es justo lo que este punto instala',
    cubre: ['L1/GRAMÁTICA · DECLINACIÓN'], cita: 'Temas en `-i` de la 3.ª',
    varia: 'cuánto cambia el tema respecto al nominativo, de nada (cōnsul) a mucho (iter/itiner-)' }),

  P({ id: 'l2-tercera-i', nombre: 'Temas en -i de la tercera y sus tres marcas', bloque: 2, peldano: 'L1',
    descripcion: 'Genitivo plural en «-ium», acusativo plural en «-īs» posible, y ablativo singular en «-ī» en los neutros: mare/marī/maria/marium.',
    prereqs: ['l2-tercera-consonante'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'opaco', via: 'produccion' },
    motivo: 'subclase productiva que deriva por regla una vez sabido que el lema es de tema en -i',
    cubre: ['L1/GRAMÁTICA · DECLINACIÓN'], cita: 'Temas en `-i` de la 3.ª',
    varia: 'las tres marcas, que no aparecen todas en cada lema',
    abierto: 'la lista de temas en -i no es deducible del nominativo: hay que fijarla lema a lema contra el treebank antes de generar' }),

  P({ id: 'l2-cuarta', nombre: 'Cuarta declinación y su choque con la segunda', bloque: 2, peldano: 'L1',
    descripcion: 'manus/manūs, exercitus/exercitūs. El nominativo en «-us» es idéntico al de la segunda y sólo el genitivo los separa — con la cantidad como única marca en «-ūs».',
    prereqs: ['l2-segunda'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    motivo: 'el alumno declina «manus» como «dominus» por analogía; se corrige derivando desde el genitivo',
    cubre: ['L1/GRAMÁTICA · DECLINACIÓN'], cita: 'Las cinco declinaciones completas en singular y plural',
    varia: 'si el lema es masculino (exercitus) o de los pocos femeninos (manus, domus)',
    excepcion: '«domus» toma formas de 2.ª junto a las de 4.ª: ablativo «domō» (66 en el treebank), acusativo plural «domōs» (13), genitivo «domī» (4) y «domōrum» (1). Es irregular y se guarda, no se deriva' }),

  P({ id: 'l2-quinta', nombre: 'Quinta declinación', bloque: 2, peldano: 'L1',
    descripcion: 'rēs/reī, diēs/diēī. Pocos lemas, femeninos salvo «diēs» y «merīdiēs», que son masculinos por defecto.',
    prereqs: ['l2-genitivo-clave'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'clase pequeña y regular: deriva por regla',
    cubre: ['L1/GRAMÁTICA · DECLINACIÓN'], cita: 'Las cinco declinaciones completas en singular y plural',
    varia: 'la cantidad de la «e» del genitivo, larga tras vocal (diēī) y breve tras consonante (reī)',
    excepcion: '«diēs» es masculino por defecto, y en singular aparece también en FEMENINO, sobre todo con día señalado o espacio de tiempo (Allen & Greenough §97.a). No es predecible: el corpus da «posterō diē» y «posterā diē» con el mismo sentido, así que no puede ser la respuesta única de un ítem' }),

  P({ id: 'l2-genero-3a', nombre: 'El género de la tercera no se deduce del nominativo', bloque: 2, peldano: 'L1',
    descripcion: 'mōns es masculino, mēns femenino, mare neutro, y las tres terminan igual de poco informativas. El género se guarda con el lema.',
    prereqs: ['l2-tercera-consonante'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'léxico puro: no hay regla, y las que dan los manuales tienen tantas excepciones que enseñarlas produce más error que no darlas',
    cubre: ['L1/LÉXICO'], cita: 'el genitivo como clave de clase y no como una forma más',
    corpus: 'todo',
    varia: 'el género y si coincide o no con el del descendiente español, que es de donde viene el error' }),

  P({ id: 'l2-plural-tantum', nombre: 'Plurales que se traducen en singular', bloque: 2, peldano: 'L1',
    descripcion: 'castra (el campamento), arma (las armas, pero también el equipo de UN soldado), litterae (la carta), copiae (las tropas). La forma es plural y el sentido no siempre.',
    prereqs: ['l2-neutro-a'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'léxico con contraste: la flashcard enfrenta el singular y el plural del mismo lema cuando existen los dos (littera/litterae)',
    cubre: ['L2/LÉXICO'], cita: '`castra` y `arma` son neutros plurales que se traducen en singular',
    corpus: 'todo',
    varia: 'si el lema tiene singular con otro sentido (littera = letra) o carece de él (castra)' }),

  P({ id: 'l2-sin-articulo', nombre: 'El latín no tiene artículo', bloque: 2, peldano: 'L1',
    descripcion: '«puella» es «una niña», «la niña» o «niña» según el contexto. El hispanohablante, que tiene artículo obligatorio, lo suple mal y sobre todo lo suple SIEMPRE igual.',
    prereqs: [], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'no se puede corregir una omisión que el latín exige: el ítem da la frase latina y pide el artículo español que el contexto impone, que es donde se ve si el alumno ha leído el contexto',
    cubre: ['L1/COMPRENSIÓN LECTORA'], cita: '`puella` es «una niña», «la niña» o «niña» según el contexto', sinDescriptor: 'el currículo lo declara en la tipología («Sin artículo») y no le da descriptor propio: se denuncia en vez de taparlo con el de al lado',
    varia: 'si el contexto pide definido, indefinido o ningún artículo — las tres tienen que aparecer' }),

  // ── b3 · El caso: la función va en la desinencia ────────────────────
  P({ id: 'l3-funcion-por-desinencia', nombre: 'La función va en la desinencia, no en la posición', bloque: 3, peldano: 'L1',
    descripcion: 'EL PUNTO CENTRAL DEL CURSO. «Fīlium pater amat» y «Pater fīlium amat» significan lo mismo, y la lectura española del primero —«el hijo ama al padre»— es coherente y falsa. Se instala MEZCLANDO los seis órdenes, mitad con el sujeto delante y mitad con el objeto: prohibir ítem a ítem los que coinciden con el español deja el objeto delante en todo el lote, y entonces «escríbelos al revés» lo acierta entero sin leer una desinencia.',
    prereqs: ['l2-genitivo-clave', 'l2-primera', 'l2-segunda'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'no hay «suena raro» que rescate al alumno: las dos lecturas son español impecable. Sólo el hueco en la glosa obliga a parsear — y sólo si el lote derrota A LA VEZ a las tres lecturas ciegas: traducir en orden, invertir y preguntarse quién haría eso',
    cubre: ['L1/GRAMÁTICA · CASO'], cita: 'dice **quién hace qué**, en 20 ítems donde el orden CONTRADICE al instinto español',
    itemsQuePide: 20,
    varia: 'el ORDEN —los SEIS, mitad con el sujeto delante y mitad con el objeto—, la declinación del par, el número y el par léxico. NO varía la conjugación del verbo: este punto examina la desinencia del NOMBRE, así que cambiar «videt» por «dūcit» no cambia ninguna operación del alumno, y meterla en la clave de unicidad aprobaba dos ítems que eran el mismo. Y NO varía la animación: los dos tienen que ser animados y sin jerarquía entre ellos, porque si uno se define por la relación que el verbo nombra —maestro/discípulo, señor/siervo— el sentido común resuelve el ítem sin desinencia' }),

  P({ id: 'l3-nominativo', nombre: 'Nominativo: sujeto y atributo', bloque: 3, peldano: 'L1',
    descripcion: 'El sujeto y, con «sum» y verbos copulativos, también el atributo: «Caesar imperātor est» lleva los dos en nominativo.',
    prereqs: ['l3-funcion-por-desinencia'], clase: 'funcion',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'con dos nominativos el orden no decide cuál es sujeto — pero en español TAMPOCO («César es general» / «general es César»), así que el instinto posicional no produce aquí ninguna lectura falsa que el español no produzca igual: `ordenEnganya` es «no». Ponerlo en «sí» era ponerlo desde la clase y no desde el error',
    cubre: ['L1/GRAMÁTICA · CASO'], cita: '`sum` como cópula sin atributo en acusativo',
    varia: 'si hay uno o dos nominativos, y con dos, cuál es el sujeto',
    excepcion: 'dentro de un acusativo con infinitivo el atributo va en ACUSATIVO («dīcit Caesarem imperātōrem esse»), que es justo donde el alumno sobreaplica el nominativo' }),

  P({ id: 'l3-acusativo-od', nombre: 'Acusativo de objeto directo', bloque: 3, peldano: 'L1',
    descripcion: 'La función más frecuente del caso, y la que el español marca con «a» sólo cuando el objeto es humano y determinado.',
    prereqs: ['l3-funcion-por-desinencia'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'el español tiene marca de objeto pero sólo a veces, así que el instinto la busca donde no está',
    cubre: ['L1/GRAMÁTICA · CASO'], cita: 'Complemento directo, indirecto',
    varia: 'si el objeto es animado (donde el español pondría «a») o inanimado (donde no), y si el verbo lleva UN acusativo o DOS — «doceō» (113 en el treebank) y «rogō» (140) rigen dos, el de persona y el de cosa. Los dos acusativos eran un punto aparte y se fundieron aquí: no distinguía nada, porque el instinto español lee el de persona como dativo y llega a la traducción correcta por el camino equivocado' }),

  P({ id: 'l3-acusativo-extension', nombre: 'Acusativo de extensión en el espacio y en el tiempo', bloque: 3, peldano: 'L2',
    descripcion: '«decem annōs rēgnāvit», «tria mīlia passuum». Sin preposición, y el español exige «durante» o nada.',
    prereqs: ['l3-acusativo-od'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'el español también pone el acusativo desnudo («reinó diez años»), así que la lectura por instinto da la traducción correcta y no hay lectura coherente y falsa. Lo que se examina es reconocer que NO es objeto directo cuando el verbo ya tiene uno',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: 'los ablativos más frecuentes (instrumento, compañía con `cum`, lugar, tiempo)',
    varia: 'si es extensión temporal o espacial, y si el verbo admite además un objeto directo en la misma frase' }),

  P({ id: 'l3-genitivo-posesivo', nombre: 'Genitivo posesivo y de pertenencia', bloque: 3, peldano: 'L1',
    descripcion: '«liber puerī», el libro del niño. Es el caso más transparente para un hispanohablante.',
    prereqs: ['l3-funcion-por-desinencia'], clase: 'funcion',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'transparente: se examina derivando la forma, no la función',
    cubre: ['L1/GRAMÁTICA · CASO'], cita: 'Los seis casos con su función primaria',
    varia: 'la posición del genitivo respecto a su núcleo, que en latín es libre' }),

  P({ id: 'l3-genitivo-partitivo', nombre: 'Genitivo partitivo y con adjetivos de cantidad', bloque: 3, peldano: 'L2',
    descripcion: '«nihil novī», «satis temporis», «multum vīnī». El español usa «de» y el alumno acierta; lo que falla es reconocerlo cuando el núcleo es un neutro singular que parece sujeto.',
    prereqs: ['l3-genitivo-posesivo'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'la trampa no es el genitivo sino el núcleo: «nihil novī» se lee como dos palabras sueltas',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: 'Los seis casos con su función primaria',
    varia: 'el núcleo: pronombre neutro, adverbio de cantidad o adjetivo sustantivado' }),

  P({ id: 'l3-dativo-ci', nombre: 'Dativo de complemento indirecto', bloque: 3, peldano: 'L1',
    descripcion: '«puerō librum dō». Regalo casi total: el español tiene dativo pronominal y la construcción transfiere.',
    prereqs: ['l3-funcion-por-desinencia'], clase: 'funcion',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'transfiere; se examina derivando la forma',
    cubre: ['L1/GRAMÁTICA · CASO'], cita: 'Complemento directo, indirecto',
    varia: 'la declinación del sustantivo, porque el sincretismo del dativo cambia con ella (-ae, -ō, -ī, -uī, -eī)' }),

  P({ id: 'l3-dativo-posesivo', nombre: 'Dativo posesivo: mihi est', bloque: 3, peldano: 'L2',
    descripcion: '«mihi liber est» = «tengo un libro». La posesión se dice con «ser» y dativo, no con «tener».',
    prereqs: ['l3-dativo-ci'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'la lectura literal —«a mí un libro es»— NO es español, así que el alumno se da cuenta de que algo falla: la dificultad es de traducción y no de parseo, y por eso `ordenEnganya` es «no». La primera versión ponía «sí» desde la clase y no desde el error, que es como se puso mal en 17 puntos del rumano',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: 'Los seis casos con su función primaria',
    varia: 'la persona del dativo y si el poseído es sujeto singular o plural' }),

  P({ id: 'l3-ablativo-abanico', nombre: 'El ablativo: un caso, siete funciones', bloque: 3, peldano: 'L1',
    descripcion: 'Instrumento, compañía, modo, causa, tiempo, lugar de donde, término de comparación — con y sin preposición. El español lo reparte entre cinco preposiciones y el alumno tiene que leerlo sin ninguna.',
    prereqs: ['l3-funcion-por-desinencia'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'una sola forma para siete relaciones: la desinencia no basta y el contexto decide. Es el segundo punto más caro del curso después de la función por desinencia',
    cubre: ['L1/GRAMÁTICA · CASO'], cita: 'el ablativo presentado desde el principio como **el caso que absorbe lo que el español reparte entre preposiciones**',
    varia: 'la función concreta, y hay que cubrir las siete: ocho ítems de instrumento son un ítem repetido ocho veces' }),

  P({ id: 'l3-ablativo-agente', nombre: 'Agente contra instrumento: la preposición depende de lo animado', bloque: 3, peldano: 'L2',
    descripcion: '«ā Caesare» (por César, animado, con preposición) frente a «gladiō» (con la espada, inanimado, sin preposición). La regla es del latín y no tiene análogo español.',
    prereqs: ['l3-ablativo-abanico'], clase: 'trampa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'el error es de PRODUCCIÓN y de sobreaplicación en las dos direcciones: poner «ā» con instrumento o quitarla con agente. Se corrige desde la frase mala',
    cubre: ['L2/GRAMÁTICA · VOZ PASIVA'], cita: 'distingue el complemento agente (`ā/ab` + ablativo, sólo con seres animados) del instrumental (ablativo sin preposición)',
    varia: 'si el ablativo es animado o inanimado, y hay que traer los dos errores: la preposición de más y la de menos',
    excepcion: 'con cosas personificadas y con el ablativo de causa eficiente («ā nātūrā») la preposición reaparece: la regla no es absoluta' }),

  P({ id: 'l3-ablativo-comparacion', nombre: 'Ablativo de comparación frente a quam', bloque: 3, peldano: 'L2',
    descripcion: '«melior frātre» = «melior quam frāter». Dos construcciones para lo mismo, y la primera no tiene marca ninguna.',
    prereqs: ['l3-ablativo-abanico'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'un ablativo suelto tras un comparativo se lee como instrumento y la frase queda plausible: «mejor con el hermano»',
    cubre: [], sinDescriptor: 'el comparativo está en el contenido lingüístico de L2 pero no tiene descriptor «Sabrá hacer»: se denuncia el hueco en vez de colgarlo de otro',
    cita: 'con el segundo término en ablativo o con `quam`',
    varia: 'cuál de las dos construcciones trae el ítem, y hay que traer las dos' }),

  P({ id: 'l3-locativo', nombre: 'Locativo y los nombres de ciudad', bloque: 3, peldano: 'L2',
    descripcion: '«Rōmae» (en Roma), «domī», «rūrī»: un caso residual que sólo sobrevive en nombres de ciudad, islas pequeñas y tres o cuatro comunes. Y los nombres de ciudad van SIN preposición también para el «a» y el «de».',
    prereqs: ['l3-ablativo-abanico'], clase: 'trampa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'error de producción por sobreaplicación de la preposición: «*in Rōmā» es el error diana y lo comete un hispanohablante por instinto',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: 'los ablativos más frecuentes (instrumento, compañía con `cum`, lugar, tiempo)',
    varia: 'si el topónimo es de la 1.ª/2.ª singular (locativo en -ae/-ī) o de la 3.ª y plural (ablativo)',
    excepcion: 'sólo las ciudades y las islas PEQUEÑAS: «in Siciliā» lleva preposición porque Sicilia es grande. La regla que el manual da como absoluta tiene aquí su caso negativo' }),

  P({ id: 'l3-sincretismo', nombre: 'Los sincretismos que hacen ambigua la forma', bloque: 3, peldano: 'L2',
    descripcion: '«-ae» vale genitivo, dativo y nominativo plural; «-īs» vale dativo y ablativo plural; «-a» vale nominativo femenino y neutro plural. La desinencia informa, pero no siempre desambigua.',
    prereqs: ['l3-funcion-por-desinencia', 'l2-neutro-a'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'el punto enseña a usar el contexto CUANDO la desinencia no basta, que es lo contrario de lo que el resto del bloque instala: por eso va al final y no al principio',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: 'con sincretismos que multiplican la ambigüedad',
    varia: 'qué sincretismo trae el ítem y qué elemento del contexto lo resuelve (el verbo, la concordancia, la preposición)' }),

  // ── b4 · Adjetivo, grados y pronombres ──────────────────────────────
  P({ id: 'l4-concordancia', nombre: 'El adjetivo concuerda en género, número y caso — no en declinación', bloque: 4, peldano: 'L1',
    descripcion: '«rēs pūblica», «magnum opus», «omnis homō»: adjetivo y sustantivo pueden ser de declinaciones distintas y aun así concordar. El alumno busca la rima y no la hay.',
    prereqs: ['l2-genitivo-clave'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    motivo: 'deriva por regla; el error diana es concordar por terminación en vez de por rasgos',
    cubre: ['L1/GRAMÁTICA · CONCORDANCIA'], cita: 'los casos en que adjetivo y sustantivo son de declinaciones distintas (*rēs pūblica*, *magnum opus*, *omnis homō*)',
    varia: 'si las terminaciones coinciden (bonus dominus) o no (magnum opus), y hay que traer las dos: sólo la segunda mide algo',
    excepcion: 'con dos sustantivos de género distinto el adjetivo va en masculino, o concuerda con el más próximo: la regla tiene dos salidas y el manual suele dar una' }),

  P({ id: 'l4-adjetivo-3a', nombre: 'Adjetivos de la tercera: tres, dos y una terminación', bloque: 4, peldano: 'L1',
    descripcion: 'ācer/ācris/ācre, omnis/omne, fēlīx. Y todos declinan como tema en -i, con ablativo en -ī.',
    prereqs: ['l4-concordancia', 'l2-tercera-i'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'opaco', via: 'produccion' },
    motivo: 'deriva por regla una vez sabido el grupo, que se guarda con el lema',
    cubre: ['L1/GRAMÁTICA · CONCORDANCIA'], cita: 'Adjetivos de la 1.ª-2.ª y de la 3.ª',
    varia: 'el número de terminaciones del adjetivo',
    excepcion: 'los participios de presente en función verbal hacen ablativo en -e y no en -ī: la misma forma, dos declinaciones según la función' }),

  P({ id: 'l4-comparativo', nombre: 'Comparativo y superlativo, regulares e irregulares', bloque: 4, peldano: 'L2',
    descripcion: 'altior/altissimus; melior/optimus, maior/maximus, plūs/plūrimus. Los irregulares son los mismos que en español, que es un regalo poco frecuente.',
    prereqs: ['l4-adjetivo-3a'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'deriva por regla, con la lista de irregulares guardada',
    cubre: [], sinDescriptor: 'ídem: el comparativo no tiene descriptor propio en L2',
    cita: 'Comparativo y superlativo regulares e irregulares (`melior, optimus; maior, maximus; plūs, plūrimus`)',
    varia: 'si el adjetivo es regular o de la lista, y si el superlativo es en -issimus, -errimus o -illimus',
    excepcion: 'los en -er hacen superlativo en -errimus y los seis en -ilis en -illimus: el que sobreaplique -issimus dirá *«facilissimus»' }),

  P({ id: 'l4-comparativo-absoluto', nombre: 'El comparativo sin segundo término es «demasiado» o «bastante»', bloque: 4, peldano: 'L3',
    descripcion: '«altior» sin «quam» no es «más alto» sino «demasiado alto» o «bastante alto». El español no tiene ese uso y el alumno traduce «más alto» a secas, que no significa nada.',
    prereqs: ['l4-comparativo'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'la traducción literal produce español gramatical pero vacío: es el caso donde el error no se ve porque la frase «funciona»',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Comparativas',
    varia: 'si el contexto pide «demasiado» o «bastante», que son sentidos opuestos de la misma forma' }),

  P({ id: 'l4-is-ea-id', nombre: 'is/ea/id: el pronombre de tercera persona', bloque: 4, peldano: 'L1',
    descripcion: 'Hace de «él/ella/ello» y de «ese». Es el más frecuente del latín y su paradigma es irregular.',
    prereqs: ['l4-concordancia'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'paradigma irregular que se guarda entero y se deriva desde él',
    cubre: ['L1/GRAMÁTICA · PRONOMBRE'], cita: 'Identifica y traduce `is/ea/id`',
    varia: 'el caso y el género, con atención a las formas que coinciden (eius sirve para los tres géneros). AMPLIADO 2026-09-04: y la casilla compartida, que es una economía de memoria real y no la cobraba nadie. Seis series —is, hic, ille, iste, ipse, quī, más los adjetivos y numerales ūnus, tōtus, alter, nūllus— comparten genitivo en `-īus` y dativo en `-ī`, o sea que son seis paradigmas que se memorizan como uno. Va aquí y no en un punto propio porque es PRODUCCIÓN y no reconocimiento: como pista de lectura está medida y no vale —el dativo en `-ī` acierta el 5,5 % (es el de toda la 3.ª: mihi ×727, tibi ×418, sibi ×90) y el genitivo en `-īus` el 53,5 %, con `fīlius` ×162 delante—. Nota cruzada en `l4-demostrativos` y `l4-relativo`',
    excepcion: 'la economía tiene dos boquetes que el material debe avisar. (1) `hic` y `quī` ROMPEN la forma aunque conserven la marca: «huic» y «cui», no *«hīus» ni *«quīus»; el tema cambia y el alumno que generalice se equivoca justo en los dos más frecuentes (huic 66, cui 123). (2) `ego`, `tū` y `sē` NO entran en el sistema: 5.482 tokens en el corpus, de los cuales 1.365 son formas que no siguen la marca (mihi ×719, tibi ×418, sibi ×174, meī ×28, suī ×14, tuī ×12). Enseñar la casilla compartida sin decir esto invita a sobregeneralizar a los tres pronombres más usados de la lengua' }),

  P({ id: 'l4-demostrativos', nombre: 'hic, iste, ille: la deixis de tres grados', bloque: 4, peldano: 'L1',
    descripcion: 'CORREGIDO 2026-09-04 con el corpus delante. Los tres grados coinciden con «este/ese/aquel» EN EL LATÍN CLÁSICO, y ahí sí es un regalo deíctico. Pero la lectura declarada de L1 es la VULGATA, y en ella «ille» e «ipse» ya no son deícticos: son el pronombre romance de tercera persona. «ille» sujeto sale 190 veces en la Vulgata frente a 73 en Cicerón y 32 en César, y 113 frases empiezan por «at ille / at illī / at illa» —«y él dijo»—; «ipse» sujeto, 145 contra 29. Un alumno con la glosa escolar lee deixis distal o énfasis en 335 sujetos donde no hay ninguna de las dos. Es el mismo «ille» del que salen «él» y «el».',
    prereqs: ['l4-is-ea-id'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    motivo: 'deriva por regla, pero la herencia depende del CORPUS: regalo en Cicerón y falso regalo en Jerónimo, que es por donde entra el alumno. Se declara `falso-regalo` porque el campo tiene que decir lo que le pasa a ESTE lector, no lo que pasa en el latín en abstracto',
    corpus: 'todo',
    cubre: ['L1/GRAMÁTICA · PRONOMBRE'], cita: '`hic/ille/iste`',
    varia: 'el grado y el caso. La casilla compartida con las otras cinco series se cobra en `l4-is-ea-id` y aquí NO se repite: `hic` es justo la serie que rompe la forma («huic», no *«hīus»), y eso es su excepción, no su regla',
    excepcion: '«iste» tiene además valor despectivo en la oratoria («ese individuo»), que no sale del sistema deíctico' }),

  P({ id: 'l4-relativo', nombre: 'El relativo concuerda con el antecedente en género y número, y toma su caso de SU oración', bloque: 4, peldano: 'L1',
    descripcion: 'La regla de dos mitades: género y número vienen de fuera, el caso de dentro. «vir quem videō» — masculino singular por «vir», acusativo por ser objeto de «videō».',
    prereqs: ['l4-is-ea-id', 'l3-funcion-por-desinencia'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el español tiene «que» invariable, así que el alumno ignora la forma del relativo — y la forma es justo la que dice qué papel juega dentro de su oración',
    cubre: ['L1/GRAMÁTICA · PRONOMBRE'], cita: 'el relativo `quī/quae/quod` concordando con su antecedente',
    varia: 'el caso del relativo dentro de su oración, y hay que cubrir al menos nominativo, acusativo y genitivo. CON UNA ASIMETRÍA DECLARADA, medida sobre las 30 celdas usables: sólo 6 miden las dos mitades de la regla, y de los tres casos exigidos, el nominativo no tiene NINGUNA (quī = m.sg y m.pl; quae = f.sg, f.pl y n.pl; quod = nom y ac) y el genitivo sólo `quārum` (cuius es igual para los tres géneros). Se cubren los tres igual, cada ítem declara qué mitad examina, y el lote debe traer las dos: que en `cuius` el género no se lea es información que el alumno necesita al leer, no una limitación del ejercicio',
    excepcion: 'la traducción española regala el caso en genitivo, dativo y ablativo —«cuyo», «al que», «con el que»— y sólo calla en nominativo y acusativo, que es donde «que» es invariable. Así que un ítem de genitivo SINGULAR no mide nada: `cuius` no distingue el género y «cuyo» ya ha dicho el caso. Los que se conserven ahí van marcados como que enseñan sin medir' }),

  P({ id: 'l4-reflexivo', nombre: 'se/suus frente a is/eius: el reflexivo que el español no marca', bloque: 4, peldano: 'L2',
    descripcion: '«Caesar suōs mīlitēs laudat» (los suyos) frente a «Caesar eius mīlitēs laudat» (los de otro). El español dice «sus» en los dos casos.',
    prereqs: ['l4-is-ea-id'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'la distinción no existe en español, así que el alumno no la ve si nadie se la enseña, y la traducción «sus» pasa por buena en las dos',
    cubre: ['L2/GRAMÁTICA · PRONOMBRE'], cita: 'Usa el reflexivo `sē/suus` distinguiendo su referencia al sujeto de la principal frente a `is/eius`',
    varia: 'si el poseedor es el sujeto o un tercero, y hay que traer los dos o el punto no mide nada' }),

  P({ id: 'l4-reflexivo-indirecto', nombre: 'El reflexivo indirecto en la subordinada', bloque: 4, peldano: 'L3',
    descripcion: 'En oratio obliqua «sē» remite al sujeto de la principal, no al de su propia oración. Es la regla que permite seguir quién habla a lo largo de un párrafo.',
    prereqs: ['l4-reflexivo'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'sin esta regla el discurso indirecto largo es ilegible, y con ella el alumno tiene la única pista de a quién se refiere cada pronombre',
    cubre: ['L3/GRAMÁTICA · ORATIO OBLIQUA'], cita: 'El reflexivo indirecto',
    varia: 'la profundidad de la subordinación, porque a dos grados la ambigüedad reaparece' }),

  P({ id: 'l4-indefinidos', nombre: 'quis/quī tras si, nisi, nē, num', bloque: 4, peldano: 'L3',
    descripcion: 'Tras esas cuatro palabras el indefinido pierde el «ali-»: «sī quis» = «si alguien». Es una regla mecánica y muy frecuente en la prosa.',
    prereqs: ['l4-relativo'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'opaco', via: 'recepcion' },
    motivo: 'el alumno lee «quis» como interrogativo y convierte una condicional en pregunta · RECEPTIVO: no va por corrección, porque una frase mala sólo mide lo que el alumno pone de más y aquí la dificultad es de lectura',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Interrogativas indirectas dobles', sinDescriptor: 'el currículo no le da descriptor propio; se declara aquí',
    varia: 'cuál de las cuatro palabras dispara la regla' }),


  // ── b5 · Verbo I: infectum e indicativo ─────────────────────────────
  P({ id: 'l5-partes-principales', nombre: 'Las cuatro partes principales son la entrada del verbo', bloque: 5, peldano: 'L1',
    descripcion: 'amō, amāre, amāvī, amātum. De la primera sale la persona, de la segunda la conjugación, de la tercera todo el perfectum y de la cuarta los participios y el supino. No es un apéndice: es el lema.',
    prereqs: [], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'todo el paradigma verbal deriva de aquí; el gate recalcula cada forma desde las cuatro partes',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'Las CUATRO PARTES PRINCIPALES presentadas desde el primer verbo',
    varia: 'cuál de las cuatro partes se pide y cuánto se aparta el verbo del patrón regular' }),

  P({ id: 'l5-conjugacion-por-infinitivo', nombre: 'La conjugación se reconoce por la SEGUNDA parte, no por el español', bloque: 5, peldano: 'L1',
    descripcion: 'amāre (1.ª), monēre (2.ª), regere (3.ª), audīre (4.ª), capere (mixta). La cantidad de la vocal separa monēre de regere, y sin mácrón no se distinguen.',
    prereqs: ['l5-partes-principales', 'l1-cantidad-fonemica'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    motivo: 'el instinto asigna la conjugación por el descendiente español y falla: «leer» es de la 3.ª latina (legere) y no de la 2.ª, y «vender» de la 3.ª (vēndere) y no de la 2.ª',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'reconocidas por la **segunda** parte principal y no por el infinitivo español',
    varia: 'la conjugación, y hay que traer la mixta, que es la que nadie ve',
    excepcion: 'la mixta (capiō, capere) tiene infinitivo de 3.ª y presente de 4.ª: no encaja en el reparto y el que sobreaplique la conjugará entera como 3.ª' }),

  P({ id: 'l5-presente', nombre: 'Presente de indicativo activo de las cinco clases', bloque: 5, peldano: 'L1',
    descripcion: 'amō, moneō, regō, audiō, capiō. La vocal temática y sus alternancias.',
    prereqs: ['l5-conjugacion-por-infinitivo'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'deriva por regla desde la conjugación',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'Presente, imperfecto y futuro de indicativo activo',
    varia: 'la persona y la conjugación' }),

  P({ id: 'l5-imperfecto', nombre: 'Imperfecto en -bā-', bloque: 5, peldano: 'L1',
    descripcion: 'amābam, monēbam, regēbam. Un solo infijo para las cinco clases, y coincide en valor con el imperfecto español.',
    prereqs: ['l5-presente'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'regla única y valor transferible: deriva por regla',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'Presente, imperfecto y futuro de indicativo activo',
    varia: 'la conjugación, porque el infijo es -bā- en la 1.ª y la 2.ª y -ēbā- en las otras tres',
    excepcion: 'los dos verbos más frecuentes del nivel NO llevan infijo: «sum» hace «eram» (27 veces en el treebank) y «possum» hace «poteram»; «eō» hace «ībam». Un alumno que sobreaplique dirá *«esbam»' }),

  P({ id: 'l5-futuro-dos-formas', nombre: 'El futuro tiene DOS marcas según la conjugación', bloque: 5, peldano: 'L1',
    descripcion: '-bō/-bi- en la 1.ª y la 2.ª (amābō), pero -am/-ē- en la 3.ª y la 4.ª (regam, regēs). Y «regam» es a la vez futuro de indicativo y presente de subjuntivo.',
    prereqs: ['l5-imperfecto'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    motivo: 'dos reglas presentadas como una es como se fabrica un error sistemático; y la homonimia con el subjuntivo es un punto de lectura, no de producción',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'Presente, imperfecto y futuro de indicativo activo',
    varia: 'la conjugación, y hay que traer las dos marcas',
    excepcion: 'la 1.ª persona de la 3.ª y 4.ª («regam», «audiam») es idéntica al presente de subjuntivo: sólo el contexto separa' }),

  P({ id: 'l5-sum-y-compuestos', nombre: 'sum, possum y los compuestos de sum', bloque: 5, peldano: 'L1',
    descripcion: 'sum/es/est, possum (pot- + sum), adsum, absum, prōsum. Irregular, altísima frecuencia, y con la asimilación de possum como única complicación.',
    prereqs: ['l5-presente'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'paradigma guardado entero; los compuestos derivan de él',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'los irregulares del nivel (*sum, possum, eō, ferō, volō, nōlō*)',
    varia: 'el compuesto y la persona',
    excepcion: 'possum asimila ante «s» (potest, pero possum) y prōsum intercala una «d» ante vocal (prōdest): los compuestos no son todos regulares' }),

  P({ id: 'l5-irregulares', nombre: 'eō, ferō, volō, nōlō, mālō, fīō', bloque: 5, peldano: 'L1',
    descripcion: 'Los irregulares de alta frecuencia, que hay que guardar y no derivar.',
    prereqs: ['l5-sum-y-compuestos'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'opaco', via: 'produccion' },
    motivo: 'paradigmas guardados; el gate comprueba la forma contra el lexicón',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'los irregulares del nivel (*sum, possum, eō, ferō, volō, nōlō*)',
    varia: 'el verbo y la persona, cubriendo las formas más irregulares y no sólo la 1.ª singular' }),

  P({ id: 'l5-imperativo', nombre: 'Imperativo y sus cuatro irregulares', bloque: 5, peldano: 'L1',
    descripcion: 'amā/amāte. Y dīc, dūc, fac, fer, que pierden la vocal final.',
    prereqs: ['l5-presente'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'deriva por regla salvo los cuatro, que se guardan',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'Irregulares de alta frecuencia. Imperativo.',
    varia: 'si el verbo es de los cuatro irregulares o no',
    excepcion: 'en prosa clásica la prohibición no usa imperativo negativo: es «nōlī facere» o «nē fēceris». Pero en VERSO «nē» + imperativo sí aparece —«Tū nē cēde malīs», Eneida VI.95, que está en el treebank y dentro de la lectura declarada de L4—, así que el asterisco se acota a la prosa. Y el error *«nōn fac» es de ANGLÓFONO, no de hispanohablante: el inglés prohíbe con el imperativo desnudo y el español con subjuntivo («no hagas»), que está mucho más cerca de la forma correcta' }),

  P({ id: 'l5-pro-drop', nombre: 'La omisión transfiere; recuperar la persona, no', bloque: 5, peldano: 'L1',
    descripcion: 'CORREGIDO 2026-09-04 tras medirlo: decía «el español hace lo mismo: es regalo puro» y NO lo es. La OMISIÓN sí transfiere —1.397 sujetos pronominales expresos sobre 38.026 verbos finitos, el 3,67 %, y la regla de A&G se cumple en el corpus—. Lo que no transfiere es RECUPERAR la persona, y falla en tres casillas medidas. (1) El español sincretiza 1.ª y 3.ª de singular en OCHO de sus catorce paradigmas finitos —imperfecto, condicional, los dos subjuntivos y sus cuatro compuestos— y el latín en CERO de diez: «hospes eram» (Mt 25,35) y «erat clamans» (Mc 5,5) se distinguen por la desinencia y en español son las dos «era»; en la Vulgata y en los tiempos de L1 son 1.043 formas, 644 sin sujeto expreso. (2) En el español de MÉXICO no hay «vosotros», así que la 2.ª y la 3.ª del plural latinas colapsan en una sola forma —«estis» y «sunt» son las dos «son»— y ahí el latín OMITE mientras el español OBLIGA. (3) En la Vulgata «ille» e «ipse» ya son el pronombre romance y no «aquel» ni «él mismo»: 113 frases empiezan por «at ille», e «ipse» sujeto sale 145 veces contra 29 en Cicerón.',
    prereqs: ['l5-imperfecto'], clase: 'funcion', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el hueco va en la GLOSA ESPAÑOLA, o sea exactamente en la casilla donde el regalo se acaba: la desinencia latina distingue lo que la traducción funde. El prerrequisito pasa de «l5-presente» a «l5-imperfecto» porque en presente la casilla NO EXISTE («sum» y «est» no colapsan). Y se retira el «se enseña en un ítem»: eso valía cuando se creía regalo',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], sinDescriptor: 'el currículo lo cita en la tipología («pro-drop») sin descriptor propio',
    cita: 'concordancia, pro-drop: todo eso el hispanohablante lo opera desde niño',
    corpus: 'vulgata',
    varia: 'la persona, y hay que cubrir OBLIGATORIAMENTE los cuatro valores donde el español no basta: 1.ª sg y 3.ª sg del imperfecto, que el español funde, y 2.ª pl y 3.ª pl, que el español de México funde. Antes decía «si el pronombre expreso es enfático o contrastivo», que en latín es CONSTANTE: era la invariancia de verdad y estaba en el campo equivocado',
    excepcion: 'el latín pone el pronombre donde el español no lo pondría: «id» sujeto neutro (77 casos) se traduce por cero y «sē» sujeto de infinitivo (122) el español lo prohíbe. Los disparadores del pronombre expreso coinciden en DOS de tres —contraste y foco— y el que falta, la desambiguación, es el que el alumno más usa' }),

  P({ id: 'l5-negacion', nombre: 'Negación con nōn, preverbal', bloque: 5, peldano: 'L1',
    descripcion: 'nōn delante del verbo. Transfiere entero desde el español.',
    prereqs: ['l5-presente'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'la posición y el valor son los del español: se enseña con la primera frase y no necesita bloque',
    cubre: ['L1/COMPRENSIÓN LECTORA'], cita: 'Negación con `nōn`',
    varia: 'el tipo de constituyente negado (verbo, sintagma, palabra suelta)' }),

  P({ id: 'l9-negacion-multiplica', nombre: 'Dos negaciones latinas se MULTIPLICAN, no se suman', bloque: 9, peldano: 'L3',
    descripcion: '«nōn nēmō» = «alguien», «nēmō nōn» = «todo el mundo», «nōn nihil» = «algo». El orden decide el sentido, y el español hace lo contrario: suma («no vi a nadie»).',
    prereqs: ['l5-negacion'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'la lectura española suma y da una frase coherente y falsa que significa lo contrario. BAJADO DE L1 A L3 POR FRECUENCIA MEDIDA, que es el argumento bueno: «nōn nēmō» sale 0 veces en 227.301 tokens, «nēmō nōn» 1, «nōn nihil» 3. Un piso de 8 en L1 habría exigido ocho ítems de una construcción que el alumno de L1 no va a encontrar nunca',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Subordinadas de segundo y tercer grado',
    sinDescriptor: 'declarado: el currículo agrupa la negación en L1 y esta mitad no tiene descriptor propio',
    varia: 'el orden de los dos negativos, que es lo que cambia el sentido. AMPLIADO 2026-09-04: y la declinación supletiva de «nēmō», que no la cobraba ningún punto. De sus 200 tokens en el corpus, 147 son el nominativo «nēmō» —que no necesita paradigma— y quedan 53 formas oblicuas: «nēminem» ×31, «nēminī» ×21, «nēmine» ×1. Va aquí, en el punto de la palabra, en vez de abrir uno propio: 53 formas no sostienen un punto',
    excepcion: 'con «neque… neque» y con «nec» las negaciones sí se SUMAN: la multiplicación no vale para las coordinadas. Y «nēmō» no tiene genitivo propio: en 227.301 tokens de corpus no aparece NI UNO, y su sitio lo ocupa «nūllīus». Ese cero va escrito como DATO y no como hueco — es la evidencia positiva de la supleción, no una falta de cobertura' }),

  P({ id: 'l5-interrogativas', nombre: 'Las tres partículas interrogativas y lo que esperan', bloque: 5, peldano: 'L1',
    descripcion: '«-ne» pregunta neutra, «num» espera un «no», «nōnne» espera un «sí». La partícula lleva la respuesta esperada.',
    prereqs: ['l5-negacion'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'el español marca eso con entonación y con «¿verdad?»: no hay forma escrita equivalente, y el alumno lee las tres igual',
    cubre: ['L1/COMPRENSIÓN LECTORA'], cita: 'Interrogativas con `-ne`, `num`, `nōnne`',
    varia: 'la partícula, y hay que traer las tres o el punto no mide nada' }),

  // ── b6 · Verbo II: perfectum, pasiva y deponentes ───────────────────
  P({ id: 'l6-perfectum', nombre: 'El tema de perfecto y sus tres tiempos', bloque: 6, peldano: 'L1',
    descripcion: 'amāvī, amāveram, amāverō. Un solo tema, desinencias propias, y la 3.ª persona plural con dos formas (-ērunt / -ēre).',
    prereqs: ['l5-partes-principales'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'deriva por regla desde la tercera parte principal',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'perfecto, pluscuamperfecto y futuro perfecto desde el tema de perfecto',
    varia: 'el tiempo y la formación del tema (reduplicado, en -v-, en -s-, con alargamiento)',
    excepcion: '«-ēre» por «-ērunt» es normal en poesía y en Salustio: un alumno que sólo conozca «-ērunt» leerá un infinitivo' }),

  P({ id: 'l6-perfecto-doble-valor', nombre: 'El perfecto latino vale por dos tiempos españoles', bloque: 6, peldano: 'L2',
    descripcion: '«vēnī» es «vine» y «he venido». El latín no distingue aoristo de perfecto resultativo y el español sí.',
    prereqs: ['l6-perfectum'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el alumno elige siempre el mismo de los dos y la mitad de las veces produce un español raro que nadie corrige',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: 'perfecto, pluscuamperfecto y futuro perfecto desde el tema de perfecto',
    varia: 'si el contexto pide el aoristo o el resultativo, y hay que traer los dos' }),

  P({ id: 'l6-pasiva-infectum', nombre: 'Pasiva del infectum: las desinencias en -r', bloque: 6, peldano: 'L2',
    descripcion: 'amor, amāris, amātur. Un juego de desinencias nuevo, no una perífrasis.',
    prereqs: ['l5-presente'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'el español no tiene pasiva sintética: hay que aprender formas, no una construcción',
    cubre: ['L2/GRAMÁTICA · VOZ PASIVA'], cita: 'Produce y traduce la pasiva completa',
    varia: 'la persona y la conjugación',
    excepcion: 'la 2.ª singular «amāris» es homógrafa de «amārīs», ablativo plural de «amārus», y las separa SÓLO la cantidad — que es justo lo que este curso marca. La primera versión afirmaba una homonimia con el genitivo de un sustantivo de la 3.ª sin nombrar ni un lema, y el corpus no da ninguno' }),

  P({ id: 'l6-pasiva-perifrastica', nombre: 'Pasiva del perfectum: participio + sum, y el participio CONCUERDA', bloque: 6, peldano: 'L2',
    descripcion: '«amātus est». El participio concuerda con el sujeto en género y número, cosa que el español también hace, pero «est» aquí no es «es» sino «fue».',
    prereqs: ['l6-pasiva-infectum'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el error diana es leer «amātus est» como presente («es amado»): la forma es de presente y el valor de pasado. Lo produce cualquier hispanohablante · RECEPTIVO: no va por corrección, porque una frase mala sólo mide lo que el alumno pone de más y aquí la dificultad es de lectura',
    cubre: ['L2/GRAMÁTICA · VOZ PASIVA'], cita: 'incluida la perifrástica del perfecto (`amātus est`)',
    varia: 'el tiempo del auxiliar (est/erat/erit), que corre un tiempo respecto al valor' }),

  P({ id: 'l6-deponentes', nombre: 'Deponentes: forma pasiva, sentido activo', bloque: 6, peldano: 'L2',
    descripcion: 'sequor, loquor, ūtor, morior, patior, hortor. Se leen en activo aunque parezcan pasivos.',
    prereqs: ['l6-pasiva-infectum'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'la lectura pasiva da una frase coherente y falsa: «hostēs sequuntur» leído en pasiva es «los enemigos son seguidos» y significa lo contrario',
    cubre: ['L2/GRAMÁTICA · DEPONENTES'], cita: 'Traduce en activo los verbos deponentes de alta frecuencia',
    varia: 'si el deponente lleva objeto en acusativo o en ablativo (ūtor rige ablativo), que es otra trampa dentro de la misma',
    excepcion: 'los SEMIdeponentes (audeō, gaudeō, soleō, fīdō) son activos en el infectum y deponentes en el perfectum: la regla se rompe a mitad del paradigma' }),

  P({ id: 'l6-verbos-impersonales', nombre: 'Impersonales con acusativo o genitivo', bloque: 6, peldano: 'L3',
    descripcion: 'Los frecuentes de verdad, medidos en el treebank: «licet» (103) con DATIVO, «oportet» (148) con acusativo con infinitivo o subjuntivo —nunca con dativo—, y «necesse est». Los de sentimiento (paenitet, miseret, piget, pudet, taedet) suman 10 tokens en 227.301 y se mencionan sin bloque propio; el corpus usa en su lugar los deponentes personales «misereor» (34) y «paeniteō» (20).',
    prereqs: ['l6-deponentes'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el alumno busca un sujeto nominativo que no existe y lo inventa; y con «oportet» le pone dativo por analogía con «licet». El español tiene «me pesa» y «conviene que», que ayudan en parte',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Los seis casos con su función primaria', sinDescriptor: 'el currículo no le da descriptor propio; se declara',
    varia: 'el impersonal y lo que rige: dativo (licet), completiva con infinitivo o subjuntivo (oportet), genitivo de causa (paenitet)',
    excepcion: '«oportet» NO rige dativo: medido en el treebank, 117 ccomp y 11 csubj frente a UN dativo. La regla «impersonal + dativo» es de «licet» y no del grupo' }),

  // ── b7 · Subjuntivo y sus usos ──────────────────────────────────────
  P({ id: 'l7-morfologia-subj', nombre: 'Los cuatro tiempos del subjuntivo', bloque: 7, peldano: 'L2',
    descripcion: 'amem, amārem, amāverim, amāvissem. El imperfecto se forma sobre el infinitivo, que es la regla más útil y la que menos se enseña.',
    prereqs: ['l5-partes-principales'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'deriva por regla; el imperfecto desde el infinitivo, los de perfecto desde el tema de perfecto',
    cubre: ['L2/GRAMÁTICA · SUBJUNTIVO'], cita: 'Produce las cuatro formas del subjuntivo activo y pasivo de las cuatro conjugaciones',
    varia: 'el tiempo y la conjugación',
    excepcion: 'el presente de la 1.ª conjugación va en -e- (amem) y el de las otras en -a- (moneam): la vocal se invierte respecto al indicativo, y quien sobreaplique dirá *«amam»' }),

  P({ id: 'l7-no-coincide-espanol', nombre: 'El subjuntivo latino NO coincide con el español', bloque: 7, peldano: 'L2',
    descripcion: 'Aparece donde el español pone indicativo (cum histórico, interrogativa indirecta, consecutiva) y falta donde el español lo pone. El instinto romance es aquí un estorbo, no una ayuda.',
    prereqs: ['l7-morfologia-subj'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'es el punto que desmonta la ayuda que el alumno cree tener: sabe qué es un subjuntivo y por eso mismo lo aplica mal',
    cubre: ['L2/GRAMÁTICA · SUBJUNTIVO'], cita: 'aparece en subordinadas donde el español pone indicativo',
    varia: 'la construcción, y hay que traer tanto los casos donde el latín lo pone y el español no como los inversos' }),

  P({ id: 'l7-ut-final', nombre: 'Finales con ut / nē', bloque: 7, peldano: 'L2',
    descripcion: '«vēnit ut videat». Transfiere bien: el español dice «para que vea», también en subjuntivo.',
    prereqs: ['l7-morfologia-subj'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'transfiere; lo que se examina es la forma y la concordancia de tiempos, no el valor',
    cubre: ['L2/GRAMÁTICA · SUBJUNTIVO'], cita: 'Finales con `ut`/`nē`',
    varia: 'si la final es positiva o negativa, porque «nē» sustituye a «ut nōn»',
    excepcion: 'la final negativa NO se dice «ut nōn» sino «nē»: es el error de sobreaplicación obligatorio de este punto' }),

  P({ id: 'l7-ut-consecutiva', nombre: 'Consecutivas con ut y su anticipador', bloque: 7, peldano: 'L2',
    descripcion: '«tam fortis est ut vincat». La principal lleva un anticipador (tam, tantus, ita, sīc, adeō) que avisa de que viene una consecutiva.',
    prereqs: ['l7-ut-final'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el español pone INDICATIVO en la consecutiva («tan fuerte que vence») y el latín subjuntivo: el alumno lee un valor final donde hay uno consecutivo · RECEPTIVO: no va por corrección, porque una frase mala sólo mide lo que el alumno pone de más y aquí la dificultad es de lectura',
    cubre: ['L2/GRAMÁTICA · SUBJUNTIVO'], cita: 'consecutivas con `ut`',
    varia: 'el anticipador, que es la pista, y hay que traer ítems SIN anticipador para que no se resuelva por el reflejo',
    excepcion: 'la consecutiva negativa lleva «ut nōn» y NO «nē»: es exactamente al revés que la final, y quien aplique la regla de la final se equivocará siempre' }),

  P({ id: 'l7-completivas-ut', nombre: 'Completivas con ut tras verbos de voluntad', bloque: 7, peldano: 'L2',
    descripcion: '«imperat ut veniant». El español dice «ordena que vengan», también con subjuntivo: regalo.',
    prereqs: ['l7-ut-final'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'transfiere; se examina la forma',
    cubre: ['L2/GRAMÁTICA · SUBJUNTIVO'], cita: 'completivas con `ut` tras verbos de voluntad',
    varia: 'el verbo regente, porque algunos rigen infinitivo y no completiva',
    excepcion: '«iubeō» y «vetō» NO llevan «ut»: rigen acusativo con infinitivo. Un alumno que generalice dirá *«iubet ut veniant»' }),

  P({ id: 'l7-cum-historico', nombre: 'cum + subjuntivo frente a cum + indicativo', bloque: 7, peldano: 'L3',
    descripcion: 'El mismo signo con dos gramáticas: con indicativo es temporal puro; con subjuntivo es histórico, causal o concesivo, y el contexto decide cuál.',
    prereqs: ['l7-no-coincide-espanol'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el alumno lee «cum» como «con» o como «cuando» y no mira el modo, que es lo único que separa las dos gramáticas',
    cubre: ['L3/GRAMÁTICA · PERÍODO'], cita: '`Cum` histórico, causal y concesivo',
    varia: 'el valor que el contexto impone (temporal, causal, concesivo) y hay que traer los tres, más el «cum» + indicativo como control' }),

  P({ id: 'l7-interrogativa-indirecta', nombre: 'La interrogativa indirecta va en subjuntivo', bloque: 7, peldano: 'L2',
    descripcion: '«rogō quid faciās». El español pone indicativo («pregunto qué haces») y el latín subjuntivo, sin ningún matiz de duda.',
    prereqs: ['l7-no-coincide-espanol'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el subjuntivo aquí no significa nada, es puramente formal: el alumno le busca un valor y lo traduce mal · RECEPTIVO: no va por corrección, porque una frase mala sólo mide lo que el alumno pone de más y aquí la dificultad es de lectura',
    cubre: ['L2/GRAMÁTICA · SUBJUNTIVO'], cita: 'Interrogativa indirecta en subjuntivo',
    varia: 'la partícula interrogativa (quid, num, an, utrum… an)' }),

  P({ id: 'l7-consecutio', nombre: 'Concordancia de tiempos', bloque: 7, peldano: 'L3',
    descripcion: 'Principal en tiempo principal → subordinada en presente o perfecto de subjuntivo; principal en tiempo histórico → imperfecto o pluscuamperfecto.',
    prereqs: ['l7-morfologia-subj'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'deriva por regla desde el tiempo de la principal; el español tiene una regla parecida y transfiere bastante',
    cubre: ['L3/GRAMÁTICA · CONSECUTIO'], cita: 'Aplica la concordancia de tiempos',
    varia: 'el tiempo de la principal y si la subordinada es simultánea o anterior',
    excepcion: 'dos, y son justo donde el alumno saca 8/8 sobregeneralizando: la REPRAESENTATIO (el presente histórico admite secuencia primaria) y el perfecto de subjuntivo en la consecutiva tras principal histórica, para subrayar el hecho ocurrido (Allen & Greenough §482-485, §485.c)' }),

  P({ id: 'l7-condicionales', nombre: 'Los tres períodos condicionales y el irreal', bloque: 7, peldano: 'L3',
    descripcion: 'Real con indicativo; potencial con presente de subjuntivo; irreal con imperfecto (presente) o pluscuamperfecto (pasado) EN LAS DOS RAMAS.',
    prereqs: ['l7-consecutio'], clase: 'trampa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    motivo: 'el error diana medible es confundir POTENCIAL con IRREAL —*«sī habeam, dem» por «sī habērem, darem»—, porque el español usa el MISMO imperfecto de subjuntivo para los dos. La forma *«darēbam» que la primera versión de este punto daba como error diana no existe ni es formable, así que no la produce nadie',
    cubre: ['L3/GRAMÁTICA · CONDICIONALES'], cita: 'el irreal de presente va en imperfecto de subjuntivo en las DOS ramas (`sī habērem, darem`)',
    varia: 'el tipo de período, y hay que traer los tres' }),

  P({ id: 'l7-subj-independiente', nombre: 'Subjuntivo en oración independiente', bloque: 7, peldano: 'L3',
    descripcion: 'Yusivo («veniat» = que venga), potencial («dīcat aliquis» = alguien podría decir), deliberativo («quid faciam?» = ¿qué voy a hacer?), optativo con «utinam».',
    prereqs: ['l7-morfologia-subj'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el alumno espera subordinada cuando ve subjuntivo y aquí no la hay: lee una subordinada suelta y busca la principal que falta',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Subordinadas de segundo y tercer grado', sinDescriptor: 'el currículo no le da descriptor propio: se denuncia en vez de colgarlo del de la consecutio',
    varia: 'el valor, y hay que traer los cuatro' }),

  P({ id: 'l7-quominus-quin', nombre: 'quōminus y quīn tras verbos de impedir y dudar', bloque: 7, peldano: 'L3',
    descripcion: '«nōn dubitō quīn veniat». Construcción sin análogo, con la negación de la principal decidiendo la conjunción.',
    prereqs: ['l7-completivas-ut'], clase: 'sin-equivalente',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'no hay nada que calcar: se produce desde la paráfrasis',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Subordinadas de segundo y tercer grado', sinDescriptor: 'declarado: el currículo lo incluye en las subordinadas de L3 sin nombrarlo',
    varia: 'si la principal es negativa (quīn) o positiva (nē / quōminus)' }),

  // ── b8 · Formas nominales del verbo ─────────────────────────────────
  P({ id: 'l8-tres-participios', nombre: 'Los tres participios y sus tres tiempos relativos', bloque: 8, peldano: 'L2',
    descripcion: 'amāns (presente activo), amātus (perfecto pasivo), amātūrus (futuro activo). El tiempo es RELATIVO al del verbo principal, no absoluto.',
    prereqs: ['l5-partes-principales'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    motivo: 'el español sólo tiene dos participios vivos y traduce los tres con «que»: el error diana es borrar la distinción',
    cubre: ['L2/GRAMÁTICA · PARTICIPIO'], cita: 'Distingue los tres participios (presente activo, perfecto pasivo, futuro activo) por su forma',
    varia: 'el participio y el giro español que le toca, **sin usar «que» para los tres**',
    excepcion: 'los deponentes tienen participio de perfecto con sentido ACTIVO («secūtus» = habiendo seguido): la regla «participio de perfecto = pasivo» falla justo ahí' }),

  P({ id: 'l8-participio-concertado', nombre: 'Participio concertado', bloque: 8, peldano: 'L2',
    descripcion: '«mīlitēs victī fūgērunt». Concuerda con un elemento de la oración y equivale a una relativa o a una circunstancial.',
    prereqs: ['l8-tres-participios'], clase: 'sin-equivalente',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    motivo: 'el español lo tiene pero mucho menos: la dificultad es de PRODUCCIÓN, no de lectura',
    cubre: ['L2/GRAMÁTICA · PARTICIPIO'], cita: 'Participio concertado frente a absoluto',
    varia: 'con qué elemento concuerda el participio (sujeto, objeto, un ablativo)' }),

  P({ id: 'l8-ablativo-absoluto', nombre: 'Ablativo absoluto', bloque: 8, peldano: 'L2',
    descripcion: '«urbe captā, mīlitēs discessērunt». Sujeto propio, distinto del de la principal, los dos en ablativo, sin conjunción. No tiene equivalente y admite tres traducciones según el contexto.',
    prereqs: ['l8-participio-concertado', 'l3-ablativo-abanico'], clase: 'sin-equivalente',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'produccion' },
    dificultadEsOmision: true,
    motivo: 'LA DIFICULTAD ES QUE EL ALUMNO NO LO PRODUCE, no que lo produzca mal — así que el formato de corrección no puede medirlo: sólo enseña una frase mala y pide arreglarla, y aquí no hay frase mala, hay una construcción ausente. Va por transformación desde la paráfrasis',
    cubre: ['L2/GRAMÁTICA · ABLATIVO ABSOLUTO'], cita: 'lo vierte al español con **tres giros distintos según el contexto** (temporal, causal, concesivo)',
    varia: 'el valor que el contexto impone, y hay que traer los tres: ocho ablativos absolutos traducidos todos por «una vez que» son un ítem repetido ocho veces',
    excepcion: 'existe sin participio, con dos sustantivos o con un adjetivo («Cicerōne cōnsule», «vīvō patre»): el que busque siempre un participio no lo reconocerá' }),

  P({ id: 'l8-infinitivo-sustantivo', nombre: 'El infinitivo como sujeto y como objeto', bloque: 8, peldano: 'L1',
    descripcion: '«errāre hūmānum est». Transfiere casi entero desde el español.',
    prereqs: ['l5-conjugacion-por-infinitivo'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'transfiere; se examina la forma del infinitivo, no la función',
    cubre: ['L1/GRAMÁTICA · CONJUGACIÓN'], cita: 'Acusativo con infinitivo donde el español pone «que»', sinDescriptor: 'declarado: el currículo cita el infinitivo en la tipología, sin descriptor propio para su uso sustantivo',
    varia: 'el tiempo y la voz del infinitivo',
    invarianciaJustificada: 'la función sustantiva del infinitivo es idéntica a la española en todos los contextos: variar aquí sería inventar dificultad' }),

  P({ id: 'l8-acusativo-infinitivo', nombre: 'Acusativo con infinitivo', bloque: 8, peldano: 'L2',
    descripcion: '«dīcit Caesarem venīre» = «dice que César viene». Sujeto en ACUSATIVO y verbo en INFINITIVO donde el español pone «que» + indicativo. El instinto romance busca una conjunción que no está.',
    prereqs: ['l8-infinitivo-sustantivo', 'l3-acusativo-od'], clase: 'sin-equivalente',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'produccion' },
    dificultadEsOmision: true,
    motivo: 'misma razón que el ablativo absoluto: el alumno no lo produce. Y al leerlo toma el acusativo por objeto indirecto y produce una lectura coherente y falsa: «LE DICE A CÉSAR QUE VENGA», que es español impecable y significa otra cosa. (La primera versión daba como lectura falsa «dice a César venir», que no es español sino el ECM inglés: un error de anglófono colado desde un manual.) Transformación desde la completiva española',
    cubre: ['L2/GRAMÁTICA · ORATIO OBLIQUA'], cita: 'identifica su sujeto **en acusativo** y su verbo **en infinitivo**',
    varia: 'el tiempo del infinitivo, que marca anterioridad, simultaneidad o posterioridad respecto a la principal' }),

  P({ id: 'l8-gerundio-gerundivo', nombre: 'Gerundio y gerundivo: la misma forma, dos gramáticas', bloque: 8, peldano: 'L3',
    descripcion: 'El gerundio es un sustantivo verbal activo («ars scrībendī»); el gerundivo es un adjetivo pasivo que concuerda («ad urbem capiendam»). Coinciden en la forma.',
    prereqs: ['l8-tres-participios'], clase: 'trampa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    motivo: 'el español tiene un gerundio que no se parece a ninguno de los dos, así que el alumno los funde: el error diana es tratar el gerundivo como gerundio y no concordarlo',
    cubre: ['L3/GRAMÁTICA · GERUNDIVO'], cita: 'Distingue gerundio de gerundivo',
    varia: 'si la construcción lleva objeto (que fuerza el gerundivo) o no',
    excepcion: 'con verbos que rigen otro caso el gerundivo no aparece y se mantiene el gerundio: la regla «con objeto, gerundivo» tiene su caso negativo' }),

  P({ id: 'l8-perifrastica-pasiva', nombre: 'Perifrástica pasiva: la obligación', bloque: 8, peldano: 'L3',
    descripcion: '«Carthāgō dēlenda est» = «Cartago debe ser destruida». Gerundivo + sum, con el agente en DATIVO y no en ablativo.',
    prereqs: ['l8-gerundio-gerundivo'], clase: 'sin-equivalente',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'sin equivalente: se produce desde la paráfrasis con «deber»',
    cubre: ['L3/GRAMÁTICA · GERUNDIVO'], cita: 'produce la perifrástica pasiva (`Carthāgō dēlenda est`) y la traduce con el matiz de obligación',
    varia: 'si aparece el agente en dativo, que es donde el alumno pone ablativo por analogía con la pasiva' }),

  P({ id: 'l8-supino', nombre: 'Supino en -um y en -ū', bloque: 8, peldano: 'L3',
    descripcion: '«vēnērunt rogātum» (finalidad tras verbo de movimiento) y «mīrābile dictū» (limitación tras adjetivo). Dos usos y nada más.',
    prereqs: ['l8-gerundio-gerundivo'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'punto pequeño y se declara pequeño: dos usos cerrados. No se infla para que parezca un bloque',
    cubre: ['L3/GRAMÁTICA · SUPINO'], cita: 'Reconoce las dos formas del supino y su uso restringido (`mīrābile dictū`, `vēnērunt rogātum`)',
    varia: 'cuál de los tres usos: finalidad tras verbo de movimiento, limitación tras adjetivo, y el infinitivo de futuro pasivo «factum īrī» (Allen & Greenough §509.b), que la primera versión de este punto se dejaba al afirmar que eran dos' }),

  P({ id: 'l8-infinitivo-historico', nombre: 'Infinitivo histórico', bloque: 8, peldano: 'L3',
    descripcion: 'En narración viva, el infinitivo hace de verbo principal en pasado: «hostēs fugere, clāmāre, cadere». Frecuente en Salustio y en Livio.',
    prereqs: ['l8-infinitivo-sustantivo'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'el alumno busca el verbo principal, no lo encuentra y da la frase por incompleta: es un fallo de lectura, no de forma',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Estilo indirecto libre en Livio', sinDescriptor: 'declarado: el currículo lo roza al hablar del estilo de Livio sin descriptor propio',
    varia: 'la longitud de la serie de infinitivos, porque uno solo se confunde con un acusativo con infinitivo' }),

  // ── b9 · Oración compuesta y oratio obliqua ─────────────────────────
  P({ id: 'l9-oratio-obliqua', nombre: 'Oratio obliqua sostenida', bloque: 9, peldano: 'L3',
    descripcion: 'Párrafos enteros de discurso indirecto: la principal en acusativo con infinitivo y TODAS las subordinadas en subjuntivo, con cambio de persona y de deícticos.',
    prereqs: ['l8-acusativo-infinitivo', 'l7-consecutio', 'l4-reflexivo-indirecto'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'es la destreza que separa leer una frase de leer un texto: el alumno pierde de vista quién habla y dónde acaba el discurso',
    cubre: ['L3/GRAMÁTICA · ORATIO OBLIQUA'], cita: 'dice **quién habla y hasta dónde llega su discurso**',
    varia: 'la longitud del pasaje y la profundidad de la subordinación' }),

  P({ id: 'l9-correlaciones', nombre: 'Las correlaciones que sostienen el período', bloque: 9, peldano: 'L3',
    descripcion: 'nōn sōlum… sed etiam; tantus… quantus; tam… ut; cum… tum. Son el andamiaje que permite leer 80 palabras sin perderse.',
    prereqs: ['l7-ut-consecutiva'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'léxico funcional que transfiere bien del español: flashcard de contraste',
    cubre: ['L3/GRAMÁTICA · PERÍODO'], cita: 'las correlaciones que lo sostienen (`nōn sōlum… sed etiam`, `tantus… quantus`, `tam… ut`, `cum… tum`)',
    corpus: 'clásico',
    varia: 'la correlación y la distancia entre sus dos mitades, que en Cicerón puede ser de treinta palabras' }),

  P({ id: 'l9-relativa-enlace', nombre: 'El relativo de enlace abre frase', bloque: 9, peldano: 'L3',
    descripcion: '«Quae cum ita sint…» — un relativo al principio de una oración nueva que equivale a «y esto». Muy frecuente en Cicerón y desconcertante si no se conoce.',
    prereqs: ['l4-relativo'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el alumno busca el antecedente dentro de la frase y no está: está en la anterior. La lectura queda coherente y falsa',
    cubre: ['L3/GRAMÁTICA · PERÍODO'], cita: 'Correlaciones y su función de andamiaje', sinDescriptor: 'declarado: el currículo no lo nombra y es de altísima frecuencia en Cicerón',
    varia: 'el caso del relativo de enlace, que depende de su función en la frase nueva' }),

  P({ id: 'l9-comparativas', nombre: 'Comparativas y su modo', bloque: 9, peldano: 'L3',
    descripcion: '«ut» + indicativo para el hecho real; «quasi», «tamquam sī» + subjuntivo para la comparación hipotética.',
    prereqs: ['l7-consecutio'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'transfiere: el español también cambia de modo entre «como dice» y «como si dijera»',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Comparativas y consecutivas',
    varia: 'si la comparación es real o hipotética' }),

  P({ id: 'l9-temporales', nombre: 'Temporales: postquam, ubi, simul ac, dum', bloque: 9, peldano: 'L2',
    descripcion: 'Casi todas con indicativo, y «dum» con presente aunque la principal esté en pasado.',
    prereqs: ['l5-presente'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el «dum» + presente en contexto pasado se traduce en pasado, y el alumno lo lee en presente · RECEPTIVO: no va por corrección, porque una frase mala sólo mide lo que el alumno pone de más y aquí la dificultad es de lectura',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: '`Cum` histórico, causal y concesivo', sinDescriptor: 'declarado: el currículo agrupa las temporales bajo el cum',
    varia: 'la conjunción, y hay que traer «dum» porque es la que rompe la regla',
    excepcion: '«dum» con sentido de «mientras» va en presente siempre; con sentido de «hasta que» va en subjuntivo: la misma palabra con dos gramáticas' }),

  P({ id: 'l9-causales', nombre: 'Causales: quod, quia, quoniam y el modo que eligen', bloque: 9, peldano: 'L3',
    descripcion: 'Con indicativo la causa es del que habla; con subjuntivo es de otro («porque, según dice, …»). El modo lleva la atribución.',
    prereqs: ['l7-no-coincide-espanol'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'el español no marca de quién es la causa: la distinción se pierde entera si el alumno no la busca',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Subordinadas de segundo y tercer grado',
    varia: 'de quién es la causa, y hay que traer las dos' }),

  P({ id: 'l9-concesivas', nombre: 'Concesivas: quamquam, quamvīs, etsī', bloque: 9, peldano: 'L3',
    descripcion: '«quamquam» con indicativo para el hecho admitido, «quamvīs» con subjuntivo para el hipotético.',
    prereqs: ['l9-causales'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'transfiere bastante desde «aunque» + indicativo/subjuntivo del español',
    cubre: ['L3/COMPRENSIÓN LECTORA'], cita: 'Subordinadas de segundo y tercer grado',
    varia: 'la conjunción y el modo que exige' }),

  // ── b10 · Orden de palabras, hipérbaton y período ───────────────────
  P({ id: 'l10-orden-neutro', nombre: 'El orden neutro es SOV, y es sólo una tendencia', bloque: 10, peldano: 'L2',
    descripcion: 'El verbo tiende al final, pero es estadística y no gramática. Y el genitivo NO precede a su núcleo: medido sobre los 227.301 tokens del treebank, el 73,6 % va pospuesto (y en el subcorpus más clásico, el 59,2 %). La regla escolar de que el genitivo antecede es falsa.',
    prereqs: ['l3-funcion-por-desinencia'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'el alumno que aprende «el verbo va al final» como regla lo usa para parsear, y falla en cuanto el verbo no está al final — que es a menudo',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: 'La oración simple con orden libre', sinDescriptor: 'declarado: el currículo lo trata dentro del eje de la desinencia',
    varia: 'la posición del verbo, y hay que traer ítems donde NO esté al final',
    excepcion: '«est» es el verbo que menos respeta la tendencia: medido, 645 veces en posición final o penúltima, 422 en segunda y 1.804 en otra. O sea que ni «suele» ir en segunda ni deja de ir al final — la regla escolar del verbo final falla justo en el verbo más frecuente, pero no en la dirección que suele decirse' }),

  P({ id: 'l10-enfasis-por-posicion', nombre: 'La posición marca énfasis, no función', bloque: 10, peldano: 'L3',
    descripcion: 'Primera y última posición son las enfáticas. Al liberar el orden de la función, el latín lo dedica entero al énfasis.',
    prereqs: ['l10-orden-neutro'], clase: 'pragmatico',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'el español también antepone para enfatizar: transfiere, y se examina por mediación (qué se pierde al reordenar en la traducción)',
    cubre: ['L3/MEDIACIÓN'], cita: 'el orden queda libre para el énfasis', sinDescriptor: 'declarado',
    varia: 'qué elemento está desplazado y qué efecto produce' }),

  P({ id: 'l10-hiperbaton-prosa', nombre: 'Hipérbaton en prosa', bloque: 10, peldano: 'L3',
    descripcion: 'Adjetivo y sustantivo separados por varias palabras ya en Cicerón, no sólo en verso.',
    prereqs: ['l10-enfasis-por-posicion', 'l4-concordancia'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'la vecindad deja de ser pista: el alumno empareja el adjetivo con el sustantivo de al lado, que concuerda por casualidad. Lectura coherente y falsa',
    cubre: ['L3/GRAMÁTICA · PERÍODO'], cita: 'HIPÉRBATON EN PROSA Y ELIPSIS',
    varia: 'la distancia entre adjetivo y núcleo, y si hay un distractor que concuerda por casualidad — sin distractor el ítem no mide nada' }),

  P({ id: 'l10-elipsis', nombre: 'Elipsis del verbo, sobre todo de «est»', bloque: 10, peldano: 'L3',
    descripcion: '«Omnia praeclāra rāra» — sin verbo. La cópula se sobreentiende con muchísima frecuencia.',
    prereqs: ['l10-hiperbaton-prosa'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el alumno busca el verbo y no lo hay: o da la frase por incompleta o convierte el atributo en aposición',
    cubre: ['L3/GRAMÁTICA · PERÍODO'], cita: 'HIPÉRBATON EN PROSA Y ELIPSIS',
    varia: 'qué se elide (la cópula, un verbo repetido, el sujeto) y en qué tiempo hay que reponerlo' }),

  P({ id: 'l10-periodo', nombre: 'Analizar un período de 60-90 palabras', bloque: 10, peldano: 'L3',
    descripcion: 'Encontrar el verbo principal, los grados de subordinación y las correlaciones. Es la síntesis de todo el peldaño.',
    prereqs: ['l9-correlaciones', 'l10-hiperbaton-prosa', 'l7-consecutio'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'destreza compuesta que no se puede examinar por partes: el hueco va en un esquema de la jerarquía',
    cubre: ['L3/GRAMÁTICA · PERÍODO'], cita: 'Analiza un período ciceroniano de 60-90 palabras identificando el verbo principal',
    numeroDeLaCitaNoEsItems: '60-90 es la longitud del período en palabras, no cuántos ítems hay',
    varia: 'el número de grados de subordinación y si el verbo principal va al final o intercalado' }),

  P({ id: 'l10-conectores', nombre: 'Los conectores pospuestos: autem, enim, vērō, quidem', bloque: 10, peldano: 'L2',
    descripcion: 'Nunca van primeros: ocupan la segunda posición de su oración. «Caesar autem…» conecta con lo anterior, no con «Caesar».',
    prereqs: ['l10-orden-neutro'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'opaco', via: 'recepcion' },
    motivo: 'léxico funcional opaco: no se parecen a nada español y su posición desconcierta',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: 'Coordinación con `et`, `-que`, `sed`, `nam`',
    corpus: 'clásico',
    varia: 'el conector y el matiz que aporta' }),

  P({ id: 'l10-que-enclitico', nombre: 'El -que enclítico', bloque: 10, peldano: 'L1',
    descripcion: '«senātus populusque» — la conjunción va pegada a la SEGUNDA palabra, no entre las dos.',
    prereqs: [], clase: 'lexico', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'una conjunción escrita dentro de la palabra no existe en español: el alumno la lee como parte del lema y busca en el diccionario «populusque»',
    cubre: ['L1/COMPRENSIÓN LECTORA'], cita: 'Coordinación con `et`, `-que`, `sed`, `nam`',
    corpus: 'todo',
    varia: 'si la palabra con -que es reconocible sin él o no' }),

  // ── b11 · Léxico: herencia, falsos regalos y estratos ───────────────
  P({ id: 'l11-nucleo-800', nombre: 'El núcleo de 800 lemas por frecuencia', bloque: 11, peldano: 'L1',
    descripcion: 'Seleccionados sobre los treebanks por frecuencia, no por lo que salga en los textos — el error diagnosticado en portugués, donde el catálogo se derivó de las historias y acabó con «acarajé» pero sin los días de la semana.',
    prereqs: [], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'léxico puro; la mayoría son transparentes y el SRS los fija rápido',
    cubre: ['L1/LÉXICO'], cita: '800 lemas seleccionados por frecuencia sobre los treebanks',
    numeroDeLaCitaNoEsItems: '800 es el tamaño del léxico acumulado del nivel, no un número de ítems',
    corpus: 'todo',
    varia: 'la clase de palabra y si es transparente o no' }),

  P({ id: 'l11-falsos-regalos', nombre: 'Los falsos regalos: la forma se reconoce y el sentido no', bloque: 11, peldano: 'L1',
    descripcion: 'hostis (194 en el treebank: enemigo público, frente a «hospes», que es huésped Y anfitrión a la vez), virtūs (187: valor y hombría, no virtud moral), familia (33: toda la casa incluidos los esclavos), dēbeō (deber dinero, no obligación moral), probō (aprobar y probar), parēns (progenitor, no pariente). Y el par de cantidad: «liber» (libro, i breve), «līber» (libre, ī larga) y «līberī» (los hijos) — tres palabras que sin mácrón se escriben igual.',
    prereqs: ['l11-nucleo-800'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'la flashcard enfrenta el sentido latino y el del descendiente español. Y los ejemplos están elegidos para un HISPANOHABLANTE: la trampa «hostis = huésped» es inglesa (host < hospes) y para nosotros «hueste» y «hostil» ya apuntan a enemigo. PERO NINGUNA DE LAS DOS ENTRA: medido el 2026-09-04, «hostis» sale 194 veces en el corpus y CERO en la Vulgata, y «hospes» 19 y 8. El experto optimiza por verdad y el curso por lo que el alumno se va a encontrar, y cuando chocan manda lo segundo: una trampa que no aparece nunca no es una trampa, es una curiosidad. PISO: un falso regalo se gana una de las sesenta plazas sólo si sale ≥10 veces en la lectura declarada del nivel (109.198 tokens de Vulgata), que es salir ≈1 vez en las 12.000 palabras que el alumno lee en L1. De los 1.311 lemas citables del corpus, 134 no aparecen ni una vez ahí',
    cubre: ['L1/LÉXICO'], cita: 'reconoce los 60 **falsos regalos** del nivel',
    itemsQuePide: 60,
    corpus: 'todo',
    varia: 'el tipo de desplazamiento (estrechamiento, ampliación, cambio de dominio)' }),

  P({ id: 'l11-falsos-regalos-cultos', nombre: 'Los falsos regalos cultos de la prosa abstracta', bloque: 11, peldano: 'L3',
    descripcion: 'ratiō no es «razón» en la mayoría de sus usos; fidēs no es «fe»; officium no es «oficio»; auctōritās no es «autoridad» sin más. Son los que más daño hacen porque aparecen en el argumento.',
    prereqs: ['l11-falsos-regalos'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el alumno de L3 ya no consulta estas palabras porque «las sabe»: el error es invisible y se acumula en la traducción entera. ACOTADO A LA PROSA CLÁSICA: en la Vulgata —que es la puerta de entrada del curso en L1— «fidēs» SÍ es «fe», así que el punto tiene que decir de qué latín habla o contradice lo que el alumno aprendió dos peldaños antes',
    cubre: ['L3/LÉXICO'], cita: 'sus **falsos regalos cultos**: `ratiō` no es «razón» en la mayoría de sus usos',
    corpus: 'clásico',
    varia: 'el sentido concreto que el contexto impone, y hay que traer varios del mismo lema' }),

  P({ id: 'l11-lexico-militar', nombre: 'El vocabulario militar y político de César', bloque: 11, peldano: 'L2',
    descripcion: 'legiō, cohors, castra, imperium, prōvincia, lēgātus, obsēs, frūmentum. Cerrado, muy frecuente en L2 y casi ausente después.',
    prereqs: ['l11-nucleo-800'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'opaco', via: 'recepcion' },
    motivo: 'campo léxico cerrado: flashcard',
    cubre: ['L2/LÉXICO'], cita: 'el vocabulario militar y político de César',
    corpus: 'clásico',
    varia: 'el campo (unidades, cargos, logística, terreno)' }),

  P({ id: 'l11-preverbios', nombre: 'Los preverbios y lo que hacen al verbo', bloque: 11, peldano: 'L2',
    descripcion: 'ad-, ab-, con-, dē-, ex-, in-, prae-, prō-, sub-, trāns-. Componen el 40 % del vocabulario verbal y son productivos: sabiendo el simple y el preverbio se adivina el compuesto.',
    prereqs: ['l11-nucleo-800'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'regalo enorme y poco explotado: el español conserva los mismos preverbios y el alumno puede derivar cientos de lemas',
    cubre: ['L2/LÉXICO'], cita: 'Numerales cardinales y ordinales hasta mil', sinDescriptor: 'declarado: el currículo no le da descriptor y es de los puntos más rentables del curso',
    corpus: 'todo',
    varia: 'el preverbio y si el compuesto es transparente o lexicalizado',
    excepcion: 'muchos compuestos están lexicalizados y no significan la suma: «intellegō» no es «leer entre». Un alumno que sobreaplique la composición inventará sentidos' }),

  P({ id: 'l11-apofonia', nombre: 'La apofonía del compuesto', bloque: 11, peldano: 'L2',
    descripcion: 'faciō → efficiō, capiō → accipiō, teneō → retineō. La vocal de la raíz cambia al componer, y el alumno no reconoce el simple dentro del compuesto.',
    prereqs: ['l11-preverbios'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'opaco', via: 'recepcion' },
    motivo: 'deriva por regla (a/e breves en sílaba interna abierta → i), y sin ella los preverbios no rinden',
    cubre: ['L2/LÉXICO'], cita: 'Numerales cardinales y ordinales hasta mil', sinDescriptor: 'declarado, junto con los preverbios',
    varia: 'la vocal afectada y si la sílaba es abierta o cerrada' }),

  P({ id: 'l11-numerales', nombre: 'Numerales cardinales y ordinales', bloque: 11, peldano: 'L2',
    descripcion: 'Hasta mil. Sólo declinan ūnus, duo, trēs y las centenas; los demás son invariables.',
    prereqs: ['l11-nucleo-800'], clase: 'paradigma',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'deriva por regla, con los cuatro declinables guardados',
    cubre: ['L2/LÉXICO'], cita: 'Numerales cardinales y ordinales hasta mil',
    corpus: 'todo',
    varia: 'si el numeral declina o no',
    excepcion: '«duo» y «ambō» conservan formas de dual («duo», «duōs»/«duo»): no siguen la 2.ª declinación aunque lo parezcan' }),

  P({ id: 'l11-vulgata-lexico', nombre: 'El léxico cristiano de la Vulgata', bloque: 11, peldano: 'L1',
    descripcion: 'Palabras nuevas (angelus, apostolus, baptizō) y palabras clásicas con sentido nuevo (grātia, caritās, saeculum, verbum). Es la puerta de entrada del curso y conviene decir en qué se aparta.',
    prereqs: ['l11-nucleo-800'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'el sentido cristiano de «grātia» o «caritās» es el que el español heredó, así que el alumno lo proyecta hacia atrás sobre el latín clásico',
    cubre: ['L1/CULTURA'], cita: 'qué separa el latín de Jerónimo del latín clásico en tres rasgos concretos',
    corpus: 'vulgata',
    varia: 'si la palabra es nueva o es clásica resemantizada' }),

  P({ id: 'l11-preposiciones-caso', nombre: 'Preposiciones que rigen dos casos', bloque: 11, peldano: 'L2',
    descripcion: 'in, sub, super: con acusativo indican dirección, con ablativo situación. «in urbem» (hacia la ciudad) frente a «in urbe» (en la ciudad).',
    prereqs: ['l3-ablativo-abanico', 'l3-acusativo-od'], clase: 'trampa', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'el español usa la misma preposición para las dos («en la ciudad» / «a la ciudad» con verbos distintos): el alumno ignora el caso y pierde la mitad del sentido · RECEPTIVO: no va por corrección, porque una frase mala sólo mide lo que el alumno pone de más y aquí la dificultad es de lectura',
    cubre: ['L2/COMPRENSIÓN LECTORA'], cita: 'los ablativos más frecuentes (instrumento, compañía con `cum`, lugar, tiempo)',
    varia: 'la preposición y el caso, con los dos valores presentes' }),

  // ── b12 · Métrica y lengua poética ──────────────────────────────────
  P({ id: 'l12-hexametro', nombre: 'El hexámetro dactílico y sus cesuras', bloque: 12, peldano: 'L4',
    descripcion: 'Seis pies, dáctilos sustituibles por espondeos salvo el quinto, y la cesura pentemímera como corte habitual.',
    prereqs: ['l1-larga-por-posicion'], clase: 'ortografico', formato: 'transformacion',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'se escande, o sea que se produce un análisis: la respuesta se deriva de la cantidad y de la posición',
    cubre: ['L4/FONOLOGÍA · MÉTRICA'], cita: 'Escande 20 hexámetros marcando cantidades, cesura y elisión',
    itemsQuePide: 20,
    varia: 'la proporción de dáctilos y espondeos y la posición de la cesura' }),

  P({ id: 'l12-elision', nombre: 'Elisión y sinalefa', bloque: 12, peldano: 'L4',
    descripcion: 'Vocal o -m final ante vocal o h- inicial: la sílaba desaparece del cómputo. Sin esto el verso no cuadra nunca.',
    prereqs: ['l12-hexametro', 'l1-h-muda'], clase: 'ortografico', formato: 'transformacion',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'produccion' },
    motivo: 'el español tiene sinalefa y transfiere el concepto; lo que no transfiere es que la -m también elida',
    cubre: ['L4/FONOLOGÍA · MÉTRICA'], cita: 'elisión y sinalefa, hiato',
    varia: 'si lo que elide es vocal o -m, y si hay hiato',
    excepcion: 'el hiato existe y es deliberado en Virgilio: no toda vocal ante vocal elide, y quien sobreaplique romperá el verso' }),

  P({ id: 'l12-distico', nombre: 'El dístico elegíaco', bloque: 12, peldano: 'L4',
    descripcion: 'Hexámetro más pentámetro, con la cesura del pentámetro obligatoria. Es el metro de Ovidio elegíaco y de Propercio.',
    prereqs: ['l12-hexametro'], clase: 'ortografico', formato: 'transformacion',
    calco: { ordenEnganya: 'no', herencia: 'sin-equivalente', via: 'produccion' },
    motivo: 'se escande igual que el hexámetro, con una regla más',
    cubre: ['L4/CULTURA'], cita: 'dístico elegíaco',
    varia: 'la segunda mitad del pentámetro, que sólo admite dáctilos' }),

  P({ id: 'l12-hiperbaton-verso', nombre: 'Hipérbaton del verso y disposición envolvente', bloque: 12, peldano: 'L4',
    descripcion: 'Adjetivo y núcleo separados por medio verso, con el orden aBab o abAB. En L1 el alumno aprendió que la posición no da la función; aquí aprende que tampoco la vecindad.',
    prereqs: ['l10-hiperbaton-prosa'], clase: 'funcion',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'es el descriptor central del peldaño: reconstruir el orden en prosa es la única prueba de que se ha entendido',
    cubre: ['L4/GRAMÁTICA · HIPÉRBATON'], cita: 'Reconstruye el orden en prosa de 20 versos con hipérbaton',
    itemsQuePide: 20,
    varia: 'la disposición (envolvente, entrelazada) y el número de distractores que concuerdan por casualidad' }),

  P({ id: 'l12-licencias', nombre: 'Las licencias del verso', bloque: 12, peldano: 'L4',
    descripcion: 'Dativo de agente, genitivo y acusativo de tipo griego, acusativo de relación, síncopa (amāsse), tmesis, plural poético por singular.',
    prereqs: ['l12-hiperbaton-verso'], clase: 'sin-equivalente', formato: 'cloze-en-glosa',
    calco: { ordenEnganya: 'si', herencia: 'sin-equivalente', via: 'recepcion' },
    motivo: 'cada licencia rompe una regla que el alumno acaba de automatizar: sin conocerlas, lee la forma como un error del texto',
    cubre: ['L4/GRAMÁTICA · POÉTICO'], cita: 'Reconoce las licencias del verso: dativo de agente, genitivo griego, acusativo de relación, síncopa',
    valoresQueCubre: 6,
    varia: 'la licencia. Las declaradas son SIETE y el piso de L4 es SEIS, así que se cubren las seis de mayor frecuencia en Virgilio y Ovidio —dativo de agente, acusativo de relación, síncopa, tmesis, plural poético y genitivo griego— y el ACUSATIVO GRIEGO queda fuera con motivo escrito, no por olvido' }),

  P({ id: 'l12-lexico-poetico', nombre: 'El léxico poético es otro estrato', bloque: 12, peldano: 'L4',
    descripcion: 'ēnsis por gladius, puppis por nāvis, aethēr, ratis, unda (u BREVE y en nominativo: el currículo escribía «ūndā», con un mácron que no existe y en ablativo, dentro de un curso cuyo gate es la cantidad). No son sinónimos elegantes: son las palabras que el hexámetro admite.',
    prereqs: ['l11-nucleo-800'], clase: 'lexico',
    calco: { ordenEnganya: 'no', herencia: 'opaco', via: 'recepcion' },
    motivo: 'flashcard de contraste con la palabra de prosa, que es lo que hace visible que son dos estratos',
    cubre: ['L4/LÉXICO · POÉTICO'], cita: 'Domina el léxico poético que no coincide con el de la prosa',
    corpus: 'verso',
    varia: 'el par prosa/verso, y si el poético tiene además motivación métrica',
    abierto: 'los pares hay que sacarlos de la Eneida y las Metamorfosis, no del treebank: éste es de prosa y da «ēnsis» UNA vez frente a «gladius» 45' }),

  // ── b13 · Registro, género y variedad ───────────────────────────────
  P({ id: 'l13-vulgata-sintaxis', nombre: 'La sintaxis de la Vulgata: parataxis y orden romance', bloque: 13, peldano: 'L1',
    descripcion: 'Jerónimo coordina donde el clásico subordina, y su orden de palabras se parece mucho más al español. Por eso el curso empieza aquí.',
    prereqs: [], clase: 'pragmatico',
    calco: { ordenEnganya: 'no', herencia: 'no-aplica', via: 'recepcion' },
    motivo: 'se examina por mediación: comparar la misma idea en Jerónimo y en un clásico y decir qué cambia',
    cubre: ['L1/CULTURA'], cita: 'qué separa el latín de Jerónimo del latín clásico en tres rasgos concretos (parataxis, orden más romance, léxico cristiano)',
    varia: 'el rasgo comparado (parataxis, orden, léxico)' }),

  P({ id: 'l13-generos-prosa', nombre: 'Los tres géneros de la prosa de L3', bloque: 13, peldano: 'L3',
    descripcion: 'Discurso judicial, historia y monografía: distinta persona, distinto tiempo dominante, distinta densidad de período.',
    prereqs: ['l10-periodo'], clase: 'pragmatico',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'mediación: reconocer el género por sus rasgos y explicar en qué se nota',
    cubre: ['L3/CULTURA'], cita: 'en qué se diferencia la prosa de un discurso judicial, una historia y una monografía',
    varia: 'el género y el rasgo que lo delata' }),

  P({ id: 'l13-carta-vs-discurso', nombre: 'La carta de Cicerón no es el discurso de Cicerón', bloque: 13, peldano: 'L3',
    descripcion: 'Las cartas son su registro llano —frases cortas, elipsis, griego intercalado— y los discursos su registro periódico. Por eso el currículo lee las cartas primero.',
    prereqs: ['l13-generos-prosa'], clase: 'pragmatico',
    calco: { ordenEnganya: 'no', herencia: 'regalo', via: 'recepcion' },
    motivo: 'mediación de registro; y es la razón por la que el orden de lectura del peldaño es el que es',
    cubre: ['L3/CULTURA'], cita: 'Cicerón (cartas primero, discursos después: la carta es su registro llano y el discurso el periódico)',
    varia: 'el rasgo de registro comparado' }),

  P({ id: 'l13-tres-lecturas', nombre: 'Las tres pronunciaciones y por qué el curso elige una', bloque: 13, peldano: 'L1',
    descripcion: 'Eclesiástica, restituida y tradicional de cada país. El curso usa la eclesiástica y lo declara: no es la única legítima ni pretende ser la de Cicerón.',
    prereqs: ['l1-eclesiastica-ce'], clase: 'pragmatico',
    calco: { ordenEnganya: 'no', herencia: 'no-aplica', via: 'recepcion' },
    motivo: 'mediación; y es la garantía de honestidad del sello de la voz: el alumno sabe qué está oyendo',
    cubre: ['L1/FONOLOGÍA'], cita: 'contrastada explícitamente con la restituida para que el alumno sepa que está eligiendo una de tres lecturas legítimas',
    varia: 'el rasgo contrastado entre las dos pronunciaciones' }),

  // ── Puntos añadidos por el ataque del latinista (2026-09-03) ────────
  P({ id: 'l1-eclesiastica-gn', nombre: 'gn se lee /ɲ/', bloque: 1, peldano: 'L1',
    descripcion: 'agnus = «áñus», magnus = «máñus», rēgnum = «réñum». Es la regla de lectura eclesiástica más frecuente de todas y el italiano la da gratis.',
    prereqs: ['l1-eclesiastica-ce'], clase: 'fonologico', formato: 'cloze-derivado',
    calco: { ordenEnganya: 'no-aplica', herencia: 'falso-regalo', via: 'recepcion' },
    motivo: 'HUECO QUE ENCONTRÓ EL LATINISTA: el currículo nombra la regla en el descriptor de FONOLOGÍA de L1 y era la única de las siete sin punto, con 2.014 tokens medidos en el treebank (magnus 515, cognōscō 246, rēgnum 190, signum 138, ignis 85, dignus 80). Y es de las más hispanohablantes: el español TIENE /ɲ/ como fonema pero no el dígrafo, así que lee «magno» con /gn/',
    cubre: ['L1/FONOLOGÍA'], cita: '`gn` = /ɲ/ (*agnus*)',
    varia: 'la posición del dígrafo y si el descendiente español conserva la ñ (signum→seña) o no (magnus→magno)' }),

  P({ id: 'l3-dativo-verbos', nombre: 'Verbos que rigen DATIVO donde el español pone objeto directo', bloque: 3, peldano: 'L2',
    descripcion: 'crēdō, pāreō, persuādeō, noceō, placeō, serviō, imperō, resistō, ignōscō, faveō, invideō, parcō, studeō, cōnfīdō, nūbō. Y el doble dativo de César: «auxiliō mittere», «praesidiō esse».',
    prereqs: ['l3-dativo-ci'], clase: 'trampa', formato: 'transformacion',
    calco: { ordenEnganya: 'no', herencia: 'falso-regalo', via: 'produccion' },
    dificultadEsOmision: false,
    motivo: 'EL HUECO MÁS CARO QUE ENCONTRÓ EL LATINISTA, y el más hispanohablante del inventario: 800 tokens medidos (crēdō 310, placeō 99, imperō 66, serviō 57, noceō 52…) y cero puntos. El español usa «a» tanto para el objeto directo humano como para el indirecto —«creer A alguien», «obedecer A alguien»—, así que el instinto NO PUEDE separar los que rigen dativo de los que rigen acusativo, y produce acusativo porque el descendiente español es transitivo. Es error de PRODUCCIÓN: va por transformación',
    cubre: [], sinDescriptor: 'el currículo no le da descriptor propio y debería: se denuncia aquí en vez de colgarlo del dativo de L1',
    cita: 'Complemento directo, indirecto',
    varia: 'el verbo, y hay que traer también verbos que SÍ rigen acusativo como control — si no, el alumno aprende «los verbos raros llevan dativo» y sobreaplica',
    excepcion: 'algunos alternan según el sentido: «cōnsulō» + acusativo es «consultar a alguien» y + dativo es «velar por alguien». La regla no es por verbo sino por verbo-y-sentido' }),

];

/** Los puntos como `Concept` del contrato común, para `ALL_CONCEPTS`. */
export const CONCEPTOS_LA: Concept[] = PUNTOS_LA.map((p) => ({
  id: p.id, name: p.nombre, blockId: p.bloque, description: p.descripcion, prereqs: p.prereqs,
}));
