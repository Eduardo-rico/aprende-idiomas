// tests/unit/matching-card.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchingCard } from '@/components/cards/MatchingCard';

vi.mock('@/lib/stores/settings', () => ({ useSettings: () => ({ variant: 'pt-br' }) }));
vi.mock('@/lib/exercise-resolver', async (orig) => ({ ...(await orig<typeof import('@/lib/exercise-resolver')>()), resolveExerciseData: (ex: any) => ex.data }));

const ex = { id: 'x', type: 'matching', data: { pairs: [{ left: 'sim', right: 'sí' }, { left: 'não', right: 'no' }, { left: 'água', right: 'agua' }] } } as any;

describe('MatchingCard', () => {
  it('reports correct=true when every left is connected to its right', () => {
    const onSubmit = vi.fn();
    render(<MatchingCard ex={ex} onSubmit={onSubmit} />);
    // click left then its right, for all pairs
    for (const p of ex.data.pairs) { fireEvent.click(screen.getByText(p.left)); fireEvent.click(screen.getByText(p.right)); }
    expect(onSubmit).toHaveBeenCalledWith(expect.any(String), true);
  });
});
