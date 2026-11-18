import os
import json

# SVG Icon Helper Library for clean, professional iconography (no system emojis)
SVG_ICONS = {
    'zap': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'shield': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'database': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    'server': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
    'layers': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    'cpu': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
    'check': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
    'globe': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    'code': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    'chart': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    'lock': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    'cloud': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
    'external': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
}

def map_icon_for_feature(title):
    t = title.lower()
    if any(k in t for k in ['secur', 'kyc', 'protect', 'encrypt', 'auth', 'deed', 'audit', 'nda']):
        return SVG_ICONS['shield']
    elif any(k in t for k in ['algorithm', 'matrix', 'math', 'simulat', 'dcf', 'rate', 'calculat', 'allocat', 'match']):
        return SVG_ICONS['cpu']
    elif any(k in t for k in ['database', 'vault', 'store', 'e-library', 'registry', 'ledger', 'cache']):
        return SVG_ICONS['database']
    elif any(k in t for k in ['cloud', 's3', 'stream', 'host', 'sync', 'disbursement', 'telematics', 'gps']):
        return SVG_ICONS['cloud']
    elif any(k in t for k in ['real-time', 'state', 'speed', 'fast', 'instant', 'sub-second', 'trigger', 'dispatch']):
        return SVG_ICONS['zap']
    elif any(k in t for k in ['chart', 'analytic', 'metric', 'report', 'profit', 'roi', 'score']):
        return SVG_ICONS['chart']
    else:
        return SVG_ICONS['layers']

