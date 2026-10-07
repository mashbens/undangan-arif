import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Saat development, request /api diteruskan ke server Node (make dev menjalankan keduanya)
const proxy = { '/api': 'http://localhost:3000' };

export default defineConfig({
  // Path relatif agar bisa dipasang di sub-path mana pun, mis. undangan.bgcipta.web.id/arif-fitria/
  base: './',
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
});
