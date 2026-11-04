with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

target = "  .contact-form-wrap {"
replacement = """  .hero-lens-circle {
    width: min(92vw, 56vh);
    padding: 20px 16px;
    border-width: 2.5px;
  }

  .hero-lens-headline {
    font-size: clamp(1.1rem, 4.6vw, 1.35rem);
    margin-bottom: 8px;
  }

  .hero-lime-tag {
    font-size: 0.85em;
    padding: 2px 12px;
    white-space: normal;
  }

  .hero-lens-desc {
    font-size: 0.73rem;
    line-height: 1.35;
    margin-bottom: 10px;
    max-width: 95%;
  }

  .hero-lens-actions {
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .hero-btn-dark,
  .hero-btn-glass {
    width: 100%;
    justify-content: center;
    padding: 7px 12px;
    font-size: 0.78rem;
  }

  .contact-form-wrap {"""

if target in css and '.hero-lens-circle {' not in css[css.find('@media (max-width: 768px)'):]:
    css = css.replace(target, replacement, 1)
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Added responsive hero adjustments to @media (max-width: 768px)")
else:
    print("Already added or target not found")

