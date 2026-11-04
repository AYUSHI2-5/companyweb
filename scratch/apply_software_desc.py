# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

target_idx = '''                    <p class="service-pitch-text">
                      Tailored enterprise software, custom SaaS platforms, and resilient cloud architectures designed to automate critical workflows and scale to millions of users.
                    </p>'''

replacement_idx = '''                    <p class="service-pitch-text">
                      Invent, integrate, build, and upgrade your ideas with our services at Baadam Info Pvt. Ltd. We help you create high-quality software solutions and products, delivering a comprehensive range of custom software development services.
                    </p>'''

if target_idx in idx:
    idx = idx.replace(target_idx, replacement_idx, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(idx)
    print('Updated index.html for Software Development')
else:
    print('Target not found in index.html')

# Update services.html
with open('services.html', 'r', encoding='utf-8') as f:
    srv = f.read()

target_srv = '''              <h2 class="service-block-heading">Software Engineering</h2>
              <p class="service-desc">
                Custom enterprise software systems, automated back-office workflows, ERP solutions, and SaaS products architected for long-term maintainability and high concurrency.
              </p>'''

replacement_srv = '''              <h2 class="service-block-heading">Software Development</h2>
              <p class="service-desc">
                Invent, integrate, build, and upgrade your ideas with our services at Baadam Info Pvt. Ltd. We help you create high-quality software solutions and products, delivering a comprehensive range of custom software development services.
              </p>'''

if target_srv in srv:
    srv = srv.replace(target_srv, replacement_srv, 1)
    with open('services.html', 'w', encoding='utf-8') as f:
        f.write(srv)
    print('Updated services.html for Software Development')
else:
    print('Target not found in services.html')

