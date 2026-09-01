import type { InvoiceStatus } from '@/mocks/billing';

const style: Record<InvoiceStatus, string> = {
  Draft: 'text-foreground-500 bg-background-200',
  Sent: 'text-primary-700 bg-primary-100',
  Paid: 'text-accent-700 bg-accent-100',
  Overdue: 'text-secondary-700 bg-secondary-100',
  Disputed: 'text-secondary-700 bg-secondary-100',
};

const dot: Record<InvoiceStatus, string> = {
  Draft: 'bg-background-400',
  Sent: 'bg-primary-500',
  Paid: 'bg-accent-500',
  Overdue: 'bg-secondary-500',
  Disputed: 'bg-secondary-500',
};

export default function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${style[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}