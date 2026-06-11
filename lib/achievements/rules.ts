// lib/achievements/rules.ts

export interface AppState {
  totalAnswers: number;
  currentStreak: number;
  completedBlocks: number[];
  perfectLessons: number;
  storiesRead: number;
  vocabCardsLearned: number;
  conceptsMastery80: number;
  diagnosticCount: number;
  variantsUsed: Set<string>;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  check: (s: AppState) => boolean;
}

export const RULES: Rule[] = [
  { id: "first-card", name: "Primeira palavra", description: "Responde tu primera card", check: s => s.totalAnswers >= 1 },
  { id: "100-cards", name: "Centenário", description: "100 cards respondidas", check: s => s.totalAnswers >= 100 },
  { id: "1000-cards", name: "Maratonista", description: "1,000 cards respondidas", check: s => s.totalAnswers >= 1000 },
  { id: "streak-3", name: "Consistente", description: "3 días seguidos estudiando", check: s => s.currentStreak >= 3 },
  { id: "streak-7", name: "Uma semana", description: "7 días seguidos", check: s => s.currentStreak >= 7 },
  { id: "streak-30", name: "Um mês", description: "30 días seguidos", check: s => s.currentStreak >= 30 },
  { id: "streak-100", name: "Disciplina", description: "100 días seguidos", check: s => s.currentStreak >= 100 },
  { id: "block-1-complete", name: "Fonética dominada", description: "Bloque 1 completo", check: s => s.completedBlocks.includes(1) },
  { id: "block-2-complete", name: "Morfología", description: "Bloque 2 completo", check: s => s.completedBlocks.includes(2) },
  { id: "block-3-complete", name: "Presente", description: "Bloque 3 completo", check: s => s.completedBlocks.includes(3) },
  { id: "perfect-lesson", name: "Perfeccionista", description: "Una lección perfecta", check: s => s.perfectLessons >= 1 },
  { id: "perfect-streak", name: "10 perfectas", description: "10 lecciones perfectas", check: s => s.perfectLessons >= 10 },
  { id: "first-story", name: "Contador", description: "Lee tu primera historia", check: s => s.storiesRead >= 1 },
  { id: "all-stories-10", name: "Leitor", description: "Lee 10 historias", check: s => s.storiesRead >= 10 },
  { id: "all-stories-20", name: "Bibliófilo", description: "Lee 20 historias", check: s => s.storiesRead >= 20 },
  { id: "vocab-50", name: "Vocabularista", description: "50 vocab cards aprendidas", check: s => s.vocabCardsLearned >= 50 },
  { id: "concept-master-1", name: "Maestría 1", description: "1 concepto con 80% mastery", check: s => s.conceptsMastery80 >= 1 },
  { id: "concept-master-10", name: "Maestría 10", description: "10 conceptos con 80% mastery", check: s => s.conceptsMastery80 >= 10 },
  { id: "diagnostic-taken", name: "Auto-conhecimento", description: "Toma el test diagnóstico", check: s => s.diagnosticCount >= 1 },
  { id: "br-explorer", name: "Brasil", description: "Estudia en variante BR", check: s => s.variantsUsed.has("br") },
  { id: "pt-explorer", name: "Portugal", description: "Estudia en variante PT", check: s => s.variantsUsed.has("pt") },
];

export function checkAndUnlock(prevUnlocked: Set<string>, state: AppState): Rule[] {
  return RULES.filter((r) => !prevUnlocked.has(r.id) && r.check(state));
}
