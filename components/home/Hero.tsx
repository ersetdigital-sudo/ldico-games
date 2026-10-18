"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SERVICES, type Service } from "@/data/services";
import { servicePath } from "@/data/categories";
import { Money, MoneyText } from "@/components/site/Money";
import { Icon } from "@/components/site/Icon";
import { ServiceThumb } from "@/components/site/ServiceThumb";
import { serviceIcon } from "@/lib/service-icon";

/**
 * Layanan yang bisa dipesan langsung dari kartu "Bayar cepat". Empat saja —
 * kartu ini jalur pintas, daftar lengkapnya ada di grid "Pilih layanan".
 */
const QUICK_TABS = [
  { key: "pln", label: "PLN" },
  { key: "pulsa", label: "Pulsa" },
  { key: "data", label: "Data" },
  { key: "ewallet", label: "E-Wallet" },
] as const;

/** Placeholder contoh format nomor; labelnya sendiri diambil dari data layanan. */
const QUICK_PLACEHOLDER: Record<string, string> = {
  pln: "12 digit nomor meter",
  pulsa: "08xx xxxx xxxx",
  data: "08xx xxxx xxxx",
  ewallet: "08xx xxxx xxxx",
};

const QUICK_SERVICES = QUICK_TABS.map((tab) => SERVICES[tab.key]);

/** Promo yang dipajang di bawah kartu bayar cepat. */
const PROMO = SERVICES.pln;

const STATS = [
  { value: "100+", label: "game & voucher" },
  { value: "3 dtk", label: "rata-rata proses" },
  { value: "4.9", label: "rating pengguna" },
];

