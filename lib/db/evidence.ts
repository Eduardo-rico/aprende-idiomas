// lib/db/evidence.ts
//
// Registro y recuento de evidencia MCER.
//
// LA REGLA DE RECUENTO, y es lo único importante de este archivo:
//
//   · Cuentan los EJERCICIOS DISTINTOS, no las respuestas. Machacar la
//     misma tarjeta diez veces es una evidencia, no diez.
//   · Para un umbral de 2 o más se exigen además DOS DÍAS DISTINTOS.
//     Acertar dos veces seguidas es memoria de trabajo; acertar en dos
//     días distintos es haber aprendido. Sin esta condición, una sola
//     sesión larga «demostraría» un nivel entero, que es exactamente el
//     tipo de inflación que este eje vino a eliminar.
//
// Sólo se guardan las respuestas correctas. Fallar no es evidencia en
// contra: el alumno puede fallar por prisa, por ruido o por la tarjeta.
import { db, type EvidenceRow } from './schema';
import { anclarEjercicio } from '@/lib/data/anchor';
import { levelProgress, type Descriptor, type LevelProgress } from '@/lib/data/cefr';

/** YYYY-MM-DD en hora local, que es la que percibe el alumno. */
export function diaLocal(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export interface RegistrarParams {
  exerciseId: string;
  type: string;
  blockId: number;
  correct: boolean;
  language?: string;
  now?: Date;
}

/** Registra evidencia si el ejercicio ancla a un descriptor y se acertó.
 *  Devuelve el descriptorId si registró, o null. Es idempotente por
 *  (descriptor, ejercicio, día): repetir la misma tarjeta el mismo día no
 *  añade filas. */
export async function registrarEvidencia(p: RegistrarParams): Promise<string | null> {
  if (!p.correct) return null;
  const lang = p.language ?? 'pt';
  const anclaje = anclarEjercicio({ type: p.type, blockId: p.blockId }, lang);
  if (!anclaje) return null;

  const now = p.now ?? new Date();
  const day = diaLocal(now);
  const yaHoy = await db.evidence
    .where('[descriptorId+day]')
    .equals([anclaje.descriptorId, day])
    .filter((r) => r.exerciseId === p.exerciseId)
    .count();
  if (yaHoy > 0) return anclaje.descriptorId;

  const row: EvidenceRow = {
    descriptorId: anclaje.descriptorId,
    exerciseId: p.exerciseId,
    day,
    ts: now,
    language: lang,
    correct: true,
  };
  await db.evidence.add(row);
  return anclaje.descriptorId;
}

/** Recuento por descriptor, aplicando la regla de arriba.
 *  El valor devuelto es «evidencias válidas», que es lo que
 *  `levelProgress` compara contra `evidenceThreshold`. */
export async function contarEvidencias(
  descriptores: Descriptor[],
): Promise<Record<string, number>> {
  const filas = await db.evidence.toArray();
  const porDescriptor = new Map<string, EvidenceRow[]>();
  for (const f of filas) {
    if (!f.correct) continue;
    const arr = porDescriptor.get(f.descriptorId) ?? [];
    arr.push(f);
    porDescriptor.set(f.descriptorId, arr);
  }

  const out: Record<string, number> = {};
  for (const d of descriptores) {
    const filasD = porDescriptor.get(d.id) ?? [];
    const ejercicios = new Set(filasD.map((f) => f.exerciseId));
    const dias = new Set(filasD.map((f) => f.day));
    // Con umbral ≥2 exigimos dispersión temporal. Si sólo hay un día, el
    // recuento se queda en 1 por muchos ejercicios distintos que haya:
    // una sola sesión no demuestra un descriptor.
    const n = d.evidenceThreshold >= 2 && dias.size < 2
      ? Math.min(ejercicios.size, 1)
      : ejercicios.size;
    out[d.id] = n;
  }
  return out;
}

/** El progreso de nivel real del alumno, leído de Dexie. */
export async function progresoDeNivel(descriptores: Descriptor[]): Promise<LevelProgress[]> {
  return levelProgress(descriptores, await contarEvidencias(descriptores));
}
