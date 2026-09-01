# Banco verificado — `b12-borde-gramaticalidad` (C2)

**Sesión E2#14.** Tres pares mínimos **verificados contra el corpus** y
listos para el lote de E2#15. No se publican hoy porque el punto pide
doce ítems y sólo puedo defender seis: inventar los otros seis con el
contexto agotado es exactamente cómo murieron siete MAL en tres sesiones
seguidas.

## Por qué este punto es el único de C2 que admite juicios

El mapa formato↔punto lo clasifica como `trampa` —el español permite lo
que el portugués prohíbe, así que el calco suena bien en español y la
glosa cognada engaña en vez de ayudar—, y es el único de los ocho puntos
declarados de C2 que sale así. Los otros siete piden mediación,
transformación o cloze.

## La restricción que hay que respetar al montar el lote

Un lote de juicios hecho **sólo** de un punto `trampa` es imposible de
pasar por construcción: si todos los MAL son calcos, todas sus glosas son
español bien formado y el rasgo de la glosa acierta el 100 % con la regla
invertida «glosa buena ⇒ MAL».

Con pares mínimos hay una salida limpia y es el criterio con el que están
elegidos los tres de abajo: **los dos rellenos del par tienen que glosar
a español igual de bueno (o igual de malo)**. Entonces el rasgo vale lo
mismo en los dos miembros, aporta un acierto y un fallo, y queda neutro
por teorema.

## Los tres pares

### P-01 · duplicación del clítico dativo
- **esqueleto:** «O advogado {} ao director que a proposta seguia por correio registado.»
- **BIEN:** `disse` · **MAL:** `disse-lhe`
- **glosas:** «dijo al director» / «le dijo al director» — **las dos son
  español correcto** ⇒ el rasgo queda neutro.
- **rasgo juzgado:** el español duplica el clítico con un SN dativo
  explícito; el portugués europeo no.

### P-02 · la «a» personal
- **esqueleto:** «Fomos visitar {} teu avô ao lar, mas ele já estava a dormir.»
- **BIEN:** `o` · **MAL:** `ao`
- **glosas:** «el tu abuelo» / «al tu abuelo» — **las dos son español
  malo** ⇒ neutro.
- **rasgo juzgado:** el portugués no tiene «a» personal.

### P-03 · el posesivo tras adverbio de lugar
- **esqueleto:** «O carro dele ficou estacionado {} durante toda a tarde.»
- **BIEN:** `atrás do meu` · **MAL:** `atrás meu`
- **glosas:** «detrás del mío» / «detrás mío» — **las dos se usan en
  español** ⇒ neutro.
- **rasgo juzgado:** el español coloquial admite adverbio + posesivo; el
  portugués exige la preposición.

## La verificación, y por qué importa el método

Los tres greps **parecían tumbar los tres pares** y los tres eran falsos
positivos que sólo se ven leyendo la frase entera:

| lo que devolvió el grep | lo que dice la frase | veredicto |
|---|---|---|
| `dizia-lhe a inclausurada` · `deu-lhe a mão` · `perguntou-lhe a causa` | «a inclausurada» es el SUJETO; «a mão» y «a causa» son objetos directos. Ninguno es un dativo duplicado | P-01 **vive** |
| `ver a meu` · `ver a seu` | son `escre**ver a meu** primo Noronha` (Eça, *Os Maias* c03) y `escre**ver a seu** pae` (Camilo, c07): regência dativa de «escrever», no «a» personal | P-02 **vive** |
| `diante meu` | es `de hoje em **diante** · **meu** inimigo` (Camilo, c03): el grep cruzó dos constituyentes | P-03 **vive** |

Es la regla de la skill funcionando entera: **un grep da candidatos, no
veredictos.** Con el grep a secas habría retirado tres pares buenos.

## Lo que falta para el lote

Tres pares más con la misma propiedad de glosa neutra. Candidatos
descartados hoy, con su motivo, para no repetir el trabajo:

- **«mais caro que» / «do que»** — la glosa FLIPA («que yo pensaba» es
  buen español, «de lo que yo pensaba» también, pero el par mete señal) y
  además el comparativo con `que` suelto está demasiado extendido para
  un MAL inequívoco.
- **artículo ante nombre propio** («encontrei Ø João») — es
  `b2-art-com-nome`, punto de A2 ya declarado: sería reenseñanza, no
  cobertura de C2.
- **futuro do conjuntivo tras «se»** — es `b6-fut-subj-se`, y además el
  mapa lo clasifica `sin-equivalente`: pide transformación, no juicio.
- **infinitivo pessoal con sujeto expreso** — lo cubre el lote 11 v2 de
  esta misma sesión.
