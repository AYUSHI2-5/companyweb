import json

projects_cms_data = [
    {
        "num": 1,
        "title": "KP E-Services",
        "slug": "kp-e-services",
        "url": "https://kpeservices.in",
        "category": "FinTech & Loan Operations",
        "at_home_page": "Featured on Homepage",
        "service_month": "October 2024",
        "service_duration_days": "90 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#FinTech", "#LoanOrigination", "#DigitalWallet", "#BankingAPIs", "#CloudVault", "#ReactJS"],
        "technologies": ["React.js", "Node.js", "Express", "PostgreSQL", "Digital Wallets", "Cloud Vault", "FinTech APIs", "Docker", "Tailwind CSS"],
        "gallery_images": [
            "assets/portfolio-hero-1.png",
            "assets/portfolio-hero-showcase.png",
            "assets/about-office-showcase.png"
        ],
        "kicker": "Loan Lifecycle & Digital Operations Platform",
        "summary": "A comprehensive loan operations platform designed for connectors, borrowers, and internal underwriting teams. It tracks each loan application seamlessly from lead capture and pre-login data intake through document verification, credit sanction, and disbursement, incorporating live bank criteria algorithms, commission payouts, referral wallets, and support ticketing.",
        "challenge": "Lenders and loan distributors struggled with disconnected channel tracking, manual verification of complex bank eligibility criteria, delayed commission disbursements for connectors, and insecure borrower document storage.",
        "solution": "Baadam engineered a unified, high-security FinTech platform with real-time bank matching engines, digital referral wallets, an encrypted KYC document vault, and real-time borrower status tracking.",
        "outcomes": "Accelerated loan processing cycles by 64%, enabled instant loan status visibility for applicants, and automated over 99.4% of connector commission calculations and wallet disbursements.",
        "features": [
            ("Multi-Tier Loan Origination", "Guides applications seamlessly from lead creation and pre-login intake through credit verification, underwriting, and bank disbursement.", "&#9881;"),
            ("Bank Criteria Matching Algorithm", "Calculates real-time borrower eligibility across partner banking institutions with dynamic lending rule sets.", "&#9733;"),
            ("Connector Commission Wallet", "Automates referral reward calculations, agent wallet recharges, commission ledger records, and instant bank payouts.", "&#128179;"),
            ("Document Vault & KYC Security", "End-to-end encrypted cloud repository for borrower identity records, salary slips, tax filings, and audit compliance.", "&#128274;")
        ]
    },
    {
        "num": 2,
        "title": "Ashray Labs",
        "slug": "ashray-labs",
        "url": "https://ashraylabs.com",
        "category": "Healthcare & Diagnostics",
        "at_home_page": "Featured on Homepage",
        "service_month": "August 2024",
        "service_duration_days": "75 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#HealthTech", "#PathologyLab", "#PatientPortal", "#Diagnostics", "#NextJS", "#HIPAAReady"],
        "technologies": ["Next.js", "Python", "FastAPI", "PostgreSQL", "Docker", "Tailwind CSS", "AWS S3", "Twilio SMS"],
        "gallery_images": [
            "assets/case-dental-clinic.jpg",
            "assets/about-office-mockup.jpg",
            "assets/hero-office-clean.jpg"
        ],
        "kicker": "Diagnostics Management & Patient Portal",
        "summary": "A comprehensive public portal and laboratory management system for a fast-growing pathology collection network. Patients can seamlessly browse diagnostic packages, book home collection visits, request quotations, and securely access medical reports and invoices online.",
        "challenge": "Patients faced friction booking specialized test packages, while laboratory staff were overwhelmed by manual phone scheduling, paper report distribution, and disconnected multi-city specimen logistics.",
        "solution": "Built a high-conversion patient web application and administrative command console featuring phlebotomist route dispatch, dynamic test profile configuration, automated SMS alerts, and encrypted report vaults.",
        "outcomes": "Reduced specimen intake turnaround time by 48%, boosted direct online test package bookings by 210%, and eliminated report delivery overhead through instant digital report downloads.",
        "features": [
            ("Online Booking & Phlebotomist Dispatch", "Patients schedule clinic or home test visits with automated phlebotomist assignment and route optimization.", "&#128197;"),
            ("Dynamic Test Package Catalog", "Medical staff easily bundle individual pathology parameters into preventative health profiles with custom pricing.", "&#9783;"),
            ("Encrypted Patient Report Vault", "Secure, password-protected portal where patients can view biomarker trends, download PDF reports, and retrieve receipts.", "&#128196;"),
            ("Multi-City Operational Console", "Centralized administrative dashboard managing city hubs, localized pricing, test inventory, and seasonal promotions.", "&#127758;")
        ]
    },
    {
        "num": 3,
        "title": "ProCurve",
        "slug": "procurve",
        "url": "https://procurve.io",
        "category": "Financial Valuation & Advisory",
        "at_home_page": "Selected Case Study",
        "service_month": "July 2024",
        "service_duration_days": "110 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#FinTech", "#BusinessValuation", "#DCFModeling", "#SaaS", "#TypeScript", "#CorporateFinance"],
        "technologies": ["TypeScript", "React", "Node.js", "Financial Math Engine", "Encrypted SQLite", "Tailwind CSS", "PDF Export Engine"],
        "gallery_images": [
            "assets/about-office-mockup.jpg",
            "assets/portfolio-hero-showcase.png",
            "assets/about-office-showcase.png"
        ],
        "kicker": "Enterprise Financial Modeling & Valuation Suite",
        "summary": "Proprietary business-valuation software engineered for registered financial valuers, corporate advisory teams, and auditing firms. It provides structured valuation worksheets covering Discounted Cash Flow (DCF), market multiples, and Net Asset Value (NAV) methods.",
        "challenge": "Registered valuers relied on brittle, unversioned spreadsheet models that lacked collaborative audit trails, multi-class share capital handling, and standardized compliance outputs.",
        "solution": "Engineered an enterprise financial workstation featuring dynamic sensitivity matrices, cap-table capital modeling, peer multiple comparables, and automated, audit-ready valuation report generation.",
        "outcomes": "Reduced valuation preparation time from days to hours, eliminated spreadsheet formula errors, and standardized regulatory compliance for statutory valuation filings.",
        "features": [
            ("DCF & Income Approach Engine", "Automated multi-stage cash flow projections with customizable discount rates, terminal multiples, and sensitivity tables.", "&#128200;"),
            ("Market Multiple Modeling", "Applies industry-specific peer multiples and transaction benchmarks with historical index adjustments.", "&#128202;"),
            ("Net Asset Value (NAV) Sheets", "Structured balance sheet revaluation sheets that balance asset appreciation, liability haircuts, and net worth calculations.", "&#9878;"),
            ("Cap-Table & Share Capital Vault", "Manages complex multi-class share structures, preferential stock, convertible notes, and historical valuation drafts.", "&#128221;")
        ]
    },
    {
        "num": 4,
        "title": "Heart Foundation and Research Institute",
        "slug": "heart-foundation-and-research-institute",
        "url": "https://heartfoundationresearch.org",
        "category": "Medical Research & Grants",
        "at_home_page": "Selected Case Study",
        "service_month": "June 2024",
        "service_duration_days": "80 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#MedTech", "#ResearchGrants", "#ClinicalTrials", "#InstitutionalPortal", "#VueJS", "#Laravel"],
        "technologies": ["Vue.js", "Laravel", "PHP", "MySQL", "Redis", "AWS SES", "Docker", "Bootstrap 5"],
        "gallery_images": [
            "assets/about-office.jpg",
            "assets/hero-office.jpg",
            "assets/about-digital-solutions.jpg"
        ],
        "kicker": "Medical Research Grants & Project Review Portal",
        "summary": "An institutional project submission and grant administration portal for medical foundations, academic researchers, and healthcare organizations. Applicants complete detailed research protocols, submit grant requests, and track review stages in real time.",
        "challenge": "Medical research proposals were bottlenecked by manual paper applications, untracked peer review scoring, and delayed communication between ethics committees and applicants.",
        "solution": "Delivered a digital research portal featuring role-based ethics committee review workflows, blinded peer evaluations, automated milestone tracking, and real-time email notifications.",
        "outcomes": "Cut grant evaluation cycles by 55%, enabled end-to-end transparent protocol tracking, and securely cataloged hundreds of medical research initiatives.",
        "features": [
            ("Standardized Protocol Submission", "Structured multi-stage submission pipeline capturing clinical objectives, methodology, investigator credentials, and budgets.", "&#128300;"),
            ("Ethics Committee Review Boards", "Role-based evaluation scorecards with blinded review support, revision requests, and decision logs.", "&#9745;"),
            ("Automated Notification Pipeline", "Real-time in-app alerts and email notifications dispatched automatically at each evaluation milestone.", "&#128276;"),
            ("Grant Milestone & Archive Hub", "Centralized digital repository tracking clinical deliverables, publication outputs, and grant expenditure audits.", "&#128194;")
        ]
    },
    {
        "num": 5,
        "title": "Vishan Institute of Technology",
        "slug": "vishan-institute-of-technology",
        "url": "https://vishan.edu.in",
        "category": "Education & Academic LMS",
        "at_home_page": "Selected Case Study",
        "service_month": "May 2024",
        "service_duration_days": "65 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#EdTech", "#CollegePortal", "#AcademicLMS", "#StudentEnrollment", "#PHP", "#Laravel"],
        "technologies": ["PHP", "Laravel", "MySQL", "Bootstrap 5", "Cloud Storage", "RESTful APIs", "Chart.js"],
        "gallery_images": [
            "assets/hero-office-clean.jpg",
            "assets/about-office-mockup.jpg",
            "assets/hero-office.jpg"
        ],
        "kicker": "Institutional Campus Portal & Academic LMS",
        "summary": "A modern college web platform and back-office academic management system. Prospective students explore degree programs and enroll online, while administrators and faculty oversee course scheduling, student invoicing, holidays, and cloud-based e-library resources.",
        "challenge": "Disjointed admissions procedures, offline timetable coordination, and manual fee recordkeeping slowed administrative efficiency and hindered student engagement.",
        "solution": "Built a mobile-first institutional portal integrating digital course admissions, batch timetable builders, an encrypted digital library, and an automated student tuition fee billing system.",
        "outcomes": "Increased online admissions inquiries by 140%, automated timetable conflict detection across 40+ faculty members, and modernized student access to study resources.",
        "features": [
            ("High-Conversion Course Catalog", "Interactive degree and diploma showcase with curriculum breakdowns, faculty profiles, and friction-free enrollment forms.", "&#127891;"),
            ("Academic Timetable Scheduler", "Administrative timetable engine managing lecture halls, faculty allocations, exam dates, and academic calendars.", "&#128197;"),
            ("Cloud Digital E-Library", "Secure document repository providing students 24/7 access to syllabus notes, past exam papers, and research articles.", "&#128218;"),
            ("Tuition Billing & Invoicing", "Automated student fee collection module generating downloadable invoices, receipt ledgers, and installment reminders.", "&#128176;")
        ]
    },
    {
        "num": 6,
        "title": "Chick N Go",
        "slug": "chick-n-go",
        "url": "https://chickngo.com",
        "category": "Food & Beverage E-Commerce",
        "at_home_page": "Featured on Homepage",
        "service_month": "April 2024",
        "service_duration_days": "60 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#FoodTech", "#OnlineOrdering", "#QuickService", "#ECommerce", "#ReactJS", "#NodeJS"],
        "technologies": ["React", "Node.js", "Express", "Stripe", "Redis", "Cloud Hosting", "Tailwind CSS"],
        "gallery_images": [
            "assets/portfolio-hero-2.png",
            "assets/contact-hero-workspace.png",
            "assets/case-coffee-roastery.jpg"
        ],
        "kicker": "Multi-Brand Food Ordering & Kitchen Dispatch",
        "summary": "A high-speed food-ordering web application and back-office store operations suite. Customers browse visual menus, configure custom meal combos, place online orders, and pay securely, powered by an architecture that supports multiple brand storefronts on any domain.",
        "challenge": "High third-party delivery marketplace commissions, lack of multi-domain brand support, and slow mobile order checkout experiences were dampening restaurant profitability.",
        "solution": "Developed a headless ordering engine with instant mobile cart flows, multi-gateway payment processing, kitchen order dispatch boards, and centralized brand menu management.",
        "outcomes": "Cut third-party delivery commission costs by 32%, boosted average order value via intelligent menu upsells by 18%, and achieved sub-second checkout speeds.",
        "features": [
            ("Multi-Domain Headless Engine", "A unified core application engineered to power independent restaurant brands and domains from a single admin panel.", "&#127760;"),
            ("Interactive Meal Customizer", "Real-time ordering workflow allowing diners to tailor toppings, spice levels, sides, and combo beverage selections.", "&#127831;"),
            ("Instant Multi-Gateway Checkout", "High-conversion checkout pipeline integrated with Stripe and regional payment methods with automated SMS/Email receipts.", "&#128179;"),
            ("Live Kitchen Dispatch Board", "Real-time kitchen order display board tracking ticket statuses, prep times, and courier dispatch updates.", "&#128293;")
        ]
    },
    {
        "num": 7,
        "title": "Sunshine Wholesale",
        "slug": "sunshine-wholesale",
        "url": "https://sunshinewholesale.ca",
        "category": "B2B Wholesale & Distribution",
        "at_home_page": "Selected Case Study",
        "service_month": "March 2024",
        "service_duration_days": "85 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#B2BWholesale", "#ShopifyPlus", "#Ecommerce", "#CanadaRetail", "#Distribution", "#Algolia"],
        "technologies": ["Shopify Plus", "Liquid", "Node.js", "Algolia Search", "B2B Wholesale APIs", "SCSS", "JavaScript"],
        "gallery_images": [
            "assets/case-coffee-roastery.jpg",
            "assets/portfolio-hero-3.png",
            "assets/about-office.jpg"
        ],
        "kicker": "High-Volume B2B Storefront & Inventory Engine",
        "summary": "An enterprise B2B wholesale commerce storefront built for a leading Canadian smoking accessories distributor. Verified commercial buyers access wholesale pricing, place high-volume bulk orders, manage inventory wishlists, and explore industry market insights.",
        "challenge": "Serving retail store buyers required strict merchant verification, tiered volume price sheets, minimum order values, and fast bulk ordering that standard retail storefronts couldn't handle.",
        "solution": "Architected a custom Shopify Plus B2B wholesale platform featuring automated buyer license approval, tiered volume price matrixes, instant bulk order entry, and real-time inventory synchronization.",
        "outcomes": "Streamlined bulk purchasing for over 800+ Canadian retail stores, increased repeat reorder speed by 70%, and grew organic B2B search traffic via specialized industry guides.",
        "features": [
            ("Tiered B2B Wholesale Pricing", "Protected commercial accounts with volume-based price tiering, minimum order thresholds, and tax exemption rules.", "&#128230;"),
            ("High-Throughput Bulk Order Grid", "Rapid multi-variant ordering table allowing retailers to enter hundreds of SKU quantities in a few seconds.", "&#128203;"),
            ("Sub-Second Search & Catalog Sync", "Algolia-powered search and categorization handling thousands of inventory items with instant specification filtering.", "&#128269;"),
            ("Wholesale Content & SEO Engine", "Educational resource center and blog driving high-intent B2B merchant acquisition across Canadian provinces.", "&#128221;")
        ]
    },
    {
        "num": 8,
        "title": "Cyclical Beauty",
        "slug": "cyclical-beauty",
        "url": "https://cyclicalbeauty.com",
        "category": "Beauty & D2C E-Commerce",
        "at_home_page": "Featured on Homepage",
        "service_month": "February 2024",
        "service_duration_days": "50 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#D2C", "#ShopifyTheme", "#CleanBeauty", "#StoreLocator", "#UIUX", "#StorefrontGraphQL"],
        "technologies": ["Shopify Liquid", "JavaScript", "SCSS", "Storefront GraphQL", "Google Maps API", "Figma"],
        "gallery_images": [
            "assets/portfolio-hero-3.png",
            "assets/case-fitness-app.jpg",
            "assets/contact-hero-workspace.png"
        ],
        "kicker": "Shopify 2.0 D2C Storefront & Wholesale Locator",
        "summary": "A bespoke Shopify 2.0 digital storefront for a premium clean beauty brand. Featuring sensory product storytelling, ingredient transparency modules, high-conversion mobile checkouts, a wholesale stockist application portal, and an interactive retail store locator.",
        "challenge": "The brand needed to communicate its natural ingredient philosophy and clean beauty ethos while maintaining fast mobile page speeds and driving both direct consumer and retail wholesale sales.",
        "solution": "Built a custom, lightweight Shopify 2.0 theme with modular storytelling sections, interactive skincare benefit carousels, a stockist application portal, and an integrated retail store locator.",
        "outcomes": "Boosted mobile conversion rate by 34%, reduced checkout abandonment by 22%, and successfully onboarded 45+ regional boutique stockists through the wholesale locator.",
        "features": [
            ("Modular Shopify 2.0 Architecture", "Flexible, componentized sections engineered for rapid marketing updates, benefit highlights, and aesthetic consistency.", "&#127807;"),
            ("Ingredient Transparency Modules", "Visual breakdowns highlighting clean botanicals, ethical sourcing, and clinical skin compatibility.", "&#127912;"),
            ("B2B Retail Stockist Intake", "Specialized merchant application portal enabling boutique retailers to apply for wholesale shelf stocking online.", "&#128188;"),
            ("Interactive 'Where to Shop' Locator", "Google Maps integrated store locator guiding customers to verified retail stockists based on geolocation.", "&#128205;")
        ]
    },
    {
        "num": 9,
        "title": "LPG Booking",
        "slug": "lpg-booking",
        "url": "https://lpgbookingoperations.in",
        "category": "Energy & Utility Operations",
        "at_home_page": "Selected Case Study",
        "service_month": "January 2024",
        "service_duration_days": "95 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#UtilityTech", "#LPGOperations", "#AgentWallet", "#OrderManagement", "#PostgreSQL", "#WebSockets"],
        "technologies": ["React", "Node.js", "Express", "PostgreSQL", "WebSockets", "Digital Wallet Engine", "Docker"],
        "gallery_images": [
            "assets/hero-office-rect.jpg",
            "assets/about-office-showcase.png",
            "assets/hero-office.jpg"
        ],
        "kicker": "Utility Cylinder Booking & Agent Wallet System",
        "summary": "A high-volume logistics and booking portal built for LPG agency networks and commercial gas distributors. Field agents manage bulk booking sheets, recharge operational wallets, track consumer cylinder delivery lifecycles, and escalate post-delivery issues to admin dispatchers.",
        "challenge": "Field distributors experienced tracking discrepancies, delayed manual payment reconciliation, and slow dispute resolution for consumer cylinder delivery batches.",
        "solution": "Created an automated operations portal with real-time digital wallet recharge tracking, bulk order CSV processing, post-delivery dispute ticketing, and role-based staff management consoles.",
        "outcomes": "Eliminated manual booking entry bottlenecks, automated payment settlement for 250+ agency operators, and achieved 100% auditable delivery records.",
        "features": [
            ("Agent Booking Sheet Engine", "High-throughput batch booking system enabling field agents to register hundreds of domestic and commercial bookings.", "&#128293;"),
            ("Digital Recharge Wallet", "Instant online wallet replenishment system with real-time transaction ledgers, balance alerts, and automated receipts.", "&#128179;"),
            ("Post-Delivery Dispute Resolution", "Standardized customer escalation ticketing for tracking delivery delays, damaged cylinders, and billing adjustments.", "&#128736;"),
            ("Role-Based Staff Governance", "Administrative security matrix managing depot managers, territory supervisors, agents, and financial compliance audits.", "&#128101;")
        ]
    },
    {
        "num": 10,
        "title": "Servizo",
        "slug": "servizo",
        "url": "https://servizoapp.com",
        "category": "On-Demand Services & Marketplace",
        "at_home_page": "Selected Case Study",
        "service_month": "December 2023",
        "service_duration_days": "100 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#OnDemand", "#ServiceMarketplace", "#WarrantyClaims", "#VendorDispatch", "#VueJS", "#MongoDB"],
        "technologies": ["Vue.js", "Node.js", "MongoDB", "Express", "AWS S3", "Twilio", "Tailwind CSS", "Redis"],
        "gallery_images": [
            "assets/case-fitness-app.jpg",
            "assets/about-digital-solutions.jpg",
            "assets/portfolio-hero-showcase.png"
        ],
        "kicker": "On-Demand Service Network & Warranty Claims",
        "summary": "An on-demand home and commercial repair service marketplace administration console. The platform orchestrates customer service requests, dynamic diagnostic intake questions, vendor capacity dispatch, customer referral lists, and post-service warranty claims.",
        "challenge": "Handling diverse service categories (electrical, plumbing, HVAC, appliances) created chaotic dispatch workflows, inconsistent diagnostic pricing, and unorganized warranty claim verifications.",
        "solution": "Built a scalable multi-category service platform featuring dynamic diagnostic intake questionnaires, automated vendor dispatch, warranty verification tracking, and promotional referral engines.",
        "outcomes": "Reduced technician dispatch latency by 52%, handled over 15,000 monthly service requests, and automated 98% of customer warranty claim approvals.",
        "features": [
            ("Dynamic Service Questionnaire", "Configurable diagnostic logic capturing customer fault symptoms, equipment age, and photos before booking confirmation.", "&#10067;"),
            ("Vendor Dispatch & Capacity Engine", "Automated matching of verified local service technicians based on skill category, territory, and real-time availability.", "&#128104;&#8205;&#128295;"),
            ("Warranty Product Claim Portal", "Dedicated claims tracking workflow verifying service guarantee validity and assigning free follow-up repairs.", "&#128737;"),
            ("Referral & Marketing Controls", "Admin console managing customer referral bonuses, discount coupons, hero promotional banners, and category placement.", "&#127873;")
        ]
    },
    {
        "num": 11,
        "title": "Just Land",
        "slug": "just-land",
        "url": "https://justlandmarket.com",
        "category": "Real Estate & Land Marketplace",
        "at_home_page": "Featured on Homepage",
        "service_month": "November 2023",
        "service_duration_days": "120 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#PropTech", "#LandMarketplace", "#FSBO", "#Geospatial", "#NextJS", "#MapboxGL"],
        "technologies": ["Next.js", "React", "Node.js", "PostgreSQL", "Mapbox GL", "WebSockets", "AWS S3", "Tailwind CSS"],
        "gallery_images": [
            "assets/hero-building.jpg",
            "assets/hero-office-clean.jpg",
            "assets/about-office.jpg"
        ],
        "kicker": "Geospatial Land Marketplace & FSBO Portal",
        "summary": "A specialized real estate and land marketplace connecting prospective buyers with rural acreage, commercial parcels, and residential properties. Supports both For-Sale-By-Owner (FSBO) listings and verified broker profiles with interactive GIS mapping and in-app chat.",
        "challenge": "Land buyers lacked essential parcel data (topography, zoning, water rights, power access), while landowners and agents had few dedicated platforms for marketing rural parcels outside standard MLS homes.",
        "solution": "Architected an interactive property portal combining Mapbox geospatial boundary overlays, FSBO self-listing workflows, direct buyer-seller messaging channels, and saved parcel alert engines.",
        "outcomes": "Indexed over 4,500 active land parcels, boosted direct buyer inquiry conversion by 62%, and established a trusted community of verified rural land brokers.",
        "features": [
            ("Interactive Geospatial Map Search", "Mapbox-powered parcel search displaying acreage boundaries, terrain contours, access roads, and zoning overlays.", "&#127757;"),
            ("Dual FSBO & Broker Listing Hub", "Flexible listing management allowing landowners to list directly while providing professional broker portfolio tools.", "&#127969;"),
            ("In-App Real-Time Messaging", "Encrypted messaging channel enabling prospective buyers to submit offers and communicate directly with property owners.", "&#128172;"),
            ("Granular Property Taxonomy CMS", "Admin classification engine for categorizing water rights, mineral rights, agricultural zoning, and financing options.", "&#128209;")
        ]
    },
    {
        "num": 12,
        "title": "Just My Team",
        "slug": "just-my-team",
        "url": "https://justmyteam.network",
        "category": "Private Real Estate Social Network",
        "at_home_page": "Selected Case Study",
        "service_month": "October 2023",
        "service_duration_days": "70 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#RealEstateNetwork", "#AgentCollaboration", "#DownlineSaaS", "#PrivateDealRooms", "#React", "#TailwindCSS"],
        "technologies": ["React", "Node.js", "Tailwind CSS", "Firebase", "WebSockets", "Express", "End-to-End Encryption"],
        "gallery_images": [
            "assets/hero-crowd-overhead.jpg",
            "assets/contact-hero-workspace.png",
            "assets/about-digital-solutions.jpg"
        ],
        "kicker": "Private Brokerage Network & Downline Deal Room",
        "summary": "An exclusive private networking and transaction platform for real-estate agents who join with verified sponsor referral codes. Behind the public portal, authenticated agents manage downline networks, pocket listings, brokerage group chats, and confidential deal logs.",
        "challenge": "Real estate brokerages lacked a private, branded digital hub where agents could collaborate on off-market inventory, manage team recruiting downlines, and communicate without public social media noise.",
        "solution": "Engineered a closed social-business portal featuring invite-only referral onboarding, confidential pocket deal rooms, synchronized downline hierarchy trees, and agent deal notebooks.",
        "outcomes": "Onboarded 1,200+ licensed agents within 6 months, facilitated millions in off-market pocket transactions, and fostered strong internal brokerage alignment.",
        "features": [
            ("Referral Code Gate & Onboarding", "Secure access control requiring verified sponsor codes to register, safeguarding internal company discussions.", "&#128272;"),
            ("Visual Downline Team Hierarchy", "Dynamic downline tree mapping recruited agents, active transactions, team volumes, and split commission modeling.", "&#128101;"),
            ("Confidential Pocket Deal Rooms", "Exclusive internal marketplace where members share pre-market listings and buyer requirements before public MLS release.", "&#128273;"),
            ("Private Agent Deal Notebook", "Built-in notes console allowing agents to record client preferences, pending deal terms, and personal commission targets.", "&#128221;")
        ]
    },
    {
        "num": 13,
        "title": "RealtyBizHub",
        "slug": "realtybizhub",
        "url": "https://realtybizhub.com",
        "category": "PropTech SaaS & Marketing",
        "at_home_page": "Selected Case Study",
        "service_month": "September 2023",
        "service_duration_days": "65 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#PropTech", "#SaaSMarketing", "#CMS", "#LeadGen", "#NextJS", "#TailwindCSS"],
        "technologies": ["Next.js", "Headless CMS", "Tailwind CSS", "HubSpot API", "Cloudflare Edge", "Framer Motion"],
        "gallery_images": [
            "assets/portfolio-hero-showcase.png",
            "assets/hero-building.jpg",
            "assets/about-office.jpg"
        ],
        "kicker": "PropTech Multi-Product Showcase & Demo Funnel",
        "summary": "The flagship marketing platform and content management system for an interconnected suite of real estate operational software. It highlights featured PropTech platforms, provides an industry resource center, and captures qualified demo booking requests.",
        "challenge": "A growing software house needed a unified marketing presence to clearly differentiate multiple specialized products (CRM, Escrow, Land Portals) while consolidating demo scheduling into a centralized pipeline.",
        "solution": "Created a high-speed Next.js web application with dynamic product comparison sheets, an editorial resource center, and an interactive lead capture demo booking pipeline integrated with HubSpot CRM.",
        "outcomes": "Increased inbound enterprise demo bookings by 85%, reduced bounce rate by 28%, and gave marketing staff full autonomy over page branding and product copy via headless CMS.",
        "features": [
            ("Multi-Product Ecosystem Showcase", "High-impact visual overview presenting each proprietary PropTech platform with tailored feature highlights.", "&#128187;"),
            ("Interactive 'Book a Demo' Engine", "Dynamic lead capture funnel segmenting enterprise brokerages, teams, and solo agents into tailored demo schedules.", "&#128197;"),
            ("Editorial Resource Center CMS", "High-authority knowledge base and blog driving organic domain rating and educating industry decision-makers.", "&#128214;"),
            ("Whitelabel Branding Console", "Admin CMS empowering marketing staff to modify section layouts, feature copy, customer proof, and brand assets dynamically.", "&#127912;")
        ]
    },
    {
        "num": 14,
        "title": "Dodani ERP",
        "slug": "dodani-erp",
        "url": "https://dodanierp.internal",
        "category": "Brokerage Back-Office & Escrow ERP",
        "at_home_page": "Selected Case Study",
        "service_month": "August 2023",
        "service_duration_days": "130 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#RealEstateERP", "#EscrowManagement", "#BackOffice", "#Compliance", "#React", "#PostgreSQL"],
        "technologies": ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS S3", "WebSockets"],
        "gallery_images": [
            "assets/about-office-showcase.png",
            "assets/contact-hero-workspace.png",
            "assets/about-office.jpg"
        ],
        "kicker": "Real Estate Brokerage ERP & Escrow Tracker",
        "summary": "A specialized back-office enterprise resource planning system tailored for real estate brokerages and escrow coordinators. Teams oversee lead conversions, earnest money deposits, title commitments, shared water well agreements, and multi-party deal communication.",
        "challenge": "Brokerages faced compliance vulnerabilities and transaction delays using disjointed spreadsheets to track critical escrow milestones, inspection deadlines, and rural shared well covenants.",
        "solution": "Engineered an internal real estate operations suite featuring end-to-end escrow milestone tracking, specialized utility agreement vaults, shared team calendars, and contextual record commenting.",
        "outcomes": "Cut contract-to-closing administration time by 40%, maintained 100% audit compliance across hundreds of transactions, and eliminated missed contract deadline penalties.",
        "features": [
            ("End-to-End Escrow Pipeline", "Monitors earnest money deposits, title commitments, inspection contingencies, appraisal reports, and final closing dates.", "&#128203;"),
            ("Shared Well & Utility Vault", "Specialized documentation database tracking shared water well agreements, power easements, and maintenance covenants.", "&#128167;"),
            ("Collaborative Task Calendar", "Centralized brokerage calendar with automated milestone alerts, inspection dates, and agent task assignments.", "&#128197;"),
            ("Audit Trail & Contextual Threads", "Timestamped commenting system on every property record ensuring complete operational compliance and accountability.", "&#128172;")
        ]
    },
    {
        "num": 15,
        "title": "Arizona Land Investors",
        "slug": "arizona-land-investors",
        "url": "https://arizonalandinvestors.com",
        "category": "Private Land Syndication & Capital",
        "at_home_page": "Selected Case Study",
        "service_month": "July 2023",
        "service_duration_days": "75 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#LandSyndication", "#InvestorPortal", "#CapitalMarkets", "#NextJS", "#Stripe", "#FinTech"],
        "technologies": ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Zoom API", "AWS Cloud", "Tailwind CSS"],
        "gallery_images": [
            "assets/contact-hero-workspace.png",
            "assets/hero-building.jpg",
            "assets/about-office-mockup.jpg"
        ],
        "kicker": "Land Syndication Platform & Summit Portal",
        "summary": "A private land-investment syndication platform tailored for accredited investors, property owners, and commercial developers. Features strategic land acquisition portfolios, an annual investor summit registration pipeline, and an authenticated investor console.",
        "challenge": "Private syndicators needed an authoritative digital venue to present multi-million dollar land acquisition strategies, manage summit registrations, and provide investors real-time escrow visibility.",
        "solution": "Built a high-trust digital investment platform featuring yield calculation tools, event ticketing for the annual summit, authenticated investor escrow consoles, and direct syndicator consultation chat.",
        "outcomes": "Assisted in raising millions in private land development capital, sold out summit conference allocations, and simplified quarterly investor status reporting.",
        "features": [
            ("Syndication Portfolio Simulator", "Interactive investor calculator modeling historical land appreciation, projected yields, and capital repayment horizons.", "&#128200;"),
            ("Summit Conference Management", "Event ticketing and attendee credentialing pipeline handling speaker schedules, sponsor tiers, and VIP seating.", "&#127903;"),
            ("Private Escrow & Interest Tracker", "Authenticated member console for monitoring open escrow holdings, capital allocations, and official distributions.", "&#128188;"),
            ("Direct Syndicator Chat & Booking", "Integrated consultation pipeline connecting accredited investors directly with syndication principals.", "&#128172;")
        ]
    },
    {
        "num": 16,
        "title": "Micro Matching",
        "slug": "micro-matching",
        "url": "https://micromatching.io",
        "category": "Influencer Marketing & AdTech",
        "at_home_page": "Selected Case Study",
        "service_month": "June 2023",
        "service_duration_days": "105 Days",
        "status": "Completed & Live Production",
        "hashtags": ["#AdTech", "#InfluencerMarketing", "#StripeConnect", "#EscrowPayments", "#Python", "#Django"],
        "technologies": ["React", "Python", "Django REST", "Stripe Connect", "Redis", "PostgreSQL", "AWS S3"],
        "gallery_images": [
            "assets/cta-collaboration.jpg",
            "assets/portfolio-hero-showcase.png",
            "assets/case-fitness-app.jpg"
        ],
        "kicker": "Creator Marketplace & Automated KYC Admin Panel",
        "summary": "An administrative command center and operations marketplace connecting consumer brands with vetted micro-influencers. Platform administrators review creator media kits, approve sponsored campaign packages, verify KYC documentation, and settle payments securely via Stripe.",
        "challenge": "Manual influencer vetting, fraudulent follower metrics, and insecure upfront campaign payments caused high financial risks and operational chaos for marketing agencies.",
        "solution": "Delivered a full-lifecycle influencer operations engine with creator audience verification, automated Stripe milestone escrow payments, coupon conversion tracking, and deliverable review desks.",
        "outcomes": "Processed over 3,000 sponsored creator campaigns, reduced payment dispute rates to under 0.2%, and cut campaign onboarding time from weeks to minutes.",
        "features": [
            ("Creator & Brand KYC Verification", "Comprehensive verification workflow validating creator audience demographics, engagement ratios, and brand business tax records.", "&#128100;"),
            ("Stripe Escrow Split Settlements", "Automated escrow vault securing brand funds upon campaign approval and releasing payouts once milestones are verified.", "&#128179;"),
            ("Coupon & Attribution Analytics", "Real-time tracking attributing discount code redemptions, CTRs, and ROI back to specific creator tiers.", "&#128202;"),
            ("Deliverable Milestone Review Desk", "Administrative console where agency staff inspect draft reels, sponsored captions, and proof-of-posting before release.", "&#9745;")
        ]
    }
]

with open('scratch/comprehensive_projects_cms_data.json', 'w', encoding='utf-8') as f:
    json.dump(projects_cms_data, f, indent=2)

print("Saved comprehensive_projects_cms_data.json successfully with all 16 projects and full CMS fields!")

