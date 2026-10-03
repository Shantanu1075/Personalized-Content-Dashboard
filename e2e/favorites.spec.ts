import { test, expect } from "@playwright/test";

test("favorites page loads", async ({ page }) => {
  await page.goto("/favorites");
  await expect(page.getByRole("heading", { name: "Favorites", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "No favorites yet", exact: true })).toBeVisible();
});
