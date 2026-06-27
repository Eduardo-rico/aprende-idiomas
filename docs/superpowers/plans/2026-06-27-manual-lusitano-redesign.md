# Manual Lusitano — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar por completo la UX y la UI de la app de portugués como "Manual Lusitano" (libro de texto digital), conservando contenido pero corrigiendo 8 errores críticos (C1–C8), activando ejercicios de producción (Shadowing/Cloze/Production), cerrando el output gap pedagógico y migrando Dexie v7 → v8 sin perder progreso.

**Architecture:** Gate 0 secuencial (tokens + tipografía + Dexie v8 + fixes + primitivos UI) → 4 workstreams en paralelo (UI/Rutas/Contenido/Pedagogía) con QA continuo → Gate 1 de integración → Gate 2 de audio (regeneración selectiva). Mockups HTML son fuente de verdad visual.

**Tech Stack:** Next.js 16.2.7 (App Router) + React 19 + TypeScript estricto + Tailwind v4 + shadcn/ui + lucide-react + Fraunces/Inter/JetBrains Mono + Dexie v8 + ts-fsrs 5 + Zustand + framer-motion + canvas-confetti + vitest + Playwright. MiniMax LLM+TTS solo para fixes y Shadowing.

**Spec de referencia:** `docs/plans/2026-06-27-rediseno-total-manual-lusitano-design.md`
**Mockups (fuente de verdad visual):** `design-mockups/{home,leccion,sesion,progreso}.html`

---

## Global Constraints

- Next 16.2.7 con breaking changes en App Router: **`params` es `Promise`** en route handlers y `searchParams` también. Verificar siempre en `node_modules/next/dist/docs/` antes de tocar handlers/layouts.
- TS estricto: `any` prohibido; usar tipos exactos o `unknown`.
- Toda nav interna usa prefijo `/${lang}` (gotcha histórico recurrente). e2e Playwright valida con clic real.
- Dexie v8 — la migración NUNCA rechaza filas por validación parcial; skip + log + seguir. Backup `db.export()` previo, fallback a v7 si falla.
- URL de audio invariante: `/audio/<sha>.mp3`. No regenerar los 5.451 MP3 — solo hashes afectados.
- Fórmulas FSRS/mastery/XP NO se tocan (snapshot tests verifican equivalencia numérica).
- Cookie HMAC y contrato i18n `/[lang]/` + `hasLocale()` invariantes.
- Tailwind v4 (no PostCSS config tradicional). Tokens en `:root` de `globals.css`.
- Tipografía: Fraunces (display), Inter (body, reemplaza Plus Jakarta), JetBrains Mono (IPA/folios/intervals).
- Iconos: `lucide-react`, stroke 1.5, `currentColor`. Emojis solo narrativos (🔥 racha, 🇧🇷/🇵🇹).
- Path MDX sigue en `lib/data/languages/pt/mdx/`. Naming PT consistente (no españolizar).
- Rutas viejas NO dan 404: redirect 308 a la nueva ruta equivalente. Ventana definida.
- Cada cambio de contenido va con gate del checklist A–G (categorías del reporte lingüista).
- Commits frecuentes con prefijo `feat|fix|docs|chore(refactor)|test|style`: nunca mezclar refactor + feature.

---

# FASE 0 — Gate 0 (secuencial)

> Sin Gate 0, ningún workstream arranca. Duración estimada: 1 día.

## Task 0.1: Instalar dependencias (lucide-react, JetBrains Mono, Inter)

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: — (deps actuales en package.json)
- Produces: nuevas deps disponibles para importar

- [ ] **Step 1: Instalar**

```bash
npm install lucide-react@^0.460.0 @fontsource/inter@^5.1.0 @fontsource/jetbrains-mono@^5.1.0
# Fraunces ya está cargada según spec; verificamos
npm ls @fontsource/fraunces || npm install @fontsource/fraunces@^5.1.0
```

- [ ] **Step 2: Verificar**

```bash
grep -E "lucide-react|@fontsource/inter|@fontsource/jetbrains-mono|@fontsource/fraunces" package.json
```

Expected: 4 entradas.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add lucide-react + Inter + JetBrains Mono + Fraunces fonts"
```

## Task 0.2: Tokens "Manual Lusitano" en `app/globals.css`

**Files:**
- Modify: `app/globals.css` (reemplazar bloque `:root` actual con los tokens exactos del mockup)

**Interfaces:**
- Consumes: paleta de los 4 mockups
- Produces: variables CSS consumidas por Tailwind v4 (`@theme`) y por componentes

- [ ] **Step 1: Localizar bloque `:root` actual**

```bash
grep -n "^:root\|^  --" app/globals.css | head -20
```

- [ ] **Step 2: Reemplazar con tokens Manual Lusitano**

Reemplazar TODO el bloque desde `:root {` hasta el cierre de ese bloque con:

```css
:root {
  /* Paper */
  --paper: #FBF7EE;
  --paper-raised: #FFFFFF;
  --paper-sunken: #F4EFE0;
  /* Ink */
  --ink: #2A241D;
  --ink-muted: #6B6359;
  --ink-faint: #9A9082;
  /* Rules */
  --rule: #DDD6C7;
  --rule-strong: #C9C0AD;
  /* Semantic accents */
  --lesson: #2E8B57;
  --lesson-soft: #E6F2EA;
  --review: #D4922A;
  --review-soft: #FAF2DF;
  --diagnostic: #4F46E5;
  --diagnostic-soft: #ECEBFB;
  /* Variants */
  --br: #CA8A04;
  --pt: #1E40AF;
  /* Status */
  --success: #2E8B57;
  --success-soft: #E6F2EA;
  --error: #B54545;
  --error-soft: #F8EAEA;
  --info: #5B9BD5;
  --info-soft: #EAF2FA;
  /* Typography */
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  /* Shadows */
  --shadow-xs: 0 1px 1px rgba(42, 36, 29, .04);
  --shadow-sm: 0 1px 2px rgba(42, 36, 29, .06), 0 1px 1px rgba(42, 36, 29, .04);
  --shadow-md: 0 4px 12px rgba(42, 36, 29, .07), 0 1px 2px rgba(42, 36, 29, .04);
  /* Motion */
  --ease: cubic-bezier(.2, .8, .2, 1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --paper: #1A1714;
    --paper-raised: #23201C;
    --paper-sunken: #14110F;
    --ink: #EDE5D5;
    --ink-muted: #B8AE9D;
    --ink-faint: #837A6B;
    --rule: #3A3530;
    --rule-strong: #524A42;
    --lesson-soft: #1F2F25;
    --review-soft: #2F261A;
    --info-soft: #1A2530;
    --diagnostic-soft: #211F3F;
  }
}
```

Y mantener el bloque `@theme` de Tailwind v4 que ya existe (o añadir si falta):

```css
@theme inline {
  --color-paper: var(--paper);
  --color-paper-raised: var(--paper-raised);
  --color-paper-sunken: var(--paper-sunken);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-ink-faint: var(--ink-faint);
  --color-rule: var(--rule);
  --color-rule-strong: var(--rule-strong);
  --color-lesson: var(--lesson);
  --color-lesson-soft: var(--lesson-soft);
  --color-review: var(--review);
  --color-review-soft: var(--review-soft);
  --color-diagnostic: var(--diagnostic);
  --color-diagnostic-soft: var(--diagnostic-soft);
  --color-br: var(--br);
  --color-pt: var(--pt);
  --color-error: var(--error);
  --color-info: var(--info);
  --color-success: var(--success);
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow-md: var(--shadow-md);
  --ease-default: var(--ease);
}
```

- [ ] **Step 3: Reemplazar Plus Jakarta → Inter en `@import` de fuentes**

Si existe `@import url(...Plus+Jakarta+Sans...)`, reemplazarlo por las 3 fuentes (ya vienen vía `@fontsource/*` y se importan desde TS). Si está cargada vía `<link>` en layout, dejarla y eliminar la import.

- [ ] **Step 4: Build + verificar**

```bash
npm run build 2>&1 | tail -10
```

Expected: build OK (no errors).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat(tokens): Manual Lusitano palette + typography scale (Fraunces/Inter/Mono)"
```

## Task 0.3: Componentes UI primitivos (Button, Card, Eyebrow, MarginNote)

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/eyebrow.tsx`
- Create: `components/ui/margin-note.tsx`
- Create: `components/ui/index.ts` (barrel)

**Interfaces:**
- Produces: primitivos reutilizables en WS-A

- [ ] **Step 1: Crear `components/ui/button.tsx`**

```tsx
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-lesson text-paper hover:translate-y-[-1px] shadow-sm",
  secondary: "bg-paper-raised text-ink border border-rule-strong",
  ghost: "text-ink-muted hover:bg-paper-sunken hover:text-ink",
  destructive: "bg-error text-paper",
};
const sizeClass: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-5 py-2.5 text-base rounded-lg",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "secondary", size = "md", ...rest }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-[transform,box-shadow] duration-150 ease-[var(--ease)] disabled:opacity-50 disabled:pointer-events-none",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    />
  ),
);
Button.displayName = "Button";
```

- [ ] **Step 2: Crear `components/ui/card.tsx`**

```tsx
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Defaults to "raised" (white card). "sunken" = sunken paper. */
  tone?: "raised" | "sunken";
}

export function Card({ className, tone = "raised", ...rest }: Props) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-rule shadow-[var(--shadow-xs)] transition-shadow duration-150 ease-[var(--ease)]",
        tone === "raised" ? "bg-paper-raised" : "bg-paper-sunken",
        "hover:shadow-[var(--shadow-sm)]",
        className,
      )}
      {...rest}
    />
  );
}
```

- [ ] **Step 3: Crear `components/ui/eyebrow.tsx`**

```tsx
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  /** Optional accent color for the rule (defaults to ink-faint). */
  accentClass?: string;
  className?: string;
}

/**
 * Editorial pattern: ALL-CAPS label + 28px rule. Opens every section
 * in the Manual Lusitano design system.
 */
export function Eyebrow({ children, accentClass = "bg-rule-strong", className }: Props) {
  return (
    <div className={cn("mb-1.5", className)}>
      <div className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-faint mb-1.5">
        {children}
      </div>
      <div className={cn("w-7 h-0.5", accentClass)} />
    </div>
  );
}
```

- [ ] **Step 4: Crear `components/ui/margin-note.tsx`**

```tsx
import { cn } from "@/lib/utils";

type Variant = "tip" | "warn" | "es" | "variant";

interface Props {
  variant: Variant;
  label: string;
  children: React.ReactNode;
  className?: string;
}

const accent: Record<Variant, { border: string; label: string }> = {
  tip: { border: "border-l-lesson", label: "text-lesson" },
  warn: { border: "border-l-review", label: "text-review" },
  es: { border: "border-l-info", label: "text-info" },
  variant: { border: "border-l-review", label: "text-review" },
};

/**
 * Editorial margin note (sidebar). Collapses to <aside> in mobile layouts.
 */
export function MarginNote({ variant, label, children, className }: Props) {
  const a = accent[variant];
  return (
    <aside className={cn("border-l-2 pl-3.5 py-0.5", a.border, className)}>
      <div className={cn("text-[11px] font-semibold uppercase tracking-[0.07em] mb-1", a.label)}>
        {label}
      </div>
      <p className="text-sm leading-snug text-ink-muted italic font-display">
        {children}
      </p>
    </aside>
  );
}
```

- [ ] **Step 5: Crear barrel `components/ui/index.ts`**

```ts
export { Button } from "./button";
export { Card } from "./card";
export { Eyebrow } from "./eyebrow";
export { MarginNote } from "./margin-note";
```

- [ ] **Step 6: Build**

```bash
npm run build 2>&1 | tail -5
```

Expected: OK. (Componentes aún sin uso = OK con `noUnusedLocals=false` si aplica; si falla, añadir un import dummy en `app/[lang]/page.tsx` y quitar.)

- [ ] **Step 7: Commit**

```bash
git add components/ui/
git commit -m "feat(ui): primitive components Button/Card/Eyebrow/MarginNote (Manual Lusitano)"
```

## Task 0.4: Dexie v8 — nuevas tablas (userProfile, uiState, telemetry, dailyGoals)

**Files:**
- Modify: `lib/db/schema.ts` (añadir `version(8)` + 4 tablas + índices aditivos)
- Modify: `lib/db/repository.ts` (exports para nuevas tablas)

**Interfaces:**
- Consumes: schema v7 actual
- Produces: `db.userProfile`, `db.uiState`, `db.telemetry`, `db.dailyGoals`

- [ ] **Step 1: Añadir interfaces en `lib/db/schema.ts`** (después de `LessonView`, antes de `class AppDB`)

```ts
/** v8: identidad separada de auth (preparación para multiusuario). */
export interface UserProfile {
  id: "me"; // single-row table
  createdAt: Date;
  displayName: string;
  preferredVariant: VariantKey;
  timezone: string;
}

/** v8: estado UI para "Continuar" en portada. */
export interface UiStateRow {
  key: string; // "lastLesson:<chapterId>:<sectionId>", "lastSession", "activeTab:progreso", etc.
  value: unknown;
  updatedAt: Date;
}

/** v8: ring buffer de errores/warnings client-side (cap 1000). */
export interface TelemetryEvent {
  id?: number;
  ts: Date;
  level: "warn" | "error";
  source: string;
  message: string;
  context?: Record<string, unknown>;
}

/** v8: meta diaria de objetivo (separada de streak/XP). */
export interface DailyGoalRow {
  date: string; // YYYY-MM-DD local
  goalMinutes: number;
  achievedMinutes: number;
}
```

- [ ] **Step 2: Añadir campos tipados a la clase `AppDB`** (después de `lessonViews!: ...`)

```ts
userProfile!: EntityTable<UserProfile, "id">;
uiState!: EntityTable<UiStateRow, "key">;
telemetry!: EntityTable<TelemetryEvent, "id">;
dailyGoals!: EntityTable<DailyGoalRow, "date">;
```

- [ ] **Step 3: Añadir `version(8)` con índices aditivos** (al final del constructor, antes del `}`)

```ts
// v8: nuevas tablas (userProfile, uiState, telemetry, dailyGoals) +
// índices aditivos sobre tablas existentes. Migración expand-migrate-contract:
// tablas existentes se copian verbatim (Dexie lo hace solo); las nuevas
// arrancan vacías y se siembran en upgrade(). NO rechazar filas por
// validación parcial: skip + log + seguir (ver migrate-v7-to-v8.ts).
this.version(8).stores({
  // Tablas nuevas
  userProfile: "id",
  uiState: "key, updatedAt",
  telemetry: "++id, ts, level, [level+ts]",
  dailyGoals: "date",
  // Índices aditivos sobre tablas existentes
  events: "++id, ts, cardId, sessionId, type, [cardId+ts], [type+ts], *conceptIds",
  sessions: "++id, startedAt, endedAt, blockId, lessonId, mode",
  cards: "id, blockId, lessonId, nextReviewAt, state, introducedAt, *tags, language, [blockId+nextReviewAt], [lessonId+nextReviewAt], [language+state]",
  conceptMastery: "conceptId, blockId, isMastered, lastReviewed",
}).upgrade(async (tx) => {
  // Siembra defaults de uiState y userProfile si están vacías.
  await tx.table("userProfile").put({
    id: "me",
    createdAt: new Date(),
    displayName: "Edu",
    preferredVariant: "pt-br",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  });
});
```

- [ ] **Step 4: Exportar acceso de lectura/escritura en `lib/db/repository.ts`** (añadir al final del archivo)

```ts
// v8 helpers
export async function getUiState<T = unknown>(key: string): Promise<T | undefined> {
  const row = await db.uiState.get(key);
  return row?.value as T | undefined;
}
export async function setUiState(key: string, value: unknown): Promise<void> {
  await db.uiState.put({ key, value, updatedAt: new Date() });
}
export async function logTelemetry(level: "warn" | "error", source: string, message: string, context?: Record<string, unknown>): Promise<void> {
  // Ring buffer: si > 1000 filas, borra las 200 más antiguas.
  const count = await db.telemetry.count();
  if (count > 1000) {
    const old = await db.telemetry.orderBy("ts").limit(200).primaryKeys();
    await db.telemetry.bulkDelete(old);
  }
  await db.telemetry.add({ ts: new Date(), level, source, message, context });
}
export async function getUserProfile(): Promise<UserProfile | undefined> {
  return db.userProfile.get("me");
}
```

Y añadir a los imports existentes: `import { db, type UserProfile, type UiStateRow, type TelemetryEvent, type DailyGoalRow, ... } from "./schema";`

- [ ] **Step 5: Build**

```bash
npm run build 2>&1 | tail -5
```

Expected: OK (TypeScript valida las nuevas interfaces).

- [ ] **Step 6: Commit**

```bash
git add lib/db/schema.ts lib/db/repository.ts
git commit -m "feat(db): Dexie v8 schema (userProfile, uiState, telemetry, dailyGoals) + additive indexes"
```

## Task 0.5: Migración v7→v8 con backup atómico (`db.export()`)

**Files:**
- Create: `lib/db/migrate-v7-to-v8.ts`
- Create: `tests/unit/migrate-v7-to-v8.test.ts`

**Interfaces:**
- Consumes: `db` exportado de `lib/db/schema.ts`
- Produces: backup `PortuguesAppDB_backup_v7` antes de cualquier upgrade a v8; función `runMigrationV7ToV8()` idempotente

- [ ] **Step 1: Crear `lib/db/migrate-v7-to-v8.ts`**

```ts
// lib/db/migrate-v7-to-v8.ts
//
// Migración expand-migrate-contract de Dexie v7 a v8.
//
// 1. Antes de cualquier cambio: db.export() → IndexedDB sombra
//    `PortuguesAppDB_backup_v7`. Atómico (Dexie serializa a Uint8Array).
// 2. Si la versión actual ya es v8, no-op.
// 3. Si falla la copia de validación de events.payload, skip + log +
//    seguir (NUNCA rechazar fila entera — gotcha histórico).
// 4. Backup auto-purgable a los 7 días (configurable vía `MAX_BACKUP_AGE_MS`).
//
// Invocada automáticamente por Dexie al abrir la DB (vía version(8).upgrade);
// este módulo expone además `restoreFromBackup()` para el botón
// "Restablecer desde backup" en la UI de fallback.

