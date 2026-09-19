import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { useState } from 'react';
import { Flame } from 'lucide-react';

interface LovedOne {
  name: string;
  relation: string;
  note: string;
  /**
   * Optional photo. Put the image file in public/photos/memory/ and reference it
   * like '/photos/memory/margaret-hartwell.jpg'. A full https:// URL also works.
   * Leave it out (or empty) to show the flame icon instead.
   */
  photo?: string;
}

const LOVED_ONES: LovedOne[] = [
  {
    name: 'Margaret Hartwell',
    relation: "Olivia's grandmother",
    note: 'Her wisdom and warmth shaped every part of who Olivia is.',
    photo: '',
  },
  {
    name: 'Robert Cole Sr.',
    relation: "Benjamin's father",
    note: 'A gentleman, a teacher, and the best man Benjamin ever knew.',
    photo: '',
  },
  {
    name: 'Eleanor Whitfield',
    relation: "Olivia's aunt",
    note: 'Her laughter filled every room and every heart she touched.',
    photo: '',
  },
  {
    name: 'Jameson Cole',
    relation: "Benjamin's brother",
    note: 'Forever missed, forever loved, forever in our thoughts.',
    photo: '',
  },
];

// Makes '/photos/...' paths work even when the site is hosted in a sub-folder (e.g. GitHub Pages).
function resolvePhoto(photo: string) {
  return photo.startsWith('/') ? `${import.meta.env.BASE_URL}${photo.slice(1)}` : photo;
}

function MemoryAvatar({ name, photo }: { name: string; photo?: string }) {
  const [failed, setFailed] = useState(false);

  if (photo && !failed) {
    return (
      <img
        src={resolvePhoto(photo)}
        alt={`Portrait of ${name}`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="shrink-0 h-20 w-20 rounded-full object-cover border-2 border-gold-400/50 shadow-lg"
      />
    );
  }

  return (
    <div className="shrink-0 h-20 w-20 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center">
      <Flame size={24} className="text-gold-400" />
    </div>
  );
}

export function InMemory() {
  return (
    <section id="memory" className="py-24 sm:py-32 bg-warmgray-900 relative overflow-hidden">
      {/* Soft glow */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-wine-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gold-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-gold-400 uppercase tracking-widest-2 text-xs font-body font-medium mb-3">
              In Loving Memory
            </p>
            <h2 className="text-4xl sm:text-5xl text-cream-50 font-display font-medium text-balance">
              Loved Ones We Miss
              <span className="block text-gold-400/90 text-2xl font-light italic mt-1">
                On This Special Day
              </span>
            </h2>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gold-400/60" />
              <Flame size={16} className="text-gold-400" />
              <span className="h-px w-10 bg-gold-400/60" />
            </div>
            <p className="mt-5 text-cream-200/70 font-body text-base max-w-xl mx-auto">
              Though they cannot be with us in person, their love and light remain woven into the
              fabric of our lives and this celebration.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 gap-5">
          {LOVED_ONES.map((person, i) => (
            <Reveal key={person.name} delay={i * 100}>
              <div className="border border-gold-400/20 rounded-2xl p-6 bg-warmgray-800/50 backdrop-blur-sm hover:border-gold-400/40 transition-colors">
                <div className="flex items-start gap-4">
                  <MemoryAvatar name={person.name} photo={person.photo} />
                  <div>
                    <h3 className="font-display text-xl text-cream-50">{person.name}</h3>
                    <p className="text-gold-400/80 text-xs font-body uppercase tracking-wide mt-0.5">
                      {person.relation}
                    </p>
                    <p className="mt-3 text-cream-200/70 font-body text-sm italic leading-relaxed">
                      "{person.note}"
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
