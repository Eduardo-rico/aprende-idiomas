<!-- scripts/prompts/listening.md -->
Genera {{N}} ejercicios de comprensión auditiva para la lección "{{lessonName}}" del bloque "{{blockName}}".

Conceptos: {{conceptsList}}

Vocabulario clave (úsalo en los `audioText`):
{{vocabKey}}

Cada ejercicio tendrá audio (generado por TTS desde `audioText`). El usuario escucha y responde.

Formato JSON por item:
{
  "type": "listening",
  "difficulty": <1|2|3>,
  "concepts": [...],
  "tags": [...],
  "data": {
    "audioText": "<frase en portugués brasileño, máx 25 palabras>",
    "question": "<pregunta en español sobre el contenido>",
    "options": ["...", "...", "...", "..."],
    "answer": "<exactamente uno de options>"
  },
  "ptOverrides": { "audioText": "<solo si difiere>", "options": [...], "answer": "..." } | undefined,
  "esContrast": "..."
}

Solo el array JSON.
