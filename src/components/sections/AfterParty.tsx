import { useEffect, useState, useCallback } from 'react';
import { Loader2, Upload, Trash2, Camera, X, Clock, CheckCircle2 } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { useAccess } from '@/context/AccessContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/lib/supabase';
import { compressImage } from '@/lib/compressImage';
import type { GuestPhoto } from '@/types';

export function AfterParty() {
  const { guest } = useAccess();
  const { t } = useLanguage();
  const [photos, setPhotos] = useState<GuestPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('guest_photos')
      .select('*')
      .order('created_at', { ascending: false });
    setPhotos((data as GuestPhoto[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadPhotos();
  }, [loadPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile || !guest) return;
    setError(null);

    setCompressing(true);
    const file = await compressImage(rawFile);
    setCompressing(false);

    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `${guest.id}/${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('wedding-photos')
      .upload(path, file, { contentType: file.type });

    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }

    const { error: dbErr } = await supabase.from('guest_photos').insert({
      guest_id: guest.id,
      uploader_name: guest.full_name ?? 'Guest',
      storage_path: path,
      caption: '',
      is_couple_upload: false,
    });

    setUploading(false);
    if (dbErr) {
      setError(dbErr.message);
      return;
    }
    void loadPhotos();
  };

  const handleDelete = async (photo: GuestPhoto) => {
    if (photo.guest_id !== guest?.id) return;
    await supabase.storage.from('wedding-photos').remove([photo.storage_path]);
    await supabase.from('guest_photos').delete().eq('id', photo.id);
    void loadPhotos();
  };

  const getUrl = (path: string) =>
    supabase.storage.from('wedding-photos').getPublicUrl(path).data.publicUrl;

  const visiblePhotos = photos.filter(
    (p) => p.is_approved || p.guest_id === guest?.id,
  );
  const pendingCount = photos.filter(
    (p) => !p.is_approved && p.guest_id === guest?.id,
  ).length;

  return (
    <section id="after" className="py-24 sm:py-32 bg-cream-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow={t('The Celebration Continues', 'La celebración continúa')}
            title={t('After Wedding Party', 'La fiesta después de la boda')}
            subtitle={t(
              'Guests can share photos from the big day and the festivities that followed. The couple will add their own photos here after the wedding.',
              'Los invitados pueden compartir fotos del gran día y de la fiesta que siguió. Los novios agregarán aquí sus propias fotos después de la boda.',
            )}
          />
        </Reveal>

        {/* Upload action */}
        <Reveal delay={100}>
          <div className="mt-12 flex flex-col items-center gap-3">
            <label
              className={`flex items-center gap-2 bg-wine-600 hover:bg-wine-700 text-cream-50 font-body font-medium rounded-full px-7 py-3 text-sm cursor-pointer transition-colors ${
                uploading || compressing ? 'opacity-60 pointer-events-none' : ''
              }`}
            >
              <Upload size={18} />
              {t('Upload Your Photos', 'Sube tus fotos')}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            <p className="text-xs text-warmgray-400 font-body text-center max-w-sm">
              {t(
                'Photos are reviewed by Sunshine & Jose before appearing here.',
                'Sunshine y Jose revisan las fotos antes de que aparezcan aquí.',
              )}
              {pendingCount > 0 && (
                <span className="block mt-1 text-gold-700 font-medium">
                  {t(
                    `You have ${pendingCount} photo${pendingCount !== 1 ? 's' : ''} waiting for approval.`,
                    `Tienes ${pendingCount} ${pendingCount !== 1 ? 'fotos pendientes' : 'foto pendiente'} de aprobación.`,
                  )}
                </span>
              )}
            </p>
          </div>
        </Reveal>

        {compressing && (
          <p className="mt-4 text-center text-warmgray-500 font-body text-sm flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> {t('Compressing photo...', 'Comprimiendo foto...')}
          </p>
        )}
        {uploading && (
          <p className="mt-4 text-center text-warmgray-500 font-body text-sm flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" /> {t('Uploading...', 'Subiendo...')}
          </p>
        )}
        {error && (
          <p className="mt-4 text-center text-sm text-wine-700 bg-wine-50 rounded-lg px-4 py-2 border border-wine-200 max-w-md mx-auto">
            {error}
          </p>
        )}

        {/* Gallery */}
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-wine-500" size={28} />
            </div>
          ) : visiblePhotos.length === 0 ? (
            <div className="text-center py-16">
              <Camera size={40} className="mx-auto text-warmgray-300" />
              <p className="mt-4 text-warmgray-400 font-body text-sm">
                {t('No photos yet. Be the first to share!', 'Aún no hay fotos. ¡Sé el primero en compartir!')}
              </p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
              {visiblePhotos.map((photo, i) => (
                <Reveal key={photo.id} delay={(i % 4) * 60}>
                  <div className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm border border-cream-200">
                    <img
                      src={getUrl(photo.storage_path)}
                      alt={photo.caption || `${t('Photo by', 'Foto de')} ${photo.uploader_name}`}
                      loading="lazy"
                      className={`w-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105 ${
                        !photo.is_approved ? 'opacity-60' : ''
                      }`}
                      onClick={() => setLightbox(getUrl(photo.storage_path))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-warmgray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-cream-50 font-body text-xs">{t('by', 'por')} {photo.uploader_name}</p>
                    </div>

                    {/* Pending badge for uploader's own unapproved photos */}
                    {!photo.is_approved && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-gold-500/90 text-white text-[11px] font-body font-medium px-2.5 py-1 rounded-full">
                        <Clock size={12} />
                        {t('Pending', 'Pendiente')}
                      </div>
                    )}
                    {/* Approved badge */}
                    {photo.is_approved && photo.guest_id === guest?.id && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-500/90 text-white text-[11px] font-body font-medium px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={12} />
                        {t('Approved', 'Aprobada')}
                      </div>
                    )}

                    {photo.guest_id === guest?.id && (
                      <button
                        onClick={() => handleDelete(photo)}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-warmgray-900/70 text-cream-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-wine-600"
                        aria-label={t('Delete photo', 'Eliminar foto')}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-warmgray-900/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 text-cream-100 hover:text-cream-50"
            aria-label={t('Close', 'Cerrar')}
          >
            <X size={28} />
          </button>
          <img
            src={lightbox}
            alt={t('Enlarged photo', 'Foto ampliada')}
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
