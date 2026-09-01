// lib/exercises/respuesta.ts — qué se enseña de un ejercicio, y cuándo.
//
// Existe porque la tarjeta de la sesión de repaso tenía esto:
//
//     function backFor(ex) {
//       if (ex.type === 'flashcard') return ex.data.back;
//       const answer = ex.data.answer;
//       return typeof answer === 'string' ? answer : '';
//     }
//
// Dos tipos mirados, once ignorados, y el render es `{back && …}`. Es
// decir: **1.640 de 2.131 ejercicios servibles —el 77 %— no enseñaban su
// respuesta al revelarla**, en el flujo que se usa a diario con el FSRS.
// Las respuestas estaban ahí todo el tiempo, en `blanks[].answer`,
// `correct`, `target`, `modelAnswer`, `options[correctIndex]`.
//
// La práctica por lección NO estaba rota: va por `ExerciseRunner`, con una
// tarjeta por tipo que sí las muestra. El roto era el repaso, que es el
// que sostiene la retención.
//
// DOS CAUTELAS, y las dos con test:
//
//   · **El frente no puede filtrar la respuesta.** Un `listening` cuyo
//     frente imprime la transcripción no se escucha: se lee. Un
//     `error_correction` tiene que enseñar la frase MALA, no la buena.
//   · **Un tipo nuevo no puede quedarse mudo en silencio.** Por eso el
//     switch es exhaustivo por tipo conocido, y hay un test que recorre el
//     corpus entero exigiendo que ningún ejercicio se quede sin respuesta.
//     La avería que esto arregla duró meses precisamente porque un tipo
//     que no encaja no da error: devuelve cadena vacía y no se pinta nada.
import type { Exercise } from '@/lib/data/zod-schemas';

type Datos = Record<string, unknown>;
const d = (ex: Exercise): Datos => ((ex as unknown as { data?: Datos }).data ?? {});
const s = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/** Separador de una respuesta con varias partes. Los cloze de dos huecos
 *  piden las dos formas, y enseñar sólo la primera repetiría en pequeño el
 *  defecto que este módulo arregla. */
const Y = ' · ';

/** LA RESPUESTA: lo que el alumno tenía que producir, para pintarla al
 *  revelar. Cadena vacía sólo si de verdad no hay nada que enseñar. */
export function respuestaDe(ex: Exercise): string {
  const x = d(ex);
  switch (ex.type) {
    case 'flashcard':
      return s(x.back);

    case 'fill_blank': {
      const blanks = Array.isArray(x.blanks) ? (x.blanks as Datos[]) : [];
      return blanks.map((b) => s(b?.answer)).filter(Boolean).join(Y);
    }

    case 'translation':
      // El destino es lo que se pedía producir; el origen ya está delante.
      return s(x.target);

    case 'error_correction':
      return s(x.correct);

    case 'grammaticality_judgment':
      // El juicio SOLO no enseña nada: si la frase está mal, lo que hay
      // que ver es cómo se arregla.
      return x.verdict === true
        ? 'Está bien formada.'
        : ['Está mal formada.', s(x.repair)].filter(Boolean).join(' → ');

    case 'multiple_choice': {
      const opciones = Array.isArray(x.options) ? (x.options as unknown[]) : [];
      const i = typeof x.correctIndex === 'number' ? x.correctIndex : -1;
      return s(opciones[i]);
    }

    case 'matching': {
      const pares = Array.isArray(x.pairs) ? (x.pairs as Datos[]) : [];
      return pares.map((p) => `${s(p?.left)} → ${s(p?.right)}`).filter((l) => l !== ' → ').join('\n');
    }

    case 'mediation':
      return s(x.modelAnswer);

    // Los que ya funcionaban, ahora nombrados en vez de caer por defecto:
    // que funcionaran era un accidente de tener el campo bien llamado.
    case 'listening':
    case 'conjugation':
    case 'verb_preposition':
    case 'transformation':
      return s(x.answer);

    default:
      // Red de seguridad para un tipo que aún no esté aquí. El test del
      // corpus entero es lo que impide que esta rama sea la normal.
      return s(x.answer) || s(x.correct) || s(x.target) || s(x.modelAnswer) || s(x.back);
  }
}

/** EL FRENTE: lo que se ve ANTES de revelar. No puede contener la
 *  respuesta, y tiene que bastar para intentar el ejercicio. */
export function frenteDe(ex: Exercise): string {
  const x = d(ex);
  switch (ex.type) {
    case 'flashcard':
      return s(x.front);

    case 'listening':
      // NO la transcripción: es literalmente la respuesta hablada, y con
      // ella delante el ejercicio deja de ser de escucha.
      return s(x.question) || 'Escucha y responde.';

    case 'fill_blank':
    case 'error_correction':
    case 'grammaticality_judgment':
      // La frase con el hueco, o la frase MALA que hay que corregir.
      return s(x.sentence);

    case 'translation':
      return s(x.source);

    case 'transformation':
      return [s(x.source), s(x.instructionEs)].filter(Boolean).join('\n');

    case 'multiple_choice':
      return s(x.question);

    case 'verb_preposition':
      return s(x.sentence);

    case 'conjugation':
      return [s(x.infinitive), s(x.person), s(x.tense)].filter(Boolean).join(' · ');

    case 'matching':
      // Sin esto se quedaba en blanco: `pairs` es un array y el antiguo
      // «primer campo que parezca string» no encontraba ninguno.
      return (Array.isArray(x.pairs) ? (x.pairs as Datos[]) : []).map((p) => s(p?.left)).filter(Boolean).join(Y);

    case 'mediation':
      return s(x.sourceText);

    default: {
      const primero = Object.values(x).find((v) => typeof v === 'string');
      return s(primero);
    }
  }
}

/** Las alternativas que la tarjeta también acepta, para enseñarlas al
 *  revelar: el alumno que escribió una de ellas acertó, y si sólo ve la
 *  principal se autocalifica mal. */
export function alternativasDe(ex: Exercise): string[] {
  const x = d(ex);
  const listas: unknown[] = [x.alternatives, x.acceptedAlternatives];
  if (ex.type === 'fill_blank' && Array.isArray(x.blanks))
    for (const b of x.blanks as Datos[]) listas.push(b?.alternatives);
  const out: string[] = [];
  for (const l of listas) if (Array.isArray(l)) for (const v of l) { const t = s(v); if (t) out.push(t); }
  const principal = respuestaDe(ex);
  return [...new Set(out)].filter((a) => a !== principal);
}
