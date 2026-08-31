# Informe C — lote industrial 3, tramo MED-171…184 (14 ítems)

Revisor: lingüista adversarial PT-EU / ES peninsular.
Fuente: `docs/contenido/2026-08-30-lote-industrial-avisos-3.md` (no tocado).

**Recuento: 6 ERROR · 3 DUDA · 5 OK · 0 para matar.**

| id | veredicto | clase |
|---|---|---|
| MED-171 | OK | — |
| MED-172 | ERROR | hispanismo en `audience` (campo en PT) |
| MED-173 | ERROR | rúbrica pide un dato que la fuente no da («para facturar») |
| MED-174 | ERROR | «quién hace qué» alterado (os pais → la tía) + regla inventada |
| MED-175 | ERROR | plazo omitido (confirmado por el muestreo) |
| MED-176 | OK | — |
| MED-177 | DUDA | casilla enumerativa: falta «saneamiento» en el gold |
| MED-178 | OK | — |
| MED-179 | OK | — |
| MED-180 | ERROR | **calco del español**: «dão-te baixa automática» |
| MED-181 | DUDA | dato personal inventado en el gold |
| MED-182 | DUDA | el cierre inclina la contradicción hacia un cuerno |
| MED-183 | ERROR | plazo movido: `até ao fim da semana` → «antes del fin de semana» |
| MED-184 | OK | — |

Todos los golds están dentro de su `wordRange` (contado a máquina; el más
corto 36, el más largo 58). Todas las correcciones propuestas dejan el
gold dentro del rango.

---

## ERRORES

### MED-172 · `audience` en portugués con una palabra española cruda
> **audience:** «o teu colega de casa português, que costuma deixar o carro **no paseo**»

`paseo` no existe en portugués. En PT-PT `passeio` es la *acera*, así que
ni siquiera la forma portuguesa serviría; el gold, con buen criterio, lo
resuelve como **`a marginal`**. Resultado actual: el alumno lee el campo
`audience` (prosa portuguesa, igual que en los 13 ítems es→pt de los lotes
1-2, todos íntegramente en PT) con un término español incrustado y en
minúscula, y además con un nombre distinto del que usa el gold para el
mismo sitio. Corrección: `carro no paseo»` → `carro na marginal»`.

*Nota menor (no error):* «senão ficas sem ele **até à tarde**» es una
inferencia añadida — la fuente no dice que el coche quede atrapado, sólo
que hay corte total de 8 a 14. La inferencia se sostiene (corte total ⇒ no
lo sacas) y las 14h caen en la tarde, así que no lo cuento como dato
inventado, pero es el límite. El resto del ítem está bien: el señuelo
`TR-9082` está de verdad ausente, y «Tira o carro de lá antes das 6h»
traslada correctamente «no aparcar desde las 6:00».

### MED-173 · la casilla 3 exige «para facturar», que la fuente no dice
Fuente: «Passageiros com bagagem de porão devem **dirigir-se primeiro ao
balcão**.» — no dice **para qué**.
Casilla 3: «(pasar antes por el mostrador **para facturar**)».
Gold: «hay que pasar antes por el mostrador» — sin finalidad.

La casilla enumerativa pide un sub-dato que ni la fuente ni el gold
contienen: no se tica mirando el gold, y si se "arregla" completando el
gold se estaría inventando la finalidad (que en un terminal de autobuses
sería etiquetar la maleta, no «facturar» en el sentido aeroportuario). Se
arregla **recortando la casilla**, no tocando el gold:
`mostrador para facturar)?` → `mostrador)?`

Lo demás del ítem es sólido: reordenación correcta (el cambio de dársena
va primero), aritmética 16:30 − 10 min = 16:20 explicitada, y los dos
lusismos que la casilla 4 vigila (`cais`, `porão`) están bien resueltos
como «dársena» y «bodega».

### MED-174 · el requisito es de LOS PADRES, y el gold se lo aplica a la tía
Fuente: «**Os pais** devem dirigir-se ao balcão com documento de
identificação.»
Audiencia: «tu amiga española, **que está buscando a su sobrino**».
Gold: «Corre para allá, pero **llévate el DNI, que sin documento no te lo
entregan**.»

Dos fallos encadenados, ambos de la lista de "error real" del propio lote:
1. **Dato alterado** — «os pais» → «tú». La fuente designa a quién le toca
   la acción, y el gold reasigna esa obligación a una persona que no es la
   designada (una tía). Es exactamente el eje «quién hace qué».
2. **Dato inventado** — «sin documento no te lo entregan» implica el
   converso: *con* documento sí se lo entregarían a ella. La megafonía no
   dice eso, y en la práctica no es cierto.

La casilla 3 arrastra el mismo borrado («(ir con documento de
identidad)»), así que hay que corregir las dos piezas:
- gold: «pero llévate el DNI, que sin documento no / te lo entregan.» →
  «y avisa a sus padres, que piden que vayan ellos / con documento de
  identidad.» (41 → 44 palabras, rango 25-55 ✔)
