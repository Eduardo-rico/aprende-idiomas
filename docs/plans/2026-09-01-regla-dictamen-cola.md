# Regla de decisión para la cola de dictamen (414 ítems)

**Escrita ANTES de leer el primer ítem**, y por el mismo motivo que el
criterio de la calibración: si se decide ítem a ítem mientras se lee, se
decide distinto en el 30 y en el 300, y el resultado no es un dictamen
sino una deriva.

Las ocho colas anteriores midieron **40-53 % de error**. Sobre 414, eso
son unos **180 ítems rotos**, así que la bifurcación no es una excepción:
es la mitad del trabajo.

## Las tres salidas, y sólo tres

**1 · ARREGLO BARATO → se corrige, y el ítem se sella.**
Cabe aquí cuando el defecto se cierra sin tocar el marco: un acento, una
posición de clítico, una palabra cambiada, una glosa falsa, un artículo
que falta, una alternativa sin declarar. Condición operativa: **el punto
que el ítem dice enseñar sigue siendo el que enseña, y la frase sobrevive**.
Se corrige como en las colas 1-8, se regenera el audio si el texto cambió,
y se escribe el sello con el motivo.

**2 · ARREGLO CARO → cuarentena, y la máquina produce el reemplazo.**
Cabe aquí cuando hay que rehacer la frase entera, cuando el punto
declarado no es el que el ítem examina, cuando el enunciado no determina
la respuesta, o cuando el ejercicio no mide lo que su tipo promete.
**Producir cuesta ~100 unidades por sesión con gates y sello automático;
rehacer a mano un ítem de junio cuesta más y da un ítem peor.** A
cuarentena con el motivo escrito y el punto que dejaba cubierto.

**3 · DUDA → se queda como está, con la duda escrita.**
Ni se corrige ni se cuarentena: se anota qué habría que comprobar. Las
colas anteriores cerraron entre 5 y 16 dudas cada una; forzarlas a una de
las otras dos salidas es lo que fabrica correcciones falsas — «corregir
algo que no está mal» ya ha mordido tres veces en esta ola.

## Lo que va a pasar con el número de producción, dicho antes

**Los 101 a producir van a CRECER**, porque cada ítem que salga por la
salida 2 reabre el déficit de su punto. No es un problema —es la máquina
buena sustituyendo material malo—, pero **el número tiene que subir a la
vista**: se re-corre `npx tsx scripts/cola-dictamen.ts` al cerrar cada
tramo y se pega la línea «quedan N unidades que ningún ítem viejo cubre».
Un número que sube en silencio es lo que esta ola lleva un mes cazando.

## Cadencia

414 es más de 200, así que van **dos sesiones**, en el orden que ya emite
`cola-dictamen.ts` — por cuánto déficit desbloquea cada ítem, así que si un
tramo se corta, lo leído es lo que más cierra. **No se acelera**: es la
última pasada humana que va a tener este corpus y no habrá una segunda.
