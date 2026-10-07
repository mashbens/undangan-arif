import { motion } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1];

export default function Reveal({ children, className = '', delay = 0, y = 32, x = 0, scale = 1 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.div>
  );
}
