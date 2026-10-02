/* Mobile category tab bar (sections/custom-category-nav.liquid): marks the tab whose category
   block is currently under the sticky header (aria-current), keeps it scrolled into view inside
   the horizontal bar, and publishes the bar height as --category-nav-height for the anchor
   scroll offset. */

if (!customElements.get('category-nav')) {
  customElements.define(
    'category-nav',
    class CategoryNav extends HTMLElement {
      connectedCallback() {
        this.scroller = this.querySelector('.custom-category-nav__scroller');
        this.links = Array.from(this.querySelectorAll('.custom-category-nav__link'));
        this.sections = this.links
          .map((link) => ({ link, el: document.getElementById(link.dataset.target) }))
          .filter((entry) => entry.el);

        this.onResize = this.setHeight.bind(this);
        this.setHeight();
        window.addEventListener('resize', this.onResize);

        if (!this.sections.length || !('IntersectionObserver' in window)) return;

        this.visible = new Set();
        this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
          // Band just below header + tab bar; a block is "current" while it overlaps that band.
          rootMargin: this.bandMargin(),
          threshold: 0,
        });
        this.sections.forEach(({ el }) => this.observer.observe(el));
      }

      disconnectedCallback() {
        window.removeEventListener('resize', this.onResize);
        if (this.observer) this.observer.disconnect();
      }

      stickyOffset() {
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0;
        return Math.round(header + this.offsetHeight);
      }

      bandMargin() {
        // top edge = bottom of the sticky stack, bottom edge = just below it (1px band)
        const top = this.stickyOffset() + 1;
        return `-${top}px 0px ${top + 1 - window.innerHeight}px 0px`;
      }

      setHeight() {
        document.documentElement.style.setProperty('--category-nav-height', `${this.offsetHeight}px`);
        if (this.observer) {
          // rootMargin is fixed at construction; rebuild when the layout changed.
          this.observer.disconnect();
          this.observer = new IntersectionObserver(this.onIntersect.bind(this), {
            rootMargin: this.bandMargin(),
            threshold: 0,
          });
          this.visible.clear();
          this.sections.forEach(({ el }) => this.observer.observe(el));
        }
      }

      onIntersect(entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) this.visible.add(entry.target.id);
          else this.visible.delete(entry.target.id);
        });

        const current = this.sections.find(({ el }) => this.visible.has(el.id));
        this.links.forEach((link) => {
          if (current && link === current.link) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });

        if (current) this.revealLink(current.link);
      }

      revealLink(link) {
        const scroller = this.scroller;
        if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;
        const target = link.offsetLeft - (scroller.clientWidth - link.offsetWidth) / 2;
        scroller.scrollTo({ left: target, behavior: 'smooth' });
      }
    }
  );
}
