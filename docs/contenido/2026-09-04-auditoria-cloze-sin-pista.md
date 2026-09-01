# Auditoría · ¿cuántos `fill_blank` publicados son inresolubles?

**Sesión E2#14.** Encargo de Edu al destaparse que `FillBlankCard` no
pintaba la pista: si un lote nuevo se iba a publicar sin pista, ¿cuántos
de los 417 ya publicados están en la misma situación?

Es la cicatriz de E2#11 aplicada al corpus viejo: **un gate que deriva la
respuesta no comprueba que la PREGUNTA la determine.** Y es el gemelo del
multi-hueco: aquel cobraba **aciertos** de más, éste cobra **fallos** de
más — y el fallo entra en el FSRS y hunde el mastery de un punto que el
alumno sí sabe. Los dos invalidan la evidencia, no sólo el ejercicio.

## La criba, declarada

No dictamina: ordena la lectura.

1. ¿Tiene pista? Un paréntesis en la frase o un `hintEs`.
2. Si no, ¿la respuesta es **derivable del enunciado**? Se cuenta como
   derivable si es palabra de clase cerrada (preposición, artículo,
   contracción, pronombre) o si tiene forma de verbo: entonces el hueco
   lo fija la sintaxis, no el mundo.
3. Lo que queda es **sospechoso**: hueco léxico abierto sin pista, del
   tipo «Vou à ___», que admite escola, loja, praia…

`npx tsx scripts/auditar-cloze-sin-pista.ts`

| clase | n | % |
|---|---:|---:|
| con pista (paréntesis o `hintEs`) | 125 | 30,0 % |
| sin pista pero derivable | 222 | 53,2 % |
| **sospechoso: hueco léxico abierto sin pista** | **70** | **16,8 %** |

Concentración: **b1 27 · b2 13 · b3 13 · b5 6 · b4 5 · b10 5 · b7 2 ·
b6 1**. Los bloques bajos, que son los más viejos.

## El dictamen a mano — muestra de 20, con freno

**9 de 20 son inresolubles: 45 %.** El freno del proyecto (≥1 error real
⇒ se revisa la cola entera) **muerde a la primera**.

| ítem | frase | clave | veredicto |
|---|---|---|---|
| `046a3fd1` | A minha ___ cantou uma canção bonita. | irmã (+mãe) | **INRESOLUBLE** — prima, avó, filha, tia… |
| `a3d9f5a1` | Preciso de um ___ para ir ao aeroporto. | táxi | **INRESOLUBLE** — autocarro, comboio, carro |
| `c90e36c7` | O meu ___ favorito fica na praça central. | hotel | **INRESOLUBLE** — café, restaurante, bar |
| `f1b10ccb` | As ___ novas e o banho da manhã. | canções | **INRESOLUBLE** — roupas, notícias |
| `42ea165c` | Existem vários ___ na cidade nova. | cidadãos | **INRESOLUBLE** — bairros, hotéis, problemas |
| `7438d8e0` | Precisamos comprar ___ novas para a casa. | cadeiras | **INRESOLUBLE** — mesas, cortinas, camas |
| `c8481647` | Tenho ___ filhos e uma filha. | dois (+1) | **INRESOLUBLE** — três, quatro… |
| `e003d393` | O relatório ___ entregue amanhã. | será (+1) | inresoluble leve — «é entregue amanhã» también vale |
| `31fc0895` | O computador é muit___ útil para a familia. | útil | **ROTO** — el hueco está dentro de «muit___» y la clave es otra palabra: daba «muitútil útil». Y «familia» sin acento |
| `5583d948` | Quero dois ___ de pão. | pães | **ROTO** — «dois pães de pão» |
| los otros 10 | — | — | pasan (metalingüísticos, expresiones fijas, o el contexto los fija) |

**Los dos ROTOS se han arreglado en esta sesión**, porque no son
inresolubles sino falsos: publicaban una frase que no se sostiene.
Ahora, y estrenando el campo que la tarjeta ya pinta:

- `31fc0895` → «O computador é muito ___ para a família.» · clave `útil`
  · pista «lo contrario de "inútil" — y lleva acento agudo»
- `5583d948` → «Quero dois ___, se faz favor.» · clave `pães` · pista
  «el plural de "pão"»

Quedan **70 sospechosos**, y por la tasa de la muestra cabe esperar
**~30 inresolubles reales**.

## Lo que desbloquea arreglarlos

Hasta esta sesión no había forma de arreglarlos sin reescribir la frase,
porque **la pista no se renderizaba y el esquema la tiraba en silencio**.
Ahora `hintEs` sobrevive al esquema, a las dos rutas del resolver y a la
tarjeta, así que la reparación de los 70 es **una línea por ítem**: la
pista que determina la respuesta, sin tocar la frase ni el audio.

Ése es el trabajo de E2#15, y es barato. Lo que no era barato era
descubrir que hacía falta.


---

## E2#15 · dictaminados y reparados los 70, y la sorpresa está en la OTRA clase

**Los 70, uno a uno** (`docs/plans/cloze-dictamen-e2-15.json`):

| veredicto | n | reparación |
|---|---:|---|
| ROTOS (frase que no se sostiene) | 5 | frase reescrita |
| INRESOLUBLES | 39 | pista que determina + alternativas |
| PASAN (el contexto sí determina) | 26 | sin tocar |

Aplicado: **44 pistas nuevas, 18 listas de alternativas, 5 frases**, sin
tocar audio. Los sospechosos bajan de **70 (16,8 %) a 26 (6,2 %)**, y los
26 son exactamente los que dictaminé PASA.

**Una nota de método que costó una vuelta**: mi propio gate rechazó doce
pistas por contener la respuesta. En un par de lenguas cognadas, una
pista que DETERMINA suele ser la respuesta escrita («el hotel» →
`hotel`). Y sin embargo esos ítems son legítimos: su punto es
**ortográfico** —`b1-tonica-oxitona`, `b1-silaba-tonica`, `b1-h-muda`— y
el sustantivo es sólo el vehículo, así que la pista debe fijar el
significado y dejar que el alumno produzca la grafía. La salida no fue
aflojar el gate sino escribir la pista como **definición**: «donde se
duerme cuando se viaja», «la bebida negra del desayuno».

## Y la clase que daba por buena tampoco lo está

Muestra de 15 de los **220 «sin pista pero derivables»** —la clase que la
criba absolvía— dictaminada a mano:

- **`655a7e71` es FALSO y estaba publicado**: «Eu ___ café todas as
  manhãs quando vivia em Lisboa», con respuesta primaria **«toma»**. «Eu
  toma» es agramatical, y la tarjeta lo imprimía como «respuesta
  correcta»; la forma buena, «tomava», estaba de simple alternativa.
- **`d5a1df41` se contradice con su propio punto**: concepto
  `b3-imper-formal` y respuesta primaria **«Fala»**, que es el imperativo
  INFORMAL. La formal estaba de alternativa.
- **`acbb1382`** «O ___ é azul e muito bonito» → `olho`, pero también
  céu, carro, vestido.

**Dos errores duros de quince (13 %) y siete con problemas (47 %).** Los
tres se han arreglado. La conclusión incómoda: **la criba absolvía a 220
ítems que nadie había mirado**, y «derivable por la forma» no implica
«determinado por el enunciado» — un verbo puede ser derivable y estar en
la persona equivocada.
