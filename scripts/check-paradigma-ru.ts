// scripts/check-paradigma-ru.ts — EL GATE DEL PARADIGMA RUSO.
//
//   npx tsx scripts/check-paradigma-ru.ts
//   npx tsx scripts/check-paradigma-ru.ts --control-positivo
//
// ══ LO QUE ESTE GATE **NO** HACE, Y VA PRIMERO ════════════════════════
//
// **No recalcula la regla del generador.** El `motivo` de
// `u3-plural-nominativo` y el de `u4-declinacion-singular` dicen los dos
// «deriva por regla; el gate lo recalcula», y eso es exactamente el fallo
// que el lingüista adversarial encontró el 2026-09-11: un gate que compara
// lo DECLARADO con lo DERIVADO hereda todos los fallos del derivador y los
// convierte en APROBACIONES. Con la regla mal enunciada —ortográfica en
// vez de temática— el gate habría aprobado `*коны`, `*музеы`, `*деревны` y
// `*дверы` sin pestañear.
//
// Los dos caminos de este gate son de OTRA NATURALEZA:
//
//   1. **EL CORPUS** (7,7 M de palabras de prosa atestada). No comparte
//      método ni fuente con el generador.
//   2. **`lib/lang/ortografia-ru.ts`**, escrito en otra pasada para otra
//      pregunta (canonicalizar y denunciar homóglifos). Que además cace
//      `*книгы` es una consecuencia, no su propósito.
//
// ══ Y LO QUE EL CAMINO 1 CONTESTA, QUE ES UNA SOLA PREGUNTA ═══════════
//
// El corpus contesta **«¿existe esta cadena en ruso?»**, igual que
// Hunspell en rumano. NO contesta «¿es la casilla que pido?». `дома` sale
// 3.683 veces y es a la vez genitivo singular, nominativo plural y el
// adverbio «en casa»: un número verdadero que mide otra cosa. Leer el
// verde de este gate como «las casillas son correctas» es usar un sello
// para responder la pregunta de otro.
//
// Por eso el gate tiene una segunda mitad que sí discrimina: **la
// COMPARACIÓN CON EL RIVAL**. Para cada forma sabe qué habría producido la
// regla mal enunciada y cuenta las dos. Ahí el homógrafo deja de mandar,
// porque compara dos cadenas y no una.
//
// ══ Y LA ASIMETRÍA DEL CORPUS, ROTA Y MEDIDA ═════════════════════════
//
// «La PRESENCIA prueba» vale a escala y no vale a una aparición. `книгы`
// —la forma que este generador no debe producir jamás— **sale 1 vez**:
// «как владельцу оной бесценной книгы», la inscripción de un
// semianalfabeto, entre comillas y a propósito. Frente a `книги` 597.
//
// Por eso el criterio NO es presencia y NO es un umbral ajustado a ojo
// —eso es la maldición del ganador—: es el ORDEN. La forma generada tiene
// que salir MÁS que su rival. Estructural, sin número que elegir.
import {
  paradigmaNominal, paradigmaPresente, pasado, imperativo, prepositivoSg,
  invariantesNominales, invariantesVerbales, temaIngenuo, casillaNominal,
  variantesInstrSgFem,
  type EntradaNominal, type EntradaVerbal, type PersonaRu, type CasoRu,
} from '../lib/data/languages/ru/paradigma-ru';
import {
  casillaAdj, invariantesAdjetivales, casillasQueDiscriminanGenero,
  FORMAS_ADJ, CASOS_ADJ, temaAdj,
  type EntradaAdjetival, type FormaAdjetival,
} from '../lib/data/languages/ru/paradigma-adj-ru';
import {
  PERSONALES, pronombre, POSESIVOS, casillaPosesiva, DETERMINANTES,
  invariantesPronominales, variantePronominalXIX,
  type PersonaPron,
} from '../lib/data/languages/ru/pronombres-ru';
import { NOMBRES_A1, VERBOS_A1, ADJETIVOS_A1 } from '../lib/data/languages/ru/lexicon-a1';
import { quitarAcento, revisarOrtografiaRu } from '../lib/lang/ortografia-ru';
import { buscar, controles } from './corpus-ru';

/** Una consulta al corpus por una FORMA.
 *
 *  ⚠ LAS DOS GRAFÍAS DE LA Ё VAN EN LA MISMA CONSULTA, y no es un detalle.
 *  La ё es bimodal POR EDICIÓN: 1.295 lecturas no la escriben nunca y 159
 *  la escriben siempre. Buscar `сестёр` a secas devuelve una fracción del
 *  número real, y esa fracción es plausible. Medido: `ребёнок` 39 y
 *  `ребенок` 576 — la consulta ingenua se deja el 94 %. */
function contar(forma: string): number {
  const f = quitarAcento(forma);
  const alt = f.includes('ё') ? `${f}|${f.replace(/ё/g, 'е')}` : f;
  return buscar(alt).n;
}

/** ⚠ EL PRECIO DE `contar()`, Y EL DETECTOR QUE LO PAGA.
 *
 *  `contar()` funde las dos grafías de la ё en una sola consulta, y hace
 *  bien: la ё es bimodal por edición y buscar `сестёр` a secas se deja el
 *  90 %. **Pero esa misma fusión ciega al gate contra toda una clase de
 *  errores: los que CONSISTEN en la ё.** El lingüista adversarial encontró
 *  dos, vivos y publicados, los dos en verde:
 *
 *    · `день` producía `*днем` — la forma es `днём` (52 con ё · 428 sin)
 *    · `сестра` producía `*сестрам/*сестрами/*сестрах` — el tema oblicuo
 *      del plural es `сёстр-` (4 · 29, la tasa exacta de ediciones con ё)
 *
 *  Y el fichero se contradecía a sí mismo: la `nota` de `день` ya escribía
 *  «дня, дню, днём, дне». Un arreglo que resuelve un problema real puede
 *  apagar el instrumento para otro, y eso no se ve desde dentro del arreglo.
 *
 *  Esta función mide SIN FUNDIR. Si la máquina produce una forma con `е` y
 *  la variante con `ё` está atestada, la máquina está produciendo la
 *  palabra equivocada — porque la regla del proyecto es **producir con ё
 *  siempre**, ya que es la grafía informativa y la que el TTS necesita. */
