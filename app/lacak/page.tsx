import type { Metadata } from "next";
import { Suspense } from "react";
import { firstParam } from "@/lib/params";
import { LacakClient } from "./LacakClient";

export const metadata: Metadata = {
  title: "Lacak Pesanan",
  description:
    "Cek status pesanan LDICO Games dengan nomor invoice. Lihat posisi transaksi dan kode token listrik yang sudah terkirim.",
  alternates: { canonical: "/lacak" },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function LacakFallback() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="text-sm text-[var(--mut)]">Memuat halaman lacak…</p>
    </div>
  );
}

async function LacakDetail({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <LacakClient initialInvoiceNumber={firstParam(params.no)} />;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<LacakFallback />}>
      <LacakDetail searchParams={searchParams} />
    </Suspense>
  );
}
