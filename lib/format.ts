/**
 * Angka rupiah tanpa awalan "Rp". Dipakai `<Money>` yang menata awalannya
 * terpisah.
 */
export const rupiahDigits = (value: number) => Math.round(value).toLocaleString("id-ID");

/**
 * Teks rupiah lengkap, contoh "Rp20.000".
 *
 * Hanya untuk menyusun string di data (nama paket seperti "Token Rp20.000").
 * Untuk dirender di UI pakai `<Money>` — kelas `.dp` akan meng-uppercase teks
 * jadi "RP20.000" kalau nominalnya ditulis sebagai string biasa.
 */
export const rupiah = (value: number) => `Rp${rupiahDigits(value)}`;

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

/** Format tanggal + jam. Dipakai di halaman invoice & lacak. */
export const formatDateTime = (timestamp: number) => dateFormatter.format(new Date(timestamp));
