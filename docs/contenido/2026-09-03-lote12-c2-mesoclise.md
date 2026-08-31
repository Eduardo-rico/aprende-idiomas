# Lote 12 — C2, la mesóclise como ELECCIÓN · **primer lote por pares mínimos**

**Sesión E2#13, 2026-09-03.** Dos primicias en el mismo lote: es el
**primer contenido de C2** del proyecto —el nivel llevaba 408 unidades
de déficit y cero ítems porque no existía dónde ponerlos— y el primero
construido con **pares mínimos por construcción**.

| punto | antes | falta | tras el lote |
|---|---:|---:|---:|
| `b12-mesoclise-estilistica` | **0** | 12 | **12** (cierra) |

## Por qué pares mínimos

Porque el bucle de las tres sesiones anteriores era éste: cada atajo que
se arreglaba fabricaba otro del mismo calibre. Se mató la LONGITUD (13/16)
alargando los MAL, y como se alargaron por delante nació el ARRANQUE
(12/16, p=0,038) — y esa misma coleta cegó de paso el gate de virginidad.

Los doce ítems de aquí abajo son **seis frases**, cada una en dos
versiones que difieren en un solo tramo. Todo rasgo que no mire ese tramo
—la longitud, el arranque, la coma, el marcador temporal, y también el
rasgo número doce que a nadie se le ha ocurrido— vale exactamente igual en
los dos miembros del par: aporta un acierto y un fallo. **La batería de
atajos deja de ser el motor del diseño y pasa a ser verificación.**

Y el equilibrio que el par no da solo: en **tres** pares la mesóclise está
en el BIEN y en **tres** en el MAL, para que «¿hay un guion?» no resuelva
el lote. La posición BIEN/MAL va barajada con semilla
(`lote12-c2-mesoclise-e2-13`), reproducible, y con los dos miembros de cada
par nunca a menos de tres posiciones — la alternancia mecánica `MBMB…`
acertaba 24/24 en un lote de la sesión pasada y nadie la había medido.

**Lo que los pares NO resuelven, y por eso hay round:** que el veredicto
sea inequívoco, que el contexto determine la respuesta, y que el rasgo
juzgado no sea detectable por una regla superficial distinta de la
destreza. Cada par declara en `rasgo` qué se juzga: un rasgo que detecte
ESO es legítimo, cualquier otro es un atajo.

## Nota del autor — un fallo que cazó el dry-run del publicador

La v1 de este lote tenía **tres pares rotos en sus DOS direcciones**, y ni
el generador ni el preflight los vieron. P-03, P-04 y P-05 llevaban un
clítico **acusativo** en el hueco y un objeto directo explícito en el
esqueleto, así que salían frases como «A direção comunicá-lo-á **o
resultado**»: el clítico y el sintagma duplicados. Lo destapó leer la
salida del publicador ítem a ítem, que es la regla de «diff semántico
antes de commitear», no un gate.

Es el límite honesto del método: los pares mínimos garantizan que **el
BIEN y el MAL sólo difieran en el rasgo juzgado**; no garantizan que el
esqueleto sea gramatical. Reconstruidos los tres con un antecedente
explícito en la primera cláusula («O recurso está pendente e…», «O
presidente já sabe do caso e…», «O programa já está fechado e…»), que
además arregla un segundo defecto del que nadie se había quejado: el
clítico acusativo no tenía antecedente ninguno.

## Los seis pares, antes de barajar

| par | esqueleto | BIEN | MAL | rasgo juzgado |
|---|---|---|---|---|
| P-01 | Não **___** a verdade toda enquanto o processo não estiver encerrado. | `lhe direi` | `dir-lhe-ei` | con «não» delante, atractor de próclise, la mesóclise es imposible |
| P-02 | Ninguém **___** o que se passou naquela reunião de dezembro. | `lhes contará` | `contar-lhes-á` | con «ninguém» sujeto, atractor de próclise, la mesóclise es imposible |
| P-03 | O recurso está pendente e a comissão nunca **___** sem ouvir as duas partes. | `o decidirá` | `decidi-lo-á` | con el adverbio «nunca», atractor de próclise, la mesóclise es imposible |
| P-04 | O presidente já sabe do caso e a direção **___** do resultado esta semana. | `informá-lo-á` | `o informará` | sin atractor y con el verbo abriendo la oración, la próclise es brasileña |
| P-05 | O programa já está fechado e o secretariado **___** aos sócios amanhã. | `enviá-lo-á` | `o enviará` | sin atractor y con el verbo abriendo la oración, la próclise es brasileña |
| P-06 | Quando o prazo terminar, **___** os documentos por correio registado. | `enviar-te-ei` | `te enviarei` | tras una subordinada antepuesta y coma, el clítico no puede abrir la oración principal |

