with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace all scroll-snap-stop: always; with scroll-snap-stop: normal;
css_updated = css.replace('scroll-snap-stop: always;', 'scroll-snap-stop: normal;')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css_updated)
print("Updated scroll-snap-stop: always to normal across style.css")

