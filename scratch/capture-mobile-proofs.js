const { chromium, devices } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Prajan\\.gemini\\antigravity\\brain\\4846d6ba-7419-440f-a036-ae30beb4451a';

async function captureMobileProofs() {
  console.log('Launching browser for Mobile Screenshot captures...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Emulate iPhone 14 / Pixel 7 viewport (390 x 844)
  const context = await browser.newContext({
    ...devices['iPhone 14'],
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  });

  const page = await context.newPage();
  page.setDefaultTimeout(20000);

  // 1. Mobile Dashboard (Light Mode)
  console.log('1. Capturing Mobile Dashboard (Light Mode)...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-resolved-theme', 'light');
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-01-dashboard-light.png') });

  // 2. Mobile Dashboard (Dark Mode) with Bottom Navigation Bar
  console.log('2. Capturing Mobile Dashboard (Dark Mode)...');
  await page.evaluate(() => {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-resolved-theme', 'dark');
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-02-dashboard-dark.png') });

  // 3. Mobile Realistic Satellite Map with Live GPS HUD & Floating Basemap Pills
  console.log('3. Capturing Mobile Satellite Map...');
  await page.goto('http://localhost:3000/map', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Click satellite basemap button if present
  const satBtn = await page.$('[data-testid="basemap-satellite"]');
  if (satBtn) {
    await satBtn.click();
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-03-map-satellite.png') });

  // 4. Mobile Civic AI Assistant Drawer (opened via bottom tab)
  console.log('4. Capturing Mobile Civic AI Drawer...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const aiButton = await page.$('button[aria-label="Open Civic AI Assistant"]');
  if (aiButton) {
    await aiButton.click();
    await page.waitForTimeout(1500);
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-04-ai-assistant-drawer.png') });

  // 5. Mobile Problem Submission with Evidence Dropzone
  console.log('5. Capturing Mobile Problem Submission...');
  await page.goto('http://localhost:3000/problems/new', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-05-submit-problem.png') });

  // 6. Mobile Command Center Telemetry HUD
  console.log('6. Capturing Mobile Command Center...');
  await page.goto('http://localhost:3000/command-center', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-06-command-center.png') });

  // 7. Mobile Citizen SMS OTP Login Portal
  console.log('7. Capturing Mobile Citizen OTP Login...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  // Click citizen tab
  const citizenBtn = await page.$('button:has-text("Citizen")');
  if (citizenBtn) {
    await citizenBtn.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-07-login-citizen-otp.png') });

  // 8. Mobile Student Solver Portal
  console.log('8. Capturing Mobile Student Login...');
  const studentBtn = await page.$('button:has-text("Student")');
  if (studentBtn) {
    await studentBtn.click();
    await page.waitForTimeout(1000);
  }
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-08-login-student.png') });

  // 9. Mobile Solution Library & Adaptations
  console.log('9. Capturing Mobile Solution Library...');
  await page.goto('http://localhost:3000/solution-library', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-09-solution-library.png') });

  // 10. Mobile Agile Projects Kanban Workspace
  console.log('10. Capturing Mobile Projects Workspace...');
  await page.goto('http://localhost:3000/projects', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'mobile-10-projects-workspace.png') });

  console.log('All 10 mobile screenshots captured successfully!');
  await browser.close();
}

captureMobileProofs().catch((err) => {
  console.error('Failed to capture mobile proofs:', err);
  process.exit(1);
});