---

## Preflight — salida pegada (sin ella no se abre el round)

```
# Preflight — 2026-09-03-lote12-c2-mesoclise.md

Batería de atajos: **11 rasgos**, rev `4cc7a606`. Si esta rev no es la del repo, la salida está caducada.

Ítems: **12** · BIEN 6 · MAL 6

## Molde

Patrón: `BBBMMBMMMBMB` · racha máxima: 3 · desequilibrio: 0

Solape con los 10 lotes publicados (el objetivo es el AZAR, no el mínimo — la casi-complementaria es un calco igual que la copia):

| lote | patrón | solape | azar | desvío | tope |
|---|---|---:|---:|---:|---:|
| l1 | `BMMBMBMMBMBB` | 6/12 | 6.0 | 0.0 | 3 |
| l2 | `BMBMMBBMMBMM` | 9/12 | 6.0 | 3.0 | 3 |
| l3 | `MBBMBMMBMBBM` | 6/12 | 6.0 | 0.0 | 3 |
| l4 | `MMBBMBMMBBMM` | 7/12 | 6.0 | 1.0 | 3 |
| l5 | `BBMMBMBBMMMB` | 6/12 | 6.0 | 0.0 | 3 |
| l6 | `BBBMMBMBMM` | 8/10 | 5.0 | 3.0 | 3 |
| l7 | `MMMBBBMBMB` | 4/10 | 5.0 | 1.0 | 3 |
| l8 | `BBMBMMBMMB` | 6/10 | 5.0 | 1.0 | 3 |
| l9 | `BMBBBMBMMM` | 4/10 | 5.0 | 1.0 | 3 |

## Atajos — acierto SOBRE N (12), nunca recall sobre los MAL

| rasgo | acierto | dirección | presente en | p |
|---|---:|---|---:|---:|
| posición par en el lote (alternancia mecánica) | **8/12** (67 %) | presente⇒MAL | 6 | 0.194 |
| más corta que la mediana (palabras) | **7/12** (58 %) | presente⇒MAL | 5 | 0.387 |
| más corta que la mediana (caracteres) | **7/12** (58 %) | presente⇒MAL | 5 | 0.387 |
| arranca con adjunto o subordinada, no con el sujeto o el verbo | **6/12** (50 %) | presente⇒BIEN | 2 | 0.613 |
| lleva una coma (frase con coleta) | **6/12** (50 %) | presente⇒BIEN | 2 | 0.613 |
| lleva marcador temporal | **6/12** (50 %) | presente⇒BIEN | 6 | 0.613 |
| lleva una palabra visiblemente española | **6/12** (50 %) | presente⇒BIEN | 2 | 0.613 |
| lleva verbo en primera persona | **6/12** (50 %) | presente⇒BIEN | 0 | 0.613 |
| lleva clítico con guion (ênclise/mesóclise) | **6/12** (50 %) | presente⇒BIEN | 6 | 0.613 |
| lleva preposición contraída (do/da/no/na/ao/à/pelo) | **6/12** (50 %) | presente⇒BIEN | 4 | 0.613 |
| lleva dos o más oraciones (punto o punto y coma interior) | **6/12** (50 %) | presente⇒BIEN | 0 | 0.613 |

## Virginidad — 12 candidatos (+12 sondas de núcleo) contra 2431 publicados + entre sí (umbral 0.34)

Sin pares fiables por encima del umbral.

**0 pares fiables** + 4 contra ítems de texto ínfimo (score no fiable).

## Frases idénticas a algo publicado

Ninguna.

## Veredicto

**Preflight limpio.** El round puede abrirse con esta salida pegada en el documento.
```

---

## `b12-mesoclise-estilistica` — 12

### GJ-01 · **BIEN**
**par:** `P-02`
**sentence:** «Ninguém lhes contará o que se passou naquela reunião de dezembro.»
**explicación:** Los cuantificadores negativos —«ninguém», «nada», «nenhum»— atraen el clítico igual que «não». Con «ninguém» de sujeto, próclise: «ninguém lhes contará».

### GJ-02 · **BIEN**
**par:** `P-06`
**sentence:** «Quando o prazo terminar, enviar-te-ei os documentos por correio registado.»
**explicación:** La subordinada de delante NO es atractor: acabada la coma, la principal empieza otra vez y el clítico no puede abrirla. De ahí la mesóclise, «enviar-te-ei». Es el caso que más se falla, porque parece que el «quando» gobierna toda la frase y no gobierna más que su cláusula.