export function Hero() {
  const reduceMotion = useReducedMotion();
  const [activeKey, setActiveKey] = useState<string>(QUICK_TABS[0].key);
  const [target, setTarget] = useState("");
  const [packIndex, setPackIndex] = useState<number | null>(null);

  const service: Service = QUICK_SERVICES.find((item) => item.key === activeKey) ?? PROMO;
  const label = service.fields[0];
  const previewPackages = service.packages.slice(0, 3);

  // Nomor dan nominal yang sudah dipilih ikut dibawa ke halaman layanan —
  // halaman kategori/detail membacanya lewat ?t= dan ?i=.
  const orderParams = new URLSearchParams();
  if (target.trim()) orderParams.set("t", target.trim());
  if (packIndex !== null) orderParams.set("i", String(packIndex));
  const orderQuery = orderParams.toString();
  const orderHref = `${servicePath(service)}${orderQuery ? `?${orderQuery}` : ""}`;

  const selectTab = (key: string) => {
    setActiveKey(key);
    setTarget("");
    setPackIndex(null);
  };

  // Satu urutan animasi saat halaman dibuka — bukan animasi per section.
  // Catatan: nilai `hidden` harus sama di server & client (initial style yang
  // dipakai saat SSR), jadi preferensi reduced-motion hanya mengubah durasi
  // transisi — bukan state awalnya. Kalau tidak, React melaporkan hydration mismatch.
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.07 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.45, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-[var(--vio)] opacity-30 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-16 pb-20 lg:grid-cols-12">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-7"
        >
          <motion.p
            variants={item}
            className="dp mb-5 flex items-center gap-2 text-sm text-[var(--lime)]"
          >
            <span className="blink h-2 w-2 rounded-full bg-[var(--lime)]" aria-hidden="true" />
            Top Up Game &amp; PPOB 24 Jam
          </motion.p>

          <motion.h1
            variants={item}
            id="hero-title"
            className="dp text-5xl leading-[.95] font-bold sm:text-6xl lg:text-7xl"
          >
            Level up{" "}
            <br />
            tanpa{" "}
            <span className="text-transparent" style={{ WebkitTextStroke: "2px #C6FF00" }}>
              nunggu.
            </span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-[var(--mut)]">
            Top up 100+ game dan bayar semua tagihan digital dari satu tempat. Diamond, UC, pulsa,
            token PLN, sampai BPJS, semua diproses otomatis.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#layanan"
              className="cut dp bg-[var(--lime)] px-7 py-4 font-bold text-black transition hover:brightness-110"
            >
              Pilih Layanan →
            </Link>
            <Link
              href="/#cek"
              className="cut dp border border-[var(--line)] bg-[var(--panel)] px-7 py-4 font-semibold transition hover:border-[var(--lime)]"
            >
              Cek Pesanan
            </Link>
          </motion.div>

          <motion.dl
            variants={item}
            className="mt-12 grid max-w-md grid-cols-3 divide-x divide-[var(--line)] border-y border-[var(--line)]"
          >
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={index === 0 ? "py-4 pr-4" : index === 2 ? "py-4 pl-4" : "py-4 px-4"}
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="dp block text-2xl font-bold">{stat.value}</span>
                  <span className="text-xs text-[var(--mut)]">{stat.label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid content-start gap-4 lg:col-span-5"
        >
          <motion.div
            variants={item}
            className="cut border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="dp text-xl font-bold">Bayar cepat</h2>
              <span className="dp flex items-center gap-2 text-[11px] text-[var(--lime)]">
                <span className="blink h-2 w-2 rounded-full bg-[var(--lime)]" aria-hidden="true" />
                Online
              </span>
            </div>

            <div role="group" aria-label="Pilih jenis layanan" className="mt-4 grid grid-cols-4 gap-1.5">
              {QUICK_TABS.map((tab) => {
                const active = activeKey === tab.key;
                const tabService = SERVICES[tab.key];
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => selectTab(tab.key)}
                    aria-pressed={active}
                    className={`option cut-sm border border-[var(--line)] px-1 py-2.5 text-center transition ${
                      active ? "is-active" : "hover:border-[var(--lime)]"
                    }`}
                  >
                    <Icon
                      name={serviceIcon(tabService)}
                      className="mx-auto h-4 w-4"
                    />
                    <span className="dp mt-1.5 block text-[11px] leading-tight font-semibold">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <label htmlFor="quick-target" className="mt-5 mb-2 block text-sm">
              {label}
            </label>
            <div className="flex items-center gap-2">
              <ServiceThumb service={service} size={48} className="h-12 w-12" />
              <input
                id="quick-target"
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                placeholder={QUICK_PLACEHOLDER[service.key]}
                inputMode="numeric"
                className="cut-sm min-w-0 flex-1 border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5 outline-none focus:border-[var(--lime)]"
              />
            </div>

            <p className="dp mt-5 mb-2 text-[11px] text-[var(--mut)]">Pilih nominal</p>
            <div className="grid grid-cols-3 gap-2">
              {previewPackages.map((pack, index) => (
                <button
                  key={pack.name}
                  type="button"
                  onClick={() => setPackIndex(packIndex === index ? null : index)}
                  aria-pressed={packIndex === index}
                  className={`option cut-sm border border-[var(--line)] bg-[var(--bg)] px-2 py-2.5 text-center transition ${
                    packIndex === index ? "is-active" : "hover:border-[var(--lime)]"
                  }`}
                >
                  <span className="dp block truncate text-xs font-bold">
                    <MoneyText text={pack.name} />
                  </span>
                  <span className="block truncate text-[10px] opacity-70">
                    <Money value={pack.price} />
                  </span>
                </button>
              ))}
            </div>

            <Link
              href={orderHref}
              className="cut-sm dp mt-5 block bg-[var(--lime)] py-3.5 text-center font-bold text-black transition hover:brightness-110"
            >
              Lanjutkan →
            </Link>

            <p className="mt-4 flex items-center gap-2 text-xs text-[var(--mut)]">
              <span className="blink h-1.5 w-1.5 rounded-full bg-[var(--lime)]" aria-hidden="true" />
              12.481 transaksi sukses hari ini
            </p>
          </motion.div>

          <motion.div variants={item}>
            <Link
              href={servicePath(PROMO)}
              className="cut block bg-gradient-to-br from-[var(--vio)] to-[#4c1d95] p-5 transition hover:brightness-110 sm:p-6"
            >
              <p className="dp text-xs opacity-80">Promo PPOB</p>
              <p className="dp mt-2 text-3xl font-bold">
                Cashback 10%
                <br />
                Token PLN
              </p>
              <p className="mt-2 text-sm opacity-80">
                Kode: <b className="text-[var(--lime)]">LDICOPLN</b> · maks. Rp10.000
              </p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
