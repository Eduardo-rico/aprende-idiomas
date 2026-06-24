import { describe, it, expect } from 'vitest';
import { pickRecorderMime } from '@/lib/exercises/recorder';

describe('pickRecorderMime', () => {
  it('prefers webm/opus when supported (Chrome)', () => {
    expect(pickRecorderMime((t) => t.startsWith('audio/webm'))).toBe('audio/webm;codecs=opus');
  });
  it('falls back to audio/mp4 on iOS Safari', () => {
    expect(pickRecorderMime((t) => t === 'audio/mp4')).toBe('audio/mp4');
  });
  it('returns null when nothing is supported', () => {
    expect(pickRecorderMime(() => false)).toBeNull();
  });
});
