import { useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { settingsNav } from '@/pages/dashboard/nav';
import { integrationGroups, type Integration } from '@/mocks/settings';

const statusStyle: Record<Integration['status'], string> = {
  Connected: 'bg-accent-100 text-accent-700',
  Available: 'bg-secondary-100 text-secondary-700',
  'Not connected': 'bg-background-200 text-foreground-500',
};

export default function SettingsIntegrationsPage() {
  const [toast, setToast] = useState<string | null>(null);

  function connect(name: string) {
    setToast(`${name} connection requested`);
    window.setTimeout(() => setToast(null), 2400);
  }

  return (
    <ModuleShell
      title="Integrations"
      description="Connect accounting, telematics, pricing feeds and more."
      icon="ri-plug-line"
      subNav={settingsNav}
    >
      <div className="space-y-5">
        {integrationGroups.map((group) => (
          <div key={group.label}>
            <h2 className="text-[13px] font-semibold text-foreground-950 mb-2">{group.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {group.items.map((item) => {
                const connected = item.status === 'Connected';
                return (
                  <div key={item.name} className="rounded-lg border border-background-200 bg-background-50 p-4 flex flex-col">
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg bg-background-100 flex items-center justify-center shrink-0">
                        <i className={`${item.icon} text-foreground-500 text-lg leading-none`} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-foreground-950 truncate">{item.name}</p>
                        <span className={`inline-flex mt-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[item.status]}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2.5 text-[12px] text-foreground-500 leading-snug flex-1">{item.description}</p>
                    <button
                      type="button"
                      onClick={() => connect(item.name)}
                      className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-md text-[12px] font-semibold px-3 py-2 whitespace-nowrap cursor-pointer transition-colors ${
                        connected
                          ? 'border border-foreground-200 text-foreground-700 hover:bg-background-100'
                          : 'bg-primary-500 hover:bg-primary-600 text-background-50'
                      }`}
                    >
                      {connected ? (
                        <>
                          <i className="ri-settings-3-line text-sm leading-none" />
                          Manage
                        </>
                      ) : (
                        <>
                          <i className="ri-plug-line text-sm leading-none" />
                          Connect
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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