// tests/unit/enrich-mdx.test.ts
import { describe, it, expect } from 'vitest';
import { insertBlock, buildVocabMdx } from '@/scripts/lib/enrich-mdx';

const mdx = `<Rule title="x">regla</Rule>\n\n<Example index={0} audioRef={0} pt="A" es="B" />\n`;

describe('insertBlock', () => {
  it('inserts before the first Example and never alters Example lines', () => {
    const out = insertBlock(mdx, buildVocabMdx([{ pt: 'água', es: 'agua' }]));
    expect(out).toContain('### Vocabulário');
    expect(out.indexOf('### Vocabulário')).toBeLessThan(out.indexOf('<Example'));
    expect(out).toContain('<Example index={0} audioRef={0} pt="A" es="B" />'); // byte-identical
  });
  it('is idempotent (does not double-insert)', () => {
    const once = insertBlock(mdx, buildVocabMdx([{ pt: 'água', es: 'agua' }]));
    const twice = insertBlock(once, buildVocabMdx([{ pt: 'água', es: 'agua' }]));
    expect(twice).toBe(once);
  });
  it('appends when there is no Example', () => {
    const noEx = `<Rule title="x">regla</Rule>\n`;
    const out = insertBlock(noEx, buildVocabMdx([{ pt: 'água', es: 'agua' }]));
    expect(out).toContain('### Vocabulário');
    expect(out).toContain('regla');
  });
});

describe('buildVocabMdx', () => {
  it('renders a Vocabulário heading and one bullet per item', () => {
    const out = buildVocabMdx([{ pt: 'água', es: 'agua' }, { pt: 'pão', es: 'pan' }]);
    expect(out).toContain('### Vocabulário');
    expect(out).toContain('- **água** — agua');
    expect(out).toContain('- **pão** — pan');
  });
});
