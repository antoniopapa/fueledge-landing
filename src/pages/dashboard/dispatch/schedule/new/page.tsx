import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import DashboardShell from '@/pages/dashboard/components/DashboardShell';
import { addScheduleRun } from '@/pages/dashboard/dispatch/dispatchStore';
import { drivers as driverMocks } from '@/mocks/drivers';
import { trailers, trucks } from '@/mocks/fleet';
import { suppliers, terminals } from '@/mocks/sourcing';

type Priority = 'Low' | 'Normal' | 'High' | 'Critical';

interface PickupProduct {
  id: string;
  productId: string;
  supplier: string;
  compartment: string;
  expectedGrossQuantity: string;
  grossQuantity: string;
  netQuantity: string;
  blended: boolean;
}

interface Pickup {
  id: string;
  terminal: string;
  notes: string;
  products: PickupProduct[];
}

interface DeliveryProduct {
  id: string;
  product: string;
  expectedGrossQuantity: string;
  grossQuantity: string;
  netQuantity: string;
  initialTankVolume: string;
  finalTankVolume: string;
  tankSerialNumber: string;
  waterInTank: boolean;
  price: string;
}

interface Delivery {
  id: string;
  customer: string;
  poNumber: string;
  timeIn: string;
  timeOut: string;
  dateIn: string;
  dateOut: string;
  accessorials: string;
  deliveryTicket: string;
  notes: string;
  products: DeliveryProduct[];
}

const priorities: Priority[] = ['Normal', 'High', 'Critical', 'Low'];
const priorityLabelKeys: Record<Priority, string> = {
  Low: 'dashboard.dispatch.new.priorities.low',
  Normal: 'dashboard.dispatch.new.priorities.normal',
  High: 'dashboard.dispatch.new.priorities.high',
  Critical: 'dashboard.dispatch.new.priorities.critical',
};
const productOptions = ['Diesel EN590', 'Gasoil', 'Petrol 95', 'Heating Oil', 'HVO100', 'AdBlue'];

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
    compartment: '1',
    expectedGrossQuantity: '',
    grossQuantity: '',
    netQuantity: '',
    blended: false,
  };
}

function emptyPickup(): Pickup {
  return {
    id: makeId('pickup'),
    terminal: '',
    notes: '',
    products: [emptyPickupProduct()],
  };
}

function emptyDeliveryProduct(): DeliveryProduct {
  return {
    id: makeId('delivery-product'),
    product: 'Diesel EN590',
    expectedGrossQuantity: '',
    grossQuantity: '',
    netQuantity: '',
    initialTankVolume: '',
    finalTankVolume: '',
    tankSerialNumber: '',
    waterInTank: false,
    price: '',
  };
}