/** CONTAR **SIN** FUNDIR LAS DOS GRAFÍAS DE LA Ё.
 *
 *  ⚠ ES UNA FUNCIÓN APARTE Y NO UNA BANDERA DE `contar()`, a propósito:
 *  **una bandera se olvida de pasar; una función con otro nombre, no.** Y el
 *  nombre tiene que decir qué la distingue, porque el defecto que esta
 *  pareja documenta es precisamente haber usado la que FUNDE para una
 *  pregunta cuya respuesta ES la distinción que ella borra.
 *
 *  `contar()` funde y hace bien: para contar apariciones en un corpus
 *  bimodal por edición, fundir es lo correcto. Para preguntar «¿la lengua
 *  escribe aquí ё?», no. */
export function contarSensibleALaYo(forma: string): number {
  return buscar(quitarAcento(forma)).n;
}

/** Las variantes con `ё` de una forma que la máquina escribe con `е`, con su
 *  cuenta SIN fundir. Vacío si la forma ya lleva `ё` o no tiene ninguna `е`
 *  que pudiera serlo. */
export function candidatasConYo(forma: string): { forma: string; n: number }[] {
  const f = quitarAcento(forma);
  if (f.includes('ё') || !f.includes('е')) return [];
  const out: { forma: string; n: number }[] = [];
  for (let i = 0; i < f.length; i++) {
    if (f[i] !== 'е') continue;
    const c = f.slice(0, i) + 'ё' + f.slice(i + 1);
    const n = contarSensibleALaYo(c);
    if (n > 0) out.push({ forma: c, n });
  }
  return out;
}

export interface Prueba {
  lema: string; celda: string; forma: string; n: number;
  rival?: string; nRival?: number;
  /** Lectura DECLARADA de un rival con apariciones. Ver `clasificar()`. */
  contaminado?: string;
  /** Con qué otra entrada del lexicón choca el rival, si choca. */
  choca?: string;
}

// ══ CUÁNDO UN PAR ES EVIDENCIA, Y CUÁNDO ES UNA TAREA DE LECTURA ═════
//
// ⚠ ESTA ES LA CORRECCIÓN MÁS IMPORTANTE DEL GATE, y la trajo el
// coordinador. La v0 leía «la forma buena sale más que su rival» como
// evidencia a secas, y eso es falso por una razón que el proyecto ya tiene
// escrita con el signo contrario: **una comparación entre dos CADENAS no
// es una comparación entre dos HIPÓTESIS SOBRE EL MISMO LEMA.**
//
// En rumano el fallo salió como verde por homografía —`nu veni` daba 8 y
// ninguno era imperativo—. Aquí salió como **ROJO** por homografía, que es
// peor, porque empuja a romper una forma que está bien: el gate comparaba
// `в полу` 12 contra `в поле` 428 y los 428 son «en el campo», el
// prepositivo de `поле`, otro lema y además neutro.
//
// La v0 lo cerró con un campo `rivalContaminado` declarado a mano en el
// lexicón, y eso es una DENYLIST DISFRAZADA DE ALLOWLIST: lo que nadie
// declare pasa como evidencia. El criterio tiene que ser estructural, y lo
// es — y además es UNA SOLA CONDICIÓN:
//
//   **Un rival con CERO apariciones es evidencia. Un rival con una o más
//   NO ES UN NÚMERO: ES UNA TAREA DE LECTURA.**
//
// Porque un rival distinto de cero sólo puede ser tres cosas y las tres
// exigen mirar los contextos: (a) una forma que compite de verdad, (b) un
// homógrafo de otro lema —`в поле`—, o (c) una caracterización de
// personaje —`книгы` ×1, la inscripción del semianalfabeto—. Contar no las
// separa; sólo leerlas.
//
// Y la mitad que impide que esto sea un gate apagado: un par en el que el
// rival GANA sigue siendo ROJO mientras nadie declare qué leyó. Es la forma
// del `pisoCero`: cero pares perdidos sin lectura escrita.
export type Veredicto = 'evidencia' | 'leer' | 'nulo-vacio' | 'rojo';

export function clasificar(p: Prueba): Veredicto {
  if (p.rival === undefined || p.nRival === undefined) {
    return p.n === 0 ? 'nulo-vacio' : 'evidencia';
  }
  if (p.n === 0 && p.nRival === 0) return 'nulo-vacio';
  if (p.nRival === 0) return 'evidencia';
  if (p.contaminado) return 'leer';          // lectura declarada
  return p.nRival >= p.n ? 'rojo' : 'leer';  // sin lectura: gana → rojo
}

/** LA FORMA QUE LA REGLA MAL ENUNCIADA HABRÍA PRODUCIDO.
 *
 *  Para el nominativo plural son literalmente las cuatro que el lingüista
 *  nombró: si la forma buena acaba en `-и`, la regla que decide por
 *  ORTOGRAFÍA en vez de por TEMA pone `-ы` en cuanto no hay velar ni
 *  sibilante delante. Ésa es la única diferencia entre las dos reglas, y
 *  por eso ésta es la comparación que las separa. */
function rivalNominativoPlural(forma: string): string | null {
  const f = quitarAcento(forma);
  if (!f.endsWith('и')) return null;
  return f.slice(0, -1) + 'ы';
}

