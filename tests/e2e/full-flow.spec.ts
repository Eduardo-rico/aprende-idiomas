// tests/e2e/full-flow.spec.ts
// E.5 — Happy-path smoke test: portada → sesión SRS → progreso.
// Designed to be resilient: steps that depend on having seeded cards
// (e.g. the actual card reveal) are marked test.fixme() so they don't
// fail the CI gate when the local DB is empty.
import { test, expect, request } from "@playwright/test";

const PASSWORD = process.env.AUTH_PASSWORD ?? "charalito4";

test.describe("Full flow (E.5): portada → sesión → progreso", () => {
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

  test("portada: heading Bom dia visible", async ({ page }) => {
    await page.goto("/pt");
    // The heading uses display font and says "Bom dia, <name>." — loose match.
    await expect(page.getByRole("heading", { name: /Bom dia/ })).toBeVisible();
  });

  test("portada: eyebrow Hoje visible", async ({ page }) => {
    await page.goto("/pt");
    await expect(page.getByText("Hoje", { exact: true })).toBeVisible();
  });

  test("navegar a /pt/practicar/srs — topbar visible", async ({ page }) => {
    await page.goto("/pt/practicar/srs");
    // The session topbar is always rendered (even in empty-state).
    await expect(page.getByTestId("session-topbar")).toBeVisible();
  });

  test("sesión SRS: grade-panel OR empty-state es visible", async ({ page }) => {
    // When no cards are due the session shows a completion / empty-state
    // screen. Both outcomes are acceptable for this smoke test.
    await page.goto("/pt/practicar/srs");
    const gradePanel = page.getByTestId("grade-panel");
    const sessionCard = page.getByTestId("session-card");

    // Wait for one of the two expected states (card or empty screen)
    const hasCard = await sessionCard.isVisible().catch(() => false);
    const hasGrade = await gradePanel.isVisible().catch(() => false);
    const hasFallback = await page
      .getByText(/sin tarjetas|no hay tarjetas|¡Todo al día|completaste|complete/i)
      .isVisible()
      .catch(() => false);

    expect(
      hasCard || hasGrade || hasFallback,
      "sesión debe mostrar una tarjeta o el estado 'sin tarjetas debidas'",
    ).toBeTruthy();
  });

  // This step requires at least one card to be due. Mark fixme in empty DB.
  // Remove the fixme once seeds are wired.
  test.fixme(
    "sesión SRS: revelar tarjeta y calificar como Bien",
    async ({ page }) => {
      // This test is fixme because it depends on having cards due in the
      // local Dexie DB. In CI or a fresh profile there are no cards.
      await page.goto("/pt/practicar/srs");
      await page.getByTestId("reveal-button").click();
      await page.getByRole("button", { name: /Bien/ }).click();
    },
  );

  test("navegar a /pt/progreso — shell o fallback visible", async ({ page }) => {
    await page.goto("/pt/progreso");
    // Either the full shell or the loading fallback must be present.
    const shell = page.getByTestId("progreso-shell");
    const loading = page.getByTestId("progreso-loading");
    const either = await shell.isVisible().catch(() => false) ||
      await loading.isVisible().catch(() => false);
    // Also accept the heatmap or any metric card as proof of render.
    const heatmap = await page.getByTestId("heatmap-90").isVisible().catch(() => false);
    const metric = await page.getByTestId("metric-retention").isVisible().catch(() => false);

    expect(
      either || heatmap || metric,
      "progreso debe mostrar shell, fallback, heatmap o alguna métrica",
    ).toBeTruthy();
  });
});
