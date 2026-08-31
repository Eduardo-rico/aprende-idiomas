# Lote 11 — C1, «se aprende ELECCIÓN» · dirigido por déficit

**Sesión E2#12, 2026-09-02.** Primer lote que ataca los puntos de **C1
que están a cero**, que son 761 de las 1.668 unidades de déficit y los
que marcan el reloj del proyecto.

| punto | antes | falta | tras el lote |
|---|---:|---:|---:|
| `b11-alternancia-infinitivo` | **0** | 12 | 12 |
| `b11-ser-estar-divergente` | **0** | 12 | 12 |

Los dos salen literalmente del currículo de C1, que dice lo que hay que
enseñar a este nivel: «aquí ya no se aprende morfología nueva, se aprende
**ELECCIÓN**. Alternancias que exigen criterio: infinitivo pessoal vs
conjuntivo vs infinitivo simples; […] 'ser'/'estar' en usos divergentes
del español».

**Por qué NO los conectores discursivos**, que el currículo nombra en la
misma línea y que era el candidato obvio: sus errores son de registro o
de matiz, no de gramaticalidad, y ésa es exactamente la clase que tumbó
la v1 del lote 10 — cinco MAL retirados porque la forma condenada estaba
atestiguada. Un juicio de gramaticalidad necesita veredictos inequívocos.
El punto queda declarado y a cero, esperando el formato que le convenga.

## El molde

24 ítems, **12 MAL / 12 BIEN**. Longitudes equilibradas por diseño: los
MAL llevan su propia coleta, porque el atajo de la longitud fue lo que
rompió el lote 10 (13 de 16) y ahora se mide en el preflight.

---

## Preflight — salida pegada (sin ella no se abre el round)

El primer intento salió con alternancia perfecta `MBMBMB…`, y **la
batería no lo vio** porque sólo tenía rasgos del TEXTO. Añadido el rasgo
de POSICIÓN, lo cazó al **24/24**. Reordenado a `MBBB…`, éste es el
resultado:

```
# Preflight — 2026-09-02-lote11-c1-eleccion.md

Ítems: **24** · BIEN 12 · MAL 12

## Molde

Patrón: `MBBBMMBMBMMBBMBBMMBMMBMB` · prefijo de 4: `MBBB` · racha máxima: 3 · desequilibrio: 0

## Atajos — acierto SOBRE N (24), nunca recall sobre los MAL

| rasgo | acierto | dirección | presente en | p |
|---|---:|---|---:|---:|
| lleva marcador temporal | **15/24** (63 %) | presente⇒BIEN | 9 | 0.154 |
| lleva una palabra visiblemente española | **15/24** (63 %) | presente⇒MAL | 3 | 0.154 |
| lleva clítico con guion (ênclise/mesóclise) | **14/24** (58 %) | presente⇒MAL | 2 | 0.271 |
| lleva preposición contraída (do/da/no/na/ao/à/pelo) | **14/24** (58 %) | presente⇒BIEN | 14 | 0.271 |
| más corta que la mediana (palabras) | **13/24** (54 %) | presente⇒BIEN | 3 | 0.419 |
| más corta que la mediana (caracteres) | **13/24** (54 %) | presente⇒MAL | 9 | 0.419 |
| posición par en el lote (alternancia mecánica) | **12/24** (50 %) | presente⇒BIEN | 12 | 0.581 |
| lleva una coma (frase con coleta) | **12/24** (50 %) | presente⇒BIEN | 16 | 0.581 |
| lleva verbo en primera persona | **12/24** (50 %) | presente⇒BIEN | 2 | 0.581 |
| lleva dos o más oraciones (punto o punto y coma interior) | **12/24** (50 %) | presente⇒BIEN | 0 | 0.581 |

## Virginidad — 24 candidatos contra 2431 publicados + entre sí (umbral 0.34)

- `GJ-05` ↔ `b7-ep-06` — 0.389 · comparten: arrumar, escritório
  > Passei a tarde ___ (arrumar) o escritório.
- `GJ-11` ↔ `2d3b8e62` — 0.359 · comparten: surpresa, festa
  > Elas vieram de surpresa para a festa.
- `GJ-15` ↔ `37b772b1` — 0.349 · comparten: fica, rua
  > O ___ fica na esquina da rua.
- `GJ-16` ↔ `72ae98a9` — 0.378 · comparten: aberta, porta
  > A porta ___ quarto está aberta.
- `GJ-18` ↔ `16ce6a34` — 0.368 · comparten: passada, semana
  > eu tive · Eu tive muito trabalho na semana passada.
- `GJ-23` ↔ `07d20060` — 0.391 · comparten: avó, domingo, minha
  > Eu lembro-me sempre ___ ligar à minha avó aos domingos.
- `GJ-23` ↔ `33844252` — 0.359 · comparten: sobrinha
  > Eu tenho dois ___ e três sobrinhas.

**7 pares fiables** + 2 contra ítems de texto ínfimo (score no fiable).

## Frases idénticas a algo publicado

Ninguna.

## Veredicto

Avisos (7), no bloquean:
- virginidad: GJ-05 ↔ b7-ep-06 a 0.389
- virginidad: GJ-11 ↔ 2d3b8e62 a 0.359
- virginidad: GJ-15 ↔ 37b772b1 a 0.349
- virginidad: GJ-16 ↔ 72ae98a9 a 0.378
- virginidad: GJ-18 ↔ 16ce6a34 a 0.368
- virginidad: GJ-23 ↔ 07d20060 a 0.391
- virginidad: GJ-23 ↔ 33844252 a 0.359

**Preflight limpio.** El round puede abrirse con esta salida pegada en el documento.
```

