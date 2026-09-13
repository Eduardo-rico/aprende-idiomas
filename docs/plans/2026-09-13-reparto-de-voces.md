# Reparto de voces — decisión de Edu, 2026-09-13

> «recuerda usar varios tipos de voces por favor para cada idioma, pls,
> puede ser dependiendo del texto o así no?» — Edu, textual.

**Decisión: cada lengua usa VARIAS voces, y la voz se elige según el
texto.** No una narradora única por idioma, que es como está montado hoy
(`VOICES` en `scripts/config.ts`: una `f` y una `m` por variante, con
`DEFAULT_VOICE = 'f'`, o sea que en la práctica casi todo lo dice la
misma).

## Qué hay en la cuenta, medido por API el 2026-09-13

| lengua | voces | reparto |
|---|---:|---|
| **pt** | **17** | 6 f / 11 m · joven, media y mayor · 16 europeas + 1 angoleña |
| **ru** | 3 | 1 f (joven) / 2 m (media) |
| **ro** | 3 | 1 f (joven) / 2 m (media) |
| **cs** | **1** | 1 m (media) — **no se puede repartir nada** |
| it (latín) | 5 | 4 f / 1 m — una napolitana |
| es | 1 | 1 m mexicano |

⚠ **El checo tiene UNA voz.** La decisión de Edu no se puede cumplir ahí
sin añadir voces a la cuenta desde la biblioteca de ElevenLabs. Es lo
primero que hay que decirle cuando al checo le toque su turno, y va aquí
para que no se descubra el día de generar.

## Cómo se reparte, cuando se implemente

El criterio es **el texto**, no el azar — una voz distinta por capricho
sólo suena a inconsistencia. Los ejes que el material ya distingue:

- **quién habla**: narración contra diálogo; y dentro del diálogo, un
  hablante por voz, que es lo que hace seguible una conversación;
- **registro**: el trámite formal y la charla no los dice la misma
  persona (el rumano tiene `r10-registro-tramite` declarado);
- **edad y sexo del personaje**, donde el texto lo diga;
- **variedad**, donde exista: el portugués es la única con dos normas
  cultas, y ahí la voz ya se elige por `pt-br` / `pt-pt`.

Y lo que **no** debe cambiar de voz: los **pares mínimos** y todo ítem
cuyo punto sea fonético. Ahí la voz es la variable de control — cambiarla
entre las dos mitades del par convierte el contraste en ruido. Es el
mismo razonamiento que hizo que la sonda de acento del latín comparara
siempre **dentro de una voz**.

## Lo que NO cambia

**No se gasta un crédito de audio sin ASR instalado.** `faster-whisper`
no está, así que hoy no hay instrumento que juzgue un clip, y sintetizar
sin él es cómo el portugués acabó con 451 MB sin un MP3 escuchado.
Repartir voces multiplica los clips: hace **más** necesario el juez, no
menos.

Y el hash de audio tiene que llevar la voz dentro, o dos clips del mismo
texto con voces distintas colisionarían y uno sobrescribiría al otro.
