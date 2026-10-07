import { useState } from 'react';
import { Check, Copy, Gift as GiftIcon, MapPin } from 'lucide-react';
import { wedding } from '../data/wedding';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';

function CopyButton({ text, light = false }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Salin teks ini:', text);
    }
  };

  return (
    <button
      onClick={copy}
      className={`btn px-4 py-2 text-xs ${light ? 'glass text-cream hover:bg-white/20' : 'btn-outline'}`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} strokeWidth={1.5} />}
      {copied ? 'Tersalin' : 'Salin'}
    </button>
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
            <div className="relative aspect-[1.65/1] overflow-hidden rounded-3xl bg-gradient-to-br from-sage-600 via-sage-700 to-sage-900 p-6 text-cream shadow-soft">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-gold/15" />

              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="h-8 w-11 rounded-md bg-gradient-to-br from-gold-light to-gold shadow-inner" />
                  <p className="font-serif text-2xl font-semibold italic tracking-wide">{gift.bank}</p>
                </div>
                <p className="font-mono text-xl tracking-[0.18em]">{gift.number.replace(/(.{4})/g, '$1 ').trim()}</p>
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-cream/60">Atas Nama</p>
                    <p className="truncate text-sm">{gift.name}</p>
                  </div>
                  <CopyButton text={gift.number} light />
                </div>
              </div>
            </div>
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
                <CopyButton text={`${wedding.giftAddress.name} — ${wedding.giftAddress.address}`} />
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
