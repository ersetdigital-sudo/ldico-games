"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DEFAULT_SERVICE_KEY, SERVICES } from "@/data/services";
import { DEMO_INVOICE_NUMBERS, findInvoice } from "@/lib/invoice-lookup";
import { formatDateTime } from "@/lib/format";
import { ORDER_STATUS_CLASS, ORDER_STATUS_LABEL, ORDER_STEPS, type InvoiceRecord } from "@/lib/order";
import { historyStorage } from "@/lib/storage";
import { ServiceThumb } from "@/components/site/ServiceThumb";
import { Money } from "@/components/site/Money";

type LookupResult = { status: "idle" } | { status: "notfound" } | { status: "found"; invoice: InvoiceRecord };

export function LacakClient({ initialInvoiceNumber }: { initialInvoiceNumber: string | null }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialInvoiceNumber ?? "");
  const [result, setResult] = useState<LookupResult>({ status: "idle" });
  const [history, setHistory] = useState<InvoiceRecord[]>([]);

  const lookup = useCallback(
    (rawNumber: string) => {
      const invoiceNumber = rawNumber.trim().toUpperCase();
      if (!invoiceNumber) return;
      setQuery(invoiceNumber);
      router.replace(`/lacak?no=${encodeURIComponent(invoiceNumber)}`, { scroll: false });
      const invoice = findInvoice(invoiceNumber);
      setResult(invoice ? { status: "found", invoice } : { status: "notfound" });
    },
    [router],
  );

  useEffect(() => {
    setHistory(historyStorage.all());
  }, []);

  useEffect(() => {
    if (initialInvoiceNumber) lookup(initialInvoiceNumber);
    // Hanya dijalankan sekali saat halaman dibuka dengan ?no=
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          lookup(query);
        }}
      >
        <label htmlFor="invoice-number" className="sr-only">
          Nomor invoice
        </label>
        <input
          id="invoice-number"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="LDC-XXXXXXXX"
          className="inp cut-sm min-w-0 text-lg uppercase"
        />
        <button
          type="submit"
          className="cut-sm dp shrink-0 bg-[var(--lime)] px-6 font-bold text-black transition hover:brightness-110 sm:px-8"
        >
          Lacak
        </button>
      </form>

      <p className="mt-3 text-xs text-[var(--mut)]">
        Coba contoh:{" "}
        {DEMO_INVOICE_NUMBERS.map((number, index) => (
          <span key={number}>
            {index > 0 && " · "}
            <button
              type="button"
              onClick={() => lookup(number)}
              className="text-[var(--lime)] underline underline-offset-4"
            >
              {number}
            </button>
          </span>
        ))}
      </p>

      <div className="mt-10">
        {result.status === "notfound" && (
          <div className="cut border border-red-500/50 bg-[var(--panel)] p-8 text-center">
            <p className="dp text-xl font-bold">Invoice tidak ditemukan</p>
            <p className="mt-2 text-sm text-[var(--mut)]">
              Cek lagi nomornya, atau hubungi CS 24/7 kami.
            </p>
          </div>
        )}

        {result.status === "found" && <InvoiceResult invoice={result.invoice} onRefresh={lookup} />}
      </div>

      <section className="mt-14">
        <h2 className="dp mb-4 text-sm">Riwayat di perangkat ini</h2>
        {history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.inv}>
                <button
                  type="button"
                  onClick={() => lookup(item.inv)}
                  className="cut-sm flex w-full justify-between gap-3 border border-[var(--line)] bg-[var(--panel)] px-4 py-3 text-left text-sm transition hover:border-[var(--lime)]"
                >
                  <span className="min-w-0">
                    <b className="dp">{item.inv}</b>{" "}
                    <span className="text-[var(--mut)]">
                      · {SERVICES[item.k]?.name ?? DEFAULT_SERVICE_KEY}
                    </span>
                  </span>
                  <span className="shrink-0">
                    <Money value={item.total} />
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

