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
  type EntradaNominal, type EntradaVerbal, type PersonaRu,
} from '../lib/data/languages/ru/paradigma-ru';
import { NOMBRES_A1, VERBOS_A1 } from '../lib/data/languages/ru/lexicon-a1';
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
  console.log(fallosControl === 0
    ? `\n${FALSAS.length}/${FALSAS.length} rechazadas.\n`
    : `\n⚠ ${fallosControl} de ${FALSAS.length} NO se rechazan: el gate no está probado.\n`);
  if (soloControl) process.exit(fallosControl === 0 ? 0 : 1);

  // ── 2 · LOS INVARIANTES PROPIOS ───────────────────────────────────
  const avisos = [...invariantesNominales(NOMBRES_A1), ...invariantesVerbales(VERBOS_A1)];
  console.log(`── INVARIANTES: ${avisos.length} avisos ──`);
  for (const a of avisos) console.log(`  ${a.clase}\t${a.lema}\t${a.detalle}`);
  console.log();

  // ── 3 · EL CORPUS, FORMA A FORMA ──────────────────────────────────
  const pruebas = [...pruebasNominales(NOMBRES_A1), ...pruebasVerbales(VERBOS_A1)];
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

  const rojo = fallosControl > 0 || perdidas.length > 0
    || avisos.some((a) => a.clase.startsWith('ortografia') || a.clase === 'casilla-vacia');
  console.log(rojo ? 'ROJO' : 'VERDE');
  process.exit(rojo ? 1 : 0);
}
