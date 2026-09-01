import type { TerminalStatus } from '@/mocks/sourcing';

const statusStyle: Record<TerminalStatus, string> = {
  Operational: 'text-accent-700 bg-accent-100',
  Busy: 'text-secondary-700 bg-secondary-100',
  Limited: 'text-secondary-700 bg-secondary-100',
  Issue: 'text-red-600 bg-red-100',
};

const statusDot: Record<TerminalStatus, string> = {
  Operational: 'bg-accent-500',
  Busy: 'bg-secondary-500',
  Limited: 'bg-secondary-400',
  Issue: 'bg-red-500',
};

export default function TerminalStatusBadge({ status }: { status: TerminalStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}