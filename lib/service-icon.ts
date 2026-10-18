import type { GameCategory, Service } from "@/data/services";
import type { IconName } from "@/components/site/Icon";

/**
 * Ikon identitas layanan — satu sumber untuk thumbnail (`ServiceThumb`),
 * daftar kategori game di beranda, dan baris pilihan PPOB.
 *
 * Dipisah dari `data/services.ts` karena ini urusan tampilan, bukan data
 * produk; `IconName` sendiri tinggal di komponen ikonnya.
 */

/** Ikon per kategori game. */
export const GAME_CATEGORY_ICON: Record<GameCategory, IconName> = {
  moba: "gamepad",
  fps: "crosshair",
  rpg: "sparkle",
  voucher: "card",
};

/** Ikon per layanan PPOB. */
export const PPOB_ICON: Record<string, IconName> = {
  pulsa: "mobile",
  data: "wifi",
  pln: "bolt",
  ewallet: "banknote",
  bpjs: "heart",
  pdam: "droplet",
  internet: "globe",
  tv: "tv",
};

/** Ikon satu layanan: game ikut kategorinya, PPOB ikut layanannya. */
export const serviceIcon = (service: Service): IconName =>
  (service.category ? GAME_CATEGORY_ICON[service.category] : undefined) ||
  PPOB_ICON[service.key] ||
  "card";
