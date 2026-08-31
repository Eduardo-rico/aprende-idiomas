// tests/unit/variant-guard.test.ts
//
// El gate que impide que vuelva a colarse portugués brasileño en el contenido
// base. Los casos de exención salieron de falsos positivos reales del primer
// pase sobre el corpus: un gate que grita en falso acaba desactivado, así que
// se testean tanto los aciertos como las exenciones.
import { describe, it, expect } from 'vitest';
import { revisarEjercicio, exento, textoPortugues, contrasteImplicito } from '@/scripts/lib/variant-guard';

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

// ── E2#9: el gate era ciego a lo que vive partido entre `sentence` y
// `blanks[*].answer`. Medido sobre los 407 fill_blank del corpus: ocho
// ítems con progresivo en gerundio («Eu estou ___ português» + answer
// «estudando»), y SÓLO UNO visible escaneando `sentence` a secas. El
// regex no puede casar porque las dos mitades nunca están en la misma
// cadena. La cola 7 los encontró a mano; no debería haber tenido que.
describe('fill_blank: el gate ensambla la frase antes de escanear', () => {
  const ex = {
    id: 'x', type: 'fill_blank',
    data: { sentence: 'Eu estou ___ português agora.', blanks: [{ position: 0, answer: 'estudando' }] },
  } as any;

  it('caza el brasileñismo repartido entre sentence y answer', () => {
    const h = revisarEjercicio(ex);
    expect(h.map((x) => x.marcador)).toContain('gerundio con estar');
  });

  it('no inventa hallazgos cuando la frase ensamblada es europea', () => {
    const bueno = {
      id: 'y', type: 'fill_blank',
      data: { sentence: 'Eu estou ___ português agora.', blanks: [{ position: 0, answer: 'a estudar' }] },
    } as any;
    expect(revisarEjercicio(bueno).map((x) => x.marcador)).not.toContain('gerundio con estar');
  });

  it('textoPortugues devuelve la frase ya ensamblada, no la del hueco', () => {
    expect(textoPortugues(ex)).toContain('estou estudando');
    expect(textoPortugues(ex)).not.toContain('___');
  });
});

// E2#10: el gate marcaba «você» cuando el ítem lo CITA como palabra —una
// ficha de fonética que ilustra la vocal cerrada con «você /voˈse/», o una
// que enseña el inventario de tratamiento «tu / você / o senhor»—. Un gate
// que grita sobre lo que el curso existe para enseñar acaba desactivado.
describe('mención frente a uso', () => {
  const voce = (ex: any) => revisarEjercicio(ex).find((h) => h.marcador === 'você singular como 2ª persona');

  it('marca como MENCIÓN el «você» entrecomillado como palabra citada', () => {
    const ex = { id: 'b', type: 'flashcard', data: { back: 'Vogal fechada: «você», pêssego, avô.' } } as any;
    expect(voce(ex)?.mencion).toBe(true);
  });

  it('marca como MENCIÓN el «você» que va con su transcripción IPA', () => {
    const ex = { id: 'b2', type: 'flashcard', data: { back: 'Vogal fechada: você /voˈse/ e pêssego.' } } as any;
    expect(voce(ex)?.mencion).toBe(true);
  });

  it('NO es mención cuando se usa de verdad en la frase', () => {
    const ex = { id: 'c', type: 'flashcard', data: { back: 'Quando você volta ao hotel?' } } as any;
    expect(voce(ex)?.mencion).toBe(false);
  });

  it('NO es mención si una aparición está citada pero otra está suelta', () => {
    // sin la palabra «brasileiro», que dispara otra exención ya existente
    const ex = { id: 'd', type: 'flashcard', data: { back: 'O pronome «você»: você fala muito depressa.' } } as any;
    expect(voce(ex)?.mencion).toBe(false);
  });
});

// El campo `europeo` del marcador «você» es «tu (informal) o 3ª persona
// sin pronombre (deferencia)». La v1 de contrasteImplicito tomaba la
// primera palabra de 3+ letras y se quedaba con «informal», de modo que
// cualquier ítem que dijera «informal» quedaba exento: 26 en el corpus.
describe('contrasteImplicito: el término europeo no sale de la glosa entre paréntesis', () => {
  const EUROPEO_VOCE = 'tu (informal) o 3ª persona sin pronombre (deferencia)';

  it('NO exime un ítem sólo porque diga «informal»', () => {
    const ex = { id: 'a', type: 'flashcard', data: { back: 'No registo informal, dizemos: «Eu gosto de você».' } } as any;
    expect(contrasteImplicito(ex, EUROPEO_VOCE)).toBe(false);
  });

  // Para «você» la heurística queda DESACTIVADA (`terminoEuropeo: null`):
  // su forma europea es «tu», y que un ítem contenga «tu» no prueba nada
  // — con ese criterio quedaban exentos 237 de 2.431. La exención de este
  // marcador tiene que venir de una etiqueta explícita, que es lo que
  // `exento()` ya mira.
  it('desactivada: null nunca exime', () => {
    const ex = { id: 'b', type: 'flashcard', data: { back: 'Em Portugal «tu pagas»; no Brasil «você paga».' } } as any;
    expect(contrasteImplicito(ex, null)).toBe(false);
    // …pero ese ítem SÍ queda exento por la vía buena: nombra Brasil.
    expect(exento(ex)).toBe(true);
  });

  it('sigue funcionando con los marcadores de una sola palabra', () => {
    const ex = { id: 'c', type: 'flashcard', data: { back: 'Em Portugal o ônibus chama-se autocarro.' } } as any;
    expect(contrasteImplicito(ex, 'autocarro')).toBe(true);
  });
});
