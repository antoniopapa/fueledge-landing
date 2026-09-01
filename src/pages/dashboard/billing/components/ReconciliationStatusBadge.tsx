import type { ReconciliationStatus } from '@/mocks/billing';

const style: Record<ReconciliationStatus, string> = {
  Matched: 'text-accent-700 bg-accent-100',
  'Needs Review': 'text-secondary-700 bg-secondary-100',
  'Missing BOL': 'text-foreground-500 bg-background-200',
  'Quantity Mismatch': 'text-secondary-700 bg-secondary-100',
  'Price Mismatch': 'text-secondary-700 bg-secondary-100',
  'Missing POD': 'text-foreground-500 bg-background-200',
};

const dot: Record<ReconciliationStatus, string> = {
  Matched: 'bg-accent-500',
  'Needs Review': 'bg-secondary-500',
  'Missing BOL': 'bg-background-400',
  'Quantity Mismatch': 'bg-secondary-500',
  'Price Mismatch': 'bg-secondary-500',
  'Missing POD': 'bg-background-400',
};

export default function ReconciliationStatusBadge({ status }: { status: ReconciliationStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${style[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}