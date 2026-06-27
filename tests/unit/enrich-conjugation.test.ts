// tests/unit/enrich-conjugation.test.ts
import { describe, it, expect } from 'vitest';
import { buildVerbConjugationMdx } from '@/scripts/lib/enrich-mdx';

describe('buildVerbConjugationMdx', () => {
  it('emits a parseable VerbConjugation MDX tag with forms', () => {
    const out = buildVerbConjugationMdx('falar', 'presente do indicativo', [{ person: 'eu', form: 'falo' }]);
    expect(out).toContain('<VerbConjugation');
    expect(out).toContain('verb="falar"');
    expect(out).toContain('"person":"eu"');
  });
});
