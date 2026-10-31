import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Batasi root Turbopack ke folder project ini.
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Next 16 wajib mendaftarkan nilai quality yang dipakai (default hanya [75]).
    // 90 dipakai untuk gambar showcase di hero.
    qualities: [75, 90],
  },
};

export default nextConfig;
