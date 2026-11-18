/**
 * BAADAM CMS - Admin Core Utilities
 * Handles authentication checks, common sidebar navigation, toast notifications,
 * media picker modal, and device preview modal.
 */

// Toast notification helper
function showToast(message, type = 'success') {
  let container = document.getElementById('admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'admin-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>';
  } else {
    iconSvg = '<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>';
  }

  toast.innerHTML = `${iconSvg}<div>${message}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Authentication Check
async function checkAuth() {
  const p = window.location.pathname;
  if (p === '/admin/login' || p === '/admin/login.html' || p.endsWith('/login.html')) {
    return;
  }
  try {
    const res = await fetch('/api/admin/auth/check');
    if (!res.ok) {
      window.location.href = '/admin/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    const data = await res.json();
    if (!data.authenticated && !data.success) {
      window.location.href = '/admin/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    return data.user;
  } catch (err) {
    console.error('Auth verification failed:', err);
    window.location.href = '/admin/login.html?redirect=' + encodeURIComponent(window.location.pathname);
  }
}

// Handle Logout
async function handleLogout() {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
    showToast('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/admin/login.html';
    }, 500);
  } catch (e) {
    window.location.href = '/admin/login.html';
  }
}

// Standard Admin Layout Builder
function setupAdminLayout(options = {}) {
  const { activeNav = '', title = 'Homepage CMS', breadcrumbs = [] } = options;
  
  // Set window title
  document.title = `${title} | BAADAM Admin`;

  const sidebarEl = document.getElementById('admin-sidebar');
  if (sidebarEl) {
    sidebarEl.innerHTML = `
      <div class="sidebar-header">
        <a href="/admin/dashboard.html" class="sidebar-logo">
          <span class="logo-box">B</span>
          <span>BAADAM CMS</span>
        </a>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-title">Core Management</div>
        <a href="/admin/dashboard.html" class="nav-item ${activeNav === 'dashboard' ? 'active' : ''}">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Dashboard
        </a>
        <a href="/admin/homepage/index.html" class="nav-item ${(['homepage', 'header', 'hero', 'radar', 'services', 'featured-work', 'case-studies', 'how-we-work', 'next-steps', 'footer'].includes(activeNav)) ? 'active' : ''}">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
          Homepage Management
        </a>

        <div class="nav-section-title">Pages &amp; Portfolios</div>
        <a href="/admin/projects.html" class="nav-item ${activeNav === 'projects' ? 'active' : ''}">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          Portfolio Projects Manager
        </a>
        <a href="/admin/services.html" class="nav-item ${activeNav === 'services-page' ? 'active' : ''}">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Services Management
        </a>
        <a href="/admin/about.html" class="nav-item ${activeNav === 'about' ? 'active' : ''}">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
          About Us Management
        </a>

        <div class="nav-section-title">External</div>
        <a href="/index.html" target="_blank" class="nav-item">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          View Live Website
        </a>
      </nav>

      <div class="sidebar-user">
        <div class="sidebar-user-avatar">A</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">Administrator</div>
          <div class="sidebar-user-email">admin@baadam.com</div>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="handleLogout()" title="Logout" style="padding:6px 8px;">
          <svg style="width:16px; height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    `;
  }

  // Render topbar if topbar container exists
  const topbarEl = document.getElementById('admin-topbar');
  if (topbarEl) {
    const breadcrumbsHtml = breadcrumbs.map((bc, idx) => {
      if (idx === breadcrumbs.length - 1) {
        return `<span>${bc.label}</span>`;
      }
      return `<a href="${bc.url}">${bc.label}</a> / `;
    }).join('');

    topbarEl.innerHTML = `
      <div>
        <div class="breadcrumbs" style="margin-bottom: 2px;">
          ${breadcrumbsHtml}
        </div>
        <h1 class="page-title" style="margin:0; font-size:20px;">${title}</h1>
      </div>
      <div class="topbar-actions" id="topbar-actions-slot">
        <!-- Section specific actions inserted here -->
      </div>
    `;
  }
}

