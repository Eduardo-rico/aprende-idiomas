// tests/unit/verb-conjugation.test.tsx
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VerbConjugation } from '@/components/lessons/VerbConjugation';

describe('VerbConjugation', () => {
  it('renders verb, tense and each person→form row', () => {
    render(<VerbConjugation verb="falar" tense="presente do indicativo"
      forms={[{ person: 'eu', form: 'falo' }, { person: 'tu', form: 'falas' }]} />);
    expect(screen.getByText(/falar/)).toBeTruthy();
    expect(screen.getByText('falo')).toBeTruthy();
    expect(screen.getByText('falas')).toBeTruthy();
  });
});
