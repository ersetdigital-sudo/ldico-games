"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface NavLink {
  readonly href: string;
  readonly label: string;
}

/** Menu navigasi mobile — sebelumnya nav-nya hilang total di layar kecil. */
export function MobileMenu({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        className="cut-sm grid h-11 w-11 place-items-center border border-[var(--line)] bg-[var(--panel)] md:hidden"
      >
        <span className="relative block h-3.5 w-5">
          <motion.span
            animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="absolute inset-x-0 top-0 h-0.5 bg-[var(--fg)]"
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            className="absolute inset-x-0 top-1.5 h-0.5 bg-[var(--fg)]"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="absolute inset-x-0 top-3 h-0.5 bg-[var(--fg)]"
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-16 border-b border-[var(--line)] bg-[var(--bg)] px-5 pb-6 pt-4 md:hidden"
          >
            <nav aria-label="Navigasi mobile" className="flex flex-col text-base">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[var(--line)] py-3.5 text-[var(--mut)] transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/#layanan"
              onClick={() => setOpen(false)}
              className="cut-sm dp mt-5 block bg-[var(--lime)] py-3.5 text-center font-bold text-black"
            >
              Pilih Layanan
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
