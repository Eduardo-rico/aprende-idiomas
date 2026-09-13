// tests/unit/gate-infinitivo.test.ts
//
// EL GATE DE LOS CINCO INFINITIVOS, VISTO EN ROJO — y con los nueve
// hallazgos que sacó sobre el lote real cuando ya estaba «verde».
import { describe, expect, it } from 'vitest';
import { VERBOS_L1 } from '../../lib/data/languages/la/lexicon-l1';
import {
  infinitivoPresentePasivo, infinitivoPerfectoPasivo, infinitivoFuturoActivo,
  pasivoIngenuo, todosLosInfinitivos, PASIVO_SUPLETIVO, SIN_PASIVA,
} from '../../lib/data/languages/la/infinitivos';
import {
  coberturaInfinitivo, revisarItemInfinitivo, revisarLoteInfinitivo,
  tasasCiegasInf, type ItemInfinitivo,
} from '../../scripts/lib/gate-infinitivo';
import { palabrasDesconocidas } from '../../scripts/lib/gate-vocabulario-del-marco';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const V = (l: string) => VERBOS_L1.find((x) => x.lema === l)!;
const base: ItemInfinitivo = {
  id: 'x', punto: 'l8-infinitivo-sustantivo', verbo: V('dīcō'), tiempo: 'presente', voz: 'pasiva',
  respuesta: 'dīcī', marco: 'Nōmen ___ potest.', pista: 'infinitivo de presente, voz pasiva',
  glosa: 'El nombre puede ser dicho.', ejes: { perifrastico: false },
};
const con = (p: Partial<ItemInfinitivo>): ItemInfinitivo => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemInfinitivo) => revisarItemInfinitivo(i).map((f) => f.clase);

describe('las dos reglas del pasivo, medidas', () => {
  it('la 1.ª, la 2.ª y la 4.ª cambian la -e por -ī', () => {
    expect(infinitivoPresentePasivo(V('amō'))).toBe('amārī');
    expect(infinitivoPresentePasivo(V('videō'))).toBe('vidērī');
    expect(infinitivoPresentePasivo(V('audiō'))).toBe('audīrī');
  });

  it('la 3.ª y la mixta pierden la sílaba entera', () => {
    expect(infinitivoPresentePasivo(V('dīcō'))).toBe('dīcī');
    expect(infinitivoPresentePasivo(V('capiō'))).toBe('capī');
    // y la regla ingenua da ahí formas que no existen
    expect(pasivoIngenuo(V('dīcō'))).toBe('dīcerī');
    expect(pasivoIngenuo(V('capiō'))).toBe('caperī');
  });

  it('«faciō» no hace *facī: su pasivo es «fierī», y está medido', () => {
    expect(PASIVO_SUPLETIVO['faciō']).toBe('fierī');
    expect(infinitivoPresentePasivo(V('faciō'))).toBe('fierī');
    expect(pasivoIngenuo(V('faciō'))).toBe('facerī');   // lo que produciría una regla
  });

  it('«sum» no tiene pasiva, y va declarado en vez de tragado por un catch', () => {
    expect(SIN_PASIVA['sum']).toBeTruthy();
    expect(infinitivoPresentePasivo(V('sum'))).toBeNull();
    expect(todosLosInfinitivos(V('sum')).map((i) => i.forma)).toEqual(['esse', 'fuisse']);
  });
});

describe('los perifrásticos concuerdan en género Y CASO', () => {
  it('el caso cambia la forma, y el nominativo no vale en acusativo con infinitivo', () => {
    expect(infinitivoFuturoActivo(V('videō'), 'm', 'nom')).toBe('vīsūrus esse');
    expect(infinitivoFuturoActivo(V('videō'), 'm', 'ac')).toBe('vīsūrum esse');
    expect(infinitivoPerfectoPasivo(V('faciō'), 'n', 'nom')).toBe('factum esse');
    expect(infinitivoPerfectoPasivo(V('faciō'), 'f', 'nom')).toBe('facta esse');
  });

  it('un perifrástico sin caso declarado no tiene UNA respuesta', () => {
    expect(clases(con({
      verbo: V('faciō'), tiempo: 'perfecto', voz: 'pasiva', respuesta: 'factus esse',
      marco: 'Locus ___ dīcitur.', ejes: { perifrastico: true, genero: 'm' },
    }))).toContain('perifrastico-sin-genero');
  });
});

