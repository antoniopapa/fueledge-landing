import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import { replaceScheduleRuns, useScheduleRuns } from '@/pages/dashboard/dispatch/dispatchStore';
import { fetchCustomers, fetchProducts, fetchScheduleRuns, fetchSuppliers, fetchTerminals } from '@/mocks/schedule';
import { customers as mockCustomers } from '@/mocks/customers';
import { trailers, trucks } from '@/mocks/fleet';
import { suppliers as mockSuppliers, terminals as mockTerminals } from '@/mocks/sourcing';
import { products as mockProducts } from '@/mocks/settings';

type Priority = 'Low' | 'Normal' | 'High' | 'Critical';

interface PickupProduct {
  id: string;
  productId: string;
  supplier: string;
  expectedGrossQuantity: string;
}

interface Pickup {
  kind: 'pickup';
  id: string;
  terminal: string;
  expanded: boolean;
  notesVisible: boolean;
  notes: string;
  products: PickupProduct[];
}

interface DeliveryProduct {
  id: string;
  product: string;
  expectedGrossQuantity: string;
}

interface Delivery {
  kind: 'delivery';
  id: string;
  customer: string;
  expanded: boolean;
  notesVisible: boolean;
  notes: string;
  products: DeliveryProduct[];
}

type Stop = Pickup | Delivery;

interface ApiDriver {
  id: string;
  name: string;
}

const priorities: Priority[] = ['Normal', 'High', 'Critical', 'Low'];
const priorityLabelKeys: Record<Priority, string> = {
  Low: 'dashboard.dispatch.new.priorities.low',
  Normal: 'dashboard.dispatch.new.priorities.normal',
  High: 'dashboard.dispatch.new.priorities.high',
  Critical: 'dashboard.dispatch.new.priorities.critical',
};
function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function inputClass() {
  return 'w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100';
}

function labelClass() {
  return 'text-[11px] font-semibold uppercase tracking-wide text-foreground-400';
}

function emptyPickupProduct(): PickupProduct {
  return {
    id: makeId('pickup-product'),
    productId: 'Diesel EN590',
    supplier: '',
    expectedGrossQuantity: '',
  };
}

function emptyPickup(): Pickup {
  return {
    kind: 'pickup',
    id: makeId('pickup'),
    terminal: '',
    expanded: true,
    notesVisible: false,
    notes: '',
    products: [emptyPickupProduct()],
  };
}

function emptyDeliveryProduct(): DeliveryProduct {
  return {
    id: makeId('delivery-product'),
    product: 'Diesel EN590',
    expectedGrossQuantity: '',
  };
}

function emptyDelivery(): Delivery {
  return {
    kind: 'delivery',
    id: makeId('delivery'),
    customer: '',
    expanded: true,
    notesVisible: false,
    notes: '',
    products: [emptyDeliveryProduct()],
  };
}

