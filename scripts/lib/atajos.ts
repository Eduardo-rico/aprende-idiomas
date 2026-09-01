// scripts/lib/atajos.ts
//
// LA BATERÍA DE ATAJOS, en código.
//
// Existe porque en E2#11 el lote artesanal declaró tres cifras
// anti-atajo **calculadas a mano** y las tres estaban mal: dos por el
// error recall→acierto que la skill YA tenía documentado como cicatriz
// (presentar «0 de 8 MAL» como si fuera «0 de 16»), y la tercera por una
// lista mal hecha. Y el atajo que de verdad rompía el lote —**la
// LONGITUD, 13 de 16**— ni se probó, porque a nadie se le ocurrió.
//
// La lección no es «acordarse de medir la longitud»: es que un
// procedimiento que depende de recordar falla. Por eso esto no es una
// lista de atajos conocidos sino un MARCO: se extraen rasgos binarios
// del ítem y se mide, para cada uno, cuánto acierta la regla «predice
// MAL si el rasgo está» y su contraria. Un rasgo cualquiera que prediga
// la etiqueta por encima del azar es un atajo, se le hubiera ocurrido a
// alguien o no.
//
// **La fórmula es siempre ACIERTO SOBRE N**, nunca recall sobre los MAL.
// Está aquí, en el código, para que nadie la vuelva a calcular a ojo.

export interface ItemJuicio {
  id: string;
  /** posición en el lote, 0-based. La rellena `bateria()` si falta. */
  pos?: number;
  /** true = la frase está BIEN formada */
  verdict: boolean;
  sentence: string;
  /** EL ESPEJO DEL ESPAÑOL, declarado. ¿Esta frase portuguesa es la que
   *  un hispanohablante produce transfiriendo su español, morfema a
   *  morfema?
   *
   *  NO es `glosaEsCorrecta`: aquélla pregunta si la traducción resulta
   *  español bueno; ésta, si el portugués es la IMAGEN del español. Los
   *  dos se separan en un ítem real del lote 13: «Fomos visitar **ao**
   *  teu avô» glosa a «Fuimos a visitar al tu abuelo», que es español
   *  MALO —el rasgo 12 dice «no ayuda»— y sin embargo es exactamente lo
   *  que produce quien transfiere «visitar a tu abuelo». Lo que rompe la
   *  glosa es el artículo del posesivo, ruido de la convención de
   *  glosado, no del punto.
   *
   *  Se declara por la misma razón que la glosa —es juicio, no regex— y
   *  el preflight BLOQUEA si falta. */
  espejoEs?: boolean;
  /** LA GLOSA COGNADA, declarada. ¿La traducción palabra por palabra al
   *  español es español bien formado? No hay regex que lo calcule —es
   *  juicio— y por eso se declara en el doc del lote con la glosa escrita
   *  al lado, y el preflight BLOQUEA si falta: sin declararlo el campo se
   *  queda `undefined`, el rasgo sale en el azar y pasa en silencio, que
   *  es justo el modo de fallo que esta batería existe para impedir. */
  glosaEsCorrecta?: boolean;
}

export interface Atajo {
  nombre: string;
  /** aciertos de la mejor de las dos direcciones de la regla */
  aciertos: number;
  n: number;
  acierto: number;
  /** qué predice el rasgo cuando está presente, en la mejor dirección */
  direccion: 'presente⇒BIEN' | 'presente⇒MAL';
  /** ítems en los que el rasgo está presente */
  presentes: number;
}

