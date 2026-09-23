// tests/unit/cloze-ru-a1c.test.ts
//
// LO QUE ESTE FICHERO PRUEBA, Y LO QUE NO. Prueba que **cada gate del lote
// dispara contra el defecto que existe para cazar** y que **no dispara contra
// el lote bueno**. Las dos mitades hacen falta y la segunda es la que casi
// siempre falta: un gate que rechaza todo también rechaza el defecto, y su rojo
// es idéntico al de uno que sirve. El control negativo es el lote REAL, no un
// lote limpio fabricado a mano (§4.36 rumano: los datos hechos a mano no son
// datos al azar, y quien los hace no ve la correlación que mete).
//
// Y prueba lo que ningún testigo rojo puede probar: que cada RUTA acierta
// EXACTAMENTE el número predicho, **con su denominador**. Un gate muerto se caza
// con un rojo; una ruta muerta no, porque su «rojo» es acertar.
//
// ⚠ Y AÑADE UN CONTROL QUE NI EL LOTE 1 NI EL LOTE 2 TENÍAN: `el-paradigma-entero`
// modela al alumno que lo sabe todo y tiene que acertar 12 de 12. Si baja, las
// tablas de manual del fichero están rotas y **todos los demás números de
// PERFILES son de un aparato roto**, porque comparten esas tablas. Es la
// respuesta al hallazgo A-1 del lote 2, donde la predicción coincidió con lo
// observado y las dos cifras salían de una ruta que medía el vacío: la
// predicción no caza un aparato mal hecho, un control positivo sí.
//
// No prueba que el ruso sea correcto. Eso lo hacen el corpus (dentro de los
// propios gates) y el lingüista adversarial.
import { describe, it, expect } from 'vitest';
import {
  ITEMS, verificar, fugaContraLoPublicado, respuestaDe, alternativasDe,
  desinenciaDe, formaNominal, frase, correr, controlDelAparato,
  barridoDesinenciaFija, barridoRima,
  ESTRATEGIAS, PERFILES, RUTAS_POR_LECTURA, FALSAS_DEL_LOTE, veredictoFalsa,
  type ClozeAdjRu,
} from '../../scripts/lotes/cloze-ru-a1c';
import { buscar, CANARIO } from '../../scripts/corpus-ru';
import { ADJETIVOS_A1, NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import { casillaAdj, casillasQueDiscriminanGenero, concordar } from '../../lib/data/languages/ru/paradigma-adj-ru';
import { casillaNominal } from '../../lib/data/languages/ru/paradigma-ru';

/** Un ítem bueno del lote con UN solo defecto encima: si lleva dos, no sabes
 *  cuál lo suspendió (§0.8 rumano, corolario). */
const con = (i: number, parche: Partial<ClozeAdjRu>): ClozeAdjRu[] =>
  ITEMS.map((x, k) => (k === i ? { ...x, ...parche } : x));
const hay = (v: string[], re: RegExp) => v.some((s) => re.test(s));

/** ⚠ EL TIMEOUT VA DECLARADO Y CON SU GUARDA. `verificar()` pasa cada respuesta
 *  por 91 MB de JSON y a 5 s este fichero es verde solo y rojo dentro de la
 *  suite, que es la peor forma de rojo. Y un timeout largo puede ESCONDER un
 *  cuelgue, así que el primer test comprueba que el corpus se cargó. */
const TIMEOUT_CORPUS = { timeout: 120_000 };

describe('el CONTROL NEGATIVO: el lote real pasa limpio', TIMEOUT_CORPUS, () => {
  it('la GUARDA del timeout: el corpus se ha cargado de verdad', () => {
    expect(buscar(CANARIO).n).toBeGreaterThan(0);
  });
  it('los doce ítems no producen un solo aviso', () => {
    expect(verificar(ITEMS)).toEqual([]);
  });
  // ⚠ ★ ESTE TEST SE PUSO ROJO AL PUBLICAR EL LOTE, SIN QUE NADA ESTUVIERA MAL:
  // los doce ítems pasaron a estar en `ru/blocks/b6.json` y el gate empezó a
  // denunciar al lote contra sí mismo. Es el §40 con el signo contrario —allí un
  // control se quedó SIN objeto al acabar el trabajo, aquí GANÓ uno— y el arreglo
  // es excluir por IDENTIDAD (la frase publicada es una de las mías), que no
  // depende de tags, de ids ni de que nadie se acuerde de nada.
  it('y tampoco contra lo YA PUBLICADO — ni antes ni después de publicarse a sí mismo', () => {
    expect(fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/blocks')).toEqual([]);
  });
  it('los doce tienen respuesta DERIVADA y forma nominal DERIVADA, ninguna declarada', () => {
    for (const x of ITEMS) {
      expect(respuestaDe(x), x.adj).toBeTruthy();
      expect(formaNominal(x), x.sustantivo).toBeTruthy();
      // Y la prueba de que no se teclean: el marco no contiene la forma.
      expect(x.marco).toContain('{N}');
      expect(x.marco).toContain('{A}');
      expect(frase(x)).not.toContain('⟨?⟩');
    }
  });
});

describe('cada gate, visto EN ROJO contra el defecto que existe para cazar', TIMEOUT_CORPUS, () => {
  // ── LAS TRES EXCLUSIONES, y van ANTES del `continue` por el §0.8 rumano ──
  it('G5 · в/на sobre un sustantivo con SEGUNDO LOCATIVO produciría *в лесе', () => {
    expect(hay(verificar(con(6, { sustantivo: 'лес' })), /segundo locativo/)).toBe(true);
  });
  it('G6 · el INSTRUMENTAL FEMENINO SINGULAR, que es el error simétrico de la variante -ою', () => {
    expect(hay(verificar(con(10, { caso: 'instr' })), /instrumental femenino singular/)).toBe(true);
  });
  it('G7 · el NOMINATIVO (la respuesta sería el lema) y el ACUSATIVO (animacidad, A2)', () => {
    expect(hay(verificar(con(2, { caso: 'nom' })), /casilla «nom»/)).toBe(true);
    expect(hay(verificar(con(2, { caso: 'ac' })), /casilla «ac»/)).toBe(true);
  });
  // ⚠ Y LA FORMA PELIGROSA DEL §0.8: en el acusativo masculino `concordar()`
  // devuelve la forma (lee la animacidad de la entrada nominal), pero en un
  // lote futuro podría devolver `null` y entonces el ítem saldría por el
  // `continue`. Este test fija que el aviso de la casilla está ANTES.
  it('G7 · el gate de la casilla corre aunque la máquina no dé forma (no comparten `continue`)', () => {
    const v = verificar(con(2, { caso: 'ac', sustantivo: 'сердце' }));
    expect(hay(v, /casilla «ac»/)).toBe(true);
  });

  it('G1 · dos huecos, dos {N} o dos {A}', () => {
    expect(hay(verificar(con(0, { marco: 'Мы ___ говорили о ___ ({A}) {N}.' })), /«___» en el marco/)).toBe(true);
    expect(hay(verificar(con(0, { marco: 'Мы говорили о ___ ({A}) {N} {N}.' })), /«\{N\}» en el marco/)).toBe(true);
  });
  it('G2 · el lema adjetival no va entre paréntesis detrás del hueco', () => {
    expect(hay(verificar(con(0, { marco: 'Мы ({A}) говорили о ___ {N}.' })), /no nombra el lema/)).toBe(true);
  });
  it('G3 · la pista no nombra el caso, o no nombra el género y el número', () => {
    expect(hay(verificar(con(0, { pista: 'ruso — femenino singular' })), /no nombra el caso/)).toBe(true);
    expect(hay(verificar(con(0, { pista: 'ruso — prepositivo' })), /no nombra «femenino singular»/)).toBe(true);
  });
  it('G3 · la pista NOMBRA la fila, el tema o el acento — que es lo examinado', () => {
    for (const p of ['ruso — prepositivo femenino singular (tema duro)', 'ruso — prepositivo femenino singular, clase mixta', 'ruso — prepositivo femenino singular, desinencia átona'])
      expect(hay(verificar(con(0, { pista: p })), /nombra la FILA, el TEMA o el ACENTO/), p).toBe(true);
  });
  it('G3c · la pista sin forma canónica: cualquier variación tipográfica es una pista del significante', () => {
    expect(hay(verificar(con(0, { pista: 'ruso — prepositivo femenino singular EN RUSO' })), /no tiene la forma canónica/)).toBe(true);
  });
  it('G4 · el ancla (el sustantivo derivado) DELANTE del hueco en vez de detrás', () => {
    expect(hay(verificar(con(0, { marco: 'Мы говорили о {N} ___ ({A}).' })), /no aparece detrás del hueco/)).toBe(true);
  });
  it('G8 · la pista deletrea la respuesta', () => {
    expect(hay(verificar(con(0, { pista: 'русской — prepositivo femenino singular' })), /deletrea la respuesta/)).toBe(true);
  });
  it('G9 · la respuesta ya está escrita en la frase', () => {
    expect(hay(verificar(con(0, { marco: 'Мы говорили о русской и о ___ ({A}) {N}.' })), /ya está escrita en la frase/)).toBe(true);
  });
  it('G10 · la respuesta ES el lema y el ítem no declara frontera', () => {
    expect(hay(verificar(con(11, { frontera: undefined })), /coincide con el lema y el ítem no declara frontera/)).toBe(true);
  });
  // ⚠ LOS DOS GATES DE LA Ё ESTÁN VACÍOS EN ESTE LOTE, y por eso hay que verlos
  // en rojo a la fuerza: un gate visto sólo en verde no está probado, y menos
  // cuando el conjunto sobre el que mide es vacío (§40: un control que se queda
  // sin objeto no es un control).
  it('G11 · POR QUÉ ESTÁ VACÍO: ninguna de las 144 casillas adjetivales lleva ё', () => {
    // Un gate cuyo conjunto de medida es vacío no está probado por su verde
    // (§40). Aquí el vacío es un HECHO de la lengua y va comprobado en vez de
    // supuesto: el adjetivo sólo escribiría ё en una desinencia blanda TÓNICA,
    // y esa combinación no existe.
    for (const a of ADJETIVOS_A1)
      for (const f of ['m', 'f', 'n', 'pl'] as const)
        for (const c of ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as const)
          expect(casillaAdj(a, f, c, { animado: false }) ?? '', `${a.lema} ${f}.${c}`).not.toContain('ё');
  });
  it('G11 · y el gate DISPARA si alguna vez una respuesta llevara ё sin su variante', () => {
    // El testigo es una función, no un ítem: se comprueba que la condición
    // escrita en el gate es la correcta, sobre la cadena que la dispararía.
    const conYo = 'живёшь';
    expect(conYo.includes('ё') && alternativasDe(ITEMS[0]!).length === 0).toBe(true);
  });
  it('G14 · una FORMA NOMINAL no atestada (`папам`, 0 apariciones en 7,7 M)', () => {
    // El par entero, para que el único defecto sea el que se mide.
    const v = verificar(ITEMS.map((x) => (x.par === 'velar-studentam' ? { ...x, sustantivo: 'папа' } : x)));
    expect(hay(v, /la forma nominal «папам» no aparece ni una vez/)).toBe(true);
  });
  it('G15 · ★ §4.43 · el INSTRUMENTAL PLURAL entrega la desinencia (`новыми книгами`)', () => {
    // El par 5 llevado al instrumental plural: `-ыми`/`-ами` comparten las dos
    // últimas letras. Es la casilla donde la colisión vive de verdad, y NO es
    // la que yo había razonado — ver el barrido exhaustivo dos tests más abajo.
    const v = verificar(ITEMS.map((x) => (x.par === 'velar-studentam' ? { ...x, caso: 'instr' as const } : x)));
    expect(hay(v, /acaban en las mismas dos letras/)).toBe(true);
  });
  it('G15 · ★ y el barrido que REFUTÓ mi prosa: la colisión vive en el instrumental PLURAL', () => {
    // Yo había escrito que la única casilla afectada era el instrumental
    // femenino singular, que G6 ya prohíbe — o sea que G15 sobraba. Las 2.880
    // combinaciones del lexicón dicen otra cosa, y por eso el número se cuenta
    // en vez de razonarse.
    let instrPl = 0, instrSgF = 0, otras = 0;
    for (const a of ADJETIVOS_A1) for (const n of NOMBRES_A1)
      for (const c of ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as const)
        for (const num of ['sg', 'pl'] as const) {
          const r = concordar(a, n, c, num), f = casillaNominal(n, c, num);
          if (!r || !f || r.slice(-2) !== f.slice(-2)) continue;
          if (c === 'instr' && num === 'pl') instrPl++;
          else if (c === 'instr' && num === 'sg' && n.genero === 'f') instrSgF++;
          else otras++;
        }
    // 240 con 40 lemas; 252 desde el 2026-09-23 (мальчик y мужчина × 6
    // adjetivos, los dos en el instrumental plural). Las otras dos clases no
    // se movieron, que es lo que este test afirma: la colisión vive ahí.
    expect([instrPl, instrSgF, otras]).toEqual([252, 38, 6]);
  });

  // ── LOS PARES ───────────────────────────────────────────────────────
  it('G16 · dos marcos distintos dentro de un par', () => {
    expect(hay(verificar(con(1, { marco: 'Мы говорили о ___ ({A}) {N}!' })), /los dos marcos no son idénticos/)).toBe(true);
  });
  it('G16 · sustantivos distintos dentro de un par', () => {
    expect(hay(verificar(con(1, { sustantivo: 'страна' })), /sustantivos distintos/)).toBe(true);
  });
  it('G16 · casillas distintas dentro de un par', () => {
    expect(hay(verificar(con(1, { caso: 'dat' })), /no están en la misma casilla/)).toBe(true);
  });
  // ★ EL GATE QUE EL LOTE 2 NO TENÍA, con el par que lo motiva: `синим` y
  //   `русским` son respuestas DISTINTAS con la MISMA desinencia —una por la
  //   fila blanda y otra por la fila dura más la regla velar— y el invariante
  //   del lote 2 (que compara respuestas) las habría aprobado.
  it('G16 · ★ dos respuestas distintas con la MISMA desinencia no contrastan nada', () => {
    const v = verificar(con(8, { adj: 'синий' })); // синим / русским, los dos -им
    expect(hay(v, /las dos desinencias son «-им»/)).toBe(true);
  });
  it('G16 · y el control: en el lote real las seis parejas tienen desinencias distintas', () => {
    const pares = new Map<string, string[]>();
    for (const x of ITEMS) pares.set(x.par, [...(pares.get(x.par) ?? []), desinenciaDe(x)!]);
    for (const [k, ds] of pares) expect([k, ds[0] === ds[1]]).toEqual([k, false]);
  });

  // ── ★ EL EJE, RECALCULADO CONTRA EL LEXICÓN ─────────────────────────
  // Exigir un motivo escrito garantiza que el motivo EXISTA, nunca que sea
  // cierto (§4.33 rumano). Las cuatro ramas, cada una con su testigo.
  it('G17 · «dureza» declarado sobre dos adjetivos de la misma fila', () => {
    expect(hay(verificar(ITEMS.map((x) => (x.par === 'o-ot-cheloveka' ? { ...x, eje: 'dureza' as const } : x))), /declara eje «dureza» y los dos adjetivos son de tema duro/)).toBe(true);
  });
  it('G17 · «sibilante» declarado donde lo que contrasta es el ACENTO', () => {
    expect(hay(verificar(ITEMS.map((x) => (x.par === 'acento-v-gorode' ? { ...x, eje: 'sibilante' as const } : x))), /declara eje «sibilante» y los acentos difieren/)).toBe(true);
  });
  it('G17 · ★ «acento» declarado sobre un tema NO sibilante, donde el acento no se ve', () => {
    // Es el caso новый/молодой: mismo tema duro, acentos distintos, y fuera del
    // nominativo masculino las dos filas son idénticas. La prosa del inventario
    // no lo decía y la máquina lo calcula.
    const v = verificar(ITEMS.map((x) => (x.par === 'fila-u-okna' ? { ...x, adj: x.adj === 'синий' ? 'молодой' : x.adj, eje: 'acento' as const } : x)));
    expect(hay(v, /el acento NO se ve fuera del nominativo masculino/)).toBe(true);
  });
  it('G17 · «velar» declarado donde lo que contrasta es la sibilante', () => {
    expect(hay(verificar(ITEMS.map((x) => (x.par === 'o-ot-cheloveka' ? { ...x, eje: 'velar' as const } : x))), /declara eje «velar» y la \/o\/ se escribe distinta/)).toBe(true);
  });
  it('G18 · menos de tres ejes distintos', () => {
    expect(hay(verificar(ITEMS.map((x) => ({ ...x, eje: 'dureza' as const }))), /ejes distintos/)).toBe(true);
  });

  // ── LAS FRONTERAS ───────────────────────────────────────────────────
  it('G19 · el lote sin ninguna frontera', () => {
    expect(hay(verificar(ITEMS.map((x) => ({ ...x, frontera: undefined }))), /ni un ítem de frontera/)).toBe(true);
  });
  it('G19 · dos fronteras que sobreaplican la misma regla', () => {
    const v = verificar(ITEMS.map((x, i) => (i === 4 ? { ...x, frontera: ITEMS[0]!.frontera } : x)));
    expect(hay(v, /dos fronteras sobreaplican la misma regla/)).toBe(true);
  });
  it('G19 · «fila-por-la-terminacion-del-lema» sobre un lema que no acaba en -ий', () => {
    const v = verificar(ITEMS.map((x, i) => (i === 0 ? { ...x, adj: 'новый', sustantivo: 'книга' } : i === 1 ? { ...x, adj: 'хороший' } : x)));
    expect(hay(v, /no acaba en -ий o que es blando de verdad/)).toBe(true);
  });
  it('G19 · ★ «fila-por-la-terminacion-del-lema» SIN el distractor blando en -ий', () => {
    // Sin `синий` en el lote, la analogía «-ий ⇒ blando» no tiene dónde
    // aprenderse: es el dictamen D4 del lote 1 (el distractor alcanzable).
    const v = verificar(ITEMS.map((x) => (x.adj === 'синий' ? { ...x, adj: 'хороший' } : x)));
    expect(hay(v, /sin distractor alcanzable/)).toBe(true);
  });
  it('G19 · ★ «fila-por-la-terminacion-del-lema» SIN la evidencia que la induce', () => {
    // Quitando el ítem 10 (`русским`, donde la fila blanda acierta), el alumno
    // no tiene dónde haber visto que русский se comporta como blando.
    const v = verificar(ITEMS.map((x, i) => (i === 9 ? { ...x, adj: 'хороший' } : i === 8 ? { ...x, adj: 'синий' } : x)));
    expect(hay(v, /sin la EVIDENCIA que la induce/)).toBe(true);
  });
  it('G19 · «la-o-atona-sin-mirar-el-acento» sobre un lema de desinencia ÁTONA', () => {
    const v = verificar(ITEMS.map((x, i) => (i === 6 ? { ...x, adj: 'большой' } : i === 7 ? { ...x, adj: 'хороший' } : x)));
    expect(hay(v, /desinencia ÁTONA — la regla no se sobreaplica/)).toBe(true);
  });
  it('G19 · «la-forma-siempre-cambia» sobre una casilla cuya respuesta NO es el lema', () => {
    const v = verificar(ITEMS.map((x, i) => (i === 11 ? { ...x, caso: 'prep' as const, sustantivo: 'город' } : i === 10 ? { ...x, sustantivo: 'город', caso: 'prep' as const } : x)));
    expect(hay(v, /respuesta NO es el lema|frase repetida|marcos no son idénticos/)).toBe(true);
  });

  // ── LAS DOS FUGAS ───────────────────────────────────────────────────
  it('G20 · el marco de un ítem contiene la RESPUESTA de otro', () => {
    expect(hay(verificar(con(2, { marco: 'Он сидел русским у ___ ({A}) {N}.' })), /es la RESPUESTA de otro ítem/)).toBe(true);
  });
  it('G20 · el marco contiene una desinencia adjetival INEQUÍVOCA de otra respuesta', () => {
    // `красивым` no es respuesta de nadie y acaba en `-ым`, que es la desinencia
    // del ítem 9. Es la fuga del `Утром` del lote 1, en versión adjetival.
    expect(hay(verificar(con(2, { marco: 'Он сидел с красивым другом у ___ ({A}) {N}.' })), /la misma desinencia adjetival que la respuesta de otro ítem/)).toBe(true);
  });
  it('G20 · y NO dispara con `-ом`, `-ем`, `-ой` ni `-ей`, que son también nominales', () => {
    // El control de que el gate está ACOTADO y no apagado: un marco con
    // `столом` dentro no se marca, porque `-ом` es el instrumental del
    // sustantivo y marcarlo marcaría medio lote por ruido.
    const v = verificar(con(2, { marco: 'Он сидел за столом у ___ ({A}) {N}.' }));
    expect(hay(v, /desinencia adjetival/)).toBe(false);
  });
  it('G21 · ★ el marco contiene una respuesta YA PUBLICADA en otro lote ruso', () => {
    // `книгу` es la respuesta del ítem 11 de `cloze-ru-a1` (acusativo de книга).
    const v = fugaContraLoPublicado(con(2, { marco: 'Он читал книгу у ___ ({A}) {N}.' }), 'lib/data/languages/ru/blocks');
    expect(hay(v, /RESPUESTA del ejercicio ya publicado/)).toBe(true);
  });
  it('G21 · y su control: con un directorio que no existe no inventa hallazgos', () => {
    expect(fugaContraLoPublicado(ITEMS, 'lib/data/languages/ru/no-existe')).toEqual([]);
  });
});

describe('las RUTAS aciertan EXACTAMENTE lo predicho, numerador y denominador', TIMEOUT_CORPUS, () => {
  // ⚠ Las dos rutas por lectura NO coinciden con su predicción y eso está
  // escrito en el fichero en vez de ajustado: aquí se fija lo OBSERVADO, para
  // que un cambio futuro se vea. Las diez restantes coinciden.
  const OBSERVADO: Record<string, [number, number]> = {
    'copiar-el-lema': [1, 12],
    'copiar-el-sustantivo': [0, 12],
    'tema-mas-cola-del-sustantivo': [0, 12],
    'una-desinencia-fija': [2, 12],
    'rima-con-el-ancla': [6, 12],
    'solo-la-fila-dura': [7, 12],
    'fila-dura-mas-la-o-del-sustantivo': [10, 12],
    'terminacion-del-lema': [10, 12],
    'una-fila-mas-ablandar': [10, 12],
    'todo-menos-el-acento': [10, 12],
    'el-paradigma-entero · CONTROL DEL APARATO': [12, 12],
    'por-el-sustantivo-con-dos-letras · SUBESPECIFICADA': [3, 6],
    'por-el-regente-con-dos-letras · SUBESPECIFICADA': [2, 12],
    'memoria-colocacional-por-el-sustantivo': [4, 4],
    'memoria-colocacional-por-el-regente': [5, 12],
  };
  for (const r of correr(ITEMS, [...ESTRATEGIAS, ...PERFILES, ...RUTAS_POR_LECTURA])) {
    it(`\`${r.nombre}\` — ${OBSERVADO[r.nombre]![0]} de ${OBSERVADO[r.nombre]![1]} aplicables`, () => {
      expect([r.nombre, r.aciertos, r.aplicables]).toEqual([r.nombre, ...OBSERVADO[r.nombre]!]);
    });
  }

  // ★ EL CONTROL DEL APARATO, REESCRITO POR EL DICTAMEN (D-5). La versión
  // anterior corría sobre los DOCE ÍTEMS y el lingüista adversarial demostró con
  // una mutación que daba 12/12 estando rota: los doce ítems tocan 6 de las 24
  // casillas y sólo DOS de `FILA_BLANDA`. Un control que sólo mira lo que el lote
  // usa no controla el aparato: controla el lote.
  it('★ EL CONTROL DEL APARATO: las dos filas de manual reproducen la máquina en las 144 casillas', () => {
    expect(controlDelAparato()).toEqual([]);
  });
  it('★ y su TESTIGO ROJO es la mutación exacta que el control viejo aprobaba', () => {
    // Se reproduce el experimento del dictamen sin tocar el fichero: la mutación
    // vivía en `m.gen` y `m.prep` de la fila blanda, dos casillas que NINGÚN ítem
    // del lote toca. La versión vieja del control (los 12 ítems) las aprobaba.
    const casillasDelLote = new Set(ITEMS.map((x) => `${x.num === 'pl' ? 'pl' : NOMBRES_A1.find((n) => n.lema === x.sustantivo)!.genero}.${x.caso}`));
    expect(casillasDelLote.size).toBe(6);
    expect(casillasDelLote.has('m.gen')).toBe(true);   // vía человека, fila DURA
    // …pero por la fila BLANDA sólo se validan dos casillas, y ésa es la grieta:
    const porBlanda = ITEMS.filter((x) => x.adj === 'синий').map((x) => `${NOMBRES_A1.find((n) => n.lema === x.sustantivo)!.genero}.${x.caso}`);
    expect(new Set(porBlanda)).toEqual(new Set(['f.prep', 'n.gen']));
    // El control nuevo mira 144 casillas, o sea 24 por lema y las dos filas
    // enteras, y por eso la mutación no tiene dónde esconderse.
    expect(ADJETIVOS_A1.length * 4 * 6).toBe(144);
  });
  // ⚠ ★ Y EL TOPE DE LAS CIEGAS NO PUEDE FALLAR PARA LA MAYORÍA DE ELLAS: es un
  // teorema del diseño pareado y no una medición (D-1 del dictamen). Se fija como
  // teorema para que nadie lea su verde como si dijera algo.
  it('ninguna estrategia CIEGA pasa del tope de la mitad', () => {
    for (const r of correr(ITEMS, ESTRATEGIAS)) expect([r.nombre, r.aciertos / r.n > 0.5]).toEqual([r.nombre, false]);
  });
  it('★ …y el TEOREMA que hace que ese verde no diga nada: dentro de un par, el marco es constante', () => {
    // Si una ruta no lee el lema ni la glosa, su entrada es idéntica en los dos
    // ítems de un par —G16 lo obliga— y las dos respuestas difieren, así que
    // acierta como mucho uno de cada dos: 6/12 = exactamente el tope.
    const pares = new Map<string, typeof ITEMS>();
    for (const x of ITEMS) pares.set(x.par, [...(pares.get(x.par) ?? []), x] as typeof ITEMS);
    expect(pares.size).toBe(6);
    for (const [k, xs] of pares) {
      const sinLema = (x: (typeof ITEMS)[number]) => `${x.marco}|${x.sustantivo}|${x.caso}|${x.num}`;
      expect([k, sinLema(xs[0]!) === sinLema(xs[1]!)]).toEqual([k, true]);
      expect([k, respuestaDe(xs[0]!) === respuestaDe(xs[1]!)]).toEqual([k, false]);
    }
  });
  it('★ los dos MÁXIMOS BUSCADOS, y por qué su número tampoco es una sorpresa', () => {
    // `una-desinencia-fija`: con seis pares y doce desinencias, el máximo tiene
    // que ser 2. Si saliera más, el lote estaría repitiendo casilla sin saberlo.
    expect(barridoDesinenciaFija()[0]!.aciertos).toBe(2);
    // `rima-con-el-ancla` con 2 letras: una clase por par ⇒ el máximo ES el
    // suelo del diseño pareado. Con 1 letra agrupa distinto y baja a 5, y el
    // detalle que enseña es que `окна` y `человека` acaban las dos en -а y las
    // dos piden -ого.
    const r2 = barridoRima(2), r1 = barridoRima(1);
    expect([r2.length, r2.reduce((a, r) => a + r.aciertos, 0)]).toEqual([6, 6]);
    expect(r1.reduce((a, r) => a + r.aciertos, 0)).toBe(5);
    expect(r1.find((r) => r.clase === 'а')).toEqual({ clase: 'а', des: 'ого', aciertos: 2, n: 4 });
  });
  it('★ el vecino que DETERMINA la casilla no falla nunca; el que sólo la ACOMPAÑA, sí', () => {
    const xs = correr(ITEMS, RUTAS_POR_LECTURA);
    const sust = xs.find((r) => r.nombre === 'memoria-colocacional-por-el-sustantivo')!;
    const reg = xs.find((r) => r.nombre === 'memoria-colocacional-por-el-regente')!;
    // El sustantivo declinado fija caso, género y número: cuando el bigrama
    // existe, acierta SIEMPRE.
    expect(sust.aciertos).toBe(sust.aplicables);
    // La preposición fija el lema y deja la casilla abierta: aplica siempre y
    // falla más de la mitad.
    expect(reg.aplicables).toBe(ITEMS.length);
    expect(reg.aciertos).toBeLessThan(reg.aplicables);
  });
});

describe('el CONTROL POSITIVO: las formas que el lote invita a producir', TIMEOUT_CORPUS, () => {
  it('las diez se rechazan, por ortografía o por corpus', () => {
    for (const f of FALSAS_DEL_LOTE) {
      const v = veredictoFalsa(f.mala, f.buena);
      expect([f.mala, v.rechaza], v.detalle).toEqual([f.mala, true]);
    }
  });
  it('y su control negativo: las BUENAS pasan limpias — un veredicto que rechazara cualquier cadena tendría el mismo verde', () => {
    for (const f of FALSAS_DEL_LOTE) {
      const v = veredictoFalsa(f.buena, f.mala);
      expect([f.buena, v.rechaza]).toEqual([f.buena, false]);
    }
  });
  it('⚠ y las dos que NO están: `большем` y `большей` son palabras de OTRO lema y no se pueden usar', () => {
    // Son el comparativo declinado `бо́льший`. El veredicto las «rechazaría» por
    // frecuencia y acertaría por la razón equivocada — es el `*лесы` del §35.
    for (const forma of ['большем', 'большей']) {
      expect([forma, buscar(forma).n > 0]).toEqual([forma, true]);
      expect(FALSAS_DEL_LOTE.map((f) => f.mala)).not.toContain(forma);
    }
  });
});

describe('los hechos de la lengua sobre los que descansa el diseño', TIMEOUT_CORPUS, () => {
  it('★ `хороший` es HOMÓGRAFO de un blando en las 24 casillas, y `русский` no', () => {
    const h = ADJETIVOS_A1.find((a) => a.lema === 'хороший')!;
    const r = ADJETIVOS_A1.find((a) => a.lema === 'русский')!;
    let iguales = 0, distintas = 0;
    for (const f of ['m', 'f', 'n', 'pl'] as const)
      for (const c of ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as const) {
        if (casillaAdj(h, f, c, { animado: false }) === casillaAdj({ ...h, tema: 'blando' }, f, c, { animado: false })) iguales++;
        if (casillaAdj(r, f, c, { animado: false }) !== casillaAdj({ ...r, tema: 'blando' }, f, c, { animado: false })) distintas++;
      }
    expect([iguales, distintas]).toEqual([24, 14]);
  });
  it('y por eso `русский` es el ÚNICO lema del lexicón que separa «-ий» de «blando»', () => {
    const enIj = ADJETIVOS_A1.filter((a) => /ий$/.test(a.lema));
    const separan = enIj.filter((a) => {
      if (a.tema === 'blando') return false;
      for (const f of ['m', 'f', 'n', 'pl'] as const)
        for (const c of ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as const)
          if (casillaAdj(a, f, c, { animado: false }) !== casillaAdj({ ...a, tema: 'blando' }, f, c, { animado: false })) return true;
      return false;
    });
    expect([enIj.length, separan.map((a) => a.lema)]).toEqual([3, ['русский']]);
  });
  it('★ ningún ítem vive en una casilla que discrimine género, y no hace falta: el género va DADO', () => {
    // El aviso del punto («un lote de concordancia de género vive en el
    // nominativo») es correcto Y NO ES ESTE LOTE: aquí el género lo da el
    // sustantivo y lo examinado es la FILA. Se fija para que nadie lea el
    // aviso como si prohibiera este diseño.
    for (const a of ADJETIVOS_A1) expect([a.lema, casillasQueDiscriminanGenero(a)]).toEqual([a.lema, ['nom', 'ac']]);
    for (const x of ITEMS) expect([x.adj, ['nom', 'ac'].includes(x.caso)]).toEqual([x.adj, false]);
  });
  it('el adjetivo NO tiene ninguna casilla con ё: la desinencia blanda tónica no existe', () => {
    for (const a of ADJETIVOS_A1) expect([a.lema, a.tema === 'blando' && a.desinenciaTonica]).toEqual([a.lema, false]);
  });
});
