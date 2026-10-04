import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { ClipboardList, Boxes, Ship, BadgeCheck } from 'lucide-react';

const steps = [
  { icon: ClipboardList, title: 'طلب التوريد', text: 'تحديد الصنف والكمية والميناء، وتجهيز عرض السعر.' },
  { icon: Boxes, title: 'التجهيز والتحميل', text: 'فحص البضاعة وتعبئتها وتحميلها في الحاويات أو السفينة.' },
  { icon: Ship, title: 'الشحن البحري', text: 'نقل الشحنة بحرًا مع متابعة موقعها حتى الوصول.' },
  { icon: BadgeCheck, title: 'التخليص والتسليم', text: 'إنهاء الإجراءات الجمركية وتسليم الشحنة للعميل.' },
];

const Node: React.FC<{ index: number; progress: MotionValue<number>; icon: React.ElementType }> = ({ index, progress, icon: Icon }) => {
  const at = index / (steps.length - 1);
  const bg = useTransform(progress, [Math.max(at - 0.06, 0), at], ['#f7f7f1', '#a77a1c']);
  const color = useTransform(progress, [Math.max(at - 0.06, 0), at], ['#566a63', '#ffffff']);
  const border = useTransform(progress, [Math.max(at - 0.06, 0), at], ['rgba(29,27,23,0.2)', '#a77a1c']);
  return (
    <motion.div
      style={{ backgroundColor: bg, color, borderColor: border }}
      className="relative z-10 w-14 h-14 rounded-full border-2 flex items-center justify-center mx-auto"
    >
      <Icon className="w-6 h-6" />
    </motion.div>
  );
};

export const JourneySection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'center 40%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const shipRight = useTransform(progress, [0, 1], ['12.5%', '87.5%']);
  const fill = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="py-24 bg-[#f7f7f1] text-[#082f28] border-b border-[#082f28]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs tracking-widest text-[#a77a1c] block">رحلة شحنتك</span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
            من الطلب إلى الاستلام، نتابع كل خطوة
          </h2>
        </div>

        <div className="relative">
          {/* track + moving fill + ship (desktop) */}
          <div className="hidden md:block absolute top-7 right-[12.5%] left-[12.5%] h-0.5 bg-[#082f28]/10" />
          <motion.div
            style={{ scaleX: fill }}
            className="hidden md:block absolute top-7 right-[12.5%] left-[12.5%] h-0.5 bg-[#a77a1c] origin-right"
          />
          <motion.div
            style={{ right: shipRight }}
            className="hidden md:flex absolute -top-5 w-10 h-10 -mr-5 items-center justify-center text-[#082f28]"
          >
            <Ship className="w-6 h-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="text-center px-2"
              >
                <Node index={i} progress={progress} icon={s.icon} />
                <span className="block mt-5 text-xs font-mono text-[#566a63]">0{i + 1}</span>
                <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-[#566a63] leading-loose font-light">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <a
            href="/track/"
            className="inline-flex items-center gap-2 border border-[#082f28]/60 hover:bg-[#082f28] hover:text-white px-7 py-3 rounded-full text-sm font-medium transition-colors"
          >
            تتبع شحنتك برقم البوليصة
          </a>
        </div>
      </div>
    </section>
  );
};
