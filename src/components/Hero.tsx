import { useState, useEffect, useRef } from 'react';
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
  alt: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 'slide-01',
    number: '01',
    title: 'MAHARAJ JEWELLERY',
    subtitle: 'A STUDY IN PEARLS',
    description: 'Exceptional pearls, thoughtfully crafted into timeless jewellery.',
    imageDesktop: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imageMobile: 'https://images.pexels.com/photos/922567/pexels-photo-922567.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Pearl necklace close-up on model',
  },
  {
    id: 'slide-02',
    number: '02',
    title: 'MAHARAJ JEWELLERY',
    subtitle: 'A STUDY IN PEARLS',
    description: 'Exceptional pearls, thoughtfully crafted into timeless jewellery.',
    imageDesktop: 'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imageMobile: 'https://images.pexels.com/photos/9428790/pexels-photo-9428790.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Baroque pearl drop earrings',
  },
  {
    id: 'slide-03',
    number: '03',
    title: 'MAHARAJ JEWELLERY',
    subtitle: 'A STUDY IN PEARLS',
    description: 'Exceptional pearls, thoughtfully crafted into timeless jewellery.',
    imageDesktop: 'https://images.pexels.com/photos/8408374/pexels-photo-8408374.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imageMobile: 'https://images.pexels.com/photos/8408374/pexels-photo-8408374.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'South Sea pearl bracelet accent',
  },
  {
    id: 'slide-04',
    number: '04',
    title: 'MAHARAJ JEWELLERY',
    subtitle: 'A STUDY IN PEARLS',
    description: 'Exceptional pearls, thoughtfully crafted into timeless jewellery.',
    imageDesktop: 'https://images.pexels.com/photos/25389117/pexels-photo-25389117.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imageMobile: 'https://images.pexels.com/photos/30780337/pexels-photo-30780337.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Bridal pearl jewellery creation',
  },
  {
    id: 'slide-05',
    number: '05',
    title: 'MAHARAJ JEWELLERY',
    subtitle: 'A STUDY IN PEARLS',
    description: 'Exceptional pearls, thoughtfully crafted into timeless jewellery.',
    imageDesktop: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imageMobile: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Pearls resting on silk luxury fabric',
  },
  {
    id: 'slide-06',
    number: '06',
    title: 'MAHARAJ JEWELLERY',
    subtitle: 'A STUDY IN PEARLS',
    description: 'Exceptional pearls, thoughtfully crafted into timeless jewellery.',
    imageDesktop: 'https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imageMobile: 'https://images.pexels.com/photos/10681031/pexels-photo-10681031.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Editorial portrait showcasing pearl heirloom',
  },
];

const SLIDE_DURATION = 4500; // 4.5 seconds

export default function Hero() {
  const { setCurrentPage, setCategory } = useShop();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const prefersReduced = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance photo sequence
  useEffect(() => {
    if (prefersReduced || isPaused) return;

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, prefersReduced]);

  const handleIndicatorClick = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(index);
  };

  const handleExploreClick = () => {
    setCurrentPage('shop');
    setCategory('all');
    window.history.pushState({}, '', '/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSlide = heroSlides[currentIndex];

  return (
    <section
      className="relative w-full h-[80vh] sm:h-[84vh] lg:h-[88vh] min-h-[580px] max-h-[900px] bg-[#171412] overflow-hidden select-none flex flex-col justify-between"
      aria-label="Maharaj Jewellery Cinematic Hero Campaign"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. CINEMATIC AUTO-SEQUENCE PHOTO CONTAINER */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{
              opacity: 1,
              scale: prefersReduced ? 1 : 1.06,
            }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{
              opacity: { duration: 1.5, ease: [0.25, 1, 0.5, 1] },
              scale: { duration: SLIDE_DURATION / 1000 + 0.5, ease: 'linear' },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={isMobile ? currentSlide.imageMobile : currentSlide.imageDesktop}
              alt={currentSlide.alt}
              className="w-full h-full object-cover object-center"
              fetchPriority="high"
            />
          </motion.div>
        </AnimatePresence>

        {/* Soft Vignette & Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171412]/85 via-[#171412]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-full sm:w-1/2 bg-gradient-to-r from-[#171412]/60 to-transparent pointer-events-none" />
      </div>

      {/* 2. OPTIONAL VERTICAL EDITORIAL SIDE STAMP (Desktop) */}
      <div className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-white/40 font-light [writing-mode:vertical-rl] rotate-180">
          MAHARAJ / PEARL COLLECTION 2026
        </p>
      </div>

      {/* 3. HERO CONTENT BLOCK (BOTTOM LEFT, MAX WIDTH 480px DESKTOP / 300px MOBILE) */}
      <div className="relative z-20 w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pt-8 flex-1 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-[300px] sm:max-w-[420px] lg:max-w-[480px] text-left">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-2"
          >
            <span className="h-px w-6 bg-[#B79A5A]" />
            <span className="text-[#B79A5A] text-[10.5px] sm:text-[11px] font-sans font-medium tracking-[0.1em] uppercase">
              {currentSlide.title}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif font-normal text-white text-clamp-hero tracking-[0.01em] leading-[0.98] sm:leading-[1.02] mb-3 sm:mb-4"
          >
            {currentSlide.subtitle}
          </motion.h1>

          {/* Body Text */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/85 font-sans font-normal text-clamp-body leading-relaxed mb-6 sm:mb-8"
          >
            "{currentSlide.description}"
          </motion.p>

          {/* CTA Link */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={handleExploreClick}
              className="group inline-flex items-center gap-3 text-white hover:text-[#B79A5A] text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase transition-colors duration-300 focus:outline-none min-touch-target cursor-pointer"
            >
              <span>EXPLORE COLLECTION</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1.5 transition-transform duration-300 text-[#B79A5A]"
              />
            </button>
          </motion.div>
        </div>
      </div>

      {/* 4. HERO BOTTOM PROGRESS INDICATOR (01 ━━━━━━━ 02 03 04 05 06) */}
      <div className="relative z-20 w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 pb-6 sm:pb-8 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 sm:gap-5">
          {heroSlides.map((slide, idx) => {
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
                    isActive ? 'text-[#B79A5A] font-semibold' : 'text-white/40 group-hover:text-white/80'
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
                      className="absolute left-0 top-0 bottom-0 bg-[#B79A5A]"
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
            className="w-px h-5 bg-gradient-to-b from-[#B79A5A] to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
