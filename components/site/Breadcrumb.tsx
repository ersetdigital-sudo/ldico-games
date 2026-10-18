import Link from "next/link";

export interface Crumb {
  name: string;
  /** Tanpa `path` = halaman yang sedang dibuka. */
  path?: string;
}

/** Remah roti visual. JSON-LD-nya terpisah di `lib/schema.ts`. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-[var(--mut)]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <li key={item.name} className="flex items-center gap-2">
            {item.path ? (
              <Link href={item.path} className="transition hover:text-[var(--lime)]">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-[var(--fg)]">
                {item.name}
              </span>
            )}
            {item.path && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
