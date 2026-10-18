import { HOW_TO_ORDER } from "@/data/home";

/** Alur order versi ringkas — pengganti form panjang di beranda. */
export function HowToOrder() {
  return (
    <section id="cara" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20">
      <h2 className="dp text-4xl font-bold md:text-5xl">Cara order</h2>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_TO_ORDER.map((step, index) => (
          <li key={step.title} className="cut border border-[var(--line)] bg-[var(--panel)] p-6">
            <p className="dp text-3xl font-bold text-[var(--lime)]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="dp mt-3 font-bold">{step.title}</h3>
            <p className="mt-1 text-sm text-[var(--mut)]">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
