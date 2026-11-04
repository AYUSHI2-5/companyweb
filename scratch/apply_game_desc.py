# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

target_idx = '''                    <p class="service-pitch-text">
                      Immersive 2D and 3D games, gamified interactive web experiences, and mobile entertainment built with fluid physics, rich shaders, and addictive gameplay.
                    </p>'''

replacement_idx = '''                    <p class="service-pitch-text">
                      Our game development team is highly expert in making 3D games and applications using the Unity 3D tool. We build games for diverse platforms including iPhone/iPad, Android, and Web, supporting you from initial concept to launch with comprehensive maintenance.
                    </p>'''

if target_idx in idx:
    idx = idx.replace(target_idx, replacement_idx, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(idx)
    print('Updated index.html for Game Development')
else:
    print('Target not found in index.html')

# Update services.html
with open('services.html', 'r', encoding='utf-8') as f:
    srv = f.read()

target_srv = '''              <p class="service-desc">
                Engaging interactive experiences, browser-based games, and gamified enterprise applications crafted with modern WebGL mechanics, physics engines, and captivating sound design.
              </p>'''

replacement_srv = '''              <p class="service-desc">
                Our game development team is highly expert in making 3D games and applications using the Unity 3D tool. We build games for diverse platforms including iPhone/iPad, Android, and Web, supporting you from initial concept to launch with comprehensive maintenance.
              </p>'''

if target_srv in srv:
    srv = srv.replace(target_srv, replacement_srv, 1)
    with open('services.html', 'w', encoding='utf-8') as f:
        f.write(srv)
    print('Updated services.html for Game Development')
else:
    print('Target not found in services.html')

