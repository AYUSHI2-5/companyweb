with open('services.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Update card 1
text = re.sub(
    r'(<article class="service-showcase-card[^"]*" id="web-dev">.*?)(<div class="service-card-action">)(\s*<span class="service-action-text">Explore Capability</span>\s*<span class="service-action-arrow">&rarr;</span>\s*)(</div>)',
    r'\1<a href="services/website-development/" class="service-card-action" aria-label="Explore Website Development Capability">\3</a>',
    text,
    flags=re.DOTALL
)

# Update card 2
text = re.sub(
    r'(<article class="service-showcase-card[^"]*" id="app-dev">.*?)(<div class="service-card-action">)(\s*<span class="service-action-text">Explore Capability</span>\s*<span class="service-action-arrow">&rarr;</span>\s*)(</div>)',
    r'\1<a href="services/application-development/" class="service-card-action" aria-label="Explore Application Development Capability">\3</a>',
    text,
    flags=re.DOTALL
)

# Update card 3
text = re.sub(
    r'(<article class="service-showcase-card[^"]*" id="marketing-seo">.*?)(<div class="service-card-action">)(\s*<span class="service-action-text">Explore Capability</span>\s*<span class="service-action-arrow">&rarr;</span>\s*)(</div>)',
    r'\1<a href="services/digital-marketing/" class="service-card-action" aria-label="Explore Digital Marketing Capability">\3</a>',
    text,
    flags=re.DOTALL
)

# Update card 4
text = re.sub(
    r'(<article class="service-showcase-card[^"]*" id="ecommerce">.*?)(<div class="service-card-action">)(\s*<span class="service-action-text">Explore Capability</span>\s*<span class="service-action-arrow">&rarr;</span>\s*)(</div>)',
    r'\1<a href="contact.html?service=ecommerce" class="service-card-action" aria-label="Inquire about E-Commerce Development">\3</a>',
    text,
    flags=re.DOTALL
)

# Update card 5
text = re.sub(
    r'(<article class="service-showcase-card[^"]*" id="software-dev">.*?)(<div class="service-card-action">)(\s*<span class="service-action-text">Explore Capability</span>\s*<span class="service-action-arrow">&rarr;</span>\s*)(</div>)',
    r'\1<a href="contact.html?service=software" class="service-card-action" aria-label="Inquire about Software Development">\3</a>',
    text,
    flags=re.DOTALL
)

# Update card 6
text = re.sub(
    r'(<article class="service-showcase-card[^"]*" id="game-dev">.*?)(<div class="service-card-action">)(\s*<span class="service-action-text">Explore Capability</span>\s*<span class="service-action-arrow">&rarr;</span>\s*)(</div>)',
    r'\1<a href="contact.html?service=game" class="service-card-action" aria-label="Inquire about Game Development">\3</a>',
    text,
    flags=re.DOTALL
)

# Bump version in services.html
text = text.replace('style.css?v=28', 'style.css?v=29')
text = text.replace('main.js?v=28', 'main.js?v=29')

with open('services.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)

print("Successfully updated services.html action links!")

