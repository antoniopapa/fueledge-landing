import type { Order, OrderDocument } from '@/mocks/orders';

const docStatusStyle: Record<OrderDocument['status'], string> = {
  Uploaded: 'text-accent-700 bg-accent-100',
  Pending: 'text-secondary-700 bg-secondary-100',
  Missing: 'text-foreground-400 bg-background-200',
};

export default function OrderDocumentsTab({ order }: { order: Order }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-background-200">
          <h2 className="text-sm font-semibold text-foreground-950">Documents</h2>
        </div>
        <div className="divide-y divide-background-100">
          {order.documents.map((doc, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-md bg-background-100 flex items-center justify-center shrink-0">
                  <i className="ri-file-text-line text-foreground-400 text-base leading-none" />
                </span>
                <div>
                  <p className="text-[13px] font-medium text-foreground-900">{doc.name}</p>
                  {doc.detail && <p className="text-[11px] text-foreground-400 tabular">{doc.detail}</p>}
                </div>
              </div>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${docStatusStyle[doc.status]}`}>
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-background-200 bg-background-50 p-3.5">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">BOL</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{order.bol}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-3.5">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Proof of Delivery</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground-900">{order.pod}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-3.5">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Customer Signature</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground-900">{order.signature}</p>
        </div>
        <div className="rounded-lg border border-background-200 bg-background-50 p-3.5">
          <p className="text-[10px] uppercase tracking-wide text-foreground-400 font-medium">Delivered Quantity</p>
          <p className="mt-1 text-[13px] font-semibold text-foreground-900 tabular">{order.deliveredQty}</p>
        </div>
      </div>
    </div>
  );
}