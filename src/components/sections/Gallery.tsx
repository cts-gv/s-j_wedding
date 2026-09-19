import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { useLightbox, type LightboxItem } from '@/components/Lightbox';

interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  span?: boolean;
}

const COUPLE_PHOTOS: GalleryItem[] = [
  {
    src: 'https://images.pexels.com/photos/29205728/pexels-photo-29205728.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Couple walking through a vineyard in autumn',
    caption: 'The vineyard walk',
    span: true,
  },
  {
    src: 'https://images.pexels.com/photos/28981047/pexels-photo-28981047.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Wedding cake with floral arrangements',
    caption: 'Sweet beginnings',
  },
  {
    src: 'https://images.pexels.com/photos/31412720/pexels-photo-31412720.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Bride and groom holding hands in a sunlit field',
    caption: 'Golden hour',
  },
  {
    src: 'https://images.pexels.com/photos/18800074/pexels-photo-18800074.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Couple by a rustic wooden windmill',
    caption: 'Rustic charm',
  },
  {
    src: 'https://images.pexels.com/photos/9703891/pexels-photo-9703891.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Outdoor wedding reception with string lights at twilight',
    caption: 'Twilight celebration',
    span: true,
  },
  {
    src: 'https://images.pexels.com/photos/29205726/pexels-photo-29205726.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Couple enjoying a romantic moment in a vineyard',
    caption: 'Just the two of us',
  },
  {
    src: 'https://images.pexels.com/photos/27921846/pexels-photo-27921846.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Table setup with vibrant floral arrangements',
    caption: 'The table is set',
  },
  {
    src: 'https://images.pexels.com/photos/37179172/pexels-photo-37179172.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Newlywed couple sharing a kiss by a farm fence',
    caption: 'Forever starts now',
  },
];

export function Gallery() {
  const items: LightboxItem[] = COUPLE_PHOTOS.map((p) => ({
    id: `couple-${p.src}`,
    image: p.src,
    title: p.caption,
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
            eyebrow="Moments"
            title="Our Gallery"
            subtitle="A collection of moments captured along the way — tap any photo to take a closer look."
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
              <button onClick={() => openCouple(i)} className="absolute inset-0 w-full h-full" aria-label={`View ${photo.caption}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-warmgray-900/70 via-warmgray-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 inset-x-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-cream-50 font-display text-lg italic text-left">{photo.caption}</p>
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
