import { motion } from 'framer-motion';
import { MailOpen } from 'lucide-react';
import { wedding } from '../data/wedding';
import { dotDate } from '../utils/format';
import { ease } from './Reveal';

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay, ease },
});

export default function Cover({ guest, onOpen }) {
  const { groom, bride, images, date } = wedding;

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-sage-900"
      exit={{ y: '-100%' }}
      transition={{ duration: 1.1, ease }}
    >
      <motion.img
        src={images.cover}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sage-900/60 via-sage-900/30 to-sage-900/90" />

      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 py-14 text-center text-cream">
        <motion.p {...fadeUp(0.3)} className="text-xs uppercase tracking-[0.45em] text-cream/80">
          The Wedding of
        </motion.p>

        <div>
          <motion.h1 {...fadeUp(0.5)} className="font-script text-7xl leading-tight drop-shadow-lg sm:text-8xl">
            {groom.nickname}
            <span className="mx-3 text-gold-light">&</span>
            {bride.nickname}
          </motion.h1>
          <motion.p {...fadeUp(0.7)} className="mt-3 font-serif text-xl tracking-[0.3em]">
            {dotDate(date)}
          </motion.p>
        </div>

        <div className="w-full max-w-xs">
          <motion.div {...fadeUp(0.9)} className="glass rounded-2xl px-6 py-5">
            <p className="text-xs tracking-wide text-cream/75">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="mt-2 font-serif text-2xl font-medium">{guest || 'Tamu Undangan'}</p>
            <p className="mt-2 text-[11px] text-cream/60">Mohon maaf apabila ada kesalahan penulisan nama/gelar</p>
          </motion.div>

          <motion.button
            {...fadeUp(1.1)}
            onClick={onOpen}
            className="btn mt-6 bg-cream px-7 py-3 text-sage-800 shadow-xl hover:bg-white"
          >
            <MailOpen size={18} strokeWidth={1.5} />
            Buka Undangan
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
