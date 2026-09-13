// scripts/lib/leccion-ru.ts
//
// A QUÉ LECCIÓN VA UN ÍTEM, y por qué esto es un fichero y no tres líneas
// dentro del publicador.
//
// El publicador elegía la lección así:
//
//     bloque.lessons.find((l) => l.conceptIds.some((k) => padres.has(k)))
//       ?? bloque.lessons[0]
//
// donde `padres` es el punto del ítem MÁS sus prerrequisitos. Mientras cada
// bloque ruso tuvo UNA sola lección eso no podía fallar. El 2026-09-13 entraron
// b5 y b7 con DOS lecciones cada uno —A2 aparte de B1, A1 aparte de A2— y la
// expresión se volvió incorrecta en silencio:
//
//   · `u7-irregulares-frecuentes` (A2) tiene como prerrequisito
//     `u7-conjugacion-i-ii`, que está en `b7-l1`. La búsqueda casa con l1 por
//     el PRERREQUISITO y nunca llega a l2, que es donde el punto vive.
//   · Igual `u5-genitivo-negacion` (B1), cuyo prerrequisito
//     `u5-declinacion-plural` está en `b5-l1`.
//
// Y lo que lo hace peor que un error: **el aviso de «cae en la lección por
// DEFECTO» usa el MISMO predicado**, así que un ítem mal colocado por esta vía
// no sale en la lista de avisos. Un fallo que devuelve un resultado plausible
// y además apaga su propio testigo.
//
// El arreglo es DOS PASADAS con la precedencia escrita, no un orden de ficheros
// del que nadie se acuerde: primero la lección que declara EL PUNTO, y sólo si
// ninguna lo declara, la que declara un prerrequisito. La tercera salida
// —`bloque.lessons[0]`— se marca como `defecto` para que el publicador la
// pueda cantar, que es lo único que la hace aceptable.
//
// ⚠ La precedencia es una REGLA y vive aquí sola: si se copia al publicador de
// otro formato, falla en la copia N+1 que nadie sincronizó.

export interface LeccionMin { id: string; conceptIds?: string[] }

export type ViaDeLeccion = 'punto' | 'prereq' | 'defecto';

/** Elige la lección de un ítem y DICE POR QUÉ VÍA. Devuelve `null` sólo si el
 *  bloque no tiene ninguna lección, que es el caso que el publicador ya
 *  rechaza. */
export function leccionParaPunto<L extends LeccionMin>(
  lecciones: L[],
  punto: string,
  prereqs: string[],
): { leccion: L; via: ViaDeLeccion } | null {
  const primera = lecciones[0];
  if (!primera) return null;
  const porPunto = lecciones.find((l) => (l.conceptIds ?? []).includes(punto));
  if (porPunto) return { leccion: porPunto, via: 'punto' };
  const padres = new Set(prereqs);
  const porPrereq = lecciones.find((l) => (l.conceptIds ?? []).some((k) => padres.has(k)));
  if (porPrereq) return { leccion: porPrereq, via: 'prereq' };
  return { leccion: primera, via: 'defecto' };
}
