<!-- scripts/prompts/verb_preposition.md -->
Genera {{N}} ejercicios de régimen preposicional para la lección "{{lessonName}}" del bloque "{{blockName}}". Foco: errores comunes ES→PT (gostar DE, precisar DE, pensar EM, etc.).

Conceptos: {{conceptsList}}

Vocabulario clave (úsalo si es relevante para la lección):
{{vocabKey}}

Formato JSON por item:
{
  "type": "verb_preposition",
  "difficulty": <1|2|3>,
  "concepts": [...],
  "tags": [...],
  "data": {
    "verb": "gostar",
    "sentence": "Eu gosto ___ café.",
    "options": ["de", "a", "em", "—"],
    "answer": "de"
  },
  "ptOverrides": undefined,
  "esContrast": "En español 'gustar' no lleva prep, en PT 'gostar' rige DE."
}

Solo el array JSON.
