import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const PATH = 'M 60 150 Q 200 80 360 90 T 620 130 T 800 80 T 940 120';

const ports = [
  { x: 60, y: 150, name: 'باراناغوا', sub: 'البرازيل' },
  { x: 360, y: 90, name: 'الإسكندرية', sub: 'مصر' },
  { x: 620, y: 130, name: 'دمياط', sub: 'مصر' },
  { x: 800, y: 80, name: 'بورسعيد', sub: 'مصر' },
  { x: 940, y: 120, name: 'السخنة', sub: 'مصر' },
];

export const RouteLine: React.FC = () => {
  const reduce = useReducedMotion();

  return (
    <div dir="ltr" className="w-full overflow-x-auto">
      <svg viewBox="0 0 1000 230" className="w-full min-w-[640px] h-auto" role="img" aria-label="خط الملاحة بين ميناء باراناغوا والموانئ المصرية">
        {/* faint base line */}
        <path d={PATH} fill="none" className="stroke-slate-700" strokeWidth="2" strokeDasharray="4 8" />

        {/* line drawing itself */}
        <motion.path
          d={PATH}
          fill="none"
          className="stroke-amber-400"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 2.6, ease: 'easeInOut' }}
        />

        {/* ports */}
        {ports.map((p, i) => (
          <motion.g
            key={p.name}
            initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: reduce ? 0 : 0.4 + i * 0.5, duration: 0.5 }}
            style={{ transformOrigin: `${p.x}px ${p.y}px`, transformBox: 'fill-box' }}
          >
            <circle cx={p.x} cy={p.y} r="14" className="fill-amber-400/15" />
            <circle cx={p.x} cy={p.y} r="6" className="fill-amber-400" />
            <text x={p.x} y={p.y + 38} textAnchor="middle" className="fill-white text-[17px] font-bold" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {p.name}
            </text>
            <text x={p.x} y={p.y + 58} textAnchor="middle" className="fill-slate-400 text-[13px]" style={{ fontFamily: 'Cairo, sans-serif' }}>
              {p.sub}
            </text>
          </motion.g>
        ))}

        {/* ship moving along the line */}
        {!reduce && (
          <g>
            <path d="M -12 4 L 12 4 L 8 12 L -8 12 Z M -2 4 L -2 -8 L 8 4 Z" className="fill-white">
              <animateMotion dur="11s" begin="2s" repeatCount="indefinite" path={PATH} rotate="0" />
            </path>
          </g>
        )}
      </svg>
    </div>
  );
};
