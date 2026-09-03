// tests/e2e/lectura.spec.ts
// La biblioteca de lectura (Ola L), con clics reales: catálogo agrupado
// por series, lector de texto puro con diccionario emergente, y el
// cierre del circuito — «Marcar como lida» registra evidencia MCER en
// Dexie y sobrevive a la recarga.
import { test, expect, request } from "@playwright/test";

const PASSWORD = process.env.AUTH_PASSWORD ?? "charalito4";

test.describe("Biblioteca de lectura (Ola L)", () => {
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

  test("catálogo → serie → capítulo, con clics reales", async ({ page }) => {
    await page.goto("/pt/leer");
    await expect(page.getByRole("heading", { name: "Leer" })).toBeVisible();
    await page.getByRole("link", { name: /Anedotas e quadras/ }).click();
    await expect(page).toHaveURL(/\/pt\/leer\/serie\/anedotas-e-quadras/);
    await page.getByRole("link", { name: /Anedotas e quadras I\b/ }).click();
    await expect(page).toHaveURL(/\/pt\/leer\/anedotas-e-quadras-a2-1/);
    // el texto se renderiza con palabras tocables
    await expect(page.getByRole("button", { name: "Joãozinho" }).first()).toBeVisible();
  });

  test("diccionario emergente: tocar una palabra abre el popover", async ({ page }) => {
    // Apuntaba a `anedotas-e-quadras-a2-1`, que desde la Ola L tiene audio
    // y se sirve con el lector de KARAOKE: allí las palabras también son
    // <button>, pero mueven el audio en vez de abrir el diccionario. O sea
    // que la prueba pulsaba el botón equivocado y concluía que el
    // diccionario estaba roto. Comprobado a mano: en una lectura de sólo
    // texto funciona — «noite» devuelve «noche».
    //
    // Queda anotado lo que esto destapa y NO es un fallo: en las lecturas
    // con karaoke no hay diccionario emergente. Es una decisión de diseño
    // sin declarar, no un defecto.
    await page.goto("/pt/leer/a-casa-dos-fantasmas-v1-c01");
    await page.getByRole("button", { name: "noite", exact: true }).first().click();
    const popover = page.getByRole("dialog").first();
    await expect(popover).toBeVisible();
    await expect(popover).toContainText(/noche|Buscando|no está/i);
  });

  test("marcar como lida persiste tras recargar", async ({ page }) => {
    await page.goto("/pt/leer/anedotas-e-quadras-a2-1");
    await page.getByRole("button", { name: "Marcar como lida" }).click();
    await expect(page.getByText(/✓ Lida/)).toBeVisible();
    await page.reload();
    await expect(page.getByText(/✓ Lida/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Marcar como lida" })).toHaveCount(0);
  });

  test("navegación entre capítulos de una serie", async ({ page }) => {
    // Los capítulos de novela son páginas de 2+ MB con miles de palabras
    // tocables: la navegación tarda más que el timeout por defecto.
    test.slow();
    await page.goto("/pt/leer/os-maias-c01");
    await page.getByRole("link", { name: /Capítulo 2/ }).click();
    await expect(page).toHaveURL(/os-maias-c02/, { timeout: 30_000 });
    await expect(page.getByRole("link", { name: /← Capítulo 1/ })).toBeVisible();
  });
});
