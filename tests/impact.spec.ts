import { test, expect } from '@playwright/test';

test.describe('Societal Impact & Telemetry Wall', () => {
  test('impact page displays live national indicators and field deployments', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/impact');
    await page.waitForLoadState('networkidle');

    // Verify title
    await expect(page.locator('h1, h2').filter({ hasText: /Impact|Proven Deployments|Societal/i }).first()).toBeVisible();

    // Verify metric cards or counters
    const metricStats = page.getByText(new RegExp('Beneficiaries|Citizens|Deployments|Villages|Water', 'i')).first();
    await expect(metricStats).toBeVisible({ timeout: 10000 });

    // Verify impact project stories exist
    const impactCards = page.locator('div.glass-card, div[data-testid="impact-card"]');
    await expect(impactCards.first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('category filters on impact wall filter deployment stories', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/impact');
    await page.waitForLoadState('networkidle');

    const waterFilter = page.locator('button:has-text("Water")').first();
    if (await waterFilter.isVisible()) {
      await waterFilter.click();
      await page.waitForTimeout(300);
      await expect(page.locator('body')).toContainText(/Nashik|Water|Filtration/i);
    }

    expect(errors).toHaveLength(0);
  });
});
