import type { Metadata, Viewport } from "next";
import { chakraPetch, spaceGrotesk } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "top up game",
    "diamond mobile legends",
    "token pln",
    "pulsa murah",
    "ppob online",
    "voucher game",
    "top up free fire",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: "/",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#07070c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={SITE.lang}
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${chakraPetch.variable}`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="cut-sm dp sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-999 focus:bg-[var(--lime)] focus:px-5 focus:py-3 focus:font-bold focus:text-black"
        >
          Lewati ke konten
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
