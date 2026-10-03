import { test, expect } from "@playwright/test";

test("search input is available", async ({ page }) => {
  await page.goto("/dashboard");
  const input = page.getByPlaceholder(/search movies/i);
  await expect(input).toBeVisible();

  await input.fill("movie");
  await expect(page.getByText(/movie/i).first()).toBeVisible({ timeout: 15000 });
});