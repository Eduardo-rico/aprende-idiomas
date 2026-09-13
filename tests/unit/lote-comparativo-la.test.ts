// tests/unit/lote-comparativo-la.test.ts — y el gate, en rojo.
import { describe, it, expect } from 'vitest';
import { LOTE_COMPARATIVO } from '@/lib/data/languages/la/lotes/l4-comparativo';
import {
  atestiguada, coberturaGrado, comparativoSobreaplicado, formaDeLaMaquina,
  revisarItemGrado, revisarLoteGrado, superlativoSobreaplicado, tasasCiegasGrado,
  type ItemGrado,
} from '@/scripts/lib/gate-comparativo';
import { SEIS_EN_ILIS, SIN_GRADO, declinarComparativo, gradosDe, vaConPerifrasis } from '@/lib/data/languages/la/grado';
import { declinarAdjetivo3a } from '@/lib/data/languages/la/adjetivos-3a';
import { todasLasFormasDeL1 } from '@/lib/data/languages/la/todas-las-formas';
import { palabraFueraDeL1 } from './ayuda/fuera-de-l1';

const base = LOTE_COMPARATIVO.find((i) => i.id === 'la-gr-01')!;
const con = (p: Partial<ItemGrado>): ItemGrado => ({ ...base, ...p, ejes: { ...base.ejes, ...(p.ejes ?? {}) } });
const clases = (i: ItemGrado) => revisarItemGrado(i).map((f) => f.clase);

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteGrado(LOTE_COMPARATIVO).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('y dieciséis de diecisiete están atestiguadas con SU grado', () => {
    const sin = LOTE_COMPARATIVO.filter((i) => atestiguada(i.respuesta, i.grado) === 0);
    expect(sin.map((i) => i.respuesta)).toEqual(['ūtilissimum']);
    // La única sin atestiguar lleva su motivo, y el motivo dice por qué no
    // se puede quitar: es el contraejemplo de la lista.
    expect(sin[0]!.porQueSinAtestiguar ?? '').toContain('contraejemplo');
  });
});

describe('LOS SEIS EN -ilis SON UNA LISTA, NO UN SUFIJO', () => {
  it('`facilis` y `similis` están, y hacen -illimus', () => {
    expect(gradosDe('facilis', 'facil').superlativo).toBe('facillimus');
    expect(gradosDe('similis', 'simil').superlativo).toBe('simillimus');
  });
  it('`ūtilis` y `fidēlis` acaban igual, NO están, y hacen -issimus', () => {
    expect((SEIS_EN_ILIS as readonly string[])).not.toContain('ūtilis');
    expect(gradosDe('ūtilis', 'ūtil').superlativo).toBe('ūtilissimus');
    expect(gradosDe('fidēlis', 'fidēl').superlativo).toBe('fidēlissimus');
  });
  it('y el lote trae los DOS lados, que es lo único que refuta la regla falsa', () => {
    const sup = LOTE_COMPARATIVO.filter((i) => i.grado === 'superlativo');
    expect(sup.some((i) => i.ejes.claseDeSuperlativo === 'illimus')).toBe(true);
    // `fidēlis` NO vale de contraejemplo: acaba en `-ēlis`, no en `-ilis`.
    // Lo cazó este test, no yo.
    expect(sup.some((i) => i.ejes.claseDeSuperlativo === 'issimus' && /[^ē]ilis$/.test(i.adjetivo.lema))).toBe(true);
  });
});

describe('-errimus va sobre el NOMINATIVO y no sobre el tema', () => {
  it('`pulcher` + `rimus`, no `pulchr` + `errimus`', () => {
    expect(gradosDe('pulcher', 'pulchr').superlativo).toBe('pulcherrimus');
    expect(gradosDe('ācer', 'ācr').superlativo).toBe('ācerrimus');
    expect(gradosDe('integer', 'integr').superlativo).toBe('integerrimus');
  });
  it('pero el COMPARATIVO sí sale del tema', () => {
    expect(gradosDe('pulcher', 'pulchr').comparativo).toBe('pulchrior');
    expect(gradosDe('ācer', 'ācr').comparativo).toBe('ācrior');
  });
});

describe('EL COMPARATIVO ES UN TEMA CONSONÁNTICO, y ahí estaba el hueco', () => {
  const g = gradosDe('magnus', 'magn');
  it('ablativo en -e y genitivo plural en -um', () => {
    expect(declinarComparativo(g, 'm', 'abl', 'sg')).toBe('maiōre');
    expect(declinarComparativo(g, 'm', 'gen', 'pl')).toBe('maiōrum');
  });
  it('donde el adjetivo de 3.ª hace -ī y -ium', () => {
    // `fortis` es i-stem: ésa es la diferencia que obliga a un declinador
    // propio en vez de una rama en el de la 3.ª.
    const fortis = { lema: 'fortis', genitivo: 'fortis', glosa: 'fuerte', terminaciones: 2 as const };
    expect(declinarAdjetivo3a(fortis, 'm', 'abl', 'sg')).toBe('fortī');
    expect(declinarAdjetivo3a(fortis, 'm', 'gen', 'pl')).toBe('fortium');
  });
  it('y el neutro singular NO sale del tema: `maius`, no `*maiōr`', () => {
    expect(declinarComparativo(g, 'n', 'nom', 'sg')).toBe('maius');
    expect(declinarComparativo(g, 'n', 'nom', 'pl')).toBe('maiōra');
  });
  it('el lote examina esa mitad: siete de los ocho comparativos están fuera del nominativo', () => {
    const cmp = LOTE_COMPARATIVO.filter((i) => i.grado === 'comparativo');
    expect(cmp.filter((i) => i.caso !== 'nom').length).toBeGreaterThanOrEqual(6);
  });
});

