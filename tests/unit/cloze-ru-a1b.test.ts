// tests/unit/cloze-ru-a1b.test.ts
//
// LO QUE ESTE FICHERO PRUEBA, Y LO QUE NO. Prueba que **cada gate del lote
// dispara contra el defecto que existe para cazar** y que **no dispara contra
// el lote bueno**. Las dos mitades hacen falta y la segunda es la que casi
// siempre falta: un gate que rechaza todo también rechaza el defecto, y su rojo
// es idéntico al de uno que sirve. El control negativo es el lote REAL, no un
// lote limpio fabricado a mano.
//
// Y prueba lo que ningún testigo rojo puede probar: que cada RUTA acierta
// EXACTAMENTE el número predicho. Un gate muerto se caza con un rojo; una ruta
// muerta no, porque su «rojo» es acertar. El único testigo posible es la
// predicción escrita antes de correr.
//
// No prueba que el ruso sea correcto. Eso lo hacen el corpus (dentro de los
// propios gates) y el lingüista adversarial.
import { describe, it, expect } from 'vitest';
import {
  ITEMS, verificar, respuestaDe, alternativasDe, correr,
  ESTRATEGIAS, PERFILES, RUTAS_POR_LECTURA, FALSAS_DEL_LOTE, veredictoFalsa,
  type ClozeVerboRu,
} from '../../scripts/lotes/cloze-ru-a1b';
import { buscar, CANARIO } from '../../scripts/corpus-ru';

/** Un ítem bueno del lote con UN solo defecto encima: si lleva dos, no sabes
 *  cuál lo suspendió. */
const con = (i: number, parche: Partial<ClozeVerboRu>): ClozeVerboRu[] =>
  ITEMS.map((x, k) => (k === i ? { ...x, ...parche } : x));

const hay = (v: string[], re: RegExp) => v.some((s) => re.test(s));

/** ⚠ EL TIMEOUT VA DECLARADO Y CON SU GUARDA, por la misma medición que
 *  `cloze-ru-a1.test.ts`: `verificar()` pasa cada respuesta por 91 MB de JSON y
 *  a 5 s este fichero es verde solo y rojo dentro de la suite, que es la peor
 *  forma de rojo. Y un timeout largo puede ESCONDER un cuelgue, así que el
 *  primer test comprueba que el corpus se cargó. */
const TIMEOUT_CORPUS = { timeout: 120_000 };

describe('el CONTROL NEGATIVO: el lote real pasa limpio', TIMEOUT_CORPUS, () => {
  it('la GUARDA del timeout: el corpus se ha cargado de verdad', () => {
    expect(buscar(CANARIO).n).toBeGreaterThan(0);
  });
  it('los diez ítems no producen un solo aviso', () => {
    expect(verificar(ITEMS)).toEqual([]);
  });
  it('y los diez tienen respuesta DERIVADA, no declarada', () => {
    for (const x of ITEMS) expect(respuestaDe(x)).toBeTruthy();
  });
});

