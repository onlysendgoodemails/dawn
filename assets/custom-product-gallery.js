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

  function ready() {
    document.querySelectorAll('.custom-gallery-thumbs').forEach(init);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
