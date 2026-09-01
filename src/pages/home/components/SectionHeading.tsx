import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
};

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: SectionHeadingProps) {
  const { i18n } = useTranslation();
  const compact = ['ro', 'fr', 'pl', 'hu', 'cz', 'bg'].includes(i18n.language);
  const alignCls = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';
  return (
    <div className={`flex flex-col ${alignCls} max-w-2xl`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-700">{eyebrow}</span>
      <h2 className={`mt-2 font-heading font-bold tracking-tight text-foreground-950 leading-tight ${compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-sm text-foreground-600 leading-relaxed">{subtitle}</p>}
    </div>
  );
}