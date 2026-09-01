import { useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { settingsNav } from '@/pages/dashboard/nav';
import { companyDetails, operationalPreferences } from '@/mocks/settings';

export default function SettingsCompanyPage() {
  const [toast, setToast] = useState<string | null>(null);

  function save() {
    setToast('Company settings saved');
    window.setTimeout(() => setToast(null), 2400);
  }

  return (
    <ModuleShell
      title="Company"
      description="Configure your workspace identity, currency and operational preferences."
      icon="ri-building-2-line"
      subNav={settingsNav}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* company details */}
        <div className="xl:col-span-2 rounded-lg border border-background-200 bg-background-50">
          <div className="px-4 py-3 border-b border-background-200">
            <h2 className="text-sm font-semibold text-foreground-950">Company details</h2>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company name" value={companyDetails.name} />
            <Field label="Legal name" value={companyDetails.legalName} />
            <Field label="VAT ID" value={companyDetails.vatId} />
            <Field label="Registration" value={companyDetails.registration} />
            <div className="sm:col-span-2">
              <Field label="Address" value={companyDetails.address} />
            </div>
            <Field label="Website" value={companyDetails.website} />
            <Field label="Timezone" value={companyDetails.timezone} />
          </div>
        </div>

        {/* currency & units */}
        <div className="space-y-4">
          <div className="rounded-lg border border-background-200 bg-background-50">
            <div className="px-4 py-3 border-b border-background-200">
              <h2 className="text-sm font-semibold text-foreground-950">Currency &amp; region</h2>
            </div>
            <div className="p-4 space-y-4">
              <Field label="Currency" value={companyDetails.currency} />
              <div>
                <p className="text-[11px] font-medium text-foreground-400 mb-2">Operating countries</p>
                <div className="flex flex-wrap gap-1.5">
                  {companyDetails.countries.map((c) => (
                    <span key={c} className="text-[11px] font-medium text-foreground-700 bg-background-100 rounded-md px-2 py-1 whitespace-nowrap">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-background-200 bg-background-50">
            <div className="px-4 py-3 border-b border-background-200">
              <h2 className="text-sm font-semibold text-foreground-950">Units</h2>
            </div>
            <div className="p-4 space-y-4">
              <Field label="Volume" value={companyDetails.units.volume} />
              <Field label="Distance" value={companyDetails.units.distance} />
              <Field label="Weight" value={companyDetails.units.weight} />
            </div>
          </div>
        </div>
      </div>

      {/* operational preferences */}
      <div className="mt-4 rounded-lg border border-background-200 bg-background-50">
        <div className="px-4 py-3 border-b border-background-200">
          <h2 className="text-sm font-semibold text-foreground-950">Operational preferences</h2>
        </div>
        <div className="divide-y divide-background-100">
          {operationalPreferences.map((p) => (
            <div key={p.label} className="flex items-center justify-between px-4 py-3 gap-4">
              <span className="text-[13px] text-foreground-800">{p.label}</span>
              <span className="text-[13px] font-semibold text-foreground-950 whitespace-nowrap">{p.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* save */}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-5 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
        >
          <i className="ri-save-line text-sm leading-none" />
          Save changes
        </button>
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-foreground-400">{label}</span>
      <input
        type="text"
        defaultValue={value}
        className="mt-1 w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-300"
      />
    </label>
  );
}