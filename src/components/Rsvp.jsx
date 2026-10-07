import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { timeAgo } from '../utils/format';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

// Path relatif: ikut sub-path undangan, mis. /arif-fitria/api/wishes
const API_URL = 'api/wishes';

const ATTENDANCE = {
  hadir: { label: 'Hadir', badge: 'bg-sage-100 text-sage-700' },
  tidak: { label: 'Tidak Hadir', badge: 'bg-rose-50 text-rose-700' },
  ragu: { label: 'Masih Ragu', badge: 'bg-amber-50 text-amber-700' },
};

export default function Rsvp({ guest }) {
  const [wishes, setWishes] = useState([]);
  const [loadState, setLoadState] = useState('loading'); // loading | ready | error
  const [form, setForm] = useState({ name: guest, attendance: 'hadir', guests: 1, message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        setWishes(data);
        setLoadState('ready');
      })
      .catch(() => setLoadState('error'));
  }, []);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim() || status === 'sending') return;

    setStatus('sending');
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal mengirim ucapan.');

      setWishes((list) => [data, ...list]);
      setLoadState('ready');
      setForm((f) => ({ ...f, message: '' }));
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Koneksi bermasalah, coba lagi.' : err.message);
      setStatus('idle');
    }
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

          {error && <p className="text-center text-sm text-rose-700">{error}</p>}

          <button type="submit" disabled={status === 'sending'} className="btn-primary w-full py-3 disabled:opacity-70">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="inline-flex items-center gap-2"
              >
                {status === 'sent' && <CheckCircle2 size={16} />}
                {status === 'sending' && <Loader2 size={16} className="animate-spin" />}
                {status === 'idle' && <Send size={16} strokeWidth={1.5} />}
                {{ idle: 'Kirim Ucapan', sending: 'Mengirim...', sent: 'Terima kasih!' }[status]}
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

        {loadState === 'loading' && <p className="py-6 text-center text-sm text-ink/50">Memuat ucapan...</p>}
        {loadState === 'error' && <p className="py-6 text-center text-sm text-rose-700">Ucapan belum bisa dimuat.</p>}
        {loadState === 'ready' && wishes.length === 0 && (
          <p className="py-6 text-center font-serif text-lg italic text-ink/50">Jadilah yang pertama memberi ucapan 🤍</p>
        )}

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
