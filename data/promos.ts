export interface Promo {
  /** Kalau kosong, berlaku untuk semua layanan. */
  serviceKey?: string;
  percent: number;
  max: number;
}

export const PROMOS: Record<string, Promo> = {
  LDICOPLN: { serviceKey: "pln", percent: 0.1, max: 10000 },
  LDICO10: { percent: 0.1, max: 15000 },
};

export const findPromo = (code: string, serviceKey: string): Promo | null => {
  const promo = PROMOS[code.trim().toUpperCase()];
  if (!promo) return null;
  if (promo.serviceKey && promo.serviceKey !== serviceKey) return null;
  return promo;
};
