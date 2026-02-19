import { GuestbookService } from "@/lib/services";

export const runtime = "nodejs";

export async function GET() {
  const result = await GuestbookService.listCountries();

  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.httpStatus },
    );
  }

  return Response.json({ countries: result.countries });
}
