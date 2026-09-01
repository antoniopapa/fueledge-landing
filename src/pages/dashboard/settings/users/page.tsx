import { useMemo, useState } from 'react';
import ModuleShell from '@/pages/dashboard/components/ModuleShell';
import { settingsNav } from '@/pages/dashboard/nav';
import { roles, users } from '@/mocks/settings';

const roleTone: Record<string, string> = {
  Admin: 'bg-primary-100 text-primary-700',
  'Operations Manager': 'bg-accent-100 text-accent-700',
  Dispatcher: 'bg-secondary-100 text-secondary-700',
  'Procurement / Supply': 'bg-foreground-200 text-foreground-700',
  'Finance / Billing': 'bg-foreground-200 text-foreground-700',
  'Read-only': 'bg-background-200 text-foreground-500',
};

export default function SettingsUsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const roleOptions = useMemo(() => ['All', ...roles.map((r) => r.name)], []);

  const filtered = useMemo(
    () => (roleFilter === 'All' ? users : users.filter((u) => u.role === roleFilter)),
    [roleFilter],
  );

  function invite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInviteOpen(false);
    setToast('Invitation sent');
    window.setTimeout(() => setToast(null), 2400);
  }

  return (
    <ModuleShell
      title="Users &amp; Roles"
      description="Manage team members and their access levels."
      icon="ri-user-line"
      subNav={settingsNav}
    >
      {/* roles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {roles.map((r) => (
          <div key={r.id} className="rounded-lg border border-background-200 bg-background-50 px-4 py-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-foreground-950">{r.name}</h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${roleTone[r.name]}`}>
                {r.members} members
              </span>
            </div>
            <p className="mt-1.5 text-[12px] text-foreground-500 leading-snug">{r.description}</p>
            <p className="mt-2 text-[11px] text-foreground-400">{r.permissions} permissions</p>
          </div>
        ))}
      </div>

      {/* users table */}
      <div className="mt-4 rounded-lg border border-background-200 bg-background-50 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-background-200">
          <div className="flex items-center gap-1 overflow-x-auto">
            {roleOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  roleFilter === r ? 'bg-primary-500 text-background-50' : 'text-foreground-600 hover:text-foreground-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer transition-colors"
          >
            <i className="ri-user-add-line text-sm leading-none" />
            Invite user
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-background-200 bg-background-100/40">
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">User</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Role</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Status</th>
                <th className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background-200">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-background-100/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-bold text-primary-700">{u.initials}</span>
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-foreground-900 whitespace-nowrap">{u.name}</p>
                        <p className="text-[11px] text-foreground-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${roleTone[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${u.status === 'Active' ? 'text-accent-700' : 'text-secondary-700'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-accent-500' : 'bg-secondary-500'}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-foreground-500 whitespace-nowrap">{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* invite modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground-950/40" onClick={() => setInviteOpen(false)} />
          <form onSubmit={invite} className="relative w-full max-w-md rounded-lg border border-background-200 bg-background-50 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground-950">Invite a team member</h3>
                <p className="text-[12px] text-foreground-500 mt-0.5">They&apos;ll receive an email invitation.</p>
              </div>
              <button type="button" onClick={() => setInviteOpen(false)} className="text-foreground-400 hover:text-foreground-700 cursor-pointer">
                <i className="ri-close-line text-lg leading-none" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-[11px] font-medium text-foreground-400">Name</span>
                <input required type="text" className="mt-1 w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </label>
              <label className="block">
                <span className="text-[11px] font-medium text-foreground-400">Email</span>
                <input required type="email" name="email" className="mt-1 w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </label>
              <label className="block">
                <span className="text-[11px] font-medium text-foreground-400">Role</span>
                <select className="mt-1 w-full rounded-md border border-background-200 bg-background-50 px-3 py-2 text-sm text-foreground-900 focus:outline-none focus:ring-2 focus:ring-primary-400">
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setInviteOpen(false)} className="rounded-md border border-foreground-200 px-4 py-2 text-sm font-medium text-foreground-700 hover:bg-background-100 cursor-pointer whitespace-nowrap">
                Cancel
              </button>
              <button type="submit" className="rounded-md bg-primary-500 hover:bg-primary-600 text-background-50 text-sm font-semibold px-4 py-2 whitespace-nowrap cursor-pointer">
                Send invite
              </button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border border-accent-300 bg-accent-50 px-4 py-3 text-[13px] font-medium text-accent-800">
          <i className="ri-checkbox-circle-line text-accent-600 text-base leading-none" />
          {toast}
        </div>
      )}
    </ModuleShell>
  );
}