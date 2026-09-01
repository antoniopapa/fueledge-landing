import { useState } from 'react';
import { driverProfile } from '@/mocks/driver';

type PwStep = 'idle' | 'code' | 'newPassword';
type TwoFactorStep = 'idle' | 'choose' | 'code';
type TwoFactorMethod = 'email' | 'sms';

const DEMO_CODE = '123456';

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[12px] font-medium text-foreground-600 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-2.5 text-sm text-foreground-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15"
      />
    </div>
  );
}

function CodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={6}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
      placeholder="000000"
      autoComplete="one-time-code"
      className="w-full rounded-md border border-background-300 bg-background-50 px-3 py-3 text-center text-lg font-semibold tracking-[0.4em] text-foreground-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/15"
    />
  );
}

function ErrorNote({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-secondary-700">
      <i className="ri-error-warning-line text-sm leading-none" />
      {message}
    </p>
  );
}

function SuccessNote({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-accent-700">
      <i className="ri-checkbox-circle-line text-sm leading-none" />
      {message}
    </p>
  );
}

export default function SecurityScreen() {
  // Change password flow
  const [pwStep, setPwStep] = useState<PwStep>('idle');
  const [pwCode, setPwCode] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Two-factor authentication
  const [twoFactor, setTwoFactor] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState<TwoFactorStep>('idle');
  const [twoFactorMethod, setTwoFactorMethod] = useState<TwoFactorMethod>('email');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  // ---- Change password handlers ----
  function requestPasswordCode() {
    setPwError('');
    setPwSuccess('');
    setPwCode('');
    setPwStep('code');
  }

  function verifyPasswordCode() {
    if (pwCode.trim().length !== 6) {
      setPwError('Enter the 6-digit code we sent to your email.');
      return;
    }
    setPwError('');
    setNewPw('');
    setConfirmPw('');
    setPwStep('newPassword');
  }

  function savePassword() {
    setPwSuccess('');
    if (!newPw || !confirmPw) {
      setPwError('Please fill in all fields.');
      return;
    }
    if (newPw.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwError('New passwords do not match.');
      return;
    }
    setPwError('');
    setPwSuccess('Password updated successfully.');
    setPwStep('idle');
    setNewPw('');
    setConfirmPw('');
    setPwCode('');
  }

  // ---- Two-factor handlers ----
  function sendTwoFactorCode(method: TwoFactorMethod) {
    setTwoFactorMethod(method);
    setCode('');
    setCodeError('');
    setTwoFactorStep('code');
  }

  function verifyTwoFactorCode() {
    if (code.trim().length !== 6) {
      setCodeError(
        twoFactorMethod === 'email'
          ? 'Enter the 6-digit code we sent to your email.'
          : 'Enter the 6-digit code we sent by SMS.',
      );
      return;
    }
    setCodeError('');
    setTwoFactor(true);
    setTwoFactorStep('idle');
    setCode('');
  }

  function disableTwoFactor() {
    setTwoFactor(false);
    setTwoFactorStep('idle');
    setCode('');
  }

  return (
    <div className="space-y-5">
      {/* Change password */}
      <section className="rounded-lg border border-background-200 bg-background-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[15px] font-bold text-foreground-950">Change password</h2>
          {pwStep === 'newPassword' && (
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="flex items-center gap-1.5 text-[12px] font-medium text-foreground-600 hover:text-foreground-800 cursor-pointer whitespace-nowrap"
            >
              <i className={`${showPw ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm leading-none`} />
              {showPw ? 'Hide' : 'Show'} password
            </button>
          )}
        </div>

        <SuccessNote message={pwSuccess} />

        {pwStep === 'idle' && (
          <div className="mt-3">
            <p className="text-[13px] text-foreground-600">
              We&apos;ll verify it&apos;s you by sending a 6-digit code to your registered email, then you can set a new
              password.
            </p>
            <button
              type="button"
              onClick={requestPasswordCode}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-lock-password-line text-sm leading-none" />
              Change password
            </button>
          </div>
        )}

        {pwStep === 'code' && (
          <div className="mt-3">
            <p className="text-[13px] text-foreground-600">
              We sent a 6-digit code to <span className="font-medium text-foreground-900">{driverProfile.email}</span>.
            </p>
            <p className="mt-1 text-[11px] text-foreground-500">Demo: use code {DEMO_CODE}</p>
            <div className="mt-3">
              <CodeInput value={pwCode} onChange={setPwCode} />
            </div>
            <ErrorNote message={pwError} />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPwStep('idle');
                  setPwCode('');
                  setPwError('');
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-700 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors hover:bg-background-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={verifyPasswordCode}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
              >
                Verify code
              </button>
            </div>
            <button
              type="button"
              onClick={requestPasswordCode}
              className="mt-3 w-full text-center text-[12px] font-medium text-foreground-600 hover:text-foreground-800 cursor-pointer whitespace-nowrap"
            >
              Didn&apos;t get a code? Resend
            </button>
          </div>
        )}

        {pwStep === 'newPassword' && (
          <div className="mt-4 space-y-3">
            <PasswordField id="new-pw" label="New password" value={newPw} onChange={setNewPw} show={showPw} autoComplete="new-password" />
            <PasswordField id="confirm-pw" label="Confirm new password" value={confirmPw} onChange={setConfirmPw} show={showPw} autoComplete="new-password" />
            <ErrorNote message={pwError} />
            <button
              type="button"
              onClick={savePassword}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-save-line text-sm leading-none" />
              Update password
            </button>
          </div>
        )}
      </section>

      {/* Two-Factor Authentication */}
      <section className="rounded-lg border border-background-200 bg-background-50 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-[15px] font-bold text-foreground-950">Two-Factor Authentication</h2>
          {twoFactor ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2.5 py-1 text-[11px] font-semibold text-accent-800 whitespace-nowrap">
              <i className="ri-shield-check-line text-[12px] leading-none" />
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-background-200 px-2.5 py-1 text-[11px] font-semibold text-foreground-600 whitespace-nowrap">
              Disabled
            </span>
          )}
        </div>

        {twoFactor ? (
          <>
            <p className="mt-2 text-[13px] text-foreground-600">
              Two-factor authentication is enabled. You&apos;ll be asked for a code when signing in on a new device.
            </p>
            <button
              type="button"
              onClick={disableTwoFactor}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-700 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors hover:bg-background-100"
            >
              <i className="ri-shield-line text-sm leading-none" />
              Disable two-factor authentication
            </button>
          </>
        ) : twoFactorStep === 'choose' ? (
          <div className="mt-3">
            <p className="text-[13px] text-foreground-600">Choose how you want to receive your verification code.</p>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={() => sendTwoFactorCode('email')}
                className="flex w-full items-center gap-3 rounded-md border border-background-300 bg-background-50 px-3 py-3 text-left cursor-pointer transition-colors hover:border-primary-400 hover:bg-background-100"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background-200 text-foreground-700">
                  <i className="ri-mail-line text-base leading-none" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-foreground-900">Email code</span>
                  <span className="block text-[12px] text-foreground-600">{driverProfile.email}</span>
                </span>
                <i className="ri-arrow-right-s-line text-lg leading-none text-foreground-500" />
              </button>
              <button
                type="button"
                onClick={() => sendTwoFactorCode('sms')}
                className="flex w-full items-center gap-3 rounded-md border border-background-300 bg-background-50 px-3 py-3 text-left cursor-pointer transition-colors hover:border-primary-400 hover:bg-background-100"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background-200 text-foreground-700">
                  <i className="ri-smartphone-line text-base leading-none" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-foreground-900">SMS code</span>
                  <span className="block text-[12px] text-foreground-600">{driverProfile.phone}</span>
                </span>
                <i className="ri-arrow-right-s-line text-lg leading-none text-foreground-500" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setTwoFactorStep('idle')}
              className="mt-3 w-full text-center text-[12px] font-medium text-foreground-600 hover:text-foreground-800 cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        ) : twoFactorStep === 'code' ? (
          <div className="mt-3">
            <p className="text-[13px] text-foreground-600">
              {twoFactorMethod === 'email' ? (
                <>
                  We sent a 6-digit code to <span className="font-medium text-foreground-900">{driverProfile.email}</span>.
                </>
              ) : (
                <>
                  We sent a 6-digit code by SMS to <span className="font-medium text-foreground-900">{driverProfile.phone}</span>.
                </>
              )}
            </p>
            <p className="mt-1 text-[11px] text-foreground-500">Demo: use code {DEMO_CODE}</p>
            <div className="mt-3">
              <CodeInput value={code} onChange={setCode} />
            </div>
            <ErrorNote message={codeError} />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setTwoFactorStep('choose');
                  setCode('');
                  setCodeError('');
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-background-300 bg-background-50 text-foreground-700 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors hover:bg-background-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={verifyTwoFactorCode}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
              >
                <i className="ri-check-line text-sm leading-none" />
                Verify
              </button>
            </div>
            <button
              type="button"
              onClick={() => sendTwoFactorCode(twoFactorMethod)}
              className="mt-3 w-full text-center text-[12px] font-medium text-foreground-600 hover:text-foreground-800 cursor-pointer whitespace-nowrap"
            >
              Didn&apos;t get a code? Resend
            </button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-[13px] text-foreground-600">
              Add an extra layer of security by requiring a verification code when you sign in.
            </p>
            <button
              type="button"
              onClick={() => {
                setCode('');
                setCodeError('');
                setTwoFactorStep('choose');
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2.5 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-shield-keyhole-line text-sm leading-none" />
              Enable Two-Factor Authentication
            </button>
          </>
        )}
      </section>
    </div>
  );
}