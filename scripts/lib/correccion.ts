// scripts/lib/correccion.ts
//
// CORRECCIÓN DE ERROR: se da la frase que el hispanohablante produce por
// calco y se pide la portuguesa.
//
// Es el formato al que se reasignaron los 19 puntos de la clase `trampa`
// cuando el juicio binario se declaró muerto en E2#20. La razón de que
// aquí sí funcione está medida: el juicio ponía la respuesta en la glosa
// —«la glosa palabra-por-palabra es español correcto» sacó 19/24— porque
// había dos opciones entre las que elegir. **Sin opciones no hay glosa
// que consultar: hay que producir la forma.**
//
// ── LO QUE CADA ÍTEM TIENE QUE DECLARAR, Y POR QUÉ ───────────────────
//
// `calcoEs` es obligatorio y es lo que hace legítimo el ejercicio: la
// oración española de la que sale la frase mala. Si el error no es el que
// un hispanohablante comete de verdad al traducir esa frase, el ítem no
// mide su interlengua — mide un error inventado, y entonces enseña a
// corregir algo que nadie escribe.
//
// `espejoEs` mide el atajo de traducción, igual que en transformación.
// Aquí debería estar muerto por construcción, porque no hay nada que
// elegir. Se mide igual: es exactamente el tipo de afirmación cómoda que
// acaba de costar cuatro sesiones.
// El criterio de «esta alternativa ya la acepta la tarjeta» es el de la
// TARJETA, importado, no una copia. Una copia se desincroniza: cuando
// `answersMatchFinal` hizo opcional el punto final, un gate con su propia
// normalización habría seguido pidiendo alternativas que ya sobraban.
import { answersMatchCard } from '@/lib/exercises/normalize';

