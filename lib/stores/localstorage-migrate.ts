// lib/stores/localstorage-migrate.ts
// One-time localStorage migration from the legacy "pt-*" keys to the
// "app-*" keys. Phase 1 added `language` to settings; Phase 4 renames
// the *-prefixed keys to "app-*" so they're no longer PT-specific. We
// also translate the legacy variant values "br"/"pt" to the canonical
// "pt-br"/"pt-pt" so consumers that read `state.variant` after the
// migration see a `VariantKey`, not a `Variant` alias.
//
// Idempotent: re-running on a clean install is a no-op. Each migration
// copies the old key's value, then removes the old key. We do this in
// a single pass at module load (idempotent guard via a localStorage
// sentinel `app-migrated-v1`).
import { legacyVariantToKey } from "@/lib/data/variant";

const MIGRATION_FLAG = "app-migrated-v1";

interface MigrationSpec {
  /** Legacy key, e.g. "pt-settings". */
  oldKey: string;
  /** New key, e.g. "app-settings". */
  newKey: string;
  /** Optional transformer: legacy value → new value. Receives the
   *  already-parsed object/string. Return the migrated payload. */
  transform?: (parsed: unknown) => unknown;
}

const SPECS: MigrationSpec[] = [
  {
    oldKey: "pt-settings",
    newKey: "app-settings",
    transform: (raw) => {
      // Zustand's persist wraps the user state under `state`. Navigate
      // into it so the transform sees the actual fields, then write
      // back the whole envelope (preserves `version`, etc.).
      const envelope = (raw ?? {}) as Record<string, unknown>;
      const obj = (envelope.state ?? envelope) as Record<string, unknown>;
      // Legacy variant values: "br" / "pt". Translate to canonical keys.
      if (typeof obj.variant === "string") {
        obj.variant = legacyVariantToKey(obj.variant);
      }
      // Legacy voicePref was keyed by "br"/"pt". Translate each key.
      if (obj.voicePref && typeof obj.voicePref === "object") {
        const vp = obj.voicePref as Record<string, unknown>;
        const next: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(vp)) {
          next[legacyVariantToKey(k)] = v;
        }
        obj.voicePref = next;
      }
      if (envelope.state) envelope.state = obj;
      return envelope;
    },
  },
  { oldKey: "pt-fsrs-overrides", newKey: "app-fsrs-overrides" },
];

/** Run the migration once. Safe to call from a Zustand `persist.migrate`
 *  or a ThemeProvider useEffect. Subsequent calls are no-ops. */
export function runLocalStorageMigrations(): void {
  if (typeof localStorage === "undefined") return;
  // Already done — short-circuit.
  if (localStorage.getItem(MIGRATION_FLAG) === "1") return;
  for (const spec of SPECS) {
    const raw = localStorage.getItem(spec.oldKey);
    if (raw === null) continue;
    try {
      const parsed = JSON.parse(raw);
      const migrated = spec.transform ? spec.transform(parsed) : parsed;
      // Only write if the new key isn't already populated (don't clobber).
      if (localStorage.getItem(spec.newKey) === null) {
        localStorage.setItem(spec.newKey, JSON.stringify(migrated));
      }
      // Keep the old key around for one session so a misbehaving old
      // build can still find it; remove it after we mark migration done.
      localStorage.removeItem(spec.oldKey);
    } catch {
      // Old payload was corrupt — drop it instead of crashing.
      localStorage.removeItem(spec.oldKey);
    }
  }
  // `pt-theme` is stored as a raw string ("light" / "dark"), not JSON.
  // Handle it separately so the migrator can read a non-JSON value
  // without confusing the rest of the pipeline.
  const legacyTheme = localStorage.getItem("pt-theme");
  if (legacyTheme !== null) {
    try {
      if (localStorage.getItem("app-theme") === null) {
        localStorage.setItem("app-theme", legacyTheme);
      }
    } catch {
      // ignore — ThemeProvider will fall back to "light" on next mount.
    }
    localStorage.removeItem("pt-theme");
  }
  localStorage.setItem(MIGRATION_FLAG, "1");
}
