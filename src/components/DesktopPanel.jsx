import { wedding } from '../data/wedding';
import { longDate } from '../utils/format';

// Panel foto besar di sisi kiri, hanya tampil di layar lebar (laptop/desktop)
export default function DesktopPanel() {
  const { groom, bride, images, date, quote } = wedding;

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[calc(100%-480px)] overflow-hidden lg:block">
      <img src={images.desktop} alt="" className="h-full w-full animate-kenburns object-cover object-[center_25%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-sage-900/90 via-sage-900/30 to-sage-900/20" />
      <div className="absolute inset-x-0 bottom-0 p-16 text-cream">
        <p className="text-xs uppercase tracking-[0.45em] text-cream/70">The Wedding of</p>
        <h2 className="mt-4 font-script text-8xl leading-none">
          {groom.nickname} <span className="text-gold-light">&</span> {bride.nickname}
        </h2>
        <p className="mt-6 font-serif text-2xl tracking-wider">{longDate(date)}</p>
        <p className="mt-8 max-w-xl font-serif text-lg italic leading-relaxed text-cream/75">“{quote.text}”</p>
      </div>
    </aside>
  );
}
