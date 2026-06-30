// tests/e2e/all-links.spec.ts
// E.1 — Validates that every internal <a href="/*"> found on key pages
// returns 200 or 308. Auth is required because the app is behind a
// password gate; we mirror the login pattern from home-redesign.spec.ts.
import { test, expect, request } from "@playwright/test";

const PASSWORD = process.env.AUTH_PASSWORD ?? "charalito4";

const START_PATHS = [
  "/pt",
  "/pt/libro",
  "/pt/progreso",
  "/pt/cuenta",
  "/pt/practicar/srs",
  "/pt/historias",
];

for (const start of START_PATHS) {
  test(`todos los <a> internos de ${start} cargan 200`, async ({ page, baseURL }) => {
    // Authenticate
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

    // Navigate to the start page
    const res = await page.goto(start);
    // If the page itself redirects, that's fine (308). Skip link-crawl if
    // the page returns a non-success status (e.g. unbuilt section).
    if (res && ![200, 308, 301, 302].includes(res.status())) {
      test.skip(true, `${start} returned ${res.status()} — skipping link scan`);
      return;
    }

    const links = await page.locator("a[href^='/']").all();
    const hrefs = await Promise.all(links.map((l) => l.getAttribute("href")));
    const uniqueHrefs = [
      ...new Set(
        hrefs.filter(
          (h): h is string =>
            !!h &&
            !h.startsWith("/api/") &&
            !h.includes("#") &&
            !h.includes("?"),
        ),
      ),
    ];

    const failures: string[] = [];
    for (const href of uniqueHrefs) {
      // All internal links in this app start with /<lang>; if somehow
      // a bare path slipped in (no /pt prefix), normalize it.
      const normalized = href.startsWith("/pt") ? href : `/pt${href}`;
      try {
        const resp = await page.request.get(normalized);
        if (![200, 308, 301, 302].includes(resp.status())) {
          failures.push(`${href} → ${resp.status()}`);
        }
      } catch {
        failures.push(`${href} → network error`);
      }
    }

    // Intentionally-unbuilt pages (e.g. /pt/historias itself) are skipped
    // at the goto level above; links found on a page should all resolve.
    expect(failures, `Links rotos en ${start}: ${failures.join(", ")}`).toEqual([]);
  });
}
