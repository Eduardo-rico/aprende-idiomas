// tests/unit/paradigma-adj-ru.test.ts
//
// Lo que prueba y lo que NO: que la máquina produce las 24 casillas que el
// corpus atestigua, que los invariantes disparan, y que las DOS filas dan
// las CUATRO clases de la gramática escolar. **No prueba que las reglas sean
// correctas** —eso no lo puede probar un test escrito por quien escribió las
// reglas—: lo hace `check-paradigma-ru.ts` contra 7,7 M de palabras.
//
// Los números son cuentas reales del corpus, con `buscar()` y límite de
// palabra unicode a los dos lados. Van escritos porque una aserción sin su
// medida es una afirmación.
import { describe, it, expect } from 'vitest';
import {
  casillaAdj, paradigmaAdj, concordar, temaAdj, invariantesAdjetivales,
  casillasQueDiscriminanGenero, sincretismosAdj, CASOS_ADJ, FORMAS_ADJ,
  type EntradaAdjetival,
} from '../../lib/data/languages/ru/paradigma-adj-ru';
import { ADJETIVOS_A1, NOMBRES_A1 } from '../../lib/data/languages/ru/lexicon-a1';
import { revisarOrtografiaRu } from '../../lib/lang/ortografia-ru';

const a = (lema: string) => ADJETIVOS_A1.find((x) => x.lema === lema)!;
const n = (lema: string) => NOMBRES_A1.find((x) => x.lema === lema)!;

describe('DOS FILAS PARA LAS CUATRO CLASES DE LA GRAMÁTICA ESCOLAR', () => {
  // La gramática rusa lista cuatro declinaciones adjetivales; la máquina
  // tiene dos filas y produce las cuatro sin una excepción declarada,
  // porque las «mixtas» son la dura pasada por `ortografiar`.
  it.each([
    // lema, m.nom, m.gen, m.instr, m.prep, f.nom, f.gen, n.nom, pl.nom
    ['новый',    'новый',    'нового',    'новым',    'новом',    'новая',    'новой',    'новое',    'новые'],
    ['молодой',  'молодой',  'молодого',  'молодым',  'молодом',  'молодая',  'молодой',  'молодое',  'молодые'],
    ['синий',    'синий',    'синего',    'синим',    'синем',    'синяя',    'синей',    'синее',    'синие'],
    ['русский',  'русский',  'русского',  'русским',  'русском',  'русская',  'русской',  'русское',  'русские'],
    ['хороший',  'хороший',  'хорошего',  'хорошим',  'хорошем',  'хорошая',  'хорошей',  'хорошее',  'хорошие'],
    ['большой',  'большой',  'большого',  'большим',  'большом',  'большая',  'большой',  'большое',  'большие'],
  ])('%s declina entero', (lema, mnom, mgen, minstr, mprep, fnom, fgen, nnom, plnom) => {
    const e = a(lema);
    expect(casillaAdj(e, 'm', 'nom')).toBe(mnom);
    expect(casillaAdj(e, 'm', 'gen')).toBe(mgen);
    expect(casillaAdj(e, 'm', 'instr')).toBe(minstr);
    expect(casillaAdj(e, 'm', 'prep')).toBe(mprep);
    expect(casillaAdj(e, 'f', 'nom')).toBe(fnom);
    expect(casillaAdj(e, 'f', 'gen')).toBe(fgen);
    expect(casillaAdj(e, 'n', 'nom')).toBe(nnom);
    expect(casillaAdj(e, 'pl', 'nom')).toBe(plnom);
  });

  it('EL PAR QUE PRUEBA QUE EL ACENTO ES DATO: хороший y большой sólo difieren en un bit', () => {
    // Mismo tema sibilante, misma clase, y OCHO casillas distintas. Con uno
    // solo de los dos, «sibilante ⇒ siempre -его» acertaría en todo el
    // lexicón: es el aspecto exacto de una regla a la que le falta una mitad.
    expect(temaAdj(a('хороший'))).toBe('хорош');
    expect(temaAdj(a('большой'))).toBe('больш');
    expect(a('хороший').desinenciaTonica).toBe(false);
    expect(a('большой').desinenciaTonica).toBe(true);
    const pares: [string, string, string][] = [
      ['m.gen',   'хорошего', 'большого'],   // 415 · 368
      ['m.dat',   'хорошему', 'большому'],   //  37 ·  94
      ['m.prep',  'хорошем',  'большом'],    //  89 · 264
      ['f.gen',   'хорошей',  'большой'],    // 125 · 1684
      ['n.nom',   'хорошее',  'большое'],    // 342 · 478
    ];
    for (const [celda, bueno, grande] of pares) {
      const [f, c] = celda.split('.') as ['m' | 'f' | 'n', 'gen' | 'dat' | 'prep' | 'nom'];
      expect(casillaAdj(a('хороший'), f, c)).toBe(bueno);
      expect(casillaAdj(a('большой'), f, c)).toBe(grande);
    }
    // Y la casilla donde el acento NO cambia nada, porque la ы→и es de la
    // sibilante y no del acento: las dos dan -им.
    expect(casillaAdj(a('хороший'), 'm', 'instr')).toBe('хорошим');
    expect(casillaAdj(a('большой'), 'm', 'instr')).toBe('большим');
  });

  it('русский NO es una tercera clase: la /o/ no alterna porque к no es sibilante', () => {
    // Es la mitad que se puede escribir mal con facilidad: la regla velar
    // toca la `ы` y NO la /o/. Si alguien metiera `к` en la regla de la /o/
    // saldría `*русскего`, que no existe (0 apariciones).
    expect(casillaAdj(a('русский'), 'm', 'gen')).toBe('русского');   // 397
    expect(casillaAdj(a('русский'), 'm', 'prep')).toBe('русском');   //  97
    expect(casillaAdj(a('русский'), 'm', 'nom')).toBe('русский');    // 519, la ы→и sí
  });

  it('ninguna casilla de ningún lema viola la ortografía', () => {
    for (const e of ADJETIVOS_A1) {
      for (const f of FORMAS_ADJ) {
        for (const c of CASOS_ADJ) {
          const x = casillaAdj(e, f, c, { animado: false });
          if (!x) continue;
          expect(revisarOrtografiaRu(x), `${e.lema} ${f}.${c} = ${x}`).toEqual([]);
        }
      }
    }
  });
});

