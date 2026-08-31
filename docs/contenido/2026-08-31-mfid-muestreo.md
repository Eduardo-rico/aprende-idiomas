# Muestreo adversarial 5/24 · familia MEDIACIÓN-ÍTEM v1 «fidelidad de relay»

Revisor: lingüista adversarial PT-PT / ES peninsular.
Documento auditado: `docs/contenido/2026-08-31-familia-fidelidad-mediacion-v1.md`.
Muestra fijada de antemano: MFID-03, 08, 13, 20, 24.
Regla del freno fijada de antemano: ≥1 ERROR REAL ⇒ el lote entero a revisión a mano.

**FRENO: SÍ.** Cuenta 1 error real (MFID-24). 1 de 5 = 20 % de la muestra; el
protocolo del §7 frena a >2 %.

---

## MFID-03 · sms-servicio · pt→es · OMISIÓN — **PASA** (3 discutibles)

**Fuente portuguesa: limpia.** «consulta de enfermagem», «passou para», «no
gabinete 3», «Traga a lista da medicação», «Para desmarcar, responda ANULAR».
Ni un brasileñismo: nada de gerundio, ningún «você», ningún clítico mal
colocado (no hay clíticos), tratamiento deferente en 3.ª persona sin pronombre
y sostenido en todo el SMS («a sua consulta» / «Traga» / «responda»).
«Desmarcar» es el verbo europeo para anular una cita, no un calco.

**Español del recado: natural, y —lo importante— el mostrado no se delata.**
Al quitar «en el gabinete 3» la frase queda «Te han cambiado la consulta de
enfermería al miércoles 9 a las once y veinte.», que fluye igual de bien que la
fiel. El alumno no puede acertar por el oído. Esto está bien resuelto.

**Clave defendible y única.** [1] «Cambia la hora» es falso (11h20 → once y
veinte), [3] «No falla nada» es falso, [2] «Añade algo» es lo único
discutiblemente atacable (ver abajo) y es mucho menos saliente que la omisión.
Gate 4 se cumple: hora y adición existen como tipos de dato en la fuente.

- **DISCUTIBLE 1 (el que más me molesta).** El *recado fiel* ya pierde un dato
  antes de aplicarle nada: «Centro de Saúde da Lapa» no aparece. Y no es un
  dato cualquiera aquí, porque la clave del ítem es precisamente «Falta el
  lugar»: la línea base ya falla de lugar. Respecto de la fuente, el mostrado
  está a **dos** omisiones, no a una. El ítem sobrevive porque la lista de
  `datos` del autor no enumera el centro y **ningún gate compara el fiel con la
  fuente** (ver «Patrón 1»). Decisión pedida: o el emisor es siempre un dato de
  la familia, o nunca — hoy MFID-08, 09 y 14 sí lo trasladan («de la
  biblioteca», «por megafonía», «de la farmacia») y 03 y 24 no.
- **DISCUTIBLE 2.** «gabinete» en el recado español. En un centro de salud
  español la sala de enfermería es «la consulta 3», no «el gabinete 3»
  («gabinete» se reserva a salas de pruebas: gabinete de endoscopias). Es
  defendible como etiqueta de puerta de un centro portugués —la misma doctrina
  que MFID-20 aplica a «calle Toledo»— y además sólo aparece en la versión
  fiel, que nunca se muestra. Riesgo real: cero.
- **DISCUTIBLE 3.** «Para desmarcar, responda ANULAR» → «y si no puedes, se
  anula respondiendo ANULAR» introduce una condición («si no puedes») que el
  SMS no enuncia; está implicada por «desmarcar», así que lo acepto, pero un
  alumno tiquismiquis podría defender [2].

---

## MFID-08 · app-notificacion · pt→es · PLAZO — **PASA** (3 discutibles, uno serio)

