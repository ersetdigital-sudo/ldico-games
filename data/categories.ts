import type { IconName } from "@/components/site/Icon";
import { GAME_LIST, SERVICES, type Service } from "@/data/services";

/**
 * Sembilan kategori layanan — satu-satunya sumber kebenaran struktur katalog.
 *
 * Aturannya: kategori utama **tepat sembilan**, dan isinya (game, operator,
 * nominal, tagihan) tidak pernah muncul sebagai kategori di halaman ini —
 * produk turunan baru tampil setelah pengguna masuk ke kategorinya.
 *
 * `serviceKeys` menunjuk ke data produk di `data/services.ts`, jadi harga dan
 * field transaksi tidak pernah ditulis dua kali.
 */
export interface ServiceCategory {
  slug: string;
  name: string;
  description: string;
  icon: IconName;
  /** Dua warna brand untuk tile ikon kartu kategori. */
  gradient: [string, string];
  /** Kunci layanan di `SERVICES` yang ditampung kategori ini. Kosong = belum ada produk. */
  serviceKeys: string[];
}

/** Slug kategori game — dipakai rute katalog & detail game. */
export const GAMES_SLUG = "top-up-game";

/** Kunci semua game, diambil dari data supaya tidak pernah ketinggalan. */
const GAME_KEYS = GAME_LIST.map((game) => game.key);

export const CATEGORIES: ServiceCategory[] = [
  {
    slug: "token-tagihan-pln",
    name: "Token & Tagihan PLN",
    description: "Token listrik prabayar, kode langsung terkirim.",
    icon: "bolt",
    gradient: ["#facc15", "#f97316"],
    serviceKeys: ["pln"],
  },
  {
    slug: "pulsa",
    name: "Pulsa",
    description: "Isi pulsa semua operator, masuk instan.",
    icon: "mobile",
    gradient: ["#C6FF00", "#22D3EE"],
    serviceKeys: ["pulsa"],
  },
  {
    slug: "paket-data",
    name: "Paket Data",
    description: "Paket internet harian sampai bulanan.",
    icon: "wifi",
    gradient: ["#22D3EE", "#3b82f6"],
    serviceKeys: ["data"],
  },
  {
    slug: "pdam",
    name: "PDAM",
    description: "Bayar tagihan air tanpa antre.",
    icon: "droplet",
    gradient: ["#0ea5e9", "#1e3a8a"],
    serviceKeys: ["pdam"],
  },
  {
    slug: "bpjs-kesehatan",
    name: "BPJS Kesehatan",
    description: "Iuran BPJS, 1 sampai 3 bulan sekaligus.",
    icon: "shield",
    gradient: ["#22c55e", "#15803d"],
    serviceKeys: ["bpjs"],
  },
  {
    slug: "tv-internet",
    name: "TV & Internet",
    description: "Tagihan internet rumah & voucher streaming.",
    icon: "tv",
    gradient: ["#ef4444", "#8B5CF6"],
    serviceKeys: ["internet", "tv"],
  },
  {
    slug: "e-wallet",
    name: "E-Wallet",
    description: "Top up saldo DANA, OVO, GoPay, ShopeePay.",
    icon: "banknote",
    gradient: ["#8B5CF6", "#22D3EE"],
    serviceKeys: ["ewallet"],
  },
  {
    slug: "multifinance",
    name: "Multifinance",
    description: "Angsuran kredit motor & elektronik.",
    icon: "card",
    gradient: ["#C6FF00", "#8B5CF6"],
    // Belum ada produknya. Halaman kategori menampilkan status apa adanya
    // alih-alih harga contoh — lihat catatan di halaman multifinance.
    serviceKeys: [],
  },
  {
    slug: GAMES_SLUG,
    name: "Top Up Game",
    description: "Top up game favorit dengan mudah.",
    icon: "gamepad",
    gradient: ["#3b82f6", "#8B5CF6"],
    serviceKeys: GAME_KEYS,
  },
];

export const getCategory = (slug?: string | null): ServiceCategory | undefined =>
  CATEGORIES.find((category) => category.slug === slug);

/** Kategori yang menampung sebuah layanan, contoh "pln" → "token-tagihan-pln". */
export const categoryOfService = (key: string): ServiceCategory | undefined =>
  CATEGORIES.find((category) => category.serviceKeys.includes(key));

export const categoryPath = (slug: string) => `/layanan/${slug}`;

/**
 * URL kanonik satu layanan. Game menuju detail game, PPOB menuju halaman
 * kategorinya — dipakai footer, hero, flash sale, schema, dan sitemap supaya
 * tidak ada URL yang ditulis ulang di banyak tempat.
 */
export const servicePath = (service: Service) =>
  service.type === "game"
    ? `${categoryPath(GAMES_SLUG)}/${service.key}`
    : categoryPath(categoryOfService(service.key)?.slug ?? "");

/** Alias dari `SERVICES`, dipakai halaman kategori untuk mengambil produknya. */
export const servicesInCategory = (category: ServiceCategory): Service[] =>
  category.serviceKeys.map((key) => SERVICES[key]).filter(Boolean);
