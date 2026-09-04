// scripts/lotes/trans-ro-l29.ts — LOTE 29: `r6-cliticos-imperativo-gerunziu`.
//
//   npx tsx scripts/lotes/trans-ro-l29.ts            # preflight + gates
//   npx tsx scripts/lotes/trans-ro-l29.ts --asigna   # a qué punto cuenta cada ítem
//
// Séptimo punto de la máquina de transformación, quinto re-encuadrado ANTES
// de escribir un ítem, y **el segundo que se publica sabiendo de antemano
// que no llegará al piso**. Va con el 28: los dos puntos de `r6` se
// dictaminaron juntos, y ése es el motivo de que ninguno de los dos
// duplique al otro.
//
// ══ 1 · LA COLOCACIÓN, QUE ES LO QUE EL PUNTO SE LLAMA, ES GRATIS ════
//
// El `motivo` del punto ya lo concedía a medias —«el español coloca igual
// (dámelo / no te vayas)»—, y con el portugués europeo C2 del alumno son
// DOS vías independientes:
//
//   | pieza | quién se la da hecha |
//   |---|---|
//   | enclisis con el imperativo AFIRMATIVO | es. «dámelo» · pt. `dá-mo` |
//   | proclisis con el imperativo NEGATIVO | es. «no te vayas» · pt. `não te vás` |
//   | el orden dativo < acusativo | es. «dámelo» · pt. `deu-mo` |
//   | que el clítico se pegue con guion | pt. `dá-mo`, `vê-lo`, `deu-lho` |
//
// Y las FORMAS verbales de las dos casillas están publicadas:
// `r3-imperativo-afirmativo` (9 ítems) y `r5-imperativo-negativo` (8). La
// enclisis con guion sobre un imperativo el alumno **ya la ha escrito en
// A1**: `pune-i o haină`, dos veces, en `r3-dativo-experimentante`.
//
// **Por §4.35 nada de eso cuenta, aunque coincida con lo que el punto
// declara enseñar. Y `nu te duce` no cuenta ni siquiera como ítem de
// frontera: la sobreaplicación `*nu duce-te` exige violar a la vez el
// español y el portugués, y este alumno no la produce.**
//
// ══ 2 · LO QUE QUEDA SON DOS HECHOS QUE NINGUNA DE LAS DOS L1 DA ═════
//
//   · **El clúster enclítico se mantiene SEGMENTADO**, un guion por
//     clítico: `dă-mi-o` (13), `dă-mi-l` (6). El portugués FUNDE el suyo
//     en un solo morfema —`dá-mo`, `deu-lho`—, así que la interferencia
//     concreta que hay que medir es `*dă-mol` / `*dă-mo`.
//   · **El gerunziu inserta una `-u-` de legătură ante el clítico**:
//     `văzându-l` 56, `spunându-i` 13, `ducându-se` 40, y `văzând-l`
//     **CERO**. `r7-gerunziu` publica la forma del gerundio a secas y no
//     toca esto.
//
// Y los dos son el MISMO principio que el lote 28: el clítico asilábico
// necesita una vocal donde apoyarse. `văzând` acaba en consonante, así que
// el gerundio la suministra; `văzut` también, y por eso `*a văzut-l` no
// existe. Un solo hecho de la lengua, tres consecuencias en dos puntos.
//
// ══ 3 · LA MINA QUE EL LINGÜISTA DESACTIVÓ, Y ES INVISIBLE ═══════════
//
// **La `-u-` NO es uniforme, y con objeto FEMENINO la norma es SIN ella:**
//
//   | gerundio + | con `-u-` | sin `-u-` |
//   |---|---:|---:|
//   | `-l` | **674** | 4 (grafías viejas: `numind-l`, `luând-l`, `lovind-l`) |
//   | `-o` | 25 | **383** |
//
// Y con este verbo: `văzând-o` **27** frente a `văzându-o` **4**. O sea que
// **un ítem de este eje escrito con objeto femenino publicaría como única
// respuesta correcta la variante minoritaria 4 : 27.** El ítem va con
// objeto masculino, y va en gate para que nadie lo pise.
//
// Tampoco se monta ahí una frontera: `văzându-o` sale 4 veces en prosa
// buena (Filimon, Negruzzi), así que la frontera no está determinada — la
// misma enfermedad que mató el eje del alomorfo en el lote 28.
import {
  verificar, informe, norm, type ItemTransRo, type Opciones, type Estrategia, type Comprobacion,
} from '../lib/transformacion-ro';
import { SUSTANTIVOS_A1, VERBOS_A1 } from '../../lib/data/languages/ro/lexicon-a1';
import {
  articulado, cliticAcuzativ, casillaAcuzativ, reducida, presente, gerunziu,
  CLITICOS_ACUZATIV, CLITICOS_DATIV, type LemaVerbal,
} from '../lib/paradigma-ro';
import { informeAsigna } from '../lib/asigna-ro';

