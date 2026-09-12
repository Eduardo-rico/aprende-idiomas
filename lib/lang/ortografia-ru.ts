// lib/lang/ortografia-ru.ts — LA NORMA ORTOGRÁFICA DEL RUSO, en un sitio.
//
// Vive en `lib/` y no en `scripts/` por lo mismo que su hermana rumana:
// tiene DOS usos y si viven separados se desincronizan.
//
//   1. CANONICALIZAR antes de comparar y antes de hashear.
//   2. EL GATE de escritura para contenido NUEVO. La biblioteca —2.180
//      lecturas de prosa del XIX transcrita en ortografía post-1918— no
//      pasa por él: ahí el texto se respeta y `notaOrtografia` lo dice.
//
// ══ LAS TRES DECISIONES, CON EL NÚMERO QUE LAS DECIDIÓ ════════════════
//
// **(1) EL ACENTO NO SE ESCRIBE, Y ESO ESTÁ MEDIDO.** Sobre las 2.180
// lecturas (≈7,7 M de palabras): **CERO apariciones de U+0301**, la tilde
// aguda combinante con la que se marca el acento. Es el «0 macrones de
// 227.301 tokens» del latín, y con su control: el instrumento SÍ sabe
// devolver distinto de cero —la misma familia de consulta encuentra 43.048
// «ё» y 325 combinantes— así que el cero es un cero y no una consulta rota.
//
// ⚠ Y CON SU SEÑUELO, que es lo que hay que llevarse. Una consulta ingenua
// por `[̀́]` devuelve **325**, un número plausible que invita a
// escribir «el acento se marca poco pero se marca». Leídas una a una, las
// 325 son **U+0300 GRAVE sobre `что̀`**: la convención editorial del XIX
// para separar el `что` interrogativo del `что` conjunción. No es una
// marca de acento: es otro fenómeno con la misma pinta. Un número correcto
// sobre una forma ambigua es un número verdadero que mide otra cosa.
//
// Consecuencia: el acento didáctico es **capa de PRESENTACIÓN**. Se puede
// pintar, nunca se compara ni se hashea, y **nunca se exige teclear**: un
// alumno que lee ruso real jamás ha visto esa tilde.
//
// **(2) LA Ё, Y AQUÍ EL CORPUS CORRIGIÓ LA SUPOSICIÓN DE PARTIDA.** Lo que
// se daba por sabido —«el ruso impreso escribe е donde se pronuncia ё»— es
// cierto en la MEDIA y falso en la FORMA. Medido sobre 16 pares
// inequívocos (ещё/еще, её/ее, пришёл/пришел, шёл, ушёл, идёт, чёрный,
// зелёный, жёлтый, лёгкий, ребёнок, тёмный, нёс, своё, берёт, живёт),
// 64.996 apariciones en total: **9,5 % con ё**.
//
// Pero la distribución **NO es un gradiente: es bimodal por edición**. De
// las 1.488 lecturas con ≥10 apariciones medibles, **1.295 escriben ё
// esencialmente nunca** (tasa 0) y **159 la escriben esencialmente
// siempre** (≥90 %); sólo 34 quedan en medio. La ё no es una tendencia del
// ruso: es una decisión del editor de cada fuente. Afanásiev entero viene
// ё-ificado; casi todo lo demás, no.
//
// De ahí las tres reglas, y la tercera no se deduce de las otras dos:
//   · PRODUCIR con ё siempre — es la grafía informativa y el TTS la
//     necesita para no decir otra palabra.
//   · ACEPTAR las dos al comparar (`plegarYo`): el alumno lee textos sin
//     ё y teclea lo que ha leído. Suspenderlo por eso es suspender una
//     respuesta correcta.
//   · **NO PLEGAR EN EL HASH.** Aquí el ruso se separa del rumano y
//     conviene decir por qué: `ş`/`ș` son dos CODIFICACIONES del mismo
//     dato, así que plegarlas une dos ids que son uno. `все`/`всё` son dos
//     PALABRAS, así que plegarlas fundiría dos ítems distintos en uno y
//     pagaría un MP3 que dice la palabra equivocada. Misma operación,
//     signo contrario.
//   · Y la consecuencia que va escrita en el inventario: **ningún punto
//     puede examinar la ё como pista**. Su presencia es propiedad de la
//     EDICIÓN, no de la lengua — la peor clase de pista, la del
//     significante.
//
// **(3) LOS HOMÓGLIFOS LATINOS NO SE CANONICALIZAN: SE DENUNCIAN.** `а о с
// е р х у к В Н М Т А Е О Р С Х` son visualmente idénticos a letras
// latinas y byte-distintos. Arreglarlos en silencio sería el gate
// cómplice: un alumno que teclea con distribución latina produce cadenas
// indistinguibles a la vista y siempre falladas, y lo que necesita es el
// mensaje («escribiste una "a" latina, no una "а" cirílica»), no un ✗
// mudo. Y en el contenido NUEVO es error duro: una `о` latina dentro de
// una palabra rusa rompe el TTS, el hash y toda búsqueda posterior.
//
// ⚠ Y ES LA RAZÓN DE QUE `\b` ESTÉ PROHIBIDO EN LAS CONSULTAS DE RUSO
// (`scripts/corpus-ru.ts`): en cirílico puro `\b` no dispara NUNCA —
// ninguna letra rusa es `\w`— salvo justo en la juntura latín↔cirílico. O
// sea que una consulta con `\b` no devuelve nada excepto los tokens
// contaminados. Medido y en test.

