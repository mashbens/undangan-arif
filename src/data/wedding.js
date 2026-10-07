// ============================================================
//  SEMUA ISI UNDANGAN ADA DI FILE INI — cukup edit di sini.
//  Foto lokal: taruh di folder /public/images lalu tulis 'images/nama-file.jpg' (tanpa / di depan)
// ============================================================

const unsplash = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const wedding = {
  groom: {
    nickname: 'Arif',
    fullName: 'Arif Budiman',
    parents: 'Putra dari Bapak Sudarman & Ibu Juarsih',
    instagram: '', // isi username tanpa @ untuk menampilkan tombol Instagram
    photo: unsplash('1550005809-91ad75fb315f', 800),
    photoPosition: '85% center',
  },
  bride: {
    nickname: 'Fitria',
    fullName: 'Fitria',
    parents: 'Putri dari Bapak Be’en & Ibu Yati',
    instagram: '',
    photo: unsplash('1525258946800-98cfd641d0de', 800),
    photoPosition: 'center',
  },

  // Tanggal utama untuk countdown (format ISO, zona WIB = +07:00)
  date: '2027-05-02T08:00:00+07:00',

  images: {
    cover: 'images/cover.jpg',
    hero: unsplash('1583939003579-730e3918a45a'),
    desktop: unsplash('1519741497674-611481863552', 1800),
    countdown: unsplash('1465495976277-4387d4b0b4c6'),
    closing: unsplash('1460978812857-470ed1c77af0'),
  },

  // Taruh file lagu di public/music/song.mp3 (kosongkan '' untuk mematikan musik)
  music: 'music/song.mp3',
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
      venue: 'Billabong',
      address: 'Jl. Bilabong 16, Kemang, Kabupaten Bogor, Jawa Barat',
      mapsQuery: 'Billabong Kemang Bogor',
    },
    {
      title: 'Resepsi',
      start: '2027-05-02T11:00:00+07:00',
      end: '2027-05-02T14:00:00+07:00',
      time: '11.00 WIB – selesai',
      venue: 'Billabong',
      address: 'Jl. Bilabong 16, Kemang, Kabupaten Bogor, Jawa Barat',
      mapsQuery: 'Billabong Kemang Bogor',
    },
  ],

  // Kisah cinta — kosong = section disembunyikan. Contoh isi:
  // { year: '2019', title: 'Pertama Bertemu', text: '...', image: 'images/story-1.jpg' },
  stories: [],

  gallery: [
    '1583939003579-730e3918a45a',
    '1546032996-6dfacbacbf3f',
    '1537633552985-df8429e8048b',
    '1465495976277-4387d4b0b4c6',
    '1591604466107-ec97de577aff',
    '1529636798458-92182e662485',
    '1460978812857-470ed1c77af0',
    '1520854221256-17451cc331bf',
    '1519741497674-611481863552',
    '1606800052052-a08af7148866',
    '1511285560929-80b456fea0bc',
    '1469371670807-013ccf25f16a',
  ].map((id) => unsplash(id, 1000)),

  gifts: [{ bank: 'BRI', number: '771301017540534', name: 'Fitria' }],
  // Alamat kirim kado — null = disembunyikan. Contoh: { name: 'Arif & Fitria', address: '...' }
  giftAddress: null,
};
