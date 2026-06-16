// tests/unit/srs-config.test.ts
import { describe, it, expect } from 'vitest';
import { FSRS_CONFIG } from '@/lib/srs/config';

describe('FSRS_CONFIG', () => {
  it('uses Anki-kind defaults (target retention 0.9, fuzz on, max 365 days)', () => {
    expect(FSRS_CONFIG.request_retention).toBe(0.9);
    expect(FSRS_CONFIG.enable_fuzz).toBe(true);
    expect(FSRS_CONFIG.maximum_interval).toBe(365);
  });

  it('uses 2 short learning steps and 1 short relearning step', () => {
    expect(FSRS_CONFIG.learning_steps.length).toBe(2);
    expect(FSRS_CONFIG.relearning_steps.length).toBe(1);
    // Steps are time-unit strings ("1m", "10m"), not seconds.
    for (const s of FSRS_CONFIG.learning_steps) expect(s).toMatch(/^\d+[mhd]$/);
    for (const s of FSRS_CONFIG.relearning_steps) expect(s).toMatch(/^\d+[mhd]$/);
  });

  it('caps daily work to a comfortable amount (100 reviews, 10 new cards)', () => {
    expect(FSRS_CONFIG.daily_review_cap).toBe(100);
    expect(FSRS_CONFIG.new_cards_per_day).toBe(10);
  });

  it('flags leeches at 8 lapses', () => {
    expect(FSRS_CONFIG.leech_lapses_threshold).toBe(8);
  });
});
