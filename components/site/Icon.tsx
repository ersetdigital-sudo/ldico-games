import type { SVGProps } from "react";

export type IconName =
  | "bolt"
  | "shield"
  | "clock"
  | "card"
  | "lock"
  | "refund"
  | "gem"
  | "mobile"
  | "wifi"
  | "banknote"
  | "heart"
  | "droplet"
  | "globe"
  | "tv"
  | "qr"
  | "store"
  | "check"
  | "copy"
  | "gamepad"
  | "crosshair"
  | "sparkle"
  | "chevron-down"
  | "star";

/**
 * Ikon garis bergaya geometris (sudut tajam) untuk label kecil.
 *
 * Satu famili ikon untuk seluruh situs — semua glyph memakai viewBox 24,
 * strokeWidth 1.75, sudut miter, dan ujung round yang sama. Jangan tambah
 * ikon dari library lain; kalau butuh glyph baru, gambar di sini.
 *
 * - Warna mengikuti `currentColor`, jadi tinggal diatur lewat class teks.
 * - `aria-hidden` karena teks di sebelahnya sudah menjelaskan maksudnya —
 *   tanpa itu screen reader membacakan hal yang sama dua kali.
 * - Sengaja tidak pakai emoji: tampilannya beda-beda tergantung OS/browser
 *   dan warnanya tidak bisa ikut brand, sedangkan SVG konsisten.
 */
const OUTLINE: Record<IconName, string> = {
  // Petir — "proses instan" / kecepatan
  bolt: "M13 2 3.5 14H10l-.5 8 11-12H14Z",
  // Perisai — "aman & legal"
  shield: "M12 2.5 19.5 5.5v7c0 4.5-3.4 7.6-7.5 9-4.1-1.4-7.5-4.5-7.5-9v-7Z",
  // Jam — "24/7"
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  // Kartu — "metode pembayaran"
  card: "M3 6.5h18v11H3Z",
  // Gembok — "transaksi aman"
  lock: "M4.5 10.5h15v10h-15Z",
  // Panah balik — "dana kembali / refund"
  refund: "M4 9h10.5a5.5 5.5 0 0 1 0 11H11",
  // Permata — nominal diamond
  gem: "M6 3h12l4 6-10 12L2 9Z",
  // Ponsel — pulsa
  mobile: "M7 2.5h10v19H7Z",
  // Sinyal — paket data
  wifi: "M2.5 7.5a14 14 0 0 1 19 0M6 11.5a9 9 0 0 1 12 0M9.5 15.5a4 4 0 0 1 5 0",
  // Uang kertas — e-wallet / saldo
  banknote: "M3.5 6.5h17v11h-17Z",
  // Hati — BPJS Kesehatan
  heart: "M12 20.5 3.5 12A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 20.5 12Z",
  // Tetes air — PDAM
  droplet: "M12 3.5c3 3.6 6.5 7.4 6.5 11a6.5 6.5 0 0 1-13 0c0-3.6 3.5-7.4 6.5-11Z",
  // Bola dunia — internet
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  // Televisi — TV & streaming
  tv: "M3.5 8h17v11.5h-17Z",
  // Kode QR — QRIS
  qr: "M3.5 3.5h6v6h-6ZM14.5 3.5h6v6h-6ZM3.5 14.5h6v6h-6Z",
  // Toko — gerai retail
  store: "M3.5 9.5h17v10h-17Z",
  // Centang — langkah selesai / aksi berhasil
  check: "M4.5 12.5l5 5 10-11",
  // Lembar depan ikon salin; lembar belakangnya ada di DETAIL.
  copy: "M8.5 8.5h12v12h-12Z",
  // Stik game — katalog Top Up Game
  gamepad:
    "M8.5 8h7a5.5 5.5 0 0 1 5.4 6.6l-.3 1.6a2.6 2.6 0 0 1-4.7 1.1L14.5 16h-5l-1.4 1.3a2.6 2.6 0 0 1-4.7-1.1l-.3-1.6A5.5 5.5 0 0 1 8.5 8Z",
  // Bidik — game battle royale / FPS
  crosshair: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  // Kilau — game RPG
  sparkle: "M12 3.5 14 9.5l6 2.5-6 2.5-2 6-2-6L4 12l6-2.5Z",
  // Panah bawah — penanda bagian yang bisa dibuka
  "chevron-down": "m6.5 9.5 5.5 5.5 5.5-5.5",
  // Bintang — rating / ulasan pelanggan
  star: "M12 3.5 14.3 8.8 20.1 9.4 15.7 13.2 17 18.9 12 15.9 7 18.9 8.3 13.2 3.9 9.4 9.7 8.8Z",
};

/** Garis tambahan untuk ikon yang perlu detail di dalamnya. */
const DETAIL: Partial<Record<IconName, string>> = {
  shield: "m9 12.4 2.2 2.2 4.4-4.5",
  clock: "M12 7.5V12l3.2 2",
  // Strip pada kartu.
  card: "M3 10.5h18",
  // Gagang gembok + lubang kunci.
  lock: "M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5M12 15.5h.01",
  // Kepala panah.
  refund: "M9 14 4 9l5-5",
  // Garis ikat permata.
  gem: "M2 9h20",
  // Speaker atas + tombol bawah.
  mobile: "M10.5 5.5h3M11 18.5h2",
  // Titik pusat sinyal.
  wifi: "M12 19h.01",
  // Lingkaran potret di tengah uang kertas.
  banknote: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  // Khatulistiwa + meridian; meridian sengaja tidak menyentuh tepi lingkaran
  // supaya tidak terbaca sebagai garis silang.
  globe: "M3 12h18M12 4.5a4.5 7.5 0 0 1 0 15 4.5 7.5 0 0 0 0-15",
  // Antena.
  tv: "M8.5 3.5 12 8l3.5-4.5",
  // Dua modul di sudut kanan bawah.
  qr: "M14.5 14.5h2.5v2.5h-2.5ZM18 18h2.5v2.5H18Z",
  // Atap + pintu toko.
  store: "M3.5 9.5 6 4.5h12l2.5 5M9.5 19.5v-5h5v5",
  // Lembar belakang yang tergeser ke kiri atas.
  copy: "M15.5 8.5v-5h-12v12h5",
  // Tombol arah (kiri-atas) + dua tombol bulat.
  gamepad: "M8.5 10.5v3M7 12h3M15.5 11.5h.01M17.5 13.5h.01",
  // Empat garis bidik dari tepi lingkaran.
  crosshair: "M12 3v3M12 18v3M3 12h3M18 12h3M12 12h.01",
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
}

export function Icon({ name, className = "h-4 w-4", ...rest }: IconProps) {
  const detail = DETAIL[name];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinejoin="miter"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={OUTLINE[name]} />
      {detail && <path d={detail} />}
    </svg>
  );
}
