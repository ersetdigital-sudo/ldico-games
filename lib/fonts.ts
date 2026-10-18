import localFont from "next/font/local";

/**
 * Dua keluarga font dari file lokal (tanpa request ke Google Fonts):
 * - Space Grotesk  -> teks & body
 * - Chakra Petch   -> display, heading, label (dipakai lewat class `.dp`)
 */
export const spaceGrotesk = localFont({
  src: [
    { path: "../assets/fonts/spacegrotesk-wght--regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/spacegrotesk-wght--medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/spacegrotesk-wght--semibold.ttf", weight: "600", style: "normal" },
    { path: "../assets/fonts/spacegrotesk-wght--bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});

export const chakraPetch = localFont({
  src: [
    { path: "../assets/fonts/chakrapetch-regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/chakrapetch-medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/chakrapetch-semibold.ttf", weight: "600", style: "normal" },
    { path: "../assets/fonts/chakrapetch-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-chakra-petch",
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
});
