import { describe, expect, it } from "vitest";
import { buildGuestbookFormSchema } from "@/lib/schemas/guestbook.schema";

const messages = {
  nameMin: "name min",
  nameMax: "name max",
  messageMin: "message min",
  messageMax: "message max",
  websiteMax: "website max",
  websiteInvalid: "website invalid",
};

const schema = buildGuestbookFormSchema(messages);

describe("guestbook schema", () => {
  it("accepts a valid payload", () => {
    const result = schema.safeParse({
      name: "Alice",
      message: "Hello there",
      website: "https://example.com",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty website", () => {
    const result = schema.safeParse({
      name: "Alice",
      message: "Hello",
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects too-short name", () => {
    const result = schema.safeParse({
      name: "A",
      message: "Hello",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too-short message", () => {
    const result = schema.safeParse({
      name: "Alice",
      message: "A",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid website URL", () => {
    const result = schema.safeParse({
      name: "Alice",
      message: "Hello",
      website: "not a url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too-long name", () => {
    const result = schema.safeParse({
      name: "x".repeat(100),
      message: "Hello",
      website: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects too-long message", () => {
    const result = schema.safeParse({
      name: "Alice",
      message: "x".repeat(1000),
      website: "",
    });
    expect(result.success).toBe(false);
  });
});
