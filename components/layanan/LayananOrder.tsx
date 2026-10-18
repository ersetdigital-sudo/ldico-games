"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Service } from "@/data/services";
import { howStepsFor } from "@/data/services";
import { SERVICE_FAQ } from "@/data/faq";
import { feeLabel, paymentsByGroup } from "@/data/payments";
import { HERO_PREFIX, Money, MoneyText } from "@/components/site/Money";
import type { OrderDraft } from "@/lib/order";
import { encodeOrder } from "@/lib/codec";
import { draftStorage } from "@/lib/storage";
import { StepIndicator } from "@/components/site/StepIndicator";

interface LayananOrderProps {
  service: Service;
  /** Nomor/ID yang sudah diketik di beranda (kartu "Bayar cepat"). */
  initialTarget?: string;
  /** Indeks nominal yang sudah dipilih di beranda. */
  initialPackage?: number;
}

/**
 * Area transaksi satu layanan: data tujuan → nominal → metode pembayaran →
 * ringkasan → lanjut checkout.
 *
 * Dipakai halaman kategori PPOB dan halaman detail game, jadi field, nominal,
 * dan ringkasannya selalu ikut data layanan yang bersangkutan.
 */
export function LayananOrder({ service, initialTarget, initialPackage }: LayananOrderProps) {
  const router = useRouter();
  const [packageIndex, setPackageIndex] = useState<number | null>(initialPackage ?? null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() =>
    // Hanya layanan ber-field tunggal yang bisa diisi otomatis; game dengan
    // ID + Zone tetap harus diisi manual supaya tidak salah pasang.
    initialTarget && service.fields.length === 1
      ? { [service.fields[0]]: initialTarget }
      : {},
  );
  const [error, setError] = useState(false);
  const targetRef = useRef<HTMLElement>(null);
  const nominalRef = useRef<HTMLElement>(null);

  const selectedPack = packageIndex === null ? null : service.packages[packageIndex];
  const missingFields = service.fields.filter((label) => !fieldValues[label]?.trim());
  const errorText =
    missingFields.length > 0
      ? `Isi ${missingFields.join(" & ")} dulu.`
      : "Pilih nominal dulu.";

  const handleContinue = () => {
    if (missingFields.length > 0 || !selectedPack) {
      setError(true);
      // Antarkan ke bagian yang kurang — CTA-nya sendiri selalu terlihat,
      // jadi tanpa ini error di layar kecil terasa "jauh dari tombol".
      const section = missingFields.length > 0 ? targetRef.current : nominalRef.current;
      section?.scrollIntoView({ block: "center" });
      return;
    }
    const draft: OrderDraft = {
      k: service.key,
      i: packageIndex!,
      f: service.fields.map((label) => [label, fieldValues[label].trim()]),
    };
    draftStorage.set(draft);
    router.push(`/checkout?o=${encodeOrder(draft)}`);
  };

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 pb-32 lg:grid-cols-3 lg:pb-10">
        <div className="space-y-6 lg:col-span-2">
          <StepIndicator current={1} />

          <section
            ref={targetRef}
            className="cut scroll-mt-24 border border-[var(--line)] bg-[var(--panel)] p-6"
          >
            <h2 className="dp mb-4 text-sm">
              <span className="text-[var(--lime)]">[1]</span> Data tujuan
            </h2>
            <div className={`grid gap-3 ${service.fields.length > 1 ? "sm:grid-cols-2" : ""}`}>
              {service.fields.map((label) => (
                <div key={label}>
                  <label htmlFor={`target-${label}`} className="sr-only">
                    {label}
                  </label>
                  <input
                    id={`target-${label}`}
                    value={fieldValues[label] ?? ""}
                    onChange={(event) => {
                      setFieldValues((prev) => ({ ...prev, [label]: event.target.value }));
                      setError(false);
                    }}
                    placeholder={label}
                    className="inp cut-sm"
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[var(--mut)]">
              Pastikan data benar. Kesalahan input bukan tanggung jawab LDICO.
            </p>
          </section>

          <section
            ref={nominalRef}
            className="cut scroll-mt-24 border border-[var(--line)] bg-[var(--panel)] p-6"
          >
            <h2 className="dp mb-4 text-sm">
              <span className="text-[var(--lime)]">[2]</span> Pilih nominal
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {service.packages.map((pack, index) => (
                <motion.button
                  key={pack.name}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setPackageIndex(index);
                    setError(false);
                  }}
                  aria-pressed={packageIndex === index}
                  className={`option cut-sm border border-[var(--line)] bg-[var(--bg)] p-4 text-left transition ${
                    packageIndex === index ? "is-active" : "hover:border-[var(--lime)]"
                  }`}
                >
                  <span className="dp block text-sm font-bold">
                    <MoneyText text={pack.name} />
                  </span>
                  <span className="mt-1 block text-xs opacity-70">
                    <Money value={pack.price} />
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          <section className="cut border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="dp mb-4 text-sm">Metode pembayaran</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {paymentsByGroup().map(({ group, methods }) => (
                <div key={group}>
                  <h3 className="dp mb-2 text-xs text-[var(--mut)]">{group}</h3>
                  <ul className="flex flex-wrap gap-2 text-xs">
                    {methods.map((method) => (
                      <li
                        key={method.name}
                        className="cut-sm border border-[var(--line)] px-3 py-1.5"
                      >
                        {method.name}
                        <span className="text-[var(--mut)]"> · {feeLabel(method.fee)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--mut)]">
              Metodenya dipilih di langkah checkout setelah ini. Butuh detail?{" "}
              <Link
                href="/pembayaran"
                className="text-[var(--lime)] underline underline-offset-4"
              >
                Lihat panduan pembayaran
              </Link>
              .
            </p>
          </section>

          <section className="cut border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="dp mb-4 text-sm">Deskripsi</h2>
            <p className="text-[var(--mut)]">{service.description}</p>

            <h2 className="dp mt-6 mb-3 text-sm">
              {service.type === "game" ? "Cara top up" : "Cara bayar"}
            </h2>
            <ol className="space-y-2 text-sm">
              {howStepsFor(service).map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="dp text-[var(--lime)]">0{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="cut border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="dp mb-4 text-sm">FAQ</h2>
            {SERVICE_FAQ.map((item, index) => (
              <details
                key={item.q}
                className={`py-3 ${index < SERVICE_FAQ.length - 1 ? "border-b border-[var(--line)]" : ""}`}
              >
                <summary className="flex cursor-pointer justify-between">
                  {item.q}
                  <span className="pl text-[var(--lime)]" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-[var(--mut)]">{item.a}</p>
              </details>
            ))}
          </section>
        </div>

        <aside className="cut glow h-fit bg-[var(--bg)] p-6 lg:sticky lg:top-24">
          <h2 className="dp mb-4 text-sm">Ringkasan pesanan</h2>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--mut)]">Layanan</dt>
              <dd className="text-right">{service.name}</dd>
            </div>
            {service.fields.map((label) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-[var(--mut)]">{label}</dt>
                <dd className="text-right">{fieldValues[label]?.trim() || "-"}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--mut)]">Item</dt>
              <dd className="text-right">{selectedPack?.name ?? "-"}</dd>
            </div>
          </dl>

          <div className="my-4 border-t border-[var(--line)]" />

          <p className="text-xs text-[var(--mut)]">Harga</p>
          <p className="dp text-3xl font-bold">
            {selectedPack ? (
              <Money value={selectedPack.price} prefixClassName={HERO_PREFIX} />
            ) : (
              <span className="text-[var(--mut)]">-</span>
            )}
          </p>
          <p className="mt-1 text-[11px] text-[var(--mut)]">
            Belum termasuk biaya kanal pembayaran, dihitung di checkout.
          </p>

          {error && (
            /* Disembunyikan di mobile: bar lengket di bawah yang menampilkan
               pesan, biar tidak diumumkan dua kali oleh screen reader. */
            <p role="alert" className="mt-3 hidden text-xs text-red-400 lg:block">
              {errorText}
            </p>
          )}

          <button
            type="button"
            onClick={handleContinue}
            className="cut-sm dp mt-5 hidden w-full bg-[var(--lime)] py-4 font-bold text-black transition hover:brightness-110 lg:block"
          >
            Lanjut ke Checkout →
          </button>

          <p className="mt-3 text-center text-[11px] text-[var(--mut)]">
            Belum yakin?{" "}
            <Link
              href="/pembayaran"
              className="underline underline-offset-4 hover:text-[var(--lime)]"
            >
              Lihat panduan pembayaran
            </Link>
          </p>
        </aside>
      </div>

      {/* CTA lengket khusus mobile: tombol & harga selalu terjangkau tanpa scroll. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line)] bg-[var(--bg)] px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        {error && (
          <p role="alert" className="mb-2 text-xs text-red-400">
            {errorText}
          </p>
        )}
        <div className="mx-auto max-w-7xl">
          {/* Harga dirata-kanan: sudut kiri bawah dipakai badge dev Next.js di
              mode development, jadi jangan taruh teks penting di sana. */}
          <div className="mb-2 flex items-baseline justify-end gap-2">
            <span className="text-[11px] text-[var(--mut)]">Harga</span>
            <span className="dp truncate text-base font-bold">
              {selectedPack ? (
                <Money value={selectedPack.price} />
              ) : (
                <span className="text-[var(--mut)]">-</span>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            className="cut-sm dp w-full bg-[var(--lime)] py-3.5 font-bold text-black transition hover:brightness-110"
          >
            Lanjut ke Checkout
          </button>
        </div>
      </div>
    </>
  );
}
