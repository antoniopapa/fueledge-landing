import { useState } from 'react';
import { NAV_APPS, getNavApp, setNavApp, type NavAppId } from '@/pages/driver/navigation';

export default function NavigationScreen() {
  const [selected, setSelected] = useState<NavAppId>(getNavApp());

  function select(id: NavAppId) {
    setSelected(id);
    setNavApp(id);
  }

  return (
    <div className="space-y-3">
      <p className="px-1 text-sm text-foreground-500">
        Choose the app that opens when you tap Navigate on a stop. This becomes your default.
      </p>

      <div className="divide-y divide-background-100 rounded-lg border border-background-200 bg-background-50">
        {NAV_APPS.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => select(app.id)}
            className="flex w-full items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-background-100 transition-colors"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100">
              <i className={`${app.icon} text-primary-700 text-base leading-none`} />
            </span>
            <span className="flex-1 text-left text-sm font-medium text-foreground-800">{app.label}</span>
            {selected === app.id ? (
              <i className="ri-radio-button-line text-primary-600 text-lg leading-none" />
            ) : (
              <i className="ri-checkbox-blank-circle-line text-foreground-300 text-lg leading-none" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}