export interface ItemCorreccion {
  p: string;
  pasada: number;
  /** La frase MALA: la que el hispanohablante produce por calco. */
  mala: string;
  /** La frase buena. Única; si hay más salidas válidas, van en `alt`. */
  buena: string;
  alt?: string[];
  /** La oración española de la que sale el calco. Obligatoria. */
  calcoEs: string;
  /** Qué está mal y por qué, en español. */
  explicacion: string;
  /** ¿El español haría la misma corrección? Debería ser false siempre. */
  espejoEs: boolean;
  /** EL ATAJO DE TRADUCCIÓN, que este contrato NO MEDÍA. La definición del
   *  lingüista adversarial declara `transparenteLatin` como gate del
   *  formato («por encima de la mitad del lote, el lote no sale») y este
   *  tipo nunca tuvo el campo: en corrección el atajo no se ha medido
   *  NUNCA, ni en portugués ni en rumano. Lo destapó el propio lingüista
   *  en el lote 9 y el coordinador ordenó medir antes de tocar la tarjeta.
   *
   *  Pregunta que contesta, y sólo ésa: **¿produciendo la estructura del
   *  español de `calcoEs`, palabra por palabra, se llega a la BUENA?**
   *  Si sí, el ítem se resuelve traduciendo y mide español, no la lengua.
   *  En teoría es `false` siempre —un ítem de corrección existe porque el
   *  calco es INCORRECTO en rumano, así que traducir da la MALA— pero eso
   *  es un argumento, no un dato, y esta ola entera ha ido de la
   *  diferencia entre las dos cosas.
   *
   *  OPCIONAL en el tipo para no tocar los lotes de PT ya publicados; los
   *  gates del rumano lo exigen declarado y `undefined` es un fallo. */
  atajoEs?: boolean;
  /** EL ATAJO DEL LATÍN COMÚN, que este tipo NO TENÍA — y es la SEGUNDA vez
   *  que un gate declarado en la definición del formato no existe en el
   *  tipo. La primera fue `atajoEs` (lote 9): el atajo de traducción estaba
   *  declarado como gate y no se había medido nunca. Ahora el mismo agujero
   *  con `transparenteLatin`, que la definición del lingüista declara gate
   *  del formato —«por encima de la mitad del lote, el lote no sale»— y que
   *  el cloze rumano sí lleva desde su primer lote.
   *
   *  Un gate DECLARADO y AUSENTE es peor que no tenerlo: la definición
   *  promete una cobertura que nadie da, y el lote «pasa» sin él. Arreglar
   *  sólo la instancia garantizaba una tercera, así que lo que cierra la
   *  clase es `gates-por-formato.ts` y su test.
   *
   *  Pregunta que contesta: **¿la raíz latina común deja acertar la BUENA
   *  sin saber la morfología rumana?** Opcional en el tipo para no tocar
   *  los lotes de PT; los gates del rumano lo exigen declarado. */
  transparenteLatin?: boolean;
  /** LA INTENCIÓN, en vocabulario CERRADO (`lib/intencion.ts`). Es lo que
   *  la tarjeta PINTA para cerrar la indeterminación: «Trebuie a pleca»
   *  admite să plec/pleci/plece y sin decir quién habla el alumno no
   *  puede acertar. `calcoEs` NO se pinta —es prueba para el gate— y
   *  confundir las dos cosas produjo la medición del atajo. Opcional en
   *  el tipo para no tocar los lotes de PT; los gates del rumano la
   *  exigen donde el ítem no fija la persona por otra vía. */
  intencion?: string;
  /** DE DÓNDE VIENE EL ERROR, y existe porque el ítem de FRONTERA rompe un
   *  supuesto que este formato hacía sin decirlo.
   *
   *  Todo ítem de corrección se escribió hasta ahora suponiendo que la mala
   *  es el CALCO del español: por eso `calcoEs` es obligatorio y por eso
   *  `atajoEs` debería ser false siempre — si traducir diera la buena, el
   *  ítem mediría español.
   *
   *  El ítem de SOBREAPLICACIÓN (§0.6 del relevo: «un punto cuya regla
   *  admite excepción debe incluir un ítem cuyo error sea aplicarla donde
   *  no toca») invierte eso por construcción: su error no viene del
   *  español sino de sobregeneralizar una regla RUMANA recién aprendida,
   *  y entonces **traducir del español SÍ da la buena** — «Compré cinco
   *  manzanas» → `Am cumpărat cinci mere`, sin `de`. Eso no es un defecto
   *  del ítem: es lo que lo hace la frontera. Sin él el alumno aprende
   *  «pon siempre de» y saca 8/8.
   *
   *  Así que el atajo no se silencia: se declara que la pregunta no
   *  aplica, y `medirAtajo` los cuenta APARTE en vez de mezclarlos.
   *  `undefined` vale 'calco', que es lo que el formato ya suponía en
   *  todos los ítems escritos hasta hoy: el campo hace explícito un
   *  supuesto que ya se estaba haciendo, no abre un silencio nuevo. */
  origenError?: 'calco' | 'sobreaplicacion';
  /** Los gates de variante van a morder por diseño: el error deliberado
   *  ES el material. Se declara el motivo, no se silencia el gate. */
  varianteEsperada?: string;
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();

/** Como `norm` pero CONSERVANDO los acentos. El gate de «la mala y la
 *  buena son la misma» tiene que usar ésta: con la blanda, «a Sofia» y
 *  «à Sofia» son idénticas — y la crase es justamente lo que el ítem
 *  enseña. Es la misma lección que el guion de la ênclise en
 *  transformación: comerse el diacrítico es comerse el punto. */
const normAcentos = (s: string) =>
  s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();

const palabras = (s: string) => s.trim().split(/\s+/).filter(Boolean);

export function verificar(items: ItemCorreccion[]): string[] {
  const v: string[] = [];
  const vistas = new Set<string>();
  const porPunto = new Map<string, ItemCorreccion[]>();

  for (const [i, x] of items.entries()) {
    const id = `CO-${String(i + 1).padStart(3, '0')} (${x.p})`;

    if (normAcentos(x.mala) === normAcentos(x.buena)) v.push(`${id}: la frase mala y la buena son la misma`);
    if (!x.calcoEs.trim()) v.push(`${id}: sin calco declarado — hay que decir de qué frase española sale el error`);
    if (!x.explicacion.trim()) v.push(`${id}: sin explicación`);

    // La corrección tiene que ser MÍNIMA: si la frase buena cambia media
    // oración, el alumno no sabe qué se juzgaba y el ítem deja de medir
    // el punto. Es la cicatriz del par mínimo, aplicada aquí.
    const pm = palabras(x.mala), pb = palabras(x.buena);
    if (Math.abs(pm.length - pb.length) > 2)
      v.push(`${id}: la corrección cambia ${Math.abs(pm.length - pb.length)} palabras — deja de ser mínima`);
    // La comparación va por MULTICONJUNTO, no por índice. La primera
    // versión alineaba posición a posición y marcaba como «no mínima»
    // toda corrección que INSERTA una palabra —«João chegou» → «O João
    // chegou»—, que es precisamente la corrección más frecuente de estos
    // puntos: el artículo que falta. El gate marcaba 9 de 24 y los nueve
    // eran suyos.
    const bolsa = new Map<string, number>();
    for (const w of pb) bolsa.set(norm(w), (bolsa.get(norm(w)) ?? 0) + 1);
    let iguales = 0;
    for (const w of pm) { const k2 = norm(w); const c = bolsa.get(k2) ?? 0; if (c > 0) { iguales++; bolsa.set(k2, c - 1); } }
    // El criterio es CUÁNTAS palabras cambian, no qué proporción. Con
    // proporción, una frase de cuatro palabras suspendía por una
    // contracción —«de isto» → «disto» funde dos en una— que es la
    // corrección más mínima que existe. Y una concordancia arrastrada
    // («A leite está fria» → «O leite está frio») cambia dos por
    // definición: ésa ES la enseñanza.
    const cambiadas = pm.length - iguales;
    const tope = Math.max(2, Math.round(pm.length * 0.4));
    if (cambiadas > tope)
      v.push(`${id}: cambian ${cambiadas} de ${pm.length} palabras (tope ${tope}) — la corrección no es mínima`);

    // La explicación no puede limitarse a repetir la frase buena: eso no
    // enseña la regla, sólo da la respuesta otra vez.
    if (norm(x.explicacion).includes(norm(x.buena)) && palabras(x.explicacion).length < palabras(x.buena).length + 6)
      v.push(`${id}: la explicación es poco más que la frase buena repetida`);

    // La coma de la adversativa NO se declara ítem a ítem. Hubo aquí un
    // gate que la exigía en `alt`; se retiró al arreglarla en la raíz
    // (`answersMatchCard`), porque exigir una alternativa que la tarjeta
    // ya acepta es pedir trece copias de una regla — y la copia número
    // catorce es la que nadie añade.
    for (const a of x.alt ?? []) {
      // Redundante = LA TARJETA YA LA ACEPTARÍA. Con `norm` —que borra la
      // puntuación— una variante de coma parecía idéntica a la clave y el
      // gate la rechazaba, cuando es justo la que hay que declarar:
      // `normalizeAnswer` NO quita comas, así que sin declararla la
      // tarjeta suspende a quien corrigió bien.
      if (answersMatchCard(a, x.buena)) v.push(`${id}: la alternativa «${a}» ya la acepta la tarjeta — no añade nada`);
      if (norm(a) === norm(x.mala)) v.push(`${id}: la alternativa «${a}» es la frase mala`);
    }

    const k = norm(x.mala);
    if (vistas.has(k)) v.push(`${id}: frase repetida dentro del lote`);
    vistas.add(k);

    const g = porPunto.get(x.p) ?? [];
    g.push(x); porPunto.set(x.p, g);
  }

  for (const [p, xs] of porPunto) {
    const espejo = xs.filter((x) => x.espejoEs).length;
    if (espejo) v.push(`${p}: ${espejo} ítems declarados espejo del español — en corrección eso no debería pasar, revisa el punto`);
  }
  return v;
}

/** El preflight del formato. Se imprime SIEMPRE. */
export function preflight(items: ItemCorreccion[]): string[] {
  const L: string[] = [];
  const n = items.length;
  const espejo = items.filter((x) => x.espejoEs).length;
  const conAlt = items.filter((x) => (x.alt ?? []).length).length;
  const conVar = items.filter((x) => x.varianteEsperada).length;

  L.push(`**Atajo de traducción: ${espejo}/${n} ítems (${Math.round((espejo / n) * 100)} %).**`);
  L.push('');
  L.push('En corrección el atajo debería estar muerto por construcción: no hay dos');
  L.push('opciones entre las que elegir, así que traducir no da la respuesta — hay');
  L.push('que PRODUCIR la forma portuguesa. Se mide igual, porque «debería» es la');
  L.push('palabra que costó cuatro sesiones en el juicio.');
  L.push('');
  L.push(`**Alternativas declaradas en ${conAlt}/${n} ítems.** Una corrección admite`);
  L.push('más de una salida válida más veces de lo que parece, y la comparación es');
  L.push('exacta: lo que no se declara, se suspende.');
  L.push('');
  L.push(`**${conVar}/${n} ítems avisan de que el gate de variante va a morder.** Es`);
  L.push('por diseño: el error deliberado ES el material. Se declara el motivo en el');
  L.push('ítem en vez de silenciar el gate.');
  return L;
}
