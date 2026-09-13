// lib/data/languages/ru/paradigma-adj-ru.ts — EL ADJETIVO RUSO, 24 casillas
// por lema, y el gate de atribución que las acompaña.
//
// ══ POR QUÉ ESTE FICHERO NO DUPLICA NINGUNA REGLA ═════════════════════
//
// La gramática escolar rusa presenta CUATRO declinaciones adjetivales
// —dura (новый), blanda (синий), mixta velar (русский) y mixta sibilante
// (хороший)—. **Son dos**, y las otras dos son la dura pasada por la
// ortografía: `русский` es `русс-к-` + las desinencias duras con la regla
// velar (`ы→и`), y `хороший` es lo mismo con la regla de la sibilante más
// la de la /o/ átona. La prueba es que este fichero tiene DOS filas y
// produce las cuatro clases sin una sola excepción declarada.
//
// Y eso no es elegancia: es la condición para que la regla viva en un solo
// sitio. `ortografiar()` está en `paradigma-ru.ts`, la escribió el
// sustantivo, y aquí se IMPORTA. Si el adjetivo tuviera su propia copia, la
// regla de la /o/ —que se arregló el 2026-09-12 tras encontrarla a medias—
// se habría arreglado en una de las dos copias, que es la avería de siempre.
//
// ══ LO QUE ESTE FICHERO NO HACE, ESCRITO EN VEZ DE OMITIDO ════════════
//
// **No produce formas CORTAS** (умён, больна, свободны). No es un olvido:
//
//   1. la vocal de apoyo del masculino es LÉXICA y no se deriva — `умный` →
//      `умён` mete una ё que no está en el lema, `больной` → `болен` mete
//      una е, y `свободный` → `свободен`. Derivarlas produciría `*умн`,
//      `*больн`, y un generador que produce una forma plausible donde no
//      sabe es peor que uno que no produce nada;
//   2. su punto (`u6-adjetivo-corto`) es **B2** y su contenido declarado no
//      es la FORMA sino la FRONTERA donde el atajo ser/estar falla, con
//      `pisoDeclarado: 4`. Una máquina que produjera las cortas no
//      adelantaría ese punto ni un ítem.
//
// Cuando haga falta, entran como DATO por lema y con su cuenta del corpus,
// nunca como regla.
//
// ══ Y EL AVISO QUE EL INVENTARIO YA TRAÍA ESCRITO ═════════════════════
//
// `u6-adjetivo-declinado` dice, palabra por palabra: «el instrumental y el
// prepositivo de masculino y neutro COINCIDEN (-ым, -ом). Un ítem de
// concordancia de género escrito en instrumental aprueba sin distinguir el
// género. […] el plural adjetival es ÚNICO para los tres géneros en los
// seis casos: un ítem de concordancia en plural no mide género JAMÁS».
//
// Eso era una norma en prosa, y una norma en prosa se erosiona —en este
// proyecto, seis veces—. Aquí es `casillasQueDiscriminanGenero()`, que lo
// CALCULA sobre las formas generadas en vez de creérselo.
//
// ⚠ Y AL CORRERLO, EL NÚMERO REFUTÓ LAS DOS PROSAS: LA DEL INVENTARIO Y LA
// MÍA, ESCRITA EN ESTE MISMO FICHERO TRES MINUTOS ANTES.
//
// Yo había escrito aquí «4 de 18 casillas del singular distinguen los tres
// géneros». Medido sobre los seis lemas: **DOS de los seis casos**, el
// nominativo y el acusativo —que lo copia en el inanimado—. Y el inventario
// decía «el instrumental y el prepositivo de masculino y neutro COINCIDEN»,
// que es cierto y es **la mitad**: coinciden también el GENITIVO (нового) y
// el DATIVO (новому). Son cuatro casos sincréticos de seis, no dos, y quien
// leyera la prosa del punto daría por buenos para un ítem de concordancia
// justo los dos que faltaban en la lista.
//
// Del plural, **ninguna** casilla distingue género: seis de seis.
//
// Es la regla a la que le falta una mitad, dos veces sobre el mismo hecho, y
// las dos veces la escribió alguien que tenía el paradigma delante. El número
// no sale ya de una lista escrita a mano que se desincroniza: sale de la
// máquina, y hay test que lo fija.
//
// Y un sincretismo más que ninguna de las dos prosas nombraba, y que sólo
// aparece en los lemas de desinencia TÓNICA: en `большой` y `молодой` el
// nominativo masculino es homógrafo de **las cuatro casillas oblicuas del
// femenino** (большой = m.nom, f.gen, f.dat, f.instr, f.prep). Seis casillas
// con una sola forma.
import {
  ortografiar,
  type CasoRu, type NumeroRu, type TemaRu, type EntradaNominal, type Aviso,
} from './paradigma-ru';
import { revisarOrtografiaRu, quitarAcento } from '../../../lang/ortografia-ru';

