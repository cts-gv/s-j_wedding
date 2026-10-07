import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { useLanguage } from '@/i18n/LanguageContext';

const COUPLE_PHOTO =
  `${import.meta.env.BASE_URL}photos/story/then-and-now.jpg`;

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
                'Middle school yearbook photos of the couple next to a recent photo of them together',
                'Fotos de anuario de secundaria de la pareja junto a una foto reciente de ellos juntos',
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
                  'They went to the same schools from middle school through high school, passing each other in the same hallways for years without really talking — maybe a word or two about a homework assignment, nothing more. He noticed her. She was the outgoing one, the popular one, impossible not to notice. He was quiet, shy, happy to admire from a safe distance. Whether she noticed him back is still up for debate.',
                  'Fueron a las mismas escuelas desde la secundaria hasta la preparatoria, cruzándo por los mismos pasillos durante años sin realmente hablarse — quizás una que otra palabra sobre una tarea, nada más. Él la notó a ella. Ella era la extrovertida, la popular, imposible de no notar. Él era callado, tímido, feliz de admirarla desde una distancia prudente. Si ella lo notó a él también, sigue siendo un misterio.',
                )}
              </p>
              <p className="mt-5 text-warmgray-600 font-body leading-relaxed text-base sm:text-lg">
                {t(
                  'Years later, their paths would still cross now and then — he\u2019d smile, and whether she noticed, well, jury\u2019s still out. Then one day, completely out of nowhere, he found the courage to ask her out for a drink. When she replied "sure," he read the text twice just to make sure he wasn\u2019t imagining it. Turns out — she noticed. Seven years after that first drink, they bought a home together. Three years later, she made it official with two simple words: "I do.”',
                  'Años después, sus caminos aún se cruzaban de vez en cuando — él sonreía, y si ella se daba cuenta, bueno, eso sigue sin resolverse. Entonces, un día, de la nada, él reunió el valor para invitarla a tomar algo. Cuando ella respondió "claro", él leyó el mensaje dos veces solo para asegurarse de no estar imaginándolo. Siete años después de esa primera copa, compraron una casa juntos. Tres años más tarde, ella lo hizo oficial con dos simples palabras: "sí, acepto".',
                )}
              </p>
             <p className="mt-5 text-warmgray-600 font-body leading-relaxed text-base sm:text-lg">
                {t(
                  'Proof that some love stories take their time — and a whole lot of quiet crushing from across a classroom.',
                  'La prueba de que algunas historias de amor se toman su tiempo... y requieren de mucho amor platónico y silencioso desde el otro lado del aula.',
                )}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
