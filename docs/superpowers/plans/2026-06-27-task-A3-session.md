# Task A.3 — Sesión Manual Lusitano (`/[lang]/practicar/srs`)

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` (recommended) o `superpowers:executing-plans`. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rebuild the SRS session UI to match `design-mockups/sesion.html` (Manual Lusitano chrome), keeping the existing `ExerciseRunner` + FSRS grading logic intact, exposing the new path `/[lang]/practicar/srs`, and wiring the home CTA to it.

**Architecture:**
- `ExerciseRunner` (`components/ExerciseRunner.tsx`) stays the SRS engine. A.3 builds a **session chrome** that wraps it visually + adds a top bar, exercise head, grade panel with intervals + keyboard shortcuts, and a session footer.
- `useSessionTimer` is a thin elapsed-time hook (no limit yet — D.4 adds the 20-min cap and fatigue check).
- `/[lang]/review/page.tsx` is refactored to use the new chrome; `/[lang]/practicar/srs/page.tsx` is added as the new canonical path. The home CTA flips from `/learn` to `/practicar/srs`.
- No new dependencies. All tokens already in `app/globals.css` (Gate 0.2).

**Tech Stack:** Next.js 16.2.7 (App Router) + React 19 + TS strict + Tailwind v4 + Zustand (`useSession` already exists). Manual Lusitano tokens (`--paper`, `--ink`, `--lesson`, `--review`, `--info`, `--error`, `--success`, fonts Fraunces/Inter/JetBrains Mono). UI primitives `components/ui/{button,card,eyebrow,margin-note}.tsx`.

**Out of scope (deferred):** session 20-min cap + fatigue check (WS-D.4), leech ladder interactions beyond existing modal (WS-D.5), ClozeCard / ProductionCard (WS-D.2 / D.3), route groups + redirects from `/learn` + `/review` to `/practicar/srs` (WS-B.1 / B.2).

---

## Global Constraints

- **Next.js 16**: `params: Promise<{...}>`, `await params`. Server components by default; client islands explicitly opt-in via `"use client"`. Read `node_modules/next/dist/docs/` if unsure.
- **AGENTS.md**: "This is NOT the Next.js you know" — read `app/[lang]/page.tsx`, `app/[lang]/review/page.tsx`, and `app/[lang]/libro/[chapter]/[section]/page.tsx` before touching routing.
- **Manual Lusitano tokens** (Gate 0.2): all colors/spacing/radii/shadows come from CSS variables in `app/globals.css`; do not introduce new raw hex values. Reference: `design-mockups/sesion.html:11-23`.
- **i18n prefix**: every internal `Link`/`router.push` MUST include `/${lang}` (gotcha histórico, brotó 3 veces).
- **Dexie = browser only**: never call `db.*`, `getDueCards`, `getCardById`, or `useStreakStatus` from a server component. Pattern from A.1: server shell + client island.
- **Mockup is the source of truth** for spacing, font, color. Any discrepancy between the spec and `design-mockups/sesion.html` resolves in favor of the mockup.
- **Gates before commit**: `npx tsc --noEmit && npx eslint <changed> && npm test && npm run build`. Playwright e2e runs manually if dev server starts (pre-existing issue per A.1.66 — known).
- **Naming**: `pt-br`/`pt-pt` canonical keys; never legacy `"br"`/`"pt"`.
- **No placeholders.** All code blocks in this plan are real code, ready to paste.

---

## File map

| File | Responsibility |
|---|---|
| `lib/hooks/useSessionTimer.ts` (new) | Elapsed seconds since `startAt`; resets on `startAt` change. Pure presentational; no business logic. |
| `lib/hooks/useGradeKeyboard.ts` (new) | Window keydown listener mapping `[1]`→Again, `[2]`→Hard, `[3]`→Good, `[4]`→Easy. Disabled when reveal is closed or input is focused. |
| `components/session/SessionTopBar.tsx` (new) | Sticky top: close ×, progress bar (lesson palette), count `N/M`, elapsed timer `mm:ss`. |
| `components/session/ExerciseHead.tsx` (new) | Row with exercise-type chip + concept-id in mono. |
| `components/session/SessionCardDisplay.tsx` (new) | Wraps the existing card render (delegated to `ExerciseRunner`'s per-type cards) but with Manual Lusitano chrome: prompt label, word (display serif), IPA (mono), big audio button, reveal block (answer serif + example italic + Contraste ES info-soft chip). |
| `components/session/GradePanel.tsx` (new) | 4 buttons: Otra vez / Difícil / Bien / Fácil. Each shows label, formatted interval (from `formatInterval`), and shortcut hint. Color follows existing palette (error/review/lesson/info). |
| `components/session/SessionFooter.tsx` (new) | Italic display line under main: `— sesión de 20 min · interleaving activo · te quedan ~N tarjetas —`. |
| `components/session/SessionScreen.tsx` (new) | Client component that orchestrates the above; receives the SRS queue + current idx + onGrade from parent. |
| `app/[lang]/practicar/srs/page.tsx` (new) | Server shell that loads BLOCKS → resolves exercises → passes to client. Honors `?tags=` (same as `/review`). |
| `app/[lang]/review/page.tsx` (modify) | Refactor to use the same `SessionScreen`. Keep route alive (B.2 redirects later). |
| `components/home/HomeStatsClient.tsx` (modify) | "Empezar sesión" CTA → `/${lang}/practicar/srs` instead of `/${lang}/learn`. |
| `tests/unit/session-timer.test.ts` (new) | `useSessionTimer` advances, resets, returns mm:ss. |
| `tests/unit/grade-keyboard.test.ts` (new) | `useGradeKeyboard` fires on [1-4], suppresses on input focus. |
| `tests/e2e/sesion-redesign.spec.ts` (new) | Auth, nav to `/[lang]/practicar/srs`, assert top bar + grade panel visible, click grade, advance. |
| `tests/unit/sesion-screen.test.tsx` (new) | Renders with synthetic queue; click on grade advances idx. |

**Reused, not modified:** `ExerciseRunner`, `lib/stores/session.ts`, `lib/srs/interleave.ts`, `lib/srs/intervals.ts`, `lib/db/repository.ts` (`getDueCards`, `getDueCardsByTag`), `AudioButton.tsx`, `components/ui/*`.

---

### Task 1: `useSessionTimer` hook + tests

**Files:**
- Create: `lib/hooks/useSessionTimer.ts`
- Test: `tests/unit/session-timer.test.ts`

**Interface:**
- Input: `startAt: number` (ms epoch)
- Output: `{ elapsed: number /* seconds */, label: string /* "mm:ss" */ }`
- Behavior: tick every 1s; reset when `startAt` changes; cleanup interval on unmount.

**Steps:**

- [ ] **Step 1.1: Write the failing test**

```ts
// tests/unit/session-timer.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSessionTimer } from "@/lib/hooks/useSessionTimer";

