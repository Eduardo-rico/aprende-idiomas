// app/[lang]/practice/[lessonId]/page.tsx
// Server shell for the practice route. Its only server-side job is to
// pre-render the lesson's MDX (an async server component — see
// LessonRenderer's header note) and hand it to the client half as a
// `lessonSlot`. All the interactive logic (Dexie session, SRS queue,
// exercise runner, the LessonGate decision) lives in PracticeClient.
import { loadCurriculum, loadLessonsAudioRefs } from "@/lib/data/loaders";
import { LessonRenderer } from "@/components/lessons/LessonRenderer";
import { hasLocale, type LanguageId } from "@/lib/locales";
import { PracticeClient } from "./PracticeClient";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ lang: string; lessonId: string }>;
}) {
  const { lang: rawLang, lessonId } = await params;
  // The lang layout already validated the param; the fallback is defensive.
  const lang: LanguageId = hasLocale(rawLang) ? rawLang : "pt";

  // Pre-render the lesson MDX on the server (only PT has lesson content).
  // If the lesson or its MDX is missing, the slot is null and the gate
  // simply renders the "Continuar a ejercicios →" button.
  let lessonSlot: React.ReactNode = null;
  if (lang === "pt") {
    try {
      const curriculum = await loadCurriculum(lang);
      const lesson = curriculum.BLOCKS.flatMap((b) => b.lessons).find((l) => l.id === lessonId);
      if (lesson && /^b\d+\/l[\w-]+\.mdx$/.test(lesson.conceptNotesPath)) {
        const audioRefsMap = await loadLessonsAudioRefs(lang);
        const audioRefs = audioRefsMap[lesson.id]?.audioRefs ?? {};
        lessonSlot = (
          <LessonRenderer
            lessonId={lesson.id}
            mdxPath={lesson.conceptNotesPath}
            lang={lang}
            audioRefs={audioRefs}
          />
        );
      }
    } catch {
      // Missing/invalid lesson content → no slot; practice still runs.
      lessonSlot = null;
    }
  }

  return <PracticeClient lang={lang} lessonId={lessonId} lessonSlot={lessonSlot} />;
}
