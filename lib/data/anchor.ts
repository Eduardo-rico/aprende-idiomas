// lib/data/anchor.ts
//
// Ancla un ejercicio del corpus a un descriptor can-do, para que lo que el
// alumno YA estudia cuente hacia su nivel.
//
// Sin esto el eje MCER es correcto y está vacío: marca 0 de 29 porque
// ninguna tarea produce evidencia. Pero los 60 `error_correction` sobre el
// conjuntivo SON producción escrita de B1 — sólo que nadie se lo había
// dicho a la app.
//
// EL ANCLAJE ES GRUESO, Y SE DECLARA COMO TAL. Se deriva de dos cosas que
// sí sabemos: el tipo de ejercicio (que determina la destreza) y el bloque
// (que determina el nivel). No sustituye a anclar cada ítem a mano contra
// una TaskSpec concreta; es lo que se puede afirmar hoy sin inventar.
import type { CefrLevel, Skill } from '@/lib/data/cefr';

/** Tipo de ejercicio → destreza que realmente ejercita.
 *
 *  Dos ausencias deliberadas:
 *
 *  · `translation` NO cuenta como MEDIACIÓN. Una traducción sin
 *    destinatario, propósito ni canal no es mediación: es traducción. El
 *    plan lo dejó por escrito (§8.6) al rechazar que las 288 traducciones
 *    del corpus inflaran esa columna. Reetiquetar para poner un gate en
 *    verde es exactamente cómo un eje de niveles se vuelve decorativo.
 *
 *  · Nada cuenta como INTERACCIÓN ni como PRODUCCIÓN ORAL. No hay un solo
 *    ejercicio en el corpus que las ejercite, y fingir lo contrario haría
 *    que el nivel global —que es el mínimo de las destrezas— dejara de
 *    detectar el agujero más grande del curso.
 */
const TIPO_A_DESTREZA: Record<string, Skill | null> = {
  // Producir portugués por escrito: hay que escribirlo, no reconocerlo.
  error_correction: 'produccion_escrita',
  fill_blank: 'produccion_escrita',
  conjugation: 'produccion_escrita',
  translation: 'produccion_escrita', // sólo si el destino es portugués; ver anclarEjercicio

  // Reconocer, no producir.
  flashcard: 'comprension_lectora',
  multiple_choice: 'comprension_lectora',
  matching: 'comprension_lectora',
  verb_preposition: 'comprension_lectora',

  listening: 'comprension_oral',
  shadowing: 'produccion_oral',

  // Sin destreza clara o sin contenido: no se ancla.
  lesson: null,
  chunk: null,
  sentence_construction: null,
};

/** Bloque → nivel MCER. Del mapeo del plan §3.1, hecho concepto a concepto.
 *  Un bloque puede abarcar dos niveles; se toma el MÁS ALTO que toca,
 *  porque una tarea que exige B1 evidencia B1 aunque también repase A2. */
const BLOQUE_A_NIVEL: Record<number, CefrLevel> = {
  1: 'A1',  // fonética y ortografía
  2: 'A2',  // morfología nominal (A1+A2)
  3: 'A2',  // presente e imperativo (A1+A2)
  4: 'B1',  // pasados (A2+B1)
  5: 'B1',  // futuros y condicional (A2+B1)
  6: 'B2',  // conjuntivo (B1+B2)
  7: 'B2',  // formas no personales (B1+B2)
  8: 'B2',  // sintaxis y conectores (B1+B2+C1) — el tramo C1 son 57 ítems
  9: 'A2',  // léxico: campo abierto, sin nivel propio
  10: 'B1', // registros y variación (A2+B1+)
};

export interface Anclaje {
  descriptorId: string;
  cefr: CefrLevel;
  skill: Skill;
}

interface EjercicioAnclable {
  type: string;
  blockId: number;
  data?: { targetLang?: string; sourceLang?: string } & Record<string, unknown>;
}

/** Devuelve el descriptor que este ejercicio evidencia, o null si ninguno.
 *  `null` es una respuesta legítima y frecuente: la mayoría del corpus no
 *  evidencia nada que podamos afirmar. */
export function anclarEjercicio(ex: EjercicioAnclable, lang = 'pt'): Anclaje | null {
  let skill = TIPO_A_DESTREZA[ex.type] ?? null;
  if (!skill) return null;

  // Una traducción sólo produce portugués si el destino es portugués.
  // `pt → es` es comprensión lectora, no producción — y no es mediación.
  if (ex.type === 'translation') {
    const target = String(ex.data?.targetLang ?? '');
    skill = target.startsWith('pt') ? 'produccion_escrita' : 'comprension_lectora';
  }

  const cefr = BLOQUE_A_NIVEL[ex.blockId];
  if (!cefr) return null;

  return { descriptorId: `${lang}.${cefr}.${skill}`, cefr, skill };
}

/** Sólo para diagnóstico: cuántos ejercicios ancla cada descriptor.
 *  Sirve para ver de un vistazo qué destrezas quedan a cero — que es
 *  justamente lo que el eje debe seguir mostrando mientras sea verdad. */
export function resumenAnclaje(
  ejercicios: EjercicioAnclable[],
  lang = 'pt',
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const ex of ejercicios) {
    const a = anclarEjercicio(ex, lang);
    if (!a) continue;
    out[a.descriptorId] = (out[a.descriptorId] ?? 0) + 1;
  }
  return out;
}
