// tests/unit/options-grid.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OptionsGrid } from '@/components/cards/OptionsGrid';

describe('OptionsGrid', () => {
  it('renders options and reports the picked index', () => {
    const onPick = vi.fn();
    render(<OptionsGrid options={['a', 'b', 'c']} onPick={onPick} />);
    fireEvent.click(screen.getByText('b'));
    expect(onPick).toHaveBeenCalledWith(1);
  });
});
