import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface HeroSlide {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  imageDesktop: string;
  imageMobile: string;
  ctaText: string;
  ctaLink: string;
  imagePosition: string;
  alt: string;
}

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'slide-01',
    number: '01',
    title: 'MAHARAJ JEWELLERY',
    subtitle: 'The Purest Pearl Elegance',
    description: 'Rare South Sea, Akoya, and Tahitian pearls crafted into timeless heirlooms by master artisans.',
    imageDesktop: '/images/pearl-banner.png',
    imageMobile: '/images/pearl-banner-mobile.png',
    ctaText: 'EXPLORE THE COLLECTION',
    ctaLink: '/shop',
    imagePosition: 'center center',
    alt: 'Maharaj Jewellery Pearl Collection - Elegant South Asian woman in layered pearls',
  },
  {
    id: 'slide-02',
    number: '02',
    title: 'ROYAL HERITAGE',
    subtitle: 'South Sea Pearl Strands',
    description: 'Hand-selected golden and white South Sea pearls set in 18K gold fittings.',
    imageDesktop: '/images/pearl-banner.png',
    imageMobile: '/images/pearl-banner-mobile.png',
    ctaText: 'DISCOVER SOUTH SEA',
    ctaLink: '/shop?category=saltwater',
    imagePosition: 'center center',
    alt: 'South Sea Pearl Jewellery Banner',
  },
  {
    id: 'slide-03',
    number: '03',
    title: 'THE BRIDAL EDIT',
    subtitle: 'Sacred Bridal Heirloom Collection',
    description: 'Ornate pearl chokers, layered necklaces, and matching earrings crafted for unforgettable moments.',
    imageDesktop: '/images/pearl-banner.png',
    imageMobile: '/images/pearl-banner-mobile.png',
    ctaText: 'EXPLORE BRIDAL',
    ctaLink: '/shop?category=bridal',
    imagePosition: 'center center',
    alt: 'Royal Pearl Heritage Collection',
  },
];

const SLIDE_DURATION = 4500; // 4.5 seconds

