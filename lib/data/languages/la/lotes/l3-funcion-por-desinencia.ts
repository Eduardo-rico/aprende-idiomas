// lib/data/languages/la/lotes/l3-funcion-por-desinencia.ts
//
// EL PRIMER LOTE DE LATÍN, y del formato que este proyecto no había
// producido nunca: el cloze **en la glosa española**.
//
// El punto es el eje maestro del curso —la función va en la desinencia, no
// en la posición— y por eso es el que se estrena: si el formato no deja
// examinarlo, se sabe con un punto y no con cuarenta y seis.
//
// Cada ítem pasa por `revisarLote`, que le exige cuatro cosas y ninguna es
// de estilo:
//
//   1. **El orden latino contradice al español.** Sólo OSV, OVS y VOS: en
//      SOV y VSO traducir en orden da la respuesta correcta y el ítem sale
//      gratis. Es la mitad del punto, así que es la mitad del gate.
//   2. **Los dos candidatos son reversibles**, o el sentido común decide.
//   3. **Los dos comparten género y número**, o los reparte el artículo.
//   4. **Ningún par de ítems comparte los cuatro ejes.**
import type { ItemClozeGlosa } from '../../../../../scripts/lib/gate-cloze-glosa';

const HUMANOS = (a: string, b: string) =>
  `${a} y ${b} son los dos humanos y los dos pueden hacer y recibir la acción: el sentido común no reparte los papeles`;