function InvoiceResult({
  invoice,
  onRefresh,
}: {
  invoice: InvoiceRecord;
  onRefresh: (invoiceNumber: string) => void;
}) {
  const service = SERVICES[invoice.k] ?? SERVICES[DEFAULT_SERVICE_KEY];
  const pack = service.packages[invoice.i] ?? service.packages[0];
  const step = invoice.st ?? 0;

  return (
    <article className="cut overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
      <header className="scan flex flex-col gap-5 border-b border-[var(--line)] p-6 sm:flex-row sm:items-center">
        <ServiceThumb service={service} size={64} className="h-16 w-16" />
        <div className="min-w-0 flex-1">
          <p className="dp text-xl font-bold">{invoice.inv}</p>
          <p className="text-sm text-[var(--mut)]">
            {service.name} · {pack.name}
          </p>
        </div>
        <p className={`dp h-fit px-3 py-1.5 text-xs ${ORDER_STATUS_CLASS[step]}`}>
          {ORDER_STATUS_LABEL[step]}
        </p>
      </header>

      <div className="p-4 sm:p-6">
        <ol className="flex">
          {ORDER_STEPS.map((label, index) => {
            const done = index <= step;
            return (
              <li key={label} className="flex-1">
                <div className="flex items-center">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center text-sm dp ${
                      done ? "bg-[var(--lime)] text-black" : "border border-[var(--line)] text-[var(--mut)]"
                    }`}
                  >
                    {done ? "✓" : index + 1}
                  </span>
                  {index < ORDER_STEPS.length - 1 && (
                    <span
                      className={`h-0.5 flex-1 ${index < step ? "bg-[var(--lime)]" : "bg-[var(--line)]"}`}
                    />
                  )}
                </div>
                <p
                  className={`mt-2 pr-1 text-[10px] leading-tight sm:text-xs ${
                    done ? "" : "text-[var(--mut)]"
                  }`}
                >
                  {label}
                </p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid border-t border-[var(--line)] md:grid-cols-2">
        <dl className="space-y-2 border-[var(--line)] p-6 text-sm md:border-r">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--mut)]">Tanggal</dt>
            <dd className="text-right">{formatDateTime(invoice.ts)}</dd>
          </div>
          {invoice.f.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-[var(--mut)]">{label}</dt>
              <dd className="text-right">{value}</dd>
            </div>
          ))}
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--mut)]">Metode</dt>
            <dd className="text-right">{invoice.m}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--mut)]">Total</dt>
            <dd className="dp text-right font-bold">
              <Money value={invoice.total} />
            </dd>
          </div>
        </dl>

        <div className="p-6 text-sm">
          {step === 3 ? (
            invoice.token ? (
              <>
                <p className="text-xs text-[var(--mut)]">Token listrik</p>
                <p className="dp mt-1 text-xl font-bold text-[var(--lime)]">{invoice.token}</p>
              </>
            ) : (
              <>
                <p className="dp text-lg text-[var(--lime)]">Item sudah terkirim ✓</p>
                <p className="mt-1 text-[var(--mut)]">Cek akun / nomor tujuan kamu.</p>
              </>
            )
          ) : step === 0 ? (
            <>
              <p className="text-[var(--mut)]">Pesanan belum dibayar.</p>
              <Link
                href={`/invoice?no=${invoice.inv}`}
                className="cut-sm dp mt-4 inline-block bg-[var(--lime)] px-5 py-3 font-bold text-black"
              >
                Lanjut Bayar
              </Link>
            </>
          ) : (
            <>
              <p className="text-[var(--mut)]">
                Pesanan sedang diproses, biasanya selesai &lt; 1 menit.
              </p>
              <button
                type="button"
                onClick={() => onRefresh(invoice.inv)}
                className="cut-sm dp mt-4 border border-[var(--line)] px-5 py-3 transition hover:border-[var(--lime)]"
              >
                Refresh
              </button>
            </>
          )}

          <Link
            href={`/invoice?no=${invoice.inv}`}
            className="mt-5 block text-xs text-[var(--mut)] underline underline-offset-4 transition hover:text-[var(--lime)]"
          >
            Lihat invoice lengkap
          </Link>
        </div>
      </div>
    </article>
  );
}