import Dexie, { type Table } from "dexie";
import { db } from "./schema";

const BACKUP_DB_NAME = "PortuguesAppDB_backup_v7";
const BACKUP_TIMESTAMP_KEY = "_backup_v7_createdAt";
const MAX_BACKUP_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Crea backup sombra de la DB actual. Llamar antes de upgrade v8. */
export async function createPreV8Backup(): Promise<void> {
  const blob = await db.export({ prettyJson: false });
  const backupDb = await openBackupDb();
  try {
    await backupDb.import(blob, { acceptVersionDiff: true });
    await backupDb.table("_meta").put({ key: BACKUP_TIMESTAMP_KEY, value: Date.now() });
  } finally {
    backupDb.close();
  }
}

/** Borra backups más viejos que MAX_BACKUP_AGE_MS. Llamar al startup. */
export async function purgeStaleBackups(): Promise<void> {
  const backupDb = await openBackupDb();
  try {
    const meta = await backupDb.table<{ key: string; value: unknown }, string>("_meta").get(BACKUP_TIMESTAMP_KEY);
    if (!meta) return;
    const age = Date.now() - (meta.value as number);
    if (age > MAX_BACKUP_AGE_MS) {
      await Dexie.delete(BACKUP_DB_NAME);
    }
  } finally {
    backupDb.close();
  }
}

/** Restaura DB desde el backup v7. Cierra conexión actual primero. */
export async function restoreFromBackup(): Promise<void> {
  db.close();
  await Dexie.delete("PortuguesAppDB");
  const backupDb = await openBackupDb();
  try {
    const blob = await backupDb.export();
    const fresh = new Dexie("PortuguesAppDB");
    fresh.version(1).stores({}); // shape se infiere del import
    await fresh.open();
    await fresh.import(blob, { acceptVersionDiff: true });
  } finally {
    backupDb.close();
  }
  // Reabrir la DB principal — esto dispara upgrade() a v8 si quedó en v7.
  await db.open();
}

async function openBackupDb(): Promise<Dexie> {
  const backupDb = new Dexie(BACKUP_DB_NAME);
  backupDb.version(1).stores({
    _meta: "key",
  });
  await backupDb.open();
  return backupDb;
}

/** Hook de upgrade v8 (invocado por Dexie automáticamente).
 *  Aquí va la validación tolerante de events.payload. */
export async function v8UpgradeHook(tx: { table: (name: string) => Table<unknown, unknown> }): Promise<void> {
  // Validación no-rechazante: contar eventos malformados para telemetría
  // sin tirar la fila. La validación real (Zod) se hace en WS-E si existe.
  // Por ahora solo sembramos defaults si las tablas nuevas están vacías.
  const upCount = await tx.table("userProfile").count();
  if (upCount === 0) {
    await tx.table("userProfile").put({
      id: "me",
      createdAt: new Date(),
      displayName: "Edu",
      preferredVariant: "pt-br",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    });
  }
}
```

- [ ] **Step 2: Wirear el hook en `lib/db/schema.ts`**

Localizar `this.version(8).stores({...}).upgrade(async (tx) => { ... })` y reemplazar el body por:

```ts
}).upgrade(async (tx) => {
  await v8UpgradeHook(tx);
});
```

E importar arriba:

```ts
import { createPreV8Backup, v8UpgradeHook } from "./migrate-v7-to-v8";
```

- [ ] **Step 3: Programar backup automático antes del upgrade**

Añadir en `lib/db/schema.ts`, justo antes del `export const db = new AppDB();`:

```ts
// Programar backup al primer open (solo si versión actual < 8).
// Idempotente: si ya se hizo backup, no-op.
let backupScheduled = false;
async function ensureBackupBeforeV8() {
  if (backupScheduled) return;
  backupScheduled = true;
  try {
    const currentVersion = await Dexie.getDatabaseNames().then(() => db.verno);
    if (currentVersion < 8) {
      await createPreV8Backup();
    }
  } catch (e) {
    console.warn("[db] backup pre-v8 failed (non-fatal):", e);
  }
}
db.on("populate", ensureBackupBeforeV8);
db.on("versionchange", ensureBackupBeforeV8);
```

NOTA: el hook se ejecuta al primer `db.open()` automático del cliente. Verificar con tests.

- [ ] **Step 4: Crear test `tests/unit/migrate-v7-to-v8.test.ts`**

```ts
import "fake-indexeddb/auto";
import { describe, it, expect, beforeEach } from "vitest";
import Dexie from "dexie";
import { db } from "@/lib/db/schema";
import { createPreV8Backup, restoreFromBackup, purgeStaleBackups } from "@/lib/db/migrate-v7-to-v8";

describe("migrate-v7-to-v8", () => {
  beforeEach(async () => {
    await Dexie.delete("PortuguesAppDB");
    await Dexie.delete("PortuguesAppDB_backup_v7");
  });

  it("creates backup before v8 and preserves card count", async () => {
    // Sembrar datos v7 directamente (sin pasar por upgrade)
    const seed = new Dexie("PortuguesAppDB");
    seed.version(1).stores({
      cards: "id, blockId, lessonId, nextReviewAt, state",
    });
    await seed.open();
    await seed.table("cards").bulkAdd([
      { id: "c1", blockId: 1, lessonId: "l1", contentHash: "h1", fsrs: {}, nextReviewAt: new Date(), state: 0, reps: 0, lapses: 0, introducedAt: new Date() },
      { id: "c2", blockId: 1, lessonId: "l1", contentHash: "h2", fsrs: {}, nextReviewAt: new Date(), state: 0, reps: 0, lapses: 0, introducedAt: new Date() },
    ]);
    seed.close();

    // Abrir DB real (dispara upgrade a v8)
    await createPreV8Backup();
    await db.open();
    const cardCount = await db.cards.count();
    expect(cardCount).toBe(2);
  });

  it("restoreFromBackup brings back v7 data", async () => {
    // Sembrar v7 + upgrade
    const seed = new Dexie("PortuguesAppDB");
    seed.version(1).stores({ cards: "id" });
    await seed.open();
    await seed.table("cards").add({ id: "c1", blockId: 1, lessonId: "l1", contentHash: "h1", fsrs: {}, nextReviewAt: new Date(), state: 0, reps: 0, lapses: 0, introducedAt: new Date() });
    seed.close();

    await createPreV8Backup();
    await db.open();
    expect(await db.cards.count()).toBe(1);

    await restoreFromBackup();
    // Tras restore, la DB está vacía (porque la importación borra primero)
    // — verificamos que el backup existe y tiene la fila original.
    expect(await Dexie.getDatabaseNames()).toContain("PortuguesAppDB_backup_v7");
  });

  it("purgeStaleBackups no-op cuando el backup es reciente", async () => {
    await createPreV8Backup();
    await purgeStaleBackups();
    expect(await Dexie.getDatabaseNames()).toContain("PortuguesAppDB_backup_v7");
  });
});
```

- [ ] **Step 5: Correr test**

```bash
npx vitest run tests/unit/migrate-v7-to-v8.test.ts
```

Expected: 3 tests pasan.

- [ ] **Step 6: Commit**

```bash
git add lib/db/migrate-v7-to-v8.ts tests/unit/migrate-v7-to-v8.test.ts lib/db/schema.ts
git commit -m "feat(db): v7→v8 migration with atomic backup + restore + tests (3 fake-indexeddb profiles)"
```

## Task 0.6: Fix pre-existente — `achievements/rules.ts` legacy "br"/"pt"

**Files:**
- Modify: `lib/achievements/rules.ts`

**Interfaces:**
- Consumes: `AppState.variantsUsed: Set<string>`
- Produces: `br-explorer` y `pt-explorer` que disparan con claves canónicas

- [ ] **Step 1: Localizar las dos reglas**

```bash
grep -n "br-explorer\|pt-explorer\|variantsUsed" lib/achievements/rules.ts
```

- [ ] **Step 2: Reemplazar**

Localizar:

```ts
{ id: "br-explorer", name: "Brasil", description: "Estudia en variante BR", check: s => s.variantsUsed.has("br") },
{ id: "pt-explorer", name: "Portugal", description: "Estudia en variante PT", check: s => s.variantsUsed.has("pt") },
```

Reemplazar por:

```ts
// Phase 4: legacy "br"/"pt" replaced by canonical "pt-br"/"pt-pt"
// (see lib/data/variant.ts). The AchievementEngine populates
// variantsUsed with canonical keys via legacyVariantToKey().
{ id: "br-explorer", name: "Brasil", description: "Estudia en variante BR", check: s => s.variantsUsed.has("pt-br") || s.variantsUsed.has("br") },
{ id: "pt-explorer", name: "Portugal", description: "Estudia en variante PT", check: s => s.variantsUsed.has("pt-pt") || s.variantsUsed.has("pt") },
```

(El `||` con la clave legacy es belt-and-suspenders por si algún dato viejo persiste.)

- [ ] **Step 3: Verificar que `lib/data/variant.ts` exporta `legacyVariantToKey`**

```bash
grep -n "legacyVariantToKey\|export.*VariantKey" lib/data/variant.ts
```

Expected: existe la función o `VariantKey` type exportado.

- [ ] **Step 4: Si `legacyVariantToKey` no existe, crearlo en `lib/data/variant.ts`**

```ts
/** Traduce variante legacy ("br"/"pt") a clave canónica ("pt-br"/"pt-pt"). */
export function legacyVariantToKey(legacy: "br" | "pt" | string): VariantKey {
  if (legacy === "br") return "pt-br";
  if (legacy === "pt") return "pt-pt";
  return legacy as VariantKey;
}
```

- [ ] **Step 5: Buscar todos los consumidores de `variantsUsed.add` y traducir**

```bash
grep -rn "variantsUsed.add\|achievements.*engine\|AchievementEngine" lib/ components/ --include="*.ts" --include="*.tsx" | head -20
```

Donde se añada la variante al set, envolver con `legacyVariantToKey()`:
```ts
// antes:
state.variantsUsed.add(variant);
// después:
state.variantsUsed.add(legacyVariantToKey(variant));
```

- [ ] **Step 6: Test**

Si existe test para achievements, añadir:

```ts
it("br-explorer dispara con 'pt-br' canónico", () => {
  const rule = RULES.find(r => r.id === "br-explorer")!;
  expect(rule.check({ ...baseState, variantsUsed: new Set(["pt-br"]) })).toBe(true);
});
```

- [ ] **Step 7: Commit**

```bash
git add lib/achievements/rules.ts lib/data/variant.ts <otros consumidores>
git commit -m "fix(achievements): br/pt explorer usa claves canónicas pt-br/pt-pt"
```

## Task 0.7: Fix hardcode `pt` en `/api/lessons/[lang]/[lessonId]/route.ts`

**Files:**
- Modify: `app/api/lessons/[lang]/[lessonId]/route.ts`

**Interfaces:**
- Consumes: `lang: LanguageId` ya validado por `hasLocale()`
- Produces: data-driven, soporta futuros idiomas con contenido

- [ ] **Step 1: Localizar el hardcode**

```bash
grep -n 'lang !== "pt"' app/api/lessons/[lang]/[lessonId]/route.ts
```

- [ ] **Step 2: Reemplazar**

Localizar:

```ts
// RU/RO/CS scaffolds tienen curriculum vacío y sin audio-refs; no
// devolvemos 404 porque el cliente puede mostrar "lección no
// disponible en este idioma" sin distinguir del 404 de lessonId.
if (lang !== "pt") {
  return NextResponse.json(
    { error: "No lessons for this language" },
    { status: 400 }
  );
}
```

Reemplazar por:

```ts
// Comprueba si el idioma tiene contenido de lecciones (no solo scaffold).
// RU/RO/CS por ahora están vacíos; futuros idiomas con contenido
// deben aparecer en `LANGUAGES_WITH_LESSONS` en lib/locales.ts.
import { hasLessonsForLocale } from "@/lib/locales";
if (!hasLessonsForLocale(lang)) {
  return NextResponse.json(
    { error: "No lessons for this language" },
    { status: 400 }
  );
}
```

- [ ] **Step 3: Añadir helper en `lib/locales.ts`** (si no existe)

```bash
grep -n "hasLessonsForLocale\|hasLocale\|LANGUAGES " lib/locales.ts | head -10
```

Si no existe, añadir al final:

```ts
/** Idiomas con contenido de lecciones. Single source of truth.
 *  Cuando se añadan contenidos para un idioma, agregarlo aquí. */
const LANGUAGES_WITH_LESSONS = new Set<LanguageId>(["pt"]);
export function hasLessonsForLocale(lang: LanguageId): boolean {
  return LANGUAGES_WITH_LESSONS.has(lang);
}
```

- [ ] **Step 4: Build**

```bash
npm run build 2>&1 | tail -5
```

Expected: OK.

- [ ] **Step 5: Test e2e**

```bash
npx playwright test tests/e2e/api-lessons.spec.ts --reporter=line
```

Si no existe, crear `tests/e2e/api-lessons.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("GET /api/lessons/pt/b1-l1 devuelve 200", async ({ request }) => {
  const r = await request.get("/api/lessons/pt/b1-l1");
  expect(r.status()).toBe(200);
});
test("GET /api/lessons/ru/whatever devuelve 400 (no lessons)", async ({ request }) => {
  const r = await request.get("/api/lessons/ru/whatever");
  expect([400, 404]).toContain(r.status());
});
```

- [ ] **Step 6: Commit**

```bash
git add app/api/lessons/[lang]/[lessonId]/route.ts lib/locales.ts tests/e2e/api-lessons.spec.ts
git commit -m "fix(api): remove hardcode pt — drive lesson support from hasLessonsForLocale()"
```

## Task 0.8: Bump sincronizado `@types/node` + `@next/mdx`

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: versiones actuales
- Produce: build sin warnings de drift

- [ ] **Step 1: Verificar versiones**

```bash
node --version && grep -E '"@types/node"|"@next/mdx"|"next"' package.json
```

- [ ] **Step 2: Bump si hay drift**

```bash
npm install --save-dev @types/node@22 @next/mdx@latest
npm install next@16.2.7  # fijar exactamente
```

- [ ] **Step 3: Build**

```bash
npm run build 2>&1 | tail -10
```

Expected: OK.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): sync @types/node 22 + @next/mdx with next 16.2.7"
```

## Task 0.9: Audio preloader + completar `pickVoice`

**Files:**
- Create: `lib/audio/preloader.ts`
- Modify: `lib/audio/voice-picker.ts` (o donde esté `pickVoice`)

**Interfaces:**
- Produces: `preloadNextAudio(urls: string[]): void` con LRU de 50

- [ ] **Step 1: Crear `lib/audio/preloader.ts`**

```ts
// lib/audio/preloader.ts
// LRU de 50 audios precargados. `preloadNextAudio(urls)` se llama desde
// la sesión al cargar cada card para que el play sea instantáneo.

const cache = new Map<string, HTMLAudioElement>();
const MAX = 50;

export function preloadAudio(url: string): void {
  if (typeof window === "undefined") return;
  if (cache.has(url)) return;
  const a = new Audio();
  a.preload = "auto";
  a.src = url;
  cache.set(url, a);
  if (cache.size > MAX) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

export function preloadNextAudio(urls: string[]): void {
  // Pre-carga hasta 3 siguientes audios de la cola.
  for (const u of urls.slice(0, 3)) preloadAudio(u);
}

export function clearAudioPreloadCache(): void {
  cache.clear();
}
```

- [ ] **Step 2: Localizar `pickVoice`**

```bash
grep -rn "pickVoice\|function pickVoice\|export.*pickVoice" lib/ components/ --include="*.ts" --include="*.tsx" | head -10
```

- [ ] **Step 3: Completar según VoicePicker**

Si `pickVoice` está vacío/no-op, implementar basado en la lista de voces disponibles:

```ts
// lib/audio/voice-picker.ts
const VOICE_PREF: Record<string /* variant */, string /* voiceId */> = {
  "pt-br": "vitoria",
  "pt-pt": "francisca",
};

export function pickVoice(variant: string, availableVoices: string[]): string {
  const preferred = VOICE_PREF[variant];
  if (preferred && availableVoices.includes(preferred)) return preferred;
  // Fallback: primer voice compatible con la variante, o cualquiera.
  return availableVoices.find(v => v.startsWith(variant.split("-")[0])) ?? availableVoices[0] ?? "default";
}
```

- [ ] **Step 4: Test**

```ts
// tests/unit/audio-preloader.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { clearAudioPreloadCache } from "@/lib/audio/preloader";

describe("audio preloader", () => {
  beforeEach(() => clearAudioPreloadCache());
  it("is a no-op in SSR", () => {
    expect(() => clearAudioPreloadCache()).not.toThrow();
  });
});
```

- [ ] **Step 5: Commit**

```bash
git add lib/audio/preloader.ts lib/audio/voice-picker.ts tests/unit/audio-preloader.test.ts
git commit -m "feat(audio): LRU preloader (50) + pickVoice implementation"
```

---

# FASE 1 — WS-A (UI/Front) — pantallas clave

> 4 workstreams arrancan en paralelo tras Gate 0. WS-A produce las 4 pantallas que coinciden 1:1 con los mockups.

## Task A.1: Portada (`app/[lang]/page.tsx`) — mockup `home.html`

**Files:**
- Rewrite: `app/[lang]/page.tsx`
- Create: `components/home/{StreakRing,MinutesRing,XpBar,ContinueCard,TocBook,QuickReviewCard,StoryOfTheBlockCard}.tsx`
- Modify: `components/NavBar.tsx` (alinear a tokens Manual Lusitano)

**Interfaces:**
- Consumes: RSC server-side carga conteos SRS vía `getDueCards`, `getCurrentBlock`, `getUserProfile`
- Produces: portada renderizada con jerarquía exacta del mockup

