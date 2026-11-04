import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'<div class="hero-tags-group">\s*<a href="services\.html" class="hero-channel-pill"><span class="channel-num">01</span> <span>SEO</span></a>[\s\S]*?</div>'

replacement = '''<div class="hero-tags-group">
          <a href="services.html" class="hero-channel-pill"><span class="channel-num">01</span> <span>Website</span></a>
          <a href="services.html" class="hero-channel-pill"><span class="channel-num">02</span> <span>Apps</span></a>
          <a href="services.html" class="hero-channel-pill"><span class="channel-num">03</span> <span>Marketing</span></a>
          <a href="services.html" class="hero-channel-pill"><span class="channel-num">04</span> <span>E-Commerce</span></a>
        </div>'''

new_c, count = re.subn(pattern, replacement, c)
print(f'Replacements made: {count}')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_c)