---

## A · `b11-alternancia-infinitivo` — 12

La regla que se enseña, en una línea: **sujeto propio y expreso ⇒
infinitivo pessoal; conjunción con sujeto distinto ⇒ conjuntivo; mismo
sujeto y sin conjunción ⇒ infinitivo simple.** Mezclar las tres es el
error, y es invisible para quien sólo tiene el español.

### GJ-01 · **MAL**
**sentence:** «Para os miúdos perceber o exercício, o professor explicou tudo outra vez.»
**repair:** «Para os miúdos perceberem o exercício, o professor explicou tudo outra vez.»
**explicación:** Con el sujeto expreso («os miúdos»), el infinitivo se
flexiona: «perceberem». Es la construcción que el español no tiene, y por
eso el hablante deja el infinitivo desnudo sin notar que falta algo.

### GJ-02 · **BIEN**
**sentence:** «Antes de saírem de casa, verifiquem se fecharam bem a torneira do gás.»
**explicación:** Preposición + infinitivo pessoal de 3.ª plural
(«saírem»), con el sujeto recuperable del imperativo «verifiquem». El
español resolvería con subjuntivo («antes de que salgan») y aquí no hace
falta conjunción ninguna.

### GJ-03 · **BIEN**
**sentence:** «É melhor esperarmos aqui dentro até a chuva passar de vez.»
**explicación:** Tras impersonal, infinitivo pessoal cuando el sujeto es
«nós»: «esperarmos». Y «até a chuva passar» lleva infinitivo simple
porque su sujeto («a chuva») es de 3.ª singular y no marca desinencia.

### GJ-04 · **BIEN**
**sentence:** «Trouxe os documentos para o senhor os assinar antes de ir embora.»
**explicación:** «Para o senhor assinar» es infinitivo pessoal con sujeto
expreso de 3.ª singular, donde la flexión coincide con el infinitivo
simple. Y el clítico va proclítico por estar dentro de la subordinada.

### GJ-05 · **MAL**
**sentence:** «Depois de eles saiu do escritório, ficámos a arrumar as caixas todas.»
**repair:** «Depois de eles saírem do escritório, ficámos a arrumar as caixas todas.»
**explicación:** «Eles» pide la forma flexionada «saírem», no la de 3.ª
singular. El error se oye poco pero se lee enseguida, y delata que el
sujeto se puso delante sin ajustar el verbo.

