// tests/unit/lesson-renderer.test.tsx
// @vitest-environment jsdom
// Unit tests for the LessonRenderer. L4 changed the renderer from
// an async server component to a client component using React 19's
// `use()` hook (see components/lessons/LessonRenderer.tsx for the
// rationale — a server component can't be rendered inside a client
// tree without serialization). The tests wrap the renderer in
// `<Suspense>` because `use()` suspends until the Promise resolves.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import React, { Suspense } from "react";

// `vi.hoisted` lifts the mock fn above the `vi.mock` factory so the
// same reference can be imported and re-configured per test.
const { loadLessonMdxMock } = vi.hoisted(() => ({
  loadLessonMdxMock: vi.fn(),
}));

// Mock the static MDX file referenced by `loadLessonMdx` in the
// happy-path test.
vi.mock("@/lib/data/languages/pt/mdx/b1/l-test.mdx", () => ({
  default: () => (
    <div>
      <h1>Test Lesson</h1>
      <p>Body paragraph.</p>
    </div>
  ),
}));

vi.mock("@/lib/data/mdx", () => ({
  loadLessonMdx: loadLessonMdxMock,
}));

// Dynamic import AFTER mocks are registered.
const { LessonRenderer } = await import("@/components/lessons/LessonRenderer");

beforeEach(() => {
  loadLessonMdxMock.mockReset();
});

function renderInSuspense(node: React.ReactNode) {
  return render(<Suspense fallback={<div>loading…</div>}>{node}</Suspense>);
}

async function flushMicrotasks() {
  // React 19's `use()` schedules the unwrap on a microtask; the
  // commit still needs a tick. A few `await Promise.resolve()`
  // cycles drain the queue deterministically.
  for (let i = 0; i < 5; i++) {
    await act(async () => {
      await Promise.resolve();
    });
  }
}

describe("LessonRenderer", () => {
  it("renders the imported MDX content", async () => {
    const TestMdx = () => (
      <div>
        <h1>Test Lesson</h1>
        <p>Body paragraph.</p>
      </div>
    );
    loadLessonMdxMock.mockResolvedValue(TestMdx as never);
    await act(async () => {
      renderInSuspense(
        <LessonRenderer lessonId="b1-test" mdxPath="b1/l-test.mdx" lang="pt" />
      );
    });
    await flushMicrotasks();
    expect(screen.getByText("Test Lesson")).toBeTruthy();
    expect(screen.getByText("Body paragraph.")).toBeTruthy();
  });

  it("shows a fallback when MDX is missing", async () => {
    loadLessonMdxMock.mockResolvedValue(null);
    await act(async () => {
      renderInSuspense(
        <LessonRenderer lessonId="b1-missing" mdxPath="b1/l-missing.mdx" lang="pt" />
      );
    });
    await flushMicrotasks();
    expect(screen.getByText(/MDX not yet generated/i)).toBeTruthy();
    expect(screen.getByText(/b1\/l-missing\.mdx/)).toBeTruthy();
  });
});