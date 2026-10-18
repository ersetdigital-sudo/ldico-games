import type { IconName } from "@/components/site/Icon";

export interface FaqItem {
  q: string;
  a: string;
}

export interface PaymentPromise {
  title: string;
  icon: IconName;
  body: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    q: "Perlu daftar akun dulu?",
    a: "Nggak perlu. Cukup masukkan ID game atau nomor tujuan, lalu bayar.",
  },
  {
    q: "Berapa lama prosesnya?",
    a: "Rata-rata 3 detik setelah pembayaran terkonfirmasi.",
  },
  {
    q: "Kalau transaksi gagal gimana?",
    a: "Dana dikembalikan otomatis, atau hubungi CS kami 24/7.",
  },
  {
    q: "Bisa bayar tagihan BPJS & PDAM?",
    a: "Bisa. Pilih layanannya di daftar layanan, lalu masukkan nomor pelanggan.",
  },
];

export const SERVICE_FAQ: FaqItem[] = [
  {
    q: "Berapa lama prosesnya?",
    a: "Rata-rata 3 detik setelah pembayaran terkonfirmasi.",
  },
  {
    q: "Kalau salah input gimana?",
    a: "Segera hubungi CS dengan nomor invoice. Transaksi yang sudah sukses tidak bisa dibatalkan.",
  },
  {
    q: "Apakah aman?",
    a: "Ya, semua produk dari distributor resmi.",
  },
];

export const PAYMENT_PROMISES: PaymentPromise[] = [
  {
    title: "Aman",
    icon: "lock",
    body: "Semua transaksi diproses lewat payment gateway berlisensi Bank Indonesia.",
  },
  {
    title: "Otomatis",
    icon: "bolt",
    body: "Tidak perlu kirim bukti transfer, sistem mendeteksi pembayaran sendiri.",
  },
  {
    title: "Refund",
    icon: "refund",
    body: "Transaksi gagal? Dana kembali penuh dalam 1x24 jam.",
  },
];

export const SERVICE_BENEFITS = [
  { title: "Otomatis 24/7", body: "Sistem jalan terus, jam 3 pagi pun tetap masuk." },
  { title: "Harga termurah", body: "Harga langsung dari distributor resmi." },
  { title: "Aman & legal", body: "100% legal, tanpa risiko akun kena banned." },
  { title: "Refund kilat", body: "Gagal proses? Saldo balik otomatis." },
];

export const PAYMENT_METHOD_LOGOS = [
  "QRIS",
  "DANA",
  "OVO",
  "GoPay",
  "ShopeePay",
  "BCA VA",
  "BRI VA",
  "Mandiri VA",
  "Alfamart",
  "Indomaret",
];

export const PPOB_OPERATORS = [
  "Telkomsel",
  "Indosat",
  "XL",
  "Axis",
  "Tri",
  "Smartfren",
  "by.U",
  "PLN",
  "BPJS",
  "PDAM",
  "IndiHome",
];
