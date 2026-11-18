import os

files = os.listdir('assets')
print(f"Total files in assets: {len(files)}")
for f in sorted(files):
    if any(f.lower().endswith(ext) for ext in ['.jpg', '.png', '.jpeg', '.webp', '.svg']):
        size_kb = os.path.getsize(os.path.join('assets', f)) // 1024
        print(f" - {f} ({size_kb} KB)")

