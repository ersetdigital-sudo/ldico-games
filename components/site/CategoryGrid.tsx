import Link from "next/link";
import { CATEGORIES, categoryPath } from "@/data/categories";
import { IconTile } from "@/components/site/IconTile";

interface CategoryGridProps {
  className?: string;
}

/**
 * Sembilan kategori utama dalam grid kartu.
 *
 * Dipakai halaman `/layanan` dan bagian "Pilih layanan" di beranda, jadi
 * urutan serta jumlah kategorinya tidak mungkin berbeda antar halaman.
 * Seluruh area kartu bisa diklik (elemennya `<a>`, jadi cursor pointer bawaan).
 */
export function CategoryGrid({ className = "" }: CategoryGridProps) {
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 ${className}`}>
      {CATEGORIES.map((category) => (
        <li key={category.slug} className="h-full">
          <Link
            href={categoryPath(category.slug)}
            className="gc cut flex h-full flex-col gap-3 border border-[var(--line)] bg-[var(--panel)] p-4"
          >
            <IconTile
              icon={category.icon}
              gradient={category.gradient}
              size={40}
              className="h-10 w-10"
            />

            <span className="min-w-0">
              <span className="dp block text-xs font-bold sm:text-sm">{category.name}</span>
              <span className="mt-1 block text-[11px] leading-snug text-[var(--mut)] sm:text-xs">
                {category.description}
              </span>
            </span>

            {category.serviceKeys.length === 0 && (
              /* Status apa adanya: kategorinya ada, produknya belum. Lebih baik
                 diumumkan di kartu daripada pengguna masuk ke halaman kosong. */
              <span className="dp mt-auto inline-block self-start border border-[var(--line)] px-2 py-1 text-[10px] text-[var(--mut)]">
                Segera hadir
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
