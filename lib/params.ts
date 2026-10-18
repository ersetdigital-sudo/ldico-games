/** Ambil nilai pertama dari searchParams yang bisa berupa string atau array. */
export const firstParam = (value: string | string[] | undefined): string | null => {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
};
