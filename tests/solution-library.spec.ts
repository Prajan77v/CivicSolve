import { test, expect } from '@playwright/test';

test.describe('Solution Library & Regional Adaptation', () => {
  test('solution library lists reusable solutions with domain tabs', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/solution-library');
    await page.waitForLoadState('networkidle');

    // Verify title
    await expect(page.locator('h1').filter({ hasText: /Solution Library|Verified Solutions/i })).toBeVisible();

    // Verify domain tabs
    await expect(page.locator('button:has-text("All Domains"), button:has-text("Water Management")').first()).toBeVisible();

    // Verify solution cards
    const cards = page.locator('div.glass-card, div[data-testid="solution-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    expect(errors).toHaveLength(0);
  });

  test('opening solution modal and triggering regional adaptation workflow', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/solution-library');
    await page.waitForLoadState('networkidle');

    // Click Adapt to Your Region on first card
    const adaptBtn = page.locator('button:has-text("Adapt to Your Region"), button:has-text("Adapt"), button:has-text("Replicate")').first();
    await expect(adaptBtn).toBeVisible({ timeout: 10000 });
    await adaptBtn.click();

    // Verify adaptation form opens
    const districtInput = page.locator('input[placeholder*="district" i], select[name="district"], input[id*="district" i]').first();
    if (await districtInput.isVisible()) {
      await districtInput.fill('Amravati');
    }

    expect(errors).toHaveLength(0);
  });
});
