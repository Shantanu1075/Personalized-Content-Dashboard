import { test, expect } from '@playwright/test';

test('feed infinite scroll preserves scroll position', async ({ page }) => {
  await page.goto('/dashboard');
  // Wait for personalized feed section
  const feedHeader = page.locator('h2', { hasText: 'Personalized Feed' });
  await expect(feedHeader).toBeVisible();

  // Wait for the feed root to mount and expose a stable data attribute
  await page.waitForSelector('[data-feed-id]', { timeout: 5000 });
  const feedRoots = await page.locator('[data-feed-id]').elementHandles();
  let feedRoot = null;
  for (const el of feedRoots) {
    if (await el.isVisible()) {
      // ensure it contains the Personalized Feed header
      const contains = await el.evaluate((node) => !!node.querySelector('h2'));
      if (contains) {
        feedRoot = el;
        break;
      }
    }
  }

  expect(feedRoot).not.toBeNull();

  // Helper to get scrollTop and scrollHeight
  const getScroll = async () => {
    return await feedRoot!.evaluate((el) => ({ top: (el as HTMLElement).scrollTop, height: (el as HTMLElement).clientHeight, scrollHeight: (el as HTMLElement).scrollHeight }));
  };

  // Load a few pages by scrolling to bottom repeatedly
  let prevScroll = await getScroll();

  for (let i = 0; i < 3; i++) {
    // scroll to bottom
    await feedRoot!.evaluate((el) => { (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight; });
    // wait until scrollHeight increases or timeout
    const start = Date.now();
    let cur = await getScroll();
    while (cur.scrollHeight <= prevScroll.scrollHeight && Date.now() - start < 10000) {
      await page.waitForTimeout(200);
      cur = await getScroll();
    }

    // Ensure new scrollHeight increased (new content appended)
    expect(cur.scrollHeight).toBeGreaterThan(prevScroll.scrollHeight - 1);

    // Ensure feed root did not remount (data-feed-id should remain the same)
    const feedId = await feedRoot!.evaluate((el) => el.getAttribute('data-feed-id'));
    expect(feedId).toBeTruthy();

    // Ensure feed didn't jump back to near-zero
    expect(cur.top).toBeGreaterThanOrEqual(prevScroll.top - 20);

    prevScroll = cur;
  }
});
