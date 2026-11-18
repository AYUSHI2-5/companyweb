with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

target = '''
.radar-section .section-container {
  margin: auto auto;
  width: 100%;
  max-width: 1440px;
  padding: 0 clamp(24px, 3vw, 40px) 0 clamp(165px, 13.5vw, 215px);
}

.radar-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: clamp(24px, 3vw, 48px);
  align-items: center;
}
'''.strip()

repl = '''
.radar-section .section-container {
  margin: auto auto;
  width: 100%;
  max-width: 1400px;
  padding: 0 clamp(20px, 3vw, 40px);
}

.radar-grid {
  display: grid;
  grid-template-columns: 1.05fr 1.15fr;
  gap: clamp(32px, 4.5vw, 68px);
  align-items: center;
  width: 100%;
}
'''.strip()

target_crlf = target.replace('\n', '\r\n')
repl_crlf = repl.replace('\n', '\r\n')

if target_crlf in css:
    css = css.replace(target_crlf, repl_crlf)
    print('Updated radar section-container and grid (CRLF)')
elif target in css:
    css = css.replace(target, repl)
    print('Updated radar section-container and grid (LF)')
else:
    print('Target not found')

target_canvas = '''
.brand-radar-canvas {
  width: min(clamp(480px, 46vw, 620px), 63vh);
  height: min(clamp(480px, 46vw, 620px), 63vh);
  aspect-ratio: 1 / 1;
  display: block;
}
'''.strip()

repl_canvas = '''
.brand-radar-canvas {
  width: min(clamp(480px, 48vw, 660px), 65vh);
  height: min(clamp(480px, 48vw, 660px), 65vh);
  aspect-ratio: 1 / 1;
  display: block;
}
'''.strip()

target_canvas_crlf = target_canvas.replace('\n', '\r\n')
repl_canvas_crlf = repl_canvas.replace('\n', '\r\n')

if target_canvas_crlf in css:
    css = css.replace(target_canvas_crlf, repl_canvas_crlf)
    print('Updated brand-radar-canvas (CRLF)')
elif target_canvas in css:
    css = css.replace(target_canvas, repl_canvas)
    print('Updated brand-radar-canvas (LF)')
else:
    print('Canvas target not found')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('Saved style.css')

