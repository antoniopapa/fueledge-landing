import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { deliveriesNav } from '@/pages/dashboard/nav';
import { deliveries } from '@/mocks/deliveries';
import DeliveriesTable from '../components/DeliveriesTable';

export default function CompletedDeliveriesPage() {
  const completed = deliveries.filter((d) => d.status === 'Completed');

  return (
    <ModuleShell
      title="Completed Deliveries"
      description="Review deliveries that have been completed."
      icon="ri-checkbox-circle-line"
      subNav={deliveriesNav}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[12px] font-medium text-foreground-600">{completed.length} completed deliveries</span>
      </div>
      <DeliveriesTable deliveries={completed} />
    </ModuleShell>
  );
}