import { listCountries } from "@/lib/services/guestbook";

export const runtime = "nodejs";

export async function GET() {
  const result = await listCountries();

  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.httpStatus },
    );
  }

  return Response.json({ countries: result.countries });
}
