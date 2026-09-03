// lib/lang/ortografia-la.ts — LA NORMA ORTOGRÁFICA DEL LATÍN, en un sitio.
//
// Decisiones de la fase G (Paso 0 §3.1, 2026-09-03):
//
//   · `u`/`v` se DISTINGUEN; `i` sirve para `i` y para `j`.
//   · Los MÁCRONS van siempre en el material de enseñanza.
//   · Pronunciación ECLESIÁSTICA (romana) para la voz, declarada.
//
// Vive en `lib/` y no en `scripts/` por la misma razón que su hermana
// rumana: tiene DOS usos, y el segundo es el que cuesta caro arreglar
// tarde.
//
//   1. CANONICALIZAR antes de comparar y antes de hashear. El id de un
//      ejercicio es el hash de su contenido, así que dos textos que son
//      el mismo latín en dos codificaciones serían dos ítems y dos MP3
//      pagados. Por eso esto se cierra ANTES del inventario y no después:
//      el hash es la identidad del contenido, y recalcularlo sobre
//      material ya escrito es justo la clase de operación en la que un
//      fallo devuelve un número plausible.
//   2. EL GATE de escritura para contenido nuevo (`check-ortografia-la`).
//
// ── QUÉ SE UNIFICA Y QUÉ NO, que es toda la sutileza ─────────────────
//
// Se UNIFICA lo que es el MISMO dato en dos codificaciones:
//   · NFC — `ā` precompuesto (U+0101) y `a`+U+0304 son el mismo carácter.
//   · `j` → `i` — el proyecto no usa `j`, y una fuente que lo traiga
//     escribe la misma palabra en otra convención. Medido: cero `j` en
//     tres obras de `la.wikisource` (227.301 tokens de treebank tampoco
//     traen ninguna), así que unificar no toca nada existente.
//
// NO se unifica `u`↔`v`: **no es decidible por regla**. `uolo`→`volo`
// pero `suus` se queda. Se exige que la fuente ya venga con `v` y el gate
// lo comprueba.
//
// Y el MÁCRON **no se borra al canonicalizar**, porque no es una
// codificación: es información. `mălus` (malo) y `mālus` (manzano),
// `vĕnit` (viene) y `vēnit` (vino) son palabras distintas. Quitarlo es
// una DECISIÓN, y tiene su propia función (`sinCantidad`) para que se vea
// en el código dónde se toma.

/** NFC, minúsculas, `j`→`i`. **Conserva el mácrón.** Idempotente. */
export function canonicalLa(s: string): string {
  return s.normalize('NFC').toLowerCase().replace(/j/g, 'i');
}

/** Quita el mácrón. Es una DECISIÓN, no una normalización, y por eso
 *  tiene nombre propio: se usa para comparar respuestas de alumno (que
 *  escribe con el teclado que tiene) y para el texto que se manda a la
 *  voz, nunca para el que se muestra. */
export function sinCantidad(s: string): string {
  return s.normalize('NFD').replace(/̄/g, '').normalize('NFC');
}

/** La comparación por defecto: canónica y SIN cantidad.
 *
 *  ⚠ Y aquí está la trampa que este proyecto ya pagó tres veces con
 *  «la normalización tapa el rasgo examinado»: si la comparación ignora
 *  el mácrón, **un ítem cuyo punto ES la cantidad vocálica no puede
 *  fallar nunca**. El gate no falla: aprueba. Por eso existe
 *  `comparaLa(a, b, { sensibleACantidad: true })`, que los puntos de
 *  cantidad DEBEN usar, y por eso el test de esa vía no comprueba que
 *  acepte la respuesta buena —eso lo haría igual estando rota— sino que
 *  RECHACE `malus` cuando la clave es `mālus`. */
export function comparaLa(a: string, b: string, opts: { sensibleACantidad?: boolean } = {}): boolean {
  const norm = (x: string) => (opts.sensibleACantidad ? canonicalLa(x) : sinCantidad(canonicalLa(x)));
  return norm(a.trim()) === norm(b.trim());
}

