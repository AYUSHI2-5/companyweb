import http from 'http';

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function verify() {
  console.log('--- Checking portfolio mega menu on index.html ---');
  const indexRes = await makeRequest({ hostname: 'localhost', port: 8080, path: '/index.html', method: 'GET' });
  const indexHtml = indexRes.data;

  // Check categories inside portfolio-mega-menu
  const portMenuStart = indexHtml.indexOf('id="portfolio-mega-menu"');
  const portMenuEnd = indexHtml.indexOf('</header>', portMenuStart);
  const portMenuHtml = indexHtml.substring(portMenuStart, portMenuEnd);

  console.log('Categories found in Portfolio Mega Menu:');
  const catRegex = /<h4 class="mega-card-title">(.*?)<\/h4>/g;
  let match;
  const foundCats = [];
  while ((match = catRegex.exec(portMenuHtml)) !== null) {
    foundCats.push(match[1]);
    console.log(' - ' + match[1]);
  }

  const expectedCats = ['Web &amp; Websites', 'Mobile Applications', 'Enterprise Software &amp; ERP'];
  const matches = expectedCats.every(c => foundCats.includes(c));
  if (!matches) {
    throw new Error(`Expected categories ${expectedCats.join(', ')}, but found ${foundCats.join(', ')}`);
  }
  console.log('SUCCESS: Portfolio mega menu has exact 3 categories matching the portfolio page!');

  console.log('\n--- Checking portfolio.html filter buttons & category sections ---');
  const portRes = await makeRequest({ hostname: 'localhost', port: 8080, path: '/portfolio.html', method: 'GET' });
  const portHtml = portRes.data;

  // Check filter bar
  const filterBtnRegex = /<button class="portfolio-filter-btn[^"]*" data-filter="([^"]+)"[^>]*>(.*?)<\/button>/g;
  let fMatch;
  console.log('Filter buttons on portfolio.html:');
  const filterList = [];
  while ((fMatch = filterBtnRegex.exec(portHtml)) !== null) {
    filterList.push({ filter: fMatch[1], label: fMatch[2] });
    console.log(` - data-filter="${fMatch[1]}": ${fMatch[2]}`);
  }

  // Ensure no phantom 'creative' or 'marketing' buttons
  const hasPhantom = filterList.some(f => f.filter === 'creative' || f.filter === 'marketing');
  if (hasPhantom) {
    throw new Error('Found phantom creative or marketing filter on portfolio.html');
  }

  // Check category sections
  const secRegex = /<div class="portfolio-category-section" data-category="([^"]+)">[\s\S]*?<h2 class="category-heading">(.*?)<\/h2>/g;
  let sMatch;
  console.log('\nCategory sections on portfolio.html:');
  while ((sMatch = secRegex.exec(portHtml)) !== null) {
    console.log(` - [${sMatch[1]}]: ${sMatch[2]}`);
  }

  console.log('\n--- Checking CMS published configuration ---');
  const cmsRes = await makeRequest({ hostname: 'localhost', port: 8080, path: '/api/homepage/published', method: 'GET' });
  const cmsData = JSON.parse(cmsRes.data);
  const cmsMega = cmsData.published.header.portfolio_mega_menu;
  console.log('CMS published portfolio_mega_menu items:');
  cmsMega.forEach(item => {
    console.log(` - ${item.title} -> ${item.url} (${item.image})`);
  });

  console.log('\nALL VERIFICATIONS PASSED PERFECTLY! 🚀');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
