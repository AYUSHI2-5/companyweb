import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:8080/projects/kp-e-services/', { waitUntil: 'networkidle0' });

  // Scroll to CTA section
  const ctaElement = await page.$('.cta-banner-section');
  if (ctaElement) {
    await ctaElement.scrollIntoView();
  }

  await page.screenshot({ path: 'scratch/cta_actual_render.png', fullPage: false });

  // Get bounding boxes and styles
  const info = await page.evaluate(() => {
    const cta = document.querySelector('.cta-banner-card');
    const btn = document.querySelector('.cta-banner-card .btn-primary-pill');
    const visual = document.querySelector('.cta-banner-visual');
    const img = document.querySelector('.cta-collab-img');
    const computedBtn = btn ? window.getComputedStyle(btn) : null;
    const computedVisual = visual ? window.getComputedStyle(visual) : null;
    return {
      cardExists: !!cta,
      btnExists: !!btn,
      btnColor: computedBtn ? computedBtn.color : null,
      btnBg: computedBtn ? computedBtn.backgroundColor : null,
      btnDisplay: computedBtn ? computedBtn.display : null,
      visualDisplay: computedVisual ? computedVisual.display : null,
      visualWidth: computedVisual ? computedVisual.width : null,
      imgSrc: img ? img.src : null,
      imgNaturalWidth: img ? img.naturalWidth : null,
      html: cta ? cta.outerHTML.slice(0, 500) : null
    };
  });

  console.log('CTA Info:', JSON.stringify(info, null, 2));
  await browser.close();
})();
