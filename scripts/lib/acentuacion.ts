// scripts/lib/acentuacion.ts — clasificar la tónica de una palabra
// portuguesa, para que una glosa que nombra la clase pueda comprobarse.
//
// Existe por un nido que lleva desde E2#3 reapareciendo: «mãe esdrújula»,
// «décimo circunflejo», «corazón llana», y en E2#22 tres más — «Brasil…
// paroxítona» (es oxítona), «ônibus… paroxítona, sin tilde» (es
// proparoxítona y lleva) y «difícil… esdrújula» (es llana), esta última
// en producción NUEVA y contradicha por otro ítem del propio corpus.
//
// Una glosa de acentuación es de las pocas afirmaciones de un curso de
// idiomas que se pueden verificar por completo con código. Que llevara
// cinco olas fallando sin gate es el argumento entero de este fichero.
//
// ── LO QUE ESTE MÓDULO NO HACE ──────────────────────────────────────
//
// No silabea de verdad: cuenta NÚCLEOS. Basta para la clase, porque la
// clase depende de cuántos núcleos hay desde el tónico hasta el final, no
// de dónde caen las fronteras silábicas. Y ante cualquier duda devuelve
// `null` en vez de arriesgar un veredicto: un gate que marca de más se
// deja de leer, y entonces no protege nada.

const VOCALES = 'aáàâãeéêiíoóôõuúy';
const FUERTES = 'aáàâãeéêoóôõ';
const ACENTO_TONICO = /[áâàéêíóôòúÁÂÀÉÊÍÓÔÒÚ]/;
const TIL = /[ãõÃÕ]/;

const sinTil = (c: string) =>
  ({ á: 'a', à: 'a', â: 'a', ã: 'a', é: 'e', ê: 'e', í: 'i', ó: 'o', ô: 'o', ò: 'o', õ: 'o', ú: 'u' })[c] ?? c;

/** Núcleos vocálicos de la palabra, en orden, con el índice de su vocal
 *  más prominente. Los diptongos cuentan como UNO. */
export function nucleos(palabra: string): { i: number; texto: string }[] {
  const p = palabra.toLowerCase().normalize('NFC');
  const out: { i: number; texto: string }[] = [];
  let i = 0;
  while (i < p.length) {
    if (!VOCALES.includes(p[i]!)) { i++; continue; }
    let j = i;
    while (j + 1 < p.length && VOCALES.includes(p[j + 1]!)) {
      const a = p[j]!, b = p[j + 1]!;
      const aF = FUERTES.includes(a), bF = FUERTES.includes(b);
      // Los diptongos NASALES son una sola sílaba aunque las dos vocales
      // sean fuertes: «mãe», «ção», «põe». Va ANTES de la regla de los
      // dos fuertes, que si no parte «mãe» en dos y la llama llana.
      if (TIL.test(a)) { j++; continue; }
      // Dos fuertes NO se funden: «ca-os», «po-e-ta». Si la débil lleva
      // acento propio tampoco: «sa-í-ram», «pa-ís».
      if (aF && bF) break;
      if (ACENTO_TONICO.test(b) && !bF) break;
      if (ACENTO_TONICO.test(a) && !aF) break;
      j++;
    }
    out.push({ i, texto: p.slice(i, j + 1) });
    i = j + 1;
  }
  return out;
}

export type Clase = 'oxitona' | 'paroxitona' | 'proparoxitona';

/** La clase de la palabra, o `null` si no se puede decidir con seguridad. */
export function claseDe(palabra: string): Clase | null {
  const p = palabra.toLowerCase().normalize('NFC').replace(/[^a-zà-ÿ-]/g, '');
  if (!p || /-/.test(p)) return null; // compuestas y con clítico: fuera
  const nu = nucleos(p);
  if (nu.length === 0) return null;
  if (nu.length === 1) return 'oxitona';

  // 1 · Acento gráfico agudo o circunflejo: manda, y no hay más que ver.
  let tonico = nu.findIndex((n) => ACENTO_TONICO.test(n.texto));
  // 2 · Sin él, el til marca la tónica (irmã, coração) — salvo que haya
  //     acento en otro sitio, caso ya resuelto arriba (órgão, órfão).
  if (tonico < 0) tonico = nu.findIndex((n) => TIL.test(n.texto));
  // 3 · Sin ninguno, la regla general del portugués.
  if (tonico < 0) {
    const fin = p.slice(-3);
    const sinAcento = [...p].map(sinTil).join('');
    const terminaGrave =
      /(a|e|o)s?$/.test(sinAcento) || /(am|em|ens)$/.test(sinAcento) ||
      /(a|e|o)m$/.test(sinAcento);
    // Las terminadas en diptongo con -i/-u finales son oxítonas
    // («chapéu», «cajú»), pero ésas llevan acento y ya salieron arriba.
    if (/(i|u)s?$/.test(sinAcento) && !/(a|e|o)(i|u)s?$/.test(sinAcento)) return 'oxitona';
    tonico = terminaGrave ? nu.length - 2 : nu.length - 1;
    if (!fin) return null;
  }
  if (tonico < 0) return null;
  const desdeElFinal = nu.length - 1 - tonico;
  if (desdeElFinal === 0) return 'oxitona';
  if (desdeElFinal === 1) return 'paroxitona';
  if (desdeElFinal === 2) return 'proparoxitona';
  return null; // sobresdrújulas y rarezas: no se opina
}

/** Los nombres con que las glosas del curso llaman a cada clase, en
 *  español y en portugués. */
export const NOMBRES: Record<string, Clase> = {
  oxitona: 'oxitona', oxítona: 'oxitona', aguda: 'oxitona',
  paroxitona: 'paroxitona', paroxítona: 'paroxitona', llana: 'paroxitona', grave: 'paroxitona',
  proparoxitona: 'proparoxitona', proparoxítona: 'proparoxitona', esdrujula: 'proparoxitona', esdrújula: 'proparoxitona',
};

/** «grave» y «aguda» nombran DOS cosas distintas: la clase de la palabra y
 *  el signo (´ agudo, ` grave, ^ circunflexo). En este corpus «acento
 *  grave» es siempre la crase, no una llana — la primera versión del gate
 *  marcó siete ítems de crase por confundirlas. Se descarta la aparición
 *  cuando va detrás de «acento», «con»/«sin» o «lleva». */
export const esNombreDeSigno = (texto: string, i: number): boolean =>
  /(acento|acentos|tilde|signo|con|sin|lleva|leva)\s*$/i.test(texto.slice(Math.max(0, i - 12), i));
