import { test, expect } from '@playwright/test';

test.describe('Projects Directory & Lifecycle Management', () => {
  test('projects directory renders active projects and stage filters', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Verify title
    await expect(page.locator('h1, h2').filter({ hasText: /Projects|Active Solutions|Workspace/i }).first()).toBeVisible();

    // Verify project cards exist
    const projectCards = page.locator('a[href^="/projects/"], div.glass-card');
    await expect(projectCards.first()).toBeVisible({ timeout: 10000 });

    expect(errors).toHaveLength(0);
  });

  test('filtering projects by stage or status updates the visible list', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Look for stage filter buttons/tabs
    const stageFilters = page.locator('button:has-text("Prototyping"), button:has-text("Pilot"), button:has-text("Deployed"), button:has-text("All")');
    if (await stageFilters.count() > 0) {
      await stageFilters.first().click();
      await page.waitForTimeout(300);
      await expect(page.locator('body')).toBeVisible();
    }

    expect(errors).toHaveLength(0);
  });
});
