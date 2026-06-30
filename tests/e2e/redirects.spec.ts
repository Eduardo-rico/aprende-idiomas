import { test, expect } from "@playwright/test";

test("/pt/learn redirige a /pt/practicar/srs", async ({ page }) => {
  await page.goto("/pt/learn");
  expect(page.url()).toMatch(/\/pt\/practicar\/srs/);
});

test("/pt/review redirige a /pt/practicar/srs", async ({ page }) => {
  await page.goto("/pt/review");
  expect(page.url()).toMatch(/\/pt\/practicar\/srs/);
});

test("/pt/stats redirige a /pt/progreso", async ({ page }) => {
  await page.goto("/pt/stats");
  expect(page.url()).toMatch(/\/pt\/progreso/);
});

test("/pt/blocks redirige a /pt/libro", async ({ page }) => {
  await page.goto("/pt/blocks");
  expect(page.url()).toMatch(/\/pt\/libro/);
});

test("/pt/achievements redirige a /pt/progreso", async ({ page }) => {
  await page.goto("/pt/achievements");
  expect(page.url()).toMatch(/\/pt\/progreso/);
});
