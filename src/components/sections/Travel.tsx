import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { BedDouble, Wine, UtensilsCrossed, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage, L } from '@/i18n/LanguageContext';

// Each text is written twice: L('English', 'Español'). Edit both when you change a line.
const LODGING = [
  {
    name: 'Gård Estate Wines & Inn',
    detail: L(
      'A winery inn right in Prosser wine country, with rooms overlooking the Yakima River and a tasting room on site.',
      'Una posada junto a una bodega en pleno Prosser wine country, con habitaciones frente al río Yakima y sala de cata en el lugar.',
    ),
    distance: L('In Prosser', 'En Prosser'),
    price: '$$$',
  },
  {
    name: 'Holiday Inn Express & Suites Prosser',
    detail: L(
      'A comfortable, modern hotel in the heart of Prosser with an indoor pool and free breakfast.',
      'Un hotel moderno y cómodo en el corazón de Prosser, con alberca techada y desayuno incluido.',
    ),
    distance: L('In Prosser', 'En Prosser'),
    price: '$$',
  },
  {
    name: 'Best Western Plus Grapevine Inn',
    detail: L(
      'A reliable, budget-friendly option in nearby Sunnyside, about 15 minutes from Prosser.',
      'Una opción confiable y económica en la cercana Sunnyside, a unos 15 minutos de Prosser.',
    ),
    distance: L('~15 min drive', '~15 min en auto'),
    price: '$',
  },
];

const THINGS_TO_DO = [
  {
    icon: Wine,
    title: L('Wine Tasting in Prosser', 'Cata de vinos en Prosser'),
    detail: L(
      "Known as the birthplace of Washington wine, Prosser is surrounded by more than 20 wineries. Spend an afternoon strolling Vintner's Village and sampling tasting rooms like Airfield Estates, Alexandria Nicole Cellars, Milbrandt Vineyards, and McKinley Springs.",
      'Conocida como la cuna del vino de Washington, Prosser está rodeada de más de 20 bodegas. Pasa la tarde recorriendo Vintner\'s Village y probando vinos en lugares como Airfield Estates, Alexandria Nicole Cellars, Milbrandt Vineyards y McKinley Springs.',
    ),
  },
  {
    icon: UtensilsCrossed,
    title: L('Food & Local Breweries', 'Comida y cervecerías locales'),
    detail: L(
      "Prosser's downtown has plenty to offer beyond wine. Grab a pint at Whitstran Brewing Company, coffee and local beer at Brewminatti, or a hearty meal at the Horse Heaven Saloon. On Saturday mornings, the Prosser Farmers Market fills the park with fresh produce and treats.",
      'El centro de Prosser ofrece mucho más que vino. Tómate una cerveza en Whitstran Brewing Company, un café o cerveza local en Brewminatti, o disfruta una buena comida en Horse Heaven Saloon. Los sábados por la mañana, el mercado de agricultores de Prosser llena el parque de productos frescos y delicias locales.',
    ),
  },
];

export function Travel() {
  const { lang, t } = useLanguage();
  return (
    <section id="travel" className="py-24 sm:py-32 bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow={t('Join Us', 'Acompáñanos')}
            title={t('Travel & Accommodations', 'Viaje y hospedaje')}
            subtitle={t(
              'Everything you need to plan your stay in the Yakima Valley this autumn.',
              'Todo lo que necesitas para planear tu estancia en el Valle de Yakima este otoño.',
            )}
          />
        </Reveal>

        {/* Where to stay */}
        <Reveal delay={100}>
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <BedDouble className="text-wine-600" size={24} />
              <h3 className="font-display text-2xl text-wine-700">
                {t('Where to Stay', 'Dónde hospedarse')}
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {LODGING.map((place, i) => (
                <Reveal key={place.name} delay={i * 90}>
                  <div className="h-full bg-cream-100 rounded-2xl p-6 border border-cream-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display text-xl text-warmgray-800">{place.name}</h4>
                      <span className="text-gold-600 font-body text-sm font-medium shrink-0">
                        {place.price}
                      </span>
                    </div>
                    <p className="mt-3 text-warmgray-500 font-body text-sm leading-relaxed flex-1">
                      {place.detail[lang]}
                    </p>
                    <p className="mt-4 text-xs text-wine-600 font-body uppercase tracking-wide flex items-center gap-1.5">
                      <MapPin size={14} /> {place.distance[lang]}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-4 text-sm text-warmgray-400 font-body flex items-center gap-1.5">
              <ExternalLink size={14} />{' '}
              {t(
                'Mention our wedding when booking to receive the group rate.',
                'Menciona nuestra boda al reservar para obtener la tarifa de grupo.',
              )}
            </p>
          </div>
        </Reveal>

        {/* Things to do */}
        <Reveal delay={150}>
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-6">
              <Wine className="text-wine-600" size={24} />
              <h3 className="font-display text-2xl text-wine-700">
                {t('Things To Do', 'Qué hacer')}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {THINGS_TO_DO.map((item, i) => (
                <Reveal key={item.title.en} delay={i * 90}>
                  <div className="h-full bg-wine-700 rounded-2xl p-6 text-cream-50 shadow-md">
                    <div className="h-11 w-11 rounded-full bg-cream-50/10 flex items-center justify-center mb-4">
                      <item.icon size={20} className="text-gold-400" />
                    </div>
                    <h4 className="font-display text-xl">{item.title[lang]}</h4>
                    <p className="mt-2.5 text-cream-200/80 font-body text-sm leading-relaxed">
                      {item.detail[lang]}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
