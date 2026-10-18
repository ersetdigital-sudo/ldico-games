import Link from "next/link";
import { PAYMENT_METHOD_LOGOS, SERVICE_BENEFITS } from "@/data/faq";

/**
 * Pita kepercayaan sebelum FAQ: kanal pembayaran + 4 jaminan layanan.
 * Tanpa nomor section — ini penutup halaman, bukan langkah yang harus diikuti.
 */
export function TrustSection() {
  return (
    <section className="border-y border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <h2 className="dp text-sm text-[var(--mut)]">Metode pembayaran</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {PAYMENT_METHOD_LOGOS.map((method) => (
            <li key={method}>
              <Link
                href="/pembayaran"
                className="dp cut-sm block border border-[var(--line)] bg-[var(--panel)] px-3.5 py-2 text-xs text-[var(--mut)] transition hover:border-[var(--lime)] hover:text-[var(--lime)]"
              >
                {method}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="dp mt-12 text-sm text-[var(--mut)]">Jaminan layanan</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_BENEFITS.map((benefit, index) => (
            <li key={benefit.title} className="cut-sm border border-[var(--line)] p-5">
              <p className="dp text-2xl font-bold text-[var(--lime)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="dp mt-2 font-bold">{benefit.title}</h3>
              <p className="mt-1 text-sm text-[var(--mut)]">{benefit.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
