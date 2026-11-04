with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''            <!-- Central Editorial Headline with Single-Line Lime Pill -->
            <h1 class="hero-lens-headline">
              Get seen by the<br>
              <span class="hero-lime-tag">right crowd.</span>
            </h1>

            <!-- Subtitle Description -->
            <p class="hero-lens-desc">
              Baadam is a full-service digital marketing and software engineering studio. We build high-converting SEO, digital campaigns, and scalable web solutions that turn attention into real growth.
            </p>'''

replacement = '''            <!-- Central Editorial Headline with Single-Line Lime Pill -->
            <h1 class="hero-lens-headline">
              Get Your Business On Height,<br>
              <span class="hero-lime-tag">With Our Product And Services</span>
            </h1>

            <!-- Subtitle Description -->
            <p class="hero-lens-desc">
              We, Baadam Info And Trade Link Services Pvt. Ltd., a young yet experienced, dynamic, and technology-based company, are here to reduce your financial issues and increase your business's growth. Having an experience of five years, with more than thirty workers, we ensure an increase in traffic, high-quality software, offer e-commerce, and an increase in product awareness.
            </p>'''

if target in c:
    c = c.replace(target, replacement, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated Hero section in index.html successfully')
else:
    print('Target not found in index.html')

