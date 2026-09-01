import type { Customer } from '@/mocks/customers';

interface Doc {
  name: string;
  type: string;
  date: string;
  status: 'On file' | 'Pending' | 'Expiring';
}

function docsFor(customer: Customer): Doc[] {
  return [
    { name: 'Master Service Agreement', type: 'Contract', date: customer.contract === '12-month volume contract' ? '01 Jan 2026' : '01 Apr 2026', status: 'On file' },
    { name: 'Credit Application', type: 'Finance', date: '15 Nov 2025', status: customer.accountStatus === 'Credit Warning' ? 'Pending' : 'On file' },
    { name: 'Insurance Certificate', type: 'Compliance', date: '20 Jun 2026', status: 'On file' },
    { name: 'ADR / Dangerous Goods Permit', type: 'Compliance', date: '01 Mar 2026', status: 'On file' },
    { name: 'VAT / Tax Registration', type: 'Compliance', date: '01 Jan 2026', status: 'On file' },
    { name: 'Site Safety Acknowledgement', type: 'Operations', date: '10 Jul 2026', status: 'Expiring' },
  ];
}

const statusStyle: Record<Doc['status'], string> = {
  'On file': 'text-accent-700 bg-accent-100',
  Pending: 'text-secondary-700 bg-secondary-100',
  Expiring: 'text-secondary-700 bg-secondary-100',
};

export default function CustomerDocumentsTab({ customer }: { customer: Customer }) {
  const docs = docsFor(customer);

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-background-200">
        <h2 className="text-sm font-semibold text-foreground-950">Documents</h2>
        <p className="text-[11px] text-foreground-400">{docs.length} documents on file</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="border-b border-background-200 bg-background-100/40">
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Document</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Type</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Updated</th>
              <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background-200">
            {docs.map((d) => (
              <tr key={d.name} className="hover:bg-background-100/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-md bg-background-200 flex items-center justify-center shrink-0">
                      <i className="ri-file-text-line text-foreground-500 text-[14px] leading-none" />
                    </span>
                    <span className="text-[12px] font-medium text-foreground-900 whitespace-nowrap">{d.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.type}</td>
                <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{d.date}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[d.status]}`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}