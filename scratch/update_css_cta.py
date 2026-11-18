with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

target = """.cta-banner-card .btn-primary-pill {
  background: #ffffff;
  color: var(--brand-red);
  border: 1px solid #ffffff;
}

.cta-banner-card .btn-primary-pill:hover {
  background: #f8fafc;
  color: #b80f20;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}"""

replacement = """.cta-banner-card .btn-primary-pill,
.cta-banner-card .btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  height: 52px;
  padding: 0 10px 0 24px;
  border-radius: var(--radius-pill);
  background: #ffffff;
  color: var(--brand-red);
  border: 1px solid #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal), background var(--transition-fast), color var(--transition-fast);
}

.cta-banner-card .btn-primary-pill:hover,
.cta-banner-card .btn-primary:hover {
  background: #ffffff;
  color: #c41224;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
}

.cta-banner-card .btn-primary-pill .btn-arrow-circle,
.cta-banner-card .btn-primary .btn-arrow,
.cta-banner-card .btn-primary .btn-arrow-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--brand-red);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;
  transition: transform var(--transition-normal), background var(--transition-fast);
}

.cta-banner-card .btn-primary-pill:hover .btn-arrow-circle,
.cta-banner-card .btn-primary:hover .btn-arrow,
.cta-banner-card .btn-primary:hover .btn-arrow-circle {
  background: #c41224;
  transform: translateX(3px) rotate(45deg);
}

.cta-banner-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}"""

is_crlf = '\r\n' in css
css_norm = css.replace('\r\n', '\n')
if target in css_norm:
    css_norm = css_norm.replace(target, replacement)
    if is_crlf:
        css_norm = css_norm.replace('\n', '\r\n')
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css_norm)
    print('Updated style.css successfully!')
else:
    print('Target not found in style.css')

