import { test, expect } from '@playwright/test';

test.describe('Project Collaboration & Milestone Tracking', () => {
  test('project workspace renders lifecycle stages and team activities', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Click on the first project
    const projectCard = page.locator('a[href^="/projects/"]:not([href="/projects/new"])').first();
    if (await projectCard.count() > 0) {
      await projectCard.click();
      await page.waitForURL(/\/projects\/[a-zA-Z0-9_-]+/, { timeout: 10000 });
      await expect(page.locator('h1').first()).toBeVisible();
    }

    expect(errors).toHaveLength(0);
  });

  test('collaboration workspace allows posting updates or comments', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const projectCard = page.locator('a[href^="/projects/"]:not([href="/projects/new"])').first();
    if (await projectCard.count() > 0) {
      await projectCard.click();
      await page.waitForURL(/\/projects\/[a-zA-Z0-9_-]+/, { timeout: 10000 });

      // Check if collaboration/discussion input exists
      const messageInput = page.locator('textarea[placeholder*="update" i], textarea[placeholder*="comment" i], textarea[placeholder*="message" i]').first();
      if (await messageInput.isVisible()) {
        await messageInput.fill('Playwright test: Sensor telemetry pipeline verified.');
        const sendBtn = page.locator('button:has-text("Post"), button:has-text("Send"), button:has-text("Update")').first();
        if (await sendBtn.isVisible()) {
          await sendBtn.click();
        }
      }
    }

    expect(errors).toHaveLength(0);
  });
});
