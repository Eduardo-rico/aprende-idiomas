// components/lessons/PullQuote.tsx
// Editorial pull-quote: italic display font, 3px left rule in lesson
// accent, muted ink for the body, faint cite under it.
interface Props { children: React.ReactNode; cite: string; }

export function PullQuote({ children, cite }: Props) {
  return (
    <blockquote className="border-l-[3px] border-lesson py-1 px-0 pl-5 my-6 font-display italic text-[20px] text-ink-muted">
      {children}
      <cite className="block text-sm not-italic font-body text-ink-faint mt-2">— {cite}</cite>
    </blockquote>
  );
}