const PUNTO = 'r6-cliticos-imperativo-gerunziu';
const verbo = (i: string): LemaVerbal => {
  const v = VERBOS_A1.find((x) => x.inf === i);
  if (!v) throw new Error(`el lote 29 pide «${i}», que no está en el lexicón`);
  return v;
};
const lema = (l: string) => {
  const v = SUSTANTIVOS_A1.find((x) => x.lema === l);
  if (!v) throw new Error(`el lote 29 pide «${l}», que no está en el lexicón`);
  return v;
};
const A_DA = verbo('a da');
const A_VEDEA = verbo('a vedea');

/** LAS DOS CONSIGNAS, y cada cláusula cierra una salida CORRECTA que la
 *  clave suspendería.
 *
 *  **IMPERATIVO — «tuteándolo»** cierra `Dați-mi-o`, que es la misma orden
 *  de usted y letra por letra otra respuesta buena. **«empieza la frase
 *  por el verbo»** cierra la supletiva `Să mi-o dai`, que sale **6** veces
 *  en el corpus y que la gramática rumana trata como forma del propio
 *  paradigma imperativo — aceptarla abriría la ruta que resuelve el ítem
 *  sin aprender nada, y es literalmente el fallo 5 del lote 23. **«no
 *  añadas ningún complemento»** cierra `Dă-mi-o mie`.
 *
 *  **GERUNDIO — «sin “când”»** cierra copiar la fuente, y **«no cambies el
 *  orden ni la segunda mitad»** cierra la dislocación y el cambio de
 *  tiempo. Ninguna de las dos nombra el guion ni la «u»: decirlo regalaría
 *  el ítem entero. */
export const CONSIGNA_IMP =
  'Dile a tu amigo que haga eso, tuteándolo: usa el mismo verbo, empieza la frase por él y '
  + 'cambia el objeto directo por el pronombre que le corresponde. No añadas ningún complemento.';
export const CONSIGNA_GER =
  'Di la primera mitad con el verbo en gerundio y sin «când», dejando la segunda mitad igual. '
  + 'No añadas ningún complemento ni cambies el orden.';

export interface Decl { eje: 'cluster' | 'legatura'; nota: string }

export const DECL: Decl[] = [
  {
    eje: 'cluster',
    nota: 'EL CLÚSTER SEGMENTADO: un guion por clítico, «dă-mi-o» (13), «dă-mi-l» (6). Es la interferencia PORTUGUESA y no la española: el pt. europeo funde el clúster en un morfema («dá-mo», «deu-lho»), así que el alumno con portugués C2 produce *dă-mo. El español no da esa fusión, pero tampoco da los dos guiones.',
  },
  {
    eje: 'legatura',
    nota: 'LA «-u-» DE LEGĂTURĂ: «văzându-l» 56, «văzând-l» CERO. r7-gerunziu publica la forma del gerundio a secas y no la toca. ⚠ VA CON OBJETO MASCULINO Y ESO ES UN GATE: con femenino la norma es SIN «-u-» («văzând-o» 27 frente a «văzându-o» 4), así que un ítem femenino publicaría la variante minoritaria como única respuesta correcta.',
  },
];

const may = (s: string) => s[0]!.toUpperCase() + s.slice(1);

