import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = 'C:\\Users\\acer\\OneDrive - ELCOT\\PROJECTS\\ALERT SYSTEM\\doc_images';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  console.log('Navigating to http://127.0.0.1:5173...');
  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle0', timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Command Center Top View
  console.log('Capturing 01_command_center.png...');
  await page.screenshot({ path: path.join(outDir, '01_command_center.png') });

  // 2. Pollutant Intelligence Matrix
  console.log('Capturing 02_pollutants_matrix.png...');
  const polGrid = await page.$('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4');
  if (polGrid) {
    await polGrid.screenshot({ path: path.join(outDir, '02_pollutants_matrix.png') });
  }

  // 3. Scroll down for Forecast & ML Section
  console.log('Capturing 03_ml_forecast.png...');
  await page.evaluate(() => window.scrollTo(0, 550));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, '03_ml_forecast.png') });

  // 4. Switch to Pollution Map Tab
  console.log('Capturing 04_pollution_map.png...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const buttons = Array.from(document.querySelectorAll('nav button'));
    const mapBtn = buttons.find(b => b.textContent && b.textContent.includes('Pollution Map'));
    if (mapBtn) mapBtn.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '04_pollution_map.png') });

  // 5. Switch to Alert Center Tab
  console.log('Capturing 05_alert_center.png...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const buttons = Array.from(document.querySelectorAll('nav button'));
    const alertBtn = buttons.find(b => b.textContent && b.textContent.includes('Alert Center'));
    if (alertBtn) alertBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, '05_alert_center.png') });

  // 6. Open Explainable AI Modal
  console.log('Capturing 06_explainable_ai_modal.png...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const expBtn = buttons.find(b => b.textContent && b.textContent.includes('Why This Alert'));
    if (expBtn) expBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '06_explainable_ai_modal.png') });

  // Close Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[title="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 7. Launch Demo Mode & Advance to Step 3
  console.log('Capturing 07_demo_stepper.png...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button'));
    const cmdBtn = buttons.find(b => b.textContent && b.textContent.includes('Command Center'));
    if (cmdBtn) cmdBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const demoBtn = buttons.find(b => b.textContent && b.textContent.includes('Launch Demo'));
    if (demoBtn) demoBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '07_demo_stepper.png') });

  await browser.close();
  console.log('SUCCESS: All 7 screenshots captured cleanly into doc_images!');
}

run().catch(err => {
  console.error('Error during screen capture:', err);
  process.exit(1);
});
