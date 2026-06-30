// tests/unit/onboarding-cta.test.tsx
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";

// Must be hoisted before component imports so vitest replaces the module.
vi.mock("@/lib/db/schema", () => ({
  db: {
    settings: { get: vi.fn().mockResolvedValue(undefined) },
    cards: { count: vi.fn().mockResolvedValue(0) },
  },
}));

vi.mock("@/lib/db/repository", () => ({
  getDueCardsCount: vi.fn().mockResolvedValue(0),
}));

import { OnboardingCtaClient } from "@/components/home/OnboardingCtaClient";
import { db } from "@/lib/db/schema";

afterEach(() => cleanup());

beforeEach(() => {
  // Reset to "fresh user" defaults before every test.
  vi.mocked(db.settings.get).mockResolvedValue(undefined);
  vi.mocked(db.cards.count).mockResolvedValue(0);
});

describe("OnboardingCtaClient", () => {
  it("shows diagnostic CTA when DB is empty (no cards, no onboarding)", async () => {
    render(<OnboardingCtaClient lang="pt" />);
    await waitFor(() => {
      expect(screen.getByText(/Hacé el diagnóstico/)).toBeInTheDocument();
    });
  });

  it("shows diagnostic CTA when onboarding not done even if cards exist", async () => {
    vi.mocked(db.settings.get).mockResolvedValue(undefined); // not done
    vi.mocked(db.cards.count).mockResolvedValue(5);
    render(<OnboardingCtaClient lang="pt" />);
    await waitFor(() => {
      expect(screen.getByText(/Hacé el diagnóstico/)).toBeInTheDocument();
    });
  });

  it("shows session CTA when onboarding done and cards exist", async () => {
    vi.mocked(db.settings.get).mockResolvedValue({
      key: "onboardingDone",
      value: true,
      updatedAt: new Date(),
    });
    vi.mocked(db.cards.count).mockResolvedValue(10);
    render(<OnboardingCtaClient lang="pt" />);
    await waitFor(() => {
      expect(screen.getByText(/Empezar sesión/)).toBeInTheDocument();
    });
  });

  it("diagnostic CTA links to /:lang/diagnostic", async () => {
    render(<OnboardingCtaClient lang="pt" />);
    await waitFor(() => {
      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toBe("/pt/diagnostic");
    });
  });

  it("session CTA links to /:lang/practicar/srs", async () => {
    vi.mocked(db.settings.get).mockResolvedValue({
      key: "onboardingDone",
      value: true,
      updatedAt: new Date(),
    });
    vi.mocked(db.cards.count).mockResolvedValue(10);
    render(<OnboardingCtaClient lang="pt" />);
    await waitFor(() => {
      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toBe("/pt/practicar/srs");
    });
  });
});
