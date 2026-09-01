import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import OrderStatusBadge from '@/pages/dashboard/orders/components/OrderStatusBadge';
import OrderOverviewTab from './components/OrderOverviewTab';
import OrderSourcingTab from './components/OrderSourcingTab';
import OrderDeliveryTab from './components/OrderDeliveryTab';
import OrderPricingTab from './components/OrderPricingTab';
import OrderDocumentsTab from './components/OrderDocumentsTab';
import OrderActivityTab from './components/OrderActivityTab';
import { orders } from '@/mocks/orders';

type TabKey = 'overview' | 'sourcing' | 'delivery' | 'pricing' | 'documents' | 'activity';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'sourcing', label: 'Sourcing' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'documents', label: 'Documents' },
  { key: 'activity', label: 'Activity' },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('overview');
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <DashboardShell>
        <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-16 text-center">
          <i className="ri-file-list-3-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">Order not found</p>
          <Link
            to="/orders"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line text-sm leading-none" />
            Back to orders
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const canCompare = order.status === 'New' || order.status === 'Ready to Source' || order.status === 'Sourced';

  return (
    <DashboardShell>
      {/* header */}
      <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
        <button
          type="button"
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground-500 hover:text-foreground-900 mb-4 cursor-pointer transition-colors whitespace-nowrap"
        >
          <i className="ri-arrow-left-line text-[13px] leading-none" />
          All orders
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="w-14 h-14 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
              <i className="ri-file-list-3-line text-primary-700 text-2xl leading-none" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground-950">Order #{order.id}</h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-0.5 text-[13px] text-foreground-500">
                {order.customer} · {order.destination}
              </p>
              <p className="mt-1 text-[12px] text-foreground-400">
                {order.product} · {order.volume} · Created {order.createdAt}
              </p>
            </div>
          </div>

          {canCompare && (
            <button
              type="button"
              onClick={() => setTab('sourcing')}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-flask-line text-sm leading-none" />
              Compare Sources
            </button>
          )}
        </div>
      </div>

      {/* tabs */}
      <div className="mt-4 flex items-center gap-1 border-b border-background-200 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`relative px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              tab === t.key ? 'text-primary-700' : 'text-foreground-500 hover:text-foreground-900'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'overview' && <OrderOverviewTab order={order} onGotoSourcing={() => setTab('sourcing')} />}
        {tab === 'sourcing' && <OrderSourcingTab order={order} />}
        {tab === 'delivery' && <OrderDeliveryTab order={order} />}
        {tab === 'pricing' && <OrderPricingTab order={order} />}
        {tab === 'documents' && <OrderDocumentsTab order={order} />}
        {tab === 'activity' && <OrderActivityTab order={order} />}
      </div>
    </DashboardShell>
  );
}