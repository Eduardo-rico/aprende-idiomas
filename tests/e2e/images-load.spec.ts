// tests/e2e/images-load.spec.ts
// E.4 — Validates that no images on the home page are broken
// (naturalWidth === 0 means the browser couldn't load the image).
// This catches img-src CSP violations and missing assets that jsdom
// unit tests would silently ignore.
import { test, expect, request } from "@playwright/test";

const PASSWORD = process.env.AUTH_PASSWORD ?? "charalito4";

test.describe("Images load check (E.4)", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    const ctx = await request.newContext({ baseURL });
    const loginRes = await ctx.post("/api/auth/login", {
      data: { password: PASSWORD },
    });
    expect(loginRes.status(), "login should succeed").toBe(200);
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

  test("ninguna imagen rota en portada", async ({ page }) => {
    await page.goto("/pt");
    // Wait for the page to fully render before inspecting images
    await page.waitForLoadState("networkidle");
    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src),
    );
    expect(broken, `Imágenes rotas: ${broken.join(", ")}`).toEqual([]);
  });

  test("ninguna imagen rota en /pt/libro", async ({ page }) => {
    await page.goto("/pt/libro");
    await page.waitForLoadState("networkidle");
    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.src),
    );
    expect(broken, `Imágenes rotas en /pt/libro: ${broken.join(", ")}`).toEqual([]);
  });
});
