import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark';
  size?: 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
};

const base =
  'inline-flex items-center justify-center gap-2 font-label font-semibold whitespace-nowrap rounded-md transition-colors duration-200 cursor-pointer select-none';

const variants: Record<string, string> = {
  primary: 'bg-primary-500 text-background-50 hover:bg-primary-600',
  secondary: 'bg-background-50 text-foreground-900 border border-foreground-200 hover:bg-background-100',
  ghost: 'text-foreground-700 hover:text-foreground-950 hover:bg-background-100',
  dark: 'bg-foreground-950 text-background-50 hover:bg-foreground-900',
};

const sizes: Record<string, string> = {
  md: 'text-sm px-4 py-2.5',
  lg: 'text-sm px-6 py-3.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}