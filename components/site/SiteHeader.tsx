import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Link href="/" aria-label="LDICO Games — kembali ke beranda">
          <Logo gradientId="logo-header" />
        </Link>

        <nav aria-label="Navigasi utama" className="hidden gap-7 text-sm text-[var(--mut)] md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#layanan"
            className="cut-sm dp hidden bg-[var(--lime)] px-5 py-2.5 text-sm font-bold text-black sm:inline-block"
          >
            Pilih Layanan
          </Link>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
