import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { BedDouble, Plane, Car, MapPin, ExternalLink } from 'lucide-react';

const LODGING = [
  {
    name: 'The Grandview Inn',
    detail: 'A rustic-chic inn 5 minutes from the venue. Rooms held under "Sunshine & Jose Wedding."',
    distance: '5 min drive',
    price: '$$',
  },
  {
    name: 'Maple Grove Bed & Breakfast',
    detail: 'A cozy Victorian B&B nestled among the autumn foliage. Limited rooms available.',
    distance: '12 min drive',
    price: '$',
  },
  {
    name: 'Riverside Hotel & Spa',
    detail: 'A full-service hotel along the river with spa amenities for wedding prep.',
    distance: '20 min drive',
    price: '$$$',
  },
];

const GETTING_THERE = [
  {
    icon: Plane,
    title: 'By Air',
    detail: 'Seattle-Tacoma International (SEA) is the nearest major airport, about 2.5 hours from Grandview. Yakima Air Terminal is 45 minutes away for regional flights.',
  },
  {
    icon: Car,
    title: 'By Car',
    detail: 'Grandview is a 2.5-hour drive southeast of Seattle via I-90 E and I-82 E. The venue is just off the highway with ample complimentary parking on site.',
  },
  {
    icon: MapPin,
    title: 'Shuttle Service',
    detail: 'A complimentary shuttle will run between The Grandview Inn and the venue before and after the reception. Sign up when you RSVP.',
  },
];

export function Travel() {
  return (
    <section id="travel" className="py-24 sm:py-32 bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="Join Us"
            title="Travel & Accommodations"
            subtitle="Everything you need to plan your stay in the Yakima Valley this autumn."
          />
        </Reveal>

        {/* Where to stay */}
        <Reveal delay={100}>
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <BedDouble className="text-wine-600" size={24} />
              <h3 className="font-display text-2xl text-wine-700">Where to Stay</h3>
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
                      {place.detail}
                    </p>
                    <p className="mt-4 text-xs text-wine-600 font-body uppercase tracking-wide flex items-center gap-1.5">
                      <MapPin size={14} /> {place.distance}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-4 text-sm text-warmgray-400 font-body flex items-center gap-1.5">
              <ExternalLink size={14} /> Mention our wedding when booking to receive the group rate.
            </p>
          </div>
        </Reveal>

        {/* Getting around */}
        <Reveal delay={150}>
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-6">
              <Car className="text-wine-600" size={24} />
              <h3 className="font-display text-2xl text-wine-700">Getting Around</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {GETTING_THERE.map((item, i) => (
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
