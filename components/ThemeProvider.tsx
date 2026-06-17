"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { runLocalStorageMigrations } from "@/lib/stores/localstorage-migrate";
type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({ theme: "light", setTheme: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  // Phase 4: key renamed from "pt-theme" to "app-theme" so the storage
  // namespace is no longer PT-specific. The migration copies any prior
  // "pt-theme" value into "app-theme" before we read it.
  useEffect(() => {
    runLocalStorageMigrations();
    const stored = localStorage.getItem("app-theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("app-theme", theme);
  }, [theme]);
  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
