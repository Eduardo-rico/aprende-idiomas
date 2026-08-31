# Revisión adversarial · lote industrial 3 · tramo B (MED-156 → MED-170)

Revisor: lingüista adversarial PT-PT / ES peninsular.
Fuente: `docs/contenido/2026-08-30-lote-industrial-avisos-3.md` (no tocado).
Método: fidelidad dato a dato contra `sourceText`, tickeo de cada casilla
sobre el `modelAnswer`, recuento manual de palabras, control PT-PT/ES-ES,
y verificación externa (Priberam, Ciberdúvidas, corpus del repo) de todo lo
que iba a afirmar sobre uso.

**Recuento: 7 ERROR · 4 DUDA · 4 OK.** Ninguno para matar.

Clase dominante: **plazos «até X» convertidos en «antes de X»** (3 ítems, y en
2 de ellos la rúbrica arrastra el mismo fallo). Segunda clase: **ancla de la
rúbrica ausente del gold** (1) y **amplificación no marcada** (1).

---

## ERRORES

### MED-157 · plazo inclusivo roto (y contradicción interna)
Fuente: «inscrições abertas **até 15 de junho, inclusive**». Casilla 1 pide
literalmente «hasta el 15 de junio **incluido**».
Gold: «hay que apuntarlo **antes del 15 de junio, ese día todavía vale**».

`antes del 15` excluye el 15; el aposito dice lo contrario. El gold se
contradice en la misma oración y modela para el alumno la ecuación falsa
«antes de X = hasta X incluido». La convención de la casa es la contraria:
en este mismo lote MED-170 escribe «hasta el domingo incluido», y los lotes
1-2 usan «hasta el 27 incluido», «hasta el viernes 19 incluido».

→ `modelAnswer`: «hay que apuntarlo antes del 15 de junio,» →
«hay que apuntarlo como muy tarde el 15 de junio,» (47 palabras, dentro de 30-65).

### MED-161 · plazo inclusivo roto EN EL GOLD Y EN LA RÚBRICA
Fuente: «comunique **até 15 de setembro**» (incluye el 15).
Casilla 2: «avisar **antes del 15** de septiembre». Gold: «tienes que decirlo
**antes del 15**». Los dos pierden un día en una gestión de seguro donde el
día importa. Aquí la casilla no salva al gold: está igual de mal.

→ `modelAnswer`: «tienes que decirlo antes del 15.» → «tienes que decirlo como muy tarde el 15.»
→ `rubric[2]`: «avisar antes del 15 de septiembre» → «avisar como muy tarde el 15 de septiembre».

Lo demás del ítem está bien: el señuelo funciona (el gold no cita HM-55021),
y «franquia»→«franquicia», «apólice»→«seguro» resueltos sin lusismo.

### MED-162 · amplificación no marcada: la fuente no habla de ningún banco
Fuente: «o **portal do cliente** estará indisponível». Casilla 1 pregunta
explícitamente «**qué se cae (el portal del cliente)**».
Gold: «el **portal del banco** estará caído».

La fuente nunca dice que sea un banco — es un email de servicio con pagos
programados, que puede ser una plataforma de proveedores, una utility o una
pasarela. El gold inventa el emisor, y con eso la casilla 1 deja de ser
tickeable sobre su propio gold.

→ `modelAnswer`: «el portal del banco» → «el portal de clientes».

### MED-163 · falta la ventana de 90 días que dos casillas exigen
Fuente: «Caso viaje para fora do espaço Schengen **nos próximos 90 dias**…».
Casilla 2 la nombra entre paréntesis; casilla 3 pide «que su viaje **entra en
esa ventana**». El gold nunca menciona los 90 días: sólo dice «vuelas a
Londres en tres semanas». El evaluador no tiene sobre qué ticar «esa ventana».

Falsa alarma del barrido, en cambio: la ventana de **seis meses** SÍ se
conserva («se puede renovar desde seis meses antes de que caduque»), y los
12 días hábiles también.

