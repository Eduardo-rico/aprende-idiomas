---
name: revision-linguistica
description: Revisar material o currículos de idiomas con lingüistas adversariales, uno por lengua. Usar antes de generar contenido nuevo, antes de doblar, y para atacar correcciones que ya hizo otro revisor. Cubre el método, el formato de hallazgo y los errores que este proyecto ya cometió.
---

# Revisión lingüística adversarial

## Cuándo

- **Antes de generar contenido a escala.** Una regla mal enunciada en un currículo se replica en cientos de ítems: el diseño de rumano manda generar ~530 formas de declinación POR REGLA, así que un `a→ă` donde iba `a→e` sale multiplicado.
- **Antes de doblar.** Corregir texto cuesta minutos; corregir audio cuesta doblarlo dos veces.
- **Después de una corrección ajena.** Ver abajo.

## Por qué es ADVERSARIAL y no una simple revisión

Este proyecto ya se quemó. Un nativo revisó el episodio 1 y «corrigió» `Faz favor!` por `O seguinte, faz favor!`. Un segundo revisor demostró que **la corrección era peor que el original** — y para entonces ya estaba en audio.

**Una corrección nativa no es verdad por ser nativa.** El tercer pase ataca los dos anteriores.

## Los agentes

`.claude/agents/linguista-adversarial-{pt,ro,cs,ru}.md`, uno por lengua, con la memoria de lo que cada una ya tuvo mal. Se lanzan **en paralelo**: no deben verse entre sí, porque la convergencia entre revisores independientes es la señal más fuerte que produce este método.

## El formato de hallazgo

Los cuatro campos son obligatorios:

- **Dónde** — `archivo:línea`, id de ejercicio, o sección. Sin cita no es hallazgo, es opinión.
- **Qué dice** — la cita textual.
- **Por qué es falso** — el argumento.
- **Qué debe decir** — accionable.

Y **ERROR ≠ DISCUTIBLE**. Error es falso, agramatical o inexistente. Discutible es una elección defendible que el revisor tomaría distinta. Confundirlos infla el informe y le quita autoridad a lo que importa. En la revisión de 2026-07-28 salieron 72 errores y 41 discutibles, y mantenerlos separados fue lo más útil del informe.

## Qué hacer con los hallazgos

1. **Primero lo que se arregla editando un documento.** Es lo barato y lo que desbloquea todo lo demás.
2. **Después lo que exige rehacer contenido.** Días, no horas.
3. **Lo que sea cuestión de oído no se toca sin nativo**: se marca `needs-human` y se etiqueta.

## Cuándo NO reescribir, sino retirar

Si no puedes verificar el texto de reemplazo, **quita el contenido falso en vez de sustituirlo por otro que no puedes comprobar**. Un contraste ausente es estrictamente mejor que uno falso — sobre todo en los bloques que más repite el repaso espaciado.

Precedente: la capa `esContrast` de la lección 2 del bloque 1 resultó falsa en su mayoría (`café` clasificado como esdrújula, `gentil` con tilde, `lápis` sin ella). Se retiraron 23 en vez de reescribirlos.

## Herramienta obligatoria antes de dar nada por bueno

```bash
npx tsx scripts/check-bleed-docs.ts [fichero.md]
```

Detecta escrituras ajenas (CJK, kana, hangul, hebreo, árabe, devanagari) en los documentos de diseño. Existe porque aparecieron **dos caracteres chinos** incrustados en el anexo ruso donde debía decir «Операция „Ы“». El proyecto ya hacía esto con el contenido generado (`scripts/lib/latin-guard.ts`) pero no con los documentos, que son las líneas desde las que se genera.

## Gate de variante, para portugués

```bash
npm run verify:variant
```

Lista cerrada de marcadores brasileños en el contenido base, con exenciones para los ítems que enseñan la diferencia. Dos trampas ya resueltas y que conviene no reintroducir:

- **`\b` de JavaScript no funciona con letras acentuadas.** `\bônibus\b` nunca casa con «ônibus». Usar `(?<![\p{L}])…(?![\p{L}])` con flag `u`.
- **`vocês` plural es europeo normal.** Sólo el singular `você` es el problemático. Marcarlos juntos añadía 44 falsos positivos.
