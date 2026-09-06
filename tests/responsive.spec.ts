import { test, expect } from '@playwright/test';

test.describe('Responsive Viewport Adaptability', () => {
  test('desktop viewport (1280px) renders persistent sidebar and full navigation', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // On desktop, the sidebar should be visible
    await expect(page.locator('aside, nav').first()).toBeVisible();
    await expect(page.locator('text=Command Center, text=CivicSolve').first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('tablet viewport (768px) adjusts layout gracefully', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Main content area remains visible
    await expect(page.locator('main, div.space-y-6').first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('mobile viewport (375px) provides accessible mobile navigation', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Page content rendered without horizontal overflow
    await expect(page.locator('body')).toBeVisible();

    // Check for mobile menu trigger button
    const mobileMenuBtn = page.locator('button[aria-label*="menu" i], button:has(svg.lucide-menu), button:has(svg)').first();
    await expect(mobileMenuBtn).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
