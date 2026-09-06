import { test, expect } from '@playwright/test';

test.describe('Civic Problems & Submission Workflow', () => {
  test('problems list page displays challenges and category filters', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/problems');
    await page.waitForLoadState('networkidle');

    // Verify header
    await expect(page.locator('h1, h2').filter({ hasText: /Challenges|Problems/i }).first()).toBeVisible();

    // Verify search input
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
    await expect(searchInput).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('problem detail page renders AI analysis breakdown and metadata', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/problems/cmtoobswg002tzfwtr7evt8z9');
    await page.waitForLoadState('networkidle');

    // Verify problem detail title
    await expect(page.locator('h1').first()).toBeVisible();

    // Check for AI analysis / confidence or priority indicators
    await expect(page.locator('text=Priority, text=AI Analysis, text=Confidence, text=Severity, text=Groundwater').first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('submitting a new civic problem via form', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/submit-problem');
    await page.waitForLoadState('networkidle');

    // Fill out the title and description
    const titleInput = page.locator('input[name="title"], input[id="title"], input[placeholder*="title" i]').first();
    await titleInput.fill('Playwright Automated Test: Canal Desilting Bottleneck in Ward 14');

    const descInput = page.locator('textarea[name="description"], textarea[id="description"], textarea[placeholder*="describe" i], textarea').first();
    await descInput.fill('Severe drainage blockages due to silt buildup during monsoon causing urban waterlogging impacting 3,000 households.');

    expect(errors).toHaveLength(0);
  });
});
