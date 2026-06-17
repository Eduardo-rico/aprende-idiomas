// lib/srs/scheduler.ts
// Lazy FSRS scheduler. Replaces the at-import-time `const scheduler = fsrs(...)`
// in fsrs.ts with a getScheduler() factory that rebuilds only when one of
// the 5 fields passed to `generatorParameters` changes. The other 3 fields
// (daily_review_cap, new_cards_per_day, leech_lapses_threshold) are read
// at call time by repository.getDueCards and lib/srs/leeches.ts:isLeech and
// don't need a rebuild.
import { fsrs, generatorParameters, type IFSRS } from "ts-fsrs";
import { FSRS_CONFIG, type FsrsConfig } from "./config";
import type { StepUnit } from "ts-fsrs";

/** The 5 fields that actually feed into generatorParameters(...). Changing
 *  any of them requires a fresh `fsrs(...)` instance. Listed explicitly so
 *  a future field added to FSRS_CONFIG defaults to "no rebuild needed"
 *  (safe — readers can re-derive from defaults). */
const REBUILD_KEY_FIELDS = [
  "request_retention",
  "enable_fuzz",
  "maximum_interval",
  "learning_steps",
  "relearning_steps",
] as const satisfies ReadonlyArray<keyof FsrsConfig>;

let cachedKey: string | null = null;
let cachedScheduler: IFSRS | null = null;

function buildKey(merged: FsrsConfig): string {
  return REBUILD_KEY_FIELDS.map((k) => JSON.stringify(merged[k])).join("|");
}

export function getScheduler(overrides: Partial<FsrsConfig> = {}): IFSRS {
  const merged: FsrsConfig = { ...FSRS_CONFIG, ...overrides };
  const key = buildKey(merged);
  if (cachedScheduler && cachedKey === key) return cachedScheduler;
  cachedKey = key;
  cachedScheduler = fsrs(
    generatorParameters({
      request_retention: merged.request_retention,
      enable_fuzz: merged.enable_fuzz,
      maximum_interval: merged.maximum_interval,
      learning_steps: merged.learning_steps as readonly StepUnit[] as StepUnit[],
      relearning_steps: merged.relearning_steps as readonly StepUnit[] as StepUnit[],
    }),
  );
  return cachedScheduler;
}

/** Drop the cached scheduler. Tests call this between cases so a previous
 *  override doesn't leak into the next assertion. */
export function _resetSchedulerForTests(): void {
  cachedKey = null;
  cachedScheduler = null;
}
