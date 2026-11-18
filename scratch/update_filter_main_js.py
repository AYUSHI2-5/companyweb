with open('main.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  function initPortfolioFilter() {
    var filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    var items = document.querySelectorAll('.portfolio-card-item');

    if (filterBtns.length === 0 || items.length === 0) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        var filter = btn.getAttribute('data-filter') || 'all';

        items.forEach(function (item) {
          var category = item.getAttribute('data-category') || '';
          if (filter === 'all' || category.includes(filter)) {
            item.style.display = '';
            setTimeout(function () { item.classList.remove('is-hidden'); }, 10);
          } else {
            item.classList.add('is-hidden');
            setTimeout(function () { item.style.display = 'none'; }, 250);
          }
        });
      });
    });
  }"""

replacement = """  function initPortfolioFilter() {
    var filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    var items = document.querySelectorAll('.portfolio-card-item');

    if (filterBtns.length === 0 || items.length === 0) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        var filter = btn.getAttribute('data-filter') || 'all';

        items.forEach(function (item) {
          var category = item.getAttribute('data-category') || '';
          var cats = category.trim().split(/\\s+/);
          if (filter === 'all' || cats.indexOf(filter) !== -1) {
            item.style.display = '';
            setTimeout(function () { item.classList.remove('is-hidden'); }, 10);
          } else {
            item.classList.add('is-hidden');
            setTimeout(function () { item.style.display = 'none'; }, 250);
          }
        });
      });
    });
  }"""

norm_text = text.replace('\r\n', '\n')
norm_target = target.replace('\r\n', '\n')
norm_rep = replacement.replace('\r\n', '\n')

assert norm_target in norm_text, "target not found in main.js"

new_text = norm_text.replace(norm_target, norm_rep, 1)

with open('main.js', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(new_text)

print("Successfully updated main.js with tokenized category filtering!")

