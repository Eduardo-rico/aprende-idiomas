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
  paradigmaNominal, ortografiar, variantesInstrSgFem,
  type EntradaNominal, type EntradaVerbal,
} from '../../lib/data/languages/ru/paradigma-ru';
import { NOMBRES_A1, VERBOS_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import { revisarOrtografiaRu } from '../../lib/lang/ortografia-ru';
import { clasificar, candidatasConYo, type Prueba } from '../../scripts/check-paradigma-ru';

const n = (lema: string) => NOMBRES_A1.find((x) => x.lema === lema)!;
const v = (lema: string) => VERBOS_A1.find((x) => x.lema === lema)!;

describe('el orden de las dos reglas: TEMA primero, ORTOGRAFÍA después', { timeout: 120_000 }, () => {
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

describe('EL CONTROL POSITIVO: ninguna forma falsa de arranque es producible', { timeout: 120_000 }, () => {
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

describe('EL SEGUNDO LOCATIVO: la firma es el invariante', { timeout: 120_000 }, () => {
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

describe('EL §4.2 RUMANO, EJECUTADO: quitarle el dato a un lema y ver qué deriva la regla sola', { timeout: 120_000 }, () => {
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

describe('LOS DOS ACENTOS, que la v0 tenía como un campo solo', { timeout: 120_000 }, () => {
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

describe('LA DUREZA DE LA DESINENCIA ES DISTINTA EN LAS DOS CONJUGACIONES', { timeout: 120_000 }, () => {
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

describe('la vocal fugaz y los temas de plural', { timeout: 120_000 }, () => {
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

describe('la animacidad y las tres declinaciones', { timeout: 120_000 }, () => {
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

describe('el pasado concuerda en género y no en persona', { timeout: 120_000 }, () => {
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

describe('el lexicón declara lo que no se deriva', { timeout: 120_000 }, () => {
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


describe('CUÁNDO UN PAR ES EVIDENCIA Y CUÁNDO ES UNA TAREA DE LECTURA', { timeout: 120_000 }, () => {
  // La v0 del gate leía «la buena sale más que el rival» como evidencia a
  // secas. Es falso: una comparación entre dos CADENAS no es una
  // comparación entre dos HIPÓTESIS SOBRE EL MISMO LEMA. El caso que lo
  // destapó salió como ROJO y no como verde, que es peor: `в полу` 12
  // contra `в поле` 428, donde los 428 son «en el campo» — el prepositivo
  // de `поле`, otro lema y además neutro.
  const par = (n: number, nRival: number, contaminado?: string): Prueba =>
    ({ lema: 'x', celda: 'c', forma: 'f', n, rival: 'r', nRival, contaminado });

  it('rival a CERO y forma atestada: evidencia limpia (кони 120 · коны 0)', () => {
    expect(clasificar(par(120, 0))).toBe('evidencia');
  });

  it('los DOS a cero: nulo vacío, nunca rojo — el corpus no trae la casilla', () => {
    expect(clasificar(par(0, 0))).toBe('nulo-vacio');
  });

  it('rival con apariciones y la buena ganando: NO es evidencia, hay que leerlo', () => {
    expect(clasificar(par(597, 1))).toBe('leer');   // книги / книгы
    expect(clasificar(par(381, 3))).toBe('leer');   // в лесу / в лесе
  });

  // ⚠ EL TESTIGO ROJO. Sin él, un clasificador que devolviera siempre
  // «leer» sería indistinguible de éste y el gate no podría suspender nada.
  it('rival que GANA y sin lectura escrita: ROJO', () => {
    expect(clasificar(par(12, 428))).toBe('rojo');
    expect(clasificar(par(5, 5))).toBe('rojo');
  });

  it('el mismo par CON la lectura declarada deja de ser rojo', () => {
    expect(clasificar(par(12, 428, 'los 428 son el prepositivo de поле, otro lema'))).toBe('leer');
  });

  it('las tres lecturas que el lexicón declara hoy están escritas, no supuestas', () => {
    expect(n('книга').lecturaRival?.['nom.pl']).toMatch(/1 vez/);
    expect(n('лес').lecturaRival?.locativo2).toMatch(/о лесе 2/);
    expect(n('пол').lecturaRival?.locativo2).toMatch(/поле «campo»/);
  });
});

// ── EL DETECTOR DE LA Ё, CON SU TESTIGO ROJO Y SU CONTROL NEGATIVO ────
//
// ⚠ LA CLASE: LA NORMALIZACIÓN NO FALLA, APRUEBA. `contar()` funde las dos
// grafías de la ё, y funde BIEN: el corpus es bimodal por edición y buscar
// `сестёр` a secas se deja el 90 %. El defecto fue usar esa misma función
// para una pregunta cuya respuesta **es** la distinción que ella borra.
// Resultado: dos errores vivos y publicados, los dos en verde en todas las
// comprobaciones. Es la cuarta vez que el proyecto paga esta forma —en
// rumano fueron el guion de la ênclise, el acento de la crase y la coma de
// la adversativa— y por eso el detector es una FUNCIÓN APARTE con el nombre
// puesto, no una bandera que se olvida de pasar.
describe('el detector de la ё: en rojo primero', { timeout: 120_000 }, () => {
  // Los dos errores REALES tal como estaban publicados. Éste es el testigo:
  // si el detector no los caza, no sirve.
  it('caza *днем cuando la lengua escribe днём (52 con ё · 428 sin)', () => {
    const c = candidatasConYo('днем');
    expect(c.map((x) => x.forma)).toContain('днём');
    expect(c.find((x) => x.forma === 'днём')!.n).toBeGreaterThan(0);
  });

  it.each(['сестрам', 'сестрами', 'сестрах'])('caza *%s cuando el tema es сёстр-', (mala) => {
    const c = candidatasConYo(mala);
    expect(c.map((x) => x.forma)).toContain(mala.replace('се', 'сё'));
  });

  // ⚠ EL CONTROL NEGATIVO. Un detector que marca todo también marca los dos
  // de arriba, y su rojo es idéntico al de uno que funciona. Un dato
  // correcto tiene que dar CERO.
  it.each(['столе', 'столом', 'дне', 'дня', 'книги', 'читает', 'говорите', 'месте'])(
    'la forma correcta «%s» no dispara nada', (buena) => {
      expect(candidatasConYo(buena)).toEqual([]);
    });

  it('una forma que YA lleva ё no se examina: no hay nada que preguntar', () => {
    expect(candidatasConYo('днём')).toEqual([]);
    expect(candidatasConYo('сёстрам')).toEqual([]);
  });

  it('y el lexicón ya no produce ninguna de las cuatro formas malas', () => {
    expect(casillaNominal(n('день'), 'instr', 'sg')).toBe('днём');
    expect(casillaNominal(n('сестра'), 'dat', 'pl')).toBe('сёстрам');
    expect(casillaNominal(n('сестра'), 'instr', 'pl')).toBe('сёстрами');
    expect(casillaNominal(n('сестра'), 'prep', 'pl')).toBe('сёстрах');
  });

  // Las cuatro señales que NO son errores llevan su lectura escrita en el
  // lexicón, con el mismo criterio que los rivales: una señal leída es un
  // hecho sabido, una sin leer es lo único que tumba el lexicón.
  it('las cuatro señales que no son errores están leídas, no silenciadas', () => {
    expect(n('сестра').lecturaYo?.['gen.sg']).toMatch(/NOMINATIVO PLURAL/);
    expect(n('берег').lecturaYo?.['nom.sg']).toMatch(/беречь/);
    expect(v('мочь').lecturaYo?.['pres.2sg']).toMatch(/Leskov|живёшь/);
  });
});

// ══════════════════════════════════════════════════════════════════════
// LA /o/ DE LA DESINENCIA (2026-09-12) — la regla que `ortografiar` no
// tenía, con sus DOS ejes: el tema y el acento.
// ══════════════════════════════════════════════════════════════════════
describe('LA /o/ DE LA DESINENCIA: una regla con tres grafías y dos ejes', { timeout: 120_000 }, () => {
  // Las cuatro caras, cada una con su cuenta del corpus. Van las cuatro y
  // no una: con una sola, una regla que dijera «sibilante ⇒ siempre -ом» o
  // «blando ⇒ siempre -ём» pasaría el test entero.
  it.each([
    ['стол',     'столом',     'duro no sibilante: siempre -ом',            641],
    ['место',    'местом',     'ídem, neutro',                               60],
    ['конь',     'конём',      'blando TÓNICA: -ём',                         47],
    ['учитель',  'учителем',   'blando ÁTONA: -ем',                          68],
    ['врач',     'врачом',     'sibilante TÓNICA: -ом',                      29],
    ['товарищ',  'товарищем',  'sibilante ÁTONA: -ем',                      110],
    ['лицо',     'лицом',      'ц TÓNICA: -ом',                            1503],
    ['сердце',   'сердцем',    'ц ÁTONA: -ем',                              360],
    ['душа',     'душой',      '1.ª declinación, sibilante TÓNICA: -ой',    275],
    ['туча',     'тучей',      '1.ª declinación, sibilante ÁTONA: -ей',      17],
  ])('%s → %s (%s; corpus %i)', (lema, forma) => {
    expect(casillaNominal(n(lema), 'instr', 'sg')).toBe(forma);
  });

  it('el nominativo del neutro lo decide LA MISMA regla: сердце con е, лицо con о', () => {
    expect(casillaNominal(n('сердце'), 'nom', 'sg')).toBe('сердце');
    expect(casillaNominal(n('лицо'), 'nom', 'sg')).toBe('лицо');
    expect(casillaNominal(n('окно'), 'nom', 'sg')).toBe('окно');  // duro: siempre о
    expect(casillaNominal(n('море'), 'nom', 'sg')).toBe('море');  // blando átono: е
  });

  it('`ц` entra en la regla de la /o/ y NO en la de la ы: сердцем pero отцы es correcto', () => {
    // Las dos reglas comparten la letra y no son la misma. Tratarlas como
    // una —en cualquiera de las dos direcciones— es la media regla.
    expect(ortografiar('сердц', '%м', { clase: 'duro', tonica: false })).toBe('сердцем');
    expect(revisarOrtografiaRu('отцы')).toEqual([]);
  });

  // ── EL INVARIANTE, VISTO EN ROJO Y CON SU CONTROL NEGATIVO ────────
  it('un tema blando SIN el acento declarado no produce *днем: produce null', () => {
    const sinDato: EntradaNominal = { lema: 'конь', genero: 'm', tema: 'blando', glosa: 'caballo' };
    expect(casillaNominal(sinDato, 'instr', 'sg')).toBeNull();
    const avisos = invariantesNominales([sinDato]);
    expect(avisos.map((a) => a.clase)).toContain('o-desinencial-sin-declarar');
  });

  it('CONTROL NEGATIVO: un tema duro no sibilante NO necesita el campo y no da aviso', () => {
    const duro: EntradaNominal = { lema: 'стол', genero: 'm', tema: 'duro', glosa: 'mesa' };
    expect(casillaNominal(duro, 'instr', 'sg')).toBe('столом');
    expect(invariantesNominales([duro])).toEqual([]);
  });

  it('y el lexicón entero no deja ni un aviso de esta clase', () => {
    const avisos = invariantesNominales(NOMBRES_A1);
    expect(avisos.filter((a) => a.clase === 'o-desinencial-sin-declarar')).toEqual([]);
    // ⚠ y el 2026-09-12 sí los dejaba: дядя, деревня y неделя salieron en
    // rojo la primera vez que este invariante se corrió, tres omisiones
    // reales que ningún gate anterior podía ver porque la casilla que falta
    // desaparece de `paradigmaNominal` y el bucle de la tabla no la visita.
  });

  it('LA CASILLA QUE FALTA NO ESTÁ EN LA TABLA: por eso el invariante pregunta por nombre', () => {
    const sinDato: EntradaNominal = { lema: 'конь', genero: 'm', tema: 'blando', glosa: 'caballo' };
    // El hueco es INVISIBLE en el objeto: no hay clave `instr`.
    expect(Object.keys(paradigmaNominal(sinDato).sg)).not.toContain('instr');
    // Y aun así el invariante lo nombra. Ésa es la diferencia entre mirar
    // la salida y preguntar por las doce casillas.
    expect(invariantesNominales([sinDato]).length).toBeGreaterThan(0);
  });

  it('EL LÍMITE DEL CAMPO, fijado: lo leen DOS casillas y ningún lema del lexicón las separa', () => {
    // Si algún día un lema necesita la /o/ tónica en el nominativo y átona
    // en el instrumental (o al revés), el campo tiene que partirse en dos,
    // como `desinenciaTonica` del verbo se partió al llegar `писать`. Este
    // test no lo puede detectar solo: lo que fija es que HOY no pasa, y que
    // el día que pase habrá que mirar aquí.
    for (const e of NOMBRES_A1.filter((x) => x.genero === 'n')) {
      const nom = casillaNominal(e, 'nom', 'sg')!;
      const instr = casillaNominal(e, 'instr', 'sg')!;
      const vocalNom = /о$/.test(nom) ? 'о' : /[её]$/.test(nom) ? 'e' : '—';
      const vocalInstr = /ом$/.test(instr) ? 'о' : /[её]м$/.test(instr) ? 'e' : '—';
      expect(vocalNom, `${e.lema}: ${nom} / ${instr}`).toBe(vocalInstr);
    }
  });
});

describe('LA VARIANTE `-ою/-ею` DEL XIX: el error simétrico, medido', { timeout: 120_000 }, () => {
  it('lleva la casilla en el nombre porque en el adjetivo -ой ocupa CUATRO casillas', () => {
    // `новой` es genitivo, dativo, instrumental Y prepositivo femenino, y
    // la variante larga existe SÓLO en el instrumental: una función que
    // mirara el final de la cadena generaría tres variantes falsas de cada
    // cuatro. El nombre es lo que impide llamarla mal.
    expect(variantesInstrSgFem('рукой')).toEqual(['рукою']);
    expect(variantesInstrSgFem('тучей')).toEqual(['тучею']);
    expect(variantesInstrSgFem('землёй')).toEqual(['землёю']);
    expect(variantesInstrSgFem('столом')).toEqual([]);
    expect(variantesInstrSgFem('дверью')).toEqual([]);
  });

  it('la máquina produce la NORMA y la variante queda fuera: son dos capas distintas', () => {
    expect(casillaNominal(n('вода'), 'instr', 'sg')).toBe('водой');     // водой 381
    expect(variantesInstrSgFem('водой')).toEqual(['водою']);            // водою 153
  });

  it('la 3.ª declinación NO tiene variante, y eso acota la clase: -ью no es -ой', () => {
    // La primera versión de este test daba 13 de 16 y lo leí como un fallo
    // del generador de variantes. No lo era: los tres que faltaban son
    // `дверь`, `ночь` y `вещь`, cuyo instrumental es `-ью` y **no tiene
    // forma larga en el XIX**. El test estaba mal escrito, no la función —
    // y la clase real es «1.ª declinación», no «femenino».
    for (const lema of ['дверь', 'ночь', 'вещь']) {
      expect(variantesInstrSgFem(casillaNominal(n(lema), 'instr', 'sg')!)).toEqual([]);
    }
  });

  it('los TRECE de la 1.ª declinación tienen variante, y en ONCE está atestada', () => {
    // Medido con `check-paradigma-ru.ts`: de los 13, **11** tienen la
    // variante atestada en el corpus — norma 3.004, variante 854, el 22 %
    // del total, y de 8 % (дядя) a 50 % (страна). La proporción NO es
    // propiedad de la desinencia sino de cada palabra: `землёй` 16 frente a
    // `землею` 91, donde la variante GANA 5,7 a 1.
    const primera = NOMBRES_A1.filter((e) => declinacionDe(e) === 1);
    const conVariante = primera.filter((e) => variantesInstrSgFem(casillaNominal(e, 'instr', 'sg')!).length > 0);
    expect(primera.length).toBe(13);
    expect(conVariante.length).toBe(primera.length);
  });
});
