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
      var first = group.querySelector('input[type="radio"]:not(.disabled)');
      if (first) first.focus();
    },
    true
  );

  document.addEventListener('change', function (event) {
    var input = event.target;
    if (!input || !input.matches || !input.matches('.custom-size-picker__input')) return;
    var group = input.closest('fieldset.custom-size-picker');
    if (group) hideError(group);
  });
})();
