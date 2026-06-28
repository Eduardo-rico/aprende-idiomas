// components/home/QuickReviewCard.tsx
// "Repaso rápido" — a small editorial card for quick vocab/global review.
// Pure presentation: parent supplies title, meta, badge, and href.
import Link from "next/link";
import { Card } from "@/components/ui";

interface Props {
  lang: string;
  href: string;
  title: string;
  meta: string;
  /** Badge text + token class for the leading "pill" label. */
  badgeText: string;
  badgeClass?: string;
}

export function QuickReviewCard({
  lang,
  href,
  title,
  meta,
  badgeText,
  badgeClass = "text-review",
}: Props) {
  // Allow fully-qualified or lang-relative hrefs.
  const target = href.startsWith("/") ? href : `/${lang}/${href.replace(/^\/+/, "")}`;
  return (
    <Link
      href={target}
      className="block no-underline text-ink"
      aria-label={`${title} · ${meta}`}
    >
      <Card className="p-5 h-full">
        <h3 className="font-display text-[20px] font-medium mb-1 leading-tight">
          {title}
        </h3>
        <div className="text-sm text-ink-muted mb-4">{meta}</div>
        <div className="flex justify-between items-center">
          <span
            className={`text-sm font-medium inline-flex items-center gap-1.5 ${badgeClass}`}
          >
            {badgeText}
          </span>
          <span className="text-sm font-medium text-ink border border-rule-strong rounded-md px-3.5 py-1.5 bg-paper-raised inline-flex items-center gap-1">
            Empezar →
          </span>
        </div>
      </Card>
    </Link>
  );
}