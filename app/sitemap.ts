import type { MetadataRoute } from "next";
import { CATEGORIES, categoryPath } from "@/data/categories";
import { SERVICES } from "@/data/services";
import { SITE } from "@/lib/site";

/** Tanggal rilis konten — konstanta supaya sitemap tetap prerender-able. */
const LAST_UPDATED = "2026-10-01T00:00:00.000Z";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/layanan`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/pembayaran`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/lacak`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Sembilan kategori utama — halaman yang paling layak diindeks.
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${SITE.url}${categoryPath(category.slug)}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Halaman detail game memakai URL kanoniknya sendiri.
  const gameRoutes: MetadataRoute.Sitemap = Object.values(SERVICES)
    .filter((service) => service.type === "game")
    .map((service) => ({
      url: `${SITE.url}${categoryPath("top-up-game")}/${service.key}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticRoutes, ...categoryRoutes, ...gameRoutes].map((entry) => ({
    ...entry,
    lastModified: LAST_UPDATED,
  }));
}
