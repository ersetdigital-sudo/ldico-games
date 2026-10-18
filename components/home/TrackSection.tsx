"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Contoh transaksi terakhir supaya form lacak bisa langsung dicoba. */
const RECENT = [
  { inv: "LDC-28819", detail: "172 Diamond ML", status: "Sukses", tone: "var(--lime)" },
  { inv: "LDC-28818", detail: "Token PLN 50rb", status: "Sukses", tone: "var(--lime)" },
  { inv: "LDC-28817", detail: "325 UC PUBG", status: "Diproses", tone: "var(--cy)" },
];

/**
 * Satu kartu, satu fungsi: cek status. Jaminan layanan pindah ke pita
 * kepercayaan sebelum FAQ supaya di sini tidak ada dua hal yang berebut fokus.
 */
export function TrackSection() {
  const router = useRouter();
  const [invoiceNumber, setInvoiceNumber] = useState("");

  return (
    <section id="cek" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-20">
      <div className="cut border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8">
        <h2 className="dp text-3xl font-bold">Cek status transaksi</h2>
        <p className="mt-2 text-sm text-[var(--mut)]">
          Masukkan nomor invoice dari struk atau halaman pembayaran kamu.
        </p>

        <form
          className="mt-6 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!invoiceNumber.trim()) return;
            router.push(`/lacak?no=${encodeURIComponent(invoiceNumber.trim())}`);
          }}
        >
          <label htmlFor="invoice-lookup" className="sr-only">
            Nomor invoice
          </label>
          <input
            id="invoice-lookup"
            value={invoiceNumber}
            onChange={(event) => setInvoiceNumber(event.target.value)}
            placeholder="Nomor invoice, mis. LDC-28819"
            className="cut-sm min-w-0 flex-1 border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none focus:border-[var(--lime)]"
          />
          <button
            type="submit"
            className="cut-sm dp bg-white px-5 font-bold text-black transition hover:bg-[var(--lime)]"
          >
            Cek
          </button>
        </form>

        <ul className="mt-8 space-y-3 text-sm">
          {RECENT.map((item, index) => (
            <li
              key={item.inv}
              className={`flex justify-between gap-4 ${
                index < RECENT.length - 1 ? "border-b border-[var(--line)] pb-3" : ""
              }`}
            >
              <span>
                {item.inv} · {item.detail}
              </span>
              <span style={{ color: item.tone }}>{item.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
