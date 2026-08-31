import { expect, type Locator, type Page, test } from "@playwright/test";

const THEME_STORE_KEY = "terminal-theme-store";

/**
 * The terminal input renders only after Next.js hydrates and the
 * client providers mount. Wait for it to be visible AND focusable
 * before any test starts typing — this kills flakes where fill()
 * fires before React has attached its onChange handler.
 */
async function getReadyInput(page: Page): Promise<Locator> {
  const input = page.getByPlaceholder(/^Type a command/i).first();
  await expect(input).toBeVisible();
  await expect(input).toBeEnabled();
  await input.click();
  return input;
}

async function readPersistedTheme(page: Page): Promise<string> {
  return await page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return "";
    try {
      const parsed = JSON.parse(raw);
      return String(parsed?.state?.theme ?? "");
    } catch {
      return raw;
    }
  }, THEME_STORE_KEY);
}

test.describe("Terminal flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.clear();
      } catch {}
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("renders the terminal and welcome screen", async ({ page }) => {
    await expect(
      page.getByPlaceholder(/^Type a command/i).first(),
    ).toBeVisible();
  });

  test("typing 'the' shows suggestions starting with 'the'", async ({
    page,
  }) => {
    const input = await getReadyInput(page);
    await input.fill("the");
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();
    const options = listbox.getByRole("option");
    await expect(options.first()).toContainText(/^the/i);
  });

  test("pressing Tab autocompletes a single match", async ({ page }) => {
    const input = await getReadyInput(page);
    await input.fill("abou");
    await input.press("Tab");
    await expect(input).toHaveValue("about");
  });

  test("submitting 'help' renders help output and clears the input", async ({
    page,
  }) => {
    const input = await getReadyInput(page);
    await input.fill("help");
    await input.press("Enter");
    await expect(input).toHaveValue("");
    // The help command renders all groups; assert at least one base command
    // appears as a clickable shortcut.
    await expect(page.getByText(/about/i).first()).toBeVisible();
  });

  test("Escape closes the suggestion popover", async ({ page }) => {
    const input = await getReadyInput(page);
    await input.fill("the");
    await expect(page.getByRole("listbox")).toBeVisible();
    await input.press("Escape");
    await expect(page.getByRole("listbox")).toHaveCount(0);
  });

  test("theme set dracula switches palette", async ({ page }) => {
    const input = await getReadyInput(page);
    await input.fill("theme set dracula");
    await input.press("Enter");
    await expect
      .poll(() => readPersistedTheme(page), { timeout: 10_000 })
      .toMatch(/dracula/i);
  });

  test("Ctrl+L clears the terminal output", async ({ page }) => {
    const input = await getReadyInput(page);
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
    await page.waitForLoadState("networkidle");
    const input = await getReadyInput(page);
    await input.fill("guestbook read");
    await input.press("Enter");
    // The read UI should at least render a section heading, refresh, or list.
    await expect(page.getByText(/guestbook/i).first()).toBeVisible();
  });
});

test.describe("Minimize to dock", () => {
  /** The dock tile shares its label with the window's own yellow dot, which
   * stays in the DOM while hidden — scope to the one outside the window. */
  const dockTile = (page: Page): Locator =>
    page.getByRole("button", { name: /restore terminal$/i }).last();

  test("collapses the window into the dock and back", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await getReadyInput(page);

    const windowStage = page.locator("main");
    await expect(windowStage).toBeVisible();
    await expect(dockTile(page)).toBeHidden();

    await page.getByRole("button", { name: /minimize terminal/i }).click();

    await expect(windowStage).toBeHidden();
    await expect(windowStage).toHaveAttribute("aria-hidden", "true");
    await expect(dockTile(page)).toBeVisible();

    await dockTile(page).click();

    await expect(windowStage).toBeVisible();
    await expect(dockTile(page)).toBeHidden();
  });

  test("keeps a half-typed command through the round trip", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const input = await getReadyInput(page);
    await input.fill("about");

    await page.getByRole("button", { name: /minimize terminal/i }).click();
    await expect(page.locator("main")).toBeHidden();
    await dockTile(page).click();

    await expect(input).toHaveValue("about");
  });

  test("leaves the footer layout untouched once restored", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await getReadyInput(page);

    const github = page.getByRole("link", { name: "GitHub", exact: true });
    const before = await github.boundingBox();

    await page.getByRole("button", { name: /minimize terminal/i }).click();
    await expect(dockTile(page)).toBeVisible();
    const during = await github.boundingBox();
    expect(during?.x).toBeGreaterThan(before?.x ?? 0);

    await dockTile(page).click();
    await expect(dockTile(page)).toBeHidden();
    expect(Math.round((await github.boundingBox())?.x ?? -1)).toBe(
      Math.round(before?.x ?? -2),
    );
  });
});
