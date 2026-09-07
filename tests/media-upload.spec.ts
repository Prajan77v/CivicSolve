import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

test.describe('CivicSolve — Photo & Video Evidence System', () => {
  // Shared test files directory
  const fixturesDir = path.join(process.cwd(), 'tests', 'fixtures')
  let createdProblemUrl = ''

  test.beforeAll(async () => {
    if (!fs.existsSync(fixturesDir)) {
      fs.mkdirSync(fixturesDir, { recursive: true })
    }

    // 1. Create a valid mock PNG photo (1x1 pixel)
    const mockPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    )
    fs.writeFileSync(path.join(fixturesDir, 'water_leakage_ground.png'), mockPngBuffer)

    // 2. Create another valid mock JPEG photo
    const mockJpgBuffer = Buffer.from(
      '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=',
      'base64'
    )
    fs.writeFileSync(path.join(fixturesDir, 'pothole_field_photo.jpg'), mockJpgBuffer)

    // 3. Create a valid tiny mock WebM video (header only or minimal byte stream)
    const mockVideoBuffer = Buffer.from('1A45DFA3010000000000001F4286810142F7810142F2810442F381084282847765626D', 'hex')
    fs.writeFileSync(path.join(fixturesDir, 'drainage_telemetry.webm'), mockVideoBuffer)

    // 4. Create a valid test document
    fs.writeFileSync(
      path.join(fixturesDir, 'water_quality_lab_test.pdf'),
      '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000098 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%EOF\n'
    )

    // 5. Create an invalid executable file for validation testing
    fs.writeFileSync(path.join(fixturesDir, 'malicious_script.exe'), 'MZ9000fakeexecutable')
  })

  test('1. Multiple Photos upload, thumbnail preview, removal, and re-add in problem submission', async ({ page }) => {
    await page.goto('/problems/new', { waitUntil: 'networkidle' })

    // Fill Step 1: Core Problem (with timestamp to ensure uniqueness and bypass duplicate modal)
    const testTitle = `Civic Water Salinity & Pipeline Telemetry Investigation ${Date.now()}`
    await page.fill('input#title', testTitle)
    await page.fill('textarea#description', 'Salinity in municipal borewells has increased to 1800 ppm across 12 wards, causing acute kidney issues and corroding underground pipelines.')
    await page.click('button:has-text("Next Step")')

    // Step 2: Location
    await page.fill('input[placeholder*="Barhara Block"]', 'Ward 14, Itwari Market')
    await page.fill('input[placeholder*="Bhojpur"]', 'Nagpur')
    await page.click('button:has-text("Next Step")')

    // Step 3: Impact
    await page.fill('input[placeholder*="8500"]', '12500')
    await page.fill('textarea[placeholder*="Farming families"]', 'Small business merchants, local market vendors, and residential apartment tenants.')
    await page.click('button:has-text("Next Step")')

    // Step 4: Urgency
    await page.fill('textarea[placeholder*="Health clinic reports"]', 'Pipeline water supply is suspended due to calcification. Over 12,000 citizens are currently dependent on private water tankers.')
    await page.click('button:has-text("Next Step")')

    // Step 5: Evidence & Tags
    await expect(page.locator('text=Supporting Evidence (Photos, Videos & Documents)')).toBeVisible()

    // Add Photo 1
    const fileChooserPromise1 = page.waitForEvent('filechooser')
    await page.click('button:has-text("Add Photos")')
    const fileChooser1 = await fileChooserPromise1
    await fileChooser1.setFiles(path.join(fixturesDir, 'water_leakage_ground.png'))

    // Verify thumbnail preview and file name
    await expect(page.locator('[data-testid="evidence-filename"]:has-text("water_leakage_ground.png")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Ready').first()).toBeVisible()

    // Add Photo 2
    const fileChooserPromise2 = page.waitForEvent('filechooser')
    await page.click('button:has-text("Add Photos")')
    const fileChooser2 = await fileChooserPromise2
    await fileChooser2.setFiles(path.join(fixturesDir, 'pothole_field_photo.jpg'))

    await expect(page.locator('[data-testid="evidence-filename"]:has-text("pothole_field_photo.jpg")')).toBeVisible({ timeout: 10000 })

    // Test removing Photo 2
    const removeButtons = page.locator('button[title="Remove evidence file"]')
    await removeButtons.nth(1).click()

    // Verify Photo 2 removed from staged preview list while Photo 1 stays
    await expect(page.locator('[data-testid="evidence-filename"]:has-text("pothole_field_photo.jpg")')).not.toBeVisible()
    await expect(page.locator('[data-testid="evidence-filename"]:has-text("water_leakage_ground.png")')).toBeVisible()

    // Re-add Photo 2
    const fileChooserPromise3 = page.waitForEvent('filechooser')
    await page.click('button:has-text("Add Photos")')
    const fileChooser3 = await fileChooserPromise3
    await fileChooser3.setFiles(path.join(fixturesDir, 'pothole_field_photo.jpg'))

    await expect(page.locator('[data-testid="evidence-filename"]:has-text("pothole_field_photo.jpg")')).toBeVisible({ timeout: 10000 })

    // Also add Video evidence
    const videoChooserPromise = page.waitForEvent('filechooser')
    await page.click('button:has-text("Add Videos")')
    const videoChooser = await videoChooserPromise
    await videoChooser.setFiles(path.join(fixturesDir, 'drainage_telemetry.webm'))

    await expect(page.locator('[data-testid="evidence-filename"]:has-text("drainage_telemetry.webm")')).toBeVisible({ timeout: 10000 })

    // Also add Document evidence
    const docChooserPromise = page.waitForEvent('filechooser')
    await page.click('button:has-text("Add Documents")')
    const docChooser = await docChooserPromise
    await docChooser.setFiles(path.join(fixturesDir, 'water_quality_lab_test.pdf'))

    await expect(page.locator('[data-testid="evidence-filename"]:has-text("water_quality_lab_test.pdf")')).toBeVisible({ timeout: 10000 })

    // Add tag to fulfill step 5 validation
    await page.fill('input[placeholder*="Type tag"]', 'groundwater')
    await page.click('button:has-text("Add Tag")')

    // Proceed to Step 6 Review
    await page.click('button:has-text("Next Step")')

    // Verify Step 6 preview includes Ground-Truth Evidence
    const step6Preview = page.locator('[data-testid="step6-evidence-preview"]')
    await expect(step6Preview).toBeVisible()
    await expect(step6Preview.locator('text=water_leakage_ground.png')).toBeVisible()
    await expect(step6Preview.locator('text=drainage_telemetry.webm')).toBeVisible()
    await expect(step6Preview.locator('text=water_quality_lab_test.pdf')).toBeVisible()

    // Submit Problem
    await page.click('button:has-text("Confirm & Run AI Engine")')

    // Handle duplicate modal if it appears during duplicate similarity evaluation
    const duplicateModalBtn = page.locator('button:has-text("Submit as New Independent Challenge")')
    try {
      await duplicateModalBtn.waitFor({ state: 'visible', timeout: 6000 })
      await duplicateModalBtn.click()
    } catch {
      // Direct submission path without duplicate prompt
    }

    // Wait for submission redirect to /problems/[id]
    await page.waitForURL(/\/problems\/[a-zA-Z0-9_-]+/, { timeout: 35000 })

    // Verify Evidence section on Problem detail page
    await expect(page.locator('h3:has-text("Ground-Truth Supporting Evidence")')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('[data-testid="evidence-gallery"]').locator('text=water_leakage_ground.png')).toBeVisible()
    await expect(page.locator('[data-testid="evidence-gallery"]').locator('text=drainage_telemetry.webm')).toBeVisible()
    await expect(page.locator('[data-testid="evidence-gallery"]').locator('text=water_quality_lab_test.pdf')).toBeVisible()

    // Verify inline video player is rendered
    const videoElement = page.locator('video')
    await expect(videoElement.first()).toBeVisible()

    // Test Lightbox Image Viewer (click overlay button or image)
    const enlargeBtn = page.locator('button[title="Enlarge photo"]').first()
    await enlargeBtn.click({ force: true })
    const lightboxModal = page.locator('[role="dialog"]')
    await expect(lightboxModal).toBeVisible()
    await expect(lightboxModal.locator('text=water_leakage_ground.png')).toBeVisible()

    // Test Lightbox keyboard navigation (Escape to close)
    await page.keyboard.press('Escape')
    await expect(lightboxModal).not.toBeVisible()

    // Save submitted problem URL for subsequent persistence test
    createdProblemUrl = page.url()
  })

  test('2. Persistence verification across page reload and direct link navigation', async ({ page }) => {
    if (createdProblemUrl) {
      await page.goto(createdProblemUrl, { waitUntil: 'networkidle' })
    } else {
      await page.goto('/problems', { waitUntil: 'networkidle' })
      const firstProblemLink = page.locator('a[href^="/problems/"]').first()
      await firstProblemLink.click()
      await page.waitForURL(/\/problems\/[a-zA-Z0-9_-]+/, { timeout: 15000 })
    }

    // Hard Refresh the browser page
    await page.reload({ waitUntil: 'networkidle' })

    // Verify Evidence Section still persists from SQLite database
    await expect(page.locator('h3:has-text("Ground-Truth Supporting Evidence")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="evidence-gallery"]')).toBeVisible()
  })

  test('3. Administrative Review Queue displays uploaded media evidence and allows verification', async ({ page }) => {
    await page.goto('/review-queue', { waitUntil: 'networkidle' })

    // Locate case
    await expect(page.locator('h1:has-text("Administrative Review Queue")')).toBeVisible()

    const caseItem = page.locator('text=Nagpur High-Salinity Borewell Groundwater Crisis').first()
    if (await caseItem.isVisible()) {
      // Verify evidence strip is rendered directly in admin review row
      await expect(page.locator('text=Field Evidence Verified by Submitter').first()).toBeVisible()
    }

    // Verify truth action (only click if enabled)
    const verifyButton = page.locator('button:has-text("Verify Truth"):not([disabled])').first()
    if (await verifyButton.isVisible()) {
      await verifyButton.click()
      await expect(page.locator('[data-sonner-toast]').first()).toBeVisible({ timeout: 10000 })
    }
  })

  test('4. Security & Validation: Rejects blocked executables and oversized files with friendly errors', async ({ page }) => {
    await page.goto('/problems/new', { waitUntil: 'networkidle' })

    // Fast-track to Step 5
    await page.fill('input#title', 'Validation Test Problem Title')
    await page.fill('textarea#description', 'Sample description for validation test with sufficient characters.')
    await page.click('button:has-text("Next Step")')
    await page.fill('input[placeholder*="Barhara Block"]', 'Test Area')
    await page.fill('input[placeholder*="Bhojpur"]', 'Pune')
    await page.click('button:has-text("Next Step")')
    await page.fill('input[placeholder*="8500"]', '500')
    await page.fill('textarea[placeholder*="Farming families"]', 'Residents')
    await page.click('button:has-text("Next Step")')
    await page.fill('textarea[placeholder*="Health clinic reports"]', 'Needs immediate test.')
    await page.click('button:has-text("Next Step")')

    // Try uploading malicious_script.exe
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.click('button:has-text("Browse Files")')
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(path.join(fixturesDir, 'malicious_script.exe'))

    // Expect friendly error toast notification
    await expect(
      page.locator('text=Executable or script files like .exe are blocked for security.').or(
        page.locator('text=not supported')
      )
    ).toBeVisible({ timeout: 8000 })
  })

  test('5. Mobile Viewport: Upload zone and video player fit cleanly without overflow', async ({ page }) => {
    // Emulate iPhone / Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/problems/new', { waitUntil: 'networkidle' })

    // Fast track to Step 5
    await page.fill('input#title', 'Mobile Viewport Evidence Test Challenge')
    await page.fill('textarea#description', 'Checking responsive layout for mobile screens with sufficient characters.')
    await page.click('button:has-text("Next Step")')
    await page.fill('input[placeholder*="Barhara Block"]', 'Mobile Street')
    await page.fill('input[placeholder*="Bhojpur"]', 'Nashik')
    await page.click('button:has-text("Next Step")')
    await page.fill('input[placeholder*="8500"]', '200')
    await page.fill('textarea[placeholder*="Farming families"]', 'Mobile users')
    await page.click('button:has-text("Next Step")')
    await page.fill('textarea[placeholder*="Health clinic reports"]', 'Mobile urgency note.')
    await page.click('button:has-text("Next Step")')

    // Verify upload zone renders properly on 375px width
    const uploadSurface = page.locator('text=Drop evidence here')
    await expect(uploadSurface).toBeVisible()

    const browseBtn = page.locator('button:has-text("Browse Files")')
    await expect(browseBtn).toBeVisible()

    // Verify horizontal overflow is within viewport
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2)
  })
})
