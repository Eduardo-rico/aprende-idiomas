// tests/e2e/helpers/sesion.ts — entrar y SEMBRAR la cola del repaso.
//
// Existe porque los cuatro tests de `sesion-redesign.spec.ts` llevaban
// tiempo en rojo por una razón que no era el rediseño: **una sesión recién
// abierta no tiene ninguna tarjeta vencida**, así que la página pinta «Hoy
// no tienes nada pendiente» y no hay ni topbar ni tarjeta que mirar. Y la
// portada, por lo mismo, ofrece el diagnóstico en vez de «Empezar sesión»:
// decide por `db.cards.count()`.
//
// Un e2e de sesión que no siembra no prueba la sesión. Y si hubiera pasado
// en verde —porque otro test dejó tarjetas antes— sería peor: un verde que
// depende del orden.
import { expect, request, type Page } from '@playwright/test';

const PASSWORD = process.env.AUTH_PASSWORD ?? 'charalito4';

export type Ej = { id: string; type: string; blockId: number; lessonId: string; data: Record<string, unknown> };

/** Login por cookie + el currículo servido, que es de donde salen los
 *  ejercicios con los que sembrar. */
export async function entrar(page: Page, baseURL: string | undefined): Promise<Ej[]> {
  const ctx = await request.newContext({ baseURL });
  const res = await ctx.post('/api/auth/login', { data: { password: PASSWORD } });
  expect(res.status(), 'el login tiene que funcionar').toBe(200);
  const st = await ctx.storageState();
  await page.context().addCookies(st.cookies as never);
  const { exercises } = await (await ctx.get('/api/blocks?lang=pt')).json() as { exercises: Ej[] };
  await ctx.dispose();
  return exercises;
}

/** Una tarjeta VENCIDA por ejercicio, escrita directamente en el store
 *  `cards` de Dexie. `state: 2` la marca como repaso y no como nueva, que
 *  van con cupo diario aparte y podrían quedarse fuera de la cola. */
export async function sembrar(page: Page, ejs: Ej[]) {
  await page.goto('/pt');
  await page.waitForTimeout(1500); // que Dexie cree la base
  const n = await page.evaluate(async (lista: { id: string; blockId: number; lessonId: string }[]) => {
    const db: IDBDatabase = await new Promise((ok, ko) => {
      const r = indexedDB.open('PortuguesAppDB');
      r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error);
    });
    const ayer = new Date(Date.now() - 86_400_000);
    const tx = db.transaction('cards', 'readwrite');
    const store = tx.objectStore('cards');
    for (const e of lista) {
      store.put({
        id: e.id, blockId: e.blockId, lessonId: e.lessonId, contentHash: 'e2e',
        fsrs: { due: ayer, stability: 5, difficulty: 5, elapsed_days: 1, scheduled_days: 1,
                reps: 1, lapses: 0, state: 2, last_review: ayer, learning_steps: 0 },
        nextReviewAt: ayer, state: 2, reps: 1, lapses: 0,
        introducedAt: ayer, language: 'pt', tags: [],
      });
    }
    await new Promise((ok, ko) => { tx.oncomplete = () => ok(null); tx.onerror = () => ko(tx.error); });
    // La portada exige LAS DOS cosas —`!onboardingDone || cardCount === 0`
    // manda al diagnóstico—, así que sembrar tarjetas sola no basta para
    // que salga el CTA «Empezar sesión». Es la mitad que faltaba y por la
    // que ese test seguía rojo con la cola ya llena.
    const tx2 = db.transaction('settings', 'readwrite');
    tx2.objectStore('settings').put({ key: 'onboardingDone', value: true });
    await new Promise((ok, ko) => { tx2.oncomplete = () => ok(null); tx2.onerror = () => ko(tx2.error); });
    const cuenta: number = await new Promise((ok) => {
      const r = db.transaction('cards', 'readonly').objectStore('cards').count();
      r.onsuccess = () => ok(r.result);
    });
    db.close();
    return cuenta;
  }, ejs.map((e) => ({ id: e.id, blockId: e.blockId, lessonId: e.lessonId })));
  expect(n, 'la siembra tiene que dejar tarjetas en Dexie').toBeGreaterThanOrEqual(ejs.length);
}
