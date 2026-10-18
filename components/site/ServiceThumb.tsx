import type { Service } from "@/data/services";
import { IconTile } from "@/components/site/IconTile";
import { serviceIcon } from "@/lib/service-icon";

interface ServiceThumbProps {
  service: Service;
  /** Ukuran kotak dalam px; ikon di dalamnya ikut menyesuaikan. */
  size?: number;
  className?: string;
  /** Pakai sudut terpotong kecil (untuk thumbnail) atau besar (untuk hero). */
  cut?: "cut" | "cut-sm";
}

/**
 * Thumbnail satu layanan: `IconTile` dengan ikon dan gradient milik layanannya.
 *
 * Sengaja tanpa foto cover — identitas per layanan tetap terasa lewat warna
 * gradient-nya, dan tidak ada aset gambar yang perlu ikut terunduh.
 */
export function ServiceThumb({ service, ...props }: ServiceThumbProps) {
  return (
    <IconTile
      icon={serviceIcon(service)}
      gradient={service.gradient}
      size={props.size}
      className={props.className}
      cut={props.cut}
    />
  );
}
