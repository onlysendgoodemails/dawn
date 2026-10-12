/* AP6: Miniaturleiste der Produktgalerie (snippets/custom-product-media-gallery.liquid).
   Klick auf eine Miniatur scrollt zum passenden Bild. Beim Scrollen wird die Miniatur des
   sichtbaren Bildes markiert. Ohne JavaScript bleibt die Galerie voll nutzbar, nur die Leiste reagiert nicht. */
(function () {
  function headerOffset() {
    var header = document.querySelector('sticky-header') || document.querySelector('.section-header');
    return (header ? header.offsetHeight : 0) + 16;
  }

  function init(list) {
    var buttons = Array.prototype.slice.call(list.querySelectorAll('[data-target]'));
    if (!buttons.length) return;

    function setCurrent(id) {
      buttons.forEach(function (button) {
        if (button.dataset.target === id) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var target = document.getElementById(button.dataset.target);
        if (!target) return;
        var top = target.getBoundingClientRect().top + window.scrollY - headerOffset();
        window.scrollTo({ top: top, behavior: 'smooth' });
        setCurrent(button.dataset.target);
      });
    });

    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    );
    buttons.forEach(function (button) {
      var slide = document.getElementById(button.dataset.target);
      if (slide) observer.observe(slide);
    });
  }

  /* Mobil: Linie mit schwarzem Schieber unter der Wischgalerie. Breite des Schiebers = sichtbarer Anteil, Lage = Scrollposition. */
  function initProgress(progress) {
    var slider = progress.parentElement && progress.parentElement.querySelector('.product__media-list');
    var thumb = progress.querySelector('.custom-gallery-progress__thumb');
    if (!slider || !thumb) return;

    function update() {
      var max = slider.scrollWidth - slider.clientWidth;
      if (max <= 1) {
        progress.hidden = true;
        return;
      }
      progress.hidden = false;
      var width = (slider.clientWidth / slider.scrollWidth) * 100;
      var left = (slider.scrollLeft / max) * (100 - width);
      thumb.style.width = width + '%';
      thumb.style.left = left + '%';
    }

    slider.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    if ('MutationObserver' in window) new MutationObserver(update).observe(slider, { childList: true });
    update();
  }

  function ready() {
    document.querySelectorAll('.custom-gallery-thumbs').forEach(init);
    document.querySelectorAll('.custom-gallery-progress').forEach(initProgress);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
