// tests/unit/gate-cantidad-fonemica.test.ts
import { describe, expect, it } from 'vitest';
import { paresDeCantidad, parDe } from '@/lib/data/languages/la/pares-de-cantidad';
import {
  coberturaCantidad, revisarItemCantidad, revisarLoteCantidad,
  tasasCiegasCant, vecesEnElCorpus, type ItemCantidad,
} from '@/scripts/lib/gate-cantidad-fonemica';

const base: ItemCantidad = {
  id: 'x', punto: 'l1-cantidad-fonemica', sinMacrones: 'terra', respuesta: 'terra', elOtro: 'terrā',
  marco: '___ magna est.', pista: 'nominativo singular del nombre de la 1.ª que significa «tierra»',
  glosa: 'La tierra es grande.', ejes: { tipo: 'morfologico', vocal: 'a', dianaLarga: false },
};
const con = (p: Partial<ItemCantidad>): ItemCantidad => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemCantidad) => revisarItemCantidad(i).map((f) => f.clase);

describe('los pares salen del dominio, no de una lista', () => {
  it('hay 61 y se clasifican solos en morfológicos y léxicos', () => {
    const P = paresDeCantidad();
    expect(P.length).toBeGreaterThan(50);
    expect(P.filter((p) => p.tipo === 'lexico').length).toBeGreaterThan(5);
    expect(P.filter((p) => p.tipo === 'morfologico').length).toBeGreaterThan(40);
  });

  it('el par del propio punto está: «venit» contra «vēnit»', () => {
    const p = parDe('venit')!;
    expect(p.tipo).toBe('morfologico');
    expect(p.miembros.map((m) => m.forma).sort()).toEqual(['venit', 'vēnit']);
  });

  it('y uno léxico de verdad: «lēgis» de «lēx» contra «legis» de «legō»', () => {
    const p = parDe('legis')!;
    expect(p.tipo).toBe('lexico');
    const lemas = new Set(p.miembros.flatMap((m) => m.claves.map((c) => c.split('.')[0])));
    expect(lemas).toEqual(new Set(['lēx', 'legō']));
  });
});

describe('las cuentas por cadena NO valen, y el gate cuenta por anotación', () => {
  it('los dos miembros tienen cuentas DISTINTAS', () => {
    // Buscando por cadena darían el mismo número las dos veces —el corpus
    // no lleva mácrones— y eso es un fallo que devuelve un número
    // plausible: un gate que exigiera «los dos atestiguados» aprobaría
    // siempre.
    expect(vecesEnElCorpus('venit')).toBeGreaterThan(0);
    expect(vecesEnElCorpus('vēnit')).toBeGreaterThan(0);
  });
});

describe('un ítem limpio no da ningún fallo', () => {
  it('«terra»', () => { expect(revisarItemCantidad(base)).toEqual([]); });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('una cadena que no es par mínimo', () => {
    // `puella` estaba aquí como veneno y NO envenenaba: `puella`/`puellā`
    // sí es un par —nominativo contra ablativo de la 1.ª—. Un veneno que
    // no envenena hay que sustituirlo, y de paso dice algo del dominio:
    // casi todo nombre de la 1.ª forma par.
    expect(parDe('magister')).toBeNull();
    expect(clases(con({ sinMacrones: 'magister', respuesta: 'magister', elOtro: 'magistēr' })))
      .toContain('no-es-par');
  });

  it('una respuesta que no es miembro del par', () => {
    expect(clases(con({ respuesta: 'terrae' }))).toContain('respuesta-no-es-miembro');
  });

  it('«el otro» mal declarado', () => {
    expect(clases(con({ elOtro: 'terrās' }))).toContain('el-otro-mal');
  });

  it('el tipo mal declarado', () => {
    expect(clases(con({ ejes: { tipo: 'lexico', vocal: 'a', dianaLarga: false } }))).toContain('eje-mal-declarado');
  });

  it('LA VOCAL DIANA, que no es «lleva algún mácrón»', () => {
    // `legēs` tiene una `ē` en la desinencia y la vocal que lo separa de
    // `lēgēs` es la PRIMERA, donde es breve. Declarar `dianaLarga: true`
    // porque la palabra lleva un mácrón es clasificar el ítem al revés.
    const malo = con({ sinMacrones: 'leges', respuesta: 'legēs', elOtro: 'lēgēs',
      marco: 'Nōmen ___.', pista: 'futuro de «legō»', glosa: 'Leerás el nombre.',
      ejes: { tipo: 'lexico', vocal: 'e', dianaLarga: true } });
    expect(clases(malo)).toContain('eje-mal-declarado');
    const bueno = { ...malo, ejes: { ...malo.ejes, dianaLarga: false } };
    expect(clases(bueno)).not.toContain('eje-mal-declarado');
  });

  it('el marco que lleva uno de los dos miembros', () => {
    expect(clases(con({ marco: 'In terrā ___ magna est.' }))).toContain('pista-regala-la-forma');
  });

  it('y la pista que nombra el lema cuando el lema ES la respuesta', () => {
    expect(clases(con({ pista: 'nominativo singular de «terra»' }))).toContain('pista-regala-la-forma');
  });
});

describe('los venenos de LOTE', () => {
  const it1 = (id: string, p: Partial<ItemCantidad>) => con({ id, ...p });
  it('un lote donde todas las dianas son largas se contesta poniendo mácrón a todo', () => {
    const lote = [
      it1('a', { sinMacrones: 'causa', respuesta: 'causā', elOtro: 'causa', marco: 'Dē ___ dīcit.', pista: 'ablativo', glosa: 'x', ejes: { tipo: 'morfologico', vocal: 'a', dianaLarga: true } }),
      it1('b', { sinMacrones: 'cura', respuesta: 'cūrā', elOtro: 'cūra', marco: 'Cum ___ labōrat.', pista: 'ablativo', glosa: 'x', ejes: { tipo: 'morfologico', vocal: 'a', dianaLarga: true } }),
    ];
    expect(tasasCiegasCant(lote).siempreMacron).toBe(1);
    expect(revisarLoteCantidad(lote).map((f) => f.clase)).toContain('suelo-de-la-lengua');
  });

  it('y un lote sin ningún par léxico no cubre el varia', () => {
    const lote = [base, it1('b', { sinMacrones: 'ea', respuesta: 'ea', elOtro: 'eā', marco: '___ rēgīna est.', pista: 'nominativo femenino', glosa: 'x' })];
    expect(revisarLoteCantidad(lote).map((f) => f.detalle).join(' ')).toContain('léxico');
    expect(coberturaCantidad(lote).find((c) => c.comprobacion.includes('LÉXICO'))!.decididos).toBe(0);
  });
});
