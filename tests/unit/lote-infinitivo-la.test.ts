// tests/unit/lote-infinitivo-la.test.ts
import { describe, it, expect } from 'vitest';
import { LOTE_INFINITIVO } from '@/lib/data/languages/la/lotes/l8-infinitivo-sustantivo';
import { coberturaInfinitivo, revisarLoteInfinitivo, tasasCiegasInf } from '@/scripts/lib/gate-infinitivo';
import { pasivoIngenuo } from '@/lib/data/languages/la/infinitivos';
import { palabrasDesconocidas } from '@/scripts/lib/gate-vocabulario-del-marco';

describe('el lote pasa su gate', () => {
  it('cero fallos', () => {
    expect(revisarLoteInfinitivo(LOTE_INFINITIVO).map((f) => `${f.item} ${f.clase} ${f.detalle}`)).toEqual([]);
  });
  it('llega al piso de L1', () => {
    expect(LOTE_INFINITIVO.length).toBeGreaterThanOrEqual(8);
  });
});

describe('el varia son el tiempo y la voz: cinco casillas', () => {
  it('están las cinco', () => {
    expect(new Set(LOTE_INFINITIVO.map((i) => `${i.tiempo}.${i.voz}`)))
      .toEqual(new Set(['presente.activa', 'presente.pasiva', 'perfecto.activa', 'perfecto.pasiva', 'futuro.activa']));
  });

  it('y la función NO varía, que es lo que el punto declara invariante', () => {
    // `invarianciaJustificada`: la función sustantiva es idéntica a la
    // española. Variarla sería inventar dificultad, así que el lote mide la
    // FORMA — y eso se ve en que ningún ítem pide identificar el papel.
    for (const i of LOTE_INFINITIVO) expect(i.pista.toLowerCase()).toMatch(/infinitivo de/);
  });
});

describe('las dos reglas del pasivo, que son el trabajo del lote', () => {
  it('cuatro de los cinco pasivos refutan la regla ingenua', () => {
    const pas = LOTE_INFINITIVO.filter((i) => i.tiempo === 'presente' && i.voz === 'pasiva');
    expect(pas).toHaveLength(5);
    const refutan = pas.filter((i) => pasivoIngenuo(i.verbo) !== i.respuesta);
    expect(refutan).toHaveLength(4);
  });

  it('y el quinto está para enseñar DÓNDE sí vale, que es el error simétrico', () => {
    const vale = LOTE_INFINITIVO.filter((i) => i.tiempo === 'presente' && i.voz === 'pasiva'
      && pasivoIngenuo(i.verbo) === i.respuesta);
    expect(vale.map((i) => i.respuesta)).toEqual(['vidērī']);
  });

  it('la supleción de «faciō» está, y es la que ninguna regla produce', () => {
    const f = LOTE_INFINITIVO.find((i) => i.respuesta === 'fierī')!;
    expect(f.verbo.lema).toBe('faciō');
    expect(pasivoIngenuo(f.verbo)).toBe('facerī');
  });
});

describe('los perifrásticos recorren género y caso', () => {
  it('hay nominativo y acusativo, y un sujeto neutro', () => {
    const p = LOTE_INFINITIVO.filter((i) => i.ejes.perifrastico);
    expect(p).toHaveLength(3);
    expect(new Set(p.map((i) => i.ejes.caso))).toEqual(new Set(['nom', 'ac']));
    expect(p.some((i) => i.ejes.genero === 'n')).toBe(true);
    // y el de acusativo NO lleva la forma de nominativo
    const ac = p.find((i) => i.ejes.caso === 'ac')!;
    expect(ac.respuesta).toBe('vīsūrum esse');
  });
});

describe('el marco usa sólo palabras que la máquina de L1 produce', () => {
  it('ni una fuera, y son doce marcos', () => {
    for (const i of LOTE_INFINITIVO)
      expect(palabrasDesconocidas(i.marco, i.exentasDelMarco ?? []), `${i.id}: ${i.marco}`).toEqual([]);
  });
});

describe('las tasas ciegas, con su denominador', () => {
  it('ninguna decide el lote', () => {
    const t = tasasCiegasInf(LOTE_INFINITIVO);
    expect(t.reglaDeLaPrimera.tasa).toBeLessThanOrEqual(0.5);
    expect(t.copiarElInfinitivo.tasa).toBeLessThanOrEqual(0.5);
    // y la de la regla se lee sobre los CINCO pasivos, no sobre doce
    expect(t.reglaDeLaPrimera.decididos).toBe(5);
  });

  it('los dos ítems «gratis» están declarados y son dos', () => {
    // El presente activo se contesta copiando el infinitivo del lexicón.
    // Están porque el varia son cinco casillas; el gate mide cuánto regalan.
    const libres = LOTE_INFINITIVO.filter((i) => i.verbo.infinitivo === i.respuesta);
    expect(libres).toHaveLength(2);
    expect(coberturaInfinitivo(LOTE_INFINITIVO).find((c) => c.comprobacion.includes('cinco casillas'))!.decididos).toBe(5);
  });
});
