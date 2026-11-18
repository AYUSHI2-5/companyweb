import re

with open('services/website-development/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

print('Classes with card:', set(re.findall(r'class="([^"]*card[^"]*)"', text)))
print('Classes with step:', set(re.findall(r'class="([^"]*step[^"]*)"', text)))
print('Classes with deliver:', set(re.findall(r'class="([^"]*deliver[^"]*)"', text)))
print('Classes with why:', set(re.findall(r'class="([^"]*why[^"]*)"', text)))

# Let's search for the headings
headings = re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>', text, re.DOTALL)
print("\nHeadings:")
for h in headings[:15]:
    print(' -', h.strip().replace('\n', ' '))

