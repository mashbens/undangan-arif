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
        className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/0 via-45% to-black/80" />

      {/* Nama di atas & kartu tamu di bawah, supaya wajah di tengah foto tidak tertutup */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 pb-10 pt-12 text-center text-cream">
        <div>
          <motion.p {...fadeUp(0.3)} className="text-xs uppercase tracking-[0.45em] text-cream/85">
            The Wedding of
          </motion.p>
          <motion.h1
            {...fadeUp(0.5)}
            className="mt-3 font-script text-6xl leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-7xl"
          >
            {groom.nickname}
            <span className="mx-3 text-gold-light">&</span>
            {bride.nickname}
          </motion.h1>
          <motion.p {...fadeUp(0.7)} className="mt-2 font-serif text-lg tracking-[0.3em] drop-shadow">
            {dotDate(date)}
          </motion.p>
        </div>

        <div className="w-full max-w-xs">
          <motion.div {...fadeUp(0.9)} className="glass rounded-2xl bg-black/20 px-6 py-5">
            <p className="text-xs tracking-wide text-cream/80">Kepada Yth. Bapak/Ibu/Saudara/i</p>
            <p className="mt-2 font-serif text-2xl font-medium">{guest || 'Tamu Undangan'}</p>
            <p className="mt-2 text-[11px] text-cream/65">Mohon maaf apabila ada kesalahan penulisan nama/gelar</p>
          </motion.div>

          <motion.button
            {...fadeUp(1.1)}
            onClick={onOpen}
            className="btn mt-5 bg-cream px-7 py-3 text-sage-800 shadow-xl hover:bg-white"
          >
            <MailOpen size={18} strokeWidth={1.5} />
            Buka Undangan
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
