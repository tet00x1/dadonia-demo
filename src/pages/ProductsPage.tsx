import React, { useEffect, useState } from 'react';
import { Package, Search, RefreshCw, MessageCircle } from 'lucide-react';
import { navigate, useLocation } from '../router';
import { PageHero, fetchJson, inputCls, whatsappLink } from './shared';

interface Product {
  id: number; name: string; category: string; category_label: string; description: string;
  origin: string; hs_code: string; harvest_season: string; packaging_type: string;
  temperature_range: string; caliber_specs: string; image: string | null;
}
interface Cat { code: string; label: string; count: number }

export const ProductsPage: React.FC = () => {
  const { params } = useLocation();
  const category = params.get('category') || '';
  const urlQ = params.get('q') || '';

  const [q, setQ] = useState(urlQ);
  const [debouncedQ, setDebouncedQ] = useState(urlQ);
  const [products, setProducts] = useState<Product[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [reload, setReload] = useState(0);

  useEffect(() => { const t = setTimeout(() => setDebouncedQ(q.trim()), 300); return () => clearTimeout(t); }, [q]);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    const qs = new URLSearchParams();
    if (category) qs.set('category', category);
    if (debouncedQ) qs.set('q', debouncedQ);
    fetchJson<{ products: Product[]; categories: Cat[] }>(`/api/products/?${qs}`)
      .then(({ status, data }) => {
        if (cancelled) return;
        if (status !== 200) throw new Error('bad_status');
        setProducts(data.products);
        setCats(data.categories);
        setState('ok');
      })
      .catch(() => { if (!cancelled) setState('error'); });
    return () => { cancelled = true; };
  }, [category, debouncedQ, reload]);

  const pick = (code: string) => navigate(code ? `/products?category=${code}` : '/products');

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors ${
      active ? 'bg-[#082f28] text-white border-[#082f28]' : 'bg-white text-[#34483f] border-[#082f28]/15 hover:border-[#a77a1c] hover:text-[#8f6612]'
    }`;

  return (
    <>
      <PageHero
        eyebrow="دليل المنتجات والتصدير"
        title="منتجاتنا التصديرية"
        subtitle="حاصلات زراعية وسلع استراتيجية ومنتجات صناعية بمواصفات فنية واضحة وشروط تسليم FOB / CIF."
      />

      <section className="py-14 bg-[#f7f7f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[#566a63] absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none" />
              <input
                className={inputCls + ' pr-11'} value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث عن منتج أو بلد منشأ..." aria-label="بحث في المنتجات"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className={chip(!category)} onClick={() => pick('')}>الكل</button>
              {cats.map((c) => (
                <button key={c.code} className={chip(category === c.code)} onClick={() => pick(c.code)}>
                  {c.label} <span className="opacity-60 text-xs">({c.count})</span>
                </button>
              ))}
            </div>
          </div>

          {state === 'loading' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" aria-busy="true">
              {[0, 1, 2].map((i) => <div key={i} className="h-72 rounded-2xl bg-[#eceee6] animate-pulse" />)}
            </div>
          )}

          {state === 'error' && (
            <div className="bg-white border border-[#082f28]/10 rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto">
              <p className="text-[#34483f] text-sm leading-loose">تعذّر تحميل قائمة المنتجات الآن. يمكنكم إعادة المحاولة أو التواصل معنا مباشرة.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => setReload((n) => n + 1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-sm font-bold transition-colors">
                  <RefreshCw className="w-4 h-4" /> إعادة المحاولة
                </button>
                <a href={whatsappLink('أرغب في الاستفسار عن المنتجات المتاحة للتصدير')} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebd5a] text-white text-sm font-bold transition-colors">
                  <MessageCircle className="w-4 h-4" /> واتساب
                </a>
              </div>
            </div>
          )}

          {state === 'ok' && products.length === 0 && (
            <div className="bg-white border border-[#082f28]/10 rounded-2xl p-10 text-center space-y-3 max-w-xl mx-auto">
              <p className="text-[#34483f] text-sm">لا توجد منتجات مطابقة لبحثكم حالياً.</p>
              <a href="/contact" className="inline-block px-5 py-2.5 rounded-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-sm font-bold transition-colors">اطلبوا منتجاً غير مدرج</a>
            </div>
          )}

          {state === 'ok' && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => {
                const specs: [string, string][] = ([
                  ['بلد المنشأ', p.origin], ['الرمز الجمركي HS', p.hs_code], ['موسم التصدير', p.harvest_season],
                  ['التعبئة', p.packaging_type], ['درجة حرارة النقل', p.temperature_range], ['المعايرة', p.caliber_specs],
                ] as [string, string][]).filter(([, v]) => v);
                return (
                  <article key={p.id} className="bg-white border border-[#082f28]/10 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-44 bg-[#eceee6] flex items-center justify-center overflow-hidden">
                      {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" /> : <Package className="w-12 h-12 text-[#8f6612]/60" />}
                    </div>
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <span className="text-[11px] font-bold text-[#8f6612]">{p.category_label}</span>
                      <h3 className="text-lg font-bold text-[#082f28] leading-snug">{p.name}</h3>
                      <p className="text-xs text-[#34483f] leading-relaxed line-clamp-3">{p.description}</p>
                      {specs.length > 0 && (
                        <dl className="text-xs grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-[#082f28]/10 pt-3">
                          {specs.map(([k, v]) => (
                            <React.Fragment key={k}>
                              <dt className="text-[#566a63]">{k}</dt>
                              <dd className="text-[#082f28] font-medium">{v}</dd>
                            </React.Fragment>
                          ))}
                        </dl>
                      )}
                      <a
                        href={`/contact?message=${encodeURIComponent(`استفسار بشأن توريد وتصدير: ${p.name} (${p.category_label})`)}`}
                        className="mt-auto self-start px-5 py-2.5 rounded-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-xs font-bold transition-colors"
                      >
                        اطلب عرض سعر
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