/** Rasgos binarios. Añadir uno aquí lo mete en la batería para siempre. */
export const RASGOS: { nombre: string; f: (x: ItemJuicio, todos: ItemJuicio[]) => boolean }[] = [
  {
    // EL RASGO 14, del round del lote 13. El 12 mide si la GLOSA es
    // español bien formado; el lote 13 lo neutralizó eligiendo pares
    // cuyos dos rellenos glosan igual, y aun así se resolvía entero sin
    // saber portugués — porque el atajo que usa el alumno no es ése,
    // sino «¿es ésta la frase que yo produciría transfiriendo de mi
    // español?». Medido: **4/4**.
    //
    // Y la consecuencia que NINGÚN equilibrio de glosas arregla: en un
    // punto `trampa` el MAL **es** la opción española por definición de
    // la clase. Eso no se mide, se impide al montar el lote — ver
    // `monocultivoDeClase`.
    nombre: 'la frase es la que el hispanohablante produce por transferencia directa (espejo del español)',
    f: (x) => x.espejoEs === true,
  },
  {
    // EL RASGO 13, encontrado por el round del lote 10 v3. Los doce
    // anteriores miran el TEXTO (bolsa de palabras, longitud), la
    // POSICIÓN (en la frase, en el lote) o la GLOSA. **Ninguno mira QUÉ
    // GRAMÁTICA EXHIBE la frase.** Y un lote puede repartirla de una sola
    // manera: si el portugués europeo marcado —las perífrasis
    // aspectuales, el «haver de», el futuro do conjuntivo, la ênclise
    // sobre verbo finito— sólo aparece en los BIEN, entonces «si la frase
    // LUCE portugués europeo ⇒ está bien» acierta sin evaluar una sola
    // vez si la frase es gramatical. Medido en el lote 10 v3: **11 de 14,
    // p=0,029**.
    //
    // Y la comprobación que lo convierte en hallazgo y no en casualidad:
    // la tasa base sobre los 146 juicios YA publicados es **53 %**, y
    // ningún lote pasa del 60 %. No es un artefacto de la lengua: es del
    // lote.
    nombre: 'exhibe una construcción europea marcada (perífrasis, fut. do conjuntivo, ênclise sobre finito)',
    f: (x) => {
      const s = x.sentence;
      // ênclise/mesóclise sobre verbo FINITO: el español sólo tiene
      // enclisis en infinitivo, gerundio e imperativo, así que
      // «disse-me» está marcado y «levantar-me» no.
      for (const m of s.matchAll(/(?<![\p{L}])([\p{L}]{3,})-(?:me|te|se|lhe|nos|lhes|o|a|os|as|lo|la|los|las)(?![\p{L}-])/giu))
        if (!/(?:ar|er|ir|ôr|or|ndo)$/i.test(m[1]!)) return true;
      return [
        /(?<![\p{L}])(?:hei|hás|há|havemos|hão|havia|havias|havíamos|haviam)\s+d[eo](?![\p{L}])/iu,
        /(?<![\p{L}])costum(?:o|as|a|amos|am|ava|avas|ávamos|avam)(?![\p{L}])/iu,
        /(?<![\p{L}])(?:est(?:ou|ás|á|amos|ão|ava|avas|ávamos|avam|ive|eve)|fic(?:o|as|a|amos|am|ava|avam|uei|ou|aram|ámos)|and(?:o|as|a|amos|am|ava|avam|ei|ou)|continu(?:o|a|amos|am|ava|ou)|começ(?:o|a|amos|am|ava|ei|ou)|volt(?:o|a|amos|am|ei|ou))\s+a\s+[\p{L}]+(?:ar|er|ir|ôr)(?![\p{L}])/iu,
        /(?<![\p{L}])(?:vou|vais|vai|vamos|vão|ia|ias|íamos|iam|vem|vêm|vinha|anda|andam|andava)\s+[\p{L}]+ndo(?![\p{L}])/iu,
        /(?<![\p{L}])(?:for|fores|formos|forem|tiver|tiveres|tivermos|tiverem|puder|puderes|pudermos|puderem|quiser|quiseres|quisermos|quiserem|vier|vieres|viermos|vierem|fizer|fizeres|fizermos|fizerem|souber|soubermos|souberem|estiver|estivermos|estiverem|vir|vires|virmos|virem|[\p{L}]{3,}(?:armos|ermos|irmos|arem|erem|irem|ares|eres|ires))(?![\p{L}])/iu,
        /(?<![\p{L}])(?:dei|deu|deram|dou|dá|dão|dava|davam)\s+por(?![\p{L}])/iu,
      ].some((re) => re.test(s));
    },
  },
  {
    // EL RASGO 12, y el que más caro sale. La skill lo nombra desde el
    // lote 3 —«glosa cognada que da español normal», 16/20— y la batería
    // en código NUNCA lo tuvo, porque es el único de los tres atajos
    // históricos que no sale de un regex. Se quedó fuera por ser el que
    // exige juicio, que es exactamente la razón por la que hacía falta.
    //
    // Medido por el round del lote 11: **20/24 (p=0,0008)** en el lote
    // entero y **12/12 (p=0,0002)** en su sección de ser/estar. Un
    // hispanohablante que no sepa una palabra de portugués resolvía media
    // batería traduciendo.
    //
    // Y la parte que importa: **los PARES MÍNIMOS no lo neutralizan.** La
    // garantía de `pares-minimos.ts` es que todo rasgo que NO mira el
    // hueco vale igual en los dos miembros del par. Éste SÍ mira el hueco.
    // La única defensa es de contenido: que el punto sea de verdad
    // divergente del español. Si el español elige igual que el portugués,
    // el punto no se puede examinar con juicios binarios — hay que
    // cambiar de formato, no de frases.
    nombre: 'la glosa palabra-por-palabra al español es español correcto',
    f: (x) => x.glosaEsCorrecta === true,
  },
  {
    // La skill prohíbe la «alternancia mecánica» desde el lote 2, pero
    // nadie la medía: un patrón MBMBMB… se resuelve al 100 % mirando si
    // la posición es par. El lote 11 salió así y la batería no lo veía,
    // porque yo sólo había puesto rasgos del TEXTO. La posición también
    // es un rasgo.
    nombre: 'posición par en el lote (alternancia mecánica)',
    f: (x) => (x.pos ?? 0) % 2 === 0,
  },
  {
    // La paridad caza `MBMB…` y no ve `MMBB`, que se resuelve con
    // «¿estoy en la primera mitad?». `separablePorPosicion` sí lo caza,
    // pero sólo al 100 %: un GRADIENTE del 80 % pasa.
    //
    // Y el gradiente no es hipotético: la invariante «el BIEN nunca
    // después de su MAL» —que existe para que el `repair` no regale la
    // respuesta— empuja las B al principio y las M al final **por
    // construcción**. Arreglar la fuga fabrica este sesgo, así que hay
    // que medirlo, no suponerlo. Es la cuarta vez que un arreglo fabrica
    // el atajo siguiente.
    nombre: 'está en la primera mitad del lote',
    f: (x, todos) => (x.pos ?? 0) < todos.length / 2,
  },
  {
    // Arreglar un atajo puede FABRICAR otro del mismo tamaño. El lote 10
    // v2 neutralizó la longitud alargando los MAL «con su propia coleta»
    // — y los alargó POR DELANTE, con adjuntos y subordinadas
    // antepuestas. Resultado medido: la longitud murió (10/16, p=0,227) y
    // nació «arranca con algo que no es el verbo», **13/16, p=0,011**,
    // exactamente el mismo tamaño que el atajo que había matado.
    //
    // Y explica por qué la batería tiene que mirar también la POSICIÓN
    // dentro de la frase: hasta aquí era toda bolsa de palabras.
    nombre: 'arranca con adjunto o subordinada, no con el sujeto o el verbo',
    f: (x) => /^\s*(?:ontem|hoje|amanhã|agora|depois|antes|quando|se|sem|para|com|na|no|nesta|neste|nos|nas|à|ao|em|por|durante|apesar|embora|assim|logo|então|até)(?![\p{L}])/iu.test(x.sentence),
  },
  {
    nombre: 'más corta que la mediana (palabras)',
    f: (x, todos) => {
      const largos = todos.map((y) => y.sentence.trim().split(/\s+/).length).sort((a, b) => a - b);
      const med = largos[Math.floor(largos.length / 2)]!;
      return x.sentence.trim().split(/\s+/).length < med;
    },
  },
  {
    nombre: 'más corta que la mediana (caracteres)',
    f: (x, todos) => {
      const largos = todos.map((y) => y.sentence.length).sort((a, b) => a - b);
      const med = largos[Math.floor(largos.length / 2)]!;
      return x.sentence.length < med;
    },
  },
  {
    nombre: 'lleva una coma (frase con coleta)',
    f: (x) => x.sentence.includes(','),
  },
  {
    nombre: 'lleva marcador temporal',
    f: (x) => /(?<![\p{L}])(ontem|hoje|amanhã|agora|já|ainda|sempre|nunca|logo|depois|antes|então|nestes|naquele|à noite|de manhã|à tarde|na semana|no ano|no mês|todos os dias)(?![\p{L}])/iu.test(x.sentence),
  },
  {
    nombre: 'lleva una palabra visiblemente española',
    // grafías que el portugués no tiene: ñ, ll, -ción, -dad, y las
    // palabras españolas que se cuelan por descuido.
    //
    // BUG CORREGIDO (round del lote 11): la lista traía `desde`, `nunca` y
    // `aje\b`, que son **portugués corriente** — «Está a chover desde
    // ontem» está publicado, «nunca» es idéntico en las dos lenguas y
    // `aje\b` casa con «o traje». El rasgo no medía hispanismos: medía la
    // palabra «desde», y que sus tres apariciones cayeran en MAL le
    // inflaba la cifra a 15/24. Un detector de atajos con falsos
    // positivos es peor que no tenerlo: gasta atención y contamina su
    // propia cifra para el día que haya un hispanismo de verdad.
    // Entra `antes de que`, que es el calco que el rasgo quiere cazar.
    f: (x) => /ñ|ll[aeiou]|ción\b|dad\b|(?<![\p{L}])(pero|entonces|ahora|siempre|muy|hasta|aunque|antes de que)(?![\p{L}])/iu.test(x.sentence),
  },
  {
    nombre: 'lleva verbo en primera persona',
    f: (x) => /(?<![\p{L}])(eu|estou|tenho|sou|vou|faço|digo|quero|posso|sei|acabo|costumo|hei|fiquei|fui|fiz)(?![\p{L}])/iu.test(x.sentence),
  },
  {
    nombre: 'lleva clítico con guion (ênclise/mesóclise)',
    f: (x) => /[\p{L}]-(me|te|se|lhe|nos|lhes|o|a|os|as|lo|la|los|las)(?![\p{L}])/iu.test(x.sentence),
  },
  {
    nombre: 'lleva preposición contraída (do/da/no/na/ao/à/pelo)',
    f: (x) => /(?<![\p{L}])(do|da|dos|das|no|na|nos|nas|ao|aos|à|às|pelo|pela|num|numa)(?![\p{L}])/iu.test(x.sentence),
  },
  {
    nombre: 'lleva dos o más oraciones (punto o punto y coma interior)',
    f: (x) => /[.;]\s+\p{Lu}/u.test(x.sentence),
  },
];

