// lib/audio/resolve.ts
import type { AudioVariant, Variant } from "@/lib/db/schema";

// CRITICAL FIX: 1 voice per variant until Plan #4 regen produces 6.
// Picker becomes a no-op; UI just shows the single available voice.
export function pickVoice(
  _ex: { type?: string; suggested?: unknown },
  _variant: Variant,
  _pref: Record<Variant, AudioVariant>,
): AudioVariant {
  return "default";
}

export function audioUrl(hash: string, _variant?: Variant, _voice?: AudioVariant): string {
  return `/audio/${hash}.mp3`;
}
