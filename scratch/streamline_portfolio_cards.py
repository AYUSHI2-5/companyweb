import json
import re

descriptions = {
    'kp-e-services': 'A comprehensive FinTech and loan operations platform guiding applications from lead intake and pre-login through criteria validation, sanction, and disbursement, with digital connector wallets and support ticketing.',
    'ashray-labs': 'A digital healthcare portal and administrative management system for pathology collection centers, featuring online appointment booking, home test dispatch, dynamic packages, and secure patient report downloads.',
    'procurve': 'Specialized business valuation software for registered valuers to manage clients, share capital, and valuation files, modeling Discounted Cash Flow (DCF), market multiples, and Net Asset Value (NAV) methodologies.',
    'heart-foundation-and-research-institute': 'A research project submission and grant registration portal for healthcare organizations, scholars, and private entities, complete with reviewer scoring, compliance milestones, and automated notification alerts.',
    'vishan-institute-of-technology': 'An institutional college website with interactive course catalogs and enrollment workflows, backed by an administration suite for batch timetables, faculty assignments, fee invoicing, and a cloud e-library.',
    'chick-n-go': 'An online food-ordering storefront with a centralized kitchen admin console, dynamic menu variations, custom add-ons, and multi-gateway payment processing engineered to power multiple brand domains.',
    'sunshine-wholesale': 'A high-volume B2B wholesale storefront for a Canadian smoking accessories distributor, featuring tiered wholesale pricing, buyer accounts, inventory sync, bulk order matrix, and SEO-optimized blogs.',
    'cyclical-beauty': 'A modern Shopify 2.0 theme crafted for a clean, multi-use beauty brand, featuring mobile-first product storytelling, ingredient transparency, wholesale stockist applications, and an interactive store locator.',
    'lpg-booking': 'An operational portal for LPG booking agents to process bulk booking sheets, recharge digital agent wallets, manage customer order lifecycles, and escalate post-delivery service tickets.',
    'servizo': 'An on-demand service marketplace admin system managing customer bookings, service categories, dynamic diagnostic questions, technician dispatch, vendor commissions, and warranty product claims.',
    'just-land': 'An interactive property marketplace where buyers explore land listings, featured homes, FSBO (for sale by owner) acreage, and broker profiles with geospatial maps, direct chat, and saved searches.',
    'just-my-team': 'A private networking platform for real-estate professionals who join via referral code, featuring visual downline hierarchies, confidential pocket deal rooms, in-app group messaging, and goal notebooks.',
    'realtybizhub': 'A marketing portal and CMS for a suite of real-estate software platforms, showcasing flagship PropTech solutions, editorial knowledge-base articles, and a conversion-optimized demo scheduling funnel.',
    'dodani-erp': 'A centralized real-estate brokerage operations system for tracking leads, transactions, offers, escrow deadlines, shared water well agreements, and compliance documentation with threaded audit comments.',
    'arizona-land-investors': 'A private land syndication platform for accredited investors and developers, featuring yield simulation tools, VIP investment summit registration, escrow tracking, and direct developer consultation.',
    'micro-matching': 'An influencer marketing admin panel connecting brands with creators, featuring audience authenticity reviews, KYC verification, coupon attribution analytics, and milestone-based Stripe escrow payouts.'
}

with open('scratch/extracted_projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

with open('portfolio.html', 'r', encoding='utf-8') as f:
    html = f.read()

# We want each article to have clean body:
# <div class="portfolio-card-body">
#   <div class="portfolio-card-kicker">{kicker}</div>
#   <h2 class="portfolio-card-title">{title}</h2>
#   <p class="portfolio-card-desc">{desc}</p>
#   <div class="portfolio-card-actions">
#     <a href="projects/{slug}/" class="btn-portfolio-view" aria-label="View {title} Project Case Study">
#       <span>View Project</span>
#       <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
#     </a>
#   </div>
# </div>

updated_count = 0
for p in projects:
    slug = p['slug']
    title = p['title']
    kicker = p['kicker']
    desc = descriptions.get(slug, p['solution'])
    
    # Locate article for this project
    # Match <article ...>...</article> containing title
    art_pattern = rf'(<article\s+class="portfolio-card[^"]*"\s+data-category="[^"]*">\s*<div class="portfolio-card-media">.*?</div>\s*<div class="portfolio-card-body">).*?(</div>\s*</article>)'
    
    # We find specifically the article with this title
    # Let's match from media to end of article
    specific_pattern = rf'(<article\s+class="portfolio-card[^"]*"\s+data-category="[^"]*">\s*<div class="portfolio-card-media">.*?</div>\s*<div class="portfolio-card-body">)\s*<div class="portfolio-card-kicker">.*?</div>\s*<h2 class="portfolio-card-title">{re.escape(title)}</h2>.*?(</div>\s*</article>)'
    
    match = re.search(specific_pattern, html, re.DOTALL)
    if match:
        new_body = f'''{match.group(1)}
              <div class="portfolio-card-kicker">{kicker}</div>
              <h2 class="portfolio-card-title">{title}</h2>
              <p class="portfolio-card-desc">{desc}</p>

              <div class="portfolio-card-actions">
                <a href="projects/{slug}/" class="btn-portfolio-view" aria-label="View {title} Project Case Study">
                  <span>View Project</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            {match.group(2)}'''
        html = html[:match.start()] + new_body + html[match.end():]
        updated_count += 1
        print(f"[{updated_count}/16] Streamlined card for: {title}")
    else:
        print(f"FAILED to match specific card for: {title}")

print(f"\nTotal streamlined cards: {updated_count}")

with open('portfolio.html', 'w', encoding='utf-8') as f:
    f.write(html)

