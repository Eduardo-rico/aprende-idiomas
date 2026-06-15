// components/stats/FsrsRetentionCard.tsx
'use client';
export function FsrsRetentionCard({ data }: { data: Record<number, number> }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <h3 className="text-sm font-medium mb-3">Retención FSRS</h3>
      <div className="space-y-2">
        {Object.entries(data)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([blockId, retention]) => (
            <div key={blockId} className="flex items-center gap-2">
              <span className="text-xs w-8">B{blockId}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${retention * 100}%` }}
                />
              </div>
              <span className="text-xs w-10 text-right">{Math.round(retention * 100)}%</span>
            </div>
          ))}
      </div>
    </div>
  );
}
