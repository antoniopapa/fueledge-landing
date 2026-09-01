import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

type DriverAppShellProps = {
  children: ReactNode;
  title?: string;
  onBack?: () => void;
  showTabs?: boolean;
};

export default function DriverAppShell({ children, title, onBack, showTabs = true }: DriverAppShellProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background-50 border-x border-background-200">
        {title && (
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-background-200 bg-background-50/95 px-4 backdrop-blur">
            <button
              type="button"
              onClick={onBack ?? (() => navigate(-1))}
              className="w-9 h-9 flex items-center justify-center rounded-md text-foreground-700 hover:bg-background-200/60 cursor-pointer"
              aria-label="Back"
            >
              <i className="ri-arrow-left-line text-xl leading-none" />
            </button>
            <span className="font-heading text-[15px] font-semibold text-foreground-950">{title}</span>
          </header>
        )}

        <main className="flex-1 px-4 pb-28 pt-4">{children}</main>
        {showTabs && <BottomNav />}
      </div>
    </div>
  );
}