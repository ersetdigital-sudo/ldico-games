"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DEFAULT_SERVICE_KEY, SERVICES } from "@/data/services";
import { servicePath } from "@/data/categories";
import { feeOf, paymentsByGroup, type PaymentGroup } from "@/data/payments";
import { findPromo } from "@/data/promos";
import { HERO_PREFIX, Money } from "@/components/site/Money";
import { Icon, type IconName } from "@/components/site/Icon";
import {
  CHECKOUT_FALLBACK,
  createInvoiceNumber,
  invoiceTotal,
  type InvoiceRecord,
  type OrderDraft,
} from "@/lib/order";
import { encodeOrder } from "@/lib/codec";
import { draftStorage, historyStorage, invoiceStorage } from "@/lib/storage";
import { ServiceThumb } from "@/components/site/ServiceThumb";
import { StepIndicator } from "@/components/site/StepIndicator";

/** Ikon kartu metode bayar, satu per grup (bukan per metode). */
const PAYMENT_ICON: Record<PaymentGroup, IconName> = {
  "E-Wallet & Bank": "qr",
  "E-Wallet": "banknote",
  "Virtual Account": "card",
  "Gerai Retail": "store",
};

/** Biaya ditulis apa adanya: persen atau nominal rupiah. */
function FeeText({ fee }: { fee: number }) {
  if (fee === 0) return <>Gratis biaya</>;
  if (fee < 1) return <>Biaya {fee * 100}%</>;
  return (
    <>
      Biaya <Money value={fee} />
    </>
  );
}

