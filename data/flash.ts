export interface FlashSaleItem {
  service: string;
  serviceKey: string;
  item: string;
  oldPrice: number;
  newPrice: number;
  soldPercent: number;
}

export const FLASH_SALE: FlashSaleItem[] = [
  {
    service: "Mobile Legends",
    serviceKey: "ml",
    item: "344 Diamond",
    oldPrice: 89000,
    newPrice: 71200,
    soldPercent: 82,
  },
  {
    service: "Free Fire",
    serviceKey: "ff",
    item: "720 Diamond",
    oldPrice: 99000,
    newPrice: 79000,
    soldPercent: 64,
  },
  {
    service: "PUBG Mobile",
    serviceKey: "pubg",
    item: "660 UC",
    oldPrice: 150000,
    newPrice: 127500,
    soldPercent: 47,
  },
  {
    service: "Genshin Impact",
    serviceKey: "gi",
    item: "Welkin Moon",
    oldPrice: 79000,
    newPrice: 63000,
    soldPercent: 90,
  },
];
