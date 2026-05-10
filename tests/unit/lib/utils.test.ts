import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("merges class names from strings, arrays and objects", () => {
    expect(cn("a", "b", ["c", false, "d"], { e: true, f: false })).toBe(
      "a b c d e",
    );
  });

  it("merges Tailwind utility conflicts (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles empty/undefined inputs", () => {
    expect(cn()).toBe("");
    expect(cn(undefined, null, false)).toBe("");
  });
});
