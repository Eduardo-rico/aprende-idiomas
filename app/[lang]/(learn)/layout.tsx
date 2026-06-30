import { NavBar } from "@/components/NavBar";
import type { ReactNode } from "react";
export default function LearnLayout({ children }: { children: ReactNode }) {
  return <><NavBar /><div className="flex-1">{children}</div></>;
}