### GJ-06 · **MAL**
**sentence:** «É preciso que fazermos alguma coisa antes que seja tarde de mais.»
**repair:** «É preciso que façamos alguma coisa antes que seja tarde de mais.»
**explicación:** Tras «que», conjuntivo: «façamos». «Fazermos» es
infinitivo pessoal y no lleva conjunción delante — las dos construcciones
son buenas por separado («é preciso fazermos» / «é preciso que façamos»)
y lo que no existe es la mezcla.

### GJ-07 · **BIEN**
**sentence:** «Depois de eu ter falado com ela ao telefone, tudo ficou muito mais claro.»
**explicación:** Infinitivo pessoal compuesto con sujeto expreso de 1.ª
singular, donde la forma coincide con la simple. La construcción es
corriente en registro cuidado y el español la resuelve con «después de
que yo hablara».

### GJ-08 · **MAL**
**sentence:** «Sem eles saber o que se passou, é difícil pedir-lhes uma opinião.»
**repair:** «Sem eles saberem o que se passou, é difícil pedir-lhes uma opinião.»
**explicación:** Mismo caso que GJ-05, ahora con «sem»: el sujeto
«eles» obliga a «saberem». Que la frase se entienda igual es justo el
motivo de que el error fosilice.

### GJ-09 · **BIEN**
**sentence:** «Convém que a proposta seja entregue antes de sexta-feira ao meio-dia.»
**explicación:** Impersonal + «que» + conjuntivo: «seja entregue». Aquí
el infinitivo pessoal no cabe porque hay conjunción, que es justo la
diferencia que el punto enseña.

### GJ-10 · **MAL**
**sentence:** «Antes de que saíres de casa, deixa a chave debaixo do tapete da entrada.»
**repair:** «Antes de saíres de casa, deixa a chave debaixo do tapete da entrada.»
**explicación:** «Antes de» pide infinitivo; «antes que» pide conjuntivo.
«Antes de que» junta las dos y no es portugués. El español dice «antes de
que salgas» y de ahí sale el híbrido.

### GJ-11 · **MAL**
**sentence:** «Sem os miúdos souberem de nada, prepararam-lhes uma festa de anos surpresa.»
**repair:** «Sem os miúdos saberem de nada, prepararam-lhes uma festa de anos surpresa.»
**explicación:** «Souberem» es futuro do conjuntivo, y tras «sem» va el
infinitivo pessoal: «saberem». Las dos formas se parecen mucho y ésta es
la confusión más fina del punto, porque las dos existen.

### GJ-12 · **BIEN**
**sentence:** «Ao chegarmos ao cimo da serra, já não se via nada por causa do nevoeiro.»
**explicación:** «Ao + infinitivo pessoal» para la simultaneidad, con la
flexión de «nós». El español lo diría con gerundio («al llegar» o
«llegando»), y el portugués aquí no admite ninguno de los dos.

## B · `b11-ser-estar-divergente` — 12

Lo que se enseña: el portugués y el español **no reparten igual**. Los
eventos van con SER; la localización de cosas fijas admite ficar; el
estado resultante va con ESTAR aunque el español use ser.

### GJ-13 · **BIEN**
**sentence:** «O jantar de despedida é no restaurante do costume, lá para as oito.»
**explicación:** El mismo punto en positivo: el evento («o jantar») va con
SER aunque se hable de dónde ocurre. Si el sujeto fuera un objeto —«o
jantar está na mesa»— sería ESTAR, y ahí está la línea.

### GJ-14 · **MAL**
**sentence:** «A reunião com os investidores está às três da tarde na sala grande.»
**repair:** «A reunião com os investidores é às três da tarde na sala grande.»
**explicación:** Un evento **ocurre**, y el portugués lo dice con SER: «a
reunião é às três», «o casamento é no sábado». El español usa «es» para
la hora pero «está» para muchos otros casos, y el hablante generaliza mal.

