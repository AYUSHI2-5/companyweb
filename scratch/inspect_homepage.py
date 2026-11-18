import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all sections with their headings and comments
sections = re.findall(r'(<!--\s*={5,}\s*Section[\s\S]*?-->\s*<section[\s\S]*?</section>)', text)
print(f'Found {len(sections)} major section blocks')
for i, s in enumerate(sections):
    m_comment = re.search(r'<!--\s*={5,}\s*(Section.*?)\s*={5,}', s)
    comment = m_comment.group(1).strip() if m_comment else 'Unknown'
    m_id = re.search(r'id="([^"]+)"', s)
    sec_id = m_id.group(1) if m_id else 'no-id'
    m_class = re.search(r'class="([^"]+)"', s)
    sec_class = m_class.group(1) if m_class else 'no-class'
    print(f'[{i+1}] {comment} | id="{sec_id}" | class="{sec_class[:40]}"')
