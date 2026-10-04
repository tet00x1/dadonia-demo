import React from 'react';
import { 
  Ship, 
  Anchor, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  CheckCircle2,
  Calendar,
  Phone
} from 'lucide-react';
import shipImage from '../assets/images/hero_cargo_ship_1790848667010.webp';

export const MaritimeVesselSection: React.FC = () => {
  return (
    <section id="maritime" className="py-16 sm:py-24 bg-[#eceee6] text-[#082f28] border-b border-[#082f28]/10 font-['Cairo',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#8f6612] uppercase tracking-wider block">
            أسطول النقل البحري والشحن التجاري
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#082f28] leading-tight">
            فرصة استثمارية في النقل البحري
          </h2>
          <p className="text-[#34483f] text-sm sm:text-base leading-relaxed">
            مشاركة في شركة نقل بحري متخصصة في نقل الحاويات والبضائع التجارية (السكر، المواد الغذائية، وغيرها) - استثمار آمن بعائد مستقر ونمو مستقبلي.
          </p>
        </div>

        {/* Vessel Specifications & Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Visual Column */}
          <div className="lg:col-span-6 bg-white border border-[#082f28]/10 rounded-2xl overflow-hidden shadow-md">
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img 
                src={shipImage} 
                alt="الباخرة OCEAN STAR للشحن التجاري" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1.5 rounded-lg border border-[#082f28]/10 text-xs font-mono text-[#8f6612]">
                الباخرة: OCEAN STAR
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-[#082f28] border-b border-[#082f28]/10 pb-2">
                مواصفات الباخرة (OCEAN STAR)
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block text-xs">النوع:</span>
                  <span className="font-bold text-[#082f28]">حاويات / شحن تجاري</span>
                </div>
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block text-xs">الحمولة الإجمالية:</span>
                  <span className="font-bold text-[#082f28] font-mono">33,000 طن</span>
                </div>
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block text-xs">الطول الكلي:</span>
                  <span className="font-bold text-[#082f28] font-mono">199 متر</span>
                </div>
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block text-xs">العرض والعمق:</span>
                  <span className="font-bold text-[#082f28] font-mono">32م / 14م</span>
                </div>
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block text-xs">سنة الصنع:</span>
                  <span className="font-bold text-[#082f28] font-mono">2015</span>
                </div>
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block text-xs">السرعة وطاقم التشغيل:</span>
                  <span className="font-bold text-[#082f28]">18 عقدة / 25-30 فرد</span>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Details & Trade Route */}
          <div className="lg:col-span-6 bg-white border border-[#082f28]/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
            
            {/* Trade Route */}
            <div className="space-y-2 border-b border-[#082f28]/10 pb-4">
              <span className="text-xs font-bold text-[#8f6612] uppercase">خط سير الرحلات (مخطط):</span>
              <h3 className="text-xl font-bold text-[#082f28]">
                رحلات دولية بين الموانئ الرئيسية (آسيا - إفريقيا - أوروبا)
              </h3>
              <p className="text-xs sm:text-sm text-[#34483f] leading-relaxed">
                تعمل على نقل الحاويات والبضائع العامة مع إمكانية نقل السكر والمواد الغذائية وبضائع تجارية متنوعة بمعدل 6 رحلات سنوياً (رحلة كل شهرين تقريباً).
              </p>
            </div>

            {/* Freight and Revenue Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#34483f]">تفاصيل الاستثمار والعوائد:</h4>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block">قيمة الحمولة لكل رحلة:</span>
                  <span className="text-sm font-bold text-[#082f28] font-mono">858,000 دولار</span>
                </div>
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block">سعر النقل لكل طن:</span>
                  <span className="text-sm font-bold text-[#082f28] font-mono">26 دولار / طن</span>
                </div>
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block">العمولة المتوقعة:</span>
                  <span className="text-sm font-bold text-[#8f6612] font-mono">3% (25,740$ للرحلة)</span>
                </div>
                <div className="bg-[#eceee6] p-3 rounded-lg border border-[#082f28]/10">
                  <span className="text-[#566a63] block">إجمالي الأرباح السنوية:</span>
                  <span className="text-sm font-bold text-[#8f6612] font-mono">97,000 دولار</span>
                </div>
              </div>
            </div>

            {/* Shares Structure */}
            <div className="bg-[#eceee6] p-4 rounded-xl border border-[#082f28]/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#34483f] font-bold">هيكل الأسهم والاستثمار:</span>
                <span className="text-[#566a63] font-mono">إجمالي 8,000,000 سهم</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border border-[#082f28]/10 p-2.5 rounded bg-white">
                  <span className="text-[#566a63] block">سعر السهم:</span>
                  <span className="text-base font-bold text-[#082f28] font-mono">20 دولار</span>
                </div>
                <div className="border border-[#082f28]/10 p-2.5 rounded bg-white">
                  <span className="text-[#566a63] block">العائد السنوي للسهم:</span>
                  <span className="text-base font-bold text-[#8f6612] font-mono">97 دولار</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-[#566a63] leading-relaxed">
                توزيع الأرباح الشهرية تقريباً: <strong className="text-[#8f6612] font-mono">8.08$ شهرياً</strong> (بإجمالي 97 دولار سنوياً لكل سهم تقريباً).
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <a
                href={`/contact/?message=${encodeURIComponent(
                  `استفسار رسمي حول فرصة الاستثمار في النقل البحري (الباخرة OCEAN STAR):\n` +
                  `نطلب دراسة الجدوى وتفاصيل المشاركة في أسهم شركة النقل البحري.`
                )}`}
                className="w-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-center font-bold text-sm py-3.5 px-4 rounded-xl transition-colors block shadow"
              >
                للحصول على التفاصيل الكاملة ودراسة المشروع - تواصل معنا
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
