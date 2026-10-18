import Link from "next/link";

/** Ajakan terakhir sebelum footer: satu tombol, langsung ke daftar layanan. */
export function ClosingCta() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-20">
      <div className="cut bg-[var(--lime)] p-8 text-black sm:p-12">
        <h2 className="dp max-w-2xl text-3xl font-bold sm:text-4xl">
          Top up game atau bayar tagihan — selesai dalam 3 detik.
        </h2>
        <Link
          href="/#layanan"
          className="cut-sm dp mt-6 inline-block bg-black px-6 py-3.5 font-bold text-[var(--lime)] transition hover:brightness-125"
        >
          Mulai Sekarang →
        </Link>
      </div>
    </section>
  );
}
