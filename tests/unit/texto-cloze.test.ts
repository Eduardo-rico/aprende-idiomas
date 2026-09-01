// Los tres casos que engañaron a tres barridos distintos.
import { describe, it, expect } from 'vitest';
import { textoAnalizable, palabrasAnalizables } from '@/scripts/lib/texto-cloze';

const item = (sentence: string, answer: string) => ({ data: { sentence, blanks: [{ answer }] } });

describe('textoAnalizable', () => {
  it('CASO 1: la respuesta vive en blanks, no en sentence', () => {
    // El barrido de «estar com» buscaba en `sentence` y daba 0 hallazgos.
    const x = item('Tu ___ com razão, fui eu que me enganei.', 'estás');
    expect(textoAnalizable(x)).not.toContain('estás');
    expect(textoAnalizable(x, { conRespuesta: true })).toContain('estás com razão');
  });

  it('CASO 2: el molde mete el infinitivo JUSTO en medio', () => {
    // Ensamblada, la frase salía «Tu estás (estar) com razão» y ningún
    // patrón contiguo casaba. Volvió a dar 0.
    const x = item('Tu ___ (estar) com razão, fui eu que me enganei.', 'estás');
    expect(textoAnalizable(x, { conRespuesta: true })).toBe('Tu estás com razão, fui eu que me enganei.');
    expect(textoAnalizable(x, { conRespuesta: true })).not.toContain('(estar)');
  });

  it('CASO 3: el lema entre paréntesis es la CONVENCIÓN, no un defecto', () => {
    // El barrido del lema repetido marcó 121 ítems y 120 eran esto.
    const x = item('Naquele verão nós ___ (trabalhar) os dois no mesmo café.', 'trabalhávamos');
    expect(palabrasAnalizables(x)).not.toContain('trabalhar');
    // Y con `conMolde` sí aparece, para quien quiera analizar la convención.
    expect(textoAnalizable(x, { conMolde: true })).toContain('(trabalhar)');
  });

  it('el GUION se conserva: «vi-o» no es «vi o»', () => {
    const x = item('Eu vi o filme ontem. Eu ___ ontem.', 'vi-o');
    expect(palabrasAnalizables(x, { conRespuesta: true })).toContain('vi-o');
    expect(palabrasAnalizables(x, { conRespuesta: true })).toContain('vi');
  });

  it('el caso real que el barrido sí tenía que cazar', () => {
    // «Eu ___ falar português» con respuesta «falaria»: el molde dejó el
    // verbo escrito ADEMÁS del hueco, y eso sobrevive a la limpieza.
    const x = item('Eu ___ falar português perfeitamente se praticasse mais.', 'falaria');
    expect(palabrasAnalizables(x)).toContain('falar');
  });
});
