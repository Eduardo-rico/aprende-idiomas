// scripts/publicar-la.ts — EL PUBLICADOR DEL LATÍN.
//
//   npx tsx scripts/publicar-la.ts            # dry-run
//   npx tsx scripts/publicar-la.ts --write    # escribe
//
// Mismo contrato que los publicadores de rumano: **valida TODO antes de
// escribir NADA**, elige la lección por los `conceptIds` declarados, el id
// ES el hash del contenido, y el sello dice qué certifica y qué no.
//
// ══ LO PROPIO DEL LATÍN: OCHO FORMAS DE ÍTEM, NO UNA ═════════════════
//
// El traspaso decía «portar publicar-cloze-ro.ts». No basta: los 35 lotes
// del latín usan **16 tipos de ítem** que se reducen a **8 formas de
// publicación** distintas, y cada lote usa una sola (comprobado: ningún
// lote es mixto). Cuatro traen la superficie del ejercicio dentro del
// dato y cuatro no:
//
//   PUBLICABLES — el hueco ya está escrito en el dato
//   · A `marco` latino con «___» + `respuesta`      230 ítems, 15 lotes
//   · D `glosa` española con «___» + `respuesta`    113 ítems,  8 lotes
//   · B `glosa` con N huecos + `respuestas[]`        32 ítems,  2 lotes
//   · C flashcard de falso regalo                    12 ítems,  1 lote
//
//   NO PUBLICABLES TODAVÍA — habría que INVENTAR la pantalla
//   · E `ficha` → forma concordada      14   (l2-genero-3a)
//   · F `palabra` → respuesta en lista  12   (l10-que-enclitico)
//   · G `entrada` → clasificación       40   (l5-conjugacion-por-infinitivo,
//                                             l5-futuro, l5-partes-principales)
//   · H `latin` → «si»/«no»             12   (l5-interrogativas)
//
// Las cuatro de abajo NO se publican y **no es pereza**: sus lotes se
// escribieron como DATOS PARA GATES, no como pantallas, así que ninguno
// dice qué lee el alumno ni dónde va el hueco. Construirlo aquí sería
// inventar la interacción —y con ella el criterio de corrección— en el
// publicador, que es el sitio donde nadie volvería a mirarlo. Es una
// decisión de producto y va declarada, no improvisada.
import fs from 'node:fs';
import path from 'node:path';
import { BLOCKS, ALL_CONCEPTS } from '../lib/data/languages/la/curriculum';
import { blocksDir } from '../lib/data/registry';
import { hashKey } from './lib/cache';
import { ExerciseSchema } from '../lib/data/zod-schemas';
import { sinCantidad } from '../lib/lang/ortografia-la';

const HOY = new Date().toISOString().slice(0, 10);
const write = process.argv.includes('--write');
const LOTES_DIR = path.join(process.cwd(), 'lib/data/languages/la/lotes');
const BLOCKS_DIR = blocksDir('la');
const CONCEPTO = new Map(ALL_CONCEPTS.map((c) => [c.id, c]));

type Crudo = Record<string, unknown>;
const str = (v: unknown) => (typeof v === 'string' ? v : undefined);

/** La forma de publicación de un ítem, deducida de su DATO y no de su
 *  tipo TypeScript: los tipos son 16 y las formas 8, y lo que decide qué
 *  ve el alumno es dónde está el hueco. */
export type Forma = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';

export function formaDe(it: Crudo): Forma {
  const marco = str(it.marco);
  const glosa = str(it.glosa);
  if (marco?.includes('___') && str(it.respuesta)) return 'A';
  if (Array.isArray(it.palabras) && Array.isArray(it.respuestas)) return 'B';
  if (it.sentidoLatino !== undefined) return 'C';
  if (glosa?.includes('___') && str(it.respuesta)) return 'D';
  if (it.ficha !== undefined) return 'E';
  if (Array.isArray(it.respuesta)) return 'F';
  // I y J salen de partir la vieja «G», que mezclaba tres cosas. Las dos
  // primeras SÍ traen su superficie y las apartó el primer barrido por no
  // mirar dentro; lo señaló el latinista.
  if (str(it.entrada)?.includes('___') && str(it.respuesta)) return 'I';
  if (str(it.desde) && str(it.hacia) && str(it.entrada) && str(it.respuesta)) return 'J';
  if (it.entrada !== undefined && str(it.respuesta)) return 'G';
  return 'H';
}

