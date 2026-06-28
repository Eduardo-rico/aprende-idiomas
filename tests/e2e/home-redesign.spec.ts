// tests/e2e/home-redesign.spec.ts
// A.1 — Portada Manual Lusitano. Verifies the redesigned home page
// matches the mockup's structure and primary CTA works.
//
// Why the heading matcher is loose: we render "Bom dia, Edu." in an
// h1 with display font, but other copy on the page may also mention
// "Bom dia" later (translations, etc.). We match by heading role +
// regex instead of full string equality to keep this resilient.
import { test, expect, request } from '@playwright/test';

const PASSWORD = process.env.AUTH_PASSWORD ?? 'charalito4';

test.describe('Home redesign (A.1)', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // The dev server gates everything behind /api/auth/login. Mirror
    // the lessons-flow spec pattern: authenticate via API, then push
    // the resulting cookies into the browser context.
    const ctx = await request.newContext({ baseURL });
    const loginRes = await ctx.post('/api/auth/login', {
      data: { password: PASSWORD },
    });
    expect(loginRes.status(), 'login should succeed').toBe(200);
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
  });

  test('portada muestra "Bom dia, Edu" + CTA Empezar sesión', async ({ page }) => {
    await page.goto('/pt');
    await expect(page.getByRole('heading', { name: /Bom dia/ })).toBeVisible();
    const cta = page.getByRole('link', { name: /Empezar sesión/i });
    await expect(cta).toBeVisible();
    await cta.click();
    // CTA targets /[lang]/learn (the SRS practice route in this app).
    await expect(page).toHaveURL(/\/pt\/learn/);
  });

  test('TOC muestra capítulos con mastery bar', async ({ page }) => {
    await page.goto('/pt');
    await expect(page.getByText('Tu libro de texto')).toBeVisible();
    // Block 1 is hand-authored and always present in PT curriculum.
    await expect(page.getByText('Fonética')).toBeVisible();
    // Mastery bar rendered as a child div with inline width style.
    const tocBar = page
      .getByText('Fonética')
      .locator('xpath=ancestor::a')
      .locator('div[style*="width"]')
      .first();
    await expect(tocBar).toBeVisible();
  });

  test('Eyebrow "Hoje" aparece sobre el h1', async ({ page }) => {
    await page.goto('/pt');
    await expect(page.getByText('Hoje', { exact: true })).toBeVisible();
  });
});