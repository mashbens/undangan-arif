import { useState } from 'react';
import { Check, Copy, Gift as GiftIcon, MapPin } from 'lucide-react';
import { wedding } from '../data/wedding';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

// Clipboard API kadang diblokir di browser bawaan WhatsApp/Instagram -> pakai cara lama
function fallbackCopy(text) {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(el);
  el.select();
  const ok = document.execCommand('copy');
  el.remove();
  return ok;
}

function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async (text) => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = fallbackCopy(text);
    }
    if (!ok) return window.prompt('Salin teks ini:', text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return [copied, copy];
}

function CopyButton({ text, label = 'Salin' }) {
  const [copied, copy] = useCopy();
  return (
    <button onClick={() => copy(text)} className="btn-outline px-4 py-2 text-xs">
      {copied ? <Check size={14} /> : <Copy size={14} strokeWidth={1.5} />}
      {copied ? 'Tersalin' : label}
    </button>
  );
}

function BankCard({ gift }) {
  const [copied, copy] = useCopy();
  const formatted = gift.number.replace(/(.{4})/g, '$1 ').trim();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-600 via-sage-700 to-sage-900 p-6 text-cream shadow-soft">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-gold/15" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="h-8 w-11 rounded-md bg-gradient-to-br from-gold-light to-gold shadow-inner" />
          <p className="font-serif text-2xl font-semibold italic tracking-wide">{gift.bank}</p>
        </div>

        <p className="mt-7 text-[10px] uppercase tracking-[0.25em] text-cream/60">Nomor Rekening</p>
        <button
          onClick={() => copy(gift.number)}
          aria-label={`Salin nomor rekening ${gift.number}`}
          className="mt-1 block max-w-full break-words text-left font-mono text-[clamp(1rem,5.2vw,1.35rem)] tabular-nums tracking-[0.1em]"
        >
          {formatted}
        </button>

        <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-cream/60">Atas Nama</p>
        <p className="mt-0.5 break-words text-base">{gift.name}</p>

        <button
          onClick={() => copy(gift.number)}
          className="btn mt-6 w-full bg-cream py-3 font-normal text-sage-800 shadow-lg hover:bg-white"
        >
          {copied ? <Check size={16} /> : <Copy size={16} strokeWidth={1.5} />}
          {copied ? 'Nomor rekening tersalin!' : 'Salin Nomor Rekening'}
        </button>
      </div>
    </div>
  );
}

export default function Gift() {
  return (
    <section id="gift" className="paper section">
      <SectionTitle eyebrow="Wedding Gift" title="Tanda Kasih" />

      <Reveal className="mb-10 text-center">
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-ink/70">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda
          kasih, Anda dapat memberi kado secara cashless.
        </p>
      </Reveal>

      <div className="space-y-5">
        {wedding.gifts.map((gift, i) => (
          <Reveal key={gift.number} delay={i * 0.1}>
            <BankCard gift={gift} />
          </Reveal>
        ))}

        {wedding.giftAddress && (
          <Reveal>
            <div className="rounded-3xl border border-sage-200 bg-white/70 p-6 text-center shadow-soft">
              <GiftIcon className="mx-auto text-gold" size={28} strokeWidth={1.25} />
              <p className="mt-3 font-serif text-xl font-medium text-sage-800">Kirim Kado</p>
              <p className="mt-1 text-sm font-normal text-ink">{wedding.giftAddress.name}</p>
              <p className="mx-auto mt-1 flex max-w-xs items-start justify-center gap-1.5 text-sm leading-relaxed text-ink/65">
                <MapPin size={14} className="mt-1 shrink-0" strokeWidth={1.5} />
                {wedding.giftAddress.address}
              </p>
              <div className="mt-4">
                <CopyButton text={`${wedding.giftAddress.name} — ${wedding.giftAddress.address}`} label="Salin Alamat" />
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