### GJ-15 · **BIEN**
**sentence:** «A biblioteca fica ao fundo da rua, mesmo ao lado dos correios.»
**explicación:** La localización de un edificio va con **ficar** en
portugués europeo, más que con «ser» o «estar». El español no tiene ese
verbo en ese uso y por eso el hablante nunca lo produce solo.

### GJ-16 · **BIEN**
**sentence:** «A porta esteve aberta a noite toda e entrou frio pela casa dentro.»
**explicación:** Estado resultante con ESTAR, y en pretérito perfeito
porque el periodo está cerrado («a noite toda»). El español diría «estuvo
abierta» igual, así que aquí las dos lenguas coinciden — y conviene que
coincidan en algún ítem, o el alumno aprende que siempre difieren.

### GJ-17 · **MAL**
**sentence:** «Estou português, mas vivo em Espanha desde os dezoito anos.»
**repair:** «Sou português, mas vivo em Espanha desde os dezoito anos.»
**explicación:** Nacionalidad con SER, sin excepción, por muy temporal
que sea la situación. Es el ítem más elemental del punto y está aquí
porque el resto lo necesita como ancla.

### GJ-18 · **MAL**
**sentence:** «O António é doente desde a semana passada e não vai trabalhar.»
**repair:** «O António está doente desde a semana passada e não vai trabalhar.»
**explicación:** «Ser doente» es una condición permanente —una persona
enferma crónica—; el estado pasajero va con ESTAR. La frase lo delata
sola: «desde a semana passada» es un estado, no una definición.

### GJ-19 · **BIEN**
**sentence:** «Ela é professora de História, embora este ano esteja a dar Português.»
**explicación:** Profesión con SER aunque la situación sea temporal, y el
contraste con «estar a dar» —lo que hace ahora— en la misma frase. Es el
ítem que muestra la línea entera de un vistazo.

### GJ-20 · **MAL**
**sentence:** «O concerto está no Coliseu no próximo sábado, às nove e meia.»
**repair:** «O concerto é no Coliseu no próximo sábado, às nove e meia.»
**explicación:** Otro evento, ahora con lugar y fecha: sigue siendo SER.
Que el español diga «el concierto es en el Coliseo» debería ayudar, pero
el hablante duda justamente porque hay un sitio de por medio.

### GJ-21 · **MAL**
**sentence:** «Este café é frio, deve ter ficado na máquina desde a hora do almoço.»
**repair:** «Este café está frio, deve ter ficado na máquina desde a hora do almoço.»
**explicación:** «Ser frio» define una cualidad —un café que se sirve
frío—; el café que se ha enfriado va con ESTAR. La segunda mitad de la
frase da el contexto que hace inequívoca la elección.

### GJ-22 · **BIEN**
**sentence:** «A entrada é gratuita para os sócios, mas hoje está esgotada a lotação.»
**explicación:** SER para la característica del billete y ESTAR para el
estado de hoy, en la misma frase y con el mismo sujeto de fondo. Es el
contraste que el punto existe para fijar.

### GJ-23 · **MAL**
**sentence:** «A festa de anos da minha sobrinha está no domingo em casa dos avós.»
**repair:** «A festa de anos da minha sobrinha é no domingo em casa dos avós.»
**explicación:** El tercer evento del punto —reunión, concierto, fiesta—
porque es el uso que más se resiste. Si el sujeto se puede sustituir por
«tem lugar», va con SER.

### GJ-24 · **BIEN**
**sentence:** «O prédio é do século dezanove, mas está todo remodelado por dentro.»
**explicación:** SER para lo que el edificio ES —su época— y ESTAR para
cómo está ahora. Los dos verbos con el mismo sujeto en una frase, que es
la prueba de que el alumno tiene la distinción y no una regla mecánica.
