import { CATEGORIES } from "@/data/categories";
import { PPOB_OPERATORS } from "@/data/faq";
import { CategoryGrid } from "@/components/site/CategoryGrid";

/**
 * Bagian "Pilih layanan" di beranda: sembilan kategori dalam grid kartu.
 *
 * Pakai `CategoryGrid` yang sama dengan halaman `/layanan`, jadi jumlah dan
 * urutan kategorinya mustahil berbeda antar halaman. Isi tiap kategori
 * (game, nominal, tagihan) sengaja tidak dibentangkan di sini — baru muncul
 * setelah kategorinya diklik.
 */
export function CategorySection() {
  return (
    <section id="layanan" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20">
      <h2 className="dp text-4xl font-bold md:text-5xl">Pilih layanan</h2>
      <p className="mt-2 text-[var(--mut)]">
        {CATEGORIES.length} kategori layanan — pilih kategorinya dulu, produk dan nominalnya
        muncul di halaman berikutnya.
      </p>

      <CategoryGrid className="mt-8" />

      <div className="mt-10 border-t border-[var(--line)] pt-6">
        <h3 className="dp text-xs text-[var(--mut)]">Operator &amp; penyedia didukung</h3>
        <ul className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--mut)]">
          {PPOB_OPERATORS.map((operator) => (
            <li key={operator} className="border border-[var(--line)] px-3 py-1.5">
              {operator}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
