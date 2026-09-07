import { test, expect } from '@playwright/test'

test.describe('Civic AI — Real Conversational Intelligence & Copilot', () => {
  test('1. AI Chat API responds with grounded database telemetry and tools', async ({ request }) => {
    const res = await request.post('/api/ai/chat', {
      data: {
        messages: [
          { role: 'user', content: 'What are the highest priority water problems in CivicSolve?' },
        ],
        context: { pathname: '/problems', pageType: 'PROBLEM' },
      },
    })

    expect(res.ok()).toBeTruthy()
    const json = await res.json()
    expect(json.success).toBeTruthy()
    expect(json.data.message).toBeDefined()
    expect(json.data.message.content).toContain('Matching Challenges')
    expect(json.data.message.metadata.mode).toBeDefined()
    expect(json.data.conversationId).toBeDefined()
  })

  test('2. AI Chat API prevents hallucinations on non-existent records', async ({ request }) => {
    const res = await request.post('/api/ai/chat', {
      data: {
        messages: [
          { role: 'user', content: 'Show me the 50 hospitals solving nuclear waste challenges in Iceland.' },
        ],
        context: { pathname: '/', pageType: 'GENERAL' },
      },
    })

    expect(res.ok()).toBeTruthy()
    const json = await res.json()
    expect(json.success).toBeTruthy()
    // AI must explicitly state no matching records exist and not hallucinate
    expect(json.data.message.content.toLowerCase()).toContain('no matching records exist')
  })

  test('3. AI Conversations API persists chats and allows message history retrieval', async ({ request }) => {
    // Create new conversation
    const createRes = await request.post('/api/ai/conversations', {
      data: {
        title: 'Water Challenge Analysis',
        contextType: 'PROBLEM',
      },
    })
    expect(createRes.ok()).toBeTruthy()
    const createJson = await createRes.json()
    const convId = createJson.data.id
    expect(convId).toBeDefined()

    // Send message in this conversation
    const chatRes = await request.post('/api/ai/chat', {
      data: {
        conversationId: convId,
        messages: [{ role: 'user', content: 'Explain the 3-tier matching engine algorithm' }],
      },
    })
    expect(chatRes.ok()).toBeTruthy()

    // Fetch conversation details
    const getRes = await request.get(`/api/ai/conversations/${convId}`)
    expect(getRes.ok()).toBeTruthy()
    const getJson = await getRes.json()
    expect(getJson.data.messages.length).toBeGreaterThanOrEqual(2)
  })

  test('4. End-to-end: Open Civic AI in browser, test context awareness & priority breakdown', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    // Navigate to problem dossier
    await page.goto('/problems/cmtoobswg002tzfwtr7evt8z9')
    await page.waitForLoadState('networkidle')

    // Find and click "Analyze with Civic AI" or navbar Civic AI button
    const copilotBtn = page.getByRole('button', { name: /Civic AI/i }).first()
    await expect(copilotBtn).toBeVisible({ timeout: 10000 })
    await copilotBtn.click()

    // Verify AI drawer opens
    const drawerHeader = page.getByRole('heading', { name: /Civic AI/i }).first()
    await expect(drawerHeader).toBeVisible({ timeout: 5000 })

    // Check mode badge exists
    const modeBadge = page.getByText(/⚡ Real AI|⚡ Demo AI/i).first()
    await expect(modeBadge).toBeVisible()

    // Click suggested prompt or type "Why is this high priority?"
    const priorityPrompt = page.getByRole('button', { name: /Why is this high priority\?/i }).first()
    if (await priorityPrompt.isVisible()) {
      await priorityPrompt.click()
    } else {
      const input = page.getByPlaceholder(/Ask about this problem|Ask Civic AI/i)
      await input.fill('Why is this high priority?')
      await input.press('Enter')
    }

    // Verify AI response arrives and references priority breakdown
    await expect(
      page.getByText(new RegExp('Priority Breakdown|Evaluation Parameters|Urgency', 'i')).first()
    ).toBeVisible({ timeout: 15000 })

    expect(errors).toHaveLength(0)
  })

  test('5. End-to-end: Ask matchmaking questions and verify solver recommendations', async ({ page }) => {
    await page.goto('/problems/cmtoobswg002tzfwtr7evt8z9')
    await page.waitForLoadState('networkidle')

    // Open AI drawer
    const copilotBtn = page.getByRole('button', { name: /Civic AI/i }).first()
    await copilotBtn.click()

    // Ask "Who can solve this?"
    const input = page.getByPlaceholder(/Ask about this problem|Ask Civic AI/i)
    await input.fill('Who can solve this?')
    await input.press('Enter')

    // Verify solver recommendations appear
    await expect(
      page.getByText(new RegExp('Recommended Solvers|Match Score|Skills', 'i')).first()
    ).toBeVisible({ timeout: 15000 })
  })

  test('6. End-to-end: Project Copilot action preparation & task creation confirmation', async ({ page, request }) => {
    // 1. Get first active project ID
    const projectsRes = await request.get('/api/projects')
    const projectsJson = await projectsRes.json()
    const project = projectsJson.data?.[0]
    expect(project).toBeDefined()

    // 2. Navigate to project page
    await page.goto(`/projects/${project.id}`)
    await page.waitForLoadState('networkidle')

    // 3. Open Copilot
    const copilotBtn = page.getByRole('button', { name: /Civic AI/i }).first()
    await copilotBtn.click()

    // 4. Request action: "Create a task for the team lead to review prototype"
    const input = page.getByPlaceholder(/Ask project copilot|Ask Civic AI/i)
    await input.fill('Create a task to review prototype telemetry')
    await input.press('Enter')

    // 5. Verify Action Confirmation card appears with "Confirm & Create"
    const confirmBtn = page.getByRole('button', { name: /Confirm & Create/i }).first()
    await expect(confirmBtn).toBeVisible({ timeout: 15000 })

    // 6. Click Confirm & Create
    await confirmBtn.click()

    // 7. Verify status updates to EXECUTED / Task created
    await expect(
      page.getByText(new RegExp('EXECUTED|Task created', 'i')).first()
    ).toBeVisible({ timeout: 10000 })
  })
})
