import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';
import { wedding } from '../data/wedding';
import { googleCalendarUrl, longDate } from '../utils/format';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

function getTimeLeft(target) {
  const diff = Math.max(0, new Date(target) - Date.now());
  return {
    Hari: Math.floor(diff / 86400000),
    Jam: Math.floor((diff / 3600000) % 24),
    Menit: Math.floor((diff / 60000) % 60),
    Detik: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(wedding.date));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(wedding.date)), 1000);
    return () => clearInterval(timer);
  }, []);

  const firstEvent = wedding.events[0];
  const calendarUrl = googleCalendarUrl({
    title: `Pernikahan ${wedding.groom.nickname} & ${wedding.bride.nickname}`,
    start: firstEvent.start,
    end: wedding.events.at(-1).end,
    location: firstEvent.venue,
  });

  return (
    <section className="section overflow-hidden text-cream">
      <img src={wedding.images.countdown} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-sage-900/80" />

      <div className="relative">
        <SectionTitle eyebrow="Save The Date" title="Menuju Hari Bahagia" light />

        <Reveal className="grid grid-cols-4 gap-3">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="glass flex flex-col items-center rounded-2xl py-5">
              <div className="relative h-10 w-full overflow-hidden text-center font-serif text-4xl font-medium leading-10">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={value}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="block"
                  >
                    {String(value).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="mt-2 text-[10px] uppercase tracking-[0.25em] text-cream/70">{label}</span>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.2} className="mt-10 text-center">
          <p className="font-serif text-xl tracking-wide">{longDate(wedding.date)}</p>
          <a href={calendarUrl} target="_blank" rel="noreferrer" className="btn mt-6 bg-cream text-sage-800 hover:bg-white">
            <CalendarPlus size={16} strokeWidth={1.5} />
            Simpan ke Kalender
          </a>
        </Reveal>
      </div>
    </section>
  );
}
