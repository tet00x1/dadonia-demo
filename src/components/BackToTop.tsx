import React, { useEffect, useState } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

/** Round back-to-top button with a ring that fills as the page is read. */
export const BackToTop: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const on = () => setVisible(window.scrollY > 700);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="العودة لأعلى الصفحة"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          whileHover={{ y: -3 }}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#052e27] text-[#e2bc55] flex items-center justify-center shadow-md"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(226,188,85,0.2)" strokeWidth="2" />
            <motion.circle
              cx="24" cy="24" r="22" fill="none" stroke="#e2bc55" strokeWidth="2" strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp className="w-4 h-4 relative" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