/** Las 33 letras. Sin `ё` no hay alfabeto; sin `ъ` tampoco. */
export const ALFABETO_RU = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';

/** Tilde aguda combinante: la marca de acento didáctica. NO es letra. */
export const ACENTO = '́';
/** Grave combinante: NO es acento — es el `что̀` editorial del XIX. Se
 *  cuenta aparte para que nadie vuelva a sumarlos. */
export const GRAVE = '̀';

/** NFC y nada más. **No pliega la ё y no quita el acento**: los dos son
 *  decisiones de otra capa y mezclarlas aquí es lo que rompería el hash.
 *  Idempotente. */
export function canonicalRu(s: string): string {
  return String(s ?? '').normalize('NFC');
}

/** Quita el acento didáctico y el grave editorial. Se aplica ANTES de
 *  comparar y ANTES de hashear: la marca es presentación, nunca dato.
 *
 *  ⚠ OPERA SOBRE NFC Y NO DESCOMPONE, y es un fallo propio ya pagado. La
 *  v0 hacía `NFD → borrar [̀́] → NFC`, y eso convierte **`ќ` (U+045C,
 *  la kje macedonia) en `к`** sin avisar: bajo NFD `ќ` ES `к` + U+0301. Lo
 *  destapó el gate marcando cuatro veces `Кукуреќу`, el canto del gallo de
 *  Odóievski, como «acento en un campo de dato». Sobre NFC no hay nada que
 *  descomponer: en ruso NINGUNA vocal tiene forma precompuesta con tilde
 *  aguda, así que el acento didáctico siempre es un combinante suelto y se
 *  borra sin tocar una letra de verdad. Es la normalización que tapa —o
 *  aquí, que fabrica— el rasgo examinado. */
export function quitarAcento(s: string): string {
  return canonicalRu(s).replace(/[̀́]/g, '');
}

/** ё → е. **Sólo para COMPARAR una respuesta del alumno.** Nunca para
 *  guardar, nunca para hashear, nunca para sintetizar. */
export function plegarYo(s: string): string {
  return canonicalRu(s).replace(/ё/g, 'е').replace(/Ё/g, 'Е');
}

/** La forma con la que se compara una respuesta escrita en ruso: sin
 *  acento, con la ё plegada, en minúsculas y con los espacios normalizados.
 *  NO toca los homóglifos: ésos se denuncian, no se arreglan. */
export function normalizarRespuestaRu(s: string): string {
  return plegarYo(quitarAcento(s)).toLowerCase().replace(/\s+/g, ' ').trim();
}

// ── Homóglifos ───────────────────────────────────────────────────────
/** Latina → la cirílica que el alumno quería. Sólo las que son
 *  VISUALMENTE idénticas en las tipografías corrientes; `y`/`у` y `x`/`х`
 *  entran, `n`/`п` no. */
export const HOMOGLIFOS: Record<string, string> = {
  a: 'а', c: 'с', e: 'е', o: 'о', p: 'р', x: 'х', y: 'у', k: 'к', m: 'м', t: 'т', b: 'в', h: 'н',
  A: 'А', B: 'В', C: 'С', E: 'Е', H: 'Н', K: 'К', M: 'М', O: 'О', P: 'Р', T: 'Т', X: 'Х', Y: 'У',
};

export interface Homoglifo { palabra: string; latinas: string[]; sugerencia: string }

/** Las palabras que MEZCLAN cirílico y latino. Una palabra enteramente
 *  latina no es un homóglifo: es una palabra extranjera, y decidir eso no
 *  es de esta función. */
export function homoglifosRu(texto: string): Homoglifo[] {
  const out: Homoglifo[] = [];
  for (const m of canonicalRu(texto).matchAll(/[\p{L}̀́]+/gu)) {
    const w = m[0];
    if (!/\p{Script=Cyrillic}/u.test(w)) continue;
    const latinas = [...w].filter((c) => /[A-Za-z]/.test(c));
    if (latinas.length === 0) continue;
    out.push({
      palabra: w,
      latinas: [...new Set(latinas)],
      sugerencia: [...w].map((c) => HOMOGLIFOS[c] ?? c).join(''),
    });
  }
  return out;
}

