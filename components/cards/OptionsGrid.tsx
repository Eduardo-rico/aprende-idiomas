// components/cards/OptionsGrid.tsx
"use client";
interface Props { options: string[]; onPick: (index: number) => void; disabled?: boolean; }
export function OptionsGrid({ options, onPick, disabled }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((opt, i) => (
        <button key={i} disabled={disabled} onClick={() => onPick(i)}
          className="border-2 border-border rounded-md px-4 py-3 text-left hover:bg-muted disabled:opacity-60">
          {opt}
        </button>
      ))}
    </div>
  );
}
