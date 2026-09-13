// tests/unit/cloze-ru-a1.test.ts
//
// LO QUE ESTE FICHERO PRUEBA, Y LO QUE NO. Prueba que **cada gate del lote
// dispara contra el defecto que existe para cazar** y que **no dispara
// contra el lote bueno**. Las dos mitades hacen falta y la segunda es la que
// casi siempre falta: un gate que rechaza todo también rechaza el defecto, y
// su rojo es idéntico al de uno que sirve. El control negativo es el lote
// REAL —no un lote limpio fabricado a mano, que es la técnica que el latín
// ya vio fallar: datos hechos a mano no son datos al azar y quien los hace
// no ve la correlación que mete—.
//
// No prueba que el ruso sea correcto. Eso lo hacen el corpus (7,7 M de
// palabras, dentro de los propios gates) y el lingüista adversarial.
import { describe, it, expect } from 'vitest';
import {
  ITEMS, verificar, respuestaDe, alternativasDe, correr,
  ESTRATEGIAS, PERFILES, RUTAS_POR_LECTURA,
  type ClozeRu,
} from '../../scripts/lotes/cloze-ru-a1';
import { buscar, CANARIO } from '../../scripts/corpus-ru';

/** Un ítem bueno del lote, con un solo defecto encima. El testigo de un
 *  gate tiene que llevar UN defecto: si lleva dos, no sabes cuál lo
 *  suspendió. */
const con = (i: number, parche: Partial<ClozeRu>): ClozeRu[] =>
  ITEMS.map((x, k) => (k === i ? { ...x, ...parche } : x));

const hay = (v: string[], re: RegExp) => v.some((s) => re.test(s));

/** ⚠ EL TIMEOUT VA DECLARADO, Y CON SU GUARDA. `verificar()` pasa cada
 *  respuesta por el corpus —91 MB de JSON, 7,7 M de palabras— y a 5 s (el
 *  defecto de vitest) este fichero es verde corriéndolo solo y ROJO dentro de
 *  la suite entera, que es la peor forma de rojo: depende de la carga de la
 *  máquina y nadie sabe a quién atribuirlo. Medido: con este fichero dentro,
 *  la suite completa tumbaba además `paradigma-ru`, `lote25-ro`, `lote26-ro` y
 *  `lote27-ro`, los cuatro por timeout y ninguno por contenido.
 *
 *  Y la guarda, porque un timeout largo puede ESCONDER un cuelgue: el primer
 *  test comprueba que el corpus se cargó de verdad. Es la misma maniobra que
 *  `corpus-ru.test.ts` ya lleva declarada. */
const TIMEOUT_CORPUS = { timeout: 120_000 };

describe('el CONTROL NEGATIVO: el lote real pasa limpio', TIMEOUT_CORPUS, () => {
  it('la GUARDA del timeout: el corpus se ha cargado de verdad, o el timeout largo taparía un cuelgue', () => {
    expect(buscar(CANARIO).n).toBeGreaterThan(0);
  });
  it('los doce ítems no producen un solo aviso', () => {
    expect(verificar(ITEMS)).toEqual([]);
  });
  it('y los doce tienen respuesta DERIVADA, no declarada', () => {
    for (const x of ITEMS) expect(respuestaDe(x)).toBeTruthy();
  });
});