### GJ-03 · **BIEN**
**par:** `P-05`
**sentence:** «O programa já está fechado e o secretariado enviá-lo-á aos sócios amanhã.»
**explicación:** Mismo caso que el anterior con otro verbo: «enviará» + «o» (= «o programa») da «enviá-lo-á», con caída de la -r y el clítico en -l-. Se repite el patrón con otro léxico para que se vea que la regla no depende del verbo.

### GJ-04 · **MAL**
**par:** `P-02`
**sentence:** «Ninguém contar-lhes-á o que se passou naquela reunião de dezembro.»
**repair:** «Ninguém lhes contará o que se passou naquela reunião de dezembro.»
**explicación:** «Ninguém» es atractor de próclise, así que la mesóclise queda excluida. La prueba es fácil de hacer en la cabeza: si delante del verbo hay una palabra negativa, el clítico se va delante y ya no hay dónde partir el futuro.

### GJ-05 · **MAL**
**par:** `P-04`
**sentence:** «O presidente já sabe do caso e a direção o informará do resultado esta semana.»
**repair:** «O presidente já sabe do caso e a direção informá-lo-á do resultado esta semana.»
**explicación:** La próclise sin atractor es la colocación brasileña. En portugués europeo, con el sujeto delante y nada más, el clítico no se antepone: la forma es «informá-lo-á». Es el calco que sobrevive a todo porque se entiende igual.

### GJ-06 · **BIEN**
**par:** `P-03`
**sentence:** «O recurso está pendente e a comissão nunca o decidirá sem ouvir as duas partes.»
**explicación:** Los adverbios de negación y de frecuencia negativa —«nunca», «jamais», «raramente»— son atractores. Con ellos el futuro no se parte: «nunca o decidirá».

### GJ-07 · **MAL**
**par:** `P-05`
**sentence:** «O programa já está fechado e o secretariado o enviará aos sócios amanhã.»
**repair:** «O programa já está fechado e o secretariado enviá-lo-á aos sócios amanhã.»
**explicación:** Sin atractor delante, «o enviará» es brasileño. La marca del portugués europeo culto aquí es partir el futuro, y es justo lo que un hispanohablante no produce nunca solo, porque el español antepone siempre.

### GJ-08 · **MAL**
**par:** `P-06`
**sentence:** «Quando o prazo terminar, te enviarei os documentos por correio registado.»
**repair:** «Quando o prazo terminar, enviar-te-ei os documentos por correio registado.»
**explicación:** El portugués europeo no admite el pronombre átono abriendo oración, y tras la coma la principal empieza de cero. «Te enviarei» sólo sería posible con un atractor DENTRO de la principal, que aquí no hay.

### GJ-09 · **MAL**
**par:** `P-01`
**sentence:** «Não dir-lhe-ei a verdade toda enquanto o processo não estiver encerrado.»
**repair:** «Não lhe direi a verdade toda enquanto o processo não estiver encerrado.»
**explicación:** La mesóclise sólo cabe cuando el futuro o el condicional abren la oración sin atractor delante. Aquí hay «não», que es atractor de próclise, así que la única colocación posible es «não lhe direi». Es el error del que ha aprendido la mesóclise y la aplica como regla mecánica.

### GJ-10 · **BIEN**
**par:** `P-04`
**sentence:** «O presidente já sabe do caso e a direção informá-lo-á do resultado esta semana.»
**explicación:** Sin nada que atraiga el clítico —«e» coordina, no atrae—, el futuro se parte y el pronombre se mete dentro: «informá-lo-á», con «o» = «o presidente». En la norma europea escrita ésta es la colocación por defecto, y a C2 es una elección de registro — culta, no obligatoria.

### GJ-11 · **MAL**
**par:** `P-03`
**sentence:** «O recurso está pendente e a comissão nunca decidi-lo-á sem ouvir as duas partes.»
**repair:** «O recurso está pendente e a comissão nunca o decidirá sem ouvir as duas partes.»
**explicación:** La mesóclise pide que el verbo no tenga atractor a su izquierda, y «nunca» lo es. Nótese que la forma «decidi-lo-á» está bien construida —la -r cae y el clítico toma la -l-—: lo que falla no es la morfología sino el sitio.

### GJ-12 · **BIEN**
**par:** `P-01`
**sentence:** «Não lhe direi a verdade toda enquanto o processo não estiver encerrado.»
**explicación:** Con «não» delante, el clítico va OBLIGATORIAMENTE proclítico, y eso desactiva la mesóclise: «não lhe direi», nunca «não dir-lhe-ei». A C2 la mesóclise ya no es una forma que se aplique porque el verbo esté en futuro, sino una que se elige cuando NADA la impide.
