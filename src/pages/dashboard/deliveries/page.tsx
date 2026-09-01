import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { deliveriesNav } from '@/pages/dashboard/nav';
import { deliveries, deliveryKpis } from '@/mocks/deliveries';
import DeliveriesTable from './components/DeliveriesTable';

const kpiTone: Record<string, string> = {
  neutral: 'border-background-200 bg-background-50',
  accent: 'border-accent-200 bg-accent-50',
  secondary: 'border-secondary-200 bg-secondary-50',
};

const kpiValue: Record<string, string> = {
  neutral: 'text-foreground-950',
  accent: 'text-accent-700',
  secondary: 'text-secondary-700',
};

export default function ActiveDeliveriesPage() {
  const active = deliveries.filter((d) => d.status !== 'Completed');

  return (
    <ModuleShell
      title="Deliveries"
      description="Track active deliveries from pickup to drop-off."
      icon="ri-truck-line"
      subNav={deliveriesNav}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-4">
        {deliveryKpis.map((k) => (
          <div key={k.label} className={`rounded-lg border px-3.5 py-3 ${kpiTone[k.tone]}`}>
            <p className="text-[11px] uppercase tracking-wide text-foreground-400 font-medium whitespace-nowrap">{k.label}</p>
            <p className={`mt-1.5 text-2xl font-bold tabular leading-none ${kpiValue[k.tone]}`}>{k.value}</p>
            <p className="mt-1.5 text-[11px] text-foreground-500 whitespace-nowrap">{k.sub}</p>
          </div>
        ))}
      </div>

      <DeliveriesTable deliveries={active} />
    </ModuleShell>
  );
}