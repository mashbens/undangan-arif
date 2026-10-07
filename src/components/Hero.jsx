import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { wedding } from '../data/wedding';
import { dotDate } from '../utils/format';
import { ease } from './Reveal';

export default function Hero() {
  const { groom, bride, images, date } = wedding;

  return (
    <section id="home" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <img src={images.hero} alt="" className="absolute inset-0 h-full w-full animate-kenburns object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 via-55% to-cream" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center pb-24 text-center text-white">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.1em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1.6, ease }}
          className="text-xs uppercase drop-shadow"
        >
          We Are Getting Married
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="mt-4 font-script text-7xl leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
        >
          {groom.nickname}
          <br />
          <span className="text-5xl text-gold-light">&</span>
          <br />
          {bride.nickname}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease }}
          className="mt-6 flex items-center gap-4"
        >
          <span className="h-px w-10 bg-white/70" />
          <span className="font-serif text-lg tracking-[0.3em] drop-shadow">{dotDate(date)}</span>
          <span className="h-px w-10 bg-white/70" />
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
