import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { analyticsNav } from '@/pages/dashboard/nav';
import { terminalAnalytics, type TerminalMetric } from '@/mocks/analytics';

const gradeTone: Record<string, string> = {
  A: 'bg-accent-100 text-accent-700',
  B: 'bg-secondary-100 text-secondary-700',
  C: 'bg-red-100 text-red-600',
};

function grade(score: string) {
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${gradeTone[score]}`}>{score}</span>;
}

function waitDelta(row: TerminalMetric) {
  const predicted = parseInt(row.predictedWait, 10);
  const actual = parseInt(row.actualWait, 10);
  const diff = actual - predicted;
  if (diff === 0) return <span className="text-foreground-400 text-[11px]">On target</span>;
  const positive = diff > 0;
  return (
    <span className={`text-[11px] font-medium ${positive ? 'text-red-600' : 'text-accent-700'}`}>
      {positive ? '+' : ''}{diff} min vs predicted
    </span>
  );
}

export default function AnalyticsTerminalsPage() {
  return (
    <ModuleShell
      title="Terminal Analytics"
      description="Terminal performance, reliability and pricing competitiveness."
      icon="ri-building-4-line"
      subNav={analyticsNav}
    >
      <div className="flex items-center justify-end mb-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-foreground-500">
          <i className="ri-calendar-line text-sm leading-none" />
          Last 30 days · updated 08:45
        </span>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[980px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Terminal</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Avg Wait</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">On-time Loading</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Volume Sourced</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Price Comp.</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Reliability</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Delays</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Cancelled</th>
                <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Predicted vs Actual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {terminalAnalytics.map((row) => (
                <tr key={row.name} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-foreground-900 whitespace-nowrap">{row.name}</p>
                    <p className="text-[11px] text-foreground-400">{row.city}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-800 tabular whitespace-nowrap">{row.avgWait}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-800 tabular whitespace-nowrap">{row.onTimeLoading}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-700 tabular whitespace-nowrap">{row.volumeSourced}</td>
                  <td className="px-4 py-3">{grade(row.priceCompetitiveness)}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-800 tabular whitespace-nowrap">{row.reliability}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[12px] font-semibold tabular ${row.delays > 4 ? 'text-red-600' : 'text-foreground-800'}`}>
                      {row.delays}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[12px] font-semibold tabular ${row.cancelledPickups > 0 ? 'text-secondary-700' : 'text-foreground-400'}`}>
                      {row.cancelledPickups}
                    </span>
                  </td>
                  <td className="px-4 py-3">{waitDelta(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ModuleShell>
  );
}