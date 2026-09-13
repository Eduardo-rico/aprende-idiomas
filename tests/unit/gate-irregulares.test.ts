// tests/unit/gate-irregulares.test.ts
//
// EL GATE DE LOS SEIS IRREGULARES, VISTO EN ROJO.
import { describe, expect, it } from 'vitest';
import { IRREGULARES_L1 } from '../../lib/data/languages/la/irregulares';
import {
  celdaDe, coberturaIrregulares, revisarItemIrregular, revisarLoteIrregulares,
  tasasCiegasI, type ItemIrregular,
} from '../../scripts/lib/gate-irregulares';
import { regularIngenuo } from '../../scripts/lib/atestar-irregulares';

const V = (l: string) => IRREGULARES_L1.find((x) => x.lema === l)!;
const base: ItemIrregular = {
  id: 'x', punto: 'l5-irregulares', verbo: V('volō'), tiempo: 'presente', persona: '3sg',
  respuesta: 'vult', marco: 'Dominus bellum ___.', pista: '3.ª del singular, presente',
  glosa: 'El señor quiere la guerra.',
};
const con = (p: Partial<ItemIrregular>): ItemIrregular => ({ ...base, ...p });
const clases = (i: ItemIrregular) => revisarItemIrregular(i).map((f) => f.clase);

// Las afirmaciones son sobre LOS SEIS DEL PUNTO, no sobre la tabla. `dō`
// entró en `IRREGULARES_L1` el 2026-09-12 porque tres lotes publicados
// usaban `dat` y el lexicón no tenía el verbo, y no es uno de los seis.
// Escribirlas contra la tabla las hacía falsas en cuanto la tabla creciera,
// que es el defecto que este proyecto lleva persiguiendo todo el día:
// **añadir una máquina desprotege un invariante en silencio** — sólo que
// aquí no se quedó en verde, se puso en rojo, porque el invariante SÍ
// miraba lo que había crecido.
const SEIS = ['eō', 'ferō', 'volō', 'nōlō', 'mālō', 'fīō'];
const LOS_SEIS = () => IRREGULARES_L1.filter((v) => SEIS.includes(v.lema));

describe('lo que dice la atestación congelada', () => {
  it('la 1.ª del singular no refuta la regla en ninguno de los seis', () => {
    for (const v of LOS_SEIS()) expect(celdaDe(v.lema, 'presente', '1sg')!.refuta, v.lema).toBe(false);
  });

  it('ni la 3.ª del plural del presente, que en los seis acaba en -unt', () => {
    for (const v of LOS_SEIS()) {
      expect(celdaDe(v.lema, 'presente', '3pl')!.refuta, v.lema).toBe(false);
      expect(celdaDe(v.lema, 'presente', '3pl')!.forma).toMatch(/unt$/);
    }
  });

  it('el imperfecto y el futuro sólo son irregulares en «eō», y ahí lo son enteros', () => {
    for (const v of LOS_SEIS()) {
      const doce = (['imperfecto', 'futuro'] as const).flatMap((t) =>
        (['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'] as const).map((p) => celdaDe(v.lema, t, p)!.refuta));
      expect(doce.filter(Boolean).length, v.lema).toBe(v.lema === 'eō' ? 12 : 0);
    }
  });

  it('«fīō» tiene una sola celda examinable Y atestiguada, y es «fit»', () => {
    const buenas = (['1sg', '2sg', '3sg', '1pl', '2pl', '3pl'] as const)
      .map((p) => celdaDe('fīō', 'presente', p)!)
      .filter((c) => c.refuta && c.n > 0);
    expect(buenas.map((c) => c.forma)).toEqual(['fit']);
  });

  it('la cuenta de «nōn vīs» es la del bigrama, no la de «vīs»', () => {
    expect(celdaDe('nōlō', 'presente', '2sg')!.n).toBe(2);
    expect(celdaDe('volō', 'presente', '2sg')!.n).toBe(46);
  });

  it('la regla ingenua es la que enseña el punto de al lado, no un hombre de paja', () => {
    expect(regularIngenuo('volō', '2sg', 'presente')).toBe('volis');
    expect(regularIngenuo('ferō', '3sg', 'presente')).toBe('ferit');
  });
});

