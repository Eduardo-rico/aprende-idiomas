# Plan 5d — SRS / Engagement Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Fix four retention/motivation issues the pedagogy review found (E6, E12): no real interleaving, new-card starvation on heavy-review days, a too-high leech threshold, and XP coupled to the FSRS rating (which incentivizes mis-rating).

**Architecture:** Pure, unit-testable functions in `lib/srs/` for queue interleaving and the new-card floor; a config constant change for the leech threshold; and decoupling XP from the FSRS grade in `lib/xp/`. Logic-only — no content, no audio.

**Tech Stack:** TypeScript, ts-fsrs, Dexie, Zustand, vitest. No audio.

## Global Constraints

- No content/audio changes. Pure logic + config.
- Keep `buildDueQueue` pure (it already is — `lib/srs/review-queue.ts`).
- Run `npm run typecheck && npm test` before each commit. `npm run build` before the final commit.

---

### Task 1: Real interleaving (E6)

Today `buildDueQueue` returns `{ review, newCards }` as two recency-sorted blocks, and `/learn`'s daily-mix routes to a **single** lesson (`app/[lang]/learn/page.tsx` `startDailyMix` → `/practice/${first.lessonId}`). Add a pure interleaver and route the no-filter daily mix through the multi-card `/review` session.

**Files:**
- Create: `lib/srs/interleave.ts`
- Modify: `app/[lang]/learn/page.tsx` (`startDailyMix` routing)
- Modify: wherever the `/review` session reads the due queue, to apply `interleave` (find via `grep -rn "buildDueQueue\|getDueCards" app lib | grep -i review`)
- Test: `tests/unit/interleave.test.ts`

**Interfaces:**
- Produces: `interleave(cards: Card[], conceptOf: (id: string) => string | undefined, typeOf: (id: string) => string | undefined): Card[]` — reorders so that, as far as possible, no two consecutive cards share the same concept or type; reviews and new cards are mixed (not blocked).

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/interleave.test.ts
import { describe, it, expect } from 'vitest';
import { interleave } from '@/lib/srs/interleave';

const card = (id: string) => ({ id } as any);
const concept: Record<string, string> = { a1: 'c1', a2: 'c1', a3: 'c1', b1: 'c2', b2: 'c2', d1: 'c3' };
const type: Record<string, string> = { a1: 'flashcard', a2: 'flashcard', a3: 'flashcard', b1: 'translation', b2: 'translation', d1: 'fill_blank' };

