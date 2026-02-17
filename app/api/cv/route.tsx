import { renderToBuffer } from "@react-pdf/renderer";
import { CVDocument } from "@/components/cv-pdf/CVDocument";
import { CV_FILE_NAME } from "@/lib/cv/cv-pdf.data";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shouldDownload = searchParams.get("download") === "1";

  const pdfBuffer = await renderToBuffer(<CVDocument />);
  const body = new Uint8Array(pdfBuffer);

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${CV_FILE_NAME}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
