# Undangan Pernikahan Arif & Fitria

React + Vite + Tailwind CSS + Framer Motion.

## Menjalankan

```bash
npm install
npm run dev      # buka http://localhost:5173
npm run build    # hasil siap upload ada di folder dist/
```

## Mengedit isi

Semua teks, tanggal, lokasi, foto, rekening, dan love story ada di **`src/data/wedding.js`**.

- Foto sendiri: taruh di `public/images/` lalu tulis `'images/nama.jpg'` (tanpa / di depan)
- Musik: taruh file di `public/music/song.mp3` (path di data: `'music/song.mp3'`)
- Warna dan font: `tailwind.config.js` (palet `sage`, `cream`, `gold`)

## Nama tamu personal

Tambahkan `?to=` di link, contoh: `https://undangan-kamu.vercel.app/?to=Budi+Santoso`

## Deploy gratis

Upload ke GitHub lalu import ke [Vercel](https://vercel.com) atau [Netlify](https://netlify.com). Pengaturan default Vite sudah cukup.

## Makefile & Docker

```bash
make            # daftar perintah
make dev        # development, http://localhost:5173
make up         # build image Docker + jalankan di http://localhost:8090
make down       # hentikan container
make deploy     # git pull + docker compose di VM (push ke GitHub dulu)
```
