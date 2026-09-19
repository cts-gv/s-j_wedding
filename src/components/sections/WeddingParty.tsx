import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { Heart } from 'lucide-react';
import { useLanguage, L, type Localized } from '@/i18n/LanguageContext';

interface PartyMember {
  name: Localized;
  role: Localized;
  bio: Localized;
  photo: string;
  accent: 'wine' | 'emerald' | 'sapphire' | 'gold';
}

const PARTY: PartyMember[] = [
  {
    name: L('Sophia Hartwell', 'Sophia Hartwell'),
    role: L('Maid of Honor', 'Dama de honor principal'),
    bio: L(
      "Sunshine's sister and lifelong best friend. She has been by Sunshine's side through every chapter.",
      'Hermana y mejor amiga de toda la vida de Sunshine. Ha estado a su lado en cada capítulo.',
    ),
    photo: 'https://images.pexels.com/photos/5711185/pexels-photo-5711185.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'wine',
  },
  {
    name: L('Reverend Michael Ashford', 'Reverendo Michael Ashford'),
    role: L('Officiant', 'Oficiante'),
    bio: L(
      'A dear family friend who has watched Sunshine and Jose grow together and will unite them in marriage.',
      'Un querido amigo de la familia que ha visto crecer juntos a Sunshine y a Jose y que los unirá en matrimonio.',
    ),
    photo: 'https://images.pexels.com/photos/29631368/pexels-photo-29631368.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'gold',
  },
  {
    name: L('Daniel Cole', 'Daniel Cole'),
    role: L('Best Man', 'Padrino de honor'),
    bio: L(
      "Jose's younger brother and trusted confidant. From childhood adventures to wedding-day support.",
      'Hermano menor y confidente de Jose. De las aventuras de la infancia al apoyo el día de la boda.',
    ),
    photo: 'https://images.pexels.com/photos/19261083/pexels-photo-19261083.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'sapphire',
  },
  {
    name: L('Amelia Brooks', 'Amelia Brooks'),
    role: L('Bridesmaid', 'Dama de honor'),
    bio: L(
      'College roommate turned forever friend. Amelia and Sunshine bonded over late-night study sessions and coffee.',
      'Compañera de cuarto en la universidad y ahora amiga para siempre. Amelia y Sunshine se hicieron amigas entre desvelos de estudio y café.',
    ),
    photo: 'https://images.pexels.com/photos/34792899/pexels-photo-34792899.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'emerald',
  },
  {
    name: L('__ORNAMENTAL__', '__ORNAMENTAL__'),
    role: L('', ''),
    bio: L('', ''),
    photo: '',
    accent: 'gold',
  },
  {
    name: L('Marcus Reid', 'Marcus Reid'),
    role: L('Groomsman', 'Caballero de honor'),
    bio: L(
      "Jose's medical school study partner and co-adventurer. A friendship forged in long shifts and laughter.",
      'Compañero de estudio de Jose en la escuela de medicina y cómplice de aventuras. Una amistad forjada entre largas guardias y risas.',
    ),
    photo: 'https://images.pexels.com/photos/28892574/pexels-photo-28892574.jpeg?auto=compress&cs=tinysrgb&w=600',
    accent: 'sapphire',
  },
];

const ORNAMENTAL = {
  icon: Heart,
  quote: L(
    'Friends are the family we choose for ourselves.',
    'Los amigos son la familia que elegimos.',
  ),
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
  const { lang, t } = useLanguage();
  return (
    <section id="party" className="py-24 sm:py-32 paper-texture">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow={t('Our People', 'Nuestra gente')}
            title={t('The Wedding Party', 'El cortejo nupcial')}
            subtitle={t(
              'The friends and family standing beside us as we say our vows.',
              'Los amigos y familiares que estarán a nuestro lado cuando digamos nuestros votos.',
            )}
          />
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PARTY.map((member, i) =>
            member.name.en === '__ORNAMENTAL__' ? (
              <Reveal key="ornamental" delay={(i % 3) * 100}>
                <div className="h-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold-300/60 bg-cream-50/40 p-8 min-h-[400px]">
                  <div className="h-16 w-16 rounded-full bg-gold-50 flex items-center justify-center border border-gold-200">
                    <ORNAMENTAL.icon size={28} className="text-gold-500" fill="currentColor" />
                  </div>
                  <p className="mt-5 font-display text-lg text-gold-700 text-center italic leading-relaxed">
                    {ORNAMENTAL.quote[lang]}
                  </p>
                  <div className="mt-5 flex items-center gap-2 text-gold-400">
                    <span className="h-px w-8 bg-gold-300" />
                    <span className="text-xs font-body uppercase tracking-widest-2">
                      {t('With Love', 'Con cariño')}
                    </span>
                    <span className="h-px w-8 bg-gold-300" />
                  </div>
                </div>
              </Reveal>
            ) : (
            <Reveal key={member.name.en} delay={(i % 3) * 100}>
              <article className="group bg-cream-50 rounded-2xl overflow-hidden shadow-sm border border-cream-200 hover:shadow-xl transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name[lang]}
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
                    {member.role[lang]}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl text-wine-700">{member.name[lang]}</h3>
                  <p className="mt-2.5 text-warmgray-500 font-body text-sm leading-relaxed">
                    {member.bio[lang]}
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
