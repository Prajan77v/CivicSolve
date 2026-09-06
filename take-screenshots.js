const { chromium } = require('@playwright/test');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();
const outDir = 'C:\\Users\\Prajan\\.gemini\\antigravity\\brain\\4846d6ba-7419-440f-a036-ae30beb4451a\\screenshots';

async function takeScreenshots() {
  console.log('Capturing UI screenshots for walkthrough...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    const p = await prisma.problem.findFirst();
    const pr = await prisma.project.findFirst();

    // 1. Landing
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(outDir, 'landing.png') });
    console.log(' - Saved landing.png');

    // 2. Dashboard
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(outDir, 'dashboard.png') });
    console.log(' - Saved dashboard.png');

    // 3. Problems Explorer
    await page.goto('http://localhost:3000/problems', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(outDir, 'problems.png') });
    console.log(' - Saved problems.png');

    // 4. Problem Dossier
    if (p) {
      await page.goto(`http://localhost:3000/problems/${p.id}`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.screenshot({ path: path.join(outDir, 'problem-detail.png') });
      console.log(' - Saved problem-detail.png');
    }

    // 5. Project Workspace
    if (pr) {
      await page.goto(`http://localhost:3000/projects/${pr.id}`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.screenshot({ path: path.join(outDir, 'project-workspace.png') });
      console.log(' - Saved project-workspace.png');
    }

    // 6. Partners & Sandbox Support
    await page.goto('http://localhost:3000/partners', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(outDir, 'partners.png') });
    console.log(' - Saved partners.png');

    // 7. Solution Library
    await page.goto('http://localhost:3000/solution-library', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(outDir, 'solution-library.png') });
    console.log(' - Saved solution-library.png');

    // 8. Verify
    await page.goto('http://localhost:3000/verify/CERT-WATER-2025-001', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(outDir, 'verify.png') });
    console.log(' - Saved verify.png');

    // 9. Command Center
    await page.goto('http://localhost:3000/command-center', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(outDir, 'command-center.png') });
    console.log(' - Saved command-center.png');

    // 10. Responsive Checks: Tablet & Mobile
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(outDir, 'dashboard-tablet.png') });
    console.log(' - Saved dashboard-tablet.png');

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(outDir, 'dashboard-mobile.png') });
    console.log(' - Saved dashboard-mobile.png');

    console.log('All screenshots captured successfully!');
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

takeScreenshots();