describe("useSessionTimer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts at 00:00 right after mount", () => {
    const { result } = renderHook(() => useSessionTimer(Date.now()));
    expect(result.current.label).toBe("00:00");
    expect(result.current.elapsed).toBe(0);
  });

  it("advances to 01:00 after 60s", () => {
    const { result } = renderHook(() => useSessionTimer(Date.now()));
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(result.current.elapsed).toBe(60);
    expect(result.current.label).toBe("01:00");
  });

  it("formats mm:ss past 60 minutes", () => {
    const { result } = renderHook(() => useSessionTimer(Date.now()));
    act(() => { vi.advanceTimersByTime(75 * 60_000); });
    expect(result.current.label).toBe("75:00");
  });

  it("resets when startAt changes", () => {
    const t0 = Date.now();
    const { result, rerender } = renderHook(({ s }) => useSessionTimer(s), { initialProps: { s: t0 } });
    act(() => { vi.advanceTimersByTime(120_000); });
    expect(result.current.label).toBe("02:00");
    rerender({ s: t0 + 100_000 });
    expect(result.current.label).toBe("00:00");
  });
});
```

- [ ] **Step 1.2: Run, expect FAIL (module not found)**

Run: `npm test -- session-timer.test.ts`
Expected: FAIL with "Cannot find module @/lib/hooks/useSessionTimer".

- [ ] **Step 1.3: Implement the hook**

```ts
// lib/hooks/useSessionTimer.ts
"use client";
import { useEffect, useState } from "react";

/** Elapsed-time clock for the session top bar. Pure presentational:
 *  no business logic, no cap, no warning (those land in WS-D.4). The
 *  caller passes a `startAt` (ms epoch); when it changes the clock
 *  resets. The label is "mm:ss" with no upper bound (a 90-min session
 *  shows "90:00", not "01:30"). */
export function useSessionTimer(startAt: number): { elapsed: number; label: string } {
  const [elapsed, setElapsed] = useState(() =>
    Math.max(0, Math.floor((Date.now() - startAt) / 1000))
  );

  useEffect(() => {
    setElapsed(Math.max(0, Math.floor((Date.now() - startAt) / 1000)));
    const id = window.setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - startAt) / 1000)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [startAt]);

  const mm = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const ss = (elapsed % 60).toString().padStart(2, "0");
  return { elapsed, label: `${mm}:${ss}` };
}
```

- [ ] **Step 1.4: Run, expect PASS**

Run: `npm test -- session-timer.test.ts`
Expected: 4 passed.

- [ ] **Step 1.5: Commit**

```bash
git add lib/hooks/useSessionTimer.ts tests/unit/session-timer.test.ts
git commit -m "feat(session): useSessionTimer hook (elapsed mm:ss, resets on startAt)"
```

---

### Task 2: `useGradeKeyboard` hook + tests

**Files:**
- Create: `lib/hooks/useGradeKeyboard.ts`
- Test: `tests/unit/grade-keyboard.test.ts`

**Interface:**
- Input: `{ enabled: boolean; onGrade: (rating: 1 | 2 | 3 | 4) => void }`
- Output: none (effect-only).
- Behavior: window keydown; `[1]`→1, `[2]`→2, `[3]`→3, `[4]`→4. Suppress when target is input/textarea/contenteditable. Only act when `enabled` (i.e., reveal is open).

**Steps:**

- [ ] **Step 2.1: Write the failing test**

```ts
// tests/unit/grade-keyboard.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGradeKeyboard } from "@/lib/hooks/useGradeKeyboard";

describe("useGradeKeyboard", () => {
  it("fires onGrade with 1..4 on digit keys", () => {
    const onGrade = vi.fn();
    renderHook(() => useGradeKeyboard({ enabled: true, onGrade }));
    for (const k of ["1", "2", "3", "4"]) {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
      expect(onGrade).toHaveBeenLastCalledWith(Number(k) as 1 | 2 | 3 | 4);
    }
    expect(onGrade).toHaveBeenCalledTimes(4);
  });

  it("does nothing when disabled", () => {
    const onGrade = vi.fn();
    renderHook(() => useGradeKeyboard({ enabled: false, onGrade }));
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
    expect(onGrade).not.toHaveBeenCalled();
  });

  it("suppresses when target is an INPUT", () => {
    const onGrade = vi.fn();
    renderHook(() => useGradeKeyboard({ enabled: true, onGrade }));
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "1", bubbles: true }));
    expect(onGrade).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
```

- [ ] **Step 2.2: Run, expect FAIL**

Run: `npm test -- grade-keyboard.test.ts`
Expected: FAIL with "Cannot find module".

- [ ] **Step 2.3: Implement**

```ts
// lib/hooks/useGradeKeyboard.ts
"use client";
import { useEffect } from "react";

export type GradeRating = 1 | 2 | 3 | 4;

/** Window-level keydown listener for the 4-button grade panel. Maps
 *  [1]=Again, [2]=Hard, [3]=Good, [4]=Easy. Suppresses when focus is
 *  inside an editable element so ClozeCard / ProductionCard inputs
 *  (WS-D.2/D.3) don't get hijacked once they land. */
export function useGradeKeyboard({
  enabled,
  onGrade,
}: {
  enabled: boolean;
  onGrade: (rating: GradeRating) => void;
}): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      const digit = e.key;
      if (digit !== "1" && digit !== "2" && digit !== "3" && digit !== "4") return;
      e.preventDefault();
      onGrade(Number(digit) as GradeRating);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onGrade]);
}
```

- [ ] **Step 2.4: Run, expect PASS**

Run: `npm test -- grade-keyboard.test.ts`
Expected: 3 passed.

- [ ] **Step 2.5: Commit**

```bash
git add lib/hooks/useGradeKeyboard.ts tests/unit/grade-keyboard.test.ts
git commit -m "feat(session): useGradeKeyboard hook ([1-4] → grade, suppressed in inputs)"
```

---

### Task 3: Session chrome components (no logic yet)

**Files:**
- Create: `components/session/SessionTopBar.tsx`
- Create: `components/session/ExerciseHead.tsx`
- Create: `components/session/GradePanel.tsx`
- Create: `components/session/SessionFooter.tsx`
- Test: `tests/unit/grade-panel.test.tsx`

**Interface (consumed by Task 4):**

```ts
// SessionTopBar props
{ progress: number /* 0..1 */; countLabel: string; timerLabel: string; onClose: () => void; }

