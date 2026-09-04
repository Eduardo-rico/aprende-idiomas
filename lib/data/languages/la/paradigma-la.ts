// lib/data/languages/la/paradigma-la.ts
//
// LA MÁQUINA DE FORMAS DE L1: 1.ª y 2.ª declinación, presente de indicativo
// de las cuatro conjugaciones.
//
// El riesgo de una máquina así está medido en este proyecto: en rumano una
// regla enunciada con la alternancia equivocada se replicó en cientos de
// formas generadas. Aquí la defensa son tres comprobaciones, y **dos de
// ellas no consultan esta máquina**:
//
//   1. la cantidad, contra el lexicón de `cantidad.ts` (que a su vez está
//      auditado por los reflejos romances, que no consultan el lexicón);
//   2. la atestación, contra 227.300 tokens de treebank UD;
//   3. las excepciones declaradas en el inventario, que son la parte que
//      una regla bonita se come.
//
// ── LA ENTRADA ES LEMA + GENITIVO, NO EL NOMINATIVO ───────────────────
//
// Es el punto `l2-genitivo-clave`: de «rēx» no se deduce nada, de «rēgis»
// sale todo. La máquina deriva el tema del GENITIVO, así que `puer/puerī`
// y `ager/agrī` salen bien sin regla especial — la síncopa está en el
// dato, no en el código.

export type Caso = 'nom' | 'ac' | 'gen' | 'dat' | 'abl' | 'voc';
export type Numero = 'sg' | 'pl';

export interface EntradaNominal {
  lema: string;      // nominativo singular, macronizado
  genitivo: string;  // genitivo singular, macronizado — de aquí sale el tema
  genero: 'm' | 'f' | 'n';
  glosa: string;
  /** Sin plural. `Iēsus` no lo tiene, y sin declararlo `paradigmaNominal`
   *  cae en `declinacionDe` y revienta con un genitivo que no es de
   *  ninguna de las cinco. */
  soloSingular?: boolean;
  /** Sólo en la 3.ª: si el tema es en `-i`. No se deduce de la forma
   *  —`urbs/urbis` lo es y `rēx/rēgis` no— así que es DATO, como el
   *  genitivo. Cambia el genitivo plural (`-ium`) y, en los neutros, el
   *  ablativo singular (`-ī`) y el nominativo plural (`-ia`). */
  iStem?: boolean;
}

/** Terminaciones. El orden es [nom, ac, gen, dat, abl, voc]. */
const N1: Record<Numero, string[]> = {
  sg: ['a', 'am', 'ae', 'ae', 'ā', 'a'],
  pl: ['ae', 'ās', 'ārum', 'īs', 'īs', 'ae'],
};
const N2: Record<Numero, string[]> = {
  sg: ['us', 'um', 'ī', 'ō', 'ō', 'e'],
  pl: ['ī', 'ōs', 'ōrum', 'īs', 'īs', 'ī'],
};
const N2_NEUTRO: Record<Numero, string[]> = {
  sg: ['um', 'um', 'ī', 'ō', 'ō', 'um'],
  pl: ['a', 'a', 'ōrum', 'īs', 'īs', 'a'],
};
// La 3.ª. El nominativo singular NO es derivable del tema —`rēx` contra
// `rēg-`, `nōmen` contra `nōmin-`, `opus` contra `oper-`— así que es el
// lema quien lo pone, igual que en los `-er` de la 2.ª. Es el punto
// `l2-genitivo-clave` otra vez: de la forma de diccionario no sale nada;
// del genitivo sale todo.
const N3: Record<Numero, string[]> = {
  sg: ['', 'em', 'is', 'ī', 'e', ''],
  pl: ['ēs', 'ēs', 'um', 'ibus', 'ibus', 'ēs'],
};
const N3_NEUTRO: Record<Numero, string[]> = {
  sg: ['', '', 'is', 'ī', 'e', ''],
  pl: ['a', 'a', 'um', 'ibus', 'ibus', 'a'],
};
const N4: Record<Numero, string[]> = {
  sg: ['us', 'um', 'ūs', 'uī', 'ū', 'us'],
  pl: ['ūs', 'ūs', 'uum', 'ibus', 'ibus', 'ūs'],
};
const N4_NEUTRO: Record<Numero, string[]> = {
  sg: ['ū', 'ū', 'ūs', 'ū', 'ū', 'ū'],
  pl: ['ua', 'ua', 'uum', 'ibus', 'ibus', 'ua'],
};
const N5: Record<Numero, string[]> = {
  sg: ['ēs', 'em', 'eī', 'eī', 'ē', 'ēs'],
  pl: ['ēs', 'ēs', 'ērum', 'ēbus', 'ēbus', 'ēs'],
};
const ORDEN: Caso[] = ['nom', 'ac', 'gen', 'dat', 'abl', 'voc'];

