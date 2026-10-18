import { LayananOrder } from "@/components/layanan/LayananOrder";
import type { Service } from "@/data/services";
import { firstParam } from "@/lib/params";

type SearchParams = Record<string, string | string[] | undefined>;

/**
 * Area transaksi yang membaca `?t=` (nomor/ID) dan `?i=` (nominal) dari kartu
 * "Bayar cepat" di beranda.
 *
 * Dipisah jadi komponen sendiri supaya bagian dinamis ini bisa dibungkus
 * `<Suspense>` — sisa halaman tetap dirender statis.
 */
export async function OrderArea({
  service,
  searchParams,
}: {
  service: Service;
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const initialTarget = firstParam(params.t) ?? undefined;
  const packParam = Number.parseInt(firstParam(params.i) ?? "", 10);
  const initialPackage =
    Number.isInteger(packParam) && packParam >= 0 && packParam < service.packages.length
      ? packParam
      : undefined;

  return (
    <LayananOrder
      service={service}
      initialTarget={initialTarget}
      initialPackage={initialPackage}
    />
  );
}
