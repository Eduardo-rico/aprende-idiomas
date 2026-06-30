import { permanentRedirect, notFound } from "next/navigation";
import { hasLocale } from "@/lib/locales";
import { loadCurriculum } from "@/lib/data/loaders";

export default async function Page({ params }: { params: Promise<{ lang: string; lessonId: string }> }) {
  const { lang: rawLang, lessonId } = await params;
  if (!hasLocale(rawLang)) notFound();
  const lang = rawLang;

  const curriculum = await loadCurriculum(lang);
  const lesson = curriculum.BLOCKS.flatMap((b) => b.lessons).find((l) => l.id === lessonId);
  if (!lesson) notFound();

  const sectionSlug = lesson.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  permanentRedirect(`/${lang}/libro/${lesson.blockId}/${sectionSlug}`);
}
