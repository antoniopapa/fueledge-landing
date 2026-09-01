import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DriverRun, StopKind } from '@/mocks/driver';
import { dispatcherPhone } from '@/mocks/driver';
import { useDriverApp } from '@/pages/driver/DriverAppContext';

interface IssueItem {
  label: string;
  icon: string;
}

type CategoryKey = 'currentStop' | 'vehicle' | 'route' | 'safety' | 'other';

interface Category {
  key: CategoryKey;
  label: string;
  icon: string;
  items: IssueItem[];
}

const pickupItems: IssueItem[] = [
  { label: 'Terminal delay', icon: 'ri-time-line' },
  { label: 'Terminal closed', icon: 'ri-door-lock-line' },
  { label: "Can't access terminal", icon: 'ri-lock-line' },
  { label: 'Fuel unavailable', icon: 'ri-drop-line' },
  { label: 'Wrong fuel', icon: 'ri-error-warning-line' },
  { label: 'Quantity mismatch', icon: 'ri-scales-3-line' },
  { label: 'Price mismatch', icon: 'ri-money-dollar-circle-line' },
  { label: 'Equipment problem', icon: 'ri-tools-line' },
  { label: 'BoL missing / wrong', icon: 'ri-file-text-line' },
  { label: 'Other pickup issue', icon: 'ri-more-2-line' },
];

const deliveryItems: IssueItem[] = [
  { label: 'Customer unavailable', icon: 'ri-user-unfollow-line' },
  { label: "Can't access site", icon: 'ri-lock-line' },
  { label: 'Wrong address', icon: 'ri-map-pin-line' },
  { label: 'Customer refused', icon: 'ri-forbid-2-line' },
  { label: 'Quantity discrepancy', icon: 'ri-scales-3-line' },
  { label: 'Equipment / access', icon: 'ri-tools-line' },
  { label: 'PoD / signature', icon: 'ri-file-shield-2-line' },
  { label: 'Other delivery issue', icon: 'ri-more-2-line' },
];

const vehicleItems: IssueItem[] = [
  { label: 'Vehicle breakdown', icon: 'ri-car-line' },
  { label: 'Mechanical problem', icon: 'ri-settings-4-line' },
  { label: 'Flat tire', icon: 'ri-disc-line' },
  { label: 'Low on fuel', icon: 'ri-drop-line' },
  { label: 'Other vehicle issue', icon: 'ri-more-2-line' },
];

const routeItems: IssueItem[] = [
  { label: 'Road closure', icon: 'ri-road-map-line' },
  { label: 'Heavy traffic', icon: 'ri-traffic-light-line' },
  { label: 'Weather', icon: 'ri-cloudy-2-line' },
  { label: 'Wrong directions', icon: 'ri-compass-3-line' },
  { label: 'Bridge / height limit', icon: 'ri-ruler-line' },
  { label: 'Other route issue', icon: 'ri-more-2-line' },
];

const safetyItems: IssueItem[] = [
  { label: 'Accident', icon: 'ri-alarm-warning-line' },
  { label: 'Safety issue', icon: 'ri-shield-star-line' },
  { label: 'Fuel spill / leak', icon: 'ri-error-warning-line' },
  { label: 'Hazardous situation', icon: 'ri-alert-line' },
  { label: 'Other safety issue', icon: 'ri-more-2-line' },
];

const otherItems: IssueItem[] = [
  { label: 'Load info incorrect', icon: 'ri-file-info-line' },
  { label: 'Driver unable to continue', icon: 'ri-emotion-unhappy-line' },
  { label: 'Other', icon: 'ri-more-2-line' },
];

const urgentCategories = new Set([
  'Accident',
  'Safety issue',
  'Fuel spill / leak',
  'Hazardous situation',
  'Vehicle breakdown',
  'Driver unable to continue',
]);

type Step = 'categories' | 'details' | 'success';

