with open('style.css', 'r', encoding='utf-8') as f:
    content = f.read()

target = '.portfolio-grid {'
pos = content.find(target)

new_styles = """/* Portfolio Category-Wise Section Grouping */
.portfolio-category-section {
  margin-bottom: 72px;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.portfolio-category-section:last-child {
  margin-bottom: 0;
}

.portfolio-category-section.is-hidden {
  opacity: 0;
  transform: translateY(10px);
}

.category-section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 2px solid #F1F5F9;
  padding-bottom: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.category-header-text {
  max-width: 780px;
}

.category-heading {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.4vw, 2.1rem);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.025em;
  margin-top: 8px;
  margin-bottom: 6px;
}

.category-sub {
  font-size: 0.95rem;
  color: #64748B;
  line-height: 1.55;
  margin: 0;
}

.category-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  color: #0F172A;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  white-space: nowrap;
}

.category-count-badge::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-red);
}

"""

if target in content and '.category-section-header' not in content:
    content = content[:pos] + new_styles + content[pos:]
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Category section styles added successfully!")
else:
    print("Already present or target not found.")

opens = content.count('{')
closes = content.count('}')
print(f"Brace check: {opens} open, {closes} close, delta: {opens - closes}")

