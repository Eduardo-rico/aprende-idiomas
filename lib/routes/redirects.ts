// lib/routes/redirects.ts
import { permanentRedirect } from "next/navigation";

export const REDIRECTS: Record<string, string> = {
  "/blocks": "/libro",
  "/learn": "/practicar/srs",
  "/review": "/practicar/srs",
  "/practice": "/practicar",
  "/stats": "/progreso",
  "/achievements": "/progreso",
  "/settings": "/cuenta/preferencias",
};

export function redirectLang(dest: string, lang: string): never {
  permanentRedirect(`/${lang}${dest}`);
}
