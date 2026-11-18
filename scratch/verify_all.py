import re

print("--- 1. Testing portfolio.html ---")
with open('portfolio.html', 'r', encoding='utf-8') as f:
    p_html = f.read()

div_opens = len(re.findall(r'<div\b', p_html))
div_closes = len(re.findall(r'</div\b', p_html))
art_opens = len(re.findall(r'<article\b', p_html))
art_closes = len(re.findall(r'</article\b', p_html))
sec_opens = len(re.findall(r'<section\b', p_html))
sec_closes = len(re.findall(r'</section\b', p_html))

print(f"portfolio.html <div>: {div_opens} open, {div_closes} close. Delta: {div_opens - div_closes}")
print(f"portfolio.html <article>: {art_opens} open, {art_closes} close. Delta: {art_opens - art_closes}")
print(f"portfolio.html <section>: {sec_opens} open, {sec_closes} close. Delta: {sec_opens - sec_closes}")

assert div_opens == div_closes, "Div mismatch in portfolio.html"
assert art_opens == art_closes == 16, f"Expected 16 articles, got {art_opens} open, {art_closes} close"
assert sec_opens == sec_closes, "Section mismatch in portfolio.html"

# Verify each project is present
expected_projects = [
    "KP E-Services", "Ashray Labs", "ProCurve", "Heart Foundation and Research Institute",
    "Vishan Institute of Technology", "Chick N Go", "Sunshine Wholesale", "Cyclical Beauty",
    "LPG Booking", "Servizo", "Just Land", "Just My Team", "RealtyBizHub", "Dodani ERP",
    "Arizona Land Investors", "Micro Matching"
]

print("\nVerifying each of the 16 project titles in portfolio.html:")
for proj in expected_projects:
    assert proj in p_html, f"Missing project: {proj}"
    print(f"  [OK] {proj}")

print("\n--- 2. Testing index.html ---")
with open('index.html', 'r', encoding='utf-8') as f:
    i_html = f.read()

i_div_opens = len(re.findall(r'<div\b', i_html))
i_div_closes = len(re.findall(r'</div\b', i_html))
i_sec_opens = len(re.findall(r'<section\b', i_html))
i_sec_closes = len(re.findall(r'</section\b', i_html))
print(f"index.html <div>: {i_div_opens} open, {i_div_closes} close. Delta: {i_div_opens - i_div_closes}")
print(f"index.html <section>: {i_sec_opens} open, {i_sec_closes} close. Delta: {i_sec_opens - i_sec_closes}")

assert i_div_opens == i_div_closes, "Div mismatch in index.html"
assert i_sec_opens == i_sec_closes, "Section mismatch in index.html"

print("\n--- 3. Testing CSS braces in style.css ---")
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

open_b = css.count('{')
close_b = css.count('}')
print(f"CSS braces: {open_b} open, {close_b} close. Delta: {open_b - close_b}")
assert open_b == close_b, "CSS brace mismatch"

print("\nALL STRUCTURAL AND CONTENT CHECKS PASSED!")

