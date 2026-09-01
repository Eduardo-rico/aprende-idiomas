// scripts/lib/formato-punto.ts
//
// QUÉ FORMATO EXAMINA CADA PUNTO.
//
// Existe porque tres rounds seguidos convergieron en el mismo veredicto
// y ninguno era un fallo de redacción: **un punto que no diverge del
// español no se puede examinar con juicios binarios.** El lote 11 murió
// con la glosa cognada acertando 20/24 (p=0,0008); el lote 12, con una
// bolsa de tres atractores resolviéndolo 12/12; y el lote 10 se publicó
// con el atajo declarado a 11/14 porque **no había edición que lo
// quitara**: era propiedad del punto, no de las frases.
//
// Sin esta columna, ese fallo se repite en cada uno de los ~60 puntos de
// C1 y C2 que están sin empezar. Con ella, se decide antes de escribir.
//
// ── EL CRITERIO, y es discutible a propósito ─────────────────────────
//
// Un punto se examina con JUICIO BINARIO **si y sólo si el error que
// enseña produce, traducido palabra por palabra, español BIEN FORMADO.**
//
// Ésa es la prueba, y no es una opinión sobre el punto: es lo que decide
// si el ítem mide portugués o mide español. Si el calco suena bien en
// español, la intuición del alumno no lo detecta y tiene que saber
// portugués para acertar. Si el calco también rompe el español, el
// alumno acierta traduciendo y el ítem no mide nada — es el atajo de la
// glosa cognada, que la skill nombra desde el lote 3 y que ahora bloquea
// en el preflight.
//
// De ahí las cuatro clases. No son «tipos de punto»: son respuestas a
// esa única pregunta.
export type Clase =
  /** El español PERMITE lo que el portugués prohíbe. El calco suena bien
   *  en español, así que la glosa engaña y el juicio mide portugués.
   *  Ej.: «vou A falar» (es: «voy a hablar», correcto), «Minha casa»
   *  (es: «mi casa», correcto), «Estou esperando» (es: «estoy
   *  esperando», correcto). ⇒ JUICIO. */
  | 'trampa'
  /** El español PROHÍBE lo mismo. La glosa caza el error y el juicio se
   *  resuelve traduciendo. Ej.: «sem que ninguém o viu» (es: «sin que
   *  nadie lo vio», también mal). ⇒ hay que PRODUCIR, no juzgar. */
  | 'coincide'
  /** El español NO TIENE la forma. Un juicio pide reconocer una ausencia,
   *  que es la tarea fácil; lo que hay que ejercitar es producirla.
   *  Ej.: infinitivo pessoal, futuro do conjuntivo, mesóclise. ⇒
   *  TRANSFORMACIÓN. */
  | 'sin-equivalente'
  /** Lo que se juzga no es gramaticalidad sino efecto: registro,
   *  cortesía, ironía, variedad. Un binario no tiene veredicto
   *  inequívoco. ⇒ MEDIACIÓN. */
  | 'pragmatico'
  /** Léxico: la palabra existe o no existe, y ahí la glosa española ES
   *  la destreza («¿suena natural palabra por palabra?» es justo lo que
   *  el bloque enseña — nota del lote 5). ⇒ JUICIO o FLASHCARD. */
  | 'lexico';

export type Formato =
  | 'juicio'            // grammaticality_judgment
  | 'cloze-con-pista'   // fill_blank cuyo contexto DETERMINA la respuesta
  | 'transformacion'    // dar una forma y pedir la otra (conjugation, sentence_construction)
  | 'mediacion'         // mediation: registro, variedad, efecto
  | 'flashcard';        // léxico puro

export const FORMATO_DE_CLASE: Record<Clase, Formato> = {
  trampa: 'juicio',
  coincide: 'cloze-con-pista',
  'sin-equivalente': 'transformacion',
  pragmatico: 'mediacion',
  lexico: 'juicio',
};

/** El valor por defecto de cada bloque, con su razón. Un defecto no es
 *  una medición: es el punto de partida que los overrides corrigen, y
 *  por eso `formatoDe` devuelve la confianza. */
