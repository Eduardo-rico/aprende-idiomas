---
name: doblar-episodio
description: Doblar guiones de AO BALCÃO (o cualquier contenido de audio del curso) con ElevenLabs. Usar cuando haya que generar voz para episodios, piezas de la Biblioteca o ejercicios. Incluye el reparto fijo, el control de velocidad por capa y los gotchas que ya costaron un doblaje.
---

# Doblar con ElevenLabs

## Antes de gastar un carácter

1. **El texto tiene que estar cerrado y revisado.** Doblar y luego corregir es tirar el audio. Ya pasó: el episodio 1 se dobló con `O seguinte, faz favor!` y hubo que rehacerlo cuando la revisión lingüística demostró que era calco de «¡el siguiente!».
2. **Batería de aceptación fonética**, si es material nuevo o voz nueva: `cedo : medo` (las dos /e/ cerradas), `avó : avô` (/ɔ/ vs /o/), reducción átona, `-s` final /ʃ/. Si la voz no las distingue, **se cambia de proveedor, no de pieza**.
3. La clave vive en `.env.local` como `ELEVENLABS_API_KEY` (gitignored vía `*.local`).

## El reparto fijo

| Personaje | voice_id | Por qué |
|---|---|---|
| Dona Fátima | `IZipF5JhqPlWzpduTV0E` | contralto con autoridad. No es una viejita dulce: es una patrona |
| Kilu | `HbqJvmNWS8QoO8r8Gs9F` | **voz angoleña real**. Su función pedagógica es tener las vocales átonas plenas, y eso no se actúa |
| Migue | `lQFpy8cEH4bDaHre2DpA` | **voz `es-MX` leyendo portugués**. Produce el acento sin fingirlo; es el único que no debe sonar nativo |
| Marta | `NkpT2jezTenCDRKHkWiX` | joven, brillante |
| Sr. Almeida | `pjqwOzrEUZ3n3m4rMWWL` | barítono seco. **Dos configuraciones de la MISMA voz** (ventanilla / café): si salen como dos actores, se pierde la lección de registro |
| Narradora | `nJ5NFqyKb8kn9JBPmo6i` | natural y suave, fuera del reparto |
| Megafonía | = Almeida | filtrado con pasa-banda 300-3400 Hz + compresión + reverb, en post |

La voz del alumno se hace con una voz **del idioma nativo del alumno leyendo el idioma meta**. Probado y aprobado en portugués, rumano, checo y ruso — cirílico incluido.

## LA TRAMPA PRINCIPAL: la velocidad no se controla con etiquetas

`[slowly]` en `eleven_v3` **casi no hace nada**. Medido: una línea de narradora con `[slowly]` salió a 154 ppm cuando debía ir a 100.

La velocidad se controla con `voice_settings.speed`, y el rango útil es **0.7 (suelo) a 1.2**:

```json
{ "text": "...", "model_id": "eleven_multilingual_v2",
  "voice_settings": { "stability": 0.55, "similarity_boost": 0.75, "speed": 0.7 } }
```

**Reparto de modelos por capa:**
- **Narradora** → `eleven_multilingual_v2` con `speed: 0.7`. Importa más el ritmo que la emoción.
- **Personajes** → `eleven_v3` con etiquetas `[shouting]`, `[whispering]`, `[annoyed]`, `[hesitant]`, `[laughs]`, `[sighs]`. Ahí importa la actuación.

**Objetivos medidos** (con `ffprobe`, no estimando por tamaño de archivo):

| Capa | ppm |
|---|---|
| Narradora | ~142 |
| Habla real | ~202 |

La separación del 42 % es lo que hace que las capas se distingan al oído. Los 100 ppm que pide el diseño **no son alcanzables**: 0.7 es el suelo de la API y de ahí no se baja sin trocear frases e insertar silencio en post.

## Medir de verdad

**No estimes la duración por el tamaño del archivo.** Da números falsos y ya produjo una conclusión equivocada (llegó a parecer que la narradora iba más rápida que el habla real).

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 fichero.mp3
```

Y **descarta las réplicas de menos de 6 palabras** al calcular ppm: un «Hã?» de una palabra da cifras absurdas y arruina la media.

## Otros gotchas

- **`eleven_v3` devuelve HTTP 500 transitorios.** Reintentar el mismo texto funciona; conviene un bucle de 3 intentos con espera creciente.
- Las **voces de biblioteca y las clonadas NO funcionan en el tier gratuito**. Hace falta Creator o superior.
- Una página con 276 audios embebidos en base64 pesa **11 MB**. Para más de ~50 réplicas, partir por episodios.

## Coste

~900 caracteres por minuto de habla. Un episodio de núcleo dramático son ~600-1.000 caracteres; con narración, ~1.400. Los 44 episodios completos son ~308.000 caracteres.