const PUBLICABLES: Forma[] = ['A', 'B', 'C', 'D', 'I', 'J'];

/** Lotes que SÍ tienen forma publicable y aun así no se publican, con el
 *  motivo. Cada entrada exige haber comprobado el motivo, no suponerlo. */
/** Los puntos donde la CANTIDAD VOCÁLICA es el rasgo examinado. En ellos
 *  no se puede publicar la forma sin mácrón como alternativa: sería
 *  «la normalización tapa el rasgo examinado», que este repositorio ya
 *  pagó tres veces — con la comparación insensible, «manus» pasaría por
 *  «manūs» y el ítem no podría fallar nunca. */
const CANTIDAD_ES_EL_PUNTO = new Set(['l2-cuarta', 'l5-conjugacion-por-infinitivo', 'l1-cantidad-fonemica']);

const APLAZADOS_CON_MOTIVO: Record<string, string> = {
  // ── LOS OCHO LOTES DE FORMA D, aplazados EN BLOQUE ────────────────
  //
  // Los aplaza el ataque del latinista adversarial del 2026-09-10, y no
  // por la forma —que es buena— sino porque sus claves son ÚNICAS donde
  // la traducción admite más de una respuesta correcta, y `alternatives`
  // va vacío. Tres familias, las tres medidas:
  //
  //   · EL ARTÍCULO. La clave de «Puella rosam portat» es «la rosa», y
  //     «una rosa» y «rosa» son igual de correctas — lo dice el propio
  //     curso en el primer objetivo del bloque 2: «puella» es «una niña»,
  //     «la niña» o «niña» según el contexto. El curso enseñaría que el
  //     artículo no está determinado y suspendería a quien escribe el
  //     otro. ~48 ítems.
  //   · EL POSESIVO. «Filia matrem audit» → clave «a la madre», y «a su
  //     madre» es la traducción natural.
  //   · EL GÉNERO Y LA PERSONA, y es la peor: 9 de los 12 de
  //     `l5-pro-drop` admiten una segunda respuesta buena que la clave
  //     suspende — «erat/vidēbat/audiēbat» no marcan género, así que
  //     «ella» vale tanto como «él»; «ellas» tanto como «ellos»;
  //     «vosotros» tanto como «ustedes».
  //
  // No se arregla en el publicador: las alternativas hay que escribirlas
  // ítem por ítem, bajo el gate del lote. Y no es cosmético — cada fallo
  // falso entra en el FSRS.
  'l2-neutro-a': 'FORMA D · la clave lleva artículo español y el latín no tiene artículo: «la alegría» suspende a quien escribe «alegría» o «una alegría». Necesita `alternativas` por ítem.',
  'l2-plural-tantum': 'FORMA D · misma familia del artículo, y encima con lemas cuyo sentido en español oscila («litterae» = la carta / las cartas).',
  'l3-acusativo-od': 'FORMA D · artículo Y posesivo: «a la madre» suspende «a su madre», que es la traducción natural.',
  'l3-ablativo': 'FORMA D · artículo, y además DOS ítems (la-3ab-11, la-3ab-12) cuya única clave aceptada produce español AGRAMATICAL: «de» + «el templo» = «de el templo», que en español es obligatoriamente «del». Quien escribe la forma buena suspende. Hay que reescribir la glosa o admitir «del»/«desde el», y eso es del gate del lote.',
  'l5-pro-drop': 'FORMA D · 9 de 12 admiten una segunda respuesta correcta que la clave suspende: «erat», «vidēbat» y «audiēbat» no marcan género, así que «ella» vale tanto como «él»; igual «ellas»/«ellos» y «vosotros»/«ustedes».',
  // ⚠ `l3-nominativo`, `l3-genitivo-posesivo` y `l3-dativo-ci` ESTUVIERON
  //   AQUÍ y salieron el 2026-09-11. Su motivo era que la clave llevaba
  //   artículo español siendo el latín una lengua sin artículo, y eso ya
  //   no pasa: `conAlternativaDeDeterminante` cierra la familia mecánica
  //   —definido ↔ indefinido, con «del» y «al»— y el gate la EXIGE por
  //   ítem, así que un lote sin ella no compila el gate. Las otras dos
  //   familias que el latinista nombró no les afectan: el posesivo («a la
  //   madre» / «a su madre») es de `l3-acusativo-od` y el género que el
  //   verbo no marca es de `l5-pro-drop`, y los dos siguen aquí.
  //
  //   De paso se les arreglaron once ítems INDETERMINADOS que ningún gate
  //   veía, porque el ítem se corrige contra la glosa y nadie comprueba si
  //   el LATÍN admite otra lectura: cinco genitivos con cópula (dativo
  //   posesivo, A&G §373), cinco dativos pegados a un sustantivo (lectura
  //   de genitivo, la mayoritaria del corpus) y uno de nominativo plural
  //   derrotado por pro-drop. Los tres casos son gates ahora.
  // ── Y el de la cantidad ───────────────────────────────────────────
  'l2-cuarta':
    'LA CANTIDAD ES SU PUNTO Y POR ESO NO TIENE SALIDA HOY. El punto existe porque «manus» (nom.) y «manūs» (gen.) sólo se distinguen por el mácrón, así que 7 de sus 12 respuestas lo llevan. No se puede publicar la forma sin mácrón como alternativa —taparía justo el rasgo examinado, y el ítem no podría fallar nunca— ni dejarla sin alternativa, porque un teclado español no escribe «ū». Necesita que la tarjeta llame a `comparaLa(valor, clave, { sensibleACantidad })`, que `lib/exercises/normalize.ts` ya anuncia y que hoy NO tiene ni un consumidor.',
  'l2-sin-articulo':
    'LA RESPUESTA CORRECTA DE 4 DE SUS 12 ÍTEMS ES LA CADENA VACÍA —«el señor es ___ maestro» → sin artículo, `ejes.valor: "ninguno"`— y `components/cards/FillBlankCard.tsx` deshabilita el botón mientras algún hueco esté vacío (`completo = valores.every(v => v.trim().length > 0)`), así que esos cuatro serían INCONTESTABLES. Y publicar sólo los otros ocho es peor que no publicar nada: dejaría un lote donde SIEMPRE hay artículo, que es exactamente la falsedad que el punto existe para impedir. Necesita una superficie que admita «ninguno» como respuesta; es decisión de producto.',
};

