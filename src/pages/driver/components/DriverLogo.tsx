export default function DriverLogo({ sub, small = false }: { sub?: string; small?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`${small ? 'w-8 h-8' : 'w-9 h-9'} rounded-xl bg-primary-600 flex items-center justify-center relative shrink-0`}
      >
        <i className={`ri-drop-fill text-background-50 ${small ? 'text-base' : 'text-[18px]'} leading-none`} aria-hidden="true" />
        <span className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-primary-600" />
      </span>
      <div className="flex flex-col leading-tight">
        <span className={`font-heading font-bold ${small ? 'text-[15px]' : 'text-lg'} leading-none tracking-tight text-foreground-950`}>
          Fuel<span className="text-primary-600">Edge</span>
        </span>
        {sub && (
          <span className={`${small ? 'text-[9px]' : 'text-[10px]'} font-medium uppercase tracking-wider text-foreground-400`}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}