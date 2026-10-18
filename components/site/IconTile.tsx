import { Icon, type IconName } from "@/components/site/Icon";

interface IconTileProps {
  icon: IconName;
  /** Dua warna brand untuk sapuan gradient di balik ikon. */
  gradient: [string, string];
  /** Ukuran kotak dalam px; ikon di dalamnya ikut menyesuaikan. */
  size?: number;
  className?: string;
  /** Sudut terpotong kecil (thumbnail) atau besar (hero). */
  cut?: "cut" | "cut-sm";
}

/**
 * Tile identitas visual: kotak gelap + sapuan gradient brand 20% + ikon garis.
 *
 * Dipakai kartu kategori dan thumbnail layanan, jadi semua bagian situs memakai
 * satu bahasa visual yang sama tanpa perlu aset gambar.
 */
export function IconTile({
  icon,
  gradient,
  size = 80,
  className = "",
  cut = "cut-sm",
}: IconTileProps) {
  const iconSize = Math.max(16, Math.round(size * 0.42));

  return (
    <div
      className={`${cut} relative flex shrink-0 items-center justify-center overflow-hidden border border-[var(--line)] bg-[var(--panel)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        }}
      />
      <Icon
        name={icon}
        className="relative text-white"
        style={{ width: iconSize, height: iconSize }}
      />
    </div>
  );
}
