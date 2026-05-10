import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const supabaseRef: { client: unknown } = { client: null };

vi.mock("@/lib/supabase", () => ({
  get supabase() {
    return supabaseRef.client;
  },
}));

const ORIGINAL_SALT = process.env.APP_IP_SALT;

beforeEach(() => {
  process.env.APP_IP_SALT = "test-salt";
  supabaseRef.client = null;
  vi.resetModules();
});

afterEach(() => {
  process.env.APP_IP_SALT = ORIGINAL_SALT;
});

function makeRpc(returns: { data?: unknown; error?: unknown } = {}) {
  return vi.fn(
    async (_name: string, _args: Record<string, unknown>) => returns,
  );
}

function makeSupabaseWithRpc(rpcResult: { data?: unknown; error?: unknown }) {
  return {
    from: vi.fn(),
    rpc: vi.fn(
      async (_name: string, _args: Record<string, unknown>) => rpcResult,
    ),
  };
}

async function loadRoute() {
  const mod = await import("@/app/api/views/route");
  return mod;
}

describe("/api/views GET", () => {
  it("returns 503 when supabase is unavailable", async () => {
    supabaseRef.client = null;
    const { GET } = await loadRoute();
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ visitors: null });
  });

  it("returns the visitor count from get_unique_visitors_site_range", async () => {
    supabaseRef.client = makeSupabaseWithRpc({ data: [{ total: 42 }] });
    const { GET } = await loadRoute();
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ visitors: 42 });
  });

  it("unwraps a single object response from the RPC", async () => {
    supabaseRef.client = makeSupabaseWithRpc({ data: { total: 7 } });
    const { GET } = await loadRoute();
    const res = await GET();
    expect(await res.json()).toEqual({ visitors: 7 });
  });

  it("defaults to 0 when the RPC returns nothing", async () => {
    supabaseRef.client = makeSupabaseWithRpc({ data: null });
    const { GET } = await loadRoute();
    const res = await GET();
    expect(await res.json()).toEqual({ visitors: 0 });
  });
});

describe("/api/views POST", () => {
  function makeRequest(headers: Record<string, string> = {}) {
    return new Request("https://example.com/api/views", {
      method: "POST",
      headers,
    });
  }

  it("returns 503 when supabase is unavailable", async () => {
    supabaseRef.client = null;
    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ "user-agent": "Mozilla/5.0" }));
    expect(res.status).toBe(503);
  });

  it("short-circuits for bot user agents and does not call rpc", async () => {
    const rpc = makeRpc({ data: { is_new: true } });
    supabaseRef.client = { from: vi.fn(), rpc };

    const { POST } = await loadRoute();
    const res = await POST(makeRequest({ "user-agent": "Googlebot/2.1" }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, is_new: false });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("calls record_visit RPC with hashed IP and country for real users", async () => {
    const rpc = makeRpc({ data: { is_new: true } });
    supabaseRef.client = { from: vi.fn(), rpc };

    const { POST } = await loadRoute();
    const res = await POST(
      makeRequest({
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0",
        "x-forwarded-for": "1.2.3.4",
        "x-vercel-ip-country": "FR",
      }),
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, is_new: true });
    expect(rpc).toHaveBeenCalledWith(
      "record_visit",
      expect.objectContaining({
        p_slug: "/",
        p_country: "FR",
      }),
    );
    const args = rpc.mock.calls[0]?.[1];
    expect(args?.p_ip_hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it("returns 500 when RPC fails", async () => {
    const rpc = makeRpc({ error: new Error("boom") });
    supabaseRef.client = { from: vi.fn(), rpc };

    const { POST } = await loadRoute();
    const res = await POST(
      makeRequest({
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0",
      }),
    );
    expect(res.status).toBe(500);
  });
});