**Fuente portuguesa: excelente, con dos marcas europeas de primera.**
`requisitou` es el verbo europeo de préstamo bibliotecario — Priberam da el
ejemplo literal «requisitou dois livros na biblioteca». `foi aceite` es el
participio europeo (Brasil: «aceito»); el corpus del repo lo atestigua con
grafía decimonónica —`acceite`— cuatro veces («a calumnia […] acceite pela
opinião publica», «fôra bem acceite em Lisboa»), y buscando la grafía moderna
no sale ninguna: la trampa ortográfica que avisa el encargo volvió a saltar
aquí. «Até quarta-feira, dia 22, inclusive» es la fórmula europea correcta.

- **DISCUTIBLE A (portugués).** «prazo de entrega» para devolver un libro. En
  Portugal los regulamentos de biblioteca dicen `prazo de devolução` / `data de
  devolução`; «entrega» colocaciona con mercancía o con trabajos que se
  entregan. Corrección: «O novo prazo de **devolução** é até quarta-feira, dia
  22, inclusive.»
- **DISCUTIBLE B (español del mostrado — el serio, roza el §6).** «El nuevo
  plazo para devolverlo **es antes del** miércoles 22» cruza categorías: un
  *plazo* termina *en* una fecha; con «antes de» se dice «hay que devolverlo
  antes del…». No es agramatical y se lee sin tropezar, pero es medio punto
  menos idiomático que la versión fiel («es hasta el miércoles 22 incluido»),
  y ése es exactamente el flanco que el §6 vigila a mano. **No lo cuento para
  el freno** porque es preferencia de redacción, no fallo que un nativo marque.
  Corrección que mantiene un solo tramo de diff (calcada de MFID-01, que sí lo
  hace bien):
  - fiel: «Hay que devolverlo **como muy tarde el miércoles 22**, y ya no se
    puede renovar más veces.»
  - mostrado: «Hay que devolverlo **antes del miércoles 22**, y ya no se puede
    renovar más veces.»
- **DISCUTIBLE C (distractor vecino).** [1] «Cambia el día de entrega» está muy
  cerca de la clave [3] «Se adelanta el plazo»: «antes del 22» mueve de facto
  el vencimiento al 21. Se sostiene porque el recado sigue imprimiendo
  «miércoles 22», así que [3] es estrictamente mejor. Pero ver «Patrón 2»: en
  MFID-14 un cambio literal de día se etiqueta «Se adelanta el plazo», o sea,
  el lote enseña las dos reglas contrarias.

---

## MFID-13 · cartel · pt→es · REASIGNACIÓN — **PASA** (2 discutibles menores)

**Fuente portuguesa: impecable, con tres marcas europeas.** `Quem precisar` es
futuro do conjuntivo, vivo y correcto. `avisar o porteiro` sin preposición es
el régimen portugués frente al español «avisar **al** portero» — contraste
bueno y bien ejecutado. `até às 11h` con contracción es europeo (Brasil «até
as 11h»). `sacos` (Brasil «sacolas»), `portaria`, `elevador`: todo EP; el
corpus atestigua «porteiro» y «elevador».

**Español: las dos versiones son igual de naturales.** «Avisar a la
administración» es lo que se dice en una comunidad de propietarios española.
El mostrado no suena peor que el fiel.

**Clave única.** [0] es falso (las bolsas sí están), [1] es falso («como muy
tarde a las once» conserva la inclusividad), [2] falso. Gate 4 cumplido.

- **DISCUTIBLE 1.** «Obras no elevador» → «arreglan el ascensor» estrecha
  «obras» a «arreglo» en la línea base. Inofensivo (ninguna opción apunta al
  motivo), pero es interpretación, no trasvase.
- **DISCUTIBLE 2 (diseño).** El recado defectuoso se contradice solo: «avisar a
  **la administración** […] y las bolsas se quedan **en portería**». Un alumno
  espabilado huele el desajuste sin abrir el aviso. No es fatal —sigue
  necesitando la fuente para elegir entre las cuatro etiquetas— pero es medio
  atajo. Si se quiere cerrar: que la REASIGNACIÓN apunte a un agente que no
  choque con el lugar que el propio recado conserva (p. ej. «avisar a la
  empresa del ascensor»), en vez de a la administración.

---

## MFID-20 · sms-servicio · es→pt · FIEL — **PASA** (2 notas de preferencia)

