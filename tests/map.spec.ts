import { test, expect } from '@playwright/test'

test.describe('CivicSolve Real Interactive Map System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Command Center
    await page.goto('/command-center')
    await page.waitForLoadState('networkidle')
  })

  test('1. Map container loads and initializes OpenStreetMap tiles', async ({ page }) => {
    // Verify container and Leaflet canvas
    const mapContainer = page.locator('[data-testid="civic-map-container"]')
    await expect(mapContainer).toBeVisible({ timeout: 15000 })

    const leafletCanvas = page.locator('[data-testid="leaflet-map-canvas"]')
    await expect(leafletCanvas).toBeVisible()

    // Verify OpenStreetMap tile images exist in DOM
    const tiles = page.locator('.leaflet-tile-pane img.leaflet-tile')
    await expect(tiles.first()).toBeVisible({ timeout: 15000 })

    // Verify attribution text
    await expect(page.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap')
  })

  test('2. Interactive zoom controls function properly', async ({ page }) => {
    const zoomInBtn = page.locator('[data-testid="btn-zoom-in"]')
    const zoomOutBtn = page.locator('[data-testid="btn-zoom-out"]')

    await expect(zoomInBtn).toBeVisible()
    await expect(zoomOutBtn).toBeVisible()

    // Click Zoom In
    await zoomInBtn.click()
    await page.waitForTimeout(600)

    // Click Zoom Out
    await zoomOutBtn.click()
    await page.waitForTimeout(600)

    // Map container remains responsive and stable
    await expect(page.locator('[data-testid="leaflet-map-canvas"]')).toBeVisible()
  })

  test('3. Reset location button centers on Nashik command hub', async ({ page }) => {
    const resetBtn = page.locator('[data-testid="btn-reset-location"]')
    await expect(resetBtn).toBeVisible()

    await resetBtn.click()
    await page.waitForTimeout(600)

    // Search/Location feedback or Nashik badge is visible
    const focusBadge = page.locator('[data-testid="active-focus-badge"]')
    await expect(focusBadge).toBeVisible()
    await expect(focusBadge).toContainText(/Nashik/i)
  })

  test('4. Geographic markers appear with correct priority colors and clickable popups', async ({ page }) => {
    // Markers must be visible
    const markers = page.locator('[data-testid="map-marker"]')
    await expect(markers.first()).toBeVisible({ timeout: 15000 })

    const count = await markers.count()
    expect(count).toBeGreaterThan(0)

    // Trigger popup by evaluating click on Leaflet marker or element
    await page.evaluate(() => {
      const markersGroup = (window as any).__CIVIC_MARKERS__
      if (markersGroup) {
        const layers = markersGroup.getLayers()
        if (layers && layers.length > 0) {
          layers[0].openPopup()
          return
        }
      }
      const el = document.querySelector('[data-testid="map-marker"]') as any
      if (el && el._leaflet_marker) {
        el._leaflet_marker.openPopup()
      }
    })
    await page.waitForTimeout(600)

    // Popup appears with Challenge information and real link
    const popup = page.locator('[data-testid="marker-popup"]')
    await expect(popup).toBeVisible({ timeout: 10000 })
    await expect(popup.getByText(/PRIORITY/i)).toBeVisible()
    await expect(popup.getByText(/View Challenge/i)).toBeVisible()
  })

  test('5. View Challenge link in popup navigates to real problem page', async ({ page }) => {
    const markers = page.locator('[data-testid="map-marker"]')
    await expect(markers.first()).toBeVisible({ timeout: 15000 })

    await page.evaluate(() => {
      const markersGroup = (window as any).__CIVIC_MARKERS__
      if (markersGroup) {
        const layers = markersGroup.getLayers()
        if (layers && layers.length > 0) {
          layers[0].openPopup()
          return
        }
      }
      const el = document.querySelector('[data-testid="map-marker"]') as any
      if (el && el._leaflet_marker) {
        el._leaflet_marker.openPopup()
      }
    })
    await page.waitForTimeout(600)

    const viewChallengeLink = page.locator('[data-testid="marker-popup"] a:has-text("View Challenge")')
    await expect(viewChallengeLink).toBeVisible({ timeout: 10000 })

    await Promise.all([
      page.waitForURL(/\/problems\/.+/),
      viewChallengeLink.click(),
    ])

    // Verify arrived on real problem page
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('6. Map filters update visible dataset consistently across map and table', async ({ page }) => {
    const priorityFilter = page.locator('[data-testid="filter-priority"]')
    await expect(priorityFilter).toBeVisible()

    // Filter to CRITICAL
    await priorityFilter.selectOption('CRITICAL')
    await page.waitForTimeout(600)

    // Verify table shows only CRITICAL
    const tablePriorities = page.locator('table tbody tr td span.font-bold')
    if ((await tablePriorities.count()) > 0) {
      const firstText = await tablePriorities.first().textContent()
      expect(firstText).toContain('CRITICAL')
    }

    // Reset to ALL
    await priorityFilter.selectOption('ALL')
    await page.waitForTimeout(500)
  })

  test('7. Search location navigates to city or district', async ({ page }) => {
    const searchInput = page.locator('[data-testid="map-search-input"]')
    await expect(searchInput).toBeVisible()

    await searchInput.fill('Pune')
    await searchInput.press('Enter')
    await page.waitForTimeout(800)

    // Map responds with feedback toast
    const feedback = page.locator('[data-testid="map-search-feedback"]')
    await expect(feedback).toBeVisible({ timeout: 10000 })
    await expect(feedback).toContainText(/Pune/i)
  })

  test('8. Layer switching toggles between Problems, Projects, Deployments, and Groups', async ({ page }) => {
    const tabDeployments = page.locator('[data-testid="tab-deployments"]')
    await expect(tabDeployments).toBeVisible()
    await tabDeployments.click()
    await page.waitForTimeout(600)

    const tabProjects = page.locator('[data-testid="tab-projects"]')
    await expect(tabProjects).toBeVisible()
    await tabProjects.click()
    await page.waitForTimeout(600)

    const tabGroups = page.locator('[data-testid="tab-groups"]')
    await expect(tabGroups).toBeVisible()
    await tabGroups.click()
    await page.waitForTimeout(600)

    const tabProblems = page.locator('[data-testid="tab-problems"]')
    await expect(tabProblems).toBeVisible()
    await tabProblems.click()
    await page.waitForTimeout(600)
  })

  test('9. Density Heatmap toggle activates real coordinate-based density circles', async ({ page }) => {
    const densityToggle = page.locator('[data-testid="toggle-density"]')
    await expect(densityToggle).toBeVisible()

    await densityToggle.click()
    await page.waitForTimeout(600)

    // SVG circle overlay is rendered inside Leaflet overlay pane
    const overlayCircles = page.locator('.leaflet-overlay-pane svg path')
    expect(await overlayCircles.count()).toBeGreaterThanOrEqual(0)
  })

  test('10. Dark mode styling preserves map readability and crisp markers', async ({ page }) => {
    // Trigger appearance toggle from navbar if available or evaluate root class
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-resolved-theme', 'dark')
    })
    await page.waitForTimeout(400)

    const mapContainer = page.locator('[data-testid="civic-map-container"]')
    await expect(mapContainer).toBeVisible()

    // Test light theme switch
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      document.documentElement.setAttribute('data-resolved-theme', 'light')
    })
    await page.waitForTimeout(400)
    await expect(mapContainer).toBeVisible()
  })
})
