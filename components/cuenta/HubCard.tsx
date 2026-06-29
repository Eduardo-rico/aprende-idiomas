// components/cuenta/HubCard.tsx
// Single card in the /cuenta hub grid. Wraps a Card primitive in a Link
// and surfaces the section title, a one-line description, and an "Abrir →"
// call-to-action.
import Link from "next/link";
import { Card } from "@/components/ui";
import { ArrowRight } from "lucide-react";

export function HubCard({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} className="group block" data-testid="hub-card">
      <Card className="p-5 transition-shadow group-hover:shadow-[var(--shadow-sm)]">
        <h2 className="mb-1 font-display text-[22px] text-ink">{title}</h2>
        <p className="text-sm text-ink-muted">{desc}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-sm text-lesson">
          Abrir <ArrowRight size={14} aria-hidden />
        </div>
      </Card>
    </Link>
  );
}