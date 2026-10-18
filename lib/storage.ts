import type { InvoiceRecord, OrderDraft } from "@/lib/order";

/**
 * Helper akses storage yang aman: tidak pernah throw (mode private / quota habis)
 * dan selalu no-op saat dipanggil di server.
 */
const canUse = (kind: "local" | "session") => {
  if (typeof window === "undefined") return false;
  try {
    const probe = kind === "local" ? window.localStorage : window.sessionStorage;
    probe.setItem("__probe__", "1");
    probe.removeItem("__probe__");
    return true;
  } catch {
    return false;
  }
};

const read = <T>(kind: "local" | "session", key: string): T | null => {
  if (!canUse(kind)) return null;
  try {
    const raw = (kind === "local" ? window.localStorage : window.sessionStorage).getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const write = (kind: "local" | "session", key: string, value: unknown) => {
  if (!canUse(kind)) return;
  try {
    (kind === "local" ? window.localStorage : window.sessionStorage).setItem(
      key,
      JSON.stringify(value),
    );
  } catch {
    /* storage penuh atau diblokir — abaikan */
  }
};

const ORDER_KEY = "ldico_order";
const INVOICE_KEY = "ldico_inv";
const HISTORY_KEY = "ldico_hist";

export const draftStorage = {
  get: () => read<OrderDraft>("session", ORDER_KEY),
  set: (draft: OrderDraft) => write("session", ORDER_KEY, draft),
};

export const invoiceStorage = {
  get: () => read<InvoiceRecord>("session", INVOICE_KEY),
  set: (invoice: InvoiceRecord) => write("session", INVOICE_KEY, invoice),
};

const CHECK_KEY = "ldico_cek";

/**
 * Waktu pengecekan pertama per nomor invoice.
 *
 * Dipakai sebagai titik awal jeda settlement QRIS, supaya hitungannya tidak
 * mulai dari nol lagi tiap halaman di-reload — tanpa ini tombol cek akan
 * selamanya bilang "belum masuk".
 */
export const checkStorage = {
  get: (invoiceNumber: string): number | null => {
    const map = read<Record<string, number>>("local", CHECK_KEY);
    return map?.[invoiceNumber] ?? null;
  },
  mark(invoiceNumber: string, at: number) {
    const map = read<Record<string, number>>("local", CHECK_KEY) ?? {};
    map[invoiceNumber] = at;
    // Simpan 20 invoice terbaru saja biar tidak tumbuh tanpa batas.
    const newest = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    write("local", CHECK_KEY, Object.fromEntries(newest));
  },
};

/** Riwayat transaksi perangkat (maksimal 30 entri terbaru). */
const readHistory = (): InvoiceRecord[] => read<InvoiceRecord[]>("local", HISTORY_KEY) ?? [];

export const historyStorage = {
  all: readHistory,
  save(record: InvoiceRecord) {
    const rest = readHistory().filter((item) => item.inv !== record.inv);
    write("local", HISTORY_KEY, [record, ...rest].slice(0, 30));
  },
  find: (invoiceNumber: string) =>
    readHistory().find((item) => item.inv === invoiceNumber.trim().toUpperCase()) ?? null,
};
