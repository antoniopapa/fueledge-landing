import type { CustomerLocation } from '@/mocks/customers';

export default function LocationInstructionsTab({ location }: { location: CustomerLocation }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-lg border border-background-200 bg-background-50 p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-8 h-8 rounded-md bg-secondary-100 flex items-center justify-center">
            <i className="ri-alert-line text-secondary-700 text-base leading-none" />
          </span>
          <h2 className="text-sm font-semibold text-foreground-950">Access Restrictions</h2>
        </div>
        <p className="text-[13px] text-foreground-700">{location.accessRestrictions}</p>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 p-4">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-8 h-8 rounded-md bg-primary-100 flex items-center justify-center">
            <i className="ri-truck-line text-primary-700 text-base leading-none" />
          </span>
          <h2 className="text-sm font-semibold text-foreground-950">Driver Instructions</h2>
        </div>
        <p className="text-[13px] text-foreground-700">{location.driverInstructions}</p>
      </div>

      <div className="rounded-lg border border-background-200 bg-background-50 p-4 lg:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Opening Hours</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900">{location.openingHours}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Delivery Window</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900">{location.deliveryWindow}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Site Contact</p>
            <p className="mt-1 text-[13px] font-semibold text-foreground-900">{location.siteContact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}