export interface EntradaAdjetival {
  /** Nominativo masculino singular, con la ё escrita y sin tilde. */
  lema: string;
  /** DOS clases, no cuatro. `blando` es sólo la de `синий`, `последний`,
   *  `летний`: la que tiene el tema acabado en consonante blanda. Las
   *  «mixtas» de la gramática escolar son `duro` + la ortografía. */
  tema: 'duro' | 'blando';
  /** ⚠ EL ACENTO, Y AQUÍ ES UN CAMPO OBLIGATORIO Y NO OPCIONAL.
   *
   *  En el sustantivo la /o/ de la desinencia sólo aparece en dos casillas y
   *  con tema duro no sibilante es irrelevante. En el adjetivo el acento
   *  decide **el nominativo masculino de todos los lemas** (`молодо́й` frente
   *  a `но́вый`), así que no hay ningún adjetivo para el que se pueda omitir.
   *
   *  `хороший` y `большой` se diferencian EXCLUSIVAMENTE en este bit —el
   *  mismo tema sibilante, la misma clase— y de él salen ocho casillas
   *  distintas: большого/хорошего, большому/хорошему, большом/хорошем,
   *  большой/хорошей, большое/хорошее. Es el par que prueba que el acento
   *  aquí es dato de la lengua y no presentación. */
  desinenciaTonica: boolean;
  glosa: string;
  /** Casillas sueltas que la regla falla. Clave `<genero|pl>.<caso>`. */
  irregular?: Partial<Record<string, string>>;
  /** Ver `lecturaRival` en `EntradaNominal`: la lectura de un rival que no
   *  da cero, por casilla. Va en el LEXICÓN y nunca en un comentario. */
  lecturaRival?: Record<string, string>;
  /** Ver `lecturaYo` en `EntradaNominal`. */
  lecturaYo?: Record<string, string>;
  nota?: string;
}

/** Las 24 casillas: seis casos × (m, f, n, pl). El plural es ÚNICO para los
 *  tres géneros, y eso no es una economía de la tabla: es un hecho de la
 *  lengua con consecuencias de medición. */
export type FormaAdjetival = 'm' | 'f' | 'n' | 'pl';
export const FORMAS_ADJ: FormaAdjetival[] = ['m', 'f', 'n', 'pl'];
export const CASOS_ADJ: CasoRu[] = ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'];

// ── LAS DOS FILAS ────────────────────────────────────────────────────
//
// El orden es [nom, ac, gen, dat, instr, prep]. `null` en el acusativo
// significa «lo decide la animacidad», igual que en el sustantivo: no se
// pone una forma por defecto, porque una forma por defecto en esa casilla
// es exactamente el fallo que devuelve un número plausible.
//
// `%` es el sentinela de la /o/ de la desinencia (ver `ortografiar`): UNA
// regla, tres grafías, gobernada por el tema y el acento.
// `ы` se escribe `ы` y la regla velar/sibilante la convierte en `и` DESPUÉS
// — el mismo orden que el sustantivo, y el que la v0 del inventario tenía
// invertido.
type FilaAdj = (string | null)[];

const ADJ_DURO: Record<FormaAdjetival, FilaAdj> = {
  //        nom     ac     gen      dat      instr   prep
  m:  [null /* el nominativo masculino lo decide el acento */, null, '%го', '%му', 'ым', '%м'],
  f:  ['ая', 'ую', '%й', '%й', '%й', '%й'],
  n:  ['%е', '%е', '%го', '%му', 'ым', '%м'],
  pl: ['ые', null, 'ых', 'ым', 'ыми', 'ых'],
};

const ADJ_BLANDO: Record<FormaAdjetival, FilaAdj> = {
  m:  ['ий', null, '%го', '%му', 'им', '%м'],
  f:  ['яя', 'юю', '%й', '%й', '%й', '%й'],
  n:  ['%е', '%е', '%го', '%му', 'им', '%м'],
  pl: ['ие', null, 'их', 'им', 'ими', 'их'],
};

/** El tema: el lema menos su desinencia de nominativo masculino. */
export function temaAdj(e: EntradaAdjetival): string {
  const l = quitarAcento(e.lema);
  return l.replace(/(ый|ой|ий)$/, '');
}

