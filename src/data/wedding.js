// ============================================================
//  SEMUA ISI UNDANGAN ADA DI FILE INI — cukup edit di sini.
//  Foto lokal: taruh di folder /public/images lalu tulis 'images/nama-file.jpg' (tanpa / di depan)
// ============================================================

const unsplash = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const wedding = {
  groom: {
    nickname: 'Arif',
    fullName: 'Arif Budiman, S.Kom.',
    parents: 'Putra dari Bapak Sudarman & Ibu Juarsih',
    instagram: '', // isi username tanpa @ untuk menampilkan tombol Instagram
    photo: 'images/arif.jpg',
    photoPosition: 'center',
  },
  bride: {
    nickname: 'Fitria',
    fullName: 'Fitria, S.Pd.',
    parents: 'Putri dari Bapak Saipudin (Be’en) & Ibu Yanih',
    instagram: '',
    photo: 'images/fitria.jpg',
    photoPosition: 'center',
  },

  // Tanggal utama untuk countdown (format ISO, zona WIB = +07:00)
  date: '2027-05-02T08:00:00+07:00',

  images: {
    cover: 'images/cover.jpg',
    hero: 'images/hero.jpg',
    desktop: 'images/hero.jpg',
    countdown: unsplash('1465495976277-4387d4b0b4c6'),
    closing: 'images/cover.jpg',
  },

  // Taruh file lagu di public/music/song.mp3 (kosongkan '' untuk mematikan musik)
  music: 'music/song3.mp3',
  // Wajib dicantumkan untuk lagu berlisensi CC BY. Kosongkan '' kalau pakai lagu sendiri.
  musicCredit: '',

  quote: {
    text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.',
    source: 'QS. Ar-Rum : 21',
  },

  events: [
    {
      title: 'Akad Nikah',
      start: '2027-05-02T08:00:00+07:00',
      end: '2027-05-02T10:00:00+07:00',
      time: '08.00 – 10.00 WIB',
      venue: 'Bilabong Lake House',
      address: 'Jl. Bilabong Permai, Cimanggis, Kec. Bojonggede, Kabupaten Bogor, Jawa Barat 16920',
      mapsQuery: 'Bilabong Lake House Bojonggede Bogor', // untuk peta yang ditempel
      mapsLink: 'https://maps.app.goo.gl/tiNos2yXedtYeL1C8', // tombol "Lihat Lokasi"
    },
    {
      title: 'Resepsi',
      start: '2027-05-02T11:00:00+07:00',
      end: '2027-05-02T14:00:00+07:00',
      time: '11.00 WIB – selesai',
      venue: 'Bilabong Lake House',
      address: 'Jl. Bilabong Permai, Cimanggis, Kec. Bojonggede, Kabupaten Bogor, Jawa Barat 16920',
      mapsQuery: 'Bilabong Lake House Bojonggede Bogor', // untuk peta yang ditempel
      mapsLink: 'https://maps.app.goo.gl/tiNos2yXedtYeL1C8', // tombol "Lihat Lokasi"
    },
  ],

  // Kisah cinta — kosong = section disembunyikan. Contoh isi:
  // { year: '2019', title: 'Pertama Bertemu', text: '...', image: 'images/story-1.jpg' },
  stories: [],

  // Foto galeri — tambahkan file baru di public/images lalu tulis di sini
  gallery: ['images/hero.jpg', 'images/cover.jpg'],

  gifts: [{ bank: 'BRI', number: '771301017540534', name: 'Fitria' }],
  // Alamat kirim kado — null = disembunyikan. Contoh: { name: 'Arif & Fitria', address: '...' }
  giftAddress: null,
};
