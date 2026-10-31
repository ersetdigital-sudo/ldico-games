"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/site/Icon";
import { Money } from "@/components/site/Money";
import type { PaymentInfo } from "@/lib/db/types";

const STATUS_LABEL: Record<PaymentInfo["status"], string> = {
  menunggu_cek: "Lagi dicek admin",
  menunggu_bayar: "Menunggu pembayaran",
  sudah_bayar: "Pembayaran dicek admin",
  sukses: "Sukses",
  dibatalkan: "Dibatalkan",
};

const STATUS_CLASS: Record<PaymentInfo["status"], string> = {
  menunggu_cek: "bg-yellow-400 text-black",
  menunggu_bayar: "bg-yellow-400 text-black",
  sudah_bayar: "bg-[var(--cy)] text-black",
  sukses: "bg-[var(--lime)] text-black",
  dibatalkan: "bg-red-500 text-white",
};

const two = (value: number) => String(value).padStart(2, "0");

export function InvoiceStatus({
  payment,
  sn = null,
}: {
  payment: PaymentInfo;
  sn?: string | null;
}) {
  const [left, setLeft] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (payment.status !== "menunggu_bayar" || !payment.expires_at) {
      setLeft(null);
      return;
    }
    const end = new Date(payment.expires_at).getTime();
    const tick = () => setLeft(Math.max(0, Math.ceil((end - Date.now()) / 1000)));
    tick();
    const iv = window.setInterval(tick, 1000);
    return () => window.clearInterval(iv);
  }, [payment.status, payment.expires_at]);

  const expired = payment.status === "menunggu_bayar" && left !== null && left <= 0;
  const status = expired ? "dibatalkan" : payment.status;
  const timer = left === null ? "--:--" : `${two(Math.floor(left / 60))}:${two(left % 60)}`;
  const wa = (payment.wa_cs || "").replace(/\D/g, "");
  const waText = `Halo CS ${payment.nama_brand}, saya ingin konfirmasi pembayaran.\nInvoice: ${payment.ref}\nProduk: ${payment.nama_produk || payment.nama_layanan}\nTujuan: ${payment.nomor_tujuan}\nTotal: ${payment.total !== null ? payment.total : "belum ditetapkan"}\n\nBukti transfer saya lampirkan.`;
  const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(waText)}` : null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(payment.ref);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setNotice("Invoice tidak bisa disalin otomatis.");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p className="dp text-sm text-[var(--lime)]">Invoice</p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className={`dp inline-flex px-3 py-1.5 text-xs ${STATUS_CLASS[status]}`}>
            {STATUS_LABEL[status]}
          </span>
          <h1 className="dp mt-3 break-all text-3xl font-bold">{payment.ref}</h1>
          <p className="mt-1 text-sm text-[var(--mut)]">
            {payment.nama_produk || payment.nama_layanan} · {payment.nomor_tujuan}
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="cut-sm border border-[var(--line)] px-3 py-2 text-xs text-[var(--mut)] transition hover:border-[var(--lime)] hover:text-[var(--lime)]"
        >
          {copied ? "Tersalin" : "Salin Invoice"}
        </button>
      </div>

      <section className="cut glow mt-6 bg-[var(--bg)] p-6 md:p-8">
        <p className="text-xs text-[var(--mut)]">Total bayar</p>
        <p className="dp text-4xl font-bold">
          {payment.total !== null ? <Money value={payment.total} /> : "Belum ditetapkan"}
        </p>

        {status === "menunggu_cek" && (
          <div className="cut-sm mt-5 border border-yellow-400/40 bg-yellow-400/[0.06] p-4 text-sm text-yellow-200">
            Tagihan sedang dicek admin. Nominal dan link bayar dikirim ke WhatsApp kamu.
          </div>
        )}

        {status === "menunggu_bayar" && !expired && (
          <>
            <div className="cut-sm mt-5 border border-[var(--line)] p-5">
              {payment.tipe_metode === "qr" ? (
                <div className="text-center">
                  <p className="text-sm text-[var(--mut)]">Scan QRIS di bawah</p>
                  {payment.qris_image_url ? (
                    <a href={payment.qris_image_url} target="_blank" rel="noreferrer" className="mt-3 block">
                      <img
                        src={payment.qris_image_url}
                        alt="QRIS pembayaran"
                        className="mx-auto h-auto w-full max-w-[300px] bg-white p-2"
                      />
                    </a>
                  ) : null}
                  <p className="mt-3 text-xs text-[var(--mut)]">
                    Masukkan nominal persis <b className="text-white">{payment.total !== null ? <Money value={payment.total} /> : "-"}</b>.
                  </p>
                </div>
              ) : payment.tipe_metode === "va" ? (
                <div className="text-center">
                  <p className="text-sm text-[var(--mut)]">{payment.metode_bayar}</p>
                  <p className="dp mt-2 text-2xl font-bold tracking-wider">
                    8808 {payment.ref.slice(-8, -4)} {payment.ref.slice(-4)} 21
                  </p>
                </div>
              ) : (
                <p className="text-center text-sm text-[var(--mut)]">
                  Selesaikan pembayaran lewat <b className="text-white">{payment.metode_bayar}</b>.
                </p>
              )}
            </div>
            <div className="cut-sm mt-4 flex items-center justify-between bg-yellow-400 px-4 py-3 text-black">
              <span className="dp flex items-center gap-2 text-xs">
                <Icon name="clock" className="h-4 w-4" />
                Bayar sebelum
              </span>
              <span className="dp text-xl font-bold">{timer}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setNotice("Pembayaran kamu sedang dicek admin. Simpan invoice ini.");
                if (waHref) window.open(waHref, "_blank", "noopener,noreferrer");
              }}
              className="cut-sm dp mt-5 w-full bg-[var(--lime)] py-3.5 font-bold text-black transition hover:brightness-110"
            >
              Saya Sudah Bayar
            </button>
          </>
        )}

        {status === "sudah_bayar" && (
          <div className="cut-sm mt-5 border border-[var(--cy)]/40 bg-[var(--cy)]/[0.08] p-4 text-sm text-[var(--cy)]">
            Pembayaran sudah dikonfirmasi. Admin sedang memproses pesanan kamu.
          </div>
        )}

        {status === "sukses" && (
          <div className="cut-sm mt-5 border border-[var(--lime)]/40 bg-[var(--lime)]/[0.08] p-4 text-sm">
            <p className="dp text-[var(--lime)]">Transaksi sukses.</p>
            {sn ? (
              <p className="mt-2 text-[var(--fg)]">
                {/PLN/i.test(payment.nama_layanan) ? "Token" : "Serial number"}:{" "}
                <b className="font-mono">{sn}</b>
              </p>
            ) : null}
          </div>
        )}

        {status === "dibatalkan" && (
          <div className="cut-sm mt-5 border border-red-400/40 bg-red-400/[0.06] p-4 text-sm text-red-300">
            Invoice dibatalkan{expired ? " karena waktu habis" : ""}. Silakan buat pesanan baru.
          </div>
        )}

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--mut)]">Metode</dt>
            <dd className="font-semibold">{payment.metode_bayar || "-"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--mut)]">Biaya admin</dt>
            <dd className="font-semibold">
              <Money value={payment.biaya_admin} />
            </dd>
          </div>
          {payment.potongan > 0 && (
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--mut)]">Potongan</dt>
              <dd className="font-semibold text-[var(--lime)]">
                −<Money value={payment.potongan} />
              </dd>
            </div>
          )}
          {payment.expires_at && status === "menunggu_bayar" && (
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--mut)]">Batas bayar</dt>
              <dd className="font-semibold">
                {new Date(payment.expires_at).toLocaleString("id-ID", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </dd>
            </div>
          )}
        </dl>

        {notice ? (
          <p className="mt-4 text-center text-sm text-[var(--lime)]" aria-live="polite">
            {notice}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="cut-sm dp flex-1 bg-[var(--lime)] py-3 text-center font-bold text-black"
            >
              Konfirmasi via WhatsApp
            </a>
          ) : null}
          <Link
            href={`/lacak?no=${encodeURIComponent(payment.ref)}`}
            className="cut-sm dp flex-1 border border-[var(--line)] py-3 text-center font-bold transition hover:border-[var(--lime)]"
          >
            Lacak Pesanan
          </Link>
        </div>
        <Link
          href="/"
          className="mt-3 block text-center text-sm text-[var(--mut)] underline underline-offset-4"
        >
          Kembali ke beranda
        </Link>
      </section>
    </main>
  );
}
