import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to 1440x900
  await page.setViewport({ width: 1440, height: 900 });
  
  const filePath = 'file://' + path.resolve(__dirname, '../projects/kp-e-services/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  
  // Scroll to CTA section
  const ctaElement = await page.$('.cta-banner-card');
  if (ctaElement) {
    await ctaElement.scrollIntoView();
    // take screenshot of the card
    await ctaElement.screenshot({ path: path.resolve(__dirname, 'cta_card_desktop.png') });
    console.log('Saved cta_card_desktop.png');
  } else {
    console.log('CTA element not found');
  }

  // Mobile viewport
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  const ctaMobile = await page.$('.cta-banner-card');
  if (ctaMobile) {
    await ctaMobile.scrollIntoView();
    await ctaMobile.screenshot({ path: path.resolve(__dirname, 'cta_card_mobile.png') });
    console.log('Saved cta_card_mobile.png');
  }

  await browser.close();
}

capture().catch(console.error);

