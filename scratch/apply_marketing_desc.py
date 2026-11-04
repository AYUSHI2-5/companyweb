# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

target_idx = '''                    <p class="service-pitch-text">
                      Data-driven multi-channel digital marketing uniting high-intent SEO, search advertising, social campaigns, and conversion copywriting to drive predictable revenue.
                    </p>'''

replacement_idx = '''                    <p class="service-pitch-text">
                      Baadam Info Pvt. Ltd. provides you with complete digital marketing services, including email and content marketing, search engine marketing (SEM/SEO), and lead generation to drive measurable growth. We help increase website traffic, visitors, and qualified acquisition sources up to 1,000 times.
                    </p>'''

if target_idx in idx:
    idx = idx.replace(target_idx, replacement_idx, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(idx)
    print('Updated index.html for Digital Marketing')
else:
    print('Target not found in index.html')

# Update services.html
with open('services.html', 'r', encoding='utf-8') as f:
    srv = f.read()

target_srv = '''              <p class="service-desc">
                Performance marketing campaigns and technical SEO strategies designed to attract qualified commercial demand, increase conversion velocity, and maximize return on ad spend.
              </p>'''

replacement_srv = '''              <p class="service-desc">
                Baadam Info Pvt. Ltd. provides you with complete digital marketing services, including email and content marketing, search engine marketing (SEM/SEO), and lead generation to drive measurable growth. We help increase website traffic, visitors, and qualified acquisition sources up to 1,000 times.
              </p>'''

if target_srv in srv:
    srv = srv.replace(target_srv, replacement_srv, 1)
    with open('services.html', 'w', encoding='utf-8') as f:
        f.write(srv)
    print('Updated services.html for Digital Marketing')
else:
    print('Target not found in services.html')

