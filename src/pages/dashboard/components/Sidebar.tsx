import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { dashboardNavGroups, settingsNav } from '@/mocks/dashboard';

type SidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium whitespace-nowrap transition-colors ${
    isActive
      ? 'bg-primary-500 text-background-50'
      : 'text-foreground-300 hover:bg-foreground-800/70 hover:text-background-50'
  }`;
}

export default function Sidebar({ className = '', onNavigate }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-60 flex-col bg-foreground-950 ${className}`}>
      {/* brand */}
      <div className="flex items-center gap-2.5 h-16 px-5 border-b border-foreground-800">
        <span className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
          <i className="ri-arrow-up-fill text-background-50 text-base leading-none" />
        </span>
        <span className="font-heading font-bold text-[15px] tracking-tight text-background-50">FuelEdge</span>
      </div>

      {/* grouped nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {dashboardNavGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p className="px-2.5 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground-400">
              {t(group.label)}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} onClick={onNavigate} className={navLinkClass}>
                    <span className="w-5 h-5 flex items-center justify-center">
                      <i className={`${item.icon} text-[15px] leading-none`} />
                    </span>
                    {t(item.label)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* bottom: settings + profile */}
      <div className="border-t border-foreground-800">
        <div className="px-3 pt-3 pb-1">
          <NavLink to={settingsNav.path} onClick={onNavigate} className={navLinkClass}>
            <span className="w-5 h-5 flex items-center justify-center">
              <i className={`${settingsNav.icon} text-[15px] leading-none`} />
            </span>
            {t(settingsNav.label)}
          </NavLink>
        </div>
        <div className="p-3 pt-1">
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
            <span className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
              <span className="text-[12px] font-bold text-primary-200">MK</span>
            </span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-background-50 leading-tight">Markus Keller</p>
              <p className="text-[10px] text-foreground-400 truncate">{t('dashboard.sidebar.role.operationsManager')}</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] font-medium text-foreground-400 hover:bg-foreground-800/70 hover:text-background-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-question-line text-[15px] leading-none" />
            </span>
            {t('dashboard.sidebar.items.helpSupport')}
          </button>
        </div>
      </div>
    </aside>
  );
}
