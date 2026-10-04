import { useEffect } from 'react';

/**
 * Adds a soft fade-up reveal to the content blocks of every section after the hero.
 * Elements that already animate through framer-motion (inline opacity/transform) are skipped.
 */
export function useScrollReveal(routeKey: string = '/') {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = new Set<HTMLElement>();
    document
      .querySelectorAll<HTMLElement>('main > section:not([data-hero]) > div > *, main > section:not([data-hero]) .grid > *')
      .forEach((el) => {
        if (el.style.opacity !== '' || el.style.transform !== '') return;
        targets.add(el);
      });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach((el) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children) : [el];
      const idx = Math.min(siblings.indexOf(el), 6);
      el.style.setProperty('--reveal-delay', `${idx * 90}ms`);
      el.classList.add('reveal');
      io.observe(el);
    });

    return () => io.disconnect();
  }, [routeKey]);
}
