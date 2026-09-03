// Estas cinco comprobaciones llevaban rojas desde el 2026-06-16, y por DOS
// razones apiladas. Nadie lo vio porque la suite e2e completa no se corría:
// la foto de cierre del portugués decía «e2e 7/7», que era un subconjunto.
//
//  1. No iniciaban sesión, así que toda ruta respondía 307 al /login y la
//     redirección real no se ejercitaba nunca.
//  2. Y con la sesión puesta seguían fallando, por una CARRERA del test y
//     no un fallo de la app: `redirectLang` usa `permanentRedirect` dentro
//     de un componente de servidor, así que la navegación la completa el
//     cliente DESPUÉS del `load`. `page.goto()` vuelve antes, y leer
//     `page.url()` en ese momento devuelve la ruta vieja. Comprobado a
//     mano: `/pt/blocks` acaba en `/pt/libro` y sirve el libro entero.
//     Se espera a la URL destino en vez de leerla al vuelo.
import { test, expect } from "@playwright/test";
import { entrar } from "./helpers/sesion";

test.beforeEach(async ({ page, baseURL }) => {
  await entrar(page, baseURL);
});

test("/pt/learn redirige a /pt/practicar/srs", async ({ page }) => {
  await page.goto("/pt/learn");
  await page.waitForURL(/\/pt\/practicar\/srs/);
  expect(page.url()).toMatch(/\/pt\/practicar\/srs/);
});

test("/pt/review redirige a /pt/practicar/srs", async ({ page }) => {
  await page.goto("/pt/review");
  await page.waitForURL(/\/pt\/practicar\/srs/);
  expect(page.url()).toMatch(/\/pt\/practicar\/srs/);
});

test("/pt/stats redirige a /pt/progreso", async ({ page }) => {
  await page.goto("/pt/stats");
  await page.waitForURL(/\/pt\/progreso/);
  expect(page.url()).toMatch(/\/pt\/progreso/);
});

test("/pt/blocks redirige a /pt/libro", async ({ page }) => {
  await page.goto("/pt/blocks");
  await page.waitForURL(/\/pt\/libro/);
  expect(page.url()).toMatch(/\/pt\/libro/);
});

test("/pt/achievements redirige a /pt/progreso", async ({ page }) => {
  await page.goto("/pt/achievements");
  await page.waitForURL(/\/pt\/progreso/);
  expect(page.url()).toMatch(/\/pt\/progreso/);
});