// ── El gate ortográfico ──────────────────────────────────────────────
//
// Reglas de grafía tras sibilante y velar. Son las únicas que en ruso no
// admiten discusión, y las tres excepciones de `чу/щу` están NOMBRADAS con
// su fuente en vez de quedar como un agujero: `жюри`, `брошюра`,
// `парашют` (Правила русской орфографии и пунктуации 1956, §13; Лопатин
// 2006, §15 «Гласные после шипящих и ц»). Que una regla tenga excepciones
// y estén enumeradas es lo que la hace un gate y no una superstición.
//
// ⚠ `ц` QUEDA FUERA A PROPÓSITO, y el motivo va escrito porque el
// siguiente lo va a querer añadir: `цы` es grafía CORRECTA y frecuente
// —`отцы`, `огурцы`, `цыган`, `цыплёнок`, `на цыпочках`—, así que meter
// `ц` en la regla de «sólo и tras sibilante» produciría una mala que es
// lengua real. La regla de `ц` es de otra clase (depende de si la `ы` está
// en la desinencia o en la raíz) y no cabe en una lista de dígrafos.
// ⚠ POR RAÍZ Y NO POR FORMA, y es la segunda mitad que faltaba. La v0
// listaba `брошюра`, `парашют`, `жюри` como PALABRAS, y el gate marcó
// entonces 174 apariciones de la biblioteca —`брошюр`, `брошюру`,
// `брошюрках`, `парашютист`— que son lengua correcta: en una lengua que
// declina, una excepción enumerada por formas le falta el paradigma
// entero. Se enumera la RAÍZ, que es donde vive la excepción.
// ⚠ Y LA RAÍZ VA SIN ANCLAR, que es la TERCERA mitad de esta misma regla.
// Anclada en `^` seguía marcando `сброшюрованных`: la raíz también lleva
// PREFIJO. Van tres versiones de un criterio de cuatro palabras —por
// forma, por raíz anclada, por raíz suelta— y las dos primeras acertaban
// en casi todos los casos que tenía delante. Es el aspecto exacto de una
// regla a la que le falta una mitad.
const RAICES_YU = ['жюр', 'брошюр', 'парашют', 'пшют'];
const RE_EXCEPCION_YU = new RegExp(`(?:${RAICES_YU.join('|')})`);

// ⚠ LO QUE ESTE GATE NO PUEDE CERRAR, ESCRITO EN VEZ DE DISIMULADO: los
// NOMBRES PROPIOS EXTRANJEROS transliterados son clase ABIERTA y rompen la
// regla sin ser errores — `Жюль`, `Жюля`, `Жюльен`, `Шяуляй`. En la
// biblioteca son 127 apariciones de `sibilante-yu`, casi todas `Жюль`. No
// se enumeran porque enumerar una clase abierta es la denylist disfrazada
// de allowlist: lo que falte pasaría. En contenido NUEVO un nombre propio
// extranjero se declara ítem a ítem, con su fuente, como las exenciones de
// Hunspell del rumano.

/** Combinaciones imposibles en ruso. `к г х` sólo aquí con `ы`: el
 *  problema no es que sean raras, es que un generador por regla las
 *  produce sola (`*книгы` por `книги`). */
const IMPOSIBLES: { re: RegExp; clase: ClaseOrtografiaRu }[] = [
  { re: /[жшщч]ы/, clase: 'sibilante-y' },
  { re: /[жшщч]я/, clase: 'sibilante-ya' },
  { re: /[жшщч]ю/, clase: 'sibilante-yu' },
  { re: /[кгх]ы/, clase: 'velar-y' },
];

export type ClaseOrtografiaRu =
  | 'homoglifo' | 'acento-en-dato' | 'sibilante-y' | 'sibilante-ya' | 'sibilante-yu' | 'velar-y';

export interface HallazgoOrtografiaRu { clase: ClaseOrtografiaRu; palabra: string; nota?: string }

/** Lo que rompe la norma en un texto ruso NUEVO. Devuelve una entrada por
 *  ocurrencia; el llamador decide si bloquea o informa.
 *
 *  `acentoPermitido` existe porque el mismo texto se sirve con acento en
 *  A1 y sin él desde B2: el gate tiene que poder mirar el CAMPO DE DATO
 *  (donde la tilde nunca va) y la capa de presentación (donde sí) sin dos
 *  copias de la regla. */
export function revisarOrtografiaRu(texto: string, opts: { acentoPermitido?: boolean } = {}): HallazgoOrtografiaRu[] {
  const out: HallazgoOrtografiaRu[] = [];
  const t = canonicalRu(texto);
  for (const h of homoglifosRu(t)) {
    out.push({ clase: 'homoglifo', palabra: h.palabra, nota: `letras latinas ${h.latinas.join(' ')} — debería ser «${h.sugerencia}»` });
  }
  for (const m of t.matchAll(/[\p{Script=Cyrillic}̀́]+/gu)) {
    const w = m[0];
    if (!opts.acentoPermitido && w.includes(ACENTO)) {
      out.push({ clase: 'acento-en-dato', palabra: w, nota: 'la tilde de acento es presentación: no va en un campo que se compara o se hashea' });
    }
    const limpia = quitarAcento(w).toLowerCase();
    if (RE_EXCEPCION_YU.test(limpia)) continue;
    for (const { re, clase } of IMPOSIBLES) {
      if (re.test(limpia)) { out.push({ clase, palabra: w }); break; }
    }
  }
  return out;
}
