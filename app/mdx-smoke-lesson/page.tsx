// app/mdx-smoke-lesson/page.tsx
// Temporary smoke route for the L3 sub-phase. Renders the b1/l-test
// MDX file through the real LessonRenderer to confirm the dynamic
// import + custom components + fallback work end-to-end. Removed in
// L4 sub-phase (Task 4.7 of the plan).
import { LessonRenderer } from "@/components/lessons/LessonRenderer";

export default async function MdxSmokeLessonPage() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <LessonRenderer
        lessonId="b1-test"
        mdxPath="b1/l-test.mdx"
        lang="pt"
      />
    </div>
  );
}
