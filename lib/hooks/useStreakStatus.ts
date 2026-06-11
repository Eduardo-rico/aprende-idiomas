// lib/hooks/useStreakStatus.ts
"use client";
import { useEffect, useState } from "react";
import { getStreakStatus } from "@/lib/db/repository";
import { useSettings } from "@/lib/stores/settings";

export function useStreakStatus() {
  const { dailyGoalMinutes } = useSettings();
  const [status, setStatus] = useState({ currentStreak: 0, todayMinutes: 0, isStreakAlive: false });

  useEffect(() => {
    let mounted = true;
    const refresh = () => getStreakStatus(dailyGoalMinutes).then((s) => { if (mounted) setStatus(s); });
    refresh();
    const interval = setInterval(refresh, 60_000);
    return () => { mounted = false; clearInterval(interval); };
  }, [dailyGoalMinutes]);

  return status;
}
