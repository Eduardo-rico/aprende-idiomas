# Task A.5 Report — Cuenta hub (Manual Lusitano)

## Status
DONE — `/[lang]/cuenta` is a 4-card hub landing on 4 Manual Lusitano sub-views. A.6 follow-up closed all the chrome limitations (VariantToggle + VoicePicker chrome, NavBar link, redirect, this report).

## Files changed
### Created
- `components/cuenta/CuentaNav.tsx` (Hub + 4 sub-view tab strip)
- `components/cuenta/HubCard.tsx` (Card primitive + Link + ArrowRight)
- `app/[lang]/cuenta/page.tsx` (hub)
- `app/[lang]/cuenta/preferencias/page.tsx`
- `app/[lang]/cuenta/objetivo/page.tsx` + `ObjetivoForm.tsx`
- `app/[lang]/cuenta/display/page.tsx` + `DisplayForm.tsx`
- `app/[lang]/cuenta/sesion/page.tsx` + `SesionForm.tsx`
- `tests/unit/cuenta-nav.test.tsx` (4 tests)
- `tests/unit/cuenta-hub-card.test.tsx` (2 tests)
- `tests/unit/cuenta-hub-page.test.tsx` (3 tests)
- `tests/unit/cuenta-objetivo-form.test.tsx` (3 tests)
- `tests/unit/cuenta-display-form.test.tsx` (4 tests)
- `tests/unit/cuenta-sesion-form.test.tsx` (5 tests)

### Modified
- `lib/stores/settings.ts` — added `sessionLengthMinutes` (20|40), `fatigueCheckEnabled` + setters
- `components/VariantToggle.tsx` — shadcn → Manual Lusitano chrome (A.6)
- `components/VoicePicker.tsx` — shadcn → Manual Lusitano chrome (A.6)
- `components/NavBar.tsx` — gear icon → "Cuenta" link to `/cuenta` (A.6)
- `next.config.ts` — 308 redirect `/[lang]/settings → /[lang]/cuenta` (A.6)
- `tests/unit/variant-toggle.test.tsx` (new, A.6)
- `tests/unit/voice-picker.test.tsx` (new, A.6)

## Component breakdown
- **CuentaNav** — `<nav>` with Hub link + 4 sub-view links. Active state via `bg-ink text-paper` (manual Lusitano chrome). Used in every sub-page header.
- **HubCard** — presentational Link wrapping a `Card` primitive. Group hover promotes shadow. Title (Fraunces 22px) + description + "Abrir →" call to action.
- **Hub page** — server component, async params (Next 16 contract), 2×2 grid via `sm:grid-cols-2`.
- **preferencias** — VariantToggle + VoicePicker (now in Manual Lusitano chrome). No client-side state beyond what the inner components manage.
- **objetivo/ObjetivoForm** — slider 5–60 step 5 → `useSettings.setDailyGoal`. Inline "✓ Guardado" chip with 1.5s timeout.
- **display/DisplayForm** — theme light/dark toggle + 3 toggles (`showCompareToggle`, `showContrast`, `soundFx`). Reads `useTheme` for theme + `useSettings` for the rest.
- **sesion/SesionForm** — length 20/40 toggle + fatigue checkbox + logout button. Two new fields from the store extension.

## Aggregations added
None (this task is a settings reorganization, no new analytics).

## Routes (`app/[lang]/cuenta/`)
- `page.tsx` (hub) — `ƒ` dynamic (server shell + client islands via forms)
- `preferencias/page.tsx` — server shell + VariantToggle + VoicePicker (client islands)
- `objetivo/page.tsx` — server shell + ObjetivoForm (client)
- `display/page.tsx` — server shell + DisplayForm (client)
- `sesion/page.tsx` — server shell + SesionForm (client)

All 5 registered as `ƒ` in `next build`.

## Build status
- `npx tsc --noEmit` clean
- `npm test` → 684 passed (657 + 21 cuenta + 6 variant/voice-picker). 1 pre-existing failure (`lessons-view-stub.test.ts`) unchanged.
- `npm run build` → Compiled successfully; `/[lang]/cuenta{,/preferencias,/objetivo,/display,/sesion}` registered as `ƒ` dynamic.
- Smoke (via `next start` since `next dev` choked on full disk): `GET /pt/cuenta{,/preferencias,/objetivo,/display,/sesion}` → 200 OK × 5. Hub HTML contains `Cuenta` heading + 4 card titles + `Configurá tu experiencia de estudio` intro. `/sesion` HTML contains `Duración` + `Fatiga` + `Cerrar sesión` + 3 control `data-testid`s.
- A.6 smoke: `GET /pt/settings` → `HTTP/1.1 308 Permanent Redirect` with `location: /pt/cuenta` and `Refresh: 0;url=/pt/cuenta`. NavBar renders the new "Cuenta" link.

