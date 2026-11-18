# Update main.js
with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

target_hook = 'if (teacherArmLayer) {\n      requestAnimationFrame(updateTeacherPresenterLoop);\n    }'
repl_hook = '''if (teacherArmLayer) {
      requestAnimationFrame(updateTeacherPresenterLoop);
    }

    // Auto-fade teacher guide widget when viewing interactive maps (unobstructed map browsing)
    var locationMapEl = document.getElementById('location-map');
    if (locationMapEl && teacherWidget) {
      function checkMapCollision() {
        var rect = locationMapEl.getBoundingClientRect();
        var vh = window.innerHeight;
        if (rect.top < vh - 60 && rect.bottom > 80) {
          teacherWidget.style.opacity = '0';
          teacherWidget.style.pointerEvents = 'none';
        } else {
          teacherWidget.style.opacity = '1';
          teacherWidget.style.pointerEvents = 'auto';
        }
      }
      window.addEventListener('scroll', checkMapCollision, { passive: true });
      window.addEventListener('resize', checkMapCollision, { passive: true });
      checkMapCollision();
    }'''

target_hook_crlf = target_hook.replace('\n', '\r\n')
repl_hook_crlf = repl_hook.replace('\n', '\r\n')

if target_hook_crlf in js:
    js = js.replace(target_hook_crlf, repl_hook_crlf)
    print('Updated main.js with map collision fade (CRLF)')
elif target_hook in js:
    js = js.replace(target_hook, repl_hook)
    print('Updated main.js with map collision fade (LF)')
else:
    print('target_hook not found in main.js')

with open('main.js', 'w', encoding='utf-8') as f:
    f.write(js)

# Update style.css teacher transition
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

t_widget = '.teacher-guide-widget {\n  position: fixed;\n  bottom: 0px;\n  left: 24px;\n  z-index: 96;'
r_widget = '.teacher-guide-widget {\n  position: fixed;\n  bottom: 0px;\n  left: 24px;\n  z-index: 96;\n  transition: opacity 0.35s ease, transform var(--transition-fast);'

t_widget_crlf = t_widget.replace('\n', '\r\n')
r_widget_crlf = r_widget.replace('\n', '\r\n')

if t_widget_crlf in css:
    css = css.replace(t_widget_crlf, r_widget_crlf)
    print('Updated teacher transition in style.css (CRLF)')
elif t_widget in css:
    css = css.replace(t_widget, r_widget)
    print('Updated teacher transition in style.css (LF)')
else:
    print('t_widget not found in style.css')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('Saved main.js and style.css successfully!')

