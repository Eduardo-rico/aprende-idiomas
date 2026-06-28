// lib/hooks/useSessionTimer.ts
// Elapsed-time clock for the session top bar. Pure presentational: no
// cap, no fatigue warning — those land in WS-D.4. Counts via the
// interval tick so it doesn't depend on wall clock (which makes
// vi.useFakeTimers() in tests work cleanly). startAt is in the dep
// array for reset semantics: changing it resets the counter (caller
// uses it as a session-reset signal).
"use client";
import { useEffect, useState } from "react";

export function useSessionTimer(startAt: number): { elapsed: number; label: string } {
  // startAt is intentionally unused inside the effect — its presence in
  // the dep array is the reset signal.
  void startAt;
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setElapsed(0);
    const id = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [startAt]);

  const mm = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const ss = (elapsed % 60).toString().padStart(2, "0");
  return { elapsed, label: `${mm}:${ss}` };
}
