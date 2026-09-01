# Lote 11 v2 (cloze) — informe LINGÜÍSTICO

**Revisor:** lingüista adversarial PT-PT · **Fecha:** 2026-09-04 · **Fuente
leída:** `scripts/lotes/lote11v2-cloze.ts` (versión con paréntesis, la de
después del dry-run del publicador) y `docs/contenido/2026-09-04-lote11-v2-cloze.md`.

---

## Veredicto global: **NO**

Y conviene decir dónde está el «no», porque no está repartido:

- **Sección A (`b11-alternancia-infinitivo`, CL-01…CL-12): PUBLICA-CON-CORRECCIONES.**
  Las doce formas son correctas —las recalculé a mano, no me fié del
  conjugador—, las anclas de los seis primeros son de las honestas, y el bloque
  de conjuntivo (CL-07…CL-12) es lo mejor del lote: seis irregulares, ninguno
  atacable por concatenación. Tiene dos correcciones obligatorias y dos de
  redacción.
- **Sección B (`b11-ser-estar-divergente`, CL-13…CL-24): NO.** No es un problema
  de redacción ni de anclas sueltas: **el bloque no examina su punto.** Un
  hispanohablante que no sepa que existe `ficar` acierta los doce.

El documento del lote afirma que el cambio de formato desarma la familia de
atajos porque «un cloze no tiene etiqueta BIEN/MAL, así que no hay nada que
adivinar traduciendo: hay que producir la forma». La primera mitad es cierta y
está bien vista. **La segunda es falsa, y es justo la que sostiene la sección
B**: en un cloze de ser/estar *sí* hay algo que adivinar traduciendo, porque lo
que hay que producir es el verbo que el español ya elige por ti. El formato mató
el atajo de la BATERÍA y dejó vivo el atajo de TRANSFERENCIA — que es
exactamente el que un punto llamado «divergente» existe para derrotar.

**Los gates dan «Limpio».** Lo comprobé: `npx tsx scripts/lotes/lote11v2-cloze.ts`
sale con cero problemas. Todo lo que sigue es invisible desde ahí.

**Bloqueantes: 7** (lista cerrada al final).

---

# El hallazgo principal: la sección B se resuelve entera desde el español

Mapeo literal, lema a lema, sin ninguna gramática portuguesa:

| id | clave | el español dice | ¿mismo lema? |
|---|---|---|---|
| CL-13 | `é` | La cena de despedida **es** el jueves | sí |
| CL-14 | `é` | El concierto **es** en el Coliseo | sí |
| CL-15 | `é` | La fiesta **es** el domingo | sí |
| CL-16 | `está` | Antonio **está** enfermo | sí |
| CL-17 | `está` | La comida **está** fría | sí |
| CL-18 | `fica` | El tribunal **está** al lado | **no** — pero `está` es `alternatives` ⇒ acierta igual |
| CL-19 | `sou` | Yo **soy** portugués | sí |
| CL-20 | `é` | Ella **es** profesora | sí |
| CL-21 | `esteve` | La puerta **estuvo** abierta | sí |
| CL-22 | `é` | La entrada **es** gratuita | sí |
| CL-23 | `é` | El edificio **es** del siglo XIX | sí |
| CL-24 | `está` | ¿Cómo **está** el tiempo? | sí |

**12 de 12 aciertos por transferencia de lema.** Y once de doce por
transferencia también de la FORMA, porque los cognados son transparentes
(es→é, está→está, soy→sou). El único que pide trabajo morfológico de verdad es
CL-21, que exige el pretérito perfeito portugués (`esteve`, no *«estuve»*).

El punto se llama `b11-ser-estar-**divergente**`. La v1 murió por esto mismo
—«once de sus doce ítems coincidían»— y la v2 **cambió el formato y conservó
el contenido**, con lo cual el defecto viajó entero. Peor: la v1 al menos
penalizaba el `está` de CL-18; la v2 lo acepta, así que **el único ítem
divergente del bloque premia la respuesta española.**

El propio documento cita la lección del round de la v1: «diverge en pocos casos
y hay que ELEGIRLOS, no suponerlos». No se eligieron. Se reescribió el envoltorio.

### El paréntesis empeora esto, no lo arregla

Poner «(ser / estar / ficar)» convierte el ítem en una elección de tres. Un
alumno que nunca haya oído `ficar` reduce el menú a dos por descarte de lo
desconocido, y esos dos son exactamente sus dos verbos españoles. El paréntesis
no le da información nueva: le confirma que su intuición española cubre el
espacio de respuestas.

---

# Sección A · `b11-alternancia-infinitivo`

## Las doce formas, recalculadas a mano

No me fié del conjugador —el aviso del encargo era pertinente y `dir-lo-ão` es
un precedente serio—. Recalculé cada una contra el paradigma:

