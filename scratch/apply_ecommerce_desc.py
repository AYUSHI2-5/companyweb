# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

target_idx = '''                    <p class="service-pitch-text">
                      Lightning-fast e-commerce platforms engineered for frictionless product discovery, instant 1-click checkouts, and maximum average order value.
                    </p>'''

replacement_idx = '''                    <p class="service-pitch-text">
                      Baadam Info Pvt. Ltd. enables your business to reach a broader customer base with our e-commerce website development services. We scale up your online business efficiently with seamless store architecture, secure payment gateways, and high conversion rates.
                    </p>'''

if target_idx in idx:
    idx = idx.replace(target_idx, replacement_idx, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(idx)
    print('Updated index.html for E-Commerce Development')
else:
    print('Target not found in index.html')

# Update services.html
with open('services.html', 'r', encoding='utf-8') as f:
    srv = f.read()

target_srv = '''              <p class="service-desc">
                Frictionless online retail experiences engineered for transactional scale, frictionless checkout, real-time inventory management, and multi-currency international operations.
              </p>'''

replacement_srv = '''              <p class="service-desc">
                Baadam Info Pvt. Ltd. enables your business to reach a broader customer base with our e-commerce website development services. We scale up your online business efficiently with seamless store architecture, secure payment gateways, and high conversion rates.
              </p>'''

if target_srv in srv:
    srv = srv.replace(target_srv, replacement_srv, 1)
    with open('services.html', 'w', encoding='utf-8') as f:
        f.write(srv)
    print('Updated services.html for E-Commerce Development')
else:
    print('Target not found in services.html')