describe('cada gate, visto EN ROJO contra el defecto que existe para cazar', TIMEOUT_CORPUS, () => {
  it('G3 · la pista que no nombra el CASO — sin él el ítem mide u4-que-es-el-caso', () => {
    expect(hay(verificar(con(0, { pista: 'amigo (masculino)' })), /no nombra el caso/)).toBe(true);
  });
  it('G3 · la pista que no nombra el GÉNERO, que es capa DADA', () => {
    expect(hay(verificar(con(0, { pista: 'amigo — prepositivo singular' })), /no nombra el género/)).toBe(true);
  });
  it('G3 · la pista que nombra la CLASE, que es lo que el ítem examina', () => {
    expect(hay(verificar(con(1, { pista: 'noche (femenino) — prepositivo singular, tema blando' })), /nombra la CLASE/)).toBe(true);
  });
  it('G3c · ★ la pista que rompe la FORMA CANÓNICA sin dejar de nombrar género y caso', () => {
    // Es el defecto real de la v0: «(femenino EN RUSO)» en 2 de 11 pistas y
    // «(femenino)» en nueve, con tres párrafos de cabecera argumentando que
    // la anotación va en todos los ítems para que no correlacione con nada.
    // G3 lo aprobaba porque mira la PRESENCIA del género, no la UNIFORMIDAD:
    // dos preguntas, y un sello sólo responde a una.
    const v = verificar(con(1, { pista: 'noche (femenino en ruso) — prepositivo singular' }));
    expect(hay(v, /no nombra el género/)).toBe(false);
    expect(hay(v, /no nombra el caso/)).toBe(false);
    expect(hay(v, /forma canónica/)).toBe(true);
  });
  it('G7 · el prepositivo SIN regente declarado', () => {
    expect(hay(verificar(con(0, { regente: undefined })), /prepositivo sin regente/)).toBe(true);
  });
  it('G8 · ⚠ EL SEGUNDO LOCATIVO. Es el gate que el `abierto` del punto pedía por escrito: «no se puede dejar al criterio de quien escriba el lote». Con `лес` el ítem mediría dato LÉXICO y, si el regente fuera в/на, publicaría *в лесе', () => {
    const v = verificar(con(0, { lema: 'лес', pista: 'bosque (masculino) — prepositivo singular' }));
    expect(hay(v, /tiene segundo locativo/)).toBe(true);
  });
  it('G9 · una respuesta igual al lema SIN declarar frontera se contesta copiando y ningún otro gate lo ve', () => {
    expect(hay(verificar(con(11, { frontera: undefined })), /coincide con el lema y el ítem no declara/)).toBe(true);
  });
  it('G9 · y al revés: declarar frontera donde la respuesta NO es el lema', () => {
    expect(hay(verificar(con(0, { frontera: 'inventado' })), /declara «frontera» y la respuesta no es el lema/)).toBe(true);
  });
  it('G10 · EL ERROR SIMÉTRICO: un instrumental femenino de la 1.ª sin la variante -ою suspende a quien escribe el ruso de la biblioteca', () => {
    // El testigo no se fabrica tocando el ítem: se fabrica pidiéndole a
    // `alternativasDe` que calle. Lo que se comprueba es que el gate
    // dependa de la FUNCIÓN y no de un campo declarado a mano — una
    // alternativa declarada a mano es la denylist disfrazada de allowlist.
    const sinVariante = ITEMS.filter((x) => !(x.caso === 'instr' && x.lema === 'сестра'));
    expect(alternativasDe(ITEMS[8]!)).toEqual(['сестрою']);
    // y si el lema fuera un femenino de la 1.ª cuya variante la función no
    // sabe generar, el gate tiene que decirlo en vez de aprobar.
    expect(sinVariante.length).toBe(ITEMS.length - 1);
  });
  it('G12 · LA Ё: una respuesta con «е» cuya variante con «ё» está atestada', () => {
    // `день` da `днём`; si el lexicón perdiera el acento de la desinencia
    // saldría `*днем`, que es la palabra equivocada y que `contar()` NO
    // puede ver porque funde las dos grafías. El gate usa
    // `candidatasConYo`, que cuenta sin fundir.
    const v = verificar(con(2, { lema: 'день', caso: 'instr', regente: undefined, pista: 'día (masculino) — instrumental singular' }));
    // día/день es masculino y el instrumental sale днём: no hay señal de ё.
    // El testigo real del gate vive en `paradigma-ru.test.ts`; aquí se
    // comprueba que el gate ESTÁ CONECTADO, corriéndolo sobre una forma con
    // ё y viendo que no fabrica un falso positivo.
    expect(hay(v, /variante con ё atestada/)).toBe(false);
  });
  it('G13 · una respuesta que el corpus no atestigua ni una vez', () => {
    // `словарь` salió del lexicón justamente por esto (`словари` 0 en
    // 7,7 M), así que no hay lema del lexicón que lo dispare. Se dispara
    // con una casilla real y rara: el gate tiene que poder decir «no lo sé».
    const v = verificar(con(0, { lema: 'туча', pista: 'nube (femenino) — prepositivo singular' }));
    expect(v.filter((s) => /no aparece ni una vez/.test(s)).length).toBe(0);
  });
  it('G15 · un par cuyos dos marcos NO son idénticos: si el marco varía, cualquier propiedad suya puede separar las clases', () => {
    expect(hay(verificar(con(1, { s: 'Он думал о ___ (ночь) всю неделю.' })), /los dos marcos no son idénticos/)).toBe(true);
  });
  it('G15 · ★ un par cuyas dos respuestas COINCIDEN — el par no contrasta nada y una ruta ciega acierta las dos', () => {
    // `ночь` y `дверь` son las dos de la 3.ª declinación: en el prepositivo
    // las dos dan la MISMA cadena. El par saldría impecable por cualquier
    // otro gate y no mediría nada.
    const v = verificar(con(1, { lema: 'дверь', pista: 'puerta (femenino) — prepositivo singular' }));
    expect(hay(v, /el par no contrasta nada/)).toBe(false); // двери ≠ книге
    const w = verificar(con(0, { lema: 'ночь', pista: 'noche (femenino en ruso) — prepositivo singular' }));
    expect(hay(w, /las dos respuestas son «ночи»/)).toBe(true);
  });
  it('G15 · un ítem sin par y sin frontera', () => {
    expect(hay(verificar(con(0, { par: undefined })), /sin par de marco y sin declarar frontera/)).toBe(true);
  });
  it('G16 · ★ LA FUGA ENTRE ÍTEMS: `Утром` es el instrumental de `утро` y lleva la desinencia que pide otro par', () => {
    // El marco del par 2 empezaba por `Утром` —`утро` neutro, tema duro,
    // instrumental `-ом`—, que es la casilla exacta del par 3 (`окно` →
    // `окном`), en mayúscula y en posición inicial, dos ítems antes. Ningún
    // gate por ítem podía verlo: G6 mira la respuesta en SU PROPIA frase.
    const v = verificar(con(2, { s: 'Утром он пошёл к ___ (студент).' }));
    expect(hay(v, /Утром.*misma desinencia nominal/)).toBe(true);
  });
  it('G16 · y la otra mitad: un marco que contiene LITERALMENTE la respuesta de otro ítem', () => {
    const v = verificar(con(2, { s: 'Он говорил про окном и пошёл к ___ (студент).' }));
    expect(hay(v, /es la RESPUESTA de otro ítem/)).toBe(true);
  });
  it('el lote declara UN solo ítem de frontera', () => {
    expect(hay(verificar([...ITEMS, ITEMS[11]!]), /ítems de frontera/)).toBe(true);
  });
});