export function construir(d: Decl) {
  // ⚠ Ninguna forma se escribe a mano: el imperativo, el gerundio, el
  //   artículo enclítico y las dos formas del clítico salen del paradigma.
  const datRed = reducida(CLITICOS_DATIV, '1sg')!;
  const dat = CLITICOS_DATIV['1sg']!.plena;
  if (d.eje === 'cluster') {
    const l = lema('carte');
    const ac = cliticAcuzativ(l.genero, 'sg');           // `o`
    // El imperativo de 2.ª sg de `a da` es la 3.ª sg del presente (`dă`),
    // que es la regla que el lote 23 dejó escrita para la 1.ª conjugación
    // y los verbos en `-esc`, y que aquí se comprueba contra el corpus
    // (`dă-mi` 252) en vez de darse por buena.
    const imp = presente(A_DA, 'el')!;
    const art = articulado(l, 'sg')!;
    return {
      p: PUNTO, pasada: 1,
      s: may(`${dat} dai ${art}.`), instruccion: CONSIGNA_IMP,
      r: may(`${imp}-${datRed}-${ac}.`), alt: [] as string[],
      foco: art, nucleo: `${imp}-${datRed}-${ac}`,
      espejoEs: false, transparenteLatin: false, sobreaplicacion: false, d,
    };
  }
  const l = lema('tren');
  const acRed = reducida(CLITICOS_ACUZATIV, casillaAcuzativ(l.genero, 'sg'))!;  // `l`
  const ger = gerunziu(A_VEDEA)!;
  const art = articulado(l, 'sg')!;
  return {
    p: PUNTO, pasada: 1,
    s: may(`când ${acRed}-am văzut, am plecat.`), instruccion: CONSIGNA_GER,
    r: may(`${ger}u-${acRed}, am plecat.`), alt: [] as string[],
    foco: 'văzut', nucleo: `${ger}u-${acRed}`,
    espejoEs: false, transparenteLatin: false, sobreaplicacion: false,
    d, art,
  } as ReturnType<typeof construirCluster>;
}
// Truco de tipos: las dos ramas devuelven la misma forma.
declare function construirCluster(d: Decl): {
  p: string; pasada: number; s: string; instruccion: string; r: string; alt: string[];
  foco: string; nucleo: string; espejoEs: boolean; transparenteLatin: boolean;
  sobreaplicacion: boolean; d: Decl; art?: string;
};

export const CONSTRUIDOS = DECL.map(construir);
export const ITEMS: ItemTransRo[] = CONSTRUIDOS.map(({ d: _d, art: _a, ...x }) => x as ItemTransRo);
export type Construido = ReturnType<typeof construir>;

// ══ LAS ESTRATEGIAS, EJECUTADAS ══════════════════════════════════════

/** LA INTERFERENCIA PORTUGUESA, que es el error que el ítem 1 mide:
 *  fundir el clúster en un morfema, como `dá-mo`. Tiene que dar CERO. */
export const FUSION_PORTUGUESA: Estrategia = {
  nombre: 'fundir el clúster como el portugués (*dă-mo)',
  aplicar: (x) => (norm(x.s).startsWith('imi dai') ? 'dă-mo' : null),
};

/** «Pego el clítico al gerundio tal cual», sin la vocal de legătură — que
 *  es lo que las dos L1 dan y lo que sale CERO en 2,9 M de palabras. */
export const SIN_LEGATURA: Estrategia = {
  nombre: 'pegar el clítico al gerundio sin la vocal de legătură (*văzând-l)',
  aplicar: (x) => (norm(x.s).startsWith('cand') ? `${gerunziu(A_VEDEA)}-l` : null),
};

/** LA COMPOSICIÓN de las dos: un alumno que traiga el portugués entero
 *  aplica las dos a la vez. Tiene que dar CERO igual. */
export const PORTUGUES_ENTERO: Estrategia = {
  nombre: 'compuesta: el portugués en los dos ejes (*dă-mo, *văzând-l)',
  aplicar: (x, o) => FUSION_PORTUGUESA.aplicar(x, o) ?? SIN_LEGATURA.aplicar(x, o),
};

