# 1. Update about.html
with open('about.html', 'r', encoding='utf-8') as f:
    about_html = f.read()

about_html = about_html.replace('width="493" \n                   height="326"', 'width="429" \n                   height="286"')
about_html = about_html.replace('width="431" \n                   height="314"', 'width="429" \n                   height="286"')
about_html = about_html.replace('width="431" height="314"', 'width="429" height="286"')

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(about_html)
print('about.html updated')

# 2. Update style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace the hero container margin rule that had oversized padding-left
target_clearance = '''.about-page-hero .section-container {
    padding-left: clamp(170px, 15vw, 210px);
    padding-right: clamp(24px, 3vw, 40px);
  }'''

replacement_clearance = '''/* Balanced section-container margin matching all other site sections */
.about-page-hero .section-container,
.portfolio-page-hero .section-container,
.contact-page-hero .section-container {
  padding: 0 clamp(20px, 3vw, 40px);
  max-width: var(--container-max-width, 1280px);
  margin: 0 auto;
}'''

if target_clearance in css:
    css = css.replace(target_clearance, replacement_clearance)
    print('Replaced oversized clearance with balanced section-container margin')
else:
    print('target_clearance not found directly, will check media query block')

# Remove any remaining oversized left padding rules for hero containers
import re
css = re.sub(
    r'@media\s*\(min-width:\s*992px\)\s*\{\s*\.about-page-hero\s*\.section-container[^\}]*\}',
    '/* Standard balanced margin */',
    css
)
css = re.sub(
    r'@media\s*\(min-width:\s*992px\)\s*\{\s*\.portfolio-page-hero\s*\.section-container[^\}]*\}',
    '/* Standard balanced margin */',
    css
)

# Replace .about-visual-stage, .portfolio-visual-stage, .contact-visual-stage to remove card backgrounds and enlarge images
new_visual_rules = '''
/* Pure Hero Images (No card background, enlarged slightly) */
.about-visual-stage,
.portfolio-visual-stage,
.contact-visual-stage {
  position: relative !important;
  width: 100% !important;
  max-width: 560px !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.about-office-showcase-img,
.portfolio-showcase-img,
.contact-workspace-img {
  width: 100% !important;
  height: auto !important;
  display: block !important;
  object-fit: cover !important;
  border-radius: 22px !important;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08) !important;
}
'''

if '/* Pure Hero Images' not in css:
    css += new_visual_rules
    print('Added pure hero images rules')

# Ensure standard section-container padding is active for all heroes
standard_container_rule = '''
.about-page-hero .section-container,
.portfolio-page-hero .section-container,
.contact-page-hero .section-container {
  padding: 0 clamp(20px, 3vw, 40px) !important;
  max-width: var(--container-max-width, 1280px) !important;
  margin: 0 auto !important;
}
'''
if '.about-page-hero .section-container' not in css or '/* Balanced section-container margin' not in css:
    css += standard_container_rule
    print('Added standard container rule')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('style.css updated successfully')

