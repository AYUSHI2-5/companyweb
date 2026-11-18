with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''    // Dot click smooth scroll
    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        var targetId = dot.getAttribute('data-section') || (dot.getAttribute('href') ? dot.getAttribute('href').replace('#', '') : '');
        var targetSec = document.getElementById(targetId);
        if (targetSec) {
          e.preventDefault();
          targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveDot(targetId);
          if (history.pushState) {
            history.pushState(null, null, '#' + targetId);
          }
        }
      });
    });

    // IntersectionObserver to sync active dot with scroll
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            setActiveDot(entry.target.id);
          }
        });
      }, {
        threshold: [0.45, 0.7]
      });

      sections.forEach(function (sec) {
        observer.observe(sec);
      });
    }

    // Keyboard Up / Down arrow navigation between 100vh sections
    window.addEventListener('keydown', function (e) {
      // Don't intercept if user is typing in form inputs/textarea
      var activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        var currentActiveIndex = -1;
        var vh = window.innerHeight;

        for (var i = 0; i < sections.length; i++) {
          var rect = sections[i].getBoundingClientRect();
          if (rect.top <= vh * 0.4 && rect.bottom >= vh * 0.4) {
            currentActiveIndex = i;
            break;
          }
        }

        if (currentActiveIndex === -1) {
          currentActiveIndex = 0;
        }

        var nextIndex = currentActiveIndex;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          nextIndex = Math.min(sections.length - 1, currentActiveIndex + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          nextIndex = Math.max(0, currentActiveIndex - 1);
        }

        if (nextIndex !== currentActiveIndex) {
          e.preventDefault();
          sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
          setActiveDot(sections[nextIndex].id);
        }
      }
    });'''

replacement = '''    // Dot click smooth scroll
    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        var targetId = dot.getAttribute('data-section') || (dot.getAttribute('href') ? dot.getAttribute('href').replace('#', '') : '');
        var targetSec = document.getElementById(targetId);
        if (targetSec) {
          e.preventDefault();
          if (targetId === 'services-section') {
            var track = document.getElementById('services-sticky-track') || targetSec;
            track.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.BaadamServices && typeof window.BaadamServices.open === 'function') {
              window.BaadamServices.open(0);
            }
          } else {
            targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setActiveDot(targetId);
          if (history.pushState) {
            history.pushState(null, null, '#' + targetId);
          }
        }
      });
    });

    // IntersectionObserver to sync active dot with scroll
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            setActiveDot(entry.target.id);
          }
        });
      }, {
        threshold: [0.45, 0.7]
      });

      sections.forEach(function (sec) {
        observer.observe(sec);
      });
    }

    // Keyboard Up / Down arrow navigation between 100vh sections (with sticky card stepping)
    window.addEventListener('keydown', function (e) {
      // Don't intercept if user is typing in form inputs/textarea
      var activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        var vh = window.innerHeight;
        var servicesTrack = document.getElementById('services-sticky-track');

        // Check if user is currently viewing the sticky services section
        if (servicesTrack) {
          var trackRect = servicesTrack.getBoundingClientRect();
          if (trackRect.top <= 80 && trackRect.bottom >= vh - 80) {
            var currentCard = (window.BaadamServices && typeof window.BaadamServices.getCurrentIndex === 'function')
              ? window.BaadamServices.getCurrentIndex()
              : -1;

            if (currentCard >= 0) {
              if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                if (currentCard < 5) {
                  e.preventDefault();
                  window.BaadamServices.scrollToCard(currentCard + 1);
                  return;
                }
                // If on last card (index 5), allow down arrow to naturally progress to next section
              } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                if (currentCard > 0) {
                  e.preventDefault();
                  window.BaadamServices.scrollToCard(currentCard - 1);
                  return;
                }
                // If on first card (index 0), allow up arrow to naturally retreat to previous section
              }
            }
          }
        }

        var currentActiveIndex = -1;

        for (var i = 0; i < sections.length; i++) {
          var rect = sections[i].getBoundingClientRect();
          if (rect.top <= vh * 0.4 && rect.bottom >= vh * 0.4) {
            currentActiveIndex = i;
            break;
          }
        }

        if (currentActiveIndex === -1) {
          currentActiveIndex = 0;
        }

        var nextIndex = currentActiveIndex;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          nextIndex = Math.min(sections.length - 1, currentActiveIndex + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          nextIndex = Math.max(0, currentActiveIndex - 1);
        }

        if (nextIndex !== currentActiveIndex) {
          e.preventDefault();
          if (sections[nextIndex].id === 'services-section' && servicesTrack) {
            servicesTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.BaadamServices && typeof window.BaadamServices.open === 'function') {
              window.BaadamServices.open(0);
            }
          } else {
            sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setActiveDot(sections[nextIndex].id);
        }
      }
    });'''

normalized_content = content.replace('\r\n', '\n')
norm_target = target.replace('\r\n', '\n')
norm_rep = replacement.replace('\r\n', '\n')

assert norm_target in normalized_content, "target not found in main.js"

new_content = normalized_content.replace(norm_target, norm_rep, 1)

with open('main.js', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_content)

print("Successfully updated main.js!")

