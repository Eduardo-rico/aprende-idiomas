<!-- scripts/prompts/fill_blank.md -->
Genera {{N}} ejercicios de "completar el espacio" para la lección "{{lessonName}}" del bloque "{{blockName}}".

Conceptos: {{conceptsList}}

Vocabulario clave (úsalo si es relevante para la lección):
{{vocabKey}}

Formato JSON por item:
{
  "type": "fill_blank",
  "difficulty": <1|2|3>,
  "concepts": [...],
  "tags": [...],
  "data": {
    "sentence": "Eu ___ um café todas as manhãs.",
    "blanks": [{ "position": 0, "answer": "tomo", "alternatives": ["bebo"] }]
  },
  "ptOverrides": { "sentence": "...se difiere...", "blanks": [...] } | undefined,
  "esContrast": "..."
}

`position` es el índice del blank en la oración (0-based). `alternatives` son respuestas también aceptadas.
Solo el array JSON.
