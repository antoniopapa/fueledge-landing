import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import DashboardShell from './DashboardShell';

export interface SubNavItem {
  label: string;
  path: string;
  end?: boolean;
}

interface ModuleShellProps {
  title: string;
  description: string;
  icon?: string;
  subNav?: SubNavItem[];
  children?: ReactNode;
}

export default function ModuleShell({
  title,
  description,
  icon = 'ri-file-list-3-line',
  subNav,
  children,
}: ModuleShellProps) {
  return (
    <DashboardShell>
      <div className="max-w-6xl">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-background-200 flex items-center justify-center shrink-0">
            <i className={`${icon} text-foreground-500 text-lg leading-none`} />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground-950">{title}</h1>
            <p className="text-sm text-foreground-500 mt-0.5">{description}</p>
          </div>
        </div>

        {subNav && subNav.length > 0 && (
          <div className="mt-5 flex items-center gap-1 border-b border-background-200 overflow-x-auto">
            {subNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `relative px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'text-primary-700' : 'text-foreground-500 hover:text-foreground-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-primary-500" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        )}

        <div className="mt-6">
          {children ?? (
            <div className="rounded-lg border border-dashed border-background-300 bg-background-50 p-14 text-center">
              <i className="ri-tools-line text-foreground-300 text-3xl leading-none" />
              <p className="mt-3 text-sm font-medium text-foreground-600">Coming soon</p>
              <p className="text-xs text-foreground-400 mt-1">This module will be built out in a later step.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}