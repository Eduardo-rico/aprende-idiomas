// scripts/lib/escueto-es.ts — ¿ADMITE EL HUECO LA FORMA SIN DETERMINANTE?
//
// El latín no tiene artículo, así que «bella» es «las guerras», «unas
// guerras» o «guerras». La pareja definido ↔ indefinido se deriva sola
// (`determinanteSinPareja`), pero la forma ESCUETA no: en español depende
// de la posición sintáctica y del número, y aceptarla en bloque metería
// frases agramaticales como clave buena.
//
// El latinista adversarial apartó por esto dos lotes el 2026-09-10, y la
// distinción que los separa de los que sí se publican es real:
//
//   · Hueco en posición de OBJETO y respuesta PLURAL → la forma escueta
//     es gramatical: «el rey ve guerras», «el esclavo lleva regalos».
//   · Hueco en posición de SUJETO → no: «Abundancia es grande» no es
//     español.
//   · Hueco tras PREPOSICIÓN → no: «está en oscuridad» es marginal y la
//     lengua pide «en la oscuridad».
//   · Objeto SINGULAR CONTABLE → no: «lleva regalo», «oye palabra» y «lee
//     letra» son agramaticales.
//
// Queda fuera un caso que NO se deriva y que por eso se declara a mano en
// el lote: el singular DE MASA o abstracto, donde el escueto sí vale («la
// reina tiene alegría»). Derivarlo exigiría saber si el nombre es contable,
// y el lexicón no lo dice.

/** Preposiciones tras las que el español no admite el sintagma escueto en
 *  estos marcos. */
// ⚠ EL LÍMITE DE PALABRA VA EN UNICODE Y NO ES UN DETALLE. Escrito con
//   `\b`, «El rey guía ___» se leía como si acabara en la preposición «a»:
//   en JavaScript `\b` se define sobre `[A-Za-z0-9_]`, así que la «í» NO
//   es letra para él y hay frontera entre «guí» y «a». El ítem perdía su
//   alternativa escueta en silencio, y el único síntoma era un hueco donde
//   debería haber habido una palabra.
const TRAS_PREPOSICION = /(?<![\p{L}\p{N}])(a|en|de|con|por|para|sin|sobre|hacia|desde|entre|hasta)\s+$/iu;
const DETERMINANTE_PLURAL = /^(los|las|unos|unas)\s+/iu;

/** `true` sólo si el hueco está en posición de objeto Y la respuesta es un
 *  sintagma plural con determinante. Conservador a propósito: un falso
 *  «no» rechaza una respuesta correcta, y un falso «sí» publica español
 *  agramatical como clave. */
export function admiteEscueto(glosa: string, respuesta: string): boolean {
  const i = glosa.indexOf('___');
  if (i < 0) return false;
  const antes = glosa.slice(0, i);
  // Hueco al principio de la frase o de la oración: es el sujeto.
  if (!antes.trim()) return false;
  if (/[.!?:;]\s*$/u.test(antes.trim())) return false;
  if (TRAS_PREPOSICION.test(antes)) return false;
  return DETERMINANTE_PLURAL.test(respuesta.trim());
}

/** El sintagma sin su determinante. */
export const escuetoDe = (respuesta: string) =>
  respuesta.trim().replace(DETERMINANTE_PLURAL, '');

/** La alternativa escueta si procede, o nada. */
export function alternativaEscueta(glosa: string, respuesta: string): string[] {
  if (!admiteEscueto(glosa, respuesta)) return [];
  const e = escuetoDe(respuesta);
  return e && e !== respuesta.trim() ? [e] : [];
}
