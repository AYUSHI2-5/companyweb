with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

import re
pattern = r'<div class="teacher-avatar-wrapper" id="teacherAvatarWrapper">[\s\S]*?</div>\s*</aside>'

replacement = '''<div class="teacher-avatar-wrapper" id="teacherAvatarWrapper">
      <!-- 1. Independently animated pointing arm layer (forearm, wrist, hand, stylus) -->
      <div class="teacher-arm-layer" id="teacherArmLayer">
        <div class="teacher-wrist-layer" id="teacherWristLayer">
          <img src="assets/teacher-pointing-arm.png?v=7" alt="" class="teacher-arm-img" id="teacherArmImg" width="150" height="195" />
        </div>
      </div>
      <!-- 2. Completely stationary body layer (head bun, glasses, collar, torso, tablet, legs) -->
      <img src="assets/teacher-pointing-body.png?v=7" alt="Baadam Presentation Guide" class="teacher-body-layer" id="teacherBodyLayer" width="150" height="195" />
    </div>
  </aside>'''

new_c, count = re.subn(pattern, replacement, c)
print(f'Replacements in index.html: {count}')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_c)