export type Declinacion = '1ª' | '2ª' | '3ª' | '4ª' | '5ª';

// ── EL ORDEN DE ESTAS COMPROBACIONES ES EL ARREGLO ───────────────────
//
// La versión anterior miraba `-ī` antes que nada y la 5.ª cae dentro: el
// genitivo de `rēs` es `reī`, que acaba en `ī`. Resultado, sin lanzar y
// sin avisar:
//
//     rēs → *reus *reum reī *reō | *reī *reōs *reōrum *reīs
//
// Y **`reus` es una palabra latina real** —«el acusado», 15 tokens en el
// treebank— así que una comprobación por atestación habría dicho que sí.
// Es el fallo que devuelve un número plausible: ni error ni cero, sino la
// forma de al lado. La 4.ª sí lanzaba; la 5.ª pasaba en silencio.
//
// Aviso declarado: `-ēī` también es el genitivo de los propios en `-ēius`
// (`Pompēius` → `Pompēī`). Si algún día entra uno, hay que distinguirlo
// por dato y no por final, como ya se hace con el tema en `-i`.
export function declinacionDe(e: EntradaNominal): Declinacion {
  const g = e.genitivo.normalize('NFC');
  if (g.endsWith('ae')) return '1ª';
  if (/[eē]ī$/.test(g)) return '5ª';       // ANTES que la 2.ª: `reī` acaba en `ī`
  if (g.endsWith('ūs')) return '4ª';
  if (g.endsWith('is')) return '3ª';
  if (g.endsWith('ī')) return '2ª';
  throw new Error(`genitivo «${g}» no es de ninguna de las cinco declinaciones`);
}

const temaDe = (e: EntradaNominal) =>
  e.genitivo.normalize('NFC').replace(/([eē]ī|ae|ūs|is|ī)$/, '');

// ── IRREGULARES DECLARADOS, uno por uno y con su cuenta ──────────────
//
// No es una clase productiva: son préstamos griegos que la Vulgata declina
// a la griega. `Iēsus` es el nombre propio más frecuente del corpus —846
// apariciones— y su paradigma medido es nominativo `Iēsus`, acusativo
// `Iēsum` y **`Iēsū` en todo lo demás** (genitivo 128, ablativo 88, dativo
// 10, vocativo 9). Una máquina de reglas no lo produce, y fingir que sí
// habría dado `*Iēse` en el vocativo — que es la forma que el alumno
// nunca ve y la que la regla del `-us` predice.
//
// Van aquí y no como excepción de otro punto, que es el error que ya
// costó tres veces.
const IRREGULARES: Record<string, Partial<Record<`${Caso}.${Numero}`, string>>> = {
  'Iēsus': {
    'nom.sg': 'Iēsus', 'ac.sg': 'Iēsum', 'gen.sg': 'Iēsū',
    'dat.sg': 'Iēsū', 'abl.sg': 'Iēsū', 'voc.sg': 'Iēsū',
  },
};

