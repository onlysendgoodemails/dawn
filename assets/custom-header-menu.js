/* Active-state for the anchor links of the flat desktop header menu
   (snippets/custom-header-menu.liquid): marks the link whose section (e.g. /#shirts) is currently
   under the sticky header with aria-current="true" (styled in custom-header-menu.css). Only links
   that point at an element on the current page are touched; all other links stay as they are. */

(() => {
  const links = Array.from(document.querySelectorAll('.custom-header-menu a[href*="#"]'))
    .map((link) => {
      const url = new URL(link.getAttribute('href'), window.location.href);
      const samePage = url.origin === window.location.origin && url.pathname === window.location.pathname;
      const el = samePage && url.hash.length > 1 ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  if (!links.length) return;

  // Shopify may flag "/#anchor" links as the current page; on this page the scroll position decides.
  links.forEach(({ link }) => {
    link.removeAttribute('aria-current');
    link.querySelector('.header__active-menu-item')?.classList.remove('header__active-menu-item');
  });

  // Anchor jumps land at header height + 1.6rem (scroll-padding-top in sections/custom-header.liquid).
  const offset = () => {
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
    return header + 20;
  };

  let ticking = false;

  const update = () => {
    ticking = false;
    const line = offset();
    const current = links.find(({ el }) => {
      const rect = el.getBoundingClientRect();
      return rect.top <= line && rect.bottom > line;
    });

    links.forEach(({ link }) => {
      if (current && link === current.link) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
})();
