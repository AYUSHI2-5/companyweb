import re

# 1. Update style.css
with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

pattern = r'/\* =====================================================================\s*Services Showcase Section.*'

new_services_css = """/* =====================================================================
   Services Showcase Section (Reference Red & White 3x2 Grid)
   ===================================================================== */
.services-showcase-section {
  padding-top: calc(var(--header-height, 80px) + clamp(48px, 6vh, 76px));
  padding-bottom: clamp(70px, 9vh, 110px);
  background: #f7f9fc;
  position: relative;
}

.services-showcase-section .section-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 clamp(20px, 2.5vw, 36px) 0 clamp(165px, 13vw, 215px);
}

.services-showcase-header {
  text-align: center;
  max-width: 820px;
  margin: 0 auto clamp(36px, 5vh, 52px);
  padding: 0 16px;
}

.services-showcase-title {
  font-family: var(--font-display, inherit);
  font-size: clamp(34px, 4vw, 44px);
  font-weight: 800;
  color: #0b1528;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 16px;
}

.services-showcase-subtitle {
  font-size: clamp(14px, 1.05vw, 15.5px);
  line-height: 1.7;
  color: #556270;
  margin: 0 auto 16px;
  max-width: 760px;
}

.services-accent-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 14px;
}

.services-accent-svg {
  display: block;
}

.services-showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(20px, 2vw, 30px);
  align-items: stretch;
}

.service-showcase-card {
  background: #ffffff;
  border-radius: 20px;
  padding: clamp(32px, 3.2vw, 42px) clamp(20px, 2vw, 28px) clamp(30px, 3vw, 38px);
  text-align: center;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
  position: relative;
}

.service-showcase-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(235, 22, 60, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04);
  border-color: rgba(235, 22, 60, 0.25);
}

.service-badge-wrap {
  position: relative;
  width: 82px;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.service-badge-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #fff0f2;
  box-shadow: 0 4px 16px rgba(235, 22, 60, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-badge-dot-1 {
  position: absolute;
  top: 5px;
  left: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #eb163c;
}

.service-badge-dot-2 {
  position: absolute;
  bottom: 6px;
  right: 8px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #eb163c;
}

.service-card-icon {
  display: block;
}

.service-card-title {
  font-family: var(--font-display, inherit);
  font-size: clamp(19px, 1.45vw, 22px);
  font-weight: 700;
  color: #eb163c;
  line-height: 1.3;
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}

.service-card-text {
  font-size: clamp(13px, 0.92vw, 14.5px);
  line-height: 1.68;
  color: #64748b;
  margin: 0;
  flex-grow: 1;
}

@media (max-width: 1024px) {
  .services-showcase-section .section-container {
    padding-left: clamp(20px, 3vw, 32px);
    padding-right: clamp(20px, 3vw, 32px);
  }
  .services-showcase-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 22px;
  }
}

@media (max-width: 680px) {
  .services-showcase-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .service-showcase-card {
    padding: 30px 20px;
  }
}
"""

new_css, count = re.subn(pattern, new_services_css.strip(), css, flags=re.DOTALL)
if count > 0:
    with open(r'c:\Users\Admin\Desktop\Baadam.com\style.css', 'w', encoding='utf-8') as f:
        f.write(new_css)
    print("Updated style.css successfully.")
else:
    print("Pattern in style.css not matched.")

# 2. Update services.html with id="services-section"
with open(r'c:\Users\Admin\Desktop\Baadam.com\services.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<section class="services-showcase-section" aria-labelledby="services-main-heading">', '<section class="services-showcase-section" id="services-section" aria-labelledby="services-main-heading">')
with open(r'c:\Users\Admin\Desktop\Baadam.com\services.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated services.html section id successfully.")

