// tests/e2e/movil.spec.ts — que la app se pueda USAR en un teléfono.
//
// Existe porque el 2026-09-03 se midió a mano que, en 375 px, la barra de
// navegación era una sola fila sin envolver de 751 px sin desplazamiento:
// CUATRO de los seis enlaces —Histórias, Ler, Progresso, Cuenta— quedaban
// fuera de la pantalla y no había forma de llegar a ellos. Media
// aplicación inaccesible en el único aparato donde se usa a diario, y
// ninguna prueba lo miraba: toda la suite corría en escritorio.
//
// La comprobación es de CONDUCTA, no de CSS: se desplaza la fila hasta el
// final y se exige que el último enlace quede dentro de la pantalla. Un
// test que mirase `overflow-x` aprobaría un `auto` que no desplaza nada.
import { test, expect, devices } from '@playwright/test';
import { entrar } from './helpers/sesion';

// Se usa el preajuste del dispositivo QUITÁNDOLE sólo el navegador: trae
// `defaultBrowserType: 'webkit'` y aquí sólo hay chromium instalado.
//
// Y hay que usarlo ENTERO, no reconstruirlo a mano. Fijar `viewport` +
// `isMobile` por separado daba un `innerWidth` de 751 px —o sea, un
// teléfono más ancho que el contenido—, con lo que la comprobación de
// alcance aprobaba una barra que en un móvil de verdad escondía cuatro
// enlaces. Un test mal emulado no mide un teléfono: mide un escritorio
// estrecho, y aprueba justo lo que existe para cazar. (2026-09-03.)
const { defaultBrowserType: _ignorado, ...IPHONE } = devices['iPhone SE']; // 320×568
test.use(IPHONE);

const RUTAS = ['/pt', '/pt/blocks', '/pt/leer', '/ro'];
const TOQUE_MINIMO = 44; // recomendación de Apple y de WCAG 2.5.8 (AA es 24)

for (const ruta of RUTAS) {
  test(`${ruta} se puede usar en un teléfono de 320 px`, async ({ page, baseURL }) => {
    await entrar(page, baseURL);
    await page.goto(ruta);
    await page.waitForSelector('nav');

    // 0 · Que la emulación sea real. Se mira `screen.width`, que la página
    //     NO puede alterar; usar `innerWidth` aquí confundía un defecto de
    //     la app con un fallo del arnés, porque una página que desborda
    //     hace que el navegador ENSANCHE el viewport (justo lo que
    //     comprueba el punto 1). Un mismo número contestando dos preguntas.
    const pantalla = await page.evaluate(() => window.screen.width);
    expect(pantalla, 'el arnés no está emulando un teléfono').toBeLessThanOrEqual(400);

    // 1 · La página no obliga al navegador a ensanchar el viewport ni se
    //     desplaza en horizontal: en un teléfono eso es «todo diminuto».
    const ancho = await page.evaluate(() => ({
      inner: window.innerWidth,
      contenido: document.documentElement.scrollWidth,
    }));
    expect(ancho.inner, `${ruta}: el contenido ensancha el viewport a ${ancho.inner}px sobre una pantalla de ${pantalla}px`).toBeLessThanOrEqual(pantalla + 1);
    expect(ancho.contenido, `${ruta} desborda a lo ancho`).toBeLessThanOrEqual(ancho.inner + 1);

    // 2 · TODOS los enlaces del nav son alcanzables. Se desplaza la fila
    //     hasta el tope y se comprueba el último, que es el que se perdía.
    const alcanzables = await page.evaluate(() => {
      const ul = document.querySelector('nav ul');
      if (!ul) return { ok: false, motivo: 'no hay lista de enlaces en el nav' };
      ul.scrollLeft = ul.scrollWidth; // llevar la fila a su final
      const enlaces = [...ul.querySelectorAll('a')];
      const fuera = enlaces
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.right > window.innerWidth + 1 || r.left < -1;
        })
        .map((e) => (e.textContent ?? '').trim());
      // Sólo el ÚLTIMO tiene que verse tras desplazar al final; los
      // primeros pueden haberse ido por la izquierda, que es correcto.
      const ultimo = enlaces.at(-1)!.getBoundingClientRect();
      return {
        ok: ultimo.right <= window.innerWidth + 1,
        motivo: `tras desplazar al final quedan fuera: ${fuera.join(', ') || 'ninguno'}`,
        total: enlaces.length,
      };
    });
    expect(alcanzables.total, 'el nav debería tener enlaces').toBeGreaterThan(1);
    expect(alcanzables.ok, `${ruta}: ${alcanzables.motivo}`).toBe(true);

    // 3 · Las zonas táctiles del nav se pueden tocar con el dedo.
    const chicos = await page.evaluate((min) => {
      return [...document.querySelectorAll('nav ul a')]
        .map((e) => ({ t: (e.textContent ?? '').trim(), h: Math.round(e.getBoundingClientRect().height) }))
        .filter((x) => x.h < min);
    }, TOQUE_MINIMO);
    expect(chicos, `zonas táctiles por debajo de ${TOQUE_MINIMO}px: ${JSON.stringify(chicos)}`).toEqual([]);
  });
}
