// tests/unit/shadowing-card.test.tsx
// @vitest-environment jsdom
//
// E2#11 destapó que `ShadowingCard` devolvía `correct = true` SIEMPRE,
// incluido el botón «Saltar grabación»: saltarse el ejercicio contaba
// como acierto y entraba así en el FSRS. Se corrigió, pero sin test — y
// una corrección sin test es una corrección que vuelve. Hoy no hay
// ítems `shadowing` en el corpus; el currículo pide 90 en A1.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ShadowingCard } from '@/components/cards/ShadowingCard';

vi.mock('@/lib/stores/settings', () => ({ useSettings: () => ({ variant: 'pt-pt' }) }));
vi.mock('@/lib/exercise-resolver', async (orig) => ({ ...(await orig<typeof import('@/lib/exercise-resolver')>()), resolveExerciseData: (ex: any) => ex.data }));

afterEach(cleanup);

const ex = {
  id: 's1', type: 'shadowing',
  data: { text: 'O comboio para o Porto sai da linha 3.', es: 'El tren para Oporto sale del andén 3.' },
} as any;

describe('ShadowingCard', () => {
  it('SALTAR la grabación no puntúa como acierto', () => {
    const onSubmit = vi.fn();
    render(<ShadowingCard ex={ex} onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /saltar/i }));
    expect(onSubmit).toHaveBeenCalledWith('', false);
  });

  it('el texto portugués se muestra, que es lo que hay que imitar', () => {
    render(<ShadowingCard ex={ex} onSubmit={vi.fn()} />);
    expect(document.body.textContent).toContain('O comboio para o Porto');
  });
});
