"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GAME_CATEGORIES, GAME_LIST, type GameCategory } from "@/data/services";
import { GAMES_SLUG, categoryPath } from "@/data/categories";
import { ServiceThumb } from "@/components/site/ServiceThumb";

/** Label kategori per game ("moba" → "MOBA"). */
const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  GAME_CATEGORIES.map((item) => [item.value, item.label]),
);

/**
 * Katalog game: pencarian + filter kategori + grid kartu.
 *
 * Daftar game diambil dari `GAME_LIST` (data yang sama dengan halaman detail),
 * jadi menambah game cukup di `data/services.ts` — tidak ada daftar kedua yang
 * harus ikut diperbarui. Tanpa foto produk: identitas tiap game dipakai dari
 * ikon + gradient brand-nya, sama seperti kartu kategori.
 */
export function GameBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | GameCategory>("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return GAME_LIST.filter((game) => {
      if (category !== "all" && game.category !== category) return false;
      if (!needle) return true;
      return (
        game.name.toLowerCase().includes(needle) ||
        game.publisher.toLowerCase().includes(needle)
      );
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-xs">
          <label htmlFor="game-search" className="sr-only">
            Cari game
          </label>
          <input
            id="game-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari game, mis. Mobile Legends"
            className="cut-sm w-full border border-[var(--line)] bg-[var(--panel)] px-4 py-3 outline-none focus:border-[var(--lime)]"
          />
        </div>

        <div role="group" aria-label="Filter kategori game" className="flex flex-wrap gap-2">
          {GAME_CATEGORIES.map((item) => {
            const active = category === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setCategory(item.value)}
                aria-pressed={active}
                className={`option cut-sm dp border border-[var(--line)] px-3.5 py-2 text-xs transition ${
                  active ? "is-active" : "hover:border-[var(--lime)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-xs text-[var(--mut)]">
        {visible.length} game
      </p>

      {visible.length === 0 ? (
        <p className="mt-4 border border-dashed border-[var(--line)] p-8 text-center text-[var(--mut)]">
          Game tidak ditemukan. Coba kata kunci lain, atau{" "}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="text-[var(--lime)] underline"
          >
            tampilkan semua game
          </button>
          .
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {visible.map((game) => (
            <li key={game.key} className="h-full">
              <Link
                href={`${categoryPath(GAMES_SLUG)}/${game.key}`}
                className="gc cut flex h-full flex-col gap-3 border border-[var(--line)] bg-[var(--panel)] p-4"
              >
                <ServiceThumb service={game} size={40} className="h-10 w-10" />

                <span className="min-w-0">
                  <span className="dp block text-xs font-bold sm:text-sm">{game.name}</span>
                  <span className="mt-1 block text-[11px] text-[var(--mut)] uppercase">
                    {game.category ? CATEGORY_LABEL[game.category] : "Game Lainnya"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
