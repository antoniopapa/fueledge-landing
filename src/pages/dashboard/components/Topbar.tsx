import { useState } from 'react';
import NewOrderModal from './NewOrderModal';
import GlobalSearch from './GlobalSearch';
import NotificationsMenu from './NotificationsMenu';
import LanguageMenu from './LanguageMenu';

type TopbarProps = {
  onMenu: () => void;
  onAiToggle: () => void;
  aiOpen: boolean;
};

export default function Topbar({ onMenu, onAiToggle, aiOpen }: TopbarProps) {
  const [orderOpen, setOrderOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function handleCreated(orderId: string) {
    setOrderOpen(false);
    setToast(`Order ${orderId} created`);
    window.setTimeout(() => setToast(null), 2800);
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 h-16 px-4 md:px-6 bg-background-50/95 backdrop-blur border-b border-background-200">
      <button
        type="button"
        onClick={onMenu}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-md text-foreground-700 hover:bg-background-200/60 cursor-pointer"
        aria-label="Open menu"
      >
        <i className="ri-menu-line text-xl leading-none" />
      </button>

      <div className="hidden md:block flex-1 min-w-0 max-w-md">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          onClick={onAiToggle}
          className={`flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors cursor-pointer ${
            aiOpen
              ? 'bg-primary-500 text-background-50'
              : 'text-foreground-600 hover:bg-background-200/70 hover:text-foreground-900'
          }`}
          aria-label={aiOpen ? 'Close AI assistant' : 'Open AI assistant'}
          aria-pressed={aiOpen}
        >
          <i className="ri-sparkling-2-line text-lg leading-none" />
        </button>
        <NotificationsMenu />
        <LanguageMenu />

        <button
          type="button"
          onClick={() => setOrderOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap transition-colors cursor-pointer"
        >
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-add-line text-sm leading-none" />
          </span>
          New Order
        </button>
      </div>

      {orderOpen && <NewOrderModal onClose={() => setOrderOpen(false)} onCreated={handleCreated} />}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          {toast}
        </div>
      )}
    </header>
  );
}
