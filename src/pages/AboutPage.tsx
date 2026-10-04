import React from 'react';
import { ShieldCheck, Ship } from 'lucide-react';
import { PageHero } from './shared';
import warehouse from '../assets/images/warehouse_sugar_pallets_1790849593865.webp';
import port from '../assets/images/port_crane_ship_loading_1790849623149.webp';

const STANDARDS = [
  'شهادة الممارسات الزراعية الجيدة العالمية (GlobalG.A.P).',
  'نظام إدارة سلامة الغذاء (ISO 22000:2018).',
  'الفحص المعتمد من الهيئة القومية لسلامة الغذاء المصرية (NFSA).',
  'شهادات خلو من متبقيات المبيدات والإشعاع من المعامل المركزية المعتمدة.',
];

const PORTS = [
  { name: 'ميناء الإسكندرية والدخيلة', text: 'المركز الرئيسي لشحنات الموالح والحاصلات الزراعية المتجهة إلى البحر المتوسط وأوروبا الشمالية.', tag: 'ACCHCO / TMT' },
  { name: 'ميناء دمياط البحري', text: 'محطة استراتيجية لشحن البصل والخضروات والأسمدة الصناعية ومواد البناء.', tag: 'DCHC / ALIANCA' },
  { name: 'ميناء العين السخنة والأدبية', text: 'بوابة التصدير المباشر على البحر الأحمر إلى الخليج العربي وشرق أفريقيا وشبه القارة الهندية.', tag: 'DP WORLD SOKHNA' },
  { name: 'ميناء شرق وغرب بورسعيد', text: 'نقطة الترانزيت المحورية على مدخل قناة السويس لخدمة سفن الحاويات العملاقة.', tag: 'SCCT / APM TERMINALS' },
];

export const AboutPage: React.FC = () => (
  <>
    <PageHero
      eyebrow="نبذة عن المؤسسة ومراكز العمليات"
      title="شركة دادونيا للتجارة الدولية والنقل البحري"
      subtitle="كيان تجاري ولوجستي يختص بتسويق وتصدير الحاصلات الزراعية والصناعية المصرية، وإدارة سلاسل الإمداد عبر الموانئ البحرية الرئيسية."
    />

    <section className="py-16 bg-[#f7f7f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-5">
          <h2 className="text-2xl sm:text-3xl text-[#082f28] pb-3 border-b-2 border-[#a77a1c]/60">رؤيتنا ورسالتنا في التجارة الخارجية</h2>
          <p className="text-[#34483f] leading-loose">
            انطلاقاً من موقع مصر الاستراتيجي كملتقى للتجارة بين الشرق والغرب، نقدّم نموذجاً تصديرياً عالي الكفاءة يضمن وصول المنتجات المصرية إلى المستوردين في أوروبا والخليج العربي وآسيا وأمريكا الشمالية بأعلى معايير الجودة والسلامة.
          </p>
          <p className="text-[#566a63] text-sm leading-loose">
            نراقب كل مرحلة من سلسلة الإمداد: من الفرز والتدريج بالمحطات المعتمدة، إلى التغليف وفق متطلبات المشتري، والنقل المبرد، وحتى الفحص المعملي وإنهاء الإفراج الجمركي المسبق عبر منظومة «نافذة».
          </p>
          <div className="bg-white border border-[#082f28]/10 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 text-[#082f28] font-bold mb-3">
              <ShieldCheck className="w-5 h-5 text-[#8f6612]" /> معايير السلامة والجودة المعتمدة
            </h3>
            <ul className="space-y-2 text-sm text-[#34483f]">
              {STANDARDS.map((s) => <li key={s} className="flex gap-2"><span className="text-[#8f6612]">—</span>{s}</li>)}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          <figure className="rounded-2xl overflow-hidden border border-[#082f28]/10 bg-white">
            <div className="h-60 overflow-hidden"><img src={port} alt="تحميل الحاويات على رصيف الميناء" className="w-full h-full object-cover" /></div>
            <figcaption className="p-4 text-xs text-[#566a63] leading-relaxed">ساحة تجهيز وتحميل الشحنات على رصيف الميناء.</figcaption>
          </figure>
          <figure className="rounded-2xl overflow-hidden border border-[#082f28]/10 bg-white">
            <div className="h-48 overflow-hidden"><img src={warehouse} alt="مستودع تخزين البضائع" className="w-full h-full object-cover" /></div>
            <figcaption className="p-4 text-xs text-[#566a63] leading-relaxed">مستودعات التخزين والتجهيز قبل الشحن.</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className="py-16 bg-[#eceee6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl text-[#082f28]">الموانئ والمراكز اللوجستية التي نخدمها</h2>
          <p className="text-[#566a63] text-sm">تواجد ميداني وتخليص جمركي مباشر عبر المنافذ البحرية المصرية.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTS.map((p) => (
            <div key={p.name} className="bg-white border border-[#082f28]/10 rounded-2xl p-6 shadow-sm">
              <Ship className="w-8 h-8 text-[#8f6612] mb-3" />
              <h3 className="font-bold text-lg text-[#082f28] mb-2">{p.name}</h3>
              <p className="text-sm text-[#34483f] leading-relaxed mb-3">{p.text}</p>
              <span className="text-[11px] font-mono font-bold text-[#8f6612]">TERMINAL: {p.tag}</span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a href="/contact" className="inline-block bg-[#8f6612] hover:bg-[#6f4f0f] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-colors">تواصل مع فريق المبيعات</a>
        </div>
      </div>
    </section>
  </>
);