| id | construcción | clave | mi cálculo | ¿coincide? |
|---|---|---|---|---|
| CL-01 | inf. pessoal, *eles* | `apanharem` | apanhar + em | ✔ |
| CL-02 | inf. pessoal, *eles* | `saírem` | sair→**saí**rem (hiato a-í) | ✔ |
| CL-03 | inf. pessoal, *eles* | `darem` | dar + em | ✔ |
| CL-04 | inf. pessoal, *nós* | `assinarmos` | assinar + mos | ✔ |
| CL-05 | inf. pessoal, *eles* | `porem` | pôr→por- + em (cae el circunflejo) | ✔ |
| CL-06 | inf. pessoal, *eles* | `serem` | ser + em | ✔ |
| CL-07 | pres. conj., *vocês* | `façam` | fazer → faça, faças, **façam** | ✔ |
| CL-08 | pres. conj., 3.ª sg | `seja` | ser → **seja** | ✔ |
| CL-09 | pres. conj., *tu* | `tragas` | trazer → traga, **tragas** | ✔ |
| CL-10 | fut. conj., *tu* | `vires` | ver → vir, **vires**, vir, virmos | ✔ |
| CL-11 | fut. conj., *eles* | `quiserem` | querer → quiser, …, **quiserem** | ✔ |
| CL-12 | fut. conj., *nós* | `soubermos` | saber → souber, …, **soubermos** | ✔ |

**Doce de doce correctas. Ningún error morfológico en el lote.** Es el bloque
más sólido de las dos secciones y hay que decirlo antes de romper nada.

Verificaciones cruzadas que también salen bien:

- `vires` (fut. conj. de *ver*) frente a `veres` (inf. pessoal de *ver*): la
  separación que el comentario del código presume es real. Nota lateral: `vires`
  es homógrafo del inf. pessoal de *vir* («sem tu vires»), pero el paréntesis
  «(ver)» lo desactiva. Bien resuelto.
- CL-08: la persona declarada es `ele` y el sujeto es «a proposta», femenino
  singular. Concuerda.
- `seja entregue` con el participio corto irregular `entregue` es la forma
  europea correcta (no *«entregado»*). Bien.

## CL-05 · `porem`: **es un ítem justo, pero la trampa gráfica que teme el encargo no es la que hay**

La premisa del encargo está equivocada en un punto y conviene corregirla porque
cambia el diagnóstico:

- **`porem` NO es el presente do conjuntivo de *pôr*.** Ése es `ponham`
  (ponha, ponhas, ponha, ponhamos, ponham). Tampoco es el futuro do conjuntivo,
  que es `puserem`. **`porem` sólo puede ser el infinitivo pessoal de 3.ª
  plural de *pôr*** (y el de sus compuestos: *reporem*, *proporem*). No hay
  colisión de paradigma: el hueco está determinado.
- **La colisión con `porém` es real y está atestiguada incluso en imprenta.**
  Corpus: «quando viu **porem** o seu nome em letras grossas» (Eça, *Os Maias*
  c04 §62) — la conjunción impresa sin tilde, exactamente la grafía de la clave.
  Frente a 158 apariciones de `porém` bien acentuado. Pero el paréntesis
  «(pôr)» ya dice de qué lema se conjuga, así que un alumno que escriba «porém»
  no ha caído en una trampa: ha ignorado la pista.
- **El homógrafo peligroso es otro: `põem`.** Presente de indicativo de 3.ª
  plural de *pôr*. Un alumno que lea «para os senhores ___ (pôr) a assinatura»
  y no domine el infinitivo pessoal escribirá `põem` mucho antes que `porém`.
  Y es la producción interesante, porque delata justo el fallo que el punto
  examina. **No la añadas a `alternatives`** —sería agramatical ahí— pero
  merece estar en la explicación del ítem.

**Veredicto CL-05: PASA en morfología, CORRIGE en registro.** «pôr a
assinatura» choca con «os senhores»: el trato deferente pide `apor a
assinatura` (formal) o simplemente `assinar`. La colocación coloquial dentro de
una frase de registro notarial suena a ejercicio.

> **CORRIGE-ASÍ · CL-05**
> `sentence: 'Trouxe os documentos para os senhores ___ (pôr) tudo em ordem hoje mesmo.'`
> Clave, paréntesis y ancla no cambian; sólo se va la colocación forzada.

## Cuánto se resuelve sin entender nada (respuesta a la pregunta 2 del coordinador)

Lo medí, no lo estimé. Estrategia S1 = **«copia la cadena que está entre
paréntesis y pégale la desinencia del infinitivo pessoal según el número del
sujeto» (∅ / -es / ∅ / -mos / -em)**, cero gramática más allá de mirar si el
sujeto es plural:

```
CL-01  apanhar+em  = apanharem  = clave   ✔ S1 acierta
CL-02  sair+em     = sairem     ≠ saírem  ✗ (falla por la tilde)
CL-03  dar+em      = darem      = clave   ✔ S1 acierta
CL-04  assinar+mos = assinarmos = clave   ✔ S1 acierta
CL-05  pôr+em      = pôrem      ≠ porem   ✗ (falla por el circunflejo)
CL-06  ser+em      = serem      = clave   ✔ S1 acierta
CL-07…CL-12                               ✗ los seis

S1 acierta 4/12 del bloque A · 4/6 dentro del bloque de infinitivo pessoal
```

