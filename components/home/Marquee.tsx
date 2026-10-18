import { GAME_LIST, PPOB_LIST } from "@/data/services";
import { Icon } from "@/components/site/Icon";

/** Nama semua layanan. Isi pita disalin dua kali supaya pergeseran -50% menyambung. */
const NAMES = [...GAME_LIST, ...PPOB_LIST].map((service) => service.name);

/**
 * Pita nama layanan yang berjalan, tepat di bawah hero.
 *
 * Salinan kedua diberi `aria-hidden`: itu cuma duplikat visual untuk loop,
 * screen reader tidak perlu membacanya dua kali. Animasi dimatikan lewat
 * `prefers-reduced-motion` di globals.css.
 */
export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-[var(--line)] bg-[var(--panel)] py-4">
      <div className="marq dp text-lg font-semibold text-[var(--mut)]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1 ? true : undefined}>
            {NAMES.map((name) => (
              <li key={name} className="mx-5 flex items-center gap-5 whitespace-nowrap">
                {name}
                <Icon name="sparkle" className="h-3.5 w-3.5 shrink-0 text-[var(--lime)]" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
