import { test, expect } from "@playwright/test";

test.describe("PulseBoard End-to-End User Journeys", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.locator("[data-hydrated='true']").waitFor();
  });

  test("loads the dashboard feed and renders content cards", async ({ page }) => {
    // Check hero title
    await expect(page.locator("h1")).toContainText("Your Personalized");

    // Check tabs exist matching reference UI
    await expect(page.getByRole("button", { name: "All", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "News", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Movies", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Social", exact: true })).toBeVisible();

    // Verify articles or cards are loaded
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("filters content when selecting tabs and categories", async ({ page }) => {
    // Switch to Movies tab
    await page.getByRole("button", { name: "Movies", exact: true }).click();

    // Check movie card features (e.g. Dune or Movie badge)
    await expect(page.locator("text=Dune: Part Two").first()).toBeVisible({ timeout: 5000 });

    // Switch to Social tab
    await page.getByRole("button", { name: "Social", exact: true }).click();

    // Check like button exists on social post
    await expect(page.locator("button[aria-label='Like post']").first()).toBeVisible();
  });

  test("debounced search filters cards", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search news, movies, posts");
    await expect(searchInput).toBeVisible();

    // Type query
    await searchInput.fill("Drones");

    // Wait for debounced search to filter
    await expect(page.locator("text=AI-Powered Drones").first()).toBeVisible({ timeout: 5000 });

    // Clear search
    const clearBtn = page.getByRole("button", { name: "Clear search" });
    await expect(clearBtn).toBeVisible({ timeout: 5000 });
    await clearBtn.click();
    await expect(searchInput).toHaveValue("");
  });

  test("adds item to favorites and manages it in Favorites page", async ({ page }) => {
    // Find first bookmark button and click it
    const firstBookmark = page.locator("button[aria-label='Add to favorites']").first();
    await expect(firstBookmark).toBeVisible();
    await firstBookmark.click();

    // Navigate to Favorites page and verify persistence
    await page.goto("/favorites", { waitUntil: "domcontentloaded" });
    await page.locator("[data-hydrated='true']").waitFor();
    await expect(page).toHaveURL(/.*favorites/);
    await expect(page.locator("h1")).toContainText("Favorites & Bookmarks");

    // Verify favorite items are present
    const favoriteCards = page.locator("article");
    await expect(favoriteCards.first()).toBeVisible();
    expect(await favoriteCards.count()).toBeGreaterThanOrEqual(1);
  });

  test("navigates to Trending and verifies breakout indicators", async ({ page }) => {
    await page.getByTestId("sidebar-nav-trending").click();
    await expect(page).toHaveURL(/.*trending/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText("Trending Hub", { timeout: 10000 });
    await expect(page.locator("text=Breakout Topic")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Box Office Leader")).toBeVisible({ timeout: 10000 });
  });

  test("updates settings and switches theme", async ({ page }) => {
    await page.getByTestId("sidebar-nav-settings").click();
    await expect(page).toHaveURL(/.*settings/);
    await expect(page.locator("h1")).toContainText("Settings & Preferences");

    // Click Light Mode
    await page.getByRole("button", { name: /Light Mode/i }).click();
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    // Click Dark Mode
    await page.getByRole("button", { name: /Dark Mode/i }).click();
    await expect(html).toHaveClass(/dark/);
  });
});
