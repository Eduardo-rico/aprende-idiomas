// app/page.tsx
// Root page — redirects to the default target language. The actual
// home lives at app/[lang]/page.tsx. The redirect is a server-side
// 307 so crawlers and refreshes land on /pt/.
import { redirect } from "next/navigation";
import { DEFAULT_LANGUAGE } from "@/lib/locales";

export default function RootPage(): never {
  redirect(`/${DEFAULT_LANGUAGE}`);
}
