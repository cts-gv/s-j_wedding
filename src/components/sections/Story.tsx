import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';

const COUPLE_PHOTO =
  'https://images.pexels.com/photos/5910785/pexels-photo-5910785.jpeg?auto=compress&cs=tinysrgb&w=1200';

export function Story() {
  return (
    <section id="story" className="py-24 sm:py-32 paper-texture">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow="Our Journey"
            title="How We Met"
            subtitle="Every great love has a beginning. Here is ours."
          />
        </Reveal>

        <div className="mt-14 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <Reveal delay={100}>
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={COUPLE_PHOTO}
                alt="A couple sharing a warm moment over coffee"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-warmgray-900/20 to-transparent" />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="max-w-lg">
              <p className="text-warmgray-600 font-body leading-relaxed text-base sm:text-lg">
                It started with a misplaced scarf at a coffee shop in Brooklyn. He noticed it
                belonged to the woman at the next table and chased her down the block to return it.
                She thanked him, he asked for her name, and the rest is history.
              </p>
              <p className="mt-5 text-warmgray-600 font-body leading-relaxed text-base sm:text-lg">
                Two years of long walks, shared books, and weekend farmers markets turned into
                something neither of them could imagine living without. A trip to the Yakima Valley
                in peak foliage season sealed it — they knew this was where they would one day say
                &ldquo;I do.&rdquo;
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