export function declinar(e: EntradaNominal, caso: Caso, num: Numero): string {
  const irr = IRREGULARES[e.lema.normalize('NFC')]?.[`${caso}.${num}` as `${Caso}.${Numero}`];
  if (irr) return irr;
  const decl = declinacionDe(e);
  const tema = temaDe(e);
  const i = ORDEN.indexOf(caso);

  if (decl === '1ª') return tema + N1[num]![i]!;

  if (decl === '5ª') return tema + N5[num]![i]!;

  if (decl === '4ª') {
    const t4 = e.genero === 'n' ? N4_NEUTRO : N4;
    return tema + t4[num]![i]!;
  }

  if (decl === '3ª') {
    // Nominativo, acusativo y vocativo del neutro, y nominativo y
    // vocativo de los demás: la forma es el LEMA, no el tema + desinencia.
    const esLema = num === 'sg' && (caso === 'nom' || caso === 'voc' || (e.genero === 'n' && caso === 'ac'));
    if (esLema) return e.lema.normalize('NFC');
    const t3 = e.genero === 'n' ? N3_NEUTRO : N3;
    let d = t3[num]![i]!;
    if (e.iStem) {
      if (caso === 'gen' && num === 'pl') d = 'ium';
      if (e.genero === 'n' && num === 'sg' && caso === 'abl') d = 'ī';
      if (e.genero === 'n' && num === 'pl' && (caso === 'nom' || caso === 'ac' || caso === 'voc')) d = 'ia';
    }
    return tema + d;
  }

  // ── 2.ª ──
  const tabla = e.genero === 'n' ? N2_NEUTRO : N2;
  // Los `-er` y los `-ir` no tienen desinencia en nominativo ni vocativo
  // singular: la forma es el lema. `puer/puerī` conserva la e y
  // `ager/agrī` la pierde, y las dos salen del genitivo sin regla aparte.
  const sinDesinencia = /(er|ir)$/.test(e.lema.normalize('NFC')) && e.genero !== 'n';
  if (num === 'sg' && sinDesinencia && (caso === 'nom' || caso === 'voc')) return e.lema.normalize('NFC');

  // LA EXCEPCIÓN DECLARADA (Allen & Greenough §49.c), y va aquí porque es
  // justo lo que una regla bonita se come: los NOMBRES PROPIOS en -ius,
  // más `fīlius` y `genius`, hacen vocativo en -ī y NO en -ie. La regla
  // no vale para los comunes en -ius. Atestiguado en el treebank:
  // fīlī 20, Pompōnī 7, Cornēlī 2, Tullī 2.
  //
  // El vocativo se forma por CONTRACCIÓN: la `-i-` del tema se funde con
  // la `-ī`, así que es `fīlī` y no `fīliī`. La primera versión devolvía
  // `tema + 'ī'` = `fīliī`, que además COLISIONA con el genitivo — y lo
  // cazó el gate de cantidad al rechazar `fīlī` como forma que la máquina
  // no produce. En el treebank: `fili` 13, `filie` 0.
  if (num === 'sg' && caso === 'voc' && /ius$/.test(e.lema.normalize('NFC'))) {
    const propio = /^\p{Lu}/u.test(e.lema);
    if (propio || ['fīlius', 'genius'].includes(e.lema.normalize('NFC'))) return tema.replace(/i$/, '') + 'ī';
  }
  return tema + tabla[num]![i]!;
}

export function paradigmaNominal(e: EntradaNominal): Record<string, string> {
  const out: Record<string, string> = {};
  const numeros = e.soloSingular ? (['sg'] as const) : (['sg', 'pl'] as const);
  for (const num of numeros) for (const caso of ORDEN) out[`${caso}.${num}`] = declinar(e, caso, num);
  return out;
}

// ── VERBO: presente de indicativo activo ──────────────────────────────

export type Conjugacion = 1 | 2 | 3 | 4;
export type Persona = '1sg' | '2sg' | '3sg' | '1pl' | '2pl' | '3pl';
const PERSONAS: Persona[] = ['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'];

export interface EntradaVerbal {
  lema: string;        // 1.ª sg del presente: `amō`
  infinitivo: string;  // `amāre` — de aquí sale la conjugación
  glosa: string;
}

/** Las terminaciones del presente. La vocal temática se ABREVIA ante -t y
 *  -nt finales (*brevis brevians*, A&G §603.f): por eso `amat` y no
 *  `amāt`, que es el error típico del material generado. */
