with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

target = '''
.teacher-guide-widget {
  position: fixed;
  bottom: 0px;
  left: 24px;
  z-index: 96;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  user-select: none;
  cursor: pointer;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.1));
}
'''.strip()

repl = '''
.teacher-guide-widget {
  position: fixed;
  bottom: 0px;
  left: 24px;
  z-index: 96;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  user-select: none;
  cursor: pointer;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.12));
}
'''.strip()

target_crlf = target.replace('\n', '\r\n')
repl_crlf = repl.replace('\n', '\r\n')

if target_crlf in css:
    css = css.replace(target_crlf, repl_crlf)
    print('Updated teacher-guide-widget')
elif target in css:
    css = css.replace(target, repl)
    print('Updated teacher-guide-widget (LF)')
else:
    print('Target 1 not found')

target2 = '''
/* 1. Static Body Layer (Head, Bun, Glasses, Collar, Torso, Tablet, Legs) */
.teacher-body-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom left;
  display: block;
  pointer-events: none;
  z-index: 2; /* Sleeve cuff sits on top of forearm socket to conceal rotation anchor */
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.12));
  transform: none !important;
}

/* 2. Independently Animated Stylus-Holding Arm Layer */
.teacher-arm-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* Forearm rotates inside sleeve cuff socket */
  transform-origin: 84.8% 42.4%; /* Exact sleeve cuff rotation pivot (407, 264) */
  pointer-events: none;
  will-change: transform;
}

/* 3. Fine Wrist Layer (Anchored firmly within socket) */
.teacher-wrist-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transform: none !important;
}

.teacher-arm-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom left;
  display: block;
  pointer-events: none;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.08));
}
'''.strip()

repl2 = '''
/* 1. Static Body Layer (Head, Bun, Glasses, Collar, Torso, Tablet, Legs) */
.teacher-body-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom left;
  display: block;
  pointer-events: none;
  z-index: 2; /* Sleeve cuff sits on top of forearm socket to conceal rotation anchor */
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  filter: none !important;
  transform: none !important;
}

/* 2. Independently Animated Stylus-Holding Arm Layer */
.teacher-arm-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1; /* Forearm rotates inside sleeve cuff socket */
  transform-origin: 84.8% 42.4%; /* Exact sleeve cuff rotation pivot (407, 264) */
  pointer-events: none;
  background: transparent !important;
  will-change: transform;
}

/* 3. Fine Wrist Layer (Anchored firmly within socket) */
.teacher-wrist-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: transparent !important;
  transform: none !important;
}

.teacher-arm-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom left;
  display: block;
  pointer-events: none;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  filter: none !important;
}
'''.strip()

target2_crlf = target2.replace('\n', '\r\n')
repl2_crlf = repl2.replace('\n', '\r\n')

if target2_crlf in css:
    css = css.replace(target2_crlf, repl2_crlf)
    print('Updated teacher body and arm layers')
elif target2 in css:
    css = css.replace(target2, repl2)
    print('Updated teacher body and arm layers (LF)')
else:
    print('Target 2 not found')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print('Saved style.css')

