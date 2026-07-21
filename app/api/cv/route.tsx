import { renderToBuffer } from "@react-pdf/renderer";
import { hasLocale } from "next-intl";
import { CVDocument } from "@/components/cv-pdf/CVDocument";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { buildCvFileName, getCvData } from "@/lib/cv/cv-pdf.data";
import { renderWithCvFonts } from "@/lib/cv/cv-pdf.fonts";
import { parseSelection } from "@/lib/cv/cv-selection";

export const runtime = "nodejs";

function pickLocale(request: Request): Locale {
  const url = new URL(request.url);
  const queryLocale = url.searchParams.get("lang");
  if (queryLocale && hasLocale(routing.locales, queryLocale)) {
    return queryLocale;
  }
  const accept = request.headers.get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const tag = part.trim().split(";")[0]?.split("-")[0];
    if (tag && hasLocale(routing.locales, tag)) return tag;
  }
  return routing.defaultLocale;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shouldDownload = searchParams.get("download") === "1";
  const locale = pickLocale(request);
  const selection = parseSelection(searchParams);

  const data = await getCvData(locale, selection);
  const pdfBuffer = await renderWithCvFonts(locale, data, () =>
    renderToBuffer(<CVDocument data={data} />),
  );
  const body = new Uint8Array(pdfBuffer);

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Language": locale,
      "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${buildCvFileName(locale)}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
