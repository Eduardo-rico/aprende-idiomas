// tests/unit/variant-guard.test.ts
//
// El gate que impide que vuelva a colarse portugués brasileño en el contenido
// base. Los casos de exención salieron de falsos positivos reales del primer
// pase sobre el corpus: un gate que grita en falso acaba desactivado, así que
// se testean tanto los aciertos como las exenciones.
import { describe, it, expect } from 'vitest';
import { revisarEjercicio, exento } from '@/scripts/lib/variant-guard';

const base = {
  id: 'x', blockId: 1, lessonId: 'b1-l1', difficulty: 1 as const,
  concepts: [], tags: [] as string[],
};

const flash = (back: string, extra: Record<string, unknown> = {}) =>
  ({ ...base, type: 'flashcard', data: { front: 'x', back }, ...extra }) as never;

describe('detecta brasileño en el contenido base', () => {
  it('caza el gerundio con estar', () => {
    const h = revisarEjercicio(flash('A criança está dormindo.'));
    expect(h).toHaveLength(1);
    expect(h[0]?.marcador).toBe('gerundio con estar');
    expect(h[0]?.europeo).toContain('estar a + infinitivo');
  });

  it('caza «você» SINGULAR, que es el que ofende en Lisboa', () => {
    const h = revisarEjercicio(flash('Você pode ajudar?'));
    expect(h.map((x) => x.marcador)).toContain('você singular como 2ª persona');
  });

  it('NO marca «vocês» plural, que es europeo normal', () => {
    // «Abraço grande para a equipa, vocês são fixe!» es portugués de
    // Portugal de manual. Marcarlo inflaba el recuento con 44 falsos
    // positivos y le quitaba autoridad al gate para lo que sí importa.
    expect(revisarEjercicio(flash('Vocês são fixe!'))).toHaveLength(0);
    expect(revisarEjercicio(flash('Vocês têm razão.'))).toHaveLength(0);
  });

  it('caza el léxico exclusivo de Brasil', () => {
    for (const [txt, marca] of [
      ['Vou apanhar o ônibus.', 'ônibus'],
      ['O café da manhã é às oito.', 'café da manhã'],
      ['Perdi o celular.', 'celular'],
    ] as const) {
      expect(revisarEjercicio(flash(txt)).map((x) => x.marcador)).toContain(marca);
    }
  });

  it('caza la próclise en inicio absoluto', () => {
    const h = revisarEjercicio(flash('Me diga logo o que aconteceu!'));
    expect(h.map((x) => x.marcador)).toContain('próclise en inicio de frase');
  });

  it('no marca portugués europeo correcto', () => {
    expect(revisarEjercicio(flash('Estou a fazer o pequeno-almoço.'))).toHaveLength(0);
    expect(revisarEjercicio(flash('Chamo-me Miguel e apanho o autocarro.'))).toHaveLength(0);
    expect(revisarEjercicio(flash('Tu falas muito depressa.'))).toHaveLength(0);
  });
});

describe('exenciones — los ítems que enseñan la diferencia', () => {
  it('exime un ítem etiquetado "regional"', () => {
    expect(exento(flash('Vou de ônibus.', { tags: ['regional'] }))).toBe(true);
  });

  it('exime cuando el texto nombra Brasil', () => {
    expect(exento(flash('No Brasil dizem ônibus.'))).toBe(true);
  });

  it('exime la marca contrastiva BR: / PT:', () => {
    // Caso real: b21f2d27 mostraba las dos formas y el gate lo marcaba como error.
    expect(exento(flash('Mantiveram-se em contacto. / 🇧🇷 BR: em contato.'))).toBe(true);
    expect(exento(flash('PT: autocarro / BR: ônibus'))).toBe(true);
  });

  it('NO exime un ítem que simplemente contiene brasileño sin contraste', () => {
    expect(exento(flash('Perdi o celular no ônibus.'))).toBe(false);
  });
});

describe('sólo mira los campos que llevan portugués', () => {
  it('ignora la glosa española de un translation', () => {
    // `target` es español (targetLang: 'es'), así que «carro» no es brasileño:
    // es la palabra española. Marcarlo fue un falso positivo del primer intento.
    const ex = {
      ...base, type: 'translation',
      data: { source: 'Comprei um carro.', target: 'Compré un carro.', sourceLang: 'pt-pt', targetLang: 'es' },
    } as never;
    expect(revisarEjercicio(ex)).toHaveLength(0);
  });

  it('ignora la pregunta en español de un listening', () => {
    const ex = {
      ...base, type: 'listening',
      data: { audioText: 'Estou a estudar.', question: '¿Qué está haciendo?', options: ['a'], answer: 'a' },
    } as never;
    expect(revisarEjercicio(ex)).toHaveLength(0);
  });
});
