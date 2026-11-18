with open('portfolio.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
scripts = re.findall(r'<script[^>]*src="([^"]+)"', html)
print('Scripts in portfolio.html:', scripts)

