import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CATEGORIES, GAMES_SLUG, categoryOfService, categoryPath } from "@/data/categories";
import { SERVICES } from "@/data/services";
import { firstParam } from "@/lib/params";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: "Semua Layanan",
  description:
    `${CATEGORIES.length} kategori layanan LDICO Games: top up game, pulsa, paket data, token & tagihan PLN, PDAM, BPJS Kesehatan, TV & internet, e-wallet, dan multifinance.`,
  alternates: { canonical: "/layanan" },
  openGraph: {
    title: "Semua Layanan · LDICO Games",
    description: "Pilih kategori layanannya — top up game sampai tagihan bulanan.",
    url: "/layanan",
  },
};

/**
 * Tautan lama berbentuk `/layanan?g=ml` diteruskan ke URL kanoniknya
 * (`/layanan/top-up-game/ml`), jadi bookmark dan tautan yang sudah tersebar
 * tidak berakhir di halaman yang salah.
 */
async function LegacyRedirect({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const key = firstParam(params.g);
  if (!key || !SERVICES[key]) return null;

  const service = SERVICES[key];
  const target =
    service.type === "game"
      ? `${categoryPath(GAMES_SLUG)}/${service.key}`
      : categoryPath(categoryOfService(service.key)?.slug ?? "");

  const query = new URLSearchParams();
  const target0 = firstParam(params.t);
  const pack = firstParam(params.i);
  if (target0) query.set("t", target0);
  if (pack) query.set("i", pack);

  redirect(query.size > 0 ? `${target}?${query}` : target);
}

export default function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return (
    <>
      <Suspense fallback={null}>
        <LegacyRedirect searchParams={searchParams} />
      </Suspense>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Layanan", path: "/layanan" },
        ])}
      />

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-5 pt-8 pb-10">
          <Breadcrumb items={[{ name: "Beranda", path: "/" }, { name: "Layanan" }]} />

          <h1 className="dp mt-6 text-4xl font-bold sm:text-5xl">Semua Layanan</h1>
          <p className="mt-2 max-w-2xl text-[var(--mut)]">
            {CATEGORIES.length} kategori layanan, dari top up game sampai tagihan bulanan.
            Pilih kategorinya dulu — produk dan nominalnya muncul di halaman berikutnya.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <CategoryGrid />
      </div>
    </>
  );
}