export function revisar(xs: readonly Construido[]): string[] {
  const v: string[] = [];

  // 1 · EL GATE QUE MÁS FALTA HACE, Y ES INVISIBLE: el ítem de la vocal de
  //     legătură tiene que llevar objeto MASCULINO O NEUTRO SINGULAR. Con
  //     femenino la norma es SIN «-u-» (văzând-o 27 frente a văzându-o 4),
  //     así que el ítem publicaría la variante minoritaria como única
  //     respuesta correcta. No es una preferencia de estilo: es una clave
  //     que suspendería al alumno que escribe la forma normal.
  //   ⚠ El patrón va sobre el NÚCLEO CRUDO y no sobre la respuesta
  //     normalizada: `norm()` convierte la coma en espacio, así que la
  //     primera versión de este gate —escrita como `/u-l(,|$)/` contra
  //     `norm(x.r)`— **no podía disparar nunca**. Se cazó porque marcó el
  //     ítem BUENO. Es §4.37 por tercera vez en este repositorio, y la
  //     regla es la de siempre: el patrón se escribe en el alfabeto de la
  //     normalización, o no se normaliza.
  for (const x of xs.filter((y) => y.d.eje === 'legatura')) {
    if (!x.nucleo.endsWith('u-l'))
      v.push(`${x.s}: el ítem de la vocal de legătură tiene que acabar el gerundio en «u-l» (objeto masculino/neutro); su núcleo es «${x.nucleo}»`);
    if (/-o$/u.test(x.nucleo))
      v.push(`${x.s}: el ítem de la vocal de legătură lleva objeto FEMENINO, y con «o» la norma es SIN «-u-» (văzând-o 27 frente a văzându-o 4) — la clave publicaría la variante minoritaria`);
  }

  // ⚠ Independiente de la anterior: no comparte bucle ni `continue` (§0.8).

  // 2 · EL CLÚSTER VA SEGMENTADO: DOS guiones, uno por clítico. Si alguien
  //     lo fundiera, el lote enseñaría el error portugués que existe para
  //     castigar.
  for (const x of xs.filter((y) => y.d.eje === 'cluster')) {
    const n = (x.nucleo.match(/-/gu) ?? []).length;
    if (n !== 2) v.push(`${x.s}: el clúster enclítico lleva UN guion por clítico y el núcleo «${x.nucleo}» tiene ${n}`);
  }

  // 3 · LAS CLÁUSULAS DE LAS CONSIGNAS, que son gates: cada una cierra una
  //     salida CORRECTA que la clave suspendería, y sin ellas el lote no
  //     está determinado.
  for (const x of xs) {
    const necesita = x.d.eje === 'cluster'
      ? [['tuteandolo', 'la orden de usted «Dați-mi-o», que es otra respuesta correcta'],
         ['empieza la frase por el', 'la supletiva «Să mi-o dai», que sale 6 veces en el corpus y es forma del propio paradigma imperativo'],
         ['no anadas ningun complemento', '«Dă-mi-o mie», que es rumano correcto']]
      : [['sin «cand»', 'copiar la fuente tal cual'],
         ['no anadas ningun complemento', 'añadir un complemento'],
         ['ni cambies el orden', 'la dislocación']];
    for (const [clave, que] of necesita)
      if (!norm(x.instruccion).includes(norm(clave!)))
        v.push(`${x.s}: la consigna no cierra ${que} — falta la cláusula «${clave}»`);
    // Y ninguna puede nombrar el guion ni la vocal: los regalaría.
    for (const p of ['guion', 'guión', 'vocal', 'una u', 'contrac'])
      if (norm(x.instruccion).includes(norm(p)))
        v.push(`${x.s}: la consigna dice «${p}» y regala la respuesta`);
  }

  // 4 · UN ÍTEM POR EJE, Y NI UNO MÁS. Los dos ejes son hechos distintos y
  //     cada uno se aprende en un ítem: del segundo en adelante lo único
  //     que discriminaría es la FORMA del clítico, publicada 16 veces entre
  //     r6-cliticos-acusativo y r6-cliticos-dativo (§4.25).
  for (const eje of ['cluster', 'legatura'] as const) {
    const n = xs.filter((x) => x.d.eje === eje).length;
    if (n !== 1) v.push(`REPARTO: el eje «${eje}» tiene ${n} ítems y tiene que tener exactamente 1 — un segundo mediría la forma del clítico, que es r6-cliticos-acusativo`);
  }

  return v;
}

