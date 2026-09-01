type ImagePlaceholderProps = {
  label: string;
  aspect?: string;
  className?: string;
};

export default function ImagePlaceholder({
  label,
  aspect = 'aspect-[16/9]',
  className = '',
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative ${aspect} rounded-xl border-2 border-dashed border-foreground-200/70 bg-background-100/50 overflow-hidden ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(oklch(var(--foreground-300) / 0.16) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <span className="w-11 h-11 rounded-lg bg-background-50 border border-foreground-200 flex items-center justify-center mx-auto">
            <i className="ri-image-line text-foreground-400 text-xl leading-none" />
          </span>
          <p className="mt-3 text-sm font-medium text-foreground-500">[{label}]</p>
        </div>
      </div>
    </div>
  );
}