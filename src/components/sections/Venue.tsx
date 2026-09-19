import { Reveal } from '@/components/Reveal';
import { MapPin, Clock, Navigation, Car, ExternalLink } from 'lucide-react';

const VENUE_PHOTO =
  'https://images.pexels.com/photos/13105868/pexels-photo-13105868.jpeg?auto=compress&cs=tinysrgb&w=1600';

const VENUE_DETAILS = [
  { icon: MapPin, label: 'Location', value: 'Autumn Ridge Estate, 412 Orchard Lane, Grandview, WA' },
  { icon: Clock, label: 'Ceremony', value: '2:00 PM · Reception to follow at 5:00 PM' },
  { icon: Navigation, label: 'Parking', value: 'Complimentary on-site parking available' },
];

const DIRECTIONS = [
  {
    icon: Car,
    title: 'From Seattle',
    detail: '2.5-hour drive southeast via I-90 E and I-82 E. Take exit 73 toward Grandview and follow Orchard Lane signs.',
  },
  {
    icon: Navigation,
    title: 'From Yakima',
    detail: '45 minutes west on I-82 W. Exit at Grandview and head south on Outlook Road, then turn onto Orchard Lane.',
  },
  {
    icon: MapPin,
    title: 'The Entrance',
    detail: 'Look for the lantern-lit drive at the entrance on Orchard Lane — you will see the estate sign at the gate.',
  },
];

export function Venue() {
  return (
    <section id="venue" className="bg-cream-100/60">
      {/* Hero image */}
      <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden">
        <img
          src={VENUE_PHOTO}
          alt="Autumn Ridge Estate — outdoor wedding venue surrounded by autumn foliage"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warmgray-900/40 via-warmgray-900/25 to-warmgray-900/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 text-center px-4">
          <Reveal>
            <p className="text-gold-300 text-sm font-body uppercase tracking-[0.3em]">The Venue</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl text-cream-50 drop-shadow-lg">
              Autumn Ridge Estate
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-cream-200/90 font-body text-base leading-relaxed">
              Twelve acres of orchards and gardens in the heart of the Yakima Valley —
              where we'll exchange our vows beneath the autumn sky.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Details + map */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <Reveal>
            <div className="bg-cream-50 rounded-2xl p-7 sm:p-8 border border-cream-200 shadow-sm flex flex-col h-full">
              <h3 className="font-display text-2xl text-wine-700">Where We'll Say "I Do"</h3>
              <p className="mt-3 text-warmgray-500 font-body text-sm leading-relaxed">
                Nestled among the apple orchards of the Yakima Valley, Autumn Ridge Estate offers
                a picture-perfect rustic setting for our autumn wedding. The ceremony will take
                place outdoors in the garden, followed by dinner and dancing in the restored barn.
              </p>

              <div className="mt-6 space-y-4 flex-1">
                {VENUE_DETAILS.map((detail) => (
                  <div key={detail.label} className="flex items-start gap-3">
                    <div className="shrink-0 h-10 w-10 rounded-full bg-wine-50 flex items-center justify-center border border-wine-100">
                      <detail.icon size={18} className="text-wine-600" />
                    </div>
                    <div>
                      <p className="text-xs font-body uppercase tracking-wide text-warmgray-400">
                        {detail.label}
                      </p>
                      <p className="font-body text-sm text-warmgray-700 mt-0.5">{detail.value}</p>
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
                Open in Google Maps
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl overflow-hidden shadow-md border border-cream-200 h-full min-h-[320px]">
              <iframe
                title="Venue location map — Grandview, Washington"
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
              <h3 className="font-display text-2xl text-wine-700">How to Get There</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {DIRECTIONS.map((item, i) => (
                <Reveal key={item.title} delay={i * 90}>
                  <div className="h-full bg-wine-700 rounded-2xl p-6 text-cream-50 shadow-md">
                    <div className="h-11 w-11 rounded-full bg-cream-50/10 flex items-center justify-center mb-4">
                      <item.icon size={20} className="text-gold-400" />
                    </div>
                    <h4 className="font-display text-xl">{item.title}</h4>
                    <p className="mt-2.5 text-cream-200/80 font-body text-sm leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-4 text-sm text-warmgray-400 font-body flex items-center gap-1.5">
              <ExternalLink size={14} /> A detailed directions card will be included in your invitation.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
