// scripts/lib/gate-cloze-glosa.ts
//
// EL GATE DEL FORMATO NUEVO, escrito ANTES del primer ítem.
//
// El «cloze en la glosa» es el formato dominante del inventario latino
// (46 de 116 puntos) y **este proyecto no lo ha producido nunca**: en
// portugués y en rumano el hueco va siempre en la lengua meta. Estrenar
// lengua y formato a la vez, sin ni un ítem previo del que copiar la
// forma, es donde un lote se quema entero.
//
// ── EL PELIGRO, con su precedente ─────────────────────────────────────
//
// El juicio binario murió en portugués **porque la glosa contenía la
// respuesta**. Un hueco EN la glosa es el mismo peligro con la geometría
// invertida, y tiene dos caras:
//
//   1. **La pista posicional.** Si la frase latina va en el orden del
//      español, rellenar la glosa palabra por palabra da la respuesta
//      correcta **sin haber mirado una sola desinencia** — que es justo
//      lo que el punto examina. `Pater fīlium amat` traducido en orden da
//      «el padre ama al hijo», que es lo correcto, y el ítem no mide
//      nada. `Fīlium pater amat` traducido en orden da «al hijo ama el
//      padre», que es lo INCORRECTO: ahí sí hay que leer la terminación.
//
//   2. **El sentido común.** `Puella librum legit` se resuelve sin
//      gramática, porque un libro no lee. Si sólo uno de los dos
//      candidatos es plausible como agente, la desinencia sobra.
//
//   3. **La fuga morfológica del español**, que salió atacando este mismo
//      gate después de verlo verde. `El ___ ama a la ___`, con «padre» y
//      «niña», pasa las dos comprobaciones anteriores y **está resuelto
//      igual**: los artículos reparten los huecos sin latín. No es sólo el
//      artículo — el adjetivo, el participio y el clítico concuerdan
//      también, así que enumerar los canales es perder. La clase se cierra
//      por construcción: **los dos candidatos comparten género y número**,
//      y entonces ninguna concordancia española puede distinguirlos.
//      Cuesta pares (`fīlius`/`māter` queda fuera) y a cambio la fuga no
//      existe en vez de estar vigilada.
//
// Las dos producen ítems impecables que no miden nada, y ninguna es
// propiedad de una palabra: hay que mirar el ítem entero.
//
// Si el formato no admite este gate, es mejor saberlo con UN punto que
// con cuarenta y seis.

export interface PalabraGlosada {
  /** La palabra latina, tal como aparece. */
  la: string;
  /** Su glosa española palabra por palabra, sin reordenar. */
  es: string;
  /** El papel que juega, si es uno de los que el ítem examina. */
  rol?: 'sujeto' | 'objeto' | 'verbo';
  /** Género y número DE LA GLOSA ESPAÑOLA, obligatorios en las palabras
   *  con rol de sujeto u objeto: son lo que cierra la fuga morfológica. */
  gen?: 'm' | 'f';
  num?: 'sg' | 'pl';
}

export interface ItemClozeGlosa {
  id: string;
  /** El punto del inventario que examina. */
  punto: string;
  /** La frase latina completa. */
  latin: string;
  /** Palabra a palabra, EN EL ORDEN DEL LATÍN. */
  palabras: PalabraGlosada[];
  /** La glosa española con `___` donde van los huecos. */
  glosa: string;
  /** Las respuestas, en el orden de los huecos. */
  respuestas: string[];
  /** Por qué los dos candidatos son plausibles en los dos papeles. Sin
   *  esto el sentido común resuelve el ítem y la desinencia sobra. */
  reversible: string;
  /** Los ejes por los que este ítem se distingue de sus hermanos. Existen
   *  porque «ocho ítems pueden ser uno repetido ocho veces»: sin una
   *  dimensión declarada, el lote parece variado y no varía nada. */
  ejes: EjesItem;
}

export interface EjesItem {
  /** Sólo los órdenes en que el objeto PRECEDE al sujeto son utilizables
   *  aquí: SOV y VSO coinciden con el español y el ítem sale gratis.
   *
   *  Los cinco caben en el tipo A PROPÓSITO, y es una corrección: dejarlo
   *  en los tres buenos hacía IRREPRESENTABLE el ítem que el gate existe
   *  para cazar, y un gate que no puede recibir su caso malo no se puede
   *  probar. Quien rechaza SOV y VSO es la comprobación, no el tipo.
   *
   *  Y el campo se COMPRUEBA contra los datos en vez de creerse: es una
   *  etiqueta escrita a mano sobre una frase, o sea justo la clase de dato
   *  que se desincroniza sin que falle nada. */
  orden: 'OSV' | 'OVS' | 'VOS' | 'SOV' | 'VSO';
  conjugacion: 1 | 2 | 3 | 4;
  declinacion: '1ª' | '2ª' | '1ª-masc' | 'mixta';
  numero: 'sg' | 'pl';
}

export type ClaseFallo =
  | 'huecos-y-respuestas'
  | 'pista-posicional'
  | 'no-reversible'
  | 'hueco-fuera-del-rol'
  | 'glosa-no-cuadra'
  | 'fuga-morfologica'
  | 'ejes-repetidos'
  | 'eje-mal-declarado';

export interface FalloClozeGlosa { item: string; clase: ClaseFallo; detalle: string }

const HUECO = /___/g;

const norm = (s: string) => s.normalize('NFC').toLowerCase().replace(/[.,;:!?¿¡]/g, '').trim();

/** LA COMPROBACIÓN CENTRAL, y la que justifica todo el fichero.
 *
 *  Simula al alumno que traduce en el orden del latín sin mirar las
 *  desinencias: toma las glosas palabra a palabra EN EL ORDEN LATINO y
 *  ve con qué rellenaría los huecos. Si eso da las respuestas correctas,
 *  **el ítem se resuelve sin gramática y hay que rehacerlo**.
 *
 *  No es una heurística sobre el texto: es ejecutar la estrategia del
 *  alumno y comprobar si funciona. */
