import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

type DashboardShellProps = {
  children: ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-100 text-foreground-900">
      {/* desktop sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground-950/40"
            onClick={() => setOpen(false)}
          />
          <Sidebar className="flex" onNavigate={() => setOpen(false)} />
        </div>
      )}

      <div className="lg:pl-60">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}