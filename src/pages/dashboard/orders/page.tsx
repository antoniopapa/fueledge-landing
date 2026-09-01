import { useMemo, useState } from 'react';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import OrderKpis from '@/pages/dashboard/orders/components/OrderKpis';
import OrderFilters from '@/pages/dashboard/orders/components/OrderFilters';
import OrdersTable from '@/pages/dashboard/orders/components/OrdersTable';
import NewOrderModal from '@/pages/dashboard/components/NewOrderModal';
import { orders, type OrderStatus } from '@/mocks/orders';

export default function OrdersPage() {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [search, setSearch] = useState('');
  const [product, setProduct] = useState('');
  const [source, setSource] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const productOptions = useMemo(
    () => Array.from(new Set(orders.map((o) => o.product))).sort(),
    [],
  );
  const sourceOptions = useMemo(
    () => Array.from(new Set(orders.map((o) => o.source).filter((s) => s !== '—'))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (status && o.status !== status) return false;
      if (product && o.product !== product) return false;
      if (source && o.source !== source) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const hay = `#${o.id} ${o.customer} ${o.destination} ${o.product} ${o.source} ${o.assignedRun ?? ''} ${o.driver}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [status, product, source, search]);

  function handleCreated(orderId: string) {
    setModalOpen(false);
    setToast(`Order ${orderId} created`);
    window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <DashboardShell>
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground-950">Orders</h1>
          <p className="text-sm text-foreground-500 mt-0.5">
            Manage orders from creation through sourcing, dispatch, and delivery.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
        >
          <i className="ri-add-line text-sm leading-none" />
          New Order
        </button>
      </div>

      {/* KPIs */}
      <OrderKpis />

      {/* filters */}
      <div className="mt-4">
        <OrderFilters
          status={status}
          onStatus={setStatus}
          search={search}
          onSearch={setSearch}
          product={product}
          onProduct={setProduct}
          source={source}
          onSource={setSource}
          productOptions={productOptions}
          sourceOptions={sourceOptions}
          resultCount={filtered.length}
        />
      </div>

      {/* table */}
      <div className="mt-4">
        {filtered.length > 0 ? (
          <OrdersTable orders={filtered} />
        ) : (
          <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-12 text-center">
            <i className="ri-file-list-3-line text-foreground-300 text-3xl leading-none" />
            <p className="mt-3 text-sm font-medium text-foreground-600">No orders match your filters</p>
            <p className="text-xs text-foreground-400 mt-1">Try adjusting your search or clearing a filter.</p>
          </div>
        )}
      </div>

      {modalOpen && <NewOrderModal onClose={() => setModalOpen(false)} onCreated={handleCreated} />}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          {toast}
        </div>
      )}
    </DashboardShell>
  );
}