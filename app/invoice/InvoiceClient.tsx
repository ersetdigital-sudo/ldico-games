"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DEFAULT_SERVICE_KEY, SERVICES } from "@/data/services";
import { formatDateTime } from "@/lib/format";
import {
  ORDER_STATUS_CLASS,
  ORDER_STATUS_LABEL,
  ORDER_STEPS,
  ORDER_STEP_HINTS,
  type InvoiceRecord,
} from "@/lib/order";
import { createFallbackInvoice, findInvoice } from "@/lib/invoice-lookup";
import { checkStorage, historyStorage, invoiceStorage } from "@/lib/storage";
import { StepIndicator } from "@/components/site/StepIndicator";
import { HERO_PREFIX, Money } from "@/components/site/Money";
import { Icon } from "@/components/site/Icon";

const PAYMENT_WINDOW_MS = 30 * 60 * 1000;
const PAYMENT_WINDOW_SECONDS = PAYMENT_WINDOW_MS / 1000;
/** Sisa waktu di bawah ini ditandai merah — pengingat halus, bukan alarm. */
const URGENT_SECONDS = 5 * 60;

const two = (value: number) => String(value).padStart(2, "0");

/** Detik -> "mm:ss". */
const clock = (seconds: number) => `${two(Math.floor(seconds / 60))}:${two(seconds % 60)}`;

/** Jam:menit dari timestamp, contoh "13.42". */
const hhmm = (timestamp: number) =>
  new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(timestamp);

/** Lama satu pengecekan ke penyedia pembayaran (simulasi round-trip). */
const VERIFY_MS = 2200;

/**
 * Jeda settlement QRIS.
 *
 * Selama jeda ini sejak pengecekan pertama, hasil pengecekan selalu "belum
 * masuk". Karena itu tombol cek tidak pernah langsung menyatakan lunas —
 * hasilnya bertahap seperti konfirmasi QRIS sungguhan.
 */
const SETTLE_MS = 60 * 1000;

type CheckPhase = "idle" | "checking" | "pending" | "expired" | "paid";

/**
 * Keterangan hasil pengecekan status.
 *
 * Pengecekan cuma melaporkan apa yang benar-benar ditemukan, jadi "belum
 * masuk" itu hasil yang normal — bukan error. Nadanya karena itu informasi
 * (kuning, senada badge "Menunggu Pembayaran"), bukan peringatan merah.
 */
function CheckNotice({ phase, lastChecked }: { phase: CheckPhase; lastChecked: number | null }) {
  if (phase === "idle" || phase === "paid") return null;

  if (phase === "checking") {
    return (
      <p role="status" className="mt-3 flex items-center gap-2 text-xs text-[var(--mut)]">
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--mut)]/30 border-t-[var(--lime)] motion-reduce:animate-none"
        />
        Menghubungi penyedia pembayaran…
      </p>
    );
  }

  const over = phase === "expired";

  return (
    <div
      role="status"
      className={`cut-sm mt-4 border p-4 ${
        over ? "border-red-400/40 bg-red-400/[0.06]" : "border-yellow-400/40 bg-yellow-400/[0.06]"
      }`}
    >
      <p className={`dp flex items-center gap-2 text-xs ${over ? "text-red-400" : "text-yellow-300"}`}>
        <Icon name="clock" className="h-4 w-4 shrink-0" />
        {over ? "Waktu Pembayaran Habis" : "Menunggu Konfirmasi"}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-[var(--mut)]">
        {over
          ? "Batas bayar invoice ini sudah lewat, jadi pembayarannya tidak bisa kami proses lagi. Buat pesanan baru untuk melanjutkan."
          : "Kalau kamu baru saja bayar, konfirmasi QRIS biasanya makan 1–2 menit. Dana belum tercatat di sisi kami, jadi coba cek lagi sebentar lagi — statusnya berubah begitu pembayaran masuk."}
      </p>
      {lastChecked !== null && (
        <p className="mt-2.5 text-[11px] text-[var(--mut)]">Terakhir dicek {hhmm(lastChecked)}</p>
      )}
    </div>
  );
}

