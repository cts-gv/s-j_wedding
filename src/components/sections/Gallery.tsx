import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { useLightbox, type LightboxItem } from '@/components/Lightbox';
import { useLanguage, L, type Localized } from '@/i18n/LanguageContext';

interface GalleryItem {
  src: string;
  alt: Localized;
  caption: Localized;
  span?: boolean;
}

const COUPLE_PHOTOS: GalleryItem[] = [
  {
    src: 'https://images.pexels.com/photos/29205728/pexels-photo-29205728.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: L('Couple walking through a vineyard in autumn', 'Pareja caminando por un viñedo en otoño'),
    caption: L('The vineyard walk', 'El paseo por el viñedo'),
    span: true,
  },
  {
    src: 'https://images.pexels.com/photos/28981047/pexels-photo-28981047.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: L('Wedding cake with floral arrangements', 'Pastel de bodas con arreglos florales'),
    caption: L('Sweet beginnings', 'Dulces comienzos'),
  },
  {
    src: 'https://images.pexels.com/photos/31412720/pexels-photo-31412720.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: L('Bride and groom holding hands in a sunlit field', 'Novios tomados de la mano en un campo bañado de sol'),
    caption: L('Golden hour', 'La hora dorada'),
  },
  {
    src: 'https://images.pexels.com/photos/18800074/pexels-photo-18800074.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: L('Couple by a rustic wooden windmill', 'Pareja junto a un molino de viento de madera'),
    caption: L('Rustic charm', 'Encanto rústico'),
  },
  {
    src: 'https://images.pexels.com/photos/9703891/pexels-photo-9703891.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: L('Outdoor wedding reception with string lights at twilight', 'Recepción de boda al aire libre con guirnaldas de luces al anochecer'),
    caption: L('Twilight celebration', 'Celebración al atardecer'),
    span: true,
  },
  {
    src: 'https://images.pexels.com/photos/29205726/pexels-photo-29205726.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: L('Couple enjoying a romantic moment in a vineyard', 'Pareja disfrutando un momento romántico en un viñedo'),
    caption: L('Just the two of us', 'Solo los dos'),
  },
  {
    src: 'https://images.pexels.com/photos/27921846/pexels-photo-27921846.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: L('Table setup with vibrant floral arrangements', 'Mesa decorada con vistosos arreglos florales'),
    caption: L('The table is set', 'La mesa está puesta'),
  },
  {
    src: 'https://images.pexels.com/photos/37179172/pexels-photo-37179172.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: L('Newlywed couple sharing a kiss by a farm fence', 'Recién casados besándose junto a una cerca de granja'),
    caption: L('Forever starts now', 'El para siempre empieza hoy'),
  },
];

export function Gallery() {
  const { lang, t } = useLanguage();
  const items: LightboxItem[] = COUPLE_PHOTOS.map((p) => ({
    id: `couple-${p.src}`,
    image: p.src,
    title: p.caption[lang],
  }));

  const { lightbox, openAt } = useLightbox(items);

  function openCouple(i: number) {
    openAt(i);
  }

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-cream-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow={t('Moments', 'Momentos')}
            title={t('Our Gallery', 'Nuestra galería')}
            subtitle={t(
              'A collection of moments captured along the way — tap any photo to take a closer look.',
              'Una colección de momentos capturados en el camino: toca cualquier foto para verla más de cerca.',
            )}
          />
        </Reveal>

        {/* Couple photos — featured grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[240px]">
          {COUPLE_PHOTOS.map((photo, i) => (
            <Reveal
              key={photo.src}
              delay={(i % 4) * 80}
              className={`group relative overflow-hidden rounded-2xl shadow-sm cursor-pointer ${
                photo.span ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <button onClick={() => openCouple(i)} className="absolute inset-0 w-full h-full" aria-label={`${t('View', 'Ver')} ${photo.caption[lang]}`}>
                <img
                  src={photo.src}
                  alt={photo.alt[lang]}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warmgray-900/70 via-warmgray-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 inset-x-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-cream-50 font-display text-lg italic text-left">{photo.caption[lang]}</p>
                  <div className="mt-1 h-px w-8 bg-gold-400" />
                </div>
                <div className="absolute top-3 right-3 h-8 w-8 rotate-45 border-2 border-gold-400/0 group-hover:border-gold-400/80 transition-all duration-500" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox}
    </section>
  );
}
