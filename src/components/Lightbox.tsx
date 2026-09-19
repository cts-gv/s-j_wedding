import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxItem {
  id: string;
  image?: string;
  title?: string;
  subtitle?: string;
  body?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const safeIndex = Math.max(0, Math.min(index, items.length - 1));
  const item = items[safeIndex];

  const goNext = useCallback(
    () => onNavigate((safeIndex + 1) % items.length),
    [safeIndex, items.length, onNavigate],
  );
  const goPrev = useCallback(
    () => onNavigate((safeIndex - 1 + items.length) % items.length),
    [safeIndex, items.length, onNavigate],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, goNext, goPrev]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-warmgray-900/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 flex items-center justify-center h-10 w-10 rounded-full bg-cream-50/10 hover:bg-cream-50/20 text-cream-50 transition-colors"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      {/* Previous */}
      {items.length > 1 && (
        <button
          onClick={goPrev}
          className="absolute left-2 sm:left-4 z-30 flex items-center justify-center h-11 w-11 rounded-full bg-cream-50/10 hover:bg-cream-50/20 text-cream-50 transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Next */}
      {items.length > 1 && (
        <button
          onClick={goNext}
          className="absolute right-2 sm:right-4 z-30 flex items-center justify-center h-11 w-11 rounded-full bg-cream-50/10 hover:bg-cream-50/20 text-cream-50 transition-colors"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Content */}
      <div className="relative z-20 max-w-4xl w-full mx-4 sm:mx-16">
        {item.image && (
          <img
            src={item.image}
            alt={item.title ?? ''}
            className="w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
          />
        )}
        {(item.title || item.body) && (
          <div className={`bg-cream-50 rounded-2xl shadow-2xl ${item.image ? 'mt-4' : ''} overflow-hidden`}>
            {item.title && (
              <div className="px-6 pt-5 flex items-center gap-3">
                {item.subtitle && (
                  <span className="h-9 w-9 rounded-full bg-wine-100 flex items-center justify-center text-wine-700 font-display text-sm font-medium shrink-0">
                    {item.subtitle.charAt(0).toUpperCase()}
                  </span>
                )}
                <div>
                  {item.subtitle && (
                    <p className="font-body text-sm font-medium text-warmgray-700">{item.subtitle}</p>
                  )}
                  {item.title && (
                    <p className="font-body text-xs text-warmgray-400">{item.title}</p>
                  )}
                </div>
              </div>
            )}
            {item.body && (
              <div className="px-6 py-5">
                <p className="font-body text-base text-warmgray-700 leading-relaxed italic">
                  &ldquo;{item.body}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Counter */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 text-cream-100 font-body text-sm">
          {safeIndex + 1} / {items.length}
        </div>
      )}
    </div>
  );
}

export function useLightbox(items: LightboxItem[]) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const navigate = useCallback((i: number) => setIndex(i), []);

  const lightbox = open ? (
    <Lightbox items={items} index={index} onClose={close} onNavigate={navigate} />
  ) : null;

  return { lightbox, openAt, close };
}
