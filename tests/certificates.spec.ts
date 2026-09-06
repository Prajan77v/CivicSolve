import { test, expect } from '@playwright/test';

test.describe('Digital Certificates & QR Verification', () => {
  test('certificates registry displays issued civic credentials', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/certificates');
    await page.waitForLoadState('networkidle');

    // Verify title
    await expect(page.locator('h1').filter({ hasText: /Certificate|Credential/i })).toBeVisible();

    // Verify at least one certificate card
    const certCards = page.locator('div.glass-card, a[href*="/verify/"]');
    await expect(certCards.first()).toBeVisible({ timeout: 10000 });

    expect(errors).toHaveLength(0);
  });

  test('official verification portal validates credential authenticity', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Direct navigation to verification page
    await page.goto('/verify/cert-nashik-001');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Public Ledger Verification, text=Cryptographic, text=AUTHENTIC').first()).toBeVisible({ timeout: 10000 });

    expect(errors).toHaveLength(0);
  });
});
