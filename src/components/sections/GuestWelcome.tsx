import { Heart } from 'lucide-react';
import { useAccess } from '@/context/AccessContext';

export function GuestWelcome() {
  const { guest } = useAccess();

  if (!guest?.welcome_note) return null;

  return (
    <section className="relative -mt-1 bg-wine-700 py-12 sm:py-14">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="h-px w-8 bg-gold-400/60" />
          <Heart size={16} className="text-gold-400" fill="currentColor" />
          <span className="h-px w-8 bg-gold-400/60" />
        </div>

        {guest.full_name && (
          <p className="text-gold-300 font-body text-xs uppercase tracking-[0.25em] mb-4">
            Dear {guest.full_name}
          </p>
        )}

        <p className="text-cream-100 font-body text-base sm:text-lg leading-relaxed italic">
          {guest.welcome_note}
        </p>
      </div>
    </section>
  );
}
