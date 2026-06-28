// tests/e2e/lesson-redesign.spec.ts
// A.2 — Lección page Manual Lusitano. Verifies the redesigned lesson
// page (mockup leccion.html) renders with the editorial markers:
// drop cap, margin notes aside, and the CTA into practice.
//
// Page is auth-gated (the dev server issues a `pt-auth` cookie via
// POST /api/auth/login), so we mirror the home-redesign spec's
// pattern: authenticate via the API, push the cookie into the
// browser context, then navigate.
//
// The lesson URL uses the (block, slug) convention — chapter=3,
// section=l1-presente-regular — which is the actual lesson ID in
// the PT curriculum. Earlier iterations of this spec used
// `pret-perf-composto` (the slug the original brief invented);
// the canonical lesson ID is the contract loadLesson() resolves.
import { test, expect, request } from '@playwright/test';

const PASSWORD = process.env.AUTH_PASSWORD ?? 'charalito4';

test.describe('Lesson redesign (A.2)', () => {
  test.beforeEach(async ({ page, baseURL }) => {
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

  test('lección muestra drop cap + margin notes + CTA exercícios', async ({ page }) => {
    await page.goto('/pt/libro/3/l1-presente-regular');
    // The h1 is the lesson title; matched loosely because Turbopack
    // injects intermediate RSC markers in dev.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/Continuar a exercícios/)).toBeVisible();
    // Drop cap is rendered on the first paragraph.
    await expect(page.locator('p.dropcap').first()).toBeVisible();
    // At least one margin note aside is rendered (the column has up
    // to 4 entries; this asserts the component is on the page at all).
    await expect(page.locator('aside').first()).toBeVisible();
    // The two audio chips are rendered for PT-BR and PT-PT.
    await expect(page.locator('[data-audio-variant="br"]')).toBeVisible();
    await expect(page.locator('[data-audio-variant="pt"]')).toBeVisible();
  });

  test('lección inválida devuelve 404', async ({ page }) => {
    const res = await page.goto('/pt/libro/999/no-existe');
    expect(res?.status()).toBe(404);
  });
});
