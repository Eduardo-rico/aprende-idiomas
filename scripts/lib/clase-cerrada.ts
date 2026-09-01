// scripts/lib/clase-cerrada.ts — las palabras que salen del SISTEMA y no
// del léxico: artículos, contracciones, demostrativos, clíticos, relativos.
//
// Existe por una colisión concreta: la regla que exige nombrar el
// paradigma en todo hueco verbal se dispara por la terminación, y «-esse»
// es a la vez el imperfeito do conjuntivo («fizesse») y la contracción
// «nesse». Al escribir un cloze de deícticos, el gate rechazó «nesse»
// diciendo que era un verbo indeterminado.
//
// La lista ya existía dentro de `triaje-cloze-sin-pista.ts`. Copiarla al
// gate habría sido la enésima regla duplicada que se desincroniza en la
// copia N+1 que nadie actualiza, así que vive aquí y la importan los dos.
//
// EL AGUJERO, escrito para que nadie lo descubra por sorpresa: «desse» y
// «disse» son a la vez contracción/verbo y forma verbal de pleno derecho
// («que eu desse», «ele disse»). Un ítem cuya respuesta sea exactamente
// una de ésas se salta la regla del paradigma. Se acepta porque para
// llegar ahí hay que declarar la respuesta como literal —los ítems
// derivados de un lema tienen su propio gate que exige nombrar el verbo en
// el molde—, y eso ya pasa por revisión humana.

export const CLASE_CERRADA = new Set([
  // artículos y contracciones
  'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
  'no', 'na', 'nos', 'nas', 'num', 'numa', 'nuns', 'numas',
  'do', 'da', 'dos', 'das', 'dum', 'duma',
  'ao', 'à', 'aos', 'às', 'pelo', 'pela', 'pelos', 'pelas',
  // preposiciones
  'de', 'em', 'por', 'para', 'com', 'sem', 'sobre', 'sob', 'até', 'desde', 'entre',
  // clíticos y sus fusiones
  'me', 'te', 'lhe', 'vos', 'lhes', 'se', 'lho', 'lha', 'lhos', 'lhas',
  'mo', 'ma', 'to', 'ta', 'lo', 'la', 'los', 'las', 'no-lo', 'no-la',
  // demostrativos y sus contracciones
  'este', 'esta', 'isto', 'esse', 'essa', 'isso', 'aquele', 'aquela', 'aquilo',
  'deste', 'desta', 'disto', 'desse', 'dessa', 'disso',
  'daquele', 'daquela', 'daquilo', 'neste', 'nesta', 'nisto',
  'nesse', 'nessa', 'nisso', 'naquele', 'naquela', 'naquilo',
  'àquele', 'àquela', 'àquilo',
  // posesivos
  'meu', 'minha', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas',
  'seu', 'sua', 'seus', 'suas', 'nosso', 'nossa', 'nossos', 'nossas',
  'vosso', 'vossa', 'dele', 'dela', 'deles', 'delas',
  // cuantificadores e indefinidos
  'mais', 'menos', 'muito', 'muita', 'pouco', 'pouca', 'todo', 'toda', 'tudo',
  'nada', 'algum', 'alguma', 'algo', 'nenhum', 'nenhuma', 'ninguém', 'alguém',
  // relativos e interrogativos
  'que', 'quem', 'onde', 'quando', 'como', 'porque', 'porquê', 'qual', 'quais',
  'cujo', 'cuja', 'cujos', 'cujas',
]);

/** ¿La respuesta sale del sistema y no del léxico? Insensible a mayúsculas
 *  porque un hueco al principio de la frase va capitalizado. */
export const esClaseCerrada = (r: string): boolean =>
  CLASE_CERRADA.has(r.toLowerCase().normalize('NFC').trim());
