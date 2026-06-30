import { permanentRedirect } from "next/navigation";
export default async function Page({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  permanentRedirect(`/${lang}/libro/${id}`);
}
