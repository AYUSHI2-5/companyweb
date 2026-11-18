import json

projects_data = [
    {
        "num": 1,
        "title": "KP E-Services",
        "slug": "kp-e-services",
        "category": "enterprise cloud web mobile",
        "img": "assets/portfolio-hero-1.png",
        "case_badge": "CASE STUDY 01",
        "industry": "FinTech &amp; Loan Operations",
        "kicker": "Loan Lifecycle &amp; Digital Operations Platform",
        "desc": "A loan operations platform for connectors, customers, and the internal team. It follows an application from lead and pre-login through documentation, sanction, and disbursement, with bank criteria, payouts, referrals, wallets, and support tickets."
    },
    {
        "num": 2,
        "title": "Ashray Labs",
        "slug": "ashray-labs",
        "category": "web enterprise cloud mobile",
        "img": "assets/case-dental-clinic.jpg",
        "case_badge": "CASE STUDY 02",
        "industry": "Healthcare &amp; Diagnostics",
        "kicker": "Diagnostics Management &amp; Patient Portal",
        "desc": "A website and admin system for a pathology collection center. Patients book appointments, browse test packages, request quotations, and download reports and invoices. Staff manage patients, tests, cities, campaigns, and public content."
    },
    {
        "num": 3,
        "title": "ProCurve",
        "slug": "procurve",
        "category": "enterprise cloud ai",
        "img": "assets/about-office-mockup.jpg",
        "case_badge": "CASE STUDY 03",
        "industry": "Financial Valuation &amp; Advisory",
        "kicker": "Enterprise Financial Modeling &amp; Valuation Suite",
        "desc": "Business-valuation software for registered valuers. Users maintain clients, share capital, directors, and valuation files, then work through income, market, and net-asset methods on valuation sheets."
    },
    {
        "num": 4,
        "title": "Heart Foundation and Research Institute",
        "slug": "heart-foundation-and-research-institute",
        "category": "web enterprise cloud",
        "img": "assets/about-office.jpg",
        "case_badge": "CASE STUDY 04",
        "industry": "Medical Research &amp; Grants",
        "kicker": "Medical Research Grants &amp; Project Review Portal",
        "desc": "A registration and project-submission portal for organizations, individuals, and private entities. Applicants complete a profile, describe a project, and submit it for review, with administrative management and automated notifications."
    },
    {
        "num": 5,
        "title": "Vishan Institute of Technology",
        "slug": "vishan-institute-of-technology",
        "category": "web enterprise cloud",
        "img": "assets/hero-office-clean.jpg",
        "case_badge": "CASE STUDY 05",
        "industry": "Education &amp; Academic LMS",
        "kicker": "Institutional Campus Portal &amp; Academic LMS",
        "desc": "A college website with course pages, blogs, and online enrollment. Behind the site, staff manage batches, teachers, timetables, holidays, course documents, an e-library, and student invoices."
    },
    {
        "num": 6,
        "title": "Chick N Go",
        "slug": "chick-n-go",
        "category": "mobile web enterprise",
        "img": "assets/portfolio-hero-2.png",
        "case_badge": "CASE STUDY 06",
        "industry": "Food &amp; Beverage E-Commerce",
        "kicker": "Multi-Brand Food Ordering &amp; Kitchen Dispatch",
        "desc": "An online food-ordering site with an admin panel. Customers browse, place orders, pay, and manage their account. The admin side covers the store setup, and the app is built so the same frontend works on any domain."
    },
    {
        "num": 7,
        "title": "Sunshine Wholesale",
        "slug": "sunshine-wholesale",
        "category": "web enterprise",
        "img": "assets/case-coffee-roastery.jpg",
        "case_badge": "CASE STUDY 07",
        "industry": "B2B Wholesale &amp; Distribution",
        "kicker": "High-Volume B2B Storefront &amp; Inventory Engine",
        "desc": "A wholesale storefront for a Canadian distributor of smoking accessories. Buyers browse products, read blogs, and use account features such as wishlist and seller pages, backed by a comprehensive catalog admin panel."
    },
    {
        "num": 8,
        "title": "Cyclical Beauty",
        "slug": "cyclical-beauty",
        "category": "web mobile",
        "img": "assets/portfolio-hero-3.png",
        "case_badge": "CASE STUDY 08",
        "industry": "Beauty &amp; D2C E-Commerce",
        "kicker": "Shopify 2.0 D2C Storefront &amp; Wholesale Locator",
        "desc": "A Shopify storefront theme for a clean, multi-use beauty brand aimed at girls and women. Covers the home shop, product storytelling, a wholesale stockist application page, and a 'where to shop' store locator."
    },
    {
        "num": 9,
        "title": "LPG Booking",
        "slug": "lpg-booking",
        "category": "mobile enterprise cloud",
        "img": "assets/hero-office-rect.jpg",
        "case_badge": "CASE STUDY 09",
        "industry": "Energy &amp; Utility Operations",
        "kicker": "Utility Cylinder Booking &amp; Agent Wallet System",
        "desc": "An operations portal for LPG booking agents. Users register, manage booking sheets, raise issues on completed bookings, and recharge a wallet. Admins oversee users, roles, recharges, and support messages."
    },
    {
        "num": 10,
        "title": "Servizo",
        "slug": "servizo",
        "category": "mobile enterprise cloud",
        "img": "assets/case-fitness-app.jpg",
        "case_badge": "CASE STUDY 10",
        "industry": "On-Demand Services &amp; Marketplace",
        "kicker": "On-Demand Service Network &amp; Warranty Claims",
        "desc": "An admin system for an on-demand service business. It manages customers, service categories, service listings, vendor services, and warranty product claims, with status tracking and category control."
    },
    {
        "num": 11,
        "title": "Just Land",
        "slug": "just-land",
        "category": "web mobile enterprise",
        "img": "assets/hero-building.jpg",
        "case_badge": "CASE STUDY 11",
        "industry": "Real Estate &amp; Land Marketplace",
        "kicker": "Geospatial Land Marketplace &amp; FSBO Portal",
        "desc": "A property marketplace where visitors search listings, featured homes, FSBO (for sale by owner) properties, and agent profiles. Agents and principals manage listings and memberships, and buyers can save favorites and message through chat."
    },
    {
        "num": 12,
        "title": "Just My Team",
        "slug": "just-my-team",
        "category": "mobile enterprise web",
        "img": "assets/hero-crowd-overhead.jpg",
        "case_badge": "CASE STUDY 12",
        "industry": "Private Real Estate Social Network",
        "kicker": "Private Brokerage Network &amp; Downline Deal Room",
        "desc": "A private network for real-estate agents who join with a referral code. Agents manage their downline, properties, chats, membership, and personal notes. The public pages explain the platform; the working tools sit behind login."
    },
    {
        "num": 13,
        "title": "RealtyBizHub",
        "slug": "realtybizhub",
        "category": "web enterprise",
        "img": "assets/portfolio-hero-showcase.png",
        "case_badge": "CASE STUDY 13",
        "industry": "PropTech SaaS &amp; Marketing",
        "kicker": "PropTech Multi-Product Showcase &amp; Demo Funnel",
        "desc": "A marketing site and CMS for a set of real-estate software platforms. The public pages cover the hero, featured products, articles, and a 'book a demo' form. Admins edit branding, page sections, articles, and incoming demo requests."
    },
    {
        "num": 14,
        "title": "Dodani ERP",
        "slug": "dodani-erp",
        "category": "enterprise cloud",
        "img": "assets/about-office-showcase.png",
        "case_badge": "CASE STUDY 14",
        "industry": "Brokerage Back-Office &amp; Escrow ERP",
        "kicker": "Real Estate Brokerage ERP &amp; Escrow Tracker",
        "desc": "An internal real-estate operations system. Teams track leads and tasks, properties, offers, escrow, shared wells, documents, and a calendar, with comments on each record. It is the back-office workspace for a brokerage."
    },
    {
        "num": 15,
        "title": "Arizona Land Investors",
        "slug": "arizona-land-investors",
        "category": "web enterprise cloud",
        "img": "assets/contact-hero-workspace.png",
        "case_badge": "CASE STUDY 15",
        "industry": "Private Land Syndication &amp; Capital",
        "kicker": "Land Syndication Platform &amp; Summit Portal",
        "desc": "A private land-investment platform for investors, owners, and developers. The public site presents strategy, properties, and a summit, while logged-in users manage favorites, interest, escrow, and a portfolio."
    },
    {
        "num": 16,
        "title": "Micro Matching",
        "slug": "micro-matching",
        "category": "enterprise ai cloud web",
        "img": "assets/cta-collaboration.jpg",
        "case_badge": "CASE STUDY 16",
        "industry": "Influencer Marketing &amp; AdTech",
        "kicker": "Creator Marketplace &amp; Automated KYC Admin Panel",
        "desc": "An admin panel that connects brands with influencers. Staff review influencer and brand profiles, campaigns, KYC documents, packages, and coupons, and track payments through Stripe."
    }
]

