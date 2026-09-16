import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useActionQueue, type QueueItem, type QueueSeverity } from '@/pages/dashboard/overview/actionQueue';
import { acknowledgeIssue, resolveIssue } from '@/pages/driver/driverStore';

const severityIcon: Record<QueueSeverity, string> = {
  critical: 'bg-red-100 text-red-600',
  warning: 'bg-secondary-100 text-secondary-700',
  info: 'bg-background-100 text-foreground-500',
};

export default function ActionQueue() {
  const items = useActionQueue();
  const [toast, setToast] = useState<string | null>(null);

  const criticalCount = items.filter((item) => item.severity === 'critical').length;

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }

  function handleAction(item: QueueItem) {
    if (!item.resolveRunId || !item.resolveIssueId) return;
    if (item.actionKind === 'acknowledge') {
      acknowledgeIssue(item.resolveRunId, item.resolveIssueId);
      showToast(`Acknowledged · ${item.title}`);
    } else {
      resolveIssue(item.resolveRunId, item.resolveIssueId);
      showToast(`Resolved · ${item.title}`);
    }
  }

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-background-200 bg-background-100/40">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-md bg-primary-500 text-background-50 flex items-center justify-center shrink-0">
            <i className="ri-flashlight-line text-[15px] leading-none" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-foreground-950 leading-none">Опашка за действия</h2>
            <p className="text-[11px] text-foreground-400 mt-0.5">Всичко, което изисква внимание, по приоритет</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-foreground-600 bg-background-100 px-2 py-0.5 rounded-full whitespace-nowrap">
          {items.length} отворени
          {criticalCount > 0 && (
            <span className="inline-flex items-center gap-1 text-red-600">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              {criticalCount} критични
            </span>
          )}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-100">
            <i className="ri-check-double-line text-accent-700 text-2xl leading-none" />
          </span>
          <p className="mt-3 text-sm font-semibold text-foreground-800">Всичко е наред</p>
          <p className="text-[12px] text-foreground-400 mt-0.5">
            В момента няма блокирани спирки, отклонения, неназначени курсове или конфликти.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-background-200">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-background-100/50 transition-colors group">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${severityIcon[item.severity]}`}>
                <i className={`${item.icon} text-[15px] leading-none`} />
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[12px] font-semibold text-foreground-900 truncate">{item.title}</span>
                  <span className="inline-block text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-background-100 text-foreground-500 whitespace-nowrap">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-foreground-500 truncate">{item.detail}</p>
              </div>

              {item.time && (
                <span className="hidden sm:block text-[10px] text-foreground-400 tabular whitespace-nowrap shrink-0">
                  {item.time}
                </span>
              )}

              {item.resolveRunId && item.resolveIssueId && (
                <button
                  type="button"
                  onClick={() => handleAction(item)}
                  className={`inline-flex shrink-0 items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    item.actionKind === 'resolve'
                      ? 'bg-primary-500 hover:bg-primary-600 text-background-50'
                      : 'border border-background-300 bg-background-50 text-foreground-700 hover:bg-background-100'
                  }`}
                >
                  <i className={`${item.actionKind === 'resolve' ? 'ri-check-line' : 'ri-mail-check-line'} text-[12px] leading-none`} />
                  {item.actionKind === 'resolve' ? 'Разреши' : 'Потвърди'}
                </button>
              )}

              <Link
                to={item.link}
                className="w-7 h-7 flex items-center justify-center rounded-md text-foreground-300 group-hover:text-foreground-600 group-hover:bg-background-100 shrink-0 cursor-pointer transition-colors"
                aria-label="Отвори"
              >
                <i className="ri-arrow-right-s-line text-base leading-none" />
              </Link>
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
    </div>
  );
}