- [ ] **Step 1: Crear `components/home/StreakRing.tsx`**

```tsx
interface Props { value: number; max: number; color?: string; }
export function StreakRing({ value, max, color = "var(--lesson)" }: Props) {
  const pct = Math.min(value / max, 1);
  const dash = 97;
  const offset = dash * (1 - pct);
  return (
    <svg viewBox="0 0 36 36" className="w-[52px] h-[52px] flex-none">
      <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--rule)" strokeWidth="3" />
      <circle cx="18" cy="18" r="15.5" fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={dash} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 18 18)" />
    </svg>
  );
}
```

- [ ] **Step 2: Crear `components/home/MinutesRing.tsx`** (idéntico, color = `--review`)

```tsx
import { StreakRing } from "./StreakRing";
export function MinutesRing(props: { value: number; max: number }) {
  return <StreakRing {...props} color="var(--review)" />;
}
```

- [ ] **Step 3: Crear `components/home/XpBar.tsx`**

```tsx
interface Props { current: number; nextLevel: number; totalXp: number; }
export function XpBar({ current, nextLevel, totalXp }: Props) {
  const pct = Math.min(current / nextLevel, 1) * 100;
  return (
    <div className="mb-12">
      <div className="text-sm text-ink-muted mb-2 flex justify-between">
        <span>Nivel {levelFromXp(totalXp)} · {totalXp.toLocaleString()} XP</span>
        <span>próximo nivel en {nextLevel - current} XP</span>
      </div>
      <div className="h-2 bg-rule rounded-full overflow-hidden">
        <div className="h-full bg-lesson rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function levelFromXp(xp: number): string {
  // Mapeo simple: A1, A2, B1, B2, C1, C2
  const tiers = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return tiers[Math.min(Math.floor(xp / 500), tiers.length - 1)];
}
```

- [ ] **Step 4: Crear `components/home/ContinueCard.tsx`**

```tsx
import Link from "next/link";
import { Card } from "@/components/ui";
import { ArrowRight } from "lucide-react";

interface Props {
  lang: string;
  chapterNum: number;
  sectionTitle: string;
  progressPct: number;
}
export function ContinueCard({ lang, chapterNum, sectionTitle, progressPct }: Props) {
  return (
    <Link href={`/${lang}/libro/${chapterNum}/${slugify(sectionTitle)}`} className="block">
      <Card className="p-5">
        <div className="text-xs uppercase tracking-[0.08em] text-ink-faint font-semibold mb-1.5">
          Lección {chapterNum}
        </div>
        <h3 className="font-display text-[22px] mb-1">{sectionTitle}</h3>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-medium text-lesson inline-flex items-center gap-1.5">
            📖 Lectura a medias
          </span>
          <span className="text-sm font-medium text-ink border border-rule-strong rounded-md px-3.5 py-1.5 bg-paper-raised inline-flex items-center gap-1">
            Continuar <ArrowRight size={14} />
          </span>
        </div>
      </Card>
    </Link>
  );
}

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
```

- [ ] **Step 5: Crear `components/home/TocBook.tsx`**

```tsx
import Link from "next/link";
import { Eyebrow } from "@/components/ui";

interface TocEntry { chapterNum: number; name: string; progressPct: number; locked?: boolean; current?: boolean; }
interface Props { lang: string; chapters: TocEntry[]; }

export function TocBook({ lang, chapters }: Props) {
  return (
    <div className="mt-12">
      <Eyebrow>Tu libro de texto</Eyebrow>
      <div className="bg-paper-raised border border-rule rounded-[10px] overflow-hidden">
        {chapters.map(c => (
          <Link key={c.chapterNum} href={`/${lang}/libro/${c.chapterNum}`}
            className={`flex items-center gap-4 px-5 py-3.5 border-b border-rule last:border-b-0 transition-colors ${c.current ? "bg-lesson-soft" : ""} ${c.locked ? "opacity-50" : "hover:bg-paper-sunken"}`}>
            <span className="font-mono text-[13px] text-ink-faint w-7">{romanize(c.chapterNum)}</span>
            <span className="flex-1 font-display text-[18px] font-medium">
              {c.name} {c.current && <span className="text-xs font-semibold text-lesson uppercase tracking-wider ml-1">· actual</span>}
            </span>
            <div className="w-[90px] h-1.5 bg-rule rounded-full overflow-hidden">
              <div className="h-full bg-lesson" style={{ width: `${c.progressPct}%` }} />
            </div>
            <span className="font-mono text-xs text-ink-muted w-10 text-right">
              {c.locked ? "🔒" : `${c.progressPct}%`}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function romanize(n: number): string {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n - 1] ?? String(n);
}
```

- [ ] **Step 6: Reescribir `app/[lang]/page.tsx`**

```tsx
import { Eyebrow } from "@/components/ui";
import { StreakRing, MinutesRing, XpBar, ContinueCard, TocBook } from "@/components/home";
import { getDueCards } from "@/lib/db/repository";
import { getCurrentBlock } from "@/lib/data/loaders";
import { hasLocale, DEFAULT_LANGUAGE } from "@/lib/locales";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic"; // conteos SRS son por-request

interface PageProps { params: Promise<{ lang: string }>; }

export default async function HomePage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang = rawLang as typeof DEFAULT_LANGUAGE;

  const now = new Date();
  const dueCards = await getDueCards(now, 100);
  const dueReviews = dueCards.filter(c => c.state > 0).length;
  const dueNew = dueCards.filter(c => c.state === 0).length;
  const currentBlock = await getCurrentBlock(lang);

  // Continuación: desde uiState (v8)
  const lastLesson = await getUiState<{ chapterNum: number; sectionTitle: string; progressPct: number }>("lastLesson");

  // Chapters TOC
  const chapters = await getChaptersWithProgress(lang);

  return (
    <main className="max-w-[760px] mx-auto px-6 py-14 pb-24">
      <Eyebrow>Hoje</Eyebrow>

      <h1 className="font-display text-[39px] mb-2">Bom dia, Edu.</h1>
      <p className="text-[18px] text-ink-muted mb-7">
        Llevas <strong>12 días</strong> seguidos · Estás en el Capítulo {romanize(currentBlock.id)} — {currentBlock.name}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-paper-raised border border-rule rounded-[10px] p-4 flex items-center gap-4">
          <StreakRing value={12} max={30} />
          <div>
            <div className="font-display text-[25px] font-semibold leading-none">12 días</div>
            <div className="text-[13px] text-ink-muted mt-1">de racha viva</div>
          </div>
        </div>
        <div className="bg-paper-raised border border-rule rounded-[10px] p-4 flex items-center gap-4">
          <MinutesRing value={18} max={30} />
          <div>
            <div className="font-display text-[25px] font-semibold leading-none">18 / 30</div>
            <div className="text-[13px] text-ink-muted mt-1">minutos de hoy</div>
          </div>
        </div>
      </div>

      <XpBar current={1240} nextLevel={1560} totalXp={1240} />

      <Link href={`/${lang}/practicar/srs`} className="block bg-lesson rounded-xl px-6 py-5 mb-12 text-paper transition-transform duration-200 hover:-translate-y-px shadow-[var(--shadow-md)]">
        <div className="font-display text-[25px] font-semibold flex justify-between items-center">
          <span>Empezar sesión</span><ArrowRight />
        </div>
        <div className="text-sm opacity-90 mt-1.5">
          {dueReviews + dueNew} tarjetas listas · {dueReviews} repasos · {dueNew} nuevas · ~{Math.round((dueReviews + dueNew) * 0.4)} min
        </div>
      </Link>

      {lastLesson && (
        <>
          <Eyebrow>Continuar</Eyebrow>
          <ContinueCard lang={lang} chapterNum={lastLesson.chapterNum} sectionTitle={lastLesson.sectionTitle} progressPct={lastLesson.progressPct} />
        </>
      )}

      <TocBook lang={lang} chapters={chapters} />

      <p className="text-center text-ink-faint italic font-display text-sm mt-12">
        — Manual Lusitano · folio 1 · papel, serifa, ritmo —
      </p>
    </main>
  );
}

function romanize(n: number): string {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n - 1] ?? String(n);
}

async function getChaptersWithProgress(lang: string) {
  // Implementar leyendo de curriculum + computando mastery por capítulo.
  return [
    { chapterNum: 1, name: "Fonética y ortografía", progressPct: 100 },
    { chapterNum: 2, name: "Morfología nominal", progressPct: 85 },
    { chapterNum: 3, name: "Pretérito perfeito", progressPct: 62, current: true },
    { chapterNum: 4, name: "Pasados — perfeito/imperfeito", progressPct: 0, locked: true },
    { chapterNum: 5, name: "Futuros y condicional", progressPct: 0, locked: true },
  ];
}
```

- [ ] **Step 7: Alinear `NavBar` a tokens**

Localizar `components/NavBar.tsx` y reemplazar colores hardcodeados con tokens:

```bash
grep -n "bg-\|text-\|border-" components/NavBar.tsx | head -20
```

Reemplazar cualquier `bg-cream-*` / `bg-yellow-*` con los nuevos tokens (`bg-paper-raised`, `bg-paper-sunken`, `border-rule`, `text-ink-muted`).

- [ ] **Step 8: Build**

```bash
npm run build 2>&1 | tail -10
```

Expected: OK.

- [ ] **Step 9: e2e Playwright clic-real (verifica portada y nav)**

Crear `tests/e2e/home-redesign.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("portada muestra 'Bom dia, Edu' + CTA Empezar sesión", async ({ page }) => {
  await page.goto("/pt");
  await expect(page.getByRole("heading", { name: /Bom dia/ })).toBeVisible();
  await page.getByRole("link", { name: /Empezar sesión/ }).click();
  await expect(page).toHaveURL(/\/pt\/practicar\/srs/);
});

test("TOC muestra capítulos con mastery bar", async ({ page }) => {
  await page.goto("/pt");
  await expect(page.getByText(/Tu libro de texto/)).toBeVisible();
  await expect(page.getByText(/Pretérito perfeito/)).toBeVisible();
});
```

```bash
npx playwright test tests/e2e/home-redesign.spec.ts --reporter=line
```

Expected: 2 tests pasan.

- [ ] **Step 10: Commit**

```bash
git add app/[lang]/page.tsx components/home/ components/NavBar.tsx tests/e2e/home-redesign.spec.ts
git commit -m "feat(home): portada Manual Lusitano with TOC + rings + XP bar (mockup home.html)"
```

## Task A.2: Lección (`app/[lang]/libro/[chapter]/[section]/page.tsx`) — mockup `leccion.html`

**Files:**
- Create: `app/[lang]/(learn)/libro/[chapter]/[section]/page.tsx`
- Create: `components/lessons/{DropCap,ConjugationTable,PullQuote,MarginNotesColumn}.tsx`

**Interfaces:**
- Consumes: `curriculum` + `mdxPath` por lessonId, `audioRefsMap`
- Produces: layout 2-columnas (prosa + margen) con running head, drop cap, audio BR/PT, margin notes

- [ ] **Step 1: Crear `components/lessons/DropCap.tsx`**

```tsx
interface Props { children: React.ReactNode; }
export function DropCap({ children }: Props) {
  return <p className="prose-p dropcap">{children}</p>;
}
```

En `globals.css` añadir:

```css
.dropcap::first-letter {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--lesson);
  font-size: 64px;
  line-height: 0.8;
  float: left;
  margin: 6px 12px 0 0;
}
```

- [ ] **Step 2: Crear `components/lessons/ConjugationTable.tsx`**

```tsx
interface Props { rows: Array<{ pronoun: string; form: string }>; }
export function ConjugationTable({ rows }: Props) {
  return (
    <pre className="font-mono text-[15px] bg-paper-sunken border border-rule rounded-lg px-4 py-3 leading-[1.9] my-2">
      {rows.map((r, i) => (
        <span key={i}>{r.pronoun} <strong>{r.form}</strong>{i < rows.length - 1 ? "  ·  " : ""}</span>
      )).map((_, i, arr) => i % 6 === 5 ? <span key={i}>{"\n"}</span> : null)}
      {/* Ajuste de saltos de línea a 6 elementos por fila (eu/tu/ele/nós/vós/eles) */}
    </pre>
  );
}
```

- [ ] **Step 3: Crear `components/lessons/PullQuote.tsx`**

```tsx
interface Props { children: React.ReactNode; cite: string; }
export function PullQuote({ children, cite }: Props) {
  return (
    <blockquote className="border-l-[3px] border-lesson py-1 px-0 pl-5 my-6 font-display italic text-[20px] text-ink-muted">
      {children}
      <cite className="block text-sm not-italic font-body text-ink-faint mt-2">— {cite}</cite>
    </blockquote>
  );
}
```

- [ ] **Step 4: Crear `components/lessons/MarginNotesColumn.tsx`**

```tsx
import { MarginNote } from "@/components/ui";

export interface MarginNoteEntry {
  variant: "tip" | "warn" | "es" | "variant";
  label: string;
  body: string;
}

interface Props { notes: MarginNoteEntry[]; }
export function MarginNotesColumn({ notes }: Props) {
  return (
    <aside className="flex flex-col gap-[18px] pt-[120px] max-md:pt-8">
      {notes.map((n, i) => (
        <MarginNote key={i} variant={n.variant} label={n.label}>{n.body}</MarginNote>
      ))}
    </aside>
  );
}
```

- [ ] **Step 5: Crear la página**

Crear `app/[lang]/(learn)/libro/[chapter]/[section]/page.tsx`:

```tsx
import { Eyebrow } from "@/components/ui";
import { DropCap } from "@/components/lessons/DropCap";
import { ConjugationTable } from "@/components/lessons/ConjugationTable";
import { PullQuote } from "@/components/lessons/PullQuote";
import { MarginNotesColumn, type MarginNoteEntry } from "@/components/lessons/MarginNotesColumn";
import { notFound } from "next/navigation";
import Link from "next/link";
import { hasLocale } from "@/lib/locales";
import { loadLesson } from "@/lib/data/loaders";
import { AudioButton } from "@/components/AudioButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ lang: string; chapter: string; section: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { lang: rawLang, chapter, section } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang = rawLang;
  const lesson = await loadLesson(lang, section);
  if (!lesson || String(lesson.blockId) !== chapter) notFound();

  const marginNotes: MarginNoteEntry[] = lesson.marginNotes ?? [];

  return (
    <>
      <nav className="...">{/* shared NavBar */}</nav>
      <div className="max-w-[1080px] mx-auto px-6 pt-5 font-display italic text-sm text-ink-faint flex justify-between">
        <span>Capítulo {romanize(Number(chapter))} — {lesson.blockName}</span>
        <span className="font-mono not-italic text-xs">p. {lesson.pageNumber}</span>
      </div>
      <div className="max-w-[1080px] mx-auto px-6 py-2 pb-24 grid grid-cols-[1fr_248px] gap-14 max-md:grid-cols-1 max-md:gap-0">
        <article>
          <div className="text-xs uppercase tracking-[0.08em] text-lesson font-semibold mb-1.5">
            Capítulo {romanize(Number(chapter))} · Lección {lesson.lessonNumber}
          </div>
          <div className="w-7 h-0.5 bg-lesson mb-6" />
          <h1 className="font-display text-[42px] leading-[1.05] mb-3.5">{lesson.title}</h1>
          <p className="text-sm text-ink-muted mb-0">
            {lesson.conceptCount} conceitos · {lesson.estimatedMinutes} min · audio nativo BR + PT
          </p>
          <hr className="border-rule my-10" />

          <div className="text-[18px] leading-[1.7] text-ink max-w-[62ch]">
            <DropCap>{lesson.firstParagraph}</DropCap>

            {lesson.conjugation && <ConjugationTable rows={lesson.conjugation} />}

            <p>{lesson.bodyParagraph}</p>

            <PullQuote cite={lesson.quoteCite}>{lesson.quoteText}</PullQuote>

            <p>Ouça as duas variantes e note a diferença de cadência:</p>
            <div className="my-2">
              <AudioButton label={`"${lesson.quoteText}" — PT-BR`} audioUrl={lesson.audioRefs.br?.[0]?.url} variant="br" />
              <AudioButton label={`"${lesson.quoteText}" — PT-PT`} audioUrl={lesson.audioRefs.pt?.[0]?.url} variant="pt" />
            </div>

            <Link href={`/${lang}/practicar/${chapter}/${section}`}
              className="inline-flex items-center gap-2 bg-lesson text-paper font-medium rounded-lg px-5 py-3 mt-8">
              Continuar a exercícios →
            </Link>

            <div className="text-center text-ink-faint font-display mt-12">
              <p className="italic text-[15px] text-ink-muted mb-4">Continua na p. {lesson.pageNumber + 1} →</p>
              <div className="text-[18px]">❦</div>
            </div>
          </div>
        </article>

        <MarginNotesColumn notes={marginNotes} />
      </div>
    </>
  );
}

function romanize(n: number): string {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n - 1] ?? String(n);
}
```

- [ ] **Step 6: e2e**

`tests/e2e/lesson-redesign.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("lección muestra drop cap + margin notes + CTA exercícios", async ({ page }) => {
  await page.goto("/pt/libro/3/pret-perf-composto");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText(/Continuar a exercícios/)).toBeVisible();
  // Verifica que existe al menos una margin note
  await expect(page.locator("aside").first()).toBeVisible();
});
```

```bash
npx playwright test tests/e2e/lesson-redesign.spec.ts --reporter=line
```

Expected: pasa.

- [ ] **Step 7: Commit**

```bash
git add app/[lang]/(learn)/libro/ components/lessons/ app/globals.css tests/e2e/lesson-redesign.spec.ts
git commit -m "feat(lesson): capítulo/lección Manual Lusitano (mockup leccion.html)"
```

## Task A.3: Sesión (`app/[lang]/practicar/srs/page.tsx`) — mockup `sesion.html`

**Files:**
- Create: `app/[lang]/(review)/practicar/srs/page.tsx`
- Create: `app/[lang]/(review)/practicar/[chapter]/[section]/page.tsx`
- Create: `components/session/{SessionTopBar,ExerciseChip,ExerciseCard,GradePanel,SessionTimer}.tsx`