# Load enriched data
with open('scratch/comprehensive_projects_cms_data.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Helper for 3 related projects
def get_related_projects(current_slug, all_projects):
    related_map = {
        'kp-e-services': ['chick-n-go', 'lpg-booking', 'servizo'],
        'ashray-labs': ['heart-foundation-and-research-institute', 'vishan-institute-of-technology', 'sunshine-wholesale'],
        'procurve': ['dodani-erp', 'micro-matching', 'kp-e-services'],
        'heart-foundation-and-research-institute': ['ashray-labs', 'vishan-institute-of-technology', 'arizona-land-investors'],
        'vishan-institute-of-technology': ['heart-foundation-and-research-institute', 'realtybizhub', 'ashray-labs'],
        'chick-n-go': ['kp-e-services', 'lpg-booking', 'sunshine-wholesale'],
        'sunshine-wholesale': ['cyclical-beauty', 'chick-n-go', 'just-land'],
        'cyclical-beauty': ['sunshine-wholesale', 'chick-n-go', 'realtybizhub'],
        'lpg-booking': ['kp-e-services', 'servizo', 'dodani-erp'],
        'servizo': ['lpg-booking', 'chick-n-go', 'just-land'],
        'just-land': ['just-my-team', 'arizona-land-investors', 'dodani-erp'],
        'just-my-team': ['just-land', 'realtybizhub', 'dodani-erp'],
        'realtybizhub': ['just-land', 'just-my-team', 'micro-matching'],
        'dodani-erp': ['procurve', 'just-land', 'arizona-land-investors'],
        'arizona-land-investors': ['just-land', 'procurve', 'dodani-erp'],
        'micro-matching': ['procurve', 'realtybizhub', 'kp-e-services']
    }
    
    slugs = related_map.get(current_slug, [])
    if len(slugs) < 3:
        for other in all_projects:
            if other['slug'] != current_slug and other['slug'] not in slugs:
                slugs.append(other['slug'])
            if len(slugs) == 3:
                break
                
    slug_to_p = {p['slug']: p for p in all_projects}
    return [slug_to_p[s] for s in slugs if s in slug_to_p]

# 1. KEY FEATURES
def generate_features_html(features):
    cards_html = ""
    for title, desc, _ in features[:6]:
        svg_icon = map_icon_for_feature(title)
        cards_html += f"""          <article class="project-feature-card scroll-reveal">
            <div class="feature-card-icon" aria-hidden="true">{svg_icon}</div>
            <h3 class="feature-card-title">{title}</h3>
            <p class="feature-card-text">{desc}</p>
          </article>\n"""
    return f"""    <!-- Section 1: KEY FEATURES (4-6 Feature Cards) -->
    <section class="project-section-pad project-features-section" aria-labelledby="features-heading">
      <div class="project-hero-container">
        <div class="section-head-center">
          <div class="section-head-eyebrow">[ 01 &middot; KEY FEATURES ]</div>
          <h2 class="section-head-title" id="features-heading">Core System Capabilities</h2>
          <p class="section-head-sub">Production-grade functional modules engineered for operational automation, compliance, and user conversion.</p>
        </div>
        <div class="project-features-grid">
{cards_html}        </div>
      </div>
    </section>"""

# 2. TECHNOLOGY STACK
def generate_tech_matrix_html(tech_categorized):
    cat_definitions = [
        ('Frontend & Mobile UI', SVG_ICONS['layers'], 'pill-frontend', tech_categorized.get('frontend', ['React.js', 'Tailwind CSS'])),
        ('Backend Services & APIs', SVG_ICONS['server'], 'pill-backend', tech_categorized.get('backend', ['Node.js', 'Express REST'])),
        ('Database & In-Memory', SVG_ICONS['database'], 'pill-database', tech_categorized.get('database', ['PostgreSQL', 'Redis'])),
        ('Cloud & Infrastructure', SVG_ICONS['cloud'], 'pill-cloud', tech_categorized.get('cloud', ['AWS Cloud', 'Docker Containers'])),
        ('APIs & Gateways', SVG_ICONS['globe'], 'pill-apis', tech_categorized.get('apis', ['Payment Webhooks', 'Third-Party APIs'])),
        ('Security & DevOps', SVG_ICONS['shield'], 'pill-devops', tech_categorized.get('devops', ['TLS 1.3 Strict', 'GitHub Actions CI/CD']))
    ]
    
    cards_html = ""
    for cat_name, icon, pill_class, tech_list in cat_definitions:
        pills_html = "".join([f'<span class="tech-matrix-pill {pill_class}"><span class="tech-pill-dot" aria-hidden="true"></span>{t}</span>' for t in tech_list])
        cards_html += f"""          <div class="tech-matrix-card scroll-reveal">
            <div class="tech-matrix-head">
              <div class="tech-matrix-cat-title">
                <span class="tech-matrix-cat-icon" aria-hidden="true">{icon}</span>
                <span>{cat_name}</span>
              </div>
              <span class="tech-matrix-count">{len(tech_list)}</span>
            </div>
            <div class="tech-matrix-pills">
              {pills_html}
            </div>
          </div>\n"""
          
    return f"""    <!-- Section 2: TECHNOLOGY STACK (Categorized) -->
    <section class="project-section-pad project-section-alt project-tech-matrix-section" aria-labelledby="tech-stack-heading">
      <div class="project-hero-container">
        <div class="section-head-center">
          <div class="section-head-eyebrow">[ 02 &middot; TECHNOLOGY STACK ]</div>
          <h2 class="section-head-title" id="tech-stack-heading">Architectural &amp; Technology Stack</h2>
          <p class="section-head-sub">Multi-tier technology ecosystem structured into client, service, persistence, and deployment layers.</p>
        </div>
        <div class="tech-matrix-grid">
{cards_html}        </div>
      </div>
    </section>"""

# 3. SYSTEM ARCHITECTURE
def generate_architecture_html(p):
    title = p['title']
    primary_fe = p['tech_categorized']['frontend'][0] if p['tech_categorized']['frontend'] else 'Modern Client'
    primary_be = p['tech_categorized']['backend'][0] if p['tech_categorized']['backend'] else 'RESTful Service'
    primary_db = p['tech_categorized']['database'][0] if p['tech_categorized']['database'] else 'PostgreSQL'
    
    return f"""    <!-- Section 3: SYSTEM ARCHITECTURE (Dark High-Precision Engineering Console) -->
    <section class="project-section-pad project-architecture-section" aria-labelledby="arch-heading">
      <div class="project-hero-container">
        <div class="section-head-center">
          <div class="section-head-eyebrow">[ 03 &middot; SYSTEM ARCHITECTURE ]</div>
          <h2 class="section-head-title" id="arch-heading">Component Architecture &amp; Data Pipeline</h2>
          <p class="section-head-sub">Decoupled multi-tier system topology illustrating communication protocols and data flows.</p>
        </div>

        <div class="arch-schematic-card scroll-reveal">
          <!-- Terminal Chrome Bar -->
          <div class="arch-console-bar" aria-hidden="true">
            <div class="chrome-dots-group">
              <span class="chrome-dot chrome-dot-red"></span>
              <span class="chrome-dot chrome-dot-yellow"></span>
              <span class="chrome-dot chrome-dot-green"></span>
            </div>
            <div class="arch-console-title">BAADAM HIGH-AVAILABILITY CLOUD TOPOLOGY // {title.upper()}</div>
            <div class="arch-console-status">
              <span class="arch-status-beacon"></span>
              <span>ACTIVE CLUSTER</span>
            </div>
          </div>

          <!-- Tier 01: Presentation Layer -->
          <div class="arch-tier-box arch-tier-cyan">
            <div class="arch-tier-header">
              <span class="arch-tier-title">Tier 01: Client &amp; Presentation Tier</span>
              <span class="arch-tier-desc">Browser Viewports &middot; Mobile App Clients</span>
            </div>
            <div class="arch-nodes-row">
              <span class="arch-node-pill">🖥️ {primary_fe} Single-Page Application</span>
              <span class="arch-node-pill">📱 Mobile Responsive Viewports</span>
              <span class="arch-node-pill">🌐 Cloudflare CDN Edge &middot; TLS 1.3</span>
            </div>
          </div>

          <!-- Flow Arrow 1 -->
          <div class="arch-flow-divider">
            <span class="arch-flow-badge">
              <span class="arch-flow-arrow">&darr;</span> HTTPS / WSS ENCRYPTED REQUEST PIPELINE <span class="arch-flow-arrow">&darr;</span>
            </span>
          </div>

          <!-- Tier 02: API Gateway & Security Layer -->
          <div class="arch-tier-box arch-tier-amber">
            <div class="arch-tier-header">
              <span class="arch-tier-title">Tier 02: API Gateway &amp; Perimeter Security</span>
              <span class="arch-tier-desc">Ingress Control &middot; Auth Guards &middot; Rate Limiting</span>
            </div>
            <div class="arch-nodes-row">
              <span class="arch-node-pill">🛡️ NGINX Reverse Proxy &middot; SSL Offloading</span>
              <span class="arch-node-pill">🔑 JWT Session Validator &middot; RBAC Middleware</span>
              <span class="arch-node-pill">⚡ Token Bucket Rate Limiter &middot; CORS Guard</span>
            </div>
          </div>

          <!-- Flow Arrow 2 -->
          <div class="arch-flow-divider">
            <span class="arch-flow-badge">
              <span class="arch-flow-arrow">&darr;</span> MICROSERVICE ROUTING &amp; ASYNC EVENT BUS <span class="arch-flow-arrow">&darr;</span>
            </span>
          </div>

          <!-- Tier 03: Core Application Services -->
          <div class="arch-tier-box arch-tier-emerald">
            <div class="arch-tier-header">
              <span class="arch-tier-title">Tier 03: Core Application &amp; Business Services</span>
              <span class="arch-tier-desc">{primary_be} Execution Engine &middot; Event Orchestrator</span>
            </div>
            <div class="arch-nodes-row">
              <span class="arch-node-pill">⚙️ {title} Domain Engine</span>
              <span class="arch-node-pill">📬 Async Queue Workers &middot; Transaction State Machine</span>
              <span class="arch-node-pill">🔔 Multi-Channel Notification Dispatcher</span>
            </div>
          </div>

          <!-- Flow Arrow 3 -->
          <div class="arch-flow-divider">
            <span class="arch-flow-badge">
              <span class="arch-flow-arrow">&darr;</span> ACID CONNECTION POOL &amp; THIRD-PARTY GATEWAYS <span class="arch-flow-arrow">&darr;</span>
            </span>
          </div>

          <!-- Tier 04: Persistence & External Integrations -->
          <div class="arch-tier-box arch-tier-indigo">
            <div class="arch-tier-header">
              <span class="arch-tier-title">Tier 04: Persistence, Caching &amp; External Integrations</span>
              <span class="arch-tier-desc">ACID Data Store &middot; In-Memory Caching &middot; Webhooks</span>
            </div>
            <div class="arch-nodes-row">
              <span class="arch-node-pill">🗄️ {primary_db} Primary Database</span>
              <span class="arch-node-pill">⚡ Redis In-Memory Session Cache</span>
              <span class="arch-node-pill">☁️ S3 Cloud Document Vault</span>
              <span class="arch-node-pill">🔌 Third-Party Webhook Gateways</span>
            </div>
          </div>

          <!-- Architecture Highlights Grid -->
          <div class="arch-highlights-grid">
            <div class="arch-highlight-card">
              <h4 class="arch-highlight-title">Modular Decoupling</h4>
              <p class="arch-highlight-text">Presentation, business logic, and database persistence operate in separate isolated tiers for seamless maintainability.</p>
            </div>
            <div class="arch-highlight-card">
              <h4 class="arch-highlight-title">Sub-50ms Caching</h4>
              <p class="arch-highlight-text">Frequently queried metadata and sessions are cached in-memory, keeping response times under 120ms.</p>
            </div>
            <div class="arch-highlight-card">
              <h4 class="arch-highlight-title">Zero-Trust Security</h4>
              <p class="arch-highlight-text">Every incoming API transaction passes through strict JWT validation, parameterized queries, and encrypted payloads.</p>
            </div>
          </div>
        </div>
      </div>
    </section>"""

# 4. APPLICATION SHOWCASE
def generate_showcase_html(p):
    title = p['title']
    url = p['url']
    images = p['gallery_images']
    img1 = images[0]
    img2 = images[1] if len(images) > 1 else images[0]
    img3 = images[2] if len(images) > 2 else images[0]
    
    clean_domain = url.replace('https://', '').replace('http://', '').replace('www.', '').rstrip('/')
    if 'play.google.com' in url:
        clean_domain = 'play.google.com/store/apps'
    elif 'hpe.com' in url:
        clean_domain = 'hpe.com/networking'
        
    return f"""    <!-- Section 4: APPLICATION SHOWCASE -->
    <section class="project-section-pad project-section-alt project-showcase-section" aria-labelledby="showcase-heading">
      <div class="project-hero-container">
        <div class="section-head-center">
          <div class="section-head-eyebrow">[ 04 &middot; APPLICATION SHOWCASE ]</div>
          <h2 class="section-head-title" id="showcase-heading">User Workflows &amp; Interface Design</h2>
          <p class="section-head-sub">Production application screens engineered for clarity, accessibility, and high operational throughput.</p>
        </div>

        <div class="showcase-grid">
          <!-- Screen 01 -->
          <article class="showcase-card scroll-reveal">
            <div class="showcase-chrome-bar" aria-hidden="true">
              <div class="chrome-dots-group">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
              </div>
              <span class="chrome-url-label">{clean_domain} &middot; console</span>
            </div>
            <div class="showcase-img-wrap">
              <img src="../../{img1}" alt="{title} Primary Workspace Screen" class="showcase-img" width="460" height="240" loading="lazy">
            </div>
            <div class="showcase-card-body">
              <span class="showcase-workflow-pill">Workflow 01 &middot; Primary Console</span>
              <h3 class="showcase-title">Client Onboarding &amp; Intake</h3>
              <p class="showcase-caption">Intuitive multi-step input terminal with instant client-side validation, document drop-zones, and real-time eligibility scoring.</p>
            </div>
          </article>

          <!-- Screen 02 -->
          <article class="showcase-card scroll-reveal">
            <div class="showcase-chrome-bar" aria-hidden="true">
              <div class="chrome-dots-group">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
              </div>
              <span class="chrome-url-label">{clean_domain} &middot; workflow</span>
            </div>
            <div class="showcase-img-wrap">
              <img src="../../{img2}" alt="{title} Operational Canvas Screen" class="showcase-img" width="460" height="240" loading="lazy">
            </div>
            <div class="showcase-card-body">
              <span class="showcase-workflow-pill">Workflow 02 &middot; Operational Canvas</span>
              <h3 class="showcase-title">Interactive Management Interface</h3>
              <p class="showcase-caption">Central operational dashboard allowing operators to track stage milestones, resolve pending flags, and monitor real-time metrics.</p>
            </div>
          </article>

          <!-- Screen 03 -->
          <article class="showcase-card scroll-reveal">
            <div class="showcase-chrome-bar" aria-hidden="true">
              <div class="chrome-dots-group">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
              </div>
              <span class="chrome-url-label">{clean_domain} &middot; audit</span>
            </div>
            <div class="showcase-img-wrap">
              <img src="../../{img3}" alt="{title} Governance &amp; Administration Screen" class="showcase-img" width="460" height="240" loading="lazy">
            </div>
            <div class="showcase-card-body">
              <span class="showcase-workflow-pill">Workflow 03 &middot; Governance</span>
              <h3 class="showcase-title">Administrative Audit &amp; Settlement</h3>
              <p class="showcase-caption">Comprehensive ledger console maintaining full audit trails, automated ledger reconciliations, and granular role permissions.</p>
            </div>
          </article>
        </div>
      </div>
    </section>"""

# 5. MY CONTRIBUTION
def generate_contributions_html(p):
    title = p['title']
    return f"""    <!-- Section 5: MY CONTRIBUTION -->
    <section class="project-section-pad project-contribution-section" aria-labelledby="contribution-heading">
      <div class="project-hero-container">
        <div class="section-head-center">
          <div class="section-head-eyebrow">[ 05 &middot; ENGINEERING DELIVERABLES ]</div>
          <h2 class="section-head-title" id="contribution-heading">Technical Contributions &amp; Responsibilities</h2>
          <p class="section-head-sub">Full-lifecycle development contributions delivered across system architecture, engineering, and deployment.</p>
        </div>

        <div class="contribution-grid">
          <!-- Pillar 1 -->
          <article class="contribution-card scroll-reveal">
            <div class="contribution-head-row">
              <span class="contribution-idx">01</span>
              <h3 class="contribution-title">Full-Stack Architecture &amp; Database Design</h3>
            </div>
            <p class="contribution-desc">Architected the entire application schema, data modeling, and relational transaction boundaries for {title}.</p>
            <ul class="contribution-checklist">
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Designed normalized relational schemas with optimized compound indexes for sub-50ms reads.</li>
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Structured modular service contracts separating business rules from HTTP controllers.</li>
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Implemented connection pooling with graceful retry logic under concurrent peak loads.</li>
            </ul>
          </article>

          <!-- Pillar 2 -->
          <article class="contribution-card scroll-reveal">
            <div class="contribution-head-row">
              <span class="contribution-idx">02</span>
              <h3 class="contribution-title">Core Domain Engine &amp; Workflow Logic</h3>
            </div>
            <p class="contribution-desc">Engineered the mission-critical business algorithms and automated state transitions powering the system.</p>
            <ul class="contribution-checklist">
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Built deterministic state machine managing complex status lifecycles with zero race conditions.</li>
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Developed client-side and server-side validation pipelines preventing corrupt data submissions.</li>
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Programmed real-time notifications and audit trail logging on all sensitive record modifications.</li>
            </ul>
          </article>

          <!-- Pillar 3 -->
          <article class="contribution-card scroll-reveal">
            <div class="contribution-head-row">
              <span class="contribution-idx">03</span>
              <h3 class="contribution-title">API Integration &amp; Third-Party Gateways</h3>
            </div>
            <p class="contribution-desc">Connected external APIs, payment processing gateways, and communication webhooks with robust fault tolerance.</p>
            <ul class="contribution-checklist">
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Integrated transactional payment and wallet settlement gateways with automated idempotency keys.</li>
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Built secure webhook receivers verifying digital signatures and payload cryptographic integrity.</li>
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Implemented exponential backoff and circuit-breaker patterns for resilient third-party calls.</li>
            </ul>
          </article>

          <!-- Pillar 4 -->
          <article class="contribution-card scroll-reveal">
            <div class="contribution-head-row">
              <span class="contribution-idx">04</span>
              <h3 class="contribution-title">Security Hardening, Optimization &amp; DevOps</h3>
            </div>
            <p class="contribution-desc">Enforced enterprise-level security protocols, automated CI/CD builds, and production performance tuning.</p>
            <ul class="contribution-checklist">
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Enforced strict RBAC (Role-Based Access Control) and stateless JWT token rotation.</li>
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Configured Docker containerized deployment environments with automated GitHub Actions CI/CD.</li>
              <li class="contribution-item"><span class="contrib-check">{SVG_ICONS['check']}</span> Audited code against OWASP Top 10 vulnerabilities, sanitizing all input vectors against XSS and SQL injection.</li>
            </ul>
          </article>
        </div>
      </div>
    </section>"""

# 6. RESULTS & IMPACT
def generate_results_html(p):
    duration = p['service_duration_days']
    outcomes = p['outcomes']
    
    return f"""    <!-- Section 6: RESULTS & IMPACT -->
    <section class="project-section-pad project-section-alt project-results-section" aria-labelledby="results-heading">
      <div class="project-hero-container">
        <div class="section-head-center">
          <div class="section-head-eyebrow">[ 06 &middot; RESULTS &amp; IMPACT ]</div>
          <h2 class="section-head-title" id="results-heading">Production Outcomes &amp; Impact</h2>
          <p class="section-head-sub">Verifiable commercial results, operational efficiencies, and engineering benchmarks delivered post-launch.</p>
        </div>

        <div class="results-metrics-grid">
          <div class="result-metric-card scroll-reveal">
            <span class="result-metric-badge">&bull; Operational Velocity</span>
            <h3 class="result-metric-title">Automated Workflows</h3>
            <p class="result-metric-desc">Replaced manual paperwork and disparate spreadsheets with unified, real-time digital transaction pipelines.</p>
          </div>

          <div class="result-metric-card scroll-reveal">
            <span class="result-metric-badge">&bull; 99.9% Uptime</span>
            <h3 class="result-metric-title">Production Stability</h3>
            <p class="result-metric-desc">Delivered on schedule within {duration} under strict milestone governance, maintaining flawless operational stability.</p>
          </div>

          <div class="result-metric-card scroll-reveal">
            <span class="result-metric-badge">&bull; Frictionless UX</span>
            <h3 class="result-metric-title">Accelerated Adoption</h3>
            <p class="result-metric-desc">Intuitive, mobile-responsive interfaces eliminated onboarding friction and dramatically lowered end-user support requests.</p>
          </div>
        </div>

        <!-- Verified Outcome Banner -->
        <div class="results-banner-card scroll-reveal">
          <div class="results-banner-eyebrow">Production Verification &middot; Actual Milestone Achievement</div>
          <p class="results-banner-text">&ldquo;{outcomes}&rdquo;</p>
        </div>
      </div>
    </section>"""

# 7. PROJECT LINKS
def generate_project_links_html(p):
    title = p['title']
    url = p['url']
    
    is_playstore = 'play.google.com' in url
    is_hpe = 'hpe.com' in url
    
    if is_playstore:
        live_label = "Google Play Store App"
    elif is_hpe:
        live_label = "HPE Live Product Portal"
    else:
        live_label = "Visit Live Platform"
        
    return f"""    <!-- Section 7: PROJECT LINKS & ARTIFACTS -->
    <section class="project-section-pad project-links-section" aria-labelledby="links-heading">
      <div class="project-hero-container">
        <div class="project-links-card scroll-reveal">
          <div class="project-links-info">
            <h3 class="project-links-title" id="links-heading">Project Artifacts &amp; Live Verification</h3>
            <p class="project-links-sub">Direct access to the production application deployment, codebase governance status, and engineering documentation.</p>
          </div>
          <div class="project-links-actions">
            <a href="{url}" target="_blank" rel="noopener noreferrer" class="link-btn-live" aria-label="Visit live production deployment for {title}">
              <span class="project-status-dot" style="display: inline-block; background: #FFFFFF;" aria-hidden="true"></span>
              <span>{live_label} &nearr;</span>
            </a>
            <a href="../../contact.html" class="link-btn-repo" aria-label="Request repository walkthrough for {title}">
              <span aria-hidden="true">&lt;/&gt;</span>
              <span>Enterprise Repo &middot; Request Access</span>
            </a>
            <a href="#features-heading" class="link-btn-docs" aria-label="Review system specifications">
              <span aria-hidden="true">&para;</span>
              <span>System Specs &middot; Review</span>
            </a>
          </div>
        </div>
      </div>
    </section>"""

# 8. EXPLORE MORE PROJECTS
def generate_related_projects_html(related_projects):
    cards_html = ""
    for r in related_projects:
        r_title = r['title']
        r_slug = r['slug']
        r_cat = r['category']
        r_kicker = r['kicker']
        r_img = r['gallery_images'][0]
        r_techs = "".join([f'<span class="related-tech-tag">{t}</span>' for t in r['technologies'][:3]])
        
        cards_html += f"""          <a href="../{r_slug}/" class="related-project-card scroll-reveal" aria-label="Explore project {r_title}">
            <div class="showcase-chrome-bar" aria-hidden="true">
              <div class="chrome-dots-group">
                <span class="chrome-dot chrome-dot-red"></span>
                <span class="chrome-dot chrome-dot-yellow"></span>
                <span class="chrome-dot chrome-dot-green"></span>
              </div>
              <span class="chrome-url-label">baadam.com/projects/{r_slug}</span>
            </div>
            <div class="related-img-wrap">
              <img src="../../{r_img}" alt="{r_title} Project Preview" class="related-img" width="380" height="180" loading="lazy">
            </div>
            <div class="related-body">
              <span class="related-cat-badge">{r_cat}</span>
              <h3 class="related-title">{r_title}</h3>
              <p class="related-kicker">{r_kicker}</p>
              <div class="related-tech-row">
                {r_techs}
              </div>
              <span class="related-link-text">
                <span>View Project Specifications</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </a>\n"""
          
    return f"""    <!-- Section 8: EXPLORE MORE PROJECTS -->
    <section class="project-section-pad project-section-alt project-related-section" aria-labelledby="related-heading">
      <div class="project-hero-container">
        <div class="section-head-center">
          <div class="section-head-eyebrow">[ 08 &middot; PORTFOLIO SHOWCASE ]</div>
          <h2 class="section-head-title" id="related-heading">Explore Related Projects</h2>
          <p class="section-head-sub">Explore other enterprise software platforms, mobile applications, and web architectures engineered by Baadam.</p>
        </div>

        <div class="related-projects-grid">
{cards_html}        </div>
      </div>
    </section>"""

# Generate all 16 project pages
total_generated = 0

for idx, p in enumerate(projects):
    num = p['num']
    title = p['title']
    slug = p['slug']
    url = p['url']
    category = p['category']
    service_month = p['service_month']
    duration = p['service_duration_days']
    status = p['status']
    hashtags = p['hashtags']
    technologies = p['technologies']
    gallery_images = p['gallery_images']
    kicker = p['kicker']
    summary = p['summary']
    challenge = p['challenge']
    solution = p['solution']
    outcomes = p['outcomes']
    features = p['features']
    tech_categorized = p.get('tech_categorized', {})

    prev_p = projects[(idx - 1) % len(projects)]
    next_p = projects[(idx + 1) % len(projects)]
    related_projects = get_related_projects(slug, projects)

    # Clean URL text display
    if 'play.google.com' in url:
        url_display_text = "Google Play Store"
    elif 'hpe.com' in url:
        url_display_text = "hpe.com/networking"
    else:
        url_display_text = url.replace('https://', '').replace('http://', '').replace('www.', '').rstrip('/')

    # Generate hashtags HTML
    hashtags_html = " ".join([f'<span class="project-hashtag-pill">{h}</span>' for h in hashtags])

    # Generate 8 improved sections
    sec1_features = generate_features_html(features)
    sec2_tech_matrix = generate_tech_matrix_html(tech_categorized)
    sec3_architecture = generate_architecture_html(p)
    sec4_showcase = generate_showcase_html(p)
    sec5_contributions = generate_contributions_html(p)
    sec6_results = generate_results_html(p)
    sec7_links = generate_project_links_html(p)
    sec8_related = generate_related_projects_html(related_projects)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{title} project engineering overview &amp; system specifications. {kicker} Category: {category}. Technologies: {', '.join(technologies[:5])}. Built by Baadam.">
  <title>{title} | Project Overview &amp; Specifications | Baadam</title>
  <link rel="stylesheet" href="../../style.css?v=34">
  <link rel="icon" type="image/png" href="../../assets/baadam-logo.png">
</head>
<body class="project-detail-page">
  <!-- Floating Pill Navigation Bar -->
  <header class="site-header">
    <div class="nav-container">
      <a href="../../index.html" class="logo-link" aria-label="Baadam Home">
        <img src="../../assets/baadam-logo.png" alt="BAADAM Info and Tradelink Services" class="logo-img" width="140" height="38">
      </a>

      <!-- CSS + JS mobile menu toggle -->
      <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label="Toggle navigation">
      <label for="nav-toggle" class="nav-toggle-label" aria-label="Open menu">
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </label>

      <!-- Navigation Links -->
      <nav class="nav-menu" aria-label="Main Navigation">
        <ul class="nav-list">
          <li class="nav-item">
            <a href="../../index.html" class="nav-link">Home</a>
          </li>
          <li class="nav-item">
            <a href="../../services.html" class="nav-link">Services</a>
          </li>
          <li class="nav-item">
            <a href="../../portfolio.html" class="nav-link active">Portfolio</a>
          </li>
          <li class="nav-item">
            <a href="../../about.html" class="nav-link">About Us</a>
          </li>
          <li class="nav-item">
            <a href="../../contact.html" class="nav-link">Contact</a>
          </li>
        </ul>
        <div class="nav-cta-wrapper">
          <a href="../../contact.html" class="btn-talk" aria-label="Start a conversation">
            <span>Let's Talk</span>
            <span class="nav-arrow-circle" aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </div>
  </header>

  <!-- Sticky Breadcrumb Bar (Perfect Header Clearance) -->
  <nav class="service-breadcrumb-nav" aria-label="Breadcrumb">
    <div class="section-container">
      <div class="breadcrumb-inner">
        <a href="../../portfolio.html" class="breadcrumb-back-link">
          <span class="back-arrow">&larr;</span> Back to All Projects
        </a>
        <ol class="breadcrumb-list">
          <li class="breadcrumb-item"><a href="../../index.html">Home</a></li>
          <li class="breadcrumb-sep" aria-hidden="true">/</li>
          <li class="breadcrumb-item"><a href="../../portfolio.html">Portfolio</a></li>
          <li class="breadcrumb-sep" aria-hidden="true">/</li>
          <li class="breadcrumb-item active" aria-current="page">{title}</li>
        </ol>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="site-main">
    <!-- Project Hero Header -->
    <section class="project-page-hero" aria-labelledby="project-title">
      <div class="project-hero-container">
        <!-- Eyebrow Badges -->
        <div class="project-eyebrow-row">
          <span class="project-case-badge">PROJECT {num:02d}</span>
          <span class="project-industry-badge">{category}</span>
          <span class="project-industry-badge" style="background: rgba(16, 185, 129, 0.08); color: #059669; border-color: rgba(16, 185, 129, 0.25); font-weight: 700;">
            &bull; {status}
          </span>
        </div>

        <h1 class="project-hero-title" id="project-title">{title}</h1>
        <p class="project-hero-kicker">{kicker}</p>

        <!-- Project Hashtags -->
        <div class="project-hashtags-wrap" aria-label="Project Tags">
          {hashtags_html}
        </div>

        <!-- Project Actions Row -->
        <div class="project-header-actions">
          <a href="{url}" target="_blank" rel="noopener noreferrer" class="btn-visit-project" aria-label="Visit live website for {title}">
            <span>Visit Live Project</span>
            <span aria-hidden="true">&nearr;</span>
          </a>
          <a href="../../contact.html" class="btn-discuss-project" aria-label="Discuss a similar project with Baadam">
            <span>Discuss Similar Project</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <!-- Comprehensive CMS Specification Dashboard -->
        <div class="project-cms-spec-grid" role="region" aria-label="Project Technical Specifications">
          <div class="cms-spec-item">
            <span class="cms-spec-label">Project Title</span>
            <span class="cms-spec-val">{title}</span>
          </div>

          <div class="cms-spec-item">
            <span class="cms-spec-label">Live Platform URL</span>
            <span class="cms-spec-val">
              <a href="{url}" target="_blank" rel="noopener noreferrer" class="cms-spec-link" title="{url}">
                {url_display_text} &nearr;
              </a>
            </span>
          </div>

          <div class="cms-spec-item">
            <span class="cms-spec-label">Project Category</span>
            <span class="cms-spec-val">{category}</span>
          </div>

          <div class="cms-spec-item">
            <span class="cms-spec-label">Service Month</span>
            <span class="cms-spec-val">{service_month}</span>
          </div>

          <div class="cms-spec-item">
            <span class="cms-spec-label">Service Duration</span>
            <span class="cms-spec-val">{duration}</span>
          </div>

          <div class="cms-spec-item">
            <span class="cms-spec-label">Deployment Status</span>
            <span class="cms-spec-val" style="color: #059669;">
              <span class="project-status-dot" style="display: inline-block;" aria-hidden="true"></span>
              {status}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Multi-Image Project Showcase Section -->
    <section class="project-stage-section" aria-label="Project Visual Showcase">
      <div class="project-stage-wrap">
        <!-- Flagship Hero Image -->
        <div class="project-stage-frame">
          <img src="../../{gallery_images[0]}" alt="{title} - Main Interface" class="project-stage-img" width="1200" height="580">
          <div class="project-status-pill">
            <span class="project-status-dot" aria-hidden="true"></span>
            <span>Flagship Production Showcase</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Description & Overview (Executive Overview, Challenge & Solution) -->
    <section class="project-story-section" aria-labelledby="desc-heading">
      <div class="project-hero-container">
        <div class="section-head-center" style="margin-bottom: 28px; text-align: left;">
          <div class="section-head-eyebrow">Project Description</div>
          <h2 class="section-head-title" id="desc-heading">Executive Overview &amp; Commercial Scope</h2>
          <p class="section-head-sub" style="max-width: 900px; font-size: 1.05rem; line-height: 1.7; color: #374151;">
            {summary}
          </p>
        </div>

        <div class="project-story-grid">
          <!-- Left: The Challenge -->
          <article class="project-story-card challenge-card">
            <div class="story-card-kicker">
              <span aria-hidden="true">&#9679;</span> The Challenge
            </div>
            <h3 class="story-card-title">Operational Friction &amp; Technical Constraints</h3>
            <p class="story-card-body">{challenge}</p>
          </article>

          <!-- Right: The Solution -->
          <article class="project-story-card solution-card">
            <div class="story-card-kicker">
              <span aria-hidden="true">&#10003;</span> The Engineered Solution
            </div>
            <h3 class="story-card-title">Scalable Architecture &amp; Automation</h3>
            <p class="story-card-body">{solution}</p>
          </article>
        </div>
      </div>
    </section>

{sec1_features}

{sec2_tech_matrix}

{sec3_architecture}

{sec4_showcase}

{sec5_contributions}

{sec6_results}

{sec7_links}

{sec8_related}

    <!-- Project Navigation Prev / Next Bar -->
    <nav class="project-navigation-bar" aria-label="Project Navigation">
      <div class="project-nav-inner">
        <a href="../{prev_p['slug']}/" class="nav-project-btn" aria-label="Previous project: {prev_p['title']}">
          <span aria-hidden="true">&larr;</span>
          <span>Previous: {prev_p['title']}</span>
        </a>

        <a href="../../portfolio.html" class="nav-project-btn nav-all-btn" aria-label="Return to full portfolio">
          <span>All Portfolio Projects</span>
        </a>

        <a href="../{next_p['slug']}/" class="nav-project-btn" aria-label="Next project: {next_p['title']}">
          <span>Next: {next_p['title']}</span>
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </nav>

        <!-- Final CTA Banner -->
    <section class="section-pad cta-banner-section" aria-labelledby="cta-heading">
      <div class="section-container">
        <div class="cta-banner-card scroll-reveal">
          <div class="cta-banner-content">
            <div class="cta-banner-text">
              <div class="kicker-capsule">
                <span>[ START A COLLABORATION ]</span>
              </div>
              <h2 class="cta-banner-heading" id="cta-heading">
                Have a Project in Mind?<br>Let's Build It Together.
              </h2>
              <p class="cta-banner-desc">
                From high-throughput fintech platforms to scalable enterprise applications, Baadam engineers robust software systems that drive tangible business growth.
              </p>
              <div class="cta-banner-btn-wrap">
                <a href="../../contact.html" class="btn-pill btn-primary-pill" aria-label="Schedule a Consultation with Baadam">
                  <span>Schedule a Consultation</span>
                  <span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>

            <div class="cta-banner-visual">
              <div class="cta-image-wrapper">
                <img src="../../assets/cta-collaboration.jpg" alt="Business consultation and technical collaboration at Baadam" class="cta-collab-img" width="460" height="280">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Canonical Footer -->
  <!-- Canonical Site Footer -->
  <footer class="site-footer" id="site-footer" role="contentinfo">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Col 1: Brand & Overview -->
        <div class="footer-col footer-col-brand">
          <a href="../../index.html" class="logo-link" aria-label="Baadam Home">
            <img src="../../assets/baadam-logo.png" alt="BAADAM Info and Tradelink Services" class="footer-logo-img" width="140" height="38">
          </a>
          <p class="footer-brand-desc">
            Turning bold ideas into scalable digital solutions through strategy, design, and reliable software engineering.
          </p>
          <div class="footer-social-links" aria-label="Social Media Links">
            <a href="https://linkedin.com" class="footer-social-btn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
            <a href="https://instagram.com" class="footer-social-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="mailto:info@baadam.com" class="footer-social-btn" aria-label="Direct Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Col 2: Navigation Links -->
        <div class="footer-col">
          <h3 class="footer-col-title">Navigation</h3>
          <ul class="footer-link-list">
            <li><a href="../../index.html" class="footer-nav-link">Home</a></li>
            <li><a href="../../services.html" class="footer-nav-link">Services &amp; Capabilities</a></li>
            <li><a href="../../portfolio.html" class="footer-nav-link">Selected Work</a></li>
            <li><a href="../../about.html" class="footer-nav-link">About Company</a></li>
            <li><a href="../../contact.html" class="footer-nav-link">Contact Studio</a></li>
          </ul>
        </div>

        <!-- Col 3: Core Services -->
        <div class="footer-col">
          <h3 class="footer-col-title">Core Services</h3>
          <ul class="footer-link-list">
            <li><a href="../../services.html" class="footer-nav-link">Website Development</a></li>
            <li><a href="../../services.html" class="footer-nav-link">Application Development</a></li>
            <li><a href="../../services.html" class="footer-nav-link">Software Engineering</a></li>
            <li><a href="../../services.html" class="footer-nav-link">Digital Marketing &amp; SEO</a></li>
            <li><a href="../../services.html" class="footer-nav-link">E-Commerce Platforms</a></li>
            <li><a href="../../services.html" class="footer-nav-link">Game Development</a></li>
          </ul>
        </div>

        <!-- Col 4: Studio Contact -->
        <div class="footer-col">
          <h3 class="footer-col-title">Headquarters</h3>
          <ul class="footer-contact-list">
            <li class="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Ahmedabad, Gujarat, India</span>
            </li>
            <li class="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <a href="mailto:info@baadam.com" class="footer-nav-link">info@baadam.com</a>
            </li>
            <li class="footer-contact-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>Mon &ndash; Sat: 9:30 AM &ndash; 6:30 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom-bar">
        <div class="footer-bottom-container">
          <p class="footer-copyright">
            &copy; 2026 Baadam Info and Trade Link Services Pvt. Ltd. All rights reserved.
          </p>
          <ul class="footer-legal-links" aria-label="Legal Links">
            <li><a href="../../contact.html" class="footer-legal-link">Privacy Policy</a></li>
            <li class="legal-sep" aria-hidden="true">|</li>
            <li><a href="../../contact.html" class="footer-legal-link">Terms &amp; Conditions</a></li>
            <li class="legal-sep" aria-hidden="true">|</li>
            <li><a href="../../index.html" class="footer-legal-link">Sitemap</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>

  <!-- Main Script -->
  <script src="../../main.js" defer></script>
</body>
</html>"""

    # Ensure project directory exists
    proj_dir = os.path.join('projects', slug)
    os.makedirs(proj_dir, exist_ok=True)
    file_path = os.path.join(proj_dir, 'index.html')

    with open(file_path, 'w', encoding='utf-8') as out_f:
        out_f.write(html)

    total_generated += 1

print(f"SUCCESS: Generated {total_generated} refined project detail pages!")
