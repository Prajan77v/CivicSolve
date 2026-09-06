import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('login page loads and renders credentials form & demo personas', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/login');
    await expect(page).toHaveTitle(/CivicSolve/i);

    // Verify form elements exist
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Verify quick persona buttons exist
    const demoButtons = page.locator('button:has-text("Student Solver"), button:has-text("Platform Admin"), button:has-text("Government Official")');
    await expect(demoButtons.first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('sign in via 1-click persona redirects to dashboard', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/login');

    // Click Student Solver persona button which automatically signs in
    const studentBtn = page.locator('button:has-text("Student Solver")').first();
    await studentBtn.click();

    // Expect navigation to dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page.getByText(new RegExp('Command Center|Societal Impact|Dashboard', 'i')).first()).toBeVisible();

    expect(errors).toHaveLength(0);
  });

  test('registration page renders required fields', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/register');
    await expect(page.locator('input[name="name"], input[placeholder*="name" i]')).toBeVisible();
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();

    expect(errors).toHaveLength(0);
  });
});
