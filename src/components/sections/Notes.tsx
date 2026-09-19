import { useEffect, useState } from 'react';
import { Loader2, Send, Quote, ChevronLeft, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { useLightbox, type LightboxItem } from '@/components/Lightbox';
import { useAccess } from '@/context/AccessContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { SpecialNote } from '@/types';

const PAGE_SIZE = 9;

export function Notes() {
  const { guest } = useAccess();
  const { t, locale } = useLanguage();
  const [notes, setNotes] = useState<SpecialNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    void loadNotes();
  }, []);

  useEffect(() => {
    if (guest?.full_name) {
      setAuthorName(guest.full_name);
    }
  }, [guest]);

  async function loadNotes() {
    setLoading(true);
    const { data } = await supabase
      .from('special_notes')
      .select('*')
      .order('created_at', { ascending: false });
    setNotes((data as SpecialNote[]) ?? []);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;
    setSubmitting(true);
    setError(null);
    setSent(false);
    const { error: err } = await supabase.from('special_notes').insert({
      guest_id: guest.id,
      author_name: authorName,
      note: text,
      is_approved: false,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    setText('');
    setSent(true);
    void loadNotes();
  };

  // Everyone sees approved notes. A guest also sees their own notes that are still waiting for review.
  const visibleNotes = notes.filter((n) => n.is_approved || n.guest_id === guest?.id);
  const pendingCount = notes.filter((n) => !n.is_approved && n.guest_id === guest?.id).length;

  // Build lightbox items from the notes this guest can see
  const lightboxItems: LightboxItem[] = visibleNotes.map((n) => ({
    id: n.id,
    body: n.note,
    subtitle: n.author_name,
    title: new Date(n.created_at).toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  }));

  const { lightbox, openAt } = useLightbox(lightboxItems);

  // Pagination
  const totalPages = Math.ceil(visibleNotes.length / PAGE_SIZE);
  const safePage = Math.min(page, Math.max(0, totalPages - 1));
  const pageStart = safePage * PAGE_SIZE;
  const pageEnd = pageStart + PAGE_SIZE;
  const pageItems = visibleNotes.slice(pageStart, pageEnd);

  return (
    <section id="notes" className="py-24 sm:py-32 paper-texture">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow={t('From the Heart', 'Desde el corazón')}
            title={t('Special Notes to the Couple', 'Mensajes especiales para los novios')}
            subtitle={t(
              'Share a favorite memory, a piece of advice, or a heartfelt wish for Sunshine and Jose.',
              'Comparte un recuerdo favorito, un consejo o un deseo de corazón para Sunshine y Jose.',
            )}
          />
        </Reveal>

        {/* Submit box */}
        <Reveal delay={100}>
          <div className="mt-12 max-w-2xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="bg-cream-50 rounded-2xl p-6 shadow-sm border border-cream-200"
            >
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t('Your name', 'Tu nombre')}
                className="w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-warmgray-800 font-body text-sm focus:outline-none focus:border-wine-400 focus:ring-2 focus:ring-wine-200 transition mb-3"
              />
              <textarea
                required
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setSent(false);
                }}
                rows={4}
                placeholder={t('Write your note to Sunshine & Jose...', 'Escribe tu mensaje para Sunshine y Jose...')}
                className="w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-warmgray-800 font-body text-sm focus:outline-none focus:border-wine-400 focus:ring-2 focus:ring-wine-200 transition resize-none"
              />
              {error && (
                <p className="mt-3 text-sm text-wine-700 bg-wine-50 rounded-lg px-4 py-2 border border-wine-200">
                  {error}
                </p>
              )}
              {sent && (
                <p className="mt-3 flex items-start gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-2 border border-emerald-200">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>
                    {t(
                      'Thank you! Your note was sent and will appear once Sunshine & Jose approve it.',
                      '¡Gracias! Tu mensaje fue enviado y aparecerá cuando Sunshine y Jose lo aprueben.',
                    )}
                  </span>
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 flex items-center gap-2 bg-wine-600 hover:bg-wine-700 disabled:opacity-60 text-cream-50 font-body font-medium rounded-full px-6 py-2.5 text-sm transition-colors"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {t('Send Note', 'Enviar mensaje')}
              </button>
            </form>
            <p className="mt-3 text-xs text-warmgray-400 font-body text-center">
              {t(
                'Notes are reviewed by Sunshine & Jose before appearing here.',
                'Sunshine y Jose revisan los mensajes antes de que aparezcan aquí.',
              )}
              {pendingCount > 0 && (
                <span className="block mt-1 text-gold-700 font-medium">
                  {t(
                    `You have ${pendingCount} note${pendingCount !== 1 ? 's' : ''} waiting for approval.`,
                    `Tienes ${pendingCount} ${pendingCount !== 1 ? 'mensajes pendientes' : 'mensaje pendiente'} de aprobación.`,
                  )}
                </span>
              )}
            </p>
          </div>
        </Reveal>

        {/* Notes grid — compact cards */}
        <div className="mt-14">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-wine-500" size={28} />
            </div>
          ) : visibleNotes.length === 0 ? (
            <p className="text-center text-warmgray-400 font-body text-sm italic py-8">
              {t(
                'No notes yet — be the first to share your well wishes.',
                'Aún no hay mensajes: sé el primero en compartir tus buenos deseos.',
              )}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pageItems.map((note, i) => (
                  <Reveal key={note.id} delay={(i % 3) * 80}>
                    <button
                      onClick={() => openAt(pageStart + i)}
                      className="w-full text-left bg-cream-50 rounded-2xl p-5 border border-cream-200 shadow-sm hover:shadow-md hover:border-wine-200 transition-all duration-300 group h-full flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Quote size={20} className="text-gold-400 shrink-0" />
                        {!note.is_approved && (
                          <span className="flex items-center gap-1 bg-gold-500/90 text-white text-[11px] font-body font-medium px-2.5 py-1 rounded-full">
                            <Clock size={12} />
                            {t('Pending', 'Pendiente')}
                          </span>
                        )}
                      </div>
                      <p className="text-warmgray-700 font-body text-sm leading-relaxed line-clamp-3 flex-1">
                        {note.note}
                      </p>
                      <div className="mt-4 flex items-center gap-2 shrink-0">
                        <span className="h-8 w-8 rounded-full bg-wine-100 flex items-center justify-center text-wine-700 font-display text-sm font-medium">
                          {note.author_name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-body text-xs font-medium text-warmgray-700 truncate">
                            {note.author_name}
                          </p>
                          <p className="font-body text-[11px] text-warmgray-400">
                            {new Date(note.created_at).toLocaleDateString(locale, {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="mt-3 text-xs font-body text-wine-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('Read full note', 'Leer mensaje completo')}
                      </span>
                    </button>
                  </Reveal>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={safePage === 0}
                    className="flex items-center gap-1.5 text-sm font-body font-medium text-warmgray-600 hover:text-wine-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    <ChevronLeft size={16} />
                    {t('Previous', 'Anterior')}
                  </button>
                  <span className="text-sm font-body text-warmgray-400">
                    {t('Page', 'Página')} {safePage + 1} {t('of', 'de')} {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={safePage >= totalPages - 1}
                    className="flex items-center gap-1.5 text-sm font-body font-medium text-warmgray-600 hover:text-wine-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    {t('Next', 'Siguiente')}
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {lightbox}
    </section>
  );
}