**La respuesta es: sí, el paréntesis regala el bloque de infinitivo pessoal
—cuatro de sus seis ítems— y no regala nada del bloque de conjuntivo.**

Y no tiene arreglo por sustitución de verbos, porque el infinitivo pessoal *es*
lema + desinencia por definición: es la conjugación más regular del portugués.
Sólo se le puede subir el precio con familias ortográficas (`-air`/`-uir` como
CL-02, `pôr` como CL-05), y ya hay dos de seis. Con seis ítems más de la misma
clase, S1 seguiría sacando 4/6.

Lo que sí falta es que la **elección** cueste algo. Ahora está señalizada por
una palabra de superficie —preposición ⇒ flexionado, «que» ⇒ conjuntivo,
«quando/se/assim que» ⇒ futuro do conjuntivo— y un alumno que haya memorizado
esa correspondencia no necesita entender nada. La forma de encarecerla es la
que el propio documento descartó demasiado pronto:

> El documento deja fuera el infinitivo SIMPLES «porque con sujeto plural “sem
> dizer nada” y “sem dizerem nada” son las dos correctas». **Eso sólo es cierto
> cuando el sujeto NO está expreso.** Con sujeto expreso —que es el caso de los
> seis ítems— el simple es agramatical, y con sujeto tácito y correferente con
> el principal el flexionado es el marcado. Un par mínimo *sin sujeto expreso /
> con sujeto expreso* sí es decidible y sí examina la regla, en vez de examinar
> la presencia de una preposición.

*(Recomendación pedagógica, no bloqueante lingüístico: la comparto porque es el
mismo diagnóstico que el bloqueante B5.)*

## Las anclas de A, una a una

Barridas contra el corpus con grep ancho y grafía antigua. **No encontré ni un
solo contraejemplo**: no hay en las 224 obras un sujeto plural expreso con
infinitivo sin flexionar tras preposición. Al contrario, la construcción está
viva y con la flexión puesta:

- «**sem as lagrimas poderem** rebentar» (Teófilo Braga, *Contos Phantasticos /
  As azas brancas* §69) — prep. + SN sujeto + flexionado.
- «**por serem esses**, para a gente bem-nascida, dias de penitencia» (Eça, *A
  Cidade e as Serras* c07 §1).
- «essa espiritualização era fácil ao José Matias, que (**sem nós
  desconfiarmos**) nascera…» (Eça, *José Matias* §9).
- «para as abelhas **tocarem** os nectarios» (Teófilo Braga, *As azas brancas* §6).
- «quando **nos casarmos**» (Eça, *Os Maias* c15 §110); «quando **nos
  reunirmos** de novo» (*Amaro* c20 §37).

El único hit que parecía contraejemplo —«**sem o elle sentir**, os bichos todos
da destruição» (Garrett, *Viagens na Minha Terra* c17 §32)— no lo es: el sujeto
es singular y el infinitivo pessoal de 3.ª singular coincide con el simple.

Anclas que **no** hacen el trabajo que declaran:

- **CL-11, `Se eles`** → BLOQUEANTE menor. «**Se eles querem vir connosco no
  domingo, ainda há lugar no carro**» es portugués correcto y corriente: `se` +
  presente de indicativo es la condicional real, y la apódosis está en presente
  («ainda há»). Lo que fuerza el futuro do conjuntivo no es «Se eles» sino la
  hipoteticidad, y la frase no la marca. La pista en español decía «(futuro)»,
  pero **la pista en español ya no se renderiza**: sólo se ve «(querer)».
  > **CORRIGE-ASÍ · CL-11**
  > `sentence: 'Se um dia eles ___ (querer) vir connosco, ainda há lugar no carro.'`
  > `ancla: 'Se um dia eles'`
  > «Se um dia eles **querem** vir» es agramatical; el futuro do conjuntivo pasa
  > a ser obligatorio en vez de preferible.
- **CL-12, `Assim que nós`** → PASA con nota. «Assim que sabemos alguma coisa de
  concreto, avisamos toda a gente» sólo se sostiene en lectura habitual, y
  «alguma coisa **de concreto**» la bloquea razonablemente. No lo bloqueo, pero
  es el segundo más flojo del bloque.
- **CL-10, `Quando tu`** → PASA. El imperativo «dá-lhe» fija la lectura futura;
  «Quando tu vês o teu irmão, dá-lhe os parabéns» no es idiomático.
- **CL-06, `os alunos`** → PASA, con la observación de que aquí el disparador no
  es una preposición sino un predicado impersonal («É difícil»), así que el
  ancla declarada es la mitad del mecanismo. No es falsa; es incompleta.

## CL-06 · una corrección de redacción

«É difícil os alunos serem todos pontuais **logo à primeira aula**.» La
construcción es correcta (`É difícil` + oración de infinitivo con sujeto
expreso ⇒ flexionado), pero «pontuais **à** primeira aula» es forzado: en
portugués europeo se es pontual *en* un sitio, y «logo à primeira» es una
locución que aquí se cruza con el complemento.

