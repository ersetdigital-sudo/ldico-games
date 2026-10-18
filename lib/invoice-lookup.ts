import type { InvoiceRecord } from "@/lib/order";
import { historyStorage } from "@/lib/storage";

/**
 * Data contoh supaya halaman lacak/invoice bisa dicoba tanpa transaksi nyata.
 * Timestamp-nya tetap (bukan Date.now()) agar aman saat prerender.
 */
const DEMO_NOW = Date.UTC(2026, 9, 18, 2, 0, 0);

export const DEMO_INVOICES: InvoiceRecord[] = [
  {
    inv: "LDC-28819",
    k: "ml",
    i: 1,
    f: [
      ["User ID", "12345678"],
      ["Zone ID", "1234"],
    ],
    m: "QRIS",
    fee: 0,
    disc: 0,
    total: 44900,
    ts: DEMO_NOW - 3_600_000,
    st: 3,
  },
  {
    inv: "LDC-28818",
    k: "pln",
    i: 1,
    f: [["Nomor Meter / ID Pelanggan", "5300xxxxxx"]],
    m: "DANA",
    fee: 788,
    disc: 5250,
    total: 48038,
    ts: DEMO_NOW - 7_200_000,
    st: 3,
    token: "4821 0093 1177 5520 3361",
  },
  {
    inv: "LDC-28817",
    k: "pubg",
    i: 1,
    f: [["Player ID", "51xxxxxx"]],
    m: "BCA VA",
    fee: 4000,
    disc: 0,
    total: 79000,
    ts: DEMO_NOW - 600_000,
    st: 2,
  },
  {
    inv: "LDC-28816",
    k: "ff",
    i: 2,
    f: [["Player ID", "98xxxxxx"]],
    m: "Alfamart",
    fee: 2500,
    disc: 0,
    total: 50000,
    ts: DEMO_NOW - 300_000,
    st: 0,
  },
];

export const DEMO_INVOICE_NUMBERS = DEMO_INVOICES.map((item) => item.inv);

/** Record default kalau invoice tidak ditemukan sama sekali. */
export const createFallbackInvoice = (invoiceNumber?: string): InvoiceRecord => ({
  k: "ml",
  i: 1,
  f: [
    ["User ID", "12345678"],
    ["Zone ID", "1234"],
  ],
  inv: invoiceNumber ?? "LDC-28819001",
  m: "QRIS",
  fee: 0,
  disc: 0,
  total: 44900,
  ts: DEMO_NOW,
  st: 0,
});

/** Cari invoice di riwayat perangkat, lalu fallback ke data contoh. */
export const findInvoice = (invoiceNumber: string): InvoiceRecord | null => {
  const key = invoiceNumber.trim().toUpperCase();
  return historyStorage.find(key) ?? DEMO_INVOICES.find((item) => item.inv === key) ?? null;
};