**Portugués europeo correcto en todo el recado**, que aquí es lo único que se
juega porque la fuente es española y el recado es FIEL (o sea: se certifica
como modelo). Repaso: `renovares` / `puderes` (infinitivo pessoal y futuro do
conjuntivo, ambos bien), `esquadra` (EP; Brasil «delegacia»), `Tens de levar`
(«ter de», preferencia europea), `liga para o 900 100 200` (régimen correcto,
con artículo ante el número), `9h40` en formato portugués. Sin gerundio, sin
«você», sin clíticos mal colocados, tratamiento `tu` sostenido de principio a
fin. La asimetría fuente formal («Su cita», «Traiga») / recado informal es la
convención del género, la misma de los 18 pt→es.

**Fidelidad 4/4 y nada añadido.** Día y hora, lugar, qué llevar y teléfono.
La doctrina de la explicación —traducir «comisaría»→«esquadra» y **no** traducir
«calle Toledo»— es la correcta.

- **NOTA 1.** `bilhete de identidade` para el DNI español. Es el término
  genérico con que en Portugal se nombra un documento de identidad extranjero y
  se entiende sin fricción, pero en Portugal el BI fue sustituido por el Cartão
  de Cidadão (2007-08), así que un alumno puede llevarse la idea de que es el
  documento portugués vigente. Además hay una tensión doctrinal con la propia
  explicación del ítem («traduzir o nome próprio […] seria alterar um dado»):
  «DNI» es tan nombre propio como «calle Toledo». Las dos opciones son
  defendibles; lo que pido es que la familia **decida una vez** y la aplique
  igual en los 24.
- **NOTA 2.** «A marcação […] é na segunda-feira» — «marcação» es el acto de
  marcar; más idiomático sería «**Tens marcação** para segunda-feira, dia 6, às
  9h40». Preferencia, no error.

---

## MFID-24 · app-notificacion · es→pt · FIEL — **ERROR REAL**

> «Na quinta-feira, dia 14, das 10h às 13h, **vêm rever os extintores** do
> prédio todo.»

**`rever os extintores` es un hispanismo.** Es calco directo de «revisan los
extintores». Evidencia, en este orden:

1. **Priberam**, entrada *rever*: «tornar a ver», «examinar cuidadosamente»,
   «fazer a revisão de», «corrigir (provas)», «ressudar», «recuperar a
   vista»… El sentido de *revisão* que el diccionario documenta es el textual y
   el jurídico (*revisão de provas*, *nova análise de uma lei, decreto ou
   processo*). Ninguna acepción cubre mantenimiento de equipamiento.
2. **Corpus del repo** (224 lecturas): las únicas atestaciones de *rever* son
   «rever a mortal Penélope», «rever o passado», «rever-se na filha» — todas
   «volver a ver / repasar mentalmente». Ninguna de inspección física.
3. **Uso real portugués**: la búsqueda de la cadena exacta «rever os
   extintores» sólo devuelve páginas **españolas** sobre «revisión de
   extintores» — es decir, la colocación de partida que se está calcando. Las
   fuentes portuguesas (NP 4413, guías de condomínio, EDP, APSEI) dicen
   invariablemente `manutenção`, `inspeção`, `verificação` o `revisão`
   (sustantivo) **dos/aos** extintores; el titular de la Loja do Condomínio es
   «verificação de rotina **aos** extintores».

**Por qué cuenta como error real y no como preferencia:** un nativo lo marca,
y el ítem es **FIEL**, así que la frase se presenta al alumno como el modelo de
buen portugués y la clave «Não falha nada» la certifica como correcta. Es la
dirección es→pt: ese recado es el único portugués en pantalla y es el que el
alumno va a interiorizar.

**Corrección** (y como es FIEL, hay que aplicarla **byte a byte a las dos
versiones**, o salta el gate 5):

> «Na quinta-feira, dia 14, das 10h às 13h, **vêm fazer a manutenção aos
> extintores** do prédio todo.»
> (alternativa igual de europea: «vêm **verificar** os extintores do prédio
> todo».)

