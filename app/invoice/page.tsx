import type { Metadata } from "next";
import { Suspense } from "react";
import { decodeOrder } from "@/lib/codec";
import { firstParam } from "@/lib/params";
import type { InvoiceRecord } from "@/lib/order";
import { InvoiceClient } from "./InvoiceClient";

export const metadata: Metadata = {
  title: "Invoice",
  description:
    "Instruksi pembayaran dan status transaksi LDICO Games. Bayar lewat QRIS, e-wallet, virtual account, atau gerai retail.",
  alternates: { canonical: "/invoice" },
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const first = firstParam;

function InvoiceFallback() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="text-sm text-[var(--mut)]">Memuat invoice…</p>
    </div>
  );
}

async function InvoiceDetail({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return (
    <InvoiceClient
      initialInvoice={decodeOrder<InvoiceRecord>(first(params.d))}
      initialInvoiceNumber={first(params.no)}
    />
  );
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<InvoiceFallback />}>
      <InvoiceDetail searchParams={searchParams} />
    </Suspense>
  );
}