describe('un ítem limpio no da ningún fallo', () => {
  it('«dīcī» con su marco', () => { expect(revisarItemInfinitivo(base)).toEqual([]); });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la respuesta que no es la de la máquina', () => {
    expect(clases(con({ respuesta: 'dīcerī' }))).toContain('respuesta-no-derivable');
  });

  it('el marco con palabras que la máquina de L1 no produce', () => {
    // Los cinco que salieron de verdad en el lote ya «verde».
    for (const [marco, mala] of [
      // TODAS calculadas: `Sē`, `Vērum`, `Mīles`, `Mundus` y `scīmus`
      // caducaron, cada una en su día, al crecer el lexicón. Una lista
      // escrita a mano en un gate de vocabulario es una lista con fecha de
      // caducidad y sin aviso.
      [`${palabraFueraDeL1()} ___ potest.`, palabraFueraDeL1()],
      [`Rēgem ___ ${palabraFueraDeL1().toLowerCase()}.`, palabraFueraDeL1().toLowerCase()],
      [`Poētam ___ ${palabraFueraDeL1().toLowerCase()}.`, palabraFueraDeL1().toLowerCase()],
    ] as const) {
      expect(palabrasDesconocidas(marco), marco).toContain(mala);
      expect(clases(con({ marco })), marco).toContain('marco-fuera-de-l1');
    }
  });

  it('pero las palabras que la máquina SÍ produce pasan, incluida la pasiva', () => {
    // `dīcitur` y `vidētur` salían como desconocidas hasta que el
    // enumerador empezó a llamar a `pasivaInfectum`.
    expect(palabrasDesconocidas('Caelum ___ dīcitur.')).toEqual([]);
    expect(palabrasDesconocidas('Servus ___ vidētur.')).toEqual([]);
    expect(palabrasDesconocidas('Litterae ___ possunt.')).toEqual([]);
  });

  it('el marco con el infinitivo del lexicón dentro', () => {
    expect(clases(con({ marco: 'Nōmen dīcere et ___ potest.' }))).toContain('pista-regala-la-forma');
  });

  it('una forma que no aparece en el corpus', () => {
    expect(clases(con({ verbo: V('salūtō'), tiempo: 'perfecto', voz: 'activa', respuesta: 'salūtāvisse', marco: 'Rēgem ___ dīcunt.' })))
      .toContain('sin-atestiguar');
  });
});

describe('los venenos de LOTE', () => {
  it('un lote que no toca las cinco casillas sale rojo', () => {
    const lote = [base, con({ id: 'b', verbo: V('dūcō'), respuesta: 'dūcī', marco: 'Populus ___ potest.' })];
    const d = revisarLoteInfinitivo(lote).map((f) => f.detalle).join(' ');
    expect(d).toContain('no toca');
    expect(coberturaInfinitivo(lote).find((c) => c.comprobacion.includes('cinco casillas'))!.decididos).toBe(1);
  });

  it('un lote de pasivos de 1.ª y 2.ª deja la regla ingenua al 100 %', () => {
    const lote = [
      con({ id: 'a', verbo: V('amō'), respuesta: 'amārī', marco: 'Puella ___ potest.' }),
      con({ id: 'b', verbo: V('videō'), respuesta: 'vidērī', marco: 'Rēx ___ vult.' }),
    ];
    expect(tasasCiegasInf(lote).reglaDeLaPrimera.tasa).toBe(1);
    expect(revisarLoteInfinitivo(lote).map((f) => f.detalle).join(' ')).toContain('cambiar la -e por -ī en todos');
  });

  it('y sin «faciō» no se examina la supleción', () => {
    const lote = [base, con({ id: 'b', verbo: V('videō'), tiempo: 'presente', voz: 'activa', respuesta: 'vidēre', marco: 'Rēx ___ vult.' })];
    expect(revisarLoteInfinitivo(lote).map((f) => f.detalle).join(' ')).toContain('fierī');
  });
});
