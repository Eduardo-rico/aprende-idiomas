// components/lessons/ConjugationTable.tsx
// Renders a 6-per-row conjugation table (eu / tu / ele / nós / vós / eles)
// in the mono font on sunken paper. Lines wrap every 6 entries so the
// Portuguese 6-person paradigm reads cleanly across lines.
interface Props {
  rows: Array<{ pronoun: string; form: string }>;
}

export function ConjugationTable({ rows }: Props) {
  // Build segments of 6 rows; each segment is a `<span>` per row,
  // separated by `·`, terminated with a newline.
  const segments: Array<Array<{ pronoun: string; form: string }>> = [];
  for (let i = 0; i < rows.length; i += 6) {
    segments.push(rows.slice(i, i + 6));
  }
  return (
    <pre className="font-mono text-[15px] bg-paper-sunken border border-rule rounded-lg px-4 py-3 leading-[1.9] my-2 whitespace-pre-wrap">
      {segments.map((seg, si) => (
        <span key={si}>
          {seg.map((r, ri) => (
            <span key={ri}>
              {r.pronoun} <strong>{r.form}</strong>
              {ri < seg.length - 1 ? "  ·  " : ""}
            </span>
          ))}
          {si < segments.length - 1 ? "\n" : ""}
        </span>
      ))}
    </pre>
  );
}
