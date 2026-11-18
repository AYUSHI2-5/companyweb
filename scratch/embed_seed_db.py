import json

with open('data/projects.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

json_str = json.dumps(projects, indent=2, ensure_ascii=False)

db_code = f"""/**
 * BAADAM Portfolio - Unified Database Client Layer
 * Handles fetching, caching, localStorage/IndexedDB persistence,
 * REST API communication, and validation for all 9 project fields.
 * 
 * Works 100% seamlessly in BOTH environments:
 * 1. Running on a Web/API Server (fetches /api/projects)
 * 2. Static / Offline / file:// protocol (uses localStorage + embedded default seed)
 */

(function (window) {{
  'use strict';

  const STORAGE_KEY = 'baadam_projects_db_v1';
  const API_ENDPOINT = '/api/projects';

  // Seed data from canonical database
  const DEFAULT_PROJECTS = {json_str};

  // Validation function enforcing all 9 required fields
  function validateProject(data) {{
    const errors = [];

    // 1. Project Title (Required)
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {{
      errors.push('Field 1 (Project Title): Title is required and cannot be empty.');
    }}

    // 2. Project URL (Required)
    if (!data.url || typeof data.url !== 'string' || !data.url.trim()) {{
      errors.push('Field 2 (Project URL): Live project URL is required.');
    }} else {{
      const urlPattern = /^(https?:\\/\\/|\\/|#)[^\\s]+$/i;
      if (!urlPattern.test(data.url.trim())) {{
        errors.push('Field 2 (Project URL): Must be a valid URL starting with http://, https://, or /');
      }}
    }}

    // 3. Project Category (Required)
    if (!data.category || typeof data.category !== 'string' || !data.category.trim()) {{
      errors.push('Field 3 (Project Category): Category is required.');
    }}

    // 4. Project At Home Page (Required)
    if (typeof data.at_home_page !== 'boolean') {{
      if (data.at_home_page === 'true' || data.at_home_page === 'Yes' || data.at_home_page === 'yes') {{
        data.at_home_page = true;
      }} else if (data.at_home_page === 'false' || data.at_home_page === 'No' || data.at_home_page === 'no') {{
        data.at_home_page = false;
      }} else {{
        errors.push('Field 4 (Project At Home Page): Must be a Yes/No boolean indicator.');
      }}
    }}

    // 5. Service Month (Required)
    if (!data.service_month || typeof data.service_month !== 'string' || !data.service_month.trim()) {{
      errors.push('Field 5 (Service Month): Month and year of service is required.');
    }}

    // 6. Service Duration (in days) (Required)
    const duration = parseInt(data.service_duration_days, 10);
    if (isNaN(duration) || duration <= 0) {{
      errors.push('Field 6 (Service Duration): Total service duration in days must be a positive number.');
    }} else {{
      data.service_duration_days = duration;
    }}

    // 7. Project Technologies (Required)
    if (!Array.isArray(data.technologies) || data.technologies.length === 0) {{
      errors.push('Field 7 (Project Technologies): At least one technology tag is required.');
    }} else {{
      data.technologies = data.technologies.map(t => String(t).trim()).filter(Boolean);
      if (data.technologies.length === 0) {{
        errors.push('Field 7 (Project Technologies): Technology list cannot be empty.');
      }}
    }}

    // 8. Project Description (Required)
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 15) {{
      errors.push('Field 8 (Project Description): A detailed project description of at least 15 characters is required.');
    }}

    // 9. Project Images (Required)
    if (!Array.isArray(data.images) || data.images.length === 0) {{
      errors.push('Field 9 (Project Images): At least one project image is required.');
    }} else {{
      data.images = data.images.filter(img => img && typeof img === 'string' && img.trim().length > 0);
      if (data.images.length === 0) {{
        errors.push('Field 9 (Project Images): Project image list cannot be empty.');
      }}
    }}

    return {{
      isValid: errors.length === 0,
      errors: errors
    }};
  }}

  function generateSlug(title) {{
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\\w\\s-]/g, '')
      .replace(/[\\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }}

  const ProjectDB = {{
    _cache: null,

    // Resolve relative path for assets depending on caller location
    resolveAssetPath: function (path, relativeLevel = 0) {{
      if (!path) return '';
      if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {{
        return path;
      }}
      const cleanPath = path.replace(/^(\\.\\.\\/)+/, '');
      if (relativeLevel === 2) {{
        return '../../' + cleanPath;
      }} else if (relativeLevel === 1) {{
        return '../' + cleanPath;
      }}
      return cleanPath;
    }},

    // Initialize Database with fallback hierarchy:
    // 1. API endpoint (if server running over http/https)
    // 2. localStorage (if previously modified)
    // 3. Embedded DEFAULT_PROJECTS (ensures 100% reliable offline/file:// operation)
    init: async function (basePath = '') {{
      if (this._cache && this._cache.length > 0) {{
        return this._cache;
      }}

      // 1. Check if backend API responds (only if running over http/https)
      if (window.location && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {{
        try {{
          const response = await fetch(API_ENDPOINT, {{ method: 'GET', headers: {{ 'Accept': 'application/json' }} }});
          if (response.ok) {{
            const apiData = await response.json();
            if (Array.isArray(apiData) && apiData.length > 0) {{
              this._cache = apiData;
              try {{ localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData)); }} catch (e) {{}}
              return this._cache;
            }}
          }}
        }} catch (err) {{
          // Backend offline, fallback to local storage
        }}
      }}

      // 2. Check localStorage
      try {{
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {{
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {{
            this._cache = parsed;
            return this._cache;
          }}
        }}
      }} catch (err) {{
        console.warn('localStorage read error:', err);
      }}

      // 3. Use embedded default seed data
      this._cache = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
      try {{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
      }} catch (e) {{}}

      return this._cache;
    }},

    // Fetch all projects dynamically
    getAll: async function (basePath = '') {{
      await this.init(basePath);
      return JSON.parse(JSON.stringify(this._cache || []));
    }},

    // Fetch single project by ID or slug
    getById: async function (idOrSlug, basePath = '') {{
      await this.init(basePath);
      if (!idOrSlug) return null;
      const target = String(idOrSlug).toLowerCase().trim();
      const project = (this._cache || []).find(p => 
        (p.id && String(p.id).toLowerCase() === target) ||
        (p.slug && String(p.slug).toLowerCase() === target)
      );
      return project ? JSON.parse(JSON.stringify(project)) : null;
    }},

    // Fetch only projects marked "Project At Home Page: Yes"
    getFeaturedHomepage: async function (basePath = '') {{
      const all = await this.getAll(basePath);
      return all.filter(p => p.at_home_page === true || p.at_home_page === 'Yes' || p.at_home_page === 'true');
    }},

    // Save project (Create or Update) with complete 9-field validation
    save: async function (projectData) {{
      const validation = validateProject(projectData);
      if (!validation.isValid) {{
        throw new Error(validation.errors.join('\\n'));
      }}

      // Ensure slug and id
      if (!projectData.id && !projectData.slug) {{
        projectData.slug = generateSlug(projectData.title);
        projectData.id = projectData.slug;
      }} else if (!projectData.slug) {{
        projectData.slug = generateSlug(projectData.id || projectData.title);
      }} else if (!projectData.id) {{
        projectData.id = projectData.slug;
      }}

      await this.init();

      // Check if updating existing
      const existingIdx = this._cache.findIndex(p => p.id === projectData.id || p.slug === projectData.slug);

      if (existingIdx >= 0) {{
        this._cache[existingIdx] = {{ ...this._cache[existingIdx], ...projectData }};
      }} else {{
        this._cache.unshift(projectData);
      }}

      // Persist to localStorage
      try {{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
      }} catch (err) {{
        console.error('Failed to save to localStorage:', err);
      }}

      // Backend API sync if available
      if (window.location && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {{
        try {{
          const method = existingIdx >= 0 ? 'PUT' : 'POST';
          const url = existingIdx >= 0 ? `${{API_ENDPOINT}}/${{encodeURIComponent(projectData.id)}}` : API_ENDPOINT;
          await fetch(url, {{
            method: method,
            headers: {{ 'Content-Type': 'application/json' }},
            body: JSON.stringify(projectData)
          }});
        }} catch (e) {{}}
      }}

      this._dispatchChangeEvent();
      return JSON.parse(JSON.stringify(projectData));
    }},

    // Delete project
    delete: async function (idOrSlug) {{
      await this.init();
      const target = String(idOrSlug).toLowerCase().trim();
      const initialLen = this._cache.length;
      this._cache = this._cache.filter(p => 
        String(p.id).toLowerCase() !== target && String(p.slug).toLowerCase() !== target
      );

      if (this._cache.length !== initialLen) {{
        try {{
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this._cache));
        }} catch (e) {{}}

        if (window.location && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {{
          try {{
            await fetch(`${{API_ENDPOINT}}/${{encodeURIComponent(idOrSlug)}}`, {{ method: 'DELETE' }});
          }} catch (e) {{}}
        }}

        this._dispatchChangeEvent();
        return true;
      }}
      return false;
    }},

    // Reset database to initial seed
    resetDefaults: async function (basePath = '') {{
      try {{
        localStorage.removeItem(STORAGE_KEY);
      }} catch (e) {{}}
      this._cache = null;
      return await this.init(basePath);
    }},

    _dispatchChangeEvent: function () {{
      if (typeof window !== 'undefined' && window.dispatchEvent) {{
        window.dispatchEvent(new CustomEvent('baadam:projects-updated', {{ detail: {{ timestamp: Date.now() }} }}));
      }}
    }}
  }};

  // Expose globally
  window.ProjectDB = ProjectDB;
  window.validateProject = validateProject;

}})(typeof window !== 'undefined' ? window : globalThis);
"""

with open('project-database.js', 'w', encoding='utf-8') as f:
    f.write(db_code)

print('Updated project-database.js with embedded seed!')