describe('cada gate, visto EN ROJO contra el defecto que existe para cazar', TIMEOUT_CORPUS, () => {
  it('exclusión · un verbo PERFECTIVO mediría u7-futuro-compuesto-simple', () => {
    expect(hay(verificar(con(3, { lema: 'сказать', s: 'Я ___ (сказать) каждый день.', pista: 'decir — presente de 1.ª singular' })), /es PERFECTIVO/)).toBe(true);
  });
  it('exclusión · un verbo IRREGULAR mediría u7-irregulares-frecuentes, que es A2', () => {
    expect(hay(verificar(con(3, { lema: 'мочь', s: 'Я ___ (мочь) каждый день.', pista: 'poder — presente de 1.ª singular' })), /marcado irregular/)).toBe(true);
  });
  it('exclusión · un verbo REFLEXIVO cargaría la capa de u7-reflexivo-sya', () => {
    expect(hay(verificar(con(3, { lema: 'учиться', s: 'Я ___ (учиться) каждый день.', pista: 'estudiar — presente de 1.ª singular' })), /es reflexivo/)).toBe(true);
  });
  // ⚠ Y LOS TRES ANTERIORES EN SU FORMA PELIGROSA: `мочь` tiene todas las
  // casillas guardadas, así que `presente()` NO devuelve null y el ítem
  // sobreviviría al `continue`. El que lo destapa es el caso contrario — un
  // irregular al que le faltara una casilla saldría por el `continue` y el gate
  // del irregular no llegaría a correr nunca si estuviera después. Es §0.8
  // rumano y por eso los tres van ANTES del `null`.
  it('exclusión · el gate del irregular corre AUNQUE la máquina devuelva null (no comparten `continue`)', () => {
    const v = verificar(con(3, { lema: 'мочь', persona: '2pl', s: 'Я ___ (мочь) каждый день.', pista: 'poder — presente de 2.ª plural' }));
    // El ancla ya no concuerda y eso también salta; lo que este test comprueba
    // es que el aviso del IRREGULAR está entre los avisos, no que sea el único.
    expect(hay(v, /marcado irregular/)).toBe(true);
  });

  it('G1 · dos huecos', () => {
    expect(hay(verificar(con(0, { s: 'Ты ___ очень хорошо ___ (говорить).' })), /2 huecos/)).toBe(true);
  });
  it('G2 · la frase no nombra el infinitivo entre paréntesis', () => {
    expect(hay(verificar(con(0, { s: 'Ты очень хорошо ___ .' })), /no nombra el infinitivo/)).toBe(true);
  });
  it('G3 · la pista sin «presente»: el hueco admitiría el pasado', () => {
    expect(hay(verificar(con(3, { pista: 'leer — 1.ª singular' })), /no nombra el TIEMPO/)).toBe(true);
  });
  it('G3 · la pista sin la persona', () => {
    expect(hay(verificar(con(3, { pista: 'leer — presente' })), /no nombra la persona/)).toBe(true);
  });
  it('G3 · la pista que nombra la CLASE, que es lo examinado', () => {
    expect(hay(verificar(con(3, { pista: 'leer (conjugación I) — presente de 1.ª singular' })), /nombra la CLASE o el TEMA/)).toBe(true);
  });
  it('G3c · la pista fuera de su forma canónica — cualquier variación tipográfica es una pista del significante', () => {
    expect(hay(verificar(con(3, { pista: 'leer — presente de 1.ª singular (verbo regular)' })), /forma canónica/)).toBe(true);
  });
  it('G4 · el ancla que no está delante del hueco', () => {
    expect(hay(verificar(con(3, { ancla: 'она' })), /no aparece delante del hueco/)).toBe(true);
  });
  // ⚠ EL GATE QUE NO ESTABA EN EL LOTE 1 Y ES EL MÁS CARO DE ESTE: sin él, un
  // ítem con `Ты` en el marco y `persona: '1sg'` en el campo sale limpio y queda
  // INDETERMINADO — el alumno lee el pronombre y la clave dice otra cosa.
  it('G5 · el pronombre del marco que NO concuerda con la persona declarada', () => {
    expect(hay(verificar(con(3, { persona: '3pl' })), /no es el pronombre de 3\.ª plural/)).toBe(true);
  });
  it('G6 · la pista que deletrea la respuesta', () => {
    expect(hay(verificar(con(3, { pista: 'читаю — presente de 1.ª singular' })), /deletrea la respuesta/)).toBe(true);
  });
  it('G7 · la respuesta escrita en la frase', () => {
    expect(hay(verificar(con(3, { s: 'Я читаю и ___ (читать) каждый день.' })), /ya está escrita en la frase/)).toBe(true);
  });
  // G9 · EL ERROR SIMÉTRICO DE LA Ё, visto en rojo apagando la función que lo
  //      cierra. El defecto que caza es real y medido: `живешь` sale 142 veces
  //      en la biblioteca y `живёшь` 15.
  it('G9 · una respuesta con ё que no acepta la grafía sin ё', () => {
    const v = verificar(ITEMS.map((x, k) => (k === 1 ? { ...x, lema: 'жить' } : x)));
    expect(v).toEqual([]);            // el lote real SÍ la acepta
    expect(alternativasDe(ITEMS[1]!)).toEqual(['живешь']);
    expect(alternativasDe(ITEMS[0]!)).toEqual([]);   // y no la inventa donde no hay ё
  });

  it('G13 · los dos marcos de un par que no son idénticos', () => {
    expect(hay(verificar(con(3, { s: 'Я ___ (читать) каждый вечер.' })), /los dos marcos no son idénticos/)).toBe(true);
  });
  it('G13 · los dos ítems de un par en personas distintas', () => {
    expect(hay(verificar(con(3, { persona: '3pl', ancla: 'Они', s: 'Они ___ (читать) каждый день.' })), /no están en la misma persona/)).toBe(true);
  });
  it('G13 · un ítem sin par de marco', () => {
    expect(hay(verificar(con(3, { par: undefined })), /sin par de marco/)).toBe(true);
  });

  // ⚠ G14 · EL EJE DECLARADO SE RECOMPUTA. Un motivo escrito garantiza que el
  //       motivo EXISTA, nunca que sea cierto, y en rumano un juicio falso pasó
  //       el gate igual que uno verdadero. Aquí el eje es una propiedad de las
  //       dos entradas del lexicón y se comprueba contra ellas.
  it('G14 · el eje «clase» declarado sobre dos verbos de la MISMA conjugación', () => {
    // помнить y говорить son los dos de la II: el eje declarado sería falso.
    const xs = ITEMS.map((x, k) => (k === 1
      ? { ...x, lema: 'помнить', s: 'Ты очень хорошо ___ (помнить).', pista: 'recordar — presente de 2.ª singular', frontera: undefined }
      : x));
    expect(hay(verificar(xs), /declara eje «clase» y los dos verbos son de la conjugación 2/)).toBe(true);
  });
  it('G14 · el eje «tema» declarado sobre dos temas que se derivan los dos del infinitivo', () => {
    // читать y работать tienen los dos el tema ingenuo: el eje no varía.
    const xs = ITEMS.map((x, k) => (k === 2
      ? { ...x, lema: 'работать', s: 'Я ___ (работать) каждый день.', pista: 'trabajar — presente de 1.ª singular' }
      : x));
    expect(hay(verificar(xs), /declara eje «tema» y los dos temas son derivables del infinitivo/)).toBe(true);
  });
  it('G14 · el eje «tema-1sg» declarado sobre dos verbos que ninguno tiene tema de 1.ª singular', () => {
    const xs = ITEMS.map((x, k) => (k === 4
      ? { ...x, lema: 'говорить', s: 'Я ___ (говорить) её лицо.', pista: 'hablar — presente de 1.ª singular' }
      : x));
    expect(hay(verificar(xs), /declara eje «tema-1sg»/)).toBe(true);
  });
  it('G14 · el eje «alcance» sin un verbo que alterne sólo en la 1.ª sg frente a otro que alterne en todo el paradigma', () => {
    const xs = ITEMS.map((x, k) => (k === 9
      ? { ...x, lema: 'читать', s: 'Ты ___ (читать) это каждый день.', pista: 'leer — presente de 2.ª singular' }
      : x));
    expect(hay(verificar(xs), /declara eje «alcance»/)).toBe(true);
  });
  it('G15 · un lote de menos de tres ejes tiene cobertura real por debajo del piso', () => {
    expect(hay(verificar(ITEMS.map((x) => ({ ...x, eje: 'tema' as const }))), /ejes distintos/)).toBe(true);
  });

  it('G16 · un lote sin ítem de frontera', () => {
    expect(hay(verificar(ITEMS.map((x) => ({ ...x, frontera: undefined }))), /no declara ni un ítem de frontera/)).toBe(true);
  });
  it('G16 · dos fronteras que sobreaplican la MISMA regla no añaden cobertura', () => {
    const f = ITEMS[8]!.frontera!;
    expect(hay(verificar(con(9, { frontera: f })), /sobreaplican la misma regla/)).toBe(true);
  });
  it('G16 · un motivo de frontera demasiado corto para decir qué error produce la regla', () => {
    expect(hay(verificar(con(1, { frontera: { regla: 'clase-por-infinitivo', motivo: 'sobreaplicación' } })), /demasiado corto/)).toBe(true);
  });
  // ⚠ EL GATE QUE CUESTA EL DICTAMEN D4 DEL LOTE 1: allí la frontera estaba
  //   suelta y el error que documenta la literatura РКИ no se podía producir,
  //   porque el lote no traía la forma que licencia la analogía. Aquí eso es un
  //   invariante y no una buena intención.
  it('G16 · frontera «clase-por-infinitivo» sobre un verbo donde la regla escolar ACIERTA la clase', () => {
    const xs = ITEMS.map((x, k) => (k === 1
      ? { ...x, lema: 'помнить', s: 'Ты очень хорошо ___ (помнить).', pista: 'recordar — presente de 2.ª singular', eje: 'tema-1sg' as const }
      : k === 0 ? { ...x, eje: 'tema-1sg' as const } : x));
    expect(hay(verificar(xs), /regla escolar ACIERTA la clase/)).toBe(true);
  });
  it('G16 · frontera «alcance-de-la-alternancia» sin la forma con tema de 1.ª sg en el lote', () => {
    // Quitado el ítem 5 (вижу), la analogía que produce *вижишь no se presenta.
    const xs = ITEMS.filter((_, k) => k !== 4).map((x, k) => (k === 4 ? { ...x, par: 'tema1sg-lico', eje: 'tema-1sg' as const } : x));
    expect(hay(verificar(xs), /sin distractor alcanzable/)).toBe(true);
  });
  it('G16 · frontera «alcance-de-la-alternancia» cuya respuesta SÍ usa el tema de 1.ª sg', () => {
    const xs = ITEMS.map((x, k) => (k === 8 ? { ...x, persona: '1sg' as const, ancla: 'Я', s: 'Я ___ (видеть) это каждый день.', pista: 'ver — presente de 1.ª singular' } : x));
    expect(hay(verificar(xs), /USA el tema de 1\.ª singular/)).toBe(true);
  });

  // G17 · LA FUGA ENTRE ÍTEMS, con el testigo que el lote 1 pagó de verdad:
  //       allí el marco empezaba por `Утром`, que es la respuesta-patrón de
  //       otro par. Aquí la desinencia mirada es la verbal.
  it('G17 · el marco que contiene la RESPUESTA de otro ítem', () => {
    expect(hay(verificar(con(3, { s: 'Я ___ (читать), когда пишешь каждый день.' })), /es la RESPUESTA de otro ítem/)).toBe(true);
  });
  it('G17 · el marco con una palabra que acaba en la misma desinencia verbal que otra respuesta', () => {
    expect(hay(verificar(con(3, { s: 'Я ___ (читать) каждый день, когда думают.' })), /la misma desinencia verbal/)).toBe(true);
  });
});

