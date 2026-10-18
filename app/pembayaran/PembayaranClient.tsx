"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PAYMENT_BY_NAME,
  PAYMENT_CONFIRMATION,
  PAYMENT_MIN,
  feeOf,
  guideFor,
  paymentsByGroup,
} from "@/data/payments";
import { Money } from "@/components/site/Money";

const DEFAULT_METHOD = "QRIS";
const DEFAULT_AMOUNT = 50000;

/** Biaya ditampilkan "Gratis", sebagai persen, atau sebagai nominal rupiah. */
function FeeValue({ fee }: { fee: number }) {
  if (fee === 0) return <>Gratis</>;
  if (fee < 1) return <>{fee * 100}%</>;
  return <Money value={fee} />;
}

export function PembayaranClient({ initialMethod }: { initialMethod: string | null }) {
  const groups = useMemo(() => paymentsByGroup(), []);
  const [method, setMethod] = useState(
    initialMethod && PAYMENT_BY_NAME[initialMethod] ? initialMethod : DEFAULT_METHOD,
  );
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);

  useEffect(() => {
    if (initialMethod && PAYMENT_BY_NAME[initialMethod]) setMethod(initialMethod);
  }, [initialMethod]);

  const selected = PAYMENT_BY_NAME[method];
  const guide = guideFor(method);
  const simulationTotal = amount + feeOf(method, amount);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-5 pt-10 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-2">
        {groups.map(({ group, methods }) => (
          <div key={group}>
            <h2 className="dp mb-2 text-xs text-[var(--mut)]">{group}</h2>
            <div className="grid grid-cols-2 gap-2">
              {methods.map((payment) => (
                <motion.button
                  key={payment.name}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMethod(payment.name)}
                  aria-pressed={method === payment.name}
                  className={`option cut-sm border border-[var(--line)] bg-[var(--panel)] p-4 text-left transition ${
                    method === payment.name ? "is-active" : "hover:border-[var(--lime)]"
                  }`}
                >
                  <span className="dp block font-bold">{payment.name}</span>
                  <span className="mt-0.5 block text-[11px] opacity-70">
                    Biaya <FeeValue fee={payment.fee} />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="cut glow h-fit bg-[var(--panel)] p-6 sm:p-8 lg:sticky lg:top-24 lg:col-span-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="dp text-3xl font-bold">{selected.name}</h2>
          <span className="dp border border-[var(--line)] px-2.5 py-1 text-xs">
            {selected.group}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="cut-sm border border-[var(--line)] bg-[var(--bg)] p-3">
            <dt className="text-[11px] text-[var(--mut)]">Biaya</dt>
            <dd className="dp mt-1 font-bold">
              <FeeValue fee={selected.fee} />
            </dd>
          </div>
          <div className="cut-sm border border-[var(--line)] bg-[var(--bg)] p-3">
            <dt className="text-[11px] text-[var(--mut)]">Konfirmasi</dt>
            <dd className="dp mt-1 font-bold">{PAYMENT_CONFIRMATION[selected.group]}</dd>
          </div>
          <div className="cut-sm border border-[var(--line)] bg-[var(--bg)] p-3">
            <dt className="text-[11px] text-[var(--mut)]">Min. bayar</dt>
            <dd className="dp mt-1 font-bold">
              <Money value={PAYMENT_MIN[selected.group]} />
            </dd>
          </div>
        </dl>

        <h3 className="dp mt-8 mb-3 text-sm">Cara bayar</h3>
        <ol className="space-y-3 text-sm">
          {guide.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="dp text-[var(--lime)]">0{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>

        <h3 className="dp mt-8 mb-3 text-sm">Simulasi biaya</h3>
        <div className="flex gap-2">
          <label htmlFor="simulation-amount" className="sr-only">
            Nominal transaksi
          </label>
          <input
            id="simulation-amount"
            type="number"
            inputMode="numeric"
            min={0}
            value={amount}
            onChange={(event) => setAmount(Math.max(0, Number(event.target.value) || 0))}
            className="inp cut-sm min-w-0"
          />
          <p className="cut-sm flex shrink-0 items-center gap-1 border border-[var(--line)] bg-[var(--bg)] px-4 text-sm whitespace-nowrap">
            Total:{" "}
            <b className="dp text-[var(--lime)]">
              <Money value={simulationTotal} />
            </b>
          </p>
        </div>

        <Link
          href="/#layanan"
          className="cut-sm dp mt-8 block bg-[var(--lime)] py-4 text-center font-bold text-black transition hover:brightness-110"
        >
          Mulai Top Up
        </Link>
      </div>
    </div>
  );
}
