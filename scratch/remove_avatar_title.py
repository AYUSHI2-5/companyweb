with open('index.html', 'r', encoding='utf-8') as f:
    c = f.read()

target = '''  <!-- Teacher Avatar Guide (Coordinated with Section-by-Section Auto-Scroll) -->
  <aside class="teacher-guide-widget" id="teacherGuideWidget" aria-label="Baadam Presentation Guide" title="Click to advance to the next section">
    <div class="teacher-speech-bubble" id="teacherSpeechBubble">
      <span class="teacher-status-dot"></span>
      <span class="teacher-speech-text" id="teacherSpeechText">Overview &bull; 01/07</span>
    </div>

    <div class="teacher-avatar-wrapper" id="teacherAvatarWrapper">'''

replacement = '''  <!-- Teacher Avatar Guide (Coordinated with Section-by-Section Auto-Scroll) -->
  <aside class="teacher-guide-widget" id="teacherGuideWidget" aria-label="Baadam Presentation Guide">
    <div class="teacher-avatar-wrapper" id="teacherAvatarWrapper">'''

if target in c:
    c = c.replace(target, replacement, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Removed title and speech bubble from avatar in index.html')
else:
    print('Target not found in index.html')

