with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

target = '/* ==========================================================================\n   19. Scroll Reveal Animations'
pos = content.find(target)

new_styles = """/* --------------------------------------------------------------------------
   Contact Page UI Extensions (Pills, Form Fieldsets, FAQs, Sidebar & NDA)
   -------------------------------------------------------------------------- */
.contact-page {
  background-color: #FAFAFA;
}

/* Hide presentation guide avatar on contact page so it never obstructs reading */
.contact-page .teacher-guide-widget {
  display: none !important;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1.25fr 0.85fr;
  gap: 40px;
  align-items: start;
}

.contact-form-wrap {
  background: #FFFFFF;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 24px;
  padding: 44px 40px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.04);
}

.form-header-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.form-required-notice {
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--brand-red);
  letter-spacing: 0.04em;
}

.form-fieldset {
  margin-bottom: 26px;
  padding-bottom: 24px;
  border-bottom: 1px solid #F1F5F9;
}

.form-fieldset:last-of-type {
  border-bottom: none;
  margin-bottom: 16px;
  padding-bottom: 0;
}

.form-fieldset-title {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand-red);
  margin-bottom: 14px;
}

.form-grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 14px;
}

.form-grid-2col:last-child {
  margin-bottom: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #334155;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 13px 16px;
  font-family: var(--font-display);
  font-size: 0.94rem;
  color: #0F172A;
  transition: all var(--transition-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  background: #FFFFFF;
  border-color: var(--brand-red);
  box-shadow: 0 0 0 3px rgba(231, 25, 45, 0.12);
  outline: none;
}

/* Interactive Service Pills (Multi-Select Group) */
.service-pills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.service-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  color: #334155;
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.service-pill .pill-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #CBD5E1;
  color: #FFFFFF;
  font-size: 0.65rem;
  font-weight: 800;
  transition: all var(--transition-fast);
}

.service-pill:hover {
  background: #FFFFFF;
  border-color: var(--brand-red);
  color: var(--brand-red);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 25, 45, 0.1);
}

.service-pill.is-active {
  background: rgba(231, 25, 45, 0.08);
  border-color: var(--brand-red);
  color: var(--brand-red);
  box-shadow: 0 4px 14px rgba(231, 25, 45, 0.14);
}

.service-pill.is-active .pill-check {
  background: var(--brand-red);
  color: #FFFFFF;
}

/* Custom NDA Checkbox */
.form-checkbox-group {
  margin-top: 14px;
}

.custom-checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.custom-checkbox-box {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid #CBD5E1;
  background: #FFFFFF;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: all var(--transition-fast);
}

.custom-checkbox-input:checked + .custom-checkbox-box {
  background: var(--brand-red);
  border-color: var(--brand-red);
}

.custom-checkbox-input:checked + .custom-checkbox-box::after {
  content: '✓';
  color: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 800;
}

.custom-checkbox-text {
  font-size: 0.88rem;
  color: #475569;
  line-height: 1.5;
}

.custom-checkbox-text strong {
  color: #0F172A;
}

/* Submit Button */
.btn-submit-project {
  width: 100%;
  justify-content: center;
  padding: 14px 32px;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: var(--radius-pill);
  box-shadow: 0 6px 22px rgba(231, 25, 45, 0.32);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.btn-submit-project:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(231, 25, 45, 0.45);
}

/* Contact Sidebar */
.contact-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-info-card {
  background: #FFFFFF;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  padding: 26px 28px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.03);
  transition: all var(--transition-fast);
}

.contact-info-card:hover {
  border-color: rgba(231, 25, 45, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(231, 25, 45, 0.07);
}

.contact-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(231, 25, 45, 0.08);
  color: var(--brand-red);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-card-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 6px;
}

.contact-card-text {
  font-size: 0.92rem;
  color: #475569;
  line-height: 1.55;
  margin: 0;
}

.contact-card-badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: #059669;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 3px 12px;
  border-radius: var(--radius-pill);
  margin-top: 10px;
}

.contact-card-highlight {
  border-color: rgba(231, 25, 45, 0.25) !important;
  background: linear-gradient(145deg, rgba(231, 25, 45, 0.015) 0%, #FFFFFF 100%) !important;
}

.btn-discovery-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: var(--brand-red);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.btn-discovery-link:hover {
  color: var(--brand-red-hover);
  transform: translateX(3px);
}

/* Frequently Asked Questions (FAQ) Accordion */
.contact-faq-wrap {
  margin-top: 6px;
  background: #FFFFFF;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.03);
}

.contact-faq-heading {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 18px;
}

.contact-faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-faq-item {
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  overflow: hidden;
  background: #F8FAFC;
  transition: all var(--transition-fast);
}

.contact-faq-item.is-open {
  background: #FFFFFF;
  border-color: rgba(231, 25, 45, 0.35);
  box-shadow: 0 4px 16px rgba(231, 25, 45, 0.06);
}

.contact-faq-btn {
  width: 100%;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 700;
  color: #0F172A;
  transition: color var(--transition-fast);
}

.contact-faq-btn:hover {
  color: var(--brand-red);
}

.contact-faq-btn .faq-icon {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--brand-red);
  line-height: 1;
}

.contact-faq-panel {
  padding: 0 18px 14px;
  display: none;
}

.contact-faq-item.is-open .contact-faq-panel {
  display: block;
}

.contact-faq-panel p {
  margin: 0;
  font-size: 0.90rem;
  color: #64748B;
  line-height: 1.6;
}

/* Responsive Layout */
@media (max-width: 992px) {
  .contact-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .form-grid-2col {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .contact-form-wrap {
    padding: 28px 20px;
  }
  .service-pill {
    width: 100%;
    justify-content: flex-start;
  }
}

"""

if target in content and '.service-pill' not in content:
    content = content[:pos] + new_styles + content[pos:]
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Contact styles inserted successfully!")
else:
    print("Already inserted or target not found.")

opens = content.count('{')
closes = content.count('}')
print(f"Brace check: {opens} open, {closes} close, delta: {opens - closes}")

