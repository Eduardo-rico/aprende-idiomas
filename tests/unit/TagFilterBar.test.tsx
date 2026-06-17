// tests/unit/TagFilterBar.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { TagFilterBar } from "@/components/tags/TagFilterBar";

afterEach(() => cleanup());

describe("TagFilterBar (Phase B)", () => {
  it("renders a 'Todos' chip and one chip per available known tag", () => {
    render(
      <TagFilterBar
        available={["vocab", "story:b1-s1-foo"]}
        selected={new Set()}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("Todos")).toBeTruthy();
    expect(screen.getByText(/Vocab/)).toBeTruthy();
    expect(screen.getByText(/Historia b1-s1-foo/)).toBeTruthy();
  });

  it("hides unknown tags so the bar doesn't show garbage", () => {
    render(
      <TagFilterBar
        available={["vocab", "concept:phon-001", "random-string"]}
        selected={new Set()}
        onChange={() => {}}
      />,
    );
    expect(screen.queryByText("concept:phon-001")).toBeNull();
    expect(screen.queryByText("random-string")).toBeNull();
  });

  it("clicking a chip adds it to the selection (one tag at a time)", () => {
    const onChange = vi.fn();
    render(
      <TagFilterBar
        available={["vocab"]}
        selected={new Set()}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText(/Vocab/));
    expect(onChange).toHaveBeenCalledTimes(1);
    const arg = onChange.mock.calls[0]![0] as Set<string>;
    expect(arg.has("vocab")).toBe(true);
  });

  it("clicking an already-selected chip removes it from the selection", () => {
    const onChange = vi.fn();
    render(
      <TagFilterBar
        available={["vocab"]}
        selected={new Set(["vocab"])}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText(/Vocab/));
    const arg = onChange.mock.calls[0]![0] as Set<string>;
    expect(arg.has("vocab")).toBe(false);
  });

  it("clicking 'Todos' clears the selection", () => {
    const onChange = vi.fn();
    render(
      <TagFilterBar
        available={["vocab"]}
        selected={new Set(["vocab"])}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("Todos"));
    const arg = onChange.mock.calls[0]![0] as Set<string>;
    expect(arg.size).toBe(0);
  });

  it("renders the per-tag count when provided", () => {
    render(
      <TagFilterBar
        available={["vocab"]}
        selected={new Set()}
        counts={{ vocab: 47 }}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("(47)")).toBeTruthy();
  });

  it("returns null when no known tags are available (e.g. all filtered out)", () => {
    const { container } = render(
      <TagFilterBar
        available={["concept:phon-001", "random-string"]}
        selected={new Set()}
        onChange={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
