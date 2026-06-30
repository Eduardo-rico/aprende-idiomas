# QA lingüístico — checklist A–G

Aplicar a cada PR de contenido portugués. Categorías del reporte de lingüística.

## A — Variantes BR/PT
- [ ] Vocabulario marcado como BR o PT cuando difiere
- [ ] No se usa "ônibus" en texto PT-PT sin marca de variante
- [ ] No se usa "autocarro" en texto PT-BR sin marca de variante
- [ ] Verificar: celular/telemóvel, trem/comboio, geladeira/frigorífico, suco/sumo

## B — Falsos amigos
- [ ] ficar, pegar, borracha, oficina, propina, carta — tienen explicación en glossary.json
- [ ] exquisito (PT=excelente), apelido (PT=apodo), embaraçada (PT=embarazada/enredada) — verificados
- [ ] Ningún término tabú sin flag explícito en metadata

## C — Calidad textual
- [ ] Cero caracteres chinos / cirílicos / árabes sueltos
- [ ] Cero strings en inglés (presently, actually, etc.)
- [ ] Cero strings en español que no sean notas de traducción (intentar, estar)
- [ ] Ortografía PT validada — pretérito perfeito, conjuntivo (no "pretérito perfecto")

## D — Terminología gramatical
- [ ] Nombres de lección usan nomenclatura PT: pretérito perfeito simples/composto, conjuntivo, futuro do conjuntivo
- [ ] No se mezcla con terminología española

## E — Progresión
- [ ] Conceptos nuevos se introducen en el bloque correcto (B1 ≤ B2 ≤ ... ≤ B10)
- [ ] Ningún concepto asumido como conocido antes de su bloque de introducción

## F — Audio
- [ ] audioHash corresponde al texto actual (si texto cambia, hash queda stale — marcar para regeneración)
- [ ] Solo se propone regeneración de audio cuando el texto del segmento cambia
- [ ] NO regenerar audio solo por fixes de tipografía menores

## G — Glosario
- [ ] Cada palabra nueva en vocab[] tiene entrada en glossary.json
- [ ] conceptIds en glossary.json apuntan al bloque correcto
- [ ] Ejecutar `npx tsx scripts/propose-lessons.ts` y revisar warnings de vocab sin glossary
