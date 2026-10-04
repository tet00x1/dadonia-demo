/**
 * Single source of truth for page metadata.
 * - the browser (src/App.tsx -> applySeo) updates <head> on every client-side navigation
 * - server.ts imports the same table to inject the right <head> into the HTML it sends,
 *   so crawlers and link previews (WhatsApp, Facebook, X) that don't run JS see it too.
 */
export type SeoLang = 'ar' | 'en';

export interface PageSeo {
  ar: { title: string; description: string };
  en: { title: string; description: string };
}

export const SITE_NAME = { ar: 'دادونيا للتجارة الدولية والنقل البحري', en: 'Dadonia Import & Export' };

export const PAGE_META: Record<string, PageSeo> = {
  '/': {
    ar: {
      title: 'دادونيا للتجارة الدولية والنقل البحري | تصدير السكر والزيوت والحاصلات المصرية',
      description: 'شركة مصرية متخصصة في تصدير السكر الأبيض والزيوت النباتية والحاصلات الزراعية وإدارة الشحن البحري عبر الموانئ الرئيسية، بشروط FOB وCIF.',
    },
    en: {
      title: 'Dadonia Import & Export | Egyptian Sugar, Oils & Agricultural Exports',
      description: 'Egyptian exporter of white sugar, edible oils and agricultural produce, managing sea freight through the main ports on FOB and CIF terms.',
    },
  },
  '/products': {
    ar: {
      title: 'منتجاتنا التصديرية | دادونيا للتجارة الدولية',
      description: 'حاصلات زراعية وخضروات مجمدة وقطن مصري وأعشاب وتوابل وسكر وزيوت بمواصفات فنية واضحة وشروط تسليم FOB / CIF.',
    },
    en: {
      title: 'Export Products | Dadonia Import & Export',
      description: 'Agricultural produce, frozen vegetables, Egyptian cotton, herbs and spices, sugar and oils with clear technical specifications on FOB / CIF terms.',
    },
  },
  '/about': {
    ar: {
      title: 'عن الشركة والموانئ | دادونيا للتجارة الدولية',
      description: 'تعرّف على دادونيا: كيان تجاري ولوجستي يسوّق ويصدّر الحاصلات الزراعية والصناعية المصرية ويدير سلاسل الإمداد عبر الموانئ البحرية.',
    },
    en: {
      title: 'About Dadonia | Ports & Logistics',
      description: 'Dadonia is a trading and logistics company exporting Egyptian agricultural and industrial goods and managing supply chains through the sea ports.',
    },
  },
  '/calendar': {
    ar: {
      title: 'التقويم التصديري ومواسم الحصاد | دادونيا',
      description: 'مصفوفة مواسم الحصاد وذروة التوريد وتوافر التخزين المبرد لكل محصول على مدار العام لتخطيط الشحنات في الوقت الأنسب.',
    },
    en: {
      title: 'Export Calendar & Harvest Seasons | Dadonia',
      description: 'Year-round matrix of harvest windows, peak supply and cold-storage availability for each crop, to time your shipments.',
    },
  },
  '/contact': {
    ar: {
      title: 'طلب عرض أسعار وتوريد | اتصل بدادونيا',
      description: 'أرسلوا طلب التوريد أو الاستفسار وسنعدّ لكم دراسة تسعيرية وجدول شحن مطابق لميناء الوصول وشروط الدفع المعتمدة.',
    },
    en: {
      title: 'Request a Quote | Contact Dadonia',
      description: 'Send your supply request or inquiry and we will prepare a pricing study and shipping schedule for your destination port and payment terms.',
    },
  },
  '/track': {
    ar: {
      title: 'تتبع الشحنات وبوالص الشحن | دادونيا',
      description: 'استعلموا عن وضع شحنتكم ومراحل الفحص الجمركي والإبحار بإدخال رقم البوليصة المرجعي.',
    },
    en: {
      title: 'Shipment Tracking | Dadonia',
      description: 'Check your shipment status, customs inspection and sailing stages by entering the bill of lading reference.',
    },
  },
};

