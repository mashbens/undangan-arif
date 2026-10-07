import { Heart } from 'lucide-react';
import { wedding } from '../data/wedding';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

export default function LoveStory() {
  return (
    <section id="story" className="section bg-sage-50">
      <SectionTitle eyebrow="Our Journey" title="Kisah Kami" />

      <div className="relative">
        <div className="absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-gold/0 via-gold/60 to-gold/0" />

        <div className="space-y-8">
          {wedding.stories.map((story) => (
            <Reveal key={story.year} x={30} y={0} className="relative flex gap-5">
              <div className="relative z-10 mt-6 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold bg-cream text-gold">
                <Heart size={11} fill="currentColor" />
              </div>
              <article className="flex-1 overflow-hidden rounded-2xl bg-white shadow-soft">
                {story.image && (
                  <img src={story.image} alt={story.title} loading="lazy" className="h-40 w-full object-cover" />
                )}
                <div className="p-5">
                  <p className="text-xs font-normal uppercase tracking-[0.3em] text-gold">{story.year}</p>
                  <h3 className="mt-1 font-serif text-2xl font-medium text-sage-800">{story.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{story.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
