// lib/audio/resolve.ts
import type { VariantKey } from "@/lib/data/variant";

// Voice preference per variant (PT-BR → vitoria, PT-PT → francisca).
// When Plan #4 regen produces 6 voices, this picker routes by variant.
const VOICE_PREF: Record<string /* variant */, string /* voiceId */> = {
  "pt-br": "vitoria",
  "pt-pt": "francisca",
};

export function pickVoice(variant: string, availableVoices: string[]): string {
  const preferred = VOICE_PREF[variant];
  if (preferred && availableVoices.includes(preferred)) return preferred;
  // Fallback: first voice compatible with the variant, or any.
  const prefix = variant.split("-")[0] ?? "";
  return (
    availableVoices.find((v) => v.startsWith(prefix)) ??
    availableVoices[0] ??
    "default"
  );
}

export function audioUrl(hash: string, _variant?: VariantKey, _voice?: string): string {
  return `/audio/${hash}.mp3`;
}