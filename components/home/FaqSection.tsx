import Link from "next/link";
import { HOME_FAQ } from "@/data/faq";
import { SITE } from "@/lib/site";

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20">
      <h2 className="dp mb-10 text-4xl font-bold">FAQ</h2>

      <div className="space-y-3">
        {HOME_FAQ.map((item, index) => (
          <details
            key={item.q}
            className="cut-sm border border-[var(--line)] bg-[var(--panel)] p-5"
            open={index === 0}
          >
            <summary className="flex cursor-pointer justify-between font-semibold">
              {item.q}
              <span className="pl text-xl text-[var(--lime)] transition" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm text-[var(--mut)]">{item.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-[var(--mut)]">
        Pertanyaan lain?{" "}
        <Link href="/#cek" className="text-[var(--lime)] underline underline-offset-4">
          Cek status transaksi
        </Link>{" "}
        atau hubungi kami lewat WhatsApp — {SITE.support.hours}.
      </p>
    </section>
  );
}