/** Acierto de un rasgo, **sobre N**, en su mejor dirección. */
export function medirRasgo(nombre: string, presente: (x: ItemJuicio) => boolean, items: ItemJuicio[]): Atajo {
  const n = items.length;
  // dirección A: si el rasgo está ⇒ predice BIEN
  const aciertosA = items.filter((x) => presente(x) === x.verdict).length;
  // dirección B: si el rasgo está ⇒ predice MAL
  const aciertosB = n - aciertosA;
  const mejor = Math.max(aciertosA, aciertosB);
  return {
    nombre,
    aciertos: mejor,
    n,
    acierto: n ? mejor / n : 0,
    direccion: aciertosA >= aciertosB ? 'presente⇒BIEN' : 'presente⇒MAL',
    presentes: items.filter(presente).length,
  };
}

export function bateria(itemsCrudos: ItemJuicio[]): Atajo[] {
  const items = itemsCrudos.map((x, i) => ({ ...x, pos: x.pos ?? i }));
  return RASGOS
    .map((r) => medirRasgo(r.nombre, (x) => r.f(x, items), items))
    .sort((a, b) => b.acierto - a.acierto);
}

/** El umbral: con N ítems, ¿cuánto acierto es «más que el azar»?
 *
 *  Se usa el binomial exacto a una cola sobre p=0,5. Con 16 ítems, 12
 *  aciertos ya son p≈0,038: significativo. El atajo de la longitud del
 *  lote 10 sacó 13 de 16 (p≈0,011), y aun así pasó desapercibido porque
 *  nadie lo midió. */
