'use client';

interface HeatmapGridProps {
  data: number[][];
}

function intensity2color(v: number): string {
  // 0 = dark navy, 1 = bright blue
  const r = Math.round(v * 30);
  const g = Math.round(v * 80);
  const b = Math.round(100 + v * 155);
  return `rgb(${r},${g},${b})`;
}

export default function HeatmapGrid({ data }: HeatmapGridProps) {
  return (
    <div className="inline-grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${data[0]?.length ?? 10}, 1fr)` }}>
      {data.map((row, ri) =>
        row.map((val, ci) => (
          <div
            key={`${ri}-${ci}`}
            className="w-6 h-6 rounded-sm"
            style={{ backgroundColor: intensity2color(val) }}
            title={`Zone (${ri},${ci}): ${Math.round(val * 100)}%`}
          />
        ))
      )}
    </div>
  );
}
