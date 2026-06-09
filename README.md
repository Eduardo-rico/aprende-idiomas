# Aprende Português

App de aprendizaje estructurado de portugués (BR + PT) para hispanohablantes. Sigue el currículo de 10 bloques: fonética → morfología → verbos → subjuntivo → sintaxis → léxico → variación.

**Status:** MVP #1 — pipeline de generación + Bloque 1 (fonética) generado. UI en próximo plan.

## Setup

```bash
npm install
cp .env.local.example .env.local
# Editar .env.local y pegar MINIMAX_API_KEY real
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia Next.js en http://localhost:3000 |
| `npm test` | Corre tests unitarios (vitest) |
| `npm run typecheck` | TypeScript en modo `--noEmit` |
| `npm run generate:curriculum` | Escribe `lib/data/concepts.json` desde curriculum.ts |
| `npm run generate:content -- --block N` | Genera ejercicios del bloque N con MiniMax LLM |
| `npm run generate:audio -- --block N` | Genera MP3s del bloque N con MiniMax TTS |
| `npm run generate:all` | Pipeline completo de generación |
| `npm run verify:content` | Valida JSONs + integridad de audios |

## Idempotencia

Todas las llamadas a MiniMax están cacheadas por hash determinista:
- **LLM cache:** `scripts/.cache/llm/<hash>.json` (gitignored, regenerable).
- **Audio:** `public/audio/<hash>.mp3` (committed). Mismo texto + voz + variante = mismo hash = mismo archivo.

Re-ejecutar cualquier script con todo cacheado no llama a la API y no produce git diff. Para forzar regeneración: `--force`.

## Estructura

Ver `docs/plans/2026-06-04-aprende-portugues-design.md` para el diseño completo.
# aprende-idiomas
