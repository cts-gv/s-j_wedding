import { Heart, ArrowRight } from 'lucide-react';
import { useAccess } from '@/context/AccessContext';
import { useLanguage } from '@/i18n/LanguageContext';

interface WelcomeNoteModalProps {
  onDismiss: () => void;
}

export function WelcomeNoteModal({ onDismiss }: WelcomeNoteModalProps) {
  const { guest } = useAccess();
  const { t } = useLanguage();

  if (!guest?.welcome_note) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-warmgray-900/60 backdrop-blur-sm"
        onClick={onDismiss}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md bg-cream-50 rounded-3xl shadow-2xl border border-cream-200 overflow-hidden animate-fade-up">
        <div className="bg-wine-700 px-6 py-6 text-center text-cream-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size={18} className="text-gold-400" fill="currentColor" />
            <span className="font-display text-lg tracking-wide">
              {t('A Note From', 'Un mensaje de')} Sunshine{' '}
              <span className="text-gold-400 font-light">{t('&', 'y')}</span> Jose
            </span>
            <Heart size={18} className="text-gold-400" fill="currentColor" />
          </div>
          {guest.full_name && (
            <p className="text-gold-300 text-xs uppercase tracking-[0.2em]">
              {t('Dear', 'Para')} {guest.full_name}
            </p>
          )}
        </div>

        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <p className="text-warmgray-700 font-body text-base leading-relaxed text-center italic">
            {guest.welcome_note}
          </p>

          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gold-400/50" />
            <Heart size={12} className="text-gold-400" fill="currentColor" />
            <span className="h-px w-10 bg-gold-400/50" />
          </div>

          <button
            onClick={onDismiss}
            className="mt-7 w-full bg-wine-600 hover:bg-wine-700 text-cream-50 font-body font-medium rounded-full py-3.5 transition-colors flex items-center justify-center gap-2"
          >
            {t('Enter the Site', 'Entrar al sitio')}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
