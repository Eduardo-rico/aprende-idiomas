# Plan #2 — UI MVP para estudiar Bloque 1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la UI MVP de Aprende Português para que el usuario pueda **estudiar el Bloque 1 end-to-end**: home → bloques → lesson → sesión de práctica con todos los tipos de ejercicio → ver progreso. Sin auth, 100% local.

**Architecture:** Next.js 16 App Router con client components para interactividad. Dexie 4 + ts-fsrs 5.4 para persistencia + SRS. Zustand para estado UI. Reusa patrones de `/Users/lalo/idiomas/ipa-app/` (sibling con UI ya en producción). Tema light cálido (default) con toggle dark, fonts Fraunces + Plus Jakarta Sans, micro-interacciones con framer-motion + canvas-confetti.

**Tech Stack:** Next.js 16 + TypeScript strict + Tailwind v4 + shadcn (vía `@base-ui/react`) + Dexie 4 + ts-fsrs 5.4 + Zustand 5 + framer-motion + canvas-confetti + ts-fsrs + Recharts (para /stats en Plan #3).

**Prerequisites:**
- Plan #1 ejecutado y commiteado (estado actual: ✓).
- 189 exercises del Bloque 1 en `lib/data/blocks/b1.json` con audio refs.
- 308 MP3s en `public/audio/`.
- Working tree limpio, branch `main` sincronizado con GitHub.
- Node 20+.

**Out of scope (deferido a Plan #3+):** mini-historias karaoke, drill mode, concept map, diagnostic test, achievements grid, error queue UI, daily mix con interleaving, shadowing mode.

**Patrones a reusar del sibling** `/Users/lalo/idiomas/ipa-app`:
- `app/layout.tsx`: `html.dark h-full` + `body min-h-full flex flex-col` con `<NavBar />` sticky top
- `components/ui/*`: button, progress, card (shadcn vía `@base-ui/react`)
- `app/globals.css`: tokens OKLCH en `:root` y `.dark` + `@theme inline { --color-* }`
- `components/AudioButton.tsx`: lazy Audio + onerror fallback (sin Web Speech — decisión postponed)
- Micro-interacciones CSS-only: `flip-card` (perspective + rotateY 180deg), `wave-bar` (keyframes)

---

## File Structure (Plan #2)

```
portugues-app/
├── app/
│   ├── layout.tsx                    # root layout (MODIFY: theme + fonts)
│   ├── page.tsx                       # home dashboard (REPLACE)
│   ├── globals.css                    # (MODIFY: theme tokens)
│   ├── learn/
│   │   └── page.tsx                   # NEW: daily mix launcher
│   ├── blocks/
│   │   ├── page.tsx                   # NEW: blocks grid
│   │   └── [id]/
│   │       ├── page.tsx               # NEW: block detail
│   │       └── lessons/
│   │           └── [lid]/
│   │               └── page.tsx       # NEW: lesson detail
│   ├── practice/
│   │   └── [lessonId]/
│   │       └── page.tsx               # NEW: study session
│   └── settings/
│       └── page.tsx                   # NEW: settings
├── components/
│   ├── NavBar.tsx                     # NEW
│   ├── ThemeProvider.tsx              # NEW
│   ├── AudioButton.tsx                # NEW (6 voice variants)
│   ├── ExerciseRunner.tsx             # NEW
│   ├── cards/
│   │   ├── FlashcardCard.tsx
│   │   ├── FillBlankCard.tsx
│   │   ├── ListeningCard.tsx
│   │   ├── TranslationCard.tsx
│   │   └── VerbPrepositionCard.tsx
│   ├── BlockCard.tsx                  # NEW
│   ├── LessonCard.tsx                 # NEW
│   ├── ConceptMastery.tsx             # NEW
│   ├── VariantToggle.tsx              # NEW
│   ├── VoicePicker.tsx                # NEW
│   └── ui/                            # shadcn (CREATE: button, card, progress)
├── lib/
│   ├── data/                          # existing
│   ├── db/
│   │   ├── schema.ts                  # NEW
│   │   └── repository.ts              # NEW
│   ├── srs/
│   │   └── fsrs.ts                    # NEW
│   ├── mastery/
│   │   └── concept.ts                 # NEW
│   ├── audio/
│   │   └── resolve.ts                 # NEW
│   ├── stores/
│   │   ├── settings.ts                # NEW (persisted)
│   │   └── session.ts                 # NEW (in-memory)
│   ├── exercise-resolver.ts           # NEW (data + ptOverrides re-validation)
│   ├── theme.ts                       # NEW
│   └── utils.ts                       # NEW
└── tests/
    └── unit/
        ├── fsrs.test.ts
        ├── repository.test.ts
        ├── mastery.test.ts
        ├── audio-resolver.test.ts
        ├── exercise-resolver.test.ts
        └── settings-defaults.test.ts
```

---

## Milestone 1 — Foundations

### Task 1: Configure theme tokens + fonts in globals.css

**Files:** Modify `app/globals.css`. Modify `app/layout.tsx`.

- [ ] **Step 1: Replace globals.css with design tokens**

Replace contents of `app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --color-bg: oklch(0.985 0.02 80);            /* #FFF8E7 cream */
  --color-bg-elevated: oklch(1 0 0);
  --color-fg: oklch(0.18 0.02 80);              /* warm dark */
  --color-fg-muted: oklch(0.5 0.02 80);
  --color-border: oklch(0.9 0.02 80);
  --color-primary: oklch(0.86 0.18 95);         /* #FFD60A yellow */
  --color-accent: oklch(0.62 0.16 155);         /* #00A86B green */
  --color-error: oklch(0.7 0.18 22);            /* #FF6B6B coral */
  --color-info: oklch(0.7 0.12 230);            /* #4DA8DA blue */
  --font-display: "Fraunces", serif;
  --font-sans: "Plus Jakarta Sans", system-ui, sans-serif;
}

.dark {
  --color-bg: oklch(0.16 0.02 80);
  --color-bg-elevated: oklch(0.22 0.02 80);
  --color-fg: oklch(0.95 0.02 80);
  --color-fg-muted: oklch(0.7 0.02 80);
  --color-border: oklch(0.3 0.02 80);
}

@theme inline {
  --color-background: var(--color-bg);
  --color-foreground: var(--color-fg);
  --color-muted: var(--color-fg-muted);
  --color-border: var(--color-border);
  --color-primary: var(--color-primary);
  --color-accent: var(--color-accent);
  --color-destructive: var(--color-error);
  --color-info: var(--color-info);
  --font-sans: var(--font-sans);
  --font-display: var(--font-display);
}

body { font-family: var(--font-sans); background: var(--color-bg); color: var(--color-fg); }
h1, h2, h3, h4 { font-family: var(--font-display); }
```

- [ ] **Step 2: Update layout.tsx to load fonts + set html className**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  title: "Aprende Português",
  description: "Português brasileiro + europeu para hispanohablantes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${jakarta.variable} min-h-full flex flex-col font-sans`}>
        <ThemeProvider>
          <NavBar />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Typecheck + dev server**

```bash
npx tsc --noEmit
npm run dev -- --port 3002
```

Expected: dev server on :3002 shows a page with Fraunces serif headings + Plus Jakarta Sans body. The `ThemeProvider` and `NavBar` imports will fail at this step — we create them in Tasks 2-3.

- [ ] **Step 4: Create empty stubs for ThemeProvider and NavBar so the page loads**

Create `components/ThemeProvider.tsx`:
```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({ theme: "light", setTheme: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const stored = localStorage.getItem("pt-theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pt-theme", theme);
  }, [theme]);
  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
```

Create `components/NavBar.tsx`:
```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  { href: "/", label: "Inicio" },
  { href: "/learn", label: "Estudiar" },
  { href: "/blocks", label: "Blocos" },
  { href: "/stats", label: "Stats" },
  { href: "/settings", label: "⚙" },
];
export function NavBar() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-6 h-14">
        <Link href="/" className="font-display text-xl">🇧🇷🇵🇹 Português</Link>
        <ul className="flex gap-1 ml-auto">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className={`px-3 py-1.5 rounded-md text-sm ${path === l.href ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"}`}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx components/ThemeProvider.tsx components/NavBar.tsx
git commit -m "feat(ui): theme tokens, fonts, ThemeProvider, NavBar"
```

---

### Task 2: Set up Dexie schema (`lib/db/schema.ts`)

**Files:** Create `lib/db/schema.ts`.

- [ ] **Step 1: Create schema**

```ts
// lib/db/schema.ts
import Dexie, { type EntityTable } from "dexie";
import type { Card as FsrsCard } from "ts-fsrs";

export type CardId = string;
export type ConceptId = string;
export type LessonId = string;
export type BlockId = number;
export type Variant = "br" | "pt";
export type AudioVariant = "f_neutral" | "m_neutral" | "f_happy" | "m_happy" | "f_calm" | "m_calm";
export type Rating = 1 | 2 | 3 | 4;
export const RATING = { Again: 1, Hard: 2, Good: 3, Easy: 4 } as const;

export interface Card {
  id: CardId;
  blockId: BlockId;
  lessonId: LessonId;
  contentHash: string;
  fsrs: FsrsCard;
  nextReviewAt: Date;
  state: number;
  reps: number;
  lapses: number;
  lastRating?: Rating;
  lastReviewedAt?: Date;
  introducedAt: Date;
}

export interface Session {
  id?: number;
  startedAt: Date;
  endedAt?: Date;
  blockId?: BlockId;
  lessonId?: LessonId;
  mode: "daily" | "lesson" | "drill" | "review_errors" | "story";
  cardsReviewed: number;
  correctCount: number;
  durationMs: number;
}

export interface ReviewEvent {
  id?: number;
  ts: Date;
  cardId: CardId;
  sessionId?: number;
  rating: Rating;
  correct: boolean;
  responseMs: number;
  mode: string;
  conceptIds: ConceptId[];
  variant: Variant;
}

export type SettingsKey =
  | "variant" | "voicePref" | "showContrast" | "showCompareToggle"
  | "dailyGoalMinutes" | "theme" | "soundFx" | "onboardingDone";

export interface SettingsRow<T = unknown> { key: SettingsKey; value: T; updatedAt: Date; }

export interface Achievement { id: string; unlockedAt: Date; }

export interface StreakDay { date: string; minutesStudied: number; cardsReviewed: number; xpEarned: number; }

export interface XpRow { key: "total"; value: number; updatedAt: Date; }

export interface ConceptMastery {
  conceptId: ConceptId;
  blockId: BlockId;
  accuracy: number;
  exposureCount: number;
  correctCount: number;
  lastReviewed?: Date;
  masteryPct: number;
  isMastered: boolean;
  updatedAt: Date;
}

class PortuguesDB extends Dexie {
  cards!: EntityTable<Card, "id">;
  sessions!: EntityTable<Session, "id">;
  events!: EntityTable<ReviewEvent, "id">;
  errorQueue!: EntityTable<{ cardId: CardId; ts: Date; reason: string }, "cardId">;
  errorReasons!: EntityTable<{ id?: number; cardId: CardId; ts: Date; reason: string; conceptIds: ConceptId[] }, "id">;
  settings!: EntityTable<SettingsRow, "key">;
  achievements!: EntityTable<Achievement, "id">;
  streak!: EntityTable<StreakDay, "date">;
  xp!: EntityTable<XpRow, "key">;
  conceptMastery!: EntityTable<ConceptMastery, "conceptId">;

  constructor() {
    super("PortuguesAppDB");
    this.version(1).stores({
      cards: "id, blockId, lessonId, nextReviewAt, state, [blockId+nextReviewAt], [lessonId+nextReviewAt]",
      sessions: "++id, startedAt, blockId, lessonId, mode",
      events: "++id, ts, cardId, sessionId, [cardId+ts], [ts+conceptIds]",
      errorQueue: "cardId, ts",
      errorReasons: "++id, cardId, ts, [conceptIds+ts]",
      settings: "key",
      achievements: "id, unlockedAt",
      streak: "date",
      xp: "key",
      conceptMastery: "conceptId, blockId, isMastered",
    });
  }
}

export const db = new PortuguesDB();
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add lib/db/schema.ts
git commit -m "feat(db): Dexie schema with FSRS-5 mirror fields + multiEntry conceptIds"
```

---

### Task 3: FSRS wrapper (`lib/srs/fsrs.ts`) + unit tests

**Files:** Create `lib/srs/fsrs.ts`. Create `tests/unit/fsrs.test.ts`.

- [ ] **Step 1: Write tests**

```ts
// tests/unit/fsrs.test.ts
import { describe, it, expect } from "vitest";
import { newCard, schedule, isNewCard } from "@/lib/srs/fsrs";
import { RATING } from "@/lib/db/schema";

describe("FSRS wrapper", () => {
  it("creates a new card with state 0", () => {
    const c = newCard("abc12345", 1, "b1-l1");
    expect(c.state).toBe(0);
    expect(isNewCard(c)).toBe(true);
  });

  it("Good on a new card moves to state 1 and pushes due out", () => {
    const c0 = newCard("abc12345", 1, "b1-l1");
    const c1 = schedule(c0, RATING.Good);
    expect(c1.state).toBe(1);
    expect(c1.nextReviewAt.getTime()).toBeGreaterThan(c0.nextReviewAt.getTime());
    expect(c1.reps).toBe(1);
  });

  it("Again on learning card resets to lapses+1 and short interval", () => {
    const c0 = newCard("abc12345", 1, "b1-l1");
    const c1 = schedule(c0, RATING.Good);
    const c2 = schedule(c1, RATING.Again);
    expect(c2.lapses).toBe(1);
    expect(c2.reps).toBe(1);
  });

  it("schedule is deterministic with fixed now", () => {
    const c0 = newCard("abc12345", 1, "b1-l1");
    const fixed = new Date("2026-06-08T12:00:00Z");
    const c1 = schedule(c0, RATING.Good, fixed);
    const c2 = schedule(c0, RATING.Good, fixed);
    expect(c1.nextReviewAt.toISOString()).toBe(c2.nextReviewAt.toISOString());
  });
});
```

- [ ] **Step 2: Run to fail**

```bash
npm test -- fsrs
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// lib/srs/fsrs.ts
import { fsrs, createEmptyCard, Rating as FsrsRating, generatorParameters } from "ts-fsrs";
import { db, type Card, type CardId, type Rating, RATING } from "../db/schema";

const scheduler = fsrs(generatorParameters({ request_retention: 0.9 }));

export function newCard(id: CardId, blockId: number, lessonId: string): Card {
  const empty = createEmptyCard(new Date());
  return {
    id,
    blockId,
    lessonId,
    contentHash: id,
    fsrs: empty,
    nextReviewAt: empty.due,
    state: empty.state,
    reps: empty.reps,
    lapses: empty.lapses,
    introducedAt: new Date(),
  };
}

export function schedule(card: Card, rating: Rating, now = new Date()): Card {
  const fsrsRating =
    rating === RATING.Again ? FsrsRating.Again
    : rating === RATING.Hard  ? FsrsRating.Hard
    : rating === RATING.Good  ? FsrsRating.Good
                              : FsrsRating.Easy;

  const result = scheduler.next(card.fsrs, now, fsrsRating);
  return {
    ...card,
    fsrs: result.card,
    nextReviewAt: result.card.due,
    state: result.card.state,
    reps: result.card.reps,
    lapses: result.card.lapses,
    lastRating: rating,
    lastReviewedAt: now,
  };
}

export function isNewCard(card: Card): boolean {
  return card.state === 0;
}
```

- [ ] **Step 4: Run to pass**

```bash
npm test -- fsrs
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/srs/fsrs.ts tests/unit/fsrs.test.ts
git commit -m "feat(srs): FSRS-5 wrapper with newCard, schedule, isNewCard"
```

---

### Task 4: Mastery calculation (`lib/mastery/concept.ts`) + tests

**Files:** Create `lib/mastery/concept.ts`. Create `tests/unit/mastery.test.ts`.

- [ ] **Step 1: Write tests**

```ts
// tests/unit/mastery.test.ts
import { describe, it, expect } from "vitest";
import { weightedAccuracy, masteryPct } from "@/lib/mastery/concept";

describe("weightedAccuracy", () => {
  it("empty events returns 0", () => {
    expect(weightedAccuracy([])).toBe(0);
  });

  it("all correct recent (0-7d) returns 1", () => {
    const now = new Date("2026-06-08");
    const events = Array.from({ length: 5 }, () => ({ ts: new Date("2026-06-05"), correct: true }));
    expect(weightedAccuracy(events, now)).toBe(1);
  });

  it("weights recency: 1 recent wrong > 1 old correct", () => {
    const now = new Date("2026-06-08");
    const old = [{ ts: new Date("2026-05-01"), correct: true }];
    const recent = [{ ts: new Date("2026-06-08"), correct: false }];
    expect(weightedAccuracy(old, now)).toBeGreaterThan(weightedAccuracy(recent, now));
  });
});

describe("masteryPct", () => {
  it("0 exposures → 0%", () => {
    expect(masteryPct(1.0, 0)).toBe(0);
  });

  it("3 exposures at 100% accuracy → ~60%", () => {
    expect(masteryPct(1.0, 3)).toBe(60);
  });

  it("10+ exposures at 100% → 95-100%", () => {
    expect(masteryPct(1.0, 10)).toBeGreaterThanOrEqual(95);
  });
});
```

- [ ] **Step 2: Implement**

```ts
// lib/mastery/concept.ts
import { db, type ConceptId, type ConceptMastery } from "../db/schema";

export const MASTERY_THRESHOLD = 0.85;
export const MIN_EXPOSURES = 3;

export function weightedAccuracy(
  events: { ts: Date; correct: boolean }[],
  now = new Date(),
): number {
  if (events.length === 0) return 0;
  let w = 0, c = 0;
  for (const e of events) {
    const days = (now.getTime() - e.ts.getTime()) / 86_400_000;
    const weight = days <= 7 ? 1 : days <= 14 ? 0.5 : 0.25;
    w += weight;
    if (e.correct) c += weight;
  }
  return c / w;
}

export function masteryPct(accuracy: number, exposures: number): number {
  if (exposures === 0) return 0;
  const factor = Math.min(1, exposures / 10);
  return Math.round(accuracy * factor * 100);
}

export async function recordAnswerForConcepts(
  conceptIds: ConceptId[],
  blockId: number,
  correct: boolean,
  ts: Date = new Date(),
): Promise<void> {
  await db.transaction("rw", db.conceptMastery, async () => {
    for (const cid of conceptIds) {
      const cur = await db.conceptMastery.get(cid);
      const accuracy = correct ? 1 : 0;
      const exposureCount = (cur?.exposureCount ?? 0) + 1;
      const correctCount = (cur?.correctCount ?? 0) + (correct ? 1 : 0);
      const mastery = masteryPct(accuracy, exposureCount);
      const isMastered = accuracy >= MASTERY_THRESHOLD && exposureCount >= MIN_EXPOSURES;
      await db.conceptMastery.put({
        conceptId: cid,
        blockId,
        accuracy,
        exposureCount,
        correctCount,
        masteryPct: mastery,
        isMastered,
        lastReviewed: ts,
        updatedAt: ts,
      });
    }
  });
}

export async function getConceptMastery(conceptId: ConceptId): Promise<ConceptMastery | undefined> {
  return db.conceptMastery.get(conceptId);
}
```

- [ ] **Step 3: Run + commit**

```bash
npm test -- mastery
git add lib/mastery/concept.ts tests/unit/mastery.test.ts
git commit -m "feat(mastery): weightedAccuracy + masteryPct + recordAnswerForConcepts"
```

---

### Task 5: Exercise resolver (`lib/exercise-resolver.ts`) + tests

This is the runtime mirror of design doc §4.3 — it resolves `ptOverrides` against the discriminated union, re-validating with Zod.

**Files:** Create `lib/exercise-resolver.ts`. Create `tests/unit/exercise-resolver.test.ts`.

- [ ] **Step 1: Tests**

```ts
// tests/unit/exercise-resolver.test.ts
import { describe, it, expect } from "vitest";
import { resolveExerciseData, resolveAudioHash } from "@/lib/exercise-resolver";

const exBr = {
  id: "abc",
  blockId: 1,
  lessonId: "b1-l1",
  type: "flashcard" as const,
  difficulty: 1 as const,
  concepts: [],
  tags: [],
  data: { front: "ônibus", back: "ônibus" },
  ptOverrides: { back: "autocarro" },
  audio: {
    br: { f_neutral: { hash: "hbr", voice: "v" } } as any,
    pt: { f_neutral: { hash: "hpt", voice: "v" } } as any,
  },
};

describe("resolveExerciseData", () => {
  it("BR returns data unchanged", () => {
    const out = resolveExerciseData(exBr, "br");
    expect(out.back).toBe("ônibus");
  });

  it("PT applies ptOverrides and re-validates", () => {
    const out = resolveExerciseData(exBr, "pt");
    expect(out.back).toBe("autocarro");
  });

  it("PT without overrides returns data", () => {
    const noOverride = { ...exBr, ptOverrides: undefined };
    const out = resolveExerciseData(noOverride, "pt");
    expect(out.back).toBe("ônibus");
  });
});

describe("resolveAudioHash", () => {
  it("returns the hash for the requested variant", () => {
    expect(resolveAudioHash(exBr, "br", "f_neutral")).toBe("hbr");
    expect(resolveAudioHash(exBr, "pt", "f_neutral")).toBe("hpt");
  });
});
```

- [ ] **Step 2: Implement**

```ts
// lib/exercise-resolver.ts
import type { AudioVariant, Variant } from "./db/schema";
import { ExerciseDataByTypeSchema, type Exercise } from "@/lib/data/zod-schemas-runtime";

export function resolveExerciseData(ex: Exercise, variant: Variant): Exercise["data"] {
  if (variant !== "pt" || !ex.ptOverrides) return ex.data;
  const merged: any = { ...ex.data, ...ex.ptOverrides };
  return ExerciseDataByTypeSchema[ex.type].parse(merged);
}

export function resolveAudioHash(ex: Exercise, variant: Variant, voice: AudioVariant): string {
  return (ex.audio as any)[variant][voice].hash;
}
```

- [ ] **Step 3: Create the runtime zod-schemas mirror**

`lib/data/zod-schemas-runtime.ts`:
```ts
// Mirror of scripts/lib/zod-schemas.ts but available to the client bundle.
// Server generates content; client just reads/validates. Zod is bundled.
import { z } from "zod";

const FlashcardData = z.object({ front: z.string().min(1), back: z.string().min(1), example: z.string().optional() });
const FillBlankData = z.object({ sentence: z.string().min(1), blanks: z.array(z.object({ position: z.number().int().nonnegative(), answer: z.string().min(1), alternatives: z.array(z.string()).optional() })).min(1) });
const ListeningData = z.object({ audioText: z.string().min(1), question: z.string().min(1), options: z.array(z.string()).min(2).optional(), answer: z.string().min(1) });
const TranslationData = z.object({ source: z.string().min(1), target: z.string().min(1), acceptedAlternatives: z.array(z.string()).optional() });
const VerbPrepositionData = z.object({ verb: z.string().min(1), sentence: z.string().min(1), options: z.array(z.string()).min(2), answer: z.string().min(1) });
const SentenceConstructionData = z.object({ words: z.array(z.string()).min(2), answer: z.array(z.string()).min(2), translation: z.string().optional() });
const ChunkData = z.object({ chunk: z.string().min(1), meaning: z.string().min(1), examples: z.array(z.object({ sentence: z.string().min(1), gloss: z.string().optional() })).min(1) });

export const ExerciseDataByTypeSchema = {
  flashcard: FlashcardData, fill_blank: FillBlankData, listening: ListeningData,
  translation_es_pt: TranslationData, translation_pt_es: TranslationData,
  verb_preposition: VerbPrepositionData, sentence_construction: SentenceConstructionData, chunk: ChunkData,
} as const;

const AudioVariantSetSchema = z.object({
  f_neutral: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
  m_neutral: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
  f_happy: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
  m_happy: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
  f_calm: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
  m_calm: z.object({ hash: z.string().min(1), voice: z.string().min(1) }),
});

const BaseExercise = z.object({
  id: z.string().min(1),
  blockId: z.number().int().positive(),
  lessonId: z.string().min(1),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  concepts: z.array(z.string()),
  tags: z.array(z.string()),
  contentHash: z.string().optional(),
  esContrast: z.string().optional(),
  audio: AudioVariantSetSchema.optional(),
  suggested: z.object({ gender: z.union([z.literal("f"), z.literal("m")]).optional(), emotion: z.union([z.literal("neutral"), z.literal("happy"), z.literal("sad"), z.literal("angry"), z.literal("calm"), z.literal("surprised")]).optional() }).optional(),
});

const FlashcardEx = BaseExercise.extend({ type: z.literal("flashcard"), data: FlashcardData, ptOverrides: FlashcardData.partial().optional() });
const FillBlankEx = BaseExercise.extend({ type: z.literal("fill_blank"), data: FillBlankData, ptOverrides: FillBlankData.partial().optional() });
const ListeningEx = BaseExercise.extend({ type: z.literal("listening"), data: ListeningData, ptOverrides: ListeningData.partial().optional() });
const TranslationEsPtEx = BaseExercise.extend({ type: z.literal("translation_es_pt"), data: TranslationData, ptOverrides: TranslationData.partial().optional() });
const TranslationPtEsEx = BaseExercise.extend({ type: z.literal("translation_pt_es"), data: TranslationData, ptOverrides: TranslationData.partial().optional() });
const VerbPrepositionEx = BaseExercise.extend({ type: z.literal("verb_preposition"), data: VerbPrepositionData, ptOverrides: VerbPrepositionData.partial().optional() });
const SentenceConstructionEx = BaseExercise.extend({ type: z.literal("sentence_construction"), data: SentenceConstructionData, ptOverrides: SentenceConstructionData.partial().optional() });
const ChunkEx = BaseExercise.extend({ type: z.literal("chunk"), data: ChunkData, ptOverrides: ChunkData.partial().optional() });

export const ExerciseSchema = z.discriminatedUnion("type", [FlashcardEx, FillBlankEx, ListeningEx, TranslationEsPtEx, TranslationPtEsEx, VerbPrepositionEx, SentenceConstructionEx, ChunkEx]);
export type Exercise = z.infer<typeof ExerciseSchema>;
```

- [ ] **Step 4: Typecheck + tests**

```bash
npx tsc --noEmit
npm test -- exercise-resolver
```

Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/exercise-resolver.ts lib/data/zod-schemas-runtime.ts tests/unit/exercise-resolver.test.ts
git commit -m "feat(ui): exercise resolver with ptOverrides re-validation + runtime zod schemas"
```

---

### Task 6: Audio resolver (`lib/audio/resolve.ts`) + tests

**Files:** Create `lib/audio/resolve.ts`. Create `tests/unit/audio-resolver.test.ts`.

- [ ] **Step 1: Tests**

```ts
// tests/unit/audio-resolver.test.ts
import { describe, it, expect } from "vitest";
import { pickVoice, audioUrl } from "@/lib/audio/resolve";

const exFlashcard = { type: "flashcard" as const, suggested: { gender: "m" as const, emotion: "happy" as const } };
const exChunk = { type: "chunk" as const };

describe("pickVoice", () => {
  it("user pref wins", () => {
    expect(pickVoice(exFlashcard as any, "br", { br: "f_calm", pt: "f_neutral" })).toBe("f_calm");
  });

  it("exercise suggested gender+emotion when no pref", () => {
    expect(pickVoice(exFlashcard as any, "br", { br: "f_neutral", pt: "f_neutral" })).toBe("m_happy");
  });

  it("default: f_neutral for non-chunk", () => {
    expect(pickVoice(exFlashcard as any, "br", { br: "f_neutral", pt: "f_neutral" })).toBe("m_happy"); // suggested wins
  });

  it("default: m_neutral for chunk", () => {
    expect(pickVoice(exChunk as any, "br", { br: "f_neutral", pt: "f_neutral" })).toBe("m_neutral");
  });
});

describe("audioUrl", () => {
  it("builds /audio/<hash>.mp3", () => {
    expect(audioUrl("abc123def", "br", "f_neutral")).toBe("/audio/abc123def.mp3");
  });
});
```

- [ ] **Step 2: Implement**

```ts
// lib/audio/resolve.ts
import type { AudioVariant, Variant } from "@/lib/db/schema";

export function pickVoice(
  ex: { type: string; suggested?: { gender?: "f" | "m"; emotion?: string } },
  variant: Variant,
  pref: Record<Variant, AudioVariant>,
): AudioVariant {
  if (pref[variant]) return pref[variant];
  const s = ex.suggested;
  if (s?.gender && s?.emotion) {
    return `${s.gender}_${s.emotion}` as AudioVariant;
  }
  return ex.type === "chunk" ? "m_neutral" : "f_neutral";
}

export function audioUrl(hash: string, _variant: Variant, _voice: AudioVariant): string {
  return `/audio/${hash}.mp3`;
}
```

- [ ] **Step 3: Tests + commit**

```bash
npm test -- audio-resolver
git add lib/audio/resolve.ts tests/unit/audio-resolver.test.ts
git commit -m "feat(audio): pickVoice + audioUrl with pref → suggested → default"
```

---

### Task 7: Repository (queries) (`lib/db/repository.ts`)

**Files:** Create `lib/db/repository.ts`. Create `tests/unit/repository.test.ts`.

- [ ] **Step 1: Tests**

```ts
// tests/unit/repository.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { db } from "@/lib/db/schema";
import { getOrCreateCard, getDueCards, submitAnswer } from "@/lib/db/repository";
import { RATING } from "@/lib/db/schema";

describe("repository", () => {
  beforeEach(async () => {
    await db.delete();
    await db.open();
  });

  it("getOrCreateCard: returns existing or creates new", async () => {
    const a = await getOrCreateCard("id1", 1, "b1-l1");
    const b = await getOrCreateCard("id1", 1, "b1-l1");
    expect(a.id).toBe(b.id);
    expect(a.introducedAt).toEqual(b.introducedAt);
  });

  it("getDueCards: returns cards due now or earlier", async () => {
    const c1 = await getOrCreateCard("due1", 1, "b1-l1");
    const c2 = await getOrCreateCard("due2", 1, "b1-l1");
    const c3 = await getOrCreateCard("future", 1, "b1-l1");
    await db.cards.update("due1", { nextReviewAt: new Date(Date.now() - 1000) });
    await db.cards.update("due2", { nextReviewAt: new Date(Date.now() - 500) });
    await db.cards.update("future", { nextReviewAt: new Date(Date.now() + 100000) });
    const due = await getDueCards(new Date(), 10);
    expect(due.map(c => c.id).sort()).toEqual(["due1", "due2"]);
  });
});
```

- [ ] **Step 2: Install fake-indexeddb for tests**

```bash
npm install -D fake-indexeddb
```

- [ ] **Step 3: Implement**

```ts
// lib/db/repository.ts
import { db, type Card, type CardId, type Rating, type ReviewEvent, type Session, type Variant } from "./schema";
import { newCard, schedule } from "../srs/fsrs";
import { recordAnswerForConcepts } from "../mastery/concept";

export async function getOrCreateCard(id: CardId, blockId: number, lessonId: string): Promise<Card> {
  const existing = await db.cards.get(id);
  if (existing) return existing;
  const fresh = newCard(id, blockId, lessonId);
  await db.cards.add(fresh);
  return fresh;
}

export async function getDueCards(now: Date, limit: number): Promise<Card[]> {
  return db.cards
    .where("nextReviewAt")
    .belowOrEqual(now)
    .limit(limit)
    .toArray();
}

export async function getDueInBlock(blockId: number, now: Date, limit: number): Promise<Card[]> {
  return db.cards
    .where("[blockId+nextReviewAt]")
    .between([blockId, new Date(0)], [blockId, now])
    .limit(limit)
    .toArray();
}

export async function getDueInLesson(lessonId: string, now: Date, limit: number): Promise<Card[]> {
  return db.cards
    .where("[lessonId+nextReviewAt]")
    .between([lessonId, new Date(0)], [lessonId, now])
    .limit(limit)
    .toArray();
}

export async function getCardById(id: CardId): Promise<Card | undefined> {
  return db.cards.get(id);
}

export interface SubmitAnswerParams {
  cardId: CardId;
  rating: Rating;
  responseMs: number;
  mode: Session["mode"];
  variant: Variant;
  conceptIds: string[];
  blockId: number;
  sessionId?: number;
}

export async function submitAnswer(p: SubmitAnswerParams): Promise<void> {
  await db.transaction("rw", db.cards, db.events, db.conceptMastery, db.sessions, async () => {
    const card = await db.cards.get(p.cardId);
    if (!card) throw new Error(`Card not found: ${p.cardId}`);
    const updated = schedule(card, p.rating);
    await db.cards.put(updated);

    const event: ReviewEvent = {
      ts: new Date(),
      cardId: p.cardId,
      sessionId: p.sessionId,
      rating: p.rating,
      correct: p.rating >= 3,
      responseMs: p.responseMs,
      mode: p.mode,
      conceptIds: p.conceptIds,
      variant: p.variant,
    };
    await db.events.add(event);

    await recordAnswerForConcepts(p.conceptIds, p.blockId, p.rating >= 3);

    if (p.sessionId) {
      await db.sessions.update(p.sessionId, {
        cardsReviewed: (await db.sessions.get(p.sessionId))?.cardsReviewed ?? 0 + 1,
        correctCount: ((await db.sessions.get(p.sessionId))?.correctCount ?? 0) + (p.rating >= 3 ? 1 : 0),
      });
    }
  });
}
```

- [ ] **Step 4: Tests + commit**

```bash
npm test -- repository
git add lib/db/repository.ts tests/unit/repository.test.ts package.json package-lock.json
git commit -m "feat(db): repository with getOrCreateCard, getDueCards, submitAnswer transaction"
```

---

### Task 8: Zustand stores (settings + session)

**Files:** Create `lib/stores/settings.ts`. Create `lib/stores/session.ts`.

- [ ] **Step 1: Create settings store**

```ts
// lib/stores/settings.ts
"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AudioVariant, Variant } from "@/lib/db/schema";

interface SettingsState {
  variant: Variant;
  showCompareToggle: boolean;
  showContrast: boolean;
  dailyGoalMinutes: number;
  theme: "light" | "dark";
  soundFx: boolean;
  voicePref: Record<Variant, AudioVariant>;

  setVariant: (v: Variant) => void;
  toggleCompare: () => void;
  setVoicePref: (v: Variant, voice: AudioVariant) => void;
  setTheme: (t: "light" | "dark") => void;
  setDailyGoal: (n: number) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      variant: "br",
      showCompareToggle: false,
      showContrast: true,
      dailyGoalMinutes: 15,
      theme: "light",
      soundFx: true,
      voicePref: { br: "f_neutral", pt: "f_neutral" },
      setVariant: (v) => set({ variant: v }),
      toggleCompare: () => set((s) => ({ showCompareToggle: !s.showCompareToggle })),
      setVoicePref: (variant, voice) => set((s) => ({ voicePref: { ...s.voicePref, [variant]: voice } })),
      setTheme: (t) => set({ theme: t }),
      setDailyGoal: (n) => set({ dailyGoalMinutes: n }),
    }),
    { name: "pt-settings", storage: createJSONStorage(() => localStorage) },
  ),
);
```

- [ ] **Step 2: Create session store**

```ts
// lib/stores/session.ts
"use client";
import { create } from "zustand";
import type { Rating, Session } from "@/lib/db/schema";

interface SessionStore {
  sessionId?: number;
  mode?: Session["mode"];
  startedAt?: Date;
  pendingReview: Set<string>;
  submitTokens: Map<string, number>;
  cardsReviewed: number;
  correctCount: number;

  beginSession: (id: number, mode: Session["mode"]) => void;
  endSession: () => void;
  markPending: (cardId: string) => void;
  clearPending: (cardId: string) => void;
  isPending: (cardId: string) => boolean;
  incrCorrect: (correct: boolean) => void;
}

export const useSession = create<SessionStore>((set, get) => ({
  pendingReview: new Set(),
  submitTokens: new Map(),
  cardsReviewed: 0,
  correctCount: 0,
  beginSession: (id, mode) =>
    set({ sessionId: id, mode, startedAt: new Date(), pendingReview: new Set(), cardsReviewed: 0, correctCount: 0 }),
  endSession: () => set({ sessionId: undefined, mode: undefined, startedAt: undefined }),
  markPending: (cardId) => set((s) => ({ pendingReview: new Set([...s.pendingReview, cardId]) })),
  clearPending: (cardId) => set((s) => {
    const next = new Set(s.pendingReview); next.delete(cardId); return { pendingReview: next };
  }),
  isPending: (cardId) => get().pendingReview.has(cardId),
  incrCorrect: (correct) => set((s) => ({ cardsReviewed: s.cardsReviewed + 1, correctCount: s.correctCount + (correct ? 1 : 0) })),
}));
```

- [ ] **Step 3: Typecheck + commit**

```bash
npx tsc --noEmit
git add lib/stores/
git commit -m "feat(stores): zustand settings (persisted) + session (in-memory)"
```

---

## Milestone 2 — Home + Blocks + Lesson screens

### Task 9: AudioButton component

**Files:** Create `components/AudioButton.tsx`.

- [ ] **Step 1: Create component**

```tsx
// components/AudioButton.tsx
"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  size?: "sm" | "md" | "lg";
  onPlay?: () => void;
}

export function AudioButton({ src, size = "md", onPlay }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "error">("idle");

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlayEv = () => { setState("playing"); onPlay?.(); };
    const onPause = () => setState("idle");
    const onEnded = () => setState("idle");
    const onError = () => setState("error");
    el.addEventListener("play", onPlayEv);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);
    return () => {
      el.removeEventListener("play", onPlayEv);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, [onPlay]);

  const sizes = { sm: "h-8 w-8 text-sm", md: "h-12 w-12 text-base", lg: "h-16 w-16 text-lg" };

  return (
    <button
      onClick={() => {
        if (state === "error") return;
        audioRef.current?.play();
      }}
      className={`${sizes[size]} rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-30`}
      disabled={state === "error"}
      aria-label="Play audio"
    >
      {state === "playing" ? (
        <div className="flex gap-0.5">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-0.5 bg-primary wave-bar" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      ) : state === "error" ? (
        "—"
      ) : (
        "▶"
      )}
      <audio ref={audioRef} src={src} preload="none" />
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/AudioButton.tsx
git commit -m "feat(ui): AudioButton with state machine (idle/loading/playing/error)"
```

---

### Task 10: VariantToggle + VoicePicker components

**Files:** Create `components/VariantToggle.tsx`. Create `components/VoicePicker.tsx`.

- [ ] **Step 1: VariantToggle**

```tsx
// components/VariantToggle.tsx
"use client";
import { useSettings } from "@/lib/stores/settings";
import type { Variant } from "@/lib/db/schema";

export function VariantToggle() {
  const { variant, setVariant, showCompareToggle, toggleCompare } = useSettings();
  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex border border-border rounded-md overflow-hidden">
        {(["br", "pt"] as Variant[]).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-3 py-1 text-sm font-medium ${variant === v ? "bg-primary text-fg" : "text-muted hover:text-foreground"}`}
          >
            {v === "br" ? "🇧🇷 BR" : "🇵🇹 PT"}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-1 text-xs text-muted">
        <input type="checkbox" checked={showCompareToggle} onChange={toggleCompare} />
        Comparar
      </label>
    </div>
  );
}
```

- [ ] **Step 2: VoicePicker**

```tsx
// components/VoicePicker.tsx
"use client";
import { useSettings } from "@/lib/stores/settings";
import type { AudioVariant, Variant } from "@/lib/db/schema";