/** ⚠ EL NOMINATIVO MASCULINO ES LA ÚNICA CASILLA QUE NO SALE DEL SENTINELA,
 *  y por eso está aparte con su nombre.
 *
 *  `-ой` cuando la desinencia es tónica (молодой, большой, голубой) y `-ый`
 *  cuando no (новый) — y `-ый` pasa por la regla velar/sibilante, que lo
 *  escribe `-ий`: **русский y хороший no son una tercera desinencia, son
 *  `-ый` bien escrito**. La alternancia `ой/ый` NO es la de la /o/ átona
 *  (`ой` frente a `ей`) y confundirlas produciría `*хорошей` en el
 *  nominativo masculino. Son dos reglas que comparten una letra. */
function nomMasculino(e: EntradaAdjetival): string | null {
  const t = temaAdj(e);
  if (e.tema === 'blando') return t + 'ий';
  return e.desinenciaTonica ? t + 'ой' : ortografiar(t, 'ый', { clase: 'duro', tonica: e.desinenciaTonica });
}

/** Una casilla del adjetivo. `animado` sólo hace falta en el acusativo
 *  masculino singular y en el plural, y va EXPLÍCITO: sin él esas dos
 *  casillas devuelven `null` en vez de una de las dos formas posibles.
 *
 *  ⚠ ES LA MISMA JUGADA QUE `prepositivoSg()` CON SU REGENTE. No existe «el
 *  acusativo» de `новый` a secas: `вижу новый дом` y `вижу нового студента`
 *  son las dos correctas y lo decide el SUSTANTIVO, no el adjetivo. Una
 *  firma que no se puede llamar mal vale más que un comentario — y aquí el
 *  comentario sería además el punto `u5-animacidad-acusativo`, que es A2. */
export function casillaAdj(
  e: EntradaAdjetival,
  forma: FormaAdjetival,
  caso: CasoRu,
  opts: { animado?: boolean } = {},
): string | null {
  const guardada = e.irregular?.[`${forma}.${caso}`];
  if (guardada) return guardada;

  const t = temaAdj(e);
  const clase: TemaRu = e.tema === 'blando' ? 'blando' : 'duro';
  const ctx = { clase, tonica: e.desinenciaTonica };

  if (forma === 'm' && caso === 'nom') return nomMasculino(e);

  if (caso === 'ac' && (forma === 'm' || forma === 'pl')) {
    if (opts.animado === undefined) return null;   // la máquina NO SABE
    return casillaAdj(e, forma, opts.animado ? 'gen' : 'nom', opts);
  }

  const fila = e.tema === 'blando' ? ADJ_BLANDO[forma] : ADJ_DURO[forma];
  const des = fila[CASOS_ADJ.indexOf(caso)] ?? null;
  if (des === null) return null;
  return ortografiar(t, des, ctx);
}

export type TablaAdjetival = Record<FormaAdjetival, Partial<Record<CasoRu, string>>>;

/** El paradigma entero SIN los dos acusativos que dependen de la
 *  animacidad: los omite en vez de elegir uno. */
export function paradigmaAdj(e: EntradaAdjetival): TablaAdjetival {
  const out = {} as TablaAdjetival;
  for (const f of FORMAS_ADJ) {
    out[f] = {};
    for (const c of CASOS_ADJ) {
      const x = casillaAdj(e, f, c);
      if (x) out[f][c] = x;
    }
  }
  return out;
}

// ══════════════════════════════════════════════════════════════════════
// LA CONCORDANCIA, Y POR QUÉ LA HACE UNA FUNCIÓN Y NO EL AUTOR DEL LOTE
// ══════════════════════════════════════════════════════════════════════
//
// Un sintagma ruso obliga a resolver DOS paradigmas a la vez, y eso es lo
// que dice el punto: «multiplica cada sintagma». Si el lote escribe el
// adjetivo a mano, la animacidad —que vive en el SUSTANTIVO— se copia a
// mano, y una copia es la regla duplicada de siempre.
//
/** El adjetivo concordado con un sustantivo concreto en un caso y un
 *  número. La animacidad sale de la ENTRADA NOMINAL, nunca del llamador. */
export function concordar(
  adj: EntradaAdjetival,
  nombre: EntradaNominal,
  caso: CasoRu,
  num: NumeroRu,
): string | null {
  const forma: FormaAdjetival = num === 'pl' ? 'pl' : nombre.genero;
  return casillaAdj(adj, forma, caso, { animado: nombre.animado ?? false });
}

