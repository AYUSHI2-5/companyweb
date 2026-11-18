import re
import json

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Header & Navigation
header_data = {
    "logo_text": "BAADAM Info and Tradelink Services",
    "logo_img": "assets/baadam-logo.png",
    "nav_links": [
        {"label": "Home", "url": "index.html", "active": True},
        {"label": "Services", "url": "services.html", "has_dropdown": True},
        {"label": "Portfolio", "url": "portfolio.html", "has_dropdown": True},
        {"label": "About Us", "url": "about.html"},
        {"label": "Contact", "url": "contact.html"}
    ],
    "cta_button": {
        "label": "Let's Talk",
        "url": "contact.html"
    }
}

# 2. Hero Section
hero_data = {
    "availability_badge": {
        "status_text": "Available for New Projects",
        "quarter": "Q4 2026",
        "spots": "3 spots left",
        "visible": True
    },
    "headline": {
        "main": "Engineering Scalable Software Systems with",
        "highlight": "Precision & Clarity.",
        "description": "High-throughput web platforms, custom enterprise applications, and cloud-native software engineered for global scale and bulletproof reliability."
    },
    "social_proof": {
        "likes_count": "1.2k+",
        "likes_label": "Global Clients",
        "review_text": "New 5.0 Star Review",
        "ranking_label": "#1 Tech Engineering Agency in Ahmedabad",
        "visible": True
    },
    "ctas": {
        "primary_label": "Book Strategy Call",
        "primary_url": "contact.html",
        "secondary_label": "See Our Work",
        "secondary_url": "portfolio.html",
        "visible": True
    },
    "metrics": [
        {"counter": "100k+", "label": "Active Users", "anim_target": 100},
        {"counter": "5.0 ★", "label": "98+ Reviews", "anim_target": 5},
        {"counter": "30+", "label": "Brands Scaled", "anim_target": 30}
    ],
    "shortcuts": [
        {"label": "Website", "url": "services/website-development/"},
        {"label": "Apps", "url": "services/application-development/"},
        {"label": "Marketing", "url": "services/digital-marketing/"},
        {"label": "E-Commerce", "url": "services.html#ecommerce"}
    ]
}

# 3. Radar Section
radar_data = {
    "kicker": "ACTIVE RADAR &middot; Q4 2026",
    "headline_main": "Where Engineering",
    "headline_highlight": "Meets Momentum",
    "description": "Continuously deploying high-impact digital products across India, USA, and global markets.",
    "center_number": "16+",
    "center_label": "Active Deliveries",
    "stats": [
        {"value": "99.8%", "label": "On-Time Sprint Completion"},
        {"value": "12ms", "label": "Average API Response Latency"},
        {"value": "100%", "label": "In-House Engineering Team"}
    ]
}

