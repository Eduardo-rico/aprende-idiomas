// lib/data/languages/la/lotes/l11-falsos-regalos.ts
//
// PRIMER LOTE DE FLASHCARD. Punto: `l11-falsos-regalos`.
//
// Seis palabras cuyo sentido se desplazó y **seis que no**. La mitad y la
// mitad no es estética: si todas fueran trampas, «desconfía siempre» las
// acertaría todas — y enseñaría algo falso, porque la mayoría del léxico
// latino sí transfiere y un alumno que desconfíe de todo lee peor.
//
// Los ejemplos están elegidos para un HISPANOHABLANTE, que es la mitad
// difícil. La trampa más citada del género —«hostis = huésped»— es
// INGLESA (host < hospes), y para nosotros «hueste» y «hostil» ya apuntan
// a enemigo. Un falso amigo que sólo lo es en inglés enseña una dificultad
// que nuestro alumno no tiene, y la comprobación contra fuentes lo aprueba
// igual, porque el sentido latino sí es ése.
//
// ── PERO `hostis` TAMPOCO ESTÁ AQUÍ, Y ESO ES LO INTERESANTE ──────────
//
// Estuvo, como control de verdadero regalo, hasta que el piso de
// frecuencia sobre la LECTURA DEL NIVEL lo tumbó: `hostis` sale 194 veces
// en el corpus entero y **CERO en la Vulgata**, que es por donde entra
// L1. Todas sus apariciones son de César y Cicerón. La lección anglófona
// se queda escrita aquí, que es donde vale; la plaza va a una palabra que
// el alumno sí se encuentra.
//
// ── Y UNA SEGUNDA CORRELACIÓN, QUE TAMPOCO ERA DE LA LENGUA ──────────
//
// La primera versión tenía los SEIS falsos regalos con mácrón y sólo uno
// de los seis fieles. «Si lleva rayita, desconfía» acertaba 11 de 12
// (p = 0,030) — y el mácrón no tiene nada que ver con el desplazamiento
// semántico, que es lo que la tarjeta examina.
//
// El latinista lo dio por ESTRUCTURAL: las trampas serían abstractos de
// 3.ª y 5.ª con vocal larga, y los controles concretos de 1.ª y 2.ª con
// breve. Lo medí y **no lo es**: hay trampas sin mácrón que pasan el piso
// de la Vulgata (`familia` 15, `causa` 32, `turba` 158) y fieles con
// mácrón de sobra (`frāter` 286, `nōmen` 212, `pānis` 99). Era un
// artefacto de mi muestra, no una propiedad del latín. Ahora va tres y
// tres en cada grupo.
//
// El criterio, que vale para las sesenta tarjetas del nivel: **el experto
// optimiza por verdad y el curso por lo que el alumno se va a encontrar, y
// cuando chocan manda lo segundo.** Una trampa que no aparece nunca no es
// una trampa: es una curiosidad. Lo mismo tumbó a `sententia` (62 en el
// corpus, 2 en la Vulgata) y a `hospes` (19 y 8), que es justamente la
// palabra que el punto propone como «el falso regalo real de esa
// familia»: buena lingüística y mala tarjeta.
import type { ItemFlashcard } from '../../../../../scripts/lib/gate-flashcard';
import { ordenPublicado } from '../../../../../scripts/lib/orden-publicado';

const LS = (s: string) => `Lewis & Short s.v. ${s}`;


// ── EL ORDEN PUBLICADO VA BARAJADO, Y NO ES UN DETALLE ────────────────
//
// Este fichero se escribe AGRUPADO por el eje del punto porque así se
// revisa. Pero `ExerciseRunner` sirve los ejercicios con `exercises[idx]`
// incremental, o sea **en el orden del fichero**, y agrupados el alumno
// resuelve el lote entero contando: «a partir del séptimo cambia la
// respuesta». El detector `separablePorPosicion` —en el repositorio desde
// portugués, y que ninguno de los gates de latín llamaba— lo confirma al
// 100 %.
//
// Se publica barajado con semilla fija: ni alternancia estricta, que el
// mismo detector caza por paridad, ni azar sin semilla, que haría el orden
// irreproducible.
export const SEMILLA_DE_ORDEN = 1;

