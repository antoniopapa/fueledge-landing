import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDriverApp } from '@/pages/driver/DriverAppContext';

const tabs = [
  { labelKey: 'home', icon: 'ri-home-4-line', path: '/driver/home' },
  { labelKey: 'schedule', icon: 'ri-calendar-2-line', path: '/driver/schedule' },
  { labelKey: 'profile', icon: 'ri-user-3-line', path: '/driver/profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { newRunCount } = useDriverApp();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-background-200 bg-background-50">
      <div className="mx-auto grid max-w-md grid-cols-3">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          const showBadge = tab.path === '/driver/home' && newRunCount > 0;
          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                active ? 'text-primary-600' : 'text-foreground-400 hover:text-foreground-600'
              }`}
            >
              <span className="relative">
                <i className={`${tab.icon} text-[22px] leading-none`} />
                {showBadge && (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[9px] font-bold text-background-50">
                    {newRunCount}
                  </span>
                )}
              </span>
              {t(`driver.${tab.labelKey}`)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
