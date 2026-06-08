<!-- scripts/prompts/translation.md -->
Genera {{N}} ejercicios de traducción {{direction}} para la lección "{{lessonName}}" del bloque "{{blockName}}".

Conceptos: {{conceptsList}}

Vocabulario clave (úsalo en `source` o `target`):
{{vocabKey}}

Direction "es_pt": el usuario traduce de español a portugués.
Direction "pt_es": el usuario traduce de portugués a español.

Formato JSON por item:
{
  "type": "{{type}}",
  "difficulty": <1|2|3>,
  "concepts": [...],
  "tags": [...],
  "data": { "source": "<frase origen>", "target": "<traducción modelo>", "acceptedAlternatives": ["..."] },
  "ptOverrides": { "target": "<solo si difiere>", "acceptedAlternatives": [...] } | undefined,
  "esContrast": "..."
}

Solo el array JSON.
