import type { Metadata } from "next";
import Link from "next/link";
import { InvoiceStatus } from "@/components/site/InvoiceStatus";
import { getOrderByRef, getPaymentByRef } from "@/lib/db/server";
import { firstParam } from "@/lib/params";

export const metadata: Metadata = {
  title: "Invoice",
  description:
    "Instruksi pembayaran dan status transaksi LDICO Games. Bayar lewat QRIS.",
  alternates: { canonical: "/invoice" },
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const ref = firstParam(params.ref)?.trim();

  if (!ref) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 text-center">
        <div className="cut border border-[var(--line)] bg-[var(--panel)] p-8">
          <h1 className="dp text-2xl font-bold">Invoice tidak ditemukan</h1>
          <p className="mt-2 text-sm text-[var(--mut)]">
            Halaman ini dibuka tanpa nomor invoice.
          </p>
          <Link
            href="/layanan"
            className="cut-sm dp mt-6 inline-flex bg-[var(--lime)] px-6 py-3 font-bold text-black"
          >
            Pilih layanan
          </Link>
        </div>
      </main>
    );
  }

  const [payment, order] = await Promise.all([
    getPaymentByRef(ref),
    getOrderByRef(ref),
  ]);

  if (!payment.data) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 text-center">
        <div className="cut border border-[var(--line)] bg-[var(--panel)] p-8">
          <h1 className="dp text-2xl font-bold">Invoice tidak ditemukan</h1>
          <p className="mt-2 text-sm text-[var(--mut)]">{payment.error}</p>
          <Link
            href="/layanan"
            className="cut-sm dp mt-6 inline-flex bg-[var(--lime)] px-6 py-3 font-bold text-black"
          >
            Buat pesanan baru
          </Link>
        </div>
      </main>
    );
  }

  return <InvoiceStatus payment={payment.data} sn={order.data?.[0]?.sn ?? null} />;
}