# Generate grid cards HTML
grid_html = ""
for p in projects_data:
    grid_html += f'''          <!-- Case Study {p['num']:02d}: {p['title']} -->
          <article class="portfolio-card portfolio-card-item scroll-reveal" data-category="{p['category']}">
            <div class="portfolio-card-media">
              <img src="{p['img']}" alt="{p['title']} - {p['industry']}" class="portfolio-card-img" width="580" height="320" loading="lazy">
              <div class="portfolio-case-badge">{p['case_badge']}</div>
              <div class="portfolio-industry-badge">{p['industry']}</div>
            </div>
            <div class="portfolio-card-body">
              <div class="portfolio-card-kicker">{p['kicker']}</div>
              <h2 class="portfolio-card-title">{p['title']}</h2>
              <p class="portfolio-card-desc">{p['desc']}</p>

              <div class="portfolio-card-actions">
                <a href="projects/{p['slug']}/" class="btn-portfolio-view" aria-label="View {p['title']} Project Case Study">
                  <span>View Project</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </article>\n\n'''

with open('portfolio.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace content of <div class="portfolio-grid">
pos_grid_start = text.find('<div class="portfolio-grid">')
pos_grid_content_start = pos_grid_start + len('<div class="portfolio-grid">\n')
pos_grid_end = text.find('</div>\n      </div>\n    </section>', pos_grid_start)

new_portfolio_html = text[:pos_grid_content_start] + grid_html + text[pos_grid_end:]

# Also update the asset version in portfolio.html to v=31
new_portfolio_html = new_portfolio_html.replace('style.css?v=28', 'style.css?v=31')
new_portfolio_html = new_portfolio_html.replace('style.css?v=30', 'style.css?v=31')
new_portfolio_html = new_portfolio_html.replace('main.js?v=28', 'main.js?v=31')
new_portfolio_html = new_portfolio_html.replace('main.js?v=30', 'main.js?v=31')

with open('portfolio.html', 'w', encoding='utf-8') as f:
    f.write(new_portfolio_html)

print("Successfully generated all 16 streamlined cards in portfolio.html!")

