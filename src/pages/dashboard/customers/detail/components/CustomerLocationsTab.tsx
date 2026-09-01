import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/mocks/customers';

export default function CustomerLocationsTab({ customer }: { customer: Customer }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-background-200">
        <h2 className="text-sm font-semibold text-foreground-950">Delivery Locations</h2>
        <p className="text-[11px] text-foreground-400">{customer.locations.length} site{customer.locations.length === 1 ? '' : 's'}</p>
      </div>
      <div className="divide-y divide-background-200">
        {customer.locations.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => navigate(`/customers/locations/${l.id}`)}
            className="w-full flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 text-left hover:bg-background-100/50 transition-colors cursor-pointer"
          >
            <span className="w-9 h-9 rounded-md bg-background-200 flex items-center justify-center shrink-0">
              <i className="ri-map-pin-2-line text-foreground-500 text-[16px] leading-none" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-foreground-900">{l.name}</p>
              <p className="text-[11px] text-foreground-500">
                {l.address}, {l.city}, {l.country}
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <p className="text-[11px] text-foreground-500">{l.deliveryWindow}</p>
              <p className="text-[11px] text-foreground-400">
                {l.tanks.length} tank{l.tanks.length === 1 ? '' : 's'}
              </p>
            </div>
            <i className="ri-arrow-right-s-line text-foreground-400 text-lg leading-none" />
          </button>
        ))}
      </div>
    </div>
  );
}