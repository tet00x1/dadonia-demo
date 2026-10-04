import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Ship, 
  Warehouse, 
  Package, 
  Droplet, 
  CheckCircle2, 
  FileCheck,
  Maximize2,
  ExternalLink
} from 'lucide-react';

import craneImg from '../assets/images/port_crane_ship_loading_1790849623149.webp';
import warehouseImg from '../assets/images/warehouse_sugar_pallets_1790849593865.webp';
import sugarImg from '../assets/images/pure_sugar_icumsa_1790848693446.webp';
import oilImg from '../assets/images/sunflower_oil_bottles_1790849608596.webp';
import shipImg from '../assets/images/hero_cargo_ship_1790848667010.webp';

export const OperationsGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'maritime' | 'warehouse' | 'sugar' | 'oil'>('all');

  const galleryItems = [
    {
      id: 1,
      category: 'maritime',
      title: 'شحن بضائع الصب بالبواخر عبر روافع الميناء',
      desc: 'عمليات رفع وتحميل شوالات السكر والحبوب بواسطة شباك الرفع الثقيلة مباشرة إلى عنابر الباخرة التجارية.',
      image: craneImg,
      badge: 'العمليات الملاحية',
      specs: 'حمولة 33,000 طن • رافعات مينائية معتمدة'
    },
    {
      id: 2,
      category: 'warehouse',
      title: 'تصفيف وتخزين السكر بالمستودعات المركزية',
      desc: 'ترتيب البضائع على طبليات خشبية معقمة، بممرات منظمة لسهولة حركة الرافعات الشوكية وتأمين المخزون.',
      image: warehouseImg,
      badge: 'إدارة المستودعات',
      specs: 'طبليات معيارية ISPM 15 • تهوية ورطوبة مضبوطة'
    },
    {
      id: 3,
      category: 'sugar',
      title: 'سكر أبيض نقي مكرر (ICUMSA 45)',
      desc: 'حبيبات كريستالية نقية خالية من الشوائب معبأة في أكياس 50 كجم و 25 كجم مزدوجة البطانة ومحكمة الخياطة.',
      image: sugarImg,
      badge: 'السلع الاستراتيجية',
      specs: 'استقطاب ≥ 99.80°Z • رطوبة ≤ 0.04%'
    },
    {
      id: 4,
      category: 'oil',
      title: 'زيوت دوار الشمس النقية (100% Puro)',
      desc: 'تعبئة وتصدير زيت دوار الشمس الصافي في عبوات تجزئة 1.5 لتر (كراتين 12 عبوة)، وجالونات 5 لتر و 20 لتر للشحن بالحاويات.',
      image: oilImg,
      badge: 'الزيوت النباتية',
      specs: 'منشأ برازيلي (ميناء باراناغوا) • حموضة منخفضة'
    },
    {
      id: 5,
      category: 'maritime',
      title: 'إبحار سفن الشحن التجاري عبر الخطوط الدولية',
      desc: 'أسطول تجاري يربط بين موانئ آسيا والشرق الأوسط وأوروبا لنقل السكر والمواد الغذائية بعقود شحن دورية.',
      image: shipImg,
      badge: 'خطوط الشحن',
      specs: 'الباخرة OCEAN STAR • 6 رحلات سنوياً'
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  const filterTabs = [
    { id: 'all', label: 'كافة العمليات الميدانية' },
    { id: 'maritime', label: 'الشحن البحري والموانئ' },
    { id: 'warehouse', label: 'تخزين المستودعات' },
    { id: 'sugar', label: 'السكر الأبيض ICUMSA 45' },
    { id: 'oil', label: 'زيوت دوار الشمس' },
  ];

  return (
    <section id="gallery" className="py-24 bg-[#f7f7f1] text-[#082f28] font-['Cairo',sans-serif] relative overflow-hidden border-b border-[#082f28]/10">
      
      {/* Background ambient lighting */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-[#a77a1c]/10 border border-[#a77a1c]/30 text-[#8f6612] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full"
          >
            <Warehouse className="w-4 h-4 text-[#8f6612]" />
            <span>معرض العمليات وسلاسل الإمداد الميدانية</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-[#082f28] leading-tight"
          >
            توثيق ميداني للعمليات اللوجستية والتوريدات
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#34483f] text-sm sm:text-base leading-relaxed"
          >
            صور حية من مواقع العمل: من عنابر السفن وروافع الموانئ إلى المستودعات المركزية المنظمة، وخطوط تعبئة السكر وزيوت الطعام المجهزة للشحن الدولي.
          </motion.p>

          {/* Interactive Filter Pills */}
          <div className="pt-6 flex flex-wrap justify-center gap-2">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
                    isActive 
                      ? 'bg-[#8f6612] text-white shadow-lg shadow-[#a77a1c]/30 scale-105' 
                      : 'bg-white text-[#34483f] hover:text-[#8f6612] hover:bg-[#082f28]/5 border border-[#082f28]/10'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="bg-white border border-[#082f28]/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group shine"
              >
                {/* Image Box */}
                <div className="relative h-60 sm:h-64 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-[#082f28]/10 px-3 py-1 rounded-full text-xs font-bold text-[#8f6612]">
                    {item.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#082f28] group-hover:text-[#8f6612] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#34483f] leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#082f28]/10 flex items-center justify-between text-xs text-[#566a63] font-mono">
                    <span className="text-[#8f6612] font-bold">{item.specs}</span>
                    <span className="text-[#566a63]">OPERATIONS</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};