> **CORRIGE-ASÍ · CL-06**
> `sentence: 'É difícil os alunos ___ (ser) todos pontuais logo na primeira aula.'`
> Clave `serem`, ancla `os alunos`, sin más cambios.

---

# Sección B · `b11-ser-estar-divergente`

## Lo primero: qué dice el corpus sobre localización, porque decide CL-18

Barrido ancho de `ser`/`estar`/`ficar` + locativo sobre las 224 obras. El
reparto es limpísimo y nadie lo había separado así:

- **`ficar`** — inmuebles y accidentes fijos: «A quinta **fica** nas serras»
  (Eça, *Civilização* §34); «Essa casa… **ficava** ao lado e na sombra da igreja
  de Nossa Senhora do Pilar» (Eça, *O Defunto* §2); «o portal negro **ficava**
  em frente ao prédio novo» (*José Matias* §37); «como a padaria **ficava**
  defronte» (*Os Maias* c05 §10); «A nossa fazenda **fica** do outro lado»
  (*Amaro* c07 §142). **12 hits con locativo inequívoco** (la red ancha da 36,
  pero mete dentro usos no locativos: «fica para a vindima», «ficava em
  duvida», «ficava em chinelas» — los descarté a mano).
- **`ser`** — también inmuebles, direcciones y estancias: «**A casa era na rua
  das Sousas**, d'um andar, muito velha» (Eça, *O Crime do Padre Amaro* c08
  §64); «**O quarto do pequeno era ao fundo do corredor**» (*Os Maias* c12
  §207); «**O n.º 3 era no fundo do corredor**» (*Singularidades de uma Rapariga
  Loura* §23); «o quartito da pobre Tótó **era ao pé**» (*Amaro* c16 §64).
- **`estar`** — **ni una sola vez con un edificio como sujeto.** Sus sujetos son
  muebles y personas: «O seu beliche **está** ao pé do meu» (*Amor de Perdição*
  c20 §42); «A mesa **estava** ao lado da chaminé» (*Os Maias* c05 §0); «o
  espelho **estava** defronte» (*Amaro* c06 §111); «Damaso, que **estava** ao
  lado» (*Os Maias* c07 §8); «O homem **estava** defronte de mim»
  (*Singularidades* §5).

Y el propio catálogo publica `ser` locativo como correcto: `b2c2-gj-l5-19`
**«A morada dela é na Rua Augusta.»**, `verdict: true`.

**Conclusión: la lista `alternatives: ['está']` de CL-18 está exactamente al
revés.** Acepta la opción que el corpus europeo nunca usa con un edificio y
rechaza la que usa cuatro veces. Que Ciberdúvidas (*O valor dos verbos «estar» e
«ficar»*, Miguel Moiteiro Marques, 8-III-2012) declare `estar` y `ficar`
intercambiables para localizar edificios no rescata la asimetría: si se acepta
`está` por autoridad, hay que aceptar `é` por autoridad **y** por corpus **y**
por el propio catálogo.

## CL-16 · **es GJ-18 repuesto, con el mismo defecto que lo mató**

La v1 mató GJ-18 —«O António é doente desde a semana passada e não vai
trabalhar»— y dejó escrito el criterio con el que lo mató:

> «Un adjunto temporal **no** hace inequívoca la elección; una cláusula causal
> sí. […] la coleta “e não vai trabalhar” no la excluye: un inválido tampoco va
> a trabajar.»
> — `2026-09-03-lote11-informe-linguistico.md`, GJ-18

CL-16 es «O António ___ (ser / estar / ficar) doente e hoje não vem, mas na
segunda já cá anda», y su ancla declarada es «na segunda já cá anda».
**Aplicando el criterio de la propia v1: es una CONSECUENCIA, no una CAUSA.** Un
enfermizo crónico también falta hoy y también aparece el lunes. La coleta cambió
de palabras y no de forma lógica.

Y `ser doente` sigue vivo, como la v1 documentó y yo confirmé de nuevo:

- «--**Mas a mamã não é doente?** --Oh, não! Madame era muito forte» (Eça, *Os
  Maias* c09 §102).
- «**Ser doente é bom**, mas para quem é rico e tem vagares!» (Eça, *O Crime do
  Padre Amaro* c13 §89).
- «o Matias **era um doente**, atacado de hiper-espiritualismo» (Eça, *José
  Matias* §23).

Añádase que el paréntesis ahora ofrece explícitamente `ficar`, y **`ficou
doente` es impecable**: «O António ficou doente e hoje não vem, mas na segunda
já cá anda» es la frase que más nativos producirían. (El corpus decimonónico no
la trae —cero hits de `ficar doente`— pero `ficar` + adjetivo/participio como
cambio de estado tiene **41 apariciones con lista cerrada de adjetivos**:
«ficou calado», «ficaram muito contentes», «ficou triste», «ficou coberto de
empôlas», «ficaram hospedados». La construcción es la misma.)

