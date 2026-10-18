import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="dp text-sm text-[var(--lime)]">404</p>
      <h1 className="dp mt-3 text-5xl font-bold">Halaman tidak ada di sini</h1>
      <p className="mx-auto mt-4 max-w-md text-[var(--mut)]">
        Mungkin linknya salah ketik atau halamannya sudah dipindah. Coba mulai dari katalog game
        atau cek pesananmu.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/#layanan"
          className="cut-sm dp bg-[var(--lime)] px-6 py-3 font-bold text-black transition hover:brightness-110"
        >
          Lihat Katalog Game
        </Link>
        <Link
          href="/lacak"
          className="cut-sm dp border border-[var(--line)] px-6 py-3 transition hover:border-[var(--lime)]"
        >
          Lacak Pesanan
        </Link>
      </div>
    </div>
  );
}