function pruebasNominales(entradas: EntradaNominal[]): Prueba[] {
  const out: Prueba[] = [];
  for (const e of entradas) {
    const t = paradigmaNominal(e);
    for (const [num, celdas] of [['sg', t.sg], ['pl', t.pl]] as const) {
      if (!celdas) continue;
      for (const [caso, forma] of Object.entries(celdas)) {
        const p: Prueba = { lema: e.lema, celda: `${caso}.${num}`, forma, n: contar(forma) };
        if (num === 'pl' && caso === 'nom') {
          const r = rivalNominativoPlural(forma);
          if (r) { p.rival = r; p.nRival = contar(r); p.contaminado = e.lecturaRival?.[`${caso}.${num}`]; }
        }
        out.push(p);
      }
    }
    // El segundo locativo se prueba CON su preposición, porque sin ella la
    // cadena es ambigua: `лесу` a secas es también el dativo. Con `в`
    // delante mide la casilla, y el rival es la forma regular, que es lo
    // que el generador produciría sin el dato.
    if (e.locativo2) {
      // ⚠ CON SU PROPIA PREPOSICIÓN Y NO CON `в` PARA TODOS. La v0 probaba
      // `в` siempre y daba dos falsos rojos (`в берегу` 0 contra
      // `на берегу` 203) y un falso verde: `в поле` 428 no es ninguna forma
      // de `пол`, es el prepositivo de `поле` «campo».
      const { regente } = e.locativo2;
      const loc = prepositivoSg(e, regente)!;
      const reg = casillaNominal(e, 'prep', 'sg')!;
      const pr: Prueba = {
        lema: e.lema, celda: `locativo2 (${regente} ___)`,
        forma: `${regente} ${loc}`, n: contar(`${regente} ${quitarAcento(loc)}`),
      };
      // La comparación se hace SIEMPRE — ocultarla era la v0 — y la lectura
      // declarada viaja con ella para que el lector vea los dos números Y
      // lo que significan.
      pr.rival = `${regente} ${reg}`;
      pr.nRival = contar(`${regente} ${reg}`);
      pr.contaminado = e.lecturaRival?.locativo2;
      out.push(pr);
    }
  }
  return out;
}

// ══ EL ADJETIVO, Y SUS DOS RIVALES ═══════════════════════════════════
//
// Las dos reglas que el adjetivo puede tener mal escritas son las dos que
// `ortografiar` resuelve, así que los rivales son las dos formas que
// saldrían de enunciarlas a medias:
//
//   1. **la regla de la ы sin aplicar**: `*русскый`, `*хорошый`, `*большый`
//      — la desinencia dura escrita tal cual tras velar o sibilante;
//   2. **la /o/ átona sin aplicar**: `*хорошого`, `*хорошом`, `*хорошой` —
//      la sibilante tratada como una consonante dura cualquiera. Y su
//      simétrica, que es la que de verdad puede colarse: `*большего`,
//      `*большем`, tratando la sibilante TÓNICA como átona.
//
// El segundo par es el que importa, porque `хороший` y `большой` tienen el
// MISMO tema y se separan sólo por el acento: una regla que ignore el bit
// acierta la mitad del lexicón.
function rivalAdjetival(e: EntradaAdjetival, forma: FormaAdjetival, caso: CasoRu, buena: string): string | null {
  const t = temaAdj(e);
  const sib = /[жшщч]$/.test(t), velar = /[кгх]$/.test(t);
  if (!sib && !velar) return null;
  const resto = buena.slice(t.length);
  // (1) la и que la regla velar/sibilante escribió: el rival la deja en ы.
  if (/^и/.test(resto)) return t + 'ы' + resto.slice(1);
  // (2) la /o/: el rival pone la del otro lado del acento.
  if (sib && /^е/.test(resto)) return t + 'о' + resto.slice(1);
  if (sib && /^о/.test(resto)) return t + 'е' + resto.slice(1);
  return null;
}

function pruebasAdjetivales(entradas: EntradaAdjetival[]): Prueba[] {
  const out: Prueba[] = [];
  for (const e of entradas) {
    for (const f of FORMAS_ADJ) {
      for (const c of CASOS_ADJ) {
        // El acusativo se pide con animacidad resuelta y NO se prueba
        // aparte: es homógrafo del nominativo o del genitivo, así que
        // contarlo sería contar dos veces la misma cadena y decir que hay
        // más evidencia de la que hay.
        if (c === 'ac') continue;
        const forma = casillaAdj(e, f, c);
        if (!forma) continue;
        const p: Prueba = { lema: e.lema, celda: `${f}.${c}`, forma, n: contar(forma) };
        const r = rivalAdjetival(e, f, c, forma);
        // ⚠ LA CLAVE `*`: CUANDO EL RIVAL ES OTRO LEMA, LA LECTURA ES DEL
        // PAR DE LEMAS Y NO DE LA CASILLA. `большой` tiene DOCE casillas
        // cuyo rival es el comparativo declinado `бо́льший`, que es otra
        // palabra: escribir la misma lectura doce veces es la regla copiada
        // que se desincroniza en la copia N+1. La clave exacta gana sobre
        // `*`, porque una lectura de casilla sí puede ser específica
        // (`в лесе` lo es y `бо́льший` no).
        if (r) {
          p.rival = r; p.nRival = contar(r);
          p.contaminado = e.lecturaRival?.[`${f}.${c}`] ?? e.lecturaRival?.['*'];
        }
        out.push(p);
      }
    }
  }
  return out;
}

