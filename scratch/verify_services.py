import re

with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

items = re.findall(r'<div class="service-acc-item[^"]*"[^>]*data-name="([^"]+)"', c)
print('Service cards in index.html:')
for i, name in enumerate(items, 1):
    print(f'  {i}. {name}')

# Check stepper counter and default text
stepper = re.findall(r'<div class="acc-stepper-counter"[^>]*>([\s\S]*?)</div>', c)
if stepper:
    print('Stepper text:', repr(stepper[0].strip()))

