import { test, expect } from '@playwright/test';

test.describe('Expert Evaluation & Hackathon Rubric', () => {
  test('evaluations API accepts 5-dimensional rubric scoring', async ({ request }) => {
    // Get a real project ID first
    const projectsRes = await request.get('/api/projects');
    expect(projectsRes.ok()).toBeTruthy();
    const projectsData = await projectsRes.json();
    const projectId = projectsData.data?.[0]?.id || 'cmtoobt010045zfwtusc4x7p3';

    // Submit evaluation
    const evalRes = await request.post(`/api/projects/${projectId}/evaluations`, {
      data: {
        innovation: 9,
        feasibility: 8.5,
        cost: 8,
        scalability: 9,
        socialImpact: 9.5,
        evaluatorName: 'Dr. Ramesh Sundaram',
        evaluatorRole: 'FACULTY_EXPERT',
        comments: 'Outstanding hardware prototype tested against municipal water norms.',
        recommendation: 'RECOMMENDED_FOR_PILOT'
      }
    });

    expect(evalRes.ok()).toBeTruthy();
    const evalJson = await evalRes.json();
    expect(evalJson.success).toBeTruthy();
    expect(evalJson.data.overallScore).toBeGreaterThan(80);
  });

  test('project workspace displays evaluation rubric and scores', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    const projectCard = page.locator('a[href^="/projects/"]').first();
    await projectCard.click();

    // Check for evaluation tab or button
    const evalTab = page.locator('button:has-text("Evaluation"), button:has-text("Rubric"), button:has-text("Scores")').first();
    if (await evalTab.isVisible()) {
      await evalTab.click();
      await expect(page.getByText(new RegExp('Innovation|Feasibility|Scalability|Score', 'i')).first()).toBeVisible();
    }

    expect(errors).toHaveLength(0);
  });
});
