import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X } from 'lucide-react';
import { navigate } from '../router';

/** Soft conversion prompt: appears once after the visitor has read a good part of the home page. */
export const QuoteBar: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled || dismissed) { setVisible(false); return; }
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setVisible(p > 0.35 && p < 0.9);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [enabled, dismissed]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 items-center gap-4 bg-[#052e27] text-[#f7f7f1] rounded-full ps-6 pe-2 py-2 shadow-lg border border-[#e2bc55]/30"
        >
          <span className="text-sm">تحتاج عرض سعر لشحنة سكر أو زيوت؟</span>
          <a
            href="/contact/"
            onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
            className="inline-flex items-center gap-2 bg-[#e2bc55] hover:bg-[#f0cd6c] text-[#052e27] font-bold text-sm px-5 py-2.5 rounded-full transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>اطلب عرض سعر</span>
          </a>
          <button type="button" aria-label="إغلاق" onClick={() => setDismissed(true)} className="p-2 text-[#b6c8c0] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
