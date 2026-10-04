import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionConfig } from 'framer-motion';
import { CountUp } from './components/CountUp';
import { RouteLine } from './components/RouteLine';
import { ProductsMarquee } from './components/ProductsMarquee';
import { JourneySection } from './components/JourneySection';
import { useScrollReveal } from './hooks/useScrollReveal';
import { navigate, normalizePath, useLocation } from './router';
import { useLang } from './i18n';
import { applySeo } from './seo';
import { AboutPage } from './pages/AboutPage';
import { CalendarPage } from './pages/CalendarPage';
import { ContactPage } from './pages/ContactPage';
import { ProductsPage } from './pages/ProductsPage';
import { TrackPage } from './pages/TrackPage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InvestmentOpportunity } from './components/InvestmentOpportunity';
import { MaritimeVesselSection } from './components/MaritimeVesselSection';
import { SugarCommoditySection } from './components/SugarCommoditySection';
import { EdibleOilsSection } from './components/EdibleOilsSection';
import { OperationsGallery } from './components/OperationsGallery';
import { Preloader } from './components/Preloader';
import { Magnetic } from './components/Magnetic';
import { BackToTop } from './components/BackToTop';
import { WaveDivider } from './components/WaveDivider';
import { QuoteBar } from './components/QuoteBar';
import { 
  Ship, 
  Package, 
  Calendar, 
  ShieldCheck, 
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  FileText,
  Warehouse,
  Droplet,
  Globe2,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';
import emblem from './assets/images/dadonia-emblem.png';
import heroShipBg from './assets/images/hero_cargo_ship_1790848667010.webp';

/** Navigate to a page route or smooth-scroll to a section of the home page. */
function goTo(path: string) {
  if (path.startsWith('#')) {
    if (normalizePath(window.location.pathname) === '/') {
      document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/' + path); // go home first, then scroll to the section
    }
    return;
  }
  navigate(path);
}

function HomeContent() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImgY = useTransform(heroProgress, [0, 1], ['0%', '18%']);
  const handleNavigate = goTo;

  const keyStats = [
    { to: 33000, decimals: 0, suffix: ' طن', label: 'حمولة باخرة الصب للرحلة', sub: 'الباخرة OCEAN STAR' },
    { to: 2.5, decimals: 1, suffix: ' مليون ج.م', label: 'قيمة باقة التملك الاستثماري', sub: 'شقة + سيارة + حصة' },
    { to: 99.86, decimals: 2, suffix: ' °Z', label: 'نسبة نقاوة السكر المكرر', sub: 'مطابق لـ ICUMSA 45' },
  ];

  return (
    <>
        
        {/* Animated Cinematic Hero Section */}
        <section ref={heroRef} data-hero className="relative bg-[#d9e1d8] p-2 sm:p-3 border-b border-[#082f28]/10">

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[88vh] gap-0">

            {/* Text panel (right in RTL) */}
            <div
              onPointerMove={(e) => {
                if (e.pointerType !== 'mouse') return;
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
              className="hero-spot-host relative bg-[#052e27] text-[#f7f7f1] rounded-t-2xl lg:rounded-t-none lg:rounded-r-2xl flex flex-col justify-between p-6 sm:p-10 lg:p-14 order-2 lg:order-1"
            >
              <span className="hero-spot" aria-hidden="true" />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center gap-4"
              >
                <img src={emblem} alt="Dadonia" className="float-slow w-20 h-20 rounded-full ring-1 ring-[#e2bc55]/60 shadow-[0_0_40px_rgba(226,188,85,0.18)]" />
                <span className="flex flex-col leading-tight">
                  <span className="text-[#e2bc55] text-2xl font-bold tracking-[0.2em]" dir="ltr">DADONIA</span>
                  <span className="text-xs text-[#b6c8c0] mt-1">للتجارة الدولية والنقل البحري</span>
                </span>
              </motion.div>

              <div className="space-y-8 py-10">
                <h1 className="text-4xl sm:text-5xl xl:text-6xl leading-[1.3] text-[#f7f7f1]">
                  {['ريادة التجارة الدولية،', 'النقل الملاحي', 'والفرص الاستثمارية'].map((line, i) => (
                    <span key={line} className="block overflow-hidden pb-2">
                      <motion.span
                        className="block"
                        initial={{ y: '110%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.9, delay: 0.35 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.95 }}
                  className="text-[#b6c8c0] text-base sm:text-lg font-light leading-loose max-w-lg"
                >
                  ندير أسطول سفن الشحن وبواخر الصب، ونورّد السكر الأبيض النقي ICUMSA 45 وزيوت دوار الشمس، إلى جانب باقة التملك الاستثماري: شقة وسيارة وحصة في الشركة.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.15 }}
                className="flex items-center gap-8 flex-wrap"
              >
                <Magnetic>
                <a
                  href="#investment"
                  onClick={(e) => { e.preventDefault(); handleNavigate('#investment'); }}
                  className="group relative w-28 h-28 rounded-full border border-[#e2bc55] text-[#e2bc55] flex items-center justify-center text-center text-[11px] font-medium leading-snug overflow-hidden transition-colors duration-500 hover:text-[#052e27]"
                >
                  <span className="absolute inset-0 bg-[#e2bc55] scale-0 rounded-full group-hover:scale-100 transition-transform duration-500 ease-out" />
                  <span className="relative">اكتشف<br />خدماتنا</span>
                </a>
                </Magnetic>

                <div className="flex flex-col gap-2 text-sm">
                  <a href="#maritime" onClick={(e) => { e.preventDefault(); handleNavigate('#maritime'); }} className="text-[#f7f7f1] border-b border-[#f7f7f1]/30 hover:border-[#e2bc55] hover:text-[#e2bc55] transition-colors w-fit pb-0.5">
                    أسطول النقل البحري
                  </a>
                  <a href="#gallery" onClick={(e) => { e.preventDefault(); handleNavigate('#gallery'); }} className="text-[#f7f7f1] border-b border-[#f7f7f1]/30 hover:border-[#e2bc55] hover:text-[#e2bc55] transition-colors w-fit pb-0.5">
                    معرض العمليات الميدانية
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Image panel (left in RTL): revealed, then slow drifting zoom like the reference video */}
            <motion.div
              initial={{ clipPath: 'inset(0 0 0 100%)' }}
              animate={{ clipPath: 'inset(0 0 0 0%)' }}
              transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
              className="relative overflow-hidden rounded-b-2xl lg:rounded-b-none lg:rounded-l-2xl min-h-[46vh] order-1 lg:order-2"
            >
              <motion.div style={{ y: heroImgY }} className="absolute inset-0 -top-[10%] h-[120%]">
                <motion.img
                  initial={{ scale: 1.18 }}
                  animate={{ scale: [1.18, 1.06, 1.14] }}
                  transition={{ duration: 24, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
                  src={heroShipBg}
                  alt="أسطول الشحن البحري التجاري"
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Key figures */}
          <div className="bg-[#f7f7f1] text-[#082f28] mt-2 sm:mt-3 rounded-b-2xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-x-reverse divide-[#082f28]/10">
            {keyStats.map((stat, idx) => (
              <div key={idx} className="p-5 sm:p-7 text-center md:text-right">
                <CountUp
                  to={stat.to}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  className="text-xl sm:text-3xl font-light font-mono block mb-1"
                />
                <strong className="text-xs font-medium text-[#082f28] block">{stat.label}</strong>
                <span className="text-[11px] text-[#a77a1c] block mt-0.5">{stat.sub}</span>
              </div>
            ))}
          </div>
        </section>

        <ProductsMarquee />

        {/* 1. باقة التملك الاستثماري (شقة + سيارة + حصة شركة) */}
        <InvestmentOpportunity />

        {/* 2. أسطول النقل البحري (الباخرة أوشن ستار 33,000 طن) */}
        <MaritimeVesselSection />

        {/* 3. توريد السكر الأبيض النقي ICUMSA 45 وشهادة الفحص */}
        <SugarCommoditySection />

        {/* 4. قطاع زيوت دوار الشمس الصافية (عبوات وجالونات وحاويات) */}
        <EdibleOilsSection />

        {/* 5. معرض العمليات والمستودعات وسلاسل الإمداد الميدانية */}
        <OperationsGallery />

        <JourneySection />

        {/* 6. الموانئ واللوجستيات */}
        <section className="py-20 bg-[#eceee6] text-[#082f28] border-b border-[#082f28]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-[#a77a1c] uppercase tracking-wider block">
                البنية اللوجستية والمحطات
              </span>
              <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-[#082f28]">
                تغطية ملاحية وميدانية متكاملة
              </h2>
              <p className="text-[#566a63] text-xs sm:text-sm">
                تواجد مستمر بالمستودعات ورصيف الشحن عبر موانئ الإسكندرية، دمياط، بورسعيد، والسخنة، وميناء باراناغوا بالبرازيل.
              </p>
            </div>

            <div className="mb-12 rounded-2xl border border-[#082f28]/10 bg-white p-4 sm:p-8">
              <RouteLine />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="shine bg-white border border-[#082f28]/10 rounded-2xl p-6 shadow-md"
              >
                <Ship className="w-9 h-9 text-[#a77a1c] mb-3" />
                <h3 className="font-bold text-lg text-[#082f28] mb-2">أرصفة موانئ الإسكندرية ودمياط</h3>
                <p className="text-[#34483f] text-xs sm:text-sm leading-relaxed">
                  مناولة الحاويات وبضائع الصب، وإنهاء إجراءات الفحص والجمارك ونظام نافذة ACI مع رصد لحظي للشحنات.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="shine bg-white border border-[#082f28]/10 rounded-2xl p-6 shadow-md"
              >
                <Calendar className="w-9 h-9 text-[#a77a1c] mb-3" />
                <h3 className="font-bold text-lg text-[#082f28] mb-2">التقويم التصديري والزراعي</h3>
                <p className="text-[#34483f] text-xs sm:text-sm leading-relaxed">
                  مصفوفة تفاعلية لمواسم الحصاد والتصدير للموالح والتمور والبصل والفراولة المجمدة مع شحنات السكر والزيوت.
                </p>
                <a href="/calendar/" className="text-xs font-bold text-[#a77a1c] hover:underline mt-3 inline-block">
                  استعراض التقويم التصديري ←
                </a>
              </motion.div>


            </div>

          </div>
        </section>

        <WaveDivider />

        {/* 7. قسم التواصل المباشر */}
        <section id="contact" className="py-24 -mt-px bg-[#082f28] text-[#f7f7f1]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
            <span className="text-xs tracking-widest text-[#e2bc55] block">
              التواصل المباشر
            </span>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight leading-tight">
              فريقنا جاهز للرد على استفساراتكم
            </h2>
            <p className="text-[#b6c8c0] text-sm sm:text-base max-w-xl mx-auto leading-loose font-light">
              للاستفسار عن باقة التملك الاستثماري، الاستثمار في أسطول النقل البحري، أو طلب عروض أسعار السكر والزيوت.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
              <a href="tel:+201011944092" className="bg-[#082f28] hover:bg-[#0e3b32] p-6 transition-colors" dir="ltr">
                <Phone className="w-5 h-5 text-[#e2bc55] mx-auto mb-3" />
                <span className="text-xs text-[#8ea59c] block">هاتف 1</span>
                <span className="text-sm font-mono text-white">00201011944092</span>
              </a>
              <a href="tel:+201038122116" className="bg-[#082f28] hover:bg-[#0e3b32] p-6 transition-colors" dir="ltr">
                <Phone className="w-5 h-5 text-[#e2bc55] mx-auto mb-3" />
                <span className="text-xs text-[#8ea59c] block">هاتف 2</span>
                <span className="text-sm font-mono text-white">00201038122116</span>
              </a>
              <a href="mailto:donovamotors@gmail.com" className="bg-[#082f28] hover:bg-[#0e3b32] p-6 transition-colors">
                <Mail className="w-5 h-5 text-[#e2bc55] mx-auto mb-3" />
                <span className="text-xs text-[#8ea59c] block">البريد الإلكتروني</span>
                <span className="text-sm font-sans text-white">donovamotors@gmail.com</span>
              </a>
            </div>

            <div>
              <a
                href="/contact/"
                className="inline-flex items-center gap-2 bg-[#8f6612] hover:bg-[#6f4f0f] text-white font-bold text-sm px-8 py-4 rounded-full transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>إرسال طلب استفسار رسمي أو تسعير شحنة</span>
              </a>
            </div>
          </div>
        </section>

      </>
  );
}

const NotFoundPage: React.FC = () => (
  <section className="py-24 bg-[#f7f7f1]">
    <div className="max-w-xl mx-auto px-4 text-center space-y-5">
      <p className="font-mono text-sm text-[#a77a1c]" dir="ltr">404</p>
      <h1 className="text-3xl text-[#082f28]">الصفحة المطلوبة غير موجودة</h1>
      <p className="text-[#34483f] leading-loose">ربما تغيّر الرابط أو كُتب بشكل غير صحيح. يمكنكم العودة للرئيسية أو التواصل معنا مباشرة.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a href="/" className="px-6 py-3 rounded-full bg-[#8f6612] hover:bg-[#6f4f0f] text-white text-sm font-bold transition-colors">العودة للرئيسية</a>
        <a href="/contact" className="px-6 py-3 rounded-full border border-[#082f28]/15 text-[#082f28] text-sm font-medium hover:border-[#a77a1c] transition-colors">التواصل معنا</a>
      </div>
    </div>
  </section>
);

const PAGES: Record<string, React.ComponentType> = {
  '/products': ProductsPage,
  '/about': AboutPage,
  '/calendar': CalendarPage,
  '/contact': ContactPage,
  '/track': TrackPage,
};

export default function App() {
  const { path } = useLocation();
  const { scrollYProgress } = useScroll();
  useScrollReveal(path);
  const lang = useLang();
  const Page = path === '/' ? undefined : (PAGES[path] ?? NotFoundPage);
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // per-page <title>, description, canonical, Open Graph
  useEffect(() => { applySeo(path, lang); }, [path, lang]);

  // after in-app navigation move keyboard / screen-reader focus to the new content
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (!window.location.hash) mainRef.current?.focus({ preventScroll: true });
  }, [path]);

  return (
    <MotionConfig reducedMotion="user">
    <Preloader />
    <div className="min-h-screen flex flex-col bg-[#f7f7f1] text-[#082f28] font-['Cairo',sans-serif] selection:bg-[#a77a1c] selection:text-white">

      {/* Scroll Progress Bar at very top */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-1 bg-[#a77a1c] z-50 origin-right"
      />

      <a
        href="#main"
        onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); mainRef.current?.scrollIntoView(); }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-[100] focus:bg-[#a77a1c] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
      >
        تخطَّ إلى المحتوى الرئيسي
      </a>

      <Navbar currentPath={path} onNavigate={goTo} />

      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        {Page ? <Page key={path} /> : <HomeContent />}
      </main>

      {/* Clean Footer */}
      <Footer onNavigate={goTo} />

      <BackToTop />
      <QuoteBar enabled={path === '/'} />

      {/* Clean Floating WhatsApp Button */}
      <aside className="fixed bottom-6 left-6 z-50 wa-pulse">
        <motion.a 
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          href="https://wa.me/201011944092" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white px-4 py-3 rounded-full font-bold text-xs sm:text-sm shadow-md transition-colors"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span>تواصل واتساب</span>
        </motion.a>
      </aside>

    </div>
    </MotionConfig>
  );
}