const LOTE_FALSOS_REGALOS_FUENTE: ItemFlashcard[] = [
  // ── TRES TRAMPAS CON MÁCRÓN ──
  {
    id: 'la-11f-01', punto: 'l11-falsos-regalos',
    lema: 'quaerō', claveCorpus: 'quaero', frecuencia: 229,
    sentidoLatino: 'buscar, procurar, y sobre todo PREGUNTAR («quaerere ab aliquō»)',
    descendiente: 'querer', sentidoDescendiente: 'desear, amar',
    esFalsoRegalo: true, desplazamiento: 'cambio-de-dominio',
    porQueUnHispanohablante: '«querer» es de las cien palabras más usadas del español y su sentido está tan fijado que no admite duda: «quaerit ab eō» se lee «quiere de él» y es «le pregunta». La lectura sale entera y falsa.',
    fuente: LS('quaero'), corpus: 'todo',
  },
  {
    id: 'la-11f-02', punto: 'l11-falsos-regalos',
    lema: 'virtūs', claveCorpus: 'uirtus', frecuencia: 187,
    sentidoLatino: 'valor, hombría, excelencia del que cumple su papel; en la Vulgata también «poder, milagro»',
    descendiente: 'virtud', sentidoDescendiente: 'excelencia moral',
    esFalsoRegalo: true, desplazamiento: 'estrechamiento',
    porQueUnHispanohablante: '«virtud» en español es sólo moral, y «virtūs» es lo que hace un varón en la batalla: «virtūs mīlitum» se lee «la virtud de los soldados» y es «su valor». La lectura piadosa cabe y no es la del texto.',
    fuente: LS('virtus'), corpus: 'todo',
  },
  // ── `fidēs` PASÓ DE TRAMPA A REGALO, y lo decidió el corpus ──
  //
  // Estaba contada como falso regalo porque en el latín clásico es la
  // lealtad y el crédito, no la fe. Pero el eje de este campo es **si el
  // instinto español acierta EN EL CORPUS QUE EL ALUMNO LEE**, y L1 lee la
  // Vulgata. Miradas las 147 frases del corpus: `fidēs tua tē salvam
  // fēcit`, `secundum fidem vestram`, `per fidem`, `fidem habēs` — es la
  // fe religiosa, y «fe» acierta.
  //
  // Contarla como trampa era hacerle una tarjeta al alumno de César usando
  // la plaza del alumno de Jerónimo. El contenido de la tarjeta no cambia
  // —sigue diciendo las dos cosas, porque el desplazamiento ocurrió DENTRO
  // del latín y le hará falta en L3— pero el eje binario dice lo que dice
  // su lectura.
  //
  // Y queda el guiño que lo prueba: `fidem servāvī` (2 Timoteo 4) es
  // literalmente el modismo clásico «mantuve mi palabra», reutilizado.
  {
    id: 'la-11f-03', punto: 'l11-falsos-regalos',
    lema: 'fidēs', claveCorpus: 'fides', frecuencia: 214,
    sentidoLatino: 'en la Vulgata, la fe religiosa — el sentido que el español conserva. En el latín CLÁSICO era la lealtad y la palabra dada («fidem servāre») y el crédito comercial, y ése hará falta en L3',
    descendiente: 'fe', sentidoDescendiente: 'creencia religiosa',
    esFalsoRegalo: false, fuente: LS('fides'), corpus: 'todo',
  },

  // ── TRES TRAMPAS SIN MÁCRÓN, que son las que rompen la correlación ──
  {
    id: 'la-11f-04', punto: 'l11-falsos-regalos',
    lema: 'familia', claveCorpus: 'familia', frecuencia: 33,
    sentidoLatino: 'la casa entera bajo un mismo dueño, ESCLAVOS INCLUIDOS; el conjunto de bienes y personas',
    descendiente: 'familia', sentidoDescendiente: 'los parientes',
    esFalsoRegalo: true, desplazamiento: 'estrechamiento',
    porQueUnHispanohablante: 'la palabra es idéntica y el sentido español cabe dentro del latino, así que el hispanohablante nunca duda: «familia» le suena a padres e hijos y en el texto incluye a los esclavos y al ganado. No hay ninguna señal de que falte algo.',
    fuente: LS('familia'), corpus: 'todo',
  },
  {
    id: 'la-11f-05', punto: 'l11-falsos-regalos',
    lema: 'causa', claveCorpus: 'causa', frecuencia: 260,
    sentidoLatino: 'el pleito, el proceso judicial y la situación de alguien; el motivo es un uso entre otros. Y en ablativo pospuesto, «causā», significa «por causa de»',
    descendiente: 'causa', sentidoDescendiente: 'el motivo',
    esFalsoRegalo: true, desplazamiento: 'estrechamiento',
    porQueUnHispanohablante: 'el español se quedó con el motivo y perdió el pleito, que en latín es el sentido de tribunal: «causam dīcere» no es «decir la causa», es «defender el pleito». Y «honōris causā» pospuesto ya no es un sustantivo.',
    fuente: LS('causa'), corpus: 'todo',
  },
  {
    // Vuelve para equilibrar el mácrón cuando `fidēs` pasó a regalo. Y en
    // la Vulgata la trampa es aún más nítida que en el clásico: el
    // padrenuestro dice «dīmitte nōbīs dēbita nostra», que son DEUDAS.
    id: 'la-11f-13', punto: 'l11-falsos-regalos',
    lema: 'dēbeō', claveCorpus: 'debeo', frecuencia: 181,
    sentidoLatino: 'deber DINERO, estar en deuda; la obligación moral es un uso derivado',
    descendiente: 'deber', sentidoDescendiente: 'tener la obligación de',
    esFalsoRegalo: true, desplazamiento: 'cambio-de-dominio',
    porQueUnHispanohablante: 'el español usa «deber» sobre todo para la obligación y el latín para la deuda: «dēbet» a secas se lee «tiene el deber» cuando dice «está endeudado». El hispanohablante no duda porque su palabra funciona.',
    fuente: LS('debeo'), corpus: 'todo',
  },
  {
    id: 'la-11f-06', punto: 'l11-falsos-regalos',
    lema: 'turba', claveCorpus: 'turba', frecuencia: 170,
    sentidoLatino: 'la multitud, el gentío — sin ningún juicio sobre su conducta',
    descendiente: 'turba', sentidoDescendiente: 'la muchedumbre alborotada',
    esFalsoRegalo: true, desplazamiento: 'cambio-de-dominio',
    porQueUnHispanohablante: 'el español cargó la palabra de desorden —«turba», «turbar», «disturbio»— y en los Evangelios «turbae» son sencillamente las multitudes que siguen a Jesús. Quien lea «las turbas» ahí le pone al texto una hostilidad que no tiene.',
    fuente: LS('turba'), corpus: 'todo',
  },

  // ── TRES FIELES CON MÁCRÓN ──
  {
    id: 'la-11f-07', punto: 'l11-falsos-regalos',
    lema: 'carō', claveCorpus: 'caro', frecuencia: 118,
    sentidoLatino: 'la carne',
    descendiente: 'carne', sentidoDescendiente: 'lo mismo',
    esFalsoRegalo: false, fuente: LS('caro'), corpus: 'todo',
  },
  {
    id: 'la-11f-08', punto: 'l11-falsos-regalos',
    lema: 'frāter', claveCorpus: 'frater', frecuencia: 378,
    sentidoLatino: 'el hermano',
    descendiente: 'fraterno, fraternidad, fraile', sentidoDescendiente: 'lo de hermano',
    esFalsoRegalo: false, fuente: LS('frater'), corpus: 'todo',
  },
  {
    id: 'la-11f-09', punto: 'l11-falsos-regalos',
    lema: 'nōmen', claveCorpus: 'nomen', frecuencia: 280,
    sentidoLatino: 'el nombre',
    descendiente: 'nombre', sentidoDescendiente: 'lo mismo',
    esFalsoRegalo: false, fuente: LS('nomen'), corpus: 'todo',
  },

  // ── TRES FIELES SIN MÁCRÓN ──
  {
    id: 'la-11f-10', punto: 'l11-falsos-regalos',
    lema: 'terra', claveCorpus: 'terra', frecuencia: 343,
    sentidoLatino: 'la tierra, el suelo, un país',
    descendiente: 'tierra', sentidoDescendiente: 'lo mismo',
    esFalsoRegalo: false, fuente: LS('terra'), corpus: 'todo',
  },
  {
    id: 'la-11f-11', punto: 'l11-falsos-regalos',
    lema: 'templum', claveCorpus: 'templum', frecuencia: 125,
    sentidoLatino: 'el recinto consagrado, el templo',
    descendiente: 'templo', sentidoDescendiente: 'lo mismo',
    esFalsoRegalo: false, fuente: LS('templum'), corpus: 'todo',
  },
];

// ── LAS TRES QUE SALIERON, con su motivo ─────────────────────────────
//
// `grātia` — RETIRADA POR FALSA, sin sustituir por otra sin comprobar.
//   La tarjeta decía «el primer sentido de gracia en español es lo
//   gracioso, y ése es el único que el latín NO tiene», y está mal por los
//   dos extremos: Lewis & Short abre por el sentido de «encanto, gracia»
//   —de donde las *Grātiae*—, así que el latín sí lo tiene; y el español
//   conserva los sentidos latinos en «dar las GRACIAS» (`grātiās agere`) y
//   «de GRATIS» (`grātiīs`). El desplazamiento declarado no es el que hubo.
//   Queda el hueco: mejor que rellenarlo con prisa.
//
// `parēns` y `dēbeō` — SALEN SÓLO POR EL EQUILIBRIO del mácrón, no por
//   nada suyo. Las dos son buenas tarjetas y vuelven en las 48 plazas que
//   le quedan al nivel.


/** El lote tal como se publica: barajado con `SEMILLA_DE_ORDEN`. */
export const LOTE_FALSOS_REGALOS = ordenPublicado(LOTE_FALSOS_REGALOS_FUENTE, SEMILLA_DE_ORDEN);
