// tests/unit/paradigma-ru.test.ts
//
// Lo que este fichero prueba y lo que NO: prueba que la MÁQUINA produce
// las casillas que el corpus atestigua y que los invariantes disparan.
// **No prueba que las reglas sean correctas** — eso no lo puede probar un
// test escrito por quien escribió las reglas. Lo hace `check-paradigma-ru.ts`
// contra 7,7 M de palabras, que es de otra naturaleza.
//
// Los números que aparecen aquí son cuentas reales del corpus, medidas con
// `scripts/corpus-ru.ts`. Van escritos porque una aserción sin su medida
// es una afirmación.
import { describe, it, expect } from 'vitest';
import {
  casillaNominal, prepositivoSg, paradigmaPresente, presente, pasado, imperativo,
  invariantesVerbales, invariantesNominales, temaIngenuo, temaDe, declinacionDe,
  type EntradaNominal, type EntradaVerbal,
} from '../../lib/data/languages/ru/paradigma-ru';
import { NOMBRES_A1, VERBOS_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import { revisarOrtografiaRu } from '../../lib/lang/ortografia-ru';

const n = (lema: string) => NOMBRES_A1.find((x) => x.lema === lema)!;
const v = (lema: string) => VERBOS_A1.find((x) => x.lema === lema)!;

describe('el orden de las dos reglas: TEMA primero, ORTOGRAFÍA después', () => {
  // Éste es el sitio de máximo daño del inventario: la v0 decía que el
  // reparto -ы/-и es ORTOGRÁFICO y es primero de TEMA. Las cuatro formas
  // de abajo son las que la regla mal enunciada produce, y ninguna existe.
  it.each([
    ['конь', 'кони', 'коны', 120],
    ['музей', 'музеи', 'музеы', 3],
    ['деревня', 'деревни', 'деревны', 395],
    ['дверь', 'двери', 'дверы', 1834],
  ])('%s hace %s por TEMA blando, no %s (corpus: %i)', (lema, buena, mala) => {
    expect(casillaNominal(n(lema), 'nom', 'pl')).toBe(buena);
    expect(casillaNominal(n(lema), 'nom', 'pl')).not.toBe(mala);
  });

  it('книга hace книги por ORTOGRAFÍA, con tema duro (книги 597 · книгы 1)', () => {
    expect(n('книга').tema).toBe('duro');
    expect(casillaNominal(n('книга'), 'nom', 'pl')).toBe('книги');
  });

  it('врач hace врачи por ORTOGRAFÍA y no por tema: es el par que separa las dos reglas', () => {
    expect(n('врач').tema).toBe('duro');
    expect(casillaNominal(n('врач'), 'nom', 'pl')).toBe('врачи');
  });
});

describe('EL CONTROL POSITIVO: ninguna forma falsa de arranque es producible', () => {
  // ⚠ Y SU CONTROL NEGATIVO, que es la mitad que falta casi siempre. Un
  // gate que rechaza todo también rechaza las nueve, y su verde es idéntico
  // al de uno que funciona. Las BUENAS tienen que pasar limpias.
  const FALSAS = ['книгы', 'жыть', 'писаю', 'коны', 'музеы', 'деревны', 'дверы', 'карот'];
  const BUENAS = ['книги', 'жить', 'пишу', 'кони', 'музеи', 'деревни', 'двери', 'карт'];

  it('las dos que caza la ORTOGRAFÍA (y sólo ésas) las caza la ortografía', () => {
    expect(revisarOrtografiaRu('книгы').map((h) => h.clase)).toContain('velar-y');
    expect(revisarOrtografiaRu('жыть').map((h) => h.clase)).toContain('sibilante-y');
  });

  it.each(BUENAS)('la forma buena «%s» NO la rechaza la ortografía', (buena) => {
    expect(revisarOrtografiaRu(buena)).toHaveLength(0);
  });

  it('ninguna forma falsa aparece en el paradigma completo del lexicón', () => {
    const todas = new Set<string>();
    for (const e of NOMBRES_A1)
      for (const num of ['sg', 'pl'] as const)
        for (const c of ['nom', 'ac', 'gen', 'dat', 'instr', 'prep'] as const) {
          const f = casillaNominal(e, c, num);
          if (f) todas.add(f);
        }
    for (const x of VERBOS_A1) for (const f of Object.values(paradigmaPresente(x))) if (f) todas.add(f);
    for (const f of FALSAS) expect(todas.has(f)).toBe(false);
  });

  it('y el paradigma completo NO viola la ortografía en ninguna celda', () => {
    expect(invariantesNominales(NOMBRES_A1)).toEqual([]);
    expect(invariantesVerbales(VERBOS_A1)).toEqual([]);
  });
});

describe('EL SEGUNDO LOCATIVO: la firma es el invariante', () => {
  it('в лесу (381) sale de в; о лесе (2) sale de о — y son dos casillas', () => {
    expect(prepositivoSg(n('лес'), 'в')).toBe('лесу');
    expect(prepositivoSg(n('лес'), 'о')).toBe('лесе');
  });

  it('la preposición es LÉXICA: берег va con на (203) y no con в (0)', () => {
    expect(prepositivoSg(n('берег'), 'на')).toBe('берегу');
    expect(prepositivoSg(n('берег'), 'в')).toBe('береге');
  });

  it('un sustantivo sin segundo locativo da la misma forma con cualquier regente', () => {
    expect(prepositivoSg(n('стол'), 'в')).toBe('столе');
    expect(prepositivoSg(n('стол'), 'о')).toBe('столе');
  });
});

describe('EL §4.2 RUMANO, EJECUTADO: quitarle el dato a un lema y ver qué deriva la regla sola', () => {
  // ⚠ ESTE TEST SE ESCRIBIÓ AL REVÉS Y SALIÓ ROJO, Y LO QUE DIJO EL ROJO
  // VALE MÁS QUE LO QUE YO QUERÍA PROBAR. La versión de partida afirmaba
  // que el invariante caza al que envenena el lema. NO LO CAZA, y no puede:
  // si alguien SUSTITUYE `пиш-` por `писа-`, el tema guardado y el ingenuo
  // coinciden, la condición del invariante es «difieren», y calla. Nada
  // dentro de esta máquina sabe cuál era el tema bueno.
  //
  // Lo que sí lo caza es el CORPUS, y por eso es el segundo camino y no un
  // adorno: `пишу` 199 frente a `писаю` 0. El invariante cubre el descuido
  // (olvidar la nota); la sustitución deliberada sólo la ve algo de fuera.
  it('LA REGLA INGENUA PRODUCE *писаю, y el invariante NO puede verlo: ése es su límite', () => {
    expect(temaIngenuo('писать')).toBe('писа');
    const envenenado: EntradaVerbal = { ...v('писать'), temaPresente: temaIngenuo('писать')!, nota: undefined };
    expect(presente(envenenado, '1sg')).toBe('писаю');
    // El límite, afirmado en vez de supuesto. Si algún día esto deja de
    // estar vacío, alguien ha encontrado un camino que aquí no había.
    expect(invariantesVerbales([envenenado])).toEqual([]);
  });

  it('lo que SÍ caza el invariante es el descuido: tema alterno guardado y sin motivo escrito', () => {
    const sinNota: EntradaVerbal = { ...v('писать'), nota: undefined };
    expect(invariantesVerbales([sinNota]).map((a) => a.clase)).toContain('alternancia-sin-nota');
  });

  it('la alternancia de 1.ª sg tiene su propio aviso: любл- no la ve el aviso del tema general', () => {
    const sinNota: EntradaVerbal = { ...v('любить'), nota: undefined };
    const avisos = invariantesVerbales([sinNota]);
    expect(avisos.map((a) => a.clase)).toContain('alternancia-1sg-sin-nota');
    // Y el aviso del tema general NO dispara, que es justo por lo que hacen
    // falta los dos: люб- coincide con el ingenuo.
    expect(avisos.map((a) => a.clase)).not.toContain('alternancia-sin-nota');
  });

  it('un verbo irregular al que le falta una casilla devuelve null, nunca una forma plausible', () => {
    const roto: EntradaVerbal = { ...v('мочь'), irregular: { '1sg': 'могу' } };
    expect(presente(roto, '1sg')).toBe('могу');
    expect(presente(roto, '3pl')).toBeNull();
  });
});

describe('LOS DOS ACENTOS, que la v0 tenía como un campo solo', () => {
  // писать separa los dos hechos: пишу́ tónica (imperativo пиши́) y пи́шешь
  // átona (sin ё). Un campo solo obliga a escribir mal una de las dos.
  it('писать: imperativo пиши CON -и, y 2.ª sg пишешь SIN ё', () => {
    expect(imperativo(v('писать'))).toBe('пиши');
    expect(presente(v('писать'), '2sg')).toBe('пишешь');
  });

  it('жить: los dos acentos coinciden y salen живёшь y живи', () => {
    expect(presente(v('жить'), '2sg')).toBe('живёшь');
    expect(imperativo(v('жить'))).toBe('живи');
  });

  it('помнить: con los dos átonos el imperativo toma -и por el grupo consonántico (помни, no *помнь)', () => {
    expect(imperativo(v('помнить'))).toBe('помни');
  });
});

describe('LA DUREZA DE LA DESINENCIA ES DISTINTA EN LAS DOS CONJUGACIONES', () => {
  // La v0 escribió UNA regla para las dos y producía *говорат, *любат,
  // *люблу, *помну. Lo cazó el corpus: говорят 2.531 · говорат 0.
  it.each([
    ['говорить', '3pl', 'говорят'],
    ['любить', '3pl', 'любят'],
    ['любить', '1sg', 'люблю'],
    ['помнить', '1sg', 'помню'],
    ['видеть', '3pl', 'видят'],
  ] as const)('conjugación II conserva la vocal blanda: %s %s → %s', (lema, p, esperado) => {
    expect(presente(v(lema), p)).toBe(esperado);
  });

  it.each([
    ['идти', '1sg', 'иду'],
    ['идти', '3pl', 'идут'],
    ['ждать', '1sg', 'жду'],
    ['читать', '1sg', 'читаю'],
  ] as const)('conjugación I la endurece tras consonante: %s %s → %s', (lema, p, esperado) => {
    expect(presente(v(lema), p)).toBe(esperado);
  });

  it('la sibilante endurece en LAS DOS: пишу (I) y учат (II)', () => {
    expect(presente(v('писать'), '1sg')).toBe('пишу');
    expect(presente(v('учить'), '3pl')).toBe('учат');
    expect(presente(v('учить'), '1sg')).toBe('учу');
  });
});

describe('la vocal fugaz y los temas de plural', () => {
  it('день conserva la vocal SÓLO en el nominativo singular', () => {
    const d = n('день');
    expect(casillaNominal(d, 'nom', 'sg')).toBe('день');
    expect(casillaNominal(d, 'gen', 'sg')).toBe('дня');
    expect(casillaNominal(d, 'nom', 'pl')).toBe('дни');
    expect(casillaNominal(d, 'gen', 'pl')).toBe('дней');
  });

  it('друг cambia de tema Y de clase en plural: друзьям (47), no *друзьам', () => {
    expect(casillaNominal(n('друг'), 'dat', 'pl')).toBe('друзьям');
    expect(casillaNominal(n('друг'), 'instr', 'pl')).toBe('друзьями');
  });

  it('человек: люд- acaba en consonante dura y aun así toma las blandas (людям 695)', () => {
    expect(casillaNominal(n('человек'), 'nom', 'pl')).toBe('люди');
    expect(casillaNominal(n('человек'), 'dat', 'pl')).toBe('людям');
    expect(casillaNominal(n('человек'), 'instr', 'pl')).toBe('людьми');
  });
});

describe('la animacidad y las tres declinaciones', () => {
  it('el acusativo animado sale del genitivo y el inanimado del nominativo', () => {
    expect(casillaNominal(n('студент'), 'ac', 'sg')).toBe(casillaNominal(n('студент'), 'gen', 'sg'));
    expect(casillaNominal(n('стол'), 'ac', 'sg')).toBe('стол');
    expect(casillaNominal(n('стол'), 'ac', 'pl')).toBe('столы');
    expect(casillaNominal(n('студент'), 'ac', 'pl')).toBe('студентов');
  });

  it('la 3.ª declinación NO sigue la animacidad en singular: es siempre el nominativo', () => {
    expect(casillaNominal(n('дверь'), 'ac', 'sg')).toBe('дверь');
  });

  it('конь y дверь acaban igual y son declinaciones distintas', () => {
    expect(declinacionDe(n('конь'))).toBe(2);
    expect(declinacionDe(n('дверь'))).toBe(3);
    expect(temaDe(n('конь'))).toBe('кон');
    expect(temaDe(n('дверь'))).toBe('двер');
  });
});

describe('el pasado concuerda en género y no en persona', () => {
  it('читать da читал/читала/читали', () => {
    expect(pasado(v('читать'), 'm')).toBe('читал');
    expect(pasado(v('читать'), 'f')).toBe('читала');
    expect(pasado(v('читать'), 'pl')).toBe('читали');
  });

  it('идти no acaba en -ть: la regla devuelve null y el dato es obligatorio (шёл/шла)', () => {
    expect(pasado({ ...v('идти'), pasadoIrreg: undefined }, 'm')).toBeNull();
    expect(pasado(v('идти'), 'm')).toBe('шёл');
    expect(pasado(v('идти'), 'f')).toBe('шла');
  });

  it('el reflexivo alterna -ся/-сь según vocal o consonante', () => {
    expect(presente(v('учиться'), '1sg')).toBe('учусь');
    expect(presente(v('учиться'), '2sg')).toBe('учишься');
    expect(pasado(v('учиться'), 'm')).toBe('учился');
  });
});

describe('el lexicón declara lo que no se deriva', () => {
  it('toda alternancia lleva su motivo escrito: cero avisos mudos', () => {
    expect(invariantesVerbales(VERBOS_A1).filter((a) => a.clase.startsWith('alternancia'))).toEqual([]);
  });

  it('ninguna entrada lleva tilde de acento en un campo de dato', () => {
    for (const e of NOMBRES_A1) {
      for (const campo of [e.lema, e.nomPlIrreg, e.genPlIrreg, e.temaPl, e.temaOblicuo, e.locativo2?.forma]) {
        if (campo) expect(campo).not.toMatch(/[̀́]/);
      }
    }
  });

  it('un locativo2 que coincida con el prepositivo regular se denuncia como inútil', () => {
    const falso: EntradaNominal = { ...n('стол'), locativo2: { forma: 'столе', regente: 'в' } };
    expect(invariantesNominales([falso]).map((a) => a.clase)).toContain('locativo2-inutil');
  });
});
