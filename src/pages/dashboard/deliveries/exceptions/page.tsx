import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { deliveriesNav } from '@/pages/dashboard/nav';
import { deliveries } from '@/mocks/deliveries';
import DeliveriesTable from '../components/DeliveriesTable';

export default function ExceptionsDeliveriesPage() {
  const exceptions = deliveries.filter((d) => d.exception);

  return (
    <ModuleShell
      title="Delivery Exceptions"
      description="Review deliveries with exceptions or delays."
      icon="ri-alarm-warning-line"
      subNav={deliveriesNav}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-md bg-secondary-100 flex items-center justify-center">
          <i className="ri-alarm-warning-line text-secondary-700 text-sm leading-none" />
        </span>
        <span className="text-[12px] font-medium text-foreground-600">{exceptions.length} deliveries need attention</span>
      </div>
      <DeliveriesTable deliveries={exceptions} />
    </ModuleShell>
  );
}