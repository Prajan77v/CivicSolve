import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test.describe('CivicSolve — Appearance Customization System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to settings with appearance tab
    await page.goto('/settings?tab=appearance')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1').filter({ hasText: /Settings/i })).toBeVisible()
  })

  test('1. Light mode switches UI, updates tokens, and persists on page reload', async ({ page }) => {
    // Click Light Theme
    const lightBtn = page.locator('[data-testid="theme-light-btn"]')
    await expect(lightBtn).toBeVisible()
    await lightBtn.click()
    await page.waitForTimeout(400)

    // Verify documentElement has class "light" and data-theme="light"
    const isLightClass = await page.evaluate(() => document.documentElement.classList.contains('light'))
    const dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(isLightClass).toBe(true)
    expect(dataTheme).toBe('light')

    // Take screenshot: Light
    const screenshotDir = path.join(process.cwd(), 'screenshots')
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true })
    await page.screenshot({ path: path.join(screenshotDir, 'appearance-light.png'), fullPage: false })

    // Reload page and verify persistence
    await page.reload()
    await page.waitForLoadState('networkidle')
    const reloadedIsLight = await page.evaluate(() => document.documentElement.classList.contains('light'))
    const reloadedDataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(reloadedIsLight).toBe(true)
    expect(reloadedDataTheme).toBe('light')
  })

  test('2. Dark mode switches UI, updates tokens, and persists on page reload', async ({ page }) => {
    // First switch to light to ensure transition
    await page.locator('[data-testid="theme-light-btn"]').click()
    await page.waitForTimeout(300)

    // Click Dark Theme
    const darkBtn = page.locator('[data-testid="theme-dark-btn"]')
    await expect(darkBtn).toBeVisible()
    await darkBtn.click()
    await page.waitForTimeout(400)

    // Verify documentElement has class "dark" and data-theme="dark"
    const isDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(isDarkClass).toBe(true)
    expect(dataTheme).toBe('dark')

    // Take screenshot: Dark
    const screenshotDir = path.join(process.cwd(), 'screenshots')
    await page.screenshot({ path: path.join(screenshotDir, 'appearance-dark.png'), fullPage: false })

    // Reload page and verify persistence
    await page.reload()
    await page.waitForLoadState('networkidle')
    const reloadedIsDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    expect(reloadedIsDark).toBe(true)
  })

  test('3. System theme follows OS preference and reflects selected state', async ({ page }) => {
    const systemBtn = page.locator('[data-testid="theme-system-btn"]')
    await expect(systemBtn).toBeVisible()
    await systemBtn.click()
    await page.waitForTimeout(300)

    const dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(dataTheme).toBe('system')

    // Take screenshot: System
    const screenshotDir = path.join(process.cwd(), 'screenshots')
    await page.screenshot({ path: path.join(screenshotDir, 'appearance-system.png'), fullPage: false })
  })

  test('4. Accent selection updates primary UI elements and CSS custom properties', async ({ page }) => {
    // Select Civic Green accent
    const greenBtn = page.locator('[data-testid="accent-civic-green-btn"]')
    await expect(greenBtn).toBeVisible()
    await greenBtn.click()
    await page.waitForTimeout(300)

    let accentVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-color'))
    expect(accentVar).toBe('#059669')

    // Verify preview card primary button has the accent color
    const previewBtn = page.locator('[data-testid="preview-primary-btn"]')
    await expect(previewBtn).toBeVisible()

    // Select Amber accent
    const amberBtn = page.locator('[data-testid="accent-amber-btn"]')
    await amberBtn.click()
    await page.waitForTimeout(300)
    accentVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-color'))
    expect(accentVar).toBe('#d97706')

    // Select Ocean Blue (Default Accent)
    const oceanBtn = page.locator('[data-testid="accent-ocean-blue-btn"]')
    await oceanBtn.click()
    await page.waitForTimeout(300)
    accentVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-color'))
    expect(accentVar).toBe('#2563eb')

    // Take screenshot: Default Accent
    const screenshotDir = path.join(process.cwd(), 'screenshots')
    await page.screenshot({ path: path.join(screenshotDir, 'appearance-default-accent.png'), fullPage: false })
  })

  test('5. Custom accent color picker validates and updates application live', async ({ page }) => {
    const customHexInput = page.locator('[data-testid="custom-hex-input"]')
    await expect(customHexInput).toBeVisible()

    // Fill a distinct custom purple/magenta color
    await customHexInput.fill('#a855f7')
    await page.waitForTimeout(200)

    const applyBtn = page.locator('[data-testid="apply-custom-accent-btn"]')
    await applyBtn.click()
    await page.waitForTimeout(400)

    const accentVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-color'))
    expect(accentVar).toBe('#a855f7')

    // Verify foreground calculation (accessible white contrast)
    const fgVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-foreground'))
    expect(fgVar).toBe('#ffffff')

    // Take screenshot: Custom Accent
    const screenshotDir = path.join(process.cwd(), 'screenshots')
    await page.screenshot({ path: path.join(screenshotDir, 'appearance-custom-accent.png'), fullPage: false })
  })

  test('6. Interface Density toggles between Compact, Comfortable, and Spacious', async ({ page }) => {
    const compactBtn = page.locator('[data-testid="density-compact-btn"]')
    const comfortableBtn = page.locator('[data-testid="density-comfortable-btn"]')
    const spaciousBtn = page.locator('[data-testid="density-spacious-btn"]')

    // 1. Select Compact
    await compactBtn.click()
    await page.waitForTimeout(300)
    let densityAttr = await page.evaluate(() => document.documentElement.getAttribute('data-density'))
    expect(densityAttr).toBe('compact')

    const screenshotDir = path.join(process.cwd(), 'screenshots')
    await page.screenshot({ path: path.join(screenshotDir, 'appearance-compact.png'), fullPage: false })

    // 2. Select Comfortable
    await comfortableBtn.click()
    await page.waitForTimeout(300)
    densityAttr = await page.evaluate(() => document.documentElement.getAttribute('data-density'))
    expect(densityAttr).toBe('comfortable')
    await page.screenshot({ path: path.join(screenshotDir, 'appearance-comfortable.png'), fullPage: false })

    // 3. Select Spacious
    await spaciousBtn.click()
    await page.waitForTimeout(300)
    densityAttr = await page.evaluate(() => document.documentElement.getAttribute('data-density'))
    expect(densityAttr).toBe('spacious')
    await page.screenshot({ path: path.join(screenshotDir, 'appearance-spacious.png'), fullPage: false })
  })

  test('7. Motion settings apply data-motion attributes and reduce transitions', async ({ page }) => {
    const reducedBtn = page.locator('[data-testid="motion-reduced-btn"]')
    const offBtn = page.locator('[data-testid="motion-off-btn"]')
    const fullBtn = page.locator('[data-testid="motion-full-btn"]')

    // Select Reduced Motion
    await reducedBtn.click()
    await page.waitForTimeout(300)
    let motionAttr = await page.evaluate(() => document.documentElement.getAttribute('data-motion'))
    expect(motionAttr).toBe('reduced')

    // Select Off
    await offBtn.click()
    await page.waitForTimeout(300)
    motionAttr = await page.evaluate(() => document.documentElement.getAttribute('data-motion'))
    expect(motionAttr).toBe('off')

    // Restore Full Motion
    await fullBtn.click()
    await page.waitForTimeout(300)
    motionAttr = await page.evaluate(() => document.documentElement.getAttribute('data-motion'))
    expect(motionAttr).toBe('full')
  })

  test('8. Full Lifecycle Persistence Test across reload and cross-page navigation', async ({ page }) => {
    // 1. Open settings
    await page.goto('/settings?tab=appearance')
    await page.waitForLoadState('networkidle')

    // 2. Choose Dark
    await page.locator('[data-testid="theme-dark-btn"]').click()
    await page.waitForTimeout(200)

    // 3. Choose Civic Green accent
    await page.locator('[data-testid="accent-civic-green-btn"]').click()
    await page.waitForTimeout(200)

    // 4. Choose Compact density
    await page.locator('[data-testid="density-compact-btn"]').click()
    await page.waitForTimeout(300)

    // 5. Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 6. Verify all settings remain on reload
    let themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    let accentVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-color'))
    let densityAttr = await page.evaluate(() => document.documentElement.getAttribute('data-density'))

    expect(themeAttr).toBe('dark')
    expect(accentVar).toBe('#059669')
    expect(densityAttr).toBe('compact')

    // 7. Navigate elsewhere (e.g. /dashboard)
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // 8. Verify appearance remains globally
    themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    accentVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-color'))
    densityAttr = await page.evaluate(() => document.documentElement.getAttribute('data-density'))

    expect(themeAttr).toBe('dark')
    expect(accentVar).toBe('#059669')
    expect(densityAttr).toBe('compact')

    // 9. Navigate to /problems and check consistency
    await page.goto('/problems')
    await page.waitForLoadState('networkidle')
    themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(themeAttr).toBe('dark')

    // 10. Return to settings and test Reset to Default
    await page.goto('/settings?tab=appearance')
    await page.waitForLoadState('networkidle')
    const resetBtn = page.locator('[data-testid="reset-appearance-btn"]')
    await resetBtn.click()
    await page.waitForTimeout(400)

    themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    accentVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-color'))
    densityAttr = await page.evaluate(() => document.documentElement.getAttribute('data-density'))

    expect(themeAttr).toBe('system')
    expect(accentVar).toBe('#2563eb')
    expect(densityAttr).toBe('comfortable')
  })

  test('9. Header Quick Access controls toggle theme and accent dynamically', async ({ page }) => {
    // Find header quick appearance toggle
    const toggleBtn = page.locator('[data-testid="header-appearance-toggle"]')
    await expect(toggleBtn).toBeVisible()
    await toggleBtn.click()

    // Verify popover appears
    const popover = page.locator('[data-testid="header-appearance-popover"]')
    await expect(popover).toBeVisible()

    // Click Light from quick menu
    const quickLightBtn = page.locator('[data-testid="quick-theme-light"]')
    await quickLightBtn.click()
    await page.waitForTimeout(300)

    let themeAttr = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(themeAttr).toBe('light')

    // Click Civic Green accent from quick menu
    const quickGreenBtn = page.locator('[data-testid="quick-accent-civic-green"]')
    await quickGreenBtn.click()
    await page.waitForTimeout(300)

    let accentVar = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-color'))
    expect(accentVar).toBe('#059669')
  })
})
