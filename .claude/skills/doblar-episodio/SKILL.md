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

## LA TRAMPA PRINCIPAL: la velocidad tampoco se controla con `speed`

Van dos capas de esta misma trampa, y la segunda casi tira 23 minutos de audio.

**Primera:** `[slowly]` en `eleven_v3` **casi no hace nada**. Medido: una línea de narradora con `[slowly]` salió a 154 ppm cuando debía ir a 100.

**Segunda (2026-07-29):** `voice_settings.speed` tampoco basta. Con `speed: 0.7` la misma voz dio entre **144 y 177 ppm** según la línea — lo que manda es la puntuación, no el parámetro. El primer lote salió con **la separación de capas INVERTIDA**: narradora a 158 ppm y habla real a 154, cuando el diseño pide 142 contra 202. Es decir, el mecanismo pedagógico entero apagado, y en un audio que suena perfectamente bien.

**Lo que sí funciona: `<break>`.** Es texto, no parámetro, y multilingual_v2 lo respeta:

```
Sete e meia da manhã. <break time="0.8s" /> A pastelaria está aberta.
```

Medido: dos pausas de 0,8 s bajan una línea de narradora de **128 a 103 ppm**. Y las pausas ya estaban escritas en la columna de dirección de todos los guiones («tres frases con 0,7 s») — nadie las estaba ejecutando. **Se insertan sólo en Capa N y Capa 2**; en el habla real las pausas son actuación y meterlas a mano la vuelve robótica.

**Y el suelo de la Capa 1.** Las voces corren a ~185 ppm a velocidad natural. Aplicarle a un nativo el `speed: 0.86` que pedía su dirección lo frena **por debajo de su propio ritmo**, y entonces el habla real deja de sonar a habla real. Regla: **la Capa 1 nunca baja de `speed: 1.0`** salvo cuando la dirección pide menos de 130 ppm, que no es textura sino un personaje titubeando — Migue deletreando `En... cer... ra... do`, y eso sí es contenido.

Con las dos correcciones: narradora **124 ppm**, habla nativa **187 ppm**, **51 % de separación** sobre 361 réplicas.

El principio general: **cuando los ppm por línea chocan con el contraste entre capas, gana el contraste.** Los ppm son textura; la separación es la mecánica.

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

## Las herramientas ya están escritas

`scripts/doblaje/` — no rehacerlas:

| Script | Qué hace |
|---|---|
| `extraer-pistas.mjs` | Saca las pistas de los `.md` de `docs/contenido/`. Detecta las filas por la PRIMERA celda (la capa), no por el número de columnas, porque el ep. 1 tiene 5 y los demás 4. Toma la dirección de voz como ÚLTIMA celda por lo mismo. Salta lo que va bajo `## Historial` |
| `doblar-todo.mjs` | El doblaje: reparto, ppm→speed, pausas, 4 reintentos. `SOLO=P7,ep9` para pilotar antes de gastar |
| `bateria.mjs` | Batería fonética de voces nuevas + audición de un papel concreto |
| `build-pagina.mjs` | Página de escucha. **Referencia los mp3, no los incrusta**: 361 réplicas en base64 pesan 15 MB y la carpeta ya está al lado |
| `contar-formas.mjs` | Formas nuevas de una pieza contra el corpus ya publicado. Existe porque el documento de contenido prohíbe cifras estimadas |

**Pilotar siempre.** `SOLO=P7` cuesta 481 caracteres y fue lo que destapó la separación invertida. Sin ese piloto se habrían doblado las 361 réplicas mal.

## El reparto tiene un agujero que no se puede tapar

**No existe ninguna voz femenina de portugués europeo mayor.** La biblioteca tiene siete, todas `young` o `middle_aged`. Personajes como Aurora (79 años) o la MÃE de P10 se doblan con la más cercana y **no suenan a su edad**. Masculinas mayores sí hay (`Vicente`, `Adilson`).

Cuando la edad es un dato de la trama —la coda del ep. 13 se apoya en «uma vizinha de setenta e nove anos»— hay que elegir entre aceptar que no suena, o recastear el personaje como hombre, que cuesta dos palabras. **No disimularlo.**

Y una cosa que este método no puede hacer solo: **la batería fonética la juzga una persona.** Generarla no es aprobarla.

## Coste

~900 caracteres por minuto de habla. Un episodio de núcleo dramático son ~600-1.000 caracteres; con narración, ~1.400. Los 44 episodios completos son ~308.000 caracteres.
