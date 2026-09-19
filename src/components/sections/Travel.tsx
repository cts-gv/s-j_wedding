import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { BedDouble, Plane, Car, MapPin, ExternalLink } from 'lucide-react';
import { useLanguage, L } from '@/i18n/LanguageContext';

// Each text is written twice: L('English', 'Español'). Edit both when you change a line.
const LODGING = [
  {
    name: 'The Grandview Inn',
    detail: L(
      'A rustic-chic inn 5 minutes from the venue. Rooms held under "Sunshine & Jose Wedding."',
      'Una posada rústica y elegante a 5 minutos del lugar. Habitaciones reservadas a nombre de “Sunshine & Jose Wedding”.',
    ),
    distance: L('5 min drive', '5 min en auto'),
    price: '$$',
  },
  {
    name: 'Maple Grove Bed & Breakfast',
    detail: L(
      'A cozy Victorian B&B nestled among the autumn foliage. Limited rooms available.',
      'Un acogedor bed & breakfast victoriano entre el follaje otoñal. Habitaciones limitadas.',
    ),
    distance: L('12 min drive', '12 min en auto'),
    price: '$',
  },
  {
    name: 'Riverside Hotel & Spa',
    detail: L(
      'A full-service hotel along the river with spa amenities for wedding prep.',
      'Un hotel de servicio completo a orillas del río, con spa para prepararse para la boda.',
    ),
    distance: L('20 min drive', '20 min en auto'),
    price: '$$$',
  },
];

const GETTING_THERE = [
  {
    icon: Plane,
    title: L('By Air', 'En avión'),
    detail: L(
      'Seattle-Tacoma International (SEA) is the nearest major airport, about 2.5 hours from Grandview. Yakima Air Terminal is 45 minutes away for regional flights.',
      'El Aeropuerto Internacional de Seattle-Tacoma (SEA) es el aeropuerto grande más cercano, a unas 2.5 horas de Grandview. La terminal aérea de Yakima está a 45 minutos y recibe vuelos regionales.',
    ),
  },
  {
    icon: Car,
    title: L('By Car', 'En auto'),
    detail: L(
      'Grandview is a 2.5-hour drive southeast of Seattle via I-90 E and I-82 E. The venue is just off the highway with ample complimentary parking on site.',
      'Grandview queda a 2.5 horas en auto al sureste de Seattle por la I-90 E y la I-82 E. El lugar está junto a la carretera y tiene amplio estacionamiento gratuito.',
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

        {/* Getting around */}
        <Reveal delay={150}>
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-6">
              <Car className="text-wine-600" size={24} />
              <h3 className="font-display text-2xl text-wine-700">
                {t('Getting Around', 'Cómo moverse')}
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {GETTING_THERE.map((item, i) => (
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