export const LOTE_FUNCION_POR_DESINENCIA: ItemClozeGlosa[] = [
  // El ejemplo canónico del propio inventario, pasado por su propio gate.
  // Comprobar el ejemplo CONTRA su regla ya evitó tres errores en una
  // noche, y aquí la comprobación es ejecutable.
  {
    id: 'la-fpd-01', punto: 'l3-funcion-por-desinencia',
    latin: 'Fīlium pater amat.',
    palabras: [
      { la: 'Fīlium', es: 'hijo', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' },
      { la: 'amat', es: 'ama', rol: 'verbo' },
    ],
    glosa: 'El ___ ama al ___.',
    respuestas: ['padre', 'hijo'],
    reversible: HUMANOS('padre', 'hijo'),
    ejes: { orden: 'OSV', conjugacion: 1, declinacion: 'mixta', numero: 'sg' },
  },
  {
    id: 'la-fpd-02', punto: 'l3-funcion-por-desinencia',
    latin: 'Amīcum fīlius vocat.',
    palabras: [
      { la: 'Amīcum', es: 'amigo', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'fīlius', es: 'hijo', rol: 'sujeto', gen: 'm', num: 'sg' },
      { la: 'vocat', es: 'llama', rol: 'verbo' },
    ],
    glosa: 'El ___ llama al ___.',
    respuestas: ['hijo', 'amigo'],
    reversible: HUMANOS('amigo', 'hijo'),
    ejes: { orden: 'OSV', conjugacion: 1, declinacion: '2ª', numero: 'sg' },
  },
  {
    id: 'la-fpd-03', punto: 'l3-funcion-por-desinencia',
    latin: 'Servum videt dominus.',
    palabras: [
      { la: 'Servum', es: 'siervo', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'videt', es: 've', rol: 'verbo' },
      { la: 'dominus', es: 'señor', rol: 'sujeto', gen: 'm', num: 'sg' },
    ],
    glosa: 'El ___ ve al ___.',
    respuestas: ['señor', 'siervo'],
    reversible: HUMANOS('siervo', 'señor'),
    ejes: { orden: 'OVS', conjugacion: 2, declinacion: '2ª', numero: 'sg' },
  },
  {
    id: 'la-fpd-04', punto: 'l3-funcion-por-desinencia',
    latin: 'Puellam rēgīna audit.',
    palabras: [
      { la: 'Puellam', es: 'niña', rol: 'objeto', gen: 'f', num: 'sg' },
      { la: 'rēgīna', es: 'reina', rol: 'sujeto', gen: 'f', num: 'sg' },
      { la: 'audit', es: 'oye', rol: 'verbo' },
    ],
    glosa: 'La ___ oye a la ___.',
    respuestas: ['reina', 'niña'],
    reversible: HUMANOS('niña', 'reina'),
    ejes: { orden: 'OSV', conjugacion: 4, declinacion: '1ª', numero: 'sg' },
  },
  // La 1.ª declinación MASCULINA: la forma parece femenina y el género no
  // lo es. El hispanohablante lee «-a» y da por hecha la concordancia.
  {
    id: 'la-fpd-05', punto: 'l3-funcion-por-desinencia',
    latin: 'Poētam laudat agricola.',
    palabras: [
      { la: 'Poētam', es: 'poeta', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'laudat', es: 'alaba', rol: 'verbo' },
      { la: 'agricola', es: 'campesino', rol: 'sujeto', gen: 'm', num: 'sg' },
    ],
    glosa: 'El ___ alaba al ___.',
    respuestas: ['campesino', 'poeta'],
    reversible: HUMANOS('poeta', 'campesino'),
    ejes: { orden: 'OVS', conjugacion: 1, declinacion: '1ª-masc', numero: 'sg' },
  },
  {
    id: 'la-fpd-06', punto: 'l3-funcion-por-desinencia',
    latin: 'Discipulum magister docet.',
    palabras: [
      { la: 'Discipulum', es: 'discípulo', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'magister', es: 'maestro', rol: 'sujeto', gen: 'm', num: 'sg' },
      { la: 'docet', es: 'enseña', rol: 'verbo' },
    ],
    glosa: 'El ___ enseña al ___.',
    respuestas: ['maestro', 'discípulo'],
    reversible: HUMANOS('discípulo', 'maestro'),
    ejes: { orden: 'OSV', conjugacion: 2, declinacion: '2ª', numero: 'sg' },
  },
  {
    id: 'la-fpd-07', punto: 'l3-funcion-por-desinencia',
    latin: 'Vocat fīliam māter.',
    palabras: [
      { la: 'Vocat', es: 'llama', rol: 'verbo' },
      { la: 'fīliam', es: 'hija', rol: 'objeto', gen: 'f', num: 'sg' },
      { la: 'māter', es: 'madre', rol: 'sujeto', gen: 'f', num: 'sg' },
    ],
    glosa: 'La ___ llama a la ___.',
    respuestas: ['madre', 'hija'],
    reversible: HUMANOS('hija', 'madre'),
    ejes: { orden: 'VOS', conjugacion: 1, declinacion: 'mixta', numero: 'sg' },
  },
  {
    id: 'la-fpd-08', punto: 'l3-funcion-por-desinencia',
    latin: 'Dominōs servī timent.',
    palabras: [
      { la: 'Dominōs', es: 'señores', rol: 'objeto', gen: 'm', num: 'pl' },
      { la: 'servī', es: 'siervos', rol: 'sujeto', gen: 'm', num: 'pl' },
      { la: 'timent', es: 'temen', rol: 'verbo' },
    ],
    glosa: 'Los ___ temen a los ___.',
    respuestas: ['siervos', 'señores'],
    reversible: HUMANOS('siervos', 'señores'),
    ejes: { orden: 'OSV', conjugacion: 2, declinacion: '2ª', numero: 'pl' },
  },
  {
    id: 'la-fpd-09', punto: 'l3-funcion-por-desinencia',
    latin: 'Rēgīnās vident puellae.',
    palabras: [
      { la: 'Rēgīnās', es: 'reinas', rol: 'objeto', gen: 'f', num: 'pl' },
      { la: 'vident', es: 'ven', rol: 'verbo' },
      { la: 'puellae', es: 'niñas', rol: 'sujeto', gen: 'f', num: 'pl' },
    ],
    glosa: 'Las ___ ven a las ___.',
    respuestas: ['niñas', 'reinas'],
    reversible: HUMANOS('reinas', 'niñas'),
    ejes: { orden: 'OVS', conjugacion: 2, declinacion: '1ª', numero: 'pl' },
  },
  {
    id: 'la-fpd-10', punto: 'l3-funcion-por-desinencia',
    latin: 'Servum dūcit dominus.',
    palabras: [
      { la: 'Servum', es: 'siervo', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'dūcit', es: 'guía', rol: 'verbo' },
      { la: 'dominus', es: 'señor', rol: 'sujeto', gen: 'm', num: 'sg' },
    ],
    glosa: 'El ___ guía al ___.',
    respuestas: ['señor', 'siervo'],
    reversible: HUMANOS('siervo', 'señor'),
    ejes: { orden: 'OVS', conjugacion: 3, declinacion: '2ª', numero: 'sg' },
  },
  {
    id: 'la-fpd-11', punto: 'l3-funcion-por-desinencia',
    latin: 'Mittit puerum magister.',
    palabras: [
      { la: 'Mittit', es: 'envía', rol: 'verbo' },
      { la: 'puerum', es: 'niño', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'magister', es: 'maestro', rol: 'sujeto', gen: 'm', num: 'sg' },
    ],
    glosa: 'El ___ envía al ___.',
    respuestas: ['maestro', 'niño'],
    reversible: HUMANOS('niño', 'maestro'),
    ejes: { orden: 'VOS', conjugacion: 3, declinacion: '2ª', numero: 'sg' },
  },
  {
    id: 'la-fpd-12', punto: 'l3-funcion-por-desinencia',
    latin: 'Audit fīlium pater.',
    palabras: [
      { la: 'Audit', es: 'oye', rol: 'verbo' },
      { la: 'fīlium', es: 'hijo', rol: 'objeto', gen: 'm', num: 'sg' },
      { la: 'pater', es: 'padre', rol: 'sujeto', gen: 'm', num: 'sg' },
    ],
    glosa: 'El ___ oye al ___.',
    respuestas: ['padre', 'hijo'],
    reversible: HUMANOS('hijo', 'padre'),
    ejes: { orden: 'VOS', conjugacion: 4, declinacion: 'mixta', numero: 'sg' },
  },
];
