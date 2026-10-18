import { rupiahDigits } from "@/lib/format";

/**
 * Awalan "Rp" untuk nominal besar (dari `text-3xl` ke atas): dibuat lebih kecil
 * dan redup supaya angkanya yang menonjol. Untuk nominal sebaris pakai default.
 */
export const HERO_PREFIX = "mr-1.5 text-[0.58em] text-[var(--mut)]";

/**
 * Nominal rupiah.
 *
 * Kelas `.dp` — tipografi brand — meng-uppercase seluruh teks, jadi nominal
 * yang ditulis apa adanya tampil sebagai "RP22.500". Itu salah tulis: huruf
 * "p" di "Rp" bagian dari singkatannya. Di sini awalannya dikeluarkan dari
 * aturan uppercase, ukurannya juga bisa diatur terpisah dari angkanya.
 *
 * Semua nominal yang dirender di UI lewat komponen ini, supaya aturan ini cuma
 * hidup di satu tempat. `rupiah()` di lib/format disisakan untuk menyusun teks
 * di data (contoh nama paket "Token Rp20.000").
 */
export function Money({
  value,
  prefixClassName = "",
}: {
  value: number;
  prefixClassName?: string;
}) {
  return (
    <>
      <span className={`normal-case ${prefixClassName}`}>Rp</span>
      {rupiahDigits(value)}
    </>
  );
}

/** Satu nominal utuh di dalam teks, contoh "Rp20.000". */
const MONEY_IN_TEXT = /^Rp\s?[\d.]+$/;

/**
 * Teks yang memuat nominal di tengahnya, contoh "Token Rp20.000" atau
 * "Saldo Rp50.000".
 *
 * Isinya datang dari data sebagai satu string, jadi bagian "Rp…" dibungkus
 * sendiri supaya tidak ikut ter-uppercase saat dirender dengan kelas `.dp`.
 */
export function MoneyText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(Rp\s?[\d.]+)/).map((part, index) =>
        MONEY_IN_TEXT.test(part) ? (
          <span key={index} className="normal-case">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