function totalExpectedVolume(pickups: Pickup[]) {
  const total = pickups.flatMap((pickup) => pickup.products).reduce((sum, product) => {
    const value = Number(product.expectedGrossQuantity.replace(/,/g, ''));
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  return total > 0 ? `${total.toLocaleString()} L` : '0 L';
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function NewSchedulePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: editRunId } = useParams();
  const scheduleRuns = useScheduleRuns();
  const editRun = editRunId ? scheduleRuns.find((run) => run.id === editRunId) ?? null : null;
  const isEditMode = Boolean(editRunId);
  const truckPlates = useMemo(() => trucks.map((truck) => truck.plate), []);
  const trailerPlates = useMemo(() => trailers.map((trailer) => trailer.plate), []);
  const [terminalNames, setTerminalNames] = useState(() => mockTerminals.map((terminal) => terminal.name));
  const [supplierNames, setSupplierNames] = useState(() => mockSuppliers.map((supplier) => supplier.name));
  const [productOptions, setProductOptions] = useState(() => mockProducts.map((product) => product.name));
  const [customerNames, setCustomerNames] = useState(() => mockCustomers.map((customer) => customer.name));

  const [drivers, setDrivers] = useState<ApiDriver[]>([]);
  const [driverId, setDriverId] = useState('');
  const [truck, setTruck] = useState(truckPlates[0] ?? '');
  const [trailer, setTrailer] = useState(trailerPlates[0] ?? '');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [stops, setStops] = useState<Stop[]>([emptyPickup(), emptyDelivery()]);
  const selectedDriver = drivers.find((driver) => driver.id === driverId);

  useEffect(() => {
    if (!editRunId || editRun || scheduleRuns.length > 0) return;

    let active = true;

    fetchScheduleRuns()
      .then((apiRuns) => {
        if (active) replaceScheduleRuns(apiRuns);
      })
      .catch((error) => {
        console.error('Failed to load scheduled runs', error);
      });

    return () => {
      active = false;
    };
  }, [editRun, editRunId, scheduleRuns.length]);

  useEffect(() => {
    if (!editRun) return;

    setTruck(editRun.truckPlate);
    setStartTime(editRun.startTime);
    setEndTime(editRun.endTime);
    setPriority(editRun.status === 'Conflict' ? 'Critical' : 'Normal');
    setStops([
      {
        ...emptyPickup(),
        terminal: editRun.pickup,
        products: [{ ...emptyPickupProduct(), productId: editRun.product, expectedGrossQuantity: editRun.volume }],
      },
      {
        ...emptyDelivery(),
        customer: editRun.delivery,
        products: [{ ...emptyDeliveryProduct(), product: editRun.product, expectedGrossQuantity: editRun.volume }],
      },
    ]);
  }, [editRun]);

  useEffect(() => {
    let cancelled = false;

    async function loadDrivers() {
      try {
        const response = await fetch('https://fueledge-api.vercel.app/api/drivers');
        if (!response.ok) throw new Error(`Failed to load drivers: ${response.status}`);
        const data = await response.json();
        const records = Array.isArray(data) ? data : Array.isArray(data?.drivers) ? data.drivers : Array.isArray(data?.data) ? data.data : [];
        const loadedDrivers = records
          .map((driver: { id?: string | number; _id?: string | number; name?: string; fullName?: string }) => ({
            id: String(driver.id ?? driver._id ?? ''),
            name: driver.name ?? driver.fullName ?? '',
          }))
          .filter((driver: ApiDriver) => driver.id && driver.name);

        if (!cancelled) {
          setDrivers(loadedDrivers);
          setDriverId((current) => current || loadedDrivers.find((driver) => driver.name === editRun?.driverName)?.id || loadedDrivers[0]?.id || '');
        }
      } catch (error) {
        console.error('Failed to load drivers', error);
      }
    }

    loadDrivers();

    return () => {
      cancelled = true;
    };
  }, [editRun?.driverName]);

  useEffect(() => {
    let active = true;

    Promise.allSettled([fetchTerminals(), fetchSuppliers(), fetchProducts(), fetchCustomers()]).then(([terminalsResult, suppliersResult, productsResult, customersResult]) => {
      if (!active) return;

      if (terminalsResult.status === 'fulfilled') setTerminalNames(terminalsResult.value.map((terminal) => terminal.name));
      else console.error('Failed to load terminals for schedule form', terminalsResult.reason);

      if (suppliersResult.status === 'fulfilled') setSupplierNames(suppliersResult.value.map((supplier) => supplier.name));
      else console.error('Failed to load suppliers for schedule form', suppliersResult.reason);

      if (productsResult.status === 'fulfilled') setProductOptions(productsResult.value.map((product) => product.name));
      else console.error('Failed to load products for schedule form', productsResult.reason);

      if (customersResult.status === 'fulfilled') setCustomerNames(customersResult.value.map((customer) => customer.name));
      else console.error('Failed to load customers for schedule form', customersResult.reason);
    });

    return () => {
      active = false;
    };
  }, []);

  function updatePickup(id: string, patch: Partial<Pickup>) {
    setStops((items) => items.map((item) => (item.kind === 'pickup' && item.id === id ? { ...item, ...patch } : item)));
  }

  function updatePickupProduct(pickupId: string, productId: string, patch: Partial<PickupProduct>) {
    setStops((items) =>
      items.map((stop) =>
        stop.kind === 'pickup' && stop.id === pickupId
          ? { ...stop, products: stop.products.map((product) => (product.id === productId ? { ...product, ...patch } : product)) }
          : stop,
      ),
    );
  }

  function updateDelivery(id: string, patch: Partial<Delivery>) {
    setStops((items) => items.map((item) => (item.kind === 'delivery' && item.id === id ? { ...item, ...patch } : item)));
  }

  function updateDeliveryProduct(deliveryId: string, productId: string, patch: Partial<DeliveryProduct>) {
    setStops((items) =>
      items.map((stop) =>
        stop.kind === 'delivery' && stop.id === deliveryId
          ? { ...stop, products: stop.products.map((product) => (product.id === productId ? { ...product, ...patch } : product)) }
          : stop,
      ),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pickups = stops.filter((stop): stop is Pickup => stop.kind === 'pickup');

    const payload = {
      id: editRunId,
      driverId,
      driverName: selectedDriver?.name ?? editRun?.driverName ?? '',
      truck,
      trailer,
      priority,
      startTime,
      endTime,
      volume: totalExpectedVolume(pickups),
      stops: stops.map((stop, index) => ({
        sequence: index + 1,
        kind: stop.kind,
        destination: stop.kind === 'pickup' ? stop.terminal : stop.customer,
        notes: stop.notes,
        products: stop.products.map((product) =>
          stop.kind === 'pickup'
            ? {
                productId: product.productId,
                supplier: product.supplier,
                expectedGrossQuantity: product.expectedGrossQuantity,
              }
            : {
                product: product.product,
                expectedGrossQuantity: product.expectedGrossQuantity,
          },
        ),
      })),
    };

    try {
      const response = await fetch(isEditMode ? `https://fueledge-api.vercel.app/api/loads/${editRunId}` : 'https://fueledge-api.vercel.app/api/loads', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Failed to create load: ${response.status}`);

      navigate('/dispatch');
    } catch (error) {
      console.error('Failed to create run schedule', error);
    }
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <Link to="/dispatch" className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground-500 transition-colors hover:text-foreground-900">
          <i className="ri-arrow-left-line text-[13px] leading-none" />
          {t('dashboard.dispatch.new.backToSchedule')}
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-lg border border-background-200 bg-background-50 p-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                <i className="ri-route-line text-lg leading-none" />
              </span>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground-950">
                  {isEditMode ? `Edit run ${editRunId}` : t('dashboard.dispatch.new.title')}
                </h1>
                <p className="text-sm text-foreground-500">{t('dashboard.dispatch.new.description')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
              <Field label={t('dashboard.dispatch.schedule.driver')}>
                <select className={inputClass()} value={driverId} onChange={(e) => setDriverId(e.target.value)} required>
                  <option value="">{t('dashboard.dispatch.schedule.driver')}</option>
                  {drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
                </select>
              </Field>
              <Field label={t('dashboard.dispatch.schedule.truck')}><input className={inputClass()} value={truck} onChange={(e) => setTruck(e.target.value)} list="trucks" required /></Field>
              <Field label={t('dashboard.dispatch.new.trailer')}><input className={inputClass()} value={trailer} onChange={(e) => setTrailer(e.target.value)} list="trailers" required /></Field>
              <Field label={t('dashboard.dispatch.new.priority')}>
                <select className={inputClass()} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                  {priorities.map((item) => <option key={item} value={item}>{t(priorityLabelKeys[item])}</option>)}
                </select>
              </Field>
              <Field label={t('dashboard.dispatch.new.startTime')}><input className={inputClass()} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></Field>
              <Field label={t('dashboard.dispatch.new.endTime')}><input className={inputClass()} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required /></Field>
            </div>

            <datalist id="trucks">{truckPlates.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="trailers">{trailerPlates.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="terminals">{terminalNames.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="suppliers">{supplierNames.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="customers">{customerNames.map((item) => <option key={item} value={item} />)}</datalist>
          </section>

          <div className="space-y-4">
            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" onClick={() => setStops((items) => [...items, emptyPickup()])} className="inline-flex items-center gap-1 rounded-md border border-background-200 px-3 py-1.5 text-xs font-semibold text-foreground-700 transition-colors hover:bg-background-100">
                <i className="ri-download-2-line text-sm leading-none" />
                {t('dashboard.dispatch.new.add')} {t('dashboard.dispatch.schedule.pickup')}
              </button>
              <button type="button" onClick={() => setStops((items) => [...items, emptyDelivery()])} className="inline-flex items-center gap-1 rounded-md border border-background-200 px-3 py-1.5 text-xs font-semibold text-foreground-700 transition-colors hover:bg-background-100">
                <i className="ri-upload-2-line text-sm leading-none" />
                {t('dashboard.dispatch.new.add')} {t('dashboard.dispatch.schedule.delivery')}
              </button>
            </div>
            <div className="relative space-y-4 before:absolute before:bottom-4 before:left-1/2 before:top-4 before:w-px before:-translate-x-1/2 before:bg-background-300">
              {stops.map((stop, index) =>
                stop.kind === 'pickup' ? (
                  <StopCard
                    key={stop.id}
                    title={t('dashboard.dispatch.new.pickupNumber', { number: index + 1 })}
                    summary={stop.terminal || t('dashboard.dispatch.new.terminal')}
                    expanded={stop.expanded}
                    onToggle={() => updatePickup(stop.id, { expanded: !stop.expanded })}
                    onMoveUp={index > 0 ? () => setStops((items) => moveItem(items, index, index - 1)) : undefined}
                    onMoveDown={index < stops.length - 1 ? () => setStops((items) => moveItem(items, index, index + 1)) : undefined}
                    removeLabel={t('dashboard.dispatch.new.remove')}
                    onRemove={stops.length > 1 ? () => setStops((items) => items.filter((item) => item.id !== stop.id)) : undefined}
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <Field label={t('dashboard.dispatch.new.terminal')}><input className={inputClass()} value={stop.terminal} onChange={(e) => updatePickup(stop.id, { terminal: e.target.value })} list="terminals" required /></Field>
                    </div>
                    {stop.notesVisible ? (
                      <Field label={t('dashboard.dispatch.new.notes')}>
                        <textarea className={`${inputClass()} min-h-24 resize-y`} value={stop.notes} onChange={(e) => updatePickup(stop.id, { notes: e.target.value })} placeholder={t('dashboard.dispatch.new.loadingInstructions')} />
                      </Field>
                    ) : (
                      <button type="button" onClick={() => updatePickup(stop.id, { notesVisible: true })} className="mt-3 ml-auto flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50">
                        <i className="ri-add-line text-sm leading-none" />
                        {t('dashboard.dispatch.new.addNotes')}
                      </button>
                    )}

                    <NestedHeader title={t('dashboard.dispatch.new.pickupProducts')} addLabel={t('dashboard.dispatch.new.addProduct')} onAdd={() => updatePickup(stop.id, { products: [...stop.products, emptyPickupProduct()] })} />
                    {stop.products.map((product, productIndex) => (
                      <div key={product.id} className="mt-3 rounded-md border border-background-200 p-3">
                        <ProductHeader title={t('dashboard.dispatch.new.productNumber', { number: productIndex + 1 })} removeLabel={t('dashboard.dispatch.new.remove')} onRemove={stop.products.length > 1 ? () => updatePickup(stop.id, { products: stop.products.filter((item) => item.id !== product.id) }) : undefined} />
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                          <Field label={t('dashboard.dispatch.new.productId')}><select className={inputClass()} value={product.productId} onChange={(e) => updatePickupProduct(stop.id, product.id, { productId: e.target.value })}>{productOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
                          <Field label={t('dashboard.dispatch.new.supplier')}><input className={inputClass()} value={product.supplier} onChange={(e) => updatePickupProduct(stop.id, product.id, { supplier: e.target.value })} list="suppliers" /></Field>
                          <QuantityField label={t('dashboard.dispatch.new.expectedGrossQuantity')} value={product.expectedGrossQuantity} onChange={(value) => updatePickupProduct(stop.id, product.id, { expectedGrossQuantity: value })} />
                        </div>
                      </div>
                    ))}
                  </StopCard>
                ) : (
                  <StopCard
                    key={stop.id}
                    title={t('dashboard.dispatch.new.deliveryNumber', { number: index + 1 })}
                    summary={stop.customer || t('dashboard.dispatch.new.customer')}
                    expanded={stop.expanded}
                    onToggle={() => updateDelivery(stop.id, { expanded: !stop.expanded })}
                    onMoveUp={index > 0 ? () => setStops((items) => moveItem(items, index, index - 1)) : undefined}
                    onMoveDown={index < stops.length - 1 ? () => setStops((items) => moveItem(items, index, index + 1)) : undefined}
                    removeLabel={t('dashboard.dispatch.new.remove')}
                    onRemove={stops.length > 1 ? () => setStops((items) => items.filter((item) => item.id !== stop.id)) : undefined}
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <Field label={t('dashboard.dispatch.new.customer')}><input className={inputClass()} value={stop.customer} onChange={(e) => updateDelivery(stop.id, { customer: e.target.value })} list="customers" required /></Field>
                    </div>
                    {stop.notesVisible ? (
                      <Field label={t('dashboard.dispatch.new.notes')}>
                        <textarea className={`${inputClass()} min-h-24 resize-y`} value={stop.notes} onChange={(e) => updateDelivery(stop.id, { notes: e.target.value })} />
                      </Field>
                    ) : (
                      <button type="button" onClick={() => updateDelivery(stop.id, { notesVisible: true })} className="mt-3 ml-auto flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50">
                        <i className="ri-add-line text-sm leading-none" />
                        {t('dashboard.dispatch.new.addNotes')}
                      </button>
                    )}

                    <NestedHeader title={t('dashboard.dispatch.new.deliveryProducts')} addLabel={t('dashboard.dispatch.new.addProduct')} onAdd={() => updateDelivery(stop.id, { products: [...stop.products, emptyDeliveryProduct()] })} />
                    {stop.products.map((product, productIndex) => (
                      <div key={product.id} className="mt-3 rounded-md border border-background-200 p-3">
                        <ProductHeader title={t('dashboard.dispatch.new.productNumber', { number: productIndex + 1 })} removeLabel={t('dashboard.dispatch.new.remove')} onRemove={stop.products.length > 1 ? () => updateDelivery(stop.id, { products: stop.products.filter((item) => item.id !== product.id) }) : undefined} />
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                          <Field label={t('dashboard.dispatch.schedule.product')}><select className={inputClass()} value={product.product} onChange={(e) => updateDeliveryProduct(stop.id, product.id, { product: e.target.value })}>{productOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
                          <QuantityField label={t('dashboard.dispatch.new.expectedGrossQuantity')} value={product.expectedGrossQuantity} onChange={(value) => updateDeliveryProduct(stop.id, product.id, { expectedGrossQuantity: value })} />
                        </div>
                      </div>
                    ))}
                  </StopCard>
                ),
              )}
            </div>
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-background-200 bg-background-50/95 py-4 backdrop-blur">
            <Link to="/dispatch" className="inline-flex items-center justify-center rounded-md border border-background-200 bg-background-50 px-4 py-2 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100">
              {t('dashboard.dispatch.new.cancel')}
            </Link>
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600">
              <i className={`${isEditMode ? 'ri-save-3-line' : 'ri-add-line'} text-sm leading-none`} />
              {isEditMode ? 'Update load' : t('dashboard.dispatch.new.createSchedule')}
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className={labelClass()}>{label}</span>
      {children}
    </label>
  );
}

function QuantityField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <Field label={label}>
      <input className={inputClass()} inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} placeholder="0 L" />
    </Field>
  );
}

function NestedHeader({ title, addLabel, onAdd }: { title: string; addLabel: string; onAdd: () => void }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-background-200 pt-4">
      <h3 className="text-sm font-semibold text-foreground-800">{title}</h3>
      <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50">
        <i className="ri-add-line text-sm leading-none" />
        {addLabel}
      </button>
    </div>
  );
}

function StopCard({
  title,
  summary,
  expanded,
  onToggle,
  onMoveUp,
  onMoveDown,
  removeLabel,
  onRemove,
  children,
}: {
  title: string;
  summary: string;
  expanded: boolean;
  onToggle: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  removeLabel: string;
  onRemove?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="relative z-10 rounded-lg border border-background-200 bg-white p-4">
      <div className={expanded ? 'mb-4 flex items-center justify-between gap-3' : 'flex items-center justify-between gap-3'}>
        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-2 text-left">
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground-900">{title}</span>
            {!expanded && <span className="mt-0.5 block truncate text-xs font-medium text-foreground-500">{summary}</span>}
          </span>
        </button>
        <div className="flex items-center gap-1">
          {onMoveUp && (
            <button type="button" onClick={onMoveUp} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 transition-colors hover:bg-background-100 hover:text-foreground-700" aria-label={`Move ${title} up`}>
              <i className="ri-arrow-up-line text-base leading-none" />
            </button>
          )}
          {onMoveDown && (
            <button type="button" onClick={onMoveDown} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 transition-colors hover:bg-background-100 hover:text-foreground-700" aria-label={`Move ${title} down`}>
              <i className="ri-arrow-down-line text-base leading-none" />
            </button>
          )}
          {onRemove && (
            <button type="button" onClick={onRemove} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 transition-colors hover:bg-secondary-50 hover:text-secondary-700" aria-label={`${removeLabel} ${title}`}>
              <i className="ri-delete-bin-line text-base leading-none" />
            </button>
          )}
          <button type="button" onClick={onToggle} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 transition-colors hover:bg-background-100 hover:text-foreground-700" aria-label={title}>
            <i className={`ri-arrow-down-s-line text-base leading-none transition-transform ${expanded ? '' : '-rotate-90'}`} />
          </button>
        </div>
      </div>
      {expanded && children}
    </div>
  );
}

function ProductHeader({ title, removeLabel, onRemove }: { title: string; removeLabel: string; onRemove?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-foreground-600">{title}</p>
      {onRemove && (
        <button type="button" onClick={onRemove} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-400 transition-colors hover:bg-secondary-50 hover:text-secondary-700" aria-label={`${removeLabel} ${title}`}>
          <i className="ri-close-line text-base leading-none" />
        </button>
      )}
    </div>
  );
}