export function CheckoutClient({ initialOrder }: { initialOrder: OrderDraft | null }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDraft>(initialOrder ?? CHECKOUT_FALLBACK);
  const [method, setMethod] = useState<string | null>(initialOrder?.m ?? null);
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [error, setError] = useState(false);

  // Kalau URL tidak membawa order (mis. halaman di-refresh), ambil dari session.
  useEffect(() => {
    if (initialOrder) return;
    const stored = draftStorage.get();
    if (stored) {
      setOrder(stored);
      if (stored.m) setMethod(stored.m);
    }
  }, [initialOrder]);

  const service = SERVICES[order.k] ?? SERVICES[DEFAULT_SERVICE_KEY];
  const pack = service.packages[order.i] ?? service.packages[0];
  const fee = method ? feeOf(method, pack.price) : 0;
  const clampedDiscount = Math.min(discount, pack.price);
  const total = invoiceTotal(pack.price, fee, clampedDiscount);

  const paymentGroups = useMemo(() => paymentsByGroup(), []);

  const applyPromo = () => {
    const promo = findPromo(promoInput, order.k);
    if (!promo) {
      setDiscount(0);
      setPromoMessage({ text: "Kode tidak valid untuk layanan ini", ok: false });
      return;
    }
    setDiscount(Math.min(pack.price * promo.percent, promo.max));
    setPromoMessage({ text: "Promo dipakai ✓", ok: true });
  };

  const handlePay = () => {
    if (!method) {
      setError(true);
      return;
    }
    const now = Date.now();
    const invoiceNumber = createInvoiceNumber(now);
    const record: InvoiceRecord = {
      ...order,
      inv: invoiceNumber,
      m: method,
      fee,
      disc: clampedDiscount,
      total,
      ts: now,
      st: 0,
    };
    invoiceStorage.set(record);
    historyStorage.save(record);
    router.push(`/invoice?no=${invoiceNumber}&d=${encodeOrder(record)}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <StepIndicator current={2} />
      <h1 className="dp mb-8 text-4xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="cut flex items-center gap-5 border border-[var(--line)] bg-[var(--panel)] p-6">
            <ServiceThumb service={service} size={80} className="h-20 w-20" />
            <div className="min-w-0 flex-1">
              <h2 className="dp truncate text-xl font-bold">{service.name}</h2>
              <p className="text-sm text-[var(--lime)]">{pack.name}</p>
              <p className="mt-1 text-xs text-[var(--mut)]">
                {order.f.map(([label, value]) => `${label}: ${value}`).join(" · ")}
              </p>
            </div>
            <Link
              href={servicePath(service)}
              className="shrink-0 text-xs text-[var(--mut)] underline underline-offset-4 transition hover:text-[var(--lime)]"
            >
              Ubah
            </Link>
          </section>

          <section className="cut border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="dp mb-4 text-sm">Metode pembayaran</h2>
            <div className="space-y-5">
              {paymentGroups.map(({ group, methods }) => (
                <div key={group}>
                  <h3 className="mb-2 text-xs text-[var(--mut)]">{group}</h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {methods.map((payment) => {
                      const active = method === payment.name;
                      return (
                        <motion.button
                          key={payment.name}
                          type="button"
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            setMethod(payment.name);
                            setError(false);
                          }}
                          aria-pressed={active}
                          className={`option cut-sm flex w-full items-center gap-3 border border-[var(--line)] bg-[var(--bg)] p-3 text-left transition ${
                            active ? "is-active" : "hover:border-[var(--lime)]"
                          }`}
                        >
                          {/* Sama seperti grid PPOB: saat terpilih latarnya lime, jadi
                              tile ikon dibalik jadi hitam–lime biar tetap terlihat. */}
                          <span
                            className={`flex h-10 w-12 shrink-0 items-center justify-center border transition ${
                              active
                                ? "border-[#07070c] bg-[#07070c] text-[var(--lime)]"
                                : "border-[var(--line)] text-[var(--mut)]"
                            }`}
                          >
                            <Icon name={PAYMENT_ICON[group]} className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="dp block truncate text-sm font-semibold">
                              {payment.name}
                            </span>
                            <span className="block text-[11px] opacity-70">
                              <FeeText fee={payment.fee} />
                            </span>
                          </span>
                          {/* Penanda pilihan; barisnya sendiri sudah `aria-pressed`. */}
                          <span
                            aria-hidden="true"
                            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center border ${
                              active ? "border-[#07070c]" : "border-[var(--mut)]"
                            }`}
                          >
                            {active && <span className="h-2 w-2 bg-[#07070c]" />}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="cut glow h-fit bg-[var(--bg)] p-6 lg:sticky lg:top-24">
          <h2 className="dp mb-4 text-sm">Rincian pembayaran</h2>

          <div className="mb-5 flex gap-2">
            <label htmlFor="promo-code" className="sr-only">
              Kode promo
            </label>
            <input
              id="promo-code"
              value={promoInput}
              onChange={(event) => setPromoInput(event.target.value)}
              placeholder="Kode promo"
              className="inp cut-sm min-w-0 text-sm"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="cut-sm dp shrink-0 bg-white px-4 text-sm font-bold text-black transition hover:bg-[var(--lime)]"
            >
              Pakai
            </button>
          </div>

          <p
            aria-live="polite"
            className={`mb-4 text-xs ${promoMessage?.ok ? "text-[var(--lime)]" : "text-red-400"}`}
          >
            {promoMessage?.text ?? "Coba kode LDICO10 untuk diskon 10%."}
          </p>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--mut)]">Harga</dt>
              <dd>
                <Money value={pack.price} />
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--mut)]">Biaya layanan</dt>
              <dd>{method ? <Money value={fee} /> : "-"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--mut)]">Diskon</dt>
              <dd className="text-[var(--lime)]">
                {clampedDiscount > 0 ? (
                  <>
                    −<Money value={clampedDiscount} />
                  </>
                ) : (
                  "-"
                )}
              </dd>
            </div>
          </dl>

          <div className="my-4 border-t border-[var(--line)]" />

          <p className="text-xs text-[var(--mut)]">Total</p>
          <p className="dp text-3xl font-bold">
            <Money value={total} prefixClassName={HERO_PREFIX} />
          </p>

          {error && (
            <p role="alert" className="mt-3 text-xs text-red-400">
              Pilih metode bayar dulu.
            </p>
          )}

          <button
            type="button"
            onClick={handlePay}
            className="cut-sm dp mt-5 w-full bg-[var(--lime)] py-4 font-bold text-black transition hover:brightness-110"
          >
            Bayar Sekarang
          </button>

          <p className="mt-3 text-center text-[11px] text-[var(--mut)]">
            Dengan membayar kamu setuju dengan Syarat &amp; Ketentuan.
          </p>
        </aside>
      </div>
    </div>
  );
}
