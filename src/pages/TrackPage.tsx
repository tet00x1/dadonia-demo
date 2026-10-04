import React, { useEffect, useRef, useState } from 'react';
import { Search, RefreshCw, Check } from 'lucide-react';
import { navigate, useLocation } from '../router';
import { PageHero, fetchJson, inputCls } from './shared';

interface Shipment {
  reference: string; kind_label: string; product: string; country: string; quantity: string;
  status: 'preparing' | 'shipped' | 'customs' | 'delivered'; status_label: string; notes: string;
  created_at: string; updated_at: string;
}

const STEPS: { key: Shipment['status']; label: string }[] = [
  { key: 'preparing', label: 'التجهيز والتعبئة بالمستودع' },
  { key: 'shipped', label: 'الإبحار والنقل الدولي' },
  { key: 'customs', label: 'التخليص والفحص الرقابي' },
  { key: 'delivered', label: 'التسليم النهائي' },
];
const SAMPLES = ['EGY-EXP-2026-089', 'EGY-EXP-2026-104', 'EGY-EXP-2026-118', 'EGY-EXP-2026-135'];

export const TrackPage: React.FC = () => {
  const { params } = useLocation();
  const ref = (params.get('ref') || '').trim();
  const [input, setInput] = useState(ref);
  const [state, setState] = useState<'idle' | 'loading' | 'found' | 'notfound' | 'busy' | 'error'>('idle');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [retry, setRetry] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // bring keyboard / screen-reader focus to the result once the lookup finishes
  useEffect(() => {
    if (state === 'found' || state === 'notfound' || state === 'busy' || state === 'error') {
      sectionRef.current?.querySelector<HTMLElement>('[data-track-result]')?.focus();
    }
  }, [state]);

  useEffect(() => { setInput(ref); }, [ref]);

  useEffect(() => {
    if (!ref) { setState('idle'); setShipment(null); return; }
    let cancelled = false;
    setState('loading');
    fetchJson(`/api/track/?ref=${encodeURIComponent(ref)}`)
      .then(({ status, data }) => {
        if (cancelled) return;
        if (status === 200 && data.found) { setShipment(data); setState('found'); }
        else if (status === 404) { setShipment(null); setState('notfound'); }
        else if (status === 429) { setShipment(null); setState('busy'); }
        else throw new Error('bad_status');
      })
      .catch(() => { if (!cancelled) setState('error'); });
    return () => { cancelled = true; };
  }, [ref, retry]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (v) navigate(`/track?ref=${encodeURIComponent(v)}`);
  };

  const idx = shipment ? STEPS.findIndex((s) => s.key === shipment.status) : -1;

  return (
    <>
      <PageHero
        eyebrow="نظام المتابعة الحية للشحنات"
        title="تتبع حركة الحاويات وبوالص الشحن"
        subtitle="استعلموا عن وضع شحنتكم ومراحل الفحص الجمركي والإبحار بإدخال رقم البوليصة المرجعي."
      />

      <section ref={sectionRef} className="py-14 bg-[#f7f7f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <form onSubmit={submit} className="max-w-3xl mx-auto bg-white border border-[#082f28]/10 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg text-[#082f28] mb-4">أدخل رقم بوليصة الشحن</h2>
            <div className="flex flex-wrap gap-3">
              <input
                name="ref" autoComplete="off" className={inputCls + ' flex-1 min-w-[220px] font-mono'} dir="ltr" value={input}
                onChange={(e) => setInput(e.target.value)} placeholder="EGY-EXP-2026-089" aria-label="رقم البوليصة"
              />
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-sm font-bold transition-colors">
                <Search className="w-4 h-4" /> استعلام
              </button>
            </div>
            {import.meta.env.DEV && (
            <div className="mt-4 text-xs text-[#566a63] flex flex-wrap items-center gap-2">
              <span>أرقام تجريبية:</span>
              {SAMPLES.map((s) => (
                <a key={s} href={`/track?ref=${s}`} className="font-mono underline hover:text-[#8f6612]">{s}</a>
              ))}
            </div>
            )}
          </form>

          <p className="sr-only" role="status" aria-live="polite">
            {state === 'loading' ? 'جاري الاستعلام عن الشحنة...' : state === 'found' ? 'تم العثور على الشحنة.' : state === 'notfound' ? 'رقم البوليصة غير موجود بالسجل.' : ''}
          </p>
          {state === 'loading' && <div className="max-w-3xl mx-auto h-48 rounded-2xl bg-[#eceee6] animate-pulse" aria-busy="true" />}

          {state === 'notfound' && (
            <div tabIndex={-1} data-track-result className="outline-none max-w-xl mx-auto text-center bg-white border border-[#f0c4c0] rounded-2xl p-8 space-y-3">
              <h3 className="text-lg text-[#b3372d]">رقم البوليصة غير موجود بالسجل</h3>
              <p className="text-sm text-[#34483f] leading-loose">
                لم نعثر على شحنة بالرقم <strong dir="ltr" className="font-mono">{ref}</strong>. تأكدوا من كتابة الرقم بدقة أو تواصلوا مع غرفة العمليات.
              </p>
              <a href="/contact" className="inline-block px-5 py-2.5 rounded-full bg-[#082f28] hover:bg-[#0e3b32] text-white text-sm font-bold transition-colors">التواصل مع غرفة العمليات</a>
            </div>
          )}

          {state === 'busy' && (
            <div tabIndex={-1} data-track-result className="outline-none max-w-xl mx-auto text-center bg-white border border-[#082f28]/10 rounded-2xl p-8 space-y-4">
              <p className="text-sm text-[#34483f] leading-loose">عدد كبير من الاستعلامات في وقت قصير. يرجى الانتظار دقيقة ثم المحاولة مجدداً.</p>
              <button onClick={() => setRetry((n) => n + 1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-sm font-bold transition-colors">
                <RefreshCw className="w-4 h-4" /> إعادة المحاولة
              </button>
            </div>
          )}

          {state === 'error' && (
            <div tabIndex={-1} data-track-result className="outline-none max-w-xl mx-auto text-center bg-white border border-[#082f28]/10 rounded-2xl p-8 space-y-4">
              <p className="text-sm text-[#34483f] leading-loose">تعذّر الاتصال بنظام التتبع الآن. حاولوا مجدداً بعد لحظات.</p>
              <button onClick={() => setRetry((n) => n + 1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-sm font-bold transition-colors">
                <RefreshCw className="w-4 h-4" /> إعادة المحاولة
              </button>
            </div>
          )}

          {state === 'found' && shipment && (
            <div tabIndex={-1} data-track-result className="outline-none max-w-4xl mx-auto bg-white border border-[#082f28]/10 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
              <div className="flex flex-wrap justify-between gap-4 pb-5 border-b-2 border-[#a77a1c]/50">
                <div>
                  <span className="font-mono text-lg font-bold text-[#082f28]">{shipment.reference}</span>
                  <h2 className="text-2xl text-[#082f28] mt-1">{shipment.product}</h2>
                  <p className="text-sm text-[#566a63] mt-1">
                    نوع العملية: <strong>{shipment.kind_label}</strong> • الوجهة / المصدر: <strong>{shipment.country}</strong>
                  </p>
                </div>
                <span className="self-start px-4 py-2 rounded-full bg-[#eceee6] text-[#082f28] text-sm font-bold">{shipment.status_label}</span>
              </div>

              <ol className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STEPS.map((s, i) => {
                  const done = i < idx || (shipment.status === 'delivered' && i === idx);
                  const active = i === idx && !done;
                  return (
                    <li key={s.key} className="flex flex-col items-center text-center gap-2">
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                        done ? 'bg-[#1f6b57] border-[#1f6b57] text-white' : active ? 'border-[#a77a1c] text-[#8f6612] bg-[#a77a1c]/10' : 'border-[#082f28]/15 text-[#566a63]'
                      }`}>
                        {done ? <Check className="w-5 h-5" /> : i + 1}
                      </span>
                      <span className={`text-xs leading-snug ${done || active ? 'text-[#082f28] font-bold' : 'text-[#566a63]'}`}>{s.label}</span>
                    </li>
                  );
                })}
              </ol>

              <dl className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-[#f7f7f1] rounded-xl p-5 text-sm">
                {[
                  ['الكمية ومواصفة الحاوية', shipment.quantity],
                  ['تاريخ إنشاء الشحنة', shipment.created_at],
                  ['آخر تحديث', shipment.updated_at],
                  ['التوثيق الجمركي', 'نظام نافذة ACI'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-[#566a63] mb-0.5">{k}</dt>
                    <dd className="font-mono font-bold text-[#082f28] text-[13px]">{v}</dd>
                  </div>
                ))}
              </dl>

              {shipment.notes && (
                <div className="rounded-xl border border-[#082f28]/10 p-5">
                  <h4 className="text-sm font-bold text-[#082f28] mb-2">ملاحظات الميناء والمتابعة الميدانية</h4>
                  <p className="text-sm text-[#34483f] leading-loose">{shipment.notes}</p>
                </div>
              )}

              <div className="flex flex-wrap justify-between items-center gap-3">
                <a href={`/contact?ref=${encodeURIComponent(shipment.reference)}`} className="px-5 py-2.5 rounded-full border border-[#082f28]/15 text-[#082f28] text-sm font-medium hover:border-[#a77a1c] hover:text-[#8f6612] transition-colors">
                  استفسار عن مستندات هذه الشحنة
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
