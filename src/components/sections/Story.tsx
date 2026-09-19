import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { useLanguage } from '@/i18n/LanguageContext';

const COUPLE_PHOTO =
  'https://images.pexels.com/photos/5910785/pexels-photo-5910785.jpeg?auto=compress&cs=tinysrgb&w=1200';

export function Story() {
  const { t } = useLanguage();
  return (
    <section id="story" className="py-24 sm:py-32 paper-texture">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow={t('Our Journey', 'Nuestro camino')}
            title={t('How We Met', 'Cómo nos conocimos')}
            subtitle={t(
              'Every great love has a beginning. Here is ours.',
              'Todo gran amor tiene un comienzo. Este es el nuestro.',
            )}
          />
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <Reveal delay={100}>
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={COUPLE_PHOTO}
                alt={t(
                  'A couple sharing a warm moment over coffee',
                  'Una pareja compartiendo un momento cálido con un café',
                )}
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warmgray-900/20 to-transparent" />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="max-w-lg">
              <p className="text-warmgray-600 font-body leading-relaxed text-base sm:text-lg">
                {t(
                  'It started with a misplaced scarf at a coffee shop in Brooklyn. He noticed it belonged to the woman at the next table and chased her down the block to return it. She thanked him, he asked for her name, and the rest is history.',
                  'Todo comenzó con una bufanda olvidada en una cafetería de Brooklyn. Él notó que era de la mujer de la mesa de al lado y corrió tras ella por la cuadra para devolvérsela. Ella le dio las gracias, él le preguntó su nombre, y el resto es historia.',
                )}
              </p>
              <p className="mt-5 text-warmgray-600 font-body leading-relaxed text-base sm:text-lg">
                {t(
                  'Two years of long walks, shared books, and weekend farmers markets turned into something neither of them could imagine living without. A trip to the Yakima Valley in peak foliage season sealed it — they knew this was where they would one day say “I do.”',
                  'Dos años de largas caminatas, libros compartidos y mercados de productores los fines de semana se convirtieron en algo sin lo cual ninguno de los dos se imaginaba vivir. Un viaje al Valle de Yakima en plena temporada de follaje otoñal lo selló: supieron que aquí, algún día, dirían “sí, acepto”.',
                )}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
