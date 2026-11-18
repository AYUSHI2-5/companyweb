with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

target = """.portfolio-card-body {
  padding: 32px;
}"""

replacement = """.portfolio-card {
  display: flex;
  flex-direction: column;
}

.portfolio-card-body {
  padding: 32px 30px 26px;
  display: flex;
  flex-direction: column;
  flex: 1;
}"""

if target in text:
    text = text.replace(target, replacement, 1)
    print("Updated .portfolio-card-body flex styling!")
else:
    print("Target .portfolio-card-body not found!")

target_desc = """.portfolio-card-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
}"""

replacement_desc = """.portfolio-card-desc {
  font-size: 0.94rem;
  color: #4B5563;
  line-height: 1.62;
  margin-top: 8px;
  margin-bottom: 20px;
  flex: 1;
}"""

if target_desc in text:
    text = text.replace(target_desc, replacement_desc, 1)
    print("Updated .portfolio-card-desc styling!")
else:
    print("Target .portfolio-card-desc not found!")

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(text)

open_b = text.count('{')
close_b = text.count('}')
print(f"style.css braces: {open_b} open, {close_b} close (delta: {open_b - close_b})")

