import re

with open(r'c:\Users\Admin\Desktop\Baadam.com\main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add portfolio-showcase-section to tourSections
old_tour = """    var tourSections = [
      { id: 'hero-section', name: 'Overview', duration: 7500 },
      { id: 'radar-section', name: 'Brand Radar', duration: 8000 },
      { id: 'services-section', name: 'Our Services', duration: 8500 },
      { id: 'case-studies-section', name: 'Case Studies', duration: 8000 },"""

new_tour = """    var tourSections = [
      { id: 'hero-section', name: 'Overview', duration: 7500 },
      { id: 'radar-section', name: 'Brand Radar', duration: 8000 },
      { id: 'services-section', name: 'Our Services', duration: 8500 },
      { id: 'portfolio-showcase-section', name: 'Featured Work', duration: 8500 },
      { id: 'case-studies-section', name: 'Case Studies', duration: 8000 },"""

if old_tour in js:
    js = js.replace(old_tour, new_tour)
    print("Updated tourSections.")
else:
    # Try CRLF
    old_tour_crlf = old_tour.replace('\n', '\r\n')
    new_tour_crlf = new_tour.replace('\n', '\r\n')
    if old_tour_crlf in js:
        js = js.replace(old_tour_crlf, new_tour_crlf)
        print("Updated tourSections CRLF.")
    else:
        print("tourSections target not found!")

# 2. Add initPortfolio3DTilt
tilt_function = """  /* ==========================================================================
     9.6. Interactive 3D Card Tilt for Featured Portfolio
     ========================================================================== */
  function initPortfolio3DTilt() {
    var cards = document.querySelectorAll('.portfolio-feature-card');
    if (!cards || cards.length === 0) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -6;
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-8px)';
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

"""

if 'initCardSpotlights();' in js:
    js = js.replace('initCardSpotlights();', 'initCardSpotlights();\n    initPortfolio3DTilt();')
    js = js.replace('  /* ==========================================================================\n     10. Initialize All Components on DOM Ready', 
                    tilt_function + '  /* ==========================================================================\n     10. Initialize All Components on DOM Ready')
    print("Added initPortfolio3DTilt.")
else:
    # Try CRLF
    js = js.replace('initCardSpotlights();\r\n', 'initCardSpotlights();\r\n    initPortfolio3DTilt();\r\n')
    js = js.replace('  /* ==========================================================================\r\n     10. Initialize All Components on DOM Ready', 
                    tilt_function.replace('\n', '\r\n') + '  /* ==========================================================================\r\n     10. Initialize All Components on DOM Ready')
    print("Added initPortfolio3DTilt CRLF.")

with open(r'c:\Users\Admin\Desktop\Baadam.com\main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated main.js successfully.")

