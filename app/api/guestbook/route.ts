import {
  createEntry,
  extractCountry,
  extractIpAddress,
  hashIpAddress,
  listEntries,
} from "@/lib/services/guestbook";
import type { GuestbookCreateInput } from "@/lib/types/guestbook";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";
  const country = searchParams.get("country") || undefined;

  const result = await listEntries({ limit, sort, country });

  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.httpStatus },
    );
  }

  return Response.json({ entries: result.entries });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const ipHash = hashIpAddress(extractIpAddress(request));
  const userAgent = request.headers.get("user-agent");
  const country = extractCountry(request);

  const result = await createEntry(body as GuestbookCreateInput, {
    ipHash,
    userAgent,
    country,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: result.httpStatus },
    );
  }

  return Response.json({ ok: true, status: result.status }, { status: 201 });
}