# 4. Services Section
# Extract the 6 services from lines 440 to 944
services_data = [
    {
        "id": "service-01",
        "num": "01",
        "title": "Website Development",
        "short_desc": "High-performing web experiences that are digitally transformative, fully functional, and secure.",
        "search_heading": "Full-Stack Web Architecture & Performance",
        "technologies": ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS"],
        "feature_headline": "Scalable Digital Portals & Enterprise Web Solutions",
        "feature_desc": "We build fast, SEO-optimized web platforms with microservices architectures, server-side rendering, and headless CMS integrations.",
        "features": [
            "Next.js / SSR & Static Generation",
            "Headless CMS Architecture",
            "Core Web Vitals Optimization",
            "Multi-Tenant SaaS Portals"
        ],
        "metrics": {"speed": "< 1.2s LCP", "uptime": "99.99%"},
        "badge_text": "High Performance",
        "price": "Custom Quote",
        "unit": "per sprint",
        "explore_url": "services/website-development/",
        "active": True,
        "order": 1
    },
    {
        "id": "service-02",
        "num": "02",
        "title": "Application Development",
        "short_desc": "Native and cross-platform mobile apps for iOS, Android, and web with smooth user flows.",
        "search_heading": "Native iOS & Android Mobile Engineering",
        "technologies": ["Flutter", "React Native", "Swift", "Kotlin", "Firebase"],
        "feature_headline": "Fluid Consumer & Enterprise Mobile Apps",
        "feature_desc": "End-to-end mobile applications with offline-first capabilities, real-time sync, and hardware integrations.",
        "features": [
            "Cross-Platform Flutter & React Native",
            "Real-Time Push & WebSockets",
            "Biometric Authentication & Security",
            "App Store & Play Store CI/CD"
        ],
        "metrics": {"rating": "4.9★", "downloads": "500k+"},
        "badge_text": "Mobile First",
        "price": "Custom Quote",
        "unit": "per milestone",
        "explore_url": "services/application-development/",
        "active": True,
        "order": 2
    },
    {
        "id": "service-03",
        "num": "03",
        "title": "Digital Marketing",
        "short_desc": "Comprehensive digital growth strategies that increase website traffic, conversions, and revenue.",
        "search_heading": "Performance Marketing & Funnel Optimization",
        "technologies": ["Google Ads", "Meta Ads", "SEO", "Analytics", "HubSpot"],
        "feature_headline": "Data-Driven Multi-Channel Acquisition",
        "feature_desc": "Strategic digital campaigns driving measurable ROI, organic search dominance, and high-converting lead funnels.",
        "features": [
            "Technical SEO & Content Strategy",
            "Paid Media & PPC Optimization",
            "Marketing Automation & CRM",
            "Conversion Rate Optimization (CRO)"
        ],
        "metrics": {"roas": "4.2x Avg", "traffic": "+340%"},
        "badge_text": "Growth Engine",
        "price": "Custom Quote",
        "unit": "monthly retainer",
        "explore_url": "services/digital-marketing/",
        "active": True,
        "order": 3
    },
    {
        "id": "service-04",
        "num": "04",
        "title": "E-Commerce Development",
        "short_desc": "Scale online business efficiently with custom stores, automated checkouts, and ERP sync.",
        "search_heading": "Modern Headless E-Commerce Platforms",
        "technologies": ["Shopify Plus", "WooCommerce", "Stripe", "GraphQL", "Algolia"],
        "feature_headline": "High-Conversion Digital Commerce",
        "feature_desc": "Omnichannel shopping experiences with sub-second page loads, custom cart logic, and multi-currency checkout.",
        "features": [
            "Headless Storefronts & APIs",
            "Custom Payment Gateways & Escrow",
            "Inventory & ERP Synchronization",
            "One-Click Checkout Optimization"
        ],
        "metrics": {"conversion": "3.8%", "cart_abandon": "-24%"},
        "badge_text": "Omnichannel",
        "price": "Custom Quote",
        "unit": "per project",
        "explore_url": "services.html#ecommerce",
        "active": True,
        "order": 4
    },
    {
        "id": "service-05",
        "num": "05",
        "title": "Software Development",
        "short_desc": "Custom enterprise ERPs, cloud platforms, valuation suites, and backend infrastructure.",
        "search_heading": "Enterprise Software & Cloud Systems",
        "technologies": ["Python", "Go", "PostgreSQL", "Docker", "AWS", "Kubernetes"],
        "feature_headline": "Robust Custom Software & Distributed Architecture",
        "feature_desc": "Fault-tolerant internal systems, brokerage ERPs, and financial modeling engines built for mission-critical operations.",
        "features": [
            "Microservices & Event-Driven Architecture",
            "Custom ERP & CRM Platforms",
            "Cloud Infrastructure & DevOps",
            "Enterprise Security & Compliance"
        ],
        "metrics": {"uptime": "99.99%", "latency": "< 25ms"},
        "badge_text": "Mission Critical",
        "price": "Custom Quote",
        "unit": "per architecture",
        "explore_url": "services.html#software-dev",
        "active": True,
        "order": 5
    },
    {
        "id": "service-06",
        "num": "06",
        "title": "Game Development",
        "short_desc": "Engaging interactive games and 3D web experiences using Unity, Unreal, and WebGL.",
        "search_heading": "Interactive 2D/3D Games & WebGL Experiences",
        "technologies": ["Unity", "Unreal Engine", "WebGL", "Three.js", "C#"],
        "feature_headline": "Immersive Gameplay & Cross-Platform Mechanics",
        "feature_desc": "From casual mobile gaming titles to interactive 3D browser simulations and gamified brand experiences.",
        "features": [
            "Cross-Platform Mobile Game Builds",
            "3D Browser WebGL / WebGPU",
            "Real-Time Multiplayer Networking",
            "Physics Simulation & VFX"
        ],
        "metrics": {"fps": "60 FPS Locked", "retention": "D30 28%"},
        "badge_text": "Immersive 3D",
        "price": "Custom Quote",
        "unit": "per title",
        "explore_url": "services.html#game-dev",
        "active": True,
        "order": 6
    }
]

