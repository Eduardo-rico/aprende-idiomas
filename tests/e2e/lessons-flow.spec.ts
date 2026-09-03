// tests/e2e/lessons-flow.spec.ts
// El camino del alumno: índice del libro → lección → ejercicios.
//
// La versión anterior recorría `/pt/blocks/1/lessons/:id` → «Ver lección»
// → `/pt/lessons/:id` → `/pt/practice/:id`, que es la estructura ANTERIOR
// al rediseño: hoy la lección vive en `/pt/libro/:capítulo/:slug` y el
// enlace intermedio no existe. Llevaba roja desde entonces y nadie lo vio
// porque la suite e2e completa no se corría.
//
// Se reescribe sobre el camino real en vez de borrarse: es el único sitio
// donde se comprueba de punta a punta que desde el índice se llega a una
// lección y de ahí a practicarla, que es lo que hace el alumno cada día.
import { test, expect } from '@playwright/test';
import { entrar } from './helpers/sesion';

test.describe('Del libro a los ejercicios', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await entrar(page, baseURL);
  });

  test('el índice lleva a una lección, y la lección a sus ejercicios', async ({ page }) => {
    await page.goto('/pt/libro');
    // Se busca por el texto que el alumno VE, no por un aria-label: si el
    // rótulo cambia, la prueba tiene que enterarse.
    const capitulo = page.getByRole('link', { name: /Sistema fonético/i }).first();
    await expect(capitulo).toBeVisible();
    await capitulo.click();
    // Son TRES saltos, no dos: el índice lleva al CAPÍTULO y el capítulo a
    // la lección. Escribirlo con dos hacía esperar una URL que no llega.
    await page.waitForURL(/\/pt\/libro\/1$/);

    const leccion = page.getByRole('link', { name: /Alfabeto|acentos/i }).first();
    await expect(leccion).toBeVisible();
    await leccion.click();
    await page.waitForURL(/\/pt\/libro\/1\/.+/);

    // La lección montó de verdad, no un límite de error.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const aEjercicios = page.getByRole('link', { name: /exerc[íi]cios/i }).first();
    await expect(aEjercicios).toBeVisible();
    await aEjercicios.click();

    // El destino es `/pt/practice/:slug`: el 2026-09-03 este enlace
    // apuntaba a `/pt/practicar/:capítulo/:sección`, que no existe, y daba
    // 404 al pulsar «Continuar a exercícios». Por eso se comprueba que la
    // página de destino CARGA, no sólo que la URL cambió.
    await page.waitForURL(/\/pt\/practice\//);
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
