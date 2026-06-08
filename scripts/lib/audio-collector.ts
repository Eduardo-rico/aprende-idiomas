// scripts/lib/audio-collector.ts
import type { Exercise, ExerciseType } from './zod-schemas';
import { ExerciseDataByTypeSchema } from './zod-schemas';

export interface AudioJob {
  text: string;
  variant: 'br' | 'pt';
}

/**
 * Devuelve los strings audio-eligible para un exercise y variante dados.
 * Re-valida el resultado del spread data + ptOverrides contra el schema del tipo
 * declarado: si ptOverrides tenía campos inválidos, throw. Esto convierte el
 * silent-corruption detectado en el review en un fail-fast explícito.
 *
 * Audio NO emitido para: fill_blank (la frase entera tendría audio pero su
 * valor pedagógico es bajo y haría inflar el cache 2x). verb_preposition igual.
 * sentence_construction emite el answer (la oración correcta).
 */
export function textsFor(ex: Exercise, variant: 'br' | 'pt'): string[] {
  if (variant === 'pt' && ex.ptOverrides) {
    const merged = { ...ex.data, ...ex.ptOverrides };
    // re-validar contra el schema del tipo declarado
    ExerciseDataByTypeSchema[ex.type].parse(merged);
  }
  const data: any = variant === 'pt' && ex.ptOverrides
    ? { ...ex.data, ...ex.ptOverrides }
    : ex.data;
  const t: ExerciseType = ex.type;
  switch (t) {
    case 'flashcard':
      return data.back ? [data.back] : [];
    case 'listening':
      return data.audioText ? [data.audioText] : [];
    case 'translation_es_pt':
      return data.target ? [data.target] : [];
    case 'translation_pt_es':
      return data.source ? [data.source] : [];
    case 'sentence_construction':
      return data.answer?.length ? [data.answer.join(' ')] : [];
    case 'chunk':
      return data.chunk ? [data.chunk] : [];
    case 'fill_blank':
    case 'verb_preposition':
      return [];
  }
}

export function collectAudioJobs(exercises: Exercise[]): AudioJob[] {
  const seen = new Set<string>();
  const jobs: AudioJob[] = [];
  for (const ex of exercises) {
    for (const variant of ['br', 'pt'] as const) {
      for (const text of textsFor(ex, variant)) {
        const key = `${variant}::${text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        jobs.push({ text, variant });
      }
    }
  }
  return jobs;
}
