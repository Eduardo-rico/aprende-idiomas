// tests/unit/lote-la-2a.test.ts — el lote del artículo, y el primer eje de TRES.
import { describe, it, expect } from 'vitest';
import { revisarLoteA, revisarArticulo, tasasCiegasA, coberturaArticulo, TECHO_A,
         rutaDefinido, rutaIndefinido, type ItemArticulo } from '../../scripts/lib/gate-articulo';
import { LOTE_SIN_ARTICULO as LOTE } from '../../lib/data/languages/la/lotes/l2-sin-articulo';
import { contrastarConPotencia, revisarComposiciones } from '../../scripts/lib/composiciones';
import { revisarCantidad } from '../../lib/data/languages/la/cantidad';
import { separablePorPosicion } from '../../scripts/lib/atajos';
import { patronDe } from '../../scripts/lib/orden-publicado';
import { PISO_LA } from '../../lib/data/languages/la/inventario-puntos';

describe('EL TECHO DE UN EJE DE TRES VALORES', () => {
  it('es 1/3, no 1/2 — la identidad generalizada', () => {
    // Los cinco formatos anteriores se decidían entre DOS opciones y cada
    // ruta ciega se llevaba la mitad. Con tres, cada una se lleva un
    // tercio: las tres parten el lote y sus tasas suman 1. Dejar el techo
    // en 1/2 habría aprobado un lote donde «pon siempre el/la» acierta la
    // mitad de los ítems.
    expect(TECHO_A).toBeCloseTo(1 / 3, 6);
    const t = tasasCiegasA(LOTE);
    expect(t.siempreDefinido + t.siempreIndefinido + t.siempreNinguno).toBeCloseTo(1, 6);
    for (const v of Object.values(t)) expect(v).toBeLessThanOrEqual(TECHO_A + 1e-9);
  });

  it('CAZA el lote donde una de las tres se lleva más de un tercio', () => {
    const sesgado = LOTE.filter((i) => i.ejes.valor !== 'ninguno');
    expect(revisarLoteA(sesgado).map((x) => x.clase)).toContain('estrategia-ciega');
  });
});

describe('el lote del artículo', () => {
  it('pasa el gate entero', () => expect(revisarLoteA(LOTE)).toEqual([]));

  it('las tres salidas del eje están representadas, como pide el `varia`', () => {
    for (const v of ['definido', 'indefinido', 'ninguno'] as const) {
      expect(LOTE.filter((i) => i.ejes.valor === v).length, v).toBe(4);
    }
  });

  it('la ruta ciega no falla por concordancia, falla por ELEGIR', () => {
    // Quien pone siempre el definido escribe «Los», no «El»: si la
    // simulación se equivocara de forma, la tasa bajaría por la razón
    // equivocada y el lote parecería más limpio de lo que es.
    const plural = LOTE.find((i) => i.ejes.num === 'pl' && i.ejes.gen === 'f')!;
    expect(rutaDefinido(plural)).toBe('Las');
    expect(rutaIndefinido(plural)).toBe('Unas');
  });

  it('CAZA la respuesta que no cuadra con su eje declarado', () => {
    const malo = { ...LOTE.find((i) => i.ejes.valor === 'ninguno')!, respuesta: 'Un' } as ItemArticulo;
    expect(revisarArticulo(malo).map((x) => x.clase)).toContain('respuesta-no-cuadra');
  });

  it('el orden publicado no predice si lleva artículo', () => {
    expect(separablePorPosicion(patronDe(LOTE, (i) => i.ejes.valor !== 'ninguno'))).toBeNull();
  });

  it('el latín pasa la cantidad, incluido `sum`', () => {
    for (const i of LOTE) expect(revisarCantidad(i.latin), i.id).toEqual([]);
    // `est`, `sunt` y `erat` sólo pasan porque `sum` entró como irregular
    // declarado: ninguna regla los produce.
    expect(revisarCantidad('est sunt erat erit sumus')).toEqual([]);
    expect(revisarCantidad('esbam').map((x) => x.clase)).toContain('forma-desconocida');
  });

  it('sin atajo compuesto, con potencia', () => {
    const E = [
      { nombre: 'siempre definido', responde: rutaDefinido },
      { nombre: 'siempre indefinido', responde: rutaIndefinido },
      { nombre: 'ninguno nunca', responde: () => '' },
    ];
    // SIN las dos que son la regla: «lleva est/sunt» y «el nombre ya salió».
    const P = [
      // El umbral va donde parte el lote por la mitad. Con las doce a dos
      // frases ya no separa — antes sí, porque sólo los definidos tenían
      // dos y «si es larga, definido» acertaba 8/12 con p = 0,013.
      { nombre: 'la frase es larga', vale: (i: ItemArticulo) => i.latin.length >= 44 },
      { nombre: 'es plural', vale: (i: ItemArticulo) => i.ejes.num === 'pl' },
      { nombre: 'el nombre español es femenino', vale: (i: ItemArticulo) => i.ejes.gen === 'f' },
      { nombre: 'voy por la mitad del cuaderno', vale: () => false },
    ];
    const v = contrastarConPotencia(LOTE, (i) => i.respuesta, E, { pistas: P, revisadaPor: 'sin revisar' }, 1000);
    expect(revisarComposiciones(v)).toEqual([]);
    expect(v.puedeDetectar).toBe(true);
  });

  it('pasa el piso y cada comprobación dice su denominador', () => {
    expect(LOTE.length).toBeGreaterThanOrEqual(PISO_LA('L1'));
    for (const c of coberturaArticulo(LOTE)) {
      expect(c.decididos, c.comprobacion).toBeGreaterThan(0);
      if (c.decididos < c.total) expect(c.motivoDeLosQueQuedanFuera, c.comprobacion).toBeTruthy();
    }
  });
});
