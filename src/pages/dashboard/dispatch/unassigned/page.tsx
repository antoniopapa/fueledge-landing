import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { dispatchNav } from '@/pages/dashboard/nav';
import { assignmentOptions, type UnscheduledRun } from '@/mocks/schedule';
import { useScheduleRuns, scheduleResourcesFromRuns, useUnassignedRuns, assignRun } from '@/pages/dashboard/dispatch/dispatchStore';
import AssignmentModal from './components/AssignmentModal';

export default function UnassignedPage() {
  const navigate = useNavigate();
  const unassigned = useUnassignedRuns();
  const runs = useScheduleRuns();
  const scheduleResources = useMemo(() => scheduleResourcesFromRuns(runs), [runs]);
  const [assignTarget, setAssignTarget] = useState<UnscheduledRun | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const drivers = useMemo(() => scheduleResources.map((r) => r.driverName), [scheduleResources]);
  const trucks = useMemo(() => Array.from(new Set(scheduleResources.map((r) => r.truckPlate))), [scheduleResources]);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }

  function handleAssign(driverName: string, truckPlate: string) {
    if (!assignTarget) return;
    assignRun(assignTarget, driverName, truckPlate);
    const id = assignTarget.id;
    setAssignTarget(null);
    showToast(`Курс #${id} е назначен на ${driverName} · ${truckPlate} и добавен в графика`);
  }

  return (
    <ModuleShell
      title="Неназначени курсове"
      description="Снабдени курсове, готови за диспечиране, които още се нуждаят от камион и шофьор."
      icon="ri-inbox-line"
      subNav={dispatchNav}
    >
      {/* KPI */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-3 rounded-lg border border-background-200 bg-background-50 px-4 py-3">
          <span className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
            <i className="ri-inbox-line text-secondary-700 text-lg leading-none" />
          </span>
          <div>
            <p className="font-heading text-2xl font-bold text-foreground-950 tabular leading-none">
              {unassigned.length}
            </p>
            <p className="text-[11px] text-foreground-500 mt-1">Неназначени курсове</p>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1120px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Курс</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Изходен терминал</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Дестинация</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Продукт</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Обем</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Товарене</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Доставка</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Препоръчано</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Причина</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {unassigned.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center">
                    <span className="w-10 h-10 mx-auto rounded-full bg-accent-100 flex items-center justify-center">
                      <i className="ri-checkbox-circle-line text-accent-600 text-lg leading-none" />
                    </span>
                    <p className="mt-3 text-sm font-medium text-foreground-700">Всички курсове са назначени</p>
                    <p className="text-xs text-foreground-400 mt-1">Новите снабдени курсове ще се появят тук.</p>
                  </td>
                </tr>
              ) : (
                unassigned.map((l) => (
                  <tr key={l.id} className="hover:bg-background-100/50 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/orders/${l.id}`)}
                        className="text-[12px] font-semibold text-primary-700 hover:underline whitespace-nowrap cursor-pointer"
                      >
                        #{l.id}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{l.sourceTerminal}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-700 whitespace-nowrap">{l.destination}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{l.product}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-600 tabular whitespace-nowrap">{l.volume}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-500 tabular whitespace-nowrap">{l.pickupWindow}</td>
                    <td className="px-4 py-3 text-[12px] text-foreground-500 tabular whitespace-nowrap">{l.deliveryWindow}</td>
                    <td className="px-4 py-3">
                      <div className="text-[12px]">
                        <p className="font-semibold text-foreground-900 whitespace-nowrap">{l.recommendedDriver}</p>
                        <p className="text-foreground-500 tabular whitespace-nowrap">{l.recommendedTruck}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {l.deliveryFirst ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-semibold text-accent-800 whitespace-nowrap">
                          <span className="w-3.5 h-3.5 flex items-center justify-center">
                            <i className="ri-truck-line text-accent-600 text-[13px] leading-none" />
                          </span>
                          Първо доставка
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-secondary-700 whitespace-nowrap">
                          <span className="w-3.5 h-3.5 flex items-center justify-center">
                            <i className="ri-alert-line text-secondary-600 text-[13px] leading-none" />
                          </span>
                          {l.reason}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setAssignTarget(l)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-secondary-500 hover:bg-secondary-600 text-background-50 text-[11px] font-semibold px-2.5 py-1 whitespace-nowrap cursor-pointer"
                      >
                        <span className="w-3 h-3 flex items-center justify-center">
                          <i className="ri-user-add-line text-[12px] leading-none" />
                        </span>
                        Назначи
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AssignmentModal
        run={assignTarget}
        options={assignTarget ? assignmentOptions[assignTarget.id] ?? [] : []}
        drivers={drivers}
        trucks={trucks}
        onClose={() => setAssignTarget(null)}
        onAssign={handleAssign}
      />

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
