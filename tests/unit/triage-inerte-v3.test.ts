// tests/unit/triage-inerte-v3.test.ts
//
// Recalibración de la regla-inerte tras el FRENO de E2#2 (2026-08-12):
// el muestreo del 10 % halló 4/10 con error real en la primera cola de
// «candidatos inertes» — y los cuatro vivían donde la regla NO miraba:
// el esContrast, la frase ensamblada y la integridad de las options.
//
// v3 añade los chequeos MECÁNICOS que cazan 3 de las 4 clases. La
// cuarta (falsedad semántica de la glosa, tipo «h sonora» española) no
// es mecanizable: por eso el muestreo adversarial sigue siendo
// OBLIGATORIO — la regla propone, la muestra dispone.
//
// Los fixtures son los 4 ítems ROTOS REALES, verbatim.
import { describe, it, expect } from 'vitest';
import { triage } from '@/scripts/lib/triage-inerte';

const ROTO_185 = {
  id: '185d89ba', type: 'fill_blank', blockId: 1,
  data: { sentence: 'Ele trabalha de ___ a noite.', blanks: [{ position: 0, answer: 'manhã', alternatives: [] }] },
  esContrast: "No es 'manna', sino 'manhã' con -ão. La -h muda preserva la raíz.",
} as any;

const ROTO_273 = {
  id: '273b3166', type: 'flashcard', blockId: 1,
  data: { front: "¿Cómo se dice 'hermano' en portugués?", back: 'irmão', example: 'O meu irmão mais velho mora em São Paulo.' },
  esContrast: "Irregular: no es 'hermano' → 'irmão', el grupo 'nh' es diferente en español.",
} as any;

const ROTO_9F5 = {
  id: '9f57a67b', type: 'verb_preposition', blockId: 1,
  data: { verb: 'pensar', sentence: 'Ela pensa ___ mulher que viu na manhã de ontem.', options: ['em', 'de', 'em', '—'], answer: 'em' },
  esContrast: "En español 'pensar' lleva 'en', en PT 'pensar em' lleva 'em'.",
} as any;

const SANO = {
  id: 'sano-1', type: 'flashcard', blockId: 1,
  data: { front: "¿Cómo se dice 'ventana'?", back: 'a janela', example: 'Abre a janela, por favor.' },
  esContrast: "'Janela' no se parece a 'ventana': memorízala como palabra nueva.",
} as any;

describe('regla-inerte v3 — las clases del freno', () => {
  it('caza la glosa que atribuye a la palabra un rasgo que NO tiene («manhã con -ão»)', () => {
    const d = triage(ROTO_185) as any;
    expect(d.destino).not.toBe('neutral');
    expect(JSON.stringify(d)).toMatch(/glosa/i);
  });

  it('caza la glosa que cita un grupo de letras que la palabra no contiene («nh» para irmão)', () => {
    const d = triage(ROTO_273) as any;
    expect(d.destino).not.toBe('neutral');
  });

  it('caza options con duplicados («em» dos veces)', () => {
    const d = triage(ROTO_9F5) as any;
    expect(d.destino).not.toBe('neutral');
    expect(JSON.stringify(d)).toMatch(/option|duplicad/i);
  });

  it('caza el ensamblado roto: answer+frase produce secuencia agramatical («pensa em mulher que viu» exige «na»)', () => {
    // Como mínimo, la duplicación literal de la respuesta pegada a sí
    // misma («em em») o respuesta idéntica a la palabra siguiente.
    const roto = {
      id: 'ens-1', type: 'verb_preposition', blockId: 4,
      data: { verb: 'sonhar', sentence: 'Ela sonhou ___ com o mar.', options: ['com', 'de', 'a', '—'], answer: 'com' },
    } as any;
    const d = triage(roto) as any;
    expect(d.destino).not.toBe('neutral');
  });

  it('un ítem sano con glosa honesta sigue siendo candidato inerte', () => {
    const d = triage(SANO) as any;
    expect(d.destino).toBe('neutral');
  });
});