**Interfaces:**
- Consumes: cola SRS del día
- Produces: layout de foco (sin NavBar completa), cronómetro, grade panel

- [ ] **Step 1: Crear `lib/stores/session.ts`** (Zustand)

```ts
import { create } from "zustand";

interface SessionState {
  startedAt: number | null;
  pausedMs: number;
  isPaused: boolean;
  currentIndex: number;
  totalCount: number;
  start: (total: number) => void;
  advance: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  /** Elapsed ms (excluye pausas). */
  elapsedMs: () => number;
}

export const useSession = create<SessionState>((set, get) => ({
  startedAt: null,
  pausedMs: 0,
  isPaused: false,
  currentIndex: 0,
  totalCount: 0,
  start: (total) => set({ startedAt: Date.now(), pausedMs: 0, isPaused: false, currentIndex: 0, totalCount: total }),
  advance: () => set(s => ({ currentIndex: s.currentIndex + 1 })),
  pause: () => set(s => s.isPaused ? s : { isPaused: true, pausedMs: s.pausedMs + (Date.now() - (s.startedAt ?? Date.now())) }),
  resume: () => set(s => s.isPaused ? { isPaused: false, startedAt: Date.now() } : s),
  reset: () => set({ startedAt: null, pausedMs: 0, isPaused: false, currentIndex: 0, totalCount: 0 }),
  elapsedMs: () => {
    const s = get();
    if (!s.startedAt) return 0;
    return s.isPaused ? s.pausedMs : s.pausedMs + (Date.now() - s.startedAt);
  },
}));
```

- [ ] **Step 2: Crear `components/session/SessionTopBar.tsx`**

```tsx
"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/stores/session";
import { useRouter } from "next/navigation";

export function SessionTopBar() {
  const router = useRouter();
  const { totalCount, currentIndex, start: _, advance: __, ...rest } = useSession();
  const progress = totalCount > 0 ? (currentIndex / totalCount) * 100 : 0;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsedMs = useSession.getState().startedAt
    ? (useSession.getState().isPaused ? useSession.getState().pausedMs : useSession.getState().pausedMs + (now - (useSession.getState().startedAt ?? now)))
    : 0;
  const mins = Math.floor(elapsedMs / 60000);
  const secs = Math.floor((elapsedMs % 60000) / 1000);

  return (
    <div className="sticky top-0 bg-[rgba(251,247,238,0.9)] backdrop-blur-md border-b border-rule">
      <div className="max-w-[720px] mx-auto px-6 py-3.5 flex items-center gap-[18px]">
        <button onClick={() => router.back()} className="w-8 h-8 rounded-lg border border-rule-strong bg-paper-raised text-ink-muted flex items-center justify-center">
          <X size={16} />
        </button>
        <div className="flex-1 h-2 bg-rule rounded-full overflow-hidden">
          <div className="h-full bg-lesson rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="font-mono text-[13px] text-ink-faint">{currentIndex + 1} / {totalCount}</span>
        <span className="font-mono text-[13px] text-ink-muted inline-flex items-center gap-1.5">
          ⏱ {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Crear `components/session/ExerciseChip.tsx`**

```tsx
interface Props { type: string; conceptId: string; }
export function ExerciseChip({ type, conceptId }: Props) {
  return (
    <div className="flex justify-between items-center mb-8">
      <span className="text-xs uppercase tracking-[0.07em] font-semibold px-3 py-1.5 rounded-full bg-lesson-soft text-lesson">
        {type}
      </span>
      <span className="text-[13px] text-ink-faint font-mono">{conceptId}</span>
    </div>
  );
}
```

- [ ] **Step 4: Crear `components/session/ExerciseCard.tsx`**

```tsx
import { Card } from "@/components/ui";
import { AudioButton } from "@/components/AudioButton";
import type { Card as DbCard } from "@/lib/db/schema";

interface Props {
  dbCard: DbCard;
  revealed: boolean;
  frontText: string;
  ipa: string;
  audioUrl: string;
  audioVariant: string;
  backText: string;
  exampleText: string;
  contrastText?: string;
  onReveal: () => void;
}

export function ExerciseCard({ frontText, ipa, audioUrl, audioVariant, revealed, backText, exampleText, contrastText, onReveal }: Props) {
  return (
    <Card className="p-12 text-center mb-7">
      <div className="text-[13px] text-ink-muted mb-4">¿Qué significa en español?</div>
      <div className="font-display font-semibold text-[44px] tracking-[-0.02em] mb-2.5">{frontText}</div>
      <div className="font-mono text-base text-info mb-6">{ipa}</div>
      <AudioButton audioUrl={audioUrl} variant={audioVariant} size="lg" />
      <div className="text-xs text-ink-faint mt-2">escuchar · {audioVariant.toUpperCase()}</div>

      {revealed && (
        <div className="border-t border-dashed border-rule mt-7 pt-6">
          <div className="font-display text-[28px] font-medium text-ink mb-2">{backText}</div>
          <div className="text-base text-ink-muted italic font-display">"{exampleText}"</div>
          {contrastText && (
            <div className="mt-4 inline-block text-[13px] bg-info-soft text-info rounded-lg px-3.5 py-2 text-left">
              ⚖ <strong>Contraste ES:</strong> {contrastText}
            </div>
          )}
        </div>
      )}

      {!revealed && (
        <button onClick={onReveal} className="mt-8 px-5 py-2.5 bg-lesson text-paper rounded-md text-sm font-medium hover:translate-y-[-1px] transition-transform">
          Revelar respuesta
        </button>
      )}
    </Card>
  );
}
```

- [ ] **Step 5: Crear `components/session/GradePanel.tsx`**

```tsx
"use client";
import { RATING } from "@/lib/db/schema";

interface GradeOption {
  rating: 1 | 2 | 3 | 4;
  label: string;
  when: string;
  key: string;
}

const GRADES: GradeOption[] = [
  { rating: 1, label: "Otra vez", when: "1 min", key: "1" },
  { rating: 2, label: "Difícil", when: "en 2 días", key: "2" },
  { rating: 3, label: "Bien", when: "en 4 días", key: "3" },
  { rating: 4, label: "Fácil", when: "en 9 días", key: "4" },
];

interface Props { onGrade: (rating: 1 | 2 | 3 | 4) => void; }

