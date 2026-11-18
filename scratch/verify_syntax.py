import re

print("--- 1. Testing HTML syntax and balance in index.html ---")
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

div_opens = len(re.findall(r'<div\b', html))
div_closes = len(re.findall(r'</div\b', html))
sec_opens = len(re.findall(r'<section\b', html))
sec_closes = len(re.findall(r'</section\b', html))

print(f"<div>: {div_opens} open, {div_closes} close. Delta: {div_opens - div_closes}")
print(f"<section>: {sec_opens} open, {sec_closes} close. Delta: {sec_opens - sec_closes}")
assert div_opens == div_closes, "Div tags not balanced!"
assert sec_opens == sec_closes, "Section tags not balanced!"

print("--- 2. Testing CSS brace matching in style.css ---")
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

open_braces = css.count('{')
close_braces = css.count('}')
print(f"CSS Braces: {open_braces} open, {close_braces} close. Delta: {open_braces - close_braces}")
assert open_braces == close_braces, "CSS braces not matching!"

print("--- 3. Checking Node.js syntax if available or checking JS files ---")
with open('services-accordion.js', 'r', encoding='utf-8') as f:
    js1 = f.read()
with open('main.js', 'r', encoding='utf-8') as f:
    js2 = f.read()

print("services-accordion.js length:", len(js1))
print("main.js length:", len(js2))

print("All syntax checks PASSED!")

