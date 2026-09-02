// tests/e2e/chrome-por-lengua.spec.ts
// El chrome depende de `lang` como el contenido. Visto en pantalla el
// 2026-09-01: /ro/leer listaba 81 series rumanas bajo «Aprende
// Português», menú «Estudar · Livro · Histórias · Ler» y el selector en
// 🇵🇹. Sin cookie todo es 307 y no prueba nada, por eso el login.
import { existsSync } from "node:fs";
import path from "node:path";
import { test, expect, request, type Page } from "@playwright/test";

const PASSWORD = process.env.AUTH_PASSWORD ?? "charalito4";

async function chrome(page: Page) {
  const nav = page.locator("nav").first();
  return {
    title: await page.title(),
    wordmark: (await nav.locator("a").first().textContent())?.trim(),
    menu: await nav.locator("ul a").allTextContents(),
    selector: await nav.locator("select").evaluate((s: HTMLSelectElement) => ({
      value: s.value,
      label: s.selectedOptions[0]?.textContent?.trim(),
    })),
  };
}

test.describe("Chrome por lengua", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    const ctx = await request.newContext({ baseURL });
    const res = await ctx.post("/api/auth/login", { data: { password: PASSWORD } });
    expect(res.status(), "el login tiene que funcionar").toBe(200);
    const st = await ctx.storageState();
    await page.context().addCookies(st.cookies as never);
    await ctx.dispose();
  });

  test("/pt: chrome portugués", async ({ page }) => {
    await page.goto("/pt");
    await expect(page).toHaveURL(/\/pt$/);
    const c = await chrome(page);
    console.log("[/pt]", JSON.stringify(c));
    expect(c.title).toBe("Aprende Português");
    expect(c.wordmark).toBe("Aprende Português");
    expect(c.menu).toEqual(["Estudar", "Livro", "Histórias", "Ler", "Progresso", "Cuenta"]);
    expect(c.selector).toEqual({ value: "pt", label: "🇵🇹 Português" });
  });

  for (const ruta of ["/ro", "/ro/leer"]) {
    test(`${ruta}: chrome rumano`, async ({ page }) => {
      await page.goto(ruta);
      await expect(page).toHaveURL(new RegExp(`${ruta}$`));
      const c = await chrome(page);
      console.log(`[${ruta}]`, JSON.stringify(c));
      expect(c.title).toBe("Învață Română");
      expect(c.wordmark).toBe("Învață Română");
      expect(c.menu).toEqual(["Învață", "Carte", "Povești", "Citește", "Progres", "Cont"]);
      expect(c.selector).toEqual({ value: "ro", label: "🇷🇴 Română" });
      await expect(page.locator("body")).not.toContainText("Aprende Português");
    });
  }

  test("/ro/leer sigue sirviendo el contenido rumano bajo el chrome rumano", async ({ page }) => {
    // Las lecturas rumanas las escribe otra sesión; si este checkout no
    // las tiene, el test se declara SKIPPED (visible), no verde.
    test.skip(
      !existsSync(path.join(process.cwd(), "lib/data/languages/ro/lecturas")),
      "lib/data/languages/ro/lecturas no está en este checkout",
    );
    await page.goto("/ro/leer");
    const n = await page.locator("main a[href^='/ro/leer/']").count();
    console.log("[/ro/leer] enlaces a lecturas:", n);
    expect(n).toBeGreaterThan(0);
  });
});
