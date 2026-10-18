import Link from "next/link";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/data/services";
import { servicePath } from "@/data/categories";
import { Logo } from "./Logo";

const FOOTER_GAMES = [
  { key: "ml", label: "Mobile Legends" },
  { key: "ff", label: "Free Fire" },
  { key: "pubg", label: "PUBG Mobile" },
  { key: "gi", label: "Genshin Impact" },
];

const FOOTER_PPOB = [
  { key: "pulsa", label: "Pulsa & Data" },
  { key: "pln", label: "Token PLN" },
  { key: "ewallet", label: "E-Wallet" },
  { key: "bpjs", label: "BPJS & PDAM" },
];

const FOOTER_HELP = [
  { href: "/lacak", label: "Lacak Pesanan" },
  { href: "/pembayaran", label: "Metode Pembayaran" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#cara", label: "Cara Order" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 text-sm md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo
            gradientId="logo-footer"
            size={56}
            wordClassName="text-3xl"
            tagClassName="text-[11px]"
          />
          <p className="mt-4 max-w-sm text-[var(--mut)]">
            Top up game &amp; PPOB tercepat, termurah, dan paling aman. Main terus, bayar beres.
          </p>
          <p className="mt-4 text-[var(--mut)]">
            <Link
              href="/pembayaran"
              className="text-[var(--lime)] underline underline-offset-4 transition hover:text-white"
            >
              Lihat 10 metode pembayaran
            </Link>
          </p>
        </div>

        <nav aria-label="Game populer">
          <h2 className="dp mb-3 text-sm">Games</h2>
          <ul className="space-y-2 text-[var(--mut)]">
            {FOOTER_GAMES.map((item) => (
              <li key={item.key}>
                <Link
                  href={servicePath(SERVICES[item.key])}
                  className="transition hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <nav aria-label="Layanan PPOB">
            <h2 className="dp mb-3 text-sm">PPOB</h2>
            <ul className="space-y-2 text-[var(--mut)]">
              {FOOTER_PPOB.map((item) => (
                <li key={item.key}>
                  <Link
                    href={servicePath(SERVICES[item.key])}
                    className="transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Bantuan" className="mt-6">
            <h2 className="dp mb-3 text-sm">Bantuan</h2>
            <ul className="space-y-2 text-[var(--mut)]">
              {FOOTER_HELP.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-[var(--line)] px-5 py-6 text-center text-xs text-[var(--mut)] sm:flex-row sm:text-left">
        <p>© 2026 {SITE.name}. All rights reserved.</p>
        <p>
          Butuh bantuan? {SITE.support.hours} ·{" "}
          <a
            href={`mailto:${SITE.support.email}`}
            className="text-[var(--lime)] underline underline-offset-4"
          >
            {SITE.support.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
