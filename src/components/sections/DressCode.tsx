import { Reveal } from '@/components/Reveal';
import { SectionTitle } from '@/components/SectionTitle';
import { Shirt, CloudSun, Layers } from 'lucide-react';
import { useLanguage, L } from '@/i18n/LanguageContext';

// Each text is written twice: L('English', 'Español'). Edit both when you change a line.
const WEAR_EXAMPLES = L(
  'Think suit jackets, blazers, dress shirts, cocktail dresses, or dressy jumpsuits. Nice dark-wash jeans and boots paired with a button-up or blazer are welcome, too!',
  'Piensa en sacos, blazers, camisas de vestir, vestidos de cóctel o jumpsuits elegantes. ¡Unos jeans oscuros y botas, combinados con una camisa o blazer, también son bienvenidos!',
);

const WEATHER_NOTE = L(
  'September days are warm, but temperatures drop quickly once the sun sets over the valley. We recommend layering with a jacket, blazer, or wrap to stay cozy into the evening.',
  'Los días de septiembre son cálidos, pero la temperatura baja rápido en cuanto el sol se pone sobre el valle. Recomendamos llevar una chaqueta, blazer o abrigo ligero para mantenerte cómodo durante la noche.',
);

export function DressCode() {
  const { lang, t } = useLanguage();
  return (
    <section id="dress-code" className="py-24 sm:py-32 paper-texture">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Reveal>
          <SectionTitle
            eyebrow={t('What to Wear', 'Qué usar')}
            title={t('Dress Code', 'Código de vestimenta')}
            subtitle={t(
              'Semi-Formal and Comfortable',
              'Semi-formal y cómodo',
            )}
          />
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full bg-cream-50 rounded-2xl p-7 sm:p-8 border border-cream-200 shadow-sm">
              <div className="h-11 w-11 rounded-full bg-wine-50 flex items-center justify-center border border-wine-100">
                <Shirt size={20} className="text-wine-600" />
              </div>
              <h3 className="mt-5 font-display text-xl text-wine-700">
                {t('Wear What Makes You Feel Great', 'Usa lo que te haga sentir genial')}
              </h3>
              <p className="mt-2.5 text-warmgray-500 font-body text-sm leading-relaxed">
                {WEAR_EXAMPLES[lang]}
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="h-full bg-wine-700 rounded-2xl p-7 sm:p-8 text-cream-50 shadow-md">
              <div className="h-11 w-11 rounded-full bg-cream-50/10 flex items-center justify-center">
                <CloudSun size={20} className="text-gold-400" />
              </div>
              <h3 className="mt-5 font-display text-xl">
                {t('A Note on Weather', 'Una nota sobre el clima')}
              </h3>
              <p className="mt-2.5 text-cream-200/80 font-body text-sm leading-relaxed">
                {WEATHER_NOTE[lang]}
              </p>
              <div className="mt-5 flex items-center gap-2 text-gold-300/90 text-xs font-body uppercase tracking-widest-2">
                <Layers size={14} />
                {t('Layers recommended', 'Se recomiendan capas')}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