export function pValor(aciertos: number, n: number): number {
  const comb = (a: number, b: number) => {
    let r = 1;
    for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1);
    return r;
  };
  let p = 0;
  for (let k = aciertos; k <= n; k++) p += comb(n, k);
  return p / 2 ** n;
}

export const SOSPECHOSO = 0.05;


// ── LO QUE UN GATE BINOMIAL PUEDE Y NO PUEDE VER, SEGÚN N ────────────
//
// El lote 13 salió «Preflight limpio» con CUATRO ítems. Y a N=4,
// `pValor(4,4) = 0,0625`: **un rasgo que prediga el lote entero sin un
// solo fallo no baja de 0,05**. El gate no podía rechazar nada, así que
// aquel «limpio» no era un resultado sino una TAUTOLOGÍA.
//
// Publicar la p sin publicar la POTENCIA es publicar media medición:
// «no dispara» y «no puede disparar» se imprimen exactamente igual.

/** N por debajo del cual el gate binomial no puede rechazar NADA.
 *  pValor(4,4)=0,0625 · pValor(5,5)=0,0313 */
export const N_SUELO_DEL_GATE = 5;
/** N por debajo del cual el gate sólo rechaza atajos casi perfectos. */
export const N_MINIMO_PARA_CERTIFICAR = 12;

