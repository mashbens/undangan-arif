const TZ = 'Asia/Jakarta';

export const formatDate = (iso, options) =>
  new Intl.DateTimeFormat('id-ID', { timeZone: TZ, ...options }).format(new Date(iso));

export const longDate = (iso) =>
  formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const dotDate = (iso) =>
  formatDate(iso, { day: '2-digit', month: '2-digit', year: 'numeric' }).replaceAll('/', ' . ');

const toCalendarStamp = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');

export function googleCalendarUrl({ title, start, end, location, details = '' }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
    location,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export const mapsUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
export const mapsEmbedUrl = (query) => `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;

const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });

export function timeAgo(timestamp) {
  const seconds = Math.round((timestamp - Date.now()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return 'baru saja';
}
