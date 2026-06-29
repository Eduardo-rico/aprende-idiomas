// components/VoicePicker.tsx
"use client";
import { useSettings } from "@/lib/stores/settings";
import type { AudioVariant } from "@/lib/db/schema";

// CRITICAL FIX (C3): b1.json has 1 voice per variant. The 6-voice picker
// returns in Plan #4 when TTS regen produces f/m × neutral/happy/calm.
//
// A.6: chrome migrated from shadcn (border-border / bg-background) to
// Manual Lusitano tokens (border-rule-strong / bg-paper-raised / text-ink).
const variants: { id: AudioVariant; label: string }[] = [
  { id: "default", label: "Voz padrão (única disponible — más voces en Plan #4)" },
];

export function VoicePicker() {
  const { variant, voicePref, setVoicePref } = useSettings();
  return (
    <select
      value={voicePref[variant]}
      onChange={(e) => setVoicePref(variant, e.target.value as AudioVariant)}
      className="rounded-md border border-rule-strong bg-paper-raised px-3 py-1.5 text-sm text-ink"
      data-testid="voice-picker"
    >
      {variants.map((v) => (
        <option key={v.id} value={v.id}>
          {v.label}
        </option>
      ))}
    </select>
  );
}
