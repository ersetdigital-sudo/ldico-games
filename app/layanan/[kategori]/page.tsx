import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CATEGORIES, GAMES_SLUG, getCategory } from "@/data/categories";
import { getService } from "@/data/services";
import { firstParam } from "@/lib/params";
import { SITE, waLink } from "@/lib/site";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import { CategoryNav } from "@/components/site/CategoryNav";
import { IconTile } from "@/components/site/IconTile";
import { JsonLd } from "@/components/site/JsonLd";
import { OrderArea } from "@/components/layanan/OrderArea";
import { breadcrumbSchema } from "@/lib/schema";

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Seluruh isi halaman ini ditentukan oleh `params` (slug kategori), jadi
 * permintaan URL-nya memang harus selesai dulu sebelum halaman dirender —
 * langsung set `instant = false` daripada memaksa kerangka kosong.
 */
export const instant = false;

/**
 * Halaman kategori PPOB — kedalaman kedua setelah daftar 9 kategori.
 * Isinya: judul besar, deskripsi, navigasi kategori, dan area transaksi.
 */
export function generateStaticParams() {
  return CATEGORIES.filter((category) => category.slug !== GAMES_SLUG).map((category) => ({
    kategori: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategori: string }>;
}): Promise<Metadata> {
  const { kategori } = await params;
  const category = getCategory(kategori);

  if (!category) {
    return { title: "Layanan tidak ditemukan", robots: { index: false } };
  }

  return {
    title: category.name,
    description: `${category.description} Bayar atau top up di LDICO Games, proses otomatis 24/7.`,
    alternates: { canonical: `/layanan/${category.slug}` },
    openGraph: {
      title: `${category.name} · LDICO Games`,
      description: category.description,
      url: `/layanan/${category.slug}`,
    },
  };
}

/** Placeholder area transaksi selama bagian dinamisnya dimuat. */
function OrderFallback() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <p className="text-sm text-[var(--mut)]">Memuat area transaksi…</p>
    </div>
  );
}

/** Pilih layanan di dalam satu kategori (kategori "TV & Internet" berisi 2 layanan). */
async function CategoryArea({
  slugs,
  searchParams,
}: {
  slugs: string[];
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const chosen = slugs.find((key) => key === firstParam(params.pilih)) ?? slugs[0];

  return (
    <>
      {slugs.length > 1 && (
        <div className="mx-auto max-w-7xl px-5 pt-10">
          <h2 className="dp mb-3 text-sm">Pilih layanannya</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
            {slugs.map((key) => {
              const service = getService(key);
              const active = key === chosen;
              return (
                <li key={key}>
                  <Link
                    href={`?pilih=${key}`}
                    scroll={false}
                    aria-current={active ? "true" : undefined}
                    className={`option cut-sm flex items-center gap-3 border border-[var(--line)] p-4 transition ${
                      active ? "is-active" : "hover:border-[var(--lime)]"
                    }`}
                  >
                    <span className="dp text-sm font-bold">{service.name}</span>
                    <span className="text-xs opacity-70">{service.publisher}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <OrderArea service={getService(chosen)} searchParams={searchParams} />
    </>
  );
}

function UnavailablePanel({ name }: { name: string }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="cut border border-dashed border-[var(--line)] p-6 sm:p-8">
        <h2 className="dp text-lg font-bold">Produk {name} belum tersedia</h2>
        <p className="mt-2 text-sm text-[var(--mut)]">
          Kategorinya sudah terdaftar, tapi daftar perusahaan pembiayaan dan tagihan
          angsurannya belum terhubung ke sistem LDICO Games. Kami tidak menampilkan harga
          contoh supaya tidak ada pesanan yang gagal di tengah jalan.
        </p>
        <p className="mt-4 text-sm text-[var(--mut)]">
          Mau dibantu manual?{" "}
          <a
            href={waLink(`Halo ${SITE.name}, saya mau bayar angsuran multifinance.`)}
            className="text-[var(--lime)] underline underline-offset-4"
          >
            Hubungi CS
          </a>{" "}
          — {SITE.support.hours}.
        </p>
      </div>
    </div>
  );
}

interface PageProps {
  params: Promise<{ kategori: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { kategori } = await params;
  const category = getCategory(kategori);

  if (!category || category.slug === GAMES_SLUG) {
    // "top-up-game" punya rute statisnya sendiri; slug lain yang tidak dikenal
    // jatuh ke halaman 404.
    notFound();
  }

  const hasProducts = category.serviceKeys.length > 0;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Beranda", path: "/" },
          { name: "Layanan", path: "/layanan" },
          { name: category.name, path: `/layanan/${category.slug}` },
        ])}
      />

      <section className="border-b border-[var(--line)]">
        <div className="mx-auto max-w-7xl px-5 pt-8 pb-10">
          <Breadcrumb
            items={[
              { name: "Beranda", path: "/" },
              { name: "Layanan", path: "/layanan" },
              { name: category.name },
            ]}
          />

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end">
            <IconTile
              icon={category.icon}
              gradient={category.gradient}
              size={160}
              cut="cut"
              className="h-24 w-24 sm:h-32 sm:w-32"
            />
            <div>
              <h1 className="dp text-4xl font-bold sm:text-5xl">{category.name}</h1>
              <p className="mt-2 max-w-2xl text-[var(--mut)]">{category.description}</p>
            </div>
          </div>

          <div className="mt-8">
            <CategoryNav activeSlug={category.slug} />
          </div>
        </div>
      </section>

      {hasProducts ? (
        <Suspense fallback={<OrderFallback />}>
          <CategoryArea slugs={category.serviceKeys} searchParams={searchParams} />
        </Suspense>
      ) : (
        <UnavailablePanel name={category.name} />
      )}
    </>
  );
}
