// components/lessons/DropCap.tsx
// Editorial drop-cap: first letter of the wrapped paragraph is rendered
// in the display font at 64px, floated left, ink-lesson colored.
// Implemented via the `.dropcap::first-letter` CSS rule (see
// app/globals.css) so it works on any wrapping element — the component
// here is just the host that applies the class.
interface Props { children: React.ReactNode; }

export function DropCap({ children }: Props) {
  return <p className="dropcap">{children}</p>;
}
