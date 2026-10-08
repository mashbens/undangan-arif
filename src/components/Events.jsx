import { CalendarPlus, Clock, MapPin } from 'lucide-react';
import { wedding } from '../data/wedding';
import { formatDate, googleCalendarUrl, mapsEmbedUrl, mapsUrl } from '../utils/format';
import Ornament from './Ornament';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

function EventCard({ event, delay }) {
  const calendarUrl = googleCalendarUrl({
    title: `${event.title} ${wedding.groom.nickname} & ${wedding.bride.nickname}`,
    start: event.start,
    end: event.end,
    location: `${event.venue}, ${event.address}`,
  });

  return (
    <Reveal delay={delay}>
      <article className="relative rounded-b-3xl rounded-t-[999px] border border-sage-200 bg-white/70 px-6 pb-9 pt-16 text-center shadow-soft backdrop-blur">
        <div className="pointer-events-none absolute inset-2 rounded-b-[20px] rounded-t-[999px] border border-gold/30" />

        <h3 className="font-script text-5xl text-sage-700">{event.title}</h3>
        <Ornament className="mx-auto mt-3" />

        <div className="mt-6 flex items-center justify-center gap-3 text-sage-800">
          <span className="w-20 border-y border-sage-300 py-1 text-[11px] uppercase tracking-[0.2em]">
            {formatDate(event.start, { weekday: 'long' })}
          </span>
          <span className="font-serif text-6xl font-medium leading-none">{formatDate(event.start, { day: '2-digit' })}</span>
          <span className="w-20 border-y border-sage-300 py-1 text-[11px] uppercase tracking-[0.2em]">
            {formatDate(event.start, { month: 'short', year: 'numeric' })}
          </span>
        </div>

        <p className="mt-6 inline-flex items-center gap-2 text-sm text-ink/75">
          <Clock size={15} strokeWidth={1.5} className="text-gold" />
          {event.time}
        </p>

        <div className="mt-5">
          <p className="font-serif text-2xl font-medium text-ink">{event.venue}</p>
          <p className="mx-auto mt-1 max-w-[17rem] text-sm leading-relaxed text-ink/65">{event.address}</p>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={event.mapsLink || mapsUrl(event.mapsQuery)} target="_blank" rel="noreferrer" className="btn-primary">
            <MapPin size={15} strokeWidth={1.5} />
            Lihat Lokasi
          </a>
          <a href={calendarUrl} target="_blank" rel="noreferrer" className="btn-outline">
            <CalendarPlus size={15} strokeWidth={1.5} />
            Kalender
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export default function Events() {
  const mainVenue = wedding.events.at(-1);

  return (
    <section id="event" className="paper section">
      <SectionTitle eyebrow="Wedding Event" title="Waktu & Tempat" />

      <div className="space-y-8">
        {wedding.events.map((event, i) => (
          <EventCard key={event.title} event={event} delay={i * 0.1} />
        ))}
      </div>

      <Reveal className="mt-10 overflow-hidden rounded-3xl border border-sage-200 shadow-soft">
        <iframe
          title={`Peta ${mainVenue.venue}`}
          src={mapsEmbedUrl(mainVenue.mapsQuery)}
          loading="lazy"
          className="h-64 w-full grayscale-[35%]"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Reveal>
    </section>
  );
}
