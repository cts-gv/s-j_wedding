import { Reveal } from '@/components/Reveal';
import { MapPin, Clock, Navigation, Car, ExternalLink } from 'lucide-react';
import { useLanguage, L } from '@/i18n/LanguageContext';

const VENUE_PHOTO =
  `${import.meta.env.BASE_URL}photos/venue/wine-country-gardens.jpg`;

// Each text is written twice: L('English', 'Español'). Edit both when you change a line.
const VENUE_DETAILS = [
  {
    icon: MapPin,
    label: L('Location', 'Ubicación'),
    value: L(
      'Wine Country Gardens, 16302 N Bone Rd, Prosser, WA',
      'Wine Country Gardens, 16302 N Bone Rd, Prosser, WA',
    ),
  },
  {
    icon: Clock,
    label: L('Ceremony', 'Ceremonia'),
    value: L('2:00 PM · Reception to follow at 5:00 PM', '2:00 p. m. · La recepción será a las 5:00 p. m.'),
  },
  {
    icon: Navigation,
    label: L('Parking', 'Estacionamiento'),
    value: L('Complimentary on-site parking available', 'Estacionamiento gratuito en el lugar'),
  },
];

const DIRECTIONS = [
  {
    icon: Car,
    title: L('From Seattle/Yakima', 'Desde Seattle/Yakima'),
    detail: L(
      'Take I-90 East from Seattle toward Ellensburg. Near Ellensburg, take I-82 South toward Yakima and continue east/southeast toward Prosser. Stay on I-82 and take Exit 80 for Prosser/Wine Country Road. Follow the local roads toward North Bone Road, then continue to Wine Country Gardens at 16302 N Bone Road. Approximate drive time from Seattle: 3 hours. Approximate drive time from Yakima: 45–50 minutes.',
      'Tome la I-90 en dirección este desde Seattle hacia Ellensburg. Cerca de Ellensburg, tome la I-82 en dirección sur hacia Yakima y continúe hacia el este/sureste en dirección a Prosser. Permanezca en la I-82 y tome la salida 80 hacia Prosser/Wine Country Road. Siga las carreteras locales hacia North Bone Road y luego continúe hasta Wine Country Gardens, en el 16302 de N Bone Road. Tiempo de viaje aproximado desde Seattle: 3 horas. Tiempo de viaje aproximado desde Yakima: 45–50 minutos.',
    ),
  },
  {
    icon: Navigation,
    title: L('From Tri-Cities', 'Desde Tri-Cities'),
    detail: L(
      'Take I-82 West toward Prosser/Yakima. Continue to Prosser and take Exit 80 for Prosser/Wine Country Road. Follow the local roads toward North Bone Road, then continue to Wine Country Gardens at 16302 N Bone Road. Approximate drive time: 30–35 minutes.',
      'Tome la I-82 en dirección oeste hacia Prosser/Yakima. Continúe hasta Prosser y tome la salida 80 hacia Prosser/Wine Country Road. Siga las carreteras locales en dirección a North Bone Road y luego continúe hasta Wine Country Gardens, en el 16302 de N Bone Road. Tiempo estimado de viaje: 30 a 35 minutos.',
    ),
  },
  {
    icon: MapPin,
    title: L('From Portland', 'From Portland'),
    detail: L(
      'From Portland, Oregon Take I-84 East through the Columbia River Gorge toward Umatilla. Cross into Washington and continue toward the Tri-Cities. Follow I-82 West toward Yakima/Prosser. Take Exit 80 for Prosser/Wine Country Road and follow the signs toward Prosser and the surrounding wine country. From there, follow your navigation to North Bone Road and continue to Wine Country Gardens at 16302 N Bone Road. Approximate drive time: 3–3½ hours.',
      'Desde Portland, Oregón, tome la I-84 en dirección este a través del desfiladero del río Columbia (Columbia River Gorge) hacia Umatilla. Cruce a Washington y continúe hacia Tri-Cities. Siga por la I-82 en dirección oeste hacia Yakima/Prosser. Tome la salida 80 hacia Prosser/Wine Country Road y siga las indicaciones hacia Prosser y la zona vinícola de los alrededores. Desde allí, siga las indicaciones de su navegador hasta North Bone Road y continúe hasta Wine Country Gardens, en el 16302 de N Bone Road. Tiempo estimado de viaje: de 3 a 3 horas y media.',
    ),
  },
];

