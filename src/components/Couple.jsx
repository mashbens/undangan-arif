import { Instagram } from 'lucide-react';
import { wedding } from '../data/wedding';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

function Person({ person, from }) {
  return (
    <Reveal x={from === 'left' ? -40 : 40} y={0} className="text-center">
      <div className="relative mx-auto h-80 w-60">
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-t-full border border-gold/60" />
        <img
          src={person.photo}
          alt={person.fullName}
          loading="lazy"
          style={{ objectPosition: person.photoPosition }}
          className="relative h-full w-full rounded-t-full object-cover shadow-soft"
        />
      </div>
      <h3 className="mt-8 font-script text-5xl text-sage-700">{person.nickname}</h3>
      <p className="mt-2 font-serif text-xl font-medium text-ink">{person.fullName}</p>
      <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-ink/65">{person.parents}</p>
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram}`}
          target="_blank"
          rel="noreferrer"
          className="btn-outline mt-5 px-4 py-2 text-xs"
        >
          <Instagram size={14} strokeWidth={1.5} />@{person.instagram}
        </a>
      )}
    </Reveal>
  );
}

export default function Couple() {
  return (
    <section id="couple" className="paper section">
      <SectionTitle eyebrow="Bride & Groom" title="Mempelai" />

      <Reveal className="mb-14 text-center">
        <p className="font-serif text-lg italic text-sage-700">Assalamu’alaikum Warahmatullahi Wabarakatuh</p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink/70">
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:
        </p>
      </Reveal>

      <div className="space-y-10">
        <Person person={wedding.groom} from="left" />
        <Reveal scale={0.6} y={0} className="text-center font-script text-7xl text-gold">
          &
        </Reveal>
        <Person person={wedding.bride} from="right" />
      </div>
    </section>
  );
}