**El resto de MFID-24 está bien**, y conviene decirlo: `prédio`,
`arrecadação` (atestiguada en el corpus), `cadeado`, `quem tiver … que avise`
(futuro do conjuntivo), `das 10h às 13h`. Y sobre todo, «Não é preciso estar
ninguém em casa, só nas arrecadações» **conserva la elipsis** del español «No
hace falta que haya nadie en casa, sólo en los trasteros», con la misma lectura
y la misma ambigüedad: eso es mediación fina y hay que dejarla como está.

- **DISCUTIBLE.** Se pierde el emisor («Aviso de la comunidad»), igual que en
  MFID-03. «vêm» añade un matiz de desplazamiento que «revisan» no dice;
  inofensivo. Faltaría una coma antes de «que avise».

---

# Veredicto del freno

**FRENO: SÍ.**

- **Cuenta para el freno:** 1 error real — MFID-24, «vêm rever os extintores»
  (hispanismo, en un ítem FIEL de dirección es→pt).
- **NO cuentan** (discutibles / preferencias): MFID-03 pérdida del emisor en la
  línea base, «gabinete» en español, «si no puedes»; MFID-08 «prazo de
  entrega», «el plazo … es antes del», distractor vecino; MFID-13 «arreglan» y
  la contradicción interna administración/portería; MFID-20 «bilhete de
  identidade» y «a marcação é».

1 de 5 = 20 % de la muestra. El umbral del §7 es 2 %. **El lote de 24 va entero
a revisión a mano.**

---

# Patrones — vale más que el detalle de los cinco

### Patrón 1 · Nadie compara el recado fiel con la fuente. Ni a máquina, ni en el §6.

Leí `scripts/lib/fidelidad-mediacion.ts`. `tramoCambiado()` diffea **fiel ↔
mostrado**; `coherenciaDatosFuente()` sólo comprueba que los datos **que el
autor declara** tengan una marca visible en la fuente, y sólo para DIA, HORA,
PLAZO y PRECIO. **No existe ninguna comprobación fuente → fiel.** Consecuencia:
todo lo que el autor no meta en su lista de `datos` es invisible a los cinco
gates, y la línea base puede estar ya rota sin que nada chille — que es
justamente el fallo que hace podrido el ítem entero, porque la transformación
se aplica sobre algo que no era fiel.

Ya se ve en la muestra: 2 de 5 pierden el emisor (MFID-03 «Centro de Saúde da
Lapa», MFID-24 «Aviso de la comunidad») mientras MFID-08, 09 y 14 sí lo
trasladan. En MFID-03 el agravante es que la clave del propio ítem es «Falta el
lugar». Acción para la revisión a mano: **pasar los 24 comparando fiel ↔ fuente
dato a dato**, y fijar por regla de familia si el emisor es dato o no lo es.

### Patrón 2 · La frontera PLAZO / ALTERACIÓN tiene fuga, y la máquina no la ve.

El §3 define PLAZO como una cosa muy concreta: «até X» (incluye X) rendido como
«antes de X». Y define ALTERACIÓN como «se cambia el valor de un dato (día,
hora, importe, sitio)». **MFID-14 cambia «viernes 18» por «jueves 17» y se
declara PLAZO** — su propia explicación lo admite: «cambia directamente el día,
que es la versión burda de la misma clase». Por la tabla, eso es ALTERACIÓN.

El gate 2 no lo puede cazar: sólo exige que la clave **contenga la palabra**
«plazo/prazo» (`PLAZO: /plazo|prazo/i`), y el chequeo extra de PLAZO sólo pide
que la fuente tenga en algún sitio un marcador `até|hasta|inclusive|antes
de|a partir de`. MFID-14 sobrevive únicamente porque su juego de opciones no
ofrece «cambia el día». **MFID-08 sí ofrece las dos etiquetas a la vez** ([1]
«Cambia el día de entrega» y [3] «Se adelanta el plazo»). A través del lote, el
alumno recibe dos reglas contradictorias sobre el mismo hecho.

