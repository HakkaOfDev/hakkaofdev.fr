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
  // lucide `code-2` — matches the hero's React/Next.js badge.
  return (
    <svg {...SVG_ATTRS} stroke={color}>
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </svg>
  );
}

function BriefcaseIcon({ color }: { color: string }) {
  return (
    <svg {...SVG_ATTRS} stroke={color}>
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  );
}

function BanknoteIcon({ color }: { color: string }) {
  return (
    <svg {...SVG_ATTRS} stroke={color}>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function SmartphoneIcon({ color }: { color: string }) {
  return (
    <svg {...SVG_ATTRS} stroke={color}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
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

function FooterBar({ host }: { host: string }) {
  return (
    <div
      style={{
        display: "flex",
        marginTop: 48,
        paddingTop: 24,
        borderTop: "1px solid rgba(255,255,255,0.10)",
        color: "rgba(237,239,242,0.72)",
        fontSize: 22,
      }}
    >
      <div>{host}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getHostLabel() {
  try {
    const host = new URL(getSiteUrl()).hostname.replace(/^www\./, "");
    return `www.${host}`;
  } catch {
    return `www.${SITE.handle}.fr`;
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
 *
 * Retries on transient failures so parallel build-time prerendering across
 * 22 locales doesn't fail the whole build when Google Fonts rate-limits or
 * blips on a single request.
 */
async function loadGoogleFont(
  family: string,
  weight: 400 | 700 | 800,
  text: string,
): Promise<ArrayBuffer | null> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const cssRes = await fetch(url, { cache: "force-cache" });
      if (!cssRes.ok) throw new Error(`css ${cssRes.status}`);
      const css = await cssRes.text();
      const fontUrl = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
      if (!fontUrl) throw new Error("no src url in css");
      const fontRes = await fetch(fontUrl, { cache: "force-cache" });
      if (!fontRes.ok) throw new Error(`font ${fontRes.status}`);
      return await fontRes.arrayBuffer();
    } catch {
      if (attempt === 2) return null;
      await new Promise((r) => setTimeout(r, 250 * 2 ** attempt));
    }
  }
  return null;
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
  const tWelcome = await getTranslations({
    locale: resolvedLocale,
    namespace: "Welcome",
  });

  const jobTitle = tMeta("jobTitle");
  const nomad = tOg("tags.digitalNomad");
  const subtitle = `${jobTitle} · ${nomad}`;
  // "Freelance" is localized but only lives inside the hero's rich `intro`
  // string — pull it from there so the badge stays in sync and translated.
  const freelance =
    String(tWelcome.raw("intro")).match(/<freelance>(.*?)<\/freelance>/)?.[1] ??
    "Freelance";

  // Mirror the welcome hero's badges: Freelance first, then the daily rate,
  // then the web / mobile stack — with the same accent colours.
  const tags: { label: string; icon: ReactNode }[] = [
    { label: freelance, icon: <BriefcaseIcon color="#FFB000" /> },
    { label: tWelcome("tags.rate"), icon: <BanknoteIcon color="#C084FC" /> },
    { label: tWelcome("tags.web"), icon: <CodeIcon color="#00E5FF" /> },
    {
      label: tWelcome("tags.mobile"),
      icon: <SmartphoneIcon color="#FF8A4C" />,
    },
  ];

  const host = getHostLabel();

  // Always load Inter at 400/800 for Latin glyphs — Satori (Node runtime)
  // requires at least one explicit font, and the build-time fetch is cached
  // by `force-cache` so cold starts at request time stay fast.
  const [firstName, ...lastParts] = SITE.name.split(" ");
  const lastName = lastParts.join(" ");
  const latinText = [
    subtitle,
    ...tags.map((t) => t.label),
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
    const scriptText = [subtitle, ...tags.map((t) => t.label)].join("");
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
          {subtitle}
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

      <FooterBar host={host} />
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
