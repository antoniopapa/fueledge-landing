import type { DonutSlice } from '@/mocks/analytics';

const toneColor: Record<DonutSlice['tone'], string> = {
  primary: 'oklch(var(--primary-500))',
  accent: 'oklch(var(--accent-500))',
  secondary: 'oklch(var(--secondary-500))',
  primarySoft: 'oklch(var(--primary-200))',
  accentSoft: 'oklch(var(--accent-200))',
  secondarySoft: 'oklch(var(--secondary-200))',
  foreground: 'oklch(var(--foreground-300))',
};

interface DonutProps {
  segments: DonutSlice[];
  centerLabel: string;
  centerValue: string;
}

export default function Donut({ segments, centerLabel, centerValue }: DonutProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let acc = 0;
  const stops = segments
    .map((s) => {
      const start = (acc / total) * 360;
      acc += s.value;
      const end = (acc / total) * 360;
      return `${toneColor[s.tone]} ${start.toFixed(1)}deg ${end.toFixed(1)}deg`;
    })
    .join(', ');

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative w-36 h-36 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-[18%] rounded-full bg-background-50 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold text-foreground-950 tabular leading-none">{centerValue}</span>
          <span className="text-[10px] text-foreground-400 mt-1">{centerLabel}</span>
        </div>
      </div>
      <ul className="flex-1 space-y-2 min-w-0">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: toneColor[s.tone] }} />
            <span className="flex-1 truncate text-[12px] text-foreground-700">{s.label}</span>
            <span className="text-[12px] font-semibold text-foreground-900 tabular whitespace-nowrap">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}