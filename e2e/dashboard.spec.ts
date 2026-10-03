import { test, expect } from "@playwright/test";

test("dashboard loads", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Personalized Feed")).toBeVisible();
  await expect(page.getByText("Trending")).toBeVisible();
});

test("search results are available and clickable", async ({ page }) => {
  await page.goto("/dashboard");
  const input = page.getByPlaceholder(/search movies/i);
  await input.fill("apple");

  const result = page.locator('a[href*="http"], button').filter({ hasText: /apple/i }).first();
  await expect(result).toBeVisible({ timeout: 15000 });
  await result.click();

  await expect(page.locator("#global-search")).toHaveValue("");
});

test("favorites toggle works", async ({ page }) => {
  await page.goto("/dashboard");
  const firstFavorite = page.getByRole("button", { name: /add to favorites/i }).first();
  await firstFavorite.click();

  await expect(page.locator('a[href="/favorites"]').first()).toBeVisible();
  await page.goto("/favorites");
  await expect(page.getByRole("heading", { name: "Favorites", exact: true })).toBeVisible();
});

test("dark mode toggles from header", async ({ page }) => {
  await page.goto("/dashboard");
  await page.getByRole("button", { name: /toggle dark mode/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("drag and drop reorders cards", async ({ page }) => {
  await page.goto("/dashboard");
  const cards = page.locator('[data-testid^="sortable-card-"]');
  const orderBefore = await cards.evaluateAll((items) => items.map((item) => item.getAttribute("data-testid")));

  const first = cards.first();
  const second = cards.nth(1);

  const firstBox = await first.boundingBox();
  const secondBox = await second.boundingBox();

  if (!firstBox || !secondBox) {
    throw new Error("Could not measure card bounds for drag test");
  }

  await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(secondBox.x + secondBox.width / 2, secondBox.y + secondBox.height / 2, { steps: 15 });
  await page.mouse.up();

  const orderAfter = await cards.evaluateAll((items) => items.map((item) => item.getAttribute("data-testid")));
  expect(orderAfter).not.toEqual(orderBefore);
});
