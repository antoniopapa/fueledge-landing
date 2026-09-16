import { FormEvent, ReactNode, useMemo, useState } from 'react';
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
const priorityLabels: Record<Priority, string> = {
  Low: 'Нисък',
  Normal: 'Нормален',
  High: 'Висок',
  Critical: 'Критичен',
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
      driverName: driver || 'Неназначен шофьор',
      truckPlate: truck || 'Неназначен камион',
      route: `${firstPickup?.terminal || 'Товарене'} -> ${firstDelivery?.customer || 'Доставка'}`,
      product: pickupProduct?.productId || deliveryProduct?.product || 'Продукт',
      volume: totalExpectedVolume(pickups),
      day: 0,
      startTime,
      endTime,
      status: priority === 'Critical' ? 'Conflict' : 'Scheduled',
      pickup: firstPickup?.terminal || 'Товарене',
      delivery: firstDelivery?.customer || 'Доставка',
      ...(priority === 'Critical' ? { conflict: true, conflictNote: 'Критичен курс в графика' } : {}),
    });

    navigate('/dispatch');
  }

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">
        <Link to="/dispatch" className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-foreground-500 transition-colors hover:text-foreground-900">
          <i className="ri-arrow-left-line text-[13px] leading-none" />
          Обратно към графика
        </Link>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-lg border border-background-200 bg-background-50 p-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                <i className="ri-route-line text-lg leading-none" />
              </span>
              <div>
                <h1 className="font-heading text-xl font-bold text-foreground-950">Нов график за курс</h1>
                <p className="text-sm text-foreground-500">Назначете техника, часове, товарения и доставки за този курс.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
              <Field label="Шофьор"><input className={inputClass()} value={driver} onChange={(e) => setDriver(e.target.value)} list="drivers" required /></Field>
              <Field label="Камион"><input className={inputClass()} value={truck} onChange={(e) => setTruck(e.target.value)} list="trucks" required /></Field>
              <Field label="Ремарке"><input className={inputClass()} value={trailer} onChange={(e) => setTrailer(e.target.value)} list="trailers" required /></Field>
              <Field label="Приоритет">
                <select className={inputClass()} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                  {priorities.map((item) => <option key={item} value={item}>{priorityLabels[item]}</option>)}
                </select>
              </Field>
              <Field label="Начален час"><input className={inputClass()} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></Field>
              <Field label="Краен час"><input className={inputClass()} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required /></Field>
            </div>

            <datalist id="drivers">{driverNames.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="trucks">{truckPlates.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="trailers">{trailerPlates.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="terminals">{terminalNames.map((item) => <option key={item} value={item} />)}</datalist>
            <datalist id="suppliers">{supplierNames.map((item) => <option key={item} value={item} />)}</datalist>
          </section>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <section className="rounded-lg border border-background-200 bg-background-50 p-5">
              <SectionHeader title="Товарения" icon="ri-download-2-line" onAdd={() => setPickups((items) => [...items, emptyPickup()])} />
              <div className="space-y-4">
                {pickups.map((pickup, index) => (
                  <StopCard key={pickup.id} title={`Товарене ${index + 1}`} onRemove={pickups.length > 1 ? () => setPickups((items) => items.filter((item) => item.id !== pickup.id)) : undefined}>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Field label="Терминал"><input className={inputClass()} value={pickup.terminal} onChange={(e) => updatePickup(pickup.id, { terminal: e.target.value })} list="terminals" required /></Field>
                      <Field label="Бележки"><input className={inputClass()} value={pickup.notes} onChange={(e) => updatePickup(pickup.id, { notes: e.target.value })} placeholder="Инструкции за товарене" /></Field>
                    </div>

                    <NestedHeader title="Продукти за товарене" onAdd={() => updatePickup(pickup.id, { products: [...pickup.products, emptyPickupProduct()] })} />
                    {pickup.products.map((product, productIndex) => (
                      <div key={product.id} className="mt-3 rounded-md border border-background-200 p-3">
                        <ProductHeader title={`Продукт ${productIndex + 1}`} onRemove={pickup.products.length > 1 ? () => updatePickup(pickup.id, { products: pickup.products.filter((item) => item.id !== product.id) }) : undefined} />
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                          <Field label="Продукт ID"><select className={inputClass()} value={product.productId} onChange={(e) => updatePickupProduct(pickup.id, product.id, { productId: e.target.value })}>{productOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
                          <Field label="Доставчик"><input className={inputClass()} value={product.supplier} onChange={(e) => updatePickupProduct(pickup.id, product.id, { supplier: e.target.value })} list="suppliers" /></Field>
                          <Field label="Отделение"><input className={inputClass()} value={product.compartment} onChange={(e) => updatePickupProduct(pickup.id, product.id, { compartment: e.target.value })} /></Field>
                          <QuantityField label="Очаквано брутно количество" value={product.expectedGrossQuantity} onChange={(value) => updatePickupProduct(pickup.id, product.id, { expectedGrossQuantity: value })} />
                          <QuantityField label="Брутно количество" value={product.grossQuantity} onChange={(value) => updatePickupProduct(pickup.id, product.id, { grossQuantity: value })} />
                          <QuantityField label="Нетно количество" value={product.netQuantity} onChange={(value) => updatePickupProduct(pickup.id, product.id, { netQuantity: value })} />
                          <ToggleField label="Смесен продукт" checked={product.blended} onChange={(checked) => updatePickupProduct(pickup.id, product.id, { blended: checked })} />
                        </div>
                      </div>
                    ))}
                  </StopCard>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-background-200 bg-background-50 p-5">
              <SectionHeader title="Доставки" icon="ri-upload-2-line" onAdd={() => setDeliveries((items) => [...items, emptyDelivery()])} />
              <div className="space-y-4">
                {deliveries.map((delivery, index) => (
                  <StopCard key={delivery.id} title={`Доставка ${index + 1}`} onRemove={deliveries.length > 1 ? () => setDeliveries((items) => items.filter((item) => item.id !== delivery.id)) : undefined}>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                      <Field label="Клиент"><input className={inputClass()} value={delivery.customer} onChange={(e) => updateDelivery(delivery.id, { customer: e.target.value })} required /></Field>
                      <Field label="PO номер"><input className={inputClass()} value={delivery.poNumber} onChange={(e) => updateDelivery(delivery.id, { poNumber: e.target.value })} /></Field>
                      <Field label="Талон за доставка"><input className={inputClass()} value={delivery.deliveryTicket} onChange={(e) => updateDelivery(delivery.id, { deliveryTicket: e.target.value })} /></Field>
                      <Field label="Дата вход"><input className={inputClass()} type="date" value={delivery.dateIn} onChange={(e) => updateDelivery(delivery.id, { dateIn: e.target.value })} /></Field>
                      <Field label="Час вход"><input className={inputClass()} type="time" value={delivery.timeIn} onChange={(e) => updateDelivery(delivery.id, { timeIn: e.target.value })} /></Field>
                      <Field label="Дата изход"><input className={inputClass()} type="date" value={delivery.dateOut} onChange={(e) => updateDelivery(delivery.id, { dateOut: e.target.value })} /></Field>
                      <Field label="Час изход"><input className={inputClass()} type="time" value={delivery.timeOut} onChange={(e) => updateDelivery(delivery.id, { timeOut: e.target.value })} /></Field>
                      <Field label="Допълнителни услуги"><input className={inputClass()} value={delivery.accessorials} onChange={(e) => updateDelivery(delivery.id, { accessorials: e.target.value })} placeholder="Помпа, време за изчакване" /></Field>
                      <Field label="Бележки"><input className={inputClass()} value={delivery.notes} onChange={(e) => updateDelivery(delivery.id, { notes: e.target.value })} /></Field>
                    </div>

                    <NestedHeader title="Продукти за доставка" onAdd={() => updateDelivery(delivery.id, { products: [...delivery.products, emptyDeliveryProduct()] })} />
                    {delivery.products.map((product, productIndex) => (
                      <div key={product.id} className="mt-3 rounded-md border border-background-200 p-3">
                        <ProductHeader title={`Продукт ${productIndex + 1}`} onRemove={delivery.products.length > 1 ? () => updateDelivery(delivery.id, { products: delivery.products.filter((item) => item.id !== product.id) }) : undefined} />
                        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                          <Field label="Продукт"><select className={inputClass()} value={product.product} onChange={(e) => updateDeliveryProduct(delivery.id, product.id, { product: e.target.value })}>{productOptions.map((item) => <option key={item}>{item}</option>)}</select></Field>
                          <QuantityField label="Очаквано брутно количество" value={product.expectedGrossQuantity} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { expectedGrossQuantity: value })} />
                          <QuantityField label="Брутно количество" value={product.grossQuantity} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { grossQuantity: value })} />
                          <QuantityField label="Нетно количество" value={product.netQuantity} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { netQuantity: value })} />
                          <QuantityField label="Начален обем в резервоара" value={product.initialTankVolume} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { initialTankVolume: value })} />
                          <QuantityField label="Краен обем в резервоара" value={product.finalTankVolume} onChange={(value) => updateDeliveryProduct(delivery.id, product.id, { finalTankVolume: value })} />
                          <Field label="Сериен номер на резервоар"><input className={inputClass()} value={product.tankSerialNumber} onChange={(e) => updateDeliveryProduct(delivery.id, product.id, { tankSerialNumber: e.target.value })} /></Field>
                          <Field label="Цена"><input className={inputClass()} value={product.price} onChange={(e) => updateDeliveryProduct(delivery.id, product.id, { price: e.target.value })} placeholder="1.299" /></Field>
                          <ToggleField label="Вода в резервоара" checked={product.waterInTank} onChange={(checked) => updateDeliveryProduct(delivery.id, product.id, { waterInTank: checked })} />
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
              Отказ
            </Link>
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 px-4 py-2 text-sm font-semibold text-background-50 transition-colors hover:bg-primary-600">
              <i className="ri-add-line text-sm leading-none" />
              Създай график за курс
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

function SectionHeader({ title, icon, onAdd }: { title: string; icon: string; onAdd: () => void }) {
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
        Добави
      </button>
    </div>
  );
}

function NestedHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3 border-t border-background-200 pt-4">
      <h3 className="text-sm font-semibold text-foreground-800">{title}</h3>
      <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-50">
        <i className="ri-add-line text-sm leading-none" />
        Добави продукт
      </button>
    </div>
  );
}

function StopCard({ title, onRemove, children }: { title: string; onRemove?: () => void; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-background-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground-900">{title}</h3>
        {onRemove && (
          <button type="button" onClick={onRemove} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-400 transition-colors hover:bg-secondary-50 hover:text-secondary-700" aria-label={`Remove ${title}`}>
            <i className="ri-delete-bin-line text-base leading-none" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ProductHeader({ title, onRemove }: { title: string; onRemove?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-foreground-600">{title}</p>
      {onRemove && (
        <button type="button" onClick={onRemove} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-400 transition-colors hover:bg-secondary-50 hover:text-secondary-700" aria-label={`Remove ${title}`}>
          <i className="ri-close-line text-base leading-none" />
        </button>
      )}
    </div>
  );
}
