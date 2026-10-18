"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FLASH_SALE } from "@/data/flash";
import { SERVICES } from "@/data/services";
import { servicePath } from "@/data/categories";
import { Money } from "@/components/site/Money";
import { Icon } from "@/components/site/Icon";

const UNITS = ["Jam", "Menit", "Detik"] as const;

/** Hitung sisa waktu sampai tengah malam berikutnya. */
const remainingToMidnight = () => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const total = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60] as const;
};

export function FlashSale() {
  // null saat server render supaya markup awal sama dengan client (bebas hydration mismatch).
  const [timeLeft, setTimeLeft] = useState<readonly number[] | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(remainingToMidnight());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="flash" className="scroll-mt-24 bg-[var(--lime)] text-black">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <h2 className="dp flex items-center gap-3 text-4xl leading-none font-bold md:text-6xl">
            Flash Sale
            <Icon name="bolt" className="h-8 w-8 shrink-0 md:h-12 md:w-12" />
          </h2>
          <div
            className="dp flex gap-2 text-white"
            role="timer"
            aria-label="Sisa waktu flash sale hari ini"
          >
            {UNITS.map((unit, index) => (
              <div key={unit} className="cut-sm bg-black px-4 py-3 text-center">
                <div className="text-3xl font-bold">
                  {timeLeft ? String(timeLeft[index]).padStart(2, "0") : "--"}
                </div>
                <div className="text-[10px] text-[var(--mut)]">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FLASH_SALE.map((item) => (
            <li key={item.item}>
              <Link
                href={servicePath(SERVICES[item.serviceKey])}
                className="cut block bg-black p-5 text-white transition hover:-translate-y-1.5"
              >
                <p className="text-xs text-[var(--mut)]">{item.service}</p>
                <p className="dp mt-1 text-xl font-bold">{item.item}</p>
                <p className="mt-3">
                  <s className="text-sm text-[var(--mut)]">
                    <Money value={item.oldPrice} />
                  </s>{" "}
                  <b className="text-lg text-[var(--lime)]">
                    <Money value={item.newPrice} />
                  </b>
                </p>
                <div
                  className="mt-4 h-1.5 bg-[var(--line)]"
                  role="img"
                  aria-label={`${item.soldPercent} persen terjual`}
                >
                  <div
                    className="h-full bg-[var(--lime)]"
                    style={{ width: `${item.soldPercent}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[var(--mut)]">
                  {item.soldPercent}% terjual
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
