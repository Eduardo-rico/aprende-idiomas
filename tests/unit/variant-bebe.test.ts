// El marcador `bebê` no puede morder al verbo *beber*.
//
// `beb[êe]s?` toleraba la forma sin acento para cazar erratas, y con eso
// marcaba «bebe» y «bebes» — el presente y el imperativo de un verbo
// corriente. Marcó `cl16-042` («___ (beber) um pouco de água»), que no
// tiene nada de brasileño, y por poco impide sellar un ítem correcto.
// Además el acento ES la diferencia entre las dos variantes: tolerarlo
// borra el rasgo que el marcador examina.
import { describe, it, expect } from 'vitest';
import { revisarEjercicio } from '@/scripts/lib/variant-guard';

const fill = (sentence: string, answer: string) => ({
  id: 'x', type: 'fill_blank', data: { sentence, blanks: [{ position: 0, answer, alternatives: [] }] },
});

describe('marcador bebê', () => {
  it('NO marca el verbo beber', () => {
    expect(revisarEjercicio(fill('___ (beber) um pouco de água.', 'bebe'))).toEqual([]);
    expect(revisarEjercicio(fill('Tu ___ (beber) muito café.', 'bebes'))).toEqual([]);
  });
  it('SÍ marca el brasileñismo con su acento', () => {
    const h = revisarEjercicio(fill('O ___ está a dormir.', 'bebê'));
    expect(h.map((x) => x.marcador)).toContain('bebê');
    expect(revisarEjercicio(fill('Os ___ choram muito.', 'bebês')).length).toBeGreaterThan(0);
  });
  it('no toca la forma europea', () => {
    expect(revisarEjercicio(fill('O ___ está a dormir.', 'bebé'))).toEqual([]);
  });
});
