// scripts/lotes/trans-ro-l28.ts — LOTE 28: `r6-contracciones-cliticos`.
//
//   npx tsx scripts/lotes/trans-ro-l28.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-ro-l28.ts --asigna   # a qué punto cuenta cada ítem
//
// Sexto punto de la máquina de transformación y **cuarto re-encuadrado
// ANTES de escribir un ítem**. La precondición del §3.1 —¿la mitad útil de
// este punto vive ya en otro sitio?— la traía escrita el relevo como aviso
// para los dos puntos de `r6`, y se cumplió más de lo que el aviso decía.
//
// ══ 1 · TRES CASILLAS DEL PUNTO ESTÁN PUBLICADAS BAJO OTRO NOMBRE ════
//
// El aviso del relevo apuntaba a `r6-cliticos-acusativo`. El dictamen
// encontró TRES puntos, y uno no estaba en ninguna lista:
//
//   · **`r3-negacion-nu`** (A1, cloze, 8 ítems) publica SEIS contracciones
//     con guion: `n-am`, `nu-l`, `nu-mi`, `n-au`, `nu-i`, `n-ai`. O sea que
//     `nu ți-l dau` —la casilla que la `cita` de este punto declara— está
//     cobrada, y cobrada un año antes.
//   · **`r6-doblado-cliticos`** produce `l-am văzut` y `i-am sunat`, y su
//     `explanationEs` publica LA REGLA: «delante de un auxiliar que empieza
//     por vocal se apoya en él: i-am sunat. El guion no es opcional: es la
//     forma que tiene el clítico ahí».
//   · **`r3-dativo-experimentante`** (A1) produce `Mi-e foame`, `Ți-e frig`,
//     `i-e cald` ×5, y de regalo `pune-i o haină` ×2, que es enclisis con
//     imperativo — o sea contenido del punto HERMANO.
//
// ══ 2 · Y LA COLOCACIÓN ENTERA ES GRATIS, POR DOS VÍAS ═══════════════
//
// El alumno llega con español y con **portugués europeo C2**, y el §4.35
// cuenta como estrategia libre lo que produzca por transferencia aunque
// coincida con lo que el punto declara enseñar:
//
//   | pieza que el punto declara | quién se la da hecha |
//   |---|---|
//   | orden dativo < acusativo | es. «me lo dio» · pt. `deu-mo` |
//   | proclisis con verbo finito | es. «me lo ha dado» |
//   | el clítico cuelga del AUXILIAR, no del participio | es. «me lo ha dado» · pt. `tinha-mo dado`, y el portugués NUNCA lo cuelga del participio |
//   | que un clítico se pegue con guion | pt. `dá-mo`, `vê-lo`, `deu-lho` |
//
// **O sea que este punto no es de colocación de clíticos: la colocación no
// tiene nada que enseñarle. Es de ORTOGRAFÍA — de qué lado se pega el
// guion y dónde NO se pega —, y su `descripcion` nombraba como contenido
// justo lo que el alumno trae hecho.** Es el defecto del lote 27 otra vez.
//
// Y la línea que ningún punto del inventario decía y que es la clave del
// punto: **el guion portugués marca ENCLISIS; el rumano marca SÍLABA.**
// Por eso `l-am văzut` lleva guion siendo PROCLÍTICO, cosa que el
// portugués no hace jamás (`não me deu`, sin guion).
//
// ══ 3 · MI OBJECIÓN DE VARIANZA, Y POR QUÉ EL LINGÜISTA LA REFUTÓ ════
//
// Su primer dictamen daba CINCO ítems con cinco «salidas ortográficas»
// distintas. Se le devolvió la pregunta obligatoria del §4.25 —¿qué VARÍA
// entre los ítems?— con una regla candidata que las predecía las cinco:
// «el clítico se reduce y se pega con guion al entrar en contacto con una
// VOCAL». Si valiera, la ortografía tendría cobertura real 1 y no 5.
//
// **No vale, y los contraejemplos son datos del corpus del proyecto:**
//
//   · `ți-l` **103** frente a `ți le` **83**. En los dos hay `ți` + un
//     clítico de consonante inicial: **cero contacto vocálico en ambos**, y
//     uno lleva guion y el otro no. Lo que los separa no es la vocal, es que
//     `l` **no puede formar sílaba** y `le` sí.
//   · `a văzut-o` **16** con `văzut` acabado en consonante: guion sin
//     contacto vocálico ninguno.
//   · `nu-l` / `nu îl`: contacto vocálico, y ahí la contracción es
//     **OPCIONAL** (así está publicado en `r3-negacion-nu`).
//
// La regla verdadera es la **SILABICIDAD**: el guion pega al clítico que no
// puede formar sílaba propia. Y con eso el propio lingüista concedió que
// tres de sus cinco salidas COLAPSAN en una sola cobertura. Lo que
// sobrevive son dos hechos que la silabicidad no da.
//
// ══ 4 · EL EJE DEL ALOMORFO MURIÓ DOS VECES, Y LA SEGUNDA ES LA BUENA ═
//
// Queda escrito porque es contenido REAL que este lote no publica.
//
// **Primera muerte, FALSA.** El lingüista descartó el eje `ne→ni`, `vă→vi`,
// `le→li` con una tabla que daba `ne l-a` 30 frente a `ni l-a` 22 y `ne le`
// 86 frente a `ni le` 36 — «las dos series atestadas, y la no reducida más
// frecuente». **Estaba contado con la CLI, que NO pone límite de palabra**,
// y el gate sí (§4.38). Con límite: `ne l-a` **1**, `ne le` **1**, `le-l`
// **0**, `le l-a` **0**, frente a `ni-l` 20, `ni le` 20, `vi-l` 17, `vi le`
// 18. Y leídos con `--ctx`, el único hit de `ne l-a` es `du-ne` + `l-a`
// («Du-ne l-a noastră căsuță») y los de la CLI eran `casne l-au`, `cine
// l-a`, `pline L-a`, `vine lesne`, `tine le fac`, `mine leșinată`. **La
// serie reducida es la única viva.** Es §4.38 exacto, cometido por él y
// cazado porque los dos contamos por separado.
//
// **Segunda muerte, VERDADERA: la frontera no está determinada.** Con el
// eje resucitado, su ítem de frontera era `Profesorul ne dă cartea` →
// `Profesorul ne-o dă`, con `ne-o` **52** frente a `ni-o` **2**. Pero 2 no
// es 0, y los dos hits son clusters reales leídos con contexto: «nu cum
// **ni-o** plănuim noi» y «să găsim pe cineva să **ni-o** dea la telegraf»
// (Caragiale). O sea que `Profesorul ni-o dă` es **rumano atestado que la
// clave suspendería** — el `Doi dintre prietenii Mariei` del lote 25 y el
// numeral en cifras del 26 en su cuarta piel. Preguntado si DOOM3 o GALR
// PROSCRIBEN `ni-o`, la respuesta fue que describen la distribución y no la
// proscriben: bajo §0.3 `ni-o` es **rara, no mala**.
//
// Y el ítem de frontera no se puede quitar dejando el otro, porque publicar
// `ni le` sin él enseña «reduce siempre el dativo», que es exactamente la
// sobregeneralización que produce `*ni-o` (§0.6). **Cae el par entero**, y
// el alomorfo queda anotado en la prosa del punto como contenido real que
// este formato no puede examinar hoy — igual que la mitad que perdió
// `r7-supin`.
//
// ══ 5 · LO QUE QUEDA: DOS COBERTURAS EN DOS PARES MÍNIMOS DE MARCO ═══
//
// Cuatro ítems, y la estructura es la defensa (§4.40), no el tamaño:
//
//   · **PAR 1 · la SILABICIDAD.** Mismo sujeto, mismo verbo, mismo dativo y
//     **el mismo sustantivo**: sólo cambia el NÚMERO del objeto, y con él si
//     el acusativo puede formar sílaba (`le`) o no (`o`). Dentro del par,
//     toda pista que sea propiedad del marco es constante y se cae sola.
//   · **PAR 2 · la POSICIÓN de `o`.** Mismo sujeto, mismo verbo, mismo
//     tiempo: sólo cambia el GÉNERO del objeto, y con él a qué lado del
//     participio va el clítico — `a văzut-o` **16** detrás, `l-a văzut`
//     **51** delante. Es lo único que el portugués contradice ACTIVAMENTE
//     (`tinha-o visto`), y no sale de la silabicidad, que no dice de qué
//     lado va nada.
//
// **Los dos ítems de frontera del §0.6 son la segunda cara del propio
// punto, no un apéndice cosido**, como en el lote 27: se falla en sentidos
// opuestos y quien acaba de aprender una cara comete la otra.
//
// ⚠ **La mitad masculina del par 2 (`l-a văzut`) repite material que
// `r6-doblado-cliticos` ya publica, y está aquí por el CONTRASTE, no como
// cobertura.** Sin ella el par no existe y «pon siempre el clítico detrás
// del participio» resuelve su mitad al 100 %. Va dicho para que nadie lo
// cuente dos veces.
//
// ══ 6 · Y EL NOMBRE DEL PUNTO MENTÍA ════════════════════════════════
//
// «Contracciones ortográficas **obligatorias**» es falso y lo contradice
// contenido publicado: `r3-negacion-nu` acepta `nu îl`, `nu îmi`, `nu am`
// como alternativas, o sea que con `nu` el guion es OPCIONAL. Con el
// auxiliar no lo es (`îl am` sale 14 veces con límite de palabra y **los 14
// son `a avea` LÉXICO** —«Îl am cadou», «numa pe el îl am»—, ni uno
// auxiliar; `o am luat` sale 1, Alecsandri, o sea §0.3 VIEJA). El nombre y
// la `descripcion` pasan a decir qué examina el punto.
import {
  verificar, informe, norm, type ItemTransRo, type Opciones, type Estrategia, type Comprobacion,
} from '../lib/transformacion-ro';
import { SUSTANTIVOS_A1, VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import {
  articulado, cliticAcuzativ, casillaAcuzativ, reducida, participio,
  CLITICOS_ACUZATIV, CLITICOS_DATIV, type Numero, type LemaNominal, type LemaVerbal,
} from '../lib/paradigma-ro';
import { informeAsigna } from '../lib/asigna-ro';

const PUNTO = 'r6-contracciones-cliticos';

const lema = (l: string): LemaNominal => {
  const v = SUSTANTIVOS_A1.find((x) => x.lema === l);
  if (!v) throw new Error(`el lote 28 pide «${l}», que no está en el lexicón`);
  return v;
};
const verbo = (i: string): LemaVerbal => {
  const v = VERBOS_A1.find((x) => x.inf === i);
  if (!v) throw new Error(`el lote 28 pide «${i}», que no está en el lexicón`);
  return v;
};

/** LA CONSIGNA, UNA SOLA PARA LOS CUATRO — y eso es un gate, no un ahorro.
 *
 *  Si cada par llevara la suya, la consigna diría la clase de respuesta y
 *  `dichoPorLaConsigna` apagaría el detector de orden; peor, el alumno
 *  leería en el enunciado lo que el ítem examina. Con una sola consigna la
 *  operación es idéntica en los cuatro y **lo único que decide la salida es
 *  el sustantivo de la fuente**, que es el punto.
 *
 *  Las tres cláusulas de la coda son la del lote 25, que el lingüista dejó
 *  dicho que se puede reutilizar porque cierra por PROPIEDADES y no hace
 *  ilegal la respuesta correcta:
 *
 *  **1 · «No añadas ningún complemento»** cierra el doblado con pronombre
 *  fuerte —`Ion mi-o dă MIE` es rumano correcto (GALR II, *Anticiparea și
 *  reluarea*)— sin nombrarlo y sin filtrar nada.
 *
 *  **2 · «no cambies el tiempo del verbo»** cierra el imperfecto (`îmi
 *  dădea`), el perfecto simple (`îmi dete`) y sobre todo **el futuro y el
 *  condicional, donde `o` vuelve a ser proclítica y hay DOS colocaciones
 *  atestadas** (`o voi vedea` / `voi vedea-o`). Sin ella el par 2 deja de
 *  estar determinado.
 *
 *  **3 · «ni el orden de las demás palabras»** cierra la dislocación
 *  `Cartea, mi-o dă`, que es rumano perfecto y es literalmente
 *  `r12-dislocacion-cliticos`. Dice «las DEMÁS» a propósito: el pronombre
 *  nuevo no es «lo que queda», así que la cláusula no le prohíbe colocarse
 *  donde toca — que era el defecto de «no añadas ni quites ninguna palabra»,
 *  con el que un alumno literal obedece y se le suspende.
 *
 *  ⚠ **Y lo que la consigna NO dice, a propósito: la palabra «guion».**
 *  Decir «con la contracción» o «júntalos con guion» regala los cuatro
 *  ítems de golpe y convierte la tarea en copiar el enunciado. La consigna
 *  dice la operación GRAMATICAL; el guion es lo que el alumno tiene que
 *  saber que sale de ella. */
export const CONSIGNA =
  'Di la misma frase cambiando el objeto directo por el pronombre que le corresponde. '
  + 'No añadas ningún complemento, no cambies el tiempo del verbo ni el orden de las demás palabras.';

export interface Decl {
  /** `'silabicidad'` = par 1 · `'posicion'` = par 2 */
  par: 'silabicidad' | 'posicion';
  sujeto: string;
  /** el sustantivo objeto, del lexicón */
  n: string;
  num: Numero;
  /** el ítem cuyo error sería SOBREaplicar la regla del par */
  sobreaplicacion: boolean;
  nota: string;
}

export const DECL: Decl[] = [
  {
    par: 'silabicidad', sujeto: 'Ion', n: 'carte', num: 'pl', sobreaplicacion: true,
    nota: 'EL LADO SIN GUION, y es el ítem de frontera del par: «le» PUEDE formar sílaba, así que no se apoya en nada y va suelto — «mi le» 110 en el corpus, y el proclítico «mi-le» con guion sale CERO (los 10 hits de «mi-le» son todos ENCLÍTICOS: dă-mi-le, ia-mi-le, Trimiti-mi-le, leídos uno a uno). Quien aprenda «clítico + clítico = guion» escribe *mi-le dă y este ítem lo caza.',
  },
  {
    par: 'silabicidad', sujeto: 'Ion', n: 'carte', num: 'sg', sobreaplicacion: false,
    nota: 'EL LADO CON GUION: «o» es asilábica y se apoya en el clítico de delante — «mi-o» 219, y «îmi o» CERO. Par mínimo con el anterior: mismo sujeto, mismo verbo, mismo dativo y EL MISMO SUSTANTIVO; sólo cambia el número del objeto.',
  },
  {
    par: 'posicion', sujeto: 'Ana', n: 'casă', num: 'sg', sobreaplicacion: false,
    nota: 'EL `o` DETRÁS DEL PARTICIPIO: «a văzut-o» 16, «am văzut-o» 41. Es la única casilla que el portugués contradice ACTIVAMENTE (pt. «tinha-o visto», el clítico nunca cuelga del participio), y no sale de la silabicidad, que no dice de qué lado va nada.',
  },
  {
    par: 'posicion', sujeto: 'Ana', n: 'tren', num: 'sg', sobreaplicacion: true,
    nota: 'LA SOBREAPLICACIÓN DEL PAR 2, y es la segunda cara del punto: quien acaba de aprender «el clítico va detrás del participio» escribe *Ana a văzut-l. Con el acusativo masculino/neutro el clítico se apoya en el AUXILIAR y va delante — «l-a văzut» 51, «a văzut-l» CERO. ⚠ Esta mitad REPITE material que r6-doblado-cliticos ya publica (l-am văzut, i-am sunat): está aquí por el CONTRASTE, no como cobertura, y sin ella «pon siempre el clítico detrás» resolvería su mitad al 100 %.',
  },
];

const may = (s: string) => s[0]!.toUpperCase() + s.slice(1);
const A_DA = verbo('a da');
const A_VEDEA = verbo('a vedea');

/** LA CONSTRUCCIÓN, Y NINGUNA FORMA SE ESCRIBE A MANO. El artículo
 *  enclítico sale de `articulado()`, el clítico de acusativo de
 *  `cliticAcuzativ()` y el participio de `participio()`: si alguien cambia
 *  una de las tres reglas, las claves cambian con ella en vez de quedarse
 *  mintiendo. Es lo que el lote 26 hizo con `concordanciaDe()`.
 *
 *  **Las formas asilábicas (`mi`, `l-`, `-o`) sí se escriben aquí y no en
 *  el paradigma**, y va dicho junto a ellas: su distribución no es
 *  morfológica sino de CONTACTO —depende de la palabra que venga al lado—,
 *  y meterla en `paradigma-ro.ts` sería enunciar media regla en el sitio
 *  donde más caro sale. Lo que las protege son los gates de aquí abajo. */
export function construir(d: Decl): {
  p: string; pasada: number; s: string; instruccion: string; r: string; alt: string[];
  foco: string; nucleo: string; espejoEs: boolean; transparenteLatin: boolean;
  sobreaplicacion: boolean; d: Decl; l: LemaNominal; ac: string;
} {
  const l = lema(d.n);
  const art = articulado(l, d.num);
  if (!art) throw new Error(`sin artículo enclítico para «${d.n}» ${d.num}`);
  const ac = cliticAcuzativ(l.genero, d.num);
  // ⚠ NINGUNA FORMA DEL CLÍTICO SE ESCRIBE A MANO: la plena y la reducida
  //   salen del INVENTARIO de `paradigma-ro.ts`, y lo que el lote decide
  //   es sólo la DISTRIBUCIÓN —cuál de las dos va ante qué vecino—, que es
  //   lo que examina. Escribirlas aquí habría sido la tercera copia de la
  //   regla que el lote 23 dejó documentada.
  const dat = CLITICOS_DATIV['1sg']!;
  const datRed = reducida(CLITICOS_DATIV, '1sg')!;
  const acRed = reducida(CLITICOS_ACUZATIV, casillaAcuzativ(l.genero, d.num));
  let s: string, r: string, foco: string, nucleo: string;
  if (d.par === 'silabicidad') {
    // `Ion îmi dă cartea.` → `Ion mi-o dă.` / `Ion îmi dă cărțile.` → `Ion mi le dă.`
    // El dativo de 1.ª sg va REDUCIDO en los dos (`îmi` → `mi`, y `îmi le`
    // sale CERO en el corpus): lo que varía es sólo si el acusativo se
    // apoya en él, y eso lo decide que el acusativo tenga forma reducida —
    // `o` y `le` no la tienen, pero `o` es la única que además es
    // asilábica y necesita apoyarse.
    s = `${d.sujeto} ${dat.plena} dă ${art}.`;
    nucleo = ac === 'o' ? `${datRed}-${ac}` : `${datRed} ${ac}`;
    r = `${d.sujeto} ${nucleo} dă.`;
    foco = art;
  } else {
    // `Ana a văzut casa ieri.` → `Ana a văzut-o ieri.`
    // `Ana a văzut trenul ieri.` → `Ana l-a văzut ieri.`
    // El circunstancial va en las DOS fuentes y es el mismo: iguala el
    // marco un poco más y le quita a la fuente el olor a manual que el
    // lingüista le encontró (`a văzut casa` sale 0 en el corpus, y `a
    // vedea` con inanimado definido y sin ningún circunstancial es flaco:
    // `a văzut lumina` 3, `a văzut ușa` 1). No toca el eje: la consigna
    // prohíbe que el ALUMNO añada complementos, no que los traiga la
    // fuente.
    const part = participio(A_VEDEA);
    if (!part) throw new Error('sin participio para «a vedea»');
    s = `${d.sujeto} a ${part} ${art} ieri.`;
    nucleo = ac === 'o' ? `${part}-${ac}` : `${acRed}-a`;
    r = ac === 'o' ? `${d.sujeto} a ${nucleo} ieri.` : `${d.sujeto} ${nucleo} ${part} ieri.`;
    foco = art;
  }
  return {
    p: PUNTO, pasada: 1,
    s: may(s), instruccion: CONSIGNA, r: may(r), alt: [],
    foco, nucleo,
    // ¿Se llega traduciendo? NO, en la lectura OPERATIVA que el campo pide:
    // el español no produce ninguna de las cuatro cadenas rumanas —«me los
    // da» no da `mi le`, «la vio» no da `a văzut-o`—. ⚠ PERO LA ASIMETRÍA
    // ESTRUCTURAL ES REAL Y VA DICHA, porque el campo solo no la ve: la
    // COLOCACIÓN del español y del portugués coincide con la rumana en tres
    // de los cuatro y la contradice en el cuarto. Por eso no se deja en una
    // declaración: se EJECUTA (`TODO_PROCLITICO`), que es un camino y no una
    // opinión.
    espejoEs: false,
    // El latín tenía clíticos pero ni cratimă ni esta distribución: la raíz
    // románica común no da ninguna de las cuatro casillas.
    transparenteLatin: false,
    sobreaplicacion: d.sobreaplicacion,
    d, l, ac,
  };
}

export const CONSTRUIDOS = DECL.map(construir);
export const ITEMS: ItemTransRo[] = CONSTRUIDOS.map(({ d: _d, l: _l, ac: _ac, ...x }) => x);
export type Construido = ReturnType<typeof construir>;

// ══ LAS ESTRATEGIAS DEL ALUMNO, EJECUTADAS ═══════════════════════════
//
// Las siete se construyen desde la VISTA —nunca desde la respuesta— y
// todas necesitan una cosa que el alumno YA TIENE: saber qué clítico
// sustituye al objeto. Eso está publicado 16 veces entre
// `r6-cliticos-acusativo` y `r6-cliticos-dativo`, así que dárselo a las
// estrategias no es regalarles nada: es la lección del §7 del lote 24 —
// enumerar las rutas libres es enumerar sus COMPOSICIONES con la
// morfología que el alumno ya trae, porque dos rutas al 50 % pueden
// componerse en una al 100 % y el informe sale idéntico.

/** El lexicón, indexado por la forma ARTICULADA, que es lo que el alumno
 *  ve en la fuente. Una estrategia que no supiera el género tendría que
 *  adivinarlo, y entonces mediría el género y no la ortografía. */
const POR_ARTICULADO = new Map<string, { l: LemaNominal; num: Numero }>();
for (const l of SUSTANTIVOS_A1)
  for (const num of ['sg', 'pl'] as const) {
    const a = articulado(l, num);
    if (a) POR_ARTICULADO.set(norm(a), { l, num });
  }

/** Lo que la estrategia puede leer de la fuente: el acusativo que toca y
 *  si el marco es el del presente con dativo o el del perfecto. */
function leer(x: { s: string; foco: string }) {
  const e = POR_ARTICULADO.get(norm(x.foco));
  if (!e) return null;
  const ac = cliticAcuzativ(e.l.genero, e.num);
  // ⚠ EL PATRÓN VA EN EL ALFABETO DE LA NORMALIZACIÓN, NO EN EL DEL RUMANO
  //   (§4.37). `norm()` pasa por NFD y borra los diacríticos, así que un
  //   `îmi` escrito aquí NO DISPARA NUNCA sobre texto normalizado. La
  //   primera versión de esta línea lo tenía mal y **las dos estrategias
  //   del guion daban 0/4 donde la predicción era 1/4 cada una**: no
  //   fallaba nada, simplemente `leer()` devolvía `dosCliticos: false`
  //   para todo y las dos estrategias se apagaban en silencio. Es el
  //   §4.18 —un gate muerto es indistinguible de uno que funciona— y lo
  //   cazó que el número observado no fuera el predicho, no ningún rojo.
  const dosCliticos = /(?<![\p{L}])imi da(?![\p{L}])/u.test(norm(x.s));
  const m = /^(\p{Lu}[\p{L}]*) a ([\p{L}]+) /u.exec(x.s);
  return { ac, dosCliticos, sujeto: m?.[1], participio: m?.[2], e };
}

/** «Junto los dos clíticos con guion, siempre.» Es la sobregeneralización
 *  que el ítem 1 existe para cazar. */
export const GUION_SIEMPRE: Estrategia = {
  nombre: 'juntar los dos clíticos con guion SIEMPRE (*mi-le dă)',
  aplicar: (x) => { const r = leer(x); return r && r.dosCliticos ? `mi-${r.ac}` : null; },
};

/** «No junto nunca: dos palabras.» La sobregeneralización contraria. */
export const GUION_NUNCA: Estrategia = {
  nombre: 'no juntar nunca los dos clíticos (*mi o dă)',
  aplicar: (x) => { const r = leer(x); return r && r.dosCliticos ? `mi ${r.ac}` : null; },
};

/** «En el pasado el clítico va SIEMPRE detrás del participio.» La
 *  sobregeneralización que el ítem 4 existe para cazar: produce
 *  `*văzut-l`, que sale CERO en 2,9 M de palabras. */
export const SIEMPRE_DETRAS: Estrategia = {
  nombre: 'poner el clítico SIEMPRE detrás del participio (*a văzut-l)',
  aplicar: (x) => {
    const r = leer(x);
    if (!r || r.dosCliticos || !r.participio) return null;
    return `${r.participio}-${r.ac === 'îl' ? 'l' : r.ac}`;
  },
};

/** «En el pasado el clítico va SIEMPRE delante del auxiliar» — que es
 *  además LA COLOCACIÓN DEL ESPAÑOL Y DEL PORTUGUÉS («la vio», «tinha-o
 *  visto»): las dos lenguas cuelgan el clítico del verbo finito y ninguna
 *  del participio. Es la mitad que `espejoEs` no puede expresar, y por eso
 *  se ejecuta en vez de declararse. */
export const SIEMPRE_DELANTE: Estrategia = {
  nombre: 'poner el clítico SIEMPRE delante del auxiliar, como el español y el portugués (*Ana o a văzut)',
  aplicar: (x) => {
    const r = leer(x);
    if (!r || r.dosCliticos || !r.participio) return null;
    return r.ac === 'îl' ? 'l-a' : `${r.ac} a`;
  },
};

/** LA QUE EL LINGÜISTA MANDÓ EJECUTAR AUNQUE SALGA ALTA: «si el objeto es
 *  femenino, detrás; si no, delante». Es la regla del punto alcanzada por
 *  un PROXY —el género en vez de la silabicidad—, y acierta el par 2
 *  entero. A n = 2 eso es el techo y no hay umbral que valga (§4.41): lo
 *  que separa al que sabe del que usa el proxy es que el proxy se rompe en
 *  PLURAL (`cărțile` → `le-a văzut`, no `*văzut-le`), y este lote no tiene
 *  ese ítem. Queda escrito como límite del lote, no disimulado. */
export const GENERO_DECIDE_EL_LADO: Estrategia = {
  nombre: 'proxy: si el objeto es femenino, detrás; si no, delante',
  aplicar: (x) => {
    const r = leer(x);
    if (!r || r.dosCliticos || !r.participio) return null;
    return r.ac === 'o' ? `${r.participio}-o` : 'l-a';
  },
};

/** LA RUTA LIBRE DE VERDAD: la estructura del español y del portugués con
 *  las formas PLENAS que el currículo ya publicó. Tiene que dar CERO — si
 *  acertara alguno, el lote no examinaría la ortografía sino la
 *  colocación, que es gratis por dos vías. */
export const TODO_PROCLITICO_PLENO: Estrategia = {
  nombre: 'la colocación del español/portugués con las formas plenas publicadas (*îmi le dă, *îl a văzut)',
  objetivo: 'respuesta',
  aplicar: (x) => {
    const r = leer(x);
    if (!r) return null;
    if (r.dosCliticos) {
      const m = /^(\p{Lu}[\p{L}]*) /u.exec(x.s);
      return m ? `${m[1]} îmi ${r.ac} dă.` : null;
    }
    return r.sujeto && r.participio ? `${r.sujeto} ${r.ac} a ${r.participio}.` : null;
  },
};

/** LA INTERFERENCIA PORTUGUESA: fundir el clúster en un morfema, como
 *  `dá-mo` / `deu-lho`. Tiene que dar CERO. */
export const FUSION_PORTUGUESA: Estrategia = {
  nombre: 'fundir el clúster como el portugués (*mo, *mi-lo)',
  aplicar: (x) => { const r = leer(x); return r && r.dosCliticos ? `mi-l${r.ac === 'o' ? 'o' : 'e'}` : null; },
};

// ══ LA FUGA TIPOGRÁFICA, Y ES LA QUE MÁS ENSEÑA DEL LOTE ═════════════
//
// La encontró el lingüista en el ataque final, sobre los ítems ya
// escritos, y **acierta 4 de 4 sin una palabra de rumano**:
//
// > **En rumano el artículo definido enclítico y el clítico de acusativo
// > son los MISMOS segmentos**, así que el objeto de la fuente lleva su
// > propia respuesta pegada al final: `cărți-LE` → `le`, `trenu-L` → `l`,
// > `carte-A` / `cas-A` → `o`.
//
// No es una casualidad de estos cuatro sustantivos y **no se arregla
// cambiando el léxico**: TODOS los masculinos y neutros singulares
// definidos acaban en `-l` y TODOS los femeninos y neutros plurales en
// `-le` (GALR I, *Articolul hotărât enclitic*). Cualquier ítem de esta
// forma la tiene.
//
// **Lo que salva al lote es que la fuga entrega la FORMA y no el PUNTO.**
// La forma del clítico es `r6-cliticos-acusativo`, publicada ocho veces;
// lo que estos cuatro ítems miden es el GUION y el LADO, y la terminación
// no dice ni dónde va el guion ni de qué lado del verbo cae el clítico.
// La prueba no es ese razonamiento: es la COMPOSICIÓN de la fuga con la
// regla más plausible del lote, que se ejecuta aquí abajo y **falla justo
// en `Ion mi-o dă`**, donde `o` va DELANTE. Ese ítem sostiene el lote.
//
// Es §4.40 otra vez —«un rasgo del SIGNIFICANTE que nadie mira porque no
// es gramática»— y es la tercera vez que la lista de pistas la salva el
// lingüista y no el autor.

/** «Miro cómo acaba el objeto: `-le` → `le`, `-l` → `l`, `-a` → `o`.» */
const porLaTerminacion = (foco: string): string | null => {
  const f = norm(foco);
  if (f.endsWith('le')) return 'le';
  if (f.endsWith('l')) return 'l';
  if (f.endsWith('a')) return 'o';
  return null;
};

/** LA FUGA, MEDIDA SOBRE LO QUE DE VERDAD ENTREGA: la FORMA del clítico.
 *
 *  No va como `Estrategia` y el motivo importa: `correr()` compara contra
 *  el NÚCLEO, que aquí es el clúster entero (`mi le`, `văzut-o`), así que
 *  la fuga puntuaría **0 de 4** — un número verdadero que mide otra cosa,
 *  que es el §4.14 exacto. Se mide contra la pieza que la fuga produce y
 *  el número se escribe en el juicio de varianza y en el test. */
export const fugaAciertaLaForma = (xs: readonly Construido[]): number =>
  xs.filter((x) => porLaTerminacion(x.foco) === (reducida(CLITICOS_ACUZATIV, casillaAcuzativ(x.l.genero, x.d.num)) ?? x.ac)).length;

/** LAS CUATRO POLÍTICAS QUE SE PUEDEN MONTAR ENCIMA DE LA FUGA, ENUMERADAS
 *  EXHAUSTIVAMENTE — y ésta es la parte que decide si el lote vale.
 *
 *  La fuga entrega la FORMA. Para escribir la respuesta faltan las DOS
 *  decisiones que el punto examina, y cada una es binaria: **¿guion o no?**
 *  y **¿delante o detrás del verbo?**. Así que el espacio entero de rutas
 *  que un alumno puede componer con la fuga son 2 × 2 = **cuatro**, y se
 *  corren las cuatro. No es un umbral puesto a ojo sobre un máximo buscado
 *  —que es el §4.36 y ya hizo que una sesión «arreglara» un lote que no
 *  estaba roto—: es el espacio completo, enumerado.
 *
 *  ⚠ Y VA ESCRITO POR QUÉ NO SE USA LA COMPOSICIÓN QUE EL LINGÜISTA
 *  PREDIJO. Él predijo «la fuga + `o` detrás» al **3/4**, y una primera
 *  versión de este fichero la implementó y dio exactamente 3/4 — por
 *  encima del tope. Al mirarla, **le regalaba el ítem 1**: escribía
 *  `mi ${c}` con el dativo ya reducido y el espacio ya puesto, o sea las
 *  dos decisiones que ese ítem examina. Una estrategia cuyo nombre y cuyo
 *  código no son la misma frase mide otra cosa (§4.33), y en la dirección
 *  cara: habría tumbado un lote sano. Con las políticas explícitas el
 *  techo real es **2 de 4**, que con dos pares binarios es el SUELO y no
 *  holgura. */
const POLITICAS = [
  { guion: true, detras: false }, { guion: false, detras: false },
  { guion: true, detras: true }, { guion: false, detras: true },
] as const;

const nombrePolitica = (p: { guion: boolean; detras: boolean }) =>
  `⚠ la fuga COMPUESTA: la terminación da el clítico, ${p.guion ? 'CON' : 'SIN'} guion, ${p.detras ? 'DETRÁS' : 'DELANTE'} del verbo`;

export const FUGA_COMPUESTA: Estrategia[] = POLITICAS.map((pol) => ({
  nombre: nombrePolitica(pol),
  objetivo: 'respuesta' as const,
  aplicar: (x) => {
    const c = porLaTerminacion(x.foco);
    const r = leer(x);
    if (c === null || !r) return null;
    const j = pol.guion ? '-' : ' ';
    if (r.dosCliticos) {
      const m = /^(\p{Lu}[\p{L}]*) /u.exec(x.s);
      if (!m) return null;
      // El dativo va reducido en las cuatro políticas: es lo único que la
      // fuga NO decide y que además está fuera del eje de este lote (`îmi
      // le` sale 0, así que no hay elección que hacer ahí).
      return pol.detras ? `${m[1]} mi dă${j}${c}.` : `${m[1]} mi${j}${c} dă.`;
    }
    if (!r.sujeto || !r.participio) return null;
    return pol.detras
      ? `${r.sujeto} a ${r.participio}${j}${c} ieri.`
      : `${r.sujeto} ${c}${j}a ${r.participio} ieri.`;
  },
}));

// ══ LAS COMPOSICIONES, ESCRITAS Y EJECUTADAS ═════════════════════════
//
// «Enumerar atajos no basta: hay que probar sus COMPOSICIONES» (§4.24 y el
// §7 del lote 24, donde un lote se publicó roto porque faltaba «la primera
// regla más una marca de A1» y acertaba 8/8). Las dos que se pueden formar
// aquí cruzan una regla de cada par, y las dos tienen que quedarse en el
// SUELO: con dos pares binarios, 2 de 4 es el azar, no holgura.
const componer = (nombre: string, a: Estrategia, b: Estrategia): Estrategia => ({
  nombre, aplicar: (x, otros) => a.aplicar(x, otros) ?? b.aplicar(x, otros),
});
export const COMPUESTA_PEGA = componer('compuesta: guion siempre + clítico siempre detrás', GUION_SIEMPRE, SIEMPRE_DETRAS);
export const COMPUESTA_SUELTA = componer('compuesta: nunca guion + clítico siempre delante', GUION_NUNCA, SIEMPRE_DELANTE);

// ══ LOS GATES PROPIOS DEL PUNTO ══════════════════════════════════════

export function revisar(xs: readonly Construido[]): string[] {
  const v: string[] = [];

  // 1 · LAS CLAVES SE DERIVAN, NO SE ESCRIBEN. El acusativo tiene que ser
  //     el que da `cliticAcuzativ()` desde el género y el número del lema.
  for (const x of xs) {
    const esperado = cliticAcuzativ(x.l.genero, x.d.num);
    if (x.ac !== esperado) v.push(`${x.s}: el clítico declarado «${x.ac}» no es el que deriva el paradigma («${esperado}»)`);
  }

  // 2 · LA SILABICIDAD, QUE ES LA REGLA DEL PUNTO, PUESTA EN INVARIANTE.
  //     `o` es el ÚNICO acusativo silábico, así que es el único que se
  //     apoya con guion en el clítico de delante y el único que puede ir
  //     enclítico a un participio acabado en consonante. Si alguien
  //     escribiera aquí un `le` con guion o un `l` detrás del participio,
  //     el lote enseñaría justo el error que existe para castigar.
  //   ⚠ Los patrones van en el ALFABETO DE LA NORMALIZACIÓN (§4.37):
  //     `norm()` pasa por NFD y borra los diacríticos, así que un patrón
  //     escrito con «ă» no dispararía nunca sobre texto normalizado.
  for (const x of xs) {
    const conGuion = x.nucleo.includes('-');
    if (x.d.par === 'silabicidad' && conGuion !== (x.ac === 'o'))
      v.push(`${x.s}: el par de la silabicidad da «${x.nucleo}» — el guion sólo va con «o» (asilábica), y «le» va suelto`);
    if (x.d.par === 'posicion') {
      const detras = new RegExp(`vazut-`, 'u').test(norm(x.r));
      if (detras !== (x.ac === 'o'))
        v.push(`${x.s}: el par de la posición da «${x.r}» — sólo «o» va detrás del participio; «îl» se apoya en el auxiliar (a văzut-l = 0 en el corpus)`);
    }
  }

  // ⚠ Las comprobaciones que siguen son INDEPENDIENTES de la de arriba y
  // por eso NO comparten bucle ni `continue`: en el lote 21 un gate nuevo
  // no disparó nunca porque iba detrás de un `continue` ajeno (§0.8).

  // 3 · EL PAR MÍNIMO DE MARCO, que es lo que sostiene el lote y no el
  //     tamaño (§4.40). Dentro de cada par, toda pista que sea propiedad
  //     del marco es constante y no puede separar las clases.
  for (const par of ['silabicidad', 'posicion'] as const) {
    const p = xs.filter((x) => x.d.par === par);
    if (p.length !== 2) { v.push(`PAR MÍNIMO: el par «${par}» tiene ${p.length} ítems y tiene que tener 2 — con respuesta binaria la mitad es el suelo, y cargar de un lado sube una sobregeneralización por encima del tope`); continue; }
    if (new Set(p.map((x) => x.d.sujeto)).size !== 1) v.push(`PAR MÍNIMO «${par}»: los dos ítems no comparten sujeto`);
    if (par === 'silabicidad') {
      if (new Set(p.map((x) => x.l.lema)).size !== 1) v.push('PAR MÍNIMO «silabicidad»: los dos ítems tienen que llevar EL MISMO sustantivo y cambiar sólo el NÚMERO, o el sustantivo predice la respuesta');
      if (new Set(p.map((x) => x.d.num)).size !== 2) v.push('PAR MÍNIMO «silabicidad»: el número del objeto tiene que ser la única diferencia, y los dos ítems lo tienen igual');
    } else {
      if (new Set(p.map((x) => x.d.num)).size !== 1) v.push('PAR MÍNIMO «posición»: los dos ítems tienen que ir en el MISMO número y cambiar sólo el GÉNERO');
      if (new Set(p.map((x) => x.l.genero === 'f')).size !== 2) v.push('PAR MÍNIMO «posición»: hace falta uno femenino y uno no femenino, o no hay contraste de lado');
    }
  }

  // 4 · NINGUNA FUENTE PUEDE CONTENER UN CLÚSTER DE CLÍTICOS (§4.13bis).
  //     Es el gate que retiró dos ítems del primer dictamen: sus fuentes
  //     eran `Ți-l dau azi` y `Ni le spune`, o sea que el alumno copiaba el
  //     clúster entero y sólo recolocaba el guion — y encima la primera le
  //     enseñaba al otro ítem el guion que ese otro ítem pide producir.
  const CLITICOS = ['imi', 'iti', 'ii', 'ne', 'va', 'le', 'il', 'o', 'mi', 'ti', 'i', 'ni', 'vi', 'li', 'l', 'te', 'ma', 'se'];
  for (const x of xs) {
    const w = norm(x.s).split(' ');
    for (let i = 0; i + 1 < w.length; i++)
      if (CLITICOS.includes(w[i]!) && CLITICOS.includes(w[i + 1]!))
        v.push(`${x.s}: la fuente ya contiene el clúster «${w[i]} ${w[i + 1]}» — el ítem se contesta recolocando el guion (§4.13bis)`);
    if (/[\p{L}]-[\p{L}]/u.test(norm(x.s)))
      v.push(`${x.s}: la fuente ya lleva un clítico con guion, que es la forma que el lote pide producir`);
  }

  // 5 · LA CONSIGNA NO PUEDE NOMBRAR EL GUION NI LA CONTRACCIÓN. Es la
  //     promesa comprobable del enunciado, y una promesa de consigna tiene
  //     que tener un gate o se desincroniza con las claves en el ítem que
  //     alguien añada dentro de dos meses.
  for (const x of xs) {
    for (const p of ['guion', 'guión', 'contrac', 'union', 'unión', 'junta', 'pega'])
      if (norm(x.instruccion).includes(norm(p)))
        v.push(`${x.s}: la consigna dice «${p}» — nombrar el guion regala los cuatro ítems y convierte la tarea en copiar el enunciado`);
    // Y las tres cláusulas que cierran salidas correctas que la clave
    // suspendería. Sin ellas el lote no está determinado.
    for (const [clave, que] of [
      ['complemento', 'el doblado con pronombre fuerte («Ion mi-o dă MIE» es correcto, GALR II)'],
      ['tiempo del verbo', 'el imperfecto, el perfecto simple y sobre todo el futuro y el condicional, donde «o» vuelve a ser proclítica y hay DOS colocaciones atestadas'],
      ['orden de las demas palabras', 'la dislocación («Cartea, mi-o dă»), que es rumano perfecto y es r12-dislocacion-cliticos'],
    ] as const)
      if (!norm(x.instruccion).includes(norm(clave)))
        v.push(`${x.s}: la consigna no cierra ${que} — falta la cláusula «${clave}»`);
  }

  // 6 · UNO DE CADA PAR TIENE QUE SER EL DE SOBREAPLICACIÓN (§0.6). Los
  //     dos pares tienen contexto negativo y los dos lo enseñan: sin ellos
  //     el alumno saca 4/4 sobregeneralizando «pon siempre guion» y «pon
  //     siempre el clítico detrás», y el corpus certifica que sabe algo
  //     que no sabe.
  for (const par of ['silabicidad', 'posicion'] as const) {
    const n = xs.filter((x) => x.d.par === par && x.sobreaplicacion).length;
    if (n !== 1) v.push(`FRONTERA: el par «${par}» declara ${n} ítems de sobreaplicación y tiene que declarar exactamente 1`);
  }

  return v;
}

const gatesPropios = (items: readonly ItemTransRo[]): string[] => [
  ...(items.length === CONSTRUIDOS.length ? [] : ['el lote y la declaración se han desincronizado']),
  ...revisar(CONSTRUIDOS),
];

// ══ LAS AFIRMACIONES DEL LOTE, CONTRA LOS 2,9 M DE PALABRAS ══════════
//
// ⚠ Se consulta y se publica con el MISMO instrumento (§4.38): estos
// números salen de `INI`+patrón+`FIN`, igual que el gate, y NO de la CLI,
// que no pone límite de palabra. Esa diferencia es la que hizo que el
// primer dictamen del lingüista diera `ne l-a` 30 y `ne le` 86 —todo
// homógrafos: `casne l-au`, `cine l-a`, `vine lesne`, `tine le fac`— y
// matara por error el eje del alomorfo.
// ⚠ Y los patrones van con `[\p{L}]`, NUNCA con `\w`: en JS `\w` es
// `[A-Za-z0-9_]` incluso con el flag `u`, así que no casa `ă â î ș ț` y
// subcuenta en silencio (§4.42).
export const COMPROBACIONES: Comprobacion[] = [
  { afirmacion: 'PAR 1, lado SIN guion: «le» es silábica y va suelta tras el dativo', patron: 'mi le', espera: 'presente' },
  { afirmacion: 'PAR 1, lado CON guion: «o» es asilábica y se apoya en el dativo', patron: 'mi-o', espera: 'presente' },
  { afirmacion: 'el dativo de 1.ª sg va REDUCIDO ante otro clítico: «îmi le» no existe', patron: 'îmi le', espera: 'ausente' },
  { afirmacion: 'PAR 2, «o» DETRÁS del participio, con el mismo verbo y el mismo tiempo de la clave', patron: 'a v[ăa]zut-o', espera: 'presente' },
  { afirmacion: 'PAR 2, el acusativo masculino DELANTE, apoyado en el auxiliar', patron: 'l-a v[ăa]zut', espera: 'presente' },
  // EL `AUSENTE` FUERTE, y lo que lo hace fuerte no es el cero sino el
  // PRINCIPIO que lo explica: `l` es asilábico y necesita una vocal delante
  // donde apoyarse, y `văzut` acaba en `t` — la coda `-tl` no existe en
  // rumano. Medido además por el lingüista sobre los 9.034 `-l` enclíticos
  // del corpus: 253 llevan consonante antes del guion y 246 son `d-l`
  // (abreviatura de *domnul*); de los 7 restantes, tres son erratas y tres
  // son gerundios sin la `-u-` (`numind-l`, `luând-l`, `lovind-l`), o sea
  // la grafía vieja de `numindu-l`. **Participios: ni uno.**
  { afirmacion: 'y NUNCA detrás: «l» es asilábica y no puede apoyarse en la «t» final del participio (GALR I; el mismo principio que obliga a la «-u-» de legătură del gerunziu)', patron: 'a v[ăa]zut-l', espera: 'ausente' },
  // ⚠ ESTE VA COMO `presente` A PROPÓSITO, Y NO COMO `ausente`. La
  // afirmación que el lote hace es «el proclítico `mi-le` no existe», pero
  // declararla `ausente` sería REFUTADA por el gate: `mi-le` sale 10 veces.
  // Leídas una a una, **las diez son ENCLÍTICAS** (`dă-mi-le`, `ia-mi-le`,
  // `Trimiti-mi-le`), e `INI` las deja pasar porque el guion no es letra.
  // Es el §0.7 en su mitad menos citada —no te fíes de un positivo sin
  // haber visto qué cazó— y la mitad del §4.38 que dice que con cadenas
  // cortas no se cuenta: se LEE.
  { afirmacion: '⚠ «mi-le» existe pero SÓLO enclítico: las 10 apariciones son «dă-mi-le», «ia-mi-le», «Trimiti-mi-le», leídas una a una. El proclítico «mi-le» es lo que no existe, y eso el gate no lo puede contar', patron: 'mi-le', espera: 'presente' },
];

export const OPCIONES: Opciones = {
  comprobaciones: COMPROBACIONES,
  estrategias: [
    GUION_SIEMPRE, GUION_NUNCA, SIEMPRE_DETRAS, SIEMPRE_DELANTE,
    GENERO_DECIDE_EL_LADO, TODO_PROCLITICO_PLENO, FUSION_PORTUGUESA,
    ...FUGA_COMPUESTA,
    COMPUESTA_PEGA, COMPUESTA_SUELTA,
  ],
  gatesPropios,
  // LA SEMILLA NO ES DECORATIVA A ESTE TAMAÑO: con n = 4 y dos clases de
  // dos, CUATRO de las seis ordenaciones posibles se separan por posición
  // —un corte, o la paridad—, así que el orden en que el fichero está
  // escrito (agrupado por par, que es como se revisa) sería una pista
  // gratis. Sólo `SPPS` y `PSSP` sobreviven, y la 20 da `SPPS`. El gate
  // mide el orden PUBLICADO y no el declarado, que es lo que el alumno ve.
  semilla: 20,
  // EL EJE SEMÁNTICO DEL LOTE, declarado porque el detector no puede
  // adivinarlo y un eje mal elegido devuelve un verde tranquilizador sobre
  // la pista que sí existe (§4.39). La edición sobre el foco no agrupa aquí
  // —el foco es un sustantivo distinto en cada ítem—, así que sin esto los
  // dos pares saldrían limpios por construcción.
  ejes: {
    par: (x) => (norm(x.s).includes('imi da') ? 'silabicidad' : 'posicion'),
    guion: (x) => (x.nucleo.includes('-') ? 'con-guion' : 'sin-guion'),
  },
  juicios: {
    copia: 'CERO de los cuatro se contestan copiando el foco, y aquí ese cero no deja ninguna regularidad aprovechable — que es lo que hay que justificar, porque en el lote 24 un cero de copias enseñaba «al negar, la forma siempre cambia», que era falso. Aquí no puede: la operación sustituye un SUSTANTIVO por un PRONOMBRE, así que el foco no sobrevive en ningún ítem posible de este punto y «la forma siempre cambia» no es una regla que el alumno pueda sobreaplicar a nada. Lo medido ejecutando: copiar el foco 0/4, copiar la frase entera 0/4, la edición modal del lote 0/4 — y ese cero de la modal tampoco es una virtud, es que los cuatro focos son sustantivos distintos y no hay edición común que repetir. El número que protege a este lote no es ninguno de esos tres: son las nueve estrategias ejecutadas —las cuatro sobregeneralizaciones de una cara, el proxy del género, la colocación española con formas plenas, la fusión portuguesa y las DOS composiciones cruzadas— y sobre todo la ESTRUCTURA, que son dos pares mínimos de marco donde sujeto, verbo, tiempo y sustantivo son constantes dentro del par y sólo cambia el rasgo examinado (el NÚMERO del objeto en el par 1, el GÉNERO en el par 2), así que toda pista que sea propiedad del marco se cae sola.',
    frontera: 'Los DOS pares tienen contexto negativo y los DOS lo enseñan, y en los dos el ítem de sobreaplicación es la segunda cara del propio punto y no un apéndice cosido. Par 1: la regla es «el clítico asilábico se apoya con guion en el de delante», y su contexto negativo es «le», que es silábica y va suelta — quien generalice «clítico + clítico = guion» escribe *mi-le dă, y ese proclítico sale CERO en el corpus (las 10 apariciones de «mi-le» son todas enclíticas: dă-mi-le, ia-mi-le, Trimiti-mi-le, leídas una a una). Par 2: la regla es «o va detrás del participio», y su contexto negativo es el acusativo masculino, que es asilábico y no puede apoyarse en la «t» final de «văzut» — quien generalice escribe *Ana a văzut-l, y de los 9.034 «-l» enclíticos del corpus ni uno va sobre un participio (253 llevan consonante delante y 246 de ésos son «d-l» por «domnul»). Los dos errores los comete precisamente quien acaba de aprender la otra cara. Y va escrito lo que este lote NO trae y por qué: el eje del ALOMORFO del dativo ante otro clítico (ne→ni, vă→vi, le→li) es contenido real, no está publicado en ninguna parte —r6-cliticos-dativo enseña ne, vă, le como LAS formas, ocho ítems, todos sin vecino, o sea que es el propio currículo el que fabrica el error— y aun así no entra, porque NINGUNO de sus dos lados está determinado: «ni-o» sale 2 veces y son clusters reales («nu cum ni-o plănuim noi», «să ni-o dea la telegraf», Caragiale), «vi-o» sale 9 y también, y «ne le» sale 1 y también («ne le-ar putea spune»). GALR I y DOOM3 dan ni/vi/li en la tabla de distribución pero DESCRIBEN, no proscriben, así que bajo §0 y §0.3 esas formas son raras, no malas, y cualquier clave que las suspendiera suspendería rumano atestado. Se cae el eje entero, no medio: publicar «ni le» sin su frontera enseñaría «reduce siempre el dativo», que es la sobregeneralización que produce *ni-o.',
    varianza: 'Lo que varía entre los cuatro ítems, y ES el punto, es la SALIDA ORTOGRÁFICA del clítico: dónde se pega el guion y de qué lado del verbo cae el clítico. Las piezas invariantes son las que la operación quita —el sustantivo articulado— y las que pone, y ninguna llega al umbral porque los cuatro núcleos son distintos (mi le, mi-o, văzut-o, l-a). Lo que hay que justificar es lo contrario: por qué la varianza que este lote NO tiene tampoco hace falta. La PERSONA del clítico es constante a propósito —el dativo es «îmi» en los dos ítems del par 1 y no hay dativo en el par 2— y eso no empobrece el lote, lo salva: las formas del clítico están publicadas 16 veces entre r6-cliticos-acusativo y r6-cliticos-dativo, así que un lote que hiciera variar la persona mediría esos dos puntos y no éste, que es exactamente lo que le pasó a r8-relativas-pe-care con sus siete realizaciones del clítico. Y la COLOCACIÓN, que la descripción del punto declaraba como su contenido, es gratis por dos vías: el español da el orden dativo<acusativo y la proclisis con verbo finito, y el portugués europeo C2 del alumno da además la adjunción al AUXILIAR y nunca al participio (tinha-mo dado) y la propia idea de un clítico con guion (dá-mo, deu-lho). Por §4.35 eso no cuenta aunque coincida con lo que el punto declara enseñar, así que el contenido real es sólo la ortografía, y su varianza son dos reglas —la silabicidad del guion y el lado del participio— en dos pares binarios. El límite del lote, escrito: el par 2 se puede acertar con un PROXY, «si el objeto es femenino, detrás; si no, delante», que se ejecuta y acierta sus dos; el proxy se rompe en plural (cărțile → le-a văzut, no *văzut-le) y este lote no tiene ese ítem. ⚠ Y LA FUGA QUE ENCONTRÓ EL LINGÜISTA EN EL ATAQUE FINAL, declarada porque acierta 4 DE 4 y publicar con eso sin escribirlo es el §4.39: en rumano el artículo definido enclítico y el clítico de acusativo son LOS MISMOS SEGMENTOS, así que el objeto de la fuente lleva su propia respuesta pegada al final — cărți-LE da le, trenu-L da l, carte-A y cas-A dan o. No es casualidad de estos cuatro sustantivos y no se arregla cambiando el léxico: todos los masculinos y neutros singulares definidos acaban en -l y todos los femeninos y neutros plurales en -le (GALR I, Articolul hotărât enclitic). Lo que salva al lote es que la fuga entrega la FORMA y no el PUNTO: la forma del clítico es r6-cliticos-acusativo, publicada ocho veces, y la terminación no dice ni dónde va el guion ni de qué lado del verbo cae el clítico. Y eso no se deja en un razonamiento: se enumeran EXHAUSTIVAMENTE las cuatro políticas que un alumno puede montar encima de la fuga —guion sí o no × delante o detrás, que son las dos decisiones binarias que el punto examina— y se corren las cuatro. El máximo es 2 de 4, que con dos pares binarios es el suelo. ⚠ Y va escrito el fallo propio que hubo de camino, porque es el que se repite: el lingüista predijo esa composición al 3/4, se implementó y dio 3/4, y al mirarla REGALABA el ítem 1 —escribía el dativo ya reducido y el espacio ya puesto, o sea las dos decisiones que ese ítem examina—. Una estrategia cuyo nombre y cuyo código no son la misma frase mide otra cosa, y aquí en la dirección cara: habría tumbado un lote sano. ⚠ La última pista sin cerrar, dicha en vez de disimulada: dentro del par 1 las dos fuentes comparten lema y sólo varía el número, pero ENTRE pares cambian a la vez género, animacidad, tiempo verbal y marco; no es explotable por ninguna de las catorce estrategias ejecutadas, y queda escrito porque nadie lo ha barrido más allá de eso.',
  },
};

if (/[/\\]trans-ro-l28\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 28 · transformación · ${ITEMS.length} ítems · ${PUNTO}\n`);
  if (process.argv.includes('--asigna')) {
    const a = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s, hintEs: x.hint ?? '', answer: x.r })));
    for (const l of a.lineas) console.log(l);
    process.exit(a.desvio ? 1 : 0);
  }
  for (const x of CONSTRUIDOS) console.log(`- [${x.d.par}] \`${x.s}\` → \`${x.r}\`  (foco ${x.foco} · núcleo ${x.nucleo})`);
  console.log('');
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  console.log('\n⚠ Este lote NO corre búsqueda de composiciones por permutación: a n = 8 la nula no rechaza ni un atajo plantado del 100 % (§4.41), y a n = 4 la pregunta significa todavía menos. Lo que protege al lote son las nueve estrategias CIEGAS ejecutadas contra el tope del 50 %, los dos pares mínimos de marco y los gates estructurales.');
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}
