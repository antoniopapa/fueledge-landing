import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import DriverLogo from '@/pages/driver/components/DriverLogo';

export default function DriverLoginPage() {
  const navigate = useNavigate();
  const { driver } = useDriverApp();
  const [email, setEmail] = useState("ivan@fueledge.eu");
  const [password, setPassword] = useState('fueledge-demo');
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate('/driver/home');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border border-background-200 bg-background-50 p-6 md:p-8">
          <DriverLogo sub="Driver App" />

          <h1 className="mt-6 font-heading text-xl font-bold text-foreground-950">Welcome back</h1>
          <p className="mt-1 text-sm text-foreground-500">Sign in to start your shift and view your runs.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="driver-email" className="block text-[12px] font-medium text-foreground-600 mb-1.5">
                Email
              </label>
              <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-2.5 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/15">
                <i className="ri-mail-line text-foreground-400 text-sm leading-none" />
                <input
                  id="driver-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground-900 outline-none"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="driver-password" className="block text-[12px] font-medium text-foreground-600 mb-1.5">
                Password
              </label>
              <div className="flex items-center gap-2 rounded-md border border-background-300 bg-background-50 px-3 py-2.5 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/15">
                <i className="ri-lock-line text-foreground-400 text-sm leading-none" />
                <input
                  id="driver-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground-900 outline-none"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-foreground-400 hover:text-foreground-700 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm leading-none`} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[12px] text-foreground-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-background-300 text-primary-500" />
                Remember me
              </label>
              <button type="button" className="text-[12px] font-medium text-primary-700 hover:text-primary-800 cursor-pointer">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors"
            >
              <i className="ri-login-box-line text-sm leading-none" />
              Login
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-foreground-400">
          Demo driver account · {driver.name} · {driver.truck.registrationNumber}
        </p>
      </div>
    </div>
  );
}