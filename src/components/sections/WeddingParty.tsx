import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { Heart } from 'lucide-react';

interface PartyMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  accent: 'wine' | 'emerald' | 'sapphire' | 'gold';
}

const PARTY: PartyMember[] = [
  {
    name: 'Sophia Hartwell',
    role: 'Maid of Honor',
    bio: "Olivia's sister and lifelong best friend. She has been by Olivia's side through every chapter.",
    photo: 'https://images.pexels.com/photos/5711185/pexels-photo-5711185.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'wine',
  },
  {
    name: 'Reverend Michael Ashford',
    role: 'Officiant',
    bio: 'A dear family friend who has watched Olivia and Benjamin grow together and will unite them in marriage.',
    photo: 'https://images.pexels.com/photos/29631368/pexels-photo-29631368.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'gold',
  },
  {
    name: 'Daniel Cole',
    role: 'Best Man',
    bio: "Benjamin's younger brother and trusted confidant. From childhood adventures to wedding-day support.",
    photo: 'https://images.pexels.com/photos/19261083/pexels-photo-19261083.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'sapphire',
  },
  {
    name: 'Amelia Brooks',
    role: 'Bridesmaid',
    bio: 'College roommate turned forever friend. Amelia and Olivia bonded over late-night study sessions and coffee.',
    photo: 'https://images.pexels.com/photos/34792899/pexels-photo-34792899.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'emerald',
  },
  {
    name: '__ORNAMENTAL__',
    role: '',
    bio: '',
    photo: '',
    accent: 'gold',
  },
  {
    name: 'Marcus Reid',
    role: 'Groomsman',
    bio: "Benjamin's medical school study partner and co-adventurer. A friendship forged in long shifts and laughter.",
    photo: 'https://images.pexels.com/photos/28892574/pexels-photo-28892574.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'sapphire',
  },
];

const ORNAMENTAL = {
  icon: Heart,
  quote: 'Friends are the family we choose for ourselves.',
};

const ACCENT_RING: Record<PartyMember['accent'], string> = {
  wine: 'group-hover:border-wine-400',
  emerald: 'group-hover:border-emerald-400',
  sapphire: 'group-hover:border-sapphire-400',
  gold: 'group-hover:border-gold-400',
};
const ACCENT_TEXT: Record<PartyMember['accent'], string> = {
  wine: 'text-wine-600',
  emerald: 'text-emerald-600',
  sapphire: 'text-sapphire-600',
  gold: 'text-gold-600',
};

export function WeddingParty() {
  return (
    <section id="party" className="py-24 sm:py-32 paper-texture">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="Our People"
            title="The Wedding Party"
            subtitle="The friends and family standing beside us as we say our vows."
          />
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTY.map((member, i) =>
            member.name === '__ORNAMENTAL__' ? (
              <Reveal key="ornamental" delay={(i % 3) * 100}>
                <div className="h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold-300/60 bg-cream-50/40 p-8 min-h-[400px]">
                  <div className="h-16 w-16 rounded-full bg-gold-50 flex items-center justify-center border border-gold-200">
                    <ORNAMENTAL.icon size={28} className="text-gold-500" fill="currentColor" />
                  </div>
                  <p className="mt-5 font-display text-lg text-gold-700 text-center italic leading-relaxed">
                    {ORNAMENTAL.quote}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-gold-400">
                    <span className="h-px w-8 bg-gold-300" />
                    <span className="text-xs font-body uppercase tracking-widest-2">With Love</span>
                    <span className="h-px w-8 bg-gold-300" />
                  </div>
                </div>
              </Reveal>
            ) : (
            <Reveal key={member.name} delay={(i % 3) * 100}>
              <article className="group bg-cream-50 rounded-2xl overflow-hidden shadow-sm border border-cream-200 hover:shadow-xl transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-warmgray-900/60 to-transparent" />
                  <div
                    className={`absolute bottom-4 left-4 right-4 border-b-2 border-cream-200/0 ${ACCENT_RING[member.accent]} transition-colors`}
                  />
                </div>
                <div className="p-6">
                  <p
                    className={`text-xs font-body uppercase tracking-widest-2 font-medium ${ACCENT_TEXT[member.accent]}`}
                  >
                    {member.role}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl text-wine-700">{member.name}</h3>
                  <p className="mt-2.5 text-warmgray-500 font-body text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </article>
            </Reveal>
            )
          )}
        </div>
      </div>
    </section>
  );
}
