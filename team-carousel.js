/**
 * Baadam Info and Trade Link Services Pvt. Ltd.
 * Meet Our Team Section - Carousel Controller
 */
(function () {
  'use strict';

  function initTeamCarousel() {
    var viewport = document.getElementById('teamCarouselViewport');
    var track = document.getElementById('teamCardsTrack');
    var prevBtn = document.getElementById('teamPrevBtn');
    var nextBtn = document.getElementById('teamNextBtn');
    var dots = document.querySelectorAll('#teamPagination .team-dot');

    if (!viewport || !track) return;

    var cards = track.querySelectorAll('.team-card');
    if (cards.length === 0) return;

    function getCardWidthWithGap() {
      if (cards.length < 2) return cards[0].offsetWidth;
      var c1 = cards[0].getBoundingClientRect();
      var c2 = cards[1].getBoundingClientRect();
      return Math.round(c2.left - c1.left);
    }

    function scrollToIndex(index) {
      if (index < 0) index = 0;
      if (index >= cards.length) index = cards.length - 1;
      var step = getCardWidthWithGap();
      viewport.scrollTo({
        left: index * step,
        behavior: 'smooth'
      });
      updateActiveDot(index);
    }

    function updateActiveDot(activeIdx) {
      var dotIndex = 0;
      var total = cards.length;
      if (activeIdx <= 0) {
        dotIndex = 0;
      } else if (activeIdx >= total - 2) {
        dotIndex = 2;
      } else {
        dotIndex = 1;
      }

      dots.forEach(function (dot, idx) {
        if (idx === dotIndex) {
          dot.classList.add('is-active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('is-active');
          dot.removeAttribute('aria-current');
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var step = getCardWidthWithGap();
        var currentIdx = Math.round(viewport.scrollLeft / step);
        if (currentIdx > 0) {
          scrollToIndex(currentIdx - 1);
        } else {
          scrollToIndex(cards.length - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var step = getCardWidthWithGap();
        var currentIdx = Math.round(viewport.scrollLeft / step);
        if (currentIdx < cards.length - 1) {
          scrollToIndex(currentIdx + 1);
        } else {
          scrollToIndex(0);
        }
      });
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        var targetCard = 0;
        if (idx === 0) targetCard = 0;
        else if (idx === 1) targetCard = 1;
        else targetCard = cards.length - 1;
        scrollToIndex(targetCard);
      });
    });

    var scrollTimeout;
    viewport.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var step = getCardWidthWithGap();
        var currentIdx = Math.round(viewport.scrollLeft / step);
        updateActiveDot(currentIdx);
      }, 60);
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamCarousel);
  } else {
    initTeamCarousel();
  }
})();
