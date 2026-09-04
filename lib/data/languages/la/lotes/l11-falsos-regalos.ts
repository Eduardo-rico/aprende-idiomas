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
// difícil. El propio punto lo dice de la trampa más citada del género:
// «hostis = huésped» es inglesa (host < hospes), y para nosotros «hueste»
// y «hostil» ya apuntan a enemigo. Por eso `hostis` está aquí como
// VERDADERO regalo, que es lo que es para nuestro alumno.
//
// Y una nota de método que salió midiendo: el punto propone `hospes` como
// «el falso regalo real de esa familia», y `hospes` aparece **19 veces en
// 227.301 tokens**, por debajo del umbral citable. Es buena lingüística y
// mala tarjeta: una trampa que el alumno no se encuentra no merece un
// ítem de los sesenta del nivel.
import type { ItemFlashcard } from '../../../../../scripts/lib/gate-flashcard';

const LS = (s: string) => `Lewis & Short s.v. ${s}`;

export const LOTE_FALSOS_REGALOS: ItemFlashcard[] = [
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
    id: 'la-11f-05', punto: 'l11-falsos-regalos',
    lema: 'sententia', claveCorpus: 'sententia', frecuencia: 62,
    sentidoLatino: 'la opinión que uno sostiene o vota; el parecer',
    descendiente: 'sentencia', sentidoDescendiente: 'fallo judicial, o máxima',
    esFalsoRegalo: true, desplazamiento: 'estrechamiento',
    porQueUnHispanohablante: 'los dos sentidos españoles —el fallo y la máxima— existen en latín como usos menores, así que el hispanohablante acierta a veces y eso le confirma la lectura equivocada en el resto. En el senado «sententia» es el voto de cada uno.',
    fuente: LS('sententia'), corpus: 'todo',
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
    id: 'la-11f-09', punto: 'l11-falsos-regalos',
    // LA TARJETA QUE ENSEÑA EL MÉTODO: en los manuales ingleses ésta es la
    // trampa estrella —«hostis no es host»— y para nosotros no lo es.
    lema: 'hostis', claveCorpus: 'hostis', frecuencia: 194,
    sentidoLatino: 'el enemigo público, el del pueblo enemigo',
    descendiente: 'hueste, hostil', sentidoDescendiente: 'tropa; enemigo',
    esFalsoRegalo: false, fuente: LS('hostis'), corpus: 'todo',
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
