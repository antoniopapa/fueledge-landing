const legendItems = [
  { label: 'Планиран', swatch: 'bg-primary-500' },
  { label: 'Изпратен / в ход', swatch: 'bg-indigo-500' },
  { label: 'Закъснение / внимание', swatch: 'bg-secondary-500' },
  { label: 'Конфликт', swatch: 'bg-red-500' },
  { label: 'Завършен', swatch: 'bg-accent-500' },
];

export default function Legend() {
  return (
    <div className="mb-3 flex items-center gap-4 flex-wrap">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-foreground-400">Статус</span>
      {legendItems.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-foreground-600 whitespace-nowrap">
          <span className={`w-2.5 h-2.5 rounded-full ${item.swatch}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
