import type { Metadata } from "next";
import { Suspense } from "react";
import { decodeOrder } from "@/lib/codec";
import { firstParam } from "@/lib/params";
import type { OrderDraft } from "@/lib/order";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Selesaikan pembayaran top up game atau tagihan PPOB kamu di LDICO Games. Pilih metode bayar, biaya transparan.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function CheckoutFallback() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="text-sm text-[var(--mut)]">Memuat checkout…</p>
    </div>
  );
}

async function CheckoutDetail({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialOrder = decodeOrder<OrderDraft>(firstParam(params.o));
  return <CheckoutClient initialOrder={initialOrder} />;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutDetail searchParams={searchParams} />
    </Suspense>
  );
}
