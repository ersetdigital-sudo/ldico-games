export type PaymentGroup = "E-Wallet & Bank" | "E-Wallet" | "Virtual Account" | "Gerai Retail";

export interface PaymentMethod {
  name: string;
  /** < 1 dihitung sebagai persentase dari subtotal, >= 1 sebagai biaya tetap */
  fee: number;
  group: PaymentGroup;
}

export const PAYMENTS: PaymentMethod[] = [
  { name: "QRIS", fee: 0, group: "E-Wallet & Bank" },
  { name: "DANA", fee: 0.015, group: "E-Wallet" },
  { name: "OVO", fee: 0.015, group: "E-Wallet" },
  { name: "GoPay", fee: 0.02, group: "E-Wallet" },
  { name: "ShopeePay", fee: 0.015, group: "E-Wallet" },
  { name: "BCA VA", fee: 4000, group: "Virtual Account" },
  { name: "BRI VA", fee: 4000, group: "Virtual Account" },
  { name: "Mandiri VA", fee: 4000, group: "Virtual Account" },
  { name: "Alfamart", fee: 2500, group: "Gerai Retail" },
  { name: "Indomaret", fee: 2500, group: "Gerai Retail" },
];

export const PAYMENT_BY_NAME: Record<string, PaymentMethod> = Object.fromEntries(
  PAYMENTS.map((p) => [p.name, p]),
);

export const PAYMENT_GROUPS = [...new Set(PAYMENTS.map((p) => p.group))];

export const paymentsByGroup = () =>
  PAYMENT_GROUPS.map((group) => ({
    group,
    methods: PAYMENTS.filter((p) => p.group === group),
  }));

export const feeOf = (method: string, subtotal: number) => {
  const fee = PAYMENT_BY_NAME[method]?.fee ?? 0;
  return fee < 1 ? Math.round(subtotal * fee) : fee;
};

/** Fee ditulis seperti apa di kartu metode pembayaran. */
export const feeLabel = (fee: number) =>
  fee === 0 ? "Gratis biaya" : fee < 1 ? `Biaya ${fee * 100}%` : "Biaya tetap";

export const PAYMENT_GUIDE: Record<PaymentGroup, string[] | ((method: string) => string[])> = {
  "E-Wallet & Bank": [
    "Buka aplikasi m-banking atau e-wallet apa pun",
    "Pilih menu Scan / Bayar QRIS",
    "Scan kode QR di halaman invoice",
    "Cek nominal lalu konfirmasi dengan PIN",
  ],
  "E-Wallet": (m) => [
    `Pilih ${m} di halaman checkout`,
    `Kamu akan diarahkan ke aplikasi ${m}`,
    "Cek detail tagihan LDICO Games",
    "Konfirmasi dengan PIN, selesai",
  ],
  "Virtual Account": (m) => [
    `Buka m-banking / ATM ${m.replace(" VA", "")}`,
    "Pilih Transfer → Virtual Account",
    "Masukkan nomor VA dari invoice",
    "Pastikan nama LDICO GAMES lalu bayar",
  ],
  "Gerai Retail": (m) => [
    `Datang ke kasir ${m} terdekat`,
    "Bilang mau bayar tagihan LDICO Games",
    "Tunjukkan kode pembayaran dari invoice",
    "Bayar tunai & simpan struk",
  ],
};

export const guideFor = (method: string) => {
  const group = PAYMENT_BY_NAME[method]?.group ?? "E-Wallet & Bank";
  const guide = PAYMENT_GUIDE[group];
  return typeof guide === "function" ? guide(method) : guide;
};

export const PAYMENT_CONFIRMATION: Record<PaymentGroup, string> = {
  "E-Wallet & Bank": "Instan",
  "E-Wallet": "Instan",
  "Virtual Account": "< 1 mnt",
  "Gerai Retail": "< 5 mnt",
};

export const PAYMENT_MIN: Record<PaymentGroup, number> = {
  "E-Wallet & Bank": 1000,
  "E-Wallet": 1000,
  "Virtual Account": 10000,
  "Gerai Retail": 10000,
};
