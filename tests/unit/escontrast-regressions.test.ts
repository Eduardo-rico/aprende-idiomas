// tests/unit/escontrast-regressions.test.ts
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
const D = 'lib/data/languages/pt';
const allText = [
  ...fs.readdirSync(`${D}/blocks`).filter(f => /^b\d+\.json$/.test(f)).map(f => fs.readFileSync(`${D}/blocks/${f}`, 'utf8')),
  fs.readFileSync(`${D}/mdx/b1/l3-correspondencias.mdx`, 'utf8'),
  fs.readFileSync(`${D}/mdx/b2/l2-genero-gramatical.mdx`, 'utf8'),
].join('\n');

describe('esContrast / MDX factual regressions (E4)', () => {
  it('no invented Spanish word "ligación"', () => { expect(allText).not.toMatch(/(?<!ob)ligación/i); });
  it('no wrong ll→lh correspondence claim', () => { expect(allText).not.toMatch(/'ll'[^.]*'lh'/); });
  it('no "-ma siempre masculino" overgeneralization', () => { expect(allText).not.toMatch(/-ma['"]?,?\s*¡?seguro\s+es\s+masculino/i); });
  it('no "acalentar" = calentar confusion', () => { expect(allText).not.toMatch(/acalentar/i); });
});
