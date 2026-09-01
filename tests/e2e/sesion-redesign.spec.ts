// tests/e2e/sesion-redesign.spec.ts
// A.3 — Sesión Manual Lusitano. Verifies the redesigned session page
// at /[lang]/practicar/srs matches the mockup's structure and the home
// CTA routes correctly.
import { test, expect } from '@playwright/test';
import { entrar, sembrar } from './helpers/sesion';

test.describe('Sesión redesign (A.3)', () => {
  // SEMBRAR, y no sólo entrar. Estos cuatro tests llevaban tiempo en rojo
  // porque una sesión recién abierta no tiene tarjetas vencidas: la página
  // pinta «Hoy no tienes nada pendiente» y la portada ofrece el
  // diagnóstico en vez de «Empezar sesión», que decide por
  // `db.cards.count()`. No era el rediseño: era que nadie sembraba.
  test.beforeEach(async ({ page, baseURL }) => {
    const todos = await entrar(page, baseURL);
    await sembrar(page, todos.slice(0, 12));
  });

  test('home CTA "Empezar sesión" va a /[lang]/practicar/srs', async ({ page }) => {
    await page.goto('/pt');
    const cta = page.getByRole('link', { name: /Empezar sesión/i });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/pt\/practicar\/srs/);
  });

  test('sesión muestra topbar + grade panel', async ({ page }) => {
    await page.goto('/pt/practicar/srs');
    await expect(page.getByTestId('session-topbar')).toBeVisible();
    await expect(page.getByTestId('session-count')).toBeVisible();
    await expect(page.getByTestId('session-timer')).toBeVisible();
    await expect(page.getByTestId('session-card')).toBeVisible();
    await expect(page.getByTestId('grade-panel')).toBeVisible();
  });

  test('"Mostrar respuesta" habilita los grade buttons', async ({ page }) => {
    await page.goto('/pt/practicar/srs');
    await page.getByTestId('reveal-button').click();
    await expect(page.getByTestId('reveal-block')).toBeVisible();
    const good = page.getByRole('button', { name: /Bien/ });
    await expect(good).toBeEnabled();
  });

  test('atajo [3] califica como Bien y avanza', async ({ page }) => {
    await page.goto('/pt/practicar/srs');
    await page.getByTestId('reveal-button').click();
    const before = await page.getByTestId('session-count').textContent();
    await page.keyboard.press('3');
    // The count updates OR the page transitions to completion. Either is
    // acceptable proof the keystroke was caught.
    const after = await page.getByTestId('session-count').textContent().catch(() => null);
    expect(after === null || after !== before).toBeTruthy();
  });
});
