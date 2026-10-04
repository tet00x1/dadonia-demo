import { useSyncExternalStore } from 'react';
import en from './en.json';

export type Lang = 'ar' | 'en';
export type Theme = 'light' | 'dark';

const dict = en as Record<string, string>;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const ATTRS = ['alt', 'aria-label', 'title', 'placeholder'];

const read = <T extends string>(k: string, ok: T[], fb: T): T => {
  try { const v = localStorage.getItem(k) as T; return ok.includes(v) ? v : fb; } catch { return fb; }
};
const state = {
  lang: read<Lang>('dadonia-lang', ['ar', 'en'], 'ar'),
  theme: read<Theme>('dadonia-theme', ['light', 'dark'], 'light'),
};
const listeners = new Set<() => void>();
const origText = new WeakMap<Node, string>();

function translateNode(n: Node) {
  const v = n.nodeValue ?? '';
  if (state.lang === 'en') {
    const k = norm(v);
    const t = dict[k];
    if (t) {
      if (!origText.has(n)) origText.set(n, v);
      n.nodeValue = (v.match(/^\s*/)![0]) + t + (v.match(/\s*$/)![0]);
    }
  } else if (origText.has(n)) {
    n.nodeValue = origText.get(n)!;
    origText.delete(n);
  }
}

function translateAttrs(el: Element) {
  for (const a of ATTRS) {
    const key = `data-i18n-${a}`;
    const cur = el.getAttribute(a);
    if (state.lang === 'en') {
      if (cur && dict[norm(cur)]) {
        if (!el.hasAttribute(key)) el.setAttribute(key, cur);
        el.setAttribute(a, dict[norm(cur)]);
      }
    } else if (el.hasAttribute(key)) {
      el.setAttribute(a, el.getAttribute(key)!);
      el.removeAttribute(key);
    }
  }
}

function walk(root: Node) {
  if (root.nodeType === Node.TEXT_NODE) return translateNode(root);
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const el = root as Element;
  if (['SCRIPT', 'STYLE'].includes(el.tagName)) return;
  translateAttrs(el);
  el.childNodes.forEach(walk);
}

let observer: MutationObserver | null = null;
function startObserver() {
  if (observer || typeof document === 'undefined') return;
  observer = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === 'characterData') translateNode(m.target);
      else if (m.type === 'attributes') translateAttrs(m.target as Element);
      else m.addedNodes.forEach(walk);
    }
  });
  observer.observe(document.body, {
    childList: true, subtree: true, characterData: true,
    attributes: true, attributeFilter: ATTRS,
  });
}

function apply() {
  const h = document.documentElement;
  h.lang = state.lang;
  h.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  h.classList.toggle('dark', state.theme === 'dark');
  h.style.colorScheme = state.theme;
  document.title = state.lang === 'en'
    ? 'Dadonia International Trade & Shipping'
    : 'دادونيا للتجارة الدولية والنقل البحري';
  walk(document.body);
  startObserver();
}

const emit = () => listeners.forEach((l) => l());
export function setLang(l: Lang) {
  state.lang = l;
  try { localStorage.setItem('dadonia-lang', l); } catch {}
  apply(); emit();
}
export function setTheme(t: Theme) {
  state.theme = t;
  try { localStorage.setItem('dadonia-theme', t); } catch {}
  apply(); emit();
}
export function initI18n() {
  apply();
}
const sub = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
export const useLang = () => useSyncExternalStore(sub, () => state.lang);
export const useTheme = () => useSyncExternalStore(sub, () => state.theme);
