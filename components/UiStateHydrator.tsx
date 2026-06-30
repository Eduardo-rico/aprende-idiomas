"use client";
import { useEffect } from "react";
import { useUiState } from "@/lib/stores/useUiState";

export function UiStateHydrator({ children }: { children: React.ReactNode }) {
  const hydrate = useUiState((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return <>{children}</>;
}
