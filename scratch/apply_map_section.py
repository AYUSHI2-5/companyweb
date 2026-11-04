import re

# 1. Update contact.html with Google Maps Section
map_section_html = """    <!-- Studio Location & Interactive Map Section -->
    <section class="contact-map-section" id="location-map" aria-label="Studio Location Map">
      <div class="section-container">
        <div class="map-section-header scroll-reveal">
          <div class="kicker-capsule">
            <i class="radar-dot" aria-hidden="true"></i>
            <span>Visit Our Studio</span>
          </div>
          <h2 class="section-heading">Find Us in <span class="text-brand-red">Ahmedabad</span></h2>
          <p class="section-description">
            612, J B Tower, Opp Doordarshan Kendra, Thaltej, Ahmedabad, Gujarat 380054 &middot; We welcome you to visit our studio and discuss your technology roadmap in person.
          </p>
        </div>

        <div class="contact-map-frame-wrap scroll-reveal">
          <!-- Floating Location Card Overlay (Matching user reference layout) -->
          <div class="map-location-card">
            <div class="map-card-badge">Headquarters</div>
            <h3 class="map-card-name">Baadam Info &amp; Tradelink Services Pvt Ltd</h3>
            <p class="map-card-address">
              612, J B Tower, Opp Doordarshan kendra, Thaltej, Nilmani Society, Thaltej, Ahmedabad, Gujarat 380054
            </p>
            <div class="map-card-rating">
              <span class="map-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span class="map-rating-score">4.4</span>
              <span class="map-rating-count">(16 reviews)</span>
            </div>
            <div class="map-card-actions">
              <a href="https://www.google.com/maps/place/Baadam+Info+%26+Tradelink+Services+Pvt+Ltd/@23.0486875,72.5238526,17z/data=!3m1!4b1!4m6!3m5!1s0x395e84ac5389f235:0xde46c04eac5ddaeb!8m2!3d23.0486875!4d72.5238526!16s%2Fg%2F11d_2fghtx?entry=ttu" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="btn-map-open">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                <span>Open in Maps</span>
              </a>
              <a href="https://www.google.com/maps/dir//Baadam+Info+%26+Tradelink+Services+Pvt+Ltd/@23.0486875,72.5238526,17z" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 class="btn-map-directions" 
                 aria-label="Get Directions">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              </a>
            </div>
          </div>

          <!-- Google Maps Responsive Iframe with exact coordinates -->
          <iframe 
            class="contact-map-iframe"
            src="https://maps.google.com/maps?q=23.0486875,72.5238526+(Baadam+Info+%26+Tradelink+Services+Pvt+Ltd)&t=&z=17&ie=UTF8&iwloc=B&output=embed" 
            width="100%" 
            height="480" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            title="Baadam Info &amp; Tradelink Services Office Location in Thaltej Ahmedabad">
          </iframe>
        </div>
      </div>
    </section>
  </main>"""

with open(r'c:\Users\Admin\Desktop\Baadam.com\contact.html', 'r', encoding='utf-8') as f:
    c_html = f.read()

# Replace the closing </main>
if '</main>' in c_html:
    c_html = c_html.replace('  </main>', map_section_html)
    # Also update HQ address card text
    c_html = c_html.replace('Ahmedabad, Gujarat, India.<br>\n                  Monday &ndash; Saturday &middot; 9:30 AM &ndash; 6:30 PM IST', 
                            '612, J B Tower, Opp Doordarshan Kendra, Thaltej, Ahmedabad, Gujarat 380054.<br>\n                  Monday &ndash; Saturday &middot; 9:30 AM &ndash; 6:30 PM IST')
    # Update cache buster
    c_html = c_html.replace('style.css?v=5', 'style.css?v=6')
    with open(r'c:\Users\Admin\Desktop\Baadam.com\contact.html', 'w', encoding='utf-8') as f:
        f.write(c_html)
    print("Updated contact.html with Google Maps section.")
else:
    print("Could not find </main> in contact.html!")

# 2. Add Map CSS to style.css
css_map_addon = """
/* =====================================================================
   Studio Location Interactive Map Section
   ===================================================================== */
.contact-map-section {
  padding: 40px 0 90px;
  background: #ffffff;
  position: relative;
}

.map-section-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 36px;
  padding: 0 16px;
}

.contact-map-frame-wrap {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.03);
  border: 1.5px solid rgba(226, 232, 240, 0.9);
  background: #f1f5f9;
}

.contact-map-iframe {
  display: block;
  width: 100%;
  height: 480px;
  border: none;
}

.map-location-card {
  position: absolute;
  top: 24px;
  left: 24px;
  max-width: 350px;
  background: rgba(255, 255, 255, 0.96);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 18px;
  padding: 20px 22px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04);
  z-index: 5;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.map-location-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.16);
}

.map-card-badge {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(231, 25, 45, 0.08);
  border: 1px solid rgba(231, 25, 45, 0.18);
  color: #E7192D;
  font-family: var(--font-mono, monospace);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: var(--radius-pill);
  margin-bottom: 8px;
}

.map-card-name {
  font-family: var(--font-display, inherit);
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
  margin-bottom: 6px;
}

.map-card-address {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 12px;
}

.map-card-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  font-size: 0.82rem;
}

.map-stars {
  color: #f59e0b;
  letter-spacing: 1px;
}

.map-rating-score {
  font-weight: 700;
  color: #1e293b;
}

.map-rating-count {
  color: #64748b;
  font-size: 0.78rem;
}

.map-card-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-map-open {
  flex-grow: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1a73e8;
  color: #ffffff;
  padding: 9px 16px;
  border-radius: 10px;
  font-family: var(--font-sans, inherit);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
}

.btn-map-open:hover {
  background: #1557b0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.4);
}

.btn-map-directions {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #1a73e8;
  display: grid;
  place-items: center;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-map-directions:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
  transform: translateY(-1px);
}

@media (max-width: 680px) {
  .map-location-card {
    position: static;
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
    border: none;
    border-bottom: 1px solid #e2e8f0;
  }
  .contact-map-iframe {
    height: 350px;
  }
}
"""

with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

if 'Studio Location Interactive Map Section' not in css:
    with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'a', encoding='utf-8') as f:
        f.write(css_map_addon)
    print("Appended Map CSS to style.css.")
else:
    print("Map CSS already in style.css.")