const POR_BLOQUE: Record<number, { clase: Clase; motivo: string }> = {
  1: { clase: 'coincide', motivo: 'fonética y ortografía: el error no pasa por el español, se oye o no se oye' },
  2: { clase: 'trampa', motivo: 'morfología nominal: el español permite lo que el portugués prohíbe («mi casa» → «a minha casa»), así que el calco suena bien' },
  3: { clase: 'coincide', motivo: 'presente y pronombres: el español tiene las mismas categorías y el calco suele romperlo también' },
  4: { clase: 'coincide', motivo: 'pasados: el español tiene los mismos tiempos con el mismo reparto, salvo excepciones marcadas' },
  5: { clase: 'coincide', motivo: 'futuros y condicional: reparto casi paralelo; las trampas son puntuales y van en overrides' },
  6: { clase: 'coincide', motivo: 'conjuntivo: el español lo dispara con los mismos verbos, así que el calco también es agramatical en español' },
  7: { clase: 'sin-equivalente', motivo: 'formas no personales: infinitivo pessoal y perífrasis que el español no tiene' },
  8: { clase: 'coincide', motivo: 'colocación y subordinadas: la ênclise sobre finito rompe el español igual, así que la glosa la caza' },
  9: { clase: 'lexico', motivo: 'léxico: la palabra existe o no, y ahí la glosa ES la destreza' },
  10: { clase: 'pragmatico', motivo: 'registro y variación: lo que se juzga es efecto, no gramaticalidad' },
  11: { clase: 'trampa', motivo: 'anti-calco C1: el bloque existe justo porque el español permite lo que el portugués prohíbe' },
  12: { clase: 'trampa', motivo: 'C2: el borde de la gramaticalidad ES/PT' },
};

/** Donde el defecto del bloque miente. Cada override es una afirmación
 *  sobre si el CALCO suena bien en español, no sobre el tema del punto. */