export function Venue() {
  const { lang, t } = useLanguage();
  return (
    <section id="venue" className="bg-cream-100/60">
      {/* Hero image */}
      <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        <img
          src={VENUE_PHOTO}
          alt={t(
            'Wine Country Gardens — outdoor wedding venue surrounded by autumn foliage',
            'Wine Country gardens: lugar de bodas al aire libre rodeado de follaje otoñal',
          )}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warmgray-900/40 via-warmgray-900/25 to-warmgray-900/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 text-center px-4">
          <Reveal>
            <p className="text-gold-300 text-sm font-body uppercase tracking-[0.3em]">
              {t('The Venue', 'El lugar')}
            </p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-cream-50 drop-shadow-lg">
              Wine Country Gardens
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-cream-200/90 font-body text-base leading-relaxed">
              {t(
                "Nestled among the vineyards and orchards of the lower valley, Wine Country Gardens sets the stage for a night of good wine, celebration, and togetherness.",
                'Enclavado entre los viñedos y huertos del valle bajo, Wine Country Gardens ofrece el escenario ideal para una noche de buen vino, celebración y convivencia.',
              )}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Details + map */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <Reveal>
            <div className="bg-cream-50 rounded-2xl p-7 sm:p-8 border border-cream-200 shadow-sm flex flex-col h-full">
              <h3 className="font-display text-2xl text-wine-700">
                {t('Where the celebration begins"', 'Donde comienza la celebración”')}
              </h3>
              <p className="mt-3 text-warmgray-500 font-body text-sm leading-relaxed">
                {t(
                  'A hidden gem among the vineyards of the Yakima Valley, Wine Country Gardens offers a picture-perfect rustic setting for our wedding. The ceremony will take place outdoors in the garden, followed by dinner and dancing in the pavillion.',
                  'Una joya oculta entre los viñedos del valle de Yakima, Wine Country Gardens ofrece un entorno rústico de postal para nuestra boda. La ceremonia se celebrará al aire libre, en el jardín, seguida de la cena y el baile en el pabellón.',
                )}
              </p>

              <div className="mt-6 space-y-4 flex-1">
                {VENUE_DETAILS.map((detail) => (
                  <div key={detail.label.en} className="flex items-start gap-3">
                    <div className="shrink-0 h-10 w-10 rounded-full bg-wine-50 flex items-center justify-center border border-wine-100">
                      <detail.icon size={18} className="text-wine-600" />
                    </div>
                    <div>
                      <p className="text-xs font-body uppercase tracking-wide text-warmgray-400">
                        {detail.label[lang]}
                      </p>
                      <p className="font-body text-sm text-warmgray-700 mt-0.5">{detail.value[lang]}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Grandview+Washington"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 bg-wine-600 hover:bg-wine-700 text-cream-50 font-body font-medium text-sm rounded-full px-6 py-2.5 transition-colors self-start"
              >
                <MapPin size={16} />
                {t('Open in Google Maps', 'Abrir en Google Maps')}
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl overflow-hidden shadow-md border border-cream-200 h-full min-h-[320px]">
              <iframe
                title={t(
                  'Venue location map — Grandview, Washington',
                  'Mapa de la ubicación del lugar: Grandview, Washington',
                )}
                src="https://www.google.com/maps?q=Grandview,+Washington&output=embed"
                className="w-full h-full min-h-[320px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>

        {/* Directions */}
        <Reveal delay={100}>
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <Navigation className="text-wine-600" size={24} />
              <h3 className="font-display text-2xl text-wine-700">
                {t('How to Get There', 'Cómo llegar')}
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {DIRECTIONS.map((item, i) => (
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
            <p className="mt-4 text-sm text-warmgray-400 font-body flex items-center gap-1.5">
              <ExternalLink size={14} />{' '}
              {t(
                'For questions please email us here.',
                'Si tiene preguntas, por favor envíenos un correo electrónico aquí..',
              )}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
