import { Variants } from 'framer-motion';

/**
 * Staggered container variant for coordinating children appearance
 */
export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0.08): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Standard smooth fade in upwards variant
 */
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 28,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Downward fade-in for top banners and badges
 */
export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Scale and fade in variant for hero cards and interactive elements
 */
export const fadeInScale: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.94,
    y: 16,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Slide and fade in from right (ideal for RTL main flow)
 */
export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 35,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Slide and fade in from left (ideal for RTL secondary flow / side cards)
 */
export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -35,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
