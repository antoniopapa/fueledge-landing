import { useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { settingsNav } from '@/pages/dashboard/nav';
import Toggle from '@/pages/dashboard/settings/components/Toggle';
import { notificationChannels } from '@/mocks/settings';

export default function SettingsNotificationsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationChannels.map((c) => [c.id, c.enabled])),
  );

  return (
    <ModuleShell
      title="Notifications"
      description="Choose what alerts you receive and where."
      icon="ri-notification-3-line"
      subNav={settingsNav}
    >
      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-background-200">
          <h2 className="text-sm font-semibold text-foreground-950">Alert categories</h2>
          <p className="text-[11px] text-foreground-400 mt-0.5">Enable or disable notifications per category.</p>
        </div>
        <div className="divide-y divide-background-100">
          {notificationChannels.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-foreground-900">{c.label}</p>
                <p className="text-[12px] text-foreground-500 mt-0.5">{c.description}</p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  {c.channels.map((ch) => (
                    <span key={ch} className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground-500 bg-background-100 rounded-full px-2 py-0.5 whitespace-nowrap">
                      <i className={`${ch === 'Email' ? 'ri-mail-line' : 'ri-bell-line'} text-[11px] leading-none`} />
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
              <Toggle checked={enabled[c.id]} onChange={(v) => setEnabled((s) => ({ ...s, [c.id]: v }))} label={c.label} />
            </div>
          ))}
        </div>
      </div>
    </ModuleShell>
  );
}