**Veredicto CL-16: MUERE.** Tres lecturas correctas (`está`, `ficou`, y `é` en
lectura crónica) y sólo una aceptada. No propongo reposición porque, aunque se
arreglase, el ítem seguiría coincidiendo con el español y no serviría al punto.

## CL-13 / CL-14 / CL-15 · los tres «evento ⇒ ser»

**Respuesta directa a la pregunta 3 del encargo: no, ninguno admite `está`.** Un
evento no «está» en una fecha; el sujeto mismo lo excluye y las tres anclas
(«O jantar de despedida», «O concerto», «A festa») son de las honestas. Ahí el
lote está bien. El corpus lo respalda por el lado esperado: los eventos van con
`ser` («O enterro **foi** ao outro dia, á uma hora», *Os Maias* c17 §402).

Lo que sí admiten es otra cosa:

- **`será` en los tres.** «O concerto **será** no Coliseu no próximo sábado» es
  correcto y es la forma normal en registro escrito/anuncio, que es justo el
  registro de las tres frases. Un alumno que escriba `será` ha demostrado
  exactamente lo que el ítem examina —que el evento va con *ser*— y se le marca
  mal. Es injusticia de corrección, no error lingüístico.
- **`fica` en CL-13, con menos fuerza.** «Então **fica** na quinta-feira» es la
  fórmula europea corriente para dar por cerrada una fecha, y la coleta «num
  sítio **ainda por combinar**» pone la frase justo en el marco de «estamos
  combinando», que es donde ese `ficar` vive. No lo doy por seguro, pero no lo
  puedo excluir.

> **CORRIGE-ASÍ · CL-13** `alternatives: ['será', 'fica']`
> **CORRIGE-ASÍ · CL-14** `alternatives: ['será']`
> **CORRIGE-ASÍ · CL-15** `alternatives: ['será']`

## CL-17 · el ancla es de las buenas, pero faltan dos respuestas

«ninguém se lembrou de a tapar quando saímos» **es** una cláusula causal —la de
la forma que la v1 declaró suficiente— y excluye `é fria` (cualidad) sin
discusión. Bien construida. Y «de **a tapar**» es próclisis europea impecable,
donde Brasil pondría «de tapá-la». Es de las mejores frases del lote.

Pero admite dos respuestas más:

- **`ficou`**: «A comida **ficou** fria» es la manera más idiomática de decir
  «se ha enfriado», que es literalmente lo que dice la glosa del ítem.
- **`estava`**: los dos verbos del contexto están en pasado («lembrou»,
  «saímos»), así que la lectura descriptiva pasada es coherente y natural.

> **CORRIGE-ASÍ · CL-17** `alternatives: ['ficou', 'estava']`

## CL-18 · **MUERE como ítem del punto**

Respuesta directa a la pregunta 2 del encargo —«¿basta con aceptar las dos, o el
ítem se queda sin enseñar nada?»: **se queda sin enseñar nada, y encima acepta
mal.**

- Aceptar `está` y rechazar `é` invierte lo que dice el corpus (ver arriba) y
  contradice `b2c2-gj-l5-19`, publicado como correcto.
- Aceptar los tres deja un hueco con tres respuestas, es decir, ninguna pregunta.
- Aceptar sólo `fica` es defendible en preferencia pero indefendible en
  corrección: Ciberdúvidas autoriza `estar` expresamente para este caso.

`ficar` locativo es una **preferencia de idiomaticidad**, no una regla de
gramática, y una preferencia no se puede examinar con un cloze de clave única.
Es el punto más divergente de los doce y por eso duele, pero **el formato
elegido no lo sabe medir**. El molde que sí lo mide es el de *elección entre
alternativas todas correctas*, con la pregunta «¿cuál suena a portugués?» — que
es otro tipo de ejercicio, no un `fill_blank`.

Si aun así se publica tal cual, el mínimo es `alternatives: ['está', 'é']`.

## CL-21 · «esteve» no es la única

Respuesta directa a la pregunta 5 del encargo:

- **`ficou`: SÍ, y es la más idiomática.** «A porta **ficou** aberta a noite
  toda» es lo que se dice; `ficar` es el verbo del estado que se prolonga por
  omisión. Corpus, la construcción exacta: «as portas da Judiaria **ficaram
  abertas**» (Teófilo Braga, *A Rosa de Saron* §30).
- **`estava`: sí, defendible.** Corpus: «A porta envidraçada **estava aberta**»
  (Eça, *A Cidade e as Serras* c14 §66); «só uma janella **estava aberta**»
  (*Os Maias* c08 §117). Con «a noite toda» el perfeito es preferible, pero la
  lectura descriptiva no es agramatical.
- **`foi`: no.** «A porta foi aberta» es pasiva de acción, otro significado.
  Bien excluida.

Y una corrección de orden: **«toda a noite», no «a noite toda»**. En el corpus,
«toda a noite» **29 hits** frente a «a noite toda» **2** (ambos de Teófilo
Braga, así que no es brasileñismo — es minoritario). El orden mayoritario en
portugués europeo es el del cuantificador delante.

