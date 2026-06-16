<!-- scripts/prompts/propose-lessons.md -->
Tu tarea: diseñar la estructura de lecciones ({{targetLessonCount}} lecciones) para el bloque {{blockId}} "{{blockName}}" de un curso de portugués para hispanohablantes.

Descripción del bloque: {{blockDescription}}

Conceptos a cubrir (cada uno debe aparecer en al menos una lección — no inventes IDs, no omitas ninguno):
{{conceptList}}

Vocabulario ancla disponible (palabras que ya tienen audio TTS generado, ordénalas por importancia):
{{vocabAnchors}}
Fuente del vocabulario ancla: {{anchorSource}}

Reglas estrictas:
- Devuelves ÚNICAMENTE un array JSON con EXACTAMENTE {{targetLessonCount}} lecciones (rango aceptable: 2 a 6 — respeta la cantidad solicitada).
- Cada lección debe cubrir conceptos no triviales; evita lecciones de "repaso" o "consolidación" vacías.
- `vocabKey` debe tener 3-7 palabras. Prioriza el vocabulario ancla si existe; si no hay ancla (fuente: "none" o "b8-handbook"), elige palabras de alta frecuencia del CEFR-B2 que ilustren los conceptos de la lección.
- `id` debe seguir el patrón `b{blockId}-l{N}-{slug-kebab}` donde N es el número de lección (1, 2, 3...) y el slug es descriptivo (ej. "artigos-contracoes", "presente-irregular", "se-futuro").
- `conceptNotesPath` debe seguir el patrón `b{blockId}/l{N}-{slug-kebab}.mdx`.
- La unión de todos los `conceptIds` de tus lecciones DEBE ser EXACTAMENTE el conjunto de conceptos que te pasé. No cubras un concepto dos veces si no aporta; pero tampoco omitas ninguno.
- `objectives` debe ser medible: empieza con verbos como "reconocer", "producir", "distinguir", "aplicar", "transformar".
- `exerciseRefs` siempre `[]` (lo llena `generate-content` después).

Formato JSON por lección:
{
  "id": "b{N}-l{N}-{slug}",
  "blockId": {{blockId}},
  "name": "<nombre corto en español, máx 50 chars>",
  "objectives": ["<objetivo 1>", "<objetivo 2>", ...],
  "conceptIds": ["<concept-id>", ...],
  "vocabKey": ["<palabra1>", "<palabra2>", ...],
  "conceptNotesPath": "b{N}/l{N}-{slug}.mdx",
  "exerciseRefs": []
}

Recordatorio: solo el array JSON, nada más.