const V: Record<Conjugacion, string[]> = {
  1: ['ō', 'ās', 'at', 'āmus', 'ātis', 'ant'],
  2: ['eō', 'ēs', 'et', 'ēmus', 'ētis', 'ent'],
  3: ['ō', 'is', 'it', 'imus', 'itis', 'unt'],
  4: ['iō', 'īs', 'it', 'īmus', 'ītis', 'iunt'],
};

// ── VERBOS IRREGULARES, declarados uno a uno ─────────────────────────
//
// `sum` es el verbo más frecuente del latín y no sale de ninguna regla:
// su infinitivo `esse` no encaja en las cuatro conjugaciones y su tema
// alterna (`s-`/`es-`/`er-`/`fu-`). Una máquina que lo intentara derivar
// produciría formas que no existen; declararlo es más honesto y más corto.
//
// El imperfecto lo trae porque el propio inventario lo señala como la
// trampa del punto: «los dos verbos más frecuentes del nivel NO llevan
// infijo — `sum` hace `eram`, no *`esbam`».
const VERBOS_IRREGULARES: Record<string, Partial<Record<`${Tiempo}.${Persona}`, string>>> = {
  'sum': {
    'presente.1sg': 'sum', 'presente.2sg': 'es', 'presente.3sg': 'est',
    'presente.1pl': 'sumus', 'presente.2pl': 'estis', 'presente.3pl': 'sunt',
    'imperfecto.1sg': 'eram', 'imperfecto.2sg': 'erās', 'imperfecto.3sg': 'erat',
    'imperfecto.1pl': 'erāmus', 'imperfecto.2pl': 'erātis', 'imperfecto.3pl': 'erant',
    'futuro.1sg': 'erō', 'futuro.2sg': 'eris', 'futuro.3sg': 'erit',
    'futuro.1pl': 'erimus', 'futuro.2pl': 'eritis', 'futuro.3pl': 'erunt',
  },
};

export type Conjugacion5 = Conjugacion | 'mixta';

// ── LA MIXTA NO FALTABA: SALÍA MAL ───────────────────────────────────
//
// Los verbos en `-iō` de la 3.ª —`capiō/capere`, `faciō/facere`— tienen
// infinitivo en `-ere`, así que la versión anterior los mandaba a la 3.ª y
// producía `*capō … *capunt`. Lo correcto es `capiō … capiunt`
// (Allen & Greenough, verbos en -iō de la tercera). En el treebank:
// `capō` 0, `capunt` 0, `facō` 0, `facunt` 0, frente a `faciō` 35 y
// `faciunt` 34 — y `faciō` es el lema n.º 19 del corpus.
//
// Dos puntos de L1 la declaran obligatoria: `l5-presente` («las cinco
// clases») y `l5-conjugacion-por-infinitivo`, cuyo `varia` dice «hay que
// traer la mixta, que es la que nadie ve». Se reconoce por el LEMA en
// `-iō` con infinitivo en `-ere`: ninguno de los dos solo basta.
const V_MIXTA: string[] = ['ō', 'is', 'it', 'imus', 'itis', 'iunt'];
const IMPERFECTO_MIXTA = ['iēbam', 'iēbās', 'iēbat', 'iēbāmus', 'iēbātis', 'iēbant'];
const FUTURO_MIXTA = ['iam', 'iēs', 'iet', 'iēmus', 'iētis', 'ient'];

export function esMixta(e: EntradaVerbal): boolean {
  const inf = e.infinitivo.normalize('NFC');
  return /iō$/.test(e.lema.normalize('NFC')) && inf.endsWith('ere') && !inf.endsWith('īre');
}

export function conjugacionDe(e: EntradaVerbal): Conjugacion {
  const inf = e.infinitivo.normalize('NFC');
  if (inf.endsWith('āre')) return 1;
  if (inf.endsWith('ēre')) return 2;
  if (inf.endsWith('īre')) return 4;
  if (inf.endsWith('ere')) return 3;
  throw new Error(`infinitivo «${inf}» no es de ninguna de las cuatro`);
}

const temaVerbal = (e: EntradaVerbal) =>
  e.infinitivo.normalize('NFC').replace(/(āre|ēre|īre|ere)$/, '');