// ══ LOS PRONOMBRES, Y LA н- PROTÉTICA SE MIDE CON SU PREPOSICIÓN ═════
//
// Una forma pronominal suelta no se puede contar: `его` 54.437 es a la vez
// el acusativo, el genitivo y el POSESIVO invariable, y `то` 63.834 es la
// conjunción de «если… то». La única cadena que mide la casilla es la que
// lleva la preposición delante, igual que el segundo locativo del sustantivo
// —y por la misma razón: la casilla no existe sin ella—.
//
// Las lecturas de los rivales están DECLARADAS aquí y no en un comentario, y
// las tres se leyeron con `--ctx`: `у его` 94, `для его` 71 y `у их` 10 son
// casi todas el POSESIVO seguido de su sustantivo («у его невесток», «для его
// пользы», «у их отца»), o sea otra construcción con la misma cadena. En
// `у их` una o dos son de verdad el pronombre sin prótesis y en boca de
// campesino, que es registro y no norma.
const PROTETICA: { patron: string; rival: string; lectura: string }[] = [
  { patron: 'у него', rival: 'у его',
    lectura: 'las 94 de «у его» son el POSESIVO invariable его + sustantivo — «у его невесток», «у его дяди», «у его сиятельства», «у его коня». No es la forma sin prótesis: es otra construcción con la misma cadena, el homógrafo en su forma más limpia' },
  // ⚠ Y ESTOS DOS RIVALES **NO** SON HOMÓGRAFOS, y es la lectura que más
  // cambia el diseño de un lote. Las 2+2 apariciones son la forma SIN
  // prótesis de verdad, y todas en habla popular o folclórica: «так и жмется
  // к ему» (Chéjov), «высылать к ему моих людей» (Troekúrov gritando,
  // Pushkin), «я с им побратаются» (fórmula de bylina), «живет она с им»
  // (campesino). O sea que la pregunta del §0.3 rumano —¿mala, vieja o de
  // otro dialecto?— se contesta **de otro REGISTRO**, no agramatical.
  //
  // Consecuencia: un ítem puede enseñar la norma, que es citable, pero NO
  // puede presentar `к ему` como agramatical. Y con `у его` pasa lo
  // contrario: ahí las 94 son posesivo y no hay forma sin prótesis ninguna.
  // Dos rivales de la misma regla y dos veredictos distintos — contar no los
  // separaba.
  { patron: 'к нему', rival: 'к ему',
    lectura: 'las 2 de «к ему» SÍ son la forma sin prótesis, y las dos en habla popular: «так и жмется к ему» (Chéjov, campesino) y «высылать к ему моих людей с повинной» (Troekúrov gritando, Pushkin). No es homógrafo y no es agramatical: es REGISTRO, a 2 frente a 3855. La norma es citable y el ítem puede enseñarla; marcar `к ему` como error sería corregir lengua real' },
  { patron: 'с ним', rival: 'с им',
    lectura: 'las 2 de «с им» son la forma sin prótesis en habla folclórica y campesina: «я с им побратаются» (fórmula de bylina) y «живет она, значит… с им!». Mismo veredicto que «к ему»: registro, no agramaticalidad' },
  { patron: 'о нём', rival: 'о ём', lectura: '' },
  { patron: 'у неё', rival: 'у её',
    lectura: 'mismo caso que «у его» — es el posesivo её + sustantivo' },
  { patron: 'у них', rival: 'у их',
    lectura: 'de las 10, la mayoría son el posesivo их + sustantivo («у их отца», «у их ног») y una o dos SÍ son el pronombre sin prótesis en habla de campesino («У их экого стулья-то по баням много»). O sea lengua real de registro, no norma, y a 10 frente a 1507' },
  { patron: 'для него', rival: 'для его',
    lectura: 'las 71 son el posesivo — «для его пользы», «для его удовольствия», «для его дирижерского сердца»' },
];

function pruebasPronominales(): Prueba[] {
  const out: Prueba[] = [];
  // 1 · la н- protética, con la preposición y con el rival leído.
  for (const x of PROTETICA) {
    const p: Prueba = { lema: 'н- protética', celda: x.patron, forma: x.patron, n: contar(x.patron) };
    p.rival = x.rival; p.nRival = contar(x.rival);
    if (x.lectura) p.contaminado = x.lectura;
    out.push(p);
  }
  // 2 · las casillas sueltas que NO son homógrafas de nada: el instrumental
  // y los plurales oblicuos. Las que sí lo son (его, им, их, то, что) se
  // dejan fuera a propósito: contarlas daría un número verdadero de otra
  // cosa, y ése es el fallo que este gate existe para no cometer.
  for (const per of Object.keys(PERSONALES) as PersonaPron[]) {
    for (const c of ['instr', 'prep'] as CasoRu[]) {
      const f = pronombre(per, c, { regente: c === 'prep' ? 'о' : null });
      if (!f || f.length < 3) continue;
      out.push({ lema: `pron.${per}`, celda: c, forma: f, n: contar(f) });
    }
  }
  // 3 · los posesivos declinados.
  for (const e of POSESIVOS) {
    for (const f of ['m', 'f', 'n', 'pl'] as const) {
      for (const c of ['gen', 'dat', 'instr', 'prep'] as CasoRu[]) {
        const x = casillaPosesiva(e, f, c);
        if (!x) continue;
        out.push({ lema: e.lema, celda: `${f}.${c}`, forma: x, n: contar(x) });
      }
    }
  }
  // 4 · los determinantes, sin las cadenas que son homógrafos masivos.
  const HOMOGRAFOS_MASIVOS = ['это', 'то', 'что', 'чем', 'та', 'ту', 'те'];
  for (const [lema, d] of Object.entries(DETERMINANTES)) {
    for (const [celda, forma] of Object.entries(d.tabla)) {
      if (HOMOGRAFOS_MASIVOS.includes(forma)) continue;
      out.push({ lema, celda, forma, n: contar(forma) });
    }
  }
  return out;
}

function pruebasVerbales(verbos: EntradaVerbal[]): Prueba[] {
  const out: Prueba[] = [];
  for (const v of verbos) {
    const pres = paradigmaPresente(v);
    for (const p of Object.keys(pres) as PersonaRu[]) {
      const f = pres[p];
      if (!f) continue;
      const pr: Prueba = { lema: v.lema, celda: `pres.${p}`, forma: f, n: contar(f) };
      // ⚠ EL RIVAL DE LA 1.ª SG ES EL §4.2 RUMANO EJECUTADO. Allí
      // `temaInfinitivo()` tenía un fallback que devolvía el verbo entero y
      // NO EXPLOTABA porque ninguna rama llegaba a él. Aquí el fallback no
      // existe en la máquina: existe aquí, con nombre, y sólo para medirse.
      // Con `писать` da `писаю`, que es la forma falsa de control.
      if (p === '1sg') {
        const ing = temaIngenuo(v.lema);
        if (ing && ing !== (v.tema1sg ?? v.temaPresente)) {
          const rival = ing + (v.reflexivo ? 'юсь' : 'ю');
          pr.rival = rival; pr.nRival = contar(rival);
        }
      }
      out.push(pr);
    }
    for (const g of ['m', 'f', 'pl'] as const) {
      const f = pasado(v, g);
      if (f) out.push({ lema: v.lema, celda: `pas.${g}`, forma: f, n: contar(f) });
    }
    const imp = imperativo(v);
    if (imp) out.push({ lema: v.lema, celda: 'imperativo', forma: imp, n: contar(imp) });
  }
  return out;
}

