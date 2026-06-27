// app/layout.tsx
// Root layout (Next 16). Owns <html>, <body>, font classes, and the
// shared <head> metadata. The lang segment adds the LangProvider and
// the lang-aware <main> wrapper via `app/[lang]/layout.tsx` — a level
// below the root, not a replacement.
//
// Per the Next 16 i18n doc: "ensure all special files inside `app/`
// are nested under `app/[lang]`" and "The root layout can also be
// nested in the new folder (e.g. app/[lang]/layout.js)". The lang
// layout is OPTIONAL; without it, the root layout owns everything.
// For our app the root layout owns <html> + fonts (shared across every
// page, including /login and /api/auth/*, which intentionally don't
// get the chrome), and the lang layout adds the LangProvider + NavBar.
import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Aprende Português",
  description: "Português brasileiro + europeu para hispanohablantes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-full flex flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
