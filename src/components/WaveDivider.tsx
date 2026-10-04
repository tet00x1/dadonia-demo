import React from 'react';

/** Two slowly drifting wave layers that blend the light section above into the dark contact section. */
export const WaveDivider: React.FC = () => (
  <div aria-hidden="true" className="wave-divider bg-[#eceee6] relative h-14 sm:h-20 -mb-px overflow-hidden">
    <svg className="wave wave-back" viewBox="0 0 2400 80" preserveAspectRatio="none">
      <path d="M0 40 Q150 0 300 40 T600 40 T900 40 T1200 40 T1500 40 T1800 40 T2100 40 T2400 40 V80 H0 Z" fill="currentColor" opacity="0.35" />
    </svg>
    <svg className="wave wave-front" viewBox="0 0 2400 80" preserveAspectRatio="none">
      <path d="M0 50 Q150 15 300 50 T600 50 T900 50 T1200 50 T1500 50 T1800 50 T2100 50 T2400 50 V80 H0 Z" fill="currentColor" />
    </svg>
  </div>
);
