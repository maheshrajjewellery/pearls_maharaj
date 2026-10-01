import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const luxuryEase = [0.16, 1, 0.3, 1] as const;

interface CraftStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const craftSteps: CraftStep[] = [
  {
    number: '01',
    title: 'SELECT',
    subtitle: 'Curating Nature’s Finest',
    description: 'Each pearl is individually appraised by hand for spherical symmetry, immaculate skin quality, and radiant natural luster.',
    image: 'https://images.pexels.com/photos/6766733/pexels-photo-6766733.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    number: '02',
    title: 'DESIGN',
    subtitle: 'Architectural Balance',
    description: 'Master artisans draft classical proportions with contemporary lines, creating balanced silhouettes that endure.',
    image: 'https://images.pexels.com/photos/6263070/pexels-photo-6263070.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    number: '03',
    title: 'CRAFT',
    subtitle: 'Hand-Forged Precision',
    description: 'Precious metals are hand-forged and gems are set with patient precision, honoring centuries of goldsmithing heritage.',
    image: 'https://images.pexels.com/photos/33102017/pexels-photo-33102017.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    number: '04',
    title: 'POLISH',
    subtitle: 'Mirror Luminescence',
    description: 'Multi-stage hand finishing achieves a deep, reflective surface that illuminates the warmth of gold and pearls.',
    image: 'https://images.pexels.com/photos/30557505/pexels-photo-30557505.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    number: '05',
    title: 'PERFECT',
    subtitle: 'Heirloom Integrity',
    description: 'Microscopic inspection and rigorous balance checks ensure every finished creation meets exacting heirloom standards.',
    image: 'https://images.pexels.com/photos/955525/pexels-photo-955525.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
];

export default function AboutHeritageCraft() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const prefersReduced = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth scroll mapping for desktop horizontal track
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-60%']);

  return (
    <section
      ref={containerRef}
      className="relative bg-cocoa-300 text-pearlIvory-50 select-none overflow-hidden"
      style={{ height: prefersReduced ? 'auto' : '150vh' }}
      aria-label="Heritage and Craftsmanship"
    >
      <div
        ref={inViewRef}
        className={`${
          prefersReduced ? 'relative py-24 sm:py-32' : 'sticky top-0 h-screen min-h-[640px] max-h-[920px]'
        } w-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20`}
      >
        {/* Ambient background glow & subtle craft backdrop */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <img
            src="https://images.pexels.com/photos/6263146/pexels-photo-6263146.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Atelier bench background"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cocoa-300 via-cocoa-300/80 to-cocoa-300" />
        </div>

        {/* Ambient radial lighting */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(200, 169, 107, 0.12) 0%, rgba(41, 35, 31, 0) 70%)',
          }}
        />

        <div className="relative z-10 max-w-[1700px] mx-auto w-full">
          {/* Header Block: Two column layout for headline and supporting text */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end pb-8 sm:pb-12 border-b border-champagne-300/20">
            
            {/* Left: Heading */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: luxuryEase }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="h-px w-6 bg-champagne-300" />
                <p className="text-champagne-300 text-[11px] sm:text-[12px] font-sans font-medium tracking-[0.1em] uppercase">
                  MAHARAJ ATELIER
                </p>
              </motion.div>

              <h2 className="font-serif text-pearlIvory-50 text-[clamp(36px,5.5vw,68px)] font-normal leading-[0.98] tracking-[0.01em]">
                {['CRAFT', 'MEETS', 'HERITAGE.'].map((word, i) => (
                  <span key={word} className="block overflow-hidden">
                    <motion.span
                      className="block"
                      initial={{ opacity: 0, y: prefersReduced ? 0 : 36 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: luxuryEase }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h2>
            </div>

            {/* Right: Supporting Text */}
            <div className="lg:col-span-5">
              <motion.p
                initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.4, ease: luxuryEase }}
                className="text-pearlIvory-300/80 text-[15px] sm:text-[16px] lg:text-[17px] font-sans font-normal leading-[1.7] max-w-[480px]"
              >
                From selecting the right pearl to refining every detail, jewellery is shaped through patience, precision and care.
              </motion.p>
            </div>

          </div>

          {/* HORIZONTAL EDITORIAL SEQUENCE */}
          {prefersReduced ? (
            /* Accessible / Mobile Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-10">
              {craftSteps.map((step) => (
                <div
                  key={step.number}
                  className="bg-cocoa-400/50 p-5 rounded-[2px] border border-champagne-300/20"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-[2px] mb-4">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-serif text-champagne-300 text-3xl font-normal block mb-1">
                    {step.number}
                  </span>
                  <h3 className="font-serif text-pearlIvory-50 text-xl font-normal tracking-wide mb-1">
                    {step.title}
                  </h3>
                  <p className="text-champagne-300/80 text-[11px] font-sans font-medium tracking-[0.08em] uppercase mb-2">
                    {step.subtitle}
                  </p>
                  <p className="text-pearlIvory-300/70 text-xs font-sans font-normal leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            /* Cinematic Horizontal Scroll Track */
            <div className="mt-10 sm:mt-12 overflow-hidden">
              <motion.div
                style={{ x }}
                className="flex gap-6 lg:gap-8 will-change-transform"
              >
                {craftSteps.map((step, index) => (
                  <div
                    key={step.number}
                    onClick={() => setActiveStep(index)}
                    className="flex-shrink-0 w-[82vw] sm:w-[46vw] lg:w-[28vw] xl:w-[22vw] max-w-[360px] group cursor-pointer"
                  >
                    {/* Image block with thin champagne border & number badge */}
                    <div className="relative aspect-[16/11] overflow-hidden rounded-[2px] mb-5 border border-champagne-300/25 shadow-[0_8px_24px_rgba(0,0,0,0.4)] bg-cocoa-400">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-cocoa-300/80 via-transparent to-transparent" />
                      
                      {/* Number Overlay */}
                      <span className="absolute top-3 left-4 font-serif text-champagne-100 text-3xl font-normal drop-shadow-sm">
                        {step.number}
                      </span>
                    </div>

                    {/* Thin champagne dividing line */}
                    <div className="w-full h-px bg-champagne-300/30 mb-4 group-hover:bg-champagne-300 transition-colors duration-300" />

                    {/* Step Title & Details */}
                    <div className="flex flex-col">
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="font-serif text-pearlIvory-50 text-2xl font-normal tracking-wide group-hover:text-champagne-200 transition-colors duration-300">
                          {step.title}
                        </h3>
                        <span className="text-[10px] font-sans font-medium tracking-[0.08em] text-champagne-300 uppercase">
                          {step.subtitle}
                        </span>
                      </div>
                      <p className="text-pearlIvory-300/70 text-[13px] font-sans font-normal leading-relaxed mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          )}

          {/* Sub-indicator */}
          {!prefersReduced && (
            <div className="flex items-center justify-between pt-8 mt-4 border-t border-champagne-300/10 text-xs font-sans text-champagne-300/60 font-normal tracking-[0.1em] uppercase">
              <span>Sequence 01 — 05</span>
              <span className="hidden sm:inline">Scroll to navigate the craft journey</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
