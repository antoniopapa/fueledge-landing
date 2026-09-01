import { overviewKpis, type OverviewTone } from '@/pages/dashboard/overview/overviewData';

const toneClass: Record<OverviewTone, string> = {
  neutral: 'border-background-200 bg-background-50',
  accent: 'border-accent-200 bg-accent-50',
  primary: 'border-primary-200 bg-primary-50',
  secondary: 'border-secondary-200 bg-secondary-50',
  danger: 'border-red-200 bg-red-50',
};

const toneValue: Record<OverviewTone, string> = {
  neutral: 'text-foreground-950',
  accent: 'text-accent-700',
  primary: 'text-primary-700',
  secondary: 'text-secondary-700',
  danger: 'text-red-600',
};

const toneStroke: Record<OverviewTone, string> = {
  neutral: 'stroke-foreground-400',
  accent: 'stroke-accent-500',
  primary: 'stroke-primary-500',
  secondary: 'stroke-secondary-500',
  danger: 'stroke-red-500',
};

function Sparkline({ values, tone }: { values: number[]; tone: OverviewTone }) {
  const w = 100;
  const h = 32;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="w-full h-8" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        className={toneStroke[tone]}
      />
    </svg>
  );
}

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {overviewKpis.map((k) => (
        <div key={k.label} className={`rounded-lg border px-4 py-3.5 ${toneClass[k.tone]}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">
              {k.label}
            </span>
            <span className="w-5 h-5 flex items-center justify-center">
              <i className={`${k.icon} text-foreground-400 text-sm leading-none`} />
            </span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <p className={`mt-2 text-2xl font-bold tabular leading-none ${toneValue[k.tone]}`}>{k.value}</p>
            <div className="w-16 shrink-0">
              <Sparkline values={k.spark} tone={k.tone} />
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-foreground-500">{k.delta}</p>
        </div>
      ))}
    </div>
  );
}