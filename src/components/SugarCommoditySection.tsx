import React, { useState } from 'react';
import { 
  CheckCircle2, 
  FileCheck, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Package
} from 'lucide-react';
import sugarImage from '../assets/images/pure_sugar_icumsa_1790848693446.webp';

export const SugarCommoditySection: React.FC = () => {
  const [showFullCOA, setShowFullCOA] = useState(false);

  const physicalSpecs = [
    { param: 'Polarization (Sucrose Purity)', unit: '°Z (20°C)', spec: '≥ 99.80', result: '99.86', method: 'ICUMSA GS 2/3-7' },
    { param: 'Moisture Content (نسبة الرطوبة)', unit: '%', spec: '≤ 0.04', result: '0.03', method: 'ICUMSA GS 2/3-17' },
    { param: 'Ash / Sulfated Ash (الرماد الكبريتي)', unit: '%', spec: '≤ 0.04', result: '0.02', method: 'ICUMSA GS 2/3-11' },
    { param: 'ICUMSA Color Value (درجة البياض القياسي)', unit: 'RBU', spec: '≤ 45', result: '32.5', method: 'ICUMSA GS 2/3-18' },
    { param: 'Solubility (الذوبان في الماء)', unit: '%', spec: '100% Free-Flowing', result: '100%', method: 'ICUMSA GS 2/3-14' },
    { param: 'Granulation (حجم الحبيبات الكريستالية)', unit: 'Standard', spec: 'Fine Standard', result: 'Fine Standard', method: 'ICUMSA GS 2/3-9' },
    { param: 'Sulphur Dioxide (SO₂ ثاني أكسيد الكبريت)', unit: 'mg/kg', spec: '≤ 20', result: '< 10', method: 'ICUMSA GS 2/3-32' },
  ];

  const heavyMetals = [
    { param: 'Arsenic (As) الزرنيخ', limit: '≤ 0.50 mg/kg', result: '0.08 mg/kg', status: 'مطابق' },
    { param: 'Lead (Pb) الرصاص', limit: '≤ 1.00 mg/kg', result: '0.15 mg/kg', status: 'مطابق' },
    { param: 'Cadmium (Cd) الكادميوم', limit: '≤ 0.05 mg/kg', result: '0.01 mg/kg', status: 'مطابق' },
    { param: 'Mercury (Hg) الزئبق', limit: '≤ 0.01 mg/kg', result: '< 0.005 mg/kg', status: 'مطابق' },
  ];

  return (
    <section id="sugar" className="py-16 sm:py-24 bg-[#f7f7f1] text-[#082f28] border-b border-[#082f28]/10 font-['Cairo',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-[#8f6612] uppercase tracking-wider block">
            السلع الاستراتيجية والتوريدات الغذائية
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-[#082f28] leading-tight">
            سكر أبيض نقي مكرر (ICUMSA 45)
          </h2>
          <p className="text-[#34483f] text-sm sm:text-base leading-relaxed">
            توريد السكر الأبيض النقي المكرر عالي الجودة في أكياس 50 كجم، مطابق للمواصفات القياسية الدولية ومعتمد بشهادة التحليل المخبري (Certificate of Analysis).
          </p>
        </div>

        {/* Commodity Showcase Card */}
        <div className="bg-white border border-[#082f28]/10 rounded-2xl overflow-hidden shadow-md mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Image Column */}
            <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[400px]">
              <img 
                src={sugarImage} 
                alt="سكر أبيض نقي مكرر ICUMSA 45" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>

            {/* Spec Details Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div>
                <div className="border-b border-[#082f28]/10 pb-3 mb-4">
                  <span className="text-xs font-bold text-[#8f6612] font-mono">SPECIFICATION: ICUMSA 45</span>
                  <h3 className="text-2xl font-bold text-[#082f28] mt-1">
                    سكر أبيض نقي - جودة عالية
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="bg-[#f7f7f1] p-3 rounded-lg border border-[#082f28]/10">
                    <span className="text-[#566a63] block">بلد المنشأ:</span>
                    <strong className="text-[#082f28] text-sm">تايلاند (Thailand Origin)</strong>
                  </div>
                  <div className="bg-[#f7f7f1] p-3 rounded-lg border border-[#082f28]/10">
                    <span className="text-[#566a63] block">نوع التعبئة:</span>
                    <strong className="text-[#082f28] text-sm">أكياس 50 كجم PP Bag</strong>
                  </div>
                  <div className="bg-[#f7f7f1] p-3 rounded-lg border border-[#082f28]/10">
                    <span className="text-[#566a63] block">حمولة الحاوية 20 قدم:</span>
                    <strong className="text-[#082f28] text-sm">540 كيس (27 طن)</strong>
                  </div>
                  <div className="bg-[#f7f7f1] p-3 rounded-lg border border-[#082f28]/10">
                    <span className="text-[#566a63] block">شحنات البواخر:</span>
                    <strong className="text-[#082f28] text-sm">شحن بحري وبضائع صب</strong>
                  </div>
                </div>

                {/* Laboratory Specs Table */}
                <div className="bg-[#f7f7f1] rounded-xl border border-[#082f28]/10 overflow-hidden">
                  <div className="p-3 bg-[#082f28]/5 border-b border-[#082f28]/10 flex justify-between items-center text-xs">
                    <span className="font-bold text-[#34483f]">ملخص نتائج الفحص المخبري (COA)</span>
                    <span className="text-[#8f6612] font-bold">مطابق للمواصفات</span>
                  </div>

                  <div className="divide-y divide-[#082f28]/10 text-xs">
                    {physicalSpecs.slice(0, 4).map((row, idx) => (
                      <div key={idx} className="p-2.5 px-3 flex justify-between items-center">
                        <span className="text-[#34483f]">{row.param}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#566a63] font-mono text-[11px]" dir="ltr">{row.spec}</span>
                          <span className="text-[#8f6612] font-mono font-bold" dir="ltr">{row.result}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="/contact/?product=sugar"
                  className="bg-[#8f6612] hover:bg-[#6f4f0f] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors shadow"
                >
                  طلب عرض أسعار وتوريد (FOB / CIF)
                </a>

                <button
                  type="button"
                  onClick={() => setShowFullCOA(!showFullCOA)}
                  className="border border-[#082f28]/10 text-[#34483f] hover:text-[#8f6612] hover:bg-[#082f28]/5 font-medium text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4 text-[#8f6612]" />
                  <span>{showFullCOA ? 'إخفاء التقرير الكامل' : 'استعراض شهادة التحليل الكاملة (COA)'}</span>
                  {showFullCOA ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Expandable Laboratory Report Accordion */}
        {showFullCOA && (
          <div className="bg-white border border-[#082f28]/10 rounded-2xl p-6 sm:p-8 shadow-md mb-6">
            <h4 className="text-lg font-bold text-[#082f28] mb-4 border-b border-[#082f28]/10 pb-2">
              تقرير الفحص المخبري المعتمد للسكر الأبيض ICUMSA 45
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <h5 className="font-bold text-[#34483f] mb-2">1. فحص المعادن الثقيلة (Heavy Metals)</h5>
                <div className="space-y-1.5">
                  {heavyMetals.map((m, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-[#f7f7f1] rounded border border-[#082f28]/10">
                      <span className="text-[#34483f]">{m.param}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#566a63] font-mono" dir="ltr">{m.limit}</span>
                        <span className="text-[#8f6612] font-mono font-bold" dir="ltr">{m.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-[#34483f] mb-2">2. السلامة الميكروبيولوجية والمبيدات</h5>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center p-2 bg-[#f7f7f1] rounded border border-[#082f28]/10">
                    <span className="text-[#34483f]">السالمونيلا (Salmonella)</span>
                    <span className="text-[#8f6612] font-bold">سالب (Absent / 25g)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-[#f7f7f1] rounded border border-[#082f28]/10">
                    <span className="text-[#34483f]">الباسيلوس (Bacillus)</span>
                    <span className="text-[#8f6612] font-bold">خالٍ تماماً (Nil / gram)</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-[#f7f7f1] rounded border border-[#082f28]/10">
                    <span className="text-[#34483f]">متبقيات المبيدات (Pesticide Residues)</span>
                    <span className="text-[#8f6612] font-bold">&lt; 0.001 mg/kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#082f28]/10 text-[11px] text-[#566a63] text-center">
              The above product conforms to ICUMSA 45 specifications and is fit for human consumption.
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
