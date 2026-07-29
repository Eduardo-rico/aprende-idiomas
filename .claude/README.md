# Agentes y skills del proyecto

Guardados aquí para que no haya que reinventarlos, y sobre todo para que
**no se repitan los errores que ya costaron trabajo descubrir**. Cada
archivo lleva escrito lo que falló y por qué, no sólo lo que hay que hacer.

## Agentes (`.claude/agents/`)

| Agente | Para qué |
|---|---|
| `linguista-adversarial-pt` | Ataca material y correcciones de portugués europeo. **No aprueba: rompe.** |
| `linguista-adversarial-ro` | Ídem, rumano |
| `linguista-adversarial-cs` | Ídem, checo — con foco en la diglosia y en las reglas que alimentan generadores |
| `linguista-adversarial-ru` | Ídem, ruso — el idioma donde el dueño no puede detectar un error solo |
| `guionista-episodios` | Escribe episodios narrados de AO BALCÃO con el formato de cuatro capas |

Se lanzan **en paralelo y sin verse entre sí**: la convergencia entre
revisores independientes es la señal más fuerte que produce el método.

## Skills (`.claude/skills/`)

| Skill | Para qué |
|---|---|
| `doblar-episodio` | Generar voz con ElevenLabs: reparto fijo, control de velocidad por capa, cómo medir ppm de verdad |
| `revision-linguistica` | El método adversarial, el formato de hallazgo, y cuándo retirar en vez de reescribir |

## Las tres lecciones que más han costado

1. **Una corrección nativa no es verdad por ser nativa.** El primer nativo sustituyó una fórmula inventada por otra peor, y ya estaba doblada cuando se descubrió.
2. **La velocidad de voz no se controla con etiquetas**, sino con `voice_settings.speed`. Y no se mide por el tamaño del archivo: eso dio una conclusión invertida.
3. **Si no puedes verificar el reemplazo, retira el contenido falso en vez de sustituirlo.** Un hueco visible es mejor que un dato tranquilizador y falso.

## Scripts que acompañan

- `scripts/check-bleed-docs.ts` — escrituras ajenas en los documentos de diseño
- `npm run verify:variant` — marcadores brasileños en el contenido base
- `scripts/invert-variant-base.ts` · `scripts/marcar-metalinguisticos.ts` · `scripts/reparar-b1.ts`