const variants: { id: AudioVariant; label: string }[] = [
  { id: "f_neutral", label: "F neutral" },
  { id: "m_neutral", label: "M neutral" },
  { id: "f_happy", label: "F alegre" },
  { id: "m_happy", label: "M alegre" },
  { id: "f_calm", label: "F calmada" },
  { id: "m_calm", label: "M calmado" },
];

export function VoicePicker() {
  const { variant, voicePref, setVoicePref } = useSettings();
  return (
    <select
      value={voicePref[variant]}
      onChange={(e) => setVoicePref(variant, e.target.value as AudioVariant)}
      className="border border-border rounded-md px-2 py-1 text-sm bg-background"
    >
      {variants.map((v) => <option key={v.id} value={v.id}>{v.label}</option>)}
    </select>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/VariantToggle.tsx components/VoicePicker.tsx
git commit -m "feat(ui): VariantToggle + VoicePicker"
```

---

### Task 11: Home page (`app/page.tsx`) — replace placeholder

**Files:** Replace `app/page.tsx`.

- [ ] **Step 1: Replace with home dashboard**

```tsx
// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/db/schema";
import { getDueCards } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";
import { VariantToggle } from "@/components/VariantToggle";

export default function Home() {
  const { dailyGoalMinutes, variant } = useSettings();
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const due = await getDueCards(new Date(), 100);
      setDueCount(due.length);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <header>
        <h1 className="font-display text-5xl mb-2">Aprende Português</h1>
        <p className="text-muted">Português brasileiro + europeu para hispanohablantes</p>
        <div className="mt-4"><VariantToggle /></div>
      </header>

      <section className="grid grid-cols-3 gap-4">
        <Card title="Due cards" value={loading ? "…" : String(dueCount)} accent="primary" />
        <Card title="Meta diária" value={`${dailyGoalMinutes} min`} accent="accent" />
        <Card title="Variante" value={variant.toUpperCase()} accent="info" />
      </section>

      <section>
        <Link
          href="/learn"
          className="block p-6 border-2 border-primary rounded-xl hover:bg-primary/5 transition-colors text-center"
        >
          <div className="font-display text-2xl">Continuar aprendiendo →</div>
          <div className="text-sm text-muted mt-1">Sesión guiada con daily mix</div>
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <Link href="/blocks" className="p-4 border border-border rounded-lg hover:bg-muted/5">
          <div className="font-medium">📚 Blocos</div>
          <div className="text-sm text-muted">10 bloques curriculares</div>
        </Link>
        <Link href="/settings" className="p-4 border border-border rounded-lg hover:bg-muted/5">
          <div className="font-medium">⚙️ Settings</div>
          <div className="text-sm text-muted">Voz, tema, daily goal</div>
        </Link>
      </section>
    </div>
  );
}

function Card({ title, value, accent }: { title: string; value: string; accent: "primary" | "accent" | "info" }) {
  const c = { primary: "border-primary", accent: "border-accent", info: "border-info" }[accent];
  return (
    <div className={`p-4 border-2 ${c} rounded-xl`}>
      <div className="text-xs text-muted uppercase">{title}</div>
      <div className="text-3xl font-display mt-1">{value}</div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + dev server check**

```bash
npx tsc --noEmit
npm run dev -- --port 3002
```

Expected: home renders with due cards count, daily goal, variant toggle, "Continuar aprendiendo" CTA. Open `http://localhost:3002`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(ui): home dashboard with due cards, daily goal, variant toggle"
```

---

### Task 12: Blocks grid page

**Files:** Create `app/blocks/page.tsx`. Create `components/BlockCard.tsx`.

- [ ] **Step 1: BlockCard component**

```tsx
// components/BlockCard.tsx
"use client";
import Link from "next/link";
import type { Block } from "@/lib/data/curriculum";

interface Props { block: Block; masteryPct: number; isUnlocked: boolean; }

export function BlockCard({ block, masteryPct, isUnlocked }: Props) {
  const accent = ["border-primary", "border-accent", "border-info", "border-error"][block.id % 4];
  return (
    <Link
      href={isUnlocked ? `/blocks/${block.id}` : "#"}
      className={`block p-5 border-2 ${isUnlocked ? accent : "border-border opacity-50"} rounded-xl ${isUnlocked ? "hover:bg-muted/5" : "cursor-not-allowed"} transition-all`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted">Bloque {block.id}</span>
        {!isUnlocked && <span className="text-xs">🔒</span>}
      </div>
      <h3 className="font-display text-xl mb-1">{block.name}</h3>
      <p className="text-sm text-muted mb-3">{block.description.slice(0, 100)}{block.description.length > 100 ? "…" : ""}</p>
      <div className="flex items-center gap-2 text-xs">
        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${masteryPct}%` }} />
        </div>
        <span className="font-mono text-muted">{masteryPct}%</span>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Blocks page**

```tsx
// app/blocks/page.tsx
"use client";
import { BLOCKS, type Block } from "@/lib/data/curriculum";
import { BlockCard } from "@/components/BlockCard";
import { useEffect, useState } from "react";
import { db } from "@/lib/db/schema";
import { getConceptMastery } from "@/lib/mastery/concept";

export default function BlocksPage() {
  const [masteryByBlock, setMasteryByBlock] = useState<Record<number, number>>({});

  useEffect(() => {
    (async () => {
      const out: Record<number, number> = {};
      for (const b of BLOCKS) {
        const concepts = b.lessons.flatMap(l => l.conceptIds);
        if (concepts.length === 0) { out[b.id] = 0; continue; }
        const mastered = await Promise.all(concepts.map(c => getConceptMastery(c).then(m => m?.isMastered ?? false)));
        out[b.id] = Math.round((mastered.filter(Boolean).length / concepts.length) * 100);
      }
      setMasteryByBlock(out);
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <header>
        <h1 className="font-display text-4xl">Blocos</h1>
        <p className="text-muted mt-1">10 bloques del currículo completo</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BLOCKS.map((b) => (
          <BlockCard
            key={b.id}
            block={b}
            masteryPct={masteryByBlock[b.id] ?? 0}
            isUnlocked={b.prereqs.every(p => (masteryByBlock[p] ?? 0) >= 80) || b.id === 1}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/blocks/page.tsx components/BlockCard.tsx
git commit -m "feat(ui): blocks grid with mastery progress per block"
```

---

### Task 13: Block detail + lesson detail

**Files:** Create `app/blocks/[id]/page.tsx`. Create `app/blocks/[id]/lessons/[lid]/page.tsx`. Create `components/LessonCard.tsx`.

- [ ] **Step 1: LessonCard component**

```tsx
// components/LessonCard.tsx
"use client";
import Link from "next/link";
import type { Lesson } from "@/lib/data/curriculum";

interface Props { lesson: Lesson; dueCount: number; blockId: number; }

export function LessonCard({ lesson, dueCount, blockId }: Props) {
  return (
    <Link
      href={`/blocks/${blockId}/lessons/${lesson.id}/practice`}
      className="block p-4 border border-border rounded-lg hover:bg-muted/5"
    >
      <h4 className="font-medium">{lesson.name}</h4>
      <div className="text-xs text-muted mt-1">
        {lesson.conceptIds.length} conceptos · {dueCount} due
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Block detail page**

```tsx
// app/blocks/[id]/page.tsx
"use client";
import { notFound } from "next/navigation";
import { BLOCKS, getBlock } from "@/lib/data/curriculum";
import { LessonCard } from "@/components/LessonCard";
import { useEffect, useState } from "react";
import { getDueInLesson } from "@/lib/db/repository";

export default function BlockPage({ params }: { params: Promise<{ id: string }> }) {
  const [blockId, setBlockId] = useState<number | null>(null);
  const [dueByLesson, setDueByLesson] = useState<Record<string, number>>({});

  useEffect(() => {
    params.then(p => setBlockId(Number(p.id)));
  }, [params]);

  useEffect(() => {
    if (blockId === null) return;
    const block = getBlock(blockId);
    (async () => {
      const out: Record<string, number> = {};
      const now = new Date();
      for (const lesson of block.lessons) {
        const due = await getDueInLesson(lesson.id, now, 100);
        out[lesson.id] = due.length;
      }
      setDueByLesson(out);
    })();
  }, [blockId]);

  if (blockId === null) return <div className="p-12">Cargando...</div>;
  const block = getBlock(blockId);
  if (block.lessons.length === 0) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <header>
        <div className="text-xs text-muted">Bloque {block.id}</div>
        <h1 className="font-display text-4xl">{block.name}</h1>
        <p className="text-muted mt-2">{block.description}</p>
      </header>
      <section className="space-y-2">
        <h2 className="font-display text-2xl">Lecciones</h2>
        {block.lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            dueCount={dueByLesson[lesson.id] ?? 0}
            blockId={block.id}
          />
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Lesson detail (intro to practice)**

```tsx
// app/blocks/[id]/lessons/[lid]/page.tsx
"use client";
import { notFound } from "next/navigation";
import { getBlock, getLesson } from "@/lib/data/curriculum";
import Link from "next/link";
import { ConceptMastery } from "@/components/ConceptMastery";

export default async function LessonIntro({ params }: { params: Promise<{ id: string; lid: string }> }) {
  const { id, lid } = await params;
  const block = getBlock(Number(id));
  const lesson = getLesson(lid);
  if (block.lessons.length === 0 || !block.lessons.find(l => l.id === lid)) return notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="text-xs text-muted">Bloque {block.id} · Lección</div>
      <h1 className="font-display text-4xl">{lesson.name}</h1>
      <p className="text-muted">Objetivos: {lesson.objectives.join(" · ")}</p>

      <section>
        <h2 className="font-display text-2xl mb-3">Conceptos cubiertos</h2>
        <div className="space-y-2">
          {lesson.conceptIds.map(cid => <ConceptMastery key={cid} conceptId={cid} />)}
        </div>
      </section>

      <Link
        href={`/practice/${lesson.id}`}
        className="block p-6 border-2 border-primary rounded-xl text-center hover:bg-primary/5"
      >
        <div className="font-display text-2xl">Practicar esta lección →</div>
        <div className="text-sm text-muted mt-1">Sesión de práctica con SRS</div>
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Create ConceptMastery component**

```tsx
// components/ConceptMastery.tsx
"use client";
import { useEffect, useState } from "react";
import type { ConceptMastery as CM } from "@/lib/db/schema";
import { getConceptMastery } from "@/lib/mastery/concept";

export function ConceptMastery({ conceptId }: { conceptId: string }) {
  const [m, setM] = useState<CM | undefined>(undefined);
  useEffect(() => { getConceptMastery(conceptId).then(setM); }, [conceptId]);
  if (!m) return <div className="text-sm text-muted">Concepto {conceptId}</div>;
  const color = m.masteryPct >= 85 ? "bg-accent" : m.masteryPct >= 60 ? "bg-primary" : "bg-error";
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-mono text-xs text-muted">{conceptId}</span>
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${m.masteryPct}%` }} />
      </div>
      <span className="font-mono text-xs w-10 text-right">{m.masteryPct}%</span>
    </div>
  );
}
```

- [ ] **Step 5: Typecheck + commit**

```bash
npx tsc --noEmit
git add app/blocks/ components/LessonCard.tsx components/ConceptMastery.tsx
git commit -m "feat(ui): block detail + lesson detail + ConceptMastery"
```

---

## Milestone 3 — Practice (ExerciseRunner) + Audio

### Task 14: Exercise cards (5 tipos)

**Files:** Create `components/cards/FlashcardCard.tsx`, `FillBlankCard.tsx`, `ListeningCard.tsx`, `TranslationCard.tsx`, `VerbPrepositionCard.tsx`.

- [ ] **Step 1: FlashcardCard**

```tsx
// components/cards/FlashcardCard.tsx
"use client";
import type { Exercise } from "@/lib/exercise-resolver";
import { AudioButton } from "@/components/AudioButton";
import { useSettings } from "@/lib/stores/settings";
import { resolveExerciseData, resolveAudioHash } from "@/lib/exercise-resolver";
import { pickVoice, audioUrl } from "@/lib/audio/resolve";

interface Props { ex: Exercise; revealed: boolean; onReveal: () => void; }
export function FlashcardCard({ ex, revealed, onReveal }: Props) {
  const { variant, voicePref } = useSettings();
  const data = resolveExerciseData(ex, variant);
  const voice = pickVoice(ex, variant, voicePref);
  const hash = resolveAudioHash(ex, variant, voice);
  return (
    <div className="p-8 border-2 border-border rounded-2xl text-center space-y-6">
      <div className="text-xs text-muted uppercase">{revealed ? "Respuesta" : "Traduce al portugués"}</div>
      <div className="text-4xl font-display">{revealed ? data.back : data.front}</div>
      <AudioButton src={audioUrl(hash, variant, voice)} />
      {ex.esContrast && revealed && (
        <div className="text-sm text-muted italic">⚠️ {ex.esContrast}</div>
      )}
      {!revealed && (
        <button onClick={onReveal} className="text-sm text-muted hover:text-foreground">
          [Espacio] para revelar
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: FillBlankCard**

```tsx
// components/cards/FillBlankCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function FillBlankCard({ ex, onSubmit }: Props) {
  const { variant } = useStateSettings();
  const data = resolveExerciseData(ex, variant);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-xl text-center font-mono">{data.sentence}</div>
      {!revealed ? (
        <div className="flex gap-2">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { const ok = data.blanks.some(b => b.answer.toLowerCase() === input.trim().toLowerCase() || b.alternatives?.some(a => a.toLowerCase() === input.trim().toLowerCase())); setRevealed(true); onSubmit(input, ok); }}}
            className="flex-1 border-2 border-border rounded-md px-3 py-2 bg-background"
            placeholder="Resposta"
          />
          <button onClick={() => { const ok = data.blanks.some(b => b.answer.toLowerCase() === input.trim().toLowerCase()); setRevealed(true); onSubmit(input, ok); }} className="px-4 py-2 bg-primary rounded-md font-medium" disabled={!input.trim()}>OK</button>
        </div>
      ) : (
        <div className="text-center text-sm">
          Respuesta correcta: <span className="font-mono">{data.blanks[0]?.answer}</span>
        </div>
      )}
    </div>
  );
}

function useStateSettings() {
  const { useSettings } = require("@/lib/stores/settings");
  return useSettings();
}
```

- [ ] **Step 3: ListeningCard**

```tsx
// components/cards/ListeningCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";
import { AudioButton } from "@/components/AudioButton";
import { audioUrl } from "@/lib/audio/resolve";
import { resolveAudioHash } from "@/lib/exercise-resolver";
import { useSettings } from "@/lib/stores/settings";
import { pickVoice } from "@/lib/audio/resolve";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function ListeningCard({ ex, onSubmit }: Props) {
  const { variant, voicePref } = useSettings();
  const data = resolveExerciseData(ex, variant);
  const [answer, setAnswer] = useState<string | null>(null);
  const voice = pickVoice(ex, variant, voicePref);
  const hash = resolveAudioHash(ex, variant, voice);

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6 text-center">
      <div className="text-xs text-muted uppercase">Escucha y responde</div>
      <AudioButton src={audioUrl(hash, variant, voice)} size="lg" />
      <p className="text-lg">{data.question}</p>
      {data.options && (
        <div className="grid grid-cols-2 gap-2">
          {data.options.map((opt) => (
            <button
              key={opt}
              onClick={() => { setAnswer(opt); onSubmit(opt, opt === data.answer); }}
              className={`p-3 border-2 rounded-md text-left ${answer === opt ? (opt === data.answer ? "border-accent bg-accent/10" : "border-error bg-error/10") : "border-border hover:border-primary"}`}
              disabled={answer !== null}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: TranslationCard (handles both directions)**

```tsx
// components/cards/TranslationCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function TranslationCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings2();
  const data = resolveExerciseData(ex, variant);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6">
      <div className="text-xs text-muted uppercase">{ex.type === "translation_es_pt" ? "ES → PT" : "PT → ES"}</div>
      <div className="text-xl text-center font-mono">{data.source}</div>
      {!revealed ? (
        <div className="flex gap-2">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { setRevealed(true); const ok = data.target.toLowerCase() === input.trim().toLowerCase() || data.acceptedAlternatives?.some(a => a.toLowerCase() === input.trim().toLowerCase()) || false; onSubmit(input, ok); }}}
            className="flex-1 border-2 border-border rounded-md px-3 py-2 bg-background"
            placeholder="Traducción"
          />
          <button onClick={() => { setRevealed(true); const ok = data.target.toLowerCase() === input.trim().toLowerCase() || false; onSubmit(input, ok); }} disabled={!input.trim()} className="px-4 py-2 bg-primary rounded-md font-medium">OK</button>
        </div>
      ) : (
        <div className="text-center text-sm">Correcta: <span className="font-mono">{data.target}</span></div>
      )}
    </div>
  );
}

function useSettings2() {
  const { useSettings } = require("@/lib/stores/settings");
  return useSettings();
}
```

- [ ] **Step 5: VerbPrepositionCard**

```tsx
// components/cards/VerbPrepositionCard.tsx
"use client";
import { useState } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { resolveExerciseData } from "@/lib/exercise-resolver";

interface Props { ex: Exercise; onSubmit: (answer: string, correct: boolean) => void; }
export function VerbPrepositionCard({ ex, onSubmit }: Props) {
  const { variant } = useSettings3();
  const data = resolveExerciseData(ex, variant);
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <div className="p-8 border-2 border-border rounded-2xl space-y-6 text-center">
      <div className="text-xs text-muted uppercase">Régimen preposicional</div>
      <div className="text-sm text-muted">Verbo: <span className="font-mono">{data.verb}</span></div>
      <div className="text-xl font-mono">{data.sentence}</div>
      <div className="grid grid-cols-2 gap-2">
        {data.options.map((opt) => (
          <button
            key={opt}
            onClick={() => { setAnswer(opt); onSubmit(opt, opt === data.answer); }}
            className={`p-3 border-2 rounded-md ${answer === opt ? (opt === data.answer ? "border-accent bg-accent/10" : "border-error bg-error/10") : "border-border hover:border-primary"}`}
            disabled={answer !== null}
          >
            {opt === "—" ? "(sin preposición)" : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function useSettings3() {
  const { useSettings } = require("@/lib/stores/settings");
  return useSettings();
}
```

- [ ] **Step 6: Commit**

```bash
git add components/cards/
git commit -m "feat(ui): 5 exercise card components with audio + esContrast + keyboard hints"
```

---

### Task 15: ExerciseRunner — orchestador de sesión

**Files:** Create `components/ExerciseRunner.tsx`.

- [ ] **Step 1: Create ExerciseRunner**

```tsx
// components/ExerciseRunner.tsx
"use client";
import { useState, useEffect } from "react";
import type { Exercise } from "@/lib/exercise-resolver";
import { FlashcardCard } from "./cards/FlashcardCard";
import { FillBlankCard } from "./cards/FillBlankCard";
import { ListeningCard } from "./cards/ListeningCard";
import { TranslationCard } from "./cards/TranslationCard";
import { VerbPrepositionCard } from "./cards/VerbPrepositionCard";
import { db } from "@/lib/db/schema";
import { submitAnswer } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";
import { useSession } from "@/lib/stores/session";
import confetti from "canvas-confetti";
import { RATING } from "@/lib/db/schema";

interface Props {
  exercises: Exercise[];
  blockId: number;
  lessonId: string;
  onFinish: (stats: { reviewed: number; correct: number }) => void;
}

export function ExerciseRunner({ exercises, blockId, lessonId, onFinish }: Props) {
  const { variant } = useSettings();
  const { sessionId, mode, markPending, clearPending, incrCorrect, isPending } = useSession();
  const [idx, setIdx] = useState(0);
  const [shownAt, setShownAt] = useState<number>(Date.now());
  const ex = exercises[idx];

  useEffect(() => {
    if (!ex) return;
    markPending(ex.id);
    setShownAt(Date.now());
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " && ex.type === "flashcard" && !isPending(`${ex.id}-flipped`)) {
        e.preventDefault();
        const btn = document.getElementById("flashcard-reveal-btn");
        btn?.click();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [ex?.id]);

  if (!ex) {
    onFinish({ reviewed: exercises.length, correct: 0 });
    return null;
  }

  const handleAnswer = async (answer: string, correct: boolean) => {
    if (!sessionId) return;
    const rating = correct ? RATING.Good : RATING.Again;
    await submitAnswer({
      cardId: ex.id, rating, responseMs: Date.now() - shownAt,
      mode: mode || "lesson", variant, conceptIds: ex.concepts, blockId, sessionId,
    });
    incrCorrect(correct);
    if (correct) confetti({ particleCount: 50, spread: 70 });
    clearPending(ex.id);
    setIdx(idx + 1);
  };

  const handleFlashcardGrade = async (rating: 1 | 2 | 3 | 4) => {
    if (!sessionId) return;
    await submitAnswer({
      cardId: ex.id, rating, responseMs: Date.now() - shownAt,
      mode: mode || "lesson", variant, conceptIds: ex.concepts, blockId, sessionId,
    });
    incrCorrect(rating >= 3);
    if (rating >= 3) confetti({ particleCount: 50, spread: 70 });
    clearPending(ex.id);
    setIdx(idx + 1);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
      <div className="text-sm text-muted">{idx + 1} / {exercises.length}</div>
      {ex.type === "flashcard" && <FlashcardWithGrades ex={ex} onReveal={() => {}} onGrade={handleFlashcardGrade} />}
      {ex.type === "fill_blank" && <FillBlankCard ex={ex} onSubmit={handleAnswer} />}
      {ex.type === "listening" && <ListeningCard ex={ex} onSubmit={handleAnswer} />}
      {(ex.type === "translation_es_pt" || ex.type === "translation_pt_es") && <TranslationCard ex={ex} onSubmit={handleAnswer} />}
      {ex.type === "verb_preposition" && <VerbPrepositionCard ex={ex} onSubmit={handleAnswer} />}
    </div>
  );
}

function FlashcardWithGrades({ ex, onReveal, onGrade }: { ex: Exercise; onReveal: () => void; onGrade: (r: 1 | 2 | 3 | 4) => void }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="space-y-4">
      <FlashcardCard ex={ex} revealed={revealed} onReveal={() => { setRevealed(true); onReveal(); }} />
      {revealed && (
        <div className="grid grid-cols-4 gap-2 text-sm">
          {([["Otra vez", 1], ["Difícil", 2], ["Bien", 3], ["Fácil", 4]] as [string, 1 | 2 | 3 | 4][]).map(([label, rating]) => (
            <button
              key={rating}
              onClick={() => onGrade(rating)}
              className="p-3 border-2 border-border rounded-md hover:border-primary"
            >
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted">{rating}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ExerciseRunner.tsx
git commit -m "feat(ui): ExerciseRunner orchestrating session with keyboard + grading + confetti"
```

---

### Task 16: Practice session page

**Files:** Create `app/practice/[lessonId]/page.tsx`.

- [ ] **Step 1: Create practice page**

```tsx
// app/practice/[lessonId]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { getLesson } from "@/lib/data/curriculum";
import { getOrCreateCard } from "@/lib/db/repository";
import { db } from "@/lib/db/schema";
import { ExerciseRunner } from "@/components/ExerciseRunner";
import { ExerciseSchema, type Exercise } from "@/lib/exercise-resolver";

export default function PracticePage({ params }: { params: Promise<{ lessonId: string }> }) {
  const [exercises, setExercises] = useState<Exercise[] | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [blockId, setBlockId] = useState<number | null>(null);
  const [done, setDone] = useState<{ reviewed: number; correct: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    params.then(p => {
      const l = getLesson(p.lessonId);
      setLessonId(l.id);
      setBlockId(l.blockId);
    });
  }, [params]);

  useEffect(() => {
    if (lessonId === null || blockId === null) return;
    (async () => {
      const { ExerciseDataByTypeSchema, ExerciseSchema } = await import("@/lib/data/zod-schemas-runtime");
      void ExerciseDataByTypeSchema; // ensures import
      const blockData = await import(`@/lib/data/blocks/b${blockId}.json`);
      const raw: Exercise[] = (blockData.default || blockData).filter((e: Exercise) => e.lessonId === lessonId);
      // Get or create cards
      const cards = await Promise.all(
        raw.map(async (e) => {
          await getOrCreateCard(e.id, e.blockId, e.lessonId);
          return ExerciseSchema.parse(e);
        })
      );
      setExercises(cards);

      const sid = await db.sessions.add({
        startedAt: new Date(), blockId, lessonId, mode: "lesson", cardsReviewed: 0, correctCount: 0, durationMs: 0,
      });
      setSessionId(sid as number);
    })();
  }, [lessonId, blockId]);

  useEffect(() => {
    if (!done) return;
    (async () => {
      const { useSession } = await import("@/lib/stores/session");
      useSession.getState().endSession();
      if (sessionId) {
        await db.sessions.update(sessionId, { endedAt: new Date(), cardsReviewed: done.reviewed, correctCount: done.correct });
      }
    })();
  }, [done, sessionId]);

  if (done) {
    const pct = Math.round((done.correct / Math.max(done.reviewed, 1)) * 100);
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-4xl">¡Sesión completa!</h1>
        <div className="text-6xl font-display">{pct}%</div>
        <p className="text-muted">{done.correct} de {done.reviewed} correctas</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => router.push("/blocks")} className="px-4 py-2 border border-border rounded-md">Volver a bloques</button>
          <button onClick={() => router.push("/")} className="px-4 py-2 bg-primary rounded-md">Inicio</button>
        </div>
      </div>
    );
  }

  if (!exercises || !sessionId || !lessonId || blockId === null) {
    return <div className="p-12 text-center text-muted">Cargando...</div>;
  }

  return <ExerciseRunner exercises={exercises} blockId={blockId} lessonId={lessonId} onFinish={setDone} />;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/practice/
git commit -m "feat(ui): practice session page with session creation + completion screen"
```

---

### Task 17: Learn page (daily mix launcher)

**Files:** Create `app/learn/page.tsx`.

- [ ] **Step 1: Create learn page**

```tsx
// app/learn/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDueCards } from "@/lib/db/repository";
import { db } from "@/lib/db/schema";
import { ExerciseSchema, type Exercise } from "@/lib/exercise-resolver";

export default function LearnPage() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const due = await getDueCards(new Date(), 20);
      setCount(due.length);
      setLoading(false);
    })();
  }, []);

  const startDailyMix = async () => {
    const due = await getDueCards(new Date(), 20);
    if (due.length === 0) { router.push("/blocks"); return; }
    // Pick first blockId from due cards; if mixed, use block 1
    const blockId = due[0]?.blockId ?? 1;
    const exercises: Exercise[] = [];
    for (const card of due) {
      const blockData = await import(`@/lib/data/blocks/b${blockId}.json`);
      const found = (blockData.default || blockData).find((e: any) => e.id === card.id);
      if (found) exercises.push(ExerciseSchema.parse(found));
    }
    if (exercises.length === 0) { router.push("/blocks"); return; }
    const lessonId = exercises[0].lessonId;
    router.push(`/practice/${lessonId}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6 text-center">
      <h1 className="font-display text-4xl">Sesión de estudio</h1>
      <div className="text-6xl font-display">{loading ? "…" : count}</div>
      <p className="text-muted">tarjetas listas para revisar</p>
      <button
        onClick={startDailyMix}
        disabled={loading || count === 0}
        className="w-full p-4 bg-primary text-fg rounded-xl font-medium disabled:opacity-50"
      >
        Empezar sesión →
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/learn/
git commit -m "feat(ui): learn page (daily mix launcher)"
```

---

## Milestone 4 — Settings + Verification

### Task 18: Settings page

**Files:** Create `app/settings/page.tsx`.

- [ ] **Step 1: Create settings page**

```tsx
// app/settings/page.tsx
"use client";
import { useSettings } from "@/lib/stores/settings";
import { useTheme } from "@/components/ThemeProvider";
import { VariantToggle } from "@/components/VariantToggle";
import { VoicePicker } from "@/components/VoicePicker";

export default function SettingsPage() {
  const { dailyGoalMinutes, showCompareToggle, showContrast, soundFx, setDailyGoal, toggleCompare } = useSettings();
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <h1 className="font-display text-4xl">Settings</h1>

      <Section title="Variante">
        <VariantToggle />
      </Section>

      <Section title="Voz del audio">
        <VoicePicker />
      </Section>

      <Section title="Tema">
        <select value={theme} onChange={(e) => setTheme(e.target.value as "light" | "dark")} className="border border-border rounded-md px-3 py-2 bg-background">
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>
      </Section>

      <Section title="Meta diaria (minutos)">
        <input
          type="number" min={5} max={120} step={5}
          value={dailyGoalMinutes}
          onChange={(e) => setDailyGoal(Number(e.target.value))}
          className="border border-border rounded-md px-3 py-2 bg-background w-24"
        />
      </Section>

      <Section title="Display">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showCompareToggle} onChange={toggleCompare} />
          Mostrar toggle "Comparar BR ↔ PT" en cards
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showContrast} disabled />
          Mostrar pista para hispanohablantes (esContrast)
        </label>
      </Section>

      <Section title="Sonido">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={soundFx} disabled />
          Efectos de sonido (ding/boop/confetti)
        </label>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border rounded-lg p-4 space-y-2">
      <h2 className="font-medium">{title}</h2>
      <div className="space-y-1">{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/settings/
git commit -m "feat(ui): settings page (variant, voice, theme, daily goal, toggles)"
```

---

### Task 19: Final verification + tag

- [ ] **Step 1: Static gates**

```bash
npx tsc --noEmit
npm test
```

Expected: typecheck 0 errors, all tests pass.

- [ ] **Step 2: Dev server smoke test**

```bash
npm run dev -- --port 3002
```

Manually verify in browser:
- Home: loads with due cards count, variant toggle works
- /blocks: shows 10 blocks, Block 1 unlocked
- /blocks/1: shows 5 lessons of fonética
- /blocks/1/lessons/b1-l1-alfabeto-acentos/practice: study session works, audio plays
- /settings: all controls functional

- [ ] **Step 3: Commit and tag**

```bash
git add -A
git commit -m "feat(ui): MVP #2 — UI study app for Block 1" --allow-empty
git tag -a mvp-2-ui -m "MVP #2: Home + Blocks + Lesson + Practice + Settings"
git push origin main
git push origin mvp-2-ui
```

---

## Done — what you have now

- **Full UI to study Bloque 1 end-to-end**: home → blocks → lesson → practice → completion
- **FSRS-5 SRS** with persistence in Dexie
- **Audio playback** with 6 voice variants (f/m × neutral/happy/calm) — though only `f_neutral`/`m_neutral` actually have audio files for Bloque 1 (Plan #4 generates the rest)
- **BR ↔ PT toggle** in NavBar and per-card
- **Theme** (light/dark) with persistence
- **Per-lesson practice session** with all 5 exercise types wired
- **Keyboard shortcuts** (Space to reveal flashcard)
- **Mastery % per concept** shown in lesson detail
- **Settings page** with all controls

### What's deferred to Plan #3

- Daily Mix with interleaving (currently just "next 20 due cards")
- Achievements/notifications
- Error queue UI
- /concepts and /concepts/[id] full pages
- /drill (free practice by concept)
- /stats with heatmap + recharts
- /achievements grid
- Diagnostic test
- Story karaoke
- Shadowing mode

### Known limitations of MVP #2

- **Only 1 audio per exercise per variant** (f_neutral default). The picker shows other 4 variants but they 404. Plan #4 will regen with full variant set.
- **No streak counter** in home dashboard (only the design's `dueCount`). Plan #3.
- **No onboarding flow** — first-time user lands directly on home.
- **No offline detection** — if audio 404s, the button just shows "—".
- **No ESLint config check** — using defaults from CNA.
- **No playwright e2e tests yet** for the UI — only vitest unit tests for data layer.