Arreglo barato: restringir PLAZO al intercambio de inclusividad (que es como lo
define el §3), reclasificar MFID-14 como ALTERACIÓN, y añadir un gate que
prohíba que en un ítem PLAZO cambie el **valor** de día/hora.

### Patrón 3 · Los cinco gates miden fidelidad; ninguno mide si el recado es buena lengua.

El §6 vigila a mano un solo riesgo lingüístico: que el recado **defectuoso**
suene peor que el fiel. El error que ha aparecido es el complementario y no
está previsto: que el recado **fiel** sea mala lengua. En es→pt eso es lo más
caro que puede pasar, porque el recado es el único portugués en pantalla y, si
el ítem es FIEL, la clave «Não falha nada» lo certifica como modelo. Los 6
ítems es→pt (19-24) merecen prioridad en la revisión a mano, y el chequeo
concreto es **el verbo de cabeza**: los verbos de trámite y mantenimiento son
donde se cuela el calco (*rever*, *revisar*, *checar*, *fazer a revisão de*).
Añadir al checklist del round: «el recado FIEL tiene que ser lengua impecable,
no sólo fiel».

### Leads no auditados (fuera de la muestra, para el round)

- **MFID-23**: la transformación toca dos cosas, el agente **y** el verbo («A
  secretaria **recebe-a**» → «O professor **recolhe-a**»). El gate 1 lo funde en
  un solo tramo por el `PEGA = 3`, así que pasa; pero cambiar el verbo es
  gratuito y podría discutirse la clave. Lo demás de ese ítem está bien:
  «a secretaria» sin acento (la oficina, no la señora) y las énclises
  `recebe-a` / `recolhe-a` son correctas en EP.
- **MFID-19, 21, 22**: en una lectura no sistemática no vi nada; el léxico
  europeo está bien elegido (`cave`, `balcão`, `lava-loiça`, `torneira de
  segurança`, `parque de estacionamento`, `miradouro`, `percurso`), y
  «continuam a ser feitos» esquiva el gerundio brasileño. No es un veredicto:
  no eran mi muestra.
- Detalle de código, inerte pero feo: `scripts/lib/fidelidad-mediacion.ts:218`
  hace `test(norm(clave) === clave ? clave : clave)` — las dos ramas del
  ternario son la misma, o sea que la normalización que se pretendía nunca
  ocurre. Hoy no rompe nada porque los regex del gate 2 ya llevan las variantes
  acentuadas, pero es una trampa para el próximo que añada una etiqueta.

---

# Qué está bien (obligatorio, y aquí es sustancial)

1. **El portugués de las fuentes pt→es es de nativo, no de manual.** `foi
   aceite`, `requisitou`, `Quem precisar`, `avisar o porteiro` sin preposición,
   `até às 11h` con contracción, `sacos`, `portaria`, `desmarcar`,
   `consulta de enfermagem`. Ni un gerundio de presente continuo, ni un
   «você», ni una próclise brasileña en toda la muestra.
2. **Las omisiones no dejan costura.** En MFID-03 y MFID-09 el hueco cierra
   solo y el español resultante es tan natural como el fiel. Ése era el atajo
   más caro y está bien cerrado en la muestra.
3. **La inclusividad se rinde bien donde importa.** «Como muy tarde a las
   once» / «hasta el miércoles 22 incluido» / «até 5 de junho → hasta el 5
   incluido»: el concepto que el §3 pone en el centro está entendido.
4. **MFID-20 y la doctrina de los nombres propios.** Traducir «comisaría» →
   `esquadra` y **no** traducir «calle Toledo» es exactamente la distinción que
   hay que enseñar, y la explicación la enuncia mejor que muchos manuales.
5. **La elipsis conservada de MFID-24** («só nas arrecadações») es trabajo fino
   de mediación: se mantiene la misma lectura y la misma vaguedad del original,
   que es lo difícil.
6. **El diseño es auditable.** Guardar las dos versiones del recado es lo que
   me ha permitido revisar esto en horas en vez de discutirlo. El fallo que he
   encontrado no está en lo que el diseño controla, sino justo en el hueco que
   deja: la calidad de lengua del recado fiel.
