import React from 'react';
import { PageHero } from './shared';

type S = 'start' | 'peak' | 'end' | 'storage' | 'none';
const row = (s: S[]) => s;

const CROPS: { crop: string; category: string; temp: string; hs: string; months: S[] }[] = [
  { crop: 'برتقال صيفي فالنسيا', category: 'حمضيات وموالح', temp: '+3°C إلى +5°C', hs: '0805.10',
    months: row(['start','peak','peak','peak','peak','end','none','none','none','none','none','none']) },
  { crop: 'برتقال أبو سرة', category: 'حمضيات وموالح', temp: '+3°C إلى +5°C', hs: '0805.10',
    months: row(['peak','end','none','none','none','none','none','none','none','none','start','peak']) },
  { crop: 'تمور مجدول فاخرة', category: 'فواكه مجففة وتمرية', temp: '-18°C إلى 0°C', hs: '0804.10',
    months: row(['storage','storage','storage','storage','storage','storage','storage','none','start','peak','peak','storage']) },
  { crop: 'بصل أحمر وذهبي جاف', category: 'خضروات بصلية', temp: '+2°C إلى +4°C', hs: '0703.10',
    months: row(['none','start','peak','peak','peak','peak','peak','end','storage','storage','none','none']) },
  { crop: 'فراولة سريعة التجميد IQF', category: 'خضروات وفواكه مجمدة', temp: '-18°C تجميد مستمر', hs: '0811.10',
    months: row(['peak','peak','peak','peak','storage','storage','storage','storage','storage','storage','start','peak']) },
  { crop: 'ثوم مصري أحمر وأبيض', category: 'خضروات بصلية', temp: '0°C إلى +2°C', hs: '0703.20',
    months: row(['none','start','peak','peak','end','storage','none','none','none','none','none','none']) },
  { crop: 'رمان وندرفل تصديري', category: 'فواكه طازجة', temp: '+5°C إلى +6°C', hs: '0810.90',
    months: row(['none','none','none','none','none','none','none','start','peak','peak','end','none']) },
  { crop: 'أعشاب ونباتات طبية وبابونج', category: 'محاصيل عطرية وطبية', temp: 'جاف مهوى (<20°C)', hs: '1211.90',
    months: row(['start','peak','peak','peak','peak','storage','storage','storage','storage','storage','storage','storage']) },
];

const MONTHS = ['يناير','فبراير','مارس','إبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

const STYLE: Record<S, { bg: string; label: string }> = {
  peak: { bg: '#1f6b57', label: 'ذروة التوريد' },
  start: { bg: '#7fb59f', label: 'بداية الموسم' },
  end: { bg: '#d2a64a', label: 'نهاية الموسم' },
  storage: { bg: '#9fb0c0', label: 'متاح من التخزين المبرد' },
  none: { bg: 'transparent', label: 'خارج الموسم' },
};

export const CalendarPage: React.FC = () => {
  const current = new Date().getMonth(); // 0-11
  const nowList = CROPS.filter((c) => c.months[current] === 'peak' || c.months[current] === 'start');

  return (
    <>
      <PageHero
        eyebrow="التقويم التصديري والزراعي"
        title="مواسم الحصاد والتصدير على مدار العام"
        subtitle="مصفوفة توضح نوافذ الحصاد وذروة التوريد وتوافر التخزين المبرد لكل محصول، لتخطيط الشحنات في الوقت الأنسب."
      />

      <section className="py-14 bg-[#f7f7f1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#34483f]">
            {(['peak', 'start', 'end', 'storage', 'none'] as S[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-[#082f28]/15" style={{ background: STYLE[k].bg }} />
                {STYLE[k].label}
              </span>
            ))}
          </div>

          <div className="bg-white border border-[#082f28]/10 rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#082f28]/10 text-[#566a63] text-xs">
                  <th className="text-right font-medium p-3 w-56">المحصول</th>
                  {MONTHS.map((m, i) => (
                    <th key={m} className={`font-medium p-2 ${i === current ? 'text-[#8f6612] font-bold' : ''}`}>
                      {m}
                      {i === current && <span className="block text-[10px]">الآن</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CROPS.map((c) => (
                  <tr key={c.crop} className="border-b border-[#082f28]/10 last:border-0">
                    <td className="p-3">
                      <strong className="block text-[#082f28]">{c.crop}</strong>
                      <span className="block text-[11px] text-[#566a63]">{c.category} • HS {c.hs} • {c.temp}</span>
                    </td>
                    {c.months.map((s, i) => (
                      <td key={i} className="p-1">
                        <div
                          title={STYLE[s].label}
                          className={`h-7 rounded ${i === current ? 'ring-2 ring-[#a77a1c]/60' : ''}`}
                          style={{ background: STYLE[s].bg }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#082f28]/10 rounded-2xl p-6">
              <h3 className="text-lg text-[#082f28] mb-3">متاح للتوريد هذا الشهر ({MONTHS[current]})</h3>
              {nowList.length ? (
                <ul className="space-y-2 text-sm text-[#34483f]">
                  {nowList.map((c) => (
                    <li key={c.crop} className="flex justify-between gap-3">
                      <span>{c.crop}</span>
                      <span className="text-[#8f6612] font-bold">{STYLE[c.months[current]].label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#566a63]">لا توجد محاصيل في ذروتها هذا الشهر؛ تواصلوا معنا للاستفسار عن المخزون المبرد.</p>
              )}
            </div>
            <div className="bg-[#082f28] text-[#f7f7f1] rounded-2xl p-6 flex flex-col justify-between gap-4">
              <p className="text-sm leading-loose text-[#b6c8c0]">
                المواعيد تقريبية وتتأثر بالطقس وظروف الموسم. للحصول على جدول شحن دقيق لكمية محددة، أرسلوا لنا طلبكم.
              </p>
              <a href="/contact" className="self-start bg-[#8f6612] hover:bg-[#6f4f0f] text-white font-bold text-sm px-6 py-3 rounded-full transition-colors">
                اطلب جدول شحن وعرض سعر
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
