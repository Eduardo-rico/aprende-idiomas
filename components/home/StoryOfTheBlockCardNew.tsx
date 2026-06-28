// components/home/StoryOfTheBlockCardNew.tsx
// Editorial "História do bloco" — small card promoting the story for
// the active block. Visual matches the mockup's two-col variant.
// Note: components/home/StoryOfTheBlockCard.tsx already exists and is
// used by the legacy home page; this one follows the Manual Lusitano
// style (no border-legacy, uses Card + Eyebrow, semantic HTML).
import Link from "next/link";
import { Card } from "@/components/ui";

interface Props {
  lang: string;
  href: string;
  title: string;
  meta: string;
  /** E.g. "🇵🇹 PT-PT" — colored via the `pt` accent token by default. */
  badgeText: string;
  badgeClass?: string;
}

export function StoryOfTheBlockCardNew({
  lang,
  href,
  title,
  meta,
  badgeText,
  badgeClass = "text-pt",
}: Props) {
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
          <span className={`text-sm font-medium inline-flex items-center gap-1.5 ${badgeClass}`}>
            {badgeText}
          </span>
          <span className="text-sm font-medium text-ink border border-rule-strong rounded-md px-3.5 py-1.5 bg-paper-raised inline-flex items-center gap-1">
            Leer →
          </span>
        </div>
      </Card>
    </Link>
  );
}