export const NOT_FOUND_META = {
  ar: { title: 'الصفحة غير موجودة | دادونيا', description: 'الصفحة المطلوبة غير موجودة.' },
  en: { title: 'Page not found | Dadonia', description: 'The page you requested does not exist.' },
};

export const OG_IMAGE_PATH = '/static/img/og-image.jpg';
export const KNOWN_PATHS = Object.keys(PAGE_META);

export const normalizeSeoPath = (p: string) => {
  const t = p.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return t === '' ? '/' : t;
};

export const ORGANIZATION = {
  name: 'دادونيا للتجارة الدولية والنقل البحري',
  alternateName: 'Dadonia Import & Export',
  telephone: '+201011944092',
  email: 'donovamotors@gmail.com',
};

export function organizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION.name,
    alternateName: ORGANIZATION.alternateName,
    url: siteUrl,
    logo: `${siteUrl}/static/img/dadonia-emblem.png`,
    image: `${siteUrl}${OG_IMAGE_PATH}`,
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.telephone,
    areaServed: 'Worldwide',
    address: { '@type': 'PostalAddress', addressCountry: 'EG' },
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: ORGANIZATION.telephone,
      email: ORGANIZATION.email,
      availableLanguage: ['ar', 'en'],
    }],
  };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** The <head> block between the seo markers in index.html (used by server.ts). */
export function buildSeoHead(path: string, siteUrl: string, lang: SeoLang = 'ar'): { html: string; known: boolean } {
  const p = normalizeSeoPath(path);
  const known = p in PAGE_META;
  const m = known ? PAGE_META[p][lang] : NOT_FOUND_META[lang];
  const url = siteUrl + (p === '/' ? '/' : p);
  const img = siteUrl + OG_IMAGE_PATH;
  const jsonLd = JSON.stringify(organizationJsonLd(siteUrl)).replace(/</g, '\\u003c');
  const html = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    known ? `<meta name="robots" content="index, follow, max-image-preview:large" />` : `<meta name="robots" content="noindex, follow" />`,
    known ? `<link rel="canonical" href="${esc(url)}" />` : '',
    `<meta property="og:site_name" content="${esc(SITE_NAME[lang])}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="${lang === 'ar' ? 'ar_EG' : 'en_US'}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].filter(Boolean).join('\n    ');
  return { html, known };
}

/** Client side: keep <head> in sync after in-app navigation / language switch. */
export function applySeo(path: string, lang: SeoLang) {
  if (typeof document === 'undefined') return;
  const p = normalizeSeoPath(path);
  const known = p in PAGE_META;
  const m = known ? PAGE_META[p][lang] : NOT_FOUND_META[lang];

  const setMeta = (sel: string, attr: 'name' | 'property', key: string, value: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(sel);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute('content', value);
  };

  // origin comes from the canonical the server rendered (SITE_URL); fall back to the current origin
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const origin = (() => { try { return new URL(existing?.href || window.location.href).origin; } catch { return window.location.origin; } })();
  const url = origin + (p === '/' ? '/' : p);

  document.title = m.title;
  setMeta('meta[name="description"]', 'name', 'description', m.description);
  setMeta('meta[name="robots"]', 'name', 'robots', known ? 'index, follow, max-image-preview:large' : 'noindex, follow');
  setMeta('meta[property="og:title"]', 'property', 'og:title', m.title);
  setMeta('meta[property="og:description"]', 'property', 'og:description', m.description);
  setMeta('meta[property="og:url"]', 'property', 'og:url', url);
  setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME[lang]);
  setMeta('meta[property="og:locale"]', 'property', 'og:locale', lang === 'ar' ? 'ar_EG' : 'en_US');
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', m.title);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', m.description);

  let canon = existing;
  if (known) {
    if (!canon) { canon = document.createElement('link'); canon.rel = 'canonical'; document.head.appendChild(canon); }
    canon.href = url;
  } else if (canon) {
    canon.remove();
  }
}
