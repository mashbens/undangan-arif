import Ornament from './Ornament';
import Reveal from './Reveal';

export default function SectionTitle({ eyebrow, title, light = false }) {
  return (
    <Reveal className="mb-12 text-center">
      <p className={`font-script text-3xl ${light ? 'text-gold-light' : 'text-gold'}`}>{eyebrow}</p>
      <h2 className={`mt-1 font-serif text-4xl font-medium tracking-wide ${light ? 'text-cream' : 'text-sage-800'}`}>
        {title}
      </h2>
      <Ornament className="mx-auto mt-5" light={light} />
    </Reveal>
  );
}
