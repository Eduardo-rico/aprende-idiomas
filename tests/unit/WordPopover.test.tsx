// tests/unit/WordPopover.test.tsx
// @vitest-environment jsdom
// Verifies the popover's three states: loading → found/missing.
// We stub fetch to keep the test hermetic and avoid the Next.js dev
// server needing to be up.
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
import { WordPopover } from "@/components/stories/WordPopover";

// Stub fetch globally so the popover's lookup resolves predictably.
const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function mockItem(word: string, meaning: string) {
  return {
    source: "catalog" as const,
    word,
    meaning,
    audioHash: { br: "br-hash", pt: "pt-hash" },
  };
}

function mockFallback(word: string, meaning: string) {
  return { source: "fallback" as const, word, meaning };
}

describe("WordPopover (Phase C)", () => {
  it("shows 'Buscando…' while the lookup is in flight", () => {
    // Never resolve — popover stays in the loading state.
    fetchMock.mockReturnValue(new Promise(() => {}));
    render(<WordPopover word="padaria" storyId="b1-s1-foo" onClose={() => {}} />);
    expect(screen.getByText(/Buscando…/)).toBeTruthy();
  });

  it("renders the meaning and audio button when the catalog has a hit", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockItem("padaria", "panadería"),
    });
    render(<WordPopover word="padaria" storyId="b1-s1-foo" onClose={() => {}} />);
    await waitFor(() => screen.getByText("panadería"));
    expect(screen.getByText("padaria")).toBeTruthy();
    expect(screen.getByLabelText(/Pronunciar padaria/)).toBeTruthy();
  });

  it("shows the friendly 'not in dictionary' message on a miss", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ word: "quux", item: null }),
    });
    render(<WordPopover word="quux" storyId="b1-s1-foo" onClose={() => {}} />);
    await waitFor(() => screen.getByText(/No está en el diccionario/));
    // No add-to-vocab button on a miss.
    expect(screen.queryByText(/Agregar al vocabulario/)).toBeNull();
  });

  it("renders fallback meaning with no audio button and no 'add' button", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockFallback("cheiro", "olor"),
    });
    render(<WordPopover word="cheiro" storyId="b1-s1-foo" onClose={() => {}} />);
    await waitFor(() => screen.getByText("olor"));
    expect(screen.getByText("cheiro")).toBeTruthy();
    expect(screen.getByText(/\(sin audio\)/)).toBeTruthy();
    // No audio button, no "Agregar" button.
    expect(screen.queryByLabelText(/Pronunciar/)).toBeNull();
    expect(screen.queryByText(/Agregar al vocabulario/)).toBeNull();
  });

  it("shows the error message on a network failure", async () => {
    fetchMock.mockRejectedValue(new Error("boom"));
    render(<WordPopover word="padaria" storyId="b1-s1-foo" onClose={() => {}} />);
    await waitFor(() => screen.getByText("boom"));
  });

  it("URL-encodes the word in the request", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ word: "l'água", item: null }),
    });
    render(<WordPopover word="l'água" storyId="b1-s1-foo" onClose={() => {}} />);
    await waitFor(() => screen.getByText(/No está en el diccionario/));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/vocab/lookup?w=l'%C3%A1gua",
    );
  });

  it("calls onClose when the user presses Escape", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockItem("padaria", "panadería"),
    });
    const onClose = vi.fn();
    render(<WordPopover word="padaria" storyId="b1-s1-foo" onClose={onClose} />);
    await waitFor(() => screen.getByText("panadería"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