/**
 * Tombol salin dengan tiga keadaan (diam / tersalin / gagal).
 * Dipakai untuk nomor invoice dan kode pembayaran, jadi nilainya lewat props.
 */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("ok");
    } catch {
      // clipboard butuh secure context; kalau gagal, kodenya tetap terlihat
      // di layar supaya bisa diblok manual.
      setState("fail");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={state === "ok" ? `${label} — tersalin` : label}
      className={`cut-sm inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-[11px] transition ${
        state === "ok"
          ? "border-[var(--lime)] text-[var(--lime)]"
          : "border-[var(--line)] text-[var(--mut)] hover:border-[var(--lime)] hover:text-[var(--lime)]"
      }`}
    >
      <span aria-hidden="true" className="inline-flex items-center gap-1.5">
        <Icon name={state === "ok" ? "check" : "copy"} className="h-3.5 w-3.5" />
        {state === "ok" ? "Tersalin" : state === "fail" ? "Salin manual" : "Salin"}
      </span>
    </button>
  );
}

/**
 * Riwayat status vertikal.
 *
 * Garis penghubung yang "terisi" setiap kali status naik adalah satu-satunya
 * animasi di halaman ini — supaya perubahannya terbaca sebagai progres, bukan
 * sebagai hiasan. `key` yang menyertakan `step` membuat garis digambar ulang
 * tepat saat statusnya berubah.
 */
