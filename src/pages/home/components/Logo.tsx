export default function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3" aria-label="FuelEdge home">
      <span className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center relative">
        <i className="ri-drop-fill text-background-50 text-[18px] leading-none" aria-hidden="true" />
        <span className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-primary-600" />
      </span>
      <span className="font-heading font-bold text-lg leading-none tracking-tight text-foreground-950">
        Fuel<span className="text-primary-600">Edge</span>
      </span>
    </a>
  );
}