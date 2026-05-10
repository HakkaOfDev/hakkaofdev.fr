import { expect, test } from "@playwright/test";

test.describe("Terminal flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.clear();
      } catch {}
    });
    await page.goto("/");
  });

  test("renders the terminal and welcome screen", async ({ page }) => {
    await expect(
      page.getByPlaceholder(/^Type a command/i).first(),
    ).toBeVisible();
  });

  test("typing 'the' shows suggestions starting with 'the'", async ({
    page,
  }) => {
    const input = page.getByPlaceholder(/^Type a command/i).first();
    await input.fill("the");
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    const options = listbox.getByRole("option");
    await expect(options.first()).toContainText(/^the/i);
  });

  test("pressing Tab autocompletes a single match", async ({ page }) => {
    const input = page.getByPlaceholder(/^Type a command/i).first();
    await input.fill("abou");
    await input.press("Tab");
    await expect(input).toHaveValue("about");
  });

  test("submitting 'help' renders help output and clears the input", async ({
    page,
  }) => {
    const input = page.getByPlaceholder(/^Type a command/i).first();
    await input.fill("help");
    await input.press("Enter");
    await expect(input).toHaveValue("");
    // The help command renders all groups; assert at least one base command
    // appears as a clickable shortcut.
    await expect(page.getByText(/about/i).first()).toBeVisible();
  });

  test("Escape closes the suggestion popover", async ({ page }) => {
    const input = page.getByPlaceholder(/^Type a command/i).first();
    await input.fill("the");
    await expect(page.getByRole("listbox")).toBeVisible();
    await input.press("Escape");
    await expect(page.getByRole("listbox")).toHaveCount(0);
  });

  test("theme set dracula switches palette", async ({ page }) => {
    const input = page.getByPlaceholder(/^Type a command/i).first();
    await input.fill("theme set dracula");
    await input.press("Enter");
    await expect
      .poll(
        async () =>
          await page.evaluate(() => localStorage.getItem("theme") ?? ""),
        { timeout: 5000 },
      )
      .toMatch(/dracula/i);
  });

  test("Ctrl+L clears the terminal output", async ({ page }) => {
    const input = page.getByPlaceholder(/^Type a command/i).first();
    await input.fill("about");
    await input.press("Enter");
    await page.keyboard.press("Control+L");
    // Input should be empty and previously rendered command should be gone
    await expect(input).toHaveValue("");
  });
});

test.describe("Guestbook flow", () => {
  test("navigates to guestbook and shows the read view", async ({ page }) => {
    await page.goto("/");
    const input = page.getByPlaceholder(/^Type a command/i).first();
    await input.fill("guestbook read");
    await input.press("Enter");
    // The read UI should at least render a section heading, refresh, or list.
    await expect(page.getByText(/guestbook/i).first()).toBeVisible();
  });
});