export default function ReportIssueSheet({
  open,
  run,
  stopId,
  stopLabel,
  stopKind,
  onClose,
  mock = true,
}: {
  open: boolean;
  run: DriverRun;
  stopId: string;
  stopLabel: string;
  stopKind: StopKind;
  onClose: () => void;
  mock?: boolean;
}) {
  const { reportIssue } = useDriverApp();
  const [step, setStep] = useState<Step>('categories');
  const [categoryKey, setCategoryKey] = useState<CategoryKey>('currentStop');
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const currentStopItems = stopKind === 'pickup' ? pickupItems : deliveryItems;

  const categories: Category[] = [
    {
      key: 'currentStop',
      label: 'Current Stop',
      icon: stopKind === 'pickup' ? 'ri-gas-station-line' : 'ri-store-2-line',
      items: currentStopItems,
    },
    { key: 'vehicle', label: 'Vehicle', icon: 'ri-car-line', items: vehicleItems },
    { key: 'route', label: 'Route', icon: 'ri-route-line', items: routeItems },
    { key: 'safety', label: 'Safety', icon: 'ri-shield-star-line', items: safetyItems },
    { key: 'other', label: 'Other', icon: 'ri-more-2-line', items: otherItems },
  ];

  const activeCategory = categories.find((cat) => cat.key === categoryKey) ?? categories[0];
  const urgent = selected ? urgentCategories.has(selected) : false;

  useEffect(() => {
    if (open) {
      setStep('categories');
      setCategoryKey('currentStop');
      setSelected(null);
      setNote('');
      setPhoto(null);
    }
  }, [open]);

  if (!open) return null;

  function triggerPhoto() {
    if (mock) {
      setPhoto(`EVIDENCE-${Math.floor(1000 + Math.random() * 9000)}.jpg`);
      return;
    }
    photoInputRef.current?.click();
  }

  function handleSubmit() {
    if (!selected) return;
    const fullNote = [note.trim(), photo ? `Evidence: ${photo}` : ''].filter(Boolean).join(' · ');
    reportIssue(run.id, stopId, stopLabel, selected, fullNote, urgent ? 'urgent' : 'normal', 'issue');
    setStep('success');
  }

  function handleClose() {
    onClose();
    window.setTimeout(() => {
      setStep('categories');
      setCategoryKey('currentStop');
      setSelected(null);
      setNote('');
      setPhoto(null);
    }, 200);
  }

  const sheet = (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground-950/40">
      <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-background-50">
        <div className="flex items-center justify-between border-b border-background-200 px-4 py-3.5">
          <span className="font-heading text-[15px] font-bold text-foreground-950">
            {step === 'categories' && 'Report an issue'}
            {step === 'details' && 'Issue details'}
            {step === 'success' && 'Issue reported'}
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-foreground-500 hover:bg-background-100 cursor-pointer"
            aria-label="Close"
          >
            <i className="ri-close-line text-lg leading-none" />
          </button>
        </div>

        {step === 'categories' && (
          <div className="max-h-[72vh] overflow-y-auto px-4 py-4">
            <p className="text-[13px] text-foreground-500">What&apos;s the issue?</p>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCategoryKey(cat.key)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    categoryKey === cat.key
                      ? 'bg-primary-500 text-background-50'
                      : 'bg-background-100 text-foreground-600 hover:bg-background-200'
                  }`}
                >
                  <i className={`${cat.icon} text-sm leading-none`} />
                  {cat.label}
                </button>
              ))}
            </div>

            {categoryKey === 'currentStop' && (
              <p className="mt-2 text-[11px] text-foreground-400">At {stopLabel}</p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              {activeCategory.items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setSelected(item.label);
                    setStep('details');
                  }}
                  className="flex flex-col items-center gap-2 rounded-lg border border-background-200 bg-background-50 px-2 py-3.5 text-center cursor-pointer transition-colors hover:border-primary-300 hover:bg-primary-50/50 active:bg-primary-50"
                >
                  <span className="w-10 h-10 rounded-full bg-background-100 flex items-center justify-center">
                    <i className={`${item.icon} text-lg leading-none text-foreground-700`} />
                  </span>
                  <span className="text-[12px] font-medium leading-snug text-foreground-800">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'details' && selected && (
          <div className="max-h-[72vh] overflow-y-auto px-4 py-4">
            <div className="rounded-md border border-background-200 bg-background-100/60 px-3 py-2.5">
              <p className="text-[13px] font-semibold text-foreground-900">{selected}</p>
              <p className="mt-0.5 text-[12px] text-foreground-500">
                Run {run.id} · {stopLabel}
              </p>
            </div>

            {urgent && (
              <div className="mt-3 rounded-md border border-accent-300 bg-accent-50 px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center shrink-0">
                    <i className="ri-alarm-warning-line text-accent-700 text-base leading-none" />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground-900">This needs urgent attention</p>
                    <p className="text-[12px] text-foreground-500">Please call dispatch right away.</p>
                  </div>
                </div>
                <a
                  href={`tel:${dispatcherPhone}`}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 text-background-50 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
                >
                  <i className="ri-phone-line text-sm leading-none" />
                  Call Dispatcher
                </a>
              </div>
            )}

            <label className="mt-4 block text-[12px] font-semibold text-foreground-700">
              Add note
              <span className="ml-1 font-normal text-foreground-400">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Short description of what happened…"
              className="mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none resize-none"
            />

            <span className="mt-3 block text-[12px] font-semibold text-foreground-700">
              Add photo
              <span className="ml-1 font-normal text-foreground-400">(optional)</span>
            </span>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPhoto(file.name);
              }}
            />
            {photo ? (
              <div className="mt-1.5 rounded-lg border border-accent-200 bg-accent-50 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-12 h-12 rounded-md bg-accent-100 flex items-center justify-center shrink-0">
                    <i className="ri-image-line text-accent-700 text-xl leading-none" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-accent-800">Evidence attached</p>
                    <p className="truncate text-[11px] text-accent-700 tabular">{photo}</p>
                  </div>
                  <span className="w-6 h-6 flex items-center justify-center text-accent-600">
                    <i className="ri-checkbox-circle-fill text-lg leading-none" />
                  </span>
                </div>
                <button
                  type="button"
                  onClick={triggerPhoto}
                  className="mt-2 text-[11px] font-medium text-accent-700 hover:text-accent-800 cursor-pointer"
                >
                  Replace photo
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={triggerPhoto}
                className="mt-1.5 flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-background-300 bg-background-100/50 px-4 py-4 text-center cursor-pointer hover:bg-background-100 transition-colors"
              >
                <span className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                  <i className="ri-camera-line text-primary-700 text-lg leading-none" />
                </span>
                <span className="text-[12px] font-semibold text-foreground-700">Take photo or upload</span>
                <span className="text-[11px] text-foreground-400">Camera opens on your phone</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-send-plane-line text-sm leading-none" />
              Report Issue
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="px-4 py-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
              <i className="ri-checkbox-circle-fill text-accent-700 text-3xl leading-none" />
            </span>
            <p className="mt-3 font-heading text-[16px] font-bold text-foreground-950">Issue reported to dispatch</p>
            <p className="mt-1 text-[13px] text-foreground-500">Dispatcher has been notified.</p>

            {urgent && (
              <a
                href={`tel:${dispatcherPhone}`}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-500 hover:bg-accent-600 text-background-50 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
              >
                <i className="ri-phone-line text-sm leading-none" />
                Call Dispatcher
              </a>
            )}

            <button
              type="button"
              onClick={handleClose}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-md text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors ${
                urgent
                  ? 'mt-2 border border-background-200 bg-background-50 text-foreground-700 hover:bg-background-100'
                  : 'mt-5 bg-primary-500 hover:bg-primary-600 text-background-50'
              }`}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(sheet, document.body);
}