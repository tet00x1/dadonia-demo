import { useMemo, useSyncExternalStore } from 'react';

/** Pages that live inside the React app (everything else is left to the browser/Django). */
export const APP_ROUTES = ['/', '/products', '/about', '/calendar', '/contact', '/track'];

export const normalizePath = (p: string) => {
  const t = p.replace(/\/+$/, '');
  return t === '' ? '/' : t;
};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const snapshot = () => normalizePath(window.location.pathname) + window.location.search;
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function scrollToHash(hash: string, tries = 0) {
  if (!hash || hash === '#') return;
  const el = document.querySelector(hash);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else if (tries < 20) {
    // the target page may still be mounting
    setTimeout(() => scrollToHash(hash, tries + 1), 50);
  }
}

/** Client-side navigation. Falls back to a normal page load for non-app URLs. */
export function navigate(to: string) {
  let url: URL;
  try {
    url = new URL(to, window.location.origin);
  } catch {
    window.location.href = to;
    return;
  }
  const path = normalizePath(url.pathname);
  if (url.origin !== window.location.origin || !APP_ROUTES.includes(path)) {
    window.location.href = to;
    return;
  }
  const samePage = path === normalizePath(window.location.pathname) && url.search === window.location.search;
  if (!samePage) {
    window.history.pushState({}, '', path + url.search + url.hash);
    emit();
    if (!url.hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }
  if (url.hash) scrollToHash(url.hash);
  else if (samePage) window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function useLocation() {
  const snap = useSyncExternalStore(subscribe, snapshot, () => '/');
  return useMemo(() => {
    const i = snap.indexOf('?');
    const path = i === -1 ? snap : snap.slice(0, i);
    const params = new URLSearchParams(i === -1 ? '' : snap.slice(i));
    return { path, params };
  }, [snap]);
}

let installed = false;
/** Makes every plain <a href="/contact/..."> in the app navigate without a full reload. */
export function installRouter() {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  window.addEventListener('popstate', emit);

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    if (a.origin !== window.location.origin) return;
    if (!APP_ROUTES.includes(normalizePath(a.pathname))) return;
    e.preventDefault();
    navigate(a.pathname + a.search + a.hash);
  });
}
