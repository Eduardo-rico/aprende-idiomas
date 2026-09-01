// scripts/lib/texto-cloze.ts — el texto de un cloze, listo para analizar.
//
// Existe porque el MOLDE del generador ha engañado a tres barridos
// distintos, y las tres veces costó una medición entera:
//
//   1. Midiendo la clase «estar com + sustantivo», el barrido dio **0
//      hallazgos** porque la frase guarda la respuesta en `blanks[].answer`
//      y no en `sentence`: nunca la ensamblaba.
//   2. Ensamblada ya, volvió a dar **0** porque el molde deja el infinitivo
//      entre paréntesis JUSTO en medio — «Tu estás (estar) com razão» — y
//      ningún patrón contiguo casa con eso.
//   3. Buscando moldes que dejan el verbo escrito además del hueco, marcó
//      **121 ítems de los que 120 eran la convención**: «___ (trabalhar)»
//      pone el lema a propósito, para decir QUÉ verbo.
//
// Dos ceros falsos y un número inflado. Un comentario en cada barrido no
// evita el cuarto; una función compartida sí. Es el mismo caso que
// `estado-item.ts`: un criterio que cada script reimplementa y cada vez lo
// implementa peor.

export interface OpcionesTexto {
  /** Rellena el hueco con la respuesta. Para medir qué lee el alumno
   *  cuando acierta —o para comprobar que la frase resultante existe. */
  conRespuesta?: boolean;
  /** Conserva el paréntesis del molde. Sólo para quien de verdad quiera
   *  analizar la CONVENCIÓN y no la frase. */
  conMolde?: boolean;
}

/** La frase del cloze con el molde desmontado.
 *
 *  Por defecto: hueco marcado con «___», paréntesis del lema fuera y
 *  espacios normalizados. Lo que queda es la frase que el alumno lee, sin
 *  los andamios del generador. */
export function textoAnalizable(item: any, o: OpcionesTexto = {}): string {
  const d = item?.data ?? {};
  let s = String(d.sentence ?? '');
  if (o.conRespuesta) {
    for (const b of (d.blanks ?? [])) s = s.replace('___', String(b?.answer ?? ''));
  }
  // El paréntesis del molde se quita SIEMPRE salvo petición explícita: es
  // andamio del generador, no texto de la frase.
  if (!o.conMolde) s = s.replace(/\([^)]*\)/g, ' ');
  return s.replace(/\s+/g, ' ').trim();
}

/** Las palabras de la frase analizable, en minúsculas y sin puntuación —
 *  **pero conservando el guion**, porque en portugués el guion de la
 *  ênclise es un rasgo y no un signo: sin él «vi-o» y «vi o» son la misma
 *  cadena, y un ejercicio que pide contraer la segunda en la primera
 *  parece estar dando la respuesta al lado. */
export function palabrasAnalizables(item: any, o: OpcionesTexto = {}): string[] {
  return textoAnalizable(item, o)
    .toLowerCase().normalize('NFC')
    .replace(/[^\p{L}\p{N}\- ]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}
