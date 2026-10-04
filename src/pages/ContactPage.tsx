import React, { useEffect, useRef, useState } from 'react';
import { Phone, Mail, Clock, MessageCircle, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { useLocation } from '../router';
import { PageHero, CONTACT, whatsappLink, fetchJson, inputCls } from './shared';

const PRODUCT_NAMES: Record<string, string> = {
  sugar: 'سكر أبيض نقي ICUMSA 45',
  sunflower_oil: 'زيوت دوار الشمس النقية',
};

type Fields = { name: string; phone: string; email: string; message: string };
type Status = 'idle' | 'sending' | 'done' | 'offline';

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = 'يرجى إدخال اسم صحيح لا يقل عن حرفين.';
  if (f.phone.replace(/[^\d+]/g, '').length < 7) e.phone = 'يرجى إدخال رقم هاتف صحيح لا يقل عن 7 أرقام.';
  if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'يرجى إدخال بريد إلكتروني صحيح.';
  if (f.message.trim().length < 10) e.message = 'يرجى توضيح تفاصيل الطلب بحيث لا تقل الرسالة عن 10 أحرف.';
  return e;
}

export const ContactPage: React.FC = () => {
  const { params } = useLocation();
  const [form, setForm] = useState<Fields>({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [serverMsg, setServerMsg] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [ticket, setTicket] = useState<string>('');
  const [honey, setHoney] = useState('');
  const doneRef = useRef<HTMLHeadingElement>(null);

  const FIELD_ORDER: (keyof Fields)[] = ['name', 'phone', 'email', 'message'];
  const focusFirstInvalid = (errs: Partial<Record<keyof Fields, string>>) => {
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (first) requestAnimationFrame(() => document.getElementById(`contact-${first}`)?.focus());
  };

  // after a successful send move focus to the confirmation so screen-reader / keyboard users land on it
  useEffect(() => { if (status === 'done') doneRef.current?.focus(); }, [status]);

  // Pre-fill the message when arriving from a product / offer / shipment button
  useEffect(() => {
    const msg = params.get('message');
    const product = params.get('product');
    const ref = params.get('ref');
    let initial = '';
    if (msg) initial = msg.slice(0, 1000);
    else if (product) initial = `استفسار بشأن توريد وتصدير: ${PRODUCT_NAMES[product] ?? product}`;
    else if (ref) initial = `استفسار عن مستندات الشحنة رقم ${ref}`;
    if (initial) setForm((f) => ({ ...f, message: initial }));
  }, [params]);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMsg('');
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) { focusFirstInvalid(v); return; }

    setStatus('sending');
    try {
      const { data } = await fetchJson('/api/inquiry/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website_url: honey }),
      });
      if (data.ok) {
        setTicket(data.reference || '');
        setStatus('done');
        return;
      }
      if (data.error === 'validation') { setErrors(data.fields || {}); focusFirstInvalid(data.fields || {}); }
      setServerMsg(
        data.message ||
          (data.error === 'validation'
            ? 'يرجى مراجعة وتصحيح الحقول الموضحة أدناه.'
            : 'تعذّر إرسال الطلب الآن. يرجى المحاولة مجدداً أو التواصل معنا عبر واتساب.'),
      );
      setStatus('idle');
    } catch {
      setStatus('offline');
    }
  };

  const waText = `السلام عليكم، أنا ${form.name || '...'}\n${form.message}\nهاتف: ${form.phone}`;

  return (
    <>
      <PageHero
        eyebrow="قسم المبيعات والتجارة الخارجية"
        title="طلب عرض أسعار وتوريد سلع"
        subtitle="موافاتنا بالبيانات المطلوبة تتيح لنا إعداد دراسة تسعيرية وجدول شحن تفصيلي مطابق لميناء الوصول وشروط الدفع المعتمدة."
      />

      <section className="py-16 bg-[#f7f7f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 bg-white border border-[#082f28]/10 rounded-2xl p-6 sm:p-8 shadow-sm">
            {status === 'done' ? (
              <div className="text-center py-10 space-y-4" role="status">
                <CheckCircle2 className="w-14 h-14 text-[#2f8f6b] mx-auto" aria-hidden="true" />
                <h2 ref={doneRef} tabIndex={-1} className="text-2xl text-[#082f28] outline-none">تم استلام طلبكم بنجاح</h2>
                <p className="text-[#34483f] text-sm leading-loose">
                  {ticket && <>رقم المرجع <strong className="font-mono" dir="ltr">{ticket}</strong>. </>}سيتواصل معكم مسؤول قسم التجارة الخارجية والعمليات خلال ساعات العمل الرسمية.
                </p>
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <a href="/" className="px-6 py-3 rounded-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-sm font-bold transition-colors">
                    العودة للرئيسية
                  </a>
                  <button
                    onClick={() => { setForm({ name: '', phone: '', email: '', message: '' }); setStatus('idle'); }}
                    className="px-6 py-3 rounded-full border border-[#082f28]/15 text-[#082f28] text-sm font-medium hover:border-[#a77a1c] transition-colors"
                  >
                    إرسال طلب آخر
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div>
                  <h2 className="text-2xl text-[#082f28] pb-3 border-b-2 border-[#a77a1c]/60">نموذج طلب التوريد والاستفسار الرسمي</h2>
                  <p className="text-xs text-[#566a63] mt-3">الحقول المؤشر عليها بـ (*) إلزامية.</p>
                </div>

                {serverMsg && (
                  <div role="alert" className="flex gap-2 items-start bg-[#fdf3f2] border border-[#f0c4c0] text-[#9b2c24] rounded-xl p-3 text-sm">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{serverMsg}</span>
                  </div>
                )}

                {status === 'offline' && (
                  <div role="alert" className="bg-[#fff8e6] border border-[#ecd28b] text-[#6b4d0a] rounded-xl p-4 text-sm leading-loose space-y-3">
                    <p>تعذّر الوصول لخادم الطلبات الآن، ولم يتم إرسال النموذج. يمكنكم إرسال نفس الطلب مباشرة عبر واتساب أو إعادة المحاولة بعد لحظات.</p>
                    <a
                      href={whatsappLink(waText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold px-5 py-2.5 rounded-full transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> أرسل الطلب عبر واتساب
                    </a>
                  </div>
                )}

                {/* honeypot — hidden from humans */}
                <input
                  type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  value={honey} onChange={(e) => setHoney(e.target.value)}
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                />

                <Field id="contact-name" label="اسم العميل / اسم المؤسسة" required error={errors.name}>
                  <input name="name" autoComplete="name" className={inputCls} value={form.name} onChange={set('name')} placeholder="الاسم بالكامل أو اسم الشركة المستوردة" />
                </Field>
                <Field id="contact-phone" label="رقم الهاتف / الواتساب الدولي" required error={errors.phone}>
                  <input name="phone" autoComplete="tel" className={inputCls} dir="ltr" inputMode="tel" value={form.phone} onChange={set('phone')} placeholder="+201012345678" />
                </Field>
                <Field id="contact-email" label="البريد الإلكتروني (اختياري)" error={errors.email}>
                  <input name="email" autoComplete="email" className={inputCls} dir="ltr" type="email" value={form.email} onChange={set('email')} placeholder="name@company.com" />
                </Field>
                <Field id="contact-message" label="تفاصيل الاستفسار أو طلب التوريد" required error={errors.message}>
                  <textarea
                    name="message" className={inputCls + ' resize-y'} rows={6} value={form.message} onChange={set('message')}
                    placeholder="اذكر المنتجات المطلوبة، الكميات التقريبية، ميناء الوصول، وشروط الشحن المفضلة (FOB/CIF)..."
                  />
                </Field>

                <button
                  type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#8f6612] hover:bg-[#6f4f0f] disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {status === 'sending' ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              </form>
            )}
          </div>

          {/* Side column */}
          <aside className="lg:col-span-2 space-y-5">
            <div className="bg-[#082f28] text-[#f7f7f1] rounded-2xl p-6 space-y-4">
              <h3 className="text-lg text-[#e2bc55]">قنوات التواصل المباشر</h3>
              <a href={`tel:${CONTACT.phone1}`} dir="ltr" className="flex items-center gap-3 text-sm hover:text-[#e2bc55] transition-colors">
                <Phone className="w-4 h-4 text-[#e2bc55]" /> <span className="font-mono">{CONTACT.phone1Label}</span>
              </a>
              <a href={`tel:${CONTACT.phone2}`} dir="ltr" className="flex items-center gap-3 text-sm hover:text-[#e2bc55] transition-colors">
                <Phone className="w-4 h-4 text-[#e2bc55]" /> <span className="font-mono">{CONTACT.phone2Label}</span>
              </a>
              <a href={`mailto:${CONTACT.email}`} dir="ltr" className="flex items-center gap-3 text-sm hover:text-[#e2bc55] transition-colors">
                <Mail className="w-4 h-4 text-[#e2bc55]" /> {CONTACT.email}
              </a>
              <a
                href={whatsappLink()} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-sm px-5 py-2.5 rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> تواصل واتساب
              </a>
            </div>
            <div className="bg-white border border-[#082f28]/10 rounded-2xl p-6 space-y-3">
              <h3 className="text-lg text-[#082f28]">ساعات العمل</h3>
              <p className="flex items-start gap-2 text-sm text-[#34483f] leading-relaxed">
                <Clock className="w-4 h-4 mt-1 text-[#8f6612] shrink-0" /> {CONTACT.hours}
              </p>
              <p className="text-xs text-[#566a63] leading-relaxed">
                عضوية الغرفة التجارية المصرية بالإسكندرية - شعبة المصدرين.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

const Field: React.FC<{ id: string; label: string; required?: boolean; error?: string; children: React.ReactElement<any> }> = ({ id, label, required, error, children }) => {
  const errId = `${id}-error`;
  const control = React.cloneElement(children, {
    id,
    'aria-required': required ? true : undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errId : undefined,
  });
  return (
    <div className="block">
      <label htmlFor={id} className="block text-sm font-medium text-[#082f28] mb-1.5">
        {label} {required && <span className="text-[#8f6612]" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (إلزامي)</span>}
      </label>
      {control}
      {error && <span id={errId} className="block text-xs text-[#b3372d] mt-1">{error}</span>}
    </div>
  );
};
