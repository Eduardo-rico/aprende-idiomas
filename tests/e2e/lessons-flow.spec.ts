// tests/e2e/lessons-flow.spec.ts
// L5: end-to-end happy-path coverage of the lesson-before-exercises
// flow. Steps:
//
//   1. Authenticate via POST /api/auth/login with the dev password.
//   2. Open /pt/blocks/1/lessons/b1-l1-alfabeto-acentos (the first
//      lesson in the PT curriculum — hand-authored in
//      `lib/data/languages/pt/curriculum.ts`).
//   3. Click "Ver lección →" — the new L5.1 sneak-peek panel.
//   4. Verify the standalone lesson page renders (the L5.3 fallback
//      message is expected: MDX content isn't generated yet).
//   5. Click "Continuar a ejercicios →".
//   6. Verify the URL is now /pt/practice/b1-l1-alfabeto-acentos.
//
// The LessonGate's "skip vs show-lesson" branch is NOT exercised here —
// it's a unit-tested branch in tests/unit/lesson-gate.test.ts (future).
// L5 just confirms the wiring of the page-to-page navigation works.
//
// If Playwright browsers are not installed in the environment, the
// test runner will skip this file (see `npx playwright test --grep`
// invocation in the L5 gate). The dev server auto-starts via
// playwright.config.ts.
import { test, expect, request } from '@playwright/test';

const PASSWORD = process.env.AUTH_PASSWORD ?? 'charalito4';
const LESSON_ID = 'b1-l1-alfabeto-acentos';
const LANG = 'pt';

test.describe('Lessons flow', () => {
  test('sneak-peek panel navigates to standalone lesson page, then to practice', async ({
    page,
    baseURL,
  }) => {
    // 1. Authenticate via the API endpoint (faster than typing into the
    //    /login form and matches the spec for the auth cookie). We use
    //    Playwright's `request` fixture so the Set-Cookie response
    //    header lands in the shared cookie jar.
    const ctx = await request.newContext({ baseURL });
    const loginRes = await ctx.post('/api/auth/login', {
      data: { password: PASSWORD },
    });
    expect(loginRes.status(), 'login should succeed').toBe(200);
    // Plumb the cookies from the API request context into the page's
    // browser context so the proxy doesn't redirect us to /login.
    const cookies = await ctx.storageState();
    await page.context().addCookies(
      cookies.cookies.map((c) => ({
        name: c.name,
        value: c.value,
        domain: c.domain,
        path: c.path,
        expires: c.expires,
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite,
      })),
    );
    await ctx.dispose();

    // 2. Open the lesson intro page (the panel lives here).
    await page.goto(`/${LANG}/blocks/1/lessons/${LESSON_ID}`);

    // 3. Click the L5.1 sneak-peek "Ver lección →" link.
    const link = page.getByRole('link', { name: /Ver lección/i });
    await expect(link).toBeVisible();
    await link.click();

    // 4. Verify the standalone lesson page renders. We don't assert on
    //    specific MDX content because no lesson MDX is generated yet —
    //    the friendly fallback ("Lesson MDX not yet generated for ...")
    //    is the expected UI.
    await expect(page).toHaveURL(
      new RegExp(`/${LANG}/lessons/${LESSON_ID}`),
    );
    // Either the MDX content is there OR the fallback is there.
    const fallback = page.getByText(/MDX not yet generated/i);
    const exampleOrRule = page.locator('[class*="rounded-lg"]').first();
    await expect(fallback.or(exampleOrRule)).toBeVisible();

    // 5. Click "Continuar a ejercicios →" — the L5.3 link at the bottom.
    const continueLink = page.getByRole('link', { name: /Continuar a ejercicios/i });
    await expect(continueLink).toBeVisible();
    await continueLink.click();

    // 6. Verify the practice URL.
    await expect(page).toHaveURL(
      new RegExp(`/${LANG}/practice/${LESSON_ID}`),
    );
  });
});