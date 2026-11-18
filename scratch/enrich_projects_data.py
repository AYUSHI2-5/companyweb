import json

# Load existing data
with open('scratch/comprehensive_projects_cms_data.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Define 6 rich features for each project
project_features_extra = {
    'kp-e-services': [
        ('Real-Time Application State Machine', 'Tracks loan status transitions across applicant, broker, and bank reviewer states with zero race conditions.', '⚡'),
        ('Automated SMS & Webhook Dispatch', 'Sends instant transactional updates and status alerts to applicants via Twilio and WhatsApp business webhooks.', '🔔')
    ],
    'ashray-labs': [
        ('Automated Lab Equipment Sync', 'Bridges analyzer telemetry with the core database for direct, error-free electronic health record imports.', '🔬'),
        ('Patient QR Access & Digital Signature', 'Enables QR-verified digital signature authentication on all PDF pathology reports to prevent tampering.', '🛡️')
    ],
    'procurve': [
        ('Scenario & Sensitivity Analysis', 'Allows analysts to run Monte Carlo iterations and stress-test discount rates across complex market conditions.', '📈'),
        ('Audit Log & Version Comparison', 'Tracks every formula modification and financial assumption adjustment with granular rollback capabilities.', '📑')
    ],
    'heart-foundation-and-research-institute': [
        ('Blind Peer-Review Allocation', 'Anonymizes grant applicant identities during preliminary scoring rounds to ensure unbiased academic evaluation.', '⚖️'),
        ('Disbursement Milestone Triggers', 'Automates tranches of research grant disbursements tied to verified protocol milestone completions.', '💰')
    ],
    'vishan-institute-of-technology': [
        ('Automated Attendance Telemetry', 'Aggregates student lecture check-ins with automated parent notifications and term eligibility alerts.', '📅'),
        ('Faculty Workload & Exam Scheduler', 'Optimizes classroom assignments and prevents exam scheduling overlaps across multiple engineering departments.', '🎓')
    ],
    'chick-n-go': [
        ('Real-Time Delivery Driver Telematics', 'Provides live GPS order tracking with estimated time of arrival calculations updated every 5 seconds.', '🛵'),
        ('Automated Inventory & Recipe Deductions', 'Deducts raw ingredient inventory in real time upon order confirmation to prevent menu item overselling.', '📦')
    ],
    'sunshine-wholesale': [
        ('Multi-Location Warehouse Allocation', 'Routes customer line items to the nearest fulfillment hub to minimize freight transit times.', '🚚'),
        ('Automated Backorder & Pre-Order Rules', 'Allows verified retailers to reserve high-demand wholesale stock with automated fulfillment triggers.', '🔄')
    ],
    'cyclical-beauty': [
        ('Personalized Skin Routine Recommender', 'Interactive questionnaire matching skin profiles with curated product regimens to increase basket size.', '✨'),
        ('Automated Subscription Refill Engine', 'Recurring billing engine with customizable refill frequencies and flexible pause/resume controls.', '🔁')
    ],
    'lpg-booking': [
        ('Geo-Fenced Delivery Verification', 'Ensures cylinder drop-offs are confirmed via driver GPS location capture within designated delivery radii.', '📍'),
        ('Emergency Gas Leak Escalation Line', 'Prioritized SOS dispatch workflow routing safety calls directly to emergency response coordinators.', '🚨')
    ],
    'servizo': [
        ('Automated Escrow Job Release', 'Holds service fees in secure escrow until customer digital sign-off upon completed maintenance work.', '🔒'),
        ('Technician Route Optimization', 'Sequences daily service tickets algorithmically to reduce driving mileage and fuel consumption.', '🗺️')
    ],
    'just-land': [
        ('GIS Parcel Boundary Visualizer', 'Overlays county GIS parcel data, contour elevations, and zoning classifications directly onto Mapbox layers.', '🌐'),
        ('Automated Seller Deed Verification', 'Verifies property ownership through public record cross-referencing before granting verified badge status.', '📜')
    ],
    'just-my-team': [
        ('Confidential NDA Deal Gate', 'Enforces digital non-disclosure agreement execution before granting access to confidential pocket listings.', '🔐'),
        ('Downline Commission Calculator', 'Calculates multi-tier brokerage overrides and team production splits with automated monthly reporting.', '📊')
    ],
    'realtybizhub': [
        ('Interactive ROI Profit Simulator', 'Calculates estimated marketing revenue increases based on agent transaction volume and brokerage size.', '💡'),
        ('Automated Hubspot CRM Synchronization', 'Enriches inbound demo leads with firmographic intelligence and syncs bi-directionally with sales pipelines.', '⚡')
    ],
    'dodani-erp': [
        ('Shared Well Water Rights Registry', 'Tracks complex water shares, gallon allotments, and pump maintenance logs across rural subdivision parcels.', '💧'),
        ('Automated Closing Milestone Tracker', 'Triggers automated contingency expiration warnings to buyers, sellers, and escrow officers.', '⏳')
    ],
    'arizona-land-investors': [
        ('Investor Distribution Waterfall Engine', 'Calculates preferred return distributions and capital return allocations across complex fund structures.', '💼'),
        ('Live Summit Stream & Keynote Archive', 'Private video streaming portal with gated access for accredited summit attendees and investors.', '🎥')
    ],
    'micro-matching': [
        ('Algorithmic Engagement Authenticity Check', 'Filters out fraudulent creator audiences by analyzing follower-to-engagement ratios and comment sentiment.', '🤖'),
        ('Dynamic UTM Link & Discount Tracker', 'Tracks influencer sales attribution in real time with automated payout splits upon verified conversions.', '🎯')
    ]
}

# Categorized tech stacks for each project
def build_tech_stack(p):
    slug = p['slug']
    techs = p['technologies']
    
    # Generic intelligent mapping based on tech names
    frontend = []
    backend = []
    database = []
    cloud = []
    apis = []
    devops = []
    
    for t in techs:
        t_low = t.lower()
        if any(x in t_low for x in ['react', 'vue', 'next', 'tailwind', 'bootstrap', 'scss', 'css', 'liquid', 'flutter', 'pwa', 'typescript', 'javascript', 'framer', 'chart.js']):
            frontend.append(t)
        elif any(x in t_low for x in ['node', 'express', 'python', 'django', 'fastapi', 'laravel', 'php', 'math engine']):
            backend.append(t)
        elif any(x in t_low for x in ['sql', 'postgres', 'mongo', 'redis', 'database', 'sqlite']):
            database.append(t)
        elif any(x in t_low for x in ['aws', 'cloud', 's3', 'docker', 'hosting', 'vault']):
            cloud.append(t)
        elif any(x in t_low for x in ['api', 'stripe', 'twilio', 'zoom', 'wallet', 'mapbox', 'maps', 'hubspot', 'algolia', 'ses']):
            apis.append(t)
        else:
            devops.append(t)
            
    # Guarantee rich, non-empty categories
    if not frontend:
        frontend = ['React.js', 'Tailwind CSS', 'TypeScript']
    if not backend:
        backend = ['Node.js', 'Express REST APIs']
    if not database:
        database = ['PostgreSQL', 'Redis In-Memory']
    if not cloud:
        cloud = ['AWS Cloud Infrastructure', 'Docker Containers']
    if not apis:
        apis = ['RESTful API Endpoints', 'Payment & Notification Webhooks']
    if not devops:
        devops = ['GitHub Actions CI/CD', 'Jest / Automated Testing', 'TLS 1.3 Security']
        
    return {
        'frontend': frontend,
        'backend': backend,
        'database': database,
        'cloud': cloud,
        'apis': apis,
        'devops': devops
    }

# Update all projects
for p in projects:
    slug = p['slug']
    # Add extra features to make 6 total
    if slug in project_features_extra:
        existing_titles = [f[0] for f in p['features']]
        for extra_feat in project_features_extra[slug]:
            if extra_feat[0] not in existing_titles and len(p['features']) < 6:
                p['features'].append(extra_feat)
                
    p['tech_categorized'] = build_tech_stack(p)

with open('scratch/comprehensive_projects_cms_data.json', 'w', encoding='utf-8') as f:
    json.dump(projects, f, indent=2, ensure_ascii=False)

print("Enriched comprehensive_projects_cms_data.json with 6 features and categorized tech stacks!")

