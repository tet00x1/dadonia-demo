import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import emblem from '../assets/images/dadonia-emblem.png';

const KEY = 'dadonia-intro-seen';

const alreadySeen = () => {
  try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; }
};

/** Short brand intro, shown once per browser session. */
export const Preloader: React.FC = () => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => !alreadySeen());

  useEffect(() => {
    if (!show) return;
    if (reduce) { setShow(false); return; }
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(() => setShow(false), 1900);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = '';
    };
  }, [show, reduce]);

  useEffect(() => {
    if (!show) {
      try { sessionStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[200] bg-[#052e27] flex flex-col items-center justify-center"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] } }}
    >
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full -rotate-90">
          <motion.circle
            cx="60" cy="60" r="56" fill="none" stroke="#e2bc55" strokeWidth="1.5" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </svg>
        <motion.img
          src={emblem}
          alt=""
          className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] rounded-full"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
      <motion.span
        dir="ltr"
        className="mt-6 text-[#e2bc55] text-lg font-bold tracking-[0.35em]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        DADONIA
      </motion.span>
    </motion.div>
      )}
    </AnimatePresence>
  );
};