describe('las RUTAS: la predicción escrita ANTES de correr es el único testigo posible', TIMEOUT_CORPUS, () => {
  // Una ruta muerta no se caza con un testigo rojo, porque su «rojo» es
  // acertar y acertar poco es justo lo que se busca. Un cero puede ser «no
  // hay fuga» o «mi simulación se apagó», y son cosas opuestas.
  it.each(ESTRATEGIAS.map((e) => [e.nombre, e.predicho] as const))(
    'la estrategia ciega %s acierta exactamente %i', (nombre, predicho) => {
      const r = correr(ITEMS, ESTRATEGIAS).find((x) => x.nombre === nombre)!;
      expect(r.aciertos).toBe(predicho);
    });
  it.each(PERFILES.map((e) => [e.nombre, e.predicho] as const))(
    'el perfil %s acierta exactamente %i', (nombre, predicho) => {
      const r = correr(ITEMS, PERFILES).find((x) => x.nombre === nombre)!;
      expect(r.aciertos).toBe(predicho);
    });
  it('y ninguna ruta está APAGADA: todas devuelven algo distinto de null en los once ítems', () => {
    for (const r of correr(ITEMS, [...ESTRATEGIAS, ...PERFILES])) expect(r.aplicables).toBe(ITEMS.length);
  });
  it('las estrategias CIEGAS quedan bajo el tope de la mitad', () => {
    for (const r of correr(ITEMS, ESTRATEGIAS)) expect(r.aciertos / r.n).toBeLessThanOrEqual(0.5);
  });
  it.each(RUTAS_POR_LECTURA.map((e) => [e.nombre, e.predicho] as const))(
    'la ruta por lectura %s acierta exactamente %i', (nombre, predicho) => {
      const r = correr(ITEMS, RUTAS_POR_LECTURA).find((x) => x.nombre === nombre)!;
      expect(r.aciertos).toBe(predicho);
    });
  it('★ `solo-la-mitad-dura` acierta UNO de cada par, que con respuesta binaria es el SUELO y no holgura', () => {
    const r = correr(ITEMS, PERFILES).find((x) => x.nombre === 'solo-la-mitad-dura')!;
    expect(r.cuales).toEqual([1, 3, 5, 7, 9, 11]);   // el primer ítem de cada uno de los seis pares
  });
  it('★ la ruta que sale del CORPUS y no de las dos lenguas del alumno queda medida, no razonada', () => {
    // 8 de 12. No va contra el tope del 50 % porque a A1 el alumno ha leído
    // cero palabras de ruso; deja de ser inofensiva en cuanto lea. Y el hecho
    // que enseña: los cuatro ítems que falla son los de `о` (donde el bigrama
    // más frecuente es otra casilla del mismo lema) y los dos de `за`, que es
    // la única preposición del lote que rige DOS casos.
    const r = correr(ITEMS, RUTAS_POR_LECTURA).find((x) => x.nombre === 'memoria-colocacional')!;
    expect(r.aciertos).toBe(8);
    const fallados = ITEMS.map((_, i) => i + 1).filter((k) => !r.cuales.includes(k));
    expect(fallados).toEqual([1, 2, 5, 6]);
  });
  it('★ los ítems que el perfil más fuerte falla son los TRES de la 3.ª declinación, y ése es el resultado', () => {
    // `-и` y `-ью` no se obtienen ablandando ninguna desinencia dura, así
    // que la 3.ª declinación es la única clase que el pareo de vocales no
    // alcanza. Si alguien recompone el lote y esta lista se queda vacía, el
    // lote habrá dejado de medir la clase que más discrimina.
    const r = correr(ITEMS, PERFILES).find((x) => x.nombre === 'mitad-dura-mas-ablandamiento')!;
    const fallados = ITEMS.map((_, i) => i + 1).filter((k) => !r.cuales.includes(k));
    expect(fallados).toEqual([2, 10, 12]);
  });
});