→ `modelAnswer`: «tres semanas y eso está fuera de Schengen,» →
«tres semanas — dentro de esos noventa días — y eso está fuera de Schengen,» (49 palabras, ≤70).

### MED-164 · «cozinha de época» no es «cocina de temporada»
En PT-PT lo estacional lleva artículo: **«fruta e legumes da época»**,
«produtos da época», o el adjetivo **«sazonal»** (DECO Proteste, CUF,
Continente, Turismo de Portugal, Cascais Foodlab: todos «da época» /
«sazonais»). **«De época»** sin artículo es el sentido *vintage/histórico*
(traje de época, carro de época, mobiliário de época). Un lisboeta lee
«curso de cozinha de época» como cocina de otro tiempo, no de temporada:
el gold cambia el tema del curso.

→ `modelAnswer`: «curso de cozinha de época» → «curso de cozinha com produtos da época» (46 palabras, ≤60).

Lo demás es PT-PT sólido: «o que cozinhar» (futuro de conjuntivo, muy bien),
«São só 12 lugares», «às terças de novembro». Las anclas «terças» y
«novembro» del barrido son falsos positivos: están las dos.

### MED-165 · «foi-se por dez dias» + la casilla de tuteo que el gold no tica
Resuelvo los dos discutibles que dejó el muestreo:

**(a) «A vizinha foi-se por dez dias» — ERROR.** En PT europeo la forma
asentada es **«foi-se embora»**; Ciberdúvidas confirma que en Portugal se
prefiere «ir-se embora» con clítico, y el corpus del repo da 12 «foi-se
embora» y **cero** «foi-se» + duración. El único «foi-se por» del corpus es
Garrett y es direccional («foi-se por uma alameda»), que es justo la lectura
parásita aquí. Además, «foi-se» a secas tiene lectura funeraria.

**(b) La casilla 4 pide «por tu» y el gold no trae ni una forma de 2.ª
persona** — todo es 1.ª plural («regarmos», «connosco») y un «cuidado»
invariable. La casilla no se puede ticar sobre el gold. Se arregla con una
palabra, sin tocar el «nós» que la tarea sí pide.

→ `modelAnswer`: «A vizinha foi-se por dez dias» → «A vizinha foi-se embora por dez dias».
→ `modelAnswer`: «cuidado que esse morre afogado» → «vê lá que esse morre afogado» (imperativo de *tu*, coloquial EP).

### MED-167 · plazo exclusivo + ambigüedad de adjunción
Fuente: «Diga-nos **até quarta**» (incluye el miércoles).
Gold: «Tienes que decirles **si lo hacen antes del miércoles**».

Dos fallos en una frase:
1. `antes del miércoles` excluye el miércoles, que es el plazo real; la
   casilla 3 repite el error («avisar antes del miércoles»).
2. La adjunción es ambigua: la lectura por defecto de «decirles si lo hacen
   antes del miércoles» es *"decirles si lo harán antes del miércoles"* —
   el plazo se pega al tratamiento, no a la respuesta. El dato que la casilla
   evalúa (cuándo tiene que contestar ella) queda irrecuperable.

→ `modelAnswer`: «Tienes que decirles si lo hacen antes del miércoles.» →
«Tienes hasta el miércoles incluido para decirles si lo hacen.»
→ `rubric[3]`: «(avisar antes del miércoles)» → «(avisar como muy tarde el miércoles)».

---

## DUDAS (preferencia o decisión de Edu, no fallo)

### MED-156 · «se são gente que chegue»
El patrón EP «X que chegue» (= suficiente: «dinheiro que chegue», «tempo que
chegue») existe, pero **«gente que chegue» no lo pude atestiguar** ni en el
corpus del repo (1 aparición: este mismo gold) ni en la búsqueda. En un gold
que el alumno imita, preferiría lo llano. La persona sí está bien: «se são»
concuerda con un «vocês» implícito. Todo lo demás del ítem está correcto —
y las dos anclas del barrido, «terça» y «quarta-feira», están las dos.
Opcional: «precisa de saber se são gente que chegue.» → «precisa de saber se são suficientes.»

