# Update main.js
with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_js = "if (tourSections.length < 2) return;"
new_js = "if (!document.getElementById('teacherGuideWidget') || tourSections.length < 2) return;"

if old_js in js:
    js = js.replace(old_js, new_js, 1)
    with open('main.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Updated main.js: teacher tour strictly scoped to teacher widget presence.")
else:
    print("Warning: old_js not found in main.js")

# Update style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update html smooth scroll to focus-within anchor transitions so wheel/trackpad is 100% natural and never sluggish
old_html_css = """html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
  /* scroll-snap scoped */
html:has(.screen-snap-nav), body.has-snap-nav { scroll-snap-type: y mandatory; }
  background-color: var(--bg-body);
  color: var(--text-chalk);
}"""

new_html_css = """html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-body);
  color: var(--text-chalk);
}

/* Homepage full-screen presentation slide snap */
html:has(.screen-snap-nav),
body.has-snap-nav {
  scroll-snap-type: y mandatory;
}

/* Natural, unhindered scrolling for all content pages (About, Services, Portfolio, Contact) */
html:not(:has(.screen-snap-nav)),
body:not(.has-snap-nav) {
  scroll-snap-type: none !important;
}

body:not(.has-snap-nav) section,
body:not(.has-snap-nav) footer,
body:not(.has-snap-nav) .cta-banner-section,
body:not(.has-snap-nav) .site-footer {
  scroll-snap-align: none !important;
  scroll-snap-stop: normal !important;
}

body:not(.has-snap-nav) .cta-banner-section {
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  padding: 80px 24px !important;
  overflow: visible !important;
}

body:not(.has-snap-nav) .site-footer {
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  padding: 80px 24px 32px !important;
  overflow: visible !important;
}"""

# Normalize CRLF in target check
css_norm = css.replace('\r\n', '\n')
if old_html_css in css_norm:
    css_norm = css_norm.replace(old_html_css, new_html_css, 1)
    print("Replaced html css block successfully")
else:
    print("Warning: old_html_css block not found directly, trying fallback replace")
    # Let's search around line 75
    part_old = "/* scroll-snap scoped */\nhtml:has(.screen-snap-nav), body.has-snap-nav { scroll-snap-type: y mandatory; }"
    if part_old in css_norm:
        css_norm = css_norm.replace("scroll-behavior: smooth;\n  /* scroll-snap scoped */\nhtml:has(.screen-snap-nav), body.has-snap-nav { scroll-snap-type: y mandatory; }", """/* Homepage full-screen presentation slide snap */
html:has(.screen-snap-nav),
body.has-snap-nav {
  scroll-snap-type: y mandatory;
}

/* Natural, unhindered scrolling for all content pages (About, Services, Portfolio, Contact) */
html:not(:has(.screen-snap-nav)),
body:not(.has-snap-nav) {
  scroll-snap-type: none !important;
}

body:not(.has-snap-nav) section,
body:not(.has-snap-nav) footer,
body:not(.has-snap-nav) .cta-banner-section,
body:not(.has-snap-nav) .site-footer {
  scroll-snap-align: none !important;
  scroll-snap-stop: normal !important;
}

body:not(.has-snap-nav) .cta-banner-section {
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  padding: 80px 24px !important;
  overflow: visible !important;
}

body:not(.has-snap-nav) .site-footer {
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  padding: 80px 24px 32px !important;
  overflow: visible !important;
}""")
        print("Replaced via fallback")

# 2. Update media query at max-width: 1024px to scope scroll-snap-type: y proximity to home-page only
old_media = """@media (max-width: 1024px) {
  html {
    scroll-snap-type: y proximity;
  }"""
new_media = """@media (max-width: 1024px) {
  html:has(.screen-snap-nav),
  body.has-snap-nav {
    scroll-snap-type: y proximity;
  }"""

if old_media in css_norm:
    css_norm = css_norm.replace(old_media, new_media, 1)
    print("Updated media query successfully")
else:
    print("Warning: old_media not found")

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css_norm)
print("Finished updating style.css")

