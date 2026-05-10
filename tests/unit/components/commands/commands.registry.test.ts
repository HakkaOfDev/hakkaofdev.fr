import { afterEach, describe, expect, it } from "vitest";
import { resolveTerminalRenderer } from "@/components/commands/registries/commands.registry";
import { useAliasesStore } from "@/stores/aliases.store";

afterEach(() => {
  useAliasesStore.getState().clearAliases();
});

// Dynamic-import-based renderer resolution is slow under v8 coverage
// instrumentation; give each test enough budget to load the full module
// graph (some renderers pull in many constants/translations).
describe("resolveTerminalRenderer", { timeout: 30_000 }, () => {
  it("returns null for empty input", async () => {
    expect(await resolveTerminalRenderer("")).toBeNull();
    expect(await resolveTerminalRenderer("   ")).toBeNull();
  });

  it("returns null for unknown commands", async () => {
    expect(await resolveTerminalRenderer("not-a-command")).toBeNull();
  });

  it("resolves exact commands", async () => {
    const result = await resolveTerminalRenderer("help");
    expect(result).not.toBeNull();
    expect(result?.normalizedInput).toBe("help");
    expect(result?.needsInput).toBe(false);
  });

  it("resolves prefix commands and keeps the full normalized input", async () => {
    const result = await resolveTerminalRenderer("spotify now");
    expect(result).not.toBeNull();
    expect(result?.normalizedInput).toBe("spotify now");
    expect(result?.needsInput).toBe(true);
  });

  it("normalizes case and whitespace", async () => {
    const result = await resolveTerminalRenderer("  HELP  ");
    expect(result).not.toBeNull();
    expect(result?.normalizedInput).toBe("help");
  });

  it("applies built-in token aliases", async () => {
    const result = await resolveTerminalRenderer("?");
    expect(result?.normalizedInput).toBe("help");

    const cls = await resolveTerminalRenderer("cls");
    expect(cls?.normalizedInput).toBe("clear");

    const resume = await resolveTerminalRenderer("resume");
    expect(resume?.normalizedInput).toBe("cv");
  });

  it("expands user-defined aliases before resolving", async () => {
    useAliasesStore.getState().setAlias("hi", "about");
    const result = await resolveTerminalRenderer("hi");
    expect(result?.normalizedInput).toBe("about");
  });

  it("parses grep pipelines and exposes them as a pipeline plan", async () => {
    const result = await resolveTerminalRenderer("help | grep spotify");
    expect(result?.normalizedInput).toBe("help");
    expect(result?.pipeline).toEqual({ grep: "spotify" });
  });

  it("strips quotes from grep patterns", async () => {
    const result = await resolveTerminalRenderer('help | grep "with space"');
    expect(result?.pipeline).toEqual({ grep: "with space" });
  });

  it("ignores grep with empty pattern", async () => {
    const result = await resolveTerminalRenderer("help | grep    ");
    expect(result?.pipeline).toBeUndefined();
  });

  it("ignores unsupported pipeline operators", async () => {
    // `wc` is not implemented, but the base command must still resolve.
    const result = await resolveTerminalRenderer("help | wc");
    expect(result).not.toBeNull();
    expect(result?.pipeline).toBeUndefined();
  });
});
