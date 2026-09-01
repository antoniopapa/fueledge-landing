import type { ReactNode } from 'react';

interface PanelProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function Panel({ title, subtitle, action, children }: PanelProps) {
  return (
    <div className="rounded-lg border border-background-200 bg-background-50 overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-background-200">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground-950">{title}</h2>
          {subtitle && <p className="text-[11px] text-foreground-400 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}