describe('EL ACUSATIVO EXIGE LA ANIMACIDAD, como el prepositivo exige el regente', () => {
  it('sin animacidad el acusativo masculino y el plural devuelven null, no una de las dos', () => {
    expect(casillaAdj(a('новый'), 'm', 'ac')).toBeNull();
    expect(casillaAdj(a('новый'), 'pl', 'ac')).toBeNull();
    // Y el femenino y el neutro sí tienen forma propia: no dependen de nada.
    expect(casillaAdj(a('новый'), 'f', 'ac')).toBe('новую');
    expect(casillaAdj(a('новый'), 'n', 'ac')).toBe('новое');
  });

  it('la animacidad la trae el SUSTANTIVO y no el llamador: concordar() la lee de la entrada', () => {
    // вижу нового студента (animado) frente a вижу новый стол (inanimado).
    expect(concordar(a('новый'), n('студент'), 'ac', 'sg')).toBe('нового');
    expect(concordar(a('новый'), n('стол'), 'ac', 'sg')).toBe('новый');
    // Y en plural igual, con la misma forma para los tres géneros.
    expect(concordar(a('новый'), n('студент'), 'ac', 'pl')).toBe('новых');
    expect(concordar(a('новый'), n('стол'), 'ac', 'pl')).toBe('новые');
  });

  it('concordar() resuelve los DOS paradigmas: el género sale del nombre', () => {
    expect(concordar(a('большой'), n('книга'), 'nom', 'sg')).toBe('большая');
    expect(concordar(a('большой'), n('окно'), 'nom', 'sg')).toBe('большое');
    expect(concordar(a('большой'), n('стол'), 'nom', 'sg')).toBe('большой');
    // La 3.ª declinación es femenina y el adjetivo no la distingue de la 1.ª:
    // el adjetivo concuerda con el GÉNERO, no con la declinación.
    expect(concordar(a('большой'), n('дверь'), 'instr', 'sg')).toBe('большой');
  });
});

