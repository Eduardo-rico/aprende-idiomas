// scripts/lib/gates-por-formato.ts — QUÉ DECLARA CADA ÍTEM, POR FORMATO.
//
// ══ POR QUÉ EXISTE ═══════════════════════════════════════════════════
// Dos veces ha pasado lo mismo: un gate **declarado** en la definición del
// formato y **ausente** del tipo del ítem.
//
//   · `atajoEs` (lote 9) — la definición del lingüista adversarial declara
//     el atajo de traducción como gate de la corrección, y `ItemCorreccion`
//     no tenía el campo: en nueve lotes, ni en portugués ni en rumano, se
//     había medido una sola vez.
//   · `transparenteLatin` (lote 18) — la misma definición lo declara gate
//     del formato («por encima de la mitad del lote, el lote no sale») y el
//     cloze rumano lo lleva desde su primer lote; la corrección, nunca.
//
// Un gate declarado y ausente es PEOR que no tenerlo: la definición promete
// una cobertura que nadie da, el lote sale «Limpio», y quien lea la
// definición creerá que está cubierto. Arreglar sólo la instancia garantiza
// una tercera, así que lo que se escribe aquí es el INVARIANTE: para cada
// formato, qué campos tiene que declarar CADA ítem.
//
// Y «no declarado» no es «limpio»: `undefined` es un fallo, que es la
// lección que costó la medición del atajo.
export const CAMPOS_EXIGIDOS: Record<string, readonly string[]> = {
  // La corrección mide DOS atajos, y son preguntas distintas: `atajoEs`
  // pregunta «¿traduciendo el calco se llega a la BUENA?» y
  // `transparenteLatin` pregunta «¿la raíz común deja acertar sin saber la
  // morfología?». Un ítem puede ser limpio en uno y sucio en el otro.
  correccion: ['espejoEs', 'atajoEs', 'transparenteLatin'],
  'cloze-con-pista': ['transparenteLatin'],
  // `transformacion` ENTRA EL 2026-09-03, y ni un día antes: hasta hoy no
  // tenía máquina en rumano, y declararle campos exigidos a un formato sin
  // máquina es prometer una cobertura que no existe — el mismo defecto que
  // el gate declarado y ausente, con el signo cambiado.
  //
  // Sus dos atajos son los mismos que los de la corrección menos `atajoEs`,
  // y la razón de que falte es de fondo: `atajoEs` pregunta «¿traduciendo
  // el calco se llega a la BUENA?», y en transformación **no hay calco que
  // traducir** porque no se enseña ninguna frase mala. Lo que sí hay es
  // «¿el español hace la MISMA transformación?», que es `espejoEs`. Los
  // gates de LOTE —copiar el foco, la edición modal, la varianza— no van
  // aquí porque no son campos del ítem: se ejecutan sobre los ocho a la
  // vez, y ése es justo el punto de esta máquina.
  transformacion: ['espejoEs', 'transparenteLatin'],
};

/** Los campos que un ítem de este formato NO declara. Vacío es limpio. */
export function camposSinDeclarar(formato: string, item: Record<string, unknown>): string[] {
  return (CAMPOS_EXIGIDOS[formato] ?? []).filter((c) => item[c] === undefined);
}
