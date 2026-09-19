import { useEffect, useState } from 'react';
import { WEDDING_DATE } from '@/constants';
import { useLanguage } from '@/i18n/LanguageContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(WEDDING_DATE));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft(WEDDING_DATE)), 1000);
    return () => clearInterval(timer);
  }, []);

  const units: { key: string; label: string; value: number }[] = [
    { key: 'days', label: t('Days', 'Días'), value: timeLeft.days },
    { key: 'hours', label: t('Hours', 'Horas'), value: timeLeft.hours },
    { key: 'minutes', label: t('Minutes', 'Minutos'), value: timeLeft.minutes },
    { key: 'seconds', label: t('Seconds', 'Segundos'), value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {units.map((unit, i) => (
        <div key={unit.key} className="flex items-center gap-3 sm:gap-5">
          <div className="text-center">
            <div className="bg-cream-50/10 backdrop-blur-sm border border-cream-50/20 rounded-xl px-3 py-2.5 sm:px-5 sm:py-3 min-w-[60px] sm:min-w-[80px]">
              <span className="font-display text-2xl sm:text-4xl text-cream-50 font-medium tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="mt-1.5 block text-[10px] sm:text-xs font-body uppercase tracking-widest-2 text-gold-300">
              {unit.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="font-display text-2xl sm:text-3xl text-gold-400/60 -mt-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