### MED-158 · el gold contradice el `audience`
`audience`: «tu pareja española, **que va a ir a la reunión**». El gold cierra
con «**¿Vas tú o voy yo?**», que reabre lo que la ficha da por decidido.
No rompe ninguna casilla (las tres se tican), pero es incoherencia interna.
Se arregla por el lado barato: `audience` → «tu pareja española, que tendría
que ir a la reunión».

### MED-160 · «entregar» donde la fuente y la casilla dicen «firmar»
Fuente: «Los alumnos **sin autorización firmada**». Casilla 3: «quien no **la
firme**». Gold: «Quem não **entregar o papel**». Son criterios distintos (se
puede firmar y no entregar). En contexto escolar se solapan, por eso es duda
y no error. Sugerencia: «Quem não entregar o papel» → «Quem não assinar o papel».
El resto del portugués es EP de buena ley: «fica na aula **na mesma**»,
«cujos pais tenham assinado», «Quem não entregar» (futuro de conjuntivo).

### MED-169 · «rachas de hasta noventa» sin unidad
La casilla 2 nombra «rachas de hasta **90 km/h**»; el gold da sólo «noventa».
En habla real de España se entiende, pero la casilla pide una unidad que el
gold no tiene. Sugerencia mínima: «rachas de hasta noventa,» → «rachas de
hasta noventa por hora,». El reordenar está perfecto: la primera frase es la
acción («Mete ya las macetas…»).

---

## OK sin reservas

- **MED-159** (parcial). El hueco está señalado con precisión y sin inventar:
  «Lo que no dicen es desde qué lunes empieza ni a qué hora». «A partir de
  outubro» → «Desde octubre» ✓. El barrido marcaba «antes de comprar nada»
  como plazo: es falso positivo, no es un plazo de la fuente.
- **MED-166**. «Se o vires» (futuro de conjuntivo), «não te assustes» (tuteo
  explícito, que aquí sí está), «lá em baixo», teléfono íntegro. Y **«rés do
  chão» es correcto**: Priberam marca «rés-do-chão» como grafía anterior y
  «rés do chão» como la alterada por el AO90 — el repo tiene las dos, pero la
  del lote es la buena.
- **MED-168**. Los tres datos (llave general, medio depósito, turno 20-22 y
  bomba apagada fuera de turno) trasladados; «torneira»/«rega» resueltos.
  Único roce estilístico: «fuera de esa hora» por «fuera de esa franja».
- **MED-170**. El ítem modelo del tramo: **«hasta el domingo incluido»** hace
  bien exactamente lo que MED-157/161/167 hacen mal, mantiene el topónimo
  portugués sin traducir (Rua Direita 8) y resuelve «cacifo»→«taquilla»,
  «levantamento»→«ir a recogerlo».

## Qué está bien en el tramo (específico)

1. **El portugués de los es→pt es de nivel**, y es donde el listón era máximo:
   futuro de conjuntivo bien usado y no decorativo («o que cozinhar», «Se o
   vires», «Quem não entregar»), «precisa de saber», «connosco», «na mesma»,
   posesivo con artículo, cero gerundio de presente continuo, cero «você»,
   cero léxico brasileño. No he encontrado un solo brasileñismo en los 15.
2. **Las anclas que el barrido daba por ausentes casi todas estaban**: 156
   (martes+miércoles), 163 (los seis meses), 164 (martes+noviembre), 161
   (150/200, en letra), 167 (3391 correctamente AUSENTE, es señuelo). El
   barrido mecánico funcionó como prior, no como veredicto.
3. **Los dos señuelos (161, 167) funcionan**: ninguno de los dos golds cita el
   número que la casilla prohíbe.
4. **Los wordRange se cumplen los 15**, con margen; ninguna corrección de las
   propuestas saca a nadie del rango (recuentos hechos a mano, uno por uno).
5. **Los reordenar (169) y el parcial (159) cumplen su operación**, que era lo
   nuevo del lote: la acción urgente va primero, y el hueco se nombra como
   hueco sin resolverlo por cuenta propia.
