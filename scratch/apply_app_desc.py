# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

target_idx = '''                    <p class="service-pitch-text">
                      Native iOS, Android, and cross-platform apps built for high reliability, real-time data sync, intuitive user journeys, and seamless scalability.
                    </p>'''

replacement_idx = '''                    <p class="service-pitch-text">
                      Our great application development services allow you to build the best B2B apps for a wide range of platforms. We are making the apps for mobile, web, smartwatch, desktop, AR and VR. Baadam Info Pvt. Ltd. simplifies your business complexities.
                    </p>'''

if target_idx in idx:
    idx = idx.replace(target_idx, replacement_idx, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(idx)
    print('Updated index.html for Application Development')
else:
    print('Target not found in index.html')

# Update services.html
with open('services.html', 'r', encoding='utf-8') as f:
    srv = f.read()

target_srv = '''              <p class="service-desc">
                Native and cross-platform mobile apps built for seamless cross-device performance on iOS and Android with intuitive gestures, offline caching, and real-time backend synchronization.
              </p>'''

replacement_srv = '''              <p class="service-desc">
                Our great application development services allow you to build the best B2B apps for a wide range of platforms. We are making the apps for mobile, web, smartwatch, desktop, AR and VR. Baadam Info Pvt. Ltd. simplifies your business complexities.
              </p>'''

if target_srv in srv:
    srv = srv.replace(target_srv, replacement_srv, 1)
    with open('services.html', 'w', encoding='utf-8') as f:
        f.write(srv)
    print('Updated services.html for Application Development')
else:
    print('Target not found in services.html')

