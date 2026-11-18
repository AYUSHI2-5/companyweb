import fs from 'fs';

const homepageFile = 'data/homepage.json';
const data = JSON.parse(fs.readFileSync(homepageFile, 'utf8'));

const portfolioMega = [
  {
    title: 'Web & Websites',
    url: 'portfolio.html?filter=web',
    image: 'assets/mega-web-services.jpg'
  },
  {
    title: 'Mobile Applications',
    url: 'portfolio.html?filter=mobile',
    image: 'assets/mega-mobile-apps.jpg'
  },
  {
    title: 'Enterprise Software & ERP',
    url: 'portfolio.html?filter=enterprise',
    image: 'assets/mega-service-software.jpg'
  }
];

if (!data.published.header) data.published.header = {};
data.published.header.portfolio_mega_menu = portfolioMega;

if (!data.draft.header) data.draft.header = {};
data.draft.header.portfolio_mega_menu = portfolioMega;

fs.writeFileSync(homepageFile, JSON.stringify(data, null, 2), 'utf8');
console.log('data/homepage.json updated with 3 portfolio mega menu categories!');
