// La invariante de la cópula `este`/`e`, vista EN ROJO.
//
// Existe donde existe —en el gate y no en el comparador— porque
// `answersMatchCard` es ciego a la lengua y sirve a cuatro. Los dos
// hechos que lo decidieron están aquí como test, no como comentario:
// en portugués `este` es un demostrativo con un ítem publicado cuya
// respuesta ES `este`, y en rumano la dirección `e`→`este` fabrica
// `*mi-este` porque en JS el guion es frontera de palabra.
import { describe, it, expect } from 'vitest';
import { revisarCopula, copulaSuelta, PUNTOS_COPULA_LIBRE, PUNTOS_COPULA_EXAMINADA } from '../../scripts/lib/copula-ro';
import { answersMatchCard } from '../../lib/exercises/normalize';

describe('por qué NO va en el comparador', () => {
  it('en portugués «e» es la conjunción y «este» el demostrativo: hoy NO se confunden', () => {
    expect(answersMatchCard('e', 'este')).toBe(false);
  });

  it('el guion es frontera de palabra en JS, y por ahí salía *mi-este', () => {
    expect('Mi-e foame'.replace(/\be\b/g, 'este')).toBe('Mi-este foame');
  });
});

describe('copulaSuelta', () => {
  it('la cópula amalgamada con clítico NO es cópula suelta', () => {
    expect(copulaSuelta('Mi-e foame')).toBeNull();
    expect(copulaSuelta('nu-i nimic')).toBeNull();
  });

  it('la cópula libre sí se ve, en las dos formas', () => {
    expect(copulaSuelta('Îmi este frig')).toBe('este');
    expect(copulaSuelta('Casa e mare')).toBe('e');
  });
});

describe('revisarCopula — EN ROJO', () => {
  it('ROJO: una clave con «este» suelto y sin su contraparte', () => {
    const r = revisarCopula([{ p: 'r6-pe-regla-operativa', buena: 'Fata pe care o aștept este sora mea.' }]);
    expect(r).toHaveLength(1);
    expect(r[0]).toContain('Fata pe care o aștept e sora mea.');
  });

  it('ROJO: y con «e» suelto, en la dirección contraria', () => {
    const r = revisarCopula([{ p: 'r4-preposicion-caida-articulo', buena: 'Sora mea e la școală.' }]);
    expect(r[0]).toContain('Sora mea este la școală.');
  });

  it('VERDE: declarada la contraparte, no dice nada', () => {
    expect(revisarCopula([{
      p: 'r6-pe-regla-operativa',
      buena: 'Fata pe care o aștept este sora mea.',
      alt: ['Fata pe care o aștept e sora mea.'],
    }])).toEqual([]);
  });

  it('EXENTO: el dativo experimentante no se marca — la amalgama ES el contenido', () => {
    expect(revisarCopula([
      { p: 'r3-dativo-experimentante', buena: 'Mi-e foame, mergem să mâncăm?' },
      { p: 'r3-dativo-experimentante', buena: 'Îmi este frig aici, închide fereastra.' },
    ])).toEqual([]);
  });

  it('FALLA CERRADO: un punto que no declara la alternancia libre no se toca', () => {
    // Es la polaridad de allowlist: la regla se declara donde SE APLICA.
    // Un punto nuevo NO hereda la normalización en silencio.
    expect(PUNTOS_COPULA_LIBRE.has('r10-tres-registros')).toBe(false);
    expect(revisarCopula([{ p: 'r10-tres-registros', buena: 'Prezenta cerere este întemeiată.' }])).toEqual([]);
  });

  it('los puntos donde la cópula ES contenido están escritos con su motivo', () => {
    for (const id of Object.keys(PUNTOS_COPULA_EXAMINADA)) {
      expect(PUNTOS_COPULA_LIBRE.has(id)).toBe(false);
      expect(PUNTOS_COPULA_EXAMINADA[id]!.length).toBeGreaterThan(20);
    }
  });

  it('un punto fuera del inventario se denuncia, no se ignora', () => {
    expect(revisarCopula([{ p: 'r99-inventado', buena: 'Casa e mare.' }])[0]).toContain('fuera del inventario');
  });
});
