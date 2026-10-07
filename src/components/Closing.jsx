import { wedding } from '../data/wedding';
import Ornament from './Ornament';
import Reveal from './Reveal';

export default function Closing() {
  const { groom, bride, images } = wedding;

  return (
    <footer className="relative overflow-hidden px-6 pb-36 pt-28 text-center text-cream">
      <img src={images.closing} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-sage-900/75 to-sage-900" />

      <div className="relative pt-20">
        <Reveal>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-cream/85">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan
            memberikan doa restu kepada kami.
          </p>
          <p className="mt-6 font-serif text-lg italic">Wassalamu’alaikum Warahmatullahi Wabarakatuh</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12">
          <p className="text-xs uppercase tracking-[0.4em] text-cream/70">Kami yang berbahagia</p>
          <h2 className="mt-4 font-script text-6xl">
            {groom.nickname} <span className="text-gold-light">&</span> {bride.nickname}
          </h2>
          <Ornament className="mx-auto mt-6" light />
        </Reveal>

        <p className="mt-16 text-[11px] tracking-widest text-cream/40">Made with ♡</p>
      </div>
    </footer>
  );
}