export function respuestaPosicional(item: ItemClozeGlosa): string[] {
  const conRol = item.palabras.filter((p) => p.rol === 'sujeto' || p.rol === 'objeto');
  // El lector posicional asigna sujeto al PRIMERO y objeto al segundo,
  // que es la regla del español.
  const enOrden = conRol.map((p) => p.es);
  const huecos = (item.glosa.match(HUECO) ?? []).length;
  return enOrden.slice(0, huecos);
}

export function revisarClozeGlosa(item: ItemClozeGlosa): FalloClozeGlosa[] {
  const out: FalloClozeGlosa[] = [];
  const push = (clase: ClaseFallo, detalle: string) => out.push({ item: item.id, clase, detalle });

  const huecos = (item.glosa.match(HUECO) ?? []).length;
  if (huecos === 0) push('huecos-y-respuestas', 'la glosa no tiene ningún hueco `___`');
  if (huecos !== item.respuestas.length) {
    push('huecos-y-respuestas', `${huecos} huecos y ${item.respuestas.length} respuestas`);
  }

  // La glosa palabra a palabra tiene que reconstruir la frase latina.
  const enItem = item.palabras.map((p) => norm(p.la)).join(' ');
  const enFrase = norm(item.latin).split(/\s+/).join(' ');
  if (enItem !== enFrase) {
    push('glosa-no-cuadra', `las palabras glosadas no reconstruyen la frase: «${enItem}» contra «${enFrase}»`);
  }

  // ── (1) la pista posicional ──
  const pos = respuestaPosicional(item).map(norm);
  const esp = item.respuestas.map(norm);
  if (pos.length === esp.length && pos.length > 0 && pos.every((x, i) => x === esp[i])) {
    push('pista-posicional',
      `traducir en el orden del latín da las respuestas correctas (${pos.join(', ')}): el ítem se resuelve SIN mirar la desinencia. El orden latino tiene que contradecir al español`);
  }

  // ── (2) el sentido común ──
  if (!item.reversible || item.reversible.trim().length < 20) {
    push('no-reversible',
      'sin declarar por qué los dos candidatos son plausibles en los dos papeles: si sólo uno puede ser agente, la desinencia sobra y el ítem lo resuelve el sentido común');
  }

  // ── (3) el hueco cae sobre el rasgo que el punto enseña ──
  const roles = item.palabras.filter((p) => p.rol === 'sujeto' || p.rol === 'objeto');
  if (roles.length < 2) {
    push('hueco-fuera-del-rol', 'el ítem no declara DOS palabras con rol de sujeto y objeto: sin las dos no hay ambigüedad que resolver');
  }
  const respSet = new Set(esp);
  const rolesEs = new Set(roles.map((p) => norm(p.es)));
  for (const r of respSet) {
    if (!rolesEs.has(r)) {
      push('hueco-fuera-del-rol',
        `la respuesta «${r}» no es ninguna de las palabras con rol: el hueco no cae sobre el rasgo que el punto enseña`);
    }
  }

  // ── (3) la fuga morfológica: cerrada por construcción ──
  const sinRasgos = roles.filter((p) => !p.gen || !p.num);
  if (sinRasgos.length > 0) {
    push('fuga-morfologica',
      `sin género/número declarados en ${sinRasgos.map((p) => `«${p.es}»`).join(', ')}: no se puede comprobar que la concordancia española no reparta los huecos sola`);
  } else if (roles.length >= 2) {
    const rasgos = new Set(roles.map((p) => `${p.gen}${p.num}`));
    if (rasgos.size > 1) {
      push('fuga-morfologica',
        `los candidatos no comparten género y número (${roles.map((p) => `«${p.es}» ${p.gen}/${p.num}`).join(', ')}): el artículo, el adjetivo o el clítico de la glosa reparten los huecos SIN latín`);
    }
  }

  return out;
}

/** El orden REAL, leído de las palabras, no de la etiqueta. */
export function ordenReal(item: ItemClozeGlosa): string | null {
  const sig = item.palabras
    .map((p) => (p.rol === 'sujeto' ? 'S' : p.rol === 'objeto' ? 'O' : p.rol === 'verbo' ? 'V' : ''))
    .join('');
  return /^[SOV]{3}$/.test(sig) ? sig : null;
}

/** El lote entero, no el ítem: comprueba que no hay dos ítems idénticos en
 *  todos sus ejes. Es la contracara de «ocho ítems, uno repetido ocho
 *  veces» — y aquí la invariancia NO es propiedad de la lengua, porque el
 *  latín sí ofrece tres órdenes, cuatro conjugaciones y dos números. */
export function revisarLote(items: ItemClozeGlosa[]): FalloClozeGlosa[] {
  const out = items.flatMap(revisarClozeGlosa);
  for (const it of items) {
    const real = ordenReal(it);
    if (real && real !== it.ejes.orden) {
      out.push({ item: it.id, clase: 'eje-mal-declarado', detalle: `declara orden ${it.ejes.orden} y la frase es ${real}` });
    }
  }
  const vistos = new Map<string, string>();
  for (const it of items) {
    const k = `${it.ejes.orden}|${it.ejes.conjugacion}|${it.ejes.declinacion}|${it.ejes.numero}`;
    const antes = vistos.get(k);
    if (antes) {
      out.push({ item: it.id, clase: 'ejes-repetidos', detalle: `mismos ejes que «${antes}» (${k}): desde el alumno los dos ítems son el mismo` });
    } else {
      vistos.set(k, it.id);
    }
  }
  return out;
}
