import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifications, type NotificationTone, type NotificationItem } from '@/mocks/notifications';

const toneIcon: Record<NotificationTone, string> = {
  info: 'bg-primary-100 text-primary-700',
  warning: 'bg-secondary-100 text-secondary-700',
  danger: 'bg-red-100 text-red-600',
  success: 'bg-accent-100 text-accent-700',
};

export default function NotificationsMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(notifications);
  const ref = useRef<HTMLDivElement>(null);

  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function openItem(item: NotificationItem) {
    setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
    if (item.link) navigate(item.link);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 flex items-center justify-center rounded-md text-foreground-600 hover:bg-background-200/60 relative cursor-pointer"
        aria-label="Известия"
      >
        <i className="ri-notification-3-line text-lg leading-none" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-secondary-500 text-background-50 text-[9px] font-bold flex items-center justify-center ring-2 ring-background-50">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-1 w-80 rounded-md border border-background-200 bg-background-50 shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-background-200 bg-background-100/40">
            <span className="text-[12px] font-semibold text-foreground-900">Известия</span>
            <button
              type="button"
              onClick={markAllRead}
              className="text-[11px] font-medium text-primary-700 hover:text-primary-800 cursor-pointer whitespace-nowrap"
            >
              Маркирай всички като прочетени
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-background-100">
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => openItem(n)}
                className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-background-100 cursor-pointer ${
                  n.read ? '' : 'bg-primary-50/40'
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${toneIcon[n.tone]}`}>
                  <i className={`${n.icon} text-[15px] leading-none`} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold text-foreground-900 whitespace-nowrap">{n.title}</span>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />}
                  </span>
                  <span className="block text-[11px] text-foreground-500 mt-0.5 leading-snug">{n.detail}</span>
                  <span className="block text-[10px] text-foreground-400 mt-1 whitespace-nowrap">{n.time}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
