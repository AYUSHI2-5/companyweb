cms_css = """
/* --------------------------------------------------------------------------
   CMS Portfolio Field Layout Extensions (Matching CMS Schema)
   -------------------------------------------------------------------------- */
.project-cms-spec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  background: #FFFFFF;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.cms-spec-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cms-spec-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-red);
}

.cms-spec-val {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-pure);
  display: flex;
  align-items: center;
  gap: 6px;
}

.cms-spec-link {
  color: var(--brand-red);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color var(--transition-fast);
}

.cms-spec-link:hover {
  color: var(--brand-red-hover);
}

/* Hashtags Cloud */
.project-hashtags-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.project-hashtag-pill {
  display: inline-block;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  color: #4B5563;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all var(--transition-fast);
}

.project-hashtag-pill:hover {
  background: rgba(231, 25, 45, 0.08);
  border-color: rgba(231, 25, 45, 0.3);
  color: var(--brand-red);
}

/* Action Header Row with Visit Project Button */
.project-header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn-visit-project {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--brand-red);
  color: #FFFFFF;
  padding: 10px 22px;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(231, 25, 45, 0.28);
  transition: all var(--transition-fast);
}

.btn-visit-project:hover {
  background: var(--brand-red-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(231, 25, 45, 0.4);
}

/* Multi-Image Project Gallery */
.project-gallery-section {
  padding: 10px 0 60px;
  background: #FFFFFF;
}

.project-gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.project-gallery-card {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border-subtle);
  background: #F8FAFC;
  height: 320px;
}

.project-gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-smooth);
}

.project-gallery-card:hover .project-gallery-img {
  transform: scale(1.04);
}

.gallery-caption-badge {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #FFFFFF;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: var(--radius-pill);
}

@media (max-width: 768px) {
  .project-gallery-grid {
    grid-template-columns: 1fr;
  }
  .project-gallery-card {
    height: 240px;
  }
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(cms_css)

with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

open_b = text.count('{')
close_b = text.count('}')
print(f"Appended CMS CSS to style.css! Braces: {open_b} open, {close_b} close (delta: {open_b - close_b})")

