with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''                    <p class="service-pitch-text">
                      Bespoke, high-converting websites engineered with clean architecture, dynamic interactions, fluid mobile responsiveness, and sub-second load speeds.
                    </p>'''

replacement = '''                    <p class="service-pitch-text">
                      Baadam Info Services Pvt. Ltd. is a highly specialized team for website development and services. You will get high-performing web experiences that are digitally transformative, designed to be user-friendly, fully functional, secure, and built to grow your business.
                    </p>'''

if target in c:
    c = c.replace(target, replacement, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Updated index.html successfully')
else:
    print('Target not found in index.html')