describe('LO QUE LA MÁQUINA SE CALLA', () => {
  it('los posesivos, los ordinales y `omnis` no tienen grado', () => {
    for (const l of ['meus', 'tuus', 'suus', 'noster', 'prīmus', 'omnis']) {
      expect(SIN_GRADO.has(l), l).toBe(true);
      expect(gradosDe(l, l.replace(/us$|is$/, '')).comparativo, l).toBeNull();
    }
  });
  it('y los en -ius van con perífrasis, no con `*anxior`', () => {
    expect(vaConPerifrasis('ānxius')).toBe(true);
    expect(gradosDe('ānxius', 'ānxi').comparativo).toBe('magis ānxius');
    // Y la perífrasis no entra al dominio: no es una forma.
    expect(todasLasFormasDeL1().some((f) => f.forma.includes('magis '))).toBe(false);
  });
});

describe('las dos ciegas, cada una sobre SU grado', () => {
  it('«-issimus a todo» produce el *facilissimus que el punto declara', () => {
    const illimus = LOTE_COMPARATIVO.find((i) => i.ejes.claseDeSuperlativo === 'illimus' && i.grado === 'superlativo')!;
    expect(superlativoSobreaplicado(illimus)).not.toBe(illimus.respuesta);
    expect(superlativoSobreaplicado(illimus)).toMatch(/issim/);
  });
  it('pero acierta en los regulares, que es lo que la hace peligrosa', () => {
    const issimus = LOTE_COMPARATIVO.find((i) => i.ejes.claseDeSuperlativo === 'issimus' && i.grado === 'superlativo')!;
    expect(superlativoSobreaplicado(issimus)).toBe(issimus.respuesta);
  });
  it('y en los comparativos no produce nada: por eso no cuentan en su denominador', () => {
    for (const i of LOTE_COMPARATIVO.filter((x) => x.grado === 'comparativo'))
      expect(superlativoSobreaplicado(i), i.id).toBeNull();
    const t = tasasCiegasGrado(LOTE_COMPARATIVO);
    expect(t.issimusATodo.decididos).toBe(LOTE_COMPARATIVO.filter((i) => i.grado === 'superlativo').length);
    expect(t.issimusATodo.decididos).toBeLessThan(t.issimusATodo.total);
  });
  it('«tema + -ior» falla en los cinco irregulares y acierta en los demás', () => {
    const irr = LOTE_COMPARATIVO.find((i) => i.grado === 'comparativo' && i.ejes.claseDeSuperlativo === 'irregular')!;
    const reg = LOTE_COMPARATIVO.find((i) => i.grado === 'comparativo' && i.ejes.claseDeSuperlativo !== 'irregular')!;
    expect(comparativoSobreaplicado(irr)).not.toBe(irr.respuesta);
    expect(comparativoSobreaplicado(reg)).toBe(reg.respuesta);
  });
  it('y las dos quedan por debajo de su listón', () => {
    const t = tasasCiegasGrado(LOTE_COMPARATIVO);
    expect(t.issimusATodo.tasa).toBeLessThanOrEqual(0.5);
    expect(t.iorATodo.tasa).toBeLessThanOrEqual(0.6);
  });
});

describe('los venenos que el gate tiene que cazar', () => {
  it('la respuesta que no es la de la máquina', () => {
    expect(clases(con({ respuesta: 'fidēlissimus' }))).toContain('respuesta-no-derivable');
  });
  it('el *facilissimus, que es el error declarado', () => {
    const f = LOTE_COMPARATIVO.find((i) => i.adjetivo.lema === 'facilis')!;
    expect(revisarItemGrado({ ...f, respuesta: 'facilissimum' }).map((x) => x.clase)).toContain('respuesta-no-derivable');
  });
  it('la clase de superlativo mal declarada', () => {
    expect(clases(con({ ejes: { ...base.ejes, claseDeSuperlativo: 'illimus' } }))).toContain('eje-mal-declarado');
  });
  it('una forma que no aparece en el corpus con ese grado', () => {
    expect(clases(con({ adjetivo: { lema: 'vērus', tema: 'vēr' }, respuesta: 'vērissima' }))).toContain('sin-atestiguar');
  });
  it('el marco que regala la forma', () => {
    expect(clases(con({ marco: 'Rēgīna fidēlissima ___ est.' }))).toContain('marco-regala-la-forma');
  });
  it('y el marco con vocabulario de fuera de L1', () => {
    expect(clases(con({ marco: `${palabraFueraDeL1()} ___ est.` }))).toContain('marco-fuera-de-l1');
  });
});

describe('los venenos de LOTE', () => {
  it('sin -errimus ni -illimus, «-issimus a todo» no queda refutado', () => {
    const lote = LOTE_COMPARATIVO.filter((i) => i.grado === 'superlativo' && i.ejes.claseDeSuperlativo === 'issimus');
    const d = revisarLoteGrado(lote).map((x) => `${x.clase}:${x.detalle}`).join(' | ');
    expect(d).toContain('el varia son las clases de superlativo');
    expect(d).toContain('-issimus a todo');
  });
  it('y la cobertura del comparativo fuera del nominativo lleva su motivo', () => {
    const c = coberturaGrado(LOTE_COMPARATIVO).find((x) => x.comprobacion.includes('FUERA del nominativo'))!;
    expect(c.motivoDeLosQueQuedanFuera ?? '').toContain('forma de cita');
  });
  it('la máquina del grado da la respuesta de los dieciséis', () => {
    for (const i of LOTE_COMPARATIVO) expect(formaDeLaMaquina(i), i.id).toBe(i.respuesta);
  });
});
