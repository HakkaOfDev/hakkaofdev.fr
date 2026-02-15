import { getSiteUrl } from "@/lib/site-url";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

function getHostLabel() {
  try {
    return new URL(getSiteUrl()).hostname.replace(/^www\./, "");
  } catch {
    return "hakkaofdev.fr";
  }
}

export default function OpenGraphImage() {
  const host = getHostLabel();

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background:
            "radial-gradient(1200px 630px at 80% 0%, rgba(0, 229, 255, 0.12), transparent 55%), radial-gradient(900px 630px at 0% 100%, rgba(255, 176, 0, 0.10), transparent 60%), linear-gradient(135deg, #07090B 0%, #030405 60%, #020304 100%)",
          color: "#EDEFF2",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial',
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            opacity: 0.3,
            maskImage:
              "radial-gradient(600px 360px at 70% 20%, black 35%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(600px 360px at 70% 20%, black 35%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(237,239,242,0.70)",
            }}
          >
            Lead Frontend Developer
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
            <div style={{ fontSize: 86, fontWeight: 800 }}>Alexandre</div>
            <div
              style={{
                fontSize: 86,
                fontWeight: 900,
                color: "#00E5FF",
              }}
            >
              GOSSARD
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: 4,
            }}
          >
            {[
              { label: "React", accent: "#00E5FF" },
              { label: "Next.js", accent: "#00E5FF" },
              { label: "UI Engineering", accent: "#FFB000" },
              { label: "Open-source", accent: "#A78BFA" },
            ].map((t) => (
              <div
                key={t.label}
                style={{
                  display: "flex",
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.06)",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
                  fontSize: 22,
                  color: "rgba(237,239,242,0.92)",
                }}
              >
                <span style={{ color: t.accent, marginRight: 8 }}>●</span>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(237,239,242,0.72)",
            fontSize: 22,
          }}
        >
          <div>{host}</div>
          <div style={{ letterSpacing: 1 }}>Portfolio</div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

