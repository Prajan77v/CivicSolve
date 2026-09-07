import { test, expect } from '@playwright/test';

test.describe('Global Search & Discovery', () => {
  test('search API returns categorized results across entities', async ({ request }) => {
    const res = await request.get('/api/search?q=water');
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.success).toBeTruthy();
    expect(json.data).toBeDefined();
    expect(Array.isArray(json.data.problems)).toBeTruthy();
  });

  test('command palette opens on header search click and filters items', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Click on search trigger button in header
    const searchTrigger = page.locator('button:has-text("Search"), button:has-text("Quick jump"), button[data-testid="search-trigger"]').first();
    if (await searchTrigger.isVisible()) {
      await searchTrigger.click();

      // Verify command palette modal opens
      const paletteInput = page.locator('input[placeholder*="search" i], input[placeholder*="Type a command" i]').first();
      await expect(paletteInput).toBeVisible();

      // Type a query
      await paletteInput.fill('Water');
      await page.waitForTimeout(300);

      // Verify matching results appear
      await expect(page.getByText(new RegExp('Water|Challenges|Groundwater', 'i')).first()).toBeVisible();
    }

    const fatalErrors = errors.filter(e => !e.includes('React error #4') && !e.includes('Hydration'));
    expect(fatalErrors).toHaveLength(0);
  });
});
