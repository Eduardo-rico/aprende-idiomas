// tests/e2e/sesion-respuesta.spec.ts
// EL SMOKE QUE FALTABA: ¿se VE la respuesta al revelarla, y no se ve antes?
//
// Existe porque `SessionCardDisplay` estuvo meses sin enseñar la respuesta
// de once de los trece tipos —1.640 de 2.131 ejercicios servibles, el
// 77 %— y **ningún test lo cazó**. Los de jsdom pasaban porque el
// componente renderizaba: lo que no renderizaba era el contenido, y para
// verlo hay que mirar. El proyecto ya tiene esta cicatriz escrita
// (`feedback-csp-jsdom-visual-gap`); ésta es la tercera vez que muerde.
//
// Se prueban LAS DOS DIRECCIONES, porque las tres fugas de E2#29 son de la
// segunda y ninguna habría salido midiendo sólo la primera:
//
//   1. Al revelar SE VE la respuesta —visible en el DOM, no sólo
//      presente— y las alternativas que la tarjeta también acepta.
//   2. Antes de revelar NO se ve. La peor de las tres fugas era que un
//      `listening` imprimía su TRANSCRIPCIÓN en el frente: **convertía un
//      ejercicio de oído en uno de lectura sin que nada fallara**.
//
// La cola se SIEMBRA en IndexedDB con una tarjeta por tipo, porque una
// sesión recién abierta no tiene nada vencido y el smoke, si no, no
// prueba nada: sale «Hoy no tienes nada pendiente» y pasa en verde. Ése
// es exactamente el falso verde que esta ola lleva persiguiendo.
import { test, expect } from '@playwright/test';
import { respuestaDe, frenteDe, alternativasDe } from '@/lib/exercises/respuesta';
import { entrar, sembrar, type Ej } from './helpers/sesion';

/** Un ejercicio por tipo, y para los tipos con regresión conocida se elige
 *  uno que la exhiba: el `listening` con transcripción larga, el
 *  `error_correction` cuya frase mala y buena difieren de verdad. */
function unoPorTipo(todos: Ej[]): Map<string, Ej> {
  const out = new Map<string, Ej>();
  for (const e of todos) {
    if (out.has(e.type)) continue;
    const r = respuestaDe(e as never);
    const f = frenteDe(e as never);
    if (!r.trim() || !f.trim()) continue;
    if (r.length > 120 || f.length > 400) continue;  // que quepa en la aserción
    if (f.includes(r)) continue;                      // fixture que filtra por su propio texto
    out.set(e.type, e);
  }
  return out;
}

test.describe('La sesión de repaso enseña la respuesta', () => {
  test('un ejercicio de cada tipo: se ve al revelar, no se ve antes', async ({ page, baseURL }) => {
    const todos = await entrar(page, baseURL);
    const porTipo = unoPorTipo(todos);
    expect(porTipo.size, 'el corpus tiene que dar al menos ocho tipos distintos').toBeGreaterThanOrEqual(8);

    const elegidos = [...porTipo.values()];
    await sembrar(page, elegidos);
    await page.goto('/pt/practicar/srs');
    await expect(page.getByTestId('session-card')).toBeVisible({ timeout: 15_000 });

    const esperados = new Map(elegidos.map((e) => [frenteDe(e as never).trim(), e]));
    const vistos: string[] = [];

    for (let i = 0; i < elegidos.length; i++) {
      await expect(page.getByTestId('session-card')).toBeVisible();
      const frente = (await page.getByTestId('card-front').innerText()).trim();
      const ej = esperados.get(frente);
      expect(ej, `la tarjeta ${i + 1} enseña un frente que no reconozco: «${frente.slice(0, 60)}»`).toBeTruthy();
      const esperada = respuestaDe(ej as never);

      // ── DIRECCIÓN 2: antes de revelar no se ve la respuesta ──────────
      const antes = await page.getByTestId('session-card').innerText();
      expect(antes, `${ej!.type} enseña su respuesta ANTES de revelar`).not.toContain(esperada);
      expect(await page.getByTestId('reveal-block').count()).toBe(0);

      // ── DIRECCIÓN 1: al revelar se ve, y VISIBLE, no sólo presente ───
      await page.getByTestId('reveal-button').click();
      const back = page.getByTestId('card-back');
      await expect(back, `${ej!.type} no pinta su respuesta al revelar`).toBeVisible();
      expect((await back.innerText()).trim(), `${ej!.type} pinta otra cosa`).toContain(esperada.split('\n')[0]);

      const alts = alternativasDe(ej as never);
      if (alts.length) {
        const chip = page.getByTestId('card-alternativas');
        await expect(chip, `${ej!.type} no enseña las alternativas que la tarjeta acepta`).toBeVisible();
        expect(await chip.innerText()).toContain(alts[0]);
      }

      vistos.push(ej!.type);
      await page.keyboard.press('3'); // Bien → siguiente
      await page.waitForTimeout(400);
      if (await page.getByTestId('session-card').count() === 0) break;
    }

    expect(new Set(vistos).size, `sólo se comprobaron ${vistos.length} tipos: ${vistos.join(', ')}`)
      .toBeGreaterThanOrEqual(8);
  });

  test('un listening no imprime su transcripción: si la imprime, se lee en vez de escucharse', async ({ page, baseURL }) => {
    const todos = await entrar(page, baseURL);
    const ej = todos.find((e) => e.type === 'listening' && String(e.data.audioText ?? '').length > 40);
    expect(ej, 'hace falta un listening con transcripción larga').toBeTruthy();

    await sembrar(page, [ej!]);
    await page.goto('/pt/practicar/srs');
    await expect(page.getByTestId('session-card')).toBeVisible({ timeout: 15_000 });

    const transcripcion = String(ej!.data.audioText);
    const visto = await page.getByTestId('session-card').innerText();
    expect(visto, 'la transcripción está en el frente: el ejercicio de oído se resuelve leyendo')
      .not.toContain(transcripcion.slice(0, 40));
    expect(visto).toContain(String(ej!.data.question));

    // Y detrás del revelado sí: ahí ya es material de estudio.
    await page.getByTestId('reveal-button').click();
    await expect(page.getByTestId('card-back')).toBeVisible();
    await expect(page.getByTestId('card-back')).toContainText(String(ej!.data.answer));
  });

  test('una corrección enseña la frase MALA delante y la buena sólo al revelar', async ({ page, baseURL }) => {
    const todos = await entrar(page, baseURL);
    const ej = todos.find((e) => e.type === 'error_correction'
      && String(e.data.sentence ?? '') && String(e.data.correct ?? '')
      && !String(e.data.sentence).includes(String(e.data.correct)));
    expect(ej, 'hace falta una corrección cuya frase mala no contenga la buena').toBeTruthy();

    await sembrar(page, [ej!]);
    await page.goto('/pt/practicar/srs');
    await expect(page.getByTestId('session-card')).toBeVisible({ timeout: 15_000 });

    const antes = await page.getByTestId('session-card').innerText();
    expect(antes).toContain(String(ej!.data.sentence));
    expect(antes, 'la frase corregida estaba a la vista: no hay nada que corregir')
      .not.toContain(String(ej!.data.correct));

    await page.getByTestId('reveal-button').click();
    await expect(page.getByTestId('card-back')).toContainText(String(ej!.data.correct));
  });
});