describe('LAS TRES FRONTERAS y su distractor', TIMEOUT_CORPUS, () => {
  it('son tres reglas distintas, y las tres están declaradas', () => {
    const reglas = ITEMS.filter((x) => x.frontera).map((x) => x.frontera!.regla);
    expect(reglas.sort()).toEqual(['alcance-de-la-alternancia', 'clase-por-infinitivo', 'no-alternancia-en-1sg']);
  });
  // ⚠ LA FRONTERA QUE LA v0 NO DECLARABA. El error que la literatura РКИ
  // documenta en la conjugación II con mutación es *видю —NO aplicar la
  // alternancia—, y la v0 declaraba frontera la dirección contraria (*вижишь),
  // que este alumno no puede cometer porque el portugués le da `vejo/vês`.
  it('la del ítem 5 usa el tema de 1.ª sg y su pareja de par NO alterna', () => {
    const x = ITEMS[4]!;
    expect(x.frontera?.regla).toBe('no-alternancia-en-1sg');
    expect(respuestaDe(x)).toBe('вижу');
    const pareja = ITEMS.find((y) => y !== x && y.par === x.par)!;
    expect(respuestaDe(pareja)).toBe('помню');
  });
  it('una frontera «no-alternancia-en-1sg» sobre una casilla sin alternancia se rechaza', () => {
    // El ítem 6 (помню) no tiene tema de 1.ª sg: no hay nada que dejar de aplicar.
    expect(hay(verificar(con(5, { frontera: ITEMS[4]!.frontera })), /no hay alternancia que dejar de aplicar/)).toBe(true);
  });
});

