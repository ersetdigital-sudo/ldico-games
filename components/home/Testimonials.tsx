import { TESTIMONIALS } from "@/data/home";
import { Icon } from "@/components/site/Icon";

const STARS = [0, 1, 2, 3, 4];

export function Testimonials() {
  return (
    <section id="testi" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20">
      <h2 className="dp text-4xl font-bold md:text-5xl">Kata pelanggan</h2>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((item) => (
          <li
            key={item.name}
            className="cut flex flex-col border border-[var(--line)] bg-[var(--panel)] p-6"
          >
            <p className="flex gap-1 text-[var(--lime)]" role="img" aria-label="Nilai 5 dari 5">
              {STARS.map((star) => (
                <Icon key={star} name="star" className="h-4 w-4" />
              ))}
            </p>
            <blockquote className="mt-4 flex-1">&ldquo;{item.quote}&rdquo;</blockquote>
            <p className="mt-4 text-sm text-[var(--mut)]">
              <b className="text-[var(--fg)]">{item.name}</b> &middot; {item.city}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
