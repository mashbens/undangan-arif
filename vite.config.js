import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Path relatif agar bisa dipasang di sub-path mana pun, mis. undangan.bgcipta.web.id/arif-fitria/
  base: './',
  plugins: [react()],
});
