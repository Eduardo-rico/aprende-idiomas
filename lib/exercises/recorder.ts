// lib/exercises/recorder.ts
// MIME selection for MediaRecorder. Chrome supports webm/opus; iOS Safari
// only audio/mp4. Returns the first supported candidate, else null (caller
// falls back to the browser default or shows an unsupported message).
const CANDIDATES = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg'];
export function pickRecorderMime(isSupported: (t: string) => boolean): string | null {
  return CANDIDATES.find(isSupported) ?? null;
}
