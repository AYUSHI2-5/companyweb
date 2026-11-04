import re

with open(r'c:\Users\Admin\Desktop\Baadam.com\main.js', 'r', encoding='utf-8') as f:
    js = f.read()

new_contact_code = r"""  /* ==========================================================================
     7. Contact Form & FAQ Handler (IT Company Contact Page)
     ========================================================================== */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var statusMsg = document.getElementById('formStatusMsg');

    // 1. Interactive Multi-Select Service Pills
    var servicePills = document.querySelectorAll('.service-pill');
    var hiddenServicesInput = document.getElementById('selectedServicesInput');

    if (servicePills && hiddenServicesInput) {
      servicePills.forEach(function (pill) {
        pill.addEventListener('click', function (e) {
          e.preventDefault();
          pill.classList.toggle('is-active');

          var selected = [];
          document.querySelectorAll('.service-pill.is-active').forEach(function (activePill) {
            selected.push(activePill.getAttribute('data-value'));
          });
          hiddenServicesInput.value = selected.join(', ');
        });
      });
    }

    // 2. Interactive Contact FAQ Accordion
    var faqButtons = document.querySelectorAll('.contact-faq-btn');
    if (faqButtons) {
      faqButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.contact-faq-item');
          if (!item) return;

          var wasOpen = item.classList.contains('is-open');
          // Close others
          document.querySelectorAll('.contact-faq-item').forEach(function (other) {
            other.classList.remove('is-open');
            var otherBtn = other.querySelector('.contact-faq-btn');
            if (otherBtn) {
              otherBtn.setAttribute('aria-expanded', 'false');
              var icon = otherBtn.querySelector('.faq-icon');
              if (icon) icon.innerHTML = '&plus;';
            }
          });

          if (!wasOpen) {
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            var icon = btn.querySelector('.faq-icon');
            if (icon) icon.innerHTML = '&minus;';
          }
        });
      });
    }

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('button[type="submit"]');
      var name = (form.querySelector('#contactName') || {}).value || '';
      var email = (form.querySelector('#contactEmail') || {}).value || '';
      var phone = (form.querySelector('#contactPhone') || {}).value || '';
      var company = (form.querySelector('#contactCompany') || {}).value || '';
      var budget = (form.querySelector('#contactBudget') || {}).value || '';
      var timeline = (form.querySelector('#contactTimeline') || {}).value || '';
      var message = (form.querySelector('#contactMessage') || {}).value || '';
      var ndaCheckbox = form.querySelector('#ndaCheckbox');
      var isNdaRequested = ndaCheckbox ? ndaCheckbox.checked : false;

      if (!name.trim() || !email.trim() || !message.trim()) {
        if (statusMsg) {
          statusMsg.className = 'form-status is-error';
          statusMsg.innerHTML = '<strong>Incomplete Brief:</strong> Please provide your Full Name, Work Email, and Project Description.';
          statusMsg.style.display = 'block';
        }
        return;
      }

      // Email format validation
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        if (statusMsg) {
          statusMsg.className = 'form-status is-error';
          statusMsg.innerHTML = '<strong>Invalid Email:</strong> Please enter a valid corporate or work email address.';
          statusMsg.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing Technical Brief...</span>';
      }

      // Simulate clean asynchronous submission with realistic feedback
      setTimeout(function () {
        if (statusMsg) {
          statusMsg.className = 'form-status is-success';
          var ndaNote = isNdaRequested ? ' <span style="display:block;margin-top:4px;color:#15803d;">&#x1F512; A mutual Non-Disclosure Agreement (NDA) will be prepared prior to our discovery meeting.</span>' : '';
          statusMsg.innerHTML = '<strong>Technical Inquiry Received, ' + escapeHtml(name) + '!</strong> Our engineering lead in Ahmedabad will analyze your project scope and follow up within 24 hours.' + ndaNote;
          statusMsg.style.display = 'block';
          statusMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
        document.querySelectorAll('.service-pill.is-active').forEach(function (pill) {
          pill.classList.remove('is-active');
        });
        if (hiddenServicesInput) hiddenServicesInput.value = '';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Submit Technical Inquiry</span><span class="btn-arrow-circle" aria-hidden="true">&rarr;</span>';
        }
      }, 700);
    });

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }"""

pattern = r'/\* ==========================================================================\s*7\. Contact Form Handler.*?function escapeHtml\(str\) \{.*?return div\.innerHTML;\s*\}\s*\}'
new_js, count = re.subn(pattern, lambda m: new_contact_code, js, flags=re.DOTALL)

if count > 0:
    with open(r'c:\Users\Admin\Desktop\Baadam.com\main.js', 'w', encoding='utf-8') as f:
        f.write(new_js)
    print("Updated main.js with enhanced contact form logic.")
else:
    print("Pattern in main.js not matched!")
