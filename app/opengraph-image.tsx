import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07070c",
          backgroundImage:
            "linear-gradient(rgba(34,34,47,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,34,47,0.7) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          padding: "72px",
          color: "#ececf5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 72,
              height: 72,
              display: "flex",
              borderRadius: 22,
              background: "linear-gradient(135deg, #C6FF00 0%, #22D3EE 100%)",
            }}
          />
          <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, color: "#8a8aa3" }}>
            {SITE.name.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 1 }}>
            Top up game &amp; PPOB
          </div>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 1, color: "#C6FF00" }}>
            dalam hitungan detik
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#8a8aa3" }}>
          <div style={{ display: "flex" }}>100+ game · pulsa · token PLN · BPJS</div>
          <div style={{ display: "flex", color: "#22D3EE" }}>{SITE.url.replace("https://", "")}</div>
        </div>
      </div>
    ),
    size,
  );
}