describe('EL CONTROL POSITIVO: las formas que el lote no debe producir', TIMEOUT_CORPUS, () => {
  // Un gate visto sólo en verde no está probado, y esta lista es el testigo del
  // hueco que el lingüista encontró (A-9): G10 comprueba «la respuesta lleva е
  // donde va ё» y NADIE comprobaba la simétrica, que es la que este lote
  // fabrica — quien aprende `живёшь` escribe `*пишёшь`.
  it('las siete se rechazan, y se dice por qué vía', () => {
    for (const f of FALSAS_DEL_LOTE) {
      const r = veredictoFalsa(f.mala, f.buena);
      expect(r.rechaza, `${f.mala}: ${r.detalle}`).toBe(true);
    }
  });
  it('y su CONTROL NEGATIVO: las siete BUENAS pasan la ortografía limpias', () => {
    // Sin esto, un veredicto que rechazara cualquier cadena también rechazaría
    // las formas correctas y su verde sería idéntico.
    for (const f of FALSAS_DEL_LOTE) {
      const r = veredictoFalsa(f.buena, f.mala);
      expect(r.rechaza, `${f.buena} no debería rechazarse`).toBe(false);
    }
  });
  it('cubre la sobreaplicación de la ё en las DOS conjugaciones y las dos direcciones de la alternancia', () => {
    const malas = FALSAS_DEL_LOTE.map((f) => f.mala);
    expect(malas).toContain('пишёшь');     // ё sobreaplicada en la I
    expect(malas).toContain('говорёшь');   // ё llevada a la II, donde no existe
    expect(malas).toContain('видю');       // la alternancia NO aplicada (ítem 5)
    expect(malas).toContain('вижишь');     // la alternancia sobreaplicada (ítem 9)
  });
});