describe('un ítem limpio no da ningún fallo', () => {
  it('«vult» con su marco', () => { expect(revisarItemIrregular(base)).toEqual([]); });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la respuesta que no es la de la tabla', () => {
    expect(clases(con({ respuesta: 'volit' }))).toContain('respuesta-no-derivable');
  });

  it('una forma que no aparece ni una vez en el corpus', () => {
    expect(clases(con({ verbo: V('fīō'), persona: '1pl', respuesta: 'fīmus', marco: 'Virī ___.' })))
      .toContain('forma-sin-atestiguar');
  });

  it('y con motivo escrito, pasa', () => {
    expect(clases(con({
      verbo: V('fīō'), persona: '1pl', respuesta: 'fīmus', marco: 'Virī ___.',
      porQueSinAtestiguar: 'entra a propósito para enseñar que la tabla la produce y el corpus no la trae',
    }))).not.toContain('forma-sin-atestiguar');
  });

  it('una celda que se contesta con la regla general', () => {
    expect(clases(con({ persona: '1sg', respuesta: 'volō', marco: 'Bellum ___.' })))
      .toContain('celda-que-no-examina');
  });

  it('el marco con el lema dentro', () => {
    expect(clases(con({ marco: 'Dominus volō et bellum ___.' }))).toContain('pista-regala-la-forma');
  });

  it('el pronombre sujeto explícito', () => {
    expect(clases(con({ marco: 'Tū bellum ___.' }))).toContain('pronombre-explicito');
    expect(clases(con({ marco: 'Nōs bellum ___.' }))).toContain('pronombre-explicito');
  });

  it('pero no lo confunde con una palabra que lo lleva dentro', () => {
    // `\b` de JavaScript no funciona con letras acentuadas y ya mordió en
    // este repositorio: `/\bn\b/` casaba con la `n` de `nōmen`. Aquí se usa
    // `(?<!\p{L})…(?!\p{L})` con flag `u`, y esto lo comprueba.
    expect(clases(con({ marco: 'Nōster dominus bellum ___.' }))).not.toContain('pronombre-explicito');
    expect(clases(con({ marco: 'Virtūs nostra ___.' }))).not.toContain('pronombre-explicito');
  });
});

describe('los venenos de LOTE', () => {
  const it1 = (id: string, p: Partial<ItemIrregular>) => con({ id, ...p });

  it('un lote de un solo verbo no cubre el varia', () => {
    const lote = [it1('a', {}), it1('b', { persona: '1pl', respuesta: 'volumus', marco: 'Gaudium ___.' })];
    expect(revisarLoteIrregulares(lote).map((f) => f.detalle).join(' ')).toContain('1 verbo(s) de los seis');
  });

  it('un lote entero de 1.ª del singular se contesta copiando, y lo dice con ese nombre', () => {
    const lote = IRREGULARES_L1.map((v, k) => it1(`p${k}`, {
      verbo: v, persona: '1sg', respuesta: v.formas.presente['1sg']!, marco: `Rēs ___${k}.`,
    }));
    const d = revisarLoteIrregulares(lote).map((f) => f.detalle).join(' ');
    expect(d).toContain('todos los ítems son 1.ª del singular');
    expect(tasasCiegasI(lote).copiarLema.tasa).toBe(1);
    expect(tasasCiegasI(lote).conjugarComoRegular.tasa).toBe(1);
    // Y la cobertura lo dice también: ninguno refuta la regla.
    expect(coberturaIrregulares(lote).find((c) => c.comprobacion.startsWith('la celda refuta'))!.decididos).toBe(0);
  });

  it('la misma casilla dos veces es un ítem repetido', () => {
    const lote = [it1('a', {}), it1('b', { marco: 'Rēx bellum ___.' })];
    expect(revisarLoteIrregulares(lote).map((f) => f.clase)).toContain('celdas-repetidas');
  });
});
