// lib/data/languages/la/pistas-revisadas.ts
//
// LAS LISTAS DE PISTAS, REVISADAS POR EL LATINISTA ADVERSARIAL.
//
// Existe porque una lista escrita por el autor del lote no vale. El
// algoritmo que busca atajos es exhaustivo sobre la lista, y **la lista la
// escribe una persona**: quien escribe los ítems es el peor situado para
// enumerar lo que su propio lote regala.
//
// La prueba está en este mismo proyecto: cuatro de los cinco lotes se
// resolvían al 100 % **contando ejercicios**, y esa pista no se le ocurrió
// a quien los escribió. En rumano el autor puso 9 pistas y el revisor
// barrió 72, encontrando dos atajos tipográficos que el autor no podía ver
// porque no son propiedades de la lengua.
//
// ── DOS COSAS QUEDAN FUERA, Y LAS DOS IMPORTAN ────────────────────────
//
//   1. Lo que el alumno **no puede ver**: un campo interno, la intención.
//   2. Lo que ve **pero ES la destreza examinada**. La vocal temática del
//      presente (`amat` contra `dūcit`) está a la vista y decide la
//      respuesta al 100 %, y eso no es un atajo: es aprobar el examen.
//      Meterla empujaría a destruir el ejercicio.
//
// Las excluidas van escritas abajo con su motivo, porque un hueco sin
// razón se vuelve a llenar.
//
// ── Y LAS QUE NO SEPARAN TAMBIÉN VAN ──────────────────────────────────
//
// El latinista midió varias que él mismo habría apostado y no valen —la
// longitud de la frase, la primera palabra más larga, el mácrón inicial,
// la paridad del número de ejercicio—. Se quedan en la lista: son
// evidencia negativa medida, y sin ellas el siguiente las vuelve a
// proponer creyendo que son nuevas.
import type { Pista, PistasDeclaradas } from '../../../../scripts/lib/composiciones';
import type { ItemClozeGlosa } from '../../../../scripts/lib/gate-cloze-glosa';
import type { ItemClozeDerivado } from '../../../../scripts/lib/gate-cloze-derivado';
import type { ItemConcordancia } from '../../../../scripts/lib/gate-concordancia';
import type { ItemFlashcard } from '../../../../scripts/lib/gate-flashcard';
import type { ItemTransformacion } from '../../../../scripts/lib/gate-transformacion';

export const REVISOR = 'latinista adversarial (2026-09-04)';

const conMacron = (s: string) => /[āēīōū]/.test(s.normalize('NFC'));
const sinRayita = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** La pista que valía en los cinco y que nadie había puesto. Se conserva
 *  en las listas aunque el orden ya vaya barajado: si alguien deshace el
 *  barajado, esto lo caza. */
const porPosicion = <T>(): Pista<T> => ({ nombre: 'voy por la mitad del cuaderno', vale: () => false });

export const PISTAS_L3: PistasDeclaradas<ItemClozeGlosa> = {
  revisadaPor: REVISOR,
  pistas: [
    { nombre: 'es plural', vale: (i) => i.ejes.numero === 'pl' },
    { nombre: 'el verbo va primero', vale: (i) => i.ejes.orden.startsWith('V') },
    { nombre: 'el verbo va último', vale: (i) => i.ejes.orden.endsWith('V') },
    { nombre: 'los nombres son femeninos', vale: (i) => i.palabras.some((p) => p.gen === 'f') },
    { nombre: 'la conjugación es 1ª', vale: (i) => i.ejes.conjugacion === 1 },
    // Las que el latinista midió y NO separan. Se quedan como evidencia.
    { nombre: 'la frase empieza por la palabra más larga', vale: (i) => i.palabras[0]!.la.length >= Math.max(...i.palabras.map((p) => p.la.length)) },
    { nombre: 'la frase es larga', vale: (i) => i.latin.length >= 21 },
    { nombre: 'la primera palabra lleva rayita', vale: (i) => conMacron(i.palabras[0]!.la) },
    // La sospecha que él dejó abierta: los nombres de relleno se metieron
    // al final y algunos salen siempre del mismo lado.
    { nombre: 'esa palabra no la había visto antes', vale: (i) => ['regina', 'domina', 'servus', 'puer'].some((l) => sinRayita(i.latin).includes(l)) },
    porPosicion<ItemClozeGlosa>(),
  ],
};
// EXCLUIDA de l3: «el primer nombre acaba en -m» (15/20). Es la desinencia
// de acusativo: leerla ES el punto.

export const PISTAS_L2: PistasDeclaradas<ItemClozeDerivado> = {
  revisadaPor: REVISOR,
  pistas: [
    { nombre: 'hay vocal antes de la -e- final del lema', vale: (i) => /[aeiou]er$/.test(i.entrada.lema.normalize('NFC')) },
    { nombre: 'la celda es plural', vale: (i) => i.celda.endsWith('pl') },
    { nombre: 'el lema es largo', vale: (i) => i.entrada.lema.length >= 7 },
    { nombre: 'el hueco va al principio del marco', vale: (i) => i.marco.startsWith('___') },
    { nombre: 'la celda es de acusativo', vale: (i) => i.celda.startsWith('ac') },
    porPosicion<ItemClozeDerivado>(),
  ],
};

