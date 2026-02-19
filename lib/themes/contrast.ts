import type { ContrastPair, ThemeColors, ThemePalette } from "@/types/theme";
import { REQUIRED_CONTRAST_PAIRS } from "@/types/theme";

export type ContrastResult = {
  pair: ContrastPair;
  ratio: number;
  passes: boolean;
};

// ─── Color Parsers ──────────────────────────────────────────────────────

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "");
  let r: number, g: number, b: number;

  if (clean.length === 3) {
    r = Number.parseInt(clean[0] + clean[0], 16) / 255;
    g = Number.parseInt(clean[1] + clean[1], 16) / 255;
    b = Number.parseInt(clean[2] + clean[2], 16) / 255;
  } else if (clean.length === 6) {
    r = Number.parseInt(clean.slice(0, 2), 16) / 255;
    g = Number.parseInt(clean.slice(2, 4), 16) / 255;
    b = Number.parseInt(clean.slice(4, 6), 16) / 255;
  } else {
    throw new Error(`Invalid hex color: "${hex}"`);
  }

  return [r, g, b];
}

function parseRgb(rgb: string): [number, number, number] {
  const m = rgb.match(
    /rgba?\(\s*([\d.]+%?)\s*,?\s*([\d.]+%?)\s*,?\s*([\d.]+%?)(?:\s*[,/]\s*[\d.]+%?)?\s*\)/,
  );
  if (!m) throw new Error(`Cannot parse RGB value: "${rgb}"`);

  const parse = (val: string, max: number) =>
    val.endsWith("%")
      ? Number.parseFloat(val) / 100
      : Number.parseFloat(val) / max;

  return [parse(m[1], 255), parse(m[2], 255), parse(m[3], 255)];
}

function parseHsl(hsl: string): [number, number, number] {
  const m = hsl.match(
    /hsla?\(\s*([\d.]+)\s*,?\s*([\d.]+)%\s*,?\s*([\d.]+)%(?:\s*[,/]\s*[\d.]+%?)?\s*\)/,
  );
  if (!m) throw new Error(`Cannot parse HSL value: "${hsl}"`);

  const h = Number.parseFloat(m[1]) / 360;
  const s = Number.parseFloat(m[2]) / 100;
  const l = Number.parseFloat(m[3]) / 100;

  // HSL to RGB conversion
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) {
    return [l, l, l];
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
}

function parseOklch(raw: string): [number, number, number, number] {
  const m = raw.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/,
  );
  if (!m) throw new Error(`Cannot parse OKLCH value: "${raw}"`);
  const alpha = m[4]
    ? m[4].endsWith("%")
      ? Number.parseFloat(m[4]) / 100
      : Number.parseFloat(m[4])
    : 1;
  return [
    Number.parseFloat(m[1]),
    Number.parseFloat(m[2]),
    Number.parseFloat(m[3]),
    alpha,
  ];
}

// ─── OKLCH → sRGB pipeline ──────────────────────────────────────────────

// ─── OKLCH → sRGB pipeline ──────────────────────────────────────────────

/** OKLab → linear sRGB (unbounded). */
function oklabToLinearSrgb(
  L: number,
  a: number,
  b: number,
): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function oklchToLinearSrgb(
  L: number,
  C: number,
  H: number,
): [number, number, number] {
  const hRad = (H * Math.PI) / 180;
  return oklabToLinearSrgb(L, C * Math.cos(hRad), C * Math.sin(hRad));
}

function linearToSrgb(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  return clamped <= 0.0031308
    ? 12.92 * clamped
    : 1.055 * clamped ** (1 / 2.4) - 0.055;
}

/**
 * Parse an OKLCH CSS string and return [r, g, b] in 0–1 sRGB.
 * Alpha channel is ignored for contrast purposes.
 */
export function oklchToSrgb(raw: string): [number, number, number] {
  const [L, C, H] = parseOklch(raw);
  const [lr, lg, lb] = oklchToLinearSrgb(L, C, H);
  return [linearToSrgb(lr), linearToSrgb(lg), linearToSrgb(lb)];
}

// ─── WCAG 2.x contrast ─────────────────────────────────────────────────

/**
 * Parse any CSS color string to sRGB [0-1] range.
 * Supports: OKLCH, hex, rgb/rgba, hsl/hsla
 */
function parseColorToSrgb(color: string): [number, number, number] {
  const trimmed = color.trim().toLowerCase();

  // OKLCH format
  if (trimmed.startsWith("oklch(")) {
    return oklchToSrgb(color);
  }

  // Hex format
  if (trimmed.startsWith("#")) {
    return parseHex(color);
  }

  // RGB/RGBA format
  if (trimmed.startsWith("rgb")) {
    return parseRgb(color);
  }

  // HSL/HSLA format
  if (trimmed.startsWith("hsl")) {
    return parseHsl(color);
  }

  throw new Error(`Unsupported color format: "${color}"`);
}

function srgbToLuminanceChannel(c: number): number {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * srgbToLuminanceChannel(r) +
    0.7152 * srgbToLuminanceChannel(g) +
    0.0722 * srgbToLuminanceChannel(b)
  );
}

export function contrastRatio(
  fg: [number, number, number],
  bg: [number, number, number],
): number {
  const lFg = relativeLuminance(...fg);
  const lBg = relativeLuminance(...bg);
  const lighter = Math.max(lFg, lBg);
  const darker = Math.min(lFg, lBg);
  return (lighter + 0.05) / (darker + 0.05);
}

// ─── Palette validation ─────────────────────────────────────────────────

const AA_THRESHOLDS = { normal: 4.5, large: 3 } as const;

export function checkPair(
  colors: ThemeColors,
  pair: ContrastPair,
): ContrastResult | null {
  try {
    const fg = parseColorToSrgb(colors[pair.fg]);
    const bg = parseColorToSrgb(colors[pair.bg]);
    const ratio = contrastRatio(fg, bg);
    return {
      pair,
      ratio,
      passes: ratio >= AA_THRESHOLDS[pair.level],
    };
  } catch {
    // Unsupported color format cannot be validated
    return null;
  }
}

export function validatePalette(palette: ThemePalette): ContrastResult[] {
  return REQUIRED_CONTRAST_PAIRS.map((pair) =>
    checkPair(palette.colors, pair),
  ).filter((result): result is ContrastResult => result !== null);
}

export function palettePassesAll(palette: ThemePalette): boolean {
  return validatePalette(palette).every((r) => r.passes);
}