/** El `data` del ejercicio, por forma. Nada se inventa: el hueco, la frase
 *  y la pista salen del propio dato. Lo único que decide este código es
 *  QUÉ CAMPO es la frase y cuál el contexto. */
/** LA ALTERNATIVA SIN MÁCRÓN, y por qué no es cosmética.
 *
 *  146 de las 462 respuestas de los lotes llevan mácrón, y un teclado
 *  español no escribe «ū»: sin esto, `l5-imperfecto` sería 14/14
 *  INCONTESTABLE, que es peor que el caso por el que se apartó
 *  `l2-sin-articulo`. Se publica la forma sin cantidad como alternativa
 *  —que es exactamente el modo no sensible de `comparaLa`— SALVO en los
 *  puntos donde la cantidad ES el rasgo examinado, que se aplazan enteros
 *  en vez de taparles el punto.
 *
 *  Lo señaló el latinista adversarial, y ya estaba escrito en
 *  `lib/exercises/normalize.ts`: «cuando existan ítems latinos, la tarjeta
 *  debe llamar a comparaLa». Hoy `comparaLa` no tiene ni un consumidor;
 *  esto es la mitad que se puede cerrar desde el publicador. */
function alternativasDe(it: Crudo): string[] {
  const r = str(it.respuesta);
  if (!r || CANTIDAD_ES_EL_PUNTO.has(String(it.punto))) return [];
  if (colapsaSinMacron(it)) return [];
  const sin = sinCantidad(r);
  return sin !== r ? [sin] : [];
}