> **CORRIGE-ASÍ · CL-21**
> `sentence: 'A porta ___ (ser / estar / ficar) aberta toda a noite e entrou frio pela casa dentro.'`
> `ancla: 'toda a noite'` · `alternatives: ['ficou', 'estava']`

## CL-24 · admite `é`

Respuesta directa a la pregunta 6 del encargo: **sí, cabe `é`.** «Como **é** o
tempo aí no Porto?» es una pregunta perfectamente portuguesa — por el clima, no
por el día de hoy. La ancla declarada, «Aqui o céu não abre há uma semana», está
en la *segunda* oración y describe el sitio del hablante: hace saliente la
lectura de hoy, pero no cierra la otra. Es el mismo defecto de forma lógica que
CL-16: contraste, no restricción.

> **CORRIGE-ASÍ · CL-24**
> `sentence: 'Como ___ (ser / estar / ficar) o tempo aí no Porto neste momento? Aqui o céu não abre há uma semana.'`
> `ancla: 'neste momento'`
> Con «neste momento» la lectura de clima queda excluida y `está` es obligatoria.

## Los cinco restantes

- **CL-19 (`sou`)** — lingüísticamente PASA sin reservas: la nacionalidad va con
  `ser` y «Eu estou português» no existe. Pero es contenido de A1 dentro de un
  punto C1, y coincide con el español al cien por cien.
- **CL-20 (`é`)** — PASA. Además es la mejor frase europea del bloque: «embora
  este ano **esteja a dar** Português» trae `estar a` + infinitivo y el
  conjuntivo de «embora» de regalo. Mismo reparo de nivel.
- **CL-22 (`é`)** — PASA la clave, pero **el ancla declarada apunta al revés**:
  «gratuita para os sócios» no excluye nada; lo que excluye `estar` es que
  *gratuito* es propiedad del billete. Y «durante todo o mês de agosto» es
  precisamente el tipo de delimitación temporal que la regla ingenua asocia a
  `estar` — o sea, el contexto empuja hacia la respuesta equivocada y lo que
  salva el ítem es que «está gratuita» no es idiomático en Portugal. Añádase
  que `ser` admite delimitación temporal sin problema: «**Era orfão desde
  1832**» (Camilo, *Novelas do Minho / Gracejos que Matam* §36), «era irrisorio
  **desde o duello**» (íd. §193). Reescribiría el ancla, no la frase. Riesgo
  bajo y no bloqueante: **`fica gratuita`** («pasa a ser gratis») es marginal
  pero no imposible en registro de anuncio.
- **CL-23 (`é`)** — PASA limpio. Ancla honesta («do século dezanove» = origen,
  incompatible con `estar`), y el `está` de la segunda mitad da el contraste
  dentro de la misma frase. Es el mejor ítem de la sección B. También coincide
  con el español.

---

# Naturalidad y PT-PT (pregunta 5 del encargo)

**Ningún brasileñismo.** Es más: el lote está marcado europeo con acierto y en
sitios donde es fácil resbalar. Lo que encontré, todo bien:

`comboio` · `apanhar o comboio` · `sítio` · `festa de anos` (BR: *festa de
aniversário*) · `cá anda` · `connosco` · `deixámos`/`mudámos` con la tilde
europea · `dezanove` (BR: *dezenove*) · `andar` = piso · `prédio` · `temos de
sair` (no *temos que*) · `os senhores` como deferencia en 3.ª persona ·
`vocês` como plural neutro, sin marcar · `dá-lhe` con ênclise correcta en
imperativo · `de a tapar` con próclisis europea (BR: *de tapá-la*) · `estar a
dar` · `mesmo ao lado` · `aí no Porto` · `o céu não abre` · `pela casa dentro` ·
`num sítio ainda por combinar` · `alguma coisa de concreto` · `agosto` en
minúscula (AO90) · `meio-dia` y `sexta-feira` con guion (AO90).

Suenan a ejercicio, no a portugués:

1. **CL-06** «pontuais **logo à primeira aula**» → `logo na primeira aula`
   (corrección propuesta arriba).
2. **CL-05** «os senhores ___ **a assinatura**» → choque de registro
   (corrección propuesta arriba).
3. **CL-21** «a noite toda» → `toda a noite` (29 : 2 en el corpus).
4. **CL-17** coma entre las dos oraciones donde el europeo escrito pondría punto
   y coma o «que». Menor, no lo bloqueo.
5. **CL-04** y **CL-09**: el sujeto expreso («nós», «tu») es redundante en
   portugués y sólo está para que el ejercicio se pueda resolver. Es un coste
   aceptado del formato, no un error — lo anoto para que no se acumule.

---

# Sobre la notación «(ser / estar / ficar)» — respuesta a la pregunta 1 del coordinador

## ¿Trivializa el ítem?

**No lo trivializa; hace algo peor: lo vuelve legible desde el español, y encima
choca con la convención publicada.**

**(a) No trivializa.** Dar el trío no quita nada, porque el trío *es* el punto.
Dar sólo «(ser)» sería peor, y el coordinador ya lo ve bien: mataría la
elección, que es lo único que el ítem examina. La intuición es correcta.

