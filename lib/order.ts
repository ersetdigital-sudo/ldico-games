export interface OrderDraft {
  /** service key, contoh "ml" */
  k: string;
  /** index paket yang dipilih di `SERVICES[k].packages` */
  i: number;
  /** data tujuan pembeli: [label, value] */
  f: [string, string][];
  /** metode pembayaran yang sudah dipilih di beranda (opsional) */
  m?: string;
}

export interface InvoiceRecord extends OrderDraft {
  inv: string;
  /** nama metode pembayaran */
  m: string;
  fee: number;
  disc: number;
  total: number;
  ts: number;
  /** 0 = menunggu pembayaran, 1 = dibayar, 2 = diproses, 3 = sukses */
  st: number;
  /** kode token listrik, hanya untuk layanan PLN */
  token?: string;
}

export const ORDER_STEPS = [
  "Pesanan dibuat",
  "Pembayaran diterima",
  "Pesanan diproses",
  "Selesai, item terkirim",
] as const;

/** Keterangan singkat tiap langkah; urutannya sejajar dengan ORDER_STEPS. */
export const ORDER_STEP_HINTS = [
  "Invoice dibuat dan menunggu pembayaran.",
  "Dana masuk, pesanan antre diproses.",
  "Item dikirim ke akun atau nomor tujuan.",
  "Transaksi selesai. Simpan invoice ini.",
] as const;

export const ORDER_STATUS_LABEL = [
  "Menunggu Pembayaran",
  "Dibayar",
  "Diproses",
  "Sukses",
] as const;

/** Class Tailwind untuk badge status, dipakai di halaman lacak. */
export const ORDER_STATUS_CLASS = [
  "bg-yellow-400 text-black",
  "bg-[var(--cy)] text-black",
  "bg-[var(--vio)] text-white",
  "bg-[var(--lime)] text-black",
] as const;

export const CHECKOUT_FALLBACK: OrderDraft = {
  k: "ml",
  i: 1,
  f: [
    ["User ID", "12345678"],
    ["Zone ID", "1234"],
  ],
};

/** Nomor invoice baru: LDC- + 8 digit terakhir timestamp. */
export const createInvoiceNumber = (now: number) => `LDC-${String(now).slice(-8)}`;

/** Total bayar = harga item + biaya layanan - diskon. */
export const invoiceTotal = (price: number, fee: number, disc: number) =>
  price + fee - disc;