/** ⚠ EL ÍTEM CUYA ALTERNATIVA SIN MÁCRÓN ACEPTARÍA OTRA CELDA.
 *
 *  La regla del mácrón se escribió el 2026-09-10 por punto —«salvo donde
 *  la cantidad ES el rasgo examinado»— y eso no basta: la colisión no es
 *  propiedad del PUNTO, es propiedad de la CELDA. El ablativo singular de
 *  la 1.ª (`terrā`) sólo se separa del nominativo (`terra`) por la
 *  cantidad, y el genitivo singular de la 4.ª (`manūs`) del nominativo
 *  igual — en puntos que no son «de cantidad».
 *
 *  El daño estaba VIVO: `l2-genitivo-clave/la-2g-04` se publicó aceptando
 *  «manus» como respuesta buena del genitivo «manūs», o sea aceptando la
 *  celda equivocada. Lo destapó escribir el lote de la 1.ª, no un gate.
 *
 *  Los ítems ya lo declaran: `ejes.colapsaAlLeer` existe justamente para
 *  esto. Así que el ítem se APARTA —ni con alternativa, que tapa el
 *  rasgo, ni sin ella, que lo vuelve intecleable— y se dice cuál y por
 *  qué. Vuelve cuando la tarjeta llame a `comparaLa`. */
function colapsaSinMacron(it: Crudo): boolean {
  const r = str(it.respuesta);
  const ejes = it.ejes as Crudo | undefined;
  return !!r && !!ejes?.colapsaAlLeer && sinCantidad(r) !== r;
}

function datosDe(it: Crudo, f: Forma): { type: string; data: Record<string, unknown> } {
  // ⚠ EL LATÍN NO SIEMPRE VIVE EN `marco`. `ItemProDrop`, `ItemAblativo` y
  //   `ItemArticulo` lo guardan en `latin`, y la primera versión de este
  //   publicador sólo miraba `marco`: esos ítems salían CON LA GLOSA Y SIN
  //   LA FRASE LATINA, o sea imposibles de contestar. No lo habría visto
  //   nadie leyendo el JSON —el campo existe y está vacío— y lo delató el
  //   gate de enunciado repetido, porque sin latín seis pantallas quedaban
  //   idénticas. Un defecto que se manifiesta como otro.
  const marco = str(it.marco) ?? str(it.latin) ?? '';
  const glosa = str(it.glosa) ?? '';
  const pista = str(it.pista) ?? '';
  switch (f) {
    case 'I': {
      // `l5-partes-principales`: el hueco ya viene escrito DENTRO de la
      // entrada («dūcō, dūcere, ___»). El primer barrido lo apartó por
      // mirar sólo `marco`.
      return { type: 'fill_blank', data: {
        sentence: str(it.entrada)!,
        blanks: [{ position: 0, answer: str(it.respuesta)!, alternatives: alternativasDe(it) }],
        hintEs: pista,
      } };
    }
    case 'J': {
      // `l5-futuro`: el propio ítem declara `desde` y `hacia`, así que la
      // consigna se DERIVA y no se inventa.
      return { type: 'transformation', data: {
        source: str(it.entrada)!,
        instructionEs: `Pásalo de ${str(it.desde)} a ${str(it.hacia)}, en la misma persona.`,
        answer: str(it.respuesta)!,
        alternatives: alternativasDe(it),
        hintEs: pista,
      } };
    }
    case 'A': {
      // El alumno lee la frase LATINA con el hueco y escribe la forma.
      // La glosa española y la pista son contexto, y van juntas porque
      // sin la glosa el hueco no está determinado en una lengua de casos.
      const ctx = [glosa, pista].filter(Boolean).join(' · ');
      return { type: 'fill_blank', data: {
        sentence: marco,
        blanks: [{ position: 0, answer: str(it.respuesta)!, alternatives: alternativasDe(it) }],
        hintEs: ctx,
      } };
    }
    case 'D': {
      // El hueco está en la GLOSA: el alumno lee el latín entero y
      // completa la traducción. El latín va en la pista porque es el
      // enunciado, no una ayuda opcional.
      const ctx = [marco, pista].filter(Boolean).join(' · ');
      return { type: 'fill_blank', data: {
        sentence: glosa,
        blanks: [{ position: 0, answer: str(it.respuesta)!, alternatives: [] }],
        hintEs: ctx,
      } };
    }
    case 'B': {
      // N huecos en la glosa: el alumno reparte los papeles. Es el
      // formato del punto central del curso.
      const rs = it.respuestas as string[];
      return { type: 'fill_blank', data: {
        sentence: glosa,
        blanks: rs.map((r, i) => ({ position: i, answer: r, alternatives: [] })),
        hintEs: str(it.latin) ?? str(it.marco) ?? '',
      } };
    }
    case 'C': {
      const aviso = str(it.porQueUnHispanohablante);
      return { type: 'flashcard', data: {
        front: str(it.lema)!,
        back: [str(it.sentidoLatino), aviso ? `⚠ ${aviso}` : null].filter(Boolean).join('\n\n'),
        example: `${str(it.descendiente)} = ${str(it.sentidoDescendiente)}`,
      } };
    }
    default:
      throw new Error(`forma ${f} no publicable`);
  }
}

