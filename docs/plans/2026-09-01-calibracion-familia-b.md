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
