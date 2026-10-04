import React, { useState, useEffect } from 'react';
import emblem from '../assets/images/dadonia-emblem.png';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, useTheme, setLang, setTheme } from '../i18n';
import { Menu, X, Sun, Moon, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import { normalizePath } from '../router';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

const navItems = [
  { label: 'الرئيسية', href: '#top' },
  { label: 'باقة التملك', href: '#investment' },
  { label: 'أسطول النقل', href: '#maritime' },
  { label: 'السكر', href: '#sugar' },
  { label: 'الزيوت', href: '#oils' },
  { label: 'المعرض', href: '#gallery' },
  {
    label: 'المنتجات',
    href: '/products/',
    children: [
      { label: 'سكر أبيض نقي ICUMSA 45', href: '#sugar' },
      { label: 'زيوت دوار الشمس النقية', href: '#oils' },
      { label: 'حاصلات زراعية وفواكه طازجة', href: '/products/?category=agricultural' },
      { label: 'خضروات مجمدة ومحاصيل تصنيعية', href: '/products/?category=vegetables' },
      { label: 'قطن مصري ومنسوجات', href: '/products/?category=cotton_textiles' },
      { label: 'أعشاب طبية وتوابل', href: '/products/?category=herbs_spices' },
    ],
  },
  {
    label: 'الشركة',
    href: '/about',
    children: [
      { label: 'عن الشركة والموانئ', href: '/about' },
      { label: 'التقويم التصديري', href: '/calendar' },
      { label: 'تتبع الشحنات', href: '/track' },
    ],
  },
  { label: 'اتصل بنا', href: '/contact' },
];

const sectionIds = ['investment', 'maritime', 'sugar', 'oils', 'gallery', 'contact'];

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', onNavigate }) => {
  const lang = useLang();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('top');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (window.scrollY < 200) setActiveId('top');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [currentPath]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const go = (href: string) => {
    setMobileOpen(false);
    setDropdown(null);
    if (href === '#top') {
      if (normalizePath(window.location.pathname) !== '/' && onNavigate) onNavigate('/');
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (onNavigate) onNavigate(href);
    else window.location.href = href;
  };

  const onHome = normalizePath(currentPath) === '/';
  const isActive = (href: string, children?: { href: string }[]) => {
    if (href.startsWith('#')) return onHome && href.slice(1) === activeId;
    const here = normalizePath(currentPath);
    const matches = (h: string) => normalizePath(h.split('?')[0].split('#')[0]) === here;
    return matches(href) || !!children?.some((c) => !c.href.startsWith('#') && matches(c.href));
  };

  return (
    <>
      {/* Slim contact strip */}
      <div className="hidden md:block bg-[#031d19] text-[#b6c8c0] text-xs">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 text-[#e2bc55]" />
            ميناء الإسكندرية، مصر
          </span>
          <div className="flex items-center gap-5 whitespace-nowrap" dir="ltr">
            <a href="tel:+201011944092" className="flex items-center gap-1.5 font-mono hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#e2bc55]" />
              00201011944092
            </a>
            <a href="mailto:donovamotors@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#e2bc55]" />
              donovamotors@gmail.com
            </a>
          </div>
        </div>
      </div>

      <header
       
        className={`sticky top-0 z-50 font-['Cairo',sans-serif] transition-all duration-300 border-b ${
          scrolled ? 'bg-[#f7f7f1]/90 backdrop-blur-md border-[#082f28]/10 shadow-sm' : 'bg-[#f7f7f1] border-[#082f28]/10'
        }`}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

          {/* Logo: one line, never wraps */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); go('#top'); }}
            className="flex items-center gap-3 shrink-0 group"
          >
            <img src={emblem} alt="Dadonia" className="w-12 h-12 rounded-full shadow-sm ring-1 ring-[#a77a1c]/40" />
            <span className="flex flex-col leading-tight whitespace-nowrap">
              <span className="font-bold text-lg text-[#082f28]">دادونيا للتجارة الدولية</span>
              <span className="text-[10px] font-mono tracking-[0.18em] text-[#566a63]">DADONIA TRADE & SHIPPING</span>
            </span>
          </a>

          {/* Desktop menu */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="التنقل الرئيسي">
            {navItems.map((item) => {
              const hasDropdown = !!item.children;
              const active = isActive(item.href, item.children);
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => hasDropdown && setDropdown(item.href)}
                  onMouseLeave={() => hasDropdown && setDropdown(null)}
                  onFocus={() => hasDropdown && setDropdown(item.href)}
                  onBlur={(e) => {
                    // close when keyboard focus leaves the whole item (link + its sub-links)
                    if (hasDropdown && !e.currentTarget.contains(e.relatedTarget as Node | null)) setDropdown(null);
                  }}
                  onKeyDown={(e) => {
                    if (!hasDropdown) return;
                    const top = e.currentTarget.querySelector<HTMLElement>('[data-nav-top]');
                    if (e.key === 'Escape' && dropdown === item.href) {
                      e.preventDefault();
                      setDropdown(null);
                      top?.focus();
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setDropdown(item.href);
                      const root = e.currentTarget;
                      requestAnimationFrame(() => root.querySelector<HTMLElement>('[data-nav-sub]')?.focus());
                    }
                  }}
                >
                  <a
                    data-nav-top
                    href={item.href}
                    aria-haspopup={hasDropdown ? 'true' : undefined}
                    aria-expanded={hasDropdown ? dropdown === item.href : undefined}
                    aria-current={active && !item.href.startsWith('#') ? 'page' : undefined}
                    onClick={(e) => {
                      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                      e.preventDefault();
                      go(item.href);
                    }}
                    className={`relative flex items-center gap-1 px-3.5 py-2 text-[15px] whitespace-nowrap transition-colors ${
                      active ? 'text-[#8f6612] font-bold' : 'text-[#34483f] hover:text-[#8f6612] font-medium'
                    }`}
                  >
                    {item.label}
                    {hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdown === item.href ? 'rotate-180' : ''}`} />
                    )}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute right-3.5 left-3.5 -bottom-0.5 h-0.5 bg-[#a77a1c] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>

                  <AnimatePresence>
                    {hasDropdown && dropdown === item.href && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full right-0 pt-2 w-72"
                      >
                        <div className="bg-white border border-[#082f28]/10 rounded-xl shadow-lg p-2">
                          {item.children!.map((sub) => (
                            <a
                              key={sub.href}
                              data-nav-sub
                              href={sub.href}
                              onClick={(e) => { e.preventDefault(); go(sub.href); }}
                              className="block px-3 py-2.5 text-sm text-[#34483f] hover:bg-[#eceee6] hover:text-[#8f6612] rounded-lg transition-colors whitespace-nowrap"
                            >
                              {sub.label}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* CTA + burger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="h-10 min-w-10 px-3 rounded-full border border-[#082f28]/15 text-sm font-bold text-[#082f28] hover:border-[#a77a1c] hover:text-[#8f6612] transition-colors"
              aria-label={lang === 'ar' ? 'English' : 'العربية'}
            >
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-10 w-10 rounded-full border border-[#082f28]/15 text-[#082f28] hover:border-[#a77a1c] hover:text-[#8f6612] transition-colors flex items-center justify-center"
              aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href="#investment"
              onClick={(e) => { e.preventDefault(); go('#investment'); }}
              className="hidden sm:inline-flex bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-sm font-bold px-5 py-2.5 rounded-full whitespace-nowrap transition-colors"
            >
              عرض التملك
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 text-[#082f28] hover:bg-[#082f28]/5 rounded-lg"
              aria-label="القائمة"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              id="mobile-menu"
              className="xl:hidden overflow-hidden border-t border-[#082f28]/10 bg-[#f7f7f1]"
            >
              <div className="px-4 py-4 max-h-[75vh] overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.href} className="border-b border-[#082f28]/10 last:border-0">
                    <a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); go(item.href); }}
                      className={`block py-3 text-base ${isActive(item.href, item.children) ? 'text-[#8f6612] font-bold' : 'text-[#082f28] font-medium'}`}
                    >
                      {item.label}
                    </a>
                    {item.children && (
                      <div className="pr-4 pb-3 space-y-1 border-r-2 border-[#a77a1c]/40 mr-1">
                        {item.children.map((sub) => (
                          <a
                            key={sub.href}
                            href={sub.href}
                            onClick={(e) => { e.preventDefault(); go(sub.href); }}
                            className="block py-1.5 text-sm text-[#566a63] hover:text-[#8f6612]"
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <a
                  href="#investment"
                  onClick={(e) => { e.preventDefault(); go('#investment'); }}
                  className="mt-4 block text-center bg-[#8f6612] text-white font-bold py-3 rounded-full"
                >
                  عرض التملك
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
