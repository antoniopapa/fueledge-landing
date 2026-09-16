import { useMemo, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { dispatchNav } from '@/pages/dashboard/nav';
import { useDriverRuns, acknowledgeIssue, resolveIssue } from '@/pages/driver/driverStore';
import { getOpenIssues } from '@/pages/driver/driverUtils';

interface OpenIssueRow {
  runId: string;
  route: string;
  issueId: string;
  stopLabel: string;
  category: string;
  severity: string;
  kind: 'issue' | 'unable_to_complete';
  status: 'Reported' | 'Acknowledged';
  time: string;
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400">{label}</span>
        <span
          className={`w-8 h-8 rounded-md flex items-center justify-center ${
            accent ? 'bg-accent-100 text-accent-700' : 'bg-secondary-100 text-secondary-700'
          }`}
        >
          <i className={`${icon} text-base leading-none`} />
        </span>
      </div>
      <p className="mt-2 font-heading text-2xl font-bold text-foreground-950 tabular">{value}</p>
    </div>
  );
}

export default function DispatchIssuesPage() {
  const runs = useDriverRuns();
  const [toast, setToast] = useState<string | null>(null);

  const rows: OpenIssueRow[] = useMemo(
    () =>
      runs.flatMap((run) =>
        getOpenIssues(run).map((issue) => ({
          runId: run.id,
          route: run.route,
          issueId: issue.id,
          stopLabel: issue.stopLabel,
          category: issue.category,
          severity: issue.severity,
          kind: issue.kind,
          status: issue.status as 'Reported' | 'Acknowledged',
          time: issue.time,
        })),
      ),
    [runs],
  );

  const blockedCount = rows.filter((row) => row.kind === 'unable_to_complete').length;
  const reportedCount = rows.filter((row) => row.kind === 'issue').length;

  function handleResolve(row: OpenIssueRow) {
    resolveIssue(row.runId, row.issueId);
    setToast(
      `${row.kind === 'unable_to_complete' ? 'Повторната доставка е активирана' : 'Проблемът е разрешен'} · ${row.stopLabel}`,
    );
    window.setTimeout(() => setToast(null), 2600);
  }

  function handleAcknowledge(row: OpenIssueRow) {
    acknowledgeIssue(row.runId, row.issueId);
    setToast(`Потвърдено · ${row.stopLabel}`);
    window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <ModuleShell
      title="Отворени проблеми"
      description="Преглед и разрешаване на проблеми, докладвани от шофьорите на терен."
      icon="ri-alert-line"
      subNav={dispatchNav}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Блокирани спирки" value={blockedCount} icon="ri-lock-line" accent />
        <StatCard label="Докладвани проблеми" value={reportedCount} icon="ri-alert-line" />
        <StatCard label="Общо отворени" value={rows.length} icon="ri-list-unordered" />
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-background-300 bg-background-50 p-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background-100">
            <i className="ri-check-double-line text-foreground-400 text-2xl leading-none" />
          </span>
          <p className="mt-4 font-heading text-[16px] font-bold text-foreground-950">Няма отворени проблеми</p>
          <p className="mt-1 text-[13px] text-foreground-500">
            Когато шофьор докладва проблем или не може да завърши спирка, той ще се появи тук за преглед.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((row) => (
            <div key={row.issueId} className="rounded-lg border border-background-200 bg-background-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      row.kind === 'unable_to_complete'
                        ? 'bg-accent-100 text-accent-700'
                        : 'bg-secondary-100 text-secondary-700'
                    }`}
                  >
                    <i
                      className={`${row.kind === 'unable_to_complete' ? 'ri-lock-line' : 'ri-alert-line'} text-base leading-none`}
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-400 tabular">
                        {row.runId}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          row.kind === 'unable_to_complete'
                            ? 'bg-accent-100 text-accent-800'
                            : 'bg-secondary-100 text-secondary-800'
                        }`}
                      >
                        {row.kind === 'unable_to_complete' ? 'Блокиран' : row.status === 'Reported' ? 'Докладван' : 'Потвърден'}
                      </span>
                      {row.kind === 'unable_to_complete' && row.status === 'Acknowledged' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-background-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground-600">
                          Потвърден
                        </span>
                      )}
                      {row.severity === 'urgent' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700">
                          Спешен
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[14px] font-semibold text-foreground-950">{row.category}</p>
                    <p className="text-[12px] text-foreground-500">
                      {row.route} · {row.stopLabel}
                    </p>
                    <p className="mt-0.5 text-[11px] text-foreground-400">Докладвано {row.time}</p>
                  </div>
                </div>
                {row.status === 'Reported' ? (
                  <button
                    type="button"
                    onClick={() => handleAcknowledge(row)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-background-300 bg-background-50 text-foreground-700 hover:bg-background-100 text-[13px] font-semibold px-3 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    <i className="ri-mail-check-line text-sm leading-none" />
                    Потвърди
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleResolve(row)}
                    className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-[13px] font-semibold px-3 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    <i
                      className={`${row.kind === 'unable_to_complete' ? 'ri-refresh-line' : 'ri-check-line'} text-sm leading-none`}
                    />
                    {row.kind === 'unable_to_complete' ? 'Разреши · повтори доставката' : 'Разреши'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          </span>
          {toast}
        </div>
      )}
    </ModuleShell>
  );
}
