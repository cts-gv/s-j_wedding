import type { ReactNode } from 'react';

interface SectionTitleProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionTitleProps) {
  return (
    <div
      className={`${align === 'center' ? 'text-center mx-auto' : 'text-left'} max-w-2xl ${className}`}
    >
      {eyebrow && (
        <p className="text-gold-600 uppercase tracking-widest-2 text-xs font-body font-medium mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl sm:text-5xl text-wine-700 font-display font-medium text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-warmgray-500 text-base sm:text-lg font-body leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-6 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}
      >
        <span className="h-px w-10 bg-gold-400" />
        <span className="block h-2 w-2 rotate-45 bg-gold-400" />
        <span className="h-px w-10 bg-gold-400" />
      </div>
    </div>
  );
}
