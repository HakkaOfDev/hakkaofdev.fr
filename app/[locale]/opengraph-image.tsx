import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { type Locale, routing } from "@/i18n/routing";
import { SITE } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = SITE.name;

/**
 * Pre-render OG images at build time so cold starts don't pay the
 * Google Fonts roundtrip. Arabic is excluded because Satori's font parser
 * doesn't yet support the GSUB lookupType 5 / substFormat 3 features used
 * by Noto Sans Arabic — that locale is rendered on demand instead.
 */
export function generateStaticParams() {
  return routing.locales
    .filter((locale) => locale !== "ar")
    .map((locale) => ({ locale }));
}

// ---------------------------------------------------------------------------
// Icons – Lucide-style inline SVGs (Satori-compatible)
// ---------------------------------------------------------------------------

const SVG_ATTRS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function CodeIcon({ color }: { color: string }) {
  return (
    <svg {...SVG_ATTRS} stroke={color}>
      <path d="M16 18l6-6-6-6" />
      <path d="M8 6l-6 6 6 6" />
    </svg>
  );
}

function GlobeIcon({ color }: { color: string }) {
  return (
    <svg {...SVG_ATTRS} stroke={color}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function LayoutIcon({ color }: { color: string }) {
  return (
    <svg {...SVG_ATTRS} stroke={color}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function HeartIcon({ color }: { color: string }) {
  return (
    <svg {...SVG_ATTRS} stroke={color}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function GridOverlay() {
  return (
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
  );
}

function Tag({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
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
      {icon}
      {label}
    </div>
  );
}

function NameHeading() {
  const [firstName, ...lastParts] = SITE.name.split(" ");
  const lastName = lastParts.join(" ");

  return (
    <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
      <div style={{ fontSize: 86, fontWeight: 800 }}>{firstName}</div>
      <div style={{ fontSize: 86, fontWeight: 900, color: "#00E5FF" }}>
        {lastName.toUpperCase()}
      </div>
    </div>
  );
}

function FooterBar({ host, label }: { host: string; label: string }) {
  return (
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
      <div style={{ letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getHostLabel() {
  try {
    return new URL(getSiteUrl()).hostname.replace(/^www\./, "");
  } catch {
    return `${SITE.handle}.fr`;
  }
}

/**
 * Locales whose script isn't covered by the default Satori font (Noto Sans).
 * For these we fetch a matching Noto family from Google Fonts and embed it
 * in the ImageResponse so glyphs render instead of falling back to tofu.
 */
const SCRIPT_FONT_FAMILY: Partial<Record<Locale, string>> = {
  zh: "Noto Sans SC",
  ja: "Noto Sans JP",
  ko: "Noto Sans KR",
  hi: "Noto Sans Devanagari",
  ar: "Noto Sans Arabic",
  he: "Noto Sans Hebrew",
};

/**
 * Pulls a single weight of a Google Font subset to just the glyphs we need
 * (`text=` param). Returns the binary woff2 buffer or `null` on any failure;
 * Satori falls back to its default font in that case rather than throwing.
 */
async function loadGoogleFont(
  family: string,
  weight: 400 | 700 | 800,
  text: string,
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await fetch(url, { cache: "force-cache" }).then((r) =>
      r.text(),
    );
    const fontUrl = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
    if (!fontUrl) return null;
    return await fetch(fontUrl, { cache: "force-cache" }).then((r) =>
      r.arrayBuffer(),
    );
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

type Props = { params: Promise<{ locale: string }> };

export default async function OpenGraphImage({ params }: Props) {
  const { locale } = await params;
  const resolvedLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;

  const tMeta = await getTranslations({
    locale: resolvedLocale,
    namespace: "Metadata",
  });
  const tOg = await getTranslations({
    locale: resolvedLocale,
    namespace: "OpenGraph",
  });

  const tags: { label: string; accent: string; icon: ReactNode }[] = [
    {
      label: tOg("tags.digitalNomad"),
      accent: "#00E5FF",
      icon: <GlobeIcon color="#00E5FF" />,
    },
    {
      label: tOg("tags.nextjs"),
      accent: "#00E5FF",
      icon: <CodeIcon color="#00E5FF" />,
    },
    {
      label: tOg("tags.uiEngineering"),
      accent: "#FFB000",
      icon: <LayoutIcon color="#FFB000" />,
    },
    {
      label: tOg("tags.openSource"),
      accent: "#A78BFA",
      icon: <HeartIcon color="#A78BFA" />,
    },
  ];

  const host = getHostLabel();
  const footerLabel = tOg("footer");
  const jobTitle = tMeta("jobTitle");

  // Always load Inter at 400/800 for Latin glyphs — Satori (Node runtime)
  // requires at least one explicit font, and the build-time fetch is cached
  // by `force-cache` so cold starts at request time stay fast.
  const [firstName, ...lastParts] = SITE.name.split(" ");
  const lastName = lastParts.join(" ");
  const latinText = [
    jobTitle,
    ...tags.map((t) => t.label),
    footerLabel,
    host,
    firstName,
    lastName.toUpperCase(),
  ].join("");
  const [interRegular, interBold] = await Promise.all([
    loadGoogleFont("Inter", 400, latinText),
    loadGoogleFont("Inter", 800, latinText),
  ]);

  const fontEntries: {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 800;
  }[] = [];
  if (interRegular) {
    fontEntries.push({ name: "Inter", data: interRegular, weight: 400 });
  }
  if (interBold) {
    fontEntries.push({ name: "Inter", data: interBold, weight: 800 });
  }

  // Load a script-specific Noto font when the locale uses non-Latin glyphs.
  const scriptFontFamily = SCRIPT_FONT_FAMILY[resolvedLocale];
  if (scriptFontFamily) {
    const scriptText = [
      jobTitle,
      ...tags.map((t) => t.label),
      footerLabel,
    ].join("");
    const scriptData = await loadGoogleFont(scriptFontFamily, 400, scriptText);
    if (scriptData) {
      fontEntries.push({
        name: scriptFontFamily,
        data: scriptData,
        weight: 400,
      });
    }
  }

  const baseFontStack =
    '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial';
  const rootFontFamily = scriptFontFamily
    ? `"${scriptFontFamily}", ${baseFontStack}`
    : baseFontStack;

  return new ImageResponse(
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
        fontFamily: rootFontFamily,
      }}
    >
      <GridOverlay />

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(237,239,242,0.70)",
          }}
        >
          {jobTitle}
        </div>

        <NameHeading />

        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: 4,
          }}
        >
          {tags.map((t) => (
            <Tag key={t.label} icon={t.icon} label={t.label} />
          ))}
        </div>
      </div>

      <FooterBar host={host} label={footerLabel} />
    </div>,
    {
      ...size,
      fonts: fontEntries.map((entry) => ({
        name: entry.name,
        data: entry.data,
        style: "normal" as const,
        weight: entry.weight,
      })),
    },
  );
}
