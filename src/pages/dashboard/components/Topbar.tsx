import GlobalSearch from './GlobalSearch';
import NotificationsMenu from './NotificationsMenu';
import LanguageMenu from './LanguageMenu';

type TopbarProps = {
  onMenu: () => void;
  onAiToggle: () => void;
  aiOpen: boolean;
};

export default function Topbar({ onMenu, onAiToggle, aiOpen }: TopbarProps) {
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
      </div>
    </header>
  );
}