const gatesPropios = (items: readonly ItemTransRo[]): string[] => [
  ...(items.length === CONSTRUIDOS.length ? [] : ['el lote y la declaración se han desincronizado']),
  ...revisar(CONSTRUIDOS),
];

export const COMPROBACIONES: Comprobacion[] = [
  { afirmacion: 'EL CLÚSTER SEGMENTADO, la clave del ítem 1', patron: 'd[ăa]-mi-o', espera: 'presente' },
  { afirmacion: 'y con el otro acusativo, para que no sea una cadena suelta: «dă-mi-l»', patron: 'd[ăa]-mi-l', espera: 'presente' },
  { afirmacion: 'el imperativo de «a da» que el paradigma deriva desde la 3.ª sg del presente', patron: 'd[ăa]-mi', espera: 'presente' },
  { afirmacion: 'LA VOCAL DE LEGĂTURĂ, la clave del ítem 2', patron: 'v[ăa]zându-l', espera: 'presente' },
  { afirmacion: 'y no es de un verbo suelto: «spunându-i», «ducându-se»', patron: 'ducându-se', espera: 'presente' },
  { afirmacion: 'sin la vocal de legătură el gerundio + «l» no existe (GALR I, Verbul · Gerunziul; el mismo principio silábico que impide *a văzut-l)', patron: 'v[ăa]zând-l', espera: 'ausente' },
  // ⚠ ÉSTE VA COMO `presente` Y ES EL QUE SALVA AL ÍTEM 2 DE ESTAR MAL
  // ESCRITO: la vocal de legătură NO es uniforme, y ante «o» la norma es
  // no ponerla. Si el ítem llevara objeto femenino, su clave sería la
  // variante 4 frente a 27. El número se imprime para que el siguiente lo
  // vea antes de «mejorar» el ítem cambiándole el objeto.
  { afirmacion: '⚠ ANTE «o» LA NORMA ES SIN VOCAL DE LEGĂTURĂ: por eso el ítem 2 lleva objeto MASCULINO. «văzând-o» sale 27 y «văzându-o» 4', patron: 'v[ăa]zând-o', espera: 'presente' },
  { afirmacion: 'la supletiva que la consigna del ítem 1 tiene que cerrar: «Să mi-o dai» es rumano corriente', patron: 's[ăa] mi-o dai', espera: 'presente' },
];