describe('LA ATRIBUCIÓN: qué casilla puede medir el género, CALCULADA', () => {
  it('sólo el nominativo y el acusativo distinguen los tres géneros — DOS de seis casos', () => {
    // ⚠ Las dos prosas que enunciaban esto nombraban cada una la mitad. El
    // inventario decía «el instrumental y el prepositivo de masculino y
    // neutro coinciden», que es cierto e incompleto: coinciden TAMBIÉN el
    // genitivo (нового) y el dativo (новому). Y la cabecera de la máquina
    // decía «4 de 18 casillas», escrito antes de correrlo. Son dos de seis.
    for (const e of ADJETIVOS_A1) {
      expect(casillasQueDiscriminanGenero(e), e.lema).toEqual(['nom', 'ac']);
    }
  });

  it('y los cuatro casos oblicuos son m=n en los seis lemas', () => {
    for (const e of ADJETIVOS_A1) {
      for (const c of ['gen', 'dat', 'instr', 'prep'] as const) {
        expect(casillaAdj(e, 'm', c), `${e.lema} ${c}`).toBe(casillaAdj(e, 'n', c));
      }
    }
  });

  it('el PLURAL no distingue género en ninguna de sus seis casillas', () => {
    // No hay nada que comparar: el plural adjetival tiene UNA forma por
    // caso. Lo que el test fija es que la máquina no ofrezca tres.
    for (const e of ADJETIVOS_A1) {
      expect(Object.keys(paradigmaAdj(e).pl).length).toBeGreaterThan(0);
      expect(casillasQueDiscriminanGenero(e)).not.toContain('instr');
    }
  });

  it('EL SINCRETISMO DE LOS LEMAS TÓNICOS: большой son SEIS casillas con una forma', () => {
    // Y ninguna de las dos prosas lo nombraba. En большой y молодой el
    // nominativo masculino es homógrafo de las cuatro casillas oblicuas del
    // femenino, así que un ítem de femenino oblicuo con un lema tónico es
    // ambiguo con el masculino nominativo.
    const grupo = sincretismosAdj(a('большой')).find((x) => x.forma === 'большой')!;
    expect(grupo.casillas.sort()).toEqual(
      ['f.dat', 'f.gen', 'f.instr', 'f.prep', 'm.ac', 'm.nom'].sort(),
    );
    // Y con un lema átono son sólo dos: el femenino oblicuo tiene su forma.
    const atono = sincretismosAdj(a('новый')).find((x) => x.forma === 'новый')!;
    expect(atono.casillas.sort()).toEqual(['m.ac', 'm.nom']);
  });
});

describe('LOS INVARIANTES, vistos en rojo y con su control negativo', () => {
  it('el lexicón entero no deja un solo aviso', () => {
    expect(invariantesAdjetivales(ADJETIVOS_A1)).toEqual([]);
  });

  it('un `desinenciaTonica` mal declarado se caza SIN corpus: el nominativo no es el lema', () => {
    // Es el invariante más barato del fichero y cierra el círculo entre el
    // dato y la regla. `новый` con el acento declarado tónico da `*новой`.
    const mal: EntradaAdjetival = { lema: 'новый', tema: 'duro', desinenciaTonica: true, glosa: 'nuevo' };
    expect(casillaAdj(mal, 'm', 'nom')).toBe('новой');
    expect(invariantesAdjetivales([mal]).map((x) => x.clase)).toContain('nominativo-no-es-el-lema');
  });

  it('CONTROL NEGATIVO: el mismo lema bien declarado no da ningún aviso', () => {
    const bien: EntradaAdjetival = { lema: 'новый', tema: 'duro', desinenciaTonica: false, glosa: 'nuevo' };
    expect(invariantesAdjetivales([bien])).toEqual([]);
  });

  it('el adjetivo blando con desinencia tónica NO EXISTE, y se denuncia', () => {
    // Es la combinación que nadie prueba: las clases en -ий son todas de
    // tema acentuado (синий, последний, летний, ранний).
    const imposible: EntradaAdjetival = { lema: 'синий', tema: 'blando', desinenciaTonica: true, glosa: 'azul' };
    expect(invariantesAdjetivales([imposible]).map((x) => x.clase)).toContain('blando-tonico-no-existe');
  });
});

describe('LO QUE ESTA MÁQUINA NO HACE, fijado en test para que no se olvide', () => {
  it('no produce formas CORTAS, y su ausencia no es un hueco silencioso', () => {
    // `умный → умён` mete una ё que no está en el lema y `больной → болен`
    // una е: la vocal de apoyo es LÉXICA. Un generador que produjera `*умн`
    // sería el que devuelve una forma plausible donde no sabe. Y su punto
    // (`u6-adjetivo-corto`) es B2 y mide la FRONTERA del atajo ser/estar, no
    // la forma, así que la máquina no le adelantaría ni un ítem.
    expect(Object.keys(casillaAdj)).not.toContain('corta');
    // Las 24 casillas son las largas, y son 22 sin los dos acusativos que
    // dependen de la animacidad.
    const t = paradigmaAdj(a('новый'));
    const celdas = FORMAS_ADJ.flatMap((f) => Object.keys(t[f]));
    expect(celdas.length).toBe(22);
  });
});
