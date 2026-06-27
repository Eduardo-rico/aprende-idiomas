// components/lessons/VerbConjugation.tsx
// Data-driven conjugation table for lesson MDX (5c, R7). The forms are
// passed as props from the MDX (`<VerbConjugation verb=... tense=...
// forms={[...]} />`) — there is NO runtime dictionary lookup
// (fallback-dictionary.ts is word→gloss, it has no conjugation tables).
interface Props { verb: string; tense: string; forms: { person: string; form: string }[]; }
export function VerbConjugation({ verb, tense, forms }: Props) {
  return (
    <div className="my-4 border-2 border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2 bg-muted text-sm font-medium">{verb} — {tense}</div>
      <table className="w-full text-sm">
        <tbody>
          {forms.map((f, i) => (
            <tr key={i} className="border-t border-border">
              <td className="px-4 py-1.5 text-muted-foreground w-1/3">{f.person}</td>
              <td className="px-4 py-1.5 font-medium">{f.form}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