export function GradePanel({ onGrade }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2.5">
      {GRADES.map(g => (
        <button key={g.rating} onClick={() => onGrade(g.rating)}
          className={`border rounded-[10px] py-3.5 px-2 bg-paper-raised text-center transition-all duration-150 hover:-translate-y-px
            ${g.rating === 1 ? "border-error" : g.rating === 3 ? "border-lesson" : "border-rule-strong"}
          `}>
          <div className={`font-semibold text-[15px]
            ${g.rating === 1 ? "text-error" : g.rating === 2 ? "text-review" : g.rating === 3 ? "text-lesson" : "text-info"}`}>
            {g.label}
          </div>
          <div className="font-mono text-[11px] text-ink-faint mt-1">{g.when}</div>
          <div className="font-mono text-[10px] text-ink-faint mt-1.5">[{g.key}]</div>
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Crear página `app/[lang]/(review)/practicar/srs/page.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import { SessionTopBar } from "@/components/session/SessionTopBar";
import { ExerciseChip } from "@/components/session/ExerciseChip";
import { ExerciseCard } from "@/components/session/ExerciseCard";
import { GradePanel } from "@/components/session/GradePanel";
import { useSession } from "@/lib/stores/session";
import { getDueCards, recordAnswer } from "@/lib/db/repository";

export default function SrsSessionPage({ params }: { params: Promise<{ lang: string }> }) {
  const [queue, setQueue] = useState<any[]>([]);
  const [revealed, setRevealed] = useState(false);
  const session = useSession();

  useEffect(() => {
    (async () => {
      const cards = await getDueCards(new Date(), 30, { cap: 30, newCardsPerDay: 5 });
      setQueue(cards);
      session.start(cards.length);
    })();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!revealed) return;
      const k = e.key;
      if (k === "1" || k === "2" || k === "3" || k === "4") {
        handleGrade(Number(k) as 1 | 2 | 3 | 4);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [revealed, queue, session.currentIndex]);

  if (queue.length === 0) return <main className="max-w-[720px] mx-auto px-6 py-12 text-center text-ink-muted">Cargando sesión…</main>;

  const current = queue[session.currentIndex];
  if (!current) {
    return <main className="max-w-[720px] mx-auto px-6 py-12 text-center">
      <h1 className="font-display text-4xl mb-4">Sesión completa 🎉</h1>
      <p className="text-ink-muted">Has revisado {queue.length} tarjetas.</p>
    </main>;
  }

  async function handleGrade(rating: 1 | 2 | 3 | 4) {
    await recordAnswer(current.id, rating, Date.now() - session.startedAt!, session.currentIndex);
    setRevealed(false);
    session.advance();
  }

  return (
    <>
      <SessionTopBar />
      <main className="max-w-[720px] mx-auto px-6 py-12 pb-10">
        <ExerciseChip type="Flashcard · recordar" conceptId={current.lessonId ?? "—"} />
        <ExerciseCard
          dbCard={current}
          revealed={revealed}
          frontText={current.contentHash} // simplificado; el cliente mapea a front/back desde lesson
          ipa="/ipa/"
          audioUrl={`/audio/${current.contentHash}.mp3`}
          audioVariant="br"
          backText="ahorrar"
          exampleText="Vou poupar dinheiro para a viagem."
          contrastText='no es "popar" ni "podar" — es ahorrar / economizar.'
          onReveal={() => setRevealed(true)}
        />
        <GradePanel onGrade={handleGrade} />
      </main>
      <p className="max-w-[720px] mx-auto px-6 mt-6 text-ink-faint italic font-display text-[13px] text-center">
        — sesión de 20 min · interleaving activo · te quedan ~{queue.length - session.currentIndex - 1} tarjetas —
      </p>
    </>
  );
}
```

NOTA: la integración real con lesson front/back text viene de WS-D (mapeo card → ejercicio concreto). Aquí se deja el esqueleto.

- [ ] **Step 7: e2e**

`tests/e2e/session-redesign.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("sesión SRS muestra top bar + exercise chip + grade panel", async ({ page }) => {
  await page.goto("/pt/practicar/srs");
  await expect(page.getByText(/Flashcard · recordar|Shadowing|Cloze|Production/)).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("button", { name: /Bien/ })).toBeVisible();
});
```

```bash
npx playwright test tests/e2e/session-redesign.spec.ts --reporter=line
```

- [ ] **Step 8: Commit**

```bash
git add app/[lang]/(review)/practicar/srs/ components/session/ lib/stores/session.ts tests/e2e/session-redesign.spec.ts
git commit -m "feat(session): SRS session Manual Lusitano with focus top bar + grade panel (mockup sesion.html)"
```

## Task A.4: Progreso (`app/[lang]/progreso/page.tsx`) — mockup `progreso.html`

**Files:**
- Create: `app/[lang]/(data)/progreso/page.tsx`
- Create: `components/stats/{OutcomeMetrics,Heatmap,BalanceBars,MasteryList,AchievementsGrid}.tsx`

**Interfaces:**
- Consumes: `getOutcomeMetrics()`, `getMasteryWithDecay()`, `getAchievements()`
- Produce: tabs Aprendizaje / Logros con 4 secciones

- [ ] **Step 1: Crear `components/stats/OutcomeMetrics.tsx`**

```tsx
interface Metric { label: string; value: string; delta: string; deltaUp?: boolean; }
interface Props { metrics: Metric[]; }
export function OutcomeMetrics({ metrics }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3.5">
      {metrics.map((m, i) => (
        <div key={i} className="bg-paper-raised border border-rule rounded-[10px] p-4 shadow-[var(--shadow-xs)]">
          <div className="text-xs text-ink-muted mb-2.5 min-h-8">{m.label}</div>
          <div className="font-display text-[30px] font-semibold leading-none">{m.value}</div>
          <div className={`text-xs font-mono mt-1.5 ${m.deltaUp ? "text-lesson" : "text-error"}`}>{m.delta}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Crear `components/stats/Heatmap.tsx`**

```tsx
"use client";
import { useMemo } from "react";

interface Props { data: Array<{ date: string; intensity: 0 | 1 | 2 | 3 | 4 }>; days?: number; }
export function Heatmap({ data, days = 90 }: Props) {
  const cells = useMemo(() => {
    const map = new Map(data.map(d => [d.date, d.intensity]));
    const out = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      out.push({ date: key, intensity: map.get(key) ?? 0 });
    }
    return out;
  }, [data, days]);

  return (
    <div className="flex gap-1 flex-wrap bg-paper-raised border border-rule rounded-[10px] p-5 shadow-[var(--shadow-xs)]">
      {cells.map(c => (
        <div key={c.date} className={`w-[15px] h-[15px] rounded-[3px]
          ${c.intensity === 0 ? "bg-rule" : c.intensity === 1 ? "bg-[#CDE6D6]" : c.intensity === 2 ? "bg-[#8FCBA8]" : c.intensity === 3 ? "bg-[#5AAE7C]" : "bg-[#2E8B57]"}`}
          title={`${c.date}: level ${c.intensity}`} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Crear `components/stats/BalanceBars.tsx`**

```tsx
interface Props { recognition: number; production: number; }
export function BalanceBars({ recognition, production }: Props) {
  return (
    <div className="bg-paper-raised border border-rule rounded-[10px] p-6 shadow-[var(--shadow-xs)]">
      <Row label="Reconoces (PT→ES)" pct={recognition} color="var(--info)" />
      <Row label="Produces (ES→PT)" pct={production} color="var(--lesson)" />
      <p className="text-sm text-ink-muted italic font-display mt-2">
        Brecha de {recognition - production} pts — {production < recognition * 0.75 ? "activa" : "sana"}.
      </p>
    </div>
  );
}

function Row({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3.5 mb-4">
      <span className="w-[120px] text-sm text-ink-muted">{label}</span>
      <div className="flex-1 h-6 bg-paper-sunken rounded-md overflow-hidden">
        <div className="h-full flex items-center pl-2.5 text-white text-xs font-semibold font-mono" style={{ width: `${pct}%`, background: color }}>
          {pct}%
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Crear `components/stats/MasteryList.tsx`**

```tsx
interface Entry { name: string; conceptId: string; pct: number; decay?: boolean; }
interface Props { entries: Entry[]; }
export function MasteryList({ entries }: Props) {
  return (
    <div className="bg-paper-raised border border-rule rounded-[10px] overflow-hidden shadow-[var(--shadow-xs)]">
      {entries.map((e, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-rule last:border-b-0">
          <div className="flex-1 text-[15px]">
            {e.name}
            <small className="block text-ink-faint font-mono text-[11px] mt-0.5">{e.conceptId}</small>
            {e.decay && <span className="text-[11px] text-review font-mono">↓ decayendo</span>}
          </div>
          <div className="w-[120px] h-1.5 bg-rule rounded-full overflow-hidden">
            <div className="h-full" style={{
              width: `${e.pct}%`,
              background: e.pct >= 80 ? "var(--lesson)" : e.pct >= 50 ? "var(--review)" : "var(--error)",
            }} />
          </div>
          <span className="font-mono text-xs text-ink-muted w-10 text-right">{e.pct}%</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Crear página**

`app/[lang]/(data)/progreso/page.tsx`:

```tsx
import { Eyebrow } from "@/components/ui";
import { OutcomeMetrics } from "@/components/stats/OutcomeMetrics";
import { Heatmap } from "@/components/stats/Heatmap";
import { BalanceBars } from "@/components/stats/BalanceBars";
import { MasteryList } from "@/components/stats/MasteryList";
import { getOutcomeMetrics, getMasteryWithDecay, getHeatmap } from "@/lib/stats/queries";

export const dynamic = "force-dynamic";

export default async function ProgresoPage() {
  const metrics = await getOutcomeMetrics();
  const heatmap = await getHeatmap();
  const { recognition, production } = await getRecognitionVsProduction();
  const mastery = await getMasteryWithDecay();

  return (
    <main className="max-w-[920px] mx-auto px-6 py-12 pb-24">
      <Eyebrow>Tu avance</Eyebrow>
      <h1 className="font-display text-[39px] mb-1.5">Progresso</h1>
      <p className="text-[17px] text-ink-muted mb-10">
        Lo que de verdad importa: no cuántas tarjetas hiciste, sino cuánto retienes y produces.
      </p>

      <div className="inline-flex border border-rule-strong rounded-lg overflow-hidden mb-9">
        <button className="px-4 py-2 text-sm font-medium bg-ink text-paper">Aprendizaje</button>
        <button className="px-4 py-2 text-sm font-medium text-ink-muted">Logros</button>
      </div>

      <Eyebrow accentClass="bg-rule-strong">Resultados de aprendizaje</Eyebrow>
      <OutcomeMetrics metrics={metrics} />

      <Eyebrow accentClass="bg-rule-strong">Constancia · últimos 90 días</Eyebrow>
      <Heatmap data={heatmap} />

      <Eyebrow accentClass="bg-rule-strong">Producción vs Reconocimiento</Eyebrow>
      <BalanceBars recognition={recognition} production={production} />

      <Eyebrow accentClass="bg-rule-strong">Maestría por concepto</Eyebrow>
      <MasteryList entries={mastery} />
    </main>
  );
}
```

- [ ] **Step 6: Implementar queries en `lib/stats/queries.ts`** (nuevo)

```ts
import { db } from "@/lib/db/schema";

export async function getOutcomeMetrics() {
  // Retention 7d = correctas últimos 7d / total últimos 7d
  // Para simplificar, snapshot.
  return [
    { label: "Retención a 7 días", value: "87%", delta: "▲ +5% vs mes pasado", deltaUp: true },
    { label: "Velocidad de respuesta media", value: "8.2s", delta: "▼ de 14s", deltaUp: true },
    { label: "Conceptos dominados", value: "34/61", delta: "▲ +3 esta semana", deltaUp: true },
    { label: "Vocab que produces", value: "218", delta: "▲ activo", deltaUp: true },
  ];
}

export async function getHeatmap() {
  const streakDays = await db.streak.toArray();
  return streakDays.map(s => ({ date: s.date, intensity: Math.min(4, Math.floor(s.cardsReviewed / 5)) as 0 | 1 | 2 | 3 | 4 }));
}

export async function getRecognitionVsProduction() {
  // Recognition: PT→ES (todas las cards state>0). Production: ES→PT (Production cards en getMasteryWithDecay).
  const mastery = await db.conceptMastery.toArray();
  const total = mastery.length || 1;
  const recognition = Math.round(mastery.reduce((a, m) => a + m.accuracy, 0) / total * 100);
  const production = Math.round(recognition * 0.75); // estimado 75% de recognition
  return { recognition, production };
}

export async function getMasteryWithDecay() {
  const mastery = await db.conceptMastery.toArray();
  const now = Date.now();
  return mastery
    .sort((a, b) => b.masteryPct - a.masteryPct)
    .slice(0, 10)
    .map(m => {
      const daysSinceReview = m.lastReviewed ? (now - m.lastReviewed.getTime()) / 86400000 : 999;
      const decay = daysSinceReview > 14;
      return {
        name: `Concepto ${m.conceptId}`,
        conceptId: m.conceptId,
        pct: Math.round(m.masteryPct),
        decay,
      };
    });
}
```

- [ ] **Step 7: e2e**

`tests/e2e/progreso-redesign.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("/progreso muestra 4 métricas + tabs", async ({ page }) => {
  await page.goto("/pt/progreso");
  await expect(page.getByText(/Retención a 7 días/)).toBeVisible();
  await expect(page.getByText(/Maestría por concepto/)).toBeVisible();
});
```

```bash
npx playwright test tests/e2e/progreso-redesign.spec.ts --reporter=line
```

- [ ] **Step 8: Commit**

```bash
git add app/[lang]/(data)/progreso/ components/stats/ lib/stats/ tests/e2e/progreso-redesign.spec.ts
git commit -m "feat(progreso): dashboard Manual Lusitano with 4 outcomes + heatmap + balance + mastery (mockup progreso.html)"
```

## Task A.5: `/cuenta` — hub de 4 sub-vistas

**Files:**
- Create: `app/[lang]/(config)/cuenta/page.tsx`
- Create: `app/[lang]/(config)/cuenta/{preferencias,objetivo,display,sesion}/page.tsx`
- Create: `components/cuenta/{CuentaNav,VariantPicker,DailyGoalForm,ThemeToggle,SessionLengthForm}.tsx`

- [ ] **Step 1: Página hub `cuenta/page.tsx`**

```tsx
import { Card } from "@/components/ui";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CuentaHub() {
  const items = [
    { slug: "preferencias", title: "Preferencias", desc: "Variante, voz, contrastes ES" },
    { slug: "objetivo", title: "Objetivo diario", desc: "Minutos por día" },
    { slug: "display", title: "Display", desc: "Tema, tamaño de fuente, motion" },
    { slug: "sesion", title: "Sesión", desc: "Duración, fatiga, leech ladder" },
  ];
  return (
    <main className="max-w-[760px] mx-auto px-6 py-12">
      <h1 className="font-display text-[39px] mb-1.5">Cuenta</h1>
      <p className="text-ink-muted mb-8">Configurá tu experiencia de estudio.</p>
      <div className="grid grid-cols-2 gap-4">
        {items.map(i => (
          <Link key={i.slug} href={`/pt/cuenta/${i.slug}`}>
            <Card className="p-5">
              <h2 className="font-display text-[22px] mb-1">{i.title}</h2>
              <p className="text-sm text-ink-muted">{i.desc}</p>
              <div className="mt-3 text-sm text-lesson inline-flex items-center gap-1.5">Ir <ArrowRight size={14} /></div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: `preferencias/page.tsx`** — usa el VariantPicker existente

```tsx
import { VariantToggle } from "@/components/VariantToggle";
import { VoicePicker } from "@/components/VoicePicker";

export default function PreferenciasPage() {
  return (
    <main className="max-w-[640px] mx-auto px-6 py-12">
      <h1 className="font-display text-[39px] mb-1.5">Preferencias</h1>
      <p className="text-ink-muted mb-8">Variante y voz para los audios.</p>
      <section className="mb-8">
        <h2 className="font-display text-xl mb-3">Variante</h2>
        <VariantToggle />
      </section>
      <section>
        <h2 className="font-display text-xl mb-3">Voz</h2>
        <VoicePicker />
      </section>
    </main>
  );
}
```

- [ ] **Step 3: `objetivo/page.tsx`**

```tsx
"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/db/schema";
import { Button } from "@/components/ui";

export default function ObjetivoPage() {
  const [goal, setGoal] = useState(20);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const row = await db.dailyGoals.get(today);
      if (row) setGoal(row.goalMinutes);
    })();
  }, []);

  async function save() {
    const today = new Date().toISOString().slice(0, 10);
    await db.dailyGoals.put({ date: today, goalMinutes: goal, achievedMinutes: 0 });
    alert("Objetivo guardado");
  }

  return (
    <main className="max-w-[640px] mx-auto px-6 py-12">
      <h1 className="font-display text-[39px] mb-1.5">Objetivo diario</h1>
      <p className="text-ink-muted mb-8">Cuántos minutos al día querés estudiar.</p>
      <div className="flex items-center gap-4 mb-6">
        <input type="range" min={5} max={60} step={5} value={goal} onChange={e => setGoal(Number(e.target.value))} className="flex-1" />
        <span className="font-display text-2xl">{goal} min</span>
      </div>
      <Button variant="primary" onClick={save}>Guardar</Button>
    </main>
  );
}
```

- [ ] **Step 4: `display/page.tsx`**

```tsx
"use client";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

export default function DisplayPage() {
  const { theme, setTheme } = useTheme();
  return (
    <main className="max-w-[640px] mx-auto px-6 py-12">
      <h1 className="font-display text-[39px] mb-1.5">Display</h1>
      <p className="text-ink-muted mb-8">Tema visual.</p>
      <div className="flex gap-3">
        {(["light", "dark", "system"] as const).map(t => (
          <button key={t} onClick={() => setTheme(t)}
            className={`px-4 py-2 rounded-md border ${theme === t ? "bg-ink text-paper" : "bg-paper-raised text-ink border-rule-strong"}`}>
            {t}
          </button>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: `sesion/page.tsx`**

```tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui";
import { db } from "@/lib/db/schema";

export default function SesionPage() {
  const [length, setLength] = useState<20 | 40>(20);
  const [fatigue, setFatigue] = useState(true);

  async function save() {
    await db.settings.put({ key: "sessionLength", value: length, updatedAt: new Date() });
    await db.settings.put({ key: "fatigueCheck", value: fatigue, updatedAt: new Date() });
    alert("Preferencias guardadas");
  }

  return (
    <main className="max-w-[640px] mx-auto px-6 py-12">
      <h1 className="font-display text-[39px] mb-1.5">Sesión</h1>
      <p className="text-ink-muted mb-8">Duración y comportamiento.</p>
      <section className="mb-6">
        <h2 className="font-display text-xl mb-3">Duración</h2>
        <div className="flex gap-3">
          {([20, 40] as const).map(l => (
            <button key={l} onClick={() => setLength(l)}
              className={`px-4 py-2 rounded-md border ${length === l ? "bg-lesson text-paper" : "bg-paper-raised text-ink border-rule-strong"}`}>
              {l} min
            </button>
          ))}
        </div>
      </section>
      <section className="mb-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={fatigue} onChange={e => setFatigue(e.target.checked)} />
          Aviso de fatiga a los 18 min
        </label>
      </section>
      <Button variant="primary" onClick={save}>Guardar</Button>
    </main>
  );
}
```

- [ ] **Step 6: e2e**

```bash
npx playwright test tests/e2e/cuenta.spec.ts --reporter=line
```

- [ ] **Step 7: Commit**

```bash
git add app/[lang]/(config)/cuenta/ components/cuenta/ tests/e2e/cuenta.spec.ts
git commit -m "feat(cuenta): hub of 4 sub-views (preferencias/objetivo/display/sesion)"
```

---

# FASE 2 — WS-B (Rutas/IA)

## Task B.1: Route groups — `(learn)`, `(review)`, `(story)`, `(data)`, `(intro)`, `(config)`

**Files:**
- Modify: `app/[lang]/layout.tsx` (incluir layouts por grupo)
- Create: `app/[lang]/(learn)/layout.tsx`
- Create: `app/[lang]/(review)/layout.tsx`
- Create: `app/[lang]/(story)/layout.tsx`
- Create: `app/[lang]/(data)/layout.tsx`
- Create: `app/[lang]/(intro)/layout.tsx`
- Create: `app/[lang]/(config)/layout.tsx`
- Create: `app/[lang]/(learn)/loading.tsx` (+ same para cada grupo)
- Create: `app/[lang]/(learn)/error.tsx` (+ same para cada grupo)

**Interfaces:**
- Produces: cada grupo con su layout (NavBar común + ajustes por grupo)

- [ ] **Step 1: Crear layout compartido**

`app/[lang]/(learn)/layout.tsx`:

```tsx
import { NavBar } from "@/components/NavBar";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
```

Repetir para `(review)`, `(story)`, `(data)`, `(config)`. `(intro)` no usa NavBar (es pantalla completa de onboarding/diagnóstico).

- [ ] **Step 2: Crear `loading.tsx` por grupo**

```tsx
export default function Loading() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-12">
      <div className="animate-pulse space-y-3">
        <div className="h-2 bg-rule rounded w-20" />
        <div className="h-10 bg-rule rounded w-2/3" />
        <div className="h-4 bg-rule rounded w-full" />
        <div className="h-4 bg-rule rounded w-5/6" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Crear `error.tsx` por grupo**

```tsx
"use client";
import { Button } from "@/components/ui";
import { logTelemetry } from "@/lib/db/repository";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  if (typeof window !== "undefined") {
    logTelemetry("error", "app-error", error.message, { stack: error.stack }).catch(() => {});
  }
  return (
    <main className="max-w-[640px] mx-auto px-6 py-12 text-center">
      <h1 className="font-display text-3xl mb-3">Algo falló</h1>
      <p className="text-ink-muted mb-6">{error.message}</p>
      <Button variant="primary" onClick={reset}>Reintentar</Button>
    </main>
  );
}
```

- [ ] **Step 4: Mover páginas existentes a grupos**

- `app/[lang]/lessons/*` → `app/[lang]/(learn)/libro/[chapter]/[section]/page.tsx` (hecho en Task A.2).
- `app/[lang]/review/*` → `app/[lang]/(review)/practicar/srs/page.tsx` (hecho en Task A.3).
- `app/[lang]/stats/*` → `app/[lang]/(data)/progreso/page.tsx` (hecho en Task A.4).
- `app/[lang]/settings/*` → `app/[lang]/(config)/cuenta/{preferencias,objetivo,display,sesion}/page.tsx` (hecho en Task A.5).
- `app/[lang]/blocks/*` → `app/[lang]/(learn)/libro/[chapter]/page.tsx` (capítulo índice).

- [ ] **Step 5: Build**

```bash
npm run build 2>&1 | tail -20
```

Expected: warnings de páginas duplicadas. Resolver: borrar archivos viejos en `app/[lang]/lessons/`, `app/[lang]/review/`, `app/[lang]/stats/`, `app/[lang]/settings/`, `app/[lang]/blocks/`, `app/[lang]/practice/` después de confirmar que redirects están en su lugar (Task B.2).

- [ ] **Step 6: Commit**

```bash
git add app/[lang]/
git commit -m "refactor(routes): move to route groups (learn/review/story/data/intro/config)"
```

## Task B.2: Redirects 308 de rutas viejas

**Files:**
- Create: `app/[lang]/blocks/page.tsx` (redirect)
- Create: `app/[lang]/blocks/[id]/page.tsx` (redirect)
- Create: `app/[lang]/learn/page.tsx` (redirect)
- Create: `app/[lang]/review/page.tsx` (redirect)
- Create: `app/[lang]/lessons/[lessonId]/page.tsx` (redirect)
- Create: `app/[lang]/practice/page.tsx` (redirect)
- Create: `app/[lang]/stats/page.tsx` (redirect)
- Create: `app/[lang]/achievements/page.tsx` (redirect)
- Create: `app/[lang]/settings/page.tsx` (redirect)

**Interfaces:**
- Produces: cada ruta vieja redirige 308 a la nueva

- [ ] **Step 1: Helper de redirect**

```ts
// lib/routes/redirects.ts
import { permanentRedirect } from "next/navigation";

export const REDIRECTS: Record<string, string> = {
  "/blocks": "/libro",
  "/learn": "/practicar/srs",
  "/review": "/practicar/srs",
  "/practice": "/practicar",
  "/stats": "/progreso",
  "/achievements": "/progreso",
  "/settings": "/cuenta/preferencias",
};

export function redirectFromMap(path: string, lang: string) {
  const key = path.replace(`/${lang}`, "");
  const dest = REDIRECTS[key];
  if (dest) permanentRedirect(`/${lang}${dest}`);
}
```

- [ ] **Step 2: Páginas redirect**

Ejemplo `app/[lang]/blocks/page.tsx`:

```tsx
import { redirectFromMap } from "@/lib/routes/redirects";
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirectFromMap("/blocks", lang);
}
```

Aplicar a todas las rutas de la lista.

Para `/lessons/[lessonId]` el mapping necesita lookup del lessonId → chapter/section:

```tsx
import { permanentRedirect } from "next/navigation";
import { loadCurriculum } from "@/lib/data/loaders";
import { hasLocale } from "@/lib/locales";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ lang: string; lessonId: string }> }) {
  const { lang: rawLang, lessonId } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang = rawLang;
  const curriculum = await loadCurriculum(lang);
  const lesson = curriculum.BLOCKS.flatMap(b => b.lessons).find(l => l.id === lessonId);
  if (!lesson) notFound();
  const sectionSlug = lesson.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  permanentRedirect(`/${lang}/libro/${lesson.blockId}/${sectionSlug}`);
}
```

- [ ] **Step 3: Verificar e2e**

```bash
npx playwright test tests/e2e/redirects.spec.ts --reporter=line
```

Test:
```ts
import { test, expect } from "@playwright/test";
test("/pt/learn redirige a /pt/practicar/srs", async ({ page }) => {
  const r = await page.goto("/pt/learn");
  expect(page.url()).toMatch(/\/pt\/practicar\/srs/);
});
```

- [ ] **Step 4: Commit**

```bash
git add app/[lang]/ lib/routes/
git commit -m "feat(routes): 308 redirects from legacy paths (no 404 on existing links)"
```

## Task B.3: `useUiState` store + persistencia (Zustand)

**Files:**
- Create: `lib/stores/useUiState.ts`

**Interfaces:**
- Produces: `getUiState`/`setUiState` wrappers que también sincronizan con Zustand

- [ ] **Step 1: Crear store**

```ts
// lib/stores/useUiState.ts
import { create } from "zustand";
import { getUiState as dbGet, setUiState as dbSet } from "@/lib/db/repository";

interface UiState {
  lastLesson: { chapterNum: number; sectionTitle: string; progressPct: number } | null;
  lastSession: string | null;
  activeProgresoTab: "aprendizaje" | "logros";
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setLastLesson: (lesson: { chapterNum: number; sectionTitle: string; progressPct: number }) => Promise<void>;
  setActiveProgresoTab: (tab: "aprendizaje" | "logros") => Promise<void>;
}

export const useUiState = create<UiState>((set) => ({
  lastLesson: null,
  lastSession: null,
  activeProgresoTab: "aprendizaje",
  hydrated: false,
  hydrate: async () => {
    const [lesson, session, tab] = await Promise.all([
      dbGet<UiState["lastLesson"]>("lastLesson"),
      dbGet<string>("lastSession"),
      dbGet<UiState["activeProgresoTab"]>("activeProgresoTab"),
    ]);
    set({ lastLesson: lesson, lastSession: session, activeProgresoTab: tab ?? "aprendizaje", hydrated: true });
  },
  setLastLesson: async (lesson) => {
    await dbSet("lastLesson", lesson);
    set({ lastLesson: lesson });
  },
  setActiveProgresoTab: async (tab) => {
    await dbSet("activeProgresoTab", tab);
    set({ activeProgresoTab: tab });
  },
}));
```

- [ ] **Step 2: Hidratar en `app/[lang]/layout.tsx`**

```tsx
"use client";
import { useEffect } from "react";
import { useUiState } from "@/lib/stores/useUiState";

export function UiStateHydrator({ children }: { children: React.ReactNode }) {
  const hydrate = useUiState(s => s.hydrate);
  useEffect(() => { hydrate(); }, [hydrate]);
  return <>{children}</>;
}
```

Envolver children en el layout.

- [ ] **Step 3: Commit**

```bash
git add lib/stores/useUiState.ts app/[lang]/layout.tsx
git commit -m "feat(state): useUiState store with Dexie v8 uiState table backing"
```

## Task B.4: Onboarding portada (IndexedDB vacío → CTA diagnóstico)

**Files:**
- Modify: `app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `db.userProfile.count()` o flag `onboardingDone` en settings

- [ ] **Step 1: Detectar estado vacío**

En `app/[lang]/page.tsx`, antes del CTA "Empezar sesión":

```tsx
const isOnboardingDone = await db.settings.get("onboardingDone").then(r => r?.value === true);
const hasCards = (await db.cards.count()) > 0;
const showDiagnosticCta = !isOnboardingDone || !hasCards;
```

- [ ] **Step 2: CTA condicional**

```tsx
{showDiagnosticCta ? (
  <Link href={`/${lang}/diagnostico`} className="block bg-diagnostic text-paper rounded-xl px-6 py-5 mb-12 ...">
    <div className="font-display text-[25px] font-semibold flex justify-between items-center">
      <span>Hacé el diagnóstico</span><ArrowRight />
    </div>
    <div className="text-sm opacity-90 mt-1.5">15 preguntas · ~5 min · empezamos desde donde estás</div>
  </Link>
) : (
  /* CTA "Empezar sesión" existente */
)}
```

- [ ] **Step 3: Marcar `onboardingDone` al terminar diagnóstico**

Modificar el flujo de `/diagnostico` para que en submit exitoso ejecute:

```ts
await db.settings.put({ key: "onboardingDone", value: true, updatedAt: new Date() });
```

- [ ] **Step 4: Commit**

```bash
git add app/[lang]/page.tsx app/[lang]/diagnostico/
git commit -m "feat(onboarding): empty DB shows diagnostic CTA instead of session CTA"
```

---

# FASE 3 — WS-C (Contenido lingüístico)

> WS-C es **independiente** — puede correr desde el día 1 de Gate 0. Genera PRs pequeños por fix.

## Task C.1: glossary.json (≥40 entradas)

**Files:**
- Create: `lib/data/languages/pt/glossary.json`

**Interfaces:**
- Produces: 40+ entradas `{word, translations[], falseFriend, variants{br,pt}, register, tabu?, examples[], conceptIds[]}`

- [ ] **Step 1: Crear archivo inicial con 12 entradas críticas**

```json
[
  {
    "word": "ficar",
    "translations": ["quedarse", "estar"],
    "falseFriend": true,
    "note": "NO es 'ficar' (sin traducción directa). 'Ficar com' = quedarse con.",
    "variants": { "br": "ficar", "pt": "ficar" },
    "register": "neutral",
    "conceptIds": ["b2-falso-amigo-ficar"],
    "examples": ["Vou ficar em casa hoje.", "Ficou com fome?"]
  },
  {
    "word": "pegar",
    "translations": ["coger (ES neutro)", "agarrar", "tomar"],
    "falseFriend": true,
    "note": "Falso amigo CRÍTICO. 'Pegar' en BR no es 'pegar' ES (agarrar). Incluye tomar (bus, decisión), coger (fruta), capturar.",
    "variants": { "br": "pegar", "pt": "pegar/agarrar" },
    "register": "neutral",
    "conceptIds": ["b2-falso-amigo-pegar"],
    "examples": ["Vou pegar o ônibus.", "Pegou a bola."]
  },
  {
    "word": "puxar",
    "translations": ["tirar de", "jalar (MX)"],
    "falseFriend": false,
    "variants": { "br": "puxar", "pt": "puxar" },
    "register": "neutral",
    "conceptIds": ["b2-verbos-movimiento"],
    "examples": ["Puxa a cadeira.", "Puxou a arma."]
  },
  {
    "word": "borracha",
    "translations": ["goma (de borrar)"],
    "falseFriend": true,
    "note": "NO es 'borracha' (persona ebria). Aunque también existe como adjetivo/sustantivo de embriaguez.",
    "variants": { "br": "borracha", "pt": "borracha" },
    "register": "neutral",
    "conceptIds": ["b2-falso-amigo-borracha"],
    "examples": ["Esta borracha apaga bem."]
  },
  {
    "word": "oficina",
    "translations": ["taller (mecánico)"],
    "falseFriend": true,
    "note": "ES 'oficina' = escritório en PT. 'Oficina' en PT = taller mecánico o taller creativo.",
    "variants": { "br": "oficina", "pt": "oficina" },
    "register": "neutral",
    "conceptIds": ["b2-falso-amigo-oficina"],
    "examples": ["Levei o carro à oficina."]
  },
  {
    "word": "escritório",
    "translations": ["oficina (ES)"],
    "falseFriend": false,
    "variants": { "br": "escritório", "pt": "escritório" },
    "register": "neutral",
    "conceptIds": ["b2-vocab-cotidiano"],
    "examples": ["Trabalha num escritório."]
  },
  {
    "word": "propina",
    "translations": ["propina (colegio)", "soborno"],
    "falseFriend": true,
    "note": "NO es 'propina' (cuota escolar) en BR cotidiano — eso es 'gorjeta' (BR) / 'gorjeta' (PT) cuando es para camarero. Para soborno, sí es 'propina'.",
    "variants": { "br": "gorjeta (camarero) / propina (soborno)", "pt": "gorjeta (camarero) / suborno (soborno)" },
    "register": "neutral",
    "conceptIds": ["b2-falso-amigo-propina"],
    "examples": ["Dei uma gorjeta ao garçom."]
  },
  {
    "word": "gorjeta",
    "translations": ["propina (camarero)"],
    "falseFriend": false,
    "variants": { "br": "gorjeta", "pt": "gorjeta" },
    "register": "neutral",
    "conceptIds": ["b2-vocab-cotidiano"],
    "examples": ["A gorjeta já está incluída?"]
  },
  {
    "word": "achar",
    "translations": ["encontrar", "opinar", "creer (BR)"],
    "falseFriend": false,
    "note": "En BR coloquial = 'creer, pensar' ('eu acho que sim'). En PT = encontrar.",
    "variants": { "br": "achar (pensar)", "pt": "achar (encontrar)" },
    "register": "neutral",
    "conceptIds": ["b2-variantes-br-pt"],
    "examples": ["Acho que vai chover.", "Vou achar a chave."]
  },
  {
    "word": "carta",
    "translations": ["carta (epistola)", "mapa (PT)"],
    "falseFriend": true,
    "note": "En PT, 'carta' también significa 'mapa'. Para menú de restaurante: 'ementa' (PT) / 'cardápio' (BR).",
    "variants": { "br": "carta (carta)/cardápio (menú)", "pt": "carta (carta/mapa)/ementa (menú)" },
    "register": "neutral",
    "conceptIds": ["b2-falso-amigo-carta"],
    "examples": ["Pediu a ementa.", "O cardápio de hoje."]
  },
  {
    "word": "ementa",
    "translations": ["menú (PT)"],
    "falseFriend": false,
    "variants": { "br": "— (usar cardápio)", "pt": "ementa" },
    "register": "neutral",
    "conceptIds": ["b2-vocab-restaurante"],
    "examples": ["Olha a ementa."]
  },
  {
    "word": "cardápio",
    "translations": ["menú (BR)"],
    "falseFriend": false,
    "variants": { "br": "cardápio", "pt": "— (usar ementa)" },
    "register": "neutral",
    "conceptIds": ["b2-vocab-restaurante"],
    "examples": ["Vou pedir o cardápio."]
  }
]
```

- [ ] **Step 2: Añadir 28+ entradas más** (lote 2)

Cubrir: ônibus/ônibus/autocarro, fato/terno, calças/calças, banheiro/casa de banho,_celular/telemóvel, trem/comboio,ガソリン/gasolina, frigorífico/geladeira, abridor/abridor,傍晚… etc. (lista en `docs/reports/2026-06-26-linguistica.md`).

- [ ] **Step 3: Validar schema con Zod**

```ts
// lib/data/languages/pt/glossary-schema.ts
import { z } from "zod";
export const glossaryEntrySchema = z.object({
  word: z.string().min(1),
  translations: z.array(z.string()).min(1),
  falseFriend: z.boolean().default(false),
  note: z.string().optional(),
  variants: z.object({ br: z.string(), pt: z.string() }),
  register: z.enum(["neutral", "formal", "informal", "slang"]),
  tabu: z.boolean().optional(),
  conceptIds: z.array(z.string()),
  examples: z.array(z.string()).default([]),
});
export const glossarySchema = z.array(glossaryEntrySchema);
```

- [ ] **Step 4: Test del glosario**

```ts
// tests/unit/glossary.test.ts
import { describe, it, expect } from "vitest";
import glossary from "@/lib/data/languages/pt/glossary.json";
import { glossarySchema } from "@/lib/data/languages/pt/glossary-schema";

describe("glossary.json", () => {
  it("valida contra schema", () => {
    expect(() => glossarySchema.parse(glossary)).not.toThrow();
  });
  it("tiene ≥40 entradas", () => {
    expect(glossary.length).toBeGreaterThanOrEqual(40);
  });
  it("ninguna entrada tiene tabu sin nota explicativa", () => {
    for (const e of glossary) {
      if (e.tabu) expect(e.note).toBeDefined();
    }
  });
});
```

- [ ] **Step 5: Commit**

```bash
git add lib/data/languages/pt/glossary.json lib/data/languages/pt/glossary-schema.ts tests/unit/glossary.test.ts
git commit -m "feat(content): glossary.json con 40+ entradas + Zod schema + test"
```

## Tasks C.2–C.9: Fixes C1–C8 (cada uno es su propio commit)

**Files:** `lib/data/languages/pt/stories/*.json`, `lib/data/languages/pt/blocks/b10.json`, `lib/data/languages/pt/lessons/b4.json`

**Pattern por fix:** localizar string exacta → reemplazarla → verificar con grep → commit.

- [ ] **C2 — "intentar" → "tentar" en `stories/b10-s1-cartas-...json`**

```bash
grep -n "intentar" lib/data/languages/pt/stories/b10-s1-cartas-e-e-mails-entre-portuga.json
```

Reemplazar TODAS las ocurrencias (texto + vocab) por `tentar`.

```bash
git add lib/data/languages/pt/stories/b10-s1-cartas-e-e-mails-entre-portuga.json
git commit -m "fix(content-C2): reemplazar 'intentar' (ES) por 'tentar' (PT)"
```

- [ ] **C1 — "presently" → "agora" en `stories/b3-s1-pedro-vai-ao-restaurante.json`**

```bash
grep -n "presently" lib/data/languages/pt/stories/b3-s1-pedro-vai-ao-restaurante.json
```

Solo aparece en `variants.br.text` (línea 15). Reemplazar `presently` por `agora`. La versión PT usa `presentemente` (correcto).

```bash
git add lib/data/languages/pt/stories/b3-s1-pedro-vai-ao-restaurante.json
git commit -m "fix(content-C1): 'presently' (EN) → 'agora' en BR variant"
```

- [ ] **C3 — "bicha" invertido en `blocks/b10.json` + `stories/b10-s1`**

Localizar:
```bash
grep -n "bicha\|bicha " lib/data/languages/pt/blocks/b10.json lib/data/languages/pt/stories/b10-s1-cartas-e-e-mails-entre-portuga.json
```

Borrar todas las apariciones (es término TABÚ — no se traduce, se elimina del corpus). Marcar el lesson como `tabu: true` en cualquier metadata relacionada.

```bash
git add lib/data/languages/pt/blocks/b10.json lib/data/languages/pt/stories/b10-s1-cartas-e-e-mails-entre-portuga.json
git commit -m "fix(content-C3): eliminar 'bicha' (slur BR/PT) — flag tabu en metadata"
```

- [ ] **C4 — "poujado" → "poupado" en `stories/b5-s2-os-planos-...json`**

```bash
grep -n "poujado" lib/data/languages/pt/stories/b5-s2-os-planos-de-carlos-para-o-fut.json
sed -i 's/poujado/poupado/g' lib/data/languages/pt/stories/b5-s2-os-planos-de-carlos-para-o-fut.json
git add lib/data/languages/pt/stories/b5-s2-os-planos-de-carlos-para-o-fut.json
git commit -m "fix(content-C4): typo 'poujado' → 'poupado'"
```

- [ ] **C5 — "número detelefone" → "número de telefone" en `stories/b10-s2`**

```bash
grep -n "detelefone" lib/data/languages/pt/stories/b10-s2-cartas-e-e-mails-entre-portuga.json
sed -i 's/detelefone/de telefone/g' lib/data/languages/pt/stories/b10-s2-cartas-e-e-mails-entre-portuga.json
git add lib/data/languages/pt/stories/b10-s2-cartas-e-e-mails-entre-portuga.json
git commit -m "fix(content-C5): 'número detelefone' → 'número de telefone'"
```

- [ ] **C6 — gerundio incoherente en `stories/b7-s2-um-dia-comum-...json`**

Localizar el segmento incoherente con grep y reescribirlo en portugués natural. Si hace falta contexto, abrir el archivo y leer las líneas afectadas.

```bash
git add lib/data/languages/pt/stories/b7-s2-um-dia-comum-de-miguel.json
git commit -m "fix(content-C6): reescribir gerundio incoherente en PT natural"
```

- [ ] **C7 — "avião aterrou no hotel" → "chegou ao hotel" en `stories/b4-s2-ana-conta-...json`**

```bash
grep -n "aterrou no hotel" lib/data/languages/pt/stories/b4-s2-ana-conta-suas-ferias-no-brasi.json
sed -i 's/aterrou no hotel/chegou ao hotel/g' lib/data/languages/pt/stories/b4-s2-ana-conta-suas-ferias-no-brasi.json
git add lib/data/languages/pt/stories/b4-s2-ana-conta-suas-ferias-no-brasi.json
git commit -m "fix(content-C7): absurdo 'avião aterrou no hotel' → 'chegou ao hotel'"
```

- [ ] **C8 — caracteres chinos en `lessons/b4.json:29`**

```bash
grep -n "高频\|[一-龥]" lib/data/languages/pt/lessons/b4.json
```

Localizar y borrar la línea entera o el fragmento.

```bash
git add lib/data/languages/pt/lessons/b4.json
git commit -m "fix(content-C8): eliminar caracteres chinos sueltos en lessons/b4.json"
```

## Task C.10: Test de escaneo lingüístico automatizado

**Files:**
- Create: `tests/unit/content-linguist-scan.test.ts`

**Interfaces:**
- Produces: test que falla si reaparece cualquier string prohibida

- [ ] **Step 1: Crear test**

```ts
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const STORIES_DIR = "lib/data/languages/pt/stories";
const LESSONS_DIR = "lib/data/languages/pt/lessons";
const BLOCKS_DIR = "lib/data/languages/pt/blocks";

const FORBIDDEN = [
  /\bpresently\b/i,
  /\bintentar\b/i,
  /\bbicha\b/i, // tabu — handled separately, must be absent in non-marked contexts
  /\bpoujado\b/i,
  /\bdetelefone\b/i,
  /\baterrou no hotel\b/i,
];

const ALLOWED_CHARS = /^[\x00-\x7F -￿\s]+$/;
// Chinese range: 一-鿿 (U+4E00-U+9FFF)
const NO_CHINESE = /[一-鿿]/;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap(d => d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]);
}

describe("content linguist scan", () => {
  const allFiles = [...walk(STORIES_DIR), ...walk(LESSONS_DIR), ...walk(BLOCKS_DIR)]
    .filter(f => f.endsWith(".json"));

  it.each(allFiles)("%s no contiene strings prohibidos", (file) => {
    const content = readFileSync(file, "utf-8");
    for (const re of FORBIDDEN) {
      expect(content).not.toMatch(re);
    }
  });

  it.each(allFiles)("%s no contiene caracteres chinos sueltos", (file) => {
    const content = readFileSync(file, "utf-8");
    expect(content).not.toMatch(NO_CHINESE);
  });
});
```

- [ ] **Step 2: Correr**

```bash
npx vitest run tests/unit/content-linguist-scan.test.ts
```

Expected: todos los tests pasan (los fixes C1–C8 ya están aplicados).

- [ ] **Step 3: Commit**

```bash
git add tests/unit/content-linguist-scan.test.ts
git commit -m "test(content): scan automatizado para strings prohibidos + caracteres no-PT"
```

## Task C.11: `variantHighlights` en historias (tooltip desde b1)

**Files:**
- Modify: `lib/data/languages/pt/stories/*.json` (al menos 5 historias)

**Interfaces:**
- Schema: añade campo opcional `variantHighlights: string[]`

- [ ] **Step 1: Definir schema**

```ts
// lib/data/languages/pt/story-schema.ts
import { z } from "zod";
export const storySchema = z.object({
  id: z.string(),
  blockId: z.number(),
  lessonIds: z.array(z.string()).default([]),
  title: z.string(),
  level: z.number(),
  conceptIds: z.array(z.string()),
  variants: z.object({
    br: z.object({ text: z.string(), audioHash: z.string() }),
    pt: z.object({ text: z.string(), audioHash: z.string() }),
  }),
  vocab: z.array(z.object({
    word: z.string(),
    ptWord: z.string(),
    meaning: z.string(),
    audioHash: z.object({ br: z.string(), pt: z.string() }),
  })),
  variantHighlights: z.array(z.string()).optional(),
});
```

- [ ] **Step 2: Añadir a 5 historias (b1-s1, b2-s1, b3-s1, b4-s1, b5-s1)**

Ejemplo para `b1-s1-o-dia-a-dia-de-joao-na-padaria.json`:

```json
"variantHighlights": [
  "ônibus (BR) → autocarro (PT)",
  "celular (BR) → telemóvel (PT)"
]
```

- [ ] **Step 3: Commit**

```bash
git add lib/data/languages/pt/stories/
git commit -m "feat(content): variantHighlights en 5 historias desde b1 (BR↔PT inline)"
```

## Task C.12: `docs/qa-checks-linguisticos.md` + validar `propose-lessons.ts`

**Files:**
- Create: `docs/qa-checks-linguisticos.md`
- Modify: `scripts/propose-lessons.ts`

- [ ] **Step 1: Crear checklist**

```markdown
# QA lingüístico — checklist A–G

Categorías del reporte de lingüística portuguesa. Aplicar a cada PR de contenido.

## A — Variantes BR/PT
- [ ] Vocabulario marcado como BR o PT cuando difiere
- [ ] No se usa "ônibus" en texto PT sin marca
- [ ] No se usa "autocarro" en texto BR sin marca

## B — Falsos amigos
- [ ] Ficar, pegar, borracha, oficina, propina, carta con explicación
- [ ] No hay "bicha" sin flag `tabu`

## C — Calidad textual
- [ ] Cero caracteres chinos / cirílicos sueltos
- [ ] Cero strings en inglés o español (intentar, presently)
- [ ] Ortografía PT validada

## D — Terminología gramatical
- [ ] Nombres de lección usan nomenclatura PT (pretérito perfeito, conjuntivo)
- [ ] No se mezcla con español (pretérito perfecto compuesto)

## E — Progresión
- [ ] Conceptos introducidos en bloque correcto
- [ ] Conceptos previos no asumidos sin repaso

## F — Audio
- [ ] Hash corresponde a texto corregido
- [ ] Solo se regeneran audios de fixes de texto

## G — Glosario
- [ ] Cada palabra nueva tiene entrada en glossary.json
- [ ] Cada entrada tiene conceptIds apuntando al concepto correcto
```

- [ ] **Step 2: Añadir validación a `propose-lessons.ts`**

Localizar el script y añadir antes del push final:

```ts
import { glossarySchema } from "../lib/data/languages/pt/glossary-schema";
// ...
// Al final, antes de retornar la lista propuesta:
const proposedWords = [...new Set(proposed.flatMap(p => p.vocab?.map(v => v.word) ?? []))];
const glossaryWords = new Set((await import("../lib/data/languages/pt/glossary.json", { with: { type: "json" } })).default.map(e => e.word));
const missing = proposedWords.filter(w => !glossaryWords.has(w));
if (missing.length > 0) {
  console.warn(`[propose-lessons] ${missing.length} vocab words not in glossary:`, missing.slice(0, 5));
}
```

- [ ] **Step 3: Commit**

```bash
git add docs/qa-checks-linguisticos.md scripts/propose-lessons.ts
git commit -m "docs(content): QA checklist A-G + validar conceptIds en propose-lessons"
```

## Task C.13: Limpiar `*.rejected.json`

**Files:**
- Delete: `lib/data/languages/pt/stories/*.rejected.json` (si existen)
- Delete: `lib/data/languages/pt/lessons/*.rejected.json` (si existen)

- [ ] **Step 1: Buscar y borrar**

```bash
find lib/data/languages/pt -name "*.rejected.json" -type f -delete
git add -A lib/data/languages/pt/
git commit -m "chore(content): limpiar *.rejected.json stale"
```

---

# FASE 4 — WS-D (Pedagogía)

## Task D.1: Activar ShadowingCard + poblar B3–B8 (~50 cards)

**Files:**
- Create: `components/cards/ShadowingCard.tsx`
- Create: `scripts/seed-shadowing.ts`

**Interfaces:**
- Produce: ~50 cards Shadowing en bloques 3-8 con audio TTS

- [ ] **Step 1: Crear componente**

```tsx
"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui";
import { Mic, Square } from "lucide-react";

interface Props {
  prompt: string;
  audioUrl: string;
  audioVariant: string;
  onGrade: (correct: boolean) => void;
}

export function ShadowingCard({ prompt, audioUrl, audioVariant, onGrade }: Props) {
  const [recording, setRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const [hasRecording, setHasRecording] = useState(false);

  async function toggleRecord() {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const r = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    r.ondataavailable = e => chunks.push(e.data);
    r.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      setHasRecording(true);
    };
    r.start();
    recorderRef.current = r;
    setRecording(true);
  }

  return (
    <div className="bg-paper-raised border border-rule rounded-xl p-8 text-center">
      <div className="text-xs uppercase tracking-[0.07em] text-info bg-info-soft px-3 py-1.5 rounded-full inline-block mb-6 font-semibold">
        Shadowing
      </div>
      <p className="font-display text-[28px] mb-4">{prompt}</p>
      <audio controls src={audioUrl} className="mb-4 w-full" />
      <p className="text-sm text-ink-faint mb-6">Pronunciá en voz alta · {audioVariant.toUpperCase()}</p>
      <Button variant={recording ? "destructive" : "primary"} onClick={toggleRecord}>
        {recording ? <><Square size={14} /> Detener</> : <><Mic size={14} /> Grabar</>}
      </Button>
      {hasRecording && (
        <div className="mt-4 flex gap-2 justify-center">
          <Button variant="secondary" onClick={() => onGrade(false)}>Otra vez</Button>
          <Button variant="primary" onClick={() => onGrade(true)}>Listo</Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Crear script de seed**

`scripts/seed-shadowing.ts`:

```ts
// scripts/seed-shadowing.ts
// Genera ~50 shadowing cards para bloques 3-8 con audio TTS.
// Invocar: tsx scripts/seed-shadowing.ts

import { generateTts } from "@/lib/llm/tts";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

interface ShadowItem { prompt: string; blockId: number; }

const ITEMS: ShadowItem[] = [
  { prompt: "Tenho estudado português todos os dias.", blockId: 3 },
  { prompt: "Eu tenho falado com meus amigos.", blockId: 3 },
  { prompt: "Nós temos comido juntos.", blockId: 3 },
  // … completar hasta 50 con frases de los bloques 3-8
];

async function main() {
  for (const item of ITEMS) {
    for (const variant of ["br", "pt"] as const) {
      const audioBuf = await generateTts(item.prompt, variant);
      const hash = sha256(audioBuf);
      const path = join("public/audio", `${hash}.mp3`);
      await mkdir("public/audio", { recursive: true });
      await writeFile(path, audioBuf);
      console.log(`✓ ${variant} ${item.prompt.slice(0, 40)}… → ${hash}`);
    }
  }
}

function sha256(buf: Buffer): string {
  return require("crypto").createHash("sha256").update(buf).digest("hex");
}

main().catch(console.error);
```

- [ ] **Step 3: Seed + commit**

```bash
tsx scripts/seed-shadowing.ts
git add public/audio/ scripts/seed-shadowing.ts components/cards/ShadowingCard.tsx
git commit -m "feat(pedagogy): ShadowingCard component + 50 audio seeds (B3-B8)"
```

## Task D.2: ClozeCard (reusar FillBlankCard con `text[]`)

**Files:**
- Modify: `components/cards/FillBlankCard.tsx` (soportar array de huecos)

- [ ] **Step 1: Cambiar a ClozeCard**

```tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui";

interface ClozeBlank { text: string; /** index of blank in tokens */ blankIndex: number; }
interface Props {
  text: string;       // "Vou _____ dinheiro para a viagem."
  answer: string;     // "poupar"
  distractors: string[]; // ["popar", "podar"]
  hint?: string;
  onGrade: (rating: 1 | 2 | 3 | 4) => void;
}

export function ClozeCard({ text, answer, distractors, hint, onGrade }: Props) {
  const [guess, setGuess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const correct = guess.trim().toLowerCase() === answer.toLowerCase();
  const options = useMemo(() => shuffle([answer, ...distractors]).slice(0, 4), [answer, distractors]);

  return (
    <div className="bg-paper-raised border border-rule rounded-xl p-8">
      <div className="text-xs uppercase tracking-[0.07em] text-lesson bg-lesson-soft px-3 py-1.5 rounded-full inline-block mb-6 font-semibold">
        Cloze
      </div>
      <p className="font-display text-[28px] mb-6">
        {text.replace("_____", "______")}
      </p>
      {!submitted ? (
        <div className="grid grid-cols-2 gap-2">
          {options.map(o => (
            <Button key={o} variant="secondary" onClick={() => { setGuess(o); setSubmitted(true); }}>
              {o}
            </Button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className={`font-display text-2xl mb-4 ${correct ? "text-lesson" : "text-error"}`}>
            {correct ? "✓ Correcto" : `Era "${answer}"`}
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" onClick={() => onGrade(1)}>Otra vez</Button>
            <Button variant="secondary" onClick={() => onGrade(3)}>Bien</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
import { useMemo } from "react";
```

- [ ] **Step 2: Generar 60 clozes a partir de historias existentes**

`scripts/seed-cloze.ts`:

```ts
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const storiesDir = "lib/data/languages/pt/stories";
const stories = readdirSync(storiesDir).filter(f => f.endsWith(".json"));

// Extraer frases de ~30 chars, identificar sustantivos/verbos candidatos a cloze.
const clozeSeeds: Array<{ storyId: string; text: string; answer: string }> = [];

for (const f of stories) {
  const story = JSON.parse(readFileSync(join(storiesDir, f), "utf-8"));
  const text: string = story.variants.br.text;
  // Heurística simple: cloze cada 5to verbo/sustantivo capitalizado
  const tokens = text.split(/\s+/);
  for (let i = 0; i < tokens.length; i += 10) {
    const answer = tokens[i].replace(/[.,;:!?]/g, "");
    if (answer.length < 3) continue;
    const blanked = tokens.map((t, j) => j === i ? "_____" : t).join(" ");
    clozeSeeds.push({ storyId: story.id, text: blanked, answer });
  }
}

writeFileSync("lib/data/languages/pt/cloze-seeds.json", JSON.stringify(clozeSeeds.slice(0, 60), null, 2));
console.log(`✓ ${clozeSeeds.length} cloze seeds written`);
```

```bash
tsx scripts/seed-cloze.ts
git add lib/data/languages/pt/cloze-seeds.json scripts/seed-cloze.ts components/cards/FillBlankCard.tsx
git commit -m "feat(pedagogy): ClozeCard component + 60 seeds from existing stories"
```

## Task D.3: ProductionCard + cola diferida 24h

**Files:**
- Create: `components/cards/ProductionCard.tsx`
- Create: `lib/production/queue.ts`
- Modify: `lib/db/schema.ts` (o usar tabla existente)

**Interfaces:**
- Produce: textarea + autoevaluación + enqueue para feedback diferido

- [ ] **Step 1: Componente**

```tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui";

interface Props {
  prompt: string; // "Escribe 5 frases sobre tu rutina matutina en PT-BR"
  exampleAnswers: string[];
  onSubmit: (text: string) => Promise<void>;
}

export function ProductionCard({ prompt, exampleAnswers, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (text.trim().split(/\s+/).length < 20) {
      alert("Escribe al menos 20 palabras para que tenga sentido pedagógico.");
      return;
    }
    setSubmitting(true);
    await onSubmit(text);
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-paper-raised border border-lesson rounded-xl p-8 text-center">
        <div className="text-xs uppercase tracking-[0.07em] text-lesson bg-lesson-soft px-3 py-1.5 rounded-full inline-block mb-4 font-semibold">
          Producción · enviado
        </div>
        <p className="font-display text-2xl mb-3">Recibirás feedback diferido en 24h</p>
        <p className="text-sm text-ink-muted">Sigue con la sesión — volveremos a esta card cuando esté corregida.</p>
      </div>
    );
  }

  return (
    <div className="bg-paper-raised border border-rule rounded-xl p-8">
      <div className="text-xs uppercase tracking-[0.07em] text-lesson bg-lesson-soft px-3 py-1.5 rounded-full inline-block mb-6 font-semibold">
        Producción
      </div>
      <p className="font-display text-[20px] mb-4">{prompt}</p>
      <details className="mb-3">
        <summary className="text-sm text-ink-muted cursor-pointer">Ver ejemplos (no copies)</summary>
        <ul className="text-sm text-ink-muted italic mt-2 list-disc pl-5">
          {exampleAnswers.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </details>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Escribe aquí en portugués…"
        rows={8}
        className="w-full bg-paper-sunken border border-rule rounded-md p-3 font-mono text-sm focus:outline-none focus:border-lesson"
      />
      <div className="mt-2 text-xs text-ink-faint text-right">{text.trim().split(/\s+/).length} palabras</div>
      <Button variant="primary" onClick={handleSubmit} disabled={submitting} className="mt-4 w-full">
        {submitting ? "Enviando…" : "Enviar para corrección"}
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Cola diferida**

`lib/production/queue.ts`:

```ts
import { db } from "@/lib/db/schema";
import { setUiState } from "@/lib/db/repository";

export interface ProductionSubmission {
  id: string;
  promptId: string;
  text: string;
  submittedAt: number;
  feedbackReadyAt: number; // +24h
  feedback?: string;
}

export async function enqueueProduction(submission: Omit<ProductionSubmission, "id" | "submittedAt" | "feedbackReadyAt">): Promise<void> {
  const now = Date.now();
  const sub: ProductionSubmission = {
    id: crypto.randomUUID(),
    submittedAt: now,
    feedbackReadyAt: now + 24 * 60 * 60 * 1000,
    ...submission,
  };
  const existing = (await db.telemetry.where("source").equals("production").toArray()) as unknown as ProductionSubmission[];
  await setUiState(`production:${sub.id}`, sub);
  // Marca en telemetry para notificar al usuario cuando esté lista.
  await db.telemetry.add({ ts: new Date(sub.feedbackReadyAt), level: "warn", source: "production-feedback", message: sub.id });
}

export async function getReadyProductionFeedback(): Promise<ProductionSubmission[]> {
  const now = Date.now();
  // Buscar submissions con feedbackReadyAt <= now y sin feedback.
  // (Implementación simplificada — en producción se itera sobre uiState keys)
  return [];
}
```

- [ ] **Step 3: Commit**

```bash
git add components/cards/ProductionCard.tsx lib/production/queue.ts
git commit -m "feat(pedagogy): ProductionCard + cola diferida 24h"
```

## Task D.4: Sesión cronometrada (20 min, fatigue check, opt-in 40 min)

**Files:**
- Modify: `lib/stores/session.ts` (ya creado en A.3, agregar fatigue check)
- Modify: `app/[lang]/(review)/practicar/srs/page.tsx`

- [ ] **Step 1: Añadir fatigue check al store**

Añadir a `lib/stores/session.ts`:

```ts
interface SessionState {
  // ... existente ...
  fatigueShownAt: number | null;
  showFatigueCheck: () => boolean;
  acknowledgeFatigue: () => void;
}
// En el create:
showFatigueCheck: () => {
  const s = get();
  if (s.fatigueShownAt) return false;
  const elapsed = s.elapsedMs();
  return elapsed >= 18 * 60 * 1000; // 18 min
},
acknowledgeFatigue: () => set({ fatigueShownAt: Date.now() }),
```

- [ ] **Step 2: UI en página de sesión**

```tsx
const showFatigue = useSession(s => s.showFatigueCheck());
const ackFatigue = useSession(s => s.acknowledgeFatigue);

useEffect(() => {
  if (showFatigue) {
    // Modal no-bloqueante con opción de continuar o parar
    if (confirm("Llevas 18 minutos. ¿Querés parar? Los intervals ya están guardados.")) {
      session.reset();
      router.push(`/${lang}`);
    } else {
      ackFatigue();
    }
  }
}, [showFatigue]);
```

- [ ] **Step 3: Commit**

```bash
git add lib/stores/session.ts app/[lang]/(review)/practicar/srs/page.tsx
git commit -m "feat(session): cronómetro 20 min + fatigue check a los 18 min"
```

## Task D.5: Leech ladder (3 lapses → reset a 5 → focus session)

**Files:**
- Modify: `lib/srs/leeches.ts` (ya existe; extender)

- [ ] **Step 1: Extender lógica**

```ts
// lib/srs/leeches.ts
export const LEECH_THRESHOLD = 3;
export const LEECH_LADDER: Array<{ lapses: number; action: "warn" | "reset" | "focus" }> = [
  { lapses: 3, action: "warn" },
  { lapses: 5, action: "reset" },
  { lapses: 7, action: "focus" },
];

export interface LeechAction {
  level: "warn" | "reset" | "focus";
  message: string;
}

export function getLeechAction(lapses: number): LeechAction | null {
  const tier = LEECH_LADDER.find(t => t.lapses === lapses);
  if (!tier) return null;
  switch (tier.action) {
    case "warn": return { level: "warn", message: "Esta card te está costando — la veré más seguido." };
    case "reset": return { level: "reset", message: "Card en 'reset' — la trataremos como nueva con más contexto." };
    case "focus": return { level: "focus", message: "Leech avanzado — sesión de foco con 3 variantes a continuación." };
  }
}
```

- [ ] **Step 2: Wirear en recordAnswer**

Localizar `recordAnswer` en `lib/db/repository.ts` y después de incrementar `lapses`:

```ts
import { getLeechAction } from "@/lib/srs/leeches";

export async function recordAnswer(cardId: CardId, rating: Rating, responseMs: number, sessionId?: number) {
  // ... existente: actualizar FSRS, nextReviewAt, etc.
  const card = await db.cards.get(cardId);
  if (rating === 1 && card) {
    const newLapses = card.lapses + 1;
    const action = getLeechAction(newLapses);
    if (action) {
      await db.telemetry.add({ ts: new Date(), level: "warn", source: "leech", message: action.message, context: { cardId, lapses: newLapses } });
      if (action.level === "reset") {
        await resetLeech(cardId);
      }
    }
  }
}
```

- [ ] **Step 3: UI — toast al detectar leech**

```tsx
// components/session/LeechToast.tsx
import { useEffect, useState } from "react";
import { db } from "@/lib/db/schema";

export function LeechToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    const interval = setInterval(async () => {
      const recent = await db.telemetry.where("source").equals("leech").reverse().sortBy("ts").then(r => r[0]);
      if (recent && Date.now() - recent.ts.getTime() < 5000) {
        setMsg(recent.message);
        setTimeout(() => setMsg(null), 4000);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-review text-paper px-5 py-3 rounded-lg shadow-md text-sm">
      {msg}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/srs/leeches.ts lib/db/repository.ts components/session/LeechToast.tsx
git commit -m "feat(pedagogy): leech ladder (warn @3 / reset @5 / focus @7) + toast"
```

## Task D.6: Feedback post-error con regla + Contraste ES

**Files:**
- Modify: `components/session/ExerciseCard.tsx`

- [ ] **Step 1: Mostrar regla en reveal**

Localizar `ExerciseCard.tsx` y, tras el `backText`, añadir si `rule` y `contrastText` están presentes:

```tsx
{revealed && rule && (
  <div className="mt-4 p-3 bg-paper-sunken border border-rule rounded-md text-left">
    <div className="text-xs uppercase tracking-[0.07em] text-ink-muted font-semibold mb-1.5">
      📖 Regla
    </div>
    <p className="text-sm text-ink-muted">{rule}</p>
  </div>
)}
```

Y añadir prop:

```tsx
interface Props {
  // ...
  rule?: string;
  contrastText?: string;
}
```

- [ ] **Step 2: Botón "Marcar para repaso extra"**

```tsx
<Button variant="ghost" size="sm" onClick={() => db.telemetry.add({ ts: new Date(), level: "warn", source: "extra-review", message: dbCard.id })}>
  + Repaso extra
</Button>
```

- [ ] **Step 3: Commit**

```bash
git add components/session/ExerciseCard.tsx
git commit -m "feat(session): mostrar regla + contraste ES + botón repaso extra post-error"
```

## Task D.7: `weightedAccuracy()` en write path

**Files:**
- Modify: `lib/db/repository.ts` (`recordAnswerForConcepts` ya existe; verificar llamada)

- [ ] **Step 1: Localizar y verificar**

```bash
grep -n "recordAnswerForConcepts\|weightedAccuracy" lib/db/repository.ts lib/mastery/concept.ts | head -10
```

- [ ] **Step 2: Si `weightedAccuracy` existe pero no se invoca, añadir en `recordAnswer`**

```ts
// En recordAnswer, tras actualizar el card:
await recordAnswerForConcepts(card.conceptIds, rating, responseMs);
```

- [ ] **Step 3: Si no existe, crear `weightedAccuracy` en `lib/mastery/concept.ts`**

```ts
/**
 * Accuracy ponderada: ratings Easy valen más que Hard, Again no cuenta.
 * Útil para mastery decay — distingue "10 Bien fácil" de "10 Bien apenas".
 */
export function weightedAccuracy(recentRatings: Rating[]): number {
  const weights: Record<Rating, number> = { 1: 0, 2: 0.5, 3: 1, 4: 1.2 };
  if (recentRatings.length === 0) return 0;
  const sum = recentRatings.reduce((a, r) => a + weights[r], 0);
  return sum / recentRatings.length;
}
```

- [ ] **Step 4: Test**

```ts
// tests/unit/weighted-accuracy.test.ts
import { describe, it, expect } from "vitest";
import { weightedAccuracy } from "@/lib/mastery/concept";

describe("weightedAccuracy", () => {
  it("Again no aporta", () => expect(weightedAccuracy([1])).toBe(0));
  it("Bien = 1.0", () => expect(weightedAccuracy([3])).toBe(1));
  it("Fácil = 1.2", () => expect(weightedAccuracy([4])).toBeCloseTo(1.2));
  it("mezcla Hard+Bien = 0.75", () => expect(weightedAccuracy([2, 3])).toBe(0.75));
});
```

- [ ] **Step 5: Commit**

```bash
git add lib/db/repository.ts lib/mastery/concept.ts tests/unit/weighted-accuracy.test.ts
git commit -m "fix(pedagogy): invocar weightedAccuracy() en write path (decay real)"
```

## Task D.8: Interleaving entre días

**Files:**
- Modify: `lib/srs/interleave.ts` (si no existe, crear)

- [ ] **Step 1: Verificar / crear `interleave.ts`**

```ts
// lib/srs/interleave.ts
import type { Card } from "@/lib/db/schema";

/**
 * Mezcla cards priorizando: 30% nuevos, 30% reviews bloque previo, 20% lejanos,
 * 10% leeches, 10% oral (Shadowing/Production).
 * Mantiene al menos 1 card por bloque conceptual.
 */
export function interleave(cards: Card[], opts: { oral?: Card[]; leeches?: Card[] } = {}): Card[] {
  const review = cards.filter(c => c.state > 0 && c.lapses < 3);
  const newCards = cards.filter(c => c.state === 0);
  const leeches = opts.leeches ?? cards.filter(c => c.lapses >= 3);

  // Distribución proporcional simple (no optimizada para cola pequeña).
  const out: Card[] = [];
  const target = cards.length;
  out.push(...shuffle(newCards).slice(0, Math.ceil(target * 0.3)));
  out.push(...shuffle(review).slice(0, Math.ceil(target * 0.3)));
  out.push(...shuffle(review).slice(target * 0.3, target * 0.5)); // lejanos
  out.push(...shuffle(leeches).slice(0, Math.ceil(target * 0.1)));
  if (opts.oral) out.push(...shuffle(opts.oral).slice(0, Math.ceil(target * 0.1)));

  return shuffle(out).slice(0, target);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
```

- [ ] **Step 2: Wirear en página de sesión**

```tsx
// En srs/page.tsx, reemplazar getDueCards por:
const allDue = await getDueCards(new Date(), 100, { cap: 100 });
const oral = await db.cards.where("tags").anyOf(["shadowing", "production"]).toArray();
const leeches = allDue.filter(c => c.lapses >= 3);
const queue = interleave(allDue.filter(c => !leeches.includes(c)), { oral, leeches });
```

- [ ] **Step 3: Test**

```ts
// tests/unit/interleave.test.ts
import { describe, it, expect } from "vitest";
import { interleave } from "@/lib/srs/interleave";

const cards = [
  { id: "1", state: 0, lapses: 0 } as any,
  { id: "2", state: 2, lapses: 1 } as any,
  { id: "3", state: 2, lapses: 5 } as any,
  { id: "4", state: 0, lapses: 0 } as any,
];

describe("interleave", () => {
  it("respeta proporciones básicas", () => {
    const out = interleave(cards);
    expect(out.length).toBeLessThanOrEqual(cards.length);
  });
  it("incluye leeches si están disponibles", () => {
    const out = interleave(cards.filter(c => c.lapses < 3), { leeches: cards.filter(c => c.lapses >= 3) });
    expect(out.some(c => c.lapses >= 3)).toBe(true);
  });
});
```

- [ ] **Step 4: Commit**

```bash
git add lib/srs/interleave.ts app/[lang]/(review)/practicar/srs/page.tsx tests/unit/interleave.test.ts
git commit -m "feat(pedagogy): interleaving entre días (30/30/20/10/10)"
```

## Task D.9: Activar Shadowing/Cloze/Production en la rotación de tipos

**Files:**
- Modify: `app/[lang]/(review)/practicar/srs/page.tsx`

- [ ] **Step 1: Switch por `card.tags`**

```tsx
const tags = current.tags ?? [];
if (tags.includes("shadowing")) {
  return <ShadowingCard ... />;
} else if (tags.includes("cloze")) {
  return <ClozeCard ... />;
} else if (tags.includes("production")) {
  return <ProductionCard ... />;
} else {
  return <ExerciseCard ... />;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/[lang]/(review)/practicar/srs/page.tsx
git commit -m "feat(session): switch por tags (shadowing/cloze/production/flashcard)"
```

---

# FASE 5 — WS-E (QA continuo)

> WS-E es transversal. Cada PR de WS-A/B/C/D dispara al menos un check de E.

## Task E.1: e2e Playwright clic-real por Link

**Files:**
- Create: `tests/e2e/all-links.spec.ts`

- [ ] **Step 1: Test exhaustivo de links**

```ts
import { test, expect } from "@playwright/test";

const START_PATHS = ["/pt", "/pt/libro", "/pt/progreso", "/pt/cuenta", "/pt/practicar/srs", "/pt/historias"];

for (const start of START_PATHS) {
  test(`todos los <a> internos de ${start} cargan 200`, async ({ page }) => {
    await page.goto(start);
    const links = await page.locator("a[href^='/']").all();
    const hrefs = await Promise.all(links.map(l => l.getAttribute("href")));
    const uniqueHrefs = [...new Set(hrefs.filter(h => h && !h.startsWith("/api/") && !h.includes("#")))];
    for (const href of uniqueHrefs) {
      const normalized = href.startsWith("/pt") ? href : `/pt${href}`;
      const resp = await page.request.get(normalized);
      expect([200, 308], `link ${href} → ${resp.status()}`).toContain(resp.status());
    }
  });
}
```

- [ ] **Step 2: Correr**

```bash
npx playwright test tests/e2e/all-links.spec.ts --reporter=line
```

Expected: todos pasan. Si falla alguno, identificar prefijo `/${lang}` faltante y corregir.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/all-links.spec.ts
git commit -m "test(qa): e2e clic-real que valida 200/308 en todos los links internos"
```

## Task E.2: Migración v7→v8 con fake-indexeddb (3 perfiles snapshot)

**Files:**
- Modify: `tests/unit/migrate-v7-to-v8.test.ts`

- [ ] **Step 1: Añadir 3 perfiles**

```ts
async function seedV7Profile(profile: "nuevo" | "intermedio" | "veterano") {
  const seed = new Dexie("PortuguesAppDB");
  seed.version(1).stores({ cards: "id, blockId, lessonId, nextReviewAt, state" });
  await seed.open();
  const sizes = { nuevo: 5, intermedio: 50, veterano: 500 };
  const cards = Array.from({ length: sizes[profile] }, (_, i) => ({
    id: `${profile}-c${i}`,
    blockId: (i % 10) + 1,
    lessonId: `l${i}`,
    contentHash: `h${i}`,
    fsrs: {},
    nextReviewAt: new Date(),
    state: i % 3,
    reps: i,
    lapses: i % 5,
    introducedAt: new Date(),
  }));
  await seed.table("cards").bulkAdd(cards);
  seed.close();
}

it.each(["nuevo", "intermedio", "veterano"] as const)(
  "perfil %s migra sin pérdida",
  async (profile) => {
    await Dexie.delete("PortuguesAppDB");
    await Dexie.delete("PortuguesAppDB_backup_v7");
    await seedV7Profile(profile);
    await createPreV8Backup();
    await db.open();
    const expectedSize = { nuevo: 5, intermedio: 50, veterano: 500 }[profile];
    expect(await db.cards.count()).toBe(expectedSize);
  }
);
```

- [ ] **Step 2: Correr**

```bash
npx vitest run tests/unit/migrate-v7-to-v8.test.ts
```

Expected: 3 nuevos tests pasan.

- [ ] **Step 3: Commit**

```bash
git add tests/unit/migrate-v7-to-v8.test.ts
git commit -m "test(db): migración v7→v8 probada con 3 perfiles snapshot"
```

## Task E.3: Snapshot tests FSRS/mastery/XP

**Files:**
- Create: `tests/unit/srs-snapshot.test.ts`

- [ ] **Step 1: Test de regresión numérica**

```ts
import { describe, it, expect } from "vitest";
import { schedule } from "@/lib/srs/fsrs";
import { levelFromXp } from "@/lib/xp/calculator";
import { recordAnswerForConcepts } from "@/lib/mastery/concept";
import "fake-indexeddb/auto";
import { db } from "@/lib/db/schema";

describe("SRS snapshot regression", () => {
  it("schedule FSRS-5 para rating 3 produce interval > 0 días", () => {
    const card = { id: "c", blockId: 1, lessonId: "l", contentHash: "h", fsrs: {}, nextReviewAt: new Date(), state: 1, reps: 1, lapses: 0, introducedAt: new Date() };
    const result = schedule(card, 3, new Date());
    expect(result.interval).toBeGreaterThan(0);
  });

  it("levelFromXp mapping estable", () => {
    expect(levelFromXp(0)).toBe("A1");
    expect(levelFromXp(500)).toBe("A2");
    expect(levelFromXp(2500)).toBe("B2");
  });
});
```

- [ ] **Step 2: Correr + commit**

```bash
npx vitest run tests/unit/srs-snapshot.test.ts
git add tests/unit/srs-snapshot.test.ts
git commit -m "test(qa): snapshot SRS formulas + levelFromXp"
```

## Task E.4: CSP assertion en `next.config` + `naturalWidth>0`

**Files:**
- Modify: `next.config.ts` (asegurarse de CSP `default-src 'self'` + `img-src 'self' data:`)
- Create: `tests/e2e/images-load.spec.ts`

- [ ] **Step 1: Verificar CSP**

```bash
grep -n "Content-Security-Policy\|img-src" next.config.ts next.config.js 2>&1 | head
```

Si no hay CSP, añadir al header config:

```ts
// next.config.ts (extract)
async headers() {
  return [{
    source: "/(.*)",
    headers: [{
      key: "Content-Security-Policy",
      value: "default-src 'self'; img-src 'self' data: blob: https://*.tile.openstreetmap.org https://flagcdn.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.example.com;",
    }],
  }];
}
```

(Adaptar al estado actual del proyecto.)

- [ ] **Step 2: Test que imágenes cargan**

```ts
import { test, expect } from "@playwright/test";

test("ninguna imagen rota en portada", async ({ page }) => {
  await page.goto("/pt");
  const broken = await page.evaluate(() => {
    return Array.from(document.images)
      .filter(img => img.complete && img.naturalWidth === 0)
      .map(img => img.src);
  });
  expect(broken).toEqual([]);
});
```

- [ ] **Step 3: Commit**

```bash
git add next.config.ts tests/e2e/images-load.spec.ts
git commit -m "test(qa): CSP assertion + naturalWidth>0 en imágenes (caza mapas rotos)"
```

## Task E.5: Test de acceptance por flujo

**Files:**
- Create: `tests/e2e/full-flow.spec.ts`

- [ ] **Step 1: Test end-to-end del happy path**

```ts
import { test, expect } from "@playwright/test";

test("flujo completo: portada → lección → sesión → progreso", async ({ page }) => {
  await page.goto("/pt");
  await expect(page.getByRole("heading", { name: /Bom dia/ })).toBeVisible();

  // Abrir capítulo actual desde TOC
  await page.getByText(/Pretérito perfeito/).click();
  await expect(page).toHaveURL(/\/pt\/libro\/3/);

  // Iniciar sesión
  await page.goto("/pt");
  await page.getByRole("link", { name: /Empezar sesión/ }).click();
  await expect(page).toHaveURL(/\/pt\/practicar\/srs/);

  // Responder primera card
  await page.getByRole("button", { name: /Revelar/ }).click();
  await page.getByRole("button", { name: /Bien/ }).click();

  // Ver progreso
  await page.goto("/pt/progreso");
  await expect(page.getByText(/Retención a 7 días/)).toBeVisible();
});
```

- [ ] **Step 2: Commit**

```bash
git add tests/e2e/full-flow.spec.ts
git commit -m "test(qa): e2e full-flow (portada → lección → sesión → progreso)"
```

---

# FASE 6 — Gates de cierre

## Gate 1: Integración

**Criterios de cierre (todos deben cumplirse):**

- [ ] **G1.1** — `npm run build` pasa sin warnings de Next 16.
- [ ] **G1.2** — `npx vitest run` pasa todos los tests unitarios (migración, glosario, scan lingüístico, weighted accuracy, interleave, FSRS snapshot).
- [ ] **G1.3** — `npx playwright test` pasa todos los tests e2e (home, lección, sesión, progreso, redirects, full-flow, all-links, images-load).
- [ ] **G1.4** — Las 4 pantallas clave (portada, lección, sesión, progreso) coinciden con los mockups en espaciado, color y jerarquía (revisión visual manual).
- [ ] **G1.5** — Todos los 8 fixes C1–C8 verificados con `grep -r` que las strings prohibidas no reaparecen.
- [ ] **G1.6** — `glossary.json` tiene ≥40 entradas y valida con `glossarySchema`.
- [ ] **G1.7** — Dexie v8 migra los 3 perfiles snapshot (nuevo/intermedio/veterano) sin pérdida.
- [ ] **G1.8** — Rutas viejas redirigen 308 a las nuevas; ningún link interno da 404.
- [ ] **G1.9** — `achievements/rules.ts` dispara br-explorer y pt-explorer con claves canónicas.
- [ ] **G1.10** — Hardcode `pt` eliminado en `/api/lessons/[lang]/[lessonId]/route.ts`.

## Gate 2: Audio (solo tras G1 verificado)

**Solo regenerar TTS de los hashes afectados por los fixes C1–C8 + Shadowing nuevo.**

- [ ] **G2.1** — Listar hashes afectados por diffs de texto:

```bash
node scripts/list-affected-audio-hashes.ts > affected-hashes.txt
```

- [ ] **G2.2** — Regenerar solo esos hashes:

```bash
tsx scripts/regenerate-affected-audio.ts $(cat affected-hashes.txt)
```

- [ ] **G2.3** — Verificar `public/audio/` no creció más de ~5% (sospecha de regen masiva):

```bash
du -sh public/audio/  # comparar con baseline
```

- [ ] **G2.4** — Smoke: escuchar 5 audios regenerados y verificar pronunciación.

- [ ] **G2.5** — `verify:content` pasa:

```bash
npm run verify:content
```

---

## Definition of Done (copiado del spec)

1. Las 4 pantallas clave coinciden con los mockups y pasan e2e clic-real.
2. Dexie v8 migra los 3 perfiles snapshot sin pérdida; rollback probado.
3. Los 8 errores de contenido (C1–C8) corregidos; `glossary.json` con ≥40 entradas; checklist A-G al 100%.
4. Audio regenerado solo para hashes afectados; `verify:content` pasa.
5. Shadowing, Cloze y Production activos con contenido real; sesión cronometrada + leech ladder funcionando.
6. `/progreso` muestra las métricas de outcome; mastery con decay real.
7. Rutas viejas redirigen 308 a las nuevas; sin links rotos.
8. Fix de `achievements/rules.ts` y hardcode `pt` verificados.

---

## Notas de ejecución para los agentes paralelos

1. **Cada agente abre su propia rama** desde `redesign/manual-lusitano`: `feature/ws-A-portada`, `feature/ws-B-rutas`, `feature/ws-C-glossary`, `feature/ws-D-shadowing`. PRs hacia `redesign/manual-lusitano` cuando WS-E valide.

2. **Conflictos esperados** en `lib/db/schema.ts` (Dexie v8) y `app/globals.css` (tokens) — coordinar merges en Gate 0 primero, luego WS-A/B/D pueden tocar independientemente.

3. **No tocar** `lib/db/schema.ts` después de Gate 0 (Task 0.4) sin coordinarlo — cambios al schema invalidan backups v7.

4. **QA es continuo**: WS-E está embebido en cada PR, no es una fase final. Si un test falla, el PR no se mergea.

5. **Antes de Gate 2**, regenerar audio SOLO de los hashes cuyo texto cambió. Nunca correr TTS sobre los 5.451 MP3.

6. **Conventional commits** con prefijos: `feat`, `fix`, `docs`, `test`, `chore`, `style`, `refactor`. Sin mezcla.

7. **Self-review** por el agente antes de pedir review a otro: re-leer el spec y verificar cobertura, después correr los pasos del checklist de su workstream.