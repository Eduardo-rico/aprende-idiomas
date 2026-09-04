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
  // ── SEIS QUE SE DESPLAZARON ──
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
    lema: 'parēns', claveCorpus: 'parens', frecuencia: 32,
    sentidoLatino: 'progenitor: el padre o la madre, y en plural los dos',
    descendiente: 'pariente', sentidoDescendiente: 'cualquier familiar',
    esFalsoRegalo: true, desplazamiento: 'ampliación',
    porQueUnHispanohablante: 'el español amplió la palabra a todo el árbol familiar, así que «parentēs» se lee «los parientes» y son exactamente «los padres». En una frase de familia las dos lecturas son coherentes y sólo una es la del texto.',
    fuente: LS('parens'), corpus: 'todo',
  },
  {
    id: 'la-11f-03', punto: 'l11-falsos-regalos',
    lema: 'dēbeō', claveCorpus: 'debeo', frecuencia: 181,
    sentidoLatino: 'deber DINERO, estar en deuda; la obligación moral es un uso derivado',
    descendiente: 'deber', sentidoDescendiente: 'tener la obligación de',
    esFalsoRegalo: true, desplazamiento: 'cambio-de-dominio',
    porQueUnHispanohablante: 'el español usa «deber» sobre todo para la obligación, y el latín para la deuda: «dēbet» a secas se lee «tiene el deber» cuando dice «está endeudado». El hispanohablante no duda porque su palabra funciona.',
    fuente: LS('debeo'), corpus: 'todo',
  },
  {
    id: 'la-11f-04', punto: 'l11-falsos-regalos',
    lema: 'virtūs', claveCorpus: 'uirtus', frecuencia: 187,
    sentidoLatino: 'valor, hombría, excelencia del que cumple su papel; en la Vulgata también «poder, milagro»',
    descendiente: 'virtud', sentidoDescendiente: 'excelencia moral',
    esFalsoRegalo: true, desplazamiento: 'estrechamiento',
    porQueUnHispanohablante: '«virtud» en español es sólo moral, y «virtūs» es lo que hace un varón en la batalla: «virtūs mīlitum» se lee «la virtud de los soldados» y es «su valor». La lectura piadosa cabe y no es la del texto.',
    fuente: LS('virtus'), corpus: 'todo',
  },
  {
    // Sustituyó a `sententia`, que salía 2 veces en la Vulgata.
    id: 'la-11f-05', punto: 'l11-falsos-regalos',
    lema: 'grātia', claveCorpus: 'gratia', frecuencia: 241,
    sentidoLatino: 'el favor que se hace o se recibe, el agradecimiento, la influencia; y en ablativo pospuesto, «por causa de» («honōris grātiā»). En la Vulgata, la gracia',
    descendiente: 'gracia', sentidoDescendiente: 'lo que hace reír; el donaire',
    esFalsoRegalo: true, desplazamiento: 'cambio-de-dominio',
    porQueUnHispanohablante: 'el primer sentido de «gracia» en español es lo gracioso, y ése es exactamente el único que el latín NO tiene. Y hay algo peor: «grātiā» pospuesto es una posposición que significa «por causa de», así que «honōris grātiā» se lee «la gracia del honor» y construye una frase entera coherente y falsa.',
    fuente: LS('gratia'), corpus: 'todo',
  },
  {
    id: 'la-11f-06', punto: 'l11-falsos-regalos',
    lema: 'fidēs', claveCorpus: 'fides', frecuencia: 214,
    // La tarjeta que enseña las DOS: la afirmación «fidēs no es fe» es
    // verdadera en Cicerón y falsa en Jerónimo, y L1 entra por la Vulgata.
    sentidoLatino: 'en el latín clásico, la lealtad y la palabra dada («fidem servāre»), y el crédito comercial; en la VULGATA sí es la fe religiosa',
    descendiente: 'fe', sentidoDescendiente: 'creencia religiosa',
    esFalsoRegalo: true, desplazamiento: 'cambio-de-dominio',
    porQueUnHispanohablante: 'la tarjeta tiene que decir las dos cosas o miente en la mitad del corpus: quien lea a César con «fe» se pierde, y quien lea a Jerónimo con «lealtad» también. El desplazamiento ocurrió DENTRO del latín.',
    fuente: LS('fides'), corpus: 'todo',
  },

  // ── SEIS QUE TRANSFIEREN, y sin ellos el lote se aprueba desconfiando ──
  {
    id: 'la-11f-07', punto: 'l11-falsos-regalos',
    lema: 'terra', claveCorpus: 'terra', frecuencia: 343,
    sentidoLatino: 'la tierra, el suelo, un país',
    descendiente: 'tierra', sentidoDescendiente: 'lo mismo',
    esFalsoRegalo: false, fuente: LS('terra'), corpus: 'todo',
  },
  {
    id: 'la-11f-08', punto: 'l11-falsos-regalos',
    lema: 'templum', claveCorpus: 'templum', frecuencia: 125,
    sentidoLatino: 'el recinto consagrado, el templo',
    descendiente: 'templo', sentidoDescendiente: 'lo mismo',
    esFalsoRegalo: false, fuente: LS('templum'), corpus: 'todo',
  },
  {
    // Sustituyó a `hostis`, que sale CERO veces en la Vulgata.
    id: 'la-11f-09', punto: 'l11-falsos-regalos',
    lema: 'carō', claveCorpus: 'caro', frecuencia: 118,
    sentidoLatino: 'la carne',
    descendiente: 'carne', sentidoDescendiente: 'lo mismo',
    esFalsoRegalo: false, fuente: LS('caro'), corpus: 'todo',
  },
  {
    id: 'la-11f-10', punto: 'l11-falsos-regalos',
    lema: 'servus', claveCorpus: 'seruus', frecuencia: 148,
    sentidoLatino: 'el esclavo',
    descendiente: 'siervo', sentidoDescendiente: 'el que sirve, sin libertad',
    esFalsoRegalo: false, fuente: LS('servus'), corpus: 'todo',
  },
  {
    id: 'la-11f-11', punto: 'l11-falsos-regalos',
    lema: 'tempus', claveCorpus: 'tempus', frecuencia: 327,
    sentidoLatino: 'el tiempo, y la ocasión oportuna',
    descendiente: 'tiempo', sentidoDescendiente: 'lo mismo',
    esFalsoRegalo: false, fuente: LS('tempus'), corpus: 'todo',
  },
  {
    id: 'la-11f-12', punto: 'l11-falsos-regalos',
    lema: 'locus', claveCorpus: 'locus', frecuencia: 435,
    sentidoLatino: 'el lugar, el sitio',
    descendiente: 'lugar', sentidoDescendiente: 'lo mismo',
    esFalsoRegalo: false, fuente: LS('locus'), corpus: 'todo',
  },
];

/** El lote tal como se publica: barajado con `SEMILLA_DE_ORDEN`. */
export const LOTE_FALSOS_REGALOS = ordenPublicado(LOTE_FALSOS_REGALOS_FUENTE, SEMILLA_DE_ORDEN);
