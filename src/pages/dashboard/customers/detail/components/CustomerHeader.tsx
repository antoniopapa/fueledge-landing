import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/mocks/customers';
import CustomerStatusBadge from '@/pages/dashboard/customers/components/CustomerStatusBadge';

export default function CustomerHeader({ customer }: { customer: Customer }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
      <button
        type="button"
        onClick={() => navigate('/customers')}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground-500 hover:text-foreground-900 mb-4 cursor-pointer transition-colors whitespace-nowrap"
      >
        <i className="ri-arrow-left-line text-[13px] leading-none" />
        All customers
      </button>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="w-14 h-14 rounded-md bg-primary-100 flex items-center justify-center shrink-0">
            <i className="ri-team-line text-primary-700 text-2xl leading-none" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground-950">{customer.name}</h1>
              <CustomerStatusBadge status={customer.accountStatus} />
            </div>
            <p className="mt-0.5 text-[13px] text-foreground-500">{customer.type}</p>
            <div className="mt-1.5 flex items-center gap-3 text-[12px] text-foreground-500 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-user-line text-foreground-400 text-[13px]" />
                {customer.mainContacts[0]?.name}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="ri-map-pin-line text-foreground-400 text-[13px]" />
                {customer.locations.length} site{customer.locations.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Open Orders</p>
            <p className="text-[14px] font-semibold text-foreground-900 tabular">{customer.openOrders}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Outstanding</p>
            <p className={`text-[14px] font-semibold tabular ${customer.accountStatus === 'Credit Warning' ? 'text-secondary-700' : 'text-foreground-900'}`}>
              {customer.outstandingBalance}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Last Delivery</p>
            <p className="text-[14px] font-semibold text-foreground-900">{customer.lastDelivery}</p>
          </div>
        </div>
      </div>
    </div>
  );
}