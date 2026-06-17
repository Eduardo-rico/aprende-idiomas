// tests/unit/scripts-data-paths.test.ts
// Phase 2: scripts/config.ts resuelve BLOCKS_DIR, STORIES_DIR y DATA_DIR
// al plano de datos del idioma activo (default "pt" → languages/pt/).
import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { DATA_DIR, BLOCKS_DIR, STORIES_DIR, DEFAULT_LANG } from '@/scripts/config';

describe('scripts/config.ts data paths (Phase 2)', () => {
  it('DEFAULT_LANG es "pt"', () => {
    expect(DEFAULT_LANG).toBe('pt');
  });

  it('DATA_DIR resuelve a lib/data/languages/pt/', () => {
    expect(DATA_DIR).toBe(path.join(process.cwd(), 'lib', 'data', 'languages', 'pt'));
  });

  it('BLOCKS_DIR es hijo de DATA_DIR', () => {
    expect(BLOCKS_DIR).toBe(path.join(DATA_DIR, 'blocks'));
  });

  it('STORIES_DIR es hijo de DATA_DIR', () => {
    expect(STORIES_DIR).toBe(path.join(DATA_DIR, 'stories'));
  });
});
