import { useMemo } from 'react';

// Ambil nama tamu dari URL, contoh: https://domain.com/?to=Budi+Santoso
export function useGuestName() {
  return useMemo(() => {
    const name = new URLSearchParams(window.location.search).get('to');
    return name ? name.trim().slice(0, 60) : '';
  }, []);
}
