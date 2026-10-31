"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DEFAULT_SERVICE_KEY, SERVICES } from "@/data/services";
import { servicePath } from "@/data/categories";
import { findPromo } from "@/data/promos";
import { HERO_PREFIX, Money } from "@/components/site/Money";
import { Icon } from "@/components/site/Icon";
import {
  CHECKOUT_FALLBACK,
  invoiceTotal,
  type OrderDraft,
} from "@/lib/order";
import { createOrder } from "@/lib/db/client";
import { toPublicError } from "@/lib/db/errors";
import { saveRef } from "@/lib/refs";
import { draftStorage } from "@/lib/storage";
import { ServiceThumb } from "@/components/site/ServiceThumb";
import { StepIndicator } from "@/components/site/StepIndicator";

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

type CatalogEntry = {
  serviceId: string;
  fields: { key: string; label: string }[];
  products: { id: string; name: string; price: number }[];
};

type CheckoutMethod = { id: string; name: string; fee: number };

export function CheckoutClient({
  initialOrder,
  catalog,
  methods,
  brandSlug,
}: {
  initialOrder: OrderDraft | null;
  catalog: Record<string, CatalogEntry>;
  methods: CheckoutMethod[];
  brandSlug: string;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderDraft>(initialOrder ?? CHECKOUT_FALLBACK);
  const [method, setMethod] = useState<string | null>(
    initialOrder?.m ?? methods[0]?.name ?? null,
  );
  const [promoInput, setPromoInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [error, setError] = useState(false);
  const [payError, setPayError] = useState("");
  const [pending, setPending] = useState(false);

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
  const methodDef = methods.find((item) => item.name === method);
  const fee = methodDef?.fee ?? 0;
  const clampedDiscount = Math.min(discount, pack.price);
  const total = invoiceTotal(pack.price, fee, clampedDiscount);

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

  const handlePay = async () => {
    if (!methodDef) {
      setError(true);
      return;
    }
    const entry = catalog[order.k];
    if (!entry) {
      setPayError("Layanan ini belum tersedia. Coba pilih layanan lain.");
      return;
    }
    const product =
      entry.products.find((item) => item.name === pack.name) ??
      entry.products[order.i];
    if (!product) {
      setPayError("Nominal ini belum tersedia. Coba pilih nominal lain.");
      return;
    }

    const input: Record<string, string> = {};
    for (const [label, value] of order.f) {
      const field = entry.fields.find((item) => item.label === label);
      const key =
        field?.key ??
        label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
      input[key || "tujuan"] = value;
    }
    const nomorTujuan = order.f[0]?.[1]?.trim() ?? "";

    setError(false);
    setPayError("");
    setPending(true);
    try {
      const created = await createOrder({
        brandSlug,
        serviceId: entry.serviceId,
        productId: product.id,
        nomorTujuan,
        input,
        paymentMethodId: methodDef.id,
        voucherCode: promoMessage?.ok
          ? promoInput.trim().toUpperCase()
          : null,
      });
      saveRef(created.ref);
      router.push(`/invoice?ref=${encodeURIComponent(created.ref)}`);
    } catch (caught) {
      setPayError(toPublicError(caught).message);
      setPending(false);
    }
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
            <div className="grid gap-2 sm:grid-cols-2">
              {methods.map((payment) => {
                const active = method === payment.name;
                return (
                  <motion.button
                    key={payment.id}
                    type="button"
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setMethod(payment.name);
                      setError(false);
                      setPayError("");
                    }}
                    aria-pressed={active}
                    className={`option cut-sm flex w-full items-center gap-3 border border-[var(--line)] bg-[var(--bg)] p-3 text-left transition ${
                      active ? "is-active" : "hover:border-[var(--lime)]"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-12 shrink-0 items-center justify-center border transition ${
                        active
                          ? "border-[#07070c] bg-[#07070c] text-[var(--lime)]"
                          : "border-[var(--line)] text-[var(--mut)]"
                      }`}
                    >
                      <Icon name="qr" className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="dp block truncate text-sm font-semibold">
                        {payment.name}
                      </span>
                      <span className="block text-[11px] opacity-70">
                        <FeeText fee={payment.fee} />
                      </span>
                    </span>
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
          {payError && (
            <p role="alert" className="mt-3 text-xs text-red-400">
              {payError}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handlePay()}
            disabled={pending}
            className="cut-sm dp mt-5 w-full bg-[var(--lime)] py-4 font-bold text-black transition hover:brightness-110 disabled:opacity-60"
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
