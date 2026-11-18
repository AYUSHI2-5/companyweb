with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

for c in ['footer-top', 'footer-brand', 'footer-links-grid', 'footer-links-col', 'footer-grid', 'footer-col-brand']:
    print(f".{c}: {'FOUND' if f'.{c}' in text else 'NOT FOUND'}")