// ══ EL CONTROL POSITIVO ══════════════════════════════════════════════
//
// Un gate visto sólo en verde no está probado. Éstas son las cuatro formas
// falsas que el relevo dejó escritas como control de arranque, más las de
// la regla del tema. **El gate tiene que rechazarlas todas**, y la salida
// va pegada en rojo en el commit.
export const FALSAS: { forma: string; buena: string; porQue: string }[] = [
  { forma: 'книгы', buena: 'книги', porQue: 'regla velar: к г х nunca con ы' },
  { forma: 'жыть', buena: 'жить', porQue: 'regla sibilante: ж ш щ ч nunca con ы' },
  { forma: 'писаю', buena: 'пишу', porQue: 'la regla ingenua sin la alternancia с→ш' },
  { forma: 'в лесе', buena: 'в лесу', porQue: 'el prepositivo regular donde va el segundo locativo' },
  { forma: 'коны', buena: 'кони', porQue: 'la regla ORTOGRÁFICA donde la buena es la de TEMA' },
  { forma: 'музеы', buena: 'музеи', porQue: 'ídem, tema blando en -й' },
  { forma: 'деревны', buena: 'деревни', porQue: 'ídem, tema blando en -я' },
  { forma: 'дверы', buena: 'двери', porQue: 'ídem, 3.ª declinación' },
  { forma: 'карот', buena: 'карт', porQue: 'vocal de apoyo donde NO va' },
  // ── LAS CUATRO DE LA REGLA DE LA /o/ DE LA DESINENCIA (2026-09-12) ──
  // Van las CUATRO y no una, porque la regla tiene dos ejes —el tema y el
  // acento— y una sola forma falsa deja sin probar tres cuartas partes.
  // `товарищом` prueba la mitad átona y `врачем` la tónica: con una sola,
  // una regla que dijera «sibilante ⇒ siempre -ом» o «⇒ siempre -ем»
  // pasaría el control.
  { forma: 'товарищом', buena: 'товарищем', porQue: 'sibilante con la /o/ ÁTONA: va -ем' },
  { forma: 'врачем', buena: 'врачом', porQue: 'sibilante con la /o/ TÓNICA: va -ом' },
  { forma: 'сердцом', buena: 'сердцем', porQue: 'ц con la /o/ ÁTONA: va -ем, y ц NO entra en la regla de la ы' },
  { forma: 'тучой', buena: 'тучей', porQue: 'la misma regla en la 1.ª declinación, que usa OTRA desinencia (-ой/-ей)' },
  // ── EL ADJETIVO (2026-09-12) ───────────────────────────────────────
  { forma: 'русскый', buena: 'русский', porQue: 'la regla velar en el adjetivo: -ый se escribe -ий' },
  { forma: 'хорошый', buena: 'хороший', porQue: 'ídem tras sibilante' },
  { forma: 'хорошого', buena: 'хорошего', porQue: 'la /o/ ÁTONA tras sibilante en el adjetivo' },
  { forma: 'хорошом', buena: 'хорошем', porQue: 'ídem, prepositivo' },
  { forma: 'хорошой', buena: 'хорошей', porQue: 'ídem, femenino oblicuo' },
  { forma: 'синого', buena: 'синего', porQue: 'la fila BLANDA tratada como dura' },
  { forma: 'синым', buena: 'синим', porQue: 'ídem, instrumental' },
  { forma: 'молодый', buena: 'молодой', porQue: 'la desinencia TÓNICA del nominativo masculino' },
  // ── LOS PRONOMBRES (2026-09-12) ────────────────────────────────────
  { forma: 'к ему', buena: 'к нему', porQue: 'la н- protética tras preposición: к ему 2 · к нему 3855' },
  { forma: 'с им', buena: 'с ним', porQue: 'ídem instrumental' },
  { forma: 'этым', buena: 'этим', porQue: 'la declinación pronominal NO pasa por la regla velar: no hay velar' },
  { forma: 'нашых', buena: 'наших', porQue: 'la sibilante del posesivo: -их y no -ых' },
];

/** ⚠ LA FORMA FALSA QUE NINGUNO DE LOS DOS CAMINOS DE `veredicto()` PUEDE
 *  RECHAZAR, y va escrita en vez de omitida.
 *
 *  Si alguien pone `desinenciaOTonica: false` en `конь`, la máquina produce
 *  `конем`. La ortografía no la rechaza —es una cadena perfectamente
 *  escribible— y el corpus **tampoco**, porque `contar()` funde las dos
 *  grafías de la ё a propósito: `конем` y `конём` devuelven los dos 47.
 *
 *  Lo que la caza es el OTRO instrumento, `candidatasConYo()`, que cuenta
 *  SIN fundir: конём 17 frente a конем 30 — o sea que ni el orden ayuda, y
 *  sólo sirve saber que la variante con ё existe. Y si en vez de ponerlo mal
 *  se OLVIDA, la máquina devuelve `null` y el invariante lo grita. Dos
 *  guardianes distintos para los dos descuidos, y ninguno de los dos es el
 *  de este control. Fijado en test. */
export const FUERA_DEL_ALCANCE_DEL_CONTROL = [
  { forma: 'конем', buena: 'конём', quienLaCaza: 'candidatasConYo (el corpus funde la ё y no puede)' },
  // Y la misma clase en el posesivo: `моём` es la buena y `моем` la mala, y
  // `contar()` devuelve el mismo número para las dos. Estuve a punto de
  // meterla en `FALSAS` con los campos AL REVÉS —«forma: моём, buena:
  // моем»—, que habría sido un control positivo que exige rechazar la forma
  // correcta: el gate cómplice con el signo cambiado. Va aquí, que es donde
  // están las que este control no puede juzgar.
  { forma: 'моем', buena: 'моём', quienLaCaza: 'candidatasConYo; y el invariante del nominativo no llega hasta el prepositivo' },
];

