import type { InvoiceRecord, OrderDraft } from "@/lib/order";

/**
 * Encode/decode payload order ke query string (base64url, UTF-8 safe).
 * Dipakai supaya halaman checkout & invoice tetap bisa di-refresh / dibagikan.
 */
const toBase64Url = (value: string) =>
  btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const fromBase64Url = (value: string) =>
  decodeURIComponent(escape(atob(value.replace(/-/g, "+").replace(/_/g, "/"))));

export const encodeOrder = (order: OrderDraft | InvoiceRecord) => toBase64Url(JSON.stringify(order));

export const decodeOrder = <T = OrderDraft>(value: string | null | undefined): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(fromBase64Url(value)) as T;
  } catch {
    return null;
  }
};