- casilla 3: «(ir con documento de identidad)» → «(que vayan los padres
  con documento de identidad)».

El resto está bien: `piso 0` → «planta baja» ✔, la descripción completa
(cuatro años, jersey azul, nombre) ✔, `camisola` → «jersey» ✔.

### MED-175 · plazo omitido (ya confirmado en el muestreo)
Casilla 2: «la 5 se queda abierta **hasta el último cliente**».
Gold: «la única que se queda es la 5» — sin el plazo, que es **el único
plazo del ítem** y lo que hace útil el aviso.
Corrección: `la única que se queda es la 5.` → `la 5 se queda abierta
hasta que salga el último cliente.` (42 → 46 palabras, rango 25-55 ✔).
Con eso las tres casillas de contenido se tican. El horario de mañana
(9h-13h → «de nueve a una») ya estaba correcto.

### MED-180 · calco del español: «dão-te baixa automática»
Gold: «se falhares a segunda, **dão-te baixa automática**».

`dar baixa` existe en portugués, pero **no con este sentido y no con esta
construcción**. Comprobado:
- **Priberam** (locución `dar baixa`): «Registar ou assinalar, numa lista,
  um item como feito, considerado, completo, **pago**, etc.» — es decir,
  casi lo contrario de lo que se quiere decir aquí.
- **Ciberdúvidas** (consultorio, "dar baixa"): los sentidos vivos son el
  militar («cessação no serviço militar»), el médico-social (baja laboral)
  y el hospitalario («dar baixa ao hospital» = *ingresar*, que para un
  hispanohablante es el reverso), más el técnico «licenciar; eliminar
  (nota de culpa, de débito)». Ninguno cubre a una persona a la que
  cancelan la inscripción.
- El término real en PT-PT es **`anulação da matrícula`** / «anulam a
  matrícula» (así lo llaman DGES, ISEP, IPS, ISCAL y los reglamentos de
  propinas).

`dão-te baixa` es la traducción palabra a palabra del español «te dan de
baja», dentro de un ítem **es→pt** cuyo único trabajo es no calcar el
español. Corrección: `dão-te baixa automática` → `anulam-te a matrícula
automaticamente` (38 → 39 palabras, rango 25-60 ✔), que además encaja con
`propina` en la primera frase (en PT se pagan propinas y se anula la
matrícula).

*Discutible, no error:* «Atenção a esta:» — leído como anáfora de «outra
em janeiro» (= a segunda prestação) es gramatical, aunque yo escribiría
«Mas atenção:». No lo toco. `propina`, `prestações`, `comprovativo` y
`secretaria virtual` son PT-PT correctos (y `comprovativo`, no el
brasileño `comprovante`).

### MED-183 · el plazo se mueve y además cambia de referente (confirmado)
Fuente: «Fica combinado **até ao fim da semana**!»
Casilla 2: «(antes de fin de semana)». Gold: «antes del fin de semana».

Dos deslizamientos en cuatro palabras:
1. `até ao` es **inclusivo**; «antes de» lo excluye. Misma clase que frenó
   el lote industrial 1 y que MED-142 («até às 8h» → «antes de las ocho»).
2. `fim **da** semana` (el final de la semana) ≠ `fim **de** semana` (el
   fin de semana, sábado-domingo). En español «el fin de semana» sólo
   tiene la segunda lectura, así que la traducción cambia el referente
   además del borde.

Correcciones:
- gold: `antes del fin de semana` → `hasta el final de la semana`
  (50 → 52 palabras, rango 25-60 ✔).
- casilla 2: `(antes de fin de semana)?` → `INCLUSIVO (hasta el final de
  la semana)?` — con la marca INCLUSIVO, como ya hace MED-178.

El modificador `parcial` en sí está **bien construido**: el hueco es real
(el hilo no dice ni cuánto pone cada uno ni el número de MB WAY) y el gold
lo marca en vez de rellenarlo. *Nota:* «una madre lo compra» inventa el
género del emisor («Eu trato de comprar» no lo marca) — como el mismo
sesgo está en la casilla 1, no rompe la autoevaluación; si se toca, hay
que tocar las dos a la vez.

---

## DUDAS

### MED-177 · casilla enumerativa: el gold se come «saneamiento»
Casilla 1: «(38,60 € **de agua y saneamiento**, bimestre, 14 m³)».
Gold: «el recibo **del agua**: 38,60 euros por el bimestre, catorce metros
cúbicos». Importe, bimestre y m³ ✔; el concepto va a medias.

En España «el recibo del agua» engloba de facto el saneamiento, así que la
mayoría de correctores ticarían — por eso es DUDA y no ERROR — pero es
justo la casilla-de-N-datos que publica rota si el corrector es literal.
Se arregla más limpio por el lado del gold (la rúbrica está derivada por
construcción de la fuente): `Ha llegado el recibo del agua: 38,60 euros` →
`Ha llegado el recibo del agua y el saneamiento: 38,60 euros` (40 → 43
palabras ✔). Alternativa equivalente: recortar «y saneamiento» de la
casilla. **Corrección propuesta como opcional.**