/** Acierto mínimo que el gate puede declarar sospechoso con N ítems.
 *  N=4 → no existe · N=6 → 6 · N=12 → 10 · N=16 → 12 · N=24 → 17. */
export function umbralAcierto(n: number, alfa = SOSPECHOSO): number {
  for (let k = Math.ceil(n / 2); k <= n; k++) if (pValor(k, n) < alfa) return k;
  return n + 1;
}

/** Potencia: P(el gate dispare | el atajo acierta de verdad una fracción
 *  q). Cuenta las dos colas porque la batería se queda con la mejor de
 *  las dos direcciones. */
export function potenciaGate(n: number, q: number, alfa = SOSPECHOSO): number {
  const k = umbralAcierto(n, alfa);
  if (k > n) return 0;
  const comb = (a: number, b: number) => { let r = 1; for (let i = 0; i < b; i++) r = (r * (a - i)) / (i + 1); return r; };
  const pmf = (i: number) => comb(n, i) * q ** i * (1 - q) ** (n - i);
  let p = 0;
  for (let i = k; i <= n; i++) p += pmf(i);
  for (let i = 0; i <= n - k; i++) p += pmf(i);
  return p;
}

/** Fuerza mínima de atajo que el gate ve con potencia 0,80. Es la cifra
 *  que tiene que ir AL LADO de «preflight limpio». */
export function fuerzaMinimaDetectable(n: number, objetivo = 0.8): number | null {
  for (let q = 0.5; q <= 1.0001; q += 0.001) if (potenciaGate(n, q) >= objetivo) return q;
  return null;
}

/** Techo alcanzable de cada rasgo bajo un diseño de PARES MÍNIMOS.
 *
 *  Un rasgo sólo llega a N/N si difiere entre los dos miembros en TODOS
 *  los pares; si difiere en d de los P pares, su techo es N/2 + d. Un
 *  rasgo con techo por debajo del umbral **no es una comprobación**: es
 *  una fila de la tabla que se LEE como comprobación. Hay que decirlo. */
