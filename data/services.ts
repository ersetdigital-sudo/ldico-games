import { rupiah } from "@/lib/format";

export type ServiceType = "game" | "ppob";
export type GameCategory = "moba" | "fps" | "rpg" | "voucher";

export interface ServicePackage {
  /** Nama nominal, contoh "172 Diamond" atau "Token Rp50.000" */
  name: string;
  price: number;
}

export interface Service {
  key: string;
  name: string;
  publisher: string;
  type: ServiceType;
  /** Dua warna brand, dipakai `ServiceThumb` sebagai sapuan gradient di balik ikon. */
  gradient: [string, string];
  /** Field yang harus diisi pembeli, contoh ["User ID", "Zone ID"] */
  fields: string[];
  packages: ServicePackage[];
  description: string;
  category?: GameCategory;
  /** Path gambar game di /public, contoh "/images/games/ml.png" */
  image?: string;
}

const mk = (unit: string, list: [number, number][]): ServicePackage[] =>
  list.map(([qty, price]) => ({ name: `${qty} ${unit}`, price }));

export const GAME_CATEGORIES: { value: "all" | GameCategory; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "moba", label: "MOBA" },
  { value: "fps", label: "Battle Royale" },
  { value: "rpg", label: "RPG" },
  { value: "voucher", label: "Game Lainnya" },
];

