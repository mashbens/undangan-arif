import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { wedding } from '../data/wedding';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

const photos = wedding.gallery;

function Lightbox({ index, onClose, onNavigate }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNavigate]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={photos[index]}
          alt=""
          className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) onNavigate(1);
            if (info.offset.x > 60) onNavigate(-1);
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>

      <button onClick={onClose} aria-label="Tutup" className="glass absolute right-4 top-4 rounded-full p-2.5 text-white">
        <X size={20} strokeWidth={1.5} />
      </button>
      {[
        [-1, ChevronLeft, 'left-3', 'Sebelumnya'],
        [1, ChevronRight, 'right-3', 'Berikutnya'],
      ].map(([dir, Icon, pos, label]) => (
        <button
          key={dir}
          aria-label={label}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(dir);
          }}
          className={`glass absolute ${pos} top-1/2 -translate-y-1/2 rounded-full p-2.5 text-white`}
        >
          <Icon size={22} strokeWidth={1.5} />
        </button>
      ))}
      <p className="absolute bottom-6 text-xs tracking-[0.3em] text-white/70">
        {index + 1} / {photos.length}
      </p>
    </motion.div>
  );
}

export default function Gallery() {
  const [active, setActive] = useState(null);

  const close = useCallback(() => setActive(null), []);
  const navigate = useCallback(
    (dir) => setActive((i) => (i + dir + photos.length) % photos.length),
    [],
  );

  return (
    <section id="gallery" className="paper section">
      <SectionTitle eyebrow="Moments" title="Galeri" />

      <div className="grid grid-cols-2 gap-3">
        {photos.map((src, i) => {
          const wide = i % 5 === 0;
          return (
            <Reveal key={src} delay={(i % 2) * 0.08} className={wide ? 'col-span-2' : ''}>
              <button
                onClick={() => setActive(i)}
                className={`group relative block w-full overflow-hidden rounded-2xl shadow-soft ${
                  wide ? 'aspect-[4/3]' : 'aspect-[3/4]'
                }`}
              >
                <img
                  src={src}
                  alt={`Galeri ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover object-[center_30%] transition duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-sage-900/0 transition duration-500 group-hover:bg-sage-900/20" />
              </button>
            </Reveal>
          );
        })}
      </div>

      <AnimatePresence>
        {active !== null && <Lightbox index={active} onClose={close} onNavigate={navigate} />}
      </AnimatePresence>
    </section>
  );
}
