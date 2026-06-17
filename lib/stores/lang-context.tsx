// lib/stores/lang-context.tsx
// Server-safe context that carries the active `LanguageId` from the
// lang layout down to client components. Server components read the
// lang from `params: Promise<{ lang: LanguageId }>` directly; this
// provider exists for client-only components (cards, popovers, the
// navbar language dropdown) that need to know "which language am I
// currently studying?" without re-deriving from the URL.
//
// `app/[lang]/layout.tsx` is the only caller of `<LangProvider>`.
"use client";
import { createContext, useContext } from "react";
import type { LanguageId } from "@/lib/locales";

const LangCtx = createContext<LanguageId | null>(null);

export function LangProvider({ lang, children }: { lang: LanguageId; children: React.ReactNode }) {
  return <LangCtx.Provider value={lang}>{children}</LangCtx.Provider>;
}

/** Read the active language from the nearest `LangProvider`. Throws if
 *  called outside a lang layout — that's a programming error. */
export function useLang(): LanguageId {
  const v = useContext(LangCtx);
  if (v === null) {
    throw new Error("useLang() must be called inside <LangProvider> (i.e. under app/[lang]/)");
  }
  return v;
}