function emptyDelivery(): Delivery {
  return {
    id: makeId('delivery'),
    customer: '',
    poNumber: '',
    timeIn: '',
    timeOut: '',
    dateIn: '',
    dateOut: '',
    accessorials: '',
    deliveryTicket: '',
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

export default function NewSchedulePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const driverNames = useMemo(() => driverMocks.map((driver) => driver.name), []);
  const truckPlates = useMemo(() => trucks.map((truck) => truck.plate), []);
  const trailerPlates = useMemo(() => trailers.map((trailer) => trailer.plate), []);
  const terminalNames = useMemo(() => terminals.map((terminal) => terminal.name), []);
  const supplierNames = useMemo(() => suppliers.map((supplier) => supplier.name), []);

  const [driver, setDriver] = useState(driverNames[0] ?? '');
  const [truck, setTruck] = useState(truckPlates[0] ?? '');
  const [trailer, setTrailer] = useState(trailerPlates[0] ?? '');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [pickups, setPickups] = useState<Pickup[]>([emptyPickup()]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([emptyDelivery()]);

  function updatePickup(id: string, patch: Partial<Pickup>) {
    setPickups((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function updatePickupProduct(pickupId: string, productId: string, patch: Partial<PickupProduct>) {
    setPickups((items) =>
      items.map((pickup) =>
        pickup.id === pickupId
          ? { ...pickup, products: pickup.products.map((product) => (product.id === productId ? { ...product, ...patch } : product)) }
          : pickup,
      ),
    );
  }

  function updateDelivery(id: string, patch: Partial<Delivery>) {
    setDeliveries((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function updateDeliveryProduct(deliveryId: string, productId: string, patch: Partial<DeliveryProduct>) {
    setDeliveries((items) =>
      items.map((delivery) =>
        delivery.id === deliveryId
          ? { ...delivery, products: delivery.products.map((product) => (product.id === productId ? { ...product, ...patch } : product)) }
          : delivery,
      ),
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = String(Date.now()).slice(-6);
    const firstPickup = pickups[0];
    const firstDelivery = deliveries[0];
    const pickupProduct = firstPickup?.products[0];
    const deliveryProduct = firstDelivery?.products[0];

    addScheduleRun({
      id,
      driverName: driver || t('dashboard.dispatch.new.defaults.unassignedDriver'),
      truckPlate: truck || t('dashboard.dispatch.new.defaults.unassignedTruck'),
      route: `${firstPickup?.terminal || t('dashboard.dispatch.schedule.pickup')} -> ${firstDelivery?.customer || t('dashboard.dispatch.schedule.delivery')}`,
      product: pickupProduct?.productId || deliveryProduct?.product || t('dashboard.dispatch.schedule.product'),
      volume: totalExpectedVolume(pickups),
      day: 0,
      startTime,
      endTime,
      status: priority === 'Critical' ? 'Conflict' : 'Scheduled',
      pickup: firstPickup?.terminal || t('dashboard.dispatch.schedule.pickup'),
      delivery: firstDelivery?.customer || t('dashboard.dispatch.schedule.delivery'),
      ...(priority === 'Critical' ? { conflict: true, conflictNote: t('dashboard.dispatch.new.defaults.criticalConflict') } : {}),
    });

    navigate('/dispatch');
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
                  {t('dashboard.dispatch.new.title')}
                </h1>
                <p className="text-sm text-foreground-500">{t('dashboard.dispatch.new.description')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
              <Field label={t('dashboard.dispatch.schedule.driver')}><input className={inputClass()} value={driver} onChange={(e) => setDriver(e.target.value)} list="drivers" required /></Field>
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

            <datalist id="drivers">{driverNames.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="trucks">{truckPlates.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="trailers">{trailerPlates.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="terminals">{terminalNames.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="suppliers">{supplierNames.map((item) => <option key={item} value={item} />)}</datalist>
          </section>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <section className="rounded-lg border border-background-200 bg-background-50 p-5">
              <SectionHeader title={t('dashboard.dispatch.new.pickups')} icon="ri-download-2-line" addLabel={t('dashboard.dispatch.new.add')} onAdd={() => setPickups((items) => [...items, emptyPickup()])} />
              <div className="space-y-4">
                {pickups.map((pickup, index) => (
                  <StopCard key={pickup.id} title={t('dashboard.dispatch.new.pickupNumber', { number: index + 1 })} removeLabel={t('dashboard.dispatch.new.remove')} onRemove={pickups.length > 1 ? () => setPickups((items) => items.filter((item) => item.id !== pickup.id)) : undefined}>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field label={t('dashboard.dispatch.new.terminal')}><input className={inputClass()} value={pickup.terminal} onChange={(e) => updatePickup(pickup.id, { terminal: e.target.value })} list="terminals" required /></Field>
                      <Field label={t('dashboard.dispatch.new.notes')}><input className={inputClass()} value={pickup.notes} onChange={(e) => updatePickup(pickup.id, { notes: e.target.value })} placeholder={t('dashboard.dispatch.new.loadingInstructions')} /></Field>
                    </div>

                    <NestedHeader title={t('dashboard.dispatch.new.pickupProducts')} addLabel={t('dashboard.dispatch.new.addProduct')} onAdd={() => updatePickup(pickup.id, { products: [...pickup.products, emptyPickupProduct()] })} />
                    {pickup.products.map((product, productIndex) => (
                      <div key={product.id} className="mt-3 rounded-md border border-background-200 p-3">
                        <ProductHeader title={t('dashboard.dispatch.new.productNumber', { number: productIndex + 1 })} removeLabel={t('dashboard.dispatch.new.remove')} onRemove={pickup.products.length > 1 ? () => updatePickup(pickup.id, { products: pickup.products.filter((item) => item.id !== product.id) }) : undefined} />
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                          <Field label={t('dashboard.dispatch.new.productId')}><select className={inputClass()} value={product.productId} onChange={(e) => updatePickupProduct(pickup.id, product.id, { productId: e.target.value })}>{productOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
                          <Field label={t('dashboard.dispatch.new.supplier')}><input className={inputClass()} value={product.supplier} onChange={(e) => updatePickupProduct(pickup.id, product.id, { supplier: e.target.value })} list="suppliers" /></Field>
                          <Field label={t('dashboard.dispatch.new.compartment')}><input className={inputClass()} value={product.compartment} onChange={(e) => updatePickupProduct(pickup.id, product.id, { compartment: e.target.value })} /></Field>
                          <QuantityField label={t('dashboard.dispatch.new.expectedGrossQuantity')} value={product.expectedGrossQuantity} onChange={(value) => updatePickupProduct(pickup.id, product.id, { expectedGrossQuantity: value })} />
                          <QuantityField label={t('dashboard.dispatch.new.grossQuantity')} value={product.grossQuantity} onChange={(value) => updatePickupProduct(pickup.id, product.id, { grossQuantity: value })} />
                          <QuantityField label={t('dashboard.dispatch.new.netQuantity')} value={product.netQuantity} onChange={(value) => updatePickupProduct(pickup.id, product.id, { netQuantity: value })} />
                          <ToggleField label={t('dashboard.dispatch.new.blendedProduct')} checked={product.blended} onChange={(checked) => updatePickupProduct(pickup.id, product.id, { blended: checked })} />
                        </div>
                      </div>
                    ))}
                  </StopCard>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-background-200 bg-background-50 p-5">
              <SectionHeader title={t('dashboard.dispatch.new.deliveries')} icon="ri-upload-2-line" addLabel={t('dashboard.dispatch.new.add')} onAdd={() => setDeliveries((items) => [...items, emptyDelivery()])} />
              <div className="space-y-4">
                {deliveries.map((delivery, index) => (
                  <StopCard key={delivery.id} title={t('dashboard.dispatch.new.deliveryNumber', { number: index + 1 })} removeLabel={t('dashboard.dispatch.new.remove')} onRemove={deliveries.length > 1 ? () => setDeliveries((items) => items.filter((item) => item.id !== delivery.id)) : undefined}>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                      <Field label={t('dashboard.dispatch.new.customer')}><input className={inputClass()} value={delivery.customer} onChange={(e) => updateDelivery(delivery.id, { customer: e.target.value })} required /></Field>
                      <Field label={t('dashboard.dispatch.new.poNumber')}><input className={inputClass()} value={delivery.poNumber} onChange={(e) => updateDelivery(delivery.id, { poNumber: e.target.value })} /></Field>
                      <Field label={t('dashboard.dispatch.new.deliveryTicket')}><input className={inputClass()} value={delivery.deliveryTicket} onChange={(e) => updateDelivery(delivery.id, { deliveryTicket: e.target.value })} /></Field>
                      <Field label={t('dashboard.dispatch.new.dateIn')}><input className={inputClass()} type="date" value={delivery.dateIn} onChange={(e) => updateDelivery(delivery.id, { dateIn: e.target.value })} /></Field>
                      <Field label={t('dashboard.dispatch.new.timeIn')}><input className={inputClass()} type="time" value={delivery.timeIn} onChange={(e) => updateDelivery(delivery.id, { timeIn: e.target.value })} /></Field>
                      <Field label={t('dashboard.dispatch.new.dateOut')}><input className={inputClass()} type="date" value={delivery.dateOut} onChange={(e) => updateDelivery(delivery.id, { dateOut: e.target.value })} /></Field>
                      <Field label={t('dashboard.dispatch.new.timeOut')}><input className={inputClass()} type="time" value={delivery.timeOut} onChange={(e) => updateDelivery(delivery.id, { timeOut: e.target.value })} /></Field>
                      <Field label={t('dashboard.dispatch.new.accessorials')}><input className={inputClass()} value={delivery.accessorials} onChange={(e) => updateDelivery(delivery.id, { accessorials: e.target.value })} placeholder={t('dashboard.dispatch.new.accessorialsPlaceholder')} /></Field>
                      <Field label={t('dashboard.dispatch.new.notes')}><input className={inputClass()} value={delivery.notes} onChange={(e) => updateDelivery(delivery.id, { notes: e.target.value })} /></Field>
                    </div>

                    <NestedHeader title={t('dashboard.dispatch.new.deliveryProducts')} addLabel={t('dashboard.dispatch.new.addProduct')} onAdd={() => updateDelivery(delivery.id, { products: [...delivery.products, emptyDeliveryProduct()] })} />
                    {delivery.products.map((product, productIndex) => (
                      <div key={product.id} className="mt-3 rounded-md border border-background-200 p-3">
                        <ProductHeader title={t('dashboard.dispatch.new.productNumber', { number: productIndex + 1 })} removeLabel={t('dashboard.dispatch.new.remove')} onRemove={delivery.products.length > 1 ? () => updateDelivery(delivery.id, { products: delivery.products.filter((item) => item.id !== product.id) }) : undefined} />
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                          <Field label={t('dashboard.dispatch.schedule.product')}><select className={inputClass()} value={product.product} onChange={(e) => updateDeliveryProduct(delivery.id, product.id, { product: e.target.value })}>{productOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
                          <QuantityField label={t('dashboard.dispatch.new.expectedGrossQuantity')} value={product.expectedGrossQuantity} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { expectedGrossQuantity: value })} />
                          <QuantityField label={t('dashboard.dispatch.new.grossQuantity')} value={product.grossQuantity} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { grossQuantity: value })} />
                          <QuantityField label={t('dashboard.dispatch.new.netQuantity')} value={product.netQuantity} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { netQuantity: value })} />
                          <QuantityField label={t('dashboard.dispatch.new.initialTankVolume')} value={product.initialTankVolume} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { initialTankVolume: value })} />
                          <QuantityField label={t('dashboard.dispatch.new.finalTankVolume')} value={product.finalTankVolume} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { finalTankVolume: value })} />
                          <Field label={t('dashboard.dispatch.new.tankSerialNumber')}><input className={inputClass()} value={product.tankSerialNumber} onChange={(e) => updateDeliveryProduct(delivery.id, product.id, { tankSerialNumber: e.target.value })} /></Field>
                          <Field label={t('dashboard.dispatch.new.price')}><input className={inputClass()} value={product.price} onChange={(e) => updateDeliveryProduct(delivery.id, product.id, { price: e.target.value })} placeholder="1.299" /></Field>
                          <ToggleField label={t('dashboard.dispatch.new.waterInTank')} checked={product.waterInTank} onChange={(checked) => updateDeliveryProduct(delivery.id, product.id, { waterInTank: checked })} />
                        </div>
                      </div>
                    ))}
                  </StopCard>
                ))}
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-background-200 bg-background-50/95 py-4 backdrop-blur">
            <Link to="/dispatch" className="inline-flex items-center justify-center rounded-md border border-background-200 bg-background-50 px-4 py-2 text-sm font-semibold text-foreground-700 transition-colors hover:bg-background-100">
              {t('dashboard.dispatch.new.cancel')}
            </Link>
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600">
              <i className="ri-add-line text-sm leading-none" />
              {t('dashboard.dispatch.new.createSchedule')}
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

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex h-full min-h-[66px] items-end">
      <span className="flex w-full items-center justify-between rounded-md border border-background-200 bg-background-50 px-3 py-2">
        <span className={labelClass()}>{label}</span>
        <input className="h-4 w-4 accent-primary-500" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      </span>
    </label>
  );
}

function SectionHeader({ title, icon, addLabel, onAdd }: { title: string; icon: string; addLabel: string; onAdd: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-background-100 text-foreground-600">
          <i className={`${icon} text-base leading-none`} />
        </span>
        <h2 className="font-heading text-lg font-bold text-foreground-950">{title}</h2>
      </div>
      <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-md border border-background-200 px-3 py-1.5 text-xs font-semibold text-foreground-700 transition-colors hover:bg-background-100">
        <i className="ri-add-line text-sm leading-none" />
        {addLabel}
      </button>
    </div>
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

function StopCard({ title, removeLabel, onRemove, children }: { title: string; removeLabel: string; onRemove?: () => void; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-background-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground-900">{title}</h3>
        {onRemove && (
          <button type="button" onClick={onRemove} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 transition-colors hover:bg-secondary-50 hover:text-secondary-700" aria-label={`${removeLabel} ${title}`}>
            <i className="ri-delete-bin-line text-base leading-none" />
          </button>
        )}
      </div>
      {children}
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