export const OPCIONES: Opciones = {
  comprobaciones: COMPROBACIONES,
  estrategias: [FUSION_PORTUGUESA, SIN_LEGATURA, PORTUGUES_ENTERO],
  gatesPropios,
  // A n = 2 el detector de orden no puede disparar —sólo mira clases con
  // ≥2 dentro y ≥2 fuera—, y las dos consignas son distintas, así que
  // `dichoPorLaConsigna` lo apagaría igual. Se declara porque el campo es
  // obligatorio y porque el día que alguien añada ítems el orden publicado
  // tiene que ser el que el gate mira.
  semilla: 29,
  juicios: {
    copia: 'CERO de los dos se contestan copiando el foco, y ese cero no deja ninguna regularidad aprovechable: los dos focos son palabras que la transformación SUSTITUYE por otra cosa (un sustantivo articulado por un clítico en el primero, un participio por un gerundio en el segundo), así que «la forma siempre cambia» no es una regla que el alumno pueda sobreaplicar a nada de este punto. Medido ejecutando: copiar el foco 0/2, copiar la frase entera 0/2, la edición modal 0/2 — y ese último cero es un artefacto de n = 2, porque la modal es leave-one-out y con un solo «otro» ítem copia la edición del eje contrario y falla siempre. Lo que protege a este lote no es ninguno de esos números: son las tres estrategias ciegas ejecutadas (la fusión portuguesa, el gerundio sin vocal de legătură y su composición, las tres a 0/2) y los gates estructurales, empezando por el que exige que el ítem de la legătură lleve objeto masculino.',
    frontera: 'SIN FRONTERA: los dos ejes tienen contexto negativo en la lengua y NINGUNO de los dos está determinado, así que no se escribe. (1) La vocal de legătură NO se pone ante «o»: «văzând-o» 27 frente a «văzându-o» 4, o sea que la regla tiene frontera de verdad — pero «văzându-o» está atestado en prosa buena (Filimon, Negruzzi), así que un ítem de frontera suspendería rumano real, que es exactamente lo que mató el eje del alomorfo en el lote 28. Y el daño de no enseñarla es pequeño y medido: quien sobregeneralice «pon siempre la -u-» produce «văzându-o», que está atestado; no produce una forma inexistente. (2) La frontera del clúster sería el imperativo NEGATIVO, donde los clíticos vuelven a ser proclíticos y sin guion («nu mi-o da»), y eso NO cuenta por §4.35: la proclisis con el negativo es gratis por dos vías (es. «no me lo des», pt. «não mo dês») y la forma verbal es r5-imperativo-negativo, publicada con ocho ítems. La sobreaplicación *nu da-mi-o exigiría violar a la vez el español y el portugués, y este alumno no la produce.',
    varianza: 'Lo que varía entre los dos ítems son los dos HECHOS que el punto examina, y son hechos distintos y no dos instancias de uno: el clúster enclítico se mantiene SEGMENTADO con un guion por clítico (dă-mi-o 13, dă-mi-l 6) frente a la fusión portuguesa (dá-mo), y el gerunziu inserta una vocal de legătură ante el clítico (văzându-l 56, văzând-l 0). Las piezas de la operación no llegan al umbral de invariancia porque los dos núcleos no comparten nada. Y lo que hay que justificar es por qué son DOS ítems y no ocho: cada hecho se aprende en el primero, y del segundo en adelante lo único que discriminaría es la FORMA del clítico, que está publicada 16 veces entre r6-cliticos-acusativo y r6-cliticos-dativo — es r8-relativas-pe-care otra vez, cazado antes de escribir. Todo lo demás que el punto declara es gratis por DOS vías independientes: la enclisis con el imperativo afirmativo y la proclisis con el negativo las dan el español («dámelo», «no te vayas») y el portugués europeo C2 («dá-mo», «não te vás»), el orden dativo<acusativo también las dos, y la idea misma del clítico con guion la da el portugués; las formas verbales las publican r3-imperativo-afirmativo (9) y r5-imperativo-negativo (8), y la enclisis con guion sobre un imperativo el alumno ya la escribió en A1 («pune-i o haină», r3-dativo-experimentante, dos veces). ⚠ EL LÍMITE DEL LOTE, escrito: a n = 2 toda propiedad que distinga las dos fuentes separa las clases al 100 % por construcción, y aquí las dos fuentes NO son un par mínimo —una es un imperativo y la otra una temporal— porque no pueden serlo: el punto son dos hechos distintos. Así que lo único que protege al lote son las estrategias ciegas ejecutadas y los gates estructurales, no ninguna búsqueda de composiciones.',
  },
};

if (/[/\\]trans-ro-l29\.ts$/.test(process.argv[1] ?? '')) {
  console.log(`# Lote 29 · transformación · ${ITEMS.length} ítems · ${PUNTO}\n`);
  if (process.argv.includes('--asigna')) {
    const a = informeAsigna(ITEMS.map((x) => ({ p: x.p, sentence: x.s, hintEs: x.hint ?? '', answer: x.r })));
    for (const l of a.lineas) console.log(l);
    process.exit(a.desvio ? 1 : 0);
  }
  for (const x of CONSTRUIDOS) console.log(`- [${x.d.eje}] \`${x.s}\` → \`${x.r}\`  (foco ${x.foco} · núcleo ${x.nucleo})`);
  console.log('');
  for (const l of informe(ITEMS, OPCIONES)) console.log(l);
  const v = verificar(ITEMS, OPCIONES);
  console.log(v.length ? `\n**${v.length} PROBLEMAS:**\n` + v.map((s) => `- ${s}`).join('\n') : '\nLimpio.');
  process.exit(v.length ? 1 : 0);
}
