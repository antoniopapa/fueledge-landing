import type { CustomerLocation } from '@/mocks/customers';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">{label}</p>
      <p className="mt-1 text-[13px] font-semibold text-foreground-900">{value}</p>
    </div>
  );
}

export default function LocationOverviewTab({ location }: { location: CustomerLocation }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-lg border border-background-200 bg-background-50 p-4">
        <h2 className="text-sm font-semibold text-foreground-950 mb-3">Site Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Site Contact" value={location.siteContact} />
          <Field label="Opening Hours" value={location.openingHours} />
          <Field label="Delivery Window" value={location.deliveryWindow} />
          <Field label="Last Delivery" value={location.lastDelivery} />
          <Field label="Next Delivery" value={location.nextDelivery} />
          <Field label="Tanks" value={`${location.tanks.length} installed`} />
        </div>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {location.products.map((p) => (
            <span
              key={p}
              className="text-[12px] font-medium text-foreground-700 bg-background-100 px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 p-4">
        <h2 className="text-sm font-semibold text-foreground-950 mb-3">Access &amp; Instructions</h2>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Access Restrictions</p>
            <p className="mt-1 text-[12px] text-foreground-700">{location.accessRestrictions}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Driver Instructions</p>
            <p className="mt-1 text-[12px] text-foreground-700">{location.driverInstructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}