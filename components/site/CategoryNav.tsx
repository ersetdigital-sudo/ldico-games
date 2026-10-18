import Link from "next/link";
import { CATEGORIES, categoryPath } from "@/data/categories";

/**
 * Navigasi antar kategori utama — dipakai di halaman kategori dan detail game
 * supaya pengguna tidak kehilangan konteks dan bisa pindah kategori tanpa
 * harus kembali ke beranda.
 */
export function CategoryNav({ activeSlug }: { activeSlug: string }) {
  return (
    <nav aria-label="Kategori layanan" className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => {
        const active = category.slug === activeSlug;
        return (
          <Link
            key={category.slug}
            href={categoryPath(category.slug)}
            aria-current={active ? "page" : undefined}
            className={`dp cut-sm border border-[var(--line)] px-3 py-2 text-[11px] transition sm:text-xs ${
              active
                ? "bg-[var(--lime)] text-black"
                : "bg-[var(--panel)] hover:border-[var(--lime)] hover:text-[var(--lime)]"
            }`}
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}
