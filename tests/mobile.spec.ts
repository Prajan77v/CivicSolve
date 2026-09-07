import { test, expect } from '@playwright/test'

test.use({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
})

test.describe('CivicSolve — Mobile Optimization & Ergonomics', () => {
  test('1. Mobile Bottom Navigation Bar is visible and renders 5 primary actions', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const bottomNav = page.locator('nav[aria-label="Mobile bottom navigation"]')
    await expect(bottomNav).toBeVisible()

    // 5 Actions: Overview, Civic Map, Plus (Report), Civic AI, Menu
    await expect(bottomNav.getByRole('link', { name: /overview/i })).toBeVisible()
    await expect(bottomNav.getByRole('link', { name: /civic map/i })).toBeVisible()
    await expect(bottomNav.locator('a[aria-label*="Submit"]')).toBeVisible()
    await expect(bottomNav.locator('button[aria-label*="Civic AI"]')).toBeVisible()
    await expect(bottomNav.locator('button[aria-label*="menu"]')).toBeVisible()
  })

  test('2. Mobile Bottom Bar navigates to GIS Problem Map and back to Overview', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const bottomNav = page.locator('nav[aria-label="Mobile bottom navigation"]')
    await bottomNav.getByRole('link', { name: /civic map/i }).click()
    await page.waitForURL('**/map')
    await expect(page).toHaveURL(/\/map/)

    // Return to dashboard
    await bottomNav.getByRole('link', { name: /overview/i }).click()
    await page.waitForURL('**/dashboard')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('3. Mobile Bottom Bar opens Civic AI Assistant sliding drawer', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const aiTrigger = page.locator('button[aria-label*="Civic AI"]')
    await aiTrigger.click()

    // AI Drawer becomes visible
    const aiDrawer = page.locator('aside').filter({ hasText: /Civic AI/i })
    await expect(aiDrawer).toBeVisible()

    // Close AI drawer
    const closeBtn = aiDrawer.locator('button').filter({ has: page.locator('svg') }).first()
    if (await closeBtn.isVisible()) {
      await closeBtn.click()
    }
  })

  test('4. Mobile Menu button opens responsive sidebar drawer with safe dismiss', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const menuTrigger = page.locator('button[aria-label="Open full platform menu"]')
    await menuTrigger.click()

    // Sidebar drawer opens and modal close button becomes visible
    const closeBtn = page.locator('.fixed.inset-0.z-50 button[aria-label="Close sidebar"]')
    await expect(closeBtn).toBeVisible()

    // Click close
    await closeBtn.click()
    await expect(closeBtn).not.toBeVisible()
  })
})
