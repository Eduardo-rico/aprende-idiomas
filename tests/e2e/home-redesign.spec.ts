// tests/e2e/home-redesign.spec.ts
// A.1 — Portada Manual Lusitano. Verifies the redesigned home page
// matches the mockup's structure and primary CTA works.
//
// Why the heading matcher is loose: we render "Bom dia, Edu." in an
// h1 with display font, but other copy on the page may also mention
// "Bom dia" later (translations, etc.). We match by heading role +
// regex instead of full string equality to keep this resilient.
import { test, expect } from '@playwright/test';
import { entrar, sembrar } from './helpers/sesion';

test.describe('Home redesign (A.1)', () => {
  // Antes tenía aquí su propia copia del login —igual que lectura,
  // lesson-redesign y lessons-flow, cuatro copias de la misma regla— y
  // NO sembraba. Sin tarjetas vencidas la portada decide por
  // `db.cards.count()` y ofrece «Haz el diagnóstico» en vez de «Empezar
  // sesión», así que la prueba buscaba un botón que la app tenía razón en
  // no mostrar. El helper hace las dos cosas y es un solo sitio.
  test.beforeEach(async ({ page, baseURL }) => {
    const ejs = await entrar(page, baseURL);
    await sembrar(page, ejs.slice(0, 20));
  });

  test('portada muestra "Bom dia, Edu" + CTA Empezar sesión', async ({ page }) => {
    await page.goto('/pt');
    await expect(page.getByRole('heading', { name: /Bom dia/ })).toBeVisible();
    const cta = page.getByRole('link', { name: /Empezar sesión/i });
    await expect(cta).toBeVisible();
    await cta.click();
    // El CTA apuntaba a `/pt/learn`, que hoy es sólo un redirect: la ruta
    // real es `/pt/practicar/srs`. Aterrizar ahí es lo correcto, y la
    // aserción vieja suspendía a la app por hacerlo bien.
    await expect(page).toHaveURL(/\/pt\/practicar\/srs/);
  });

  test('TOC muestra capítulos con mastery bar', async ({ page }) => {
    await page.goto('/pt');
    await expect(page.getByText('Tu libro de texto')).toBeVisible();
    // El capítulo I se llama «Sistema fonético y ortográfico»; el texto
    // que buscaba esta prueba («Fonética») dejó de existir con el
    // rediseño, así que fallaba por el rótulo y no por el índice.
    await expect(page.getByText('Sistema fonético')).toBeVisible();
    // Mastery bar rendered as a child div with inline width style.
    const tocBar = page
      .getByText('Sistema fonético')
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