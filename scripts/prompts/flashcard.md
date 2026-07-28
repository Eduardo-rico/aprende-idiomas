<!-- scripts/prompts/flashcard.md -->
Genera {{N}} flashcards para la lección "{{lessonName}}" del bloque "{{blockName}}" del curso de portugués.

Vocabulario clave (pre-teaching — DEBE aparecer como flashcards, al menos {{N}} items):
{{vocabKey}}

Conceptos cubiertos en esta lección (úsalos en `concepts`):
{{conceptsList}}

Variante base: **PT-PT, portugués europeo**. `data` va siempre en portugués de Portugal. Marca la forma brasileña en `variantOverrides["pt-br"]` sólo cuando difiera, y nunca la dupliques si es idéntica.

Formato JSON por item:
{
  "type": "flashcard",
  "difficulty": <1|2|3>,
  "concepts": ["<concept-id>", ...],
  "tags": [...],
  "data": { "front": "<palabra/frase en español o pregunta>", "back": "<respuesta en portugués brasileño>", "example": "<oración ejemplo opcional>" },
  "ptOverrides": { "back": "<solo si difiere>" } | undefined,
  "esContrast": "<pista hispanohablante opcional>"
}

Recordatorio: solo el array JSON, nada más.
