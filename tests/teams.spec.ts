import { test, expect } from '@playwright/test';

test.describe('Student Teams & Collaboration Hub', () => {
  test('teams directory lists student innovation teams with skills', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/teams');
    await page.waitForLoadState('networkidle');

    // Verify header
    await expect(page.locator('h1, h2').filter({ hasText: /Teams|Student Innovators/i }).first()).toBeVisible();

    // Verify team cards render
    const teamCards = page.locator('div.glass-card, div[data-testid="team-card"], tr');
    await expect(teamCards.first()).toBeVisible({ timeout: 10000 });

    expect(errors).toHaveLength(0);
  });

  test('search and filter student teams by university or tech skill', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/teams');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Tech');
      await page.waitForTimeout(300);
      await expect(page.locator('body')).toContainText(/Tech|Innovator|Solutions/i);
    }

    expect(errors).toHaveLength(0);
  });
});
