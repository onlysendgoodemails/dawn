/* AP5a: Dialogfenster der Größentabelle (snippets/custom-size-guide.liquid).
   Öffnen über den Link "Größentabelle", Schließen über Kreuz, Escape oder Klick neben das Fenster. */
(function () {
  function close(dialog) {
    if (dialog && dialog.open) dialog.close();
  }

  function bind() {
    document.querySelectorAll('[data-size-guide-open]').forEach(function (button) {
      if (button.dataset.sizeGuideBound) return;
      button.dataset.sizeGuideBound = 'true';
      button.addEventListener('click', function () {
        var dialog = document.getElementById(button.dataset.sizeGuideOpen);
        if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
      });
    });

    document.querySelectorAll('dialog.custom-size-guide').forEach(function (dialog) {
      if (dialog.dataset.sizeGuideBound) return;
      dialog.dataset.sizeGuideBound = 'true';
      var closeButton = dialog.querySelector('[data-size-guide-close]');
      if (closeButton) closeButton.addEventListener('click', function () { close(dialog); });
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) close(dialog);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
  document.addEventListener('shopify:section:load', bind);
})();