### MED-181 · el gold inventa un hecho del mundo
«Y preguntan quién tiene mesas plegables — **nosotras tenemos una**, ¿la
bajamos?» La fuente no dice que ellas tengan mesa; la consigna
(«resúmele lo que hay que saber») tampoco lo licencia. Las tres casillas
se tican igual, y el registro chat-grupo pide un cierre así, pero es el
modelo que el alumno imita: preferiría «¿tenemos alguna nosotras?».
Todo lo demás es ejemplar: `Malta` no deja rastro, `condomínio` →
«comunidad», `partilhar` → «compartir», y el femenino «nosotras» concuerda
con la `audience`.

### MED-182 · el cierre inclina la contradicción
La contradicción es **real** (senhorio: duas semanas · empreiteiro: seis,
no mínimo) y el gold la señala explícitamente sin arbitrar: «Lo que no
está nada claro es cuánto duran…». Hasta ahí, impecable — incluso el
«disse-me» del vecino se resuelve bien como «le dijo a otro vecino».

El problema es el cierre: «**hazte a la idea larga**» recomienda actuar
sobre uno de los dos cuernos. No afirma que sea cierto, y el «no mínimo»
del contratista lo respalda, pero el modificador `contradictorio` se
estrena en este lote y el gold es lo que el alumno copia; compárese con el
patrón limpio de MED-179 («No cuadra; conviene preguntar antes de
pagar»). Sugerido (opcional): «Tú que teletrabajas, mejor pregunta en el
grupo a qué atenerte».

Segundo punto menor: «Empiezan las obras **del cuarto** el lunes» —
en español «el cuarto» compite con 'la habitación'; «del cuarto piso»
desambigua y cabe de sobra (58 → 59 palabras, tope 65).

---

## Los cinco que pasan limpios, y por qué

- **MED-171**: la reordenación funciona (el cambio de vía abre), `vía` →
  `linha` es el término portugués correcto para andén de comboio, `15h42`
  está (el barrido lo dio por ausente porque buscaba «15:42» — falso
  positivo del formato), «puntual» se resuelve como «não esperam», y el
  cierre «Despacha-te com a água!» ata con la `audience`.
- **MED-176**: PT-PT limpio y difícil de hacer bien: `ir ter a` para
  «reunirse», imperativos de `tu` correctos en las dos polaridades («Sai /
  vai / deixa» vs. «não percas», con próclise obligada por la negación),
  `parque de estacionamento`, y `estar a + infinitivo` («a arrumar»). Las
  tres casillas se tican.
- **MED-178**: el señuelo (referência multibanco) está de verdad ausente;
  «como muy tarde el día 8» **conserva la inclusividad** de `até dia 8` —
  es el ítem que hay que enseñar como modelo frente a MED-183 y MED-142; y
  `juros de mora` → «cobran intereses» evita el lusismo.
- **MED-179**: reverificado entero. Contradicción real, aritmética
  correcta (26 sept + 15 días = 11 oct), señalada sin resolver, y el
  cierre neutro correcto.
- **MED-184**: el señuelo (el bar de la calle Huertas) está omitido; el
  futuro do conjuntivo «quem chegar atrasado» es correcto; `gelados`,
  `manta`, `ao pé do lago` son PT-PT. *Nota mínima:* «não precisas de
  levar nada» es una inferencia (la fuente sólo dice que otro lleva manta
  y frisbee), pero se deriva del texto y no altera ningún dato.

---

## Lectura del tramo

- **Los modificadores nuevos NO son el problema.** `contradictorio` (179,
  182) y `parcial` (183) construyen contradicciones y huecos **reales**, y
  los golds los señalan sin arbitrar ni rellenar. Los únicos reproches son
  de matiz (el cierre de 182). Confirma lo que ya indicaba el muestreo de
  179.
- **La clase dominante sigue siendo el plazo**: 2 de 6 errores (175
  omitido, 183 movido y con el referente cambiado), y es la misma clase
  que frenó el lote 1 y que reaparece en MED-142. Sugiero un chequeo
  mecánico previo a publicar: para cada `até`/`hasta`/`antes de` de la
  fuente, comparar borde e inclusividad con el gold **y** con la casilla.
- **Segunda clase: la rúbrica/gold amplían la fuente** (173 «para
  facturar», 174 «no te lo entregan», 177 al revés — la rúbrica pide y el
  gold no da). Las casillas enumerativas son el vehículo: 3 de mis 9
  hallazgos viven dentro de un paréntesis con 2-4 sub-datos.
- **Un solo error puramente lingüístico**, y está donde más duele: un
  calco español en un gold **es→pt** (180). Los otros tres es→pt del tramo
  (171, 176, 184) están limpios; el cuarto punto de contacto es→pt es el
  campo `audience` de 172, que también se contaminó. Si hay una regla
  general que sacar: **revisar los es→pt del lote entero buscando calcos**
  (`dar de baja`, `dar de alta`, `pasar por caja`, `sacar cita`…), no sólo
  los golds sino los campos `audience`.
