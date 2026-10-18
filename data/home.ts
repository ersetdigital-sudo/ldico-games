/**
 * Konten statis beranda: alur order & ulasan pelanggan.
 */

export interface OrderStep {
  title: string;
  body: string;
}

/** Empat langkah order yang tampil di beranda (versi ringkas dari alur tiap layanan). */
export const HOW_TO_ORDER: OrderStep[] = [
  {
    title: "Pilih layanan",
    body: "Game favorit atau tagihan harian — semuanya ada di satu halaman.",
  },
  {
    title: "Masukkan ID / nomor",
    body: "ID game, nomor HP, atau nomor pelanggan sesuai layanannya.",
  },
  {
    title: "Bayar",
    body: "QRIS, e-wallet, atau virtual account. Pilih yang paling gampang.",
  },
  {
    title: "Selesai",
    body: "Item masuk otomatis, rinciannya tersimpan di halaman invoice.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  city: string;
}

/**
 * PLACEHOLDER — ganti dengan ulasan asli sebelum situs dipublikasikan.
 * Ulasan karangan yang tampil seolah-olah asli menyesatkan pembeli, jadi ini
 * sengaja dikumpulkan di satu tempat supaya gampang diganti.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Diamond Mobile Legends masuk kurang dari 5 detik, padahal order tengah malam. Mantap.",
    name: "Rina",
    city: "Bandung",
  },
  {
    quote: "Token PLN dan BPJS jadi satu tempat, struknya langsung ketemu di invoice.",
    name: "Andi",
    city: "Surabaya",
  },
  {
    quote: "Harga diamond-nya lebih murah dari tempat lain. Langganan terus sampai sekarang.",
    name: "Dewi",
    city: "Medan",
  },
];
