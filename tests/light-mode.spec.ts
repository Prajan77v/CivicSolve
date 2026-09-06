import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:3001'

test.describe('Light Mode — Premium Appearance', () => {
  test.beforeEach(async ({ page }) => {
    // Enable light mode before each test
    await page.goto('http://localhost:3001/settings/appearance')
    await page.waitForLoadState('networkidle')

    const lightBtn = page.locator('[data-testid="theme-light-btn"]').first()
    if (await lightBtn.isVisible()) {
      await lightBtn.click()
      await page.waitForTimeout(400)
    } else {
      await page.evaluate(() => {
        localStorage.setItem('civicsolve_appearance_settings', JSON.stringify({ theme: 'light' }))
        document.documentElement.classList.remove('dark')
        document.documentElement.classList.add('light')
        document.documentElement.setAttribute('data-resolved-theme', 'light')
      })
      await page.waitForTimeout(300)
    }
  })

  test('body has warm neutral background in light mode', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard')
    await page.waitForLoadState('networkidle')
    const bg = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    )
    expect(bg).not.toBe('rgb(8, 9, 12)')
    expect(bg).not.toBe('rgb(0, 0, 0)')
    const match = bg.match(/\d+/g)
    if (match) {
      const [r, g, b] = match.map(Number)
      expect(r).toBeGreaterThan(200)
      expect(g).toBeGreaterThan(200)
      expect(b).toBeGreaterThan(200)
    }
  })

  test('html element has light class in light mode', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard')
    await page.waitForLoadState('networkidle')
    const htmlClass = await page.evaluate(() => document.documentElement.className)
    const resolvedTheme = await page.evaluate(() => document.documentElement.getAttribute('data-resolved-theme'))
    const hasLight = htmlClass.includes('light') || resolvedTheme === 'light'
    expect(hasLight).toBe(true)
  })

  test('dashboard page loads correctly in light mode', async ({ page }) => {
    await page.goto('http://localhost:3001/dashboard')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1, h2').first()).toBeVisible()
    const color = await page.evaluate(() =>
      window.getComputedStyle(document.querySelector('h1, h2')!).color
    )
    const match = color.match(/\d+/g)
    if (match) {
      const [r, g, b] = match.map(Number)
      expect(r + g + b).toBeLessThan(400)
    }
  })

  test('problems page loads correctly in light mode', async ({ page }) => {
    await page.goto('http://localhost:3001/problems')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('main, [role="main"]').first()).toBeVisible()
  })

  test('universities page loads correctly in light mode', async ({ page }) => {
    await page.goto('http://localhost:3001/universities')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('main, [role="main"]').first()).toBeVisible()
  })

  test('dark mode is visually unchanged — body still has dark background', async ({ page }) => {
    await page.goto('http://localhost:3001/settings/appearance')
    await page.waitForLoadState('networkidle')
    const darkBtn = page.locator('[data-testid="theme-dark-btn"]').first()
    if (await darkBtn.isVisible()) {
      await darkBtn.click()
      await page.waitForTimeout(400)
    } else {
      await page.evaluate(() => {
        localStorage.setItem('civicsolve_appearance_settings', JSON.stringify({ theme: 'dark' }))
        document.documentElement.classList.remove('light')
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-resolved-theme', 'dark')
      })
      await page.waitForTimeout(300)
    }

    const bg = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    )
    const match = bg.match(/\d+/g)
    if (match) {
      const [r, g, b] = match.map(Number)
      expect(r + g + b).toBeLessThan(100)
    }
  })

  test('settings appearance page accessible in light mode', async ({ page }) => {
    await page.goto('http://localhost:3001/settings/appearance')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('no console errors in light mode on dashboard', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('http://localhost:3001/dashboard')
    await page.waitForLoadState('networkidle')
    const realErrors = errors.filter(
      (e) => !e.includes('NO_SECRET') && !e.includes('NEXTAUTH')
    )
    expect(realErrors).toHaveLength(0)
  })
})