const OVERRIDES: Record<string, { clase: Clase; motivo: string }> = {
  // ── b2: donde el español coincide y el defecto «trampa» sobra
  'b2-plural-ao': { clase: 'sin-equivalente', motivo: 'los plurales en -ão/-ães/-ões no tienen paralelo español: hay que producirlos' },
  'b2-plural-l': { clase: 'sin-equivalente', motivo: 'ídem: «-l» → «-is» no existe en español' },
  'b2-genero-divergente': { clase: 'trampa', motivo: '«o leite», «a viagem»: el género español es correcto en español y falso en portugués' },

  // ── b3
  'b3-exist-ter-br': { clase: 'trampa', motivo: '«tem gente» es brasileño y su glosa española es correcta' },
  'b3-pron-reflexivo': { clase: 'trampa', motivo: '«Lavei-me as mãos» calca «me lavé las manos», que es español perfecto' },

  // ── b4
  'b4-perf-amos-europeo': { clase: 'sin-equivalente', motivo: 'la oposición cantamos/cantámos no existe en español: hay que producirla' },
  'b4-mqp-simples': { clase: 'sin-equivalente', motivo: '«falara» no tiene forma española viva' },

  // ── b5: las trampas puntuales del bloque
  'b5-perifrastico-ir': { clase: 'trampa', motivo: '«vou A falar» calca «voy a hablar», que es español correcto — el error nº 1 y el más resistente' },
  'b5-fut-perifrastico': { clase: 'trampa', motivo: 'ídem' },
  'b5-se-futuro-conj': { clase: 'sin-equivalente', motivo: 'futuro do conjuntivo: el español lo perdió' },
  'b5-futcomp-composto-real': { clase: 'sin-equivalente', motivo: '«terei falado» sin equivalente vivo' },

  // ── b6: el futuro do conjuntivo es lo único sin equivalente
  'b6-fut-subj-quando': { clase: 'sin-equivalente', motivo: '«quando chegares»: el español usa presente, no tiene la forma' },
  'b6-fut-subj-se': { clase: 'sin-equivalente', motivo: 'ídem' },
  'b6-fut-subj-formacao': { clase: 'sin-equivalente', motivo: 'ídem' },
  'b6-fut-subj-irregulares': { clase: 'sin-equivalente', motivo: 'ídem' },

  // ── b7
  'b7-gerundio-brasileiro': { clase: 'trampa', motivo: '«estou fazendo» calca «estoy haciendo»: español correcto, portugués brasileño' },
  'b7-estar-a-infinitivo': { clase: 'trampa', motivo: 'la cara buena del mismo contraste' },
  'b7-part-passiva': { clase: 'coincide', motivo: 'la pasiva española es paralela' },

  // ── b8: la colocación es el caso fino, y va en las dos direcciones
  'b8-coloc-enclise': { clase: 'trampa', motivo: '«Ela me disse» calca «Ella me dijo», que es español correcto: la próclise brasileña NO la caza la glosa' },
  'b8-coloc-proclise-negacao': { clase: 'coincide', motivo: 'al revés que el anterior: «no dijo-me» rompe el español, así que la glosa lo caza y el juicio no mide portugués' },
  'b8-coloc-mesoclise': { clase: 'sin-equivalente', motivo: 'la mesóclise no existe en español: reconocerla es fácil, producirla es el punto' },
  'b8-sub-relativas-cujo': { clase: 'trampa', motivo: '«cujo o» calca «cuyo el», que el español coloquial admite' },

  // ── b11: lo que el bloque promete y no siempre cumple
  'b11-regencias': { clase: 'coincide', motivo: 'MEDIDO en el lote 10: la mayoría de las regências portuguesas coinciden con la española, así que el calco rompe el español y la glosa lo caza (11/14, p=0,029)' },
  'b11-alternancia-infinitivo': { clase: 'sin-equivalente', motivo: 'el infinitivo flexionado no existe en español' },
  'b11-ser-estar-divergente': { clase: 'coincide', motivo: 'MEDIDO en el lote 11: once de doce ítems escritos para este punto coincidían con el español (glosa 12/12). Diverge en pocos casos y hay que elegirlos, no suponerlos' },
  'b11-conectores-discursivos': { clase: 'pragmatico', motivo: 'sus errores son de registro y de matiz, no de gramaticalidad — ya declarado al escribir el lote 11' },

  // ── b12
  'b12-mesoclise-estilistica': { clase: 'pragmatico', motivo: 'MEDIDO en el lote 12: el punto pide ELECCIÓN de registro, y en un binario la mesóclise sólo puede salir obligatoria o imposible' },
  'b12-concordancia-discutida': { clase: 'pragmatico', motivo: 'discutida por definición: no admite verdict inequívoco' },
  'b12-regencia-rara': { clase: 'coincide', motivo: 'Priberam suele registrar DOS regímenes para esos verbos: no hay MAL inequívoco' },
  'b12-arcaismo-juridico': { clase: 'pragmatico', motivo: 'la destreza es saber cuándo NO usarlo' },
  'b12-sintaxe-literaria': { clase: 'pragmatico', motivo: 'licencia, no regla' },
  'b12-mqp-simples-literario': { clase: 'sin-equivalente', motivo: '«falara» hay que producirlo' },
  'b12-modo-pragmatico': { clase: 'pragmatico', motivo: 'los dos modos son gramaticales; cambia lo que el hablante da por sabido' },
  'b12-borde-gramaticalidad': { clase: 'trampa', motivo: 'es literalmente la definición de la clase: lo que el español permite y el portugués no' },

  // ── transversales
  'reg-verbal-de': { clase: 'coincide', motivo: 'el español rige DE en los mismos verbos casi siempre' },
  'reg-verbal-em': { clase: 'trampa', motivo: '«pensar en» coincide, pero «chegar em» / «entrar en» no: el calco suena bien en español' },
  'reg-verbal-a': { clase: 'coincide', motivo: '«obedecer a», «asistir a»: el español pone la misma preposición' },
  'reg-verbal-com': { clase: 'coincide', motivo: '«soñar con», «casarse con»: paralelo' },
  'reg-verbal-por-para': { clase: 'trampa', motivo: '«preocuparse POR» es español correcto y portugués incorrecto' },
  'reg-verbal-zero': { clase: 'trampa', motivo: 'el español pone preposición donde el portugués no: el calco es español bueno' },
  'reg-verbal-otras': { clase: 'coincide', motivo: 'por defecto, hasta medirlo' },
};

export interface Veredicto {
  clase: Clase;
  formato: Formato;
  motivo: string;
  /** `medido` = sale de un round con cifras; `declarado` = override
   *  razonado; `defecto` = el del bloque, sin mirar el punto */
  confianza: 'medido' | 'declarado' | 'defecto';
}

export function formatoDe(id: string): Veredicto {
  const ov = OVERRIDES[id];
  if (ov) return { ...ov, formato: FORMATO_DE_CLASE[ov.clase], confianza: /MEDIDO/.test(ov.motivo) ? 'medido' : 'declarado' };
  const b = Number(id.match(/^b(\d+)-/)?.[1] ?? 0);
  const d = POR_BLOQUE[b] ?? { clase: 'coincide' as Clase, motivo: 'sin bloque reconocible: por defecto, el formato conservador' };
  return { ...d, formato: FORMATO_DE_CLASE[d.clase], confianza: 'defecto' };
}