// Media Picker Modal
let activeMediaCallback = null;
function openMediaPicker(onSelectCallback) {
  activeMediaCallback = onSelectCallback;
  let modal = document.getElementById('media-picker-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'media-picker-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Select Image Asset</h3>
          <button class="modal-close" onclick="closeMediaPicker()">&times;</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; gap:12px;">
            <input type="text" id="media-picker-search" class="form-control" placeholder="Search images by name or alt text..." style="max-width:320px;" oninput="filterMediaPicker()">
            <label class="btn btn-sm btn-primary" style="cursor:pointer; margin-bottom:0;">
              <svg style="width:16px; height:16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Upload New Image
              <input type="file" id="media-picker-file" style="display:none;" accept="image/*" onchange="uploadFromMediaPicker(this)">
            </label>
          </div>
          <div id="media-picker-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:12px; max-height:420px; overflow-y:auto; padding:4px;">
            <div style="text-align:center; padding:30px; color:#6B7280; grid-column:1/-1;">Loading media items...</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeMediaPicker()">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal.classList.add('active');
  loadMediaPickerItems();
}

function closeMediaPicker() {
  const modal = document.getElementById('media-picker-modal');
  if (modal) modal.classList.remove('active');
  activeMediaCallback = null;
}

let cachedMediaItems = [];
async function loadMediaPickerItems() {
  const grid = document.getElementById('media-picker-grid');
  try {
    const res = await fetch('/api/admin/media');
    const data = await res.json();
    cachedMediaItems = data.items || [];
    renderMediaPickerGrid(cachedMediaItems);
  } catch (err) {
    if (grid) grid.innerHTML = `<div style="color:#E7192D; grid-column:1/-1;">Failed to load media items.</div>`;
  }
}

function renderMediaPickerGrid(items) {
  const grid = document.getElementById('media-picker-grid');
  if (!grid) return;
  if (!items.length) {
    grid.innerHTML = `<div style="text-align:center; padding:30px; color:#6B7280; grid-column:1/-1;">No media files found. Upload one to get started.</div>`;
    return;
  }
  grid.innerHTML = items.map(item => `
    <div class="media-picker-item" onclick="selectMediaItem('${item.url}')" style="cursor:pointer; border:1px solid #E5E7EB; border-radius:8px; overflow:hidden; background:#F8FAFC; transition:all 0.15s ease;">
      <div style="width:100%; height:90px; background:#fff; display:flex; align-items:center; justify-content:center; overflow:hidden;">
        <img src="${item.url}" alt="${item.alt || ''}" style="max-width:100%; max-height:100%; object-fit:contain;">
      </div>
      <div style="padding:6px 8px; font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#374151;" title="${item.filename}">
        ${item.filename}
      </div>
    </div>
  `).join('');
}

function filterMediaPicker() {
  const val = (document.getElementById('media-picker-search')?.value || '').toLowerCase();
  const filtered = cachedMediaItems.filter(i => (i.filename || '').toLowerCase().includes(val) || (i.alt || '').toLowerCase().includes(val));
  renderMediaPickerGrid(filtered);
}

function selectMediaItem(url) {
  if (activeMediaCallback) {
    activeMediaCallback(url);
  }
  closeMediaPicker();
}

async function uploadFromMediaPicker(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('alt', file.name);

  showToast('Uploading image...', 'info');
  try {
    const res = await fetch('/api/admin/media/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success && data.item) {
      showToast('Image uploaded successfully');
      loadMediaPickerItems();
    } else {
      showToast(data.error || 'Upload failed', 'error');
    }
  } catch (err) {
    showToast('Upload error: ' + err.message, 'error');
  }
  input.value = '';
}

// Device Preview Modal
function openPreviewModal(sectionAnchor = '') {
  let modal = document.getElementById('preview-device-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'preview-device-modal';
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal-dialog preview-dialog" style="max-width:1400px; width:95vw; height:92vh; display:flex; flex-direction:column;">
        <div class="modal-header" style="flex-shrink:0;">
          <div style="display:flex; align-items:center; gap:12px;">
            <h3 class="modal-title">Live Preview</h3>
            <div class="device-switcher" style="display:inline-flex; background:#E5E7EB; padding:3px; border-radius:6px;">
              <button class="btn btn-sm" id="btn-device-desktop" onclick="setPreviewSize('100%')" style="border-radius:4px; padding:4px 10px; background:#fff; font-weight:600;">Desktop (100%)</button>
              <button class="btn btn-sm" id="btn-device-tablet" onclick="setPreviewSize('768px')" style="border-radius:4px; padding:4px 10px; background:transparent;">Tablet (768px)</button>
              <button class="btn btn-sm" id="btn-device-mobile" onclick="setPreviewSize('375px')" style="border-radius:4px; padding:4px 10px; background:transparent;">Mobile (375px)</button>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <a href="/index.html${sectionAnchor ? '#' + sectionAnchor : ''}" target="_blank" class="btn btn-sm btn-secondary">Open New Tab</a>
            <button class="modal-close" onclick="closePreviewModal()">&times;</button>
          </div>
        </div>
        <div class="modal-body" style="flex:1; background:#111827; display:flex; justify-content:center; align-items:center; overflow:hidden; padding:16px;">
          <iframe id="preview-iframe" src="/index.html${sectionAnchor ? '#' + sectionAnchor : ''}" style="width:100%; height:100%; border:none; background:#fff; border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.5); transition:width 0.3s ease;"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    const iframe = document.getElementById('preview-iframe');
    if (iframe) iframe.src = `/index.html${sectionAnchor ? '#' + sectionAnchor : ''}`;
  }

  modal.classList.add('active');
}

function closePreviewModal() {
  const modal = document.getElementById('preview-device-modal');
  if (modal) modal.classList.remove('active');
}

function setPreviewSize(width) {
  const iframe = document.getElementById('preview-iframe');
  if (!iframe) return;
  iframe.style.width = width;
  ['desktop', 'tablet', 'mobile'].forEach(dev => {
    const btn = document.getElementById(`btn-device-${dev}`);
    if (btn) {
      if ((dev === 'desktop' && width === '100%') ||
          (dev === 'tablet' && width === '768px') ||
          (dev === 'mobile' && width === '375px')) {
        btn.style.background = '#fff';
        btn.style.fontWeight = '600';
      } else {
        btn.style.background = 'transparent';
        btn.style.fontWeight = 'normal';
      }
    }
  });
}

// Bind image preview triggers
function bindImagePickers() {
  document.querySelectorAll('[data-image-picker]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetInputId = button.getAttribute('data-image-picker');
      const targetInput = document.getElementById(targetInputId);
      const previewImgId = button.getAttribute('data-image-preview');
      const previewImg = previewImgId ? document.getElementById(previewImgId) : null;

      openMediaPicker((selectedUrl) => {
        if (targetInput) {
          targetInput.value = selectedUrl;
          targetInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (previewImg) {
          previewImg.src = selectedUrl;
        }
      });
    });
  });
}

// Auto-run auth verification
checkAuth();
