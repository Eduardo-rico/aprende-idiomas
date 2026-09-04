# Estado al parón del 2026-09-04

El límite semanal de uso se agotó y mató a la vez las tres sesiones que
trabajaban (lotes rumanos, latín, auditoría de prosa). **Vuelve el 8 de
septiembre a las 3:00.** Nada se perdió: todo lo cerrado está empujado.

## Lo primero que hay que hacer al volver

**El árbol está EN ROJO y no es culpa de quien lo encuentre.** Dos
ficheros quedaron a medias cuando cortaron a la sesión de latín:

    M lib/data/languages/la/lexicon-l1.ts     (añadía `Deus`)
    M lib/data/languages/la/paradigma-la.ts   (tocaba el enclítico)

y por eso fallan exactamente dos tests:

    cantidad-la.test.ts  › «una base DESCONOCIDA no se parte para salvarla»
    paradigma-la.test.ts › «la evidencia congelada NO se ha desincronizado»
                           (`Deus no está en atestacion-l1.json`)

El segundo es el esperado: se añadió el lema y **falta regenerar
`atestacion-l1.json`**. El primero hay que leerlo antes de tocarlo. Quien
retome el latín termina ese paso; **nadie más los toca**, y `--no-verify`
no los arregla, los esconde. Si hay que commitear otra cosa mientras
tanto, se hace **desde un worktree limpio** (`git worktree add --detach`
en HEAD, symlink de `node_modules`), que es como se metió `cd5c8bc1`.

## Dónde está cada lengua

**Rumano** — déficit **370**, residuo 0, 453 ítems servibles, suite 2.145
verde, 0 ítems sin motivo escrito. Quedan **5 puntos de
`transformacion`**. Aviso escrito en el relevo: a los dos de `r7` hay que
hacerles la pregunta del §3.1 **contra `r7-supin` y `r7-anti-progresivo`**,
y **a los dos a la vez** — preguntar por la casilla y no por los vecinos
de bloque es lo que evitó que los lotes 28 y 29 se duplicaran.
Relevo: `docs/plans/2026-09-03-ro-relevo.md`.

**Latín** — publicados la tabla pronominal, el relativo y `pro-drop`.
Quedan ~40 puntos de L1 a cero y sin soporte de máquina los adjetivos de
3.ª, los grados, el imperativo, los irregulares (`eō, ferō, volō, possum`)
y los nombres propios de la Vulgata. Siguiente: terminar `Deus`.
Relevo: `docs/plans/2026-09-03-la-relevo.md`.

**Decisión tomada el 2026-09-04, aplicar a los lotes nuevos**: el marco se
presenta **sin macrones** y la versión con ellos va en la respuesta o en
la pista. Motivo medido: 227.301 tokens del corpus, **cero macrones** —y
el corpus **sí conserva otros diacríticos** (`ë`, `ó`, `é`, `á`, `í`), así
que el cero es un hecho del latín y no una normalización del treebank—.
Los 76 marcos ya escritos se migran después, sin parar la producción.

## Lo que cambia de prioridad

`docs/auditorias/2026-09-04-prosa-que-lee-el-alumno.md` (commit
`cd5c8bc1`) encontró **8 falsas y 18 medias verdades** en la prosa que el
alumno lee como si fuera la lección, y **el peor está en el portugués
declarado terminado**, en los bloques A2/B1.

Propuesta al coordinador, pendiente del OK de Edu: **arreglar las 8 falsas
antes de seguir con lengua nueva**. Y tres cosas del informe que son
trabajo de infraestructura, no de contenido:

1. **Matar el test que congela una falsedad** (`corr-ro-a2b.test.ts:24`).
   Arreglar la prosa lo pone en rojo, y parecerá que se rompió algo.
2. **Que una corrección del inventario FALLE si su prosa no se actualiza.**
   Hoy no propaga nada: el inventario rumano va tres días por delante de
   sus `objectives`.
3. **Arreglar el censo**: el bloque 1 del portugués vive en
   `curriculum.ts` y no en `lessons/*.json`, así que toda herramienta
   apuntada a `lessons/*.json` **nunca ha mirado el primer bloque del
   curso**. Once objetivos fuera de todo recuento.

## Pendiente de Edu

- La voz **Rita** en su cuenta de ElevenLabs (única cosa que bloquea el
  audio del latín; 1.141 caracteres de los 9.200 aprobados).
- El **orden** entre terminar rumano, arrancar checo o ruso, y abrir el
  griego.
- El **OK** a arreglar las 8 falsas antes que lengua nueva.

## Nota de infraestructura

El disco llegó a **737 MB libres** durante el parón; se liberó a 2,2 GB
limpiando cachés regenerables (Homebrew, pip). `.next` ocupa 795 MB y
**no se toca con el servidor de Edu vivo** — borrarlo ya costó una caída
de seis horas. Los dos monitores horarios se pararon: con las sesiones
muertas sólo producían «⚠ SIN COMMITS EN UNA HORA» cada hora, y un gate
que sólo grita en falso es un gate apagado. **Hay que rearmarlos al
retomar.**
