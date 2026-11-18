with open('style.css', 'r', encoding='utf-8') as f:
    text = f.read()

target = """.portfolio-card {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
}"""

replacement = """.portfolio-card {
  background: #ffffff;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal), opacity 0.25s ease;
}

.portfolio-card.is-hidden {
  opacity: 0;
  transform: scale(0.96);
  pointer-events: none;
}"""

norm_text = text.replace('\r\n', '\n')
norm_target = target.replace('\r\n', '\n')
norm_rep = replacement.replace('\r\n', '\n')

assert norm_target in norm_text, "target not found in style.css"

new_text = norm_text.replace(norm_target, norm_rep, 1)

with open('style.css', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_text)

print("Successfully updated style.css with .is-hidden rule!")