async function main() {
  const problemas: string[] = [];
  const porDefecto: string[] = [];
  const aplazados = new Map<Forma, Map<string, number>>();
  const conMotivo = new Map<string, string>();
  const porBloque = new Map<number, unknown[]>();
  const usados = new Map<string, { ex: Record<string, unknown>; data: Record<string, unknown>; punto: string }>();
  const fusionados: string[] = [];
  const porCelda: string[] = [];

  const yaEnCorpus = new Map<string, string>();
  if (fs.existsSync(BLOCKS_DIR)) for (const f of fs.readdirSync(BLOCKS_DIR).filter((x) => /^b\d+\.json$/.test(x)))
    for (const ex of JSON.parse(fs.readFileSync(path.join(BLOCKS_DIR, f), 'utf8')) as Crudo[]) {
      const d = ex.data as Crudo | undefined;
      const s = str(d?.sentence) ?? str(d?.front) ?? str(d?.source);
      if (s) yaEnCorpus.set(`${s.toLowerCase().replace(/\s+/gu, ' ').trim()} ⟦${(str(d?.hintEs) ?? str(d?.instructionEs) ?? '').toLowerCase().replace(/\s+/gu, ' ').trim()}⟧`, String(ex.id));
    }

  for (const fichero of fs.readdirSync(LOTES_DIR).filter((x) => x.endsWith('.ts') && !x.startsWith('_')).sort()) {
    const mod = await import(path.join(LOTES_DIR, fichero)) as Record<string, unknown>;
    // ⚠ UN LOTE PUEDE EXPORTAR MÁS DE UN ARRAY DE ÍTEMS, y no todos son
    //   el lote. `l2-genitivo-clave` exporta también `NECESITAN_EL_GENITIVO`
    //   (8) y `l2-plural-tantum` exporta `USAN_EL_SINGULAR` (3): son
    //   SUBCONJUNTOS declarativos que el gate usa para comprobarse a sí
    //   mismo, y publicarlos duplicaba esos 11 ítems. La primera versión de
    //   este publicador los contaba, y lo delató un recuento de 465 donde
    //   el lote decía 454 — y encima disfrazado de «frase repetida», que
    //   apuntaba al sitio equivocado. Se publica SÓLO el array `LOTE*`, que
    //   es el que pasa por `ordenPublicado`.
    const claves = Object.keys(mod).filter((k) => {
      const v = mod[k];
      return Array.isArray(v) && v.length > 0 && typeof (v[0] as Crudo).punto === 'string';
    });
    const delLote = claves.filter((k) => k.startsWith('LOTE'));
    if (claves.length && !delLote.length) problemas.push(`${fichero}: exporta ítems pero ninguno en un array «LOTE*»`);
    if (delLote.length > 1) problemas.push(`${fichero}: exporta ${delLote.length} arrays «LOTE*» y no se sabe cuál es el lote`);
    for (const clave of delLote) {
      const items = mod[clave] as Crudo[];
      // El aplazamiento CON MOTIVO va primero: un lote apartado no tiene
      // que pasar los gates de forma, y si los pasara por accidente el
      // motivo dejaría de leerse.
      const motivo = APLAZADOS_CON_MOTIVO[fichero.replace('.ts', '')];
      if (motivo) { conMotivo.set(fichero.replace('.ts', ''), `${items.length} ítems · ${motivo}`); continue; }
      // ⚠ VETO EXPLÍCITO. `l2-genero-3a` NO puede publicarse como forma A
      //   aunque su marco traiga «___»: el marco es «magnus ___», o sea
      //   que el ADJETIVO —lo único que revela el género, que es el punto—
      //   ya está dado. Hoy se salva sólo porque la fuente no copia
      //   `marco` al ítem; en cuanto alguien lo copie, `formaDe` diría 'A'
      //   y se publicarían 14 ítems que no miden su punto. El veto no
      //   cuelga de esa omisión.
      if (fichero.startsWith('l2-genero-3a') && items.some((x) => formaDe(x) === 'A'))
        problemas.push(`${fichero}: no puede publicarse como forma A — su marco «magnus ___» ya da el adjetivo, que es lo único que revela el género`);
      const formas = new Set(items.map(formaDe));
      if (formas.size !== 1) { problemas.push(`${fichero}: el lote es MIXTO (${[...formas].join(', ')}) y cada lote tiene que tener una sola forma`); continue; }
      const forma = [...formas][0]!;
      if (!PUBLICABLES.includes(forma)) {
        const m = aplazados.get(forma) ?? new Map<string, number>();
        m.set(fichero.replace('.ts', ''), items.length);
        aplazados.set(forma, m);
        continue;
      }
      for (const it of items) {
        const punto = String(it.punto);
        const c = CONCEPTO.get(punto);
        if (!c) { problemas.push(`${it.id}: el punto «${punto}» no existe en el inventario`); continue; }
        const bloque = BLOCKS.find((b) => b.id === c.blockId);
        if (!bloque) { problemas.push(`${it.id}: el bloque ${c.blockId} de «${punto}» no tiene lecciones declaradas`); continue; }
        // ⚠ LA LECCIÓN SE ELIGE POR EL PUNTO, NUNCA POR UN PRERREQUISITO.
        //   La primera versión copió del publicador de rumano
        //   `padres = [punto, ...prereqs]` más un `?? lessons[0]`, y en
        //   latín eso mandaba 13 de los 24 puntos a la lección
        //   equivocada: un ítem de `l2-quinta` casa con el prereq
        //   `l2-genitivo-clave`, que vive en la lección 1, así que la
        //   quinta declinación se publicaba dentro de «La entrada del
        //   léxico» — y `la-b2-l4` y `la-b3-l2` se quedaban con sus
        //   objetivos y CERO ejercicios. No lo veía nadie: el aviso de
        //   «lección por defecto» sólo salta cuando NO casa ningún padre,
        //   y aquí casaba. El dry-run imprimía «Gates limpios».
        //   Un punto sin lección declarada es un PROBLEMA, no un destino.
        const leccion = bloque.lessons.find((l) => l.conceptIds.includes(punto));
        if (!leccion) { problemas.push(`${String(it.id)}: el punto «${punto}» no está declarado en ninguna lección de b${bloque.id}`); continue; }
        if (colapsaSinMacron(it)) {
          porCelda.push(`${String(it.id)} (${punto}): «${str(it.respuesta)}» — sin el mácrón acepta otra celda (${String((it.ejes as Crudo).colapsaAlLeer)}), y con él no se teclea`);
          continue;
        }
        const { type, data } = datosDe(it, forma);
        const id = hashKey({ type, data, variantOverrides: undefined, esContrast: undefined }).slice(0, 8);
        // ⚠ EL DUPLICADO ES DE PANTALLA, NO DE FRASE, y esto costó una
        //   pasada entera. El publicador de rumano compara `sentence`
        //   porque allí cada ítem tiene frase propia; en latín el MARCO SE
        //   REUTILIZA a propósito —«Cura ___ magna est.» sale en 5 puntos
        //   con 10 respuestas distintas— porque aislar la variable exige
        //   que todo lo demás no cambie. Lo que decide la respuesta no es
        //   la frase: es la frase MÁS la pista, que nombra la palabra y la
        //   celda. Comparar sólo la frase marcaba 47 falsos positivos y
        //   habría matado el diseño de los lotes; comparar la pantalla
        //   entera es lo que caza el defecto de verdad, que sería el mismo
        //   enunciado con dos respuestas buenas distintas.
        const frase = (str(data.sentence) ?? str(data.front) ?? str(data.source) ?? '').toLowerCase().replace(/\s+/gu, ' ').trim();
        const pantalla = `${frase} ⟦${(str(data.hintEs) ?? str(data.instructionEs) ?? '').toLowerCase().replace(/\s+/gu, ' ').trim()}⟧`;
        if (!frase) problemas.push(`${String(it.id)}: el ejercicio sale sin frase`);
        if (yaEnCorpus.has(pantalla)) problemas.push(`${id}: el enunciado ya está publicado en ${yaEnCorpus.get(pantalla)}`);
        // ⚠ MISMA PANTALLA CON LA MISMA RESPUESTA NO ES UN DEFECTO: ES EL
        //   MISMO EJERCICIO, y puede servir legítimamente a DOS puntos —el
        //   registro lleva `concepts` en plural—. Pasa dos veces entre
        //   `l2-neutro-a` y `l3-acusativo-od`, que escribieron la misma
        //   frase cada uno por su lado. Se publica UNA vez y se le suman
        //   los dos puntos, en vez de duplicar la pantalla y de inflar la
        //   cobertura de los dos. Lo que SÍ es defecto, y falla, es la
        //   misma pantalla con respuesta DISTINTA: eso no está determinado
        //   y suspendería a quien contestara la otra.
        const previo = usados.get(pantalla);
        if (previo) {
          const mismaResp = JSON.stringify(previo.data) === JSON.stringify(data);
          if (!mismaResp) { problemas.push(`${id} (${punto}): misma pantalla que ${previo.ex.id} (${previo.punto}) y RESPUESTA DISTINTA — no está determinado`); continue; }
          if (!(previo.ex.concepts as string[]).includes(punto)) (previo.ex.concepts as string[]).push(punto);
          const cruza = (previo.ex.blockId as number) !== bloque.id;
          fusionados.push(`${previo.ex.id}: ${previo.punto} + ${punto}${cruza ? `  ⚠ CRUZA DE BLOQUE: el ejercicio vive en b${previo.ex.blockId} y «${punto}» es de b${bloque.id}, así que el alumno que recorra b${bloque.id} no lo verá` : ''}`);
          continue;
        }
        const ex = {
          id, blockId: bloque.id, lessonId: leccion.id, difficulty: 2, concepts: [punto],
          tags: ['la-l1', `forma-${forma}`],
          contentHash: hashKey({ type, data }),
          variantStatus: 'neutral',
          variantVerificacion: `Latín L1 (${HOY}), forma ${forma}. Los ítems los escribieron y los atacaron los lotes de lib/data/languages/la/lotes con sus propios gates; este publicador NO los revisa: sólo los coloca. Responde a «¿está este ítem colocado en la lección que le toca y sin duplicar frase?»; NO certifica que el latín sea correcto ni que la cantidad vocálica esté bien — eso lo firman el gate del lote y el latinista adversarial.`,
          register: 'neutro', type, data,
        };
        // EL ESQUEMA DEL PRODUCTO ES EL ÚLTIMO GATE, y va aquí y no
        // después de escribir: un ejercicio que no valida es un ejercicio
        // que el runner no puede pintar, y descubrirlo en el JSON ya
        // escrito significa haberlo publicado.
        const v2 = ExerciseSchema.safeParse(ex);
        if (!v2.success) { problemas.push(`${id} (${punto}): no valida contra ExerciseSchema — ${v2.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).slice(0, 3).join(' · ')}`); continue; }
        usados.set(pantalla, { ex, data, punto });
        if (!porBloque.has(bloque.id)) porBloque.set(bloque.id, []);
        porBloque.get(bloque.id)!.push(ex);
      }
    }
  }

  const total = [...porBloque.values()].reduce((a, b) => a + b.length, 0);
  console.log(`# Publicar latín — ${total} ítems en ${porBloque.size} bloques\n`);
  for (const [b, xs] of [...porBloque].sort((a, c) => a[0] - c[0])) console.log(`- b${b}: ${xs.length}`);
  if (aplazados.size) {
    const n = [...aplazados.values()].flatMap((m) => [...m.values()]).reduce((a, b) => a + b, 0);
    console.log(`\n**APLAZADOS: ${n} ítems cuya forma no trae la superficie del ejercicio.**`);
    for (const [f, m] of [...aplazados].sort()) for (const [lote, k] of m) console.log(`- ${f} · ${lote} (${k})`);
  }
  if (conMotivo.size) {
    console.log(`\n**APLAZADOS CON MOTIVO COMPROBADO: ${conMotivo.size} lote(s).**`);
    for (const [l, m] of conMotivo) console.log(`- ${l} — ${m}`);
  }
  if (porCelda.length) {
    console.log(`\n**${porCelda.length} ítems APARTADOS POR CELDA** (su respuesta sólo se distingue de otra celda por el mácrón: con alternativa taparía el rasgo, sin ella no se teclea — vuelven cuando la tarjeta llame a \`comparaLa\`):`);
    for (const s2 of porCelda) console.log(`- ${s2}`);
  }
  if (fusionados.length) {
    console.log(`\n**${fusionados.length} ejercicios FUSIONADOS** (misma pantalla y misma respuesta escritas en dos lotes: se publica uno y cuenta para los dos puntos):`);
    for (const s2 of fusionados) console.log(`- ${s2}`);
  }
  if (porDefecto.length) { console.log(`\n**${porDefecto.length} ítems caen en la lección por DEFECTO:**`); for (const s of porDefecto) console.log(`- ${s}`); }
  if (problemas.length) { console.log(`\n**${problemas.length} PROBLEMAS — no se escribe nada:**`); for (const s of problemas.slice(0, 40)) console.log(`- ${s}`); process.exit(1); }
  console.log('\nGates limpios.');
  if (!write) { console.log('DRY-RUN: el corpus no se ha tocado. Repite con --write.'); return; }
  fs.mkdirSync(BLOCKS_DIR, { recursive: true });
  for (const [b, xs] of porBloque) {
    const f = path.join(BLOCKS_DIR, `b${b}.json`);
    const arr = fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, 'utf8')) as unknown[]) : [];
    arr.push(...xs);
    fs.writeFileSync(f, JSON.stringify(arr, null, 2) + '\n');
    console.log(`escrito la/blocks/b${b}.json (+${xs.length})`);
  }
}

void main();
