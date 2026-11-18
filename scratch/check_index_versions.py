with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'<script[^>]*services-accordion\.js[^>]*>', text)
print("services-accordion script tag:", matches)

matches_css = re.findall(r'<link[^>]*style\.css[^>]*>', text)
print("style.css link tag:", matches_css)

