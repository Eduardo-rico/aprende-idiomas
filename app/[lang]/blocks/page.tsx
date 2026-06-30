import { redirectLang } from "@/lib/routes/redirects";
export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  redirectLang("/libro", lang);
}