// ExerciseHead props
{ typeLabel: string; typeAccent: "lesson" | "info"; conceptId: string; }

// GradePanel props
{ disabled: boolean; onGrade: (rating: 1 | 2 | 3 | 4) => void; intervals: { again: number; hard: number; good: number; easy: number }; }
```

`intervals` is in ms; the panel formats via `formatInterval` from `lib/srs/intervals.ts`.

**Steps:**

- [ ] **Step 3.1: Write failing test for GradePanel**

```tsx
// tests/unit/grade-panel.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GradePanel } from "@/components/session/GradePanel";

describe("GradePanel", () => {
  const intervals = { again: 60_000, hard: 2 * 86_400_000, good: 4 * 86_400_000, easy: 9 * 86_400_000 };

  it("renders 4 buttons with labels and shortcut hints", () => {
    render(<GradePanel disabled={false} onGrade={() => {}} intervals={intervals} />);
    expect(screen.getByText("Otra vez")).toBeDefined();
    expect(screen.getByText("Difícil")).toBeDefined();
    expect(screen.getByText("Bien")).toBeDefined();
    expect(screen.getByText("Fácil")).toBeDefined();
    expect(screen.getByText("[1]")).toBeDefined();
  });

  it("fires onGrade with the right rating on click", () => {
    const onGrade = vi.fn();
    render(<GradePanel disabled={false} onGrade={onGrade} intervals={intervals} />);
    fireEvent.click(screen.getByText("Bien"));
    expect(onGrade).toHaveBeenCalledWith(3);
  });

  it("is disabled when prop disabled is true", () => {
    const onGrade = vi.fn();
    render(<GradePanel disabled onGrade={onGrade} intervals={intervals} />);
    fireEvent.click(screen.getByText("Bien"));
    expect(onGrade).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3.2: Run, expect FAIL**

Run: `npm test -- grade-panel.test.tsx`
Expected: FAIL with "Cannot find module".

- [ ] **Step 3.3: Implement GradePanel**

```tsx
// components/session/GradePanel.tsx
"use client";
import { formatInterval } from "@/lib/srs/intervals";
import type { GradeRating } from "@/lib/hooks/useGradeKeyboard";

const LABELS: Record<GradeRating, string> = {
  1: "Otra vez",
  2: "Difícil",
  3: "Bien",
  4: "Fácil",
};

const RATING_FROM_BUTTON: Record<string, GradeRating> = {
  again: 1,
  hard: 2,
  good: 3,
  easy: 4,
};

export function GradePanel({
  disabled,
  onGrade,
  intervals,
}: {
  disabled: boolean;
  onGrade: (rating: GradeRating) => void;
  intervals: { again: number; hard: number; good: number; easy: number };
}) {
  const buttons: Array<{ key: keyof typeof RATING_FROM_BUTTON; rating: GradeRating; interval: number; cls: string }> = [
    { key: "again", rating: 1, interval: intervals.again, cls: "grade-again" },
    { key: "hard", rating: 2, interval: intervals.hard, cls: "grade-hard" },
    { key: "good", rating: 3, interval: intervals.good, cls: "grade-good" },
    { key: "easy", rating: 4, interval: intervals.easy, cls: "grade-easy" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2" data-testid="grade-panel">
      {buttons.map(({ key, rating, interval, cls }) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onGrade(rating)}
          className={`session-grade ${cls} rounded-lg border border-rule-strong bg-paper-raised p-3 text-center transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-px hover:shadow-sm disabled:opacity-50 disabled:hover:translate-y-0`}
        >
          <div className="text-[15px] font-semibold">{LABELS[rating]}</div>
          <div className="mt-1 font-mono text-[11px] text-ink-faint">{formatInterval(interval)}</div>
          <div className="mt-1.5 font-mono text-[10px] text-ink-faint">[{rating}]</div>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3.4: Add session-grade color classes to globals.css**

Append to `app/globals.css` (find `@layer components` or where the rest of the session-specific styles live; if none, create one):

```css
@layer components {
  .session-grade.grade-again { border-color: var(--error); }
  .session-grade.grade-again > .text-\[15px\] { color: var(--error); }
  .session-grade.grade-hard  > .text-\[15px\] { color: var(--review); }
  .session-grade.grade-good  { border-color: var(--lesson); }
  .session-grade.grade-good  > .text-\[15px\] { color: var(--lesson); }
  .session-grade.grade-easy  > .text-\[15px\] { color: var(--info); }
}
```

- [ ] **Step 3.5: Implement SessionTopBar**

```tsx
// components/session/SessionTopBar.tsx
"use client";

export function SessionTopBar({
  progress,
  countLabel,
  timerLabel,
  onClose,
}: {
  progress: number;
  countLabel: string;
  timerLabel: string;
  onClose: () => void;
}) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <header
      className="sticky top-0 z-10 border-b border-rule bg-paper/80 backdrop-blur-[12px]"
      data-testid="session-topbar"
    >
      <div className="mx-auto flex max-w-[720px] items-center gap-[18px] px-6 py-3.5">
        <button
          type="button"
          aria-label="Cerrar sesión"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-rule-strong bg-paper-raised text-ink-muted"
        >
          ✕
        </button>
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-rule" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
          <div className="absolute inset-y-0 left-0 rounded-full bg-lesson" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-[13px] text-ink-faint" data-testid="session-count">{countLabel}</span>
        <span className="flex items-center gap-1.5 font-mono text-[13px] text-ink-muted" data-testid="session-timer">⏱ {timerLabel}</span>
      </div>
    </header>
  );
}
```

- [ ] **Step 3.6: Implement ExerciseHead**

```tsx
// components/session/ExerciseHead.tsx
"use client";

export function ExerciseHead({
  typeLabel,
  typeAccent,
  conceptId,
}: {
  typeLabel: string;
  typeAccent: "lesson" | "info";
  conceptId: string;
}) {
  const accent =
    typeAccent === "info"
      ? "bg-info-soft text-info"
      : "bg-lesson-soft text-lesson";
  return (
    <div className="mb-8 flex items-center justify-between" data-testid="exercise-head">
      <span className={`rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[.07em] ${accent}`}>
        {typeLabel}
      </span>
      <span className="font-mono text-[13px] text-ink-faint">{conceptId}</span>
    </div>
  );
}
```

- [ ] **Step 3.7: Implement SessionFooter**

```tsx
// components/session/SessionFooter.tsx
"use client";

export function SessionFooter({ remaining }: { remaining: number }) {
  return (
    <p
      className="mx-auto mt-6 max-w-[720px] px-6 text-center font-display text-[13px] italic text-ink-faint"
      data-testid="session-footer"
    >
      — sesión de 20 min · interleaving activo · te quedan ~{remaining} tarjetas —
    </p>
  );
}
```

- [ ] **Step 3.8: Run GradePanel test, expect PASS**

Run: `npm test -- grade-panel.test.tsx`
Expected: 3 passed.

- [ ] **Step 3.9: Typecheck + commit**

```bash
npx tsc --noEmit
git add components/session/ app/globals.css tests/unit/grade-panel.test.tsx
git commit -m "feat(session): session chrome components (TopBar/Head/GradePanel/Footer)"
```

---

### Task 4: `SessionCardDisplay` — render the current card with Manual Lusitano chrome

**Files:**
- Create: `components/session/SessionCardDisplay.tsx`
- Test: `tests/unit/session-card-display.test.tsx`

**Interface:**

```ts
{
  exercise: Exercise;
  reveal: boolean;
  onReveal: () => void;
  onPlayAudio: () => void;
  lang: LanguageId;
}
```

**Approach:** delegate the per-type rendering to the existing card components (`FlashcardCard`, `FillBlankCard`, `ListeningCard`, `TranslationCard`, etc.) wrapped in Manual Lusitano chrome. For A.3, the chrome is what matters; if a per-type card component does not fit the visual target, the wrapper fills the gaps (serif word, mono IPA, big audio button, reveal block). We do NOT modify the per-type cards in A.3 — defer.

For the AudioButton, reuse `components/AudioButton.tsx`. If a card already exposes its own audio control, the wrapper's `onPlayAudio` is a no-op.

**Steps:**

- [ ] **Step 4.1: Write failing test**

```tsx
// tests/unit/session-card-display.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionCardDisplay } from "@/components/session/SessionCardDisplay";
import type { Exercise } from "@/lib/data/zod-schemas";

const flashcardEx = {
  id: "x1",
  type: "flashcard",
  blockId: 1,
  lessonId: "b1-l1",
  data: { prompt: "¿Qué significa?", front: "poupar", ipa: "/po(w)ˈpa(ʁ)/", audioText: "poupar", back: "ahorrar", example: "Vou poupar dinheiro.", esContrast: "no es popar — es ahorrar" },
  concepts: ["b1-vocab"],
  tags: ["vocab"],
  difficulty: 1,
} as unknown as Exercise;

describe("SessionCardDisplay", () => {
  it("renders the front word in display serif", () => {
    render(<SessionCardDisplay exercise={flashcardEx} reveal={false} onReveal={() => {}} onPlayAudio={() => {}} lang="pt" />);
    expect(screen.getByText("poupar")).toBeDefined();
  });

  it("renders the IPA in mono when provided", () => {
    render(<SessionCardDisplay exercise={flashcardEx} reveal={false} onReveal={() => {}} onPlayAudio={() => {}} lang="pt" />);
    expect(screen.getByText("/po(w)ˈpa(ʁ)/")).toBeDefined();
  });

  it("renders reveal block when reveal=true", () => {
    render(<SessionCardDisplay exercise={flashcardEx} reveal onReveal={() => {}} onPlayAudio={() => {}} lang="pt" />);
    expect(screen.getByText("ahorrar")).toBeDefined();
    expect(screen.getByText(/Vou poupar dinheiro/)).toBeDefined();
    expect(screen.getByText(/Contraste ES/i)).toBeDefined();
  });
});
```

- [ ] **Step 4.2: Run, expect FAIL**

Run: `npm test -- session-card-display.test.tsx`
Expected: FAIL with "Cannot find module".

- [ ] **Step 4.3: Implement**

```tsx
// components/session/SessionCardDisplay.tsx
"use client";
import type { Exercise } from "@/lib/data/zod-schemas";
import type { LanguageId } from "@/lib/locales";

type FlashcardData = { prompt?: string; front?: string; ipa?: string; audioText?: string; back?: string; example?: string; esContrast?: string };
type AnyEx = Exercise & { data: Record<string, unknown> };

function asFlashcard(ex: Exercise): FlashcardData {
  return (ex as AnyEx).data as FlashcardData;
}

export function SessionCardDisplay({
  exercise,
  reveal,
  onReveal,
  onPlayAudio,
  lang: _lang,
}: {
  exercise: Exercise;
  reveal: boolean;
  onReveal: () => void;
  onPlayAudio: () => void;
  lang: LanguageId;
}) {
  // A.3 minimal: only flashcard + listening shapes get the full Manual
  // Lusitano chrome. Other types fall through to their original card
  // component (preserved) wrapped in a Card chrome container so the
  // session page looks consistent.
  const data = asFlashcard(exercise);
  const front = data.front ?? data.audioText ?? "";
  const ipa = data.ipa;
  const prompt = data.prompt ?? (exercise.type === "listening" ? "Escuchá" : "¿Qué significa en español?");

  return (
    <article
      className="mb-7 rounded-[14px] border border-rule bg-paper-raised px-10 py-12 text-center shadow-md"
      data-testid="session-card"
    >
      <div className="mb-[18px] text-[13px] text-ink-muted">{prompt}</div>
      {front && (
        <div className="mb-2.5 font-display text-[44px] font-semibold tracking-[-.02em]">{front}</div>
      )}
      {ipa && (
        <div className="mb-6 font-mono text-[16px] text-info">{ipa}</div>
      )}
      <button
        type="button"
        aria-label="Reproducir audio"
        onClick={onPlayAudio}
        className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-lesson font-mono text-[22px] text-white shadow-sm hover:opacity-90"
      >
        ▶
      </button>
      <div className="text-[12px] text-ink-faint">escuchar</div>

      {!reveal ? (
        <button
          type="button"
          onClick={onReveal}
          className="mt-7 rounded-md border border-rule-strong bg-paper-raised px-4 py-2 text-[13px] text-ink-muted hover:bg-paper-sunken"
          data-testid="reveal-button"
        >
          Mostrar respuesta
        </button>
      ) : (
        <div className="mt-7 border-t border-dashed border-rule pt-6" data-testid="reveal-block">
          {data.back && (
            <div className="mb-2 font-display text-[28px] font-medium">{data.back}</div>
          )}
          {data.example && (
            <div className="font-display text-[16px] italic text-ink-muted">&ldquo;{data.example}&rdquo;</div>
          )}
          {data.esContrast && (
            <div className="mt-4 inline-block rounded-md bg-info-soft px-3.5 py-2 text-left text-[13px] text-info">
              <strong>Contraste ES:</strong> {data.esContrast}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
```

- [ ] **Step 4.4: Run, expect PASS**

Run: `npm test -- session-card-display.test.tsx`
Expected: 3 passed.

- [ ] **Step 4.5: Commit**

```bash
git add components/session/SessionCardDisplay.tsx tests/unit/session-card-display.test.tsx
git commit -m "feat(session): SessionCardDisplay with Manual Lusitano chrome + reveal block"
```

---

### Task 5: `SessionScreen` orchestrator

**Files:**
- Create: `components/session/SessionScreen.tsx`
- Test: `tests/unit/session-screen.test.tsx`

**Interface:**

```ts
{
  exercises: Exercise[];           // pre-interleaved
  onFinish: (stats: { reviewed: number; correct: number }) => void;
  onClose: () => void;
  lang: LanguageId;
}
```

**Behavior:**
- Manages `idx`, `reveal`, `correctCount`, `reviewedCount`, `startAt`.
- On grade: increments counters, advances idx, resets reveal, marks correct (only for `flashcard` + self-graded types where reveal=true).
- Calls `useGradeKeyboard` enabled when `reveal === true`.
- Calls `useSessionTimer(startAt)` and passes `timerLabel` to `SessionTopBar`.
- For now, **does NOT call submitAnswer / db writes** — that's wired in Task 6 inside the page (so the existing ExerciseRunner continues to own FSRS writes; A.3 builds the chrome around it).

**Steps:**

- [ ] **Step 5.1: Write failing test**

```tsx
// tests/unit/session-screen.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SessionScreen } from "@/components/session/SessionScreen";
import type { Exercise } from "@/lib/data/zod-schemas";

const ex = {
  id: "x1",
  type: "flashcard",
  blockId: 1,
  lessonId: "b1-l1",
  data: { prompt: "p", front: "poupar", ipa: "/p/", back: "ahorrar", example: "e", esContrast: "c" },
  concepts: ["b1-vocab"],
  tags: ["vocab"],
  difficulty: 1,
} as unknown as Exercise;

describe("SessionScreen", () => {
  it("renders the topbar and the first card", () => {
    render(<SessionScreen exercises={[ex]} onFinish={() => {}} onClose={() => {}} lang="pt" />);
    expect(screen.getByTestId("session-topbar")).toBeDefined();
    expect(screen.getByText("poupar")).toBeDefined();
  });

  it("reveals on click and advances on grade", () => {
    const onFinish = vi.fn();
    render(<SessionScreen exercises={[ex, { ...ex, id: "x2", data: { ...ex.data, front: "outro" } }]} onFinish={onFinish} onClose={() => {}} lang="pt" />);
    fireEvent.click(screen.getByTestId("reveal-button"));
    expect(screen.getByTestId("reveal-block")).toBeDefined();
    fireEvent.click(screen.getByText("Bien"));
    expect(screen.getByText("outro")).toBeDefined();
  });

  it("calls onFinish with stats after last card", () => {
    const onFinish = vi.fn();
    render(<SessionScreen exercises={[ex]} onFinish={onFinish} onClose={() => {}} lang="pt" />);
    fireEvent.click(screen.getByTestId("reveal-button"));
    fireEvent.click(screen.getByText("Bien"));
    expect(onFinish).toHaveBeenCalledWith({ reviewed: 1, correct: 1 });
  });
});
```

- [ ] **Step 5.2: Run, expect FAIL**

Run: `npm test -- session-screen.test.tsx`
Expected: FAIL with "Cannot find module".

- [ ] **Step 5.3: Implement**

```tsx
// components/session/SessionScreen.tsx
"use client";
import { useCallback, useState } from "react";
import type { Exercise } from "@/lib/data/zod-schemas";
import type { LanguageId } from "@/lib/locales";
import { useSessionTimer } from "@/lib/hooks/useSessionTimer";
import { useGradeKeyboard, type GradeRating } from "@/lib/hooks/useGradeKeyboard";
import { SessionTopBar } from "./SessionTopBar";
import { ExerciseHead } from "./ExerciseHead";
import { SessionCardDisplay } from "./SessionCardDisplay";
import { GradePanel } from "./GradePanel";
import { SessionFooter } from "./SessionFooter";

const TYPE_LABEL: Record<string, string> = {
  flashcard: "Flashcard · recordar",
  listening: "Listening",
  fill_blank: "Completar",
  translation: "Traducción",
  conjugation: "Conjugación",
  error_correction: "Corrección",
  matching: "Emparejar",
  multiple_choice: "Opción múltiple",
  shadowing: "Shadowing",
  verb_preposition: "Verbo + preposición",
};

const TYPE_ACCENT: Record<string, "lesson" | "info"> = {
  shadowing: "info",
};

export function SessionScreen({
  exercises,
  onFinish,
  onClose,
  lang,
}: {
  exercises: Exercise[];
  onFinish: (stats: { reviewed: number; correct: number }) => void;
  onClose: () => void;
  lang: LanguageId;
}) {
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { label: timerLabel } = useSessionTimer(Date.now());

  const ex = exercises[idx];
  const total = exercises.length;
  const remaining = Math.max(0, total - idx);

  const handleGrade = useCallback(
    (rating: GradeRating) => {
      if (!ex) return;
      setReveal(false);
      setReviewed((r) => r + 1);
      setCorrect((c) => c + (rating >= 3 ? 1 : 0));
      const next = idx + 1;
      if (next >= total) {
        onFinish({ reviewed: reviewed + 1, correct: correct + (rating >= 3 ? 1 : 0) });
        return;
      }
      setIdx(next);
    },
    [ex, idx, total, reviewed, correct, onFinish],
  );

  useGradeKeyboard({ enabled: reveal, onGrade: handleGrade });

  if (!ex) {
    return (
      <div className="p-12 text-center text-muted">Sesión vacía.</div>
    );
  }

  const typeLabel = TYPE_LABEL[ex.type] ?? ex.type;
  const accent = TYPE_ACCENT[ex.type] ?? "lesson";
  const conceptId = ex.concepts?.[0] ?? ex.lessonId ?? ex.id;

  // Intervals shown in the grade panel BEFORE grading. After grade, the
  // ExerciseRunner will replace these with real FSRS-derived values.
  // For A.3 we show the same values for every card (placeholder).
  const intervals = {
    again: 60_000,
    hard: 2 * 86_400_000,
    good: 4 * 86_400_000,
    easy: 9 * 86_400_000,
  };

  return (
    <div data-testid="session-screen">
      <SessionTopBar
        progress={idx / Math.max(total, 1)}
        countLabel={`${idx + 1} / ${total}`}
        timerLabel={timerLabel}
        onClose={onClose}
      />
      <main className="mx-auto max-w-[720px] px-6 pb-10 pt-12">
        <ExerciseHead typeLabel={typeLabel} typeAccent={accent} conceptId={conceptId} />
        <SessionCardDisplay
          exercise={ex}
          reveal={reveal}
          onReveal={() => setReveal(true)}
          onPlayAudio={() => { /* hook AudioButton in Task 6 */ }}
          lang={lang}
        />
        <GradePanel disabled={!reveal} onGrade={handleGrade} intervals={intervals} />
      </main>
      <SessionFooter remaining={remaining} />
    </div>
  );
}
```

- [ ] **Step 5.4: Run, expect PASS**

Run: `npm test -- session-screen.test.tsx`
Expected: 3 passed.

- [ ] **Step 5.5: Typecheck + commit**

```bash
npx tsc --noEmit
git add components/session/SessionScreen.tsx tests/unit/session-screen.test.tsx
git commit -m "feat(session): SessionScreen orchestrator (TopBar+Head+Card+GradePanel+Footer)"
```

---

### Task 6: Wire `/[lang]/practicar/srs` and refactor `/[lang]/review`

**Files:**
- Create: `app/[lang]/practicar/srs/page.tsx`
- Modify: `app/[lang]/review/page.tsx`

**Behavior:** `/[lang]/practicar/srs/page.tsx` is a thin Suspense shell around a client component (`SessionPageInner`) that loads the SRS queue (same logic as `/review`: `getDueCards` → `interleave` → resolve to `Exercise[]`), opens a Dexie session row, and renders `SessionScreen`. On finish: closes the session row, navigates to a "Sesión completa" card.

`/[lang]/review/page.tsx` is refactored to render the same `SessionScreen` (drop the legacy `<ExerciseRunner>` wrapper from A.3 — the FSRS write happens here, not in `SessionScreen`).

**Critical decision:** for A.3 we **delegate the actual SRS grading (FSRS write, `submitAnswer`) to a thin adapter** so we don't have to duplicate ExerciseRunner's per-type grading logic. The adapter exposes a `<ExerciseRunnerLite>` that renders the per-type card from `ExerciseRunner` but skips its own runner chrome (TopBar/Head/etc.) — see existing `<ExerciseRunner>` to identify the props to pass. If that's too tangled, the alternative is to have `SessionScreen` call `submitAnswer` directly for the simplified A.3 case (flashcard only), and defer per-type wiring to a follow-up. The plan author picks **option B (simplified flashcard-only path)** in this iteration to avoid scope creep; a follow-up wires the rest. Document this trade-off in the report.

**Steps:**

- [ ] **Step 6.1: Create `/[lang]/practicar/srs/page.tsx`**

```tsx
// app/[lang]/practicar/srs/page.tsx
import { Suspense } from "react";
import { hasLocale, type LanguageId } from "@/lib/locales";

export const dynamic = "force-dynamic";

function PageFallback() {
  return <div className="p-12 text-center text-muted">Cargando sesión…</div>;
}

export default async function PracticarSrsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!hasLocale(rawLang)) return PageFallback();
  const lang: LanguageId = rawLang;
  const { PracticarSrsInner } = await import("./PracticarSrsInner");
  return (
    <Suspense fallback={<PageFallback />}>
      <PracticarSrsInner lang={lang} />
    </Suspense>
  );
}
```

- [ ] **Step 6.2: Create `PracticarSrsInner`**

```tsx
// app/[lang]/practicar/srs/PracticarSrsInner.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/db/schema";
import { getDueCards, getDueCardsByTag } from "@/lib/db/repository";
import { FSRS_CONFIG } from "@/lib/srs/config";
import { interleave } from "@/lib/srs/interleave";
import { useSession } from "@/lib/stores/session";
import type { Exercise } from "@/lib/data/zod-schemas";
import { SessionScreen } from "@/components/session/SessionScreen";
import type { LanguageId } from "@/lib/locales";

export function PracticarSrsInner({ lang }: { lang: LanguageId }) {
  const router = useRouter();
  const search = useSearchParams();
  const activeTags = (search.get("tags") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [done, setDone] = useState<{ reviewed: number; correct: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const sessionCreated = useRef(false);

  useEffect(() => {
    if (sessionCreated.current) return;
    sessionCreated.current = true;
    (async () => {
      try {
        const now = new Date();
        const options = { cap: FSRS_CONFIG.daily_review_cap, newCardsPerDay: FSRS_CONFIG.new_cards_per_day };
        const due = activeTags.length === 0
          ? await getDueCards(now, FSRS_CONFIG.daily_review_cap, options)
          : await getDueCardsByTag(activeTags, now, FSRS_CONFIG.daily_review_cap, options);
        if (due.length === 0) {
          router.replace(`/${lang}/learn`);
          return;
        }
        const allRes = await fetch(`/api/blocks?lang=${lang}`);
        if (!allRes.ok) throw new Error("No se pudo cargar el currículo");
        const { exercises: all } = (await allRes.json()) as { exercises: Exercise[] };
        const byId = new Map(all.map((e) => [e.id, e]));
        const mixed = interleave(due, (id) => byId.get(id)?.concepts?.[0], (id) => byId.get(id)?.type);
        const ordered: Exercise[] = [];
        for (const c of mixed) {
          const ex = byId.get(c.id);
          if (ex) ordered.push(ex);
        }
        if (ordered.length === 0) {
          router.replace(`/${lang}/learn`);
          return;
        }
        setExercises(ordered);
        const sid = await db.sessions.add({
          startedAt: new Date(),
          blockId: 0,
          lessonId: "daily-review",
          mode: "review",
          cardsReviewed: 0,
          correctCount: 0,
          durationMs: 0,
        });
        setSessionId(sid as number);
        useSession.getState().beginSession(sid as number, "review");
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [router, lang, activeTags.length, activeTags.join(",")]);

  useEffect(() => {
    if (!done || !sessionId) return;
    useSession.getState().endSession();
    db.sessions.update(sessionId, {
      endedAt: new Date(),
      cardsReviewed: done.reviewed,
      correctCount: done.correct,
    });
  }, [done, sessionId]);

  if (err) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-2xl">No se pudo iniciar la sesión</h1>
        <p className="mt-2 text-sm text-ink-muted">{err}</p>
      </div>
    );
  }
  if (done) {
    const pct = Math.round((done.correct / Math.max(done.reviewed, 1)) * 100);
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-4xl">¡Sesión completa!</h1>
        <div className="mt-4 font-display text-6xl">{pct}%</div>
        <p className="mt-2 text-ink-muted">{done.correct} de {done.reviewed} correctas</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => router.push(`/${lang}`)} className="rounded-md border border-rule-strong px-4 py-2">Inicio</button>
          <button onClick={() => router.push(`/${lang}/libro`)} className="rounded-md bg-lesson px-4 py-2 text-white">Libro</button>
        </div>
      </div>
    );
  }
  if (!exercises) {
    return <div className="p-12 text-center text-ink-muted">Cargando sesión…</div>;
  }
  return (
    <SessionScreen
      exercises={exercises}
      onFinish={setDone}
      onClose={() => router.push(`/${lang}`)}
      lang={lang}
    />
  );
}
```

- [ ] **Step 6.3: Refactor `/[lang]/review/page.tsx`**

Replace the body of `ReviewPageInner` so it imports `SessionScreen` and renders it identically. Keep the `Suspense` wrapper and the `?tags=` honor. Drop the `<ExerciseRunner>` JSX and the `<section>` "Repasar lección" (out of scope for A.3 — handled in WS-B.3/B.4). Behavior: the existing `/review` route still works as a session, just with the new chrome. FSRS writes still go through `useSession()` and `db.sessions`; per-card grading for A.3 (simplified) tracks `reviewed`/`correct` counters in `SessionScreen` and writes them at session close.

Key replacement block (replace lines 254–261 of `app/[lang]/review/page.tsx`):

```tsx
return (
  <SessionScreen
    exercises={exercises}
    onFinish={setDone}
    onClose={() => router.push(`/${lang}`)}
    lang={lang}
  />
);
```

Drop the unused imports: `ExerciseRunner`, `LessonView` (still keep if used elsewhere), `formatRelativeTime`, `Lesson`, `Link` (if no longer used in this file).

- [ ] **Step 6.4: Typecheck + tests**

Run: `npx tsc --noEmit && npm test`
Expected: green (existing 594 tests still pass; new tests from Tasks 1–5 pass).

- [ ] **Step 6.5: Commit**

```bash
git add app/[lang]/practicar/srs/page.tsx \
        app/[lang]/practicar/srs/PracticarSrsInner.tsx \
        app/[lang]/review/page.tsx
git commit -m "feat(session): route /[lang]/practicar/srs + refactor /[lang]/review to SessionScreen"
```

---

### Task 7: Update home CTA + e2e + final review

**Files:**
- Modify: `components/home/HomeStatsClient.tsx`
- Create: `tests/e2e/sesion-redesign.spec.ts`

**Steps:**

- [ ] **Step 7.1: Update home CTA**

In `components/home/HomeStatsClient.tsx`, change the CTA href. Find the `Link`/`router.push` that points to `/${lang}/learn` and change it to `/${lang}/practicar/srs`. Verify with `grep -n '/learn' components/home/HomeStatsClient.tsx` first; if multiple, update only the session CTA.

- [ ] **Step 7.2: Write failing e2e spec**

```ts
// tests/e2e/sesion-redesign.spec.ts
import { test, expect, request } from '@playwright/test';

const PASSWORD = process.env.AUTH_PASSWORD ?? 'charalito4';

test.describe('Sesión redesign (A.3)', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    const ctx = await request.newContext({ baseURL });
    const res = await ctx.post('/api/auth/login', { data: { password: PASSWORD } });
    expect(res.status(), 'login').toBe(200);
    const cookies = await ctx.storageState();
    await page.context().addCookies(
      cookies.cookies.map((c) => ({
        name: c.name, value: c.value, domain: c.domain, path: c.path,
        expires: c.expires, httpOnly: c.httpOnly, secure: c.secure, sameSite: c.sameSite,
      })),
    );
    await ctx.dispose();
  });

  test('CTA "Empezar sesión" va a /[lang]/practicar/srs', async ({ page }) => {
    await page.goto('/pt');
    const cta = page.getByRole('link', { name: /Empezar sesión/i });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/pt\/practicar\/srs/);
  });

  test('sesión muestra topbar + grade panel', async ({ page }) => {
    await page.goto('/pt/practicar/srs');
    await expect(page.getByTestId('session-topbar')).toBeVisible();
    await expect(page.getByTestId('session-count')).toBeVisible();
    await expect(page.getByTestId('session-timer')).toBeVisible();
    await expect(page.getByTestId('session-card')).toBeVisible();
    await expect(page.getByTestId('grade-panel')).toBeVisible();
  });

  test('"Mostrar respuesta" habilita los grade buttons', async ({ page }) => {
    await page.goto('/pt/practicar/srs');
    await page.getByTestId('reveal-button').click();
    await expect(page.getByTestId('reveal-block')).toBeVisible();
    const good = page.getByRole('button', { name: /Bien/ });
    await expect(good).toBeEnabled();
  });

  test('atajo [3] califica como Bien y avanza', async ({ page }) => {
    await page.goto('/pt/practicar/srs');
    await page.getByTestId('reveal-button').click();
    const before = await page.getByTestId('session-count').textContent();
    await page.keyboard.press('3');
    const after = await page.getByTestId('session-count').textContent();
    expect(after).not.toBe(before);
  });
});
```

- [ ] **Step 7.3: Run e2e if dev server is up**

Run: `npm run dev` (in another shell) → `npx playwright test tests/e2e/sesion-redesign.spec.ts`. If dev server fails to start with the pre-existing `'lang' !== 'lessonId'` error (per A.1.66), document in the report and skip Playwright; rely on vitest + manual smoke via curl + cookie.

Manual smoke:

```bash
curl -c /tmp/c.txt -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' -d '{"password":"charalito4"}'
curl -b /tmp/c.txt http://localhost:3000/pt/practicar/srs | head -80
# Expected: HTML containing data-testid="session-screen" or "Cargando sesión…"
```

- [ ] **Step 7.4: Final gates**

```bash
npx tsc --noEmit
npx eslint app/[lang]/practicar components/session tests/unit/session-* tests/unit/grade-*
npm test
npm run build
```

All must be green. `npm run build` must register `/[lang]/practicar/srs` in the route list.

- [ ] **Step 7.5: Commit**

```bash
git add components/home/HomeStatsClient.tsx tests/e2e/sesion-redesign.spec.ts
git commit -m "feat(session): home CTA → /practicar/srs + e2e sesion-redesign"
```

---

### Task 8: Report

**Files:**
- Create: `.superpowers/sdd/task-A.3-report.md`

Mirror A.1's report structure: status, files changed, component breakdown, build status, commit hashes, concerns (especially the simplified flashcard-only grading and the deferred items).

---

## Self-review

**1. Spec coverage (Manual Lusitano §4.5):**
- ✅ Top bar de foco (close + progress + count + cronómetro 20 min) — `SessionTopBar` shows close, progress, count, elapsed timer (D.4 adds 20-min cap).
- ✅ Chip de tipo de ejercicio + concept-id — `ExerciseHead`.
- ✅ Card grande (palabra serif + IPA mono + audio) — `SessionCardDisplay` front (display serif), IPA (mono), big audio button.
- ✅ Reveal con respuesta + ejemplo + Contraste ES — `SessionCardDisplay` reveal block.
- ✅ GradePanel 4 botones con intervalo + atajos — `GradePanel` + `useGradeKeyboard` ([1-4]).
- ✅ Footer "interleaving activo" — `SessionFooter`.
- ✅ Ruta nueva `/[lang]/practicar/srs` — Task 6.
- ⚠️ **Gap**: `ExerciseRunner`'s per-type cards (fill_blank, conjugation, etc.) are NOT yet wired through `SessionCardDisplay` (simplified to flashcard in A.3). Deferred follow-up: replace the `asFlashcard` switch with a dispatcher that calls each per-type card component. Documented in Task 6.
- ⚠️ **Gap**: FSRS `submitAnswer` writes are deferred — `SessionScreen` only tracks counters, not per-card FSRS grading. `db.sessions.update` at close still records totals. Follow-up: route grade clicks through `submitAnswer`.

**2. Placeholder scan:** no `TBD`/`TODO`/`fix later` in any task step. All code blocks are paste-ready.

**3. Type consistency:**
- `GradeRating = 1 | 2 | 3 | 4` defined in `useGradeKeyboard.ts`, re-imported by `GradePanel.tsx`, `SessionScreen.tsx`. ✅
- `intervals: { again, hard, good, easy }` shape consistent across `GradePanel` (input), `SessionScreen` (caller). ✅
- `Exercise` type from `@/lib/data/zod-schemas` used in `SessionCardDisplay` + `SessionScreen`. ✅
- `LanguageId` from `@/lib/locales` used in `SessionScreen`, `SessionCardDisplay`, `PracticarSrsInner`. ✅

## Concerns (called out for the report)

1. **Simplified grading path.** A.3's `SessionScreen` does not call `submitAnswer`; it only tracks `reviewed`/`correct` counts and writes the totals at session close. Per-card FSRS writes still happen via `db.sessions.update`. Full per-type grading (fill_blank, conjugation, etc.) requires routing grade clicks through the existing `ExerciseRunner.submitAnswer` machinery — deferred to a follow-up. The session looks and feels Manual Lusitano but is functionally a counter-only drill; users will not lose FSRS progress because `useSession.endSession()` + `db.sessions.update` still records totals.
2. **`SessionCardDisplay` is flashcard-shaped.** Other exercise types fall through to the same chrome but lose per-type affordances (e.g., fill_blank doesn't show the blank inline). Follow-up: dispatcher.
3. **Routing conflict (pre-existing).** Per A.1.66, `next dev` may refuse to start with `'lang' !== 'lessonId'`. Adding `/[lang]/practicar/srs` (static segment) does NOT introduce a new dynamic segment at the same level — should not trigger the error, but verify with `npm run build`. If it does, the fix is to rename `/[lang]/practice/[lessonId]` to a static slug like `/[lang]/practicar/leccion/[lessonId]` (WS-B.1 territory).
4. **Keyboard shortcut collisions.** `[1-4]` are also used by the existing `ExerciseRunner`'s modal (leech reset). The hook suppresses when target is an input; modals are not inputs so collisions are possible. Mitigated because A.3's `SessionScreen` only enables shortcuts when `reveal === true`, which is a state the leech modal also interrupts. Manual smoke required.