// ── IMPERFECTO Y FUTURO ───────────────────────────────────────────────
//
// El imperfecto tiene UN infijo para las cinco clases (`-bā-` en la 1.ª y
// la 2.ª, `-ēbā-` en las otras): regla única, valor transferible.
//
// El futuro tiene DOS, y ahí está el punto `l5-futuro-dos-formas`:
// `-bō/-bi-` en la 1.ª y la 2.ª contra `-am/-ē-` en la 3.ª y la 4.ª. Dos
// reglas presentadas como una es como se fabrica un error sistemático: el
// alumno que aprende `amābit` produce *`dūcēbit` por `dūcet`.
//
// Y la homonimia declarada, que es de LECTURA y no de producción: la 1.ª
// persona del futuro de la 3.ª y la 4.ª —`dūcam`, `audiam`— es idéntica al
// presente de subjuntivo. Sólo el contexto las separa.
const IMPERFECTO: Record<Conjugacion, string[]> = {
  1: ['ābam', 'ābās', 'ābat', 'ābāmus', 'ābātis', 'ābant'],
  2: ['ēbam', 'ēbās', 'ēbat', 'ēbāmus', 'ēbātis', 'ēbant'],
  3: ['ēbam', 'ēbās', 'ēbat', 'ēbāmus', 'ēbātis', 'ēbant'],
  4: ['iēbam', 'iēbās', 'iēbat', 'iēbāmus', 'iēbātis', 'iēbant'],
};
const FUTURO: Record<Conjugacion, string[]> = {
  1: ['ābō', 'ābis', 'ābit', 'ābimus', 'ābitis', 'ābunt'],
  2: ['ēbō', 'ēbis', 'ēbit', 'ēbimus', 'ēbitis', 'ēbunt'],
  3: ['am', 'ēs', 'et', 'ēmus', 'ētis', 'ent'],
  4: ['iam', 'iēs', 'iet', 'iēmus', 'iētis', 'ient'],
};

export type Tiempo = 'presente' | 'imperfecto' | 'futuro';
const TABLA: Record<Tiempo, Record<Conjugacion, string[]>> = { presente: V, imperfecto: IMPERFECTO, futuro: FUTURO };

export function conjugar(e: EntradaVerbal, p: Persona, tiempo: Tiempo = 'presente'): string {
  const irr = VERBOS_IRREGULARES[e.lema.normalize('NFC')]?.[`${tiempo}.${p}` as `${Tiempo}.${Persona}`];
  if (irr) return irr;
  if (esMixta(e)) {
    const tabla = tiempo === 'presente' ? V_MIXTA : tiempo === 'imperfecto' ? IMPERFECTO_MIXTA : FUTURO_MIXTA;
    const tema = e.infinitivo.normalize('NFC').replace(/ere$/, '');
    // La 1.ª sg del presente es el LEMA (`capiō`), no tema + ō.
    if (tiempo === 'presente' && p === '1sg') return e.lema.normalize('NFC');
    return tema + tabla[PERSONAS.indexOf(p)]!;
  }
  const c = conjugacionDe(e);
  return temaVerbal(e) + TABLA[tiempo][c]![PERSONAS.indexOf(p)]!;
}

/** Qué marca de futuro le toca. Es el eje binario del punto. */
export function marcaDeFuturo(e: EntradaVerbal): 'bi' | 'e' | 'irregular' {
  if (VERBOS_IRREGULARES[e.lema.normalize('NFC')]) return 'irregular';
  return conjugacionDe(e) <= 2 ? 'bi' : 'e';
}

export function paradigmaVerbal(e: EntradaVerbal, tiempo: Tiempo = 'presente'): Record<Persona, string> {
  return Object.fromEntries(PERSONAS.map((p) => [p, conjugar(e, p, tiempo)])) as Record<Persona, string>;
}