export function techoBajoPares(
  items: ItemJuicio[],
  parDe: (x: ItemJuicio) => string | undefined,
): { nombre: string; difiereEn: number; pares: number; techo: number; puedeDisparar: boolean }[] {
  const xs = items.map((x, i) => ({ ...x, pos: x.pos ?? i }));
  const grupos = new Map<string, ItemJuicio[]>();
  for (const x of xs) { const p = parDe(x); if (p) grupos.set(p, [...(grupos.get(p) ?? []), x]); }
  const k = umbralAcierto(xs.length);
  return RASGOS.map((r) => {
    let d = 0;
    for (const [, m] of grupos) if (m.length === 2 && r.f(m[0]!, xs) !== r.f(m[1]!, xs)) d++;
    const techo = Math.floor(xs.length / 2) + d;
    return { nombre: r.nombre, difiereEn: d, pares: grupos.size, techo, puedeDisparar: techo >= k };
  });
}

// ── EL MONOCULTIVO DE CLASE ─────────────────────────────────────────
//
// `formato-punto.ts` dedujo que un lote hecho sólo de puntos `coincide`
// se resuelve glosando. La otra mitad del teorema es la que costó el
// lote 13: **un lote hecho sólo de puntos `trampa` se resuelve con el
// espejo**, porque ahí el MAL ES la opción española por definición de la
// clase. Y no lo arregla equilibrar glosas dentro del par: el espejo
// mira el hueco.
//
// Tasa base medida sobre los lotes publicados: ninguno pasa del 70 % de
// ítems en puntos `trampa`, mediana 50 %. El lote 13 estaba al 100 % con
// UN punto.
export const TOPE_MONOCULTIVO = 0.7;

export function monocultivoDeClase(
  conceptosPorItem: string[][],
  claseDe: (id: string) => string,
): string | null {
  const n = conceptosPorItem.length;
  if (!n) return null;
  const cuenta = new Map<string, number>();
  for (const cs of conceptosPorItem) {
    const clases = [...new Set(cs.map(claseDe))];
    if (clases.length === 1) cuenta.set(clases[0]!, (cuenta.get(clases[0]!) ?? 0) + 1);
  }
  for (const [clase, k] of cuenta) {
    if (k / n <= TOPE_MONOCULTIVO) continue;
    if (clase === 'trampa')
      return `monocultivo \`trampa\`: ${k}/${n} ítems (${Math.round((100 * k) / n)} %). En un punto trampa el MAL ES la opción española, así que «¿es esto lo que yo diría?» resuelve el lote sin saber portugués. Los pares NO lo neutralizan: el espejo mira el hueco. Hay que mezclar puntos donde el español coincida.`;
    if (clase === 'coincide')
      return `monocultivo \`coincide\`: ${k}/${n} ítems (${Math.round((100 * k) / n)} %) — se resuelve glosando al español.`;
  }
  return null;
}

// ── LA POSICIÓN TIENE MÁS DE UNA FORMA ──────────────────────────────
//
// El rasgo de la paridad nació porque el lote 11 salió `MBMBMB…`. El
// lote 13 salió `MMBB`, que la paridad puntúa 2/4 y que se resuelve
// entero con «¿estoy en la primera mitad?». `evaluarMolde` tampoco lo
// ve: equilibrio 0, racha 2, y el solape ni se calcula por debajo de
// L=8. El gate correcto no es «racha» sino **¿existe un corte de
// posición que clasifique el lote?**
export function separablePorPosicion(patron: string): string | null {
  const n = patron.length;
  for (let k = 1; k < n; k++) {
    let a = 0, b = 0;
    for (let i = 0; i < n; i++) {
      const pre = i < k;
      if (pre === (patron[i] === 'B')) a++;
      if (pre === (patron[i] === 'M')) b++;
    }
    if (a === n || b === n) return `molde: un corte en la posición ${k + 1} clasifica el lote entero (${patron}) — la posición predice la etiqueta al 100 %`;
  }
  let a = 0, b = 0;
  for (let i = 0; i < n; i++) {
    const par = i % 2 === 0;
    if (par === (patron[i] === 'B')) a++;
    if (par === (patron[i] === 'M')) b++;
  }
  if (a === n || b === n) return `molde: alternancia mecánica (${patron}) — la paridad predice la etiqueta al 100 %`;
  return null;
}
