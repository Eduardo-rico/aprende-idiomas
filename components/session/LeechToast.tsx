"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/db/schema";

export function LeechToast() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const recent = await db.telemetry
        .where("source")
        .equals("leech")
        .reverse()
        .sortBy("ts")
        .then((r) => r[0]);
      if (recent && Date.now() - recent.ts.getTime() < 5000) {
        setMsg(recent.message);
        setTimeout(() => setMsg(null), 4000);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!msg) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-review text-paper px-5 py-3 rounded-lg shadow-md text-sm z-50">
      {msg}
    </div>
  );
}