export const PISTAS_L4: PistasDeclaradas<ItemConcordancia> = {
  revisadaPor: REVISOR,
  pistas: [
    { nombre: 'es plural', vale: (i) => i.celda.endsWith('pl') },
    { nombre: 'el adjetivo es «bonus»', vale: (i) => i.adjetivo.lema === 'bonus' },
    { nombre: 'la glosa española es femenina', vale: (i) => i.generoEs === 'f' },
    { nombre: 'el hueco va al principio del marco', vale: (i) => i.marco.startsWith('___') },
    { nombre: 'la pista se enrolla', vale: (i) => i.pista.length >= 60 },
    porPosicion<ItemConcordancia>(),
  ],
};
// EXCLUIDA de l4: «el sustantivo acaba en -um / -us / -a». Leer la
// desinencia del sustantivo para darle al adjetivo la que le toca ES el
// punto entero.

export const PISTAS_L11: PistasDeclaradas<ItemFlashcard> = {
  revisadaPor: REVISOR,
  pistas: [
    { nombre: 'lleva rayita encima', vale: (i) => conMacron(i.lema) },
    { nombre: 'acaba en -us o en -um', vale: (i) => /(us|um)$/.test(i.lema.normalize('NFC')) },
    { nombre: 'es un verbo', vale: (i) => /(ō|eō)$/.test(i.lema.normalize('NFC')) },
    { nombre: 'la palabra española es abstracta', vale: (i) => ['virtud', 'fe', 'causa', 'querer', 'deber'].includes(i.descendiente) },
    { nombre: 'el latín es más largo que el español', vale: (i) => i.lema.length > i.descendiente.length + 1 },
    { nombre: 'se escriben casi igual', vale: (i) => sinRayita(i.lema).slice(0, 4) === i.descendiente.toLowerCase().slice(0, 4) },
    { nombre: 'sale más de 200 veces', vale: (i) => i.frecuencia > 200 },
    porPosicion<ItemFlashcard>(),
  ],
};

export const PISTAS_L5: PistasDeclaradas<ItemTransformacion> = {
  revisadaPor: REVISOR,
  pistas: [
    { nombre: 'es plural', vale: (i) => i.persona.endsWith('pl') },
    { nombre: 'es tercera persona', vale: (i) => i.persona.startsWith('3') },
    { nombre: 'es primera persona', vale: (i) => i.persona.startsWith('1') },
    { nombre: 'la entrada es larga', vale: (i) => i.entrada.length >= 7 },
    { nombre: 'la entrada lleva rayita', vale: (i) => conMacron(i.entrada) },
    // Medida por el latinista y NO separa: el español no agrupa las
    // conjugaciones como el latín. `amar`(1.ª), `ver`(2.ª), `guiar`(3.ª),
    // `oír`(4.ª) no se alinean. Evidencia negativa, y se queda.
    { nombre: 'el verbo español acaba en -ar', vale: (i) => i.verbo.glosa.endsWith('ar') },
    porPosicion<ItemTransformacion>(),
  ],
};
// EXCLUIDAS de l5, las tres por ser la destreza: la vocal temática del
// presente (`amat` contra `dūcit`), la del infinitivo (`amāre` contra
// `dūcere`), y los remates `-eō` / `-iō` del lema. Identificar la
// conjugación es literalmente lo que el punto examina.

// ── EL VOCATIVO: LISTA AÚN NO REVISADA, Y SE DICE ────────────────────
//
// El lote de `l2-vocativo` es posterior al informe del latinista, así que
// su lista la escribió el autor. Eso vale menos y el veredicto sale
// marcado `pistas-sin-revisar`, que es la verdad y no un descuido.
export const PISTAS_L2V: PistasDeclaradas<ItemClozeDerivado> = {
  revisadaPor: 'sin revisar',
  pistas: [
    { nombre: 'el lema acaba en -er', vale: (i) => /er$/.test(i.entrada.lema.normalize('NFC')) },
    { nombre: 'el lema es largo', vale: (i) => i.entrada.lema.length >= 7 },
    { nombre: 'lleva rayita', vale: (i) => conMacron(i.entrada.lema) },
    { nombre: 'el marco empieza por el hueco', vale: (i) => i.marco.startsWith('___') },
    porPosicion<ItemClozeDerivado>(),
  ],
};
// EXCLUIDA de l2-vocativo, y es la que más acierta: «el lema acaba en
// -us». Con ella, «si acaba en -us pon -e, si no copia el nominativo»
// saca 9/10 con p = 0,013. Pero eso ES la regla que el punto enseña, y
// falla exactamente en `fīlī`, que es la excepción — o sea que el ítem
// que la separa del alumno que sabe es justo el que tiene que estar.
// Meterla en la lista habría empujado a destruir el punto.
