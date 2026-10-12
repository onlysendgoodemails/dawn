/* Kaufbox der Produktseite (sections/custom-product.liquid, snippets/custom-size-picker.liquid).
   Ohne gewählte Größe blockiert dieses Skript das Absenden des Produktformulars, zeigt "Bitte Größe wählen"
   an der Größenreihe und rückt den Fokus auf das erste Feld. Die Auswahl einer Größe blendet den Hinweis wieder aus.
   Der Listener sitzt in der Capture-Phase am Dokument und läuft damit vor dem Absende-Handler von Dawn
   (assets/product-form.js), der sonst die erste Variante in den Warenkorb legen würde. */
(function () {
  function sizeGroups(form) {
    var section = form.id.replace('product-form-', '');
    var root = document.getElementById('variant-selects-' + section);
    return root ? root.querySelectorAll('fieldset.custom-size-picker') : [];
  }

  function missingGroup(form) {
    var groups = sizeGroups(form);
    for (var i = 0; i < groups.length; i++) {
      if (!groups[i].querySelector('input[type="radio"]:checked')) return groups[i];
    }
    return null;
  }

  function hideError(group) {
    group.classList.remove('custom-size-picker--error');
    var error = group.querySelector('.custom-size-picker__error');
    if (error) error.hidden = true;
  }

  document.addEventListener(
    'submit',
    function (event) {
      var form = event.target;
      if (!form || !form.id || form.id.indexOf('product-form-') !== 0) return;
      var group = missingGroup(form);
      if (!group) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      group.classList.add('custom-size-picker--error');
      var error = group.querySelector('.custom-size-picker__error');
      if (error) error.hidden = false;
      group.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var first = group.querySelector('input[type="radio"]:not(.disabled)');
      if (first) first.focus({ preventScroll: true });
    },
    true
  );

  document.addEventListener('change', function (event) {
    var input = event.target;
    if (!input || !input.matches || !input.matches('.custom-size-picker__input')) return;
    var group = input.closest('fieldset.custom-size-picker');
    if (group) hideError(group);
  });

  /* Sticky-Kaufbutton (nur mobil sichtbar, siehe .custom-sticky-buy in assets/custom-product.css):
     spiegelt Text und Zustand des echten Buttons und erscheint nur, solange der echte Button noch unter dem Sichtfeld liegt. */
  function initSticky() {
    var bar = document.querySelector('[data-custom-sticky-buy]');
    if (!bar) return;
    var section = bar.getAttribute('data-section');
    var button = bar.querySelector('button');
    var label = button.querySelector('span');

    function real() {
      return document.getElementById('ProductSubmitButton-' + section);
    }

    function sync() {
      var source = real();
      if (!source) return;
      var text = source.querySelector('span');
      label.textContent = text ? text.textContent.trim() : '';
      if (source.hasAttribute('disabled')) button.setAttribute('disabled', 'disabled');
      else button.removeAttribute('disabled');
    }

    var source = real();
    if (!source) return;
    sync();
    if ('MutationObserver' in window) {
      new MutationObserver(sync).observe(source, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (entries) {
      var entry = entries[entries.length - 1];
      var below = entry.boundingClientRect.top > (entry.rootBounds ? entry.rootBounds.height : window.innerHeight);
      bar.classList.toggle('is-visible', !entry.isIntersecting && below);
    }).observe(source);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSticky);
  else initSticky();

  /* Sticky-Kaufbox am Desktop: Ist sie höher als das Fenster, wird "top" negativ gesetzt. Die Box läuft dann mit der Seite,
     bis ihr unteres Ende im Fenster ist, und bleibt dort stehen. So ist alles erreichbar, ohne eigenen Scrollbalken.
     Neu berechnet bei Größenänderung des Fensters und der Box (zum Beispiel beim Aufklappen eines Akkordeons). */
  function initStickyColumn() {
    var box = document.querySelector('.product__info-container.product__column-sticky');
    if (!box) return;
    var desktop = window.matchMedia('(min-width: 990px)');

    function update() {
      if (!desktop.matches) {
        box.style.top = '';
        return;
      }
      var header = document.querySelector('sticky-header') || document.querySelector('.section-header');
      var headerHeight = header ? header.offsetHeight : 0;
      var gap = 20;
      var top = Math.min(headerHeight + gap, window.innerHeight - box.offsetHeight - gap);
      box.style.top = top + 'px';
    }

    update();
    window.addEventListener('resize', update);
    if (typeof desktop.addEventListener === 'function') desktop.addEventListener('change', update);
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(box);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStickyColumn);
  else initStickyColumn();
})();