function StatusTimeline({ step, reduceMotion }: { step: number; reduceMotion: boolean }) {
  return (
    <ol className="mt-4">
      {ORDER_STEPS.map((label, index) => {
        const done = index <= step;
        const isLast = index === ORDER_STEPS.length - 1;
        const isCurrent = index === step && !isLast;

        return (
          <li key={label} className={`relative pl-10 ${isLast ? "" : "pb-6"}`}>
            {!isLast && (
              <motion.span
                key={`${index}-${step}`}
                aria-hidden="true"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                className={`absolute top-[26px] bottom-0 left-[11.5px] w-px origin-top ${
                  index < step ? "bg-[var(--lime)]" : "bg-[var(--line)]"
                }`}
              />
            )}
            <span
              className={`absolute top-0 left-0 grid h-6 w-6 place-items-center ${
                done
                  ? `bg-[var(--lime)] text-black ${isCurrent ? "blink" : ""}`
                  : "border border-[var(--line)] text-[11px] text-[var(--mut)]"
              }`}
            >
              {done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.4} /> : index + 1}
            </span>
            <p className={`dp pt-0.5 text-sm leading-tight ${done ? "" : "text-[var(--mut)]"}`}>
              {label}
            </p>
            <p className="mt-1 text-xs leading-snug text-[var(--mut)]">{ORDER_STEP_HINTS[index]}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function InvoiceClient({
  initialInvoice,
  initialInvoiceNumber,
}: {
  initialInvoice: InvoiceRecord | null;
  initialInvoiceNumber: string | null;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const [invoice, setInvoice] = useState<InvoiceRecord>(
    initialInvoice ?? createFallbackInvoice(initialInvoiceNumber ?? undefined),
  );
  const [step, setStep] = useState(initialInvoice?.st ?? 0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [phase, setPhase] = useState<CheckPhase>("idle");
  const [lastChecked, setLastChecked] = useState<number | null>(null);

  // Kapan pelanggan pertama kali menekan cek — titik awal jeda settlement.
  // Karena itu pengecekan pertama selalu jujur menjawab "belum masuk".
  const firstCheckAt = useRef<number | null>(null);
  const verifyTimer = useRef<number | null>(null);
  const walkTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (verifyTimer.current !== null) window.clearTimeout(verifyTimer.current);
      if (walkTimer.current !== null) window.clearInterval(walkTimer.current);
    },
    [],
  );

  // Lengkapi data dari penyimpanan perangkat kalau URL-nya tidak lengkap.
  useEffect(() => {
    if (initialInvoice) {
      historyStorage.save(initialInvoice);
      return;
    }
    const resolved =
      (initialInvoiceNumber ? findInvoice(initialInvoiceNumber) : null) ??
      invoiceStorage.get() ??
      createFallbackInvoice(initialInvoiceNumber ?? undefined);
    setInvoice(resolved);
    setStep(resolved.st);
  }, [initialInvoice, initialInvoiceNumber]);

  // Hitung mundur masa berlaku pembayaran.
  useEffect(() => {
    const expiresAt = invoice.ts + PAYMENT_WINDOW_MS;
    const tick = () => setSecondsLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [invoice.ts]);

  const service = SERVICES[invoice.k] ?? SERVICES[DEFAULT_SERVICE_KEY];
  const pack = service.packages[invoice.i] ?? service.packages[0];
  const expired = secondsLeft !== null && secondsLeft === 0 && step === 0;
  const paid = step > 0;
  const urgent = secondsLeft !== null && secondsLeft <= URGENT_SECONDS;

  const isVirtualAccount = invoice.m.includes("VA");
  const isRetail = ["Alfamart", "Indomaret"].includes(invoice.m);
  const paymentCode =
    (isVirtualAccount ? "8808" : "") + invoice.inv.replace(/\D/g, "").padEnd(12, "7");

  const statusLabel = expired ? "Kedaluwarsa" : ORDER_STATUS_LABEL[step];
  const statusClass = expired ? "bg-red-500 text-white" : ORDER_STATUS_CLASS[step];

  const remaining = secondsLeft ?? 0;
  const progress = secondsLeft === null ? 1 : Math.max(0, Math.min(1, remaining / PAYMENT_WINDOW_SECONDS));
  const barClass = urgent ? "bg-red-400" : "bg-[var(--lime)]";

  // Panduan bayar hanya relevan sebelum dibayar.
  const paySteps =
    invoice.m === "QRIS"
      ? [
          "Buka aplikasi bank atau e-wallet, pilih menu Scan QRIS",
          "Scan poster di atas, lalu isi nominalnya sesuai total tagihan",
          "Cek nama merchant yang muncul sebelum menyelesaikan pembayaran",
          "Selesaikan pembayaran, lalu tekan Cek status pembayaran",
        ]
      : isVirtualAccount
        ? [
            "Buka m-banking, pilih Transfer ke Virtual Account",
            "Masukkan nomor Virtual Account di atas",
            "Pastikan nama penerimanya LDICO Games",
            "Bayar sesuai total tagihan",
          ]
        : isRetail
          ? [
              `Datang ke kasir ${invoice.m}`,
              "Sebutkan mau bayar LDICO Games",
              "Tunjukkan kode pembayaran di atas",
              "Bayar sesuai total tagihan",
            ]
          : [
              `Buka aplikasi ${invoice.m}`,
              "Pilih menu bayar / kirim ke LDICO Games",
              "Konfirmasi tagihan yang muncul",
              "Selesaikan pembayaran",
            ];

  const checkPayment = () => {
    if (phase === "checking") return;
    setPhase("checking");

    verifyTimer.current = window.setTimeout(() => {
      const now = Date.now();

      // Titik awal jeda settlement: pengecekan pertama invoice ini, walau
      // halaman sudah di-reload.
      const stored = firstCheckAt.current ?? checkStorage.get(invoice.inv);
      if (stored !== null) {
        firstCheckAt.current = stored;
      } else {
        firstCheckAt.current = now;
        checkStorage.mark(invoice.inv, now);
      }

      setLastChecked(now);

      // Masa berlaku pembayaran sudah habis dan dana belum tercatat.
      if (expired) {
        setPhase("expired");
        return;
      }

      // Belum lunas: invoice demo yang belum dibayar, atau jeda settlement
      // belum lewat. Ini hasil yang normal, bukan kegagalan.
      if (!paid && now - firstCheckAt.current < SETTLE_MS) {
        setPhase("pending");
        return;
      }

      // Dana tercatat. Status berjalan bertahap supaya progresnya bisa diikuti.
      setPhase("paid");
      let current = Math.max(1, step);
      setStep(current);

      walkTimer.current = window.setInterval(() => {
        current += 1;
        setStep(current);
        if (current >= 3) {
          if (walkTimer.current !== null) window.clearInterval(walkTimer.current);
          walkTimer.current = null;
          historyStorage.save({ ...invoice, st: 3 });
        }
      }, 800);
    }, VERIFY_MS);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <StepIndicator current={3} />

      <article className="cut overflow-hidden border border-[var(--line)] bg-[var(--panel)]">
        <header className="scan flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-b border-[var(--line)] px-6 py-5 sm:px-8">
          <div>
            <p className="text-[11px] text-[var(--mut)]">Nomor invoice</p>
            <div className="mt-1.5 flex items-center gap-3">
              <h1 className="dp text-lg font-bold tracking-wide">{invoice.inv}</h1>
              <CopyButton value={invoice.inv} label="Salin nomor invoice" />
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span role="status" className={`dp px-2.5 py-1 text-[11px] ${statusClass}`}>
              {statusLabel}
            </span>
            <p className="text-[11px] text-[var(--mut)]">Dibuat {formatDateTime(invoice.ts)}</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section className="border-b border-[var(--line)] p-6 sm:p-8 md:border-b-0 md:border-r">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] text-[var(--mut)]">Total tagihan</p>
                <p className="dp mt-1 text-4xl leading-none font-bold sm:text-5xl">
                  <Money value={invoice.total} prefixClassName={HERO_PREFIX} />
                </p>
              </div>
              {invoice.disc > 0 && (
                <p className="dp bg-[var(--lime)] px-2.5 py-1 text-[11px] text-black">
                  hemat <Money value={invoice.disc} />
                </p>
              )}
            </div>

            <div className="mt-5">
              {paid ? (
                <p className="flex items-center gap-2 text-xs text-[var(--lime)]">
                  <Icon name="check" className="h-4 w-4 shrink-0" strokeWidth={2.4} />
                  Pembayaran diterima
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-[var(--mut)]">
                      {expired ? "Waktu pembayaran habis" : "Batas waktu bayar"}
                    </span>
                    <span className={`dp ${urgent ? "text-red-400" : "text-[var(--lime)]"}`}>
                      {secondsLeft === null ? "--:--" : clock(remaining)}
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full bg-[var(--line)]" aria-hidden="true">
                    <div
                      className={`h-full transition-[width] duration-1000 ease-linear motion-reduce:transition-none ${barClass}`}
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {step === 3 && invoice.token && (
              <div className="cut-sm mt-5 border border-[var(--lime)] bg-[var(--bg)] p-4">
                <p className="text-[11px] text-[var(--mut)]">Token listrik kamu</p>
                <p className="dp mt-1 text-2xl font-bold tracking-wider text-[var(--lime)]">
                  {invoice.token}
                </p>
              </div>
            )}

            <div className="mt-7 border-t border-[var(--line)] pt-6">
              <h2 className="dp text-sm">
                {paid ? "Metode pembayaran" : "Bayar lewat"}{" "}
                <span className="text-[var(--lime)]">{invoice.m}</span>
              </h2>

              {paid ? (
                <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[var(--mut)]">
                  <Icon name="lock" className="mt-px h-4 w-4 shrink-0" />
                  Kode pembayaran tidak ditampilkan lagi karena invoice ini sudah lunas.
                </p>
              ) : invoice.m === "QRIS" ? (
                <div className="mt-4">
                  <div className="cut-sm w-full max-w-[360px] overflow-hidden border border-[var(--line)]">
                    <Image
                      src="/images/qris.jpg"
                      alt="Poster QRIS untuk membayar invoice ini"
                      width={1135}
                      height={1600}
                      sizes="(max-width: 640px) 300px, 360px"
                      loading="eager"
                      className="h-auto w-full"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[var(--mut)]">
                    Scan pakai aplikasi bank atau e-wallet apa pun. Sebelum membayar, cocokkan nama
                    merchant yang muncul di aplikasi kamu dengan poster di atas.
                  </p>
                </div>
              ) : (
                <div className="cut-sm mt-4 border border-[var(--line)] bg-[var(--bg)] p-4">
                  <p className="text-[11px] text-[var(--mut)]">
                    {isVirtualAccount
                      ? "Nomor Virtual Account"
                      : isRetail
                        ? "Kode pembayaran"
                        : "Nomor tujuan / link bayar"}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="dp text-xl font-bold tracking-[0.08em] sm:text-2xl">
                      {isVirtualAccount || isRetail
                        ? paymentCode
                        : `Dibuka di aplikasi ${invoice.m}`}
                    </span>
                    {(isVirtualAccount || isRetail) && (
                      <CopyButton value={paymentCode} label="Salin kode pembayaran" />
                    )}
                  </div>
                </div>
              )}

              {!paid && (
                <ol className="mt-5 grid gap-2.5 text-sm text-[var(--mut)]">
                  {paySteps.map((text, index) => (
                    <li key={text} className="flex gap-3">
                      <span className="dp mt-0.5 grid h-5 w-5 shrink-0 place-items-center border border-[var(--line)] text-[10px] text-[var(--lime)]">
                        {index + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <button
              type="button"
              onClick={checkPayment}
              disabled={phase === "checking" || step >= 3}
              className="cut-sm dp mt-7 flex w-full items-center justify-center gap-2.5 bg-[var(--lime)] py-3.5 font-bold text-black transition hover:brightness-110 disabled:opacity-60"
            >
              {phase === "checking" ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/25 border-t-black motion-reduce:animate-none"
                  />
                  Mengecek status
                </>
              ) : step >= 3 ? (
                <>
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.4} />
                  Pembayaran berhasil
                </>
              ) : (
                "Cek status pembayaran"
              )}
            </button>

            <CheckNotice phase={phase} lastChecked={lastChecked} />
          </section>

          <section className="p-6 sm:p-8">
            <h2 className="dp text-sm">Detail pesanan</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row label="Layanan" value={service.name} />
              <Row label="Item" value={pack.name} />
              {invoice.f.map(([label, value]) => (
                <Row key={label} label={label} value={value} />
              ))}
              <div className="my-3 border-t border-[var(--line)]" />
              <Row label="Harga" value={<Money value={pack.price} />} />
              <Row label="Biaya" value={<Money value={invoice.fee} />} />
              {invoice.disc > 0 && (
                <Row
                  label="Diskon"
                  value={
                    <>
                      −<Money value={invoice.disc} />
                    </>
                  }
                  valueClassName="text-[var(--lime)]"
                />
              )}
              <Row
                label="Total"
                value={<Money value={invoice.total} />}
                valueClassName="dp text-base font-bold"
              />
            </dl>

            <h2 className="dp mt-9 text-sm">Status pesanan</h2>
            <StatusTimeline step={step} reduceMotion={reduceMotion} />
          </section>
        </div>
      </article>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={`/lacak?no=${invoice.inv}`}
          className="cut-sm dp border border-[var(--lime)] px-6 py-3 text-[var(--lime)] transition hover:bg-[var(--lime)] hover:text-black"
        >
          Lacak pesanan →
        </Link>
        <Link
          href="/"
          className="cut-sm dp border border-[var(--line)] px-6 py-3 transition hover:border-[var(--lime)]"
        >
          Belanja lagi
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="cut-sm dp border border-[var(--line)] px-6 py-3 transition hover:border-[var(--lime)]"
        >
          Simpan / cetak
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[var(--mut)]">{label}</dt>
      <dd className={`text-right ${valueClassName}`}>{value}</dd>
    </div>
  );
}
