import React from 'react';
import emblem from '../assets/images/dadonia-emblem.png';
import { MapPin, Phone, Mail, Clock, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="w-full bg-[#031d19] text-[#b6c8c0] font-['Cairo',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        <div className="flex items-center gap-3">
          <img src={emblem} alt="Dadonia" className="w-14 h-14 rounded-full ring-1 ring-[#e2bc55]/50" />
          <div>
            <h3 className="text-white font-light text-lg leading-tight">شركة دادونيا للتجارة الدولية والنقل البحري</h3>
            <p className="text-xs font-mono text-[#8ea59c] mt-1 tracking-wider">DADONIA GLOBAL TRADE & SHIPPING</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#e2bc55] shrink-0 mt-1" />
            <span>ميناء الإسكندرية، المجمع اللوجستي التجاري، برج دادونيا، الإسكندرية، جمهورية مصر العربية</span>
          </div>
          <div className="flex items-center gap-2.5" dir="ltr">
            <Phone className="w-4 h-4 text-[#e2bc55] shrink-0" />
            <a href="tel:+201011944092" className="font-mono hover:text-white transition-colors">00201011944092</a>
            <span className="text-[#4c605a]">•</span>
            <a href="tel:+201038122116" className="font-mono hover:text-white transition-colors">00201038122116</a>
          </div>
          <div className="flex items-center gap-2.5" dir="ltr">
            <Mail className="w-4 h-4 text-[#e2bc55] shrink-0" />
            <a href="mailto:donovamotors@gmail.com" className="hover:text-white transition-colors">donovamotors@gmail.com</a>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-[#8ea59c]">
            <Clock className="w-4 h-4 shrink-0" />
            <span>الأحد - الخميس: 08:30 ص إلى 05:00 م (توقيت القاهرة)</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center gap-3 text-xs text-[#8ea59c]">
          <span>© {new Date().getFullYear()} شركة دادونيا للتجارة الدولية والنقل البحري. جميع الحقوق محفوظة.</span>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full border border-white/15 hover:bg-[#a77a1c] hover:border-[#a77a1c] hover:text-white transition-colors"
            aria-label="الرجوع إلى أعلى الصفحة"
            title="الرجوع إلى أعلى الصفحة"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
