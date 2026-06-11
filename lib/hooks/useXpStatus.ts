// lib/hooks/useXpStatus.ts
"use client";
import { useEffect, useState } from "react";
import { getTotalXp } from "@/lib/db/repository";
import { levelFromXp, levelProgress } from "@/lib/xp/calculator";

export function useXpStatus() {
  const [status, setStatus] = useState({ total: 0, level: 0, progress: { current: 0, start: 0, end: 0, pct: 0 } });

  useEffect(() => {
    let mounted = true;
    const refresh = () =>
      getTotalXp().then((total) => {
        if (!mounted) return;
        setStatus({ total, level: levelFromXp(total), progress: levelProgress(total) });
      });
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return status;
}
