import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DriverRun, StopKind } from '@/mocks/driver';
import { dispatcherPhone } from '@/mocks/driver';
import { useDriverApp } from '@/pages/driver/DriverAppContext';

const pickupReasons = [
  'Terminal closed',
  'Fuel unavailable',
  'Wrong fuel available',
  'Insufficient quantity available',
  'Cannot access terminal',
  'Loading equipment problem',
  'Other',
];

const deliveryReasons = [
  'Customer unavailable',
  'Site inaccessible',
  'Customer refused',
  'Safety restriction',
  'Equipment problem',
  'Incorrect location/order',
  'Other',
];

export default function UnableToCompleteSheet({
  open,
  run,
  stopId,
  stopLabel,
  stopKind,
  onClose,
}: {
  open: boolean;
  run: DriverRun;
  stopId: string;
  stopLabel: string;
  stopKind: StopKind;
  onClose: () => void;
}) {
  const { reportUnableToComplete } = useDriverApp();
  const [reason, setReason] = useState<string | null>(null);
  const [otherDetail, setOtherDetail] = useState('');
  const [done, setDone] = useState(false);

  const reasons = stopKind === 'pickup' ? pickupReasons : deliveryReasons;

  useEffect(() => {
    if (open) {
      setReason(null);
      setOtherDetail('');
      setDone(false);
    }
  }, [open]);

  if (!open) return null;

  const title = stopKind === 'pickup' ? 'Unable to complete pickup' : 'Unable to complete delivery';
  const isOther = reason === 'Other';
  const canConfirm = reason !== null && (!isOther || otherDetail.trim().length > 0);

  function handleConfirm() {
    if (!reason || (isOther && otherDetail.trim().length === 0)) return;
    reportUnableToComplete(
      run.id,
      stopId,
      stopLabel,
      reason,
      isOther ? otherDetail.trim() : '',
    );
    setDone(true);
  }

  function handleClose() {
    onClose();
    window.setTimeout(() => {
      setReason(null);
      setOtherDetail('');
      setDone(false);
    }, 200);
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground-950/40">
      <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-background-50">
        <div className="flex items-center justify-between border-b border-background-200 px-4 py-3.5">
          <span className="font-heading text-[15px] font-bold text-foreground-950">
            {done ? 'Reported to dispatch' : title}
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

        {!done ? (
          <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
            <p className="text-[13px] text-foreground-500">
              Why can&apos;t you complete this {stopKind === 'pickup' ? 'pickup' : 'delivery'}?
            </p>
            <div className="mt-3 space-y-1.5">
              {reasons.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setReason(item)}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left text-[13px] cursor-pointer transition-colors ${
                    reason === item
                      ? 'border-primary-300 bg-primary-50/60 text-primary-800'
                      : 'border-background-200 bg-background-50 text-foreground-800 hover:bg-background-100'
                  }`}
                >
                  <span>{item}</span>
                  {reason === item && <i className="ri-checkbox-circle-fill text-primary-600 text-base leading-none" />}
                </button>
              ))}
            </div>

            {isOther && (
              <div className="mt-2">
                <label className="block text-[12px] font-semibold text-foreground-700">
                  Please describe the issue
                </label>
                <input
                  type="text"
                  value={otherDetail}
                  onChange={(e) => setOtherDetail(e.target.value)}
                  maxLength={80}
                  placeholder="Short description…"
                  className="mt-1.5 w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none"
                />
                <p className="mt-1 text-right text-[11px] text-foreground-400 tabular">
                  {otherDetail.length}/80
                </p>
              </div>
            )}

            <div className="mt-3 rounded-md border border-background-200 bg-background-100/60 px-3 py-2.5 text-[12px] text-foreground-500">
              Dispatch will be notified and the stop will be blocked until they resolve it. You can keep working on other
              tasks if assigned.
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md text-sm font-semibold px-4 py-3 whitespace-nowrap transition-colors ${
                canConfirm
                  ? 'bg-primary-500 hover:bg-primary-600 text-background-50 cursor-pointer'
                  : 'bg-background-200 text-foreground-400 cursor-not-allowed'
              }`}
            >
              <i className="ri-send-plane-line text-sm leading-none" />
              Report Unable to Complete
            </button>
          </div>
        ) : (
          <div className="px-4 py-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-100">
              <i className="ri-checkbox-circle-fill text-accent-700 text-3xl leading-none" />
            </span>
            <p className="mt-3 font-heading text-[16px] font-bold text-foreground-950">
              {stopKind === 'pickup' ? 'Pickup blocked' : 'Delivery blocked'}
            </p>
            <p className="mt-1 text-[13px] text-foreground-500">
              {isOther && otherDetail ? `Other: ${otherDetail}` : reason} · Issue reported to dispatch
            </p>
            <a
              href={`tel:${dispatcherPhone}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-phone-line text-sm leading-none" />
              Call Dispatcher
            </a>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 w-full rounded-md px-4 py-3 text-[13px] font-semibold text-foreground-600 hover:bg-background-100 cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}