// ══════════════════════════════════════════════════════════════════════
// EL GATE DE ATRIBUCIÓN: qué casilla puede medir el género, CALCULADO
// ══════════════════════════════════════════════════════════════════════
//
// ⚠ ESTO ES EL AVISO DE `u6-adjetivo-declinado` CONVERTIDO EN INVARIANTE.
// El punto lo traía escrito en prosa, y lo que el proyecto ha aprendido seis
// veces es que una norma en prosa se erosiona y un invariante se ejecuta.
//
// La pregunta que contesta —y sólo ésa— es: **en esta casilla, ¿las tres
// formas de género son distintas entre sí?** Si no lo son, un ítem que pida
// «el adjetivo que concuerda con este sustantivo» se acierta sin saber el
// género, y el ítem mide otra cosa. No contesta «¿el ítem es bueno?»: un
// ítem legítimo puede vivir en una casilla sincrética si lo que examina es
// la FORMA y no la concordancia. Usarlo como prueba de eso sería un sello
// respondiendo la pregunta de otro.
//
/** Las casillas del SINGULAR en que las tres formas de género difieren.
 *  Se calcula sobre las formas que la máquina produce, no se enumera. */
export function casillasQueDiscriminanGenero(e: EntradaAdjetival): CasoRu[] {
  const out: CasoRu[] = [];
  for (const c of CASOS_ADJ) {
    const tres = (['m', 'f', 'n'] as FormaAdjetival[]).map((f) =>
      casillaAdj(e, f, c, { animado: false }),
    );
    if (tres.some((x) => x === null)) continue;
    if (new Set(tres).size === 3) out.push(c);
  }
  return out;
}

/** Los grupos de casillas del singular que comparten forma, por género.
 *  Existe para que un lote pueda IMPRIMIR su sincretismo en vez de
 *  descubrirlo cuando el alumno acierta sin saber. */
export function sincretismosAdj(e: EntradaAdjetival): { forma: string; casillas: string[] }[] {
  const mapa = new Map<string, string[]>();
  for (const f of FORMAS_ADJ) {
    for (const c of CASOS_ADJ) {
      const x = casillaAdj(e, f, c, { animado: false });
      if (!x) continue;
      mapa.set(x, [...(mapa.get(x) ?? []), `${f}.${c}`]);
    }
  }
  return [...mapa.entries()]
    .filter(([, cs]) => cs.length > 1)
    .map(([forma, casillas]) => ({ forma, casillas }));
}

// ══════════════════════════════════════════════════════════════════════
// LOS INVARIANTES
// ══════════════════════════════════════════════════════════════════════
export function invariantesAdjetivales(entradas: EntradaAdjetival[]): Aviso[] {
  const out: Aviso[] = [];
  for (const e of entradas) {
    // ⚠ LA CASILLA QUE FALTA NO APARECE EN LA TABLA. Misma razón que en el
    // sustantivo: `paradigmaAdj` filtra los `null`, así que se pregunta por
    // las 24 casillas por su nombre. Los dos acusativos que dependen de la
    // animacidad se piden CON ella, porque sin ella el null es correcto.
    for (const f of FORMAS_ADJ) {
      for (const c of CASOS_ADJ) {
        const x = casillaAdj(e, f, c, { animado: false });
        if (x === null || !x.trim()) {
          out.push({ lema: e.lema, clase: 'casilla-nula', detalle: `${f}.${c}` });
          continue;
        }
        for (const h of revisarOrtografiaRu(x)) {
          out.push({ lema: e.lema, clase: `ortografia:${h.clase}`, detalle: `${f}.${c} = ${x}` });
        }
      }
    }
    // El nominativo generado tiene que ser EL LEMA. Es la comprobación que
    // cierra el círculo entre el dato y la regla: si `desinenciaTonica` está
    // mal declarado, `новый` sale `*новой` y esto lo ve sin corpus.
    if (casillaAdj(e, 'm', 'nom') !== quitarAcento(e.lema)) {
      out.push({
        lema: e.lema, clase: 'nominativo-no-es-el-lema',
        detalle: `la regla da «${casillaAdj(e, 'm', 'nom')}» y el lema es «${quitarAcento(e.lema)}»: revisa \`desinenciaTonica\` o \`tema\``,
      });
    }
    // ⚠ NO EXISTE EL ADJETIVO BLANDO CON DESINENCIA TÓNICA. Las clases en
    // `-ий` son todas de tema acentuado (синий, последний, летний, ранний),
    // y declarar `blando` + tónica produciría un paradigma que no existe.
    // Va como invariante y no como comentario porque es la clase de
    // combinación que nadie prueba.
    if (e.tema === 'blando' && e.desinenciaTonica) {
      out.push({ lema: e.lema, clase: 'blando-tonico-no-existe', detalle: 'el adjetivo blando ruso es siempre de tema acentuado' });
    }
  }
  return out;
}