describe('interleave', () => {
  it('avoids consecutive same-concept cards when alternatives exist', () => {
    const out = interleave([card('a1'), card('a2'), card('a3'), card('b1'), card('b2'), card('d1')],
      (id) => concept[id], (id) => type[id]);
    let consecutiveSameConcept = 0;
    for (let i = 1; i < out.length; i++) if (concept[out[i].id] === concept[out[i - 1].id]) consecutiveSameConcept++;
    expect(consecutiveSameConcept).toBeLessThan(2); // far fewer than the 3 in the blocked input
    expect(out.length).toBe(6); // no card lost
  });
});
```

- [ ] **Step 2: Run it — expect FAIL**. `npx vitest run tests/unit/interleave.test.ts`

- [ ] **Step 3: Implement `lib/srs/interleave.ts`** (greedy: at each step pick the available card whose concept (then type) differs most from the previous pick)

```ts
// lib/srs/interleave.ts
import type { Card } from "../db/schema";
export function interleave(
  cards: Card[],
  conceptOf: (id: string) => string | undefined,
  typeOf: (id: string) => string | undefined,
): Card[] {
  const remaining = [...cards];
  const out: Card[] = [];
  let prevConcept: string | undefined; let prevType: string | undefined;
  while (remaining.length) {
    let pick = 0;
    for (let i = 0; i < remaining.length; i++) {
      const c = conceptOf(remaining[i].id), t = typeOf(remaining[i].id);
      const score = (c !== prevConcept ? 2 : 0) + (t !== prevType ? 1 : 0);
      const bestC = conceptOf(remaining[pick].id), bestT = typeOf(remaining[pick].id);
      const bestScore = (bestC !== prevConcept ? 2 : 0) + (bestT !== prevType ? 1 : 0);
      if (score > bestScore) pick = i;
    }
    const chosen = remaining.splice(pick, 1)[0];
    out.push(chosen); prevConcept = conceptOf(chosen.id); prevType = typeOf(chosen.id);
  }
  return out;
}
```

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Apply interleaving to the session** — in the `/review` session builder, combine `dueQueue.review` + `dueQueue.newCards` into one list and pass through `interleave` (map each card id → its exercise `concepts[0]` and `type` via the loaded exercises). In `app/[lang]/learn/page.tsx` `startDailyMix`, route the no-filter case to `/${lang}/review` (the multi-card, interleaved session) instead of `/${lang}/practice/${first.lessonId}`.

- [ ] **Step 6: typecheck + tests + build, Commit**

```bash
git add lib/srs/interleave.ts app/\[lang\]/learn/page.tsx tests/unit/interleave.test.ts
git commit -m "feat(srs): interleave review+new across concepts/types; route daily mix to /review (E6)"
```

---

### Task 2: New-card floor on heavy-review days (E12)

When overdue reviews fill the cap, `buildDueQueue` gives new cards zero slots for days. Add a small guaranteed floor.

**Files:**
- Modify: `lib/srs/review-queue.ts` (`buildDueQueue`, `DueQueueOptions`)
- Modify: `lib/srs/config.ts` (add `new_cards_floor: 3`)
- Test: `tests/unit/review-queue.test.ts` (extend existing if present)

**Interfaces:**
- Produces: `DueQueueOptions` gains `newCardsFloor?: number`; `buildDueQueue` guarantees `min(newCardsFloor, available new cards)` new cards even when reviews exceed the cap (total may exceed `cap` by at most `newCardsFloor`).

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/review-queue.test.ts  (add this case)
import { describe, it, expect } from 'vitest';
import { buildDueQueue } from '@/lib/srs/review-queue';
const review = (i: number) => ({ id: 'r' + i, state: 2, nextReviewAt: new Date(i), introducedAt: new Date(0) } as any);
const fresh = (i: number) => ({ id: 'n' + i, state: 0, nextReviewAt: new Date(0), introducedAt: new Date(i) } as any);

describe('buildDueQueue new-card floor (E12)', () => {
  it('still introduces the floor of new cards when reviews exceed the cap', () => {
    const due = [...Array.from({ length: 120 }, (_, i) => review(i)), fresh(1), fresh(2), fresh(3), fresh(4)];
    const q = buildDueQueue(due, { cap: 100, newCardsPerDay: 10, newCardsFloor: 3 });
    expect(q.newCards.length).toBe(3);
  });
});
```

- [ ] **Step 2: Run it — expect FAIL** (today `newCards.length` is 0 here)

- [ ] **Step 3: Implement the floor in `buildDueQueue`** — after computing `newSlots`, take `Math.max(flooredSlots, newSlots)`:

```ts
const floor = Math.max(0, options.newCardsFloor ?? 0);
const newSlots = Math.max(0, options.cap - review.length);
const allowedNew = Math.max(Math.min(floor, newAll.length), Math.min(options.newCardsPerDay, newSlots));
const newCards = newAll.slice(0, allowedNew);
```

Add `newCardsFloor?: number` to `DueQueueOptions`, `new_cards_floor: 3` to `lib/srs/config.ts`, and pass it from the `getDueCards` callers (`learn/page.tsx`, repository).

- [ ] **Step 4: Run tests — expect PASS** (existing review-queue tests still green)
- [ ] **Step 5: Commit** — `git commit -m "feat(srs): guarantee a small new-card floor on heavy-review days (E12)"`

---

### Task 3: Lower the leech threshold 8 → 5 (E12)

**Files:**
- Modify: `lib/srs/config.ts` (`leech_lapses_threshold: 8` → `5`)
- Test: `tests/unit/leeches.test.ts` (extend)

- [ ] **Step 1: Write/extend the test** asserting `isLeech` fires at 5 lapses with the configured threshold.