export default function Hero() {
  const { setCurrentPage, setCategory, cmsData } = useShop();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReduced = useReducedMotion();

  const heroCMS = cmsData?.homepage?.hero;
  const cmsSlides = cmsData?.homepage?.heroSlides;

  // Active Published Hero Slides from CMS
  const activeSlides: HeroSlide[] = useMemo(() => {
    if (cmsSlides && cmsSlides.length > 0) {
      const filtered = cmsSlides
        .filter((s) => s.isActive && s.status === 'Published')
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

      if (filtered.length > 0) {
        return filtered.map((slide, index) => ({
          id: slide.id,
          number: String(index + 1).padStart(2, '0'),
          title: slide.title || 'MAHARAJ JEWELLERY',
          subtitle: slide.subtitle || 'The Purest Pearl Elegance',
          description: slide.description || 'Rare South Sea, Akoya, and Tahitian pearls crafted into timeless heirlooms.',
          imageDesktop: slide.imageUrl || '/images/pearl-banner.png',
          imageMobile: slide.mobileImageUrl || slide.imageUrl || '/images/pearl-banner-mobile.png',
          ctaText: slide.ctaText || 'EXPLORE THE COLLECTION',
          ctaLink: slide.ctaLink || '/shop',
          imagePosition: slide.imagePosition || 'center center',
          alt: `${slide.title} - ${slide.subtitle}`,
        }));
      }
    }
    return defaultHeroSlides;
  }, [cmsSlides]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset index if slides list changes
  useEffect(() => {
    if (currentIndex >= activeSlides.length) {
      setCurrentIndex(0);
    }
  }, [activeSlides.length, currentIndex]);

  // Auto-advance photo sequence
  useEffect(() => {
    if (prefersReduced || isPaused || activeSlides.length <= 1) return;

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, prefersReduced, activeSlides.length]);

  const handleIndicatorClick = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(index);
  };

  const handleExploreClick = (linkPath: string) => {
    if (linkPath.includes('category=')) {
      const cat = linkPath.split('category=')[1] as any;
      setCurrentPage('shop');
      setCategory(cat);
    } else if (linkPath.startsWith('/about')) {
      setCurrentPage('about');
    } else {
      setCurrentPage('shop');
      setCategory('all');
    }
    window.history.pushState({}, '', linkPath || '/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (heroCMS && heroCMS.active === false) return null;

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];
  const heroImage = isMobile ? currentSlide.imageMobile : currentSlide.imageDesktop;

  return (
    <section
      className="relative w-full h-[80vh] sm:h-[84vh] lg:h-[88vh] min-h-[580px] max-h-[900px] bg-[#30372F] overflow-hidden select-none flex flex-col justify-between"
      aria-label="Maharaj Jewellery Cinematic Hero Campaign"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. CINEMATIC AUTO-SEQUENCE PHOTO CONTAINER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide.id + currentIndex}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{
              opacity: 1,
              scale: prefersReduced ? 1 : 1.05,
            }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{
              opacity: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
              scale: { duration: SLIDE_DURATION / 1000 + 0.5, ease: 'linear' },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={heroImage}
              alt={currentSlide.alt}
              className="w-full h-full object-cover"
              style={{ objectPosition: isMobile ? '80% center' : currentSlide.imagePosition }}
              fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('/images/pearl-banner.png')) {
                  target.src = '/images/pearl-banner.png';
                }
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle overlay gradient: Keeps woman & pearls illuminated while protecting text readability on left */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(90deg, rgba(12, 9, 7, 0.45) 0%, rgba(12, 9, 7, 0.15) 50%, rgba(12, 9, 7, 0) 85%)',
          }}
        />
      </div>

      {/* 2. OPTIONAL VERTICAL EDITORIAL SIDE STAMP (Desktop) */}
      <div className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-white/40 font-light [writing-mode:vertical-rl] rotate-180">
          MAHARAJ / PEARL COLLECTION 2026
        </p>
      </div>

      {/* 3. HERO CONTENT BLOCK (BOTTOM LEFT, MAX WIDTH 480px DESKTOP / 300px MOBILE) */}
      <div className="relative z-20 w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-8 flex-1 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-[320px] sm:max-w-[440px] lg:max-w-[500px] text-left">
          {/* Eyebrow */}
          <motion.div
            key={`title-${currentSlide.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-2"
          >
            <span className="h-px w-6 bg-[#C5A15A]" />
            <span className="text-[#C5A15A] text-[10.5px] sm:text-[11px] font-sans font-medium tracking-[0.1em] uppercase">
              {currentSlide.title}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            key={`heading-${currentSlide.id}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif font-normal text-white text-clamp-hero tracking-[0.01em] leading-[0.98] sm:leading-[1.02] mb-3 sm:mb-4"
          >
            {currentSlide.subtitle}
          </motion.h1>

          {/* Body Text */}
          <motion.p
            key={`desc-${currentSlide.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/85 font-sans font-normal text-clamp-body leading-relaxed mb-6 sm:mb-8"
          >
            "{currentSlide.description}"
          </motion.p>

          {/* CTA Link */}
          <motion.div
            key={`cta-${currentSlide.id}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={() => handleExploreClick(currentSlide.ctaLink)}
              className="group inline-flex items-center gap-3 text-white hover:text-[#C5A15A] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase transition-colors duration-300 focus:outline-none min-touch-target cursor-pointer"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1.5 transition-transform duration-300 text-[#C5A15A]"
              />
            </button>
          </motion.div>
        </div>
      </div>

      {/* 4. HERO BOTTOM PROGRESS INDICATOR (01 ━━━━━━━ 02 03 04) */}
      <div className="relative z-20 w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pb-6 sm:pb-8 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 sm:gap-5">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => handleIndicatorClick(idx)}
                className="group flex items-center gap-2 py-2 focus:outline-none cursor-pointer text-left min-touch-target"
                aria-label={`Go to slide ${slide.number}`}
              >
                <span
                  className={`font-sans text-[11px] tracking-wider transition-colors duration-300 ${
                    isActive ? 'text-[#C5A15A] font-semibold' : 'text-white/40 group-hover:text-white/80'
                  }`}
                >
                  {slide.number}
                </span>

                {/* Animated Gold Progress Line for active slide */}
                <div className="relative w-7 sm:w-10 h-[1.5px] bg-white/20 overflow-hidden rounded-full">
                  {isActive ? (
                    <motion.div
                      key={`progress-${idx}-${currentIndex}`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{
                        duration: SLIDE_DURATION / 1000,
                        ease: 'linear',
                      }}
                      className="absolute left-0 top-0 bottom-0 bg-[#C5A15A]"
                    />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-white/50 font-light">
            SCROLL
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-5 bg-gradient-to-b from-[#C5A15A] to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
