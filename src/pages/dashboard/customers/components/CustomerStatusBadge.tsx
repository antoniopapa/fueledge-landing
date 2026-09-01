import type { AccountStatus } from '@/mocks/customers';

const statusStyle: Record<AccountStatus, string> = {
  Active: 'text-accent-700 bg-accent-100',
  'Credit Warning': 'text-secondary-700 bg-secondary-100',
  'On Hold': 'text-foreground-500 bg-background-200',
  Inactive: 'text-foreground-500 bg-background-200',
};

const statusDot: Record<AccountStatus, string> = {
  Active: 'bg-accent-500',
  'Credit Warning': 'bg-secondary-500',
  'On Hold': 'bg-background-400',
  Inactive: 'bg-background-300',
};

export default function CustomerStatusBadge({ status }: { status: AccountStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}