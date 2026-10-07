import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { wedding } from '../data/wedding';
import { dotDate } from '../utils/format';
import { ease } from './Reveal';

export default function Hero() {
  const { groom, bride, images, date } = wedding;

  return (
    <section id="home" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <img
        src={images.hero}
        alt={`${groom.nickname} & ${bride.nickname}`}
        className="absolute inset-0 h-full w-full animate-kenburns object-cover object-[center_30%]"
      />
      {/* Foto bening di atas (wajah), memudar ke cream di bawah tempat nama */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-45% to-cream" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-cream" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1.6, ease }}
          className="text-xs uppercase text-sage-700"
        >
          We Are Getting Married
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="mt-3 font-script text-6xl leading-tight text-sage-800 sm:text-7xl"
        >
          {groom.nickname}
          <span className="mx-3 text-gold">&</span>
          {bride.nickname}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease }}
          className="mt-4 flex items-center gap-4 text-sage-700"
        >
          <span className="h-px w-10 bg-gold/70" />
          <span className="font-serif text-lg tracking-[0.3em]">{dotDate(date)}</span>
          <span className="h-px w-10 bg-gold/70" />
        </motion.div>
      </div>

      <a
        href="#quote"
        aria-label="Gulir ke bawah"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-sage-600"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="animate-float" size={20} strokeWidth={1.5} />
      </a>
    </section>
  );
}