// ── LA RESPELIZACIÓN PARA LA VOZ ──────────────────────────────────────
//
// Edu decidió voz ITALIANA con pronunciación ECLESIÁSTICA. Las
// consonantes salen gratis del italiano (`gn`=/ɲ/, `sc`+e/i=/ʃ/,
// `c`+e/i=/tʃ/, `v`=/v/), pero hay dos agujeros que el G2P italiano no
// puede salvar solo, porque el italiano **no tiene esas grafías**:
//
//   `caelum`  → eclesiástico /ˈtʃelum/, y el italiano leería /ka.e/
//   `grātia`  → eclesiástico /ˈgratsja/, y el italiano leería /ˈgratja/
//
// O sea que el ejemplo del propio encargo —«caelum = chelum»— es
// precisamente el que la voz NO produciría sola.
//
// La mitigación es la misma que ya exige el mácrón: **el texto que se
// muestra no es el que se envía**. Y de ahí el requisito duro que evita
// las dos eras de ficheros del portugués: **el hash del audio se calcula
// sobre el texto ENVIADO**, y `check-audio-stale` compara contra ése.
// Si se hashea el mostrado, `Rōma` y `Roma` son dos MP3 del mismo audio.
//
// La tabla es pequeña y explícita a propósito: cada regla es
// comprobable, y una regla ciega en un texto que nadie relee es la forma
// barata de romper algo que no se ve.
const RESPELIZACION: [RegExp, string][] = [
  [/ae/g, 'e'],      // caelum → celum   (y así `c`+e da /tʃ/)
  [/oe/g, 'e'],      // poena  → pena
  [/ti(?=[aeou])/g, 'tsi'], // gratia → gratsia
  [/ph/g, 'f'],      // philosophia → filosofia
  [/th/g, 't'],
  [/ch/g, 'c'],      // pulcher → pulcer (el italiano da /k/ ante consonante)
  [/y/g, 'i'],
  [/h/g, ''],        // muda en eclesiástico
];

/** El texto que se ENVÍA a la voz: sin mácrons y respelizado. **El hash
 *  del audio se calcula sobre ESTO**, no sobre lo que se muestra. */
export function textoParaVoz(s: string): string {
  let t = sinCantidad(s.normalize('NFC')).toLowerCase().replace(/j/g, 'i');
  for (const [re, sub] of RESPELIZACION) t = t.replace(re, sub);
  return t;
}

// ── EL ACENTO, DERIVADO DE LA CANTIDAD ────────────────────────────────
//
// El latín no escribe el acento porque se deduce, y sólo se deduce si hay
// mácrons — que es la razón de fondo por la que el material los lleva
// siempre. La regla:
//
//   bisílabo               → llana, sea cual sea la cantidad
//   penúltima LARGA        → llana        (amīcus)
//   penúltima BREVE        → esdrújula    (dominus)
//
// «Larga» es por naturaleza (mácrón, diptongo) o **por posición** (vocal
// seguida de dos consonantes), con la excepción de muta cum liquida.
//
// Existe además para poder COMPROBAR los ejemplos del inventario contra
// la regla que ilustran. En una sola noche eso falló cuatro veces en este
// proyecto —el último, un punto que daba «magistrī» como esdrújula
// cuando es llana justo por la regla que el punto enuncia—, y es lo
// primero que copia quien escribe el punto siguiente.
export type Acento = 'llana' | 'esdrujula';

const MUTA = /[pbtdcgf]/, LIQUIDA = /[lr]/;

/** Trocea en sílabas de forma bastante burda pero suficiente para el
 *  acento: sólo hace falta saber cuántas hay y cómo es la penúltima. */
function silabas(pal: string): { nucleo: string; cierra: boolean }[] {
  const p = pal.normalize('NFC').toLowerCase();
  const V = /[aeiouāēīōūyȳ]/;
  const DIPT = ['ae', 'oe', 'au', 'eu', 'ei'];
  const out: { nucleo: string; cierra: boolean }[] = [];
  let i = 0;
  while (i < p.length) {
    if (!V.test(p[i]!)) { i++; continue; }
    let nucleo = p[i]!;
    if (DIPT.includes(p.slice(i, i + 2))) { nucleo = p.slice(i, i + 2); i += 2; } else i += 1;
    // consonantes hasta el siguiente núcleo
    let j = i;
    while (j < p.length && !V.test(p[j]!)) j++;
    const grupo = p.slice(i, j);
    // la sílaba se cierra si quedan ≥2 consonantes (o una x/z) antes del
    // núcleo siguiente, salvo muta cum liquida, que no alarga.
    let cierra = grupo.length >= 2 || /[xz]/.test(grupo);
    if (grupo.length === 2 && MUTA.test(grupo[0]!) && LIQUIDA.test(grupo[1]!)) cierra = false;
    if (j >= p.length) cierra = false;   // la final no cuenta para el acento
    out.push({ nucleo, cierra });
    i = j;
  }
  return out;
}

