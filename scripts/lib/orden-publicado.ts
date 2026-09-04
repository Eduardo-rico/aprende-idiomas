// scripts/lib/orden-publicado.ts
//
// EL ORDEN EN QUE SE PUBLICA UN LOTE ES UNA PISTA.
//
// Descubierto por el latinista adversarial revisando las listas de pistas,
// y es el hallazgo más caro del latín hasta hoy: **cuatro de los cinco
// lotes se resolvían al 100 % contando ejercicios.**
//
// Los escribí agrupados por su eje —primero los seis con marca `-bi-`,
// luego los seis con `-ē-`; primero los diez de sujeto delante, luego los
// diez de objeto— porque así se leen mejor. Y `ExerciseRunner.tsx` los
// sirve con `exercises[idx]` incremental, o sea **en ese orden**. El
// alumno no necesita percibir nada de la frase: le basta con notar que a
// partir del séptimo la respuesta cambia.
//
// Corrido el detector que YA ESTABA EN EL REPOSITORIO desde portugués
// (`scripts/lib/atajos.ts`, `separablePorPosicion`), que ninguno de los
// cinco gates de latín llamaba:
//
//     l3  BBBBBBBBBBMMMMMMMMMM   corte en 11 → 20/20
//     l2  BBBBMMMM               corte en  5 →  8/8
//     l11 MMMMMMBBBBBB           corte en  7 → 12/12
//     l5  BBBBBBMMMMMM           corte en  7 → 12/12
//     l4  MMMMMMMBBBBBMB         limpio — y por accidente: lo salvan los
//                                dos ítems que se añadieron para romper
//                                la colinealidad de OTROS dos ejes
//
// Y los tres «sin atajo» que había medidos estaban calculados sobre listas
// de pistas a las que les faltaba **la más barata que existe**.
//
// ── LA CURA ───────────────────────────────────────────────────────────
//
// El fichero se sigue escribiendo agrupado, porque así se revisa; lo que
// se publica va barajado con semilla fija. Ni alternancia estricta —que el
// mismo detector caza por paridad— ni azar sin semilla, que haría que el
// veredicto cambiara entre corridas.

/** Baraja determinista. La semilla va en la firma para que quede escrita
 *  en el lote y el orden publicado sea reproducible. */
export function ordenPublicado<T>(items: T[], semilla: number): T[] {
  let s = semilla >>> 0;
  const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1000000) / 1000000; };
  const xs = [...items];
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [xs[i], xs[j]] = [xs[j]!, xs[i]!];
  }
  return xs;
}

/** El patrón binario de un lote, para pasárselo a `separablePorPosicion`. */
export function patronDe<T>(items: T[], esB: (i: T) => boolean): string {
  return items.map((i) => (esB(i) ? 'B' : 'M')).join('');
}

/** Busca una semilla cuyo orden publicado pase el detector. Se llama una
 *  vez, a mano, y el número resultante se escribe en el lote: buscarla en
 *  cada arranque haría que el orden dependiera de la versión del código. */
export function buscarSemilla<T>(
  items: T[], esB: (i: T) => boolean,
  detector: (patron: string) => string | null,
  desde = 1, hasta = 5000,
): number | null {
  for (let s = desde; s < hasta; s++) {
    if (!detector(patronDe(ordenPublicado(items, s), esB))) return s;
  }
  return null;
}
