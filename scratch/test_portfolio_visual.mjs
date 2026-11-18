import { chromium } from 'playwright';

async function testVisual() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:8080/index.html...');
  await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle' });

  // Hover over the portfolio nav item
  console.log('Hovering over Portfolio nav item...');
  const portfolioLink = page.locator('#nav-portfolio-link');
  await portfolioLink.hover();
  await page.waitForTimeout(600);

  // Take screenshot of open mega menu
  await page.screenshot({ path: 'scratch/portfolio_mega_menu_actual_categories.png' });
  console.log('Saved screenshot to scratch/portfolio_mega_menu_actual_categories.png');

  // Click on "Enterprise Software & ERP" card
  console.log('Clicking on Enterprise Software & ERP card in dropdown...');
  const enterpriseCard = page.locator('#portfolio-mega-menu .mega-menu-card[data-category="enterprise"]');
  await enterpriseCard.click();
  await page.waitForTimeout(1000);

  console.log('Current URL after click:', page.url());

  // Screenshot filtered portfolio page
  await page.screenshot({ path: 'scratch/portfolio_page_filtered_enterprise.png' });
  console.log('Saved screenshot to scratch/portfolio_page_filtered_enterprise.png');

  await browser.close();
}

testVisual().catch(err => {
  console.error('Visual test failed:', err);
  process.exit(1);
});
