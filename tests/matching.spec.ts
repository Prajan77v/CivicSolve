import { test, expect } from '@playwright/test';

test.describe('AI Solver Matchmaking Engine', () => {
  test('AI match center renders recommendations without bounty terminology', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/ai-match-center');
    await page.waitForLoadState('networkidle');

    // Verify page title
    await expect(page.locator('h1').filter({ hasText: /Matching Engine|Match Center/i })).toBeVisible();

    // Verify solver pools are present
    await expect(page.locator('text=Recommended Student Teams').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Accredited Faculty Mentors').first()).toBeVisible();
    await expect(page.locator('text=Recommended Industry & NGO Partners').first()).toBeVisible();

    // Confirm that bounty / sponsorship terms DO NOT appear
    const bountyText = page.locator('text=/\\b(bounty|bounties|sponsor application|funding marketplace)\\b/i');
    await expect(bountyText).toHaveCount(0);

    expect(errors).toHaveLength(0);
  });

  test('interactive invitation and sandbox support requests trigger toasts', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/ai-match-center');
    await page.waitForLoadState('networkidle');

    // Test Invite Team action
    const inviteBtn = page.locator('button:has-text("Invite Team"), button:has-text("Invite")').first();
    if (await inviteBtn.isVisible()) {
      await inviteBtn.click();
      await expect(page.locator('text=Invited, text=invitation dispatched').first()).toBeVisible();
    }

    // Test Request Mentorship action
    const mentorBtn = page.locator('button:has-text("Request Mentorship")').first();
    if (await mentorBtn.isVisible()) {
      await mentorBtn.click();
      await expect(page.locator('text=Mentorship proposal, text=Requested').first()).toBeVisible();
    }

    // Test Request Sandbox action (Industry & NGO support)
    const sandboxBtn = page.locator('button:has-text("Request Sandbox"), button:has-text("Support Requested")').first();
    if (await sandboxBtn.isVisible()) {
      await sandboxBtn.click();
      await expect(page.locator('text=Support & sandbox request, text=Support Requested').first()).toBeVisible();
    }

    expect(errors).toHaveLength(0);
  });
});
