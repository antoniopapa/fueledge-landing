import { useEffect, useState, type FormEvent } from 'react';
import { drivers } from '@/mocks/drivers';
import { trucks } from '@/mocks/fleet';
import { fetchProducts } from '@/mocks/schedule';

let nextOrderId = 2871;

type NewOrderModalProps = {
  onClose: () => void;
  onCreated: (orderId: string) => void;
};

export default function NewOrderModal({ onClose, onCreated }: NewOrderModalProps) {
  const [customer, setCustomer] = useState('');
  const [pickup, setPickup] = useState('');
  const [delivery, setDelivery] = useState('');
  const [products, setProducts] = useState<string[]>([]);
  const [product, setProduct] = useState('');
  const [volume, setVolume] = useState('');
  const [driver, setDriver] = useState('');
  const [truck, setTruck] = useState('');

  useEffect(() => {
    let mounted = true;

    fetchProducts()
      .then((apiProducts) => {
        if (!mounted) return;
        const names = apiProducts.map((item) => item.name);
        setProducts(names);
        setProduct((current) => current || names[0] || '');
      })
      .catch((error) => {
        console.error('Failed to load products for order form', error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = `#${nextOrderId++}`;
    onCreated(id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground-950/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg border border-background-200 bg-background-50 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground-950">New Order</h2>
            <p className="text-[12px] text-foreground-500 mt-0.5">Create a new fuel delivery run.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 cursor-pointer"
            aria-label="Close"
          >
            <i className="ri-close-line text-lg leading-none" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Customer</label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="e.g. Rhein-Main Logistics"
              required
              className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Pickup location</label>
              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="e.g. Rotterdam Terminal"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Delivery location</label>
              <input
                type="text"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                placeholder="e.g. Frankfurt"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Product</label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 cursor-pointer"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Volume (L)</label>
              <input
                type="text"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="e.g. 28,000"
                required
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Assign driver</label>
              <select
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {drivers
                  .filter((d) => d.status === 'Available' || d.status === 'Assigned')
                  .map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-foreground-700 mb-1.5">Assign truck</label>
              <select
                value={truck}
                onChange={(e) => setTruck(e.target.value)}
                className="w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {trucks
                  .filter((t) => t.status === 'Available' || t.status === 'Assigned')
                  .map((t) => (
                    <option key={t.id} value={t.plate}>
                      {t.plate} · {t.make} {t.model}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-foreground-600 hover:bg-background-100 whitespace-nowrap cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-add-line text-sm leading-none" />
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
