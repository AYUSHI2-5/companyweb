with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

import re
header_padding = re.findall(r'\.services-section\s*\{[^}]*padding:[^;]*;', text)
print("services-section padding:", header_padding)

acc_item = re.findall(r'\.service-acc-item\.is-active\s*\{[^}]*\}', text)
print("service-acc-item.is-active:", acc_item)

