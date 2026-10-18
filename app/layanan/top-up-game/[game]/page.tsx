import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GAMES_SLUG, categoryPath, getCategory } from "@/data/categories";
import { GAME_LIST, SERVICES } from "@/data/services";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { CategoryNav } from "@/components/site/CategoryNav";
import { IconTile } from "@/components/site/IconTile";
import { JsonLd } from "@/components/site/JsonLd";
import { OrderArea } from "@/components/layanan/OrderArea";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";

const CATEGORY = getCategory(GAMES_SLUG)!;

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Isi halaman bergantung penuh pada `params` (slug game). Dibiarkan blocking
 * (`instant = false`) supaya HTML-nya lengkap sejak byte pertama.
 */
export const instant = false;

export function generateStaticParams() {
  return GAME_LIST.map((game) => ({ game: game.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ game: string }>;
}): Promise<Metadata> {
  const { game } = await params;
  const service = SERVICES[game];

  if (!service || service.type !== "game") {
    return { title: "Game tidak ditemukan", robots: { index: false } };
  }

  return {
    title: `Top Up ${service.name}`,
    description: `${service.description} Proses otomatis 24/7, harga dari distributor resmi.`,
    alternates: { canonical: `/layanan/${GAMES_SLUG}/${service.key}` },
    openGraph: {
      title: `Top Up ${service.name} · LDICO Games`,
      description: service.description,
      url: `/layanan/${GAMES_SLUG}/${service.key}`,
    },
  };
}

function OrderFallback() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <p className="text-sm text-[var(--mut)]">Memuat area transaksi…</p>
    </div>
  );
}

interface PageProps {
  params: Promise<{ game: string }>;
  searchParams: Promise<SearchParams>;
}

/** Detail satu game: identitas game + area transaksi sesuai field game itu. */
export default async function Page({ params, searchParams }: PageProps) {
  const { game } = await params;
  const service = SERVICES[game];

  if (!service || service.type !== "game") notFound();

  return (
    <>
      <JsonLd data={serviceSchema(service.key)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Layanan", path: "/layanan" },
          { name: CATEGORY.name, path: categoryPath(GAMES_SLUG) },
          { name: service.name, path: categoryPath(GAMES_SLUG) + `/${service.key}` },
        ])}
      />

      <section className="relative overflow-hidden border-b border-[var(--line)]">
        {/* Sapuan gradient brand di belakang header — identitas game tetap
            terasa tanpa perlu memuat gambar berukuran besar. */}
        <div
          aria-hidden="true"
          className="absolute -top-24 inset-x-0 h-72 opacity-25 blur-[90px]"
          style={{
            backgroundImage: `linear-gradient(135deg, ${service.gradient[0]}, ${service.gradient[1]})`,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-5 pt-8 pb-10">
          <Breadcrumb
            items={[
              { name: "Beranda", path: "/" },
              { name: "Layanan", path: "/layanan" },
              { name: CATEGORY.name, path: categoryPath(GAMES_SLUG) },
              { name: service.name },
            ]}
          />

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end">
            {/* Tanpa foto produk: ikon besar + gradient brand, sama seperti
                gambar referensi halaman detail layanan. */}
            <IconTile
              icon={CATEGORY.icon}
              gradient={service.gradient}
              size={160}
              cut="cut"
              className="h-24 w-24 sm:h-32 sm:w-32"
            />
            <div>
              <h1 className="dp text-4xl font-bold sm:text-5xl">{service.name}</h1>
              <p className="mt-2 text-[var(--mut)]">{service.publisher}</p>
              <p className="mt-2 max-w-2xl text-sm text-[var(--mut)]">{service.description}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-5">
            <CategoryNav activeSlug={CATEGORY.slug} />
            <Link
              href={categoryPath(GAMES_SLUG)}
              className="dp w-fit text-xs text-[var(--lime)] underline underline-offset-4"
            >
              ← Kembali ke katalog game
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={<OrderFallback />}>
        <OrderArea service={service} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
