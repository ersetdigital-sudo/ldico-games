import type { Metadata } from "next";
import { GAMES_SLUG, getCategory } from "@/data/categories";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { CategoryNav } from "@/components/site/CategoryNav";
import { JsonLd } from "@/components/site/JsonLd";
import { GameBrowser } from "@/components/layanan/GameBrowser";
import { breadcrumbSchema } from "@/lib/schema";

const CATEGORY = getCategory(GAMES_SLUG)!;

export const metadata: Metadata = {
  title: CATEGORY.name,
  description:
    "Top up game favorit dengan proses mudah dan cepat. Diamond, UC, VP, sampai voucher game, semuanya diproses otomatis 24/7.",
  alternates: { canonical: `/layanan/${GAMES_SLUG}` },
  openGraph: {
    title: `${CATEGORY.name} · LDICO Games`,
    description: "Top up game favorit dengan proses mudah dan cepat.",
    url: `/layanan/${GAMES_SLUG}`,
  },
};

/** Katalog game: satu kategori utama, isinya seluruh game yang tersedia. */
export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Layanan", path: "/layanan" },
          { name: CATEGORY.name, path: `/layanan/${GAMES_SLUG}` },
        ])}
      />

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-5 pt-8 pb-10">
          <Breadcrumb
            items={[
              { name: "Beranda", path: "/" },
              { name: "Layanan", path: "/layanan" },
              { name: CATEGORY.name },
            ]}
          />

          <h1 className="dp mt-6 text-4xl font-bold sm:text-5xl">{CATEGORY.name}</h1>
          <p className="mt-2 max-w-2xl text-[var(--mut)]">
            Top up game favorit dengan proses mudah dan cepat.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <CategoryNav activeSlug={CATEGORY.slug} />
        <div className="mt-8">
          <GameBrowser />
        </div>
      </div>
    </>
  );
}