**(b) Pero el nivel es bajo por otra razón.** Con el trío, el ítem es
funcionalmente una opción múltiple de tres con conjugación encima. Y la
conjugación casi no pesa: **diez de las doce claves son la 3.ª persona del
singular del presente** (`é`, `está`, `fica`). Sólo CL-19 (`sou`) y CL-21
(`esteve`) piden algo más, y CL-19 es trivial. El resultado es un ítem de
adivinanza a 1/3 con corrección todo-o-nada.

> **Recomendación:** conservar el trío, y subir el precio por el lado del
> tiempo/persona, que es donde queda margen sin tocar el punto. Si de los doce,
> cinco o seis exigen una forma que no sea la 3.ª singular del presente
> —imperfeito, pretérito perfeito, conjuntivo, 1.ª plural—, el que adivina el
> lema todavía tiene que producir la forma, y el 1/3 deja de ser un 1/3.

**(c) Y hay un problema de notación que sí es bloqueante.** Revisé los 417
`fill_blank` publicados: **123 llevan paréntesis** (73 justo detrás del hueco,
54 al final — la colocación del lote es la mayoritaria, bien). De esos 123,
**cinco tienen varios lemas entre paréntesis, y los cinco son de VARIOS huecos,
un lema por hueco y en orden**:

```
«Eu ___ que ela está doente. Mas ___ que ___ mesmo. (achar / duvidar / estar)»
   → ['acho', 'duvido', 'esteja']
«___ ele ___ aqui amanhã. (talvez / estar)»  → ['talvez', 'esteja']
```

**No hay un solo precedente de un paréntesis que ofrezca un menú de lemas para
UN hueco.** Un alumno que haya hecho los otros 123 ha aprendido «tantos lemas
como huecos, en orden» y va a leer «(ser / estar / ficar)» con un solo hueco
como un error del ejercicio. La convención hay que declararla, no reutilizarla
al revés.

> **CORRIGE-ASÍ · CL-13…CL-24**
> Cambiar el paréntesis a una forma que se lea como menú y no como lista
> posicional: `(ser, estar ou ficar?)`. El signo de interrogación y la
> conjunción «ou» son suficientes para romper la lectura posicional, y no
> alteran ni la clave ni el ancla ni ningún gate.

---

# Dos agujeros de los gates que este lote deja pasar

**1. El gate de reparto cuenta FORMAS; el paréntesis pone a elegir LEMAS.**

```
Sección B por FORMA (lo que mide el gate):  é:6  está:3  fica:1  sou:1  esteve:1
   → dominante 6/12 = 50,0 %  ⇒ NO dispara (umbral > 50 %)
Sección B por LEMA (lo que decide el alumno): ser:7  estar:4  ficar:1
   → dominante 7/12 = 58,3 %  ⇒ HABRÍA disparado
```

El gate pasa por un solo ítem y midiendo la unidad equivocada. Desde que la
pista enumera lemas, la unidad de decisión del alumno es el lema: el gate debe
agrupar `é`+`sou` (y `está`+`esteve`) antes de contar.

**2. El gate del ancla comprueba presencia, no exclusión — y eso es sabido, pero
conviene dejar escrito qué anclas fallan** (para que la próxima revisión no las
dé por buenas): `Se eles` (CL-11), `na segunda já cá anda` (CL-16),
`num prédio dos anos trinta` (CL-18, decorativa: no excluye nada por diseño),
`gratuita para os sócios` (CL-22, apunta al revés), `o céu não abre há uma
semana` (CL-24). Las diecinueve restantes hacen el trabajo que declaran.

---

# Qué está bien (sección obligatoria)

1. **Las doce formas de la sección A son correctas, recalculadas a mano.** Cero
   errores morfológicos en todo el lote. Es lo primero que fui a romper y no se
   rompió.
2. **El bloque de conjuntivo (CL-07…CL-12) es contenido C1 de verdad.** Seis
   irregulares —`façam`, `seja`, `tragas`, `vires`, `quiserem`, `soubermos`—,
   ninguno alcanzable por concatenación ni por transferencia del español, y con
   el futuro do conjuntivo, que es donde el hispanohablante se queda sin
   paradigma. Si el lote se salva por algún sitio, es por aquí.
3. **El cambio de `chegar` a `ver` en CL-10 es un acierto real.** `chegares`
   es ambiguo entre las dos construcciones y `vires`/`veres` las separa. Está
   bien razonado y bien ejecutado.
4. **El arreglo de `saírem` en el conjugador es correcto** y la familia
   `-air`/`-uir` está bien acotada (la `u` muda de `qu`/`gu` excluida). Lo
   verifiqué contra el paradigma: `saír-` sólo en `tu` y `eles`, que son las dos
   personas con hiato.
5. **CL-17 y CL-23 son los dos ítems mejor construidos de la sección B.** El
   primero tiene la única cláusula causal genuina del bloque (la forma lógica
   que la v1 dejó escrita como suficiente) y una próclisis europea de manual; el
   segundo pone el contraste `é` / `está` dentro de la misma frase, que es la
   manera honesta de enseñar la oposición.
