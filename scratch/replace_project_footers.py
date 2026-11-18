import os
import re

canonical_footer = '''  <!-- Site Footer -->
  <footer class="site-footer" id="site-footer" role="contentinfo">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-col footer-col-brand">
          <a href="../../index.html" class="logo-link" aria-label="Baadam Home">
            <img src="../../assets/baadam-logo.png" alt="BAADAM Info and Tradelink Services" class="footer-logo-img" width="140" height="38">
          </a>
          <p class="footer-brand-desc">
            Turning bold ideas into scalable digital solutions through strategy, design, and reliable software engineering.
          </p>
          <div class="footer-social-links" aria-label="Social Media Links">
            <a href="https://linkedin.com" class="footer-social-btn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
            <a href="https://instagram.com" class="footer-social-btn" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="mailto:info@baadam.com" class="footer-social-btn" aria-label="Direct Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </div>
        </div>

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

        <div class="footer-col">
          <h3 class="footer-col-title">Core Services</h3>
          <ul class="footer-link-list">
            <li><a href="../../services/website-development/" class="footer-nav-link">Website Development</a></li>
            <li><a href="../../services/application-development/" class="footer-nav-link">Application Development</a></li>
            <li><a href="../../services/digital-marketing/" class="footer-nav-link">Digital Marketing &amp; SEO</a></li>
            <li><a href="../../services.html#ecommerce" class="footer-nav-link">E-Commerce Platforms</a></li>
            <li><a href="../../services.html#software-dev" class="footer-nav-link">Software Engineering</a></li>
            <li><a href="../../services.html#game-dev" class="footer-nav-link">Game Development</a></li>
          </ul>
        </div>

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
  </footer>'''

project_dirs = [d for d in os.listdir('projects') if os.path.isdir(os.path.join('projects', d))]
updated = 0

for pdir in project_dirs:
    pfile = os.path.join('projects', pdir, 'index.html')
    with open(pfile, 'r', encoding='utf-8') as f:
        html = f.read()

    pos_footer_start = html.find('<!-- Site Footer -->')
    if pos_footer_start == -1:
        pos_footer_start = html.find('<footer class="site-footer"')
    
    pos_footer_end = html.find('</footer>') + len('</footer>')

    if pos_footer_start != -1 and pos_footer_end != -1:
        new_html = html[:pos_footer_start] + canonical_footer + html[pos_footer_end:]
        with open(pfile, 'w', encoding='utf-8') as f:
            f.write(new_html)
        updated += 1
        print(f"Updated footer in {pfile}")
    else:
        print(f"FAILED to find footer in {pfile}")

print(f"\nSuccessfully replaced footer in all {updated} project pages!")

