import type { Metadata } from "next";
import { Suspense } from "react";
import { PAYMENT_PROMISES } from "@/data/faq";
import { firstParam } from "@/lib/params";
import { Icon } from "@/components/site/Icon";
import { PageIntro } from "@/components/site/PageIntro";
import { PembayaranClient } from "./PembayaranClient";

export const metadata: Metadata = {
  title: "Metode Pembayaran",
  description:
    "10 metode pembayaran LDICO Games: QRIS, DANA, OVO, GoPay, ShopeePay, virtual account BCA/BRI/Mandiri, Alfamart, dan Indomaret. Lihat biaya dan cara bayarnya.",
  alternates: { canonical: "/pembayaran" },
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function PembayaranFallback() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <p className="text-sm text-[var(--mut)]">Memuat metode pembayaran…</p>
    </div>
  );
}

async function PembayaranDetail({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <PembayaranClient initialMethod={firstParam(params.m)} />;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <>
      <PageIntro
        eyebrow="Metode Pembayaran"
        title="Bayar pakai apa aja, bisa."
        description="10 metode pembayaran, terkonfirmasi otomatis. Pilih metode untuk lihat biaya dan panduan bayarnya."
      />

      <Suspense fallback={<PembayaranFallback />}>
        <PembayaranDetail searchParams={searchParams} />
      </Suspense>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 pb-20 md:grid-cols-3">
        {PAYMENT_PROMISES.map((promise) => (
          <article key={promise.title} className="cut-sm border border-[var(--line)] p-6">
            <h2 className="dp flex items-center gap-2 text-[var(--lime)]">
              <Icon name={promise.icon} className="h-5 w-5 shrink-0" />
              {promise.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--mut)]">{promise.body}</p>
          </article>
        ))}
      </section>
    </>
  );
}