6. **El portugués es europeo sin fisuras**, y no por defecto: hay veinte marcas
   activas (`comboio`, `festa de anos`, `dezanove`, `connosco`, `de a tapar`,
   `estar a dar`, `pela casa dentro`, `cá anda`) y ningún calco brasileño.
7. **El tratamento es correcto en los tres registros**: `tu` informal,
   `vocês` plural sin marcar, y `os senhores` en 3.ª persona para la
   deferencia — que es la forma europea y la que casi todo el material de PLE
   se salta.
8. **El diagnóstico del `hintEs` fue certero.** Confirmé en el código: la
   `FillBlankCard` renderiza `data.sentence` literal y no pinta ningún otro
   campo, y `aciertaHueco` compara contra `answer` y `alternatives` y nada más.
   Sin el paréntesis, la mitad del lote era inresoluble. El dry-run se ganó su
   sueldo.

---

# Bloqueantes (lista cerrada)

| # | id(s) | qué es | qué hay que hacer |
|---|---|---|---|
| **B1** | CL-13…CL-24 | **El bloque se resuelve entero por transferencia del español: 12/12 lemas.** El punto se llama «divergente» y sólo uno diverge — y ése acepta la respuesta española. Es el bloqueante que mató la v1, intacto: cambió el formato, no el contenido. | Rehacer la sección B eligiendo divergencias reales. Candidatas verificadas en corpus: **`ficar` + adjetivo como cambio de estado** (41 hits con lista cerrada: «ficou calado», «ficou triste», «ficaram contentes»; el español usa *ponerse/quedarse*, sin cognado); **`ser vivo`** («emquanto eu **fôr vivo**», Eça *Amaro* c13 §72; «se ainda **era vivo** o abbade», Camilo *Gracejos* §399 — el español exige *estar vivo*); **`ser casado`** (europeo frente al *está casado* español). |
| **B2** | CL-16 | **Reposición de GJ-18 con el defecto que lo mató.** La segunda mitad es consecuencia, no causa, y por el criterio escrito por la propia v1 no excluye `é doente` («Mas a mamã não é doente?», Eça *Os Maias* c09 §102). Además admite `ficou`. | **MUERE.** No reponer: aunque se arreglase, seguiría coincidiendo con el español. |
| **B3** | CL-16, CL-17, CL-21, CL-24 | **Cuatro huecos admiten otra respuesta correcta que la clave marca mal.** `ficou` en 16/17/21, `estava` en 17/21, `é` (lectura de clima) en 24. | CL-16 muere; CL-17 `alternatives: ['ficou','estava']`; CL-21 reescritura con «toda a noite» + `alternatives: ['ficou','estava']`; CL-24 añadir «neste momento». Textos exactos en el cuerpo del informe. |
| **B4** | CL-18 | **La lista de alternativas está invertida.** Acepta `está` —cero apariciones con edificio en 224 obras— y rechaza `é`, que el corpus usa cuatro veces («A casa **era** na rua das Sousas», *Amaro* c08 §64) y que el propio catálogo publica como correcto (`b2c2-gj-l5-19`). Y con las tres aceptadas el ítem no pregunta nada. | **MUERE como ítem de cloze.** `ficar` locativo es preferencia de idiomaticidad y no se puede examinar con clave única. Si se publica igual: `alternatives: ['está','é']`, mínimo indispensable. |
| **B5** | CL-01…CL-06 | **El bloque de infinitivo pessoal no discrimina: 4 de 6 se resuelven pegando el paréntesis + desinencia**, con cero gramática (medido, no estimado). Los otros dos fallan sólo por una tilde. | Reconstruir el bloque con pares mínimos *sujeto tácito / sujeto expreso*, que sí examinan la regla. El argumento del documento para excluirlos («las dos son correctas») sólo vale sin sujeto expreso. |
| **B6** | CL-13…CL-24 | **La notación «(ser / estar / ficar)» no tiene precedente y contradice la convención publicada**: de los 123 `fill_blank` con paréntesis, los 5 con varios lemas son de varios huecos, un lema por hueco en orden. Con un solo hueco se lee como error. | Cambiar a `(ser, estar ou ficar?)` en los doce. No toca claves, anclas ni gates. |
| **B7** | gate de reparto | **Cuenta formas donde el alumno elige lemas.** Por forma, `é` = 6/12 = 50,0 % y no dispara por un ítem; por lema, `ser` = 7/12 = 58,3 % y habría disparado. | Agrupar `é`+`sou` y `está`+`esteve` antes de contar, siempre que la pista enumere lemas. |

**Correcciones no bloqueantes:** CL-05 (registro: «pôr tudo em ordem» en lugar
de «pôr a assinatura»), CL-06 («logo **na** primeira aula»), CL-11 (ancla
insuficiente: «Se **um dia** eles»), CL-13/14/15 (`alternatives: ['será']`),
CL-22 (reescribir el ancla, no la frase), CL-12 (anotar que el ancla es de las
flojas).
