import { test, expect } from '@playwright/test';

test.describe('AI Classification & Analysis Engine', () => {
  test('AI analysis API classifies raw civic text accurately', async ({ request }) => {
    const response = await request.post('/api/ai/analyze-problem', {
      data: {
        title: 'High Arsenic Concentration in Rural Handpumps of Nadia District',
        description: 'Over 45 handpumps in Nadia rural blocks show arsenic levels exceeding 0.05 mg/L, creating acute health risks for 8,000 villagers. Urgent need for low-cost filtration and IoT water testing.',
        category: 'WATER',
        district: 'Nadia',
        state: 'West Bengal'
      }
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBeTruthy();
    expect(data.data).toBeDefined();

    // Verify AI analysis output structure
    const analysis = data.data;
    expect(analysis.domain).toBeDefined();
    expect(analysis.confidence).toBeGreaterThan(0.5);
    expect(analysis.priorityScore).toBeGreaterThan(0.3);
    expect(analysis.recommendedSkills).toBeDefined();
  });

  test('problem detail renders AI score indicators and recommended tech stack', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Direct navigation to seeded problem dossier
    await page.goto('/problems/cmtoobswg002tzfwtr7evt8z9');
    await page.waitForLoadState('networkidle');

    const aiIndicators = page.locator('text=INTELLIGENCE SPECIFICATION, text=THE PROBLEM, text=Groundwater, text=Priority').first();
    await expect(aiIndicators).toBeVisible({ timeout: 10000 });

    expect(errors).toHaveLength(0);
  });
});