# 5. Featured Work (Projects)
featured_work_data = {
    "kicker": "[ (02) PORTFOLIO &middot; SELECTED WORK ]",
    "heading": "Featured Case Studies",
    "description": "High-impact software systems, commercial web portals, and enterprise platforms engineered for industry leaders.",
    "cta_label": "Explore All 16 Projects",
    "cta_url": "portfolio.html",
    "featured_slugs": [
        "kp-e-services",
        "ashray-labs",
        "procurve",
        "heart-foundation-and-research-institute",
        "cyclical-beauty",
        "chick-n-go"
    ],
    "display_count": 6
}

# 6. Case Studies (Before/After Slider)
case_studies_data = {
    "kicker": "(03) REAL TRANSFORMATION",
    "heading": "Real Challenges.<br>Engineered Solutions.",
    "description": "Interactive before-and-after architecture breakdowns demonstrating tangible business outcomes.",
    "items": [
        {
            "id": "case-01",
            "tab_title": "FinTech Loan Operations",
            "client_name": "KP E-Services",
            "category": "FinTech & Loan Operations",
            "before_image": "assets/about-office.jpg",
            "after_image": "assets/portfolio-hero-1.png",
            "before_label": "Legacy System (Manual Processing)",
            "after_label": "Baadam Automated Platform",
            "description": "Transitioned legacy paper loan operations into a sub-second digital loan verification and disbursement engine.",
            "technologies": ["Node.js", "PostgreSQL", "Redis", "Docker", "AWS"],
            "achievements": [
                "Disbursement cycle slashed from 4 days to 14 minutes",
                "Processed over 100k+ customer KYC verifications",
                "Zero security incidents across $12M in originations"
            ],
            "cta_label": "View Full Case Study",
            "cta_url": "projects/kp-e-services/",
            "order": 1,
            "visible": True
        },
        {
            "id": "case-02",
            "tab_title": "Healthcare Diagnostic Portal",
            "client_name": "Ashray Labs",
            "category": "Healthcare & Diagnostics",
            "before_image": "assets/about-office-showcase.png",
            "after_image": "assets/case-dental-clinic.jpg",
            "before_label": "Fragmented Patient Communication",
            "after_label": "Integrated Pathology Portal",
            "description": "Built an automated pathology collection platform connecting home phlebotomists with automated lab testing pipelines.",
            "technologies": ["React", "Express", "MongoDB", "Twilio", "PDF Generation"],
            "achievements": [
                "Patient report delivery time reduced by 65%",
                "Online home sample booking adoption exceeded 78%",
                "HIPAA-compliant encrypted cloud records storage"
            ],
            "cta_label": "View Full Case Study",
            "cta_url": "projects/ashray-labs/",
            "order": 2,
            "visible": True
        },
        {
            "id": "case-03",
            "tab_title": "Enterprise Financial Valuation",
            "client_name": "ProCurve",
            "category": "Financial Valuation & Advisory",
            "before_image": "assets/about-office-mockup.jpg",
            "after_image": "assets/portfolio-hero-showcase.png",
            "before_label": "Spreadsheet Inconsistencies",
            "after_label": "Multi-Method Valuation Engine",
            "description": "Designed a registered valuer mathematical computation engine covering DCF, NAV, and market-multiple formulas.",
            "technologies": ["Python", "FastAPI", "React", "NumPy", "Tailwind CSS"],
            "achievements": [
                "Audit calculation accuracy certified at 99.99%",
                "Multi-scenario financial forecasting in under 2 seconds",
                "Standardized corporate valuation report generation"
            ],
            "cta_label": "View Full Case Study",
            "cta_url": "projects/procurve/",
            "order": 3,
            "visible": True
        }
    ]
}

