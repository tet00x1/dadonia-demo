import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Car, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Phone,
  Mail,
  FileText
} from 'lucide-react';
import assetBundleImage from '../assets/images/luxury_asset_bundle_1790848679185.webp';

export const InvestmentOpportunity: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'apartment' | 'ev' | 'equity'>('apartment');

  const assets = [
    {
      id: 'apartment' as const,
      title: 'شقة سكنية',
      subtitle: 'بمواصفات عالية وموقع مميز',
      icon: Home,
      details: [
        { label: 'الموقع', value: 'موقع سكني واستثماري استراتيجي متصل بالخدمات والمحاور الرئيسية' },
        { label: 'المساحة', value: 'مساحة مناسبة للمعيشة الراقية أو الاستثمار الفندقي والإيجاري' },
        { label: 'التشطيب', value: 'تشطيب كامل سوبر لوكس جاهز للاستلام والتسليم الفوري' },
        { label: 'الملكية والضمان', value: 'عقد ملكية رسمي موثق مع حصة بالأرض' },
      ],
    },
    {
      id: 'ev' as const,
      title: 'سيارة كهربائية',
      subtitle: 'حديثة وصديقة للبيئة',
      icon: Car,
      details: [
        { label: 'المواصفات', value: 'سيارة كهربائية حديثة مزودة بأحدث أنظمة الأمان والراحة الذكية' },
        { label: 'المدى والبطارية', value: 'بطارية ذات مدى طويل وتكلفة تشغيل واستهلاك منعدمة مقارنة بالوقود' },
        { label: 'الضمان', value: 'ضمان رسمي شامل معتمد على البطارية والمحركات' },
        { label: 'طريقة التسليم', value: 'تسليم رسمي مرخص مع كافة أوراق الملكية والمطابقة الفنية' },
      ],
    },
    {
      id: 'equity' as const,
      title: 'مشاركة في الشركة',
      subtitle: 'حصة في شركة رائدة في التجارة والتوريدات العمومية',
      icon: Building2,
      details: [
        { label: 'نسبة المشاركة', value: 'حصة مساهمة رسمية مقيدة في رأسمال الشركة بالسجل التجاري' },
        { label: 'العائد المتوقع', value: 'عوائد وأرباح دورية ناتجة عن عقود التوريد والنقل الملاحي للسلع' },
        { label: 'الرؤية المستقبلية', value: 'توسع مستمر في التجارة الدولية واستيراد وتصدير السلع الاستراتيجية' },
        { label: 'الاستقرار المالي', value: 'استثمار آمن، نمو مستدام، وفرص توسع متعددة في قطاعات حيوية' },
      ],
    },
  ];

  const currentAsset = assets.find(a => a.id === activeTab)!;

  return (
    <section id="investment" className="py-16 sm:py-24 bg-[#f7f7f1] text-[#082f28] font-['Cairo',sans-serif] border-b border-[#082f28]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Clean Corporate Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#8f6612] uppercase tracking-wider block">
            عرض تملك استثماري متكامل
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#082f28] leading-tight">
            امتلك شقة + سيارة + حصة في شركة التجارة والتوريدات
          </h2>
          <p className="text-[#34483f] text-sm sm:text-base leading-relaxed">
            استثمار آمن لمستقبل أفضل ضمن باقة استثمارية موحدة تجمع بين الأصول العقارية، التنقل الكهربائي الحديث، وعوائد التوريدات العمومية.
          </p>

          <div className="pt-2">
            <div className="inline-block bg-white border border-[#a77a1c]/30 rounded-xl px-6 py-3">
              <span className="text-xs text-[#566a63] block">السعر الإجمالي للباقة:</span>
              <span className="text-2xl sm:text-3xl font-black text-[#8f6612] font-mono">
                2,500,000 <span className="text-base font-normal text-[#34483f]">جنيه مصري</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Visual Showcase on Left */}
          <div className="lg:col-span-5 bg-white border border-[#082f28]/10 rounded-2xl overflow-hidden shadow-md">
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img 
                src={assetBundleImage} 
                alt="شقة سكنية فاخرة وسيارة كهربائية" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#082f28]/10 pb-3">
                <span className="text-xs text-[#566a63]">محتوى العرض الشامل:</span>
                <span className="text-xs font-bold text-[#8f6612] flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>أصول رسمية وموثقة</span>
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#34483f]">
                  <CheckCircle2 className="w-4 h-4 text-[#8f6612] shrink-0" />
                  <span><strong>شقة سكنية:</strong> بمواصفات عالية وموقع مميز</span>
                </div>
                <div className="flex items-center gap-2 text-[#34483f]">
                  <CheckCircle2 className="w-4 h-4 text-[#8f6612] shrink-0" />
                  <span><strong>سيارة كهربائية:</strong> حديثة وصديقة للبيئة وموفرة</span>
                </div>
                <div className="flex items-center gap-2 text-[#34483f]">
                  <CheckCircle2 className="w-4 h-4 text-[#8f6612] shrink-0" />
                  <span><strong>مشاركة في الشركة:</strong> حصة مقيدة في التجارة والتوريدات</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-[#566a63] leading-relaxed border-t border-[#082f28]/10">
                التفاصيل الكاملة للأصول، مواصفات الشقة، فئة السيارة، ونسبة المشاركة في الشركة متاحة عند التواصل المباشر.
              </div>
            </div>
          </div>

          {/* Interactive Clean Tabs on Right */}
          <div className="lg:col-span-7 bg-white border border-[#082f28]/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
            
            {/* Tabs Selector */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#f7f7f1] rounded-xl border border-[#082f28]/10">
              {assets.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${
                      isActive 
                        ? 'bg-[#8f6612] text-white shadow' 
                        : 'text-[#566a63] hover:text-[#8f6612] hover:bg-[#082f28]/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Details */}
            <div className="space-y-4">
              <div className="border-b border-[#082f28]/10 pb-3">
                <h3 className="text-xl sm:text-2xl font-bold text-[#082f28]">
                  {currentAsset.title}
                </h3>
                <span className="text-xs text-[#8f6612] mt-0.5 block">
                  {currentAsset.subtitle}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentAsset.details.map((d, idx) => (
                  <div key={idx} className="bg-[#f7f7f1] p-3.5 rounded-xl border border-[#082f28]/10">
                    <span className="text-xs font-bold text-[#566a63] block mb-1">
                      {d.label}
                    </span>
                    <span className="text-xs sm:text-sm text-[#34483f] leading-relaxed block">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Official Contact Box */}
            <div className="pt-4 border-t border-[#082f28]/10">
              <span className="text-xs font-bold text-[#566a63] block mb-3">
                للتواصل والاستفسار المباشر عن العرض:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="tel:+201011944092"
                  className="bg-[#f7f7f1] hover:bg-[#082f28]/5 p-3 rounded-xl border border-[#082f28]/10 text-center transition-colors block"
                  dir="ltr"
                >
                  <span className="text-[11px] text-[#566a63] block font-sans">هاتف 1</span>
                  <span className="text-xs font-mono font-bold text-[#082f28]">00201011944092</span>
                </a>

                <a
                  href="tel:+201038122116"
                  className="bg-[#f7f7f1] hover:bg-[#082f28]/5 p-3 rounded-xl border border-[#082f28]/10 text-center transition-colors block"
                  dir="ltr"
                >
                  <span className="text-[11px] text-[#566a63] block font-sans">هاتف 2</span>
                  <span className="text-xs font-mono font-bold text-[#082f28]">00201038122116</span>
                </a>

                <a
                  href="mailto:donovamotors@gmail.com"
                  className="bg-[#f7f7f1] hover:bg-[#082f28]/5 p-3 rounded-xl border border-[#082f28]/10 text-center transition-colors block"
                >
                  <span className="text-[11px] text-[#566a63] block">البريد الإلكتروني</span>
                  <span className="text-[11px] font-sans font-bold text-[#8f6612] truncate block">donovamotors@gmail.com</span>
                </a>
              </div>

              <div className="mt-4">
                <a
                  href={`/contact/?message=${encodeURIComponent(
                    `استفسار رسمي حول باقة التملك الاستثماري (2,500,000 جنيه مصري):\n` +
                    `يرجى موافاتنا بكافة تفاصيل الأصول، مواصفات الشقة وموقعها، فئة السيارة الكهربائية، ونسبة المشاركة في الشركة.`
                  )}`}
                  className="w-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-center font-bold text-sm py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <FileText className="w-4 h-4" />
                  <span>طلب تفاصيل العرض والأصول كاملة</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
