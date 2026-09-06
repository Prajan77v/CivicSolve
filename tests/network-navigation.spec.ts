import { test, expect } from '@playwright/test'

test.describe('Network Navigation & Directories', () => {
  test('Sidebar displays Students and IT Professionals in NETWORK section', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard')
    await page.waitForLoadState('networkidle')

    // Find the NETWORK navigation links in sidebar
    const studentsLink = page.locator('aside a[href="/students"]')
    await expect(studentsLink).toBeVisible()
    await expect(studentsLink).toContainText('Students')

    const profLink = page.locator('aside a[href="/professionals"]')
    await expect(profLink).toBeVisible()
    await expect(profLink).toContainText('IT Professionals')

    // Click Students and verify page loads
    await studentsLink.click()
    await expect(page).toHaveURL(/.*\/students/)
    await expect(page.locator('h1')).toContainText('Student Solvers')

    // Take screenshot of students directory
    await page.screenshot({ path: 'students-directory.png', fullPage: false })

    // Navigate to IT Professionals
    const profSidebar = page.locator('aside a[href="/professionals"]')
    await profSidebar.click()
    await expect(page).toHaveURL(/.*\/professionals/)
    await expect(page.locator('h1')).toContainText('IT Professionals')

    // Take screenshot of professionals directory
    await page.screenshot({ path: 'professionals-directory.png', fullPage: false })
  })
})
