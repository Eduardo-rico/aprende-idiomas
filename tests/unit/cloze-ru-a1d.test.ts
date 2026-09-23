// tests/unit/cloze-ru-a1d.test.ts
//
// LO QUE ESTE FICHERO PRUEBA, Y LO QUE NO. Prueba que **cada gate del lote
// dispara contra el defecto que existe para cazar** (B1) y que **no dispara
// contra el lote bueno** (B2). Las dos mitades hacen falta y la segunda es la
// que casi siempre falta. El control negativo es el lote REAL y no un lote
// limpio fabricado a mano.
//
// Prueba además lo que ningún testigo rojo puede probar: que cada RUTA acierta
// exactamente el número predicho **con su denominador** (G5). Un gate muerto se
// caza con un rojo; una ruta muerta no, porque su «rojo» es acertar.
//
// ⚠ Y GUARDA DOS EVIDENCIAS NEGATIVAS EJECUTÁNDOLAS, no describiéndolas
// (E4/«guardar la evidencia negativa»): la v0 de `claseIrregular`, que decía
// que `город → города` es REGULAR, y la lectura de cuatro salidas del §9.1
// sobre un rival HOMÓGRAFO de su propia respuesta, que daba ROJO sobre un lote
// sano. Las dos se corren aquí para que nadie las reproponga.
//
// No prueba que el ruso sea correcto. Eso lo hacen el corpus (dentro de los
// propios gates) y el lingüista adversarial.
import { describe, it, expect } from 'vitest';
import {
  ITEMS, verificar, fugaContraLoPublicado, respuestaDe, alternativasDe,
  colaDe, frase, ancla, correr, controlDelAparato, claseIrregular,
  prefijoComun, reglaDeManual, plural, temaDelLema, verboDelMarco,
  barridoColaFija, barridoPorClase, veredictoRival, LECTURA_RIVAL,
  techoDeLaRutaDelGenero,
  ESTRATEGIAS, PERFILES, RUTAS_POR_LECTURA, FALSAS_DEL_LOTE, veredictoFalsa,
  entradaNom, vista,
  type ClozePlRu,
} from '../../scripts/lotes/cloze-ru-a1d';
import { buscar, CANARIO } from '../../scripts/corpus-ru';
import { NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import { casillaNominal, type EntradaNominal, type GeneroRu, type TemaRu } from '../../lib/data/languages/ru/paradigma-ru';
import { quitarAcento, revisarOrtografiaRu } from '../../lib/lang/ortografia-ru';

/** Un ítem bueno del lote con UN solo defecto encima: si lleva dos, no sabes
 *  cuál lo suspendió. */
const con = (i: number, parche: Partial<ClozePlRu>): ClozePlRu[] =>
  ITEMS.map((x, k) => (k === i ? { ...x, ...parche } : x));
const hay = (v: string[], re: RegExp) => v.some((s) => re.test(s));

/** ⚠ EL TIMEOUT VA DECLARADO Y CON SU GUARDA. `verificar()` pasa cada respuesta
 *  por 91 MB de JSON y a 5 s este fichero sale verde solo y rojo dentro de la
 *  suite, que es la peor forma de rojo (§26). Y un timeout largo puede ESCONDER
 *  un cuelgue, así que el primer test comprueba que el corpus se cargó. */
const TIMEOUT_CORPUS = { timeout: 120_000 };

describe('el CONTROL NEGATIVO: el lote real pasa limpio', TIMEOUT_CORPUS, () => {
  it('el corpus está cargado — la guarda del timeout largo', () => {
    expect(buscar(CANARIO).n).toBeGreaterThan(1000);
  });
  it('verificar() no devuelve ni un problema sobre los doce ítems', () => {
    expect(verificar(ITEMS)).toEqual([]);
  });
  it('fugaContraLoPublicado tampoco, contra el directorio REAL', () => {
    expect(fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks')).toEqual([]);
  });
  it('doce ítems, seis pares, seis ejes, cinco colas y tres fronteras', () => {
    expect(ITEMS).toHaveLength(12);
    expect(new Set(ITEMS.map((x) => x.par)).size).toBe(6);
    expect(new Set(ITEMS.map((x) => x.eje)).size).toBe(6);
    expect(new Set(ITEMS.map((x) => colaDe(x))).size).toBe(5);
    expect(ITEMS.filter((x) => x.frontera)).toHaveLength(3);
    expect(new Set(ITEMS.filter((x) => x.frontera).map((x) => x.frontera!.regla)).size).toBe(3);
  });
  it('las doce respuestas se DERIVAN y ninguna está escrita en lo que el alumno VE', () => {
    // ⚠ La v0 de este test miraba el ítem ENTERO con JSON.stringify y salió
    // roja sobre un lote sano: el `motivo` de la frontera de `город` CITA la
    // forma `города`, y tiene que citarla —es prosa de método, no estímulo—.
    // El invariante bueno mira los tres campos que llegan al alumno.
    for (const x of ITEMS) {
      const r = respuestaDe(x);
      expect(r).not.toBeNull();
      expect(`${x.marco} ${x.pista} ${x.lema}`, x.lema).not.toContain(quitarAcento(r!));
    }
  });
});

// ══════════════════════════════════════════════════════════════════════
// ★ LA EVIDENCIA NEGATIVA Nº 1, EJECUTADA: la v0 de claseIrregular
// ══════════════════════════════════════════════════════════════════════
//
// La v0 preguntaba por la FORMA de la cola: «si el tema queda intacto y la cola
// es una de -ы/-и/-а/-я, es regular». Las dos observaciones son ciertas sobre
// `города` y la conclusión es falsa, porque lo que hace irregular a una forma no
// es el aspecto de su cola sino que NO sea la que la regla produce. El gate lo
// cazó en la primera corrida del fichero, en rojo, con dos mensajes.
describe('la v0 de claseIrregular daba «regular» a город → города', TIMEOUT_CORPUS, () => {
  const v0 = (lema: string, resp: string): string => {
    const k = prefijoComun(lema, resp);
    if (k === 0) return 'lexema';
    const t = temaDelLema(lema);
    if (quitarAcento(resp).startsWith(t)) {
      const cola = quitarAcento(resp).slice(t.length);
      return /^[ыиая]$/.test(cola) ? 'regular' : 'desinencia';
    }
    return 'tema';
  };
  it('la EXPRESIÓN VIEJA, corrida sobre el dato real, se equivoca', () => {
    expect(v0('город', 'города')).toBe('regular');      // ← el defecto
    expect(v0('друг', 'друзья')).toBe('tema');          // en éstos acertaba
    expect(v0('человек', 'люди')).toBe('lexema');
  });
  it('la nueva compara contra la REGLA y acierta las tres clases', () => {
    const e = (l: string) => NOMBRES_A1.find((n) => n.lema === l)!;
    expect(claseIrregular(e('город'), 'города')).toBe('desinencia');
    expect(claseIrregular(e('друг'), 'друзья')).toBe('tema');
    expect(claseIrregular(e('человек'), 'люди')).toBe('lexema');
  });
  it('⚠ EL LÍMITE, AFIRMADO Y NO SUPUESTO: la tabla de temas de manual absorbe dos irregularidades', () => {
    // E7 del lingüista adversarial. `reglaDeManual` empieza leyendo
    // TEMAS_DE_MANUAL, así que `сестра → сёстры` (cambio de tema con ё) y
    // `день → дни` (vocal fugaz) salen REGULARES y G16b es ciego a los dos.
    // Hoy no publica nada malo porque G0 y G0b los excluyen antes; si mañana
    // se relaja G0, `сестра` entra como regular y sin frontera.
    const e = (l: string) => NOMBRES_A1.find((n) => n.lema === l)!;
    expect(claseIrregular(e('сестра'), casillaNominal(e('сестра'), 'nom', 'pl')!)).toBe('regular');
    expect(claseIrregular(e('день'), casillaNominal(e('день'), 'nom', 'pl')!)).toBe('regular');
    // Y lo que la tabla NO puede fabricar, que es lo que salva la partición de
    // las tres fronteras: ninguna entrada de TEMAS_DE_MANUAL toca друг ni человек.
    expect(hay(verificar(con(0, { lema: 'сестра' })), /tema de plural «сёстр» lleva ё/)).toBe(true);
    expect(hay(verificar(con(0, { lema: 'день' })), /vocal fugaz/)).toBe(true);
  });
  it('y el CONTROL NEGATIVO: los nueve regulares del lote siguen siendo regulares', () => {
    const irregulares = ITEMS.filter((x) => claseIrregular(entradaNom(x)!, respuestaDe(x)!) !== 'regular');
    expect(irregulares.map((x) => x.lema)).toEqual(['город', 'друг', 'человек']);
  });
});

// ══════════════════════════════════════════════════════════════════════
// ★ LA EVIDENCIA NEGATIVA Nº 2: cuatro salidas suponen DOS cadenas
// ══════════════════════════════════════════════════════════════════════
describe('el quinto veredicto: un rival homógrafo de su propia respuesta', TIMEOUT_CORPUS, () => {
  it('книга y товарищ dan HOMÓGRAFO, no ROJO', () => {
    for (const lema of ['книга', 'товарищ']) {
      const x = ITEMS.find((y) => y.lema === lema)!;
      const z = veredictoRival(x)!;
      expect(quitarAcento(z.rival)).toBe(quitarAcento(respuestaDe(x)!));
      expect(z.veredicto).toBe('HOMÓGRAFO');
    }
  });
  it('la LECTURA de cuatro salidas los habría dado por ROJO sobre un lote sano', () => {
    // La v0, ejecutada: sin la rama del homógrafo, `nR >= nB` es verdad por
    // construcción (son el mismo número) y no hay lectura escrita.
    const v0 = (nR: number, nB: number, leida: boolean) =>
      nR === 0 && nB > 0 ? 'EVIDENCIA' : nR === 0 && nB === 0 ? 'NULO VACÍO' : leida ? 'TAREA DE LECTURA' : 'ROJO';
    const z = veredictoRival(ITEMS.find((y) => y.lema === 'книга')!)!;
    expect(v0(z.nR, z.nB, false)).toBe('ROJO');
  });
  it('y el CONTROL NEGATIVO: los rivales que SÍ son otra cadena siguen dando su veredicto', () => {
    const reparto = new Map<string, number>();
    for (const x of ITEMS) {
      const z = veredictoRival(x)!;
      reparto.set(z.veredicto, (reparto.get(z.veredicto) ?? 0) + 1);
    }
    expect(reparto.get('EVIDENCIA')).toBe(7);
    expect(reparto.get('TAREA DE LECTURA')).toBe(3);
    expect(reparto.get('HOMÓGRAFO')).toBe(2);
    expect(reparto.get('ROJO')).toBeUndefined();
  });
  it('las tres TAREAS DE LECTURA tienen su lectura escrita en un CAMPO', () => {
    for (const x of ITEMS) {
      const z = veredictoRival(x)!;
      if (z.veredicto !== 'TAREA DE LECTURA') continue;
      expect(LECTURA_RIVAL[quitarAcento(z.rival)]).toBeTruthy();
      expect(LECTURA_RIVAL[quitarAcento(z.rival)]!.length).toBeGreaterThan(80);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════
// ★ EL CONTROL DEL APARATO, VISTO EN ROJO — §47
// ══════════════════════════════════════════════════════════════════════
//
// El lote 3 pagó que un control construido sobre lo que el LOTE usa no controla
// el aparato. Aquí la superficie que cualquier ruta puede tocar es la regla de
// plural sobre los lemas del lexicón, y el control corre sobre los cuarenta.
describe('el control del aparato cubre los 40 lemas y se ve en rojo', TIMEOUT_CORPUS, () => {
  it('el CONTROL NEGATIVO: con la regla de verdad, cero discrepancias en los 40', () => {
    expect(controlDelAparato()).toEqual([]);
    // ⚠ Era `toBe(40)` y se puso rojo al entrar мальчик y мужчина (2026-09-23)
    // sin que nada estuviera mal: lo que el control promete es cubrir el
    // lexicón ENTERO, que ya lo hace iterando NOMBRES_A1. Se fija la FORMA
    // (B7): que el lexicón no encoja por debajo de lo que se midió.
    expect(NOMBRES_A1.length).toBeGreaterThanOrEqual(40);
  });
  it('EN ROJO con la mitad velar de la regla de u1 quitada', () => {
    const sinVelar = (l: string, g: GeneroRu, t: TemaRu) => {
      const tema = temaDelLema(l);
      if (g === 'n') return tema + (t === 'duro' ? 'а' : 'я');
      return tema + (t === 'duro' ? 'ы' : 'и');
    };
    const rojo = controlDelAparato(sinVelar);
    expect(rojo.length).toBeGreaterThan(0);
    expect(hay(rojo, /книга: el manual da «книгы»/)).toBe(true);
  });
  it('EN ROJO si la lista de plurales léxicos pierde una entrada', () => {
    const sinGorod = (l: string, g: GeneroRu, t: TemaRu) => (l === 'город' ? reglaDeManual(l, g, t) : plural(l, g, t));
    expect(hay(controlDelAparato(sinGorod), /город: el manual da «городы» y la máquina «города»/)).toBe(true);
  });
  it('★ y el rojo lo daría un lema que NINGÚN ítem del lote toca', () => {
    // Es la lección exacta del §47: un control que sólo mirara los doce lemas
    // del lote saldría verde con la lista rota en `учитель`, `лес` o `берег`.
    const sinBereg = (l: string, g: GeneroRu, t: TemaRu) => (l === 'берег' ? reglaDeManual(l, g, t) : plural(l, g, t));
    const rojo = controlDelAparato(sinBereg);
    expect(hay(rojo, /берег:/)).toBe(true);
    expect(ITEMS.some((x) => x.lema === 'берег')).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════
// LOS GATES, UNO A UNO Y CADA UNO CONTRA EL DEFECTO QUE EXISTE PARA CAZAR
// ══════════════════════════════════════════════════════════════════════
describe('los gates por ítem, vistos en rojo', TIMEOUT_CORPUS, () => {
  it('G0 · un lema con ё en el tema de plural (сестра → сёстры)', () => {
    expect(hay(verificar(con(0, { lema: 'сестра' })), /tema de plural «сёстр» lleva ё/)).toBe(true);
  });
  it('G0b · un lema con vocal fugaz (день → дни)', () => {
    expect(hay(verificar(con(0, { lema: 'день' })), /tema oblicuo «дн» \(vocal fugaz\)/)).toBe(true);
  });
  it('G2 · el lema fuera del paréntesis', () => {
    expect(hay(verificar(con(0, { marco: 'Во дворе стояли ___ .' })), /no nombra el lema/)).toBe(true);
  });
  it('G3 · la pista nombra el TEMA, que es lo examinado', () => {
    expect(hay(verificar(con(1, { pista: 'caballo (tema blando) — nominativo plural · masculino' })), /nombra el TEMA/)).toBe(true);
  });
  it('G3c · la pista sin forma canónica', () => {
    expect(hay(verificar(con(0, { pista: 'mesa, plural masculino' })), /no tiene la forma canónica/)).toBe(true);
  });
  it('G3d · la glosa tecleada en vez de leída del lexicón', () => {
    expect(hay(verificar(con(0, { pista: 'mesita — nominativo plural · masculino' })), /la glosa de la pista no es la de NOMBRES_A1/)).toBe(true);
  });
  it('G4 · sin verbo en pasado plural delante del hueco, el lema contestaría', () => {
    expect(hay(verificar(con(0, { marco: 'Во дворе стоит ___ ({L}).' })), /no hay un verbo en pasado PLURAL/)).toBe(true);
  });
  it('G5 · la pista deletrea la respuesta', () => {
    expect(hay(verificar(con(0, { pista: 'столы — nominativo plural · masculino' })), /deletrea la respuesta|glosa de la pista/)).toBe(true);
  });
  it('G6 · la respuesta escrita en la propia frase', () => {
    expect(hay(verificar(con(0, { marco: 'Во дворе стояли столы и ___ ({L}).' })), /ya está escrita en la frase/)).toBe(true);
  });
  it('G11 · una respuesta que el corpus no atestigua', () => {
    // `музей` → `музеи` sale 3 veces; el que da cero es un lema fuera del
    // lexicón, así que se comprueba el gate con el contador directamente.
    expect(buscar('музеи').n).toBeGreaterThan(0);
    expect(buscar('городы').n).toBe(0);
  });
  it('G12 · el ancla entregando la cola', () => {
    // ⚠ Y EL TESTIGO NO PUEDE SER UN VERBO, lo cual es en sí mismo la medida:
    // ningún pasado plural ruso acaba en `-ы`, `-и` de sustantivo, `-а` ni
    // `-да`, así que con el ancla que G4 exige esta fuga NO PUEDE darse en
    // este lote. El testigo usa un adverbio (`всегда`, que acaba como
    // `города`) y por eso salta también G4: es el precio de ver en rojo un
    // gate que su propio vecino vuelve inalcanzable, y decirlo vale más que
    // dejarlo en verde para siempre (§25.2, G7 del lote 1).
    expect(hay(verificar(con(7, { marco: 'За рекой были и всегда ___ ({L}).' })), /acaban en las mismas dos letras/)).toBe(true);
  });
});

describe('los gates de par y de eje, vistos en rojo', TIMEOUT_CORPUS, () => {
  it('G13 · marcos distintos dentro de un par', () => {
    expect(hay(verificar(con(1, { marco: 'В саду стояли ___ ({L}).' })), /los dos marcos no son idénticos/)).toBe(true);
  });
  it('G13 · géneros distintos en un par que NO es el del neutro', () => {
    expect(hay(verificar(con(1, { lema: 'книга' })), /géneros distintos .* y el eje no es «genero-neutro»/)).toBe(true);
  });
  it('G13 · y el simétrico: el par del neutro con los dos del mismo género', () => {
    expect(hay(verificar(con(5, { lema: 'место' })), /declara eje «genero-neutro» y los dos lemas son n/)).toBe(true);
  });
  it('G13 · dos colas iguales dentro de un par', () => {
    // `сад` y `стол` dan los dos `-ы`: el par no contrastaría nada.
    expect(hay(verificar(con(1, { lema: 'сад' })), /las dos colas son «-ы»/)).toBe(true);
  });
  it('G14 · eje «tema-consonante» declarado sobre dos temas duros', () => {
    expect(hay(verificar(con(1, { lema: 'сад' })), /los dos temas son duro|las dos colas son/)).toBe(true);
  });
  it('G14 · eje «grafia» declarado donde ninguno lleva velar ni sibilante', () => {
    expect(hay(verificar(con(2, { lema: 'страна' })), /eje «grafia»|colas/)).toBe(true);
  });
  it('G14 · eje «clase-lexica» con los dos regulares', () => {
    expect(hay(verificar(con(7, { lema: 'стол', par: 'za-rekoj' })), /eje «clase-lexica».*regular\/regular|las dos colas/)).toBe(true);
  });
  it('G14 · eje «supletivo-lexema» con el irregular equivocado', () => {
    expect(hay(verificar(con(11, { lema: 'город' })), /eje «supletivo-lexema»|FRONTERA|regla «el-plural-se-forma-sobre-el-lema»/)).toBe(true);
  });
  it('G15 · menos de tres ejes', () => {
    const uno = ITEMS.slice(0, 4).map((x) => ({ ...x, eje: 'tema-consonante' as const }));
    expect(hay(verificar(uno), /ejes distintos/)).toBe(true);
  });
  it('G15b · menos de cuatro clases en total', () => {
    const pocas = ITEMS.slice(0, 4);
    expect(hay(verificar(pocas), /clases irregulares — con menos de cuatro/)).toBe(true);
  });
  it('★ G15b · y su segunda mitad, que la v0 no podía tener: menos de TRES desinencias del título', () => {
    // La v0 contaba `-зья` y `люди` como si fueran desinencias del reparto y
    // salía verde con cinco «colas» sobre un lote que produce tres de las
    // cuatro. Testigo: un lote con -ы, -а y los dos irregulares, sin -и.
    const sinI = [ITEMS[0]!, ITEMS[4]!, ITEMS[7]!, ITEMS[9]!, ITEMS[11]!];
    expect(hay(verificar(sinI), /sólo 2 de las CUATRO desinencias del título/)).toBe(true);
  });
  it('y el CONTROL NEGATIVO de G15b: el lote real produce tres de las cuatro y dos clases irregulares', () => {
    const colas = [...new Set(ITEMS.map((x) => colaDe(x)))];
    expect(colas.filter((c) => ['ы', 'и', 'а', 'я'].includes(c!)).sort()).toEqual(['а', 'и', 'ы']);
    expect(colas.filter((c) => !['ы', 'и', 'а', 'я'].includes(c!)).length).toBe(2);
  });
});

describe('los gates de frontera, vistos en rojo', TIMEOUT_CORPUS, () => {
  it('G16 · la regla declarada no es la clase recalculada', () => {
    const x = ITEMS[7]!;
    const mal = con(7, { frontera: { ...x.frontera!, regla: 'el-plural-se-forma-sobre-el-lema' } });
    expect(hay(verificar(mal), /declara la regla «el-plural-se-forma-sobre-el-lema».*la recalculada .* es «desinencia»/)).toBe(true);
  });
  it('G16 · dos fronteras con la misma regla', () => {
    const x = ITEMS[9]!;
    const mal = con(9, { frontera: { ...x.frontera!, regla: 'la-desinencia-la-decide-el-tema' } });
    expect(hay(verificar(mal), /dos fronteras sobreaplican la misma regla|declara la regla/)).toBe(true);
  });
  it('G16 · el distractor de su propio par tiene que ser REGULAR', () => {
    // Si la pareja de `город` fuera también irregular, la analogía no se
    // presenta y el error diana no es alcanzable (D7).
    const mal = con(6, { lema: 'лес' });
    expect(hay(verificar(mal), /sin distractor alcanzable|las dos colas/)).toBe(true);
  });
  it('G16 · un motivo demasiado corto para decir qué error produce la regla', () => {
    const x = ITEMS[7]!;
    expect(hay(verificar(con(7, { frontera: { ...x.frontera!, motivo: 'porque sí' } })), /motivo de la frontera es demasiado corto/)).toBe(true);
  });
  it('G16b · un irregular publicado SIN frontera declarada', () => {
    expect(hay(verificar(con(7, { frontera: undefined })), /es irregular \(clase «desinencia»\) y el ítem no declara frontera/)).toBe(true);
  });
  it('el lote sin ninguna frontera', () => {
    expect(hay(verificar(ITEMS.map((x) => ({ ...x, frontera: undefined }))), /no declara ni un ítem de frontera/)).toBe(true);
  });
});

describe('la fuga entre ítems y contra lo publicado, vista en rojo', TIMEOUT_CORPUS, () => {
  it('G17 · una palabra del marco que es la respuesta de otro ítem', () => {
    expect(hay(verificar(con(0, { marco: 'Во дворе стояли кони и ___ ({L}).' })), /es la RESPUESTA del ítem de «конь»/)).toBe(true);
  });
  it('G18 · una respuesta que ya está publicada en otro punto', () => {
    // El caso REAL que cambió el diseño: `школы` y `деревни` son respuestas
    // publicadas de `u4-declinacion-singular` (genitivo singular) y son los
    // nominativos plurales naturales del reparto -ы/-и en femenino.
    const mal = con(0, { lema: 'школа' });
    expect(hay(fugaContraLoPublicado(mal, 'lib/data/languages/ru/blocks'), /«школы» ya está publicada/)).toBe(true);
    const mal2 = con(0, { lema: 'деревня' });
    expect(hay(fugaContraLoPublicado(mal2, 'lib/data/languages/ru/blocks'), /«деревни» ya está publicada/)).toBe(true);
  });
  it('G18 · y su CONTROL NEGATIVO: con el directorio real el lote pasa', () => {
    expect(fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks')).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════
// LAS RUTAS: CADA UNA CON SU NÚMERO Y SU DENOMINADOR
// ══════════════════════════════════════════════════════════════════════
describe('las rutas aciertan lo predicho', TIMEOUT_CORPUS, () => {
  it('las CIEGAS no pasan del tope de la mitad', () => {
    for (const r of correr(ITEMS, ESTRATEGIAS)) expect(r.aciertos / r.n).toBeLessThanOrEqual(0.5);
  });
  // ⚠ LA v0 DE ESTE TEST ERA UN GUARDIÁN QUE VOLVÍA NO-OP SU PROPIA DECISIÓN
  //   (E8 del lingüista adversarial). Iteraba `for (const campo of ['marco',
  //   'pista'])` y dentro hacía `if (campo === 'marco')`, así que comprobaba
  //   `marco` DOS veces y `pista` CERO. Y la mitad que descartaba era la que
  //   era FALSA: su comentario decía «el marco, el verbo y la pista son
  //   idénticos» y la pista NO es idéntica dentro de ningún par —lleva la
  //   glosa, que es distinta por construcción— ni el género lo es en el par
  //   del neutro. El teorema se sostenía por accidente.
  it('★ el TEOREMA del §48, enunciado sobre lo que de verdad es constante', () => {
    const pares = new Map(ITEMS.map((x) => [x.par, ITEMS.filter((y) => y.par === x.par)]));
    for (const [k, xs] of pares) {
      // (a) lo que SÍ es idéntico dentro de un par: el marco entero, y con él
      //     el verbo, la preposición y la posición del hueco.
      expect(new Set(xs.map((x) => x.marco)).size, `${k} · marco`).toBe(1);
      // (b) lo que NO lo es, y por eso el teorema cubre sólo a las rutas que no
      //     leen el lema NI LA GLOSA: la pista difiere en los seis pares.
      expect(new Set(xs.map((x) => x.pista)).size, `${k} · pista`).toBe(2);
      // (c) y la parte de la pista que sí es constante —lo que va tras la
      //     glosa— es lo único que una ruta puede leer sin leer el lema… salvo
      //     en el par exento, donde el género cambia.
      const cola = xs.map((x) => x.pista.slice(x.pista.indexOf('—')));
      const exento = xs[0]!.eje === 'genero-neutro';
      expect(new Set(cola).size, `${k} · pista tras la glosa`).toBe(exento ? 2 : 1);
    }
  });
  it('⚠ y lo que el teorema NO cubre, afirmado en vez de supuesto: la GLOSA viaja entera en la Vista', () => {
    // `Vista.pista` lleva la glosa, que es distinta en los dos ítems de cada
    // par. Ninguna ruta escrita hoy la lee más allá del género, así que el tope
    // de 6 se sostiene — pero se sostiene por lo que las rutas hacen y no por
    // lo que el tipo permite. Si alguien escribe una ruta que lea la glosa, el
    // tope desaparece sin que nada se ponga rojo. Queda AFIRMADO aquí.
    const v = vista(ITEMS[0]!)!;
    expect(v.pista).toContain('mesa');
    expect(new Set(ITEMS.map((x) => x.pista.split(' —')[0])).size).toBe(12);
  });
  it('★ `el-genero-de-la-pista` va contra SU techo (6/7) y no contra la mitad', () => {
    // E5. El teorema del §48 acota a 1 por par a las rutas que no leen el lema,
    // y el género SÍ es propiedad del lema: sólo la acota donde el gate obliga
    // a que sea constante, y el par del neutro está exento por diseño.
    const g = correr(ITEMS, ESTRATEGIAS).find((r) => r.nombre === 'el-genero-de-la-pista')!;
    expect(techoDeLaRutaDelGenero()).toBe(7);
    expect(g.aciertos).toBe(6);
    // Y la mitad incómoda, medida: el 6 lo fabrica el par exento. Sin él, 5.
    const enElExento = g.cuales.filter((k) => ITEMS[k - 1]!.eje === 'genero-neutro');
    expect(enElExento).toEqual([5, 6]);
  });
  it('cada ruta CIEGA acierta exactamente su número predicho, con su denominador', () => {
    for (const r of correr(ITEMS, ESTRATEGIAS)) {
      expect(r.aciertos, r.nombre).toBe(r.predicho);
      expect(r.aplicables, r.nombre).toBe(r.aplicablesPredicho);
    }
  });
  it('cada PERFIL acierta exactamente su número predicho, con su denominador', () => {
    for (const r of correr(ITEMS, PERFILES)) {
      expect(r.aciertos, r.nombre).toBe(r.predicho);
      expect(r.aplicables, r.nombre).toBe(r.aplicablesPredicho);
    }
  });
  it('★ la regla de dos pasos falla EXACTAMENTE los tres irregulares, ni uno más', () => {
    const r = correr(ITEMS, PERFILES).find((z) => z.nombre.startsWith('la-regla-de-dos-pasos'))!;
    const fallados = ITEMS.map((_, i) => i + 1).filter((k) => !r.cuales.includes(k));
    expect(fallados).toEqual([8, 10, 12]);
    expect(fallados.map((k) => ITEMS[k - 1]!.lema)).toEqual(['город', 'друг', 'человек']);
  });
  it('★ el CONTROL del aparato sobre los doce ítems acierta 12 de 12', () => {
    const r = correr(ITEMS, PERFILES).find((z) => z.nombre.startsWith('el-paradigma-entero'))!;
    expect(r.aciertos).toBe(12);
  });
  it('⚠ la ruta por lectura con el tema NO coincide con lo predicho, y va fijado con su cifra', () => {
    // Predije 4 de 9 y salió 5 de 7. Se fija lo OBSERVADO y la prosa de la
    // ruta lo dice: ajustar la predicción a posteriori destruye el testigo.
    const r = correr(ITEMS, RUTAS_POR_LECTURA).find((z) => z.nombre === 'memoria-colocacional-con-el-tema')!;
    expect(r.predicho).toBe(4);
    expect(r.aciertos).toBe(5);
    expect(r.aplicables).toBe(7);
  });
  it('★ y ninguna ruta por lectura toca una sola de las tres fronteras', () => {
    for (const r of correr(ITEMS, RUTAS_POR_LECTURA))
      for (const k of [8, 10, 12]) expect(r.cuales, r.nombre).not.toContain(k);
  });
  it('la ruta ciega que tiene que dar cero lo da, y con el denominador lleno', () => {
    const r = correr(ITEMS, ESTRATEGIAS).find((z) => z.nombre === 'copiar-el-lema')!;
    expect(r.aciertos).toBe(0);
    expect(r.aplicables).toBe(12);
  });
  it('los máximos se BUSCAN y su barrido entero se puede leer', () => {
    expect(barridoColaFija()[0]!.aciertos).toBe(5);
    expect(barridoPorClase((x) => verboDelMarco(frase(x)).slice(-2)).length).toBe(2);
  });
});

// ══════════════════════════════════════════════════════════════════════
// EL CONTROL POSITIVO Y SU MITAD NEGATIVA
// ══════════════════════════════════════════════════════════════════════
describe('el control positivo del lote', TIMEOUT_CORPUS, () => {
  it('las nueve formas falsas se rechazan', () => {
    for (const f of FALSAS_DEL_LOTE) expect(veredictoFalsa(f.mala, f.buena).rechaza, f.mala).toBe(true);
  });
  it('y su CONTROL NEGATIVO: las nueve buenas pasan limpias', () => {
    for (const f of FALSAS_DEL_LOTE) expect(revisarOrtografiaRu(f.buena), f.buena).toEqual([]);
  });
  it('los dos caminos están los dos representados: ni todo ortografía ni todo corpus', () => {
    const vias = new Set(FALSAS_DEL_LOTE.map((f) => veredictoFalsa(f.mala, f.buena).via));
    expect(vias).toEqual(new Set(['ortografia', 'corpus']));
  });
  it('★ y NINGUNA forma atestada como palabra de otro lema o de otra época entra en el control', () => {
    // `други` 30, `человеки` 20 y `голови` 2 son lo que dos fronteras y un par
    // inducen, y las tres son palabras reales: el veredicto por frecuencia las
    // «rechazaría» acertando por la razón equivocada.
    for (const forma of ['други', 'человеки', 'голови']) {
      expect(buscar(forma).n, forma).toBeGreaterThan(0);
      expect(FALSAS_DEL_LOTE.map((f) => f.mala)).not.toContain(forma);
      expect(LECTURA_RIVAL[forma] ?? '', forma).not.toBe('');
    }
  });
});

// ══════════════════════════════════════════════════════════════════════
// LO QUE EL LOTE AFIRMA DE LA LENGUA, RECALCULADO
// ══════════════════════════════════════════════════════════════════════
describe('las afirmaciones medibles de la cabecera', TIMEOUT_CORPUS, () => {
  it('★ la regla de la última letra acierta 30 de los 40 lemas del lexicón', () => {
    const ultima = (e: EntradaNominal): string => {
      const l = quitarAcento(e.lema), t = temaDelLema(l);
      if (/о$/.test(l)) return t + 'а';
      if (/е$/.test(l)) return t + 'я';
      if (/[ьйя]$/.test(l)) return t + 'и';
      return t + (/[кгхжшщч]$/.test(t) ? 'и' : 'ы');
    };
    const ok = NOMBRES_A1.filter((e) => quitarAcento(casillaNominal(e, 'nom', 'pl') ?? '') === ultima(e));
    // Eran 30 de 40; desde el 2026-09-23 son 32 de 42 (мальчик y мужчина
    // aciertan). Lo que la cabecera afirma es la FORMA: que falla exactamente
    // estos diez, y eso sigue fijado abajo por su nombre.
    expect(ok.length).toBe(NOMBRES_A1.length - 10);
    // Y los diez que falla, enumerados: si esta lista cambia, la cabecera miente.
    expect(NOMBRES_A1.filter((e) => !ok.includes(e)).map((e) => e.lema).sort())
      .toEqual(['берег', 'город', 'день', 'друг', 'край', 'лес', 'сердце', 'сестра', 'учитель', 'человек'].sort());
  });
  it('★ en ningún lema del lexicón el nominativo plural coincide con el lema', () => {
    // Es lo que hace que G7 no necesite la escapatoria que el lote 3 sí tenía.
    for (const e of NOMBRES_A1)
      expect(quitarAcento(casillaNominal(e, 'nom', 'pl') ?? ''), e.lema).not.toBe(quitarAcento(e.lema));
  });
  it('★ `море` es el ÚNICO neutro blando del lexicón, y por eso falta la cola -я', () => {
    const neutrosBlandos = NOMBRES_A1.filter((e) => e.genero === 'n' && e.tema !== 'duro');
    expect(neutrosBlandos.map((e) => e.lema)).toEqual(['море']);
    expect(ITEMS.some((x) => x.lema === 'море')).toBe(false);
    expect([...new Set(ITEMS.map((x) => colaDe(x)))]).not.toContain('я');
  });
  it('ninguna de las doce respuestas lleva ё, y por eso las alternativas están vacías', () => {
    for (const x of ITEMS) {
      expect(respuestaDe(x)!).not.toContain('ё');
      expect(alternativasDe(x)).toEqual([]);
    }
  });
  it('el ancla de los doce es un verbo en pasado plural y ninguno coincide con la respuesta', () => {
    for (const x of ITEMS) {
      const a = ancla(x)!;
      expect(a, x.lema).toMatch(/(ли|лись)$/);
      expect(quitarAcento(respuestaDe(x)!).slice(-2), x.lema).not.toBe(a.slice(-2));
    }
  });
  it('la Vista que reciben las rutas NO tiene caso ni número: el aparato es una sola casilla', () => {
    const v = vista(ITEMS[0]!)!;
    expect(Object.keys(v).sort()).toEqual(['genero', 'lema', 'pista', 's']);
  });
});
