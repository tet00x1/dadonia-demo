import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplet, 
  ShieldCheck, 
  FileCheck, 
  ChevronDown, 
  ChevronUp, 
  Package, 
  CheckCircle2,
  Award
} from 'lucide-react';
import oilImg from '../assets/images/sunflower_oil_bottles_1790849608596.webp';

export const EdibleOilsSection: React.FC = () => {
  const [showFullCOA, setShowFullCOA] = useState(false);

  const oilSpecs = [
    { param: 'Free Fatty Acids (حموضة الأوليك)', spec: 'Max 4.0 %', result: '1.85 %', method: 'AOCS Ca 5a-40' },
    { param: 'Moisture & Volatiles (الرطوبة والمواد المتطايرة)', spec: 'Max 0.20 %', result: '0.08 %', method: 'AOCS Ca 2e-84' },
    { param: 'Insoluble Impurities (الشوائب غير الذائبة)', spec: 'Max 0.20 %', result: '0.05 %', method: 'AOCS Ca 3a-46' },
    { param: 'Iodine Value (الرقم اليودي)', spec: '120 - 150 g I₂/100g', result: '134 g I₂/100g', method: 'AOCS Cd 1d-92' },
    { param: 'Peroxide Value (رقم البيروكسيد)', spec: 'Max 15.0 meq/kg', result: '6.2 meq/kg', method: 'AOCS Cd 8-53' },
    { param: 'Soap Content (محتوى الصابون)', spec: 'Max 50 mg/kg', result: '18 mg/kg', method: 'AOCS Te 1a-64' },
    { param: 'Color Gardner (درجة اللون جاردنر)', spec: 'Max 14', result: '9', method: 'AOCS Cc 13e-92' },
    { param: 'Phosphorus Content (محتوى الفوسفور)', spec: 'Max 10 mg/kg', result: '4 mg/kg', method: 'AOCS Ca 12b-92' },
    { param: 'Specific Gravity 20°C (الكثافة النوعية)', spec: '0.910 - 0.930', result: '0.922', method: 'AOCS Cc 10c-95' },
  ];

  return (
    <section id="oils" className="py-24 bg-[#eceee6] text-[#082f28] font-['Cairo',sans-serif] border-b border-[#082f28]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#a77a1c]/10 border border-[#a77a1c]/30 text-[#8f6612] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full"
          >
            <Droplet className="w-4 h-4 text-[#8f6612]" />
            <span>قطاع الزيوت النباتية والغذائية المكررة</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-[#082f28] leading-tight"
          >
            توريد زيت دوار الشمس النقي (100% Sunflower Oil)
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#34483f] text-sm sm:text-base leading-relaxed"
          >
            عقود توريد مباشرة من مزارع ومصانع البرازيل عبر ميناء باراناغوا (Paranaguá Port)، معبأة في عبوات تجزئة 1.5 لتر، 5 لتر، وجالونات 20 لتر للشحن بالحاويات الكاملة.
          </motion.p>
        </div>

        {/* Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-white border border-[#082f28]/10 rounded-2xl overflow-hidden shadow-lg relative min-h-[350px] sm:min-h-[440px] group"
          >
            <img 
              src={oilImg} 
              alt="زيت دوار الشمس عبوات 1.5 لتر و 5 لتر" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#8f6612] border border-[#082f28]/10">
              ORIGIN: BRAZIL • 100% PURO
            </div>

            <div className="absolute bottom-4 right-4 left-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#082f28]/10">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[#566a63] block text-[10px]">العبوات الصغيرة</span>
                  <strong className="text-[#082f28] text-xs">1.5L (12 زجاجة/كرتونة)</strong>
                </div>
                <div>
                  <span className="text-[#566a63] block text-[10px]">العبوات العائلية</span>
                  <strong className="text-[#8f6612] text-xs">5 لتر شفافة</strong>
                </div>
                <div>
                  <span className="text-[#566a63] block text-[10px]">الاستخدام التجاري</span>
                  <strong className="text-[#8f6612] text-xs">20 لتر (حاويات كاملة)</strong>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details & COA Table */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-white border border-[#082f28]/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-lg"
          >
            <div>
              <div className="border-b border-[#082f28]/10 pb-3 mb-4 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#8f6612] font-mono">SPECIFICATION: CRUDE & REFINED SUNFLOWER OIL</span>
                  <h3 className="text-2xl font-bold text-[#082f28] mt-1">
                    المواصفات الفنية المعتمدة دولياً
                  </h3>
                </div>
                <span className="bg-[#a77a1c]/10 text-[#8f6612] border border-[#a77a1c]/30 text-xs px-3 py-1 rounded-full font-bold">
                  مطابق لمعايير AOCS
                </span>
              </div>

              <p className="text-[#34483f] text-xs sm:text-sm leading-relaxed mb-4">
                يتميز الزيت بنقاوة تامة ولون ذهبي رائق مع نسبة حموضة منخفضة ومطابقة تامة لاشتراطات سلامة الغذاء، ومستخلص من بذور عباد الشمس غير المعدلة وراثياً (Non-GMO).
              </p>

              {/* COA Summary Table */}
              <div className="bg-[#f7f7f1] rounded-xl border border-[#082f28]/10 overflow-hidden">
                <div className="p-3 bg-[#082f28]/5 border-b border-[#082f28]/10 flex justify-between items-center text-xs">
                  <span className="font-bold text-[#34483f]">ملخص شهادة التحليل المخبري (COA Analysis Results)</span>
                  <span className="text-[#8f6612] font-mono text-[11px]">CERTIFICATE: DGT/COA/SFO</span>
                </div>

                <div className="divide-y divide-[#082f28]/10 text-xs">
                  {oilSpecs.slice(0, 5).map((row, idx) => (
                    <div key={idx} className="p-2.5 px-3 flex justify-between items-center hover:bg-[#082f28]/5 transition-colors">
                      <span className="text-[#34483f] font-medium">{row.param}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-[#566a63] font-mono text-[11px]" dir="ltr">{row.spec}</span>
                        <span className="text-[#8f6612] font-mono font-bold text-sm" dir="ltr">{row.result}</span>
                        <span className="text-[10px] bg-[#a77a1c]/10 text-[#8f6612] px-2 py-0.5 rounded font-bold">Passed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/contact/?product=sunflower_oil"
                className="bg-[#8f6612] hover:bg-[#6f4f0f] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors shadow"
              >
                طلب عرض أسعار شحنة زيت دوار الشمس
              </a>

              <button
                type="button"
                onClick={() => setShowFullCOA(!showFullCOA)}
                className="border border-[#082f28]/10 text-[#34483f] hover:text-[#8f6612] hover:bg-[#082f28]/5 font-medium text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4 text-[#8f6612]" />
                <span>{showFullCOA ? 'إخفاء التقرير الفني' : 'استعراض التقرير الفني الشامل (9 معايير)'}</span>
                {showFullCOA ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

        </div>

        {/* Expandable Table */}
        <AnimatePresence>
          {showFullCOA && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-[#082f28]/10 rounded-2xl p-6 sm:p-8 shadow-md mb-6 overflow-hidden"
            >
              <h4 className="text-lg font-bold text-[#082f28] mb-4 border-b border-[#082f28]/10 pb-2">
                التقرير المخبري الشامل لمواصفات زيت دوار الشمس (Certificate of Analysis)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {oilSpecs.map((s, idx) => (
                  <div key={idx} className="bg-[#f7f7f1] p-3 rounded-xl border border-[#082f28]/10">
                    <strong className="text-[#082f28] block mb-1">{s.param}</strong>
                    <div className="flex justify-between items-center text-[11px] text-[#566a63]">
                      <span>المعيار: {s.spec}</span>
                      <span className="text-[#8f6612] font-mono font-bold">{s.result}</span>
                    </div>
                    <span className="text-[10px] text-[#566a63] font-mono mt-1 block">Method: {s.method}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#082f28]/10 text-xs text-[#566a63] text-center">
                Port of Loading: Paranaguá Port, Brazil • Suitable for refining and direct human consumption.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
