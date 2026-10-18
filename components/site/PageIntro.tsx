/** Judul halaman untuk route non-beranda. */
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mx-auto max-w-7xl px-5 pt-12">
      <p className="dp text-sm text-[var(--lime)]">{eyebrow}</p>
      <h1 className="dp mt-2 text-4xl font-bold sm:text-5xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-[var(--mut)]">{description}</p>}
    </header>
  );
}
