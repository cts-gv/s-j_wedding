import { Calendar, MapPin } from 'lucide-react';
import { Countdown } from '@/components/Countdown';
import { WEDDING_LOCATION } from '@/constants';
import { useLanguage } from '@/i18n/LanguageContext';

export function Hero() {
  const { t, weddingDate } = useLanguage();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/219776/pexels-photo-219776.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt={t(
            'Couple sharing a kiss surrounded by autumn colors',
            'Pareja besándose rodeada de colores otoñales',
          )}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warmgray-900/50 via-warmgray-900/40 to-warmgray-900/70" />
      </div>

      {/* Decorative floating leaves */}
      <div className="absolute top-24 left-[8%] text-gold-400/60 animate-float-slow hidden md:block">
        <Leaf />
      </div>
      <div
        className="absolute bottom-32 right-[10%] text-wine-400/50 animate-float-slow hidden md:block"
        style={{ animationDelay: '1.5s' }}
      >
        <Leaf className="rotate-180" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-20 max-w-4xl">
        <p className="text-gold-300 uppercase tracking-widest-2 text-sm font-body font-medium animate-fade-in">
          {t("Come Celebrate Our Love and Marriage", 'Ven a Celebrar Nuestro amor y Nuestro Matrimonio')}
        </p>
        <h1 className="mt-6 font-display text-6xl sm:text-7xl md:text-8xl text-cream-50 font-medium leading-none animate-fade-up">
          Sunshine
          <span className="block text-gold-400 text-4xl sm:text-5xl font-light italic my-2">
            &amp;
          </span>
          Jose
        </h1>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-cream-100 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <span className="flex items-center gap-2 font-body text-sm sm:text-base">
            <Calendar size={18} className="text-gold-400" />
            {weddingDate}
          </span>
          <span className="hidden sm:block h-4 w-px bg-cream-200/40" />
          <span className="flex items-center gap-2 font-body text-sm sm:text-base">
            <MapPin size={18} className="text-gold-400" />
            {WEDDING_LOCATION}
          </span>
        </div>

        <div
          className="mt-10 animate-fade-up"
          style={{ animationDelay: '500ms' }}
        >
          <a
            href="#rsvp"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#rsvp')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-block bg-wine-600 hover:bg-wine-700 text-cream-50 font-body font-medium tracking-wide px-10 py-3.5 rounded-full transition-all hover:scale-105 shadow-lg"
          >
            {t('RSVP Now', 'Confirmar asistencia')}
          </a>
        </div>

        <div className="mt-10 animate-fade-up" style={{ animationDelay: '600ms' }}>
          <Countdown />
        </div>

        <p className="mt-10 text-cream-200/80 font-body text-sm italic animate-fade-in" style={{ animationDelay: '800ms' }}>
          {t(
            '"Love is the master key that opens the gates of happiness."',
            '"El amor es la llave maestra que abre las puertas de la felicidad."',
          )}
        </p>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-200/70">
        <span className="text-xs font-body uppercase tracking-widest-2">
          {t('Scroll', 'Desplázate')}
        </span>
        <span className="block w-px h-10 bg-cream-200/40 animate-pulse" />
      </div>
    </section>
  );
}

function Leaf({ className = '' }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}
