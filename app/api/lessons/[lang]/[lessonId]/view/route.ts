// app/api/lessons/[lang]/[lessonId]/view/route.ts
// POST /api/lessons/:lang/:lessonId/view
//
// STUB — records lesson views on the server is NOT a thing in this
// app: views are stored in IndexedDB (`db.lessonViews`, schema v7),
// which is browser-only. A server-side endpoint has no Dexie to write
// to, no DB schema to migrate to, and no analytics pipeline to feed
// yet.
//
// We still expose the route (returning 501) so the URL contract from
// the original plan/spec is reserved: if we ever add server-side
// analytics, we just swap the body for a real `recordLessonView`
// call (e.g. POST to a Neon HTTP endpoint via the Data API, or a
// tiny events table). For now the client-side `recordLessonView`
// repository helper handles the write directly.
//
// Returning 501 ("Not Implemented") rather than 404 makes the intent
// explicit: the route exists, the method is known, the server just
// refuses to do the work because the design says so.
//
// Códigos:
//   501 — siempre (stub). El body explica por qué.
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ lang: string; lessonId: string }> }
) {
  // Touch the params so the route shape stays explicit (and so
  // future server-side analytics code can validate lang/lessonId
  // without re-reading the doc).
  await params;
  return NextResponse.json(
    {
      error: "Recording lesson views is a client-side operation; this route exists for future server-side analytics.",
    },
    { status: 501 },
  );
}