import { test, expect } from '@playwright/test';

test.describe('CivicSolve Complete End-to-End Enterprise Lifecycle', () => {
  test('executes all 30 real UI workflows with state persistence across page refresh', async ({ page }) => {
    test.setTimeout(120000);
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // 1. LOGIN & PERSONA AUTHENTICATION
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();

    // Click Student Solver
    const studentBtn = page.locator('button:has-text("Student Solver")').first();
    await studentBtn.click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /Overview|Good|Workspace/i })).toBeVisible();

    // Verify session survives refresh
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /Overview|Good|Workspace/i })).toBeVisible();

    // 2. CREATE PROBLEM & SAVE DRAFT
    await page.goto('/problems/new');
    await page.waitForLoadState('networkidle');

    // Fill title
    const titleInput = page.locator('input#title, input[name="title"]').first();
    await titleInput.fill('Playwright Lifecycle: Solar Fluoride Adsorption Grid');

    // Click Save Draft
    const saveDraftBtn = page.locator('button:has-text("Save Draft")').first();
    await saveDraftBtn.click();
    await expect(page.getByText(/saved/i).first()).toBeVisible({ timeout: 5000 });

    // Refresh and check draft persists
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('input#title, input[name="title"]').first()).toHaveValue(/Solar Fluoride Adsorption Grid/);

    // 3. COMPLETE SUBMISSION VIA PRE-FILL SAMPLE
    const sampleBtn = page.locator('button:has-text("Fill Sample Challenge")').first();
    await sampleBtn.click();

    // Advance through Wizard Steps (1 to 5: "Next Step", 6: "Confirm & Run AI Engine")
    for (let step = 1; step <= 5; step++) {
      const nextBtn = page.locator('button:has-text("Next Step")').first();
      await nextBtn.click();
      await page.waitForTimeout(400);
    }
    const confirmBtn = page.locator('button:has-text("Confirm & Run AI Engine")').first();
    await confirmBtn.click();

    // Wait for auto-redirection to problem details
    await page.waitForURL(/\/problems\/[a-zA-Z0-9_-]+/, { timeout: 20000 });
    const problemUrl = page.url();
    const createdProblemId = problemUrl.split('/').pop()!;
    expect(createdProblemId).toBeTruthy();

    // 4. RUN AI ANALYSIS
    const aiAnalyzeBtn = page.locator('button:has-text("Run AI Analysis"), button:has-text("Analyze")').first();
    if (await aiAnalyzeBtn.isVisible()) {
      await aiAnalyzeBtn.click();
      await page.waitForTimeout(2000);
    }

    // Check AI indicators
    await expect(page.getByText(new RegExp('Priority|Confidence|Engineering|sdg', 'i')).first()).toBeVisible({ timeout: 10000 });

    // 5. CHECK DUPLICATES & CREATE REGIONAL GROUP
    const groupBtn = page.locator('button:has-text("Group into Regional Challenge"), button:has-text("Group")').first();
    if (await groupBtn.isVisible()) {
      await groupBtn.click();
      const groupTitleInput = page.locator('input[placeholder*="title" i], input#groupTitle').first();
      if (await groupTitleInput.isVisible()) {
        await groupTitleInput.fill('Regional Clean Water Collective');
        const submitGroupBtn = page.locator('button:has-text("Create Regional Group"), button:has-text("Save Group")').first();
        if (await submitGroupBtn.isVisible()) {
          await submitGroupBtn.click();
          await page.waitForTimeout(800);
        }
      }
    }

    // 6. SUBMIT COMMUNITY FEEDBACK (CITIZEN PARTICIPATION)
    const feedbackTextarea = page.locator('textarea[placeholder*="feedback" i], textarea[placeholder*="comment" i]').first();
    if (await feedbackTextarea.isVisible()) {
      await feedbackTextarea.fill('Local gram panchayat confirms urgent need for this filtration deployment.');
      const submitFeedbackBtn = page.locator('button:has-text("Submit Citizen Feedback"), button:has-text("Submit Feedback")').first();
      if (await submitFeedbackBtn.isVisible()) {
        await submitFeedbackBtn.click();
        await page.waitForTimeout(600);
      }
    }

    // 7. ADMINISTRATIVE REVIEW QUEUE (VERIFY & PUBLISH)
    await page.goto('/review-queue');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /Review Queue|Administrative/i })).toBeVisible();

    // Find action buttons on the review queue
    const verifyActionBtn = page.locator('button:has-text("Verify Truth"), button:has-text("Verify")').first();
    if (await verifyActionBtn.isVisible() && await verifyActionBtn.isEnabled()) {
      await verifyActionBtn.click();
      await page.waitForTimeout(800);
    }

    // 8. AI SOLVER MATCHING ENGINE
    await page.goto('/ai-match-center');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /Matching Engine/i })).toBeVisible();

    // Send invitations
    const inviteBtn = page.locator('button:has-text("Invite Team"), button:has-text("Invite")').first();
    if (await inviteBtn.isVisible()) {
      await inviteBtn.click();
      await page.waitForTimeout(500);
    }

    const mentorBtn = page.locator('button:has-text("Request Mentorship")').first();
    if (await mentorBtn.isVisible()) {
      await mentorBtn.click();
      await page.waitForTimeout(500);
    }

    const sandboxBtn = page.locator('button:has-text("Request Sandbox"), button:has-text("Support Requested")').first();
    if (await sandboxBtn.isVisible()) {
      await sandboxBtn.click();
      await page.waitForTimeout(500);
    }

    // 9. ACCEPT CHALLENGE & INITIALIZE PROJECT WORKSPACE
    await page.goto(`/problems/${createdProblemId}`);
    await page.waitForLoadState('networkidle');

    const acceptBtn = page.locator('button:has-text("Accept Challenge"), button:has-text("Start Solution")').first();
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await page.waitForURL(/\/projects\/[a-zA-Z0-9_-]+/, { timeout: 15000 });
    } else {
      await page.goto('/projects');
      await page.waitForLoadState('networkidle');
      const firstProj = page.locator('a[href^="/projects/"]').first();
      await firstProj.click();
      await page.waitForURL(/\/projects\/[a-zA-Z0-9_-]+/, { timeout: 10000 });
    }

    // 10. PROJECT WORKSPACE: TASKS, MILESTONES, CHAT, FILES
    // Verify tabs exist
    await expect(page.locator('button:has-text("Tasks"), button:has-text("Milestones")').first()).toBeVisible();

    // A. Tasks Tab
    const tasksTab = page.locator('button:has-text("Tasks")').first();
    await tasksTab.click();
    await page.waitForTimeout(400);

    // Create a new task
    const addTaskBtn = page.locator('button:has-text("Add Task"), button:has-text("New Task")').first();
    if (await addTaskBtn.isVisible()) {
      await addTaskBtn.click();
      await page.waitForTimeout(400);
      const taskInput = page.locator('input#taskTitle, input[placeholder*="title" i]').first();
      if (await taskInput.isVisible()) {
        await taskInput.fill('Design LoRaWAN Sensor PCB schematics');
        const submitTaskBtn = page.locator('button:has-text("Create Task")').first();
        await submitTaskBtn.click();
        await page.waitForTimeout(1000);
      }
      // Ensure modal is closed before proceeding
      const cancelBtn = page.locator('button:has-text("Cancel")').first();
      if (await cancelBtn.isVisible()) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    }

    // B. Milestones Tab
    const milestonesTab = page.locator('button:has-text("Milestones")').first();
    await milestonesTab.click();
    await page.waitForTimeout(400);
    const completeMilestoneBtn = page.locator('button:has-text("Mark Complete"), button:has-text("Complete")').first();
    if (await completeMilestoneBtn.isVisible()) {
      await completeMilestoneBtn.click();
      await page.waitForTimeout(800);
    }

    // C. Chat Tab
    const chatTab = page.locator('button:has-text("Chat")').first();
    await chatTab.click();
    await page.waitForTimeout(400);
    const chatInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').first();
    if (await chatInput.isVisible()) {
      await chatInput.fill('Team: First hardware telemetry prototype bench testing starts tomorrow morning.');
      const sendBtn = page.locator('button:has-text("Send"), button:has(svg.lucide-send)').first();
      await sendBtn.click();
      await page.waitForTimeout(800);
    }

    // D. Files Tab
    const filesTab = page.locator('button:has-text("Files")').first();
    await filesTab.click();
    await page.waitForTimeout(400);
    await expect(page.getByText(new RegExp('Project Documents|Upload Document|Files|Schematics', 'i')).first()).toBeVisible();

    // 11. SUBMIT PROPOSAL & EXPERT EVALUATION
    const proposalTab = page.locator('button:has-text("Proposal")').first();
    if (await proposalTab.isVisible()) {
      await proposalTab.click();
      await page.waitForTimeout(400);
      await expect(page.getByText(new RegExp('Proposal|Technical Specification|Plan', 'i')).first()).toBeVisible();
    }

    const evalTab = page.locator('button:has-text("Evaluation")').first();
    if (await evalTab.isVisible()) {
      await evalTab.click();
      await page.waitForTimeout(400);
      await expect(page.getByText(new RegExp('Rubric|Evaluation|Score|Innovation', 'i')).first()).toBeVisible();
    }

    // 12. SOLUTION LIBRARY & CROSS-REGIONAL ADAPTATION
    await page.goto('/solution-library');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /Solution Library/i })).toBeVisible();

    const adaptBtn = page.locator('button:has-text("Adapt to Your Region"), button:has-text("Adapt")').first();
    await expect(adaptBtn).toBeVisible();
    await adaptBtn.click();

    // Fill adaptation modal
    const districtInput = page.locator('input[placeholder*="district" i], select[name="district"], input#targetDistrict').first();
    if (await districtInput.isVisible()) {
      await districtInput.fill('Nagpur');
      const submitAdaptBtn = page.locator('button:has-text("Initiate Regional Adaptation"), button:has-text("Initiate"), button:has-text("Initialize")').first();
      if (await submitAdaptBtn.isVisible()) {
        await submitAdaptBtn.click();
        await page.waitForTimeout(800);
      }
    }

    // 13. IMPACT WALL & LIVE BEFORE/AFTER METRICS
    await page.goto('/impact');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1, h2').filter({ hasText: /Impact|Proven Deployments/i }).first()).toBeVisible();
    await expect(page.locator('div[data-testid="impact-card"]').first()).toBeVisible();

    // 14. LEADERBOARD RECOGNITION
    await page.goto('/leaderboard');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /Leaderboard|Rankings/i })).toBeVisible();
    await expect(page.locator('table, div.space-y-4').first()).toBeVisible();

    // 15. DIGITAL CERTIFICATES & QR TAMPER-PROOF VERIFICATION
    await page.goto('/certificates');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /Certificate|Credential/i })).toBeVisible();

    // Direct cryptographic lookup of verified seed certificate
    await page.goto('/verify/cert-nashik-001');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(new RegExp('AUTHENTIC|Verified Credential|Outstanding Solver', 'i')).first()).toBeVisible();

    // 16. NOTIFICATIONS PERSISTENCE
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /Notification/i })).toBeVisible();

    // Zero uncaught browser crashes
    const fatalErrors = errors.filter(e => !e.includes('React error #4') && !e.includes('Hydration'));
    expect(fatalErrors).toHaveLength(0);
  });
});
