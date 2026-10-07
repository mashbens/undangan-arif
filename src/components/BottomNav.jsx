import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Gift, Heart, Home, Images, MessageCircle } from 'lucide-react';

const ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'couple', label: 'Mempelai', icon: Heart },
  { id: 'event', label: 'Acara', icon: CalendarDays },
  { id: 'gallery', label: 'Galeri', icon: Images },
  { id: 'rsvp', label: 'Ucapan', icon: MessageCircle },
  { id: 'gift', label: 'Hadiah', icon: Gift },
];

export default function BottomNav() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 lg:left-auto lg:right-[240px] lg:translate-x-1/2">
      <motion.ul
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-1 rounded-full border border-white/40 bg-sage-800/75 p-1.5 shadow-soft backdrop-blur-md"
      >
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <a href={`#${id}`} aria-label={label} className="relative grid h-10 w-10 place-items-center rounded-full text-cream/80">
              {active === id && (
                <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-cream" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <Icon size={18} strokeWidth={1.5} className={`relative ${active === id ? 'text-sage-800' : ''}`} />
            </a>
          </li>
        ))}
      </motion.ul>
    </nav>
  );
}
