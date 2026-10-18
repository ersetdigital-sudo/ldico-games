/**
 * Identitas & konfigurasi global situs.
 * Ganti nilai di sini kalau domain / kontak resmi sudah tersedia.
 */
export const SITE = {
  name: "LDICO Games",
  shortName: "LDICO",
  tagline: "Top Up Game & PPOB Instan",
  description:
    "Top up 100+ game dan bayar semua tagihan digital dari satu tempat. Diamond, UC, pulsa, token PLN sampai BPJS, diproses otomatis 24/7.",
  url: "https://ldicogames.id",
  locale: "id_ID",
  lang: "id",
  support: {
    // Masih placeholder — belum ada di HTML asli.
    whatsapp: "6281234567890",
    email: "cs@ldicogames.id",
    hours: "CS online 24/7",
  },
  social: {
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
  },
} as const;

export const NAV_LINKS = [
  { href: "/#layanan", label: "Layanan" },
  { href: "/#flash", label: "Flash Sale" },
  { href: "/#cara", label: "Cara Order" },
  { href: "/lacak", label: "Lacak Pesanan" },
  { href: "/pembayaran", label: "Pembayaran" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const NAV_LINKS_COMPACT = [
  { href: "/#layanan", label: "Layanan" },
  { href: "/lacak", label: "Lacak" },
  { href: "/pembayaran", label: "Pembayaran" },
] as const;

export const waLink = (message: string) =>
  `https://wa.me/${SITE.support.whatsapp}?text=${encodeURIComponent(message)}`;