## Tests added (27 across 8 files)
- `cuenta-nav` x4: 4 sub-view links + Hub link, lang-prefixed hrefs, active highlight on Hub when no `active`, active highlight on the right sub-view.
- `cuenta-hub-card` x2: title + desc render, Link wrapping with given href.
- `cuenta-hub-page` x3: 4 cards rendered, hrefs lang-prefixed, heading present.
- `cuenta-objetivo-form` x3: initial value from store, slider updates local state, save calls setter + shows chip.
- `cuenta-display-form` x4: all controls render, theme `aria-pressed`, theme toggle calls `setTheme`, contrast toggle calls `setShowContrast`.
- `cuenta-sesion-form` x5: controls render, length `aria-pressed`, save calls both setters + shows chip, length toggle updates before save, fatigue toggle updates before save.
- `variant-toggle` x4 (A.6): both buttons render, `aria-pressed`, click calls setter, compare checkbox toggles.
- `voice-picker` x2 (A.6): current voice value, change calls setter with active variant.

## Commits (A.5)
1. `03d6e68` feat(settings): add sessionLength + fatigueCheck to store
2. `48cb921` feat(cuenta): CuentaNav (sub-view tab strip) + HubCard
3. `1f2f99b` feat(cuenta): hub + 4 sub-pages (preferencias/objetivo/display/sesion)
4. `fdf5fd8` test(cuenta): 6 component/form test files (21 tests)

## Commits (A.6 follow-up)
5. `92b2bf0` (TBD) feat(cuenta): redesign VariantToggle + VoicePicker to Manual Lusitano chrome
6. `f390b18` feat(cuenta): NavBar link + 308 redirect /settings → /cuenta

## Concerns

1. **`useSettings` is the source of truth for /cuenta, not Dexie.** The original plan wrote to `db.settings` with keys not in the `SettingsKey` union (`sessionLength`, `fatigueCheck`) — those wouldn't have compiled. Using the Zustand store keeps consistency with /settings and persists via localStorage. If a future iteration wants server-side per-user preferences, the data will need to migrate from localStorage to a user-scoped Dexie/Postgres table.

2. **`/settings` still has FSRS + local-practice-filter sections** that A.5 didn't cover. These are now unreachable from the navbar but the page still renders for direct hits (the redirect in `next.config.ts` means those direct hits now go to `/cuenta` instead). **Action needed before removing `/settings` entirely:** either port `FsrsSection` + `localPracticeFilter` to `/cuenta/sesion` or `/cuenta/display`, OR keep `/settings` accessible but unlinked.

3. **VariantToggle and VoicePicker chrome migration is component-level.** Both used to have shadcn classes (`border-border`, `bg-primary`, `text-foreground`, `text-muted`, `bg-background`). A.6 replaced those with Manual Lusitano tokens. Anyone styling these for a specific page (none today) would now need to override `border-rule-strong` etc., not the shadcn aliases.

4. **`HubCard` is the only place using lucide-react's `ArrowRight`** in `/cuenta`. Other pages use unicode arrows. Consistent use of lucide would be a separate cleanup.

5. **Logout button is still destructive without confirmation.** Clicking "Cerrar sesión" in `/cuenta/sesion` immediately POSTs to `/api/auth/logout` and navigates to `/login`. The Button has variant="destructive" (red) but no confirmation dialog. The legacy `/settings` had the same behavior. If a confirmation dialog is wanted, it's a follow-up.

6. **No tests assert the 308 redirect works end-to-end.** The redirect is configured in `next.config.ts` and smoke-tested manually. A future e2e Playwright test (WS-E.1 territory) could verify `GET /pt/settings → 308 → /pt/cuenta`.

7. **Theme "system" option was omitted.** Original plan had `light | dark | system` but `ThemeProvider` only supports `light | dark`. A `matchMedia` listener would be needed for `system`. Dropped for now; can be added when WS-D asks for it.

8. **No link from /cuenta sub-views back to the home or progress.** The CuentaNav has Hub + 4 sub-views but not the rest of the app. The global NavBar at the top of the page covers that.

9. **The hub is "Cuenta" in Spanish but the rest of the chrome is in Spanish too.** All UI text is Spanish chrome regardless of `lang` (PT-BR vs PT-PT). This is consistent with the rest of the redesign but might confuse an English-only user. Out of scope for A.5.

10. **/settings route file is now dead code** (unreachable via redirect but still in the repo). WS-B.2 or a future cleanup should delete it once we're confident no one has bookmarks. Left in place for safety.