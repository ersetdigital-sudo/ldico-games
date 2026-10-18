import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { FlashSale } from "@/components/home/FlashSale";
import { CategorySection } from "@/components/home/CategorySection";
import { HowToOrder } from "@/components/home/HowToOrder";
import { TrackSection } from "@/components/home/TrackSection";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustSection } from "@/components/home/TrustSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ClosingCta } from "@/components/home/ClosingCta";
import { JsonLd } from "@/components/site/JsonLd";
import {
  homeFaqSchema,
  organizationSchema,
  serviceCatalogSchema,
  websiteSchema,
} from "@/lib/schema";

/**
 * Beranda — satu fungsi per section, berurutan seperti alur belanja:
 * lihat promo → pilih layanan → tahu cara order → cek transaksi → yakin → tanya.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={serviceCatalogSchema()} />
      <JsonLd data={homeFaqSchema()} />

      <Hero />
      <Marquee />
      <FlashSale />
      <CategorySection />
      <HowToOrder />
      <TrackSection />
      <Testimonials />
      <TrustSection />
      <FaqSection />
      <ClosingCta />
    </>
  );
}
