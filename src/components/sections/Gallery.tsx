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

// Makes the paths work whether the site lives at the root or in a sub-folder (e.g. GitHub Pages).
const galleryPhoto = (file: string) => `${import.meta.env.BASE_URL}photos/gallery/${file}`;

// Tip: keep `span: true` on the 1st and 6th photos so the grid has no gaps in the middle.
const COUPLE_PHOTOS: GalleryItem[] = [
  {
    src: galleryPhoto('vineyard-sunset.jpg'),
    alt: L('Couple sitting in wooden chairs watching the sunset over a vineyard', 'Pareja sentada en sillas de madera viendo el atardecer sobre un viñedo'),
    caption: L('Sunset over the vines', 'Atardecer sobre los viñedos'),
    span: true,
  },
  {
    src: galleryPhoto('vineyard.jpg'),
    alt: L('Couple smiling at a vineyard at golden hour', 'Pareja sonriendo en un viñedo a la hora dorada'),
    caption: L('Evening in the vineyard', 'Una tarde en el viñedo'),
  },
  {
    src: galleryPhoto('maryhill-winery.jpg'),
    alt: L('Couple in sunglasses enjoying rosé at Maryhill Winery', 'Pareja con gafas de sol disfrutando un rosado en Maryhill Winery'),
    caption: L('Wine at Maryhill', 'Vino en Maryhill'),
  },
  {
    src: galleryPhoto('leavenworth.jpg'),
    alt: L('Couple bundled up in Leavenworth at dusk', 'Pareja abrigada en Leavenworth al anochecer'),
    caption: L('Leavenworth lights', 'Luces de Leavenworth'),
  },
  {
    src: galleryPhoto('ghost-hunting-portland.jpg'),
    alt: L('Couple holding a ghost-hunting meter at night in Portland', 'Pareja con un medidor de cacería de fantasmas de noche en Portland'),
    caption: L('Ghost hunting in Portland', 'Cacería de fantasmas en Portland'),
  },
  {
    src: galleryPhoto('new-years-2017.jpg'),
    alt: L('Couple holding hands from two hanging bubble chairs', 'Pareja tomada de la mano desde dos sillas colgantes transparentes'),
    caption: L('Ringing in 2017', 'Recibiendo el 2017'),
    span: true,
  },
  {
    src: galleryPhoto('baseball.jpg'),
    alt: L('Couple in Mariners gear at a baseball game', 'Pareja con ropa de los Mariners en un juego de béisbol'),
    caption: L('Take me out to the ballgame', 'Un día de béisbol'),
  },
  {
    src: galleryPhoto('seahawks.jpg'),
    alt: L('Couple and a friend in Seahawks jerseys on a grassy hill', 'Pareja y una amiga con camisetas de los Seahawks en una colina de pasto'),
    caption: L('Go Hawks!', '¡Vamos Hawks!'),
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
