import { Globe } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface LanguageToggleProps {
  /**
   * light   – for dark or photo backgrounds (splash screen, header over the hero)
   * dark    – for light backgrounds (header after scrolling)
   * menu    – a full-width row inside the mobile menu
   */
  tone?: 'light' | 'dark' | 'menu';
  /** Show just "ES" / "EN" instead of "En Español" / "In English" (used in the tight mobile header). */
  compact?: boolean;
  className?: string;
}

const TONES: Record<NonNullable<LanguageToggleProps['tone']>, string> = {
  light:
    'rounded-full px-3.5 py-2 bg-cream-50/15 hover:bg-cream-50/25 text-cream-50 border border-cream-50/30 backdrop-blur-sm',
  dark: 'rounded-full px-3.5 py-2 text-wine-700 border border-wine-200 hover:bg-wine-50',
  menu: 'w-full text-left rounded-lg px-4 py-2.5 text-warmgray-700 hover:bg-cream-100 hover:text-wine-700',
};

export function LanguageToggle({ tone = 'light', compact = false, className = '' }: LanguageToggleProps) {
  const { lang, toggleLang } = useLanguage();

  // The button always names the language you would switch TO, written in that language.
  const goingTo = lang === 'en' ? 'es' : 'en';
  const fullLabel = goingTo === 'es' ? 'En Español' : 'In English';
  const shortLabel = goingTo === 'es' ? 'ES' : 'EN';

  return (
    <button
      type="button"
      onClick={toggleLang}
      lang={goingTo}
      aria-label={goingTo === 'es' ? 'Cambiar el sitio a español' : 'Switch the site to English'}
      className={`inline-flex items-center gap-1.5 text-sm font-body font-medium transition-colors ${TONES[tone]} ${className}`}
    >
      <Globe size={tone === 'menu' ? 16 : 15} />
      {compact ? shortLabel : fullLabel}
    </button>
  );
}
