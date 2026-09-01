import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { deliveriesNav } from '@/pages/dashboard/nav';
import { deliveries } from '@/mocks/deliveries';
import DeliveryStatusBadge from '../components/DeliveryStatusBadge';

type TabKey = 'overview' | 'route' | 'products' | 'documents' | 'timeline';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'route', label: 'Route' },
  { key: 'products', label: 'Products' },
  { key: 'documents', label: 'Documents' },
  { key: 'timeline', label: 'Timeline' },
];

const docStatusStyle: Record<string, string> = {
  Uploaded: 'text-accent-700 bg-accent-100',
  Pending: 'text-secondary-700 bg-secondary-100',
  Exception: 'text-red-600 bg-red-100',
};

const toneDot: Record<string, string> = {
  completed: 'bg-accent-500',
  current: 'bg-primary-500 ring-4 ring-primary-500/20',
  upcoming: 'bg-background-300',
  delayed: 'bg-secondary-500',
};

export default function DeliveryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>('overview');
  const delivery = deliveries.find((d) => d.id === id);

  if (!delivery) {
    return (
      <ModuleShell title="Delivery Details" description="Delivery details and record." icon="ri-truck-line" subNav={deliveriesNav}>
        <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-14 text-center">
          <i className="ri-truck-line text-foreground-300 text-3xl leading-none" />
          <p className="mt-3 text-sm font-medium text-foreground-600">Delivery not found</p>
          <Link
            to="/deliveries"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line text-sm leading-none" />
            Back to deliveries
          </Link>
        </div>
      </ModuleShell>
    );
  }

  const [pickup, destination] = delivery.route.split(' → ');

  return (
    <ModuleShell
      title={`Delivery ${delivery.order}`}
      description={`${delivery.customer} · ${delivery.route}`}
      icon="ri-truck-line"
      subNav={deliveriesNav}
    >
      <button
        type="button"
        onClick={() => navigate('/deliveries')}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground-500 hover:text-foreground-900 mb-4 cursor-pointer transition-colors whitespace-nowrap"
      >
        <i className="ri-arrow-left-line text-[13px] leading-none" />
        All deliveries
      </button>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <DeliveryStatusBadge status={delivery.status} />
        {delivery.exception && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-secondary-700 bg-secondary-100 whitespace-nowrap">
            <i className="ri-alert-line text-[10px] leading-none" />
            {delivery.exception}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 border-b border-background-200 overflow-x-auto">
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
        {tab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Customer', value: delivery.customer },
              { label: 'Product', value: delivery.product },
              { label: 'Volume', value: delivery.volume },
              { label: 'Delivery Window', value: delivery.window },
              { label: 'Driver', value: delivery.driver },
              { label: 'Truck', value: delivery.truck },
              { label: 'ETA', value: delivery.eta },
              { label: 'Location', value: delivery.location },
            ].map((f) => (
              <div key={f.label} className="rounded-lg border border-background-200 bg-background-50 p-3.5">
                <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">{f.label}</p>
                <p className="mt-1.5 text-[13px] font-semibold text-foreground-900 leading-snug">{f.value}</p>
              </div>
            ))}
            <div className="col-span-2 md:col-span-4 rounded-lg border border-background-200 bg-background-50 p-4">
              <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium mb-1">Driver Notes</p>
              <p className="text-[13px] text-foreground-700">{delivery.notes || 'No notes recorded.'}</p>
            </div>
          </div>
        )}

        {tab === 'route' && (
          <div className="rounded-lg border border-background-200 overflow-hidden bg-background-100">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-background-200 bg-background-100/40">
              <span className="text-[12px] font-semibold text-foreground-900">Route</span>
              <span className="text-[11px] font-medium text-foreground-400">{delivery.route}</span>
            </div>
            <div className="relative h-72 md:h-96">
              <iframe
                title={`Delivery ${delivery.order} route map`}
                src="https://maps.google.com/maps?q=Europe&z=6&output=embed"
                className="absolute inset-0 w-full h-full border-0 [filter:saturate(0.72)_contrast(1.02)]"
                loading="lazy"
                aria-label={`Route map ${delivery.route}`}
              />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute h-[2px] rounded-full bg-primary-500 opacity-60 origin-left" style={{ left: '20%', top: '38%', width: '30%', transform: 'rotate(18deg)' }} />
                <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: '20%', top: '38%' }}>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-500 ring-2 ring-background-50" />
                  <span className="mt-0.5 text-[8px] font-semibold text-foreground-700 bg-background-50/90 px-1 rounded whitespace-nowrap leading-tight">{pickup}</span>
                </div>
                <div className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center ring-2 ring-background-50" style={{ left: '50%', top: '50%' }}>
                  <i className="ri-truck-line text-background-50 text-[9px] leading-none" />
                </div>
                <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: '76%', top: '62%' }}>
                  <span className="w-3 h-3 rounded-full bg-accent-500 ring-4 ring-accent-500/25" />
                  <span className="mt-1 text-[8px] font-bold text-foreground-900 bg-background-50 px-1 rounded whitespace-nowrap leading-tight">{destination}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-background-200 bg-background-50 p-4">
              <h2 className="text-sm font-semibold text-foreground-950 mb-3">Product</h2>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-foreground-500">Product</span>
                  <span className="text-[13px] font-semibold text-foreground-900">{delivery.product}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-foreground-500">Volume</span>
                  <span className="text-[13px] font-semibold text-foreground-900 tabular">{delivery.volume}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-foreground-500">BOL</span>
                  <span className="text-[13px] font-semibold text-foreground-900 tabular">{delivery.bol}</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-background-200 bg-background-50 p-4">
              <h2 className="text-sm font-semibold text-foreground-950 mb-3">Delivery Record</h2>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-foreground-500">Proof of Delivery</span>
                  <span className="text-[13px] font-semibold text-foreground-900">{delivery.pod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-foreground-500">Customer Signature</span>
                  <span className="text-[13px] font-semibold text-foreground-900">{delivery.signature}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-foreground-500">Delivery Ticket</span>
                  <span className="text-[13px] font-semibold text-foreground-900 tabular">{delivery.deliveryTicket}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'documents' && (
          <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-background-200">
              <h2 className="text-sm font-semibold text-foreground-950">Documents</h2>
            </div>
            <div className="divide-y divide-background-100">
              {delivery.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-md bg-background-100 flex items-center justify-center shrink-0">
                      <i className="ri-file-text-line text-foreground-400 text-base leading-none" />
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-foreground-900">{doc.name}</p>
                      {doc.value !== '—' && <p className="text-[11px] text-foreground-400 tabular">{doc.value}</p>}
                    </div>
                  </div>
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${docStatusStyle[doc.status]}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'timeline' && (
          <div className="rounded-lg border border-background-200 bg-background-50 p-4 md:p-5">
            <h2 className="text-sm font-semibold text-foreground-950 mb-4">Timeline</h2>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-background-200" />
              <ul className="space-y-4">
                {delivery.timeline.map((ev, i) => (
                  <li key={i} className="relative flex items-start gap-3 pl-6">
                    <span className={`absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full ${toneDot[ev.state]}`} />
                    <div>
                      <span className="text-[13px] text-foreground-800">{ev.label}</span>
                      <span className="ml-2 text-[11px] text-foreground-400 tabular">{ev.time}</span>
                      {ev.state === 'current' && (
                        <span className="ml-2 inline-block text-[9px] font-bold text-primary-700 bg-primary-100 px-1.5 py-0.5 rounded-full align-middle">CURRENT</span>
                      )}
                      {ev.state === 'delayed' && (
                        <span className="ml-2 inline-block text-[9px] font-bold text-secondary-700 bg-secondary-100 px-1.5 py-0.5 rounded-full align-middle">DELAYED</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}