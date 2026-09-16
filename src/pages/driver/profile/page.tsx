import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DriverAppShell from '@/pages/driver/components/DriverAppShell';
import { useDriverApp } from '@/pages/driver/DriverAppContext';
import LanguageSelector from './components/LanguageSelector';
import SecurityScreen from './components/SecurityScreen';
import HistoryScreen from './components/HistoryScreen';
import ShiftsScreen from './components/ShiftsScreen';
import NavigationScreen from './components/NavigationScreen';
import ActivityStats from './components/ActivityStats';
import { NAV_APPS, getNavApp } from '@/pages/driver/navigation';
import { shiftRoster, dispatcherName, dispatcherPhone } from '@/mocks/driver';

type ProfileView = 'main' | 'security' | 'history' | 'shifts' | 'navigation';

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="flex items-center gap-3 text-sm text-foreground-600">
        <i className={`${icon} text-foreground-400 text-base leading-none`} />
        {label}
      </span>
      <span className="text-[13px] font-medium text-foreground-900">{value}</span>
    </div>
  );
}

export default function DriverProfilePage() {
  const { driver } = useDriverApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notifications, setNotifications] = useState(true);

  const viewParam = searchParams.get('view');
  const view: ProfileView =
    viewParam === 'security' ||
    viewParam === 'history' ||
    viewParam === 'shifts' ||
    viewParam === 'navigation'
      ? viewParam
      : 'main';

  const openView = (next: ProfileView) => {
    setSearchParams(next === 'main' ? {} : { view: next }, { replace: true });
  };

  const todayShift = shiftRoster.flatMap((week) => week.days).find((day) => day.isToday);
  const nextShiftTime = todayShift ? todayShift.time : shiftRoster[0].days[0].time;
  const navApp = NAV_APPS.find((app) => app.id === getNavApp());

  if (view === 'shifts') {
    return (
      <DriverAppShell title={t('driver.shifts')} onBack={() => openView('main')}>
        <ShiftsScreen />
      </DriverAppShell>
    );
  }

  if (view === 'security') {
    return (
      <DriverAppShell title={t('driver.security')} onBack={() => openView('main')}>
        <SecurityScreen />
      </DriverAppShell>
    );
  }

  if (view === 'history') {
    return (
      <DriverAppShell title={t('driver.activityHistory')} onBack={() => openView('main')}>
        <HistoryScreen />
      </DriverAppShell>
    );
  }

  if (view === 'navigation') {
    return (
      <DriverAppShell title={t('driver.navigation')} onBack={() => openView('main')}>
        <NavigationScreen />
      </DriverAppShell>
    );
  }

  return (
    <DriverAppShell>
      <div className="mt-4 flex items-center gap-4 rounded-lg border border-background-200 bg-background-50 p-4">
        <img
          src={driver.avatar}
          alt={driver.name}
          className="w-14 h-14 rounded-full object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="font-heading text-[16px] font-bold text-foreground-950">{driver.name}</p>
          <p className="text-[12px] text-foreground-500">{driver.truck.registrationNumber} · {driver.trailer.registrationNumber}</p>
        </div>
      </div>

      <div className="mt-3">
        <ActivityStats />
      </div>

      <div className="mt-3 divide-y divide-background-200 rounded-lg border border-background-200 bg-background-50">
        <DetailRow icon="ri-mail-line" label={t('driver.email')} value={driver.email} />
        <DetailRow icon="ri-phone-line" label={t('driver.phone')} value={driver.phone} />
        <a
          href={`tel:${dispatcherPhone}`}
          className="flex w-full items-center justify-between px-4 py-3 cursor-pointer hover:bg-background-100 transition-colors"
        >
          <span className="flex items-center gap-3 text-sm text-foreground-600">
            <i className="ri-customer-service-line text-foreground-400 text-base leading-none" />
            {dispatcherName}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-primary-600">
            {t('driver.call')}
            <i className="ri-phone-line text-base leading-none" />
          </span>
        </a>
        <button
          type="button"
          onClick={() => openView('shifts')}
          className="flex w-full items-center justify-between px-4 py-3 cursor-pointer hover:bg-background-100 transition-colors"
        >
          <span className="flex items-center gap-3 text-sm text-foreground-600">
            <i className="ri-calendar-line text-foreground-400 text-base leading-none" />
            {t('driver.shifts')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[13px] font-medium text-foreground-900">{t('driver.todayAt', { time: nextShiftTime })}</span>
            <i className="ri-arrow-right-s-line text-foreground-400 text-base leading-none" />
          </span>
        </button>
      </div>

      <div className="mt-5 divide-y divide-background-200 rounded-lg border border-background-200 bg-background-50">
        <button
          type="button"
          onClick={() => setNotifications((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-background-100 transition-colors"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-foreground-800">
            <i className="ri-notification-3-line text-foreground-500 text-base leading-none" />
            {t('driver.notifications')}
          </span>
          <span
            className={`relative h-5 w-9 rounded-full transition-colors ${
              notifications ? 'bg-primary-500' : 'bg-background-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-background-50 transition-all ${
                notifications ? 'left-4' : 'left-0.5'
              }`}
            />
          </span>
        </button>

        <LanguageSelector />

        <button
          type="button"
          onClick={() => openView('navigation')}
          className="flex w-full items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-background-100 transition-colors"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-foreground-800">
            <i className="ri-navigation-line text-foreground-500 text-base leading-none" />
            {t('driver.navigation')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[13px] text-foreground-600">{navApp?.label}</span>
            <i className="ri-arrow-right-s-line text-foreground-400 text-base leading-none" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => openView('security')}
          className="flex w-full items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-background-100 transition-colors"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-foreground-800">
            <i className="ri-shield-check-line text-foreground-500 text-base leading-none" />
            {t('driver.security')}
          </span>
          <i className="ri-arrow-right-s-line text-foreground-400 text-base leading-none" />
        </button>

        <button
          type="button"
          onClick={() => openView('history')}
          className="flex w-full items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-background-100 transition-colors"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-foreground-800">
            <i className="ri-history-line text-foreground-500 text-base leading-none" />
            {t('driver.activityHistory')}
          </span>
          <i className="ri-arrow-right-s-line text-foreground-400 text-base leading-none" />
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-background-100 transition-colors"
        >
          <span className="flex items-center gap-3 text-sm font-medium text-foreground-800">
            <i className="ri-question-line text-foreground-500 text-base leading-none" />
            {t('driver.helpSupport')}
          </span>
          <i className="ri-arrow-right-s-line text-foreground-400 text-base leading-none" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate('/driver')}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-foreground-200 bg-background-50 text-foreground-700 text-sm font-semibold px-4 py-3 whitespace-nowrap cursor-pointer transition-colors hover:bg-background-100"
      >
        <i className="ri-logout-box-line text-sm leading-none" />
        {t('driver.signOut')}
      </button>
    </DriverAppShell>
  );
}
