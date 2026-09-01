# Calibración de la familia B — criterio PRECOMPROMETIDO

**Escrito y commiteado ANTES de leer un solo ítem.** Ése es todo el valor
del documento: un criterio decidido después de ver los resultados no es un
criterio, es una racionalización. La Ola V lo hizo así el 2026-07-29 y por
eso su fracaso valió — el criterio era 0 ERROR y ≤3 AVISO sobre 120, salió
19 y 15, y la consagración automática se desactivó ese mismo día.

## Qué se decide

Si **el sello de variante puede otorgarse POR CONSTRUCCIÓN** a los 612
ítems de la familia B: producción de máquina (cloze derivado del paradigma,
mediación con rúbrica derivada, transformación, corrección) que pasó los
gates de su familia y un muestreo con freno, pero **sin lectura humana ítem
a ítem**.

Si pasa, además de sellar los 612, **las máquinas escriben el sello al
publicar**, que es lo que impide que esto se vuelva a acumular.
Si no pasa, la familia B va a colas de revisión manual como el corpus
viejo, y se dice.

## La muestra

**120 ítems**, elegidos por hash SHA-256 de su `id` y ordenados por ese
hash — determinista, reproducible y ajeno a cualquier criterio de
contenido. 120 y no 30: cero defectos en 30 sólo acota la tasa por debajo
del 9,5 % con 95 % de confianza; 120 la acotan por debajo del **2,5 %**, y
ésa es la diferencia entre «no vi nada» y «medí».

## El criterio, y no se toca después

- **ERROR** — el ítem es incorrecto como portugués europeo servido a un
  alumno: forma brasileña presentada como europea, frase agramatical,
  respuesta declarada que no es la buena, o explicación que enseña algo
  falso.
- **AVISO** — defendible pero discutible: registro dudoso, ejemplo pobre,
  ambigüedad que no invalida el ítem.

**Pasa si ERROR = 0 y AVISO ≤ 3.** Es el mismo listón de la Ola V, y se
aplica al resultado que salga.

## Qué NO decide

No decide que los 612 sean buenos como enseñanza — decide que **no meten
brasileñismos ni portugués roto en un curso europeo**, que es lo que el
campo `variantStatus` afirma. La calidad pedagógica la miden los gates de
cada familia y el muestreo con freno, que ya corrieron.

---

# RESULTADO de la primera calibración: **FALLA**

Leídos los 120. **3 ERROR y 3 AVISO**, contra un criterio de 0 y ≤3.
**El sello por construcción NO se otorga.**

## Los tres errores

1. **`tr19b-013`** — la pista dice «esdrújula» de *difícil / difíceis*, que
   son **llanas**. Es el nido que E2#3 documentó («mãe esdrújula», «décimo
   circunflejo») reapareciendo en producción NUEVA. Y el propio corpus se
   contradice: `aba830a5` dice, correctamente, «difícil — es paroxítona».
2. **`co21c-022`** — «Ele mesmo veio buscar as chaves ele próprio.» → «Ele
   próprio veio buscar as chaves.» El error real es la duplicación, así que
   quien escriba «Ele mesmo veio buscar as chaves» lo ha corregido y la
   tarjeta lo suspende: `alternatives` estaba vacío. Y la explicación vendía
   una preferencia («próprio» más natural que «mesmo») como si fuera regla.
3. **`b2c2-med-202`** — la fuente traía «A direção informa **que
   encerrar-se-ão** os serviços». La mesóclisis sólo cabe cuando nada atrae
   el clítico, y **«que» lo atrae**: la forma es «que se encerrarão». Se
   presentaba como formal válido y es agramatical.

## Los tres avisos

`co21c-025` (corregir una redundancia estilística como si fuera error),
`b2c2-med-l14-11` (afirma que el «tem» existencial es conversación normal
entre portugueses instruidos, que es discutible) y `cl16-064` («estar com
pressa», más brasileño que «ter pressa»).

## Lo que el fracaso vale

**2,5 % de error**, frente al **40-53 %** que midieron las ocho colas del
corpus viejo. La conclusión no es «B es como junio»: es que B está veinte
veces mejor y aun así no está en cero, que era el listón.

Y los tres errores son **CLASES, no instancias**, así que se barren con un
script en vez de con nueve colas humanas (`scripts/barrido-clases-b.ts`):

| clase | hallazgos en TODO el corpus |
|---|---|
| mesóclisis tras atractor de próclisis | **1** (el de la muestra) |
| glosas que nombran una clase de acentuación | 28, de las que **3 falsas**: `7d8a2c74` («Brasil… paroxítona» — es oxítona), `e6eae5d6` («ônibus… paroxítona, sin tilde» — es proparoxítona y lleva) y `f0ae3fd6` («águdo» por «agudo») |
| corrección con dos operaciones y sin alternativas | 18 en bruto → **6** tras filtrar contracciones, y las 6 son fusiones legítimas |

De las tres glosas falsas, dos ya estaban en cuarentena y **una se estaba
sirviendo** (`7d8a2c74`). Corregidas las dos servibles, con su audio
ElevenLabs regenerado.

---

# SEGUNDA calibración — criterio PRECOMPROMETIDO

Arreglados los tres errores, **volver a leer la misma muestra no probaría
nada**: sería enseñar al examen. La segunda calibración es un experimento
nuevo y se declara como tal ANTES de mirar.

- **Muestra**: los ítems **121 a 240** del mismo orden determinista —
  **disjunta** de la primera, sin un solo ítem repetido.
- **Criterio**: el mismo, **0 ERROR y ≤3 AVISO**. No se baja porque la
  primera fallara.
- **Qué prueba**: si quedan clases de defecto que la primera muestra no
  vio. Las tres encontradas ya están barridas sobre el corpus entero, así
  que un error nuevo aquí sería una clase nueva.
- **Si pasa**: se otorga el sello por construcción a los 612 y las máquinas
  lo escriben al publicar.
- **Si falla**: la familia B va a revisión manual como el corpus viejo, y
  se dice sin adornos.
