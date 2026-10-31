"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkOrder } from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import type { OrderLookup } from "@/lib/db/types";
import { readRefs } from "@/lib/refs";
import { Money } from "@/components/site/Money";

const STATUS_LABEL: Record<OrderLookup["status"], string> = {
  menunggu_cek: "Lagi dicek admin",
  menunggu_bayar: "Menunggu Pembayaran",
  sudah_bayar: "Pembayaran dicek admin",
  sukses: "Sukses",
  dibatalkan: "Dibatalkan",
};

const STATUS_CLASS: Record<OrderLookup["status"], string> = {
  menunggu_cek: "bg-yellow-400 text-black",
  menunggu_bayar: "bg-yellow-400 text-black",
  sudah_bayar: "bg-[var(--cy)] text-black",
  sukses: "bg-[var(--lime)] text-black",
  dibatalkan: "bg-red-500 text-white",
};

export function LacakClient({
  initialInvoiceNumber,
  brandSlug,
}: {
  initialInvoiceNumber: string | null;
  brandSlug: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialInvoiceNumber ?? "");
  const [result, setResult] = useState<{ order?: OrderLookup; error?: string } | null>(null);
  const [history, setHistory] = useState<OrderLookup[]>([]);
  const [busy, setBusy] = useState(false);

  async function lookup(value: string) {
    const q = value.trim();
    if (!q) {
      setResult({ error: "Masukkan nomor invoice atau nomor tujuan." });
      return;
    }
    if (!brandSlug) {
      setResult({ error: "Pencarian belum tersedia. Coba lagi sebentar." });
      return;
    }
    setQuery(q);
    router.replace(`/lacak?no=${encodeURIComponent(q)}`, { scroll: false });
    setBusy(true);
    setResult(null);
    try {
      const isRef = /[A-Z]/i.test(q);
      const orders = await checkOrder({
        brandSlug,
        ref: isRef ? q.replace(/\s/g, "").toUpperCase() : null,
        nomorTujuan: isRef ? null : q.replace(/\D/g, ""),
      });
      if (!orders.length) {
        setResult({ error: "Invoice tidak ditemukan. Cek kembali nomor atau ID-nya." });
      } else {
        setResult({ order: orders[0] });
      }
    } catch (error) {
      setResult({ error: toPublicError(error).message });
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    let active = true;
    void (async () => {
      const refs = readRefs().slice(0, 10);
      const loaded = await Promise.all(
        refs.map(async (ref) => {
          try {
            const orders = await checkOrder({ brandSlug, ref });
            return orders[0] ?? null;
          } catch {
            return null;
          }
        }),
      );
      if (active) setHistory(loaded.filter((item): item is OrderLookup => item !== null));
    })();
    if (initialInvoiceNumber) void lookup(initialInvoiceNumber);
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandSlug]);

  const order = result?.order;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="dp text-sm text-[var(--lime)]">Lacak Pesanan</p>
      <h1 className="dp mt-2 text-4xl font-bold sm:text-5xl">Pesananmu sampai mana?</h1>
      <p className="mt-3 text-[var(--mut)]">
        Masukkan nomor invoice dari halaman pembayaran.
      </p>

      <form
        className="mt-8 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void lookup(query);
        }}
      >
        <label htmlFor="invoice-number" className="sr-only">
          Nomor invoice
        </label>
        <input
          id="invoice-number"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="LDC-261031-XXXXXX"
          className="inp cut-sm min-w-0 text-lg uppercase"
        />
        <button
          type="submit"
          disabled={busy}
          className="cut-sm dp shrink-0 bg-[var(--lime)] px-6 font-bold text-black transition hover:brightness-110 disabled:opacity-60 sm:px-8"
        >
          {busy ? "Mencari…" : "Lacak"}
        </button>
      </form>

      <div className="mt-10">
        {result?.error ? (
          <div className="cut border border-red-500/50 bg-[var(--panel)] p-8 text-center">
            <p className="dp text-xl font-bold">Invoice tidak ditemukan</p>
            <p className="mt-2 text-sm text-[var(--mut)]">{result.error}</p>
          </div>
        ) : null}

        {order ? (
          <article className="cut overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] p-6">
              <div className="min-w-0">
                <p className="dp text-xl font-bold">{order.ref}</p>
                <p className="text-sm text-[var(--mut)]">
                  {order.layanan}
                  {order.produk ? ` · ${order.produk}` : ""}
                </p>
              </div>
              <span className={`dp px-3 py-1.5 text-xs ${STATUS_CLASS[order.status]}`}>
                {STATUS_LABEL[order.status]}
              </span>
            </header>
            <div className="grid gap-4 p-6 text-sm md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--mut)]">Tujuan</span>
                  <b>{order.nomor_tujuan}</b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--mut)]">Total</span>
                  <b>{order.total !== null ? <Money value={order.total} /> : "Belum ditetapkan"}</b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[var(--mut)]">Dibuat</span>
                  <b>
                    {new Date(order.created_at).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </b>
                </div>
                {order.sn ? (
                  <div className="flex justify-between gap-3">
                    <span className="text-[var(--mut)]">
                      {/PLN/i.test(order.layanan) ? "Token" : "SN"}
                    </span>
                    <b className="font-mono text-[var(--lime)]">{order.sn}</b>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col justify-end gap-2">
                {order.status === "menunggu_cek" || order.status === "menunggu_bayar" ? (
                  <Link
                    href={`/invoice?ref=${encodeURIComponent(order.ref)}`}
                    className="cut-sm dp bg-[var(--lime)] py-3 text-center font-bold text-black"
                  >
                    Buka Invoice
                  </Link>
                ) : null}
                <Link
                  href="/layanan"
                  className="cut-sm dp border border-[var(--line)] py-3 text-center font-bold transition hover:border-[var(--lime)]"
                >
                  Pesan Lagi
                </Link>
              </div>
            </div>
          </article>
        ) : null}
      </div>

      <section className="mt-14">
        <h2 className="dp mb-4 text-sm">Riwayat di perangkat ini</h2>
        {history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.ref}>
                <button
                  type="button"
                  onClick={() => void lookup(item.ref)}
                  className="cut-sm flex w-full justify-between gap-3 border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-left text-sm transition hover:border-[var(--lime)]"
                >
                  <span className="min-w-0">
                    <b className="dp">{item.ref}</b>{" "}
                    <span className="text-[var(--mut)]">· {item.layanan}</span>
                  </span>
                  <span className="shrink-0">
                    {item.total !== null ? <Money value={item.total} /> : "-"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--mut)]">Belum ada transaksi di perangkat ini.</p>
        )}
      </section>
    </div>
  );
}
