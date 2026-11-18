# 1. Append Map CSS to style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

map_css = '''
/* =====================================================================
   Studio Location Interactive Map Section
   ===================================================================== */
.contact-map-section {
  padding: 60px 0 100px;
  background: #ffffff;
  position: relative;
}

.contact-map-section .section-container {
  max-width: var(--container-max-width, 1280px);
  margin: 0 auto;
  padding: 0 clamp(20px, 3vw, 40px);
}

.map-section-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 36px;
  padding: 0 16px;
}

.map-section-header .kicker-capsule {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(231, 25, 45, 0.06);
  border: 1px solid rgba(231, 25, 45, 0.2);
  padding: 5px 14px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono, monospace);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #111827;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.map-section-header .section-heading {
  font-family: var(--font-display, inherit);
  font-size: clamp(2rem, 3.2vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
  line-height: 1.2;
  margin-bottom: 12px;
}

.map-section-header .section-description {
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  color: #64748b;
  line-height: 1.6;
}

.contact-map-frame-wrap {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.08), 0 2px 8px rgba(15, 23, 42, 0.04);
  border: 1.5px solid rgba(226, 232, 240, 0.9);
  background: #f1f5f9;
}

.contact-map-iframe {
  display: block;
  width: 100%;
  height: 500px;
  border: none;
}

.map-location-card {
  position: absolute;
  top: 24px;
  left: 24px;
  max-width: 360px;
  background: rgba(255, 255, 255, 0.96);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 18px;
  padding: 22px 24px;
  box-shadow: 0 14px 36px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.04);
  z-index: 5;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.map-location-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.16);
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
  line-height: 1.35;
  margin-bottom: 6px;
}

.map-card-address {
  font-size: 0.82rem;
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
  background: #E7192D;
  color: #ffffff !important;
  padding: 10px 18px;
  border-radius: 10px;
  font-family: var(--font-sans, inherit);
  font-size: 0.84rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(231, 25, 45, 0.28);
}

.btn-map-open:hover {
  background: #C81E2E;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(231, 25, 45, 0.38);
}

.btn-map-directions {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #E7192D;
  display: grid;
  place-items: center;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.btn-map-directions:hover {
  background: rgba(231, 25, 45, 0.05);
  border-color: #E7192D;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .map-location-card {
    position: static;
    max-width: 100%;
    border-radius: 0;
    box-shadow: none;
    border: none;
    border-bottom: 1px solid #e2e8f0;
  }
  .contact-map-iframe {
    height: 380px;
  }
}
'''.strip()

if 'Studio Location Interactive Map Section' not in css:
    css = css + '\n\n' + map_css + '\n'
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print('Added Map CSS to style.css')
else:
    print('Map CSS already exists')

# 2. Update contact.html subtitle
with open('contact.html', 'r', encoding='utf-8') as f:
    html = f.read()

target_desc = '612, J B Tower, Opp Doordarshan Kendra, Thaltej, Ahmedabad, Gujarat 380054 &middot; We welcome you to visit our studio and discuss your technology roadmap in person.'
repl_desc = 'We welcome you to visit our development studio and discuss your digital transformation roadmap in person.'

if target_desc in html:
    html = html.replace(target_desc, repl_desc)
    with open('contact.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Cleaned duplicated address subtitle in contact.html')
else:
    print('target_desc not found in contact.html')

