with open('services.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''              <p class="service-desc">
                High-performance web applications and corporate digital platforms engineered with modern frontend standards, headless CMS backbones, and responsive modular design systems.
              </p>'''

replacement = '''              <p class="service-desc">
                Baadam Info Services Pvt. Ltd. is a highly specialized team for website development and services. You will get the high performing web experiences that are digitally transformative, and it is designed to be user-friendly. Our team creates the best website, which will be fully functional, very secure and able to grow your business.
              </p>'''

if target in c:
    c = c.replace(target, replacement, 1)
    with open('services.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated services.html successfully')
else:
    print('Target not found in services.html')