/** El acento de una palabra **MACRONIZADA**, y el contrato importa.
 *
 *  Con mácrons la respuesta es exacta, porque en texto macronizado la
 *  AUSENCIA de mácrón significa breve. Sin ellos la función devuelve una
 *  respuesta confiada y equivocada: `amīcus` es llana y `amicus` sale
 *  esdrújula, porque no hay forma de distinguir «vocal breve» de «vocal
 *  larga sin marcar».
 *
 *  **Eso no es un defecto de esta función: es el argumento entero de la
 *  decisión de los mácrons**, y por eso hay un test que lo enseña en vez
 *  de esconderlo. Quien alimente esto con texto de biblioteca sin
 *  macronizar obtendrá números plausibles y falsos; para eso está
 *  `estadoMacron`, que decide pieza a pieza.
 *
 *  Devuelve `null` sólo si la palabra es monosílaba. */
export function acentoDe(pal: string): Acento | null {
  const s = silabas(pal);
  if (s.length < 2) return null;
  if (s.length === 2) return 'llana';
  const pen = s[s.length - 2]!;
  const larga = /[āēīōūȳ]/.test(pen.nucleo) || pen.nucleo.length === 2 || pen.cierra;
  return larga ? 'llana' : 'esdrujula';
}

// ── EL GATE DE ESCRITURA ──────────────────────────────────────────────

export type ClaseOrtografia = 'j-latina' | 'macron-parcial' | 'cantidad-sin-macron';
export interface HallazgoOrtografia { clase: ClaseOrtografia; detalle: string }

const RE_J = /[jJ]/;
const VOCAL = /[aeiouāēīōūAEIOUĀĒĪŌŪ]/g;
const MACRON = /[āēīōūȳĀĒĪŌŪȲ]/g;

/** El porcentaje de vocales con mácrón, POR DÉCIMO del texto.
 *
 *  No es una media: la media es justo lo que engaña. Medido sobre
 *  `la.wikisource`, «De bello Gallico I» va al 18,5 % en su primer décimo
 *  y a 0,0 % en los otros nueve — **la media de la página, 1,8 %, no
 *  describe ningún trozo del texto**. Y el daño es silencioso porque **la
 *  AUSENCIA de mácrón es informativa**: un alumno entrenado con material
 *  macronizado lee `partes` y concluye «la e es breve». */
export function densidadMacronPorDecimo(texto: string): number[] {
  const t = texto.normalize('NFC');
  const n = Math.floor(t.length / 10);
  if (n === 0) return [];
  const out: number[] = [];
  for (let k = 0; k < 10; k++) {
    const seg = t.slice(k * n, (k + 1) * n);
    const v = (seg.match(VOCAL) ?? []).length;
    const m = (seg.match(MACRON) ?? []).length;
    out.push(v === 0 ? 0 : (100 * m) / v);
  }
  return out;
}

/** ¿La pieza está macronizada de forma ÍNTEGRA, o hay que retirarle los
 *  mácrons? Regla del Paso 0 §3.1, con sus tres anclas comprobadas:
 *  Aeneis I (mediana 26,0, mín 22,8) y Metamorfosis I (21,5 / 19,6) pasan;
 *  De bello Gallico I (0,0 / 0) se retira. */
export function estadoMacron(texto: string): 'integros' | 'retirados' | 'sin-texto' {
  const d = densidadMacronPorDecimo(texto);
  if (d.length === 0) return 'sin-texto';
  const orden = [...d].sort((a, b) => a - b);
  const mediana = (orden[4]! + orden[5]!) / 2;
  return mediana >= 10 && Math.min(...d) > 0 ? 'integros' : 'retirados';
}

/** Revisa contenido NUEVO. Lo antiguo (la biblioteca) no pasa por aquí:
 *  ahí el texto se respeta y `notaOrtografia` lo dice. */
export function revisarOrtografiaLa(
  texto: string,
  opts: { puntoDeCantidad?: boolean; esPieza?: boolean } = {},
): HallazgoOrtografia[] {
  const out: HallazgoOrtografia[] = [];
  const t = texto.normalize('NFC');

  if (RE_J.test(t)) {
    out.push({ clase: 'j-latina', detalle: `la convención del proyecto es «i» para i y j: ${t.match(/\S*[jJ]\S*/)?.[0] ?? ''}` });
  }
  if (opts.puntoDeCantidad && !MACRON.test(t)) {
    MACRON.lastIndex = 0;
    out.push({ clase: 'cantidad-sin-macron', detalle: 'el punto declarado es la cantidad vocálica y el texto no lleva un solo mácrón: el ítem no puede medir su punto' });
  }
  MACRON.lastIndex = 0;
  if (opts.esPieza) {
    const d = densidadMacronPorDecimo(t);
    if (d.length > 0 && estadoMacron(t) === 'retirados' && Math.max(...d) > 0) {
      out.push({
        clase: 'macron-parcial',
        detalle: `mácrons a parches (${d.map((x) => x.toFixed(0)).join('·')} % por décimo): o íntegros o retirados, nunca a medias`,
      });
    }
  }
  return out;
}