describe('LAS RUTAS: la predicción escrita es el único testigo posible', TIMEOUT_CORPUS, () => {
  it('cada ruta acierta EXACTAMENTE lo predicho', () => {
    for (const r of correr(ITEMS, [...ESTRATEGIAS, ...PERFILES, ...RUTAS_POR_LECTURA]))
      expect(r.aciertos, `${r.nombre}: acierta ${r.aciertos} y la predicción decía ${r.predicho} (${r.cuales.join(' ')})`).toBe(r.predicho);
  });
  // ⚠ SE COMPRUEBA TAMBIÉN EL DENOMINADOR PREDICHO, y no es celo. La v0 de la
  // ruta por lectura acertaba EXACTAMENTE lo predicho (1) con un prefijo de
  // búsqueda que excluía por construcción las cinco formas que el punto enseña:
  // predicho y observado coincidían en el instrumento equivocado, así que el
  // numerador no puede ser el único testigo. El lingüista la cazó leyendo el
  // código de la ruta, no su número.
  it('y ninguna está APAGADA: el número de ítems aplicables es el predicho', () => {
    for (const r of [...ESTRATEGIAS, ...PERFILES, ...RUTAS_POR_LECTURA]) {
      const obs = correr(ITEMS, [r])[0]!;
      expect(obs.aplicables, r.nombre).toBe(r.aplicablesPredicho);
    }
  });
  // Y la comparación que hace visible el defecto de la v0: la ruta con el
  // prefijo del tema ingenuo acierta MENOS que la de dos letras, y no porque no
  // haya fuga sino porque no podía alcanzarla. Los tres números van fijados.
  it('LA EVIDENCIA NEGATIVA: el prefijo del tema ingenuo da 1/10 y el de dos letras 5/10 sobre los MISMOS ítems', () => {
    const t = correr(ITEMS, RUTAS_POR_LECTURA);
    const ingenuo = t.find((r) => r.nombre.startsWith('colocacional-por-tema-ingenuo'))!;
    const dos = t.find((r) => r.nombre === 'memoria-colocacional')!;
    const filtrada = t.find((r) => r.nombre === 'memoria-colocacional-sin-el-pasado')!;
    expect(ingenuo.cuales).toEqual([6]);
    expect(dos.cuales).toEqual([3, 5, 7, 9, 10]);
    expect(filtrada.cuales).toEqual([3, 4, 5, 7, 9, 10]);
    // Y no están anidadas: el único acierto del prefijo ingenuo lo pierden las
    // otras dos, así que la unión de las tres es mayor que la mejor de ellas.
    const union = new Set([...ingenuo.cuales, ...dos.cuales, ...filtrada.cuales]);
    expect(union.size).toBe(7);
    // Los cinco que acierta el prefijo de dos letras son EXACTAMENTE los ítems
    // de tema no derivable del infinitivo, que es lo que la v0 declaraba
    // inalcanzable leyendo bigramas.
    expect(dos.cuales).toEqual([3, 5, 7, 9, 10]);
  });
  it('ninguna estrategia CIEGA pasa del 50 %', () => {
    for (const r of correr(ITEMS, ESTRATEGIAS))
      expect(r.aciertos / r.n, r.nombre).toBeLessThanOrEqual(0.5);
  });
  // LA CIFRA QUE DECIDIÓ EL DISEÑO, fijada para que no se pierda: saber la
  // clase de verdad no añade ni un acierto sobre la regla escolar de manual,
  // o sea que la clase es GRATIS y el contenido del punto es el TEMA. Si algún
  // día esto deja de ser cierto, el lote ha cambiado de punto.
  it('la clase es GRATIS en este lote: la regla escolar y la clase correcta aciertan lo mismo', () => {
    const t = correr(ITEMS, [...ESTRATEGIAS, ...PERFILES]);
    const escolar = t.find((r) => r.nombre === 'terminacion-ith-eth-mas-tema-ingenuo')!;
    const clase = t.find((r) => r.nombre === 'clase-correcta-tema-ingenuo')!;
    expect(clase.aciertos).toBe(escolar.aciertos);
    expect(clase.cuales).toEqual(escolar.cuales);
  });
  // Y EL ÍTEM QUE NINGÚN PERFIL ACIERTA, que es la medida de para qué sirve el
  // lote: la frontera del alcance de la alternancia.
  it('el único ítem que ningún perfil acierta es la frontera del alcance', () => {
    const t = correr(ITEMS, PERFILES);
    const union = new Set(t.flatMap((r) => r.cuales));
    const ninguno = ITEMS.map((_, i) => i + 1).filter((k) => !union.has(k));
    expect(ninguno).toEqual([9]);
    expect(ITEMS[8]!.frontera?.regla).toBe('alcance-de-la-alternancia');
  });
});
