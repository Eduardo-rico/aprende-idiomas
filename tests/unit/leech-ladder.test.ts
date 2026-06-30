import { describe, it, expect } from "vitest";
import { getLeechAction, LEECH_LADDER } from "@/lib/srs/leeches";

describe("leech ladder", () => {
  it("no action below threshold", () => expect(getLeechAction(2)).toBeNull());
  it("warn at 3 lapses", () => expect(getLeechAction(3)?.level).toBe("warn"));
  it("reset at 5 lapses", () => expect(getLeechAction(5)?.level).toBe("reset"));
  it("focus at 7 lapses", () => expect(getLeechAction(7)?.level).toBe("focus"));
  it("no action at non-threshold (4)", () => expect(getLeechAction(4)).toBeNull());
  it("ladder has 3 tiers", () => expect(LEECH_LADDER).toHaveLength(3));
});
