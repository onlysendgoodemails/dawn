/* Leichter Parallax für die Bildbänder der About-us-Seite (sections/custom-about.liquid).
   Das Bild im Rahmen ist 120 % hoch und startet bei -10 %. Beim Scrollen wandert es höchstens
   um 10 % der Rahmenhöhe gegen die Scrollrichtung, also etwas langsamer als die Seite.
   Bei "weniger Bewegung" im Betriebssystem passiert nichts. */

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var frames = [];
  var ticking = false;

  function update() {
    ticking = false;
    var viewport = window.innerHeight;
    frames.forEach(function (item) {
      var rect = item.frame.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      // -1 = Rahmen unten am Fensterrand, 0 = Mitte, 1 = oben am Fensterrand
      var progress = (viewport / 2 - (rect.top + rect.height / 2)) / (viewport / 2 + rect.height / 2);
      progress = Math.max(-1, Math.min(1, progress));
      item.img.style.transform = 'translate3d(0,' + (progress * rect.height * 0.08).toFixed(1) + 'px,0)';
    });
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function init() {
    frames = [];
    if (reduceMotion.matches) return;
    document.querySelectorAll('[data-about-parallax]').forEach(function (frame) {
      var img = frame.querySelector('img');
      if (img) frames.push({ frame: frame, img: img });
    });
    update();
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  document.addEventListener('shopify:section:load', init);
  init();
})();
