import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { wedding } from '../data/wedding';
import { timeAgo } from '../utils/format';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

const STORAGE_KEY = 'wedding-wishes';

const ATTENDANCE = {
  hadir: { label: 'Hadir', badge: 'bg-sage-100 text-sage-700' },
  tidak: { label: 'Tidak Hadir', badge: 'bg-rose-50 text-rose-700' },
  ragu: { label: 'Masih Ragu', badge: 'bg-amber-50 text-amber-700' },
};

// Sementara ucapan disimpan di browser (localStorage).
// Nanti bisa diganti ke Google Sheets / Firebase agar semua tamu bisa melihat.
function loadWishes() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch {
    // abaikan data rusak
  }
  return wedding.sampleWishes;
}

function saveWishes(wishes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  } catch {
    // storage tidak tersedia (mode privat)
  }
}

export default function Rsvp({ guest }) {
  const [wishes, setWishes] = useState(loadWishes);
  const [form, setForm] = useState({ name: guest, attendance: 'hadir', guests: 1, message: '' });
  const [sent, setSent] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;

    const next = [
      { id: Date.now(), name: form.name.trim(), attendance: form.attendance, message: form.message.trim(), createdAt: Date.now() },
      ...wishes,
    ];
    setWishes(next);
    saveWishes(next);
    setForm((f) => ({ ...f, message: '' }));
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const attendingCount = wishes.filter((w) => w.attendance === 'hadir').length;

  return (
    <section id="rsvp" className="section bg-sage-50">
      <SectionTitle eyebrow="RSVP & Wishes" title="Ucapan & Doa" />

      <Reveal>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-sage-200 bg-white/70 p-6 shadow-soft backdrop-blur">
          <p className="text-center text-sm leading-relaxed text-ink/70">
            Mohon konfirmasi kehadiran serta kirimkan doa & ucapan terbaik untuk kami.
          </p>

          <input className="input" placeholder="Nama kamu" value={form.name} onChange={update('name')} required maxLength={60} />

          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ATTENDANCE).map(([value, { label }]) => (
              <button
                type="button"
                key={value}
                onClick={() => setForm((f) => ({ ...f, attendance: value }))}
                className={`rounded-xl border px-2 py-2.5 text-xs transition ${
                  form.attendance === value
                    ? 'border-sage-600 bg-sage-600 text-cream shadow-soft'
                    : 'border-sage-200 bg-white/80 text-ink/70 hover:border-sage-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {form.attendance === 'hadir' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <select className="input" value={form.guests} onChange={update('guests')}>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} orang
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            className="input min-h-[110px] resize-none"
            placeholder="Tulis ucapan & doa..."
            value={form.message}
            onChange={update('message')}
            required
            maxLength={500}
          />

          <button type="submit" className="btn-primary w-full py-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={sent ? 'sent' : 'idle'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="inline-flex items-center gap-2"
              >
                {sent ? <CheckCircle2 size={16} /> : <Send size={16} strokeWidth={1.5} />}
                {sent ? 'Terima kasih!' : 'Kirim Ucapan'}
              </motion.span>
            </AnimatePresence>
          </button>
        </form>
      </Reveal>

      <Reveal className="mt-8">
        <div className="mb-4 flex items-center justify-between px-1 text-xs text-ink/60">
          <span>{wishes.length} ucapan</span>
          <span>{attendingCount} akan hadir</span>
        </div>

        <div className="no-scrollbar max-h-[26rem] space-y-3 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {wishes.map((wish) => (
              <motion.article
                key={wish.id}
                layout
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 rounded-2xl bg-white p-4 shadow-soft"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sage-400 to-sage-700 font-serif text-lg text-cream">
                  {wish.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-ink">{wish.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${ATTENDANCE[wish.attendance]?.badge}`}>
                      {ATTENDANCE[wish.attendance]?.label}
                    </span>
                  </div>
                  <p className="mt-1 break-words text-sm leading-relaxed text-ink/75">{wish.message}</p>
                  <p className="mt-2 text-[11px] text-ink/40">{timeAgo(wish.createdAt)}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