# 7. How We Work (Funnel)
how_we_work_data = {
    "kicker": "(04) How We Work",
    "heading": "From attention to clients.",
    "highlight": "The funnel.",
    "description": "A systematic, disciplined engineering process taking digital products from initial discovery to high-velocity scale.",
    "stages": [
        {
            "id": "stage-01",
            "num": "01",
            "title": "Reach",
            "metric_label": "Impression Rate",
            "metric_value": "85%",
            "progress_pct": 85,
            "conversion_pct": "100%",
            "timeline": "Week 1-2",
            "description": "Strategic discovery, audience profiling, technical scoping, and high-visibility digital positioning.",
            "order": 1,
            "visible": True
        },
        {
            "id": "stage-02",
            "num": "02",
            "title": "Launch",
            "metric_label": "Deployment Velocity",
            "metric_value": "72%",
            "progress_pct": 72,
            "conversion_pct": "84%",
            "timeline": "Week 3-6",
            "description": "Iterative sprint execution, test-driven engineering, security hardening, and production deployment.",
            "order": 2,
            "visible": True
        },
        {
            "id": "stage-03",
            "num": "03",
            "title": "Optimise",
            "metric_label": "Efficiency Gain",
            "metric_value": "94%",
            "progress_pct": 94,
            "conversion_pct": "92%",
            "timeline": "Week 7-8",
            "description": "Performance profiling, query optimization, conversion funnel refinement, and latency tuning.",
            "order": 3,
            "visible": True
        },
        {
            "id": "stage-04",
            "num": "04",
            "title": "Scale",
            "metric_label": "Capacity Multiplier",
            "metric_value": "99%",
            "progress_pct": 99,
            "conversion_pct": "98%",
            "timeline": "Ongoing",
            "description": "Automated cloud horizontal scaling, continuous delivery pipelines, and proactive infrastructure monitoring.",
            "order": 4,
            "visible": True
        }
    ]
}

# 8. Next Steps / CTA
next_steps_data = {
    "kicker": "[ START A COLLABORATION ]",
    "heading": "Have a Project in Mind?<br>Let's Build It Together.",
    "description": "From high-throughput fintech platforms to scalable enterprise applications, Baadam engineers robust software systems that drive tangible business growth.",
    "bg_color": "linear-gradient(135deg, #E7192D 0%, #C41224 100%)",
    "bg_image": "",
    "right_image": "",
    "cta_button": {
        "label": "Schedule a Consultation",
        "url": "contact.html",
        "visible": True
    },
    "visible": True
}

full_cms_data = {
    "version": "1.0.0",
    "last_published": "2026-11-16T15:20:00.000Z",
    "published": {
        "header": header_data,
        "hero": hero_data,
        "radar": radar_data,
        "services": services_data,
        "featured_work": featured_work_data,
        "case_studies": case_studies_data,
        "how_we_work": how_we_work_data,
        "next_steps": next_steps_data
    },
    "draft": {
        "header": header_data,
        "hero": hero_data,
        "radar": radar_data,
        "services": services_data,
        "featured_work": featured_work_data,
        "case_studies": case_studies_data,
        "how_we_work": how_we_work_data,
        "next_steps": next_steps_data
    },
    "section_status": {
        "header": {"status": "published", "last_updated": "2026-11-16T15:20:00.000Z"},
        "hero": {"status": "published", "last_updated": "2026-11-16T15:20:00.000Z"},
        "services": {"status": "published", "last_updated": "2026-11-16T15:20:00.000Z"},
        "featured_work": {"status": "published", "last_updated": "2026-11-16T15:20:00.000Z"},
        "case_studies": {"status": "published", "last_updated": "2026-11-16T15:20:00.000Z"},
        "how_we_work": {"status": "published", "last_updated": "2026-11-16T15:20:00.000Z"},
        "next_steps": {"status": "published", "last_updated": "2026-11-16T15:20:00.000Z"}
    },
    "history": [
        {
            "version": "1.0.0",
            "published_at": "2026-11-16T15:20:00.000Z",
            "published_by": "admin",
            "notes": "Initial Production Baseline Snapshot"
        }
    ]
}

with open('data/homepage.json', 'w', encoding='utf-8') as f:
    json.dump(full_cms_data, f, indent=2)

print('Saved data/homepage.json successfully!')