/** El veredicto de UNA forma, con los dos caminos por separado para que se
 *  vea cuál la caza. Que una forma la cace la ortografía y otra el corpus
 *  no es lo mismo, y confundirlo es leer un sello como si fuera dos. */
export function veredicto(mala: string, buena: string): { rechaza: boolean; via: string; detalle: string } {
  const orto = revisar(mala);
  if (orto) return { rechaza: true, via: 'ortografia', detalle: orto };
  const nm = contar(mala), nb = contar(buena);
  if (nm < nb) return { rechaza: true, via: 'corpus', detalle: `«${mala}» ${nm} < «${buena}» ${nb}` };
  return { rechaza: false, via: '—', detalle: `«${mala}» ${nm} ≥ «${buena}» ${nb}` };
}

function revisar(s: string): string | null {
  const h = revisarOrtografiaRu(s);
  return h.length ? `${h[0]!.clase} en «${h[0]!.palabra}»` : null;
}

// ══ CLI ══════════════════════════════════════════════════════════════
if (/[/\\]check-paradigma-ru\.ts$/.test(process.argv[1] ?? '')) {
  const soloControl = process.argv.includes('--control-positivo');

  const c = controles();
  if (!c.ok) {
    console.error(`CONTROLES DEL CORPUS EN ROJO: positivo ${c.positivo}, negativo ${c.negativo}. No se informa de ningún número.`);
    process.exit(1);
  }
  console.log(`corpus OK — canario positivo ${c.positivo} · negativo ${c.negativo}\n`);

  // ── 1 · EL CONTROL POSITIVO, SIEMPRE Y EL PRIMERO ─────────────────
  console.log('── CONTROL POSITIVO: las formas que la máquina NO debe producir ──');
  let fallosControl = 0;
  for (const f of FALSAS) {
    const v = veredicto(f.forma, f.buena);
    if (!v.rechaza) fallosControl++;
    console.log(`${v.rechaza ? '✓' : '✗'} *${f.forma}  [${v.via}] ${v.detalle}   — ${f.porQue}`);
  }
  // ── EL CONTROL NEGATIVO, que es la mitad que casi siempre falta ───
  // Un gate que rechaza TODO también rechaza las trece, y su verde es
  // idéntico al de uno que sirve. Las buenas tienen que pasar limpias.
  let fallosNegativo = 0;
  for (const f of FALSAS) {
    const h = revisar(f.buena);
    if (h) { fallosNegativo++; console.log(`✗ CONTROL NEGATIVO: la forma BUENA «${f.buena}» la rechaza la ortografía (${h})`); }
  }
  console.log(fallosControl === 0 && fallosNegativo === 0
    ? `\n${FALSAS.length}/${FALSAS.length} rechazadas · ${FALSAS.length}/${FALSAS.length} buenas limpias.\n`
    : `\n⚠ ${fallosControl} de ${FALSAS.length} NO se rechazan y ${fallosNegativo} buenas se rechazan: el gate no está probado.\n`);
  if (soloControl) process.exit(fallosControl === 0 && fallosNegativo === 0 ? 0 : 1);

  // ── 2 · LOS INVARIANTES PROPIOS ───────────────────────────────────
  const avisos = [...invariantesNominales(NOMBRES_A1), ...invariantesVerbales(VERBOS_A1),
    ...invariantesAdjetivales(ADJETIVOS_A1), ...invariantesPronominales()];
  console.log(`── INVARIANTES: ${avisos.length} avisos ──`);
  for (const a of avisos) console.log(`  ${a.clase}\t${a.lema}\t${a.detalle}`);
  console.log();

  // ── 3 · EL CORPUS, FORMA A FORMA ──────────────────────────────────
  const pruebas = [...pruebasNominales(NOMBRES_A1), ...pruebasVerbales(VERBOS_A1),
    ...pruebasAdjetivales(ADJETIVOS_A1), ...pruebasPronominales()];
  // EL SEGUNDO CHEQUEO, y es de otra naturaleza que el conteo: ¿el rival es
  // además una casilla de OTRA entrada del lexicón? Donde se puede
  // comprobar, se comprueba, en vez de esperar a que alguien lo declare.
  // No cubre los lemas que no están (`поле` no está), y por eso no
  // sustituye al criterio del cero: lo acompaña.
  const formasDeOtros = new Map<string, string>();
  for (const e of NOMBRES_A1)
    for (const num of ['sg', 'pl'] as const)
      for (const c of ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as const) {
        const f = casillaNominal(e, c, num);
        if (f && !formasDeOtros.has(f)) formasDeOtros.set(f, `${e.lema} ${c}.${num}`);
      }
  for (const p of pruebas) {
    if (!p.rival) continue;
    const duenyo = formasDeOtros.get(p.rival);
    if (duenyo && !duenyo.startsWith(p.lema + ' ')) p.choca = duenyo;
  }

  const por = (v: Veredicto) => pruebas.filter((x) => clasificar(x) === v);
  const sinAtestar = pruebas.filter((p) => p.n === 0);
  const perdidas = por('rojo');
  const aLeer = por('leer');

  console.log(`── CORPUS: ${pruebas.length} formas generadas ──`);
  console.log(`   atestadas: ${pruebas.length - sinAtestar.length} · sin una sola aparición: ${sinAtestar.length}`);
  // ── LA Ё QUE LA FUSIÓN DE `contar()` NO DEJA VER ──────────────────
  // Mismo criterio que el del rival: una señal con lectura declarada es un
  // hecho sabido; una sin lectura es lo único que tumba el lexicón.
  const lecturas = new Map<string, Record<string, string> | undefined>();
  for (const e of NOMBRES_A1) lecturas.set(e.lema, e.lecturaYo);
  for (const v of VERBOS_A1) lecturas.set(v.lema, v.lecturaYo);
  const conYo: string[] = [];
  const yoLeidas: string[] = [];
  for (const p of pruebas) {
    for (const c of candidatasConYo(p.forma)) {
      const leida = lecturas.get(p.lema)?.[p.celda];
      const linea = `${p.lema}\t${p.celda}\tla máquina da «${p.forma}» y «${c.forma}» está atestada ${c.n} veces`;
      if (leida) yoLeidas.push(`${linea}\n      LEÍDO: ${leida}`);
      else conYo.push(linea);
    }
  }

  console.log(`   pares comparados: ${pruebas.filter((p) => p.rival).length}`);
  console.log(`   · el rival da CERO (evidencia limpia): ${pruebas.filter((p) => p.rival && p.nRival === 0 && p.n > 0).length}`);
  console.log(`   · el rival tiene apariciones (hay que LEERLO): ${aLeer.length}`);
  console.log(`   · el rival GANA y nadie ha leído nada (rojo): ${perdidas.length}\n`);

  if (aLeer.length) {
    console.log('EL RIVAL NO DA CERO — un número aquí no es evidencia, es una tarea de lectura.');
    console.log('Un rival distinto de cero es (a) forma que compite, (b) homógrafo de otro lema o');
    console.log('(c) caracterización de personaje, y contar no las separa. `corpus-ru.ts --ctx «…»`.');
    for (const p of aLeer) {
      console.log(`  ${p.lema}\t${p.celda}\t${p.forma} ${p.n} · *${p.rival} ${p.nRival}`);
      if (p.choca) console.log(`      ⚠ el rival es además una casilla del lexicón: ${p.choca}`);
      if (p.contaminado) console.log(`      LEÍDO: ${p.contaminado}`);
      else console.log('      SIN LEER — declara la lectura en el lexicón o el par no certifica nada');
    }
    console.log();
  }

  if (perdidas.length) {
    console.log('⚠ EL RIVAL GANA Y NO HAY LECTURA ESCRITA (esto tumba el lexicón):');
    for (const p of perdidas) console.log(`  ${p.lema}\t${p.celda}\t${p.forma} ${p.n} ≤ *${p.rival} ${p.nRival}`);
    console.log();
  }
  if (sinAtestar.length) {
    console.log('SIN ATESTACIÓN — no es un error, es una casilla que el corpus NO PUEDE certificar.');
    console.log('Se imprime en vez de disimularse: un cero aquí significa «no lo sé», no «está mal».');
    for (const p of sinAtestar) console.log(`  ${p.lema}\t${p.celda}\t${p.forma}`);
    console.log();
  }

  if (yoLeidas.length) {
    console.log('CANDIDATAS CON Ё QUE YA SE LEYERON — no son errores, y por qué:');
    for (const x of yoLeidas) console.log(`  ${x}`);
    console.log();
  }
  if (conYo.length) {
    console.log('⚠ LA MÁQUINA PRODUCE «е» DONDE LA LENGUA ESCRIBE «ё» (esto tumba el lexicón):');
    console.log('   `contar()` funde las dos grafías a propósito —la ё es bimodal por edición— y');
    console.log('   por eso esta clase de error sale VERDE en todas las demás comprobaciones.');
    console.log('   La regla del proyecto es producir con ё SIEMPRE: es la grafía informativa y');
    console.log('   la que el TTS necesita para no decir otra palabra.');
    for (const x of conYo) console.log(`  ${x}`);
    console.log();
  }

  // ⚠ LA LISTA DE CLASES QUE TIÑEN DE ROJO ES UN SITIO DONDE UN GATE NUEVO
  // NACE APAGADO. El 2026-09-12 el invariante `o-desinencial-sin-declarar`
  // cazó tres omisiones reales del lexicón (дядя, деревня, неделя) y el
  // script **salió con código 0**, porque su clase no estaba en esta
  // condición. Un hallazgo que no cambia el veredicto es un informe, no un
  // gate: añadir el invariante y no añadirlo aquí son dos cambios.
  const CLASES_ROJAS = ['casilla-vacia', 'casilla-nula', 'o-desinencial-sin-declarar', 'locativo2-inutil'];
  // ── LA VARIANTE DEL XIX QUE LA MÁQUINA NO PRODUCE ─────────────────
  //
  // ⚠ NO ES UN ROJO, Y POR ESO HAY QUE MEDIRLO: es la clase «la biblioteca
  // desenseña el punto». La máquina produce la forma de la NORMA (`-ой`) y
  // hace bien —es la citable—, pero el alumno lee el corpus, no la norma, y
  // si un cloze exige sólo `-ой` suspende a quien escribe ruso atestado. El
  // gate imprime la proporción lema a lema porque **no es una propiedad de
  // la desinencia sino de cada palabra**: землею gana a землёй 5,7 a 1 y
  // страною empata con страной.
  // ⚠ EL DENOMINADOR SE CUENTA, NO SE SUPONE. La v0 imprimía un porcentaje
  // para cada lema, y el lingüista adversarial encontró dos cuyo
  // denominador mide DOS casillas (`дядей` es instrumental singular Y
  // genitivo plural; `ей` es dativo E instrumental). Al mirarlo con el
  // instrumento en vez de a mano, el problema es mucho mayor y es
  // estructural: **en el adjetivo la forma `новой` ocupa CUATRO casillas y
  // `большой` SEIS**, y sólo una de ellas tiene variante en `-ою`. Un
  // porcentaje sobre ese denominador es un número verdadero que mide otra
  // cosa. Así que se CUENTA cuántas casillas del propio paradigma comparten
  // la forma, y donde son más de una no se imprime porcentaje: se dice.
  const variantes: { lema: string; norma: string; nNorma: number; variante: string; nVar: number; casillas: number }[] = [];
  for (const e of NOMBRES_A1) {
    if (e.genero !== 'f' && !(e.genero === 'm' && /[ая]$/.test(e.lema))) continue;
    const instr = casillaNominal(e, 'instr', 'sg');
    if (!instr) continue;
    let casillas = 0;
    for (const num of ['sg', 'pl'] as const)
      for (const c of ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as CasoRu[])
        if (casillaNominal(e, c, num) === instr) casillas++;
    for (const v of variantesInstrSgFem(instr)) {
      const nVar = contar(v);
      if (nVar > 0) variantes.push({ lema: e.lema, norma: instr, nNorma: contar(instr), variante: v, nVar, casillas });
    }
  }
  // ⚠ EL ADJETIVO Y EL POSESIVO FALTABAN, Y ES DONDE LA VARIANTE ES MAYOR.
  // Lo encontró el lingüista adversarial el 2026-09-12: el barrido miraba
  // `NOMBRES_A1` y `PERSONALES` y no las dos máquinas nuevas. Medido,
  // `своею` sale **1088** veces — diez veces el máximo de la tabla que el
  // gate sí imprimía (`душою` 111). O sea que el lado donde el error
  // simétrico es más caro era justo el que no se medía. Mismo defecto que el
  // barrido de la ё, el mismo día y por la misma causa.
  for (const e of ADJETIVOS_A1) {
    const instr = casillaAdj(e, 'f', 'instr');
    if (!instr) continue;
    const casillas = FORMAS_ADJ.flatMap((f) => CASOS_ADJ.map((c) => casillaAdj(e, f, c, { animado: false })))
      .filter((x) => x === instr).length;
    for (const v of variantesInstrSgFem(instr)) {
      const nVar = contar(v);
      if (nVar > 0) variantes.push({ lema: `adj.${e.lema}`, norma: instr, nNorma: contar(instr), variante: v, nVar, casillas });
    }
  }
  for (const e of POSESIVOS) {
    const instr = casillaPosesiva(e, 'f', 'instr');
    if (!instr) continue;
    const casillas = FORMAS_ADJ.flatMap((f) => CASOS_ADJ.map((c) => casillaPosesiva(e, f, c, { animado: false })))
      .filter((x) => x === instr).length;
    for (const v of variantesInstrSgFem(instr)) {
      const nVar = contar(v);
      if (nVar > 0) variantes.push({ lema: `pos.${e.lema}`, norma: instr, nNorma: contar(instr), variante: v, nVar, casillas });
    }
  }
  for (const per of Object.keys(PERSONALES) as PersonaPron[]) {
    const instr = pronombre(per, 'instr', { regente: null });
    if (!instr) continue;
    const casillas = (['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as CasoRu[])
      .map((c) => pronombre(per, c, { regente: null })).filter((x) => x === instr).length;
    for (const v of variantePronominalXIX(instr, 'instr')) {
      const nVar = contar(v);
      if (nVar > 0) variantes.push({ lema: `pron.${per}`, norma: instr, nNorma: contar(instr), variante: v, nVar, casillas });
    }
  }
  if (variantes.length) {
    console.log('LA VARIANTE `-ою/-ею` DEL XIX — NO es un error y NO es un rojo: es una respuesta');
    console.log('⚠ Y DOS DENOMINADORES DE ESTA TABLA MIDEN DOS CASILLAS A LA VEZ, así que su');
    console.log('   porcentaje está SESGADO A LA BAJA y va dicho en vez de disimulado: `дядей` 83');
    console.log('   es a la vez el instrumental singular («с дядей Ваней») y el genitivo plural');
    console.log('   («двое дядей его»), y `ей` 11135 es dativo E instrumental. El genitivo plural');
    console.log('   y el dativo no tienen variante en -ою, así que engordan el denominador sin');
    console.log('   poder aportar al numerador. Un número correcto sobre una forma ambigua es un');
    console.log('   número verdadero que mide otra cosa — y el agregado lo arrastra.');
    console.log('CORRECTA que la máquina no produce. Un ítem que exija sólo `-ой` suspende a quien');
    console.log('escribe el ruso que la biblioteca le ha enseñado (error simétrico).');
    let sn = 0, sv = 0, limpios = 0;
    for (const v of variantes.sort((a, b) => b.nVar - a.nVar)) {
      sv += v.nVar;
      const ambiguo = v.casillas > 1;
      if (!ambiguo) { sn += v.nNorma; limpios++; }
      const cola = ambiguo
        ? `(SIN PORCENTAJE: ${v.casillas} casillas del paradigma comparten «${v.norma}» y sólo una tiene variante)`
        : `(${Math.round((100 * v.nVar) / (v.nNorma + v.nVar))} % del total es la variante)`;
      console.log(`  ${v.lema}\t${v.norma} ${v.nNorma} · ${v.variante} ${v.nVar}\t${cola}`);
    }
    console.log(`  ── ${variantes.length} lemas con la variante atestada · ${sv} apariciones de la variante`);
    console.log(`     y el porcentaje sólo se puede dar sobre los ${limpios} de denominador LIMPIO:`);
    console.log(`     norma ${sn} · variante ${variantes.filter((v) => v.casillas === 1).reduce((a, v) => a + v.nVar, 0)} · ${Math.round((100 * variantes.filter((v) => v.casillas === 1).reduce((a, v) => a + v.nVar, 0)) / (sn + variantes.filter((v) => v.casillas === 1).reduce((a, v) => a + v.nVar, 0)))} %\n`);
  }

  // ── LA ATRIBUCIÓN DEL ADJETIVO: qué casilla puede medir el género ──
  //
  // No es un rojo: es el dato que un lote necesita ANTES de escribir un
  // ítem de concordancia. Y se imprime calculado, no leído de una lista,
  // porque las dos prosas que lo enunciaban —la del inventario y la del
  // fichero de la máquina— nombraban cada una la mitad.
  console.log('── ATRIBUCIÓN ADJETIVAL: en qué casillas la concordancia MIDE el género ──');
  for (const a of ADJETIVOS_A1) {
    const d = casillasQueDiscriminanGenero(a);
    console.log(`  ${a.lema}\tdiscriminan los tres géneros: ${d.join(', ')}   (de 6 casos del singular)`);
  }
  console.log('  el PLURAL no discrimina en ninguno de los 6: un ítem de concordancia en plural');
  console.log('  no mide género JAMÁS. Y gen/dat/instr/prep son m=n en los 6 lemas.\n');

  const rojo = fallosControl > 0 || fallosNegativo > 0 || perdidas.length > 0 || conYo.length > 0
    || avisos.some((a) => a.clase.startsWith('ortografia') || CLASES_ROJAS.includes(a.clase));
  console.log(rojo ? 'ROJO' : 'VERDE');
  process.exit(rojo ? 1 : 0);
}
