/**
 * BAADAM Portfolio - Unified Database Client Layer
 * Handles fetching, caching, localStorage/IndexedDB persistence,
 * REST API communication, and validation for all 9 project fields.
 * 
 * Works 100% seamlessly in BOTH environments:
 * 1. Running on a Web/API Server (fetches /api/projects)
 * 2. Static / Offline / file:// protocol (uses localStorage + embedded default seed)
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'baadam_projects_db_v1';
  const API_ENDPOINT = '/api/projects';

  // Seed data from canonical database
  const DEFAULT_PROJECTS = [
  {
    "id": "kp-e-services",
    "slug": "kp-e-services",
    "title": "KP E-Services",
    "url": "https://play.google.com/store/apps/details?id=kp_eservice.com",
    "category": "FinTech & Loan Operations",
    "at_home_page": true,
    "service_month": "October 2024",
    "service_duration_days": 90,
    "technologies": [
      "React.js",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Digital Wallets",
      "Cloud Vault",
      "FinTech APIs",
      "Docker",
      "Tailwind CSS"
    ],
    "description": "A comprehensive loan operations platform designed for connectors, borrowers, and internal underwriting teams. It tracks each loan application seamlessly from lead capture and pre-login data intake through document verification, credit sanction, and disbursement, incorporating live bank criteria algorithms, commission payouts, referral wallets, and support ticketing.",
    "images": [
      "assets/portfolio-hero-1.png",
      "assets/portfolio-hero-showcase.png",
      "assets/about-office-showcase.png"
    ]
  },
  {
    "id": "ashray-labs",
    "slug": "ashray-labs",
    "title": "Ashray Labs",
    "url": "https://www.ashraylabs.in/",
    "category": "Healthcare & Diagnostics",
    "at_home_page": true,
    "service_month": "August 2024",
    "service_duration_days": 75,
    "technologies": [
      "Next.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "Tailwind CSS",
      "AWS S3",
      "Twilio SMS"
    ],
    "description": "A comprehensive public portal and laboratory management system for a fast-growing pathology collection network. Patients can seamlessly browse diagnostic packages, book home collection visits, request quotations, and securely access medical reports and invoices online.",
    "images": [
      "assets/case-dental-clinic.jpg",
      "assets/about-office-mockup.jpg",
      "assets/hero-office-clean.jpg"
    ]
  },
  {
    "id": "procurve",
    "slug": "procurve",
    "title": "ProCurve",
    "url": "https://www.hpe.com/us/en/products/networking.html",
    "category": "Financial Valuation & Advisory",
    "at_home_page": false,
    "service_month": "July 2024",
    "service_duration_days": 110,
    "technologies": [
      "TypeScript",
      "React",
      "Node.js",
      "Financial Math Engine",
      "Encrypted SQLite",
      "Tailwind CSS",
      "PDF Export Engine"
    ],
    "description": "Proprietary business-valuation software engineered for registered financial valuers, corporate advisory teams, and auditing firms. It provides structured valuation worksheets covering Discounted Cash Flow (DCF), market multiples, and Net Asset Value (NAV) methods.",
    "images": [
      "assets/about-office-mockup.jpg",
      "assets/portfolio-hero-showcase.png",
      "assets/about-office-showcase.png"
    ]
  },
  {
    "id": "heart-foundation-and-research-institute",
    "slug": "heart-foundation-and-research-institute",
    "title": "Heart Foundation and Research Institute",
    "url": "https://heartfoundationresearch.org",
    "category": "Medical Research & Grants",
    "at_home_page": false,
    "service_month": "June 2024",
    "service_duration_days": 80,
    "technologies": [
      "Vue.js",
      "Laravel",
      "PHP",
      "MySQL",
      "Redis",
      "AWS SES",
      "Docker",
      "Bootstrap 5"
    ],
    "description": "An institutional project submission and grant administration portal for medical foundations, academic researchers, and healthcare organizations. Applicants complete detailed research protocols, submit grant requests, and track review stages in real time.",
    "images": [
      "assets/about-office.jpg",
      "assets/hero-office.jpg",
      "assets/about-digital-solutions.jpg"
    ]
  },
  {
    "id": "vishan-institute-of-technology",
    "slug": "vishan-institute-of-technology",
    "title": "Vishan Institute of Technology",
    "url": "https://vishan.edu.in",
    "category": "Education & Academic LMS",
    "at_home_page": false,
    "service_month": "May 2024",
    "service_duration_days": 65,
    "technologies": [
      "PHP",
      "Laravel",
      "MySQL",
      "Bootstrap 5",
      "Cloud Storage",
      "RESTful APIs",
      "Chart.js"
    ],
    "description": "A modern college web platform and back-office academic management system. Prospective students explore degree programs and enroll online, while administrators and faculty oversee course scheduling, student invoicing, holidays, and cloud-based e-library resources.",
    "images": [
      "assets/hero-office-clean.jpg",
      "assets/about-office-mockup.jpg",
      "assets/hero-office.jpg"
    ]
  },
  {
    "id": "chick-n-go",
    "slug": "chick-n-go",
    "title": "Chick N Go",
    "url": "https://chickngo.com",
    "category": "Food & Beverage E-Commerce",
    "at_home_page": true,
    "service_month": "April 2024",
    "service_duration_days": 60,
    "technologies": [
      "React",
      "Node.js",
      "Express",
      "Stripe",
      "Redis",
      "Cloud Hosting",
      "Tailwind CSS"
    ],
    "description": "A high-speed food-ordering web application and back-office store operations suite. Customers browse visual menus, configure custom meal combos, place online orders, and pay securely, powered by an architecture that supports multiple brand storefronts on any domain.",
    "images": [
      "assets/portfolio-hero-2.png",
      "assets/contact-hero-workspace.png",
      "assets/case-coffee-roastery.jpg"
    ]
  },
  {
    "id": "sunshine-wholesale",
    "slug": "sunshine-wholesale",
    "title": "Sunshine Wholesale",
    "url": "https://sunshinewholesale.ca",
    "category": "B2B Wholesale & Distribution",
    "at_home_page": false,
    "service_month": "March 2024",
    "service_duration_days": 85,
    "technologies": [
      "Shopify Plus",
      "Liquid",
      "Node.js",
      "Algolia Search",
      "B2B Wholesale APIs",
      "SCSS",
      "JavaScript"
    ],
    "description": "An enterprise B2B wholesale commerce storefront built for a leading Canadian smoking accessories distributor. Verified commercial buyers access wholesale pricing, place high-volume bulk orders, manage inventory wishlists, and explore industry market insights.",
    "images": [
      "assets/case-coffee-roastery.jpg",
      "assets/portfolio-hero-3.png",
      "assets/about-office.jpg"
    ]
  },
  {
    "id": "cyclical-beauty",
    "slug": "cyclical-beauty",
    "title": "Cyclical Beauty",
    "url": "https://cyclicalbeauty.com",
    "category": "Beauty & D2C E-Commerce",
    "at_home_page": true,
    "service_month": "February 2024",
    "service_duration_days": 50,
    "technologies": [
      "Shopify Liquid",
      "JavaScript",
      "SCSS",
      "Storefront GraphQL",
      "Google Maps API",
      "Figma"
    ],
    "description": "A bespoke Shopify 2.0 digital storefront for a premium clean beauty brand. Featuring sensory product storytelling, ingredient transparency modules, high-conversion mobile checkouts, a wholesale stockist application portal, and an interactive retail store locator.",
    "images": [
      "assets/portfolio-hero-3.png",
      "assets/case-fitness-app.jpg",
      "assets/contact-hero-workspace.png"
    ]
  },
  {
    "id": "lpg-booking",
    "slug": "lpg-booking",
    "title": "LPG Booking",
    "url": "https://lpgbookingoperations.in",
    "category": "Energy & Utility Operations",
    "at_home_page": false,
    "service_month": "January 2024",
    "service_duration_days": 95,
    "technologies": [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "WebSockets",
      "Digital Wallet Engine",
      "Docker"
    ],
    "description": "A high-volume logistics and booking portal built for LPG agency networks and commercial gas distributors. Field agents manage bulk booking sheets, recharge operational wallets, track consumer cylinder delivery lifecycles, and escalate post-delivery issues to admin dispatchers.",
    "images": [
      "assets/hero-office-rect.jpg",
      "assets/about-office-showcase.png",
      "assets/hero-office.jpg"
    ]
  },
  {
    "id": "servizo",
    "slug": "servizo",
    "title": "Servizo",
    "url": "https://servizoapp.com",
    "category": "On-Demand Services & Marketplace",
    "at_home_page": false,
    "service_month": "December 2023",
    "service_duration_days": 100,
    "technologies": [
      "Vue.js",
      "Node.js",
      "MongoDB",
      "Express",
      "AWS S3",
      "Twilio",
      "Tailwind CSS",
      "Redis"
    ],
    "description": "An on-demand home and commercial repair service marketplace administration console. The platform orchestrates customer service requests, dynamic diagnostic intake questions, vendor capacity dispatch, customer referral lists, and post-service warranty claims.",
    "images": [
      "assets/case-fitness-app.jpg",
      "assets/about-digital-solutions.jpg",
      "assets/portfolio-hero-showcase.png"
    ]
  },
  {
    "id": "just-land",
    "slug": "just-land",
    "title": "Just Land",
    "url": "https://justlandmarket.com",
    "category": "Real Estate & Land Marketplace",
    "at_home_page": true,
    "service_month": "November 2023",
    "service_duration_days": 120,
    "technologies": [
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "Mapbox GL",
      "WebSockets",
      "AWS S3",
      "Tailwind CSS"
    ],
    "description": "A specialized real estate and land marketplace connecting prospective buyers with rural acreage, commercial parcels, and residential properties. Supports both For-Sale-By-Owner (FSBO) listings and verified broker profiles with interactive GIS mapping and in-app chat.",
    "images": [
      "assets/hero-building.jpg",
      "assets/hero-office-clean.jpg",
      "assets/about-office.jpg"
    ]
  },
  {
    "id": "just-my-team",
    "slug": "just-my-team",
    "title": "Just My Team",
    "url": "https://justmyteam.network",
    "category": "Private Real Estate Social Network",
    "at_home_page": false,
    "service_month": "October 2023",
    "service_duration_days": 70,
    "technologies": [
      "React",
      "Node.js",
      "Tailwind CSS",
      "Firebase",
      "WebSockets",
      "Express",
      "End-to-End Encryption"
    ],
    "description": "An exclusive private networking and transaction platform for real-estate agents who join with verified sponsor referral codes. Behind the public portal, authenticated agents manage downline networks, pocket listings, brokerage group chats, and confidential deal logs.",
    "images": [
      "assets/hero-crowd-overhead.jpg",
      "assets/contact-hero-workspace.png",
      "assets/about-digital-solutions.jpg"
    ]
  },
  {
    "id": "realtybizhub",
    "slug": "realtybizhub",
    "title": "RealtyBizHub",
    "url": "https://realtybizhub.com",
    "category": "PropTech SaaS & Marketing",
    "at_home_page": false,
    "service_month": "September 2023",
    "service_duration_days": 65,
    "technologies": [
      "Next.js",
      "Headless CMS",
      "Tailwind CSS",
      "HubSpot API",
      "Cloudflare Edge",
      "Framer Motion"
    ],
    "description": "The flagship marketing platform and content management system for an interconnected suite of real estate operational software. It highlights featured PropTech platforms, provides an industry resource center, and captures qualified demo booking requests.",
    "images": [
      "assets/portfolio-hero-showcase.png",
      "assets/hero-building.jpg",
      "assets/about-office.jpg"
    ]
  },
  {
    "id": "dodani-erp",
    "slug": "dodani-erp",
    "title": "Dodani ERP",
    "url": "https://dodanierp.internal",
    "category": "Brokerage Back-Office & Escrow ERP",
    "at_home_page": false,
    "service_month": "August 2023",
    "service_duration_days": 130,
    "technologies": [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "AWS S3",
      "WebSockets"
    ],
    "description": "A specialized back-office enterprise resource planning system tailored for real estate brokerages and escrow coordinators. Teams oversee lead conversions, earnest money deposits, title commitments, shared water well agreements, and multi-party deal communication.",
    "images": [
      "assets/about-office-showcase.png",
      "assets/contact-hero-workspace.png",
      "assets/about-office.jpg"
    ]
  },
  {
    "id": "arizona-land-investors",
    "slug": "arizona-land-investors",
    "title": "Arizona Land Investors",
    "url": "https://arizonalandinvestors.com",
    "category": "Private Land Syndication & Capital",
    "at_home_page": false,
    "service_month": "July 2023",
    "service_duration_days": 75,
    "technologies": [
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Stripe",
      "Zoom API",
      "AWS Cloud",
      "Tailwind CSS"
    ],
    "description": "A private land-investment syndication platform tailored for accredited investors, property owners, and commercial developers. Features strategic land acquisition portfolios, an annual investor summit registration pipeline, and an authenticated investor console.",
    "images": [
      "assets/contact-hero-workspace.png",
      "assets/hero-building.jpg",
      "assets/about-office-mockup.jpg"
    ]
  },
  {
    "id": "micro-matching",
    "slug": "micro-matching",
    "title": "Micro Matching",
    "url": "https://micromatching.io",
    "category": "Influencer Marketing & AdTech",
    "at_home_page": false,
    "service_month": "June 2023",
    "service_duration_days": 105,
    "technologies": [
      "React",
      "Python",
      "Django REST",
      "Stripe Connect",
      "Redis",
      "PostgreSQL",
      "AWS S3"
    ],
    "description": "An administrative command center and operations marketplace connecting consumer brands with vetted micro-influencers. Platform administrators review creator media kits, approve sponsored campaign packages, verify KYC documentation, and settle payments securely via Stripe.",
    "images": [
      "assets/cta-collaboration.jpg",
      "assets/portfolio-hero-showcase.png",
      "assets/case-fitness-app.jpg"
    ]
  }
];

  // Validation function enforcing all 9 required fields
  function validateProject(data) {
    const errors = [];

    // 1. Project Title (Required)
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      errors.push('Field 1 (Project Title): Title is required and cannot be empty.');
    }

    // 2. Project URL (Required)
    if (!data.url || typeof data.url !== 'string' || !data.url.trim()) {
      errors.push('Field 2 (Project URL): Live project URL is required.');
    } else {
      const urlPattern = /^(https?:\/\/|\/|#)[^\s]+$/i;
      if (!urlPattern.test(data.url.trim())) {
        errors.push('Field 2 (Project URL): Must be a valid URL starting with http://, https://, or /');
      }
    }

    // 3. Project Category (Required)
    if (!data.category || typeof data.category !== 'string' || !data.category.trim()) {
      errors.push('Field 3 (Project Category): Category is required.');
    }

    // 4. Project At Home Page (Required)
    if (typeof data.at_home_page !== 'boolean') {
      if (data.at_home_page === 'true' || data.at_home_page === 'Yes' || data.at_home_page === 'yes') {
        data.at_home_page = true;
      } else if (data.at_home_page === 'false' || data.at_home_page === 'No' || data.at_home_page === 'no') {
        data.at_home_page = false;
      } else {
        errors.push('Field 4 (Project At Home Page): Must be a Yes/No boolean indicator.');
      }
    }

    // 5. Service Month (Required)
    if (!data.service_month || typeof data.service_month !== 'string' || !data.service_month.trim()) {
      errors.push('Field 5 (Service Month): Month and year of service is required.');
    }

    // 6. Service Duration (in days) (Required)
    const duration = parseInt(data.service_duration_days, 10);
    if (isNaN(duration) || duration <= 0) {
      errors.push('Field 6 (Service Duration): Total service duration in days must be a positive number.');
    } else {
      data.service_duration_days = duration;
    }

    // 7. Project Technologies (Required)
    if (!Array.isArray(data.technologies) || data.technologies.length === 0) {
      errors.push('Field 7 (Project Technologies): At least one technology tag is required.');
    } else {
      data.technologies = data.technologies.map(t => String(t).trim()).filter(Boolean);
      if (data.technologies.length === 0) {
        errors.push('Field 7 (Project Technologies): Technology list cannot be empty.');
      }
    }

    // 8. Project Description (Required)
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 15) {
      errors.push('Field 8 (Project Description): A detailed project description of at least 15 characters is required.');
    }

    // 9. Project Images (Required)
    if (!Array.isArray(data.images) || data.images.length === 0) {
      errors.push('Field 9 (Project Images): At least one project image is required.');
    } else {
      data.images = data.images.filter(img => img && typeof img === 'string' && img.trim().length > 0);
      if (data.images.length === 0) {
        errors.push('Field 9 (Project Images): Project image list cannot be empty.');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  function generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  const ProjectDB = {
    _cache: null,

    // Resolve relative path for assets depending on caller location
    resolveAssetPath: function (path, relativeLevel = 0) {
      if (!path) return '';
      if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
      }
      const cleanPath = path.replace(/^(\.\.\/)+/, '');
      if (relativeLevel === 2) {
        return '../../' + cleanPath;
      } else if (relativeLevel === 1) {
        return '../' + cleanPath;
      }
      return cleanPath;
    },

    // Initialize Database with fallback hierarchy:
    // 1. API endpoint (if server running over http/https)
    // 2. localStorage (if previously modified)
    // 3. Embedded DEFAULT_PROJECTS (ensures 100% reliable offline/file:// operation)
    init: async function (basePath = '') {
      if (this._cache && this._cache.length > 0) {
        return this._cache;
      }

      // 1. Check if backend API responds (only if running over http/https)
      if (window.location && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
        try {
          const response = await fetch(API_ENDPOINT, { method: 'GET', headers: { 'Accept': 'application/json' } });
          if (response.ok) {
            const apiData = await response.json();
            if (Array.isArray(apiData) && apiData.length > 0) {
              this._cache = apiData;
              try { localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData)); } catch (e) {}
              return this._cache;
            }
          }
        } catch (err) {
          // Backend offline, fallback to local storage
        }
      }

      // 2. Check localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this._cache = parsed;
            return this._cache;
          }
        }
      } catch (err) {
        console.warn('localStorage read error:', err);
      }

      // 3. Use embedded default seed data
      this._cache = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
      } catch (e) {}

      return this._cache;
    },

    // Fetch all projects dynamically
    getAll: async function (basePath = '') {
      await this.init(basePath);
      return JSON.parse(JSON.stringify(this._cache || []));
    },

    // Fetch single project by ID or slug
    getById: async function (idOrSlug, basePath = '') {
      await this.init(basePath);
      if (!idOrSlug) return null;
      const target = String(idOrSlug).toLowerCase().trim();
      const project = (this._cache || []).find(p => 
        (p.id && String(p.id).toLowerCase() === target) ||
        (p.slug && String(p.slug).toLowerCase() === target)
      );
      return project ? JSON.parse(JSON.stringify(project)) : null;
    },

    // Fetch only projects marked "Project At Home Page: Yes"
    getFeaturedHomepage: async function (basePath = '') {
      const all = await this.getAll(basePath);
      return all.filter(p => p.at_home_page === true || p.at_home_page === 'Yes' || p.at_home_page === 'true');
    },

    // Save project (Create or Update) with complete 9-field validation
    save: async function (projectData) {
      const validation = validateProject(projectData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('\n'));
      }

      // Ensure slug and id
      if (!projectData.id && !projectData.slug) {
        projectData.slug = generateSlug(projectData.title);
        projectData.id = projectData.slug;
      } else if (!projectData.slug) {
        projectData.slug = generateSlug(projectData.id || projectData.title);
      } else if (!projectData.id) {
        projectData.id = projectData.slug;
      }

      await this.init();

      // Check if updating existing
      const existingIdx = this._cache.findIndex(p => p.id === projectData.id || p.slug === projectData.slug);

      if (existingIdx >= 0) {
        this._cache[existingIdx] = { ...this._cache[existingIdx], ...projectData };
      } else {
        this._cache.unshift(projectData);
      }

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }

      // Backend API sync if available
      if (window.location && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
        try {
          const method = existingIdx >= 0 ? 'PUT' : 'POST';
          const url = existingIdx >= 0 ? `${API_ENDPOINT}/${encodeURIComponent(projectData.id)}` : API_ENDPOINT;
          await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
          });
        } catch (e) {}
      }

      this._dispatchChangeEvent();
      return JSON.parse(JSON.stringify(projectData));
    },

    // Delete project
    delete: async function (idOrSlug) {
      await this.init();
      const target = String(idOrSlug).toLowerCase().trim();
      const initialLen = this._cache.length;
      this._cache = this._cache.filter(p => 
        String(p.id).toLowerCase() !== target && String(p.slug).toLowerCase() !== target
      );

      if (this._cache.length !== initialLen) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
        } catch (e) {}

        if (window.location && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
          try {
            await fetch(`${API_ENDPOINT}/${encodeURIComponent(idOrSlug)}`, { method: 'DELETE' });
          } catch (e) {}
        }

        this._dispatchChangeEvent();
        return true;
      }
      return false;
    },

    // Reset database to initial seed
    resetDefaults: async function (basePath = '') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      this._cache = null;
      return await this.init(basePath);
    },

    _dispatchChangeEvent: function () {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('baadam:projects-updated', { detail: { timestamp: Date.now() } }));
      }
    }
  };

  // Expose globally
  window.ProjectDB = ProjectDB;
  window.validateProject = validateProject;

})(typeof window !== 'undefined' ? window : globalThis);
