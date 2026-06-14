import { Font } from "@react-pdf/renderer";
import type { Locale } from "@/i18n/routing";
import type { CvData } from "./cv-pdf.data";

export const CV_FONT_FAMILY = "CvSans";

const NOTO_FAMILY: Record<Locale, string> = {
  en: "Noto Sans",
  fr: "Noto Sans",
  es: "Noto Sans",
  de: "Noto Sans",
  pt: "Noto Sans",
  it: "Noto Sans",
  nl: "Noto Sans",
  ro: "Noto Sans",
  pl: "Noto Sans",
  cs: "Noto Sans",
  tr: "Noto Sans",
  vi: "Noto Sans",
  id: "Noto Sans",
  ru: "Noto Sans",
  uk: "Noto Sans",
  el: "Noto Sans",
  zh: "Noto Sans SC",
  ja: "Noto Sans JP",
  ko: "Noto Sans KR",
  hi: "Noto Sans Devanagari",
  ar: "Noto Sans Arabic",
  he: "Noto Sans Hebrew",
};

const FAMILIES_WITH_ITALIC = new Set(["Noto Sans"]);

// Glyphs that are not in the visible CV strings but show up at render time
// (separators, bullets, list dashes). Always include them.
const ALWAYS_INCLUDED = " 0123456789-—–:;,.?!()[]{}|/\\@#&*+=<>'\"•";

const bufferCache = new Map<string, Promise<Buffer | null>>();

async function fetchTtf(
  family: string,
  weight: 400 | 700,
  italic: boolean,
  text: string,
): Promise<Buffer | null> {
  const key = `${family}|${weight}|${italic ? "i" : "n"}|${text}`;
  const cached = bufferCache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const ital = italic ? "1" : "0";
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:ital,wght@${ital},${weight}&text=${encodeURIComponent(
      text,
    )}&display=swap`;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const cssRes = await fetch(cssUrl, { cache: "force-cache" });
        if (!cssRes.ok) throw new Error(`css ${cssRes.status}`);
        const css = await cssRes.text();
        const ttfUrl = css.match(
          /src:\s*url\(([^)]+)\)\s+format\('truetype'\)/,
        )?.[1];
        if (!ttfUrl) throw new Error("no truetype url");
        const fontRes = await fetch(ttfUrl, { cache: "force-cache" });
        if (!fontRes.ok) throw new Error(`font ${fontRes.status}`);
        return Buffer.from(await fontRes.arrayBuffer());
      } catch {
        if (attempt === 2) return null;
        await new Promise((r) => setTimeout(r, 250 * 2 ** attempt));
      }
    }
    return null;
  })();

  bufferCache.set(key, promise);
  return promise;
}

Font.registerHyphenationCallback((word) => [word]);

let lock: Promise<unknown> = Promise.resolve();

// `Font.register` accumulates sources for a given family across calls and
// `resolve` returns the first match — so a prior locale's subset would
// permanently shadow later registrations under the same name. Drop the
// family entry before each register so the new subset is the only source.
function clearCvFontFamily(): void {
  const families = (
    Font as unknown as { fontFamilies?: Record<string, unknown> }
  ).fontFamilies;
  if (families) delete families[CV_FONT_FAMILY];
}

export function renderWithCvFonts<T>(
  locale: Locale,
  data: CvData,
  render: () => Promise<T>,
): Promise<T> {
  const next = lock.then(async () => {
    clearCvFontFamily();
    await registerForLocale(locale, collectCvText(data));
    return render();
  });
  lock = next.catch(() => undefined);
  return next;
}

function collectCvText(data: CvData): string {
  const chars = new Set<string>();
  const add = (s: string | undefined | null) => {
    if (!s) return;
    for (const c of s) chars.add(c);
  };

  add(data.name);
  add(data.jobTitle);
  add(data.email);
  add(data.location);
  add(data.website);
  add(data.documentTitle);
  add(data.subject);
  add(data.summary);
  for (const v of Object.values(data.sections)) add(v);
  for (const e of data.experiences) {
    add(e.title);
    add(e.company);
    add(e.location);
    add(e.period);
    add(e.companyUrl);
    for (const d of e.descriptions) add(d);
  }
  for (const s of data.skills) {
    add(s.label);
    for (const v of s.values) add(v);
  }
  for (const e of data.education) {
    add(e.name);
    add(e.location);
    add(e.period);
    for (const d of e.descriptions) add(d);
  }
  for (const p of data.projects) {
    add(p.name);
    add(p.description);
    add(p.url);
    for (const t of p.tags) add(t);
  }
  for (const l of data.languages) {
    add(l.name);
    add(l.level);
  }
  for (const s of data.socials) {
    add(s.name);
    add(s.url);
  }
  for (const h of data.hobbies) add(h);
  for (const c of ALWAYS_INCLUDED) chars.add(c);

  // Section titles are rendered with CSS `textTransform: "uppercase"`, so
  // ensure the subset also has the uppercase form of every collected glyph.
  const withCase = new Set<string>(chars);
  for (const c of chars) {
    for (const u of c.toUpperCase()) withCase.add(u);
    for (const l of c.toLowerCase()) withCase.add(l);
  }

  return [...withCase].join("");
}

function toDataUrl(buffer: Buffer): string {
  return `data:font/ttf;base64,${buffer.toString("base64")}`;
}

async function registerForLocale(locale: Locale, text: string): Promise<void> {
  const noto = NOTO_FAMILY[locale];
  const supportsItalic = FAMILIES_WITH_ITALIC.has(noto);

  const [regular, bold, italic] = await Promise.all([
    fetchTtf(noto, 400, false, text),
    fetchTtf(noto, 700, false, text),
    supportsItalic ? fetchTtf(noto, 400, true, text) : Promise.resolve(null),
  ]);

  if (!regular) return;

  const regularUrl = toDataUrl(regular);
  // Scripts without a true italic still need an italic source registered —
  // @react-pdf's font resolver throws rather than falling back across styles.
  const italicUrl = italic ? toDataUrl(italic) : regularUrl;
  const fonts: Array<{
    src: string;
    fontWeight: number;
    fontStyle?: "italic";
  }> = [
    { src: regularUrl, fontWeight: 400 },
    { src: italicUrl, fontWeight: 400, fontStyle: "italic" },
  ];
  if (bold) fonts.push({ src: toDataUrl(bold), fontWeight: 700 });

  Font.register({ family: CV_FONT_FAMILY, fonts: fonts as never });
}
