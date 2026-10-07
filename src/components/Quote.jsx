import { wedding } from '../data/wedding';
import Ornament from './Ornament';
import Reveal from './Reveal';

export default function Quote() {
  return (
    <section id="quote" className="paper section pt-10 text-center">
      <Reveal>
        <Ornament className="mx-auto" />
        <p className="mt-8 font-serif text-xl italic leading-relaxed text-sage-800">“{wedding.quote.text}”</p>
        <p className="mt-6 text-xs font-normal uppercase tracking-[0.35em] text-gold">{wedding.quote.source}</p>
      </Reveal>
    </section>
  );
}
