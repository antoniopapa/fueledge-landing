import { useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { settingsNav } from '@/pages/dashboard/nav';
import { dataFeeds } from '@/mocks/settings';

const feedStatus: Record<string, string> = {
  Healthy: 'bg-accent-100 text-accent-700',
  Degraded: 'bg-secondary-100 text-secondary-700',
  Paused: 'bg-background-200 text-foreground-500',
};

export default function SettingsDataPage() {
  const [toast, setToast] = useState<string | null>(null);

  function trigger(action: string) {
    setToast(action);
    window.setTimeout(() => setToast(null), 2400);
  }

  return (
    <ModuleShell
      title="Data &amp; Imports"
      description="Import, export and manage external data feeds."
      icon="ri-database-2-line"
      subNav={settingsNav}
    >
      {/* import / export */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ActionCard
          icon="ri-upload-2-line"
          title="Import data"
          description="Upload orders, customers or terminals from a CSV or Excel file."
          action={() => trigger('Import started')}
          button="Import"
        />
        <ActionCard
          icon="ri-download-2-line"
          title="Export data"
          description="Export orders, deliveries or billing records to a file."
          action={() => trigger('Export queued')}
          button="Export"
        />
        <ActionCard
          icon="ri-file-code-line"
          title="API access"
          description="Generate credentials to read and write via the REST API."
          action={() => trigger('API credentials generated')}
          button="Manage API"
        />
      </div>

      {/* external feeds */}
      <div className="mt-4 rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-background-200">
          <h2 className="text-sm font-semibold text-foreground-950">External data feeds</h2>
          <p className="text-[11px] text-foreground-400 mt-0.5">Automated inbound and outbound data synchronizations.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[760px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Feed</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Type</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Direction</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Frequency</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Last sync</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {dataFeeds.map((f) => (
                <tr key={f.name} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3 text-[13px] font-medium text-foreground-900 whitespace-nowrap">{f.name}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{f.type}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{f.direction}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-600 whitespace-nowrap">{f.frequency}</td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500 tabular whitespace-nowrap">{f.lastSync}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${feedStatus[f.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        f.status === 'Healthy' ? 'bg-accent-500' : f.status === 'Degraded' ? 'bg-secondary-500' : 'bg-foreground-400'
                      }`} />
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          {toast}
        </div>
      )}
    </ModuleShell>
  );
}

function ActionCard({ icon, title, description, action, button }: { icon: string; title: string; description: string; action: () => void; button: string }) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-4 flex flex-col">
      <span className="w-9 h-9 rounded-lg bg-background-100 flex items-center justify-center">
        <i className={`${icon} text-foreground-500 text-lg leading-none`} />
      </span>
      <h3 className="mt-3 text-[13px] font-semibold text-foreground-950">{title}</h3>
      <p className="mt-1 text-[12px] text-foreground-500 leading-snug flex-1">{description}</p>
      <button
        type="button"
        onClick={action}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-[12px] font-semibold px-3 py-2 whitespace-nowrap cursor-pointer transition-colors"
      >
        {button}
      </button>
    </div>
  );
}