```ts
// tests/unit/leeches.test.ts (add)
import { describe, it, expect } from 'vitest';
import { isLeech } from '@/lib/srs/leeches';
import { FSRS_CONFIG } from '@/lib/srs/config';
describe('leech threshold (E12)', () => {
  it('threshold is 5', () => { expect(FSRS_CONFIG.leech_lapses_threshold).toBe(5); });
  it('flags a card at threshold lapses', () => { expect(isLeech({ lapses: 5 } as any)).toBe(true); });
  it('does not flag below threshold', () => { expect(isLeech({ lapses: 4 } as any)).toBe(false); });
});
```

- [ ] **Step 2: Run — expect FAIL** (threshold is 8)
- [ ] **Step 3: Change `leech_lapses_threshold` to `5`** in `lib/srs/config.ts`. Confirm `resetLeech` resurfaces a reset card (read `lib/srs/leeches.ts` + the reset path in `repository.ts`; if a reset leech does not re-enter the new/review queue, fix it so it does).
- [ ] **Step 4: Run tests — expect PASS**
- [ ] **Step 5: Commit** — `git commit -m "feat(srs): lower leech threshold 8->5 (E12)"`

---

### Task 4: Decouple XP from the FSRS rating (E12)

XP currently rewards Easy (+5) more than Good (+1), nudging learners to self-rate "Easy" and corrupt scheduling. Make XP independent of the grade.

**Files:**
- Investigate then modify: `lib/xp/` (the XP award function) and its caller (likely `components/ExerciseRunner.tsx` grade handler / `lib/db/repository.ts`)
- Test: `tests/unit/xp-award.test.ts`

**Interfaces:**
- Produces: XP per answered card no longer depends on the FSRS rating (1–4). Award a flat amount per correct answer (e.g. `+2`), optionally `0` for "Again"/incorrect — but identical for Hard/Good/Easy.

- [ ] **Step 1: Investigate** — `grep -rnE "xp|XP|rating|RATING|easy|good|hard|again|\\+ ?[0-9]" lib/xp lib/db/repository.ts components/ExerciseRunner.tsx | head -40`. Identify the function that maps rating → XP. Read it.

- [ ] **Step 2: Write the failing test** (Hard, Good, Easy yield equal XP; only correctness matters)

```ts
// tests/unit/xp-award.test.ts
import { describe, it, expect } from 'vitest';
import { xpForRating } from '@/lib/xp'; // adjust import to the real export found in Step 1

describe('xp decoupled from FSRS rating (E12)', () => {
  it('Hard, Good, Easy award the same XP', () => {
    expect(xpForRating(2)).toBe(xpForRating(3));
    expect(xpForRating(3)).toBe(xpForRating(4));
  });
  it('Again (1) awards no more than a correct grade', () => {
    expect(xpForRating(1)).toBeLessThanOrEqual(xpForRating(3));
  });
});
```

- [ ] **Step 3: Run — expect FAIL** (Easy currently > Good)

- [ ] **Step 4: Implement** — replace the rating-scaled XP with a flat rule (correct grades 2–4 → same XP, e.g. `2`; Again `1` → `0` or a small fixed amount). Keep the function signature its callers use (rename the test import to match the real export).

- [ ] **Step 5: Run tests + build — expect PASS**
- [ ] **Step 6: Commit** — `git commit -m "fix(xp): decouple XP from FSRS rating to protect scheduling (E12)"`

---

## Self-Review
- **Spec coverage:** E6 interleaving → Task 1; E12 new-card floor → Task 2, leech threshold → Task 3, XP decoupling → Task 4.
- **Placeholder scan:** Task 4 Step 1 is an explicit investigation (the XP export name must be discovered) — the test import is adjusted to the real name in Step 4; not a placeholder. All other steps carry complete code.
- **Type consistency:** `interleave(cards, conceptOf, typeOf)` and `buildDueQueue` `newCardsFloor` consistent between code and tests; `FSRS_CONFIG.leech_lapses_threshold` referenced consistently.
- **Independence:** 5d is independent of 5a/5b/5c (pure SRS/engagement logic) and can be executed in any order relative to them.