/** Los tres tiempos que L1 declara, en una sola llamada. */
export function infectum(e: EntradaVerbal): Record<string, string> {
  const out: Record<string, string> = {};
  for (const t of ['presente', 'imperfecto', 'futuro'] as Tiempo[])
    for (const p of PERSONAS) out[`${t}.${p}`] = conjugar(e, p, t);
  // EL INFINITIVO, que existía en el tipo, lo leía `conjugacionDe` y NUNCA
  // SE EMITÍA. Como el gate de cantidad se construye desde aquí, rechazaba
  // `amāre`, `vidēre`, `dūcere`, `audīre` y `esse` — las cuatro segundas
  // partes y la del verbo más frecuente. Y el punto
  // `l5-conjugacion-por-infinitivo` ES reconocer la conjugación por ellas.
  out['infinitivo'] = e.infinitivo.normalize('NFC');
  return out;
}

// ── ADJETIVO DE LA PRIMERA CLASE (bonus / bona / bonum) ───────────────
//
// Declina como la 2.ª en masculino y neutro y como la 1.ª en femenino, o
// sea que **la máquina ya existe**: un adjetivo es tres entradas
// nominales que comparten tema. Se construyen aquí en vez de duplicar las
// tablas, porque una regla copiada se desincroniza en la copia N+1.
//
// Lo que este tipo NO cubre y se dice en vez de disimularse: los
// adjetivos de la 3.ª (`ācer`, `omnis`, `fēlīx`), que son el punto
// `l4-adjetivo-3a` y necesitan la 3.ª declinación en la máquina.

export interface EntradaAdjetivo {
  /** Nominativo singular masculino: `bonus`, `magnus`, `pulcher`. */
  lema: string;
  /** El tema, que en los `-er` no se deduce del lema (`pulcher/pulchr-`,
   *  `miser/miser-`). Mismo motivo que el genitivo en los nombres. */
  tema: string;
  glosa: string;
}

export function declinarAdjetivo(a: EntradaAdjetivo, genero: 'm' | 'f' | 'n', caso: Caso, num: Numero): string {
  const t = a.tema.normalize('NFC');
  const como: EntradaNominal =
    genero === 'f' ? { lema: t + 'a', genitivo: t + 'ae', genero: 'f', glosa: a.glosa }
    : genero === 'n' ? { lema: t + 'um', genitivo: t + 'ī', genero: 'n', glosa: a.glosa }
    : { lema: a.lema, genitivo: t + 'ī', genero: 'm', glosa: a.glosa };
  return declinar(como, caso, num);
}

/** La forma que concuerda con un sustantivo en una celda dada. El género
 *  lo pone el SUSTANTIVO, no la desinencia — que es el punto entero. */
export function concuerda(a: EntradaAdjetivo, n: EntradaNominal, caso: Caso, num: Numero): string {
  return declinarAdjetivo(a, n.genero, caso, num);
}

// ── TODO LO QUE ESTA MÁQUINA PRODUCE, EN UN SOLO SITIO ────────────────
//
// Existe porque el hueco se abrió TRES veces con la misma forma: se añade
// algo a la máquina —los adjetivos, luego el imperfecto y el futuro— y el
// comprobador de cantidad y el congelador de atestación se quedan atrás,
// **en verde**, porque nadie los tocó. Cada consumidor tenía su propia
// lista de qué enumerar, y una lista copiada se desincroniza en la copia
// que nadie actualizó.
//
// Quien quiera «todas las formas» llama aquí. Añadir un tiempo o una
// clase se hace en un sitio y llega a todos.
export function todasLasFormas(
  nombres: EntradaNominal[], verbos: EntradaVerbal[], adjetivos: EntradaAdjetivo[],
  indeclinables: string[] = [],
): { clave: string; forma: string }[] {
  const out: { clave: string; forma: string }[] = [];
  for (const f of indeclinables) out.push({ clave: `${f}.indecl`, forma: f });
  for (const e of nombres)
    for (const [c, f] of Object.entries(paradigmaNominal(e))) out.push({ clave: `${e.lema}.${c}`, forma: f });
  for (const e of verbos)
    for (const [c, f] of Object.entries(infectum(e))) out.push({ clave: `${e.lema}.${c}`, forma: f });
  for (const a of adjetivos)
    for (const g of ['m', 'f', 'n'] as const)
      for (const num of ['sg', 'pl'] as Numero[])
        for (const c of ORDEN) out.push({ clave: `${a.lema}.${g}.${c}.${num}`, forma: declinarAdjetivo(a, g, c, num) });
  return out;
}
