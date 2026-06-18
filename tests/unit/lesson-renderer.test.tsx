// tests/unit/lesson-renderer.test.tsx
// @vitest-environment jsdom
// Unit tests for the LessonRenderer server component. We mock
// `loadLessonMdx` so the renderer can be exercised in isolation
// (no MDX compilation, no dynamic import). The static MDX file
// `lib/data/languages/pt/mdx/b1/l-test.mdx` is also mocked so the
// `vi.mock` factory for `loadLessonMdx` can resolve it in the
// "happy path" test without doing a real dynamic import.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock the static MDX file referenced by `loadLessonMdx` in the
// happy-path test. Without this, the dynamic import inside the
// loader would attempt to compile a real .mdx file at test time
// (which the @next/mdx bundler usually only does in Next's
// dev/prod pipeline, not in vitest).
vi.mock("@/lib/data/languages/pt/mdx/b1/l-test.mdx", () => ({
  default: () => (
    <div>
      <h1>Test Lesson</h1>
      <p>Body paragraph.</p>
    </div>
  ),
}));

// Mock the loader. We export it as a vi.fn() so each test can
// control the return value via `mockResolvedValueOnce`.
const loadLessonMdxMock = vi.fn();
vi.mock("@/lib/data/mdx", () => ({
  loadLessonMdx: loadLessonMdxMock,
}));

const { LessonRenderer } = await import("@/components/lessons/LessonRenderer");

beforeEach(() => {
  loadLessonMdxMock.mockReset();
});

describe("LessonRenderer", () => {
  it("renders the imported MDX content", async () => {
    loadLessonMdxMock.mockResolvedValueOnce(
      (
        await import("@/lib/data/languages/pt/mdx/b1/l-test.mdx")
      ).default,
    );
    const jsx = await LessonRenderer({
      lessonId: "b1-test",
      mdxPath: "b1/l-test.mdx",
      lang: "pt",
    });
    render(<>{jsx}</>);
    expect(screen.getByText("Test Lesson")).toBeTruthy();
    expect(screen.getByText("Body paragraph.")).toBeTruthy();
  });

  it("shows a fallback when MDX is missing", async () => {
    loadLessonMdxMock.mockResolvedValueOnce(null);
    const jsx = await LessonRenderer({
      lessonId: "b1-missing",
      mdxPath: "b1/l-missing.mdx",
      lang: "pt",
    });
    render(<>{jsx}</>);
    expect(screen.getByText(/MDX not yet generated/i)).toBeTruthy();
    expect(screen.getByText(/b1\/l-missing\.mdx/)).toBeTruthy();
  });
});
