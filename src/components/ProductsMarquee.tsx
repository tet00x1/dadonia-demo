import React from 'react';
import { motion } from 'framer-motion';

const items = [
  'سكر أبيض نقي ICUMSA 45',
  'زيوت دوار الشمس',
  'حاصلات زراعية طازجة',
  'خضروات مجمدة',
  'قطن مصري',
  'أعشاب وتوابل',
  'شحن بحري وبواخر صب',
];

export const ProductsMarquee: React.FC = () => {
  const row = [...items, ...items];
  return (
    <div className="bg-[#082f28] text-[#f7f7f1] overflow-hidden py-5 border-y border-black" dir="ltr" aria-hidden="true">
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 38, ease: 'linear', repeat: Infinity }}
      >
        {row.concat(row).map((t, i) => (
          <span key={i} className="flex items-center gap-12 text-xl sm:text-2xl font-light">
            {t}
            <span className="w-2 h-2 rounded-full bg-[#a77a1c]" />
          </span>
        ))}
      </motion.div>
    </div>
  );
};
