// app/login/page.tsx
// Single-password login form. On submit POSTs to /api/auth/login with
// the password; on success the server sets a signed httpOnly cookie and
// we redirect to the original `?next=…` URL. If `next` is missing or
// points to "/", we redirect to the default target language ("/pt/").
"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LANGUAGE, hasLocale } from "@/lib/locales";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  // Phase 3 (multi-idioma): if no `next` is given, send the user to the
  // default target language's home (`/pt`). If `next` is given, the proxy
  // preserved the requested path; for legacy bookmarks that lack a lang
  // prefix (e.g. `/learn`), re-prefix with the default lang. Path that
  // already starts with `/<known-lang>/` is honored verbatim.
  const rawNext = search.get("next");
  const next = (() => {
    if (!rawNext) return `/${DEFAULT_LANGUAGE}`;
    if (!rawNext.startsWith("/")) return `/${DEFAULT_LANGUAGE}`;
    // Strip leading slash, then peek the first segment.
    const firstSegment = rawNext.slice(1).split("/")[0] ?? "";
    if (hasLocale(firstSegment)) return rawNext;
    // No lang prefix — re-prefix with the default.
    return `/${DEFAULT_LANGUAGE}${rawNext === "/" ? "" : rawNext}`;
  })();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If the user is already authenticated (cookie valid), the proxy would
  // have redirected them — but a stale tab after logout could land here.
  // We don't ping the server; the proxy will redirect on the next nav.
  useEffect(() => {
    // No-op; this hook is here to make the component a Client Component
    // and to keep the `next` value in scope across renders.
  }, [next]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // Hard navigation so the proxy re-runs and the cookie is read
        // on the way to the destination. router.push() doesn't always
        // re-run the proxy in dev.
        window.location.href = next;
        return;
      }
      if (res.status === 401) {
        setError("Contraseña incorrecta");
      } else {
        setError(`Error ${res.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-4xl">Aprende Portugués</h1>
        <p className="text-muted text-sm">Ingresa la contraseña para continuar</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="Contraseña"
          className="w-full px-4 py-3 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || password.length === 0}
          className="w-full p-3 bg-primary text-fg rounded-md font-medium disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

// Next 16 requires useSearchParams() to be wrapped in <Suspense> for
// the page to remain prerenderable as static. The fallback matches the
// initial loading state of the form.
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted">Cargando…</div>}>
      <LoginForm />
    </Suspense>
  );
}
