import { SITE } from "@/lib/site";
import { SERVICES } from "@/data/services";
import { CATEGORIES, categoryPath, servicePath } from "@/data/categories";
import { HOME_FAQ } from "@/data/faq";

/**
 * Structured data (JSON-LD) — dipakai Google & AI answer engine
 * untuk mengenali entitas toko dan isi FAQ-nya.
 */
export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  slogan: SITE.tagline,
  areaServed: "ID",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: SITE.support.email,
      availableLanguage: ["id"],
    },
  ],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  inLanguage: "id-ID",
});

export const faqSchema = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});

export const homeFaqSchema = () => faqSchema(HOME_FAQ);

export const serviceCatalogSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Kategori layanan LDICO Games",
  numberOfItems: CATEGORIES.length,
  itemListElement: CATEGORIES.map((category, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: category.name,
    url: `${SITE.url}${categoryPath(category.slug)}`,
  })),
});

export const serviceSchema = (key: string) => {
  const service = SERVICES[key];
  const prices = service.packages.map((item) => item.price);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: service.type === "game" ? `${service.name} — Top Up` : service.name,
    description: service.description,
    brand: { "@type": "Brand", name: service.publisher },
    category: service.type === "game" ? "Game Top Up" : "PPOB",
    url: `${SITE.url}${servicePath(service)}`,
    // Produk tanpa daftar harga tidak diberi `offers` — lebih baik tidak ada
    // data harga sama sekali daripada angka yang tidak benar.
    ...(prices.length > 0
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "IDR",
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
};

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE.url}${item.path}`,
  })),
});
