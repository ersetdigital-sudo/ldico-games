const STEPS = ["Detail", "Checkout", "Invoice"] as const;

/** Indikator langkah 1-2-3, dipakai konsisten di layanan, checkout, dan invoice. */
export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol aria-label="Langkah transaksi" className="dp mb-8 flex flex-wrap items-center gap-2 text-xs">
      {STEPS.map((step, index) => {
        const number = index + 1;
        const isDone = number <= current;
        return (
          <li key={step} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-[var(--line)]" aria-hidden="true">
                —
              </span>
            )}
            <span
              className={isDone ? "text-[var(--lime)]" : "text-[var(--mut)]"}
              aria-current={number === current ? "step" : undefined}
            >
              {number}. {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
