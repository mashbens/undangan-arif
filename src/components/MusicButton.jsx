import { motion } from 'framer-motion';
import { Disc3, VolumeX } from 'lucide-react';

export default function MusicButton({ playing, onToggle }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      onClick={onToggle}
      aria-label={playing ? 'Matikan musik' : 'Putar musik'}
      className="fixed bottom-24 right-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-sage-800/70 text-cream shadow-soft backdrop-blur-md"
    >
      {playing ? <Disc3 className="animate-spin-slow" size={22} strokeWidth={1.5} /> : <VolumeX size={20} strokeWidth={1.5} />}
    </motion.button>
  );
}
