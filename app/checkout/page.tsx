import type { Metadata } from "next";
import { Suspense } from "react";
import { decodeOrder } from "@/lib/codec";
import { firstParam } from "@/lib/params";
import type { OrderDraft } from "@/lib/order";
import { getCatalog } from "@/lib/db/server";
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

async function CheckoutDetail({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialOrder = decodeOrder<OrderDraft>(firstParam(params.o));
  const catalog = await getCatalog();

  const catalogMap = Object.fromEntries(
    (catalog.data?.services ?? []).map((service) => [
      service.slug,
      {
        serviceId: service.dbId,
        fields: service.inputs.map((field) => ({
          key: field.key,
          label: field.label,
        })),
        products: service.products.map((product) => ({
          id: product.id,
          name: product.nama,
          price: product.hargaJual,
        })),
      },
    ]),
  );

  const methods = (catalog.data?.methods ?? []).map((method) => ({
    id: method.id,
    name: method.name,
    fee: method.fee,
  }));

  return (
    <CheckoutClient
      initialOrder={initialOrder}
      catalog={catalogMap}
      methods={methods}
      brandSlug={catalog.data?.brand.slug ?? ""}
    />
  );
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutDetail searchParams={searchParams} />
    </Suspense>
  );
}