/** Urutan di sini menentukan urutan kartu di katalog beranda. */
export const SERVICES: Record<string, Service> = {
  ml: {
    key: "ml",
    name: "Mobile Legends",
    publisher: "Moonton",
    type: "game",
    category: "moba",
    image: "/images/games/ml.png",
    gradient: ["#3b82f6", "#8B5CF6"],
    fields: ["User ID", "Zone ID"],
    packages: [
      ...mk("Diamond", [
        [86, 22500],
        [172, 44900],
        [257, 66800],
        [344, 89000],
        [429, 110500],
        [514, 132000],
        [706, 178000],
        [1050, 265000],
      ]),
      { name: "Weekly Pass", price: 27500 },
      { name: "Twilight Pass", price: 145000 },
    ],
    description: "Top up diamond MLBB resmi, masuk dalam hitungan detik.",
  },
  ff: {
    key: "ff",
    name: "Free Fire",
    publisher: "Garena",
    type: "game",
    category: "fps",
    image: "/images/games/ff.png",
    gradient: ["#f97316", "#ef4444"],
    fields: ["Player ID"],
    packages: [
      ...mk("Diamond", [
        [70, 9500],
        [140, 19000],
        [355, 47500],
        [720, 95000],
        [1450, 190000],
        [2180, 285000],
      ]),
      { name: "Member Mingguan", price: 29000 },
      { name: "Member Bulanan", price: 89000 },
    ],
    description: "Diamond Free Fire murah untuk bundle dan elite pass.",
  },
  pubg: {
    key: "pubg",
    name: "PUBG Mobile",
    publisher: "Tencent",
    type: "game",
    category: "fps",
    image: "/images/games/pubg.png",
    gradient: ["#eab308", "#a16207"],
    fields: ["Player ID"],
    packages: mk("UC", [
      [60, 15000],
      [325, 75000],
      [660, 150000],
      [1800, 375000],
      [3850, 750000],
      [8100, 1500000],
    ]),
    description: "UC PUBG Mobile untuk Royale Pass dan skin.",
  },
  gi: {
    key: "gi",
    name: "Genshin Impact",
    publisher: "HoYoverse",
    type: "game",
    category: "rpg",
    image: "/images/games/gi.png",
    gradient: ["#22d3ee", "#6366f1"],
    fields: ["UID", "Server"],
    packages: [
      ...mk("Genesis Crystal", [
        [60, 16000],
        [330, 79000],
        [1090, 249000],
        [2240, 479000],
        [3880, 799000],
        [8080, 1599000],
      ]),
      { name: "Welkin Moon", price: 79000 },
    ],
    description: "Genesis Crystal dan Welkin Moon via UID.",
  },
  val: {
    key: "val",
    name: "Valorant",
    publisher: "Riot Games",
    type: "game",
    category: "fps",
    image: "/images/games/val.png",
    gradient: ["#ef4444", "#be123c"],
    fields: ["Riot ID"],
    packages: mk("VP", [
      [125, 15000],
      [420, 50000],
      [700, 80000],
      [1375, 150000],
      [2400, 250000],
      [4000, 400000],
    ]),
    description: "Valorant Points untuk skin dan battle pass.",
  },
  hok: {
    key: "hok",
    name: "Honor of Kings",
    publisher: "Level Infinite",
    type: "game",
    category: "moba",
    image: "/images/games/hok.png",
    gradient: ["#f59e0b", "#b45309"],
    fields: ["Player ID"],
    packages: mk("Token", [
      [80, 15000],
      [240, 45000],
      [400, 75000],
      [800, 150000],
      [1200, 225000],
      [2400, 450000],
    ]),
    description: "Token HOK resmi dan instan.",
  },
  hsr: {
    key: "hsr",
    name: "Honkai Star Rail",
    publisher: "HoYoverse",
    type: "game",
    category: "rpg",
    image: "/images/games/hsr.png",
    gradient: ["#a78bfa", "#1e1b4b"],
    fields: ["UID", "Server"],
    packages: [
      ...mk("Oneiric Shard", [
        [60, 16000],
        [330, 79000],
        [1090, 249000],
        [2240, 479000],
      ]),
      { name: "Express Pass", price: 79000 },
    ],
    description: "Oneiric Shard dan Express Supply Pass.",
  },
  cod: {
    key: "cod",
    name: "Call of Duty Mobile",
    publisher: "Activision",
    type: "game",
    category: "fps",
    image: "/images/games/cod.png",
    gradient: ["#64748b", "#0f172a"],
    fields: ["Player UID"],
    packages: mk("CP", [
      [63, 10000],
      [321, 50000],
      [645, 100000],
      [1373, 200000],
      [3564, 500000],
    ]),
    description: "COD Points untuk battle pass dan crate.",
  },
  aov: {
    key: "aov",
    name: "Arena of Valor",
    publisher: "Garena",
    type: "game",
    category: "moba",
    image: "/images/games/aov.png",
    gradient: ["#06b6d4", "#1e3a8a"],
    fields: ["Player ID"],
    packages: mk("Voucher", [
      [40, 10000],
      [90, 20000],
      [230, 50000],
      [470, 100000],
      [950, 200000],
    ]),
    description: "Voucher AOV untuk hero dan skin.",
  },
  steam: {
    key: "steam",
    name: "Steam Wallet",
    publisher: "Valve",
    type: "game",
    category: "voucher",
    image: "/images/games/steam.png",
    gradient: ["#1e293b", "#0ea5e9"],
    fields: ["Email penerima"],
    packages: [
      { name: "IDR 45.000", price: 48000 },
      { name: "IDR 90.000", price: 95000 },
      { name: "IDR 250.000", price: 262000 },
      { name: "IDR 400.000", price: 418000 },
      { name: "IDR 600.000", price: 625000 },
    ],
    description: "Kode voucher Steam dikirim ke email.",
  },
  gplay: {
    key: "gplay",
    name: "Google Play",
    publisher: "Google",
    type: "game",
    category: "voucher",
    image: "/images/games/gplay.png",
    gradient: ["#22c55e", "#0ea5e9"],
    fields: ["Email penerima"],
    packages: [
      { name: "Rp20.000", price: 21500 },
      { name: "Rp50.000", price: 52500 },
      { name: "Rp100.000", price: 104000 },
      { name: "Rp150.000", price: 155000 },
      { name: "Rp300.000", price: 308000 },
    ],
    description: "Gift card Google Play untuk semua game Android.",
  },
  roblox: {
    key: "roblox",
    name: "Roblox",
    publisher: "Roblox Corp.",
    type: "game",
    category: "voucher",
    image: "/images/games/roblox.png",
    gradient: ["#e11d48", "#111827"],
    fields: ["Username Roblox"],
    packages: mk("Robux", [
      [80, 15000],
      [400, 72000],
      [800, 140000],
      [1700, 285000],
      [4500, 720000],
    ]),
    description: "Robux resmi via gift card.",
  },
  pulsa: {
    key: "pulsa",
    name: "Pulsa",
    publisher: "Semua operator",
    type: "ppob",
    gradient: ["#C6FF00", "#22D3EE"],
    fields: ["Nomor HP"],
    packages: [
      [5000, 5600],
      [10000, 10700],
      [20000, 20900],
      [25000, 26000],
      [50000, 51500],
      [100000, 102500],
    ].map(([v, price]) => ({ name: `Pulsa ${v / 1000}rb`, price })),
    description: "Isi pulsa Telkomsel, Indosat, XL, Axis, Tri, Smartfren, by.U.",
  },
  data: {
    key: "data",
    name: "Paket Data",
    publisher: "Semua operator",
    type: "ppob",
    gradient: ["#22D3EE", "#3b82f6"],
    fields: ["Nomor HP"],
    packages: [
      { name: "Harian 2GB", price: 8000 },
      { name: "Mingguan 7GB", price: 25000 },
      { name: "Bulanan 15GB", price: 55000 },
      { name: "Bulanan 30GB", price: 85000 },
      { name: "Bulanan 50GB", price: 120000 },
      { name: "Unlimited 30hr", price: 150000 },
    ],
    description: "Paket internet semua operator, aktif instan.",
  },
  pln: {
    key: "pln",
    name: "Token PLN",
    publisher: "PLN",
    type: "ppob",
    gradient: ["#facc15", "#f97316"],
    fields: ["Nomor Meter / ID Pelanggan"],
    packages: [20000, 50000, 100000, 200000, 500000, 1000000].map((v) => ({
      name: `Token ${rupiah(v)}`,
      price: v + 2500,
    })),
    description: "Token listrik prabayar, kode muncul < 5 detik.",
  },
  ewallet: {
    key: "ewallet",
    name: "E-Wallet",
    publisher: "DANA · OVO · GoPay · ShopeePay",
    type: "ppob",
    gradient: ["#8B5CF6", "#22D3EE"],
    fields: ["Nomor akun e-wallet"],
    packages: [20000, 50000, 100000, 200000, 300000, 500000].map((v) => ({
      name: `Saldo ${rupiah(v)}`,
      price: v + 1500,
    })),
    description: "Top up saldo e-wallet favorit kamu.",
  },
  bpjs: {
    key: "bpjs",
    name: "BPJS Kesehatan",
    publisher: "BPJS",
    type: "ppob",
    gradient: ["#22c55e", "#15803d"],
    fields: ["Nomor VA Keluarga"],
    packages: [
      { name: "1 bulan (3 jiwa)", price: 105000 },
      { name: "2 bulan (3 jiwa)", price: 210000 },
      { name: "3 bulan (3 jiwa)", price: 315000 },
    ],
    description: "Bayar iuran BPJS Kesehatan tanpa antre.",
  },
  pdam: {
    key: "pdam",
    name: "PDAM",
    publisher: "Seluruh Indonesia",
    type: "ppob",
    gradient: ["#0ea5e9", "#1e3a8a"],
    fields: ["ID Pelanggan PDAM"],
    packages: [{ name: "Tagihan Okt 2026", price: 87500 }],
    description: "Tagihan air PDAM, cek & bayar langsung.",
  },
  internet: {
    key: "internet",
    name: "Internet & TV",
    publisher: "IndiHome · Biznet · MyRepublic",
    type: "ppob",
    gradient: ["#ef4444", "#8B5CF6"],
    fields: ["ID Pelanggan"],
    packages: [{ name: "Tagihan Okt 2026", price: 345000 }],
    description: "Bayar tagihan internet rumah bulanan.",
  },
  tv: {
    key: "tv",
    name: "TV & Streaming",
    publisher: "Vidio · Netflix · K-Vision",
    type: "ppob",
    gradient: ["#f43f5e", "#111827"],
    fields: ["ID Pelanggan / Email"],
    packages: [
      { name: "Paket 1 bulan", price: 50000 },
      { name: "Paket 3 bulan", price: 140000 },
      { name: "Paket 6 bulan", price: 270000 },
    ],
    description: "Voucher TV kabel dan streaming.",
  },
};

export const SERVICE_KEYS = Object.keys(SERVICES);

/** Default layanan kalau `?g=` kosong atau tidak dikenal. */
export const DEFAULT_SERVICE_KEY = "ml";

export const getService = (key?: string | null): Service =>
  (key && SERVICES[key]) || SERVICES[DEFAULT_SERVICE_KEY];

export const GAME_LIST: Service[] = Object.values(SERVICES).filter((s) => s.type === "game");
export const PPOB_LIST: Service[] = Object.values(SERVICES).filter((s) => s.type === "ppob");

export const GAME_HOW = [
  "Masukkan data akun game kamu",
  "Pilih nominal yang diinginkan",
  "Pilih metode pembayaran",
  "Selesaikan pembayaran, item masuk otomatis",
] as const;

export const PPOB_HOW = [
  "Masukkan nomor tujuan / ID pelanggan",
  "Pilih nominal atau cek tagihan",
  "Pilih metode pembayaran",
  "Bayar, transaksi diproses instan",
] as const;

export const howStepsFor = (service: Service) =>
  service.type === "game" ? GAME_HOW : PPOB_HOW;
