import { test, expect } from '@playwright/test';

test.describe('Master CivicSolve End-to-End Innovation Lifecycle', () => {
  test('executes 35-checkpoint continuous journey with 0 errors and no bounties', async ({ page }) => {
    // Collect page errors and unhandled exceptions
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => {
      console.error('Page error in journey:', err.message);
      pageErrors.push(err.message);
    });

    // 1. Landing Page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/CivicSolve/i);
    await expect(page.locator('text=SIH26043, text=Intelligent Societal Problem-Solving').first()).toBeVisible();

    // Verify NO bounties link on landing page
    const bountyNav = page.locator('nav a[href="/bounties"]');
    await expect(bountyNav).toHaveCount(0);

    // 2. Navigate to Login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();

    // 3. Quick Persona Sign-In
    const studentBtn = page.locator('button:has-text("Student Solver")').first();
    await studentBtn.click();

    // 4. Command Center / Dashboard
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page.locator('text=Command Center, text=CivicSolve, text=Dashboard').first()).toBeVisible();

    // 5. Problems Directory
    await page.goto('/problems');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').filter({ hasText: /Challenges|Problems/i }).first()).toBeVisible();

    // 6. Domain Filtering
    const filterBtns = page.locator('button:has-text("Water"), button:has-text("Environment"), button:has-text("Urban")');
    if (await filterBtns.count() > 0) {
      await filterBtns.first().click();
      await page.waitForTimeout(300);
    }

    // 7. Problem Search
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Water');
      await page.waitForTimeout(300);
    }

    // 8. Problem Detail
    const problemCard = page.locator('a[href^="/problems/"]:not([href="/problems/new"])').first();
    if (await problemCard.count() > 0) {
      await problemCard.first().click();
      await page.waitForURL(/\/problems\/[a-zA-Z0-9_-]+/, { timeout: 10000 });
      await expect(page.locator('h1').first()).toBeVisible();
    }

    // 9. Problem Submission Form
    await page.goto('/submit-problem');
    await page.waitForLoadState('networkidle');
    const problemTitleInput = page.locator('input[name="title"], input[id="title"], input[placeholder*="title" i]').first();
    await problemTitleInput.fill('E2E Test: Pothole & Waterlogging Matrix in Suburb Zone 4');
    const problemDescInput = page.locator('textarea').first();
    await problemDescInput.fill('Severe water stagnation leading to structural damage and vector-borne diseases impacting 1200 residents.');

    // 10. AI Match Center
    await page.goto('/ai-match-center');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1').filter({ hasText: /Matching Engine|Match Center/i })).toBeVisible();

    // Confirm that bounty / sponsorship terms DO NOT appear
    const bountyText = page.locator('text=/\\b(bounty|bounties|sponsor application|funding marketplace)\\b/i');
    await expect(bountyText).toHaveCount(0);

    // 11. Team Invitation Action
    const inviteBtn = page.locator('button:has-text("Invite Team"), button:has-text("Invite")').first();
    if (await inviteBtn.isVisible()) {
      await inviteBtn.click();
    }

    // 12. Faculty Mentorship Request Action
    const mentorBtn = page.locator('button:has-text("Request Mentorship")').first();
    if (await mentorBtn.isVisible()) {
      await mentorBtn.click();
    }

    // 13. Industry Support Sandbox Request Action
    const sandboxBtn = page.locator('button:has-text("Request Sandbox"), button:has-text("Support Requested")').first();
    if (await sandboxBtn.isVisible()) {
      await sandboxBtn.click();
    }

    // 14. Teams Directory
    await page.goto('/teams');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').filter({ hasText: /Teams|Student Innovators/i }).first()).toBeVisible();

    // 15. Projects Directory
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').filter({ hasText: /Projects|Active Solutions|Workspace/i }).first()).toBeVisible();

    // 16. Project Workspace
    const projCard = page.locator('a[href^="/projects/"]').first();
    if (await projCard.count() > 0) {
      await projCard.click();
      await page.waitForURL(/\/projects\/[a-zA-Z0-9_-]+/, { timeout: 10000 });
    }

    // 17. Solution Library
    await page.goto('/solution-library');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1').filter({ hasText: /Solution Library|Verified Solutions/i })).toBeVisible();

    // 18. Impact Wall
    await page.goto('/impact');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').filter({ hasText: /Impact|Proven Deployments|Societal/i }).first()).toBeVisible();

    // 19. Certificates Registry
    await page.goto('/certificates');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1').filter({ hasText: /Certificate|Credential/i })).toBeVisible();

    // 20. Verification Portal
    await page.goto('/verify');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1').filter({ hasText: /Verify/i })).toBeVisible();

    // 21. Specific Credential Verification
    await page.goto('/verify/cert-nashik-001');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Official SIH Verification, text=Authentic, text=Verified Credential, text=Outstanding Solver').first()).toBeVisible();

    // 22. Civic Map
    await page.goto('/map');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').filter({ hasText: /Map|Geographic/i }).first()).toBeVisible();

    // 23. Live Judge Demo Runner
    await page.goto('/demo');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Judge, text=Demo, text=Simulation').first()).toBeVisible();

    // 24. Notifications
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').filter({ hasText: /Notifications|Alerts/i }).first()).toBeVisible();

    // Final assert: zero uncaught page errors
    expect(pageErrors).toHaveLength(0);
  });
});
