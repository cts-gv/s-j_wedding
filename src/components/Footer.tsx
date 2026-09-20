import { Heart } from 'lucide-react';
import { WEDDING_LOCATION } from '@/constants';
import { useLanguage } from '@/i18n/LanguageContext';

export function Footer() {
  const { t, weddingDate } = useLanguage();
  return (
    <footer className="bg-warmgray-900 text-cream-200/70 py-14 border-t-2 border-royal-700">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart size={18} className="text-gold-500" fill="currentColor" />
          <span className="font-display text-xl text-cream-50">
            Sunshine <span className="text-gold-500 font-light">&amp;</span> Jose
          </span>
        </div>
        <p className="font-body text-sm text-cream-200/60">
          {weddingDate} · {WEDDING_LOCATION}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-gold-400/30" />
          <span className="block h-1.5 w-1.5 rotate-45 bg-royal-400" />
          <span className="h-px w-16 bg-gold-400/30" />
        </div>
        <p className="mt-6 font-body text-xs text-cream-200/40 italic max-w-md mx-auto">
          {t(
            '"And in her smile I see something more beautiful than the stars."',
            '"Y en su sonrisa veo algo más hermoso que las estrellas."',
          )}
        </p>
        <p className="mt-6 font-body text-xs text-cream-200/40">
          {t('Made with love for our family and friends', 'Hecho con amor para nuestra familia y amigos')} · {t('By', 'Por')} <a href="https://ctechsolution.tech" target="_blank" rel="noopener" className="text-amber-500/80 hover:text-amber-400 tracking-[0.2em] font-normal underline decoration-amber-500/20 underline-offset-4 transition-colors">
                Community Tech Solutions
            </a>
        </p>
      </div>
    </footer